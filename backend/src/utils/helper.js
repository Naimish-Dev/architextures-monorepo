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

export function temporarySignedRoute(basePath, expiredAt, queryParams) {
  const hmac = crypto.createHmac(
    "sha256",
    process.env.APP_KEY || "secret"
  );
  let url = `${basePath}?expires=${new Date(expiredAt).getTime()}`;
  if (queryParams) {
    const query = qs.stringify(queryParams);
    url += `&${query}`;
  }
  const signature = hmac.update(url).digest("hex");
  return `${url}&signature=${signature}`;
}

export const MailTransporter = nodemailer.createTransport(mailConfig);
