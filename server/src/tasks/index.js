require("module-alias/register");
const scheduleJob = require("@/utils/scheduler");
const retryFailedJobs = require("./retryFailedJobs");
const cleanupRefreshTokens = require("./cleanupRefreshTokens");
//"*/5 * * * *"  Mỗi 5 phút retry lại các job lỗi
scheduleJob("retry_failed_jobs", "*/5 * * * *", retryFailedJobs);

// 6 tiếng dọn dẹp refresh_token hết hạn
scheduleJob("cleanup_refresh_tokens", "0 */6 * * *", cleanupRefreshTokens);
