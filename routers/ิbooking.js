const express = require('express')
const router = express.Router()

const {getBooking, listAllBooking, createBook, removeBooking} = require('../controllers/booking')

const { auth, authorize } = require('../middleware/auth')



router.get('/booking/:bookingId',auth,getBooking)
router.get('/booking',auth,listAllBooking)

router.post('/booking/:roomId',auth,createBook)
router.delete('/booking/:bookingId',auth,removeBooking)



module.exports = router