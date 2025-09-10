import { get } from "@/utils/httpRequest";
export const getCategories = async () => {
    try {
        const response = await get("/category");
        return response;
    } catch (error) {
        console.log("Error category servicve", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy danh sách danh mục thất bại";
        throw new Error(errorMessage);
    }
};
