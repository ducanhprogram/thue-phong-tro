require("dotenv").config();
const { User } = require("@/models");
const jwt = require("jsonwebtoken");
const userService = require("./user.service");
const jwtService = require("./jwt.service");
const refreshTokenService = require("./refreshToken.service");
const queue = require("@/utils/queue");

class AuthService {
    async register(name, email, password) {
        try {
            const existingUserByEmail = await userService.findByEmail(email);

            if (existingUserByEmail) {
                const error = new Error("Email đã được sử dụng");
                error.statusCode = 409;
                throw error;
            }
            // Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const error = new Error("Email không đúng định dạng");
                error.statusCode = 400;
                throw error;
            }

            // Check password strength
            if (password.length < 8) {
                const error = new Error("Password phải có ít nhất 8 ký tự");
                error.statusCode = 400;
                throw error;
            }

            const newUser = await userService.create({
                email,
                password,
                name,
            });
            await queue.dispatch("sendVerifyEmailJob", {
                userId: newUser.id,
            });

            return {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const user = await userService.findByEmail(email, {
                attributes: [
                    "id",
                    "name",
                    "email",
                    "password",
                    "email_verified",
                    "createdAt",
                    "updatedAt",
                ],
            });

            if (!user) {
                const error = new Error("Email chưa được đăng ký.");
                error.statusCode = 404;
                throw error;
            }

            if (!user.email_verified) {
                const error = new Error(
                    "Tài khoản chưa được xác minh. Vui lòng kiểm tra email hoặc gửi lại email xác minh"
                );
                error.statusCode = 403;
                throw error;
            }

            if (!(await userService.verifyPassword(password, user.password))) {
                const error = new Error("Email hoặc mật khẩu không đúng!");
                error.statusCode = 401;
                throw error;
            }

            const accessToken = jwtService.generateAccessToken(user.id);
            const refreshToken = await refreshTokenService.create(user.id);

            const { password: _, ...userResponse } = user.toJSON();

            return {
                user: {
                    id: userResponse.id,
                    email: userResponse.email,
                    name: userResponse.name,
                    email_verified: userResponse.email_verified,
                    createdAt: userResponse.createdAt,
                    updatedAt: userResponse.updatedAt,
                },
                accessToken: accessToken.accessToken,
                refreshToken: refreshToken.refreshToken,
                token_type: accessToken.token_type,
                expires_in: accessToken.expires_in,
            };
        } catch (error) {
            throw error;
        }
    }

