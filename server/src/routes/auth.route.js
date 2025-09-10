const express = require("express");
const router = express.Router();
const authController = require("@/controllers/auth.controller");
const authValidator = require("@/validators/auth.validator");
const checkAuth = require("@/middlewares/checkAuth");

router.post("/register", authValidator.register, authController.register);
router.post("/login", authValidator.login, authController.login);

router.post("/refresh-token", authController.refreshToken);
router.post("/verify-email/:token", authController.verifyEmail);

router.post("/forgot-password", authController.forgotPassword);
router.post("/resend-verify-email", authController.resendVerifyEmail);
router.post("/reset-password/:token", authController.resetPassword);

// Routes cần xác thực - sử dụng checkAuth middleware
router.get("/me", checkAuth, authController.me);
router.post("/logout", authController.logout);
router.post("/logout-all", checkAuth, authController.logoutAll);
router.post("/change-password", checkAuth, authController.changePassword);

module.exports = router;
