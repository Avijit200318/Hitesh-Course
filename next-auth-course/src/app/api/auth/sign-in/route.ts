import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
    await connectToDb();

    try{
        const {email, password} = await req.json();
        const user = await userModel.findOne({email});
        if(!user){
            return NextResponse.json({
            success: false,
            message: "User does not exist"
            },
            {status: 400}
            );
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);

        if(!isValidPassword){
            return NextResponse.json({
            success: false,
            message: "Invalid Password"
            },
            {status: 400}
            );
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
            username: user.username
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRECT!, {expiresIn: '1d'})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user
        }, {status: 200});

        response.cookies.set("token", token, {httpOnly: true});
        return response;

    }catch(error){
        console.error("Error registering user: ", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        },
        {status: 500}
        );
    }
}