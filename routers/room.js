const express = require('express');
const router = express.Router();

const {listRoom, listRooms, createRoom, updateRooms, removedRoom} = require('../controllers/room')
//middle
const{ auth,authorize } = require('../middleware/auth')

router.get('/room/:roomId',listRoom)
router.get('/rooms',listRooms)
router.post('/room',auth,authorize('STAFF','ADMIN'),createRoom)
router.patch('/room/:roomId',auth,authorize('STAFF','ADMIN'),updateRooms)
router.delete('/room/:roomId',auth,authorize('STAFF','ADMIN'),removedRoom)


module.exports = router