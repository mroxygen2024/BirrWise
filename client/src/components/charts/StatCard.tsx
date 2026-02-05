import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'income' | 'expense' | 'savings';
}

export function StatCard({ title, value, icon, trend, variant = 'default' }: StatCardProps) {
  const glowClass = {
    default: '',
    income: 'glow-green',
    expense: 'glow-red',
    savings: 'glow-blue',
  }[variant];

  const iconColorClass = {
    default: 'text-muted-foreground',
    income: 'text-income',
    expense: 'text-expense',
    savings: 'text-savings',
  }[variant];

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (variant === 'expense') {
      // For expenses, up is bad, down is good
      return trend.value > 0 ? 'text-expense' : 'text-income';
    }
    // For income/savings, up is good
    return trend.value > 0 ? 'text-income' : 'text-expense';
  };

  return (
    <Card className={cn('bg-card border-border', glowClass)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
                {getTrendIcon()}
                <span>{Math.abs(trend.value)}% {trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-lg bg-secondary', iconColorClass)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
