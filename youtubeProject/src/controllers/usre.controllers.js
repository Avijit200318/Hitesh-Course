import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/Apiresponse.js"
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password, username} = req.body;

    // validation -> we can use any of them zod or any othering
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fileds are required");
    }

    const existedUser = await userModel.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or usernam exists");
    }

    // console.log(req.files);
    // fetching multer localPaths
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing");
    }

    // now lets upload in cloudinary
    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // // for coverImage we need to check if user provide it or may not. its not necessary into database
    // let coverImaage = "";
    // if(coverImageLocalPath){
    //     coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // }

    let avatar;
    // we generally don't need it but for this case to check if we have files or not we need to check this
    try{
        avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("Uploaded avatar", avatar);
    }catch(error){
        console.log("Error uploading avatar: ", error);
        throw new ApiError(500, "Failed to upload avatar");
    }

    let coverImage;
    try{
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
        console.log("Uploaded coverImage", coverImage);
    }catch(error){
        console.log("Error uploading coverImage: ", error);
        throw new ApiError(500, "Failed to upload coverImage");
    }

    try {
        const user = await userModel.create({
            fullName,
            avatar: avatar.url,
            email,
            password,
            username: username.toLowerCase(),
            coverImage: coverImage?.url || ""
        });
    
        const createdUser = await userModel.findOne(user._id).select("-password -refreshToken");
    
        if(!createdUser){
            throw new ApiError(500, "Something went wrong while registering user");
        }
    
        return res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"));
    } catch (error) {
        console.log("User creation failed: ", error);

        if(avatar){
            await deleteFromCloudinary(avatar.public_id);
        }

        if(coverImage){
            await deleteFromCloudinary(coverImage.public_id);
        }

        throw new ApiError(500, "Something went wrong while registering user and images were deleted");
    }
});


export const generateAccessAndRefreshToken = async (user) => {
    // since this is not an controller function which have (req, res, next) we can't use asyncHandler()
    try {    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false});
    
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};


export const userLogin = asyncHandler(async (req, res, next) => {
    const {email, username, password} = req.body;

    // validation use zod or anyother things

    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const user = await userModel.findOne({
        $or: [{email}, {username}]
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }

    // validate password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user creadentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);

    // this is an extra safety. After the access and refresh token is created we will check again the user because some data is added.
    const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development,"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user:loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
    // the refreshToken if needed to the frontend then we will send it otherwise we don't need
});

export const refreshAccessToken = asyncHandler( async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incommingRefreshToken){
        throw new ApiError(401, "Refresh token is required");
    }

    // when we are accessing or decoding any token then its adviasable to use try catch method
    try{
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET );

        const user = await userModel.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }

        if(incommingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Invalid refresh token");
        }

        const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development,"
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user);

        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refresh successfully"));
    }catch(error){

    }
})

export const logoutUser = asyncHandler(async (req, res) => {
    
});