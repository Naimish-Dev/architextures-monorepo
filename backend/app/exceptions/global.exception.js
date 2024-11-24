import { HttpStatus } from "../constraints/http-status.enum.js";

export function globalExceptionHandler(error, req, res, next) {
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  });
}
