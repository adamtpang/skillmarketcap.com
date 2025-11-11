"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { formatSalary } from '@/lib/utils';

interface SkillChartProps {
  data: { date: string; salary: number; openings: number }[];
}

export function SkillChart({ data }: SkillChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          tickFormatter={(value) => formatSalary(value)}
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))',
          }}
          formatter={(value: number) => formatSalary(value)}
          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
        />
        <Line
          type="monotone"
          dataKey="salary"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
