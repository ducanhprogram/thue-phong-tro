const userService = require("@/services/user.service");

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.error(401, "Không tìm thấy thông tin người dùng");
        }

        const user = await userService.getById(userId);

        if (!user) {
            return res.error(404, "Người dùng không tồn tại");
        }

        return res.success(200, { user }, "Lấy thông tin profile thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message =
            error.message || "Lỗi hệ thống khi lấy thông tin profile";

        return res.error(statusCode, message);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, phone, zalo, facebook_url } = req.body;

        if (!userId) {
            return res.error(401, "Không tìm thấy thông tin người dùng");
        }

        // Validate input data
        if (!name && !phone && !zalo && !facebook_url) {
            return res.error(400, "Cần ít nhất một thông tin để cập nhật");
        }

        // Helper function để check empty/whitespace
        const isEmpty = (value) => {
            return (
                !value ||
                (typeof value === "string" && value.trim().length === 0)
            );
        };

        // Validate từng trường
        if (name !== undefined && isEmpty(name)) {
            return res.error(
                400,
                "Tên không được để trống hoặc chỉ chứa khoảng trắng"
            );
        }

        if (phone !== undefined && isEmpty(phone)) {
            return res.error(
                400,
                "Số điện thoại không được để trống hoặc chỉ chứa khoảng trắng"
            );
        }

        if (zalo !== undefined && isEmpty(zalo)) {
            return res.error(
                400,
                "Zalo không được để trống hoặc chỉ chứa khoảng trắng"
            );
        }

        if (facebook_url !== undefined && isEmpty(facebook_url)) {
            return res.error(
                400,
                "Facebook URL không được để trống hoặc chỉ chứa khoảng trắng"
            );
        }

        // Validate phone format nếu có
        if (phone && phone.trim()) {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.trim())) {
                return res.error(
                    400,
                    "Số điện thoại không đúng định dạng (10-11 chữ số)"
                );
            }
        }

        // Validate name length nếu có
        if (name && name.trim().length > 50) {
            return res.error(400, "Tên không được vượt quá 50 ký tự");
        }

        // Validate facebook_url format nếu có
        if (facebook_url && facebook_url.trim()) {
            try {
                const url = new URL(facebook_url.trim());
                if (
                    !url.hostname.includes("facebook.com") &&
                    !url.hostname.includes("fb.com")
                ) {
                    return res.error(400, "Facebook URL không đúng định dạng");
                }
            } catch (urlError) {
                return res.error(400, "Facebook URL không đúng định dạng");
            }
        }

        // Chỉ cho phép cập nhật các trường được phép
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (phone !== undefined) updateData.phone = phone.trim();
        if (zalo !== undefined) updateData.zalo = zalo.trim();
        if (facebook_url !== undefined)
            updateData.facebook_url = facebook_url.trim();

        const updatedUser = await userService.updateProfile(userId, updateData);

        if (!updatedUser) {
            return res.error(500, "Không thể cập nhật thông tin");
        }

        return res.success(
            200,
            { user: updatedUser },
            "Cập nhật thông tin thành công"
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống khi cập nhật profile";

        return res.error(statusCode, message);
    }
};

exports.changeAvatar = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { avatar } = req.body;

        if (!userId) {
            return res.error(401, "Không tìm thấy thông tin người dùng");
        }

        if (!avatar) {
            return res.error(400, "Avatar không được để trống");
        }

        // Validate avatar (có thể là base64 string hoặc URL)
        // if (typeof avatar !== "string" || avatar.trim().length === 0) {
        //     return res.error(400, "Avatar phải là chuỗi hợp lệ");
        // }

        // Nếu là URL, validate URL format

        const updatedUser = await userService.updateProfile(userId, {
            avatar: avatar,
        });

        if (!updatedUser) {
            return res.error(500, "Không thể cập nhật avatar");
        }

        return res.success(
            200,
            { user: updatedUser },
            "Cập nhật avatar thành công"
        );
    } catch (error) {
        console.error("Change avatar error:", error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống khi cập nhật avatar";

        return res.error(statusCode, message);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1) {
            return res.error(400, "Page phải lớn hơn 0");
        }
        if (limit < 1 || limit > 100) {
            return res.error(400, "Limit phải từ 1 đến 100");
        }

        const result = await userService.getAll(page, limit);

        return res.success(200, result, "Lấy danh sách người dùng thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message =
            error.message || "Lỗi hệ thống khi lấy danh sách người dùng";

        return res.error(statusCode, message);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (!userId || isNaN(userId)) {
            return res.error(400, "ID người dùng không hợp lệ");
        }

        const user = await userService.getById(userId);

        if (!user) {
            return res.error(404, "Người dùng không tồn tại");
        }

        return res.success(
            200,
            { user },
            "Lấy thông tin người dùng thành công"
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message =
            error.message || "Lỗi hệ thống khi lấy thông tin người dùng";

        return res.error(statusCode, message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (!userId || isNaN(userId)) {
            return res.error(400, "ID người dùng không hợp lệ");
        }

        const result = await userService.remove(userId);

        return res.success(200, result, "Xóa người dùng thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống khi xóa người dùng";

        return res.error(statusCode, message);
    }
};
