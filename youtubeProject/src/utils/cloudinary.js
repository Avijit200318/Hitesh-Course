import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// config cloudinary

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
});

// console.log("cloudinary config: ", cloudinary.config());

export const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded on cloudinary, File src: ", response.url);

        // once the file is uploaded we want to delete it from our server
        fs.unlinkSync(localFilePath);
        return response;
    }catch(error){
        console.log("Error on cloudinary: ", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try{
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from cloudinary. Public Id: ", result);
    }catch(error){
        console.log("Error deleting from cloudinary: ", error);
        return null;
    }
}