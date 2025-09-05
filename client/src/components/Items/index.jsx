import React, { memo } from "react";
import { Star, Phone } from "lucide-react";
import { getTimeAgo } from "@/utils/timeUtils";
import { useNavigate, Link } from "react-router-dom";

const Items = ({ images, user, title, star, description, attributes, address, createdAt, id }) => {
    const navigate = useNavigate();
    let parsedImages = [];
    let totalImagePost = [];

    try {
        parsedImages = typeof images === "string" ? JSON.parse(images) : images;
        totalImagePost = parsedImages;
        parsedImages = parsedImages.slice(0, 4); // Lấy 4 ảnh
    } catch (error) {
        console.error("Error parsing images:", error);
        parsedImages = [];
    }

    // Hàm tạo slug từ title để làm URL thân thiện
    const createSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    // Hàm điều hướng đến trang chi tiết
    const handleNavigateToDetail = () => {
        const titleSlug = createSlug(title);
        navigate(`/chi-tiet/${titleSlug}/${id}`);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-3 ">
            {/* Badge cho thuê nhanh */}
            <div className="relative">
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
                    CHO THUÊ NHANH
                </div>

                {/* Ảnh chính và gallery - Thêm onClick để điều hướng */}
                <div className="relative">
                    <div className="flex cursor-pointer" onClick={handleNavigateToDetail}>
                        {/* Ảnh chính */}
                        <div className="flex-1">
                            {parsedImages[0] && (
                                <img
                                    src={parsedImages[0]}
                                    alt="Ảnh chính"
                                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                />
                            )}
                        </div>

                        {/* Ảnh phụ */}
                        {parsedImages.length > 1 && (
                            <div className="w-48 flex flex-col">
                                {parsedImages[1] && (
                                    <img
                                        src={parsedImages[1]}
                                        alt="Ảnh phụ 1"
                                        className="w-full h-32 object-cover border-l border-b border-white hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                                <div className="flex h-32">
                                    {parsedImages[2] && (
                                        <img
                                            src={parsedImages[2]}
                                            alt="Ảnh phụ 2"
                                            className="w-1/2 h-full object-cover border-l border-r border-white hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                    {parsedImages[3] && (
                                        <img
                                            src={parsedImages[3]}
                                            alt="Ảnh phụ 3"
                                            className="w-1/2 h-full object-cover border-white hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Số lượng ảnh */}
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                        📷 {`${totalImagePost?.length}`}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, index) => (
                        <Star
                            key={index}
                            className={`w-4 h-4 ${
                                index < star ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                        />
                    ))}
                </div>

                {/* Tiêu đề - Thêm onClick để điều hướng */}
                <h3
                    className="text-lg font-semibold text-red-500 mb-2 uppercase cursor-pointer hover:text-red-600 transition-colors duration-200"
                    onClick={handleNavigateToDetail}
                >
                    {title}
                </h3>

                {/* Thông tin chi tiết */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="text-green-500 font-semibold">{attributes?.price}</span>
                    <span>{attributes?.acreage}</span>
                    <span>{`${address.split(",")[address.split(",").length - 2]}, ${
                        address.split(",")[address.split(",").length - 1]
                    }`}</span>
                </div>

                {/* Mô tả */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2 overflow-hidden">{description}</p>

                {/* Thông tin người đăng */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">👤</div>
                        <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{getTimeAgo(createdAt)}</p>
                        </div>
                    </div>

                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors">
                        <Phone className="w-4 h-4" />
                        {user?.phone}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(Items);
