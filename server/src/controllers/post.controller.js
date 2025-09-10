const postService = require("@/services/post.service");

exports.getPosts = async (req, res) => {
    try {
        const response = await postService.getPosts();
        return res.success(200, response, "Lấy bài viết thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi posts controller";
        return res.error(statusCode, message);
    }
};

exports.getPostsLimit = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const priceCode = req.query.priceCode;
        const areaCode = req.query.areaCode;
        const categoryCode = req.query.categoryCode;

        if (page < 1) {
            return res.error(400, "Page phải lớn hơn 0");
        }
        if (limit < 1 || limit > 100) {
            return res.error(400, "Limit phải từ 1 đến 100");
        }

        const response = await postService.getPostsLimit(
            page,
            limit,
            priceCode,
            areaCode,
            categoryCode
        );
        return res.success(
            200,
            response,
            "Lấy bài viết có phân trang thành công"
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi lấy bài viết có phân trang";
        return res.error(statusCode, message);
    }
};

exports.getNewPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Cho phép client tùy chỉnh limit, mặc định là 10

        if (limit < 1 || limit > 100) {
            return res.error(400, "Limit phải từ 1 đến 100");
        }

        const response = await postService.getNewPosts(limit);
        return res.success(
            200,
            response,
            "Lấy 10 bài viết mới nhất thành công"
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi lấy bài viết mới nhất";
        return res.error(statusCode, message);
    }
};
