require('./config/database').connect();  // Connect to database
require('dotenv').config()


const path = require('path')
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser());

// ✅ ใช้ middleware ต่างๆ
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));


const userRouter = require('./routes/userRouter')
const taskRouter = require('./routes/taskRouters')

app.use(userRouter)
app.use(taskRouter)

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
});

app.get('/', (req, res) => {
    res.send("Server is working!");
});


// ✅ แก้ port ให้ตรงกัน
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});