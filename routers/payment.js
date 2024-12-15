const express = require('express')
const router = express.Router()

const { getPaymentAll, getPayment, decreasePayment, paymentInfo } = require('../controllers/payment')
const { auth, authorize } = require('../middleware/auth')





router.get('/payments',auth,authorize('STAFF','ADMIN'),getPaymentAll)
router.get('/payments/:bookingId',auth,getPayment)
router.patch('/payments/:paymentId',auth,authorize('STAFF','ADMIN'),decreasePayment) //
router.get('/payments/info',auth,authorize('STAFF','ADMIN'),paymentInfo)

module.exports = router