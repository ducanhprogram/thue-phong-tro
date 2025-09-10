const { checkSchema } = require("express-validator");
const handleValidation = require("@/middlewares/handleValidation");
const { User } = require("@/models");

// Password must meet the following criteria:
// - Minimum 8 characters
// - At least one uppercase letter (A–Z)
// - At least one lowercase letter (a–z)
// - At least one digit (0–9)
// - At least one special character (e.g., !@#$%^&*)
const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const register = [
    checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: "Email không hợp lệ",
            custom: {
                options: async (value) => {
                    const existing = await User.findOne({
                        where: { email: value },
                    });
                    if (existing) {
                        throw new Error("Email đã được sử dụng");
                    }
                    return true;
                },
            },
        },
        password: {
            notEmpty: {
                errorMessage: "Mật khẩu không được để trống",
            },
            custom: {
                options: (value) => {
                    if (!strongPasswordRegex.test(value)) {
                        throw new Error(
                            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
                        );
                    }
                    return true;
                },
            },
        },
        name: {
            notEmpty: {
                errorMessage: "Tên không được để trống",
            },
            isString: {
                errorMessage: "Tên phải là chuỗi",
            },
            isLength: {
                options: { min: 2, max: 50 },
                errorMessage: "Tên phải có độ dài từ 2-50 ký tự",
            },
            matches: {
                options: [/^[\p{L} ]+$/u],
                errorMessage: "Tên chỉ được chứa chữ cái và dấu cách",
            },
        },
    }),
    handleValidation,
];

const login = [
    checkSchema({
        email: {
            normalizeEmail: true,
            notEmpty: {
                errorMessage: "Email là bắt buộc",
            },
            isEmail: {
                errorMessage: "Email không đúng định dạng",
            },
        },
        password: {
            notEmpty: {
                errorMessage: "Mật khẩu không được để trống",
            },
        },
    }),
    handleValidation,
];

const authValidator = {
    register,
    login,
};

module.exports = authValidator;
