const { REFRESH_TOKEN_EXPIRES_IN } = require("@/config/auth");
const { RefreshToken } = require("@/models");
const generateToken = require("@/utils/generateToken");
const { Op } = require("sequelize");

class RefreshTokenService {
    async generateUniqueToken() {
        let randToken = null;
        do {
            randToken = generateToken();
        } while (
            await RefreshToken.findOne({
                where: {
                    token: randToken,
                },
            })
        );
        return randToken;
    }

    async create(userId) {
        const token = await this.generateUniqueToken();

        const current = new Date();
        const expiredAt = new Date(
            current.getTime() + REFRESH_TOKEN_EXPIRES_IN * 1000
        );

        const refreshToken = await RefreshToken.create({
            userId: userId,
            token,
            expiredAt: expiredAt,
        });

        return {
            refreshToken: refreshToken.token,
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            expiredAt: refreshToken.expiredAt,
        };
    }

    // Find a valid refresh token
    async findValid(token) {
        try {
            const refreshToken = await RefreshToken.findOne({
                attributes: ["userId", "token", "expiredAt"],
                where: {
                    token: token,
                    expiredAt: {
                        [Op.gte]: new Date(),
                    },
                },
            });
            if (!refreshToken) {
                throw new Error("Refresh token không tồn tại hoặc đã hết hạn");
            }

            if (new Date() > refreshToken.expiredAt) {
                await this.delete(token);
                throw new Error("Refresh token không hợp hoặc đã hết hạn");
            }
            return refreshToken;
        } catch (error) {
            throw new Error("Refresh token không hợp lệ: " + error.message);
        }
    }

    async delete(tokenString) {
        try {
            const result = await RefreshToken.destroy({
                where: {
                    token: tokenString,
                },
            });
            return result > 0;
        } catch (error) {
            throw new Error("Xóa refresh token thất bại: " + error.message);
        }
    }

    // Delete all refresh tokens for a user
    async deleteAll(userId) {
        try {
            const result = await RefreshToken.destroy({
                where: { userId: userId },
            });
            return result;
        } catch (error) {
            throw new Error(
                "Không thể xóa tất cả refresh tokens: " + error.message
            );
        }
    }

    // ✅ THÊM MỚI: Method để cleanup token hết hạn
    async cleanupExpired() {
        try {
            const result = await RefreshToken.destroy({
                where: {
                    expiredAt: {
                        [Op.lt]: new Date(),
                    },
                },
            });
            console.log(`🧹 Cleaned up ${result} expired refresh tokens`);
            return result;
        } catch (error) {
            throw new Error("Cleanup expired tokens failed: " + error.message);
        }
    }

    // ✅ THÊM MỚI: Method để lấy thống kê token (optional)
    async getStats() {
        try {
            const total = await RefreshToken.count();
            const expired = await RefreshToken.count({
                where: {
                    expiredAt: {
                        [Op.lt]: new Date(),
                    },
                },
            });
            const active = total - expired;

            return { total, active, expired };
        } catch (error) {
            throw new Error("Get token stats failed: " + error.message);
        }
    }
}

const refreshTokenService = new RefreshTokenService();
module.exports = refreshTokenService;
