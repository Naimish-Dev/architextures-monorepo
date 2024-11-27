import { Router } from "express";
import * as shareController from "../app/controllers/share.controller.js";
import canvasCache from "../app/actions/node-canvas.action.js";
import library from "../app/actions/library.action.js";
import checkStorage from "../app/actions/check-storage.action.js";
import getDesignOptions from "../app/actions/get-design-options.action.js";
import materialView from "../app/actions/material-view.action.js";
import query from "../app/actions/query.action.js";
import presignedUrl from "../app/actions/presigned-url.action.js";

const router = Router();

router.post("/node-canvas", canvasCache);
router.post("/library", library);
router.post("/check-storage", checkStorage);
router.post("/get-design-options/:id?", getDesignOptions);
router.post("/material-view/:id", materialView);
router.post("/query", query);
router.post("/presigned-url", presignedUrl);

router.post("/collections", (req, res, next) => {
  res.json({});
});
router.post("/share", shareController.share);

export default router;
