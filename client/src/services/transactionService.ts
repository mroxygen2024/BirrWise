import { Transaction } from '@/types';
import { TransactionFormData } from '@/schemas';
import { apiClient } from '@/services/apiClient';

function normalizeTransaction(transaction: Transaction) {
  return {
    ...transaction,
    date: new Date(transaction.date),
    createdAt: new Date(transaction.createdAt),
  } as Transaction;
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const data = await apiClient.get<Transaction[]>('/transactions', true);
    return data.map(normalizeTransaction).sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async create(data: TransactionFormData): Promise<Transaction> {
    const transaction = await apiClient.post<Transaction>('/transactions', data, true);
    return normalizeTransaction(transaction);
  },

  async update(id: string, data: TransactionFormData): Promise<Transaction> {
    const updated = await apiClient.put<Transaction>(`/transactions/${id}`, data, true);
    return normalizeTransaction(updated);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`, true);
  },
};
