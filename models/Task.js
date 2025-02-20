const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // ✅ ลบช่องว่างซ้าย-ขวาอัตโนมัติ
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"], // ✅ ควบคุมค่าสถานะ
        default: "pending",
        required: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"], // ✅ ควบคุมระดับความสำคัญ
        default: "medium",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // ✅ บันทึกเวลาสร้างอัตโนมัติ
    },
    updatedAt: {
        type: Date
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    } // ✅ Soft Delete
});

// ✅ Middleware อัปเดต `updatedAt` ทุกครั้งที่มีการแก้ไข Task
taskSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model("Task", taskSchema);
