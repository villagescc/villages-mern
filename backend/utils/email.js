const nodemailer = require("nodemailer");

const sendEmail = async (sender, email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.HOST_USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER || 'info@villages.io',
      replyTo: sender,
      to: email,
      subject: subject,
      html: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
