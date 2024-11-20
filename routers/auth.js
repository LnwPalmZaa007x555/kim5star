const express = require('express')
const router = express.Router()

const { registerUser, registerStaff, login, logout, getME } = require('../controllers/auth')

const{ auth } = require('../middleware/auth')

router.post('/register',registerUser)  //รับจากfront
router.post('/register/staff',registerStaff)
router.post('/login',login)
router.get('/logout',auth,logout)
router.get('/getme',auth,getME)


module.exports = router