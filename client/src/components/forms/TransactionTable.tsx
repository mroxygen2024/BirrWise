import { Transaction } from '@/types';
import { useTransactionStore } from '@/store/transactionStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export function TransactionTable({ transactions, onEdit }: TransactionTableProps) {
  const { deleteTransaction } = useTransactionStore();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions found.</p>
        <p className="text-sm">Add your first transaction to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-muted-foreground">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-income" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-expense" />
                  )}
                  {transaction.description}
                </div>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-secondary">
                  {transaction.category}
                </span>
              </TableCell>
              <TableCell className={cn(
                'text-right font-medium',
                transaction.type === 'income' ? 'text-income' : 'text-expense'
              )}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{transaction.description}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTransaction(transaction.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
