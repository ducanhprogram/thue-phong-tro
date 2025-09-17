// ProtectedNavigation/index.jsx
import clsx from "clsx";
import styles from "./ProtectedNavigation.module.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import quanlytaikhoan from "@/utils/quanlytaikhoan";
import CurrentUser from "@/components/CurrentUser";

const ProtectedNavigation = () => {
    const { profileUser } = useSelector((state) => state.auth);

    return (
        <div className={clsx(`w-full ${styles.container_navigation}`)}>
            {/* Navigation tabs */}
            <div className={clsx(styles.navigation_tabs)}>
                <div className={clsx(styles.tabs_container, "flex")}>
                    <Link to="/">
                        <div className="flex justify-center items-center font-bold text-[#105acc] mr-20 text-xl">
                            Phongtro123.com
                        </div>
                    </Link>
                    {quanlytaikhoan.map((item) => {
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) => clsx(styles.tab_item, isActive && styles.active_tab)}
                            >
                                <span className={clsx(styles.tab_icon)}>{item.icon}</span>
                                <span className={clsx(styles.tab_text)}>{item.text}</span>
                            </NavLink>
                        );
                    })}
                    <div className="ml-3">
                        <CurrentUser />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProtectedNavigation;
