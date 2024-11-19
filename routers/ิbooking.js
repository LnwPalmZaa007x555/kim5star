const express = require('express')
const router = express.Router()

const {getBooking, listAllBooking, createBook, removeBooking} = require('../controllers/booking')

const { auth, authorize } = require('../middleware/auth')



router.get('/bookings/:bookingId',auth,getBooking)
router.get('/bookings',auth,listAllBooking)

router.post('/bookings/:roomId',auth,createBook)
router.delete('/bookings/:bookingId',auth,removeBooking)



module.exports = router