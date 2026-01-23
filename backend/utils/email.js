const nodemailer = require("nodemailer");

const sendEmail = async (sender, email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILJET_HOST,
      // service: process.env.SERVICE,
      port: 465,
      auth: {
        user: process.env.MJ_APIKEY_PUBLIC,
        pass: process.env.MJ_APIKEY_PRIVATE,
      },
    });

    await transporter.sendMail({
      from: 'info@villages.io',
      replyTo: sender,
      to: email,
      subject: subject,
      html: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
