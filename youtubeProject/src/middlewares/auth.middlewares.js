import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // or we can use this => req.headers.authorization?.split(" ")[1]

    if(!token){
        throw new ApiError(401, "Unauthorized");
    }

    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "User not found, so Unauthorized");
        }

        req.user = user;

        next();
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})