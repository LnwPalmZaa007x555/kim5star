const prisma = require('../prisma/prisma')


exports.list = async (req,res)=>{
    try{
        /*const roleeiei = req.user.pl.role
        console.log(roleeiei)
        if(roleeiei!='STAFF'){
            return res.json({message: 'get out of here'}).status(400)

        }    */    //กุ เช็ค role ตรง middleware ละ เค้?
        const user = await prisma.user.findMany({})
        res.status(200).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'server error'}) //เพิ่ม suc
    }
}
exports.update = async (req,res)=>{
    try{
        const {userId} = req.params
        const {email} = req.body

        const updated = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data:{
                email:email
            }
        })
        res.json({message: 'updated suc'})
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'server error'})
    }
}
exports.remove = async (req,res)=>{
    try{
        const {userId} = req.params
        const removed = await prisma.user.delete({
            where: {
                id: Number(userId)
            }
        })
        res.status(200).json({ message: ' Deleted room suc'});
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'server error'})
    }
}