//InputFormV2 index.jsx - Updated with Debounce
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const InputFormV2 = ({ label, unit, value, setValue, name, small }) => {
    const [localValue, setLocalValue] = useState(value || "");

    const debouncedValue = useDebounce(localValue, 1000);

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    useEffect(() => {
        if (debouncedValue !== value) {
            setValue((prev) => ({
                ...prev,
                [name]: debouncedValue,
            }));
        }
    }, [debouncedValue, setValue, name, value]);

    // Hàm xử lý thay đổi input (chỉ cập nhật local state)
    const handleInputChange = (e) => {
        setLocalValue(e.target.value);
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="flex">
                <input
                    type="text"
                    id={name}
                    name={name}
                    className={`
                        flex-1 px-3 py-2 text-sm
                        border border-gray-300 bg-white
                        outline-none 
                        focus:border-blue-400 focus:shadow-sm
                        hover:border-gray-400
                        ${unit ? "rounded-l-md border-r-0" : "rounded-md"}
                        transition-all duration-200 ease-in-out
                    `}
                    value={localValue}
                    onChange={handleInputChange}
                    placeholder={`Nhập ${label.toLowerCase()}`}
                />
                {unit && (
                    <div
                        className="
                        flex items-center justify-center
                        px-3 py-2 min-w-[60px]
                        bg-gray-50 border border-gray-300 border-l-0
                        rounded-r-md text-sm font-medium text-gray-600
                    "
                    >
                        {unit}
                    </div>
                )}
            </div>
            {small && <small className="text-xs text-gray-400">{small}</small>}
        </div>
    );
};

export default InputFormV2;
