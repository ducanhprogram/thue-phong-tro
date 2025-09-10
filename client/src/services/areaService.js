import { get } from "@/utils/httpRequest";

export const getAreas = async () => {
    try {
        const response = await get("/area");
        return response;
    } catch (error) {
        console.log("Error area servicve", error);
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Lấy khu vực, vị trí thất bại";
        throw new Error(errorMessage);
    }
};
