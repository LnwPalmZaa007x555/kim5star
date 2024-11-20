const prisma = require("../prisma/prisma");

exports.listRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await prisma.room.findUnique({
      where: {
        roomId: Number(roomId),
      },
    });
    if (!roomId) {
      return res.status(500).json({
        success: false,
        message: "No room for you GET OUT",
      });
    }
    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error cant get room",
    });
  }
};
exports.listRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({});
    //console.log(rooms)
    //res.status(200).json(rooms)
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error cant get room",
    });
  }
};
exports.createRoom = async (req, res) => {
  try {
    const { name, price, status } = req.body;
    const newRoom = await prisma.room.create({
      data: {
        roomName: name,
        roomPrice: price,
        roomStatus: status,
        dormitoryId: 1,
      },
    });
    res.json({
      success: true,
      data: newRoom,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error cant create room",
    });
  }
};
exports.updateRooms = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { roomPrice, roomName } = req.body;

    const updated = await prisma.room.update({
      where: {
        roomId: Number(roomId),
      },
      data: req.body,
    });
    res.send(updated);
    //res.status(200).json({ message:'update success' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "cant update room",
    });
  }
};
exports.removedRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const removed = await prisma.room.delete({
      where: {
        roomId: Number(roomId),
      },
    });
    res.status(200).json({
      success: true,
      message: "Deleted room success",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "cant remove room",
    });
  }
};
