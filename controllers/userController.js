const User = require('../models/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class UserController {
    static async index(req, res, next) {
        try {
            const user = await User.find()
            res.json(user)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }

    }

    static async register(req, res) {
        try {
            const { username, password, confirmPass } = req.body

            const oldUser = await User.findOne({username:username})
            if (oldUser) {
                return res.status(400).json({ message: "Invalid email format" })
            }

            const user = new User({ username, password: password });
            await user.save();

            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                { expiresIn: "1h" }
            );

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }

    }

    static async login(req, res) {
        try {
            const { username, password } = req.body

            const user = await User.findOne({ username: username })
            if (!user) {
                return res.status(400).json({ message: "ไม่มีชื่อผู้ใช้กรุณาสมัครสมาชิก" })
            }

            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch) {
                return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" })
            }

            const token = jwt.sign(
                { user_id: user._id, username, role: user.role },
                process.env.TOKEN_KEY,
                { expiresIn: '1h' }
            );

            // ✅ ส่ง JWT Token ผ่าน httpOnly cookie
            res.cookie("token", token, {
                httpOnly: true, // ป้องกันการเข้าถึงผ่าน JavaScript (ลดความเสี่ยง XSS)
                secure: process.env.NODE_ENV === "production", // ใช้ secure mode เฉพาะ production
                maxAge: 3600000 // หมดอายุใน 1 ชั่วโมง
            });

            res.json({ message: "Login successful" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    static logout(req, res) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.json({ message: "Logout successful" });
    }
}

module.exports = UserController