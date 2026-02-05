import { DashboardSummary, CategoryExpense, MonthlyData, DailyExpense } from '@/types';
import { mockCategoryExpenses, mockMonthlyData, mockDailyExpenses } from './mockData';
import { delay } from '@/utils/formatters';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    await delay(300);
    
    return {
      totalIncome: 5800,
      totalExpenses: 535,
      netSavings: 5265,
      budgetUsedPercent: 34,
    };
  },

  async getCategoryExpenses(): Promise<CategoryExpense[]> {
    await delay(300);
    return mockCategoryExpenses;
  },

  async getMonthlyData(): Promise<MonthlyData[]> {
    await delay(300);
    return mockMonthlyData;
  },

  async getDailyExpenses(): Promise<DailyExpense[]> {
    await delay(300);
    return mockDailyExpenses;
  },
};
