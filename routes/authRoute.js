import { Router } from "express";
import * as authController from "../controller/authController.js";
import jwtVerify from "../middlewares/jwtVerify.js";

const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post("/logout", jwtVerify, authController.signout);
authRouter.get("/shelterinfo", jwtVerify, authController.shelterData);

export default authRouter;
