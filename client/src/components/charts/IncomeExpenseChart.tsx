import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyData } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface IncomeExpenseChartProps {
  data: MonthlyData[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(0 0% 18%)" 
          vertical={false}
        />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(0 0% 60%)', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(0 0% 60%)', fontSize: 12 }}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                <p className="font-medium text-sm mb-2">{label}</p>
                {payload.map((entry, index) => (
                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                    {entry.name}: {formatCurrency(entry.value as number)}
                  </p>
                ))}
              </div>
            );
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => (
            <span className="text-xs text-muted-foreground capitalize">{value}</span>
          )}
        />
        <Bar 
          dataKey="income" 
          fill="hsl(142, 76%, 36%)" 
          radius={[4, 4, 0, 0]}
          name="Income"
        />
        <Bar 
          dataKey="expenses" 
          fill="hsl(0, 84%, 60%)" 
          radius={[4, 4, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
