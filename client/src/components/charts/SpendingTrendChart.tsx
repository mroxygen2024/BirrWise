import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyExpense } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface SpendingTrendChartProps {
  data: DailyExpense[];
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(0 0% 18%)" 
          vertical={false}
        />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(0 0% 60%)', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(0 0% 60%)', fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-savings text-sm">
                  {formatCurrency(payload[0].value as number)}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorExpense)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
