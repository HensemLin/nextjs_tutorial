import nodemailer from "nodemailer";
import prisma from "@/lib/db";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userId, 10);

    // Find the existing token record or create a new one
    let userToken = await prisma.userToken.findUnique({
      where: { userId: userId },
    });

    if (userToken) {
      userToken = await prisma.userToken.update({
        where: { id: userToken.id },
        data: {
          type: emailType,
          token: hashedToken,
          expiry: new Date(Date.now() + 3600000), // Convert timestamp to Date object
        },
      });
    } else {
      userToken = await prisma.userToken.create({
        data: {
          userId: userId,
          type: emailType,
          token: hashedToken,
          expiry: new Date(Date.now() + 3600000), // Convert timestamp to Date object
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
