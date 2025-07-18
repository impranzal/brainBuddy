import { Request, Response, NextFunction } from 'express';
import createUserSchema from '../utils/schema.user';


//Works as Middleware
export const validateUser = async(req: Request, res: Response, next: NextFunction):Promise <void> => {
    try {
        await createUserSchema.parse(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? error.message });
    }
};
