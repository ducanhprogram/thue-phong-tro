import { get } from "@/utils/httpRequest";
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

export const getPostLimit = async (page = 1, limit = 10, priceCode = null, areaCode = null, categoryCode = null) => {
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
