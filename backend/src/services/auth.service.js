import { emailVerificationNotification } from "../mails/email-verification-notification.js";
import { MailTransporter, temporarySignedRoute } from "../utils/helper.js";
import crypto from "crypto";
import { emailVerificationConfig } from "../configs/email-verification.config.js";
import { PasswordResetService } from "./password-reset.service.js";
import bcrypt from "bcryptjs";
import { BadRequest } from "../exceptions/bad-request.exception.js";
import User from "../models/users.model.js";
import PasswordResetToken from "../models/password-reset-tokens.model.js";

export class AuthService {
  constructor() {
    this.passwordResetService = new PasswordResetService();
  }

  async sendEmailVerificationNotification(data) {
    const hash = crypto.createHash("sha1").update(data.email).digest("hex");

    const link = temporarySignedRoute(
      emailVerificationConfig.emailVerificationLinkBasePath(data._id, hash),
      new Date(
        Date.now() + emailVerificationConfig.emailVerificationLinkExpiryInMS
      ),
      {
        successRedirect:
          emailVerificationConfig.emailVerificationSuccessRedirectUrl,
        failedRedirect:
          emailVerificationConfig.emailVerificationFailedRedirectUrl,
      }
    );

    return await MailTransporter.sendMail({
      from: `"Fred Foo 👻" <${process.env.MAIL_SENDER}>`,
      to: data.email,
      subject: "Verify Your Email",
      html: emailVerificationNotification({
        name: data.name,
        link,
        company: process.env.COMPANY_NAME
          ? process.env.COMPANY_NAME
          : "My Company",
      }),
    });
  }

  async forgotPassword(email) {
    return await this.passwordResetService.sendPasswordResetLink(email);
  }

  async resetPassword({ token, password, email }) {
    const passwordResetToken = await PasswordResetToken.findOne({ email });

    if (
      !passwordResetToken ||
      !bcrypt.compareSync(token, passwordResetToken.token)
    ) {
      throw new BadRequest();
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    return await PasswordResetToken.deleteOne({ email });
  }
}
