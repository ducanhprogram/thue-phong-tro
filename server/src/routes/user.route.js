const express = require("express");
const router = express.Router();
const userController = require("@/controllers/user.controller");
const userValidator = require("@/validators/user.validator");
const checkAuth = require("@/middlewares/checkAuth");

router.get("/profile", checkAuth, userController.getProfile);
router.put(
    "/update-profile",
    checkAuth,
    userValidator.updateProfile,
    userController.updateProfile
);

router.post("/change-avatar", checkAuth, userController.changeAvatar);

module.exports = router;
