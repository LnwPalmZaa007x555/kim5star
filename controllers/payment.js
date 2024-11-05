const prisma = require('../prisma/prisma')
//STAFF AND ADMIN CAN WATCH ALL PAYMENT
exports.getPaymentAll = async(req,res)=>{
    try{
        const payment = await prisma.payment.findMany({})
        res.json(payment).status(200)
        
    }catch(err){
        return res.status(500).json({message: 'server error'})
    }
}
exports.getPayment = async(req,res)=>{
    try{
      //กรอง user
        const {userId} = req.params
        const checkUserId = await prisma.user.findUnique({
            where:{
                userId:userId
            }
        })
        if(!checkUserId){
            return res.status(500).json({message: 'no userId na ja'})
        }
        const payment = await prisma.payment.findMany({
            where:{
                userId:userId
            }
        })
        res.json(payment).status(200)
        
    }catch(err){
        return res.status(500).json({message: 'server error'})
    }
}
exports.decreasePayment = async (req, res) => {
    try {
      const { paymentId } = req.params;
      const payment = await prisma.payment.findUnique({
        where: {
          paymentId: Number(paymentId),
        },
      });
  
      if (!payment) {
        return res.status(400).json({ message: 'Payment not found' });
      }
  
      if (payment.installments === 0) {
        return res.status(500).json({ message: 'หมดสัญญา' });
      }
  
      // ตรวจสอบว่ามี booking ที่เชื่อมกับ payment นี้หรือไม่
      const booking = await prisma.booking.findUnique({
        where: {
          paymentId: Number(paymentId),
        },
      });
  
      if (payment.installments === 1) {
        if (!booking) {
          return res.status(400).json({ message: 'Booking not found for this payment' });
        }
  
        // อัพเดตสถานะ bookingStatus เป็น 1 เมื่อผ่อนครบงวด
        await prisma.booking.update({
          where: {
            bookingId: booking.bookingId,
          },
          data: {
            bookingStatus: 1,
          },
        });
      }
  
      // update payment
      await prisma.payment.update({
        where: {
          paymentId: Number(paymentId),
        },
        data: {
          amount: payment.amount - payment.paypermonth,
          installments: payment.installments - 1,
          payDate: new Date(payment.payDate.setMonth(payment.payDate.getMonth() + 1)),
        },
      });
  
      res.status(200).json({ message: 'Update payment success' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  