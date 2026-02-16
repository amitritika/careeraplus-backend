const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                 // e.g. smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // SSL for 465
  auth: { user: process.env.SAMPLE_USER || process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendMail({ to, subject, html }) {
  const from = process.env.EMAIL_FROM || 'noreply@example.com';
  return transport.sendMail({ from, to, subject, html });
}

module.exports = { sendMail };