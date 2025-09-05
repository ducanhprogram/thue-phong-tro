import clsx from "clsx";
import styles from "./ProvinceBtn.module.scss";
import { memo } from "react";

const location = [
    {
        id: 1,
        name: "Phòng trọ Hồ Chí Minh",
        image: "https://phongtro123.com/images/location_hcm.jpg",
    },
    {
        id: 2,
        name: "Phòng trọ Hà Nội",
        image: "https://phongtro123.com/images/location_hn.jpg",
    },
    {
        id: 3,
        name: "Phòng trọ Đà Nẵng",
        image: "https://phongtro123.com/images/location_dn.jpg",
    },
];

const ProvinceBtn = () => {
    return (
        <div className="flex gap-4 cursor-pointer ">
            {location.map((item) => (
                <div
                    key={item.id}
                    className={clsx(`shadow-md rounded-bl-md rounded-br-md text-blue-600 hover:text-orange-600`)}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-[190px] h-[110px] rounded-tl-md rounded-tr-md object-cover"
                    />
                    <div className={clsx(`font-medium  text-sm text-center pt-[10px] pb-[10px]`)}>{item.name}</div>
                </div>
            ))}
        </div>
    );
};

export default memo(ProvinceBtn);
