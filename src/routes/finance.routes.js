// src/routes/finance.routes.js
import express from 'express';
import financeController from '../controllers/finance.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validation.middleware.js';
import { createRecordSchema, updateRecordSchema } from '../validation/finance.schema.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Viewer, Analyst, Admin
router.get('/', financeController.getAllRecords);

// Analyst, Admin
router.get('/summary', restrictTo('ANALYST', 'ADMIN'), financeController.getSummary);

// Only Admin
router.post('/', restrictTo('ADMIN'), validate(createRecordSchema), financeController.createRecord);
router.patch('/:id', restrictTo('ADMIN'), validate(updateRecordSchema), financeController.updateRecord);
router.delete('/:id', restrictTo('ADMIN'), financeController.deleteRecord);

export default router;
