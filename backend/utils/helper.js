
import nodemailer from "nodemailer"

import jwt from "jsonwebtoken";

export const getToken = (email, user) => {
    const token = jwt.sign({ id: user.id },process.env.JWT_SECRET,{expiresIn:"1d"});
    return token;
};

export const sendVerifyEmail = async (username, email, id) => {
    try {
      console.log(`usr id in sendverifyemail ${id}`);
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD_EMAIL_VERIFY,
        },
      });
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Verify your email address',
        html: `<b>Hello ${username}</b><br>Please verify your email address using this <a href="http://localhost:3000/verifyemail/${id}">link</a>`,
      };
  console.log(`user id ${id}`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`user id ${id}`);
      console.log('Message sent: %s', info.messageId);
    } catch (err) {
      console.log(err.message);
    }
  };

  export const sendResetPasswordEmail = async (username, email, resetLink) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD_EMAIL_VERIFY,
            }
        });

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: "Reset Your Password",
            html: `<p>Hello ${username},</p><p>Please click <a href="${resetLink}">here</a> to reset your password.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent");
        console.log('Message sent: %s', info.messageId);
    } catch (err) {
        console.error(err);
    }
};



export default {getToken,sendVerifyEmail,sendResetPasswordEmail} ;