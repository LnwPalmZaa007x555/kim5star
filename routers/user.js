const express = require('express')
const router = express.Router()

const{list,update,remove, sendResetLink, resetPassword} = require('../controllers/user')
//middleware
const{ auth,authorize } = require('../middleware/auth')



router.get('/users',auth,authorize('STAFF','ADMIN'),list)
router.patch('/users/:userId',auth,authorize('STAFF','ADMIN'),update) // update บาง flied
router.delete('/users/:userId',auth,authorize('STAFF','ADMIN'),remove)
router.post('/users/resetlink',sendResetLink)
router.post('/users/resetpassword',resetPassword)


module.exports = router