//province.service.js
const { Province } = require("@/models");

class ProvinceService {
    async getProvinces() {
        try {
            const response = await Province.findAll({
                raw: true,
                attributes: ["id", "code", "value"],
            });
            if (!response.length) {
                const error = new Error("Không tìm thấy tỉnh thành nào");
                error.statusCode = 404;
                throw error;
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}

const provinceService = new ProvinceService();
module.exports = provinceService;
