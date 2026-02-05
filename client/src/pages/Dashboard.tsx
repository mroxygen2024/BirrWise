import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/charts/StatCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { ExpenseDonutChart } from '@/components/charts/ExpenseDonutChart';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';
import { SpendingTrendChart } from '@/components/charts/SpendingTrendChart';
import { dashboardService } from '@/services/dashboardService';
import { DashboardSummary, CategoryExpense, MonthlyData, DailyExpense } from '@/types';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { DollarSign, TrendingDown, PiggyBank, Target, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [summaryData, categoryData, monthlyDataRes, dailyData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getCategoryExpenses(),
        dashboardService.getMonthlyData(),
        dashboardService.getDailyExpenses(),
      ]);
      setSummary(summaryData);
      setCategoryExpenses(categoryData);
      setMonthlyData(monthlyDataRes);
      setDailyExpenses(dailyData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading || !summary) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Your financial overview for February 2026</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Income"
            value={formatCurrency(summary.totalIncome)}
            icon={<DollarSign className="h-5 w-5" />}
            variant="income"
            trend={{ value: 12, label: 'vs last month' }}
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(summary.totalExpenses)}
            icon={<TrendingDown className="h-5 w-5" />}
            variant="expense"
            trend={{ value: -8, label: 'vs last month' }}
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(summary.netSavings)}
            icon={<PiggyBank className="h-5 w-5" />}
            variant="savings"
            trend={{ value: 23, label: 'vs last month' }}
          />
          <StatCard
            title="Budget Status"
            value={formatPercent(summary.budgetUsedPercent)}
            icon={<Target className="h-5 w-5" />}
            variant="default"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Expenses by Category" description="February 2026">
            <ExpenseDonutChart data={categoryExpenses} />
          </ChartCard>

          <ChartCard title="Income vs Expenses" description="Last 4 months">
            <IncomeExpenseChart data={monthlyData} />
          </ChartCard>
        </div>

        <ChartCard title="Spending Trend" description="Daily expenses this month">
          <SpendingTrendChart data={dailyExpenses} />
        </ChartCard>
      </div>
    </AppLayout>
  );
}
