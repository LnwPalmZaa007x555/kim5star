const express = require('express');
const router = express.Router();

const {listRoom, listRooms, createRoom, updateRooms, removedRoom} = require('../controllers/room')
//middle
const{ auth,authorize } = require('../middleware/auth')

router.get('/rooms/:roomId',listRoom)
router.get('/rooms',listRooms)
router.post('/rooms',auth,authorize('STAFF','ADMIN'),createRoom)
router.patch('/rooms/:roomId',auth,authorize('STAFF','ADMIN'),updateRooms)
router.delete('/rooms:roomId',auth,authorize('STAFF','ADMIN'),removedRoom)


module.exports = router