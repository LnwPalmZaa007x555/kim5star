const express = require('express')
const router = express.Router()

const { getPaymentAll, getPayment, decreasePayment } = require('../controllers/payment')
const { auth, authorize } = require('../middleware/auth')





router.get('/payments',auth,authorize('STAFF','ADMIN'),getPaymentAll)
router.get('/payments/:bookingId',auth,getPayment)
router.patch('/payments/:paymentId',auth,decreasePayment) //

module.exports = router