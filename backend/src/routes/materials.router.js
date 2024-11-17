import { Router } from "express";
import * as materialsController from "../controllers/materials.controller.js";

const router = Router();

router.post("/", materialsController.index);
router.post("/:id", materialsController.show);

export default router;
