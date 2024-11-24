import Validator from "validatorjs";
import { ValidationException } from "../exceptions/validation.exception.js";

export function validate(body, rules, customMessages = {}) {
  const validator = new Validator(body, rules, customMessages);

  if (validator.fails()) {
    throw new ValidationException("Validation Exception", validator.errors);
  }

  const whiteListKeys = Object.keys(rules);
  const whitelistObject = {};

  whiteListKeys.forEach((key) => {
    if (key in body) {
      whitelistObject[key] = body[key];
    }
  });

  return whitelistObject;
}
