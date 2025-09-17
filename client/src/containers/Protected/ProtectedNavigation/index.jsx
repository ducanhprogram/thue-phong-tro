import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/features/app/appSlice";
import CurrentUser from "@/components/CurrentUser";

const ProtectedNavigation = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.app);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <nav className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>

            {/* Main navigation container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-14 space-x-1">
                    <Link to={"/"} className="text-xl text-white mr-auto ">
                        Phongtro123.com
                    </Link>
                    {/* Home Link */}
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                isActive
                                    ? "bg-white text-purple-600 shadow-md"
                                    : "text-white hover:bg-white/20 hover:text-white"
                            }`
                        }
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span>Trang chủ</span>
                        </div>
                    </NavLink>
                    {/* Loading State */}
                    {loading && (
                        <div className="px-4 py-2 text-white/80 text-sm font-medium flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                            <span>Đang tải...</span>
                        </div>
                    )}
                    {/* Error State */}
                    {error && (
                        <div className="px-4 py-2 text-red-200 text-sm font-medium flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Lỗi tải danh mục</span>
                        </div>
                    )}
                    {/* Category Links */}
                    {!loading &&
                        !error &&
                        categories?.length > 0 &&
                        categories.map((item, index) => (
                            <NavLink
                                key={item.code || item.id || index}
                                to={`/${item.slug}`}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                        isActive
                                            ? "bg-white text-purple-600 shadow-md"
                                            : "text-white hover:bg-white/20 hover:text-white"
                                    }`
                                }
                            >
                                <span className="relative">
                                    {item.value || item.name}
                                    {/* Active indicator */}
                                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                </span>
                            </NavLink>
                        ))}
                    <div className="ml-auto">
                        <CurrentUser transparent={true} />
                    </div>
                </div>
            </div>

            {/* Bottom shadow */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-indigo-500/50"></div>
        </nav>
    );
};

export default ProtectedNavigation;
