'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, type PieLabelRenderProps } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
]

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface Props {
  data: { name: string; value: number }[]
}

export function ExpensePieChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Expenses by Category (This Month)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
            No expense data for this month
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }: PieLabelRenderProps) =>
                  percent != null ? `${name ?? ''} ${(percent * 100).toFixed(0)}%` : (name ?? '')
                }
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => typeof v === 'number' ? fmt.format(v) : String(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
