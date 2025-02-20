const { body, validationResult, query } = require("express-validator");

class Validator {
    // 🔹 Middleware ตรวจสอบ Validation Errors
    static validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("Validation Passed"); // ✅ Debug จุดนี้
        next();
    }


    // 🔹 Middleware ตรวจสอบข้อมูลตอน Register
    static registerValidator() {
        return [
            body("username")
                .trim()
                .notEmpty().withMessage("Username is required")
                .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

            body("password")
                .notEmpty().withMessage("Password is required")
                .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

            body("confirmPass")
                .notEmpty().withMessage("Confirm Password is required")
                .custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error("Passwords do not match");
                    }
                    return true;
                })
        ];
    }

    static loginValidator() {
        return [
            body("username").notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
            body("password").notEmpty().withMessage("กรุณากรอกรหัสผ่าน")
        ]
    }

    static insertValidator() {
        return [
            body("title").notEmpty().withMessage("กรุณากรอกชื่อเรื่อง"),
            body("description").notEmpty().withMessage("กรุณากรอกรายละเอียด"),
            body("status").notEmpty().withMessage("กรุณาเลือกสถานะ"),
            body("priority").notEmpty().withMessage("กรุณาเลือกความสำคัญ"),
        ]
    }

    static searchTaskValidator() {
        return [
            query("title").optional().isString().withMessage("Title ต้องเป็นข้อความ"),
            query("status").optional().isIn(["pending", "completed", "in-progress"])
                .withMessage("Status ต้องเป็น pending, completed หรือ in-progress"),
        ]
    }
}

module.exports = Validator;
