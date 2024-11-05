const express = require('express')
const router = express.Router()

const{list,update,remove} = require('../controllers/user')
//middleware
const{ auth,authorize } = require('../middleware/auth')



router.get('/users',auth,authorize('STAFF','ADMIN'),list)
router.patch('/users/:userId',auth,authorize('STAFF','ADMIN'),update) // update บาง flied
router.delete('/users/:userId',auth,authorize('STAFF','ADMIN'),remove)




module.exports = router