'use client'

import { useEffect, useState, useCallback } from 'react'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { Transaction } from '@/types'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(async () => {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    setTransactions(data)
  }, [])

  useEffect(() => { load() }, [load, refreshKey])

  async function handleDelete(id: string) {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Transactions</h1>
      <TransactionForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-2">Recent (last 20)</h2>
        <TransactionTable transactions={transactions} onDelete={handleDelete} />
      </div>
    </div>
  )
}
