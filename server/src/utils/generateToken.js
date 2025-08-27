const crypto = require("crypto");
function generateToken() {
    const generateRandomToken = (length = 64) => {
        return crypto.randomBytes(length).toString("hex"); // ra chuỗi hex dài 128 ký tự
    };

    const refreshToken = generateRandomToken();

    return refreshToken;
}

module.exports = generateToken;
