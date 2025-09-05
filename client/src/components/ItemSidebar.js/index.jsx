import React, { memo } from "react";
import icons from "@/utils/icons";
import { useSelector } from "react-redux";

const { GrFormNext } = icons;

const ItemSidebar = ({ title, content }) => {
    return (
        <div className="p-4 rounded-md bg-white w-full">
            <h3 className="text-sm font-semibold mb-4">{title}</h3>
            <div className="flex flex-col gap-2">
                {content?.length > 0 &&
                    content.map((item) => {
                        return (
                            <div
                                key={item.code}
                                className="flex items-center cursor-pointer hover:text-orange-500 border-b border-gray-200 pb-1 border-dashed"
                            >
                                <GrFormNext color="#aaa" />
                                <p className="text-sm">{item.value}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default memo(ItemSidebar);
