// src/services/userService.js
import { get, put, post } from "@/utils/httpRequest";

// Lấy thông tin profile của user hiện tại
export const getProfile = async () => {
    try {
        const response = await get("/users/profile");
        return response;
    } catch (error) {
        console.error("Get profile error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy thông tin profile thất bại";
        throw new Error(errorMessage);
    }
};

// Cập nhật thông tin profile
export const updateProfile = async (profileData) => {
    try {
        const response = await put("/users/update-profile", profileData);
        return response;
    } catch (error) {
        console.error("Update profile error:", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Cập nhật thông tin profile thất bại";
        throw new Error(errorMessage);
    }
};

// Thay đổi avatar
export const changeAvatar = async (avatar) => {
    try {
        const response = await post("/users/change-avatar", { avatar });
        return response;
    } catch (error) {
        console.error("Change avatar error:", error);
        const errorMessage =
            error.response?.data?.message || error.response?.data?.error || error.message || "Thay đổi avatar thất bại";
        throw new Error(errorMessage);
    }
};
