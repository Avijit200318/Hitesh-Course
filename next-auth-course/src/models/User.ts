import mongoose, { Schema, Document, models, model} from "mongoose";

export interface IUser extends Document{
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    isAdmin: boolean,
    forgotPasswordToken?: string,
    forgotPasswordTokenExpiry?: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    verifyCode: string
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        required: true
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
});



const User = models?.User || model<IUser>("User", userSchema);

export default User;