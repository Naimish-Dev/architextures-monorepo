import { HttpStatus } from "../constraints/http-status.enum.js";
import { HttpException } from "./http.exception.js";

export class NotFoundException extends HttpException {
  constructor() {
    super("Not Found", HttpStatus.NOT_FOUND);
  }
}