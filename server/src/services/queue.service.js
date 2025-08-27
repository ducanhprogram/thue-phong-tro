const { Queue } = require("@/models");

class QueueService {
    async getAll() {
        const { count, rows } = await Queue.findAndCountAll({
            order: [["createdAt", "DESC"]],
        });
        return { items: rows, total: count };
    }

    async findPendingJobs() {
        return await Queue.findAll({
            where: {
                status: "pending",
            },
            order: [["createdAt", "ASC"]], // Lấy job cũ nhất trước
        });
    }

    async getById(id) {
        return await Queue.findByPk(id);
    }

    async create(data) {
        // Sequelize sẽ tự động set default values nếu không có
        const queueData = {
            ...data,
            status: data.status || "pending",
            retries: data.retries || 0,
        };
        const newQueue = await Queue.create(queueData);
        return newQueue.toJSON();
    }

    async update(id, data) {
        const queue = await Queue.findByPk(id);
        if (!queue) {
            return null;
        }

        //Update
        await queue.update(data);
        // Trả về bản ghi đã cập nhật
        return await this.getById(id);
    }

    async remove(id) {
        const result = await Queue.destroy({
            where: {
                id: id,
            },
        });

        // result trả về số lượng record bị xóa
        return result > 0;
    }

    async getFailedJobs() {
        return await Queue.findAll({
            where: {
                status: "reject",
                // Không cần check retries < max_retries vì trong logic mới
                // ta sẽ reset retries về 0 khi retry
            },
            order: [["createdAt", "ASC"]],
        });
    }

    // Thêm method để lấy jobs theo status
    async getJobsByStatus(status) {
        return await Queue.findAll({
            where: {
                status: status,
            },
            order: [["createdAt", "DESC"]],
        });
    }

    // Method để đếm jobs theo status
    async countByStatus(status) {
        return await Queue.count({
            where: {
                status: status,
            },
        });
    }
}

const queueService = new QueueService();
module.exports = queueService;
