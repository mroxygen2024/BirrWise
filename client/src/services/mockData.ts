import { Transaction, Budget, CategoryExpense, MonthlyData, DailyExpense } from '@/types';

// Mock transactions (minimal dataset)
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Monthly Salary',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-02-01'),
    createdAt: new Date('2026-02-01'),
  },
  {
    id: '2',
    description: 'Grocery Shopping',
    amount: 150,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2026-02-02'),
    createdAt: new Date('2026-02-02'),
  },
  {
    id: '3',
    description: 'Netflix Subscription',
    amount: 15,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-02-03'),
    createdAt: new Date('2026-02-03'),
  },
  {
    id: '4',
    description: 'Uber Rides',
    amount: 45,
    type: 'expense',
    category: 'Transportation',
    date: new Date('2026-02-04'),
    createdAt: new Date('2026-02-04'),
  },
  {
    id: '5',
    description: 'Freelance Project',
    amount: 800,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-02-05'),
    createdAt: new Date('2026-02-05'),
  },
  {
    id: '6',
    description: 'Electric Bill',
    amount: 120,
    type: 'expense',
    category: 'Bills & Utilities',
    date: new Date('2026-02-04'),
    createdAt: new Date('2026-02-04'),
  },
  {
    id: '7',
    description: 'Restaurant Dinner',
    amount: 85,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2026-02-03'),
    createdAt: new Date('2026-02-03'),
  },
  {
    id: '8',
    description: 'New Shoes',
    amount: 120,
    type: 'expense',
    category: 'Shopping',
    date: new Date('2026-02-02'),
    createdAt: new Date('2026-02-02'),
  },
];

// Mock budgets
export const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 500, spent: 235, month: '2026-02' },
  { id: '2', category: 'Transportation', limit: 200, spent: 45, month: '2026-02' },
  { id: '3', category: 'Entertainment', limit: 150, spent: 15, month: '2026-02' },
  { id: '4', category: 'Shopping', limit: 300, spent: 120, month: '2026-02' },
  { id: '5', category: 'Bills & Utilities', limit: 400, spent: 120, month: '2026-02' },
];

// Category colors for charts
export const categoryColors: Record<string, string> = {
  'Food & Dining': 'hsl(var(--chart-1))',
  'Transportation': 'hsl(var(--chart-2))',
  'Entertainment': 'hsl(var(--chart-3))',
  'Shopping': 'hsl(var(--chart-4))',
  'Bills & Utilities': 'hsl(var(--chart-5))',
  'Healthcare': 'hsl(var(--chart-1))',
  'Education': 'hsl(var(--chart-2))',
  'Travel': 'hsl(var(--chart-3))',
  'Other': 'hsl(var(--chart-4))',
};

// Mock category expenses for pie chart
export const mockCategoryExpenses: CategoryExpense[] = [
  { category: 'Food & Dining', amount: 235, color: categoryColors['Food & Dining'] },
  { category: 'Transportation', amount: 45, color: categoryColors['Transportation'] },
  { category: 'Entertainment', amount: 15, color: categoryColors['Entertainment'] },
  { category: 'Shopping', amount: 120, color: categoryColors['Shopping'] },
  { category: 'Bills & Utilities', amount: 120, color: categoryColors['Bills & Utilities'] },
];

// Mock monthly data for bar chart
export const mockMonthlyData: MonthlyData[] = [
  { month: 'Nov', income: 5200, expenses: 3800 },
  { month: 'Dec', income: 5500, expenses: 4200 },
  { month: 'Jan', income: 5000, expenses: 3500 },
  { month: 'Feb', income: 5800, expenses: 535 },
];

// Mock daily expenses for line chart
export const mockDailyExpenses: DailyExpense[] = [
  { date: 'Feb 1', amount: 0 },
  { date: 'Feb 2', amount: 270 },
  { date: 'Feb 3', amount: 100 },
  { date: 'Feb 4', amount: 165 },
  { date: 'Feb 5', amount: 0 },
];

// AI mock responses
export const mockAIResponses = [
  "Based on your spending patterns, I notice you're spending 47% of your food budget on dining out. Consider meal prepping to save approximately ETB 150/month.",
  "Great news! Your savings rate this month is 23%, which is above the recommended 20%. Keep up the good work!",
  "I've noticed your entertainment expenses are well under budget. You might consider reallocating some of that budget to your savings goals.",
  "Your transportation costs are very low this month. If you're working remotely, consider adjusting your budget to reflect this change.",
  "Looking at your income trends, your freelance work has been growing. Consider setting up a separate emergency fund for variable income months.",
];
