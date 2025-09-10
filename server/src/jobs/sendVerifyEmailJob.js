const { VERIFY_EMAIL_JWT_EXPIRES_IN } = require("@/config/auth");
const transporter = require("@/config/mailer");
const jwtService = require("@/services/jwt.service");
const userService = require("@/services/user.service");
const loadEmail = require("@/utils/loadEmail");

async function sendVerifyEmailJob(job) {
    try {
        const payload = JSON.parse(job.payload);
        const { userId } = payload;

        if (!userId) {
            throw new Error("Thiếu trường bắt buộc: userId");
        }

        const user = await userService.getById(userId);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        console.log(`Gửi email xác thực đến ${user.email}`);

        //Tạo token xác thực
        const verifyToken = jwtService.generateEmailVerifyToken(
            user.id,
            user.email
        );

        //Tạo verify URL
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

        console.log("Verify URL", verifyUrl);
        // Load Email template
        const emailHTML = await loadEmail("verifyEmail", {
            verifyUrl,
            expiresIn: VERIFY_EMAIL_JWT_EXPIRES_IN,
            name: user.name,
        });

        // Gui email
        const info = await transporter.sendMail({
            from: `"Phòng trọ giá rẻ" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Xác thực email của bạn",
            html: emailHTML,
        });

        console.log(
            `Email xác thực đã được gửi thành công đến ${user.email}`,
            info.messageId
        );

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error(`Lỗi khi gửi email xác thực:`, error.message);
        throw new Error(`Gửi email xác thực thất bại: ${error.message}`);
    }
}

module.exports = sendVerifyEmailJob;
