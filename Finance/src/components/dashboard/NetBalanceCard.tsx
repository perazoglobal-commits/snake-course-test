import { Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function NetBalanceCard({ value }: { value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {fmt.format(value)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Total income minus expenses</p>
      </CardContent>
    </Card>
  )
}
