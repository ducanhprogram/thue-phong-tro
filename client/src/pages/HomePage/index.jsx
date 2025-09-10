import Province from "@/components/Province";
import styles from "./HomePage.module.scss";
import clsx from "clsx";
import List from "@/containers/Public/List";
import ItemSidebar from "@/components/ItemSidebar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchPrices } from "@/features/app/appSlice";
import { fetchAreas } from "@/features/area/areaSlice";
import RelatedPost from "@/components/RelatedPost";

const HomePage = () => {
    const { categories, prices } = useSelector((state) => state.app);
    const { areas } = useSelector((state) => state.areas);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPrices());
        dispatch(fetchAreas());
    }, [dispatch]);
    return (
        <div className="w-full flex flex-col gap-3 mt-5">
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
                <div className={clsx(`flex flex-col flex-[3] justify-start items-center gap-4`)}>
                    <ItemSidebar content={categories} title="Danh mục cho thuê" isDouble={false} />
                    <ItemSidebar content={prices} title="Xem theo giá" isDouble={true} />
                    <ItemSidebar content={areas} title="Xem theo diện tích" isDouble={true} />
                    <RelatedPost />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
