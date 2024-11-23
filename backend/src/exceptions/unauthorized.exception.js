import { HttpStatus } from "../constraints/http-status.enum.js";
import { HttpException } from "./http.exception.js";

export class UnAuthorizedException extends HttpException {
  constructor() {
    super("Unauthorized", HttpStatus.UNAUTHORIZED);
  }
}