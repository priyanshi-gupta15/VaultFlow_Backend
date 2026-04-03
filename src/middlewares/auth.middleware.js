// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import prisma from '../prisma.js';
import AppError from '../utils/AppError.js';

const protect = async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (currentUser.status === 'INACTIVE') {
      return next(new AppError('This user account is inactive. Please contact admin.', 403));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or expired. Please log in again.', 401));
  }
};

export { protect };
