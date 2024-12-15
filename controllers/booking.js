const prisma = require("../prisma/prisma");
const { differenceInMonths, addMonths } = require("date-fns");

exports.getBooking = async (req, res) => {
  try {
    const checkrole = req.user.pl.role;
    const { bookingId } = req.params;
    if (checkrole === "USER") {
      const customer = await prisma.customer.findFirst({
        where: {
          userId: Number(req.user.pl.id),
        },
      });
      const customerId = customer.customerId;
      const book = await prisma.booking.findUnique({
        where: {
          bookingId: Number(bookingId),
        },
      });
      if (!book) {
        return res.status(500).json({
          success: false,
          message: "No booking for you GET OUT",
        });
      }
      if (book.customerId === customerId) {
        return res.status(200).json({
          success: true,
          data: book,
        });
      }
      return res.status(404).json({
        success: false,
        message: "ID not match eiei cant get book",
      });
    }
    if (checkrole === "STAFF" || checkrole === "ADMIN") {
      const book = await prisma.booking.findUnique({
        where: {
          bookingId: Number(bookingId),
        },
      });
      if (!book) {
        return res.status(500).json({
          success: false,
          message: "No booking for you GET OUT",
        });
      }
      return res.status(200).json({
        success: true,
        data: book,
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
};
exports.listAllBooking = async (req, res) => {
  try {
    const checkrole = req.user.pl.role;
    if (checkrole === "USER") {
      const customer = await prisma.customer.findFirst({
        where: {
          userId: Number(req.user.pl.id),
        },
      });
      const customerId = customer.customerId;
      const book = await prisma.booking.findMany({
        where: {
          customerId: Number(customerId),
        },
        include: {
          room: {
            select: {
              roomName: true,
              roomPrice: true,
            },
          },
        },
      });
      
      if (!book) {
        return res.status(500).json({
          success: false,
          message: "No booking for you GET OUT",
        });
      }
      return res.status(200).json({
        success: true,
        data: book,
      });
    }
    if (checkrole === "STAFF" || checkrole === "ADMIN") {
      const book = await prisma.booking.findMany({
        include: {
          room: {
            select: {
              roomId: true,
              roomName: true,
              roomPrice: true,
            },
          },
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
          },
          payment:{
            select:{
              paymentId: true,
              paypermonth: true,
              installments: true,
              amount: true,
            },
          },
        },
      });
      
      if (!book) {
        return res.status(500).json({
          success: false,
          message: "No booking for you GET OUT",
        });
      }
      return res.status(200).json({
        success: true,
        data: book,
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
};
exports.removeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const removed = await prisma.booking.delete({
      where: {
        bookingId: Number(bookingId),
      },
    });
    return res.status(200).json({
      success: true,
      message: "Deleted booking success",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "cant delete booking",
    });
  }
};
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { numGuest } = req.body;

    const updated = await prisma.booking.update({
      where: {
        bookingId: Number(bookingId),
      },
      data: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "updated booking success",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "cant update booking",
    });
  }
};
exports.bookingUser = async (req, res) => {
  try {
    const { startDate, endDate, numGuest, customerId } = req.body;
    const { roomName } = req.params;

    const room = await prisma.room.findFirst({
      where: {
        roomName: Number(roomName),
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    if (room.roomStatus === 1) {
      return res.status(500).json({
        success: false,
        message: "room busy",
      });
    }
    const customer = await prisma.customer.findFirst({
      where: {
        customerId: Number(customerId),
      },
    });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    // Calculate the difference in months between startDate and endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    const installments = differenceInMonths(end, start);

    // Define payment details
    const amount = room.roomPrice * installments; // Adjust calculation as needed
    const paypermonth = Math.ceil(amount / installments); // Monthly payment

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        bookingStatus: 0,
        startDate: startDate,
        endDate: endDate,
        numGuest: numGuest,
        room: {
          connect: { roomId: Number(room.roomId) }, // การเชื่อมโยงห้อง
        },
        customer: {
          connect: { customerId: customer.customerId }, // การเชื่อมโยงลูกค้า
        },
        payment: {
          create: {
            // สร้างข้อมูล payment ใหม่
            amount: Number(amount),
            installments: installments,
            paypermonth: paypermonth,
            payDate: addMonths(start, 1), // วันที่เริ่มต้นการชำระ
          },
        },
      },
    });
    const status = await prisma.room.update({
      where: {
        roomId: Number(room.roomId),
      },
      data: {
        roomStatus: 1,
      },
    });
    return res.status(200).json({
      success: true,
      data: booking,
      message: "updated booking success",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error dai ngai mai ru",
    });
  }
};
exports.createBook = async (req, res) => {
  try {
    const { startDate, endDate, numGuest } = req.body;
    const { roomId } = req.params;
    console.log(roomId)
    console.log(req.user.pl.id);
    // Find the room details
    const room = await prisma.room.findUnique({
      where: {
        roomId: Number(roomId), // ตรวจสอบว่าห้องมีอยู่จริง
      },
    });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    console.log(room)
    if (room.roomStatus === 1) {
      return res.status(500).json({
        success: false,
        message: "room busy",
      });
    }
    const customer = await prisma.customer.findFirst({
      where: {
        userId: Number(req.user.pl.id),
      },
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    // Calculate the difference in months between startDate and endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    const installments = differenceInMonths(end, start);

    // Define payment details
    const amount = room.roomPrice * installments; // Adjust calculation as needed
    const paypermonth = Math.ceil(amount / installments); // Monthly payment

    // Create booking record
    const newBooking = await prisma.booking.create({
      data: {
        bookingStatus: 0,
        startDate: startDate,
        endDate: endDate,
        numGuest: numGuest,
        room: {
          connect: { roomId: Number(roomId) }, // การเชื่อมโยงห้อง
        },
        customer: {
          connect: { customerId: customer.customerId }, // การเชื่อมโยงลูกค้า
        },
        payment: {
          create: {
            // สร้างข้อมูล payment ใหม่
            amount: Number(amount),
            installments: installments,
            paypermonth: paypermonth,
            payDate: addMonths(start, 1), // วันที่เริ่มต้นการชำระ
          },
        },
      },
    });
    const status = await prisma.room.update({
      where: {
        roomId: Number(roomId),
      },
      data: {
        roomStatus: 1,
      },
    });
    // อัปเดต bookingId ใน payment
    await prisma.payment.update({
      where: { paymentId: newBooking.paymentId },
      data: { bookingId: newBooking.bookingId },
    });
    return res.status(200).json({
      success: true,
      data: newBooking,
      message: "updated booking success",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.userUpdateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { numGuest } = req.body;

    const updated = await prisma.booking.update({
      where: {
        bookingId: Number(bookingId),
      },
      data: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "updated booking success",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "cant update booking na ja",
    });
  }
};