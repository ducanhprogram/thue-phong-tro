import clsx from "clsx";
import styles from "./Navigation.module.scss";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/features/app/appSlice";

const Navigation = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.app);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className={clsx(`w-full h-[40px] ${styles.container_navigation}`)}>
            <div className={clsx(`flex items-center gap-4 justify-center text-sm ${styles.navigation}`)}>
                {/* Trang chủ */}
                <div className={clsx(styles.link)}>
                    <NavLink to="/" className={({ isActive }) => clsx(isActive && styles.isActive)}>
                        Trang chủ
                    </NavLink>
                </div>

                {/* Hiển thị loading nếu đang tải */}
                {loading && (
                    <div className={clsx(styles.link)}>
                        <span>Đang tải...</span>
                    </div>
                )}

                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <div className={clsx(styles.link)}>
                        <span>Lỗi tải danh mục</span>
                    </div>
                )}

                {/* Hiển thị danh mục */}
                {!loading &&
                    !error &&
                    categories?.length > 0 &&
                    categories.map((item) => {
                        return (
                            <div key={item.code || item.id} className={clsx(styles.link)}>
                                <NavLink
                                    to={`/${item.slug}`}
                                    className={({ isActive }) => clsx(isActive && styles.isActive)}
                                >
                                    {item.value || item.name}
                                </NavLink>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Navigation;
