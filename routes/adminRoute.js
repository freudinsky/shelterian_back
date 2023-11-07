import { Router } from "express";
import * as adminController from "../controller/adminController.js";
import jwtVerify from "../middlewares/jwtVerify.js";

const adminRouter = Router();

adminRouter.use(jwtVerify);

adminRouter.get("/myentries", adminController.getMyAnimals);
adminRouter.get("/mydata", adminController.getMyData);
adminRouter.post("/new/dog", adminController.createDog);
adminRouter.post("/new/cat", adminController.createCat);
adminRouter.put("/edit/dog/:id", adminController.updateDog);
adminRouter.put("/edit/cat/:id", adminController.updateCat);
adminRouter.put("/edit/mydata", adminController.updateShelterData);
adminRouter.put("/changepassword", adminController.updatePassword);
adminRouter.delete("/delete/dog/:id", adminController.deleteDog)
adminRouter.delete("/delete/cat/:id", adminController.deleteCat)

export default adminRouter;
