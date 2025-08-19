import userModel from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/lib/dbConnect";

export async function POST(req: NextRequest){
    await connectToDb();
    try {
        // we are getting token from the frontend
        const {token} = await req.json();
        if(!token){
            return NextResponse.json({
            success: false,
            message: "Token required"
            }, {status: 401});
        }

        const user = await userModel.findOne({
            verifyToken: token,
            verifyTokenExpiry: {$gt: Date.now()}
        });

        // console.log("user: ", user);

        if(!user){
            return NextResponse.json({
            success: false,
            message: "Invalid token or token already expired"
            }, {status: 400});
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Email is verified"
        }, {status: 200});

    } catch (error: any) {
        console.log("Error occur while verify user: ", error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, {status: 500});
    }
}