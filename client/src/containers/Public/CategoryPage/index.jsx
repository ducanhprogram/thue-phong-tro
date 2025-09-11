// CategoryPage/index.jsx
import ItemSidebar from "@/components/ItemSidebar";
import Province from "@/components/Province";
import RelatedPost from "@/components/RelatedPost";
import List from "@/containers/Public/List";
import { fetchPrices } from "@/features/app/appSlice";
import { fetchAreas } from "@/features/area/areaSlice";
import { fetchProvinces } from "@/features/province/provinceSlice";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const { categories, prices } = useSelector((state) => state.app);
    const { areas } = useSelector((state) => state.areas);

    const dispatch = useDispatch();

    // Tìm category dựa trên slug từ URL
    const currentCategory = useMemo(() => {
        return categories.find((cat) => cat.slug === categorySlug);
    }, [categories, categorySlug]);

    useEffect(() => {
        dispatch(fetchPrices());
        dispatch(fetchAreas());
    }, [dispatch]);

    console.log(categories);
    // Nếu không tìm thấy category, có thể redirect hoặc show 404
    if (categories.length > 0 && !currentCategory) {
        return (
            <div className="w-full text-center py-10">
                <h1 className="text-2xl font-bold text-red-500">Không tìm thấy danh mục</h1>
                <p className="text-gray-500">Vui lòng kiểm tra lại đường dẫn</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3 mt-5">
            <div className={clsx()}>
                <h1 className={clsx(`text-[28px] font-bold`)}>{currentCategory?.header || "Đang tải..."}</h1>
                <p className={clsx(`text-sm text-gray-700`)}>
                    {currentCategory?.subheader || "Đang tải thông tin danh mục..."}
                </p>
            </div>
            <Province />
            <div className={clsx(`w-full flex gap-4`)}>
                <div className={clsx(`flex-[7]`)}>
                    <List categoryCode={currentCategory?.code} />
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

export default CategoryPage;
