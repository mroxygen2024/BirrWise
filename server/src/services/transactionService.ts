import { TransactionModel } from "../models/Transaction";
import { ApiError } from "../utils/apiError";

export const transactionService = {
  async list(userId: string) {
    const transactions = await TransactionModel.find({ userId }).sort({ date: -1 });
    return transactions.map((t) => t.toJSON());
  },

  async create(userId: string, data: { description: string; amount: number; type: "income" | "expense"; category: string; date: Date }) {
    const transaction = await TransactionModel.create({ ...data, userId });
    return transaction.toJSON();
  },

  async update(userId: string, id: string, data: { description: string; amount: number; type: "income" | "expense"; category: string; date: Date }) {
    const updated = await TransactionModel.findOneAndUpdate(
      { _id: id, userId },
      { ...data },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new ApiError(404, "Transaction not found");
    }

    return updated.toJSON();
  },

  async remove(userId: string, id: string) {
    const deleted = await TransactionModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      throw new ApiError(404, "Transaction not found");
    }

    return { success: true };
  },
};
