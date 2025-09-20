import { get, post } from "@/utils/httpRequest";

import axios from "axios";

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
