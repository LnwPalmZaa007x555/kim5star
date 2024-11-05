const jwt = require('jsonwebtoken')
exports.auth = (req,res,next)=>{
    try{
        const token = req.header('x-auth-token')
        
        if(!token){
            return res.status(401).json({
                message: 'No token'
            })
        }
        const vertifyToken = jwt.verify(token,'token',(err, decode)=>{
            if(err){
                return res.status(401).json({message : 'Token is not invalid'})
            }else{
                console.log(decode)
                req.user = decode
                //console.log('token',vertifyToken)

        next()
            }
        })

        
    }catch(err){
        console.log('Something wrong in middleware')
        res.status(500).json({message: 'Server error'})
    }
}
exports.authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.pl.role)){
            return res.status(403)
            .json({success: false, message:`User role ${req.user.role} is not authoruzed to access this route`});
        }
        next();
    }
}
