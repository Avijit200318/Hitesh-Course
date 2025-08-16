import express from "express";
import { registerUser, userLogin , logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, refreshAccessToken, getChannelProfile, getWatchHistory} from "../controllers/usre.controllers.js";
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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// secure routes
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT, 
    upload.single("avatar"), 
    updateUserAvatar);
router.route("/update-coverImage").patch(verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage);


router.route("/c/:username").get(verifyJWT, getChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;