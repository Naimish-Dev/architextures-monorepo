import { Router } from "express";
import * as materialsController from "../controllers/materials.controller.js";

const router = Router();

router.post("/", materialsController.index);

export default router;
