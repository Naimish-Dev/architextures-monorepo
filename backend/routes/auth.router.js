import { Router } from "express";
import * as authController from "../app/controllers/auth.controller.js";
import { auth } from "../app/middlewares/auth.middleware.js";
import { signedRouteVerify } from "../app/middlewares/signed-route-verify.middleware.js";

const router = Router();

router.post("/user", auth, authController.user);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.post(
  "/email/verification-notification",
  auth,
  authController.sendEmailVerificationNotification
);
router.get(
  "/verify-email/:id/:hash",
  auth,
  signedRouteVerify,
  authController.verifyEmail
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
