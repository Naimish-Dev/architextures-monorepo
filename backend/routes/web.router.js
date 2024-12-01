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
router.get("/login", (req, res, next) => {
  try {
    return res.render("login");
  } catch (error) {
    next(error);
  }
});
router.get("/signup", (req, res, next) => {
  try {
    return res.render("signup");
  } catch (error) {
    next(error);
  }
});
router.get("/account/resetpass", (req, res, next) => {
  try {
    return res.render("resetpassword");
  } catch (error) {
    next(error);
  }
});
router.get("/account/forgetpass/:id", (req, res, next) => {
  try {
    return res.render("forgetpassword");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/save", (req, res, next) => {
  try {
    return res.render("admin.save");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/upload", (req, res, next) => {
  try {
    return res.render("admin.upload");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/download", (req, res, next) => {
  try {
    return res.render("admin.download");
  } catch (error) {
    next(error);
  }
});
router.get("/admin/account", (req, res, next) => {
  try {
    return res.render("admin.download");
  } catch (error) {
    next(error);
  }
});

router.get("/share/:id", shareController.index);

export default router;
