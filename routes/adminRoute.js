import { Router } from "express";
import * as adminController from "../controller/adminController.js";
import jwtVerify from "../middlewares/jwtVerify.js";
import { upload } from "../middlewares/imageHandler.js";

const adminRouter = Router();

adminRouter.use(jwtVerify);

adminRouter.get("/myentries", adminController.getMyAnimals);
adminRouter.get("/mydata", adminController.getMyData);
adminRouter.post("/new/dog", adminController.createDog);
adminRouter.post("/new/cat", adminController.createCat);
adminRouter.patch("/edit/dog/:id", adminController.updateDog);
adminRouter.patch("/edit/cat/:id", adminController.updateCat);
adminRouter.patch(
	"/edit/mydata",
	upload.single("verifDoc"),
	adminController.updateShelterData
);
adminRouter.patch("/changepassword", adminController.updatePassword);
adminRouter.delete("/delete/dog/:id", adminController.deleteDog);
adminRouter.delete("/delete/cat/:id", adminController.deleteCat);

export default adminRouter;
