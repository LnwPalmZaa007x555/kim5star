const prisma = require('../prisma/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async(req,res)=>{
    try{

        const { email,password,phone,fname,lname } = req.body

        if(!email){
            return res.status(400).json({
                success: false,
                message:'Invalid email'
            })
        }
        if(!password){
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            })
        }
        if(!phone){
            return res.status(400).json({
                success: false,
                message: 'Invalid phone'
            })
        }
        if(!fname){
            return res.status(400).json({
                success: false,
                message: 'Invalid first name'
            })
        }
        if(!lname){
            return res.status(400).json({
                success: false,
                message: 'Invalid last name'
            })
        }
        //
        const checkUser = await prisma.user.findUnique({
            where:{
                email: email

            }
        })
        if(checkUser){
            return res.status(409).json({
                message: 'Email already use'
            })
        }
        //
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        //
        const customerData = {
            email: email,
            password: hashPassword,
            phone: phone,
            fname: fname,
            lname: lname,
            customers: {
                create:{
                    dormitoryId: 1
                }
            }
            
        }
        const newCustomer = await prisma.user.create({
            data: customerData
        })
        res.json({
            message: 'register success'
        })
        
    
    }catch(err){
        console.log(err)
        res.send('Server ERROR').status(500)
    }
}
exports.registerStaff = async(req,res)=>{
    try{

        const { email,password,phone,fname,lname,position,salary } = req.body

        if(!email){
            return res.status(400).json({
                success: false,
                message:'Invalid email'
            })
        }
        if(!password){
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            })
        }
        if(!phone){
            return res.status(400).json({
                success: false,
                message: 'Invalid phone'
            })
        }
        if(!fname){
            return res.status(400).json({
                success: false,
                message: 'Invalid first name'
            })
        }
        if(!lname){
            return res.status(400).json({
                success: false,
                message: 'Invalid last name'
            })
        }
        if(!position){
            return res.status(400).json({
                success: false,
                message: 'Invalid position'
            })
        }
        if(!salary){
            return res.status(400).json({
                success: false,
                message: 'Invalid salary'
            })
        }
        //
        const checkUser = await prisma.user.findUnique({
            where:{
                email: email

            }
        })
        if(checkUser){
            return res.status(409).json({
                message: 'Email already use'
            })
        }
        //
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        //
        const staffData = {
            email: email,
            password: hashPassword,
            phone: phone,
            fname: fname,
            lname: lname,
            role: 'STAFF',
            staff: {
                create:{
                    position: position,
                    salary: salary,
                    dormitoryId: 1
                }
            }
            
        }
        const newStaff = await prisma.user.create({
            data: staffData,
        })
        res.json({
            message: 'register success'
        })
        
    
    }catch(err){
        console.log(err)
        res.send('Server ERROR').status(500)
    }
}
exports.login = async (req,res)=>{
    try{
        const { email , password } = req.body
        if(!email){
            return res.status(400).json({message: 'Email is required'})
        }
        if(!password){
            return res.status(400).json({message: 'Password is required'})
        }
        //1 check email in db
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!user){
            return res.status(400).json({
                message:'pls register first!'
            })
        }
        //2 compare password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message:'Password is not match'
            })
        }
        //3 create payload ส่งเข้า token
        const payload = {
            pl:{
                id: user.userId,
                email: user.email,
                role: user.role
            }
        }
        //4 create token อายุการใช้งาน ถ้าหมดต้อง login ใหม่
        const token = jwt.sign(payload,'token',{
            expiresIn:'1d'
        })
        res.cookie("token",token,{
            maxAge: 300000,
            secure: true,
            httpOnly: true,
            sameSite: "none"
        })
      //  console.log(token)
        res.json({
            user:payload.user,
            token:token
        })
        

    }catch(err){
        console.log(err)
        res.json({ message : 'Server error'}).status(500)
    }
}