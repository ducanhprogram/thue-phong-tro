require("module-alias/register");
const express = require("express");
require("dotenv").config();
const methodOverride = require("method-override");
const cors = require("cors");
const router = require("@/routes");
const { sequelize } = require("@/models");

const handlerNotFound = require("@/middlewares/errors/handleNotFound");
const responseEnhancer = require("@/middlewares/responseEnhancer");
const handleErrors = require("@/middlewares/errors/handleErrors");

const app = express();
const port = 3000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true, //Cho phép cookies cross-origin
        optionsSuccessStatus: 200,
    })
);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(responseEnhancer);

//Routes
app.use("/api/v1", router);

// Error handlers (phải đặt sau routes)
app.use(handlerNotFound);
app.use(handleErrors);

// Import tasks để khởi chạy scheduler
require("@/tasks");

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    try {
        //check database
        await sequelize.authenticate();
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error("Unable to connect to database:", error);
    }
});

module.exports = app;
