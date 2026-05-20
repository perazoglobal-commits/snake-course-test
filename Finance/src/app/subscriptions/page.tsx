'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList'
import { Transaction } from '@/types'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Transaction[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(async () => {
    const res = await fetch('/api/transactions?category=Subscription')
    setSubscriptions(await res.json())
  }, [])

  useEffect(() => { load() }, [load, refreshKey])

  async function handleDelete(id: string) {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    setRefreshKey((k) => k + 1)
  }

  const now = new Date()
  const monthlyTotal = subscriptions
    .filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Subscriptions</h1>
      <Card className="w-fit min-w-48">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500">{fmt.format(monthlyTotal)}</p>
          <p className="text-xs text-muted-foreground mt-1">Current month total</p>
        </CardContent>
      </Card>
      <SubscriptionList subscriptions={subscriptions} onDelete={handleDelete} />
    </div>
  )
}
