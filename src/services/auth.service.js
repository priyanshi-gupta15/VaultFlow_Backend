// src/services/auth.service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import AppError from '../utils/AppError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

const register = async (userData) => {
  const { email, password, name, role } = userData;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'VIEWER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

const login = async (email, password) => {
  // Check if email and password exist
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Check user and password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user.id);

  // Remove password from output
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export default { register, login };
