const prisma = require('../prisma/prisma');
const { differenceInMonths } = require('date-fns');

//get booking single, if admin->many //done
//delete booking
//patch booking
//admin pick some booking
//admin can create booking for customer

exports.getBooking = async (req,res)=>{
    try{
        const checkrole = req.user.pl.role 
        const {bookingId} = req.params
        if(checkrole === "USER"){
            const customer = await prisma.customer.findFirst({
            where:{
                userId : Number(req.user.pl.id)
                
                }
            }) 
            const customerId = customer.userId
            const book = await prisma.booking.findUnique({
                where: {
                    bookingId : Number(bookingId)
                }
            })
            if(!book){
                return res.status(500).json({
                    success : false,
                    message : "No booking for you GET OUT"
                })
            }
            if(book.customerId === customerId){
                return res.status(200).json({
                    success : true,
                    data : book
                })
            }
            return res.status(404).json({
                success : false,
                message : "ID not match eiei cant get book"
            })
        }
        if(checkrole === "STAFF" || checkrole === "ADMIN"){
            const book = await prisma.booking.findUnique({
                where: {
                    bookingId : Number(bookingId)
                }
            })
            if(!book){
                return res.status(500).json({
                    success : false,
                    message : "No booking for you GET OUT"
                })
            }
            return res.status(200).json({
                success : true,
                data : book
            })
        }
        return res.status(404).json({
            success: false,
            message :"cant identify your role"
        })
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "can't get a single booking" });
    }
}
exports.listAllBooking = async (req,res)=>{
    try{
        
    }catch(err){

    }
}





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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "can't create booking" });
    }
};

