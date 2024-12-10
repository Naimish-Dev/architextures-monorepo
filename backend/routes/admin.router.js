import { Router } from "express";

const router = Router();

router.get("/saved", (req, res, next) => {
  try {
    return res.render("admin.saved");
  } catch (error) {
    next(error);
  }
});
router.get("/uploads", (req, res, next) => {
  try {
    return res.render("admin.upload");
  } catch (error) {
    next(error);
  }
});
router.get("/downloads", (req, res, next) => {
  try {
    return res.render("admin.download");
  } catch (error) {
    next(error);
  }
});
router.get("/account", (req, res, next) => {
  try {
    return res.render("admin.account");
  } catch (error) {
    next(error);
  }
});

export default router;
