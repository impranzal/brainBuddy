import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const jwtConfig: { secret: string; expiresIn: string } = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1d',
}; 