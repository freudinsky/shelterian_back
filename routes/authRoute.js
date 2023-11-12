import { Router } from "express";
import * as authController from "../controller/authController.js";
import jwtVerify from "../middlewares/jwtVerify.js";
import { upload } from "../middlewares/imageHandler.js";

const authRouter = Router();

authRouter.post("/signup", upload.single("verifDoc"), authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post("/logout", jwtVerify, authController.signout);
authRouter.get("/shelterinfo", jwtVerify, authController.shelterData);
authRouter.get("/validate", authController.validateMail)
authRouter.get("/new-validation-link", authController.sendNewValidationLink)

export default authRouter;
