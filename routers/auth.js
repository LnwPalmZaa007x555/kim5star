const express = require('express')
const router = express.Router()

const { registerUser, registerStaff, login, logout } = require('../controllers/auth')

const{ auth } = require('../middleware/auth')

router.post('/register',registerUser)  //รับจากfront
router.post('/register/staff',registerStaff)

router.post('/login',login)
router.get('/logout',auth,logout)


module.exports = router