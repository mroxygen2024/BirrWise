import { Budget } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { Pencil, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
}

export function BudgetCard({ budget, onEdit }: BudgetCardProps) {
  const percentage = (budget.spent / budget.limit) * 100;
  const isOverBudget = percentage > 100;
  const isWarning = percentage >= 80 && percentage <= 100;

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-expense';
    if (isWarning) return 'bg-chart-4'; // yellow
    return 'bg-income';
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-medium text-sm">{budget.category}</h3>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(budget.spent)}
              <span className="text-sm text-muted-foreground font-normal">
                {' '}/ {formatCurrency(budget.limit)}
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(budget)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Progress 
            value={Math.min(percentage, 100)} 
            className="h-2 bg-secondary"
            indicatorClassName={getProgressColor()}
          />
          
          <div className="flex items-center justify-between text-xs">
            <span className={cn(
              isOverBudget ? 'text-expense' : isWarning ? 'text-chart-4' : 'text-income'
            )}>
              {Math.round(percentage)}% used
            </span>
            {isOverBudget && (
              <div className="flex items-center gap-1 text-expense">
                <AlertTriangle className="h-3 w-3" />
                <span>Over budget by {formatCurrency(budget.spent - budget.limit)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
