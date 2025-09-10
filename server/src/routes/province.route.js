const express = require("express");

const router = express.Router();
const provinceController = require("@/controllers/province.controller");
router.get("/", provinceController.getProvinces);

module.exports = router;
