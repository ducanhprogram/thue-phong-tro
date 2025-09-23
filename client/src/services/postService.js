import { del, get, post, put } from "@/utils/httpRequest";

import axios from "axios";

export const getPostById = async (postId) => {
    try {
        const response = await get(`/posts/${postId}`);
        return response;
    } catch (error) {
        console.log("Error get post by id service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy chi tiết bài viết thất bại";
        throw new Error(errorMessage);
    }
};

export const getRelatedPosts = async (postId, categoryCode, provinceCode, limit = 5) => {
    try {
        // Build query params
        const params = new URLSearchParams();
        if (categoryCode) params.append("categoryCode", categoryCode);
        if (provinceCode) params.append("provinceCode", provinceCode);
        params.append("limit", limit);

        const response = await get(`/posts/${postId}/related?${params.toString()}`);
        return response;
    } catch (error) {
        console.log("Error get related posts service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy bài viết liên quan thất bại";
        throw new Error(errorMessage);
    }
};

export const getPosts = async () => {
    try {
        const response = await get("/posts");
        return response;
    } catch (error) {
        console.log("Error posts servicve", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy danh sách danh mục thất bại";
        throw new Error(errorMessage);
    }
};

export const getPostLimit = async (
    page = 1,
    limit = 10,
    priceCode = null,
    areaCode = null,
    categoryCode = null,
    provinceCode = null,
) => {
    try {
        // Build query params
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);

        if (priceCode) {
            params.append("priceCode", priceCode);
        }

        if (areaCode) {
            params.append("areaCode", areaCode);
        }

        if (provinceCode) {
            params.append("provinceCode", provinceCode);
        }

        if (categoryCode) params.append("categoryCode", categoryCode);
        const response = await get(`/posts/limit?${params.toString()}`);
        return response;
    } catch (error) {
        console.log("Error posts limit service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy danh sách bài viết có phân trang thất bại";
        throw new Error(errorMessage);
    }
};

export const getNewPosts = async () => {
    try {
        const response = await get("/posts/new-post");
        return response;
    } catch (error) {
        console.log("Error new posts service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy danh sách bài viết mới nhất thất bại";
        throw new Error(errorMessage);
    }
};

export const uploadMultipleImages = async (imageFiles) => {
    try {
        const uploadPromises = imageFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
            // formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

            return axios({
                method: "post",
                url: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        });

        const responses = await Promise.all(uploadPromises);
        return responses.map((response) => response);
    } catch (error) {
        console.log("Error upload multiple images service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Upload nhiều ảnh thất bại";
        throw new Error(errorMessage);
    }
};

export const apiCreatePost = async (payload) => {
    try {
        const response = await post("/posts/create-new-post", payload);
        return response;
    } catch (error) {
        console.log("Error create new post service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Tạo bài viết mới thất bại";
        throw new Error(errorMessage);
    }
};

export const getPostsLimitAdmin = async (page = 1, limit = 10, query = {}) => {
    try {
        // Build query params
        const params = new URLSearchParams();
        console.log(page, limit, query);
        console.log(params);
        params.append("page", page);
        params.append("limit", limit);

        // Thêm các query params khác nếu có
        Object.keys(query).forEach((key) => {
            if (query[key]) {
                params.append(key, query[key]);
            }
        });

        const response = await get(`/posts/limit-admin?${params.toString()}`);
        return response;
    } catch (error) {
        console.log("Error get post limit admin service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy bài viết admin thất bại";
        throw new Error(errorMessage);
    }
};

export const apiUpdatePost = async (postId, payload) => {
    try {
        const response = await put(`/posts/update/${postId}`, payload);
        return response;
    } catch (error) {
        console.log("Error update post service", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Cập nhật bài viết thất bại";
        throw new Error(errorMessage);
    }
};

export const apiDeletePost = async (postId) => {
    try {
        const response = await del(`/posts/delete/${postId}`);
        return response.data;
    } catch (error) {
        console.log("Error delete post service", error);
        const errorMessage =
            error.response?.data?.message || error.response?.data?.error || error.message || "Xóa bài viết thất bại";
        throw new Error(errorMessage);
    }
};
