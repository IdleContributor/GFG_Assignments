import { Resend } from 'resend';
import dotenv from "dotenv";

// Only load from file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "./env/.env" });
}

// Lazy init - don't crash on startup if key is missing locally
let resend = null;
const getResend = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set. Add it to your env/.env file.");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

export const sendOtpEmail = async (toEmail, otp) => {
  console.log(`Attempting to send OTP email to: ${toEmail}`);
  console.log(`Using Resend API with FROM_EMAIL: ${process.env.FROM_EMAIL}`);
  
  const { data, error } = await getResend().emails.send({
    from: `${process.env.FROM_NAME || "BlogSpace"} <${process.env.FROM_EMAIL}>`,
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

  if (error) {
    console.error('❌ Resend API error:', error);
    throw new Error(error.message);
  }

  console.log(`✅ Email sent successfully! Email ID: ${data.id}`);
  return data;
};
