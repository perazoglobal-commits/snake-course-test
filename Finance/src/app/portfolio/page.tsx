'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HoldingForm } from '@/components/portfolio/HoldingForm'
import { HoldingTable } from '@/components/portfolio/HoldingTable'
import { StockHolding } from '@/types'

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<StockHolding[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await fetch('/api/holdings/refresh', { method: 'POST' })
    } finally {
      setRefreshing(false)
    }
  }, [])

  const load = useCallback(async () => {
    const res = await fetch('/api/holdings')
    setHoldings(await res.json())
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      await refresh()
      if (!cancelled) await load()
    }
    init()
    return () => { cancelled = true }
  }, [refresh, load, refreshKey])

  async function handleDelete(id: string) {
    await fetch(`/api/holdings/${id}`, { method: 'DELETE' })
    setRefreshKey((k) => k + 1)
  }

  async function handleManualRefresh() {
    await refresh()
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Portfolio</h1>
        <Button variant="outline" size="sm" onClick={handleManualRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing…' : 'Refresh Prices'}
        </Button>
      </div>
      <HoldingForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      <HoldingTable holdings={holdings} onDelete={handleDelete} refreshing={refreshing} />
    </div>
  )
}
