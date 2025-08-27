// src/services/authService.js
import { post, get } from "@/utils/httpRequest";

// Đăng ký tài khoản mới
export const register = async (name, email, password) => {
    try {
        console.log("🚀 API Base URL:", import.meta.env.VITE_API_URL);
        const response = await post("/auth/register", {
            name,
            email,
            password,
        });
        console.log("Register response:", response);
        return response;
    } catch (error) {
        console.error("Register error:", error);
        throw error;
    }
};

// Đăng nhập
export const login = async (email, password) => {
    try {
        const response = await post("/auth/login", {
            email,
            password,
        });
        // Lưu token vào localStorage
        // if (response.accessToken && response.refreshToken) {
        //     localStorage.setItem("accessToken", response.accessToken);
        //     localStorage.setItem("refreshToken", response.refreshToken);
        // }
        if (response.data?.accessToken && response.data?.refreshToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        return response;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.response?.data?.error || error.message || "Đăng nhập thất bại";

        throw new Error(errorMessage);
    }
};

// Xác thực email
export const verifyEmail = async (token) => {
    try {
        const response = await post(`/auth/verify-email/${token}`);
        return response;
    } catch (error) {
        throw new Error(error.message || "Xác thực email thất bại");
    }
};

// Làm mới token
export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("Không tìm thấy refresh token");
        }
        const response = await post("/auth/refresh-token", {
            refreshToken: refreshToken,
        });
        // Cập nhật token mới vào localStorage
        if (response.accessToken && response.refreshToken) {
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
        }
        return response;
    } catch (error) {
        throw new Error(error.message || "Làm mới token thất bại");
    }
};

// Đăng xuất
export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await post("/auth/logout", {
            refreshToken: refreshToken,
        });
        // Xóa token khỏi localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return response;
    } catch (error) {
        throw new Error(error.message || "Đăng xuất thất bại");
    }
};

// Đăng xuất khỏi tất cả thiết bị
export const logoutAll = async () => {
    try {
        const response = await post("/auth/logout-all");
        // Xóa token khỏi localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return response;
    } catch (error) {
        throw new Error(error.message || "Đăng xuất tất cả thiết bị thất bại");
    }
};

// Lấy thông tin người dùng
export const getMe = async () => {
    try {
        const response = await get("/auth/me");
        return response;
    } catch (error) {
        throw new Error(error.message || "Lấy thông tin người dùng thất bại");
    }
};

// Gửi lại email xác thực
export const resendVerifyEmail = async (email) => {
    try {
        const response = await post("/auth/resend-verify-email", { email });
        return response;
    } catch (error) {
        throw new Error(error.message || "Gửi lại email xác thực thất bại");
    }
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
    try {
        const response = await post("/auth/forgot-password", { email });
        return response;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.response?.data?.error || error.message || "Gửi email thất bại";
        throw new Error(errorMessage);
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (token, password) => {
    try {
        const response = await post(`/auth/reset-password/${token}`, { password });
        return response;
    } catch (error) {
        throw new Error(error.message || "Đặt lại mật khẩu thất bại");
    }
};

// Đổi mật khẩu
export const changePassword = async (current_password, new_password) => {
    try {
        const response = await post("/auth/change-password", {
            current_password,
            new_password,
        });
        return response;
    } catch (error) {
        throw new Error(error.message || "Đổi mật khẩu thất bại");
    }
};
