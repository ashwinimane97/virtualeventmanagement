const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    text: `Click the link to verify your email: http://localhost:3000/users/verify-email?token=${token}`,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    console.log(res)
  } catch(err) {
    console.log(err);
  }

  
};
