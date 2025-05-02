// lib/nodemailer.js
import nodemailer from 'nodemailer';

// Ensure environment variables are loaded (Next.js does this automatically for .env.local)
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
  console.warn("Email credentials (EMAIL_USER, EMAIL_PASS) not found in .env.local. Email sending disabled.");
  // Return a mock transporter or null if credentials aren't set
  // to prevent errors if code tries to use it.
  module.exports = null;
} else {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user, // your email address to send email from
      pass: pass  // your gmail account password
    }
  });
  module.exports = transporter;
}