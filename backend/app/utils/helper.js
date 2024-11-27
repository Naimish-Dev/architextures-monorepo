import crypto from "crypto";
import qs from "qs";
import nodemailer from "nodemailer";
import { mailConfig } from "../configs/mail.config.js";

export function excludeFields(inputObject, excludedKeys) {
  const result = {};
  Object.keys(inputObject).forEach((key) => {
    if (!excludedKeys.includes(key)) {
      result[key] = inputObject[key];
    }
  });
  return result;
}

export function temporarySignedRoute(basePath, expiredAt, queryParams = {}) {
  const hmac = crypto.createHmac("sha256", process.env.APP_KEY || "secret");

  const expires = new Date(expiredAt).getTime();
  const query = qs.stringify({ ...queryParams, expires });
  const url = `${basePath}?${query}`;

  const signature = hmac.update(url).digest("hex");
  return `${url}&signature=${signature}`;
}

export const MailTransporter = nodemailer.createTransport(mailConfig);
