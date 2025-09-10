const express = require("express");
const router = express.Router();

const insertController = require("@/controllers/insert.controller");
router.post("/", insertController.insert);

module.exports = router;
