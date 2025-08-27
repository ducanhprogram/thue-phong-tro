const queueService = require("@/services/queue.service");

const spawn = require("child_process").spawn;

async function retryFailedJobs() {
    //Lấy toàn bộ rejected jobs, update status thành "pending"
    try {
        const failedJobs = await queueService.getFailedJobs();

        if (failedJobs.length === 0) {
            console.log("Không có job nào cần retry");
            return {
                success: true,
                retriedCount: 0,
            };
        }

        let retriedCount = 0;

        for (const job of failedJobs) {
            // Reset lại status thành "pending" để queue worker xử lý lại
            await queueService.update(job.id, {
                status: "pending",
                retries_count: 0,
                updated_at: new Date(),
            });
            retriedCount++;
        }
        console.log(`Đã retry ${retriedCount} failed jobs`);

        return {
            success: true,
            retriedCount,
            message: `Đã retry ${retriedCount} jobs thất bại`,
        };
    } catch (error) {
        console.error("Lỗi khi retry failed jobs:", error);
        throw error;
    }
}

module.exports = retryFailedJobs;
