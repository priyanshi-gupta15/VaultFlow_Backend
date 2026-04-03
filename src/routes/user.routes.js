// src/routes/user.routes.js
import express from 'express';
import userController from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/', userController.getAllUsers);
router.patch('/:id/status', userController.updateUserStatus);
router.delete('/:id', userController.deleteUser);

export default router;
