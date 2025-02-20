const express = require('express')
const router = express.Router()

const Validator = require('../middlewares/validate')
const UserController = require('../controllers/userController')

router.post('/index',UserController.index)
router.post('/register', Validator.registerValidator(), Validator.validate, UserController.register)
router.post('/login',Validator.loginValidator(), Validator.validate, UserController.login)
router.post('/logout',UserController.logout)

module.exports = router