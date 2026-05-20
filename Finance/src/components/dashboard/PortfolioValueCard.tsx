import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function PortfolioValueCard({ value }: { value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{fmt.format(value)}</p>
        <p className="text-xs text-muted-foreground mt-1">Current stock holdings value</p>
      </CardContent>
    </Card>
  )
}
