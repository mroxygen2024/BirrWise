import { Types } from "mongoose";
import { BudgetModel } from "../models/Budget";
import { TransactionModel } from "../models/Transaction";
import { ApiError } from "../utils/apiError";

function getMonthRange(month: string) {
  const [year, monthStr] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthStr - 1, 1));
  const end = new Date(Date.UTC(year, monthStr, 1));
  return { start, end };
}

export const budgetService = {
  async list(userId: string, month: string) {
    const budgets = await BudgetModel.find({ userId, month });
    if (budgets.length === 0) return [];

    const { start, end } = getMonthRange(month);
    const userObjectId = new Types.ObjectId(userId);
    const expenseTotals = await TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const spentByCategory = new Map(expenseTotals.map((e) => [e._id, e.total]));

    return budgets.map((b) => ({
      ...b.toJSON(),
      spent: spentByCategory.get(b.category) || 0,
    }));
  },

  async update(userId: string, id: string, limit: number) {
    const updated = await BudgetModel.findOneAndUpdate(
      { _id: id, userId },
      { limit },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new ApiError(404, "Budget not found");
    }

    const { start, end } = getMonthRange(updated.month);
    const userObjectId = new Types.ObjectId(userId);
    const expenseTotals = await TransactionModel.aggregate([
      { $match: { userId: userObjectId, type: "expense", category: updated.category, date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const spent = expenseTotals[0]?.total || 0;

    return { ...updated.toJSON(), spent };
  },
};
