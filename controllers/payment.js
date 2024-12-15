const prisma = require("../prisma/prisma");

exports.getPaymentAll = async (req, res) => {
  try {
    const payment = await prisma.payment.findMany({});
    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error dai ngai mai ru",
    });
  }
};
exports.getPayment = async (req, res) => {
  try {
    //กรอง user
    const { bookingId } = req.params;
    const checkUserId = await prisma.user.findUnique({
      where: {
        userId: Number(req.user.pl.id),
      },
    });
    if (!checkUserId) {
      return res.status(500).json({
        success: false,
        message: "no userId na ja",
      });
    }
    const customer = await prisma.customer.findFirst({
      where: {
        userId: Number(req.user.pl.id),
      },
    });
    if (!customer) {
      return res.status(500).json({
        success: false,
        message: "no customerId na ja",
      });
    }
    const booking = await prisma.booking.findFirst({
      where: {
        bookingId: Number(bookingId),
        customerId: Number(customer.customerId),
      },
      include: {
        payment: true,
      },
    });
    if (!booking) {
      return res.status(500).json({
        success: false,
        message: "no booking na ja",
      });
    }
    return res.status(200).json({
      success: true,
      data: booking.payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error dai ngai mai ru",
    });
  }
};
exports.decreasePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: {
        paymentId: Number(paymentId),
      },
    });

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.installments === 0) {
      return res.status(500).json({
        success: false,
        message: "หมดสัญญา",
      });
    }

    // ตรวจสอบว่ามี booking ที่เชื่อมกับ payment นี้หรือไม่
    const booking = await prisma.booking.findUnique({
      where: {
        paymentId: Number(paymentId),
      },
    });

    if (payment.installments === 1) {
      if (!booking) {
        return res.status(400).json({
          success: false,
          message: "Booking not found for this payment",
        });
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
        payDate: new Date(
          payment.payDate.setMonth(payment.payDate.getMonth() + 1)
        ),
      },
    });

    res.status(200).json({
      success: true,
      message: "Update payment success",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: true,
      message: "Server error",
    });
  }
};
exports.paymentInfo = async(req,res) =>{
  try {
    const checkrole = req.user.pl.role;
    if (checkrole === "STAFF" || checkrole === "ADMIN") {
      const payInfo = await prisma.payment.findMany({
        include:{
        customer: {
          select: {
            user: {
              select: {
                fname: true,
                lname: true,
                phone: true,
                email: true,
              },
            },
          },
          customerId: true,
        },
        room: {
          select: {
            roomName: true,
            roomPrice: true,
          },
        },
        booking: {
          select: {
            bookingId : true,
            startDate : true,
            endDate : true
          }
        }
      }  
    })

      if (!payInfo) {
        return res.status(500).json({
          success: false,
          message: "No payInfo for you GET OUT",
        });
      }  
      return res.status(200).json({
        success: true,
        data: payInfo,
      });
    }
    return res.status(404).json({
      success: false,
      message: "cant identify your role",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server ERROR",
    });
  }
}