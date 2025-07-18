import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { jwtConfig } from '../utils/config';
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: any;
    }
  }
}
export const protect = (req: Request, res: Response, next: NextFunction) => {
  req.user
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new AppError('No token provided', 401));

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Invalid token', 403));
  }
};

export const restrictTo = (role: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role?.toLowerCase() !== role.toLowerCase()) {
      return next(new AppError('Access denied', 403));
    }
    next();
  };
};
