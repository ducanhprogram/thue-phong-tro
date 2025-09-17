const authService = require("@/services/auth.service");
const throw404 = require("@/utils/throw404");

exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        if (!name || !email || !password || !phone) {
            return res.error(400, "Tên, email và mật khẩu là bắt buộc");
        }

        const response = await authService.register(
            name,
            email,
            password,
            phone
        );
        return res.success(
            201,
            response,
            "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản."
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.error(400, "Email và mật khẩu là bắt buộc");
        }

        const response = await authService.login(email, password);
        return res.success(200, response, "Đăng nhập thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        if (!token) {
            return res.error(400, "Token xác thực là bắt buộc");
        }

        const response = await authService.verifyEmail(token);
        return res.success(200, response, "Xác thực email thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    try {
        if (!refresh_token) {
            return res.error(400, "Refresh token là bắt buộc");
        }

        const response = await authService.generateTokens(refresh_token);
        return res.success(200, response, "Làm mới token thành công");
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.logout = async (req, res) => {
    const { refresh_token } = req.body;

    try {
        const response = await authService.logout(refresh_token);
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.logoutAll = async (req, res) => {
    const userId = req.user?.id;

    try {
        if (!userId) {
            return res.error(401, "Không tìm thấy thông tin người dùng");
        }

        const response = await authService.logoutAll(userId);
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.me = async (req, res) => {
    const userId = req.user?.id;

    try {
        if (!userId) {
            return res.error(401, "Không tìm thấy thông tin người dùng");
        }

        const response = await authService.me(userId);
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.resendVerifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.error(400, "Email là bắt buộc");
        }

        const response = await authService.resendVerifyEmail(email);
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.error(400, "Email là bắt buộc");
        }

        const response = await authService.forgotPassword(email);
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        if (!token) {
            return res.error(400, "Token reset password là bắt buộc");
        }
        if (!password) {
            return res.error(400, "Mật khẩu mới là bắt buộc");
        }

        const response = await authService.resetPassword(token, password);
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};

exports.changePassword = async (req, res) => {
    const userId = req.user?.id;
    const { current_password, new_password } = req.body;

    try {
        if (!userId) {
            return res.error(401, "Không tìm thấy thông tin người dùng");
        }
        if (!current_password || !new_password) {
            return res.error(
                400,
                "Mật khẩu hiện tại và mật khẩu mới là bắt buộc"
            );
        }

        const response = await authService.changePassword(
            userId,
            current_password,
            new_password
        );
        return res.success(200, response);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Lỗi hệ thống, vui lòng thử lại";

        return res.error(statusCode, message);
    }
};
