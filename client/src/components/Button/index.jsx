import { memo } from "react";

const Button = ({ text, textColor, bgColor, isIcons: Icon, onClick }) => {
    console.log("re-render");
    return (
        <button
            type="button"
            className={`py-2 px-4 flex items-center gap-2 ${textColor} ${bgColor} outline-none rounded-md hover:underline cursor-pointer`}
            onClick={onClick}
        >
            {text}
            {Icon && <Icon size={20} />}
        </button>
    );
};

export default memo(Button);
