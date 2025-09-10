import { get } from "@/utils/httpRequest";

export const getProvinces = async () => {
    try {
        const response = await get("/province");
        return response;
    } catch (error) {
        console.log("Error app province", error);
        const errorMessage =
            error.response?.data?.message || error.response?.data?.error || error.message || "Lấy tỉnh thành thất bại";
        throw new Error(errorMessage);
    }
};
