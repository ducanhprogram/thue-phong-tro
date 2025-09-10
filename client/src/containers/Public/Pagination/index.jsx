import React, { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNumber from "@/components/PageNumber";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Tạo mảng số trang để hiển thị
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Số trang tối đa hiển thị

        if (totalPages <= maxVisiblePages) {
            // Nếu tổng số trang <= 5, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Logic phức tạp hơn cho nhiều trang
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            // Điều chỉnh để luôn có 5 trang (nếu có thể)
            if (endPage - startPage < 4) {
                if (startPage === 1) {
                    endPage = Math.min(totalPages, startPage + 4);
                } else {
                    startPage = Math.max(1, endPage - 4);
                }
            }

            // Thêm trang đầu và dấu "..." nếu cần
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push("...");
                }
            }

            // Thêm các trang ở giữa
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Thêm dấu "..." và trang cuối nếu cần
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push("...");
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page !== "..." && page !== currentPage) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) return null;

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
            {/* Nút "Trang trước" */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer"
                }`}
            >
                <ChevronLeft className="w-4 h-4" />« Trang trước
            </button>

            {/* Số trang */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer  ${
                                page === currentPage
                                    ? "bg-[#FF5723] text-white"
                                    : "bg-white text-gray-700 hover:bg-[#ffdccc] border border-gray-300"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Nút "Trang sau" */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300  cursor-pointer"
                }`}
            >
                Trang sau »
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default memo(Pagination);
