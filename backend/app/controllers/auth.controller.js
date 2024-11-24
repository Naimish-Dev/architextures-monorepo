import bcrypt from 'bcryptjs';
import { validate } from '../utils/validate.js';
import { HttpException } from '../exceptions/http.exception.js';
import { HttpStatus } from '../constraints/http-status.enum.js';
import User from '../models/users.model.js';
import passport from './passport.init.js';
import { AuthService } from '../services/auth.service.js';
import crypto from 'crypto';

const authService = new AuthService();

async function register(req, res, next) {
  try {
    const validated = validate(req.body, {
      name: "required|string",
      email: "required|email",
      password: "required|confirmed|min:8",
    });

    // Hash the password
    const password = bcrypt.hashSync(validated.password, bcrypt.genSaltSync(10));

    // Create new user with Mongoose
    const user = new User({
      ...validated,
      password,
    });

    await user.save(); // Save user to the MongoDB database

    req.logIn(user.toObject(), (err) => { // Convert mongoose document to plain object
      if (err) {
        throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return res.status(HttpStatus.CREATED).json({
        message: "User signup successfully",
        statusCode: HttpStatus.CREATED,
      });
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error (unique email)
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

async function login(req, res, next) {
  try {
    validate(req.body, {
      username: "required|email",
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
          message: "User login successfully",
          statusCode: HttpStatus.OK,
        });
      });
    })(req, res, next);
  } catch (error) {
    next(error);
  }
}

async function sendEmailVerificationNotification(req, res, next) {
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

async function verifyEmail(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect(`${req.query.failedRedirect}?error=bad_request`);
    }

    const emailHash = crypto.createHash("sha1").update(user.email).digest("hex");

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

async function forgotPassword(req, res, next) {
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

async function resetPassword(req, res, next) {
  try {
    const validated = validate(req.body, {
      token: "required|string",
      email: "required|email",
      password: "required|confirmed|min:8",
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

function user(req, res) {
  return res.json(req.user);
}

function logout(req, res) {
  req.logout(() => {
    req.session.destroy(function () {});
  });
  res.status(HttpStatus.NO_CONTENT).json({});
}

export {
  register,
  login,
  sendEmailVerificationNotification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  user,
  logout,
};
