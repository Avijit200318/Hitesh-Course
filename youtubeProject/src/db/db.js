import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectToDb = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`Mongodb connected! DB host: ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("Error in mongodb connection ", error);
        process.exit(1);
    }
}