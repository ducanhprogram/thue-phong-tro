import { memo } from "react";

const Button = ({ text, textColor, bgColor, isIcons: Icon, onClick, fontSize, disabled = false }) => {
    return (
        <button
            type="button"
            className={`py-2 px-4 flex items-center justify-center gap-1 ${textColor} ${bgColor} ${fontSize} outline-none rounded-md hover:underline cursor-pointer
                ${disabled ? "opacity-50 cursor-not-allowed hover:no-underline" : "hover:underline cursor-pointer"}
            `}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
            {Icon && <Icon size={16} />}
        </button>
    );
};

export default memo(Button);
