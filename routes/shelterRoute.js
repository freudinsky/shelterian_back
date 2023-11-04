import { Router } from "express";
import * as animalController from "../controller/animalController.js";

const shelterRouter = Router();

shelterRouter.get('/dogs/filter', animalController.filterDogs)
shelterRouter.get('/cats/filter', animalController.filterCats)
shelterRouter.get('/dogs/:id', animalController.getDogById)
shelterRouter.get('/cats/:id', animalController.getCatById)
shelterRouter.get('/dogs', animalController.allDogs)
shelterRouter.get('/cats', animalController.allCats)

export default shelterRouter;
