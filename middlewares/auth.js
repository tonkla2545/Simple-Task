const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = process.env;

class Auth {
    static tokenVerify(req, res, next) {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
        // console.log("Token from cookie:", req.cookies.token);
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, Token missing" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            // console.log("Decoded Token:", decoded); // ✅ Debug ตรงนี้ดูว่าถอดรหัสได้ไหม
    
            req.user = { 
                user_id: decoded.user_id, 
                role: decoded.role  // ✅ เพิ่ม role ตรงนี้
            }; 
            next(); // ✅ **เพิ่มตรงนี้ให้โค้ดทำงานต่อ**
        } catch (error) {
            console.error("JWT Error:", error.message); // ✅ ดูว่ามี error อะไรเกิดขึ้น
            res.status(403).json({ message: "Invalid Token" });
        }
    }

    // ✅ ตรวจสอบว่า user เป็น admin หรือไม่
    static adminVerify(req, res, next) {
        // ส่งมาจาก tokenVerify
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล" });
        }
        next();
    }

    // static async adminVerify(req,res,next){
    //     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    //     if (!token) {
    //         return res.status(401).json({ message: "Unauthorized, Token missing" });
    //     }
        
    //     try{
    //         const data = jwt.verify(token,process.env.TOKEN_KEY)
    //         const role = data.role
    //         if(role !== 'admin'){
    //             return res.status(401).json({message: "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล"})
    //         }
    //         req.user = data
    //         next();
    //     } catch(err){
    //         res.status(err)
    //     }
    // }
    
}

module.exports = Auth