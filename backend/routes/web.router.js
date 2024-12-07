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
router.get("/create", (req, res, next) => {
  try {
    return res.render("create");
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  try {
    return res.render("login");
  } catch (error) {
    next(error);
  }
});
router.get("/register", (req, res, next) => {
  try {
    return res.render("register");
  } catch (error) {
    next(error);
  }
});
router.get("/forgot-password", (req, res, next) => {
  try {
    return res.render("forgot-password");
  } catch (error) {
    next(error);
  }
});
router.get("/reset-password", (req, res, next) => {
  try {
    if (!req.query.email || !req.query.code) {
      return res.redirect("/login");
    }
    return res.render("reset-password", {
      email: req.query.email,
      code: req.query.code,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/admin/saved", (req, res, next) => {
  try {
    return res.render("admin.saved");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/uploads", (req, res, next) => {
  try {
    return res.render("admin.upload");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/downloads", (req, res, next) => {
  try {
    return res.render("admin.download");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/account", (req, res, next) => {
  try {
    return res.render("admin.account");
  } catch (error) {
    next(error);
  }
});

router.get("/share/:id", shareController.index);

export default router;
