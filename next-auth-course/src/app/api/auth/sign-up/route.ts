import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";


export async function POST(req: NextRequest) {
    await connectToDb();

    try{
        const {username, email, password} = await req.json();

        if(!username || !email || !password){
            return NextResponse.json({
            success: false,
            message: "All fields are required"
            },
            {status: 401}
            );
        }

        const existingUserVerifiedByUsername = await userModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success: false,
                message: "User already exist with this username"
            }, {status: 400});
        }

        const existingUserByEmail = await userModel.findOne({email});
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();


        if(existingUserByEmail){
            // if email exist and veiried then a case and if not then other case
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 400});
            }else{
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }
        }else{
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            // we set is const but since new Date() give us an object so we can change its value anytime. This code add 1hrs expiry to the expiry Date

            const newUser = await userModel.create({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });

        }
        // created just to tell which type . we need to handle this differently
        const emailType = "VERIFY"
        // send email
        await sendEmail(email, username, emailType);

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {status: 201});

    }catch(error: any){
        console.error("Error registering user: ", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user",
            error: error.message
        },
        {status: 500}
        );
    }
}