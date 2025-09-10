//price.controller.js
const priceService = require("@/services/price.service");

exports.getPrices = async (req, res) => {
    try {
        const response = await priceService.getPrices();
        return res.success(
            200,
            response,
            "Lấy danh sách khoảng giá thành công"
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi price controller";
        return res.error(statusCode, message);
    }
};
