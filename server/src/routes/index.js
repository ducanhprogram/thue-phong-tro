const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const insertRoute = require("./insert.route");
const categoryRoute = require("./category.route");
const postRoute = require("./post.route");
const priceRoute = require("./price.route");
const areaRoute = require("./area.route");
const provinceRoute = require("./province.route");
const userRoute = require("./user.route");

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/insert", insertRoute);
router.use("/category", categoryRoute);
router.use("/posts", postRoute);
router.use("/price", priceRoute);
router.use("/area", areaRoute);
router.use("/province", provinceRoute);

module.exports = router;
