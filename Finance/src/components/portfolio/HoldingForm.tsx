'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  onSuccess: () => void
}

export function HoldingForm({ onSuccess }: Props) {
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState('')
  const [averageCost, setAverageCost] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!symbol || !shares) return
    setLoading(true)
    try {
      await fetch('/api/holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), shares, averageCost: averageCost || null }),
      })
      setSymbol('')
      setShares('')
      setAverageCost('')
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add / Update Holding</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Ticker Symbol</Label>
            <Input
              placeholder="e.g. AAPL"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Shares</Label>
            <Input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.00"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Avg Cost (optional)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={averageCost}
              onChange={(e) => setAverageCost(e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <Button type="submit" disabled={loading || !symbol || !shares} className="w-full">
              {loading ? 'Saving…' : 'Save Holding'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
