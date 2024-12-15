import { Router } from "express";

const router = Router();
router.get("/account", (req, res, next) => {
  try {
    return res.render("admin.account");
  } catch (error) {
    next(error);
  }
});
router.get("/*?", (req, res, next) => {
  try {
    return res.render("admin.common");
  } catch (error) {
    next(error);
  }
});

export default router;
