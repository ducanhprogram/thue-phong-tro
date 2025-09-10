//province.controller.js
const provinceService = require("@/services/province.service");

exports.getProvinces = async (req, res) => {
    try {
        const response = await provinceService.getProvinces();
        return res.success(
            200,
            response,
            "Lấy danh sách tỉnh thành thành công"
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi province controller";
        return res.error(statusCode, message);
    }
};
