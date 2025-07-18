import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

// Error handling middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  // Log the error details
  console.error(err);

  // Set the status code and send the response
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
  });
};
