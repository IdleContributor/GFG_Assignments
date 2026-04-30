import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || "BlogSpace"}" <${process.env.FROM_EMAIL}>`,
    to: toEmail,
    subject: "Your BlogSpace verification code",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FCF6F5;border-radius:12px;">
        <h2 style="color:#2BAE66;margin-bottom:8px;">Verify your email</h2>
        <p style="color:#444;margin-bottom:24px;">Use the code below to complete your BlogSpace registration. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#fff;border:2px solid #2BAE66;border-radius:10px;padding:24px;text-align:center;">
          <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2BAE66;">${otp}</span>
        </div>
        <p style="color:#888;font-size:13px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};
