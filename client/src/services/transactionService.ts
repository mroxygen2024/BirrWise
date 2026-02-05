import { Transaction } from '@/types';
import { TransactionFormData } from '@/schemas';
import { mockTransactions } from './mockData';
import { delay, generateId } from '@/utils/formatters';

// In-memory store for mock data
let transactions = [...mockTransactions];

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    await delay(300);
    return [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  async create(data: TransactionFormData): Promise<Transaction> {
    await delay(300);
    
    const transaction: Transaction = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    
    transactions.push(transaction);
    return transaction;
  },

  async update(id: string, data: TransactionFormData): Promise<Transaction> {
    await delay(300);
    
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    const updated: Transaction = {
      ...transactions[index],
      ...data,
    };
    
    transactions[index] = updated;
    return updated;
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    transactions = transactions.filter(t => t.id !== id);
  },
};
