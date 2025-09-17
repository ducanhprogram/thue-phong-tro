// SearchResult.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SearchResult = ({ categoryCode, hasSearched }) => {
    const [searchParams] = useSearchParams();
    const { categories, prices } = useSelector((state) => state.app);
    const { provinces } = useSelector((state) => state.provinces);
    const { areas } = useSelector((state) => state.areas);
    const { pagination } = useSelector((state) => state.posts);

    // Lấy các giá trị từ URL params
    const priceCode = searchParams.get("priceCode");
    const areaCode = searchParams.get("areaCode");
    const provinceCode = searchParams.get("provinceCode");

    // Kiểm tra xem có filter nào được áp dụng không
    const hasActiveFilters = () => {
        return priceCode || areaCode || provinceCode || categoryCode;
    };

    // Chỉ hiển thị khi đã thực hiện tìm kiếm hoặc có filter từ URL
    if (!hasSearched && !hasActiveFilters()) {
        return null;
    }

    // Tìm thông tin chi tiết từ code
    const getCategoryInfo = () => {
        if (categoryCode) {
            const category = categories?.find((cat) => cat.code === categoryCode);
            return category ? category.value : "Tất cả";
        }
        return "Tất cả";
    };

    const getProvinceInfo = () => {
        if (provinceCode) {
            const province = provinces?.find((prov) => prov.code === provinceCode);
            return province ? province.name || province.value : null;
        }
        return null;
    };

    const getPriceInfo = () => {
        if (priceCode) {
            const price = prices?.find((p) => p.code === priceCode);
            return price ? price.value : null;
        }
        return null;
    };

    const getAreaInfo = () => {
        if (areaCode) {
            const area = areas?.find((a) => a.code === areaCode);
            return area ? area.value : null;
        }
        return null;
    };

    // Tạo text mô tả kết quả tìm kiếm
    const generateSearchResultText = () => {
        const categoryInfo = getCategoryInfo();
        const provinceInfo = getProvinceInfo();
        const priceInfo = getPriceInfo();
        const areaInfo = getAreaInfo();

        let resultText = "Cho thuê ";

        // Thêm thông tin category
        if (categoryInfo && categoryInfo !== "Tất cả") {
            resultText += categoryInfo.toLowerCase();
        } else {
            resultText += "tất cả";
        }

        // Thêm thông tin tỉnh thành
        if (provinceInfo) {
            resultText += ` tại ${provinceInfo}`;
        }

        // Thêm thông tin giá
        if (priceInfo) {
            resultText += ` giá ${priceInfo.toLowerCase()}`;
        }

        // Thêm thông tin diện tích
        if (areaInfo) {
            resultText += ` diện tích ${areaInfo.toLowerCase()}`;
        }

        return resultText;
    };

    // Nếu không có filter nào được áp dụng, hiển thị text mặc định
    if (!hasActiveFilters()) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-800 mb-2">Cho thuê tất cả</h1>
                        <p className="text-sm text-blue-600">
                            {pagination?.totalCount ? `Tìm thấy ${pagination.totalCount} kết quả` : ""}
                        </p>
                    </div>
                    <div className="text-blue-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <h1 className="text-2xl font-bold text-green-800 mb-2 capitalize">{generateSearchResultText()}</h1>
                    <p className="text-sm text-green-600 mb-3">
                        {pagination?.totalCount ? `Tìm thấy ${pagination.totalCount} kết quả` : ""}
                    </p>

                    {/* Hiển thị các filter đang active dưới dạng tags */}
                    <div className="flex flex-wrap gap-2">
                        {categoryCode && getCategoryInfo() !== "Tất cả" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                📍 {getCategoryInfo()}
                            </span>
                        )}
                        {getProvinceInfo() && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                📍 {getProvinceInfo()}
                            </span>
                        )}
                        {getPriceInfo() && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                💰 {getPriceInfo()}
                            </span>
                        )}
                        {getAreaInfo() && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                                📐 {getAreaInfo()}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-green-500 ml-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
