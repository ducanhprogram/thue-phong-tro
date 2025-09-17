const jwtService = require("@/services/jwt.service");
const { User } = require("@/models");

module.exports = async function checkAuth(req, res, next) {
    try {
        const accessToken = req.headers?.authorization?.replace("Bearer ", "");
        if (!accessToken) {
            return res.error(401, "accessToken không được cung cấp");
        }

        const payload = jwtService.verifyAccessToken(accessToken);
        if (!payload) {
            console.log("Invalid token payload");
            return res.error(401, "accessToken không hợp lệ");
        }

        const user = await User.findOne({
            where: { id: payload.userId },
            attributes: [
                "id",
                "email",
                "name",
                "avatar",
                "facebook_url",
                "createdAt",
            ],
        });
        if (!user) {
            return res.error(401, "User không tồn tại");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.error(401, "accessToken không hợp lệ", error.message);
    }
};
