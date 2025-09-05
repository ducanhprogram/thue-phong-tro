import { get } from "@/utils/httpRequest";

export const getPrices = async () => {
    try {
        const response = await get("/price");
        return response;
    } catch (error) {
        console.log("Error app servicve", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy danh sách khoảng giá thất bại";
        throw new Error(errorMessage);
    }
};
