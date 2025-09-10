const categoryService = require("@/services/category.service");

exports.getCategories = async (req, res) => {
    try {
        const response = await categoryService.getCategories();
        return res.success(200, response, "Lấy danh sách danh mục thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi category controller";
        return res.error(statusCode, message);
    }
};
