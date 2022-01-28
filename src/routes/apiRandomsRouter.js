import { Router } from "express";
import * as controller from "../controllers/apiRandomsController.js";

const router = Router();

router.get("/", controller.getRandoms);

router.get("/wt", controller.getRandomsWT);

export default router;
