//Header index.jsx
import Button from "@/components/Button";
import { path } from "@/utils/constant";
import icons from "@/utils/icons";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { logout as logoutService } from "@/services/authService";
import Navigation from "../Navigation";
import styles from "./Header.module.scss";

const { CiCirclePlus, CiUser, CiLogout } = icons;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy thông tin từ Redux store
    const { user, isAuthenticated, isLoggedIn } = useSelector((state) => state.auth);
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
                    <small>Phòng trọ giá rẻ</small>

                    {/* Hiển thị khi chưa đăng nhập */}
                    {!isAuthenticated && !isLoggedIn && (
                        <>
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
                    {(isAuthenticated || isLoggedIn) && user && (
                        <>
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
                                <CiUser className="text-lg text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Xin chào, {user.name || user.email}
                                </span>
                            </div>
                            <Button
                                text={"Đăng xuất"}
                                textColor="text-white"
                                bgColor="bg-red-500 hover:bg-red-600"
                                isIcons={CiLogout}
                                onClick={handleLogout}
                            />
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
