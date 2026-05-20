'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Transaction } from '@/types'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface Props {
  subscriptions: Transaction[]
  onDelete: (id: string) => void
}

export function SubscriptionList({ subscriptions, onDelete }: Props) {
  if (subscriptions.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">No subscriptions found.</p>
  }

  const sorted = [...subscriptions].sort((a, b) => Number(b.isRecurring) - Number(a.isRecurring))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name / Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Recurring</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="text-sm">{new Date(t.date).toLocaleDateString()}</TableCell>
            <TableCell className="text-sm">{t.description ?? t.category}</TableCell>
            <TableCell className="text-right text-sm font-medium text-red-500">
              {fmt.format(t.amount)}
            </TableCell>
            <TableCell>
              {t.isRecurring && (
                <Badge variant="secondary" className="text-xs">Recurring</Badge>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(t.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
