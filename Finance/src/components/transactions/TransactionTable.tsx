'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Transaction } from '@/types'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface Props {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionTable({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="text-sm">{new Date(t.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={t.type === 'INCOME' ? 'default' : 'destructive'} className="text-xs">
                {t.type}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{t.category}</TableCell>
            <TableCell className={`text-right text-sm font-medium ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
              {t.type === 'INCOME' ? '+' : '-'}{fmt.format(t.amount)}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{t.description ?? '—'}</TableCell>
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
