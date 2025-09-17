import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// Component bảo vệ các route chỉ dành cho guest (chưa đăng nhập)
export const GuestRoute = ({ children }) => {
    const { isLoggedIn, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Component bảo vệ các route cần đăng nhập
export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isLoggedIn) {
        // Redirect về trang login và lưu trang hiện tại
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
