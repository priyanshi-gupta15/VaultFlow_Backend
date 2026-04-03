// src/validation/finance.schema.js
import { z } from 'zod';

const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1, 'Category is required'),
    date: z.string().optional(), // Will be parsed to Date object
    description: z.string().optional(),
  }),
});

const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  }),
});

export { createRecordSchema, updateRecordSchema };
