import { useState } from 'react';
import { Budget } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface BudgetEditDialogProps {
  budget: Budget | null;
  onClose: () => void;
  onSave: (id: string, limit: number) => Promise<void>;
}

export function BudgetEditDialog({ budget, onClose, onSave }: BudgetEditDialogProps) {
  const [limit, setLimit] = useState(budget?.limit || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!budget) return;
    setIsLoading(true);
    await onSave(budget.id, limit);
    setIsLoading(false);
  };

  // Update limit when budget changes
  if (budget && budget.limit !== limit && !isLoading) {
    setLimit(budget.limit);
  }

  return (
    <Dialog open={!!budget} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            Update the monthly limit for {budget?.category}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit ($)</Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
