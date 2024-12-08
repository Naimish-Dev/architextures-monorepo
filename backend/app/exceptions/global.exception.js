import { HttpStatus } from "../constraints/http-status.enum.js";

export function globalExceptionHandler(error, req, res, next) {
  if(process.env.NODE_ENV != "production"){
    console.error("error:", error)
  }
  if(req.accepts('application/json')){
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
  return res.render("errors.500")
}
