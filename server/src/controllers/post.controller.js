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
        const provinceCode = req.query.provinceCode;

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
            categoryCode,
            provinceCode
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

exports.createNewPost = async (req, res) => {
    try {
        const {
            categoryCode,
            title,
            priceNumber,
            areaNumber,
            images,
            address,
            priceCode,
            areaCode,
            description,
            target,
            province,
            ...payload
        } = req.body;

        if (
            !categoryCode ||
            !title ||
            !priceNumber ||
            !areaNumber ||
            !address ||
            !description
        ) {
            return res.error(400, "Thiếu thông tin bắt buộc để tạo bài viết");
        }
        const { id } = req.user;
        if (!id) {
            return res.error(401, "Bạn chưa đăng nhập hoặc token không hợp lệ");
        }

        const priceNum = parseFloat(priceNumber);
        const areaNum = parseFloat(areaNumber);
        if (isNaN(areaNum) || areaNum < 0) {
            return res.error(
                400,
                "Diện tích phải là số dương và lớn hơn không"
            );
        }

        if (isNaN(priceNum) || priceNum <= 0) {
            return res.error(400, "Giá phải là số dương");
        }

        if (!Array.isArray(images) || images.length === 0) {
            return res.error(400, "Cần ít nhất 1 hình ảnh");
        }

        if (title.length > 255) {
            return res.error(400, "Tiêu đề không được vượt quá 255 ký tự");
        }

        if (description.length > 3000) {
            return res.error(400, "Mô tả không được vượt quá 3000 ký tự");
        }

        const response = await postService.createNewPost(req.body, id);
        return res.success(200, response, "Tạo bài viết thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi tạo bài viết mới";
        return res.error(statusCode, message);
    }
};
