const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[EMAIL] Mock email to ${to}: ${subject}`);
    return true;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Email sent successfully to ${to}: ${subject}`);
    return result;
  } catch (error) {
    console.error(`[EMAIL] Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  applicationStatusUpdate: (studentName, collegeName, status) => ({
    subject: `Application Status Update - ${collegeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Application Status Update</h2>
        <p>Dear ${studentName},</p>
        <p>Your application status for <strong>${collegeName}</strong> has been updated to: <strong style="color: ${status === 'accepted' ? '#28a745' : status === 'rejected' ? '#dc3545' : '#ffc107'};">${status.toUpperCase()}</strong></p>
        <p>Please log in to your Comla account for more details.</p>
        <br>
        <p>Best regards,<br>The Comla Team</p>
      </div>
    `
  }),

  welcomeEmail: (userName) => ({
    subject: 'Welcome to Comla!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Comla!</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for joining Comla, your trusted college finder platform!</p>
        <p>Start exploring colleges and applying to your dream institutions.</p>
        <br>
        <p>Best regards,<br>The Comla Team</p>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };