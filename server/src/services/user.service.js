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
            throw new Error(
                `Lỗi khi lấy danh sách người dùng: ${error.message}`
            );
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
            throw new Error(
                `Lỗi khi lấy thông tin người dùng: ${error.message}`
            );
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
            throw new Error(
                `Lỗi khi tìm người dùng theo email: ${error.message}`
            );
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
                    throw new Error("Email đã được sử dụng");
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
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                throw new Error(
                    `Dữ liệu không hợp lệ: ${validationErrors.join(", ")}`
                );
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
                return null; // Trả về null nếu không tìm thấy
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
                    throw new Error(
                        "Email đã được sử dụng bạn vui lòng kiểm tra lại."
                    );
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
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                throw new Error(
                    `Dữ liệu không hợp lệ: ${validationErrors.join(", ")}`
                );
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
                return false; // Trả về false nếu không tìm thấy
            }

            await user.destroy();
            return true; // Trả về true nếu xóa thành công
        } catch (error) {
            throw new Error(`Lỗi khi xóa người dùng: ${error.message}`);
        }
    }

    /**
     * Xác thực password
     */
    async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await comparePassword(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error(`Lỗi khi xác thực password: ${error.message}`);
        }
    }

    /**
     * Cập nhật trạng thái xác thực email
     */
    async verifyEmail(userId) {
        const user = await User.findByPk(userId);
        console.log("user service", user);
        if (!user) {
            return false;
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

        return updated > 0;
    }
}

const userService = new UserService();
module.exports = userService;
