const express = require('express')
const router = express.Router()

const TaskController = require('../controllers/taskController')
const Auth = require('../middlewares/auth')
const Validator = require('../middlewares/validate')

router.get("/allTask", Auth.tokenVerify, Auth.adminVerify, TaskController.allTask);
router.get("/searchTask",Auth.tokenVerify,Validator.searchTaskValidator(), Validator.validate, TaskController.searchTask)
router.get("/:id", TaskController.indexTask)
router.post("/insertTask", Auth.tokenVerify, Validator.insertValidator(), Validator.validate, TaskController.insertTask);
router.put("/updateTask/:id", Auth.tokenVerify, Validator.insertValidator(), Validator.validate, TaskController.updateTask)
router.delete("/deleteTask/:id", Auth.tokenVerify, Auth.adminVerify, Validator.validate, TaskController.deleteTask)

module.exports = router