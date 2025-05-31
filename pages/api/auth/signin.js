import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import { sign } from 'jsonwebtoken';
import ConnectDB from "@/utils/ConnectDB";
import { serialize } from 'cookie';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: "failed", message: "روش درخواست مجاز نیست" });
  }

  try {
    await ConnectDB();
  } catch (err) {
    console.error('Database connection error:', err);
    return res.status(500).json({ status: "failed", message: "خطا در اتصال به پایگاه داده" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ status: "failed", message: "داده‌های ورودی نامعتبر هستند" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "failed", message: "کاربر یافت نشد" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: "failed", message: "اطلاعات ورود نامعتبر است" });
    }

    const expiration = 60 * 60; // 1 hour expiration
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ status: "failed", message: "Secret key is not defined" });
    }

    const token = sign(
      { email: user.email, userId: user._id },
      secretKey,
      { expiresIn: expiration }
    );

    const serialized = serialize("token", token, {
      httpOnly: true,
      maxAge: expiration,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200)
      .setHeader("Set-Cookie", serialized)
      .json({
        status: "success",
        message: "ورود با موفقیت انجام شد",
        data: {
          email: user.email,
          phone: user.phone,
          fullname: user.fullName,
          token,
          userId: user._id,
        },
      });
  } catch (err) {
    console.error('Error signing in:', err);
    return res.status(500).json({ status: "failed", message: "خطا در ورود" });
  }
}

export default handler;
