export class HttpException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  static handler(error, req, res, next) {
    if (error instanceof HttpException) {
      if (req.method === "GET") {
        return res.send(error.message);
      }
      return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    next(error);
  }
}
