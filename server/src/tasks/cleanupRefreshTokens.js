require("module-alias/register");
const refreshTokenService = require("@/services/refreshToken.service");

async function cleanupRefreshTokens() {
    try {
        console.log("🧹 Bắt đầu dọn dẹp refresh token hết hạn...");

        const deletedCount = await refreshTokenService.cleanupExpired();

        if (deletedCount > 0) {
            console.log(`✅ Đã xóa ${deletedCount} refresh token hết hạn`);
        } else {
            console.log("ℹ️ Không có refresh token hết hạn nào");
        }

        // Log thống kê (optional)
        const stats = await refreshTokenService.getStats();
        console.log(
            `📊 Thống kê token - Tổng: ${stats.total}, Hoạt động: ${stats.active}, Hết hạn: ${stats.expired}`
        );
    } catch (error) {
        console.error("❌ Lỗi khi dọn dẹp refresh token:", error.message);
    }
}

module.exports = cleanupRefreshTokens;
