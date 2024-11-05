const express = require('express')
const router = express.Router()

const {createBook} = require('../controllers/booking')

const { auth, authorize } = require('../middleware/auth')

router.post('/booking/:roomId',auth,createBook)



module.exports = router