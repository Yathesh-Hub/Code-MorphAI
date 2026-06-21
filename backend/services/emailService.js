const nodemailer = require('nodemailer');
const { Resend } = require('resend');

let transporter = null;
let resendClient = null;

if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
}

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};

const buildHtml = (otp) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0c0c0e;padding:40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table style="max-width:480px;width:100%;background:#1a1d2e;border-radius:12px;padding:40px 32px;border:1px solid #2e3250;">
        <tr><td align="center" style="padding-bottom:24px;">
          <div style="display:inline-block;width:44px;height:44px;background:#6c5ce7;border-radius:10px;line-height:44px;color:#fff;font-size:20px;font-weight:700;">C</div>
          <span style="font-size:18px;font-weight:700;color:#e2e8f0;margin-left:10px;">CodeMorph AI</span>
        </td></tr>
        <tr><td style="padding-bottom:8px;">
          <h1 style="color:#e2e8f0;font-size:22px;font-weight:700;margin:0;text-align:center;">Password Reset OTP</h1>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;text-align:center;margin:0;">Use the following OTP to reset your password. This code expires in <strong style="color:#e2e8f0;">10 minutes</strong>.</p>
        </td></tr>
        <tr><td align="center" style="padding-bottom:24px;">
          <div style="display:inline-block;background:#0c0c0e;border:1px solid #2e3250;border-radius:10px;padding:16px 40px;letter-spacing:12px;font-size:32px;font-weight:700;color:#6c5ce7;font-family:'Courier New',monospace;">${otp}</div>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <p style="color:#64748b;font-size:12px;line-height:1.5;text-align:center;margin:0;">If you did not request this password reset, please ignore this email.</p>
        </td></tr>
        <tr><td style="border-top:1px solid #2e3250;padding-top:20px;">
          <p style="color:#475569;font-size:11px;text-align:center;margin:0;">&copy; ${new Date().getFullYear()} CodeMorph AI. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const sendOtpEmail = async (to, otp) => {
  const html = buildHtml(otp);
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@codemorph.ai';

  if (resendClient) {
    const { data, error } = await resendClient.emails.send({
      from: `CodeMorph AI <${from}>`,
      to,
      subject: 'Password Reset OTP - CodeMorph AI',
      html,
    });
    if (error) throw new Error(error.message);
    return;
  }

  await getTransporter().sendMail({
    from: `"CodeMorph AI" <${from}>`,
    to,
    subject: 'Password Reset OTP - CodeMorph AI',
    html,
  });
};

module.exports = { sendOtpEmail };
