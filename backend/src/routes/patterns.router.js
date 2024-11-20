import { Router } from "express";
import * as patternsController from "../controllers/patterns.controller.js";

const router = Router();

router.post("/", patternsController.index);
router.post("/:id", patternsController.show);

export default router;
