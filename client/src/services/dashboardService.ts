import { DashboardSummary, CategoryExpense, MonthlyData, DailyExpense } from '@/types';
import { apiClient } from '@/services/apiClient';

function getMonthParam(month?: string) {
  return month || new Date().toISOString().slice(0, 7);
}

export const dashboardService = {
  async getSummary(month?: string): Promise<DashboardSummary> {
    const targetMonth = getMonthParam(month);
    return apiClient.get<DashboardSummary>(`/dashboard/summary?month=${targetMonth}`, true);
  },

  async getCategoryExpenses(month?: string): Promise<CategoryExpense[]> {
    const targetMonth = getMonthParam(month);
    return apiClient.get<CategoryExpense[]>(`/dashboard/category-expenses?month=${targetMonth}`, true);
  },

  async getMonthlyData(month?: string): Promise<MonthlyData[]> {
    const targetMonth = getMonthParam(month);
    return apiClient.get<MonthlyData[]>(`/dashboard/monthly?month=${targetMonth}`, true);
  },

  async getDailyExpenses(month?: string): Promise<DailyExpense[]> {
    const targetMonth = getMonthParam(month);
    return apiClient.get<DailyExpense[]>(`/dashboard/daily-expenses?month=${targetMonth}`, true);
  },
};
