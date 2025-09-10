const { Category } = require("@/models");

class CategoryService {
    async getCategories() {
        try {
            const categories = await Category.findAll({
                raw: true,
                attributes: [
                    "id",
                    "slug",
                    "code",
                    "value",
                    "header",
                    "subheader",
                    "createdAt",
                    "updatedAt",
                ],
            });
            if (!categories.length) {
                const error = new Error("Không tìm thấy danh mục nào");
                error.statusCode = 404;
                throw error;
            }
            return categories;
        } catch (error) {
            throw error;
        }
    }
}

const categoryService = new CategoryService();
module.exports = categoryService;
