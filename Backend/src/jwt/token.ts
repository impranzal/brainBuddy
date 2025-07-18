import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../utils/config';
import type { StringValue } from 'ms';

if (!jwtConfig.secret) {
  throw new Error('JWT secret is not defined in the configuration');
}

// Create Access Token
export const createAccessToken = (userId: string | number, email: string, role: string): string => {
  const payload = { userId, email, role };
  const options: SignOptions = { expiresIn: jwtConfig.expiresIn as StringValue };
  return jwt.sign(payload, jwtConfig.secret, options);
};

// Create Refresh Token
export const createRefreshToken = (userId: number, email: string): string => {
  const payload = { userId, email };
  const options: SignOptions = { expiresIn: '15d' as StringValue };
  return jwt.sign(payload, jwtConfig.secret, options); // Refresh token lasts 7 days
};

// Verify Access Token
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
