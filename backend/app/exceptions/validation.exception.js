export class ValidationException extends Error {
  constructor(message, errors) {
    super(message);
    this.cause = errors;
    this.message = message;
  }

  get errors() {
    return this.cause;
  }

  get response() {
    return {
      message: this.message,
      errors: this.cause.errors,
    };
  }

  static handler(error, req, res, next) {
    if (error instanceof ValidationException) {
      return res.status(422).json(error.response);
    }
    next(error);
  }
}
