export abstract class BaseError extends Error {
  abstract statusCode: number;
  constructor() {
    super();
    Object.setPrototypeOf(this, BaseError.prototype);
  }
  abstract formatErrors(): { message: string; field?: string }[];
}
