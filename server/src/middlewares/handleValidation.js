const { validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        console.log("Validation errors:", result.array()); // Debug log
        return res.status(400).json({
            success: false,
            message: "Lỗi validate",
            errors: result.array(), // Thêm chi tiết lỗi
        });
    }
    if (result.isEmpty()) {
        return next();
    }

    res.error(400, "Lỗi validate", { errors: result.array() });
};

module.exports = handleValidation;
