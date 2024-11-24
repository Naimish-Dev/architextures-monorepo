import crypto from "crypto";
import bcrypt from "bcryptjs";
import { HttpException } from "../exceptions/http.exception.js";
import { HttpStatus } from "../constraints/http-status.enum.js";
import { MailTransporter } from "../utils/helper.js";
import { passwordResetLinkNotification } from "../mails/password-reset-link-notification.js";
import { passwordResetConfig } from "../configs/password-reset.config.js";
import User from "../models/users.model.js";
import PasswordResetToken from "../models/password-reset-tokens.model.js";

export class PasswordResetService {
  async sendPasswordResetLink(email) {
    const user = await this.validateEmail(email);

    if (!user) {
      throw new HttpException("Invalid email address", HttpStatus.BAD_REQUEST);
    }

    await this.deletePreviousToken(email);
    const token = await this.createToken(email);
    const link = passwordResetConfig.passwordResetLinkFrontendUrl(token, email);
    return await this.sendPasswordResetLinkEmail(email, link, user.name);
  }

  async sendPasswordResetLinkEmail(email, link, name) {
    return await MailTransporter.sendMail({
      from: `"Fred Foo 👻" <${process.env.MAIL_SENDER}>`,
      to: email,
      subject: "Reset Password",
      html: passwordResetLinkNotification({
        name,
        link,
        company: process.env.COMPANY_NAME || "My Company",
      }),
    });
  }

  async createToken(email) {
    const hmac = crypto.createHmac("sha256", `${process.env.APP_KEY}`);
    const randomBytes = crypto.randomBytes(64).toString("hex");
    const token = hmac.update(randomBytes).digest("hex");

    const hashToken = bcrypt.hashSync(token, bcrypt.genSaltSync(10));

    await PasswordResetToken.create({
      email,
      token: hashToken,
    });

    return token;
  }

  async validateEmail(email) {
    return await User.findOne({ email });
  }

  async deletePreviousToken(email) {
    return await PasswordResetToken.deleteOne({ email });
  }
}
