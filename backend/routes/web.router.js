import { Router } from "express";
import * as shareController from "../app/controllers/share.controller.js";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    return res.render("index");
  } catch (error) {
    next(error);
  }
});

router.get("/share/:id", shareController.index);

export default router;
