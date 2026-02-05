// Core application types

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string; // "2026-02"
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetUsedPercent: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface DailyExpense {
  date: string;
  amount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Category configuration
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