    async verifyEmail(token) {
        try {
            const decoded = jwtService.verifyEmailVerifyToken(token);

            console.log("Decoded token:", decoded);
            if (!decoded.isValid) {
                const error = new Error("Token không hợp lệ");
                error.statusCode = 400;
                throw error;
            }

            const user = await userService.getById(decoded.userId);
            console.log("Found user:", user ? "Yes" : "No");
            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            if (user.email !== decoded.email) {
                const error = new Error(
                    "Token không khớp với email người dùng"
                );
                error.statusCode = 400;
                throw error;
            }

            const isVerified = await userService.verifyEmail(decoded.userId);
            if (!isVerified) {
                const error = new Error(
                    "Không thể cập nhật trạng thái xác thực email"
                );
                error.statusCode = 500;
                throw error;
            }

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    email_verified: true,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                const expiredError = new Error("Token xác thực đã hết hạn");
                expiredError.statusCode = 410;
                throw expiredError;
            }
            throw error;
        }
    }

    //Làm mới access token
    async generateTokens(refreshToken) {
        try {
            const tokenData = await refreshTokenService.findValid(refreshToken);
            if (!tokenData) {
                const error = new Error("Refresh token không hợp lệ");
                error.statusCode = 401;
                throw error;
            }
            const userId = tokenData.userId;
            if (!userId) {
                const error = new Error(
                    "Không tìm thấy userId trong refresh token"
                );
                error.statusCode = 400;
                throw error;
            }

            const accessToken = jwtService.generateAccessToken(userId);

            return {
                accessToken: accessToken.accessToken,
                refreshToken,
                token_type: accessToken.token_type,
            };
        } catch (error) {
            throw error;
        }
    }

    async logout(refreshToken) {
        try {
            if (refreshToken) {
                await refreshTokenService.delete(refreshToken);
            }
            return {
                message: "Đăng xuất thành công",
            };
        } catch (error) {
            throw error;
        }
    }

    async logoutAll(userId) {
        try {
            await refreshTokenService.deleteAll(userId);
            return {
                message: "Đăng xuất khỏi tất cả thiết bị thành công",
            };
        } catch (error) {
            throw error;
        }
    }

    async me(userId) {
        try {
            const user = await userService.getById(userId);
            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }
            return {
                user,
            };
        } catch (error) {
            throw error;
        }
    }

    async resendVerifyEmail(email) {
        try {
            const user = await userService.findByEmail(email);
            if (!user) {
                const error = new Error("Email không tồn tại");
                error.statusCode = 404;
                throw error;
            }
            if (user.email_verified) {
                const error = new Error("Email đã được xác thực");
                error.statusCode = 409;
                throw error;
            }

            await queue.dispatch("sendVerifyEmailJob", {
                userId: user.id,
            });
            return {
                message: "Email xác thực đã được gửi lại",
            };
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            const user = await userService.findByEmail(email);
            if (!user) {
                return {
                    message:
                        "Nếu email tồn tại, link reset password đã được gửi",
                };
            }

            await queue.dispatch("sendResetPasswordEmailJob", {
                userId: user.id,
            });
            return {
                message: "Nếu email tồn tại, link reset password đã được gửi",
            };
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwtService.verifyResetPasswordToken(token);
            if (!decoded.isValid) {
                const error = new Error("Token reset password không hợp lệ");
                error.statusCode = 400;
                throw error;
            }

            const user = await userService.getById(decoded.userId, false);
            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            if (user.email !== decoded.email) {
                const error = new Error(
                    "Token không khớp với email người dùng"
                );
                error.statusCode = 400;
                throw error;
            }

            if (newPassword.length < 8) {
                const error = new Error("Password phải có ít nhất 8 ký tự");
                error.statusCode = 400;
                throw error;
            }

            const updatedUser = await userService.update(decoded.userId, {
                password: newPassword,
            });

            if (!updatedUser) {
                const error = new Error("Không thể cập nhật mật khẩu");
                error.statusCode = 500;
                throw error;
            }

            await refreshTokenService.deleteAll(user.id);

            await queue.dispatch("sendPasswordChangedEmailJob", {
                userId: user.id,
            });

            return {
                message: "Đặt lại mật khẩu thành công",
            };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                const expiredError = new Error(
                    "Token reset password đã hết hạn"
                );
                expiredError.statusCode = 410;
                throw expiredError;
            }
            throw error;
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await userService.getById(userId, false);
            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            const isValid = await userService.verifyPassword(
                user.id,
                currentPassword
            );
            if (!isValid) {
                const error = new Error("Mật khẩu hiện tại không đúng");
                error.statusCode = 400;
                throw error;
            }

            if (newPassword.length < 8) {
                const error = new Error("Password mới phải có ít nhất 8 ký tự");
                error.statusCode = 400;
                throw error;
            }

            if (currentPassword === newPassword) {
                const error = new Error(
                    "Mật khẩu mới phải khác mật khẩu hiện tại"
                );
                error.statusCode = 400;
                throw error;
            }

            const updatedUser = await userService.update(user.id, {
                password: newPassword,
            });

            if (!updatedUser) {
                const error = new Error("Không thể cập nhật mật khẩu mới");
                error.statusCode = 500;
                throw error;
            }

            await queue.dispatch("sendPasswordChangedEmailJob", {
                userId: user.id,
            });

            return {
                message: "Thay đổi mật khẩu thành công",
            };
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
module.exports = authService;
