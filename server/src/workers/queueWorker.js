//queueWorker.js
require("module-alias/register");
const queueService = require("@/services/queue.service");
const sendVerifyEmailJob = require("@/jobs/sendVerifyEmailJob");
const sendResetPasswordEmailJob = require("@/jobs/sendResetPasswordEmailJob");
const sendPasswordChangeEmailJob = require("@/jobs/sendPasswordChangeEmailJob");

// Cấu hình retry
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const WORKER_INTERVAL = 1000; // 1 second

const handlers = {
    sendVerifyEmailJob,
    sendResetPasswordEmailJob,
    sendPasswordChangeEmailJob,
};

async function jobProcess(job) {
    const handler = handlers[job.type];

    if (!handler) {
        console.error(`No handler found for job type: ${job.type}`);
        await queueService.update(job.id, {
            status: "reject",
            error_message: `No handler found for job type: ${job.type}`,
        });
        return;
    }

    try {
        // Update status thành processing
        await queueService.update(job.id, {
            status: "processing",
            updatedAt: new Date(),
        });
        console.log(`Processing job ${job.id} (${job.type})`);

        // Thực hiện job
        await handler(job);

        // Update status thành completed
        await queueService.update(job.id, {
            status: "completed",
            updatedAt: new Date(),
        });
        console.log(`Job ${job.id} completed successfully`);
    } catch (error) {
        console.error(`Job ${job.id} failed:`, error.message);

        const newRetries = (job.retries || 0) + 1;

        if (newRetries <= MAX_RETRIES) {
            // Còn lượt retry, schedule lại sau một khoảng thời gian
            console.log(
                `Scheduling retry for job ${job.id} (Attempt ${newRetries}/${MAX_RETRIES})`
            );

            setTimeout(async () => {
                try {
                    await queueService.update(job.id, {
                        status: "pending",
                        retries: newRetries,
                        error_message: error.message,
                        updatedAt: new Date(),
                    });
                    console.log(`Job ${job.id} rescheduled for retry`);
                } catch (updateError) {
                    console.error(
                        `Failed to reschedule job ${job.id}:`,
                        updateError.message
                    );
                }
            }, RETRY_DELAY);
        } else {
            // Hết lượt retry, đánh dấu là reject
            await queueService.update(job.id, {
                status: "reject",
                error_message: error.message,
                updatedAt: new Date(),
            });
            console.log(`Job ${job.id} rejected after ${MAX_RETRIES} retries`);
        }
    }
}

async function queueWorker() {
    console.log("Queue Worker started...");

    while (true) {
        try {
            const jobs = await queueService.findPendingJobs();

            if (jobs.length > 0) {
                console.log(`Found ${jobs.length} pending jobs`);

                // Xử lý parallel để tăng performance
                await Promise.all(jobs.map((job) => jobProcess(job)));
            }

            // Chờ trước khi check lần tiếp theo
            await new Promise((resolve) => {
                setTimeout(resolve, WORKER_INTERVAL);
            });
        } catch (error) {
            console.error("Queue Worker error:", error.message);

            // Chờ lâu hơn khi có lỗi để tránh spam log
            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });
        }
    }
}

// Xử lý graceful shutdown
process.on("SIGINT", () => {
    console.log("Received SIGINT, shutting down gracefully...");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    process.exit(0);
});

// Start worker
queueWorker().catch((error) => {
    console.error("Failed to start queue worker:", error);
    process.exit(1);
});
