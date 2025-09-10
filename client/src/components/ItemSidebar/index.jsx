// ItemSidebar.js
import React, { memo } from "react";
import icons from "@/utils/icons";
import { Link, useSearchParams } from "react-router-dom";
import { formatVietnameseToString } from "@/utils/formatVietNameseToString";
import clsx from "clsx";

const { GrFormNext } = icons;

const ItemSidebar = ({ title, content, isDouble = false }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Xử lý sự kiện khi nhấp vào bộ lọc
    const handleFilterClick = (code) => {
        const newSearchParams = new URLSearchParams(searchParams);

        // Xác định loại bộ lọc (priceCode hoặc areaCode, hoặc none cho categories)
        const filterType = title === "Xem theo giá" ? "priceCode" : title === "Xem theo diện tích" ? "areaCode" : null;

        if (filterType) {
            // Nếu chọn "Tất cả" (code === null) thì xóa bộ lọc
            if (code === null) {
                newSearchParams.delete(filterType);
            } else {
                newSearchParams.set(filterType, code);
            }
            // Reset về trang 1 khi thay đổi bộ lọc
            newSearchParams.set("page", "1");
            setSearchParams(newSearchParams);
        }
        // Không làm gì nếu là danh mục (categories), vì sẽ dùng Link
    };

    return (
        <div className="p-4 rounded-md bg-white w-full">
            <h3 className="text-sm font-semibold mb-4">{title}</h3>

            {/* Layout cho danh mục (1 cột, dùng Link) */}
            {title === "Danh mục cho thuê" && !isDouble && (
                <div className="flex flex-col gap-2">
                    {content?.length > 0 &&
                        content.map((item) => (
                            <Link
                                to={`/${formatVietnameseToString(item.value)}`}
                                key={item.code}
                                className={clsx(
                                    "flex items-center cursor-pointer hover:text-orange-500 border-b border-gray-200 pb-1 border-dashed",
                                    searchParams.get("categoryCode") === item.code && "text-orange-500 font-medium",
                                )}
                            >
                                <GrFormNext color="#aaa" />
                                <p className="text-sm">{item.value}</p>
                            </Link>
                        ))}
                </div>
            )}

            {/* Layout cho giá và diện tích (2 cột hoặc 1 cột, dùng button) */}
            {(title === "Xem theo giá" || title === "Xem theo diện tích") && (
                <div className={clsx("grid gap-2", { "grid-cols-2": isDouble, "grid-cols-1": !isDouble })}>
                    {content?.length > 0 &&
                        content.map((item) => (
                            <button
                                key={item.code}
                                onClick={() => handleFilterClick(item.code)}
                                className={clsx(
                                    "flex items-center cursor-pointer hover:text-orange-500 border-b border-gray-200 pb-1 border-dashed",
                                    searchParams.get(title === "Xem theo giá" ? "priceCode" : "areaCode") ===
                                        item.code && "text-orange-500 font-medium",
                                )}
                            >
                                <GrFormNext color="#aaa" />
                                <p className="text-sm">{item.value}</p>
                            </button>
                        ))}
                    <button
                        onClick={() => handleFilterClick(null)}
                        className={clsx(
                            "flex items-center cursor-pointer hover:text-orange-500 border-b border-gray-200 pb-1 border-dashed",
                            !searchParams.get(title === "Xem theo giá" ? "priceCode" : "areaCode") &&
                                "text-orange-500 font-medium",
                        )}
                    >
                        <GrFormNext color="#aaa" />
                        <p className="text-sm">Tất cả</p>
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(ItemSidebar);
