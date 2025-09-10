//area.service.js
const { Area } = require("@/models");

class AreaService {
    async getArea() {
        try {
            const response = await Area.findAll({
                raw: true,
                attributes: ["id", "code", "value", "order"],
            });
            if (!response.length) {
                const error = new Error("Không tìm thấy khu vực nào");
                error.statusCode = 404;
                throw error;
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}

const areaService = new AreaService();
module.exports = areaService;
