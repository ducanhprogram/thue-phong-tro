import { useDispatch, useSelector } from "react-redux";
import menuSideBar from "@/utils/menuSideBar";
import { NavLink, useNavigate } from "react-router-dom";
import { logout as logoutService } from "@/services/authService";
import { logout } from "@/features/auth/authSlice";
import { clearProfile } from "@/features/users/userSlice";
import { useCallback, useEffect, useState } from "react";
import { RiLogoutCircleRLine, RiMore2Fill, RiShieldStarLine } from "react-icons/ri";
import { fetchUserProfile } from "@/features/users/userSlice";

const SideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profileUser } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.user);
    const [showTooltip, setShowTooltip] = useState(null);

    // Lấy thông tin profile khi component mount
    useEffect(() => {
        if (profileUser && !profile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, profileUser, profile]);

    const currentUser = profileUser;

    // Hàm xử lý đăng xuất
    const handleLogout = useCallback(async () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
        if (!confirmLogout) {
            return;
        }
        try {
            await logoutService();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            dispatch(clearProfile());
            dispatch(logout());
            navigate("/");
        }
    }, [dispatch, navigate]);

    // Enhanced styles with gradients and shadows
    const activeStyle = `
        relative flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-xl 
        bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold
        shadow-lg shadow-blue-500/25 transform scale-105 transition-all duration-200
        before:absolute before:inset-0 before:rounded-xl before:bg-white before:opacity-10
    `;

    const notActiveStyle = `
        relative flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-xl
        text-gray-700 font-medium hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100
        hover:text-gray-900 hover:shadow-md transition-all duration-200 cursor-pointer
        hover:transform hover:translate-x-1 group
    `;

    const logoutStyle = `
        relative flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-xl
        text-red-600 font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100
        hover:text-red-700 hover:shadow-md transition-all duration-200 cursor-pointer
        hover:transform hover:translate-x-1 group
    `;

    return (
        <div className="w-[280px] flex-none h-full bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200 shadow-sm">
            {/* Header với user info */}
            <div className="p-6 border-b border-gray-100">
                {/* User Profile Card */}
                <div className="relative bg-gradient-to-br rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={currentUser?.avatar || "https://phongtro123.com/images/default-user.svg"}
                                alt="avatar"
                                className="w-14 h-14 object-cover rounded-full border-3 border-white shadow-md ring-2 ring-gray-100"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg truncate mb-1">{currentUser?.name}</h3>
                            <p className="text-gray-500 text-sm truncate flex items-center gap-1">
                                <span className="bg-gray-400 rounded-full"></span>
                                {currentUser?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Member ID Badge */}
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RiShieldStarLine className="text-blue-600" size={16} />
                            <span className="text-sm font-medium text-blue-800">Mã thành viên</span>
                        </div>
                        <span className="text-blue-600 font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm">
                            {currentUser?.id}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 py-4 overflow-y-auto">
                <nav className="space-y-1">
                    {menuSideBar.map((item) => {
                        return (
                            <div key={item.id} className="relative">
                                <NavLink
                                    to={item?.path}
                                    className={({ isActive }) => (isActive ? activeStyle : notActiveStyle)}
                                    onMouseEnter={() => setShowTooltip(item.id)}
                                    onMouseLeave={() => setShowTooltip(null)}
                                >
                                    <span className="flex-shrink-0 text-xl">{item?.icon}</span>
                                    <span className="truncate">{item?.text}</span>

                                    {/* Subtle arrow for active items */}
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </NavLink>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Footer với logout button */}
            <div className="p-4 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-transparent">
                <button onClick={handleLogout} className={logoutStyle}>
                    <RiLogoutCircleRLine size={20} />
                    <span>Đăng xuất</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default SideBar;
