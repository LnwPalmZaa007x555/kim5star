const prisma = require('../prisma/prisma');
const { differenceInMonths,addMonths } = require('date-fns');

//get booking single, if admin->many //done
//delete booking done
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
            const customerId = customer.customerId
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
            const checkrole = req.user.pl.role 
            if(checkrole === "USER"){
                const customer = await prisma.customer.findFirst({
                where:{
                    userId : Number(req.user.pl.id)
                    
                    }
                }) 
                const customerId = customer.customerId
                const book = await prisma.booking.findMany({
                    where: {
                        customerId : Number(customerId)
                    }
                })
                if(!book){
                    return res.status(500).json({
                        success : false,
                        message : "No booking for you GET OUT"
                    })
                }
                return res.status(200).json({
                    success: true,
                    data : book
                })
            }
            if(checkrole === "STAFF" || checkrole === "ADMIN"){
                const book = await prisma.booking.findMany({})
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
            res.status(500).json({ error: "can't get all booking" });
        }
}
exports.removeBooking = async(req,res)=>{
    try {
        const { bookingId } = req.params
        const removed = await prisma.booking.delete({
            where:{
                bookingId:Number(bookingId)
            }
        })
        return res.status(200).json({
            success : true,
            message : "Deleted booking success"
        })
    } catch (err) {
        return res.status(500).json({ 
            success : false,
            message: 'cant delete booking'})
    }
}
exports.updateBooking = async(req,res)=>{
    try {
        const { bookingId } = req.params


    } catch (err) {
        
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
        const customer = await prisma.customer.findFirst({
            where: {
                userId: Number(req.user.pl.id)
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


        // Create booking record
        const booking = await prisma.booking.create({
            data: {
                bookingStatus: 0,
                startDate: startDate,
                endDate: endDate,
                numGuest: numGuest,
                room: {
                    connect: { roomId: Number(roomId) } // การเชื่อมโยงห้อง
                },
                customer: {
                    connect: { customerId: customer.customerId } // การเชื่อมโยงลูกค้า
                },
                payment: {
                    create: {  // สร้างข้อมูล payment ใหม่
                        amount: Number(amount),
                        installments: installments,
                        paypermonth: paypermonth,
                        payDate: addMonths(start, 1), // วันที่เริ่มต้นการชำระ
                    }
                },
            }
        });
        

        res.status(201).json({ booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "can't create booking" });
    }
};

