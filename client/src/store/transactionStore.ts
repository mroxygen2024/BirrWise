import { create } from 'zustand';
import { Transaction } from '@/types';
import { transactionService } from '@/services/transactionService';
import { TransactionFormData } from '@/schemas';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filter: {
    category: string | null;
    search: string;
  };
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilter: (filter: Partial<TransactionState['filter']>) => void;
  getFilteredTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  filter: {
    category: null,
    search: '',
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await transactionService.getAll();
      set({ transactions, isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch',
        isLoading: false 
      });
    }
  },

  addTransaction: async (data) => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticTransaction: Transaction = {
      id: tempId,
      ...data,
      createdAt: new Date(),
    };
    
    set(state => ({
      transactions: [optimisticTransaction, ...state.transactions],
    }));

    try {
      const transaction = await transactionService.create(data);
      set(state => ({
        transactions: state.transactions.map(t => 
          t.id === tempId ? transaction : t
        ),
      }));
    } catch (err) {
      // Rollback on error
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== tempId),
        error: err instanceof Error ? err.message : 'Failed to add',
      }));
      throw err;
    }
  },

  updateTransaction: async (id, data) => {
    const originalTransactions = get().transactions;
    
    // Optimistic update
    set(state => ({
      transactions: state.transactions.map(t =>
        t.id === id ? { ...t, ...data } : t
      ),
    }));

    try {
      const updated = await transactionService.update(id, data);
      set(state => ({
        transactions: state.transactions.map(t =>
          t.id === id ? updated : t
        ),
      }));
    } catch (err) {
      // Rollback on error
      set({ 
        transactions: originalTransactions,
        error: err instanceof Error ? err.message : 'Failed to update',
      });
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    const originalTransactions = get().transactions;
    
    // Optimistic update
    set(state => ({
      transactions: state.transactions.filter(t => t.id !== id),
    }));

    try {
      await transactionService.delete(id);
      const transactions = await transactionService.getAll();
      set({ transactions });
    } catch (err) {
      // Rollback on error
      set({ 
        transactions: originalTransactions,
        error: err instanceof Error ? err.message : 'Failed to delete',
      });
      throw err;
    }
  },

  setFilter: (filter) => {
    set(state => ({
      filter: { ...state.filter, ...filter },
    }));
  },

  getFilteredTransactions: () => {
    const { transactions, filter } = get();
    return transactions.filter(t => {
      if (filter.category && t.category !== filter.category) return false;
      if (filter.search && !t.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },
}));
