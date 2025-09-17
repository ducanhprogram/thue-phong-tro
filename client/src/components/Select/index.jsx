//Select index.jsx - Updated with simple functions
import React, { memo } from "react";

const Select = ({ label, options, value, setValue, type, reset, name }) => {
    // Hàm xử lý thay đổi select
    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        if (!name) {
            setValue(selectedValue);
        } else {
            setValue((prev) => ({
                ...prev,
                [name]: selectedValue,
            }));
        }
    };

    return (
        <div className="flex flex-col gap-2 flex-1">
            <label className="font-medium" htmlFor="select-address">
                {label}
            </label>
            <select
                value={reset ? "" : value}
                onChange={handleSelectChange}
                id="select-address"
                className={`outline-none border border-gray-300 p-2 rounded-md w-full ${
                    value ? "font-medium text-gray-900" : "text-gray-400"
                }`}
            >
                <option value="" className="text-gray-400">
                    {`--Chọn ${label}--`}
                </option>
                {options?.map((item) => {
                    return (
                        <option
                            key={
                                type === "province"
                                    ? item?.province_id
                                    : type === "district"
                                    ? item?.district_id
                                    : item?.code
                            }
                            value={
                                type === "province"
                                    ? item?.province_id
                                    : type === "district"
                                    ? item?.district_id
                                    : item?.code
                            }
                            className="font-medium text-gray-900"
                        >
                            {type === "province"
                                ? item?.province_name
                                : type === "district"
                                ? item?.district_name
                                : item?.value}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default memo(Select);
