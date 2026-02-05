import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryExpense } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseDonutChartProps {
  data: CategoryExpense[];
}

const COLORS = [
  'hsl(142, 76%, 36%)',  // chart-1 (green)
  'hsl(217, 91%, 60%)',  // chart-2 (blue)
  'hsl(280, 65%, 60%)',  // chart-3 (purple)
  'hsl(45, 93%, 47%)',   // chart-4 (yellow)
  'hsl(0, 84%, 60%)',    // chart-5 (red)
];

export function ExpenseDonutChart({ data }: ExpenseDonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="amount"
          nameKey="category"
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              stroke="hsl(0 0% 4%)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const data = payload[0].payload as CategoryExpense;
            return (
              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                <p className="font-medium text-sm">{data.category}</p>
                <p className="text-muted-foreground text-sm">{formatCurrency(data.amount)}</p>
              </div>
            );
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
