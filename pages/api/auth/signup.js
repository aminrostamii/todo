// هندلر برای ایجاد کاربر جدید
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";
import ConnectDB from "@/utils/ConnectDB";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "failed", message: "روش درخواست مجاز نیست" });
  }

  try {
    await ConnectDB();
  } catch (err) {
    console.error("Database connection error:", err);
    return res
      .status(500)
      .json({ status: "failed", message: "خطا در اتصال به پایگاه داده" });
  }

  const { fullName, phone, email, password } = req.body;
  console.log({ fullName, phone, email });

  if (!email || !password || !fullName || !phone) {
    return res
      .status(422)
      .json({ status: "failed", message: "داده‌های ورودی نامعتبر هستند" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ status: "failed", message: "کاربر قبلاً ثبت‌نام کرده است" });
    }

    const hashedPassword = await hashPassword(password);

    // اضافه کردن todos هنگام ایجاد کاربر
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      todos: [], // مقدار اولیه فیلد todos
    });

    console.log("New user created:", newUser);
    return res.status(201).json({
      status: "success",
      message: "کاربر با موفقیت ایجاد شد",
      user: {
        fullName,
        phone,
        email,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res
      .status(500)
      .json({ status: "failed", message: "خطا در ایجاد کاربر" });
  }
}

export default handler;