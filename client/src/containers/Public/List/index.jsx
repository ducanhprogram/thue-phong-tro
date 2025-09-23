// src/containers/Public/List/index.jsx
import clsx from "clsx";
import styles from "./List.module.scss";
import Items from "@/components/Items";
import SearchResult from "@/components/SearchResult";
import { MessageSquareOff } from "lucide-react";
import Pagination from "@/containers/Public/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPostsLimit, clearError } from "@/features/posts/postSlice";
import { useCallback } from "react";
import formatDateTime from "@/utils/formatDateTime";

const List = ({ categoryCode }) => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { posts, paginatedPosts, pagination, loading, error } = useSelector((state) => state.posts);
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    const priceCodeFromUrl = searchParams.get("priceCode") || null;
    const areaCodeFromUrl = searchParams.get("areaCode") || null;
    const provinceCodeFromUrl = searchParams.get("provinceCode") || null;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [hasSearched, setHasSearched] = useState(false);
    const limit = 10;

    // Kiểm tra xem có filter nào được áp dụng không
    const hasActiveFilters = useCallback(() => {
        return priceCodeFromUrl || areaCodeFromUrl || provinceCodeFromUrl;
    }, [priceCodeFromUrl, areaCodeFromUrl, provinceCodeFromUrl]);

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);

    useEffect(() => {
        // Chỉ set hasSearched = true khi có filter hoặc đã fetch data
        if (hasActiveFilters() || categoryCode) {
            setHasSearched(true);
        }

        dispatch(
            fetchPostsLimit({
                page: currentPage,
                limit,
                priceCode: priceCodeFromUrl,
                areaCode: areaCodeFromUrl,
                provinceCode: provinceCodeFromUrl,
                categoryCode,
            }),
        );
    }, [dispatch, currentPage, priceCodeFromUrl, areaCodeFromUrl, provinceCodeFromUrl, categoryCode, hasActiveFilters]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const newSearchParams = new URLSearchParams(searchParams);
        if (page === 1) {
            newSearchParams.delete("page");
        } else {
            newSearchParams.set("page", page.toString());
        }
        setSearchParams(newSearchParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Hàm clear tất cả filters
    const handleClearAllFilters = () => {
        const newSearchParams = new URLSearchParams();
        setSearchParams(newSearchParams);
        setCurrentPage(1);
        setHasSearched(false);
    };

    return (
        <div className={clsx("w-full p-2 shadow-md bg-white rounded-md")}>
            {/* Hiển thị title mặc định hoặc kết quả tìm kiếm */}
            {!hasSearched && !hasActiveFilters() ? (
                <div className="mb-6"></div>
            ) : (
                <SearchResult categoryCode={categoryCode} hasSearched={hasSearched} />
            )}

            <div className="flex items-center justify-between my-3">
                <h4 className="text-xl font-semibold">Danh sách tin đăng</h4>
                <div className="flex items-center gap-3">
                    {hasActiveFilters() && (
                        <button
                            onClick={handleClearAllFilters}
                            className="text-sm text-red-500 hover:text-red-700 underline"
                        >
                            Xóa bộ lọc
                        </button>
                    )}

                    <span className="text-sm text-gray-500">
                        Cập nhật: {formatDateTime(posts[posts.length - 1]?.createdAt)}
                    </span>
                </div>
            </div>

            <div className={clsx(`flex items-center gap-2 ${styles.list_post}`)}>
                <span>Sắp xếp: </span>
                <button className={clsx("bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors")}>
                    Mặc định
                </button>
                <button className={clsx("bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors")}>
                    Mới nhất
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E13427]"></div>
                    <span className="ml-2">Đang tải...</span>
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 bg-red-50 p-4 rounded-md my-4">
                    <p>Lỗi: {error.message}</p>
                    <button
                        className="text-blue-500 underline mt-2 hover:text-blue-700"
                        onClick={() => dispatch(clearError())}
                    >
                        Thử lại
                    </button>
                </div>
            )}

            <div className="items">
                {!loading && paginatedPosts?.length > 0 ? (
                    paginatedPosts.map((item) => (
                        <Items
                            key={item.id}
                            address={item?.address}
                            attributes={item?.attributes}
                            description={JSON.parse(item?.description)}
                            images={item?.images.image}
                            star={+item?.star}
                            title={item?.title}
                            user={item?.user}
                            createdAt={item?.createdAt}
                            id={item?.id}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        />
                    ))
                ) : !loading && paginatedPosts?.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">Không có bài viết nào phù hợp với tìm kiếm</p>
                        <div className="flex items-center justify-center mt-2">
                            <MessageSquareOff className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            Vui lòng thử lại với các tiêu chí khác hoặc{" "}
                            <button
                                onClick={handleClearAllFilters}
                                className="text-blue-500 hover:text-blue-700 underline"
                            >
                                xóa bộ lọc
                            </button>
                        </p>
                    </div>
                ) : null}
            </div>

            {!loading && pagination?.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default List;
