import { Router } from "express";

const router = Router();

router.post("/app/node-canvas", (req, res, next) => {
  res.json({});
});

router.post("/app/get-design-options", (req, res, next) => {
  res.json({});
});

router.post("/app/material-view", (req, res, next) => {
  res.json(req.body);
});

export default router;
