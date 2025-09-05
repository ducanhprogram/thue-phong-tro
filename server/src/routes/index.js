const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const insertRoute = require("./insert.route");
const categoryRoute = require("./category.route");
const postRoute = require("./post.route");
const priceRoute = require("./price.route");

router.use("/auth", authRoute);
router.use("/insert", insertRoute);
router.use("/category", categoryRoute);
router.use("/posts", postRoute);
router.use("/price", priceRoute);

module.exports = router;
