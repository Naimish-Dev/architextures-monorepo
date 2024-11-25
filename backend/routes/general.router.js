import { Router } from "express";
import * as shareController  from "../app/controllers/share.controller.js"

const router = Router();

router.post("/node-canvas", (req, res, next) => {
  res.json()
});

router.post("/get-design-options/:id?", (req, res, next) => {
  res.json([]);
});

router.post("/material-view/:id", (req, res, next) => {
  res.json(req.body);
});

router.post("/material-download", (req, res, next) => {
  res.json(req.body);
});

router.post("/downloads", (req, res, next) => {
  res.json(req.body);
});

router.post("/library", (req, res, next) => {
  res.json({});
});

router.post("/collections", (req, res, next) => {
  res.json({});
});

router.post("/query", (req, res, next) => {
  res.json({});
});

router.post("/check-storage", (req, res, next) => {
  res.json({});
});

router.post("/share", shareController.share);

export default router;
