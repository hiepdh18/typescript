import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../base/base-error';

export const exceptionHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).send({ errors: err.formatErrors() });
  }
  return res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};
