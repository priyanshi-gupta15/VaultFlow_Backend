// src/services/auth.service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import AppError from '../utils/AppError.js';

/**
 * Generates a signed JWT token for a user ID.
 * @param {string} id - The user ID to sign.
 * @returns {string} - The JWT token.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

/**
 * Registers a new user and returns user data with an auth token.
 * @param {Object} userData - Incoming user registration data.
 * @returns {Promise<{user: Object, token: string}>}
 */
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

/**
 * Authenticates a user and returns user data with an auth token.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object, token: string}>}
 */
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
