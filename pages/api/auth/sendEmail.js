// /pages/api/sendEmail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, todos } = req.body;

  if (!email || !Array.isArray(todos)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  // ایجاد Transporter با Mailtrap
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "95a71ee858aa8d",  // ← مقادیر Mailtrap خودت رو جایگزین کن
      pass: "d85521dcb4b247",  // ← مقادیر Mailtrap خودت رو جایگزین کن
    },
  });

  // HTML ایمیل با طراحی زیبا
  const todoListHtml = todos
    .map(
      (todo, idx) => `
      <li style="background: #f9f9f9; margin-bottom: 10px; padding: 15px; border-radius: 6px; border-left: 5px solid ${
        todo.status === "completed" ? "#4CAF50" : "#FFC107"
      };">
        <strong style="font-size: 16px;">${idx + 1}. ${todo.description}</strong><br />
        <span style="color: #555;">وضعیت: ${todo.status}</span>
      </li>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4CAF50;">سلام 👋</h2>
        <p style="font-size: 16px; color: #333;">تسک‌های شما به شرح زیر هستند:</p>
      </div>
      <ul style="list-style: none; padding: 0;">${todoListHtml}</ul>
      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 14px; color: #999;">ارسال شده توسط <strong>Reservix App</strong></p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"Reservix App" <noreply@reservix.local>',
      to: email,
      subject: "لیست تسک‌های شما",
      html: htmlContent,
    });

    res.status(200).json({ message: "ایمیل تستی با موفقیت ارسال شد" });
  } catch (err) {
    res.status(500).json({ message: "خطا در ارسال ایمیل", error: err.message });
  }
}
