import { Budget } from '@/types';
import { mockBudgets } from './mockData';
import { delay } from '@/utils/formatters';

// In-memory store for mock data
let budgets = [...mockBudgets];

export const budgetService = {
  async getMonthlyBudgets(month?: string): Promise<Budget[]> {
    await delay(300);
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    return budgets.filter(b => b.month === targetMonth);
  },

  async updateBudget(id: string, limit: number): Promise<Budget> {
    await delay(300);
    
    const index = budgets.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }
    
    budgets[index] = { ...budgets[index], limit };
    return budgets[index];
  },
};
