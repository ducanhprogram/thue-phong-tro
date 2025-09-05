import Province from "@/components/Province";
import styles from "./HomePage.module.scss";
import clsx from "clsx";
import List from "@/containers/Public/List";
import ItemSidebar from "@/components/ItemSidebar.js";
import { useSelector } from "react-redux";

const HomePage = () => {
    const { categories } = useSelector((state) => state.app);

    return (
        <div className=" w-full flex flex-col gap-3 mt-5">
            <div className={clsx()}>
                <h1 className={clsx(`text-[28px] font-bold`)}>Kênh thông tin Phòng Trọ số 1 Việt Nam</h1>
                <p className={clsx(`text-sm text-gray-700`)}>
                    Kênh thông tin Phòng Trọ số 1 Việt Nam - Website đăng tin cho thuê phòng tro, nhà nguyên căn, căn
                    hộ, ở ghép nhanh, hiệu quả với 100.000+ tin đăng và 2.500.000 lượt xem mỗi tháng.
                </p>
            </div>
            <Province />
            <div className={clsx(`w-full flex gap-4`)}>
                <div className={clsx(`flex-[7]`)}>
                    <List />
                </div>
                <div
                    className={clsx(`flex flex-col flex-[3] justify-start items-center gap-4 border border-green-500`)}
                >
                    <ItemSidebar content={categories} title="Danh mục cho thuê" />
                    <ItemSidebar title="Xem theo giá" />
                    <ItemSidebar title="Xem theo diện tích" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
