import { Router } from "express";
import jwtVerify from "../middlewares/jwtVerify.js";
import * as authController from "../controller/authController.js";
import { upload } from "../middlewares/imageHandler.js";

const authRouter = Router();

authRouter.use(upload.single('adoptionTerms'))

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post("/logout", jwtVerify, authController.signout);
authRouter.get("/shelterinfo", jwtVerify, authController.shelterData);

export default authRouter;
