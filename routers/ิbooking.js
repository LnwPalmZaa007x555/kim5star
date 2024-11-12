const express = require('express')
const router = express.Router()

const {getBooking, createBook} = require('../controllers/booking')

const { auth, authorize } = require('../middleware/auth')



router.post('/booking/:roomId',auth,createBook)
router.get('/booking/:bookingId',auth,getBooking)




module.exports = router