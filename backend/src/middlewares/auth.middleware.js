import { UnAuthorizedException } from "../exceptions/unauthorized.exception.js";

export function auth(req, res, next) {
  if (req.isUnauthenticated()) {
    return next(new UnAuthorizedException());
  }
  next();
}