const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], // จำกัดให้มีแค่ "user" หรือ "admin"
    default: "user" 
  }
});

// 🔒 Hash รหัสผ่านก่อนบันทึกลง Database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ถ้าไม่ได้เปลี่ยนรหัสผ่าน ให้ข้าม

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
