import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionTable } from "@/components/forms/TransactionTable";
import { TransactionDialog } from "@/components/forms/TransactionDialog";
import { useTransactionStore } from "@/store/transactionStore";
import { Transaction, EXPENSE_CATEGORIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2 } from "lucide-react";

export default function Transactions() {
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    setFilter,
    filter,
    getFilteredTransactions,
  } = useTransactionStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTransaction(undefined);
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Transactions</h2>
            <p className="text-muted-foreground">
              Manage your income and expenses
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
            />
          </div>
          <Select
            value={filter.category || "all"}
            onValueChange={(value) =>
              setFilter({ category: value === "all" ? null : value })
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchTransactions}>
              Retry
            </Button>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEdit}
          />
        )}

        {/* Dialog */}
        <TransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          transaction={editingTransaction}
          onClose={handleDialogClose}
        />
      </div>
    </AppLayout>
  );
}
