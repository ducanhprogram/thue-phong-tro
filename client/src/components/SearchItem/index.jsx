import clsx from "clsx";
import { memo } from "react";
import styles from "./SearchItem.module.scss";

const SearchItem = ({ IconBefore, IconAfter, text, fontWeight, onClick, defaultText }) => {
    return (
        <div
            className={clsx(
                `bg-white py-2 px-4 w-full rounded-md text-gray-400 flex items-center justify-between cursor-pointer`,
            )}
            onClick={onClick}
        >
            <div className={clsx(`flex items-center gap-1`)}>
                {IconBefore}
                <span
                    className={clsx(
                        `${(styles.text, fontWeight && "font-medium text-black")} ${
                            text ? "font-medium text-black" : ""
                        }`,
                    )}
                >
                    {text || defaultText}
                </span>
            </div>
            {IconAfter && <span className="text-sm">{IconAfter}</span>}
        </div>
    );
};

export default memo(SearchItem);
