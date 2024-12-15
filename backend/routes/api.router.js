import { Router } from "express";
import { share } from "../app/controllers/share.controller.js";
import * as libraryController from "../app/controllers/library.controller.js";
import canvasCache from "../app/actions/node-canvas.action.js";
import checkStorage from "../app/actions/check-storage.action.js";
import getDesignOptions from "../app/actions/get-design-options.action.js";
import materialView from "../app/actions/material-view.action.js";
import query from "../app/actions/query.action.js";
import presignedUrl from "../app/actions/presigned-url.action.js";
import * as collectionController from "../app/controllers/collections.controller.js";
import * as materialsController from "../app/controllers/materials.controller.js";
import downloads from "../app/actions/downloads.action.js";
import materialDownload from "../app/actions/material-download.action.js";
import getCategoryOptions from "../app/actions/get-category-options.action.js";
import { auth } from "../app/middlewares/auth.middleware.js";

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

router.post("/collections", collectionController.index);
router.post("/collections/create", collectionController.create);
router.post("/collections/rearrange", collectionController.rearrange);
router.post("/collections/:id/positions", collectionController.position);
router.post("/collections/:id/rename", collectionController.rename);
router.post("/collections/:id/delete", collectionController.destroy);
router.post("/collections/:id/items", collectionController.items);
router.post("/collections/:id/items/rearrange", collectionController.rearrangeItem);
router.post("/collections/:id/items/:item/attach", collectionController.attachItem);
router.post("/collections/:id/items/:item/delete", collectionController.destroyItem);

router.post("/downloads", downloads);
router.post("/material-download", materialDownload);
router.post("/share", share);
router.post("/library", auth, libraryController.store);

router.post("/saves", auth, libraryController.list);
router.post("/saves/:id", auth, libraryController.show);
router.post("/saves/:id/rename", auth, libraryController.rename);
router.post("/saves/:id/delete", auth, libraryController.destroy);

router.post("/materials", materialsController.index);
router.post("/materials/create", materialsController.create);
router.post("/materials/:id/update", auth, materialsController.update);

export default router;
