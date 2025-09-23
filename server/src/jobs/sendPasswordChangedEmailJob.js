const transporter = require("@/config/mailer");
const userService = require("@/services/user.service");
const loadEmail = require("@/utils/loadEmail");

async function sendPasswordChangedEmailJob(job) {
    try {
        const payload = JSON.parse(job.payload);
        const { userId } = payload;
        if (!userId) {
            throw new Error("Thiếu các trường bắt buộc");
        }

        const user = await userService.getById(userId, false);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        console.log(`Gửi email thông báo thay đổi mật khẩu đến ${user.email}`);

        //Tạo loginUrl
        const loginUrl = `${process.env.FRONTEND_URL}/login`;

        const emailHTML = await loadEmail("passwordChangeEmail", {
            loginUrl,
            email: user.email,
            name: user.name,
        });

        const info = await transporter.sendMail({
            from: `"Phòng trọ giá rẻ" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Mật khẩu đã được thay đổi",
            html: emailHTML,
        });
        console.log(
            ` Mật khẩu đã thay đổi, email đã được gửi thành công đến ${user.email}:`,
            info.messageId
        );
        return {
            success: true,
            info: info.messageId,
        };
    } catch (error) {
        console.error("Lỗi khi gửi email thay đổi mật khẩu");
        throw new Error("Không gửi được email thay đổi mật khẩu");
    }
}

module.exports = sendPasswordChangedEmailJob;
