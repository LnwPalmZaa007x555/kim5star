const prisma = require('../prisma/prisma');
const { differenceInMonths } = require('date-fns');

exports.createBook = async (req, res) => {
    try {
        const { startDate, endDate, numGuest } = req.body;
        const { roomId } = req.params;
        console.log(req.user.pl.id)
        // Find the room details
        const room = await prisma.room.findUnique({
            where: {
                roomId: Number(roomId)
            }
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        const customer = await prisma.customer.findUnique({
            where: {
                customerId: Number(req.user.pl.id)
            }
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

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                amount: Number(amount),
                installments: installments,
                paypermonth: paypermonth,
                payDate: new Date(start.setMonth(start.getMonth() + 1)),
            }
        });

        // Create booking record
        const booking = await prisma.booking.create({
            data: {
                bookingStatus: 0,
                startDate: startDate,
                endDate: endDate,
                numGuest: numGuest,
                room: {
                    connect: { roomId: Number(roomId) } // ใช้ connect แทนการใช้ roomId
                },
                customer: {
                    connect: { customerId: customer.customerId } // ใช้ connect แทนการใช้ customerId
                },
                payment:{
                    connect: { paymentId: Number(payment.paymentId) }
                }, // Link payment to booking
            }
        });

        res.status(201).json({ booking, payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "can't create booking" });
    }
};

