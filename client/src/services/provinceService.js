// src/services/provinceService.js
import axios from "axios";

const VNAPPMOB_API_BASE = "https://api.vnappmob.com/api/v2/province";

// Tạo axios instance riêng cho VNAppMob API
const vnappMobRequest = axios.create({
    baseURL: VNAPPMOB_API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Response interceptor cho VNAppMob API
vnappMobRequest.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("VNAppMob API Error:", error);
        return Promise.reject({
            message: error.message || "Có lỗi xảy ra khi gọi API địa chính",
            status: error.response?.status,
            data: error.response?.data,
        });
    },
);

// Lấy danh sách tỉnh thành
export const getProvinces = async () => {
    try {
        const response = await vnappMobRequest.get("/");
        return response;
    } catch (error) {
        console.error("Error getting provinces:", error);
        const errorMessage = error.message || "Lấy danh sách tỉnh thành thất bại";
        throw new Error(errorMessage);
    }
};

// Lấy danh sách quận/huyện theo provinceId
export const getDistricts = async (provinceId) => {
    try {
        if (!provinceId) {
            throw new Error("Province ID là bắt buộc");
        }
        const response = await vnappMobRequest.get(`/district/${provinceId}`);
        return response;
    } catch (error) {
        console.error("Error getting districts:", error);
        const errorMessage = error.message || "Lấy danh sách quận/huyện thất bại";
        throw new Error(errorMessage);
    }
};

// Lấy danh sách xã/phường theo districtId
export const getWards = async (districtId) => {
    try {
        if (!districtId) {
            throw new Error("District ID là bắt buộc");
        }
        const response = await vnappMobRequest.get(`/ward/${districtId}`);
        return response;
    } catch (error) {
        console.error("Error getting wards:", error);
        const errorMessage = error.message || "Lấy danh sách xã/phường thất bại";
        throw new Error(errorMessage);
    }
};

// Lấy thông tin chi tiết tỉnh theo ID
export const getProvinceById = async (provinceId) => {
    try {
        if (!provinceId) {
            throw new Error("Province ID là bắt buộc");
        }
        // VNAppMob không có endpoint chi tiết tỉnh, nên ta filter từ danh sách tỉnh
        const provinces = await getProvinces();
        const province = provinces.results?.find((p) => p.province_id === provinceId);
        if (!province) {
            throw new Error("Không tìm thấy tỉnh thành");
        }
        return { results: [province] };
    } catch (error) {
        console.error("Error getting province by ID:", error);
        const errorMessage = error.message || "Lấy thông tin tỉnh thất bại";
        throw new Error(errorMessage);
    }
};

// Lấy thông tin chi tiết quận/huyện theo ID
export const getDistrictById = async (provinceId, districtId) => {
    try {
        if (!provinceId || !districtId) {
            throw new Error("Province ID và District ID là bắt buộc");
        }
        const districts = await getDistricts(provinceId);
        const district = districts.results?.find((d) => d.district_id === districtId);
        if (!district) {
            throw new Error("Không tìm thấy quận/huyện");
        }
        return { results: [district] };
    } catch (error) {
        console.error("Error getting district by ID:", error);
        const errorMessage = error.message || "Lấy thông tin quận/huyện thất bại";
        throw new Error(errorMessage);
    }
};

// Tìm kiếm tỉnh thành theo tên
export const searchProvinces = async (searchTerm) => {
    try {
        const provinces = await getProvinces();
        const filteredProvinces =
            provinces.results?.filter((province) =>
                province.province_name.toLowerCase().includes(searchTerm.toLowerCase()),
            ) || [];
        return { results: filteredProvinces };
    } catch (error) {
        console.error("Error searching provinces:", error);
        const errorMessage = error.message || "Tìm kiếm tỉnh thành thất bại";
        throw new Error(errorMessage);
    }
};

// Tìm kiếm quận/huyện theo tên trong một tỉnh
export const searchDistricts = async (provinceId, searchTerm) => {
    try {
        const districts = await getDistricts(provinceId);
        const filteredDistricts =
            districts.results?.filter((district) =>
                district.district_name.toLowerCase().includes(searchTerm.toLowerCase()),
            ) || [];
        return { results: filteredDistricts };
    } catch (error) {
        console.error("Error searching districts:", error);
        const errorMessage = error.message || "Tìm kiếm quận/huyện thất bại";
        throw new Error(errorMessage);
    }
};

// Tìm kiếm xã/phường theo tên trong một quận/huyện
export const searchWards = async (districtId, searchTerm) => {
    try {
        const wards = await getWards(districtId);
        const filteredWards =
            wards.results?.filter((ward) => ward.ward_name.toLowerCase().includes(searchTerm.toLowerCase())) || [];
        return { results: filteredWards };
    } catch (error) {
        console.error("Error searching wards:", error);
        const errorMessage = error.message || "Tìm kiếm xã/phường thất bại";
        throw new Error(errorMessage);
    }
};
