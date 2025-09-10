//price.service.js
const { Price } = require("@/models");

class PriceService {
    async getPrices() {
        try {
            const response = await Price.findAll({
                raw: true,
                attributes: ["id", "code", "value", "order"],
            });
            if (!response.length) {
                const error = new Error("Không tìm thấy khoảng giá nào");
                error.statusCode = 404;

                throw error;
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}

const priceService = new PriceService();
module.exports = priceService;
