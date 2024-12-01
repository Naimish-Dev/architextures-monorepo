import { Router } from "express";
import * as pathController from "../app/controllers/path.controller.js";

const router = Router();

router.post("/", pathController.index);
router.post("/:id", pathController.show);

export default router;
