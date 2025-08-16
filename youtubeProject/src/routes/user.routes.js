import express from "express";
import { registerUser, userLogin , logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/usre.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

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

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/update-password").post(verifyJWT, changeCurrentPassword);

router.route("/getUser").get(verifyJWT, getCurrentUser);

router.route("/update-account").post(verifyJWT, updateAccountDetails);

router.route("/update-avatar").post(verifyJWT, 
    upload.single("avatar"), 
    updateUserAvatar);

router.route("/update-coverImage").post(verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage);


export default router;