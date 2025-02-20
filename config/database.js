require('dotenv').config();

const mongoose = require('mongoose');

const connect = () => {
    try {
        mongoose.connect(process.env.DATABASE);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1); // ปิดโปรแกรมถ้าเชื่อมต่อไม่ได้
    }
};

module.exports = { connect };
