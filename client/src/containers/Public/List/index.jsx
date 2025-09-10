// src/containers/Public/List/index.jsx
import clsx from "clsx";
import styles from "./List.module.scss";
import Items from "@/components/Items";
import { MessageSquareOff } from "lucide-react";
import Pagination from "@/containers/Public/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchPostsLimit, clearError } from "@/features/posts/postSlice";

const List = ({ categoryCode }) => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { paginatedPosts, pagination, loading, error } = useSelector((state) => state.posts);

    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    const priceCodeFromUrl = searchParams.get("priceCode") || null;
    const areaCodeFromUrl = searchParams.get("areaCode") || null;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const limit = 10;

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);

    useEffect(() => {
        dispatch(
            fetchPostsLimit({
                page: currentPage,
                limit,
                priceCode: priceCodeFromUrl,
                areaCode: areaCodeFromUrl,
                categoryCode,
            }),
        );
    }, [dispatch, currentPage, priceCodeFromUrl, areaCodeFromUrl, categoryCode]);

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

    return (
        <div className={clsx("w-full p-2 shadow-md bg-white rounded-md")}>
            <div className="flex items-center justify-between my-3">
                <h4 className="text-xl font-semibold">Danh sách tin đăng</h4>
                <span className="text-sm">Cập nhật: 12:09 25/08/2025</span>
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
                        <p className="text-gray-500 text-lg">Không có bài viết nào</p>
                        <div className="flex items-center justify-center">
                            <MessageSquareOff />
                        </div>
                        <p className="text-gray-400 text-sm mt-2">Vui lòng thử lại sau hoặc thay đổi bộ lọc</p>
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
