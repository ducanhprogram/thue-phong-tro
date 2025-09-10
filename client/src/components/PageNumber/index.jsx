import { memo } from "react";

const PageNumber = ({ number, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(number)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? "bg-[#E13427] text-white"
                    : "bg-white text-gray-700 hover:bg-[#E13427] hover:text-white border border-gray-300"
            }`}
        >
            {number}
        </button>
    );
};

export default memo(PageNumber);
