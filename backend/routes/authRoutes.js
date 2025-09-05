/*import express from "express";
import { registerUser, loginUser,upload } from "../controllers/authController.js";

const router = express.Router();

//router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/register", upload.single("photo"), registerUser); // ✅ handles photo upload


export default router;
*/

import express from "express";
import multer from "multer";
import { registerUser, loginUser } from "../controllers/authController.js";
import { sendOtp, verifyOtp } from "../controllers/authController.js";
import { transporter } from "../utils/mailer.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" }); // save shop photos

router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
