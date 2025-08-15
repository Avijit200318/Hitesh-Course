import express from "express";
import { registerUser, userLogin } from "../controllers/usre.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }
    ])
    , registerUser);

// this routing method is used when we have multiple route with same name or we want to create a chain of routes

// .route("/users")
//   .get((req, res) => res.send("Get Users"))
//   .post((req, res) => res.send("Create User"))
//   .put((req, res) => res.send("Update User"));

router.route("/sign-in").post(userLogin);

export default router;