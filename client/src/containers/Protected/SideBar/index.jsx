import { useDispatch, useSelector } from "react-redux";
import menuSideBar from "@/utils/menuSideBar";
import { NavLink, useNavigate } from "react-router-dom";
import { logout as logoutService } from "@/services/authService";
import { logout } from "@/features/auth/authSlice";
import { useCallback } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";

const activeStyle = "hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 font-bold bg-gray-200";
const notActiceStyle = "hover:bg-gray-200 flex  rounded-md items-center gap-2 py-2 cursor-pointer";

const SideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profileUser } = useSelector((state) => state.auth);

    // Hàm xử lý đăng xuất
    const handleLogout = useCallback(async () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
        if (!confirmLogout) {
            return;
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
        <div className="w-[260px] flex-none p-4 h-full overflow-auto">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src=" https://phongtro123.com/images/default-user.svg"
                        alt="avatar"
                        className="w-10 h-10 object-cover rounded-full border-2 border-white"
                    />
                    <div className="flex flex-col justify-center ">
                        <span className="font-semibold">{profileUser?.name}</span>
                        <small>{profileUser?.email}</small>
                    </div>
                </div>
                <span>
                    Mã thành viên: <span className="font-medium">{profileUser?.id}</span>
                </span>
            </div>
            <div className="mt-5 flex flex-col gap-1">
                {menuSideBar.map((item) => {
                    return (
                        <NavLink
                            key={item.id}
                            to={item?.path}
                            className={({ isActive }) => (isActive ? activeStyle : notActiceStyle)}
                        >
                            {item?.icon}
                            {item?.text}
                        </NavLink>
                    );
                })}

                <div className={notActiceStyle} onClick={handleLogout}>
                    <RiLogoutCircleRLine /> Thoát
                </div>
            </div>
        </div>
    );
};

export default SideBar;
