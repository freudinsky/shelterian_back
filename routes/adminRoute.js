import { Router } from "express";
import jwtVerify from "../middlewares/jwtVerify.js";
import * as adminController from "../controller/adminController.js";

const adminRouter = Router();

adminRouter.use(jwtVerify);

adminRouter.get("/myentries", adminController.getMyAnimals);
adminRouter.get("/mydata", adminController.getMyData);
adminRouter.post("/new/dog", adminController.createDog);
adminRouter.post("/new/cat", adminController.createCat);
adminRouter.put("/edit/dog", adminController.updateDog);
adminRouter.put("/edit/cat", adminController.updateCat);
adminRouter.put("/edit/mydata", adminController.updateShelterData);
adminRouter.put("/changepassword", adminController.updatePassword);

export default adminRouter;
