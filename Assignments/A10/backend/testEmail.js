import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./env/.env" });

console.log("=== SMTP Configuration Test ===");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "***SET***" : "NOT SET");
console.log("FROM_EMAIL:", process.env.FROM_EMAIL);
console.log("FROM_NAME:", process.env.FROM_NAME);
console.log("================================\n");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3', // Required for some SMTP providers like Brevo
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});

async function testEmail() {
  try {
    console.log("Testing SMTP connection...");
    
    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");

    // Send test email
    const testEmail = process.env.SMTP_USER; // Send to yourself
    console.log(`Sending test email to: ${testEmail}`);
    
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "BlogSpace"}" <${process.env.FROM_EMAIL}>`,
      to: testEmail,
      subject: "Test Email - BlogSpace OTP System",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FCF6F5;border-radius:12px;">
          <h2 style="color:#2BAE66;margin-bottom:8px;">Test Email</h2>
          <p style="color:#444;margin-bottom:24px;">This is a test email from your BlogSpace backend. If you received this, your SMTP configuration is working correctly!</p>
          <div style="background:#fff;border:2px solid #2BAE66;border-radius:10px;padding:24px;text-align:center;">
            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2BAE66;">123456</span>
          </div>
          <p style="color:#888;font-size:13px;margin-top:24px;">Test OTP code: 123456</p>
        </div>
      `,
    });

    console.log("\n✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("\nCheck your inbox at:", testEmail);
    
  } catch (error) {
    console.error("\n❌ Email test failed!");
    console.error("Error:", error.message);
    console.error("\nFull error:", error);
    
    if (error.code === "EAUTH") {
      console.error("\n⚠️  Authentication failed. Check your SMTP_USER and SMTP_PASS");
    } else if (error.code === "ECONNECTION") {
      console.error("\n⚠️  Connection failed. Check your SMTP_HOST and SMTP_PORT");
    } else if (error.code === "ETIMEDOUT") {
      console.error("\n⚠️  Connection timed out. Check your network or SMTP_HOST");
    }
  }
}

testEmail();
