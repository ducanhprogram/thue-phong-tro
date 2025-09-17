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

const vietnamesePhoneRegex =
    /^(\+84|84|0)(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
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
        phone: {
            notEmpty: {
                errorMessage: "Số điện thoại không được để trống",
            },
            custom: {
                options: async (value) => {
                    // Remove all spaces and special characters except + for validation
                    const cleanPhone = value.replace(/[\s\-\.]/g, "");

                    // Check format
                    if (!vietnamesePhoneRegex.test(cleanPhone)) {
                        throw new Error(
                            "Số điện thoại không đúng định dạng. VD: 0987654321, +84987654321"
                        );
                    }

                    // Normalize phone number for database check
                    let normalizedPhone = cleanPhone;
                    if (cleanPhone.startsWith("+84")) {
                        normalizedPhone = "0" + cleanPhone.substring(3);
                    } else if (cleanPhone.startsWith("84")) {
                        normalizedPhone = "0" + cleanPhone.substring(2);
                    }

                    // Check if phone already exists in database
                    const existingUser = await User.findOne({
                        where: { phone: normalizedPhone },
                    });

                    if (existingUser) {
                        throw new Error("Số điện thoại đã được sử dụng");
                    }

                    return true;
                },
            },
            // Sanitizer to normalize phone format
            customSanitizer: {
                options: (value) => {
                    if (!value) return value;

                    // Remove all spaces and special characters except +
                    const cleanPhone = value.replace(/[\s\-\.]/g, "");

                    // Normalize to format starting with 0
                    if (cleanPhone.startsWith("+84")) {
                        return "0" + cleanPhone.substring(3);
                    } else if (cleanPhone.startsWith("84")) {
                        return "0" + cleanPhone.substring(2);
                    }

                    return cleanPhone;
                },
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
