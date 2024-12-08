import bcrypt from "bcryptjs";
import { validate } from "../utils/validate.js";
import { HttpException } from "../exceptions/http.exception.js";
import { HttpStatus } from "../constraints/http-status.enum.js";
import User from "../models/users.model.js";
import passport from "./passport.init.js";
import { AuthService } from "../services/auth.service.js";
import crypto from "crypto";

const authService = new AuthService();

export async function register(req, res, next) {
  try {
    const validated = validate(req.body, {
      first_name: "required|string",
      last_name: "required|string",
      email: "required|email",
      company: "required|string",
      industry: "required|string",
      type: "required|string",
      country: "required|string",
      is_sub_marketing: "required|boolean",
      password: "required|min:8",
    });

    // Hash the password
    const password = bcrypt.hashSync(
      validated.password,
      bcrypt.genSaltSync(10)
    );

    const user = new User({
      ...validated,
      password,
    });

    await user.save();

    return res.status(HttpStatus.CREATED).json({
      success: "user validation passed",
      user_id: user.id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: "Validation Exception",
        errors: {
          email: ["Email address has already been taken"],
        },
      });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    validate(req.body, {
      email: "required|email",
      password: "required",
    });
 
    passport.authenticate("local", async (error, user, info) => {
      if (error || !user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Invalid credentials",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }

        return res.status(HttpStatus.OK).json({
          success: user.id,
          redirect: req.body.redirect,
        });
      });
    })(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function sendEmailVerificationNotification(req, res, next) {
  try {
    await authService.sendEmailVerificationNotification(req.user);

    res.json({
      message: "Your email verification link has been sent",
      statusCode: HttpStatus.OK,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_GATEWAY).json({
      message: "Bad Gateway",
      statusCode: HttpStatus.BAD_GATEWAY,
    });
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect(`${req.query.failedRedirect}?error=bad_request`);
    }

    const emailHash = crypto
      .createHash("sha1")
      .update(user.email)
      .digest("hex");

    if (req.params.hash !== emailHash) {
      return res.redirect(`${req.query.failedRedirect}?error=bad_request`);
    }

    if (user.email_verified_at) {
      return res.redirect(`${req.query.successRedirect}?verified=1`);
    }

    user.email_verified_at = new Date();
    await user.save();

    return res.redirect(`${req.query.successRedirect}?verified=1`);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const validated = validate(req.body, {
      email: "required|email",
    });

    await authService.forgotPassword(validated.email);

    return res.status(HttpStatus.OK).json({
      message: "Password reset link has been sent",
      statusCode: HttpStatus.OK,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const validated = validate(req.body, {
      token: "required|string",
      email: "required|email",
      password: "required|min:8",
    });

    await authService.resetPassword(validated);

    res.status(HttpStatus.OK).json({
      message: "Your password has been reset successfully",
      statusCode: HttpStatus.OK,
    });
  } catch (error) {
    next(error);
  }
}

export function user(req, res) {
  return res.json(req.user);
}

export function logout(req, res) {
  req.logout(() => {
    req.session.destroy(function () {});
  });
  res.status(HttpStatus.TEMPORARY_REDIRECT).redirect(process.env.APP_URL)
}