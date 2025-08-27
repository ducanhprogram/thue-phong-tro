const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const insertRoute = require("./insert.route");

router.use("/auth", authRoute);
router.use("/insert", insertRoute);
module.exports = router;
