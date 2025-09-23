const postService = require("@/services/post.service");

exports.getPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        // Validate postId
        if (!postId || isNaN(postId)) {
            return res.error(400, "ID bài viết không hợp lệ");
        }

        const response = await postService.getPostById(postId);
        return res.success(200, response, "Lấy chi tiết bài viết thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi lấy chi tiết bài viết";
        return res.error(statusCode, message);
    }
};

exports.getRelatedPosts = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { categoryCode, provinceCode } = req.query;
        const limit = parseInt(req.query.limit) || 5;

        // Validate postId
        if (!postId || isNaN(postId)) {
            return res.error(400, "ID bài viết không hợp lệ");
        }

        if (limit < 1 || limit > 20) {
            return res.error(400, "Limit phải từ 1 đến 20");
        }

        const response = await postService.getRelatedPosts(
            postId,
            categoryCode,
            provinceCode,
            limit
        );
        return res.success(200, response, "Lấy bài viết liên quan thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi lấy bài viết liên quan";
        return res.error(statusCode, message);
    }
};

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

exports.getPostsLimitAdmin = async (req, res) => {
    try {
        const { page, limit, ...query } = req.query;

        const { id } = req.user;
        if (!id) {
            return res.error(401, "Bạn chưa đăng nhập hoặc token không hợp lệ");
        }
        const _page = parseInt(page) || 1;
        const _limit = parseInt(limit) || 10;

        const response = await postService.getPostsLimitAdmin(
            _page,
            _limit,
            id,
            query
        );
        return res.success(200, response, "Lấy bài viết theo Admin thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message =
            error.message || "Lỗi khi lấy bài viết theo Admin thất bại";
        return res.error(statusCode, message);
    }
};

// Thêm method này vào file post.controller.js hiện tại

exports.updatePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
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
            label,
            ...payload
        } = req.body;

        // Validate postId
        if (!postId || isNaN(postId)) {
            return res.error(400, "ID bài viết không hợp lệ");
        }

        // Helper function để check empty/whitespace
        const isEmpty = (value) => {
            return (
                !value ||
                (typeof value === "string" && value.trim().length === 0)
            );
        };

        // Validate required fields với trim()
        if (isEmpty(categoryCode)) {
            return res.error(400, "Mã danh mục không được để trống");
        }
        if (isEmpty(title)) {
            return res.error(400, "Tiêu đề không được để trống");
        }
        if (isEmpty(address)) {
            return res.error(400, "Địa chỉ không được để trống");
        }
        if (isEmpty(description)) {
            return res.error(400, "Mô tả không được để trống");
        }
        if (isEmpty(province)) {
            return res.error(400, "Tỉnh/Thành phố không được để trống");
        }
        if (isEmpty(label)) {
            return res.error(400, "Nhãn khu vực không được để trống");
        }

        // Validate price and area numbers
        if (
            priceNumber === null ||
            priceNumber === undefined ||
            priceNumber === ""
        ) {
            return res.error(400, "Giá không được để trống");
        }
        if (
            areaNumber === null ||
            areaNumber === undefined ||
            areaNumber === ""
        ) {
            return res.error(400, "Diện tích không được để trống");
        }

        const priceNum = parseFloat(priceNumber);
        const areaNum = parseFloat(areaNumber);

        if (isNaN(areaNum) || areaNum <= 0) {
            return res.error(400, "Diện tích phải là số dương và lớn hơn 0");
        }

        if (isNaN(priceNum) || priceNum <= 0) {
            return res.error(400, "Giá phải là số dương và lớn hơn 0");
        }

        // Validate images
        if (!Array.isArray(images) || images.length === 0) {
            return res.error(400, "Cần ít nhất 1 hình ảnh");
        }

        // Check if all images are valid URLs or not empty
        const invalidImages = images.filter((img) => isEmpty(img));
        if (invalidImages.length > 0) {
            return res.error(400, "Tất cả hình ảnh phải có URL hợp lệ");
        }

        // Validate length với trim()
        if (title.trim().length > 255) {
            return res.error(400, "Tiêu đề không được vượt quá 255 ký tự");
        }

        if (description.trim().length > 3000) {
            return res.error(400, "Mô tả không được vượt quá 3000 ký tự");
        }

        // Validate categoryCode có trong danh sách hợp lệ
        const validCategoryCodes = ["CTPT", "CTCH", "CTMB", "NCT"];
        if (!validCategoryCodes.includes(categoryCode.trim())) {
            return res.error(
                400,
                "Mã danh mục không hợp lệ. Chỉ chấp nhận: " +
                    validCategoryCodes.join(", ")
            );
        }

        // Validate optional fields nếu có
        if (priceCode && isEmpty(priceCode)) {
            return res.error(400, "Mã giá không được chỉ chứa khoảng trắng");
        }
        if (areaCode && isEmpty(areaCode)) {
            return res.error(
                400,
                "Mã diện tích không được chỉ chứa khoảng trắng"
            );
        }
        if (target && isEmpty(target)) {
            return res.error(
                400,
                "Đối tượng thuê không được chỉ chứa khoảng trắng"
            );
        }

        const { id: userId } = req.user;
        if (!userId) {
            return res.error(401, "Bạn chưa đăng nhập hoặc token không hợp lệ");
        }

        // Trim dữ liệu trước khi gửi xuống service
        const cleanedBody = {
            ...req.body,
            categoryCode: categoryCode.trim(),
            title: title.trim(),
            address: address.trim(),
            description: description.trim(),
            province: province.trim(),
            label: label.trim(),
            priceCode: priceCode?.trim() || priceCode,
            areaCode: areaCode?.trim() || areaCode,
            target: target?.trim() || target,
        };

        const response = await postService.updatePost(
            postId,
            cleanedBody,
            userId
        );
        return res.success(200, response, "Cập nhật bài viết thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi cập nhật bài viết";
        return res.error(statusCode, message);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        // Validate postId
        if (!postId || isNaN(postId)) {
            return res.error(400, "ID bài viết không hợp lệ");
        }

        const { id: userId } = req.user;
        if (!userId) {
            return res.error(401, "Bạn chưa đăng nhập hoặc token không hợp lệ");
        }

        const response = await postService.deletePost(postId, userId);
        return res.success(200, response, "Xóa bài viết thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi khi xóa bài viết";
        return res.error(statusCode, message);
    }
};
