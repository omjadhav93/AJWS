const nodemailer = require('nodemailer');

module.exports.sendingMail = async ({ from, to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Use 465 for SSL
      secure: false, // false for TLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      text
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};
