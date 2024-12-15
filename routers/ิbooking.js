const express = require('express')
const router = express.Router()

const {getBooking, listAllBooking, createBook, removeBooking, updateBooking, bookingUser, userUpdateBooking} = require('../controllers/booking')

const { auth, authorize } = require('../middleware/auth')



router.get('/bookings/:bookingId',auth,getBooking)
router.get('/bookings',auth,listAllBooking)

router.post('/bookings/:roomId',auth,createBook)
router.delete('/bookings/:bookingId',auth,removeBooking)
router.patch('/bookings/:bookingId',auth,authorize('STAFF','ADMIN'),updateBooking)
router.post('/bookings/service/:roomName',auth,authorize('STAFF','ADMIN'),bookingUser)
router.patch('/booking/:bookingId',auth,userUpdateBooking)


module.exports = router