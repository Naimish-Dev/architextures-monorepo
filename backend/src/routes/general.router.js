import { Router } from "express";

const router = Router();

router.post("/node-canvas", (req, res, next) => {
  res.json(null);
});

router.post("/get-design-options", (req, res, next) => {
  res.json({});
});

router.post("/material-view/:id", (req, res, next) => {
  res.json(req.body);
});

export default router;
