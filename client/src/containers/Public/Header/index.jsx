//Header index.jsx
import Button from "@/components/Button";
import { path } from "@/utils/constant";
import icons from "@/utils/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { logout as logoutService } from "@/services/authService";
import Navigation from "../Navigation";
import styles from "./Header.module.scss";
import quanlytaikhoan from "@/utils/quanlytaikhoan";
import { RiLogoutCircleRLine } from "react-icons/ri";
import CurrentUser from "@/components/CurrentUser";

const { CiCirclePlus, CiUser, BsChevronDown } = icons;

const Header = () => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Ref để tham chiếu đến dropdown menu
    const dropdownRef = useRef(null);

    // Hook xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShowMenu(false);
            }
        };
        // Chỉ add event listener khi menu đang mở
        if (isShowMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        // Cleanup function
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isShowMenu]);

    // Lấy thông tin từ Redux store
    const { profileUser, isAuthenticated, isLoggedIn } = useSelector((state) => state.auth);
    const goLogin = useCallback(() => {
        navigate(path.LOGIN);
    }, [navigate]);

    const goRegister = useCallback(() => {
        navigate(path.REGISTER);
    }, [navigate]);

    // Hàm xử lý đăng xuất
    const handleLogout = useCallback(async () => {
        // Hiển thị confirm dialog
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");

        if (!confirmLogout) {
            return; // Người dùng không muốn đăng xuất
        }

        try {
            // Gọi API đăng xuất
            await logoutService();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Dù API có lỗi hay không vẫn clear local state
            dispatch(logout());
            navigate("/");
        }
    }, [dispatch, navigate]);

    const toggleMenu = useCallback(() => {
        setIsShowMenu((prev) => !prev);
    }, []);

    return (
        <div className="w-full bg-white mb-3">
            <div className={`mx-auto flex items-center justify-between ${(styles.border_bottom, styles.header)}`}>
                <Link to={"/"}>
                    <img
                        src="https://phongtro123.com/images/logo-phongtro.svg"
                        alt="logo"
                        className="w-[240px] h-[70px] object-container"
                    />
                </Link>

                <div className="flex items-center gap-2">
                    {/* Hiển thị khi chưa đăng nhập */}
                    {!isAuthenticated && !isLoggedIn && (
                        <>
                            <small>Phòng trọ 123, xin chào</small>
                            <Button
                                text={"Đăng nhập"}
                                textColor="text-white"
                                bgColor="bg-[#3961fb]"
                                onClick={goLogin}
                            />
                            <Button
                                text={"Đăng ký"}
                                textColor="text-white"
                                bgColor="bg-[#3961fb]"
                                onClick={goRegister}
                            />
                        </>
                    )}

                    {/* Hiển thị khi đã đăng nhập */}
                    {(isAuthenticated || isLoggedIn) && profileUser && (
                        <>
                            {/* <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md realtive">
                                <CiUser className="text-lg text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Xin chào, {profileUser.name || profileUser.email}
                                </span>
                            </div> */}

                            <CurrentUser />
                            <div className="relative" ref={dropdownRef}>
                                <Button
                                    text={"Quản lý tài khoản"}
                                    textColor="text-white"
                                    bgColor="bg-red-500 hover:bg-red-600"
                                    isIcons={BsChevronDown}
                                    onClick={toggleMenu}
                                />

                                {isShowMenu && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden z-50 min-w-[220px] backdrop-blur-sm">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
                                        {quanlytaikhoan.map((item) => {
                                            return (
                                                <Link
                                                    onClick={() => setIsShowMenu(false)}
                                                    key={item?.id}
                                                    to={item?.path}
                                                    className="group block px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 ease-in-out border-b border-gray-50 last:border-b-0 text-sm font-medium relative overflow-hidden"
                                                >
                                                    <div className="flex items-center gap-3 relative z-10">
                                                        {/* Icon placeholder - bạn có thể thay thế bằng icon thật */}
                                                        {/* <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors duration-200"></div> */}
                                                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                                                            {item?.icon}
                                                            {item?.text}
                                                        </span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-0"></div>
                                                </Link>
                                            );
                                        })}
                                        <div className="w-full flex items-center justify-center py-2 pb-3">
                                            <Button
                                                text={"Đăng xuất"}
                                                textColor="text-white"
                                                bgColor="bg-red-500 hover:bg-red-600"
                                                isIcons={RiLogoutCircleRLine}
                                                onClick={() => {
                                                    setIsShowMenu(false);
                                                    handleLogout();
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <Button
                        text={"Đăng tin mới"}
                        textColor="text-white"
                        bgColor="bg-secondary2"
                        isIcons={CiCirclePlus}
                    />
                </div>
            </div>
            <Navigation />
        </div>
    );
};

export default Header;
