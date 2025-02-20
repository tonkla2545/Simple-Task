const Task = require('../models/Task');
const User = require('../models/User')

class taskController {
    static async indexTask(req,res){
        try{
            const T_id = req.params.id

            const task = await Task.findById(T_id)
            if(!task){
                return res.status(404).json({message:"Task not found"})
            }
            res.status(200).json({title:task.title,description:task.description,status:task.status,priority:task.priority,isDeleted:task.isDeleted});

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
    // ถ้าต้องการ ประมวลผลเพิ่มเติม เช่น รวมข้อมูลจากหลาย Collection, คำนวณ, นับ, คัดกรอง → ใช้ Aggregation Pipeline ($lookup, $match, $group, $project)
    // static async allTask(req, res) {
    //     try {
    //         // ดึงข้อมูล Task พร้อมข้อมูล user ที่สร้าง Task
    //         const tasks = await Task.aggregate([
    //             {
    //                 $lookup: {
    //                     from: "users", // เชื่อมกับ collection 'users'
    //                     localField: "createdBy",
    //                     foreignField: "_id",
    //                     as: "creator"
    //                 }
    //             },
    //             {
    //                 $unwind: "$creator" // แปลง Array เป็น Object
    //             },
    //             {
    //                 $project: {
    //                     title: 1,
    //                     description: 1,
    //                     status: 1,
    //                     priority: 1,
    //                     createdAt: 1,
    //                     updatedAt: 1,
    //                     "creator.username": 1 // แสดงเฉพาะ username ของผู้ใช้
    //                 }
    //             }
    //         ]);
    
    //         if (!tasks.length) {
    //             return res.status(404).json({ message: "Task not found" });
    //         }
    
    //         res.status(200).json({ tasks });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: "Server error" });
    //     }
    // }
    

    // static async allTask(req, res) {
    //     try {
    //         // ดึงข้อมูล Task พร้อมชื่อของผู้ใช้
    //         const task = await Task.find().populate("createdBy", "username");
    
    //         if (!task || task.length === 0) {
    //             return res.status(404).json({ message: "Task not found" });
    //         }
    
    //         res.status(200).json({ task });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: "Server error" });
    //     }
    // }

    static async allTask(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
    
            const tasks = await Task.find()
                .populate("createdBy", "username") // ดึงชื่อผู้ใช้ที่สร้าง Task
                .skip(skip)
                .limit(limit);
    
            const totalTasks = await Task.countDocuments();
    
            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ message: "Task not found" });
            }
    
            res.status(200).json({ totalTasks, page, limit, tasks });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
    
    

    static async insertTask(req, res) {
        try {
            const { title, description, status, priority } = req.body
            const createdBy = req.user.user_id

            const newTask = new Task({ title, description, status, priority, createdBy })
            await newTask.save();
            res.status(201).json(newTask);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    static async updateTask(req, res) {
        try {
            const T_id = req.params.id

            const { title, description, status, priority } = req.body
            const user = req.user.user_id

            const task = await Task.findById(T_id)
            // ✅ เช็คว่า task มีจริงก่อน
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            // ✅ เปรียบเทียบ ObjectId กับ string ให้ถูกต้อง
            if (task.createdBy.toString() !== user) {
                return res.status(403).json({ message: "ไม่สามารถแก้ไขได้เนื่องจากชื่อผู้ใช้ไม่ตรง" });
            }

            // ✅ อัปเดตข้อมูลและคืนค่าอัปเดตล่าสุด
            const taskUpdate = await Task.findByIdAndUpdate(
                T_id,   
                { title, description, status, priority, updatedAt: new Date() },
                { new: true } // ✅ ให้คืนค่าที่อัปเดตล่าสุด
            );

            if (!taskUpdate) {
                return res.status(404).send('Product not found');
            }
            res.status(200).json(taskUpdate)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "Server error" })
        }
    }

    static async deleteTask(req,res){
        try{
            const T_id = req.params.id

            const taskDelete = await Task.findByIdAndUpdate(T_id, { isDeleted: true });
            if(!taskDelete){
                return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
            }

            res.status(200).json({ message: 'ลบข้อมูลสำเร็จ (Soft Delete)' });
        } catch(error){
            console.error(error)
            res.status(500).json({ message: "Server error" })
        }
    }

    static async searchTask(req, res) {
        try {
            const { title, status } = req.query;
    
            const filter = {};
            if (title) filter.title = { $regex: new RegExp(title, "i") };
            if (status) filter.status = status;
    
            const tasks = await Task.find(filter).sort({ createdAt: -1 });
    
            if (!tasks.length) {
                return res.status(404).json({ message: "ไม่พบงานที่ค้นหา" });
            }
    
            res.status(200).json({ tasks });
        } catch (error) {
            console.error("Search Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
    
    
    
}

module.exports = taskController