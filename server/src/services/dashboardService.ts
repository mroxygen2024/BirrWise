import { Types } from "mongoose";
import { TransactionModel } from "../models/Transaction";
import { BudgetModel } from "../models/Budget";
import { ApiError } from "../utils/apiError";

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "hsl(var(--chart-1))",
  "Transportation": "hsl(var(--chart-2))",
  "Entertainment": "hsl(var(--chart-3))",
  "Shopping": "hsl(var(--chart-4))",
  "Bills & Utilities": "hsl(var(--chart-5))",
  "Healthcare": "hsl(var(--chart-1))",
  "Education": "hsl(var(--chart-2))",
  "Travel": "hsl(var(--chart-3))",
  "Other": "hsl(var(--chart-4))",
};

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}

function parseMonthOrThrow(month?: string) {
  if (!month) {
    return new Date();
  }

  const match = /^\d{4}-\d{2}$/.exec(month);
  if (!match) {
    throw new ApiError(400, "Invalid month format. Expected YYYY-MM");
  }

  const [year, monthStr] = month.split("-").map(Number);
  if (Number.isNaN(year) || Number.isNaN(monthStr) || monthStr < 1 || monthStr > 12) {
    throw new ApiError(400, "Invalid month format. Expected YYYY-MM");
  }

  return new Date(Date.UTC(year, monthStr - 1, 1));
}

export const dashboardService = {
  async summary(userId: string, month?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const targetMonth = parseMonthOrThrow(month);
    const start = startOfMonth(targetMonth);
    const end = endOfMonth(targetMonth);
    const prevMonth = new Date(Date.UTC(targetMonth.getUTCFullYear(), targetMonth.getUTCMonth() - 1, 1));
    const prevStart = startOfMonth(prevMonth);
    const prevEnd = endOfMonth(prevMonth);

    const [incomeAgg, expenseAgg, prevIncomeAgg, prevExpenseAgg, budgets] = await Promise.all([
      TransactionModel.aggregate([
        { $match: { userId: userObjectId, type: "income", date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      TransactionModel.aggregate([
        { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      TransactionModel.aggregate([
        { $match: { userId: userObjectId, type: "income", date: { $gte: prevStart, $lt: prevEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      TransactionModel.aggregate([
        { $match: { userId: userObjectId, type: "expense", date: { $gte: prevStart, $lt: prevEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      BudgetModel.find({ userId: userObjectId, month: month || start.toISOString().slice(0, 7) }).lean(),
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const netSavings = totalIncome - totalExpenses;

    const prevIncome = prevIncomeAgg[0]?.total || 0;
    const prevExpenses = prevExpenseAgg[0]?.total || 0;
    const prevNetSavings = prevIncome - prevExpenses;

    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return null;
      return Math.round(((current - previous) / previous) * 100);
    };

    const incomeTrendPercent = calcTrend(totalIncome, prevIncome);
    const expenseTrendPercent = calcTrend(totalExpenses, prevExpenses);
    const netSavingsTrendPercent = calcTrend(netSavings, prevNetSavings);

    const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
    const budgetUsedPercent = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      budgetUsedPercent: Math.round(budgetUsedPercent),
      incomeTrendPercent,
      expenseTrendPercent,
      netSavingsTrendPercent,
    };
  },

  async categoryExpenses(userId: string, month?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const targetMonth = parseMonthOrThrow(month);
    const start = startOfMonth(targetMonth);
    const end = endOfMonth(targetMonth);

    const agg = await TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]);

    return agg.map((item) => ({
      category: item._id,
      amount: item.amount,
      color: CATEGORY_COLORS[item._id] || "hsl(var(--chart-1))",
    }));
  },

  async monthly(userId: string, month?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const now = parseMonthOrThrow(month);
    const months: Date[] = [];

    for (let i = 3; i >= 0; i -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      months.push(date);
    }

    const results = await Promise.all(
      months.map(async (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const [incomeAgg, expenseAgg] = await Promise.all([
          TransactionModel.aggregate([
            { $match: { userId: userObjectId, type: "income", date: { $gte: start, $lt: end } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
          TransactionModel.aggregate([
            { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
        ]);

        return {
          month: monthLabel(date),
          income: incomeAgg[0]?.total || 0,
          expenses: expenseAgg[0]?.total || 0,
        };
      }),
    );

    return results;
  },

  async dailyExpenses(userId: string, month?: string) {
    const userObjectId = new Types.ObjectId(userId);
    const now = parseMonthOrThrow(month);
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const agg = await TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } },
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
    const expenseByDay = new Map(agg.map((a) => [a._id.day, a.amount]));

    const results = [] as { date: string; amount: number }[];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const labelDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day));
      const label = labelDate.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      results.push({
        date: label,
        amount: expenseByDay.get(day) || 0,
      });
    }

    return results;
  },
};
