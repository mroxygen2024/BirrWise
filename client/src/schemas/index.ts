import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Transaction schema - all fields required
export const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
});

// Type that ensures all fields are present (for creating transactions)
export type TransactionFormData = {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
};

// Budget schema
export const budgetSchema = z.object({
  limit: z.number().positive('Budget limit must be positive'),
});

// Infer types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
