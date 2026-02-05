import { Budget } from '@/types';
import { apiClient } from '@/services/apiClient';

export const budgetService = {
  async getMonthlyBudgets(month?: string): Promise<Budget[]> {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    return apiClient.get<Budget[]>(`/budgets?month=${targetMonth}`, true);
  },

  async updateBudget(id: string, limit: number): Promise<Budget> {
    return apiClient.put<Budget>(`/budgets/${id}`, { limit }, true);
  },
};
