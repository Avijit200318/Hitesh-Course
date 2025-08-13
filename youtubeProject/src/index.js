import { app } from "./app.js";
import dotenv from "dotenv";
import { connectToDb } from "./db/db.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 4000;

connectToDb().then(() => {
    app.listen(PORT, () => {
    console.log(`Sever is running at port ${PORT}`);
    })
})
.catch((err) => {
    console.log("Mongodb connection error: ", err);
})