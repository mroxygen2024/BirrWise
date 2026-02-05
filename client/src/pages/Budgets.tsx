import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BudgetCard } from '@/components/charts/BudgetCard';
import { BudgetEditDialog } from '@/components/forms/BudgetEditDialog';
import { budgetService } from '@/services/budgetService';
import { Budget } from '@/types';
import { Loader2 } from 'lucide-react';

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      const data = await budgetService.getMonthlyBudgets('2026-02');
      setBudgets(data);
      setIsLoading(false);
    };

    fetchBudgets();
  }, []);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleSave = async (id: string, limit: number) => {
    const updated = await budgetService.updateBudget(id, limit);
    setBudgets(budgets.map(b => b.id === id ? updated : b));
    setEditingBudget(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Budgets</h2>
          <p className="text-muted-foreground">Track your monthly spending limits by category</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        <BudgetEditDialog
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSave={handleSave}
        />
      </div>
    </AppLayout>
  );
}
