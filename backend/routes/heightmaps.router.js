import { Router } from "express";
import * as heightmapsController from "../app/controllers/heightmaps.controller.js";

const router = Router();

router.post("/", heightmapsController.index);
router.post("/:id", heightmapsController.show);

export default router;
