// ManagePost.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import { deletePost, fetchPostsLimitAdmin } from "@/features/posts/postSlice";
import formatDateTime from "@/utils/formatDateTime";
import UpdatePost from "../UpdatePost";
import Swal from "sweetalert2";
import Pagination from "@/containers/Public/Pagination";

const ManagePost = () => {
    const dispatch = useDispatch();
    const { postsOfCurrent, loading, adminPagination } = useSelector((state) => state.posts);

    console.log(postsOfCurrent);

    // State cho modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    // State cho filter
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        dispatch(fetchPostsLimitAdmin({ page: adminPagination.currentPage, limit: adminPagination.limit }));
    }, [dispatch, adminPagination.currentPage, adminPagination.limit]);

    // Function để lọc posts theo trạng thái
    const getFilteredPosts = () => {
        if (!postsOfCurrent) return [];

        if (statusFilter === "") {
            return postsOfCurrent; // Hiển thị tất cả
        }

        return postsOfCurrent.filter((item) => {
            const isExpired = new Date(item?.overviews?.expired) < new Date();

            if (statusFilter === "active") {
                return !isExpired; // Chỉ hiển thị bài viết còn hoạt động
            } else if (statusFilter === "expired") {
                return isExpired; // Chỉ hiển thị bài viết hết hạn
            }

            return true;
        });
    };

    // Handle page change
    const handlePageChange = (page) => {
        dispatch(fetchPostsLimitAdmin({ page, limit: adminPagination.limit }));
    };

    // Xử lý mở modal edit
    const handleEditPost = (postData) => {
        setSelectedPost(postData);
        setIsModalOpen(true);
    };

    // Xử lý đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    // Xử lý xóa bài viết
    const handleDeletePost = async (postId) => {
        const foundPost = postsOfCurrent.find((item) => +item?.id === +postId);
        const maTin = foundPost?.overviews?.code;

        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa mã tin ${maTin}?`,
            text: "Bài viết này sẽ bị xóa vĩnh viễn và không thể khôi phục!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF5723",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deletePost(postId)).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Xóa thành công!",
                    text: "Bài viết đã được xóa.",
                    confirmButtonColor: "#FF5723",
                    timer: 2000,
                    timerProgressBar: true,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: error.message || "Không thể xóa bài viết. Vui lòng thử lại.",
                    confirmButtonColor: "#FF5723",
                });
            }
        }
    };

    // Xử lý thay đổi filter
    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Lấy danh sách đã lọc
    const filteredPosts = getFilteredPosts();

    return (
        <div className="bg-white relative">
            {/* Header */}
            <div className="py-6 px-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Quản lý tin đăng
                </h1>
                <div className="flex items-center gap-4">
                    <select
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className="outline-none border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[200px] font-medium"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="expired">Hết hạn</option>
                    </select>
                    {statusFilter && (
                        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border">
                            Hiển thị: <span className="font-semibold">{filteredPosts.length}</span> /{" "}
                            <span className="font-semibold">{adminPagination?.totalItems || 0}</span> bài viết
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải...</span>
                </div>
            )}

            {/* Table Container */}
            {!loading && (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                    <table className="w-full bg-white">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[100px]">
                                    Mã tin
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[120px]">
                                    Ảnh đại diện
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 flex-1 min-w-[250px]">
                                    Tiêu đề
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[140px]">
                                    Giá
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[140px]">
                                    Ngày bắt đầu
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[140px]">
                                    Ngày hết hạn
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[120px]">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-[120px]">
                                    Tùy chọn
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!filteredPosts || filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg
                                                className="w-16 h-16 mb-4 text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-400">
                                                {statusFilter
                                                    ? `Không có tin đăng ${
                                                          statusFilter === "active" ? "đang hoạt động" : "hết hạn"
                                                      }`
                                                    : "Chưa có tin đăng nào"}
                                            </p>
                                            <p className="text-sm text-gray-300 mt-1">
                                                {statusFilter
                                                    ? "Thử thay đổi bộ lọc hoặc tạo tin đăng mới"
                                                    : "Hãy tạo tin đăng đầu tiên của bạn"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts?.map((item, index) => {
                                    const isExpired = new Date(item?.overviews?.expired) < new Date();
                                    const isEven = index % 2 === 0;

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`${
                                                isEven ? "bg-white" : "bg-gray-50"
                                            } hover:bg-blue-50 transition-colors duration-200`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                        {item?.overviews?.code}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex-shrink-0 h-16 w-20">
                                                    <img
                                                        className="h-16 w-20 rounded-lg object-cover shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                                                        src={
                                                            JSON.parse(item?.images?.image)[0] ||
                                                            "/placeholder-image.jpg"
                                                        }
                                                        alt="avatar-post"
                                                        onError={(e) => {
                                                            e.target.src = "/placeholder-image.jpg";
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                                                    {item?.title || "Không có tiêu đề"}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">ID: {item?.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-green-600">
                                                    {item?.attributes?.price || "Chưa có giá"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDateTime(item?.overviews?.created) || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className={`text-sm font-medium ${
                                                        isExpired ? "text-red-600" : "text-gray-900"
                                                    }`}
                                                >
                                                    {formatDateTime(item?.overviews?.expired) || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                                        isExpired
                                                            ? "bg-red-100 text-red-800 border-red-200"
                                                            : "bg-green-100 text-green-800 border-green-200"
                                                    }`}
                                                >
                                                    {isExpired ? "Hết hạn" : "Hoạt động"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        text="Sửa"
                                                        bgColor="bg-green-500"
                                                        textColor="text-white"
                                                        onClick={() => handleEditPost(item)}
                                                        fontSize="text-xs"
                                                    />
                                                    <Button
                                                        text="Xóa"
                                                        bgColor="bg-red-500"
                                                        textColor="text-white"
                                                        onClick={() => handleDeletePost(item.id)}
                                                        fontSize="text-xs"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination - Chỉ hiện khi có dữ liệu gốc */}
            {postsOfCurrent && postsOfCurrent.length > 0 && (
                <div
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                        })
                    }
                    className="mt-2"
                >
                    <span>
                        Tổng{" "}
                        <span className="font-semibold">{adminPagination.totalItems || postsOfCurrent.length} </span>
                        bài viết
                    </span>
                    <Pagination
                        currentPage={adminPagination.currentPage}
                        totalPages={adminPagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* UpdatePost Modal */}
            <UpdatePost isOpen={isModalOpen} onClose={handleCloseModal} postData={selectedPost} />
        </div>
    );
};

export default ManagePost;
