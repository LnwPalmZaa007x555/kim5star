const prisma = require("../prisma/prisma");

exports.list = async (req, res) => {
  try {
    const user = await prisma.user.findMany({});
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "server error",
    }); //เพิ่ม suc
  }
};
exports.update = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    const updated = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        email: email,
      },
    });
    res.json({
      success: true,
      message: "updated suc",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
exports.remove = async (req, res) => {
  try {
    const { userId } = req.params;
    const removed = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    res.status(200).json({
      success: true,
      message: " Deleted room suc",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
