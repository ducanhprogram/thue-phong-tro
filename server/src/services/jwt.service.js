const {
    ACCESS_TOKEN_EXPIRES_IN,
    ACCESS_TOKEN_JWT_SECRET,
    TOKEN_TYPE,
    VERIFY_EMAIL_JWT_EXPIRES_IN,
    VERIFY_EMAIL_JWT_SECRET,
    RESETPASSWORD_JWT_SECRET,
    RESETPASSWORD_JWT_EXPIRES_IN,
} = require("@/config/auth");
const jwt = require("jsonwebtoken");

class JwtService {
    generateAccessToken(userId) {
        try {
            if (!ACCESS_TOKEN_JWT_SECRET || !ACCESS_TOKEN_EXPIRES_IN) {
                const error = new Error(
                    "ACCESS_TOKEN_JWT_SECRET hoặc ACCESS_TOKEN_EXPIRES_IN không được định nghĩa"
                );
                error.statusCode = 400;
                throw error;
            }
            const token = jwt.sign({ userId }, ACCESS_TOKEN_JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            });
            return {
                accessToken: token,
                token_type: TOKEN_TYPE,
                expires_in: ACCESS_TOKEN_EXPIRES_IN,
            };
        } catch (error) {
            const err = new Error("Không thể tạo access token");
            err.statusCode = error.statusCode || 500;
            throw err;
        }
    }

    verifyAccessToken(token) {
        try {
            if (!ACCESS_TOKEN_JWT_SECRET) {
                const error = new Error(
                    "ACCESS_TOKEN_JWT_SECRET không được định nghĩa"
                );
                error.statusCode = 400;
                throw error;
            }
            const decoded = jwt.verify(token, ACCESS_TOKEN_JWT_SECRET);
            return decoded;
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                const expiredError = new Error("Access token đã hết hạn");
                expiredError.statusCode = 410;
                throw expiredError;
            }
            const err = new Error("Access token không hợp lệ");
            err.statusCode = error.statusCode || 401;
            throw err;
        }
    }

    generateEmailVerifyToken(userId, email) {
        try {
            if (!VERIFY_EMAIL_JWT_SECRET || !VERIFY_EMAIL_JWT_EXPIRES_IN) {
                const error = new Error(
                    "VERIFY_EMAIL_JWT_SECRET hoặc VERIFY_EMAIL_JWT_EXPIRES_IN không được định nghĩa"
                );
                error.statusCode = 400;
                throw error;
            }
            const token = jwt.sign(
                { userId, email, type: "email_verify" },
                VERIFY_EMAIL_JWT_SECRET,
                {
                    expiresIn: VERIFY_EMAIL_JWT_EXPIRES_IN,
                }
            );
            return token;
        } catch (error) {
            const err = new Error("Không thể tạo verify email token");
            err.statusCode = error.statusCode || 500;
            throw err;
        }
    }

    verifyEmailVerifyToken(token) {
        try {
            if (!VERIFY_EMAIL_JWT_SECRET) {
                const error = new Error(
                    "VERIFY_EMAIL_JWT_SECRET không được định nghĩa"
                );
                error.statusCode = 400;
                throw error;
            }
            const decoded = jwt.verify(token, VERIFY_EMAIL_JWT_SECRET);
            if (decoded.type !== "email_verify") {
                const error = new Error("Loại token không hợp lệ");
                error.statusCode = 400;
                throw error;
            }
            return {
                userId: decoded.userId,
                email: decoded.email,
                isValid: true,
            };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                const expiredError = new Error("Verify email token đã hết hạn");
                expiredError.statusCode = 410;
                throw expiredError;
            }
            const err = new Error("Verify email token không hợp lệ");
            err.statusCode = error.statusCode || 401;
            throw err;
        }
    }

    generateResetPasswordToken(userId, email) {
        try {
            if (!RESETPASSWORD_JWT_SECRET || !RESETPASSWORD_JWT_EXPIRES_IN) {
                const error = new Error(
                    "RESETPASSWORD_JWT_SECRET hoặc RESETPASSWORD_JWT_EXPIRES_IN không được định nghĩa"
                );
                error.statusCode = 400;
                throw error;
            }
            const token = jwt.sign(
                { userId, email, type: "reset_password" },
                RESETPASSWORD_JWT_SECRET,
                {
                    expiresIn: RESETPASSWORD_JWT_EXPIRES_IN,
                }
            );
            return token;
        } catch (error) {
            const err = new Error("Không thể tạo reset password token");
            err.statusCode = error.statusCode || 500;
            throw err;
        }
    }

    verifyResetPasswordToken(token) {
        try {
            if (!RESETPASSWORD_JWT_SECRET) {
                const error = new Error(
                    "RESETPASSWORD_JWT_SECRET không được định nghĩa"
                );
                error.statusCode = 400;
                throw error;
            }
            const decoded = jwt.verify(token, RESETPASSWORD_JWT_SECRET);
            if (decoded.type !== "reset_password") {
                const error = new Error("Loại token không hợp lệ");
                error.statusCode = 400;
                throw error;
            }
            return {
                userId: decoded.userId,
                email: decoded.email,
                isValid: true,
            };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                const expiredError = new Error(
                    "Reset password token đã hết hạn"
                );
                expiredError.statusCode = 410;
                throw expiredError;
            }
            const err = new Error("Reset password token không hợp lệ");
            err.statusCode = error.statusCode || 401;
            throw err;
        }
    }
}

const jwtService = new JwtService();
module.exports = jwtService;
