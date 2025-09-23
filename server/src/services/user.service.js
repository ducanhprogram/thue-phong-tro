const { User } = require("@/models"); // Adjust path to your models
const { hashPassword, comparePassword } = require("@/utils/bcrypt");

class UserService {
    async getAll(page = 1, limit = 10, options = {}) {
        try {
            const {
                limit = 10,
                offset = (page - 1) * limit,
                where = {},
                order = [["createdAt", "DESC"]],
                attributes = { exclude: ["password"] }, // Loại bỏ password khỏi kết quả
            } = options;

            const users = await User.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order,
                attributes,
            });

            return {
                users: users.rows,
                pagination: {
                    total: users.count,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    totalPages: Math.ceil(users.count / limit),
                },
            };
        } catch (error) {
            console.error("Error getting all users:", error);
            throw error;
        }
    }

    /**
     * Lấy user theo ID
     */
    async getById(id, options = {}) {
        try {
            const { attributes = { exclude: ["password"] }, include = [] } =
                options;

            const user = await User.findByPk(id, {
                attributes,
                include,
            });

            return user; // Trả về trực tiếp user hoặc null
        } catch (error) {
            console.error("Error getting user by id:", error);
            throw error;
        }
    }

    /**
     * Tìm user theo email
     */
    async findByEmail(email, options = {}) {
        try {
            const { attributes = { exclude: ["password"] }, include = [] } =
                options;

            const user = await User.findOne({
                where: { email },
                attributes,
                include,
            });

            return user; // Trả về trực tiếp user hoặc null
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    }

    async findByPhone(phone, options = {}) {
        try {
            const { attributes = { exclude: ["password"] }, include = [] } =
                options;

            const user = await User.findOne({
                where: { phone },
                attributes,
                include,
            });

            return user; // Trả về trực tiếp user hoặc null
        } catch (error) {
            console.error("Error finding user by phone:", error);
            throw error;
        }
    }

    /**
     * Tạo user mới
     */
    async create(userData) {
        try {
            // Kiểm tra email đã tồn tại
            if (userData.email) {
                const existingUser = await User.findOne({
                    where: { email: userData.email },
                });

                if (existingUser) {
                    const error = new Error("Email đã được sử dụng");
                    error.statusCode = 409;
                    throw error;
                }
            }

            // Hash password nếu có
            if (userData.password) {
                userData.password = await hashPassword(userData.password);
            }

            const user = await User.create(userData);

            // Loại bỏ password khỏi response
            const { password, ...userWithoutPassword } = user.toJSON();

            return userWithoutPassword; // Trả về user object
        } catch (error) {
            console.error("Error creating user:", error);

            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                const validationError = new Error(
                    `Dữ liệu không hợp lệ: ${validationErrors.join(", ")}`
                );
                validationError.statusCode = 400;
                throw validationError;
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const uniqueError = new Error(
                    "Dữ liệu đã tồn tại trong hệ thống"
                );
                uniqueError.statusCode = 409;
                throw uniqueError;
            }

            throw error;
        }
    }

    /**
     * Cập nhật user
     */
    async update(id, updateData) {
        try {
            const user = await User.findByPk(id);

            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            // Kiểm tra email đã tồn tại (nếu đang cập nhật email)
            if (updateData.email && updateData.email !== user.email) {
                const existingUser = await User.findOne({
                    where: {
                        email: updateData.email,
                        id: { [require("sequelize").Op.ne]: id }, // Loại trừ user hiện tại
                    },
                });

                if (existingUser) {
                    const error = new Error(
                        "Email đã được sử dụng bởi tài khoản khác"
                    );
                    error.statusCode = 409;
                    throw error;
                }
            }

            // Hash password mới nếu có
            if (updateData.password) {
                updateData.password = await hashPassword(updateData.password);
            }

            // Cập nhật user
            await user.update(updateData);

            // Lấy user đã cập nhật (loại bỏ password)
            const updatedUser = await User.findByPk(id, {
                attributes: { exclude: ["password"] },
            });

            return updatedUser; // Trả về user object
        } catch (error) {
            console.error("Error updating user:", error);

            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                const validationError = new Error(
                    `Dữ liệu không hợp lệ: ${validationErrors.join(", ")}`
                );
                validationError.statusCode = 400;
                throw validationError;
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const uniqueError = new Error(
                    "Dữ liệu đã tồn tại trong hệ thống"
                );
                uniqueError.statusCode = 409;
                throw uniqueError;
            }

            throw error;
        }
    }

    /**
     * Cập nhật profile user (chỉ các trường được phép)
     */
    async updateProfile(id, updateData) {
        try {
            const user = await User.findByPk(id);

            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            // Kiểm tra phone đã tồn tại (nếu đang cập nhật phone)
            if (updateData.phone && updateData.phone !== user.phone) {
                const existingUser = await User.findOne({
                    where: {
                        phone: updateData.phone,
                        id: { [require("sequelize").Op.ne]: id },
                    },
                });

                if (existingUser) {
                    const error = new Error(
                        "Số điện thoại đã được sử dụng bởi tài khoản khác"
                    );
                    error.statusCode = 409;
                    throw error;
                }
            }

            // Chỉ cho phép cập nhật các trường profile
            const allowedFields = [
                "name",
                "phone",
                "zalo",
                "facebook_url",
                "avatar",
            ];
            const filteredData = {};

            Object.keys(updateData).forEach((key) => {
                if (allowedFields.includes(key)) {
                    filteredData[key] = updateData[key];
                }
            });

            // Validate dữ liệu
            if (filteredData.name && filteredData.name.trim().length === 0) {
                const error = new Error("Tên không được để trống");
                error.statusCode = 400;
                throw error;
            }

            if (filteredData.phone) {
                const phoneRegex = /^[0-9]{10,11}$/;
                if (!phoneRegex.test(filteredData.phone)) {
                    const error = new Error(
                        "Số điện thoại không đúng định dạng (10-11 chữ số)"
                    );
                    error.statusCode = 400;
                    throw error;
                }
            }

            if (filteredData.name && filteredData.name.length > 50) {
                const error = new Error("Tên không được vượt quá 50 ký tự");
                error.statusCode = 400;
                throw error;
            }

            // Cập nhật user
            await user.update(filteredData);

            // Lấy user đã cập nhật (loại bỏ password)
            const updatedUser = await User.findByPk(id, {
                attributes: { exclude: ["password"] },
            });

            return updatedUser;
        } catch (error) {
            console.error("Error updating user profile:", error);

            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                const validationError = new Error(
                    `Dữ liệu không hợp lệ: ${validationErrors.join(", ")}`
                );
                validationError.statusCode = 400;
                throw validationError;
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const uniqueError = new Error(
                    "Dữ liệu đã tồn tại trong hệ thống"
                );
                uniqueError.statusCode = 409;
                throw uniqueError;
            }

            throw error;
        }
    }

    /**
     * Xóa user
     */
    async remove(id) {
        try {
            const user = await User.findByPk(id);

            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            await user.destroy();
            return { success: true, message: "Xóa người dùng thành công" };
        } catch (error) {
            console.error("Error removing user:", error);
            throw error;
        }
    }

    /**
     * Xác thực password
     */
    async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await comparePassword(plainPassword, hashedPassword);
        } catch (error) {
            console.error("Error verifying password:", error);
            const verifyError = new Error("Lỗi khi xác thực mật khẩu");
            verifyError.statusCode = 500;
            throw verifyError;
        }
    }

    /**
     * Cập nhật trạng thái xác thực email
     */
    async verifyEmail(userId) {
        try {
            const user = await User.findByPk(userId);
            console.log("user service", user);

            if (!user) {
                const error = new Error("Người dùng không tồn tại");
                error.statusCode = 404;
                throw error;
            }

            const [updated] = await User.update(
                {
                    email_verified: true,
                    email_verified_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    where: { id: userId },
                }
            );

            console.log("Updated", updated);

            if (updated === 0) {
                const error = new Error(
                    "Không thể cập nhật trạng thái xác thực email"
                );
                error.statusCode = 500;
                throw error;
            }

            return updated > 0;
        } catch (error) {
            console.error("Error verifying email:", error);
            throw error;
        }
    }
}

const userService = new UserService();
module.exports = userService;
