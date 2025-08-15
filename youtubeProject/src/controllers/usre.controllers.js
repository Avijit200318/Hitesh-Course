import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/Apiresponse.js"

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
})