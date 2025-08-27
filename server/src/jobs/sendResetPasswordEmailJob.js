const { RESETPASSWORD_JWT_EXPIRES_IN } = require("@/config/auth");
const transporter = require("@/config/mailer");
const jwtService = require("@/services/jwt.service");
const userService = require("@/services/user.service");
const loadEmail = require("@/utils/loadEmail");

async function sendResetPasswordEmailJob(job) {
    try {
        const payload = JSON.parse(job.payload);
        const { userId } = payload;

        if (!userId) {
            throw new Error("Thiếu các trường bắt buộc: userId");
        }

        const user = await userService.getById(userId, false);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        const resetToken = jwtService.generateResetPasswordToken(
            user.id,
            user.email
        );
        //Tạo rest password
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const emailHTML = await loadEmail("resetPasswordEmail", {
            resetUrl,
            name: user.name,
            email: user.email,
            expiresIn: RESETPASSWORD_JWT_EXPIRES_IN,
        });

        //Gửi email
        const info = await transporter.sendMail({
            from: `Phòng trọ giá rẻ <${process.env.EMAIL_USER}`,
            to: user.email,
            subject: "Đặt lại mật khẩu",
            html: emailHTML,
        });

        console.log(
            `Đặt lại mật khẩu thành công gửi đến ${user.email}:`,
            info.messageId
        );

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error(`Đặt lại mật khẩu thất bại: ${error.message}`);
    }
}

module.exports = sendResetPasswordEmailJob;
