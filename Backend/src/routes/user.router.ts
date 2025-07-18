import { Router } from 'express';
import { registerUser} from '../controller/user.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validateUser } from '../middleware/validate.user';
import { apiLimiter } from '../middleware/ratelimit.middleware';

const userRoutes = Router();


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related endpoints
 */

userRoutes.post('/signup', apiLimiter, validateUser, registerUser);
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user or admin
 *     description: |
 *       Registers a new user. The first 3 registered users are automatically assigned the role 'ADMIN'. All subsequent users are assigned the role 'USER'.
 *       Both admins and users use this endpoint to sign up.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully (role will be 'ADMIN' for first 3, 'USER' for others)
 */

export default userRoutes;
