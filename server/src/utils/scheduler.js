const cron = require("node-cron");
require("module-alias/register");

const activeTasks = {};

function scheduleJob(name, cronTime, handler) {
    if (activeTasks[name]) {
        return console.log(`Task "${name}" exists, cancelled..`);
    }

    const task = cron.schedule(cronTime, () => {
        try {
            handler();
        } catch (error) {
            console.log(error);
        }
    });
    activeTasks[name] = task;
}

module.exports = scheduleJob;
