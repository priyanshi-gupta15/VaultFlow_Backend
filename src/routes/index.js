// src/routes/index.js
import express from 'express';
import authRoutes from './auth.routes.js';
import financeRoutes from './finance.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/finance', financeRoutes);
router.use('/users', userRoutes);

export default router;
