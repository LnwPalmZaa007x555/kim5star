const express = require('express');
const router = express.Router();

const {listRoom, createRoom, updateRooms, removedRoom} = require('../controllers/room')
//middle
const{ auth,authorize } = require('../middleware/auth')


router.get('/room',listRoom)
router.post('/room',auth,authorize('STAFF','ADMIN'),createRoom)
router.patch('/room/:roomId',auth,authorize('STAFF','ADMIN'),updateRooms)
router.delete('/room/:roomId',auth,authorize('STAFF','ADMIN'),removedRoom)


module.exports = router