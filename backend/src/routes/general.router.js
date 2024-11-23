import { Router } from "express";

const router = Router();

router.post("/api/node-canvas", (req, res, next) => {
  res.json({});
});

router.post("/api/get-design-options", (req, res, next) => {
  res.json({});
});

router.post("/api/material-view/:id", (req, res, next) => {
  res.json(req.body);
});

export default router;
