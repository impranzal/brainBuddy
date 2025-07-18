import bcrypt from 'bcryptjs';
import prisma from '../connect/prisma ';
import { createAccessToken } from '../jwt/token';
import { AppError } from '../utils/appError';
import { validateEmail, validatePasswordStrength } from '../utils/validators';




export const registerUserService = async ({ username, name, email, password }: any) => {
  if (!username || !name || !email || !password) throw new Error('All fields are required');

  const hashedPassword = await bcrypt.hash(password, 10);
  const userCount = await prisma.user.count();

  // Assign role: first  users is ADMIN, rest are USER
  let role: 'ADMIN' | 'USER' = 'USER';
  if (userCount < 1) {
    role = 'ADMIN';
  }
  const isApproved = true;

  const user = await prisma.user.create({
    data: { username, name, email, password: hashedPassword, role, isApproved },
  });

  const token = createAccessToken(user.id, user.email, user.role);

  return {
    message: 'User created successfully.',
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};