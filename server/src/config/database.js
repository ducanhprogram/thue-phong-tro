const fs = require("fs");
require("dotenv").config();

module.exports = {
    development: {
        dialect: "mysql",
        logging: false,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: "127.0.0.1",
        port: process.env.DB_PORT,
        timezone: "+07:00",
        dialectOptions: {
            bigNumberStrings: true,
            timezone: "+07:00",
        },
        logging: false,
    },
    test: {
        username: process.env.CI_DB_USERNAME,
        password: process.env.CI_DB_PASSWORD,
        database: process.env.CI_DB_NAME,
        host: "127.0.0.1",
        port: 3306,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    production: {
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOSTNAME,
        port: process.env.PROD_DB_PORT,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true,
            ssl: {
                // ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
            },
        },
    },
};
