import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../utils/appError';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.registerUserService(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(new AppError(error.message || 'Registration failed', 500));
  }
};