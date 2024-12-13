const prisma = require("../prisma/prisma");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    const userData = req.body;

    const updated = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: userData,
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
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify token และดึงข้อมูล userId
    jwt.verify(token, "token", async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid",
        });
      }

      const userId = decoded.id; // userId ที่ได้จาก token
      console.log("Decoded userId:", userId);

      // เข้ารหัสรหัสผ่านใหม่
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // อัปเดตรหัสผ่านในฐานข้อมูล
      const user = await prisma.user.update({
        where: { userId: userId },
        data: { password: hashedPassword },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    // ตรวจสอบผู้ใช้งานในฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please register first!",
      });
    }

    // สร้าง payload และ token
    const payload = { id: user.userId };
    const token = jwt.sign(payload, "token", { expiresIn: "15m" });

    // URL สำหรับรีเซ็ตรหัสผ่าน
    const resetLink = `http://localhost:3000/reset?token=${token}`;

    // ตั้งค่าการส่งอีเมลด้วย Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // หรือใช้บริการอื่น เช่น AWS SES, SMTP Server
      auth: {
        user: "noscambykim@gmail.com", // ใส่อีเมลที่ใช้ส่ง
        pass: "bilorgsnspcceeqh", // รหัสผ่านหรือ App Password
      },
    });

    // สร้างข้อความอีเมล
    const mailOptions = {
      from: '"Kim5Star" <noscambykim@gmail.com>', // ชื่อผู้ส่ง
      to: email, // อีเมลผู้รับ
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>Hi ${user.fname+" "+user.lname},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    // ตอบกลับหลังจากส่งสำเร็จ
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email!",
    });
  } catch (err) {
    console.error("Error in sendResetLink:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};