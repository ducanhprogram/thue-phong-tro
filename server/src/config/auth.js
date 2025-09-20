require("dotenv").config();
module.exports = {
    ACCESS_TOKEN_JWT_SECRET: process.env.ACCESS_TOKEN_JWT_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
    VERIFY_EMAIL_JWT_SECRET: process.env.VERIFY_EMAIL_JWT_SECRET,
    VERIFY_EMAIL_JWT_EXPIRES_IN: parseInt(
        process.env.VERIFY_EMAIL_JWT_EXPIRES_IN
    ), // 5 minutes

    RESETPASSWORD_JWT_SECRET: process.env.RESETPASSWORD_JWT_SECRET,
    RESETPASSWORD_JWT_EXPIRES_IN:
        parseInt(process.env.RESETPASSWORD_JWT_EXPIRES_IN) || 300, // 5 minutes
    TOKEN_TYPE: process.env.TOKEN_TYPE || "Bearer",
    REFRESH_TOKEN_EXPIRES_IN: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN), // 7 days
};
