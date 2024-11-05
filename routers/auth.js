const express = require('express')
const router = express.Router()

const { registerUser,registerStaff,login } = require('../controllers/auth')

router.post('/register',registerUser)  //รับจากfront
router.post('/register/staff',registerStaff)

router.post('/login',login)

module.exports = router