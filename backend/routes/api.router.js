import { Router } from "express";
import { share } from "../app/controllers/share.controller.js";
import * as libraryController from "../app/controllers/library.controller.js";
import canvasCache from "../app/actions/node-canvas.action.js";
import checkStorage from "../app/actions/check-storage.action.js";
import getDesignOptions from "../app/actions/get-design-options.action.js";
import materialView from "../app/actions/material-view.action.js";
import query from "../app/actions/query.action.js";
import presignedUrl from "../app/actions/presigned-url.action.js";
import collections from "../app/actions/collections.action.js";
import downloads from "../app/actions/downloads.action.js";
import materialDownload from "../app/actions/material-download.action.js";
import getCategoryOptions from "../app/actions/get-category-options.action.js";

const router = Router();

router.post("/node-canvas", canvasCache);
router.post("/material-download", (req, res, next) => {
  res.json(req.body);
});

router.post("/downloads", (req, res, next) => {
  res.json(req.body);
});
router.post("/check-storage", checkStorage);
router.post("/get-design-options/:id?", getDesignOptions);
router.post("/design_option_categories/:id?", getCategoryOptions);
router.post("/material-view/:id", materialView);
router.post("/query", query);
router.post("/presigned-url", presignedUrl);
router.post("/collections", collections);
router.post("/downloads", downloads);
router.post("/material-download", materialDownload);
router.post("/share", share);
router.post("/library", libraryController.store);
router.post("/saves", libraryController.list);
router.post("/saves/:id", libraryController.show);

export default router;
