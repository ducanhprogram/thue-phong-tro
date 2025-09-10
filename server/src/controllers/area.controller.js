//price.controller.js
const areaService = require("@/services/area.service");

exports.getArea = async (req, res) => {
    try {
        const response = await areaService.getArea();
        return res.success(200, response, "Lấy khu vực thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi area controller";
        return res.error(statusCode, message);
    }
};
