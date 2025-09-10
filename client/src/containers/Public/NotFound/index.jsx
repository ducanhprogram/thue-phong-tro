import { Link } from "react-router-dom";
import config from "@/config";

function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
            <div className="text-center">
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-9xl md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl md:text-[200px] font-bold text-white opacity-10 blur-sm">
                        404
                    </div>
                </div>

                {/* Error Message */}
                <div className="mt-8 mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-bounce">
                        Oops! Trang không tồn tại
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-2">
                        Trang bạn đang tìm kiếm không thể được tìm thấy
                    </p>
                    <p className="text-md text-gray-400">Có thể link đã bị thay đổi hoặc trang đã bị xóa</p>
                </div>

                {/* Animated Icons */}
                <div className="flex justify-center space-x-4 mb-8">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                        className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                </div>

                {/* Back to Home Button */}
                <Link
                    to={config.routes.home}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
                >
                    <svg
                        className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Quay về trang chủ
                </Link>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-20 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                <div
                    className="absolute bottom-20 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-ping"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div className="absolute top-1/2 left-10 w-8 h-8 bg-indigo-500 rounded-full opacity-30 animate-pulse"></div>
                <div
                    className="absolute top-1/3 right-10 w-12 h-12 bg-pink-500 rounded-full opacity-20 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                ></div>

                {/* Floating Stars */}
                <div
                    className="absolute top-10 left-1/4 text-yellow-400 animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                >
                    ⭐
                </div>
                <div
                    className="absolute top-32 right-1/4 text-yellow-400 animate-bounce"
                    style={{ animationDelay: "1.5s" }}
                >
                    ✨
                </div>
                <div
                    className="absolute bottom-32 left-1/3 text-yellow-400 animate-bounce"
                    style={{ animationDelay: "2s" }}
                >
                    💫
                </div>
            </div>
        </div>
    );
}

export default NotFound;
