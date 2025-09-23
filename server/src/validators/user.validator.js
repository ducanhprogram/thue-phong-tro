const { checkSchema } = require("express-validator");
const handleValidation = require("@/middlewares/handleValidation");
const { User } = require("@/models");

// Regex cho số điện thoại Việt Nam
const vietnamesePhoneRegex =
    /^(\+84|84|0)(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;

// Validation cho cập nhật profile
const updateProfile = [
    checkSchema({
        name: {
            optional: true,
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
            optional: true,
            custom: {
                options: async (value, { req }) => {
                    if (!value) return true;

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

                    // Check if phone already exists in database (exclude current user)
                    const userId = req.user?.id;
                    const whereCondition = { phone: normalizedPhone };

                    if (userId) {
                        whereCondition.id = {
                            [require("sequelize").Op.ne]: userId,
                        };
                    }

                    const existingUser = await User.findOne({
                        where: whereCondition,
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
        zalo: {
            optional: true,
            isLength: {
                options: { max: 20 },
                errorMessage: "Zalo không được vượt quá 20 ký tự",
            },
        },
        facebook_url: {
            optional: true,
            isURL: {
                errorMessage: "Facebook URL không đúng định dạng",
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Facebook URL không được vượt quá 255 ký tự",
            },
        },
    }),
    handleValidation,
];

// Validation cho cập nhật user (admin)
const updateUser = [
    checkSchema({
        name: {
            optional: true,
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
        email: {
            optional: true,
            isEmail: {
                errorMessage: "Email không đúng định dạng",
            },
            normalizeEmail: true,
            custom: {
                options: async (value, { req }) => {
                    if (!value) return true;

                    // Check if email already exists (exclude current user)
                    const userId = req.params?.id;
                    const whereCondition = { email: value };

                    if (userId) {
                        whereCondition.id = {
                            [require("sequelize").Op.ne]: userId,
                        };
                    }

                    const existingUser = await User.findOne({
                        where: whereCondition,
                    });

                    if (existingUser) {
                        throw new Error("Email đã được sử dụng");
                    }

                    return true;
                },
            },
        },
        phone: {
            optional: true,
            custom: {
                options: async (value, { req }) => {
                    if (!value) return true;

                    const cleanPhone = value.replace(/[\s\-\.]/g, "");

                    if (!vietnamesePhoneRegex.test(cleanPhone)) {
                        throw new Error(
                            "Số điện thoại không đúng định dạng. VD: 0987654321, +84987654321"
                        );
                    }

                    let normalizedPhone = cleanPhone;
                    if (cleanPhone.startsWith("+84")) {
                        normalizedPhone = "0" + cleanPhone.substring(3);
                    } else if (cleanPhone.startsWith("84")) {
                        normalizedPhone = "0" + cleanPhone.substring(2);
                    }

                    const userId = req.params?.id;
                    const whereCondition = { phone: normalizedPhone };

                    if (userId) {
                        whereCondition.id = {
                            [require("sequelize").Op.ne]: userId,
                        };
                    }

                    const existingUser = await User.findOne({
                        where: whereCondition,
                    });

                    if (existingUser) {
                        throw new Error("Số điện thoại đã được sử dụng");
                    }

                    return true;
                },
            },
            customSanitizer: {
                options: (value) => {
                    if (!value) return value;

                    const cleanPhone = value.replace(/[\s\-\.]/g, "");

                    if (cleanPhone.startsWith("+84")) {
                        return "0" + cleanPhone.substring(3);
                    } else if (cleanPhone.startsWith("84")) {
                        return "0" + cleanPhone.substring(2);
                    }

                    return cleanPhone;
                },
            },
        },
        zalo: {
            optional: true,
            isLength: {
                options: { max: 20 },
                errorMessage: "Zalo không được vượt quá 20 ký tự",
            },
        },
        facebook_url: {
            optional: true,
            isURL: {
                errorMessage: "Facebook URL không đúng định dạng",
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Facebook URL không được vượt quá 255 ký tự",
            },
        },
        email_verified: {
            optional: true,
            isBoolean: {
                errorMessage: "Email verified phải là boolean",
            },
        },
    }),
    handleValidation,
];

const userValidator = {
    updateProfile,
    updateUser,
};

module.exports = userValidator;
