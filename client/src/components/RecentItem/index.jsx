import React from "react";

const RecentItem = ({ title, price, image, createdAt }) => {
    return (
        <div className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors">
            {/* Image container with overlay for "MỚI" badge */}
            <div className="relative flex-shrink-0">
                <img className="w-[70px] h-[60px] object-cover rounded-md" src={image} alt="" />
                <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded">MỚI</div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 w-full">
                <h4 className="text-[14px] text-blue-600 line-clamp-2 mb-2 leading-tight">{`${title?.slice(
                    0,
                    40,
                )}...`}</h4>
                <div className="flex items-center justify-between text-sm w-full">
                    <span className="font-semibold text-green-500 text-[12px]">{price}</span>
                    <span className="text-gray-500 text-xs">{createdAt}</span>
                </div>
            </div>
        </div>
    );
};

export default RecentItem;
