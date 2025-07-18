import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at most 30 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),

  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z
    .string()
    .email('Invalid email format')
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .regex(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    ),

  profilePicture: z.string().optional(),

  role: z.enum(['USER', 'ADMIN']).default('USER').optional(),

  isApproved: z.boolean().default(false).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export default createUserSchema;
