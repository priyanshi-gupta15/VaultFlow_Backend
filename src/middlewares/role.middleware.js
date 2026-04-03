// src/middlewares/role.middleware.js
import AppError from '../utils/AppError.js';

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['ADMIN', 'ANALYST']. req.user.role 'VIEWER'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

export { restrictTo };
