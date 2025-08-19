import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import userModel from "@/models/User";
import { Types } from "mongoose";

export const sendEmail = async (email: string, username: string, emailType: string) => {
    console.log("emailType: ", emailType)
    try {
        const user = await userModel.findOne({ username });
        const userId: Types.ObjectId = user?._id;
        // generate token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await userModel.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            });
        } else if (emailType === "RESETPASSWORD") {
            await userModel.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            });
        }

        // nodemailer code start from here
        var transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const mailOptions = {
            from: "avijithira55@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} 
            or copy and paste the link below in your browser <br> ${process.env.DOMAIN}/verifyEmail?token=${hashedToken}
            </p>`
        }

        // now send email
        const mailResponse = await transport.sendMail(mailOptions);
        // console.log("mailResponse: ", mailResponse);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}