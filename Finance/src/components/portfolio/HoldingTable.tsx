'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StockHolding } from '@/types'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface Props {
  holdings: StockHolding[]
  onDelete: (id: string) => void
  refreshing: boolean
}

export function HoldingTable({ holdings, onDelete, refreshing }: Props) {
  if (holdings.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">No holdings yet.</p>
  }

  const totalValue = holdings
    .filter((h) => h.lastClosingPrice !== null)
    .reduce((sum, h) => sum + h.shares * h.lastClosingPrice!, 0)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Last Price</TableHead>
          <TableHead className="text-right">Total Value</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((h) => {
          const value = h.lastClosingPrice !== null ? h.shares * h.lastClosingPrice : null
          return (
            <TableRow key={h.id}>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">{h.symbol}</Badge>
              </TableCell>
              <TableCell className="text-right text-sm">{h.shares.toLocaleString()}</TableCell>
              <TableCell className="text-right text-sm">
                {refreshing ? (
                  <span className="text-muted-foreground">…</span>
                ) : h.lastClosingPrice !== null ? (
                  fmt.format(h.lastClosingPrice)
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {value !== null ? fmt.format(value) : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(h.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
        {holdings.length > 0 && (
          <TableRow className="font-medium border-t-2">
            <TableCell colSpan={3} className="text-sm">Total Portfolio Value</TableCell>
            <TableCell className="text-right text-sm font-bold">{fmt.format(totalValue)}</TableCell>
            <TableCell />
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
