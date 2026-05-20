import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchClosingPrice } from '@/lib/finnhub'

export async function POST() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const holdings = await prisma.stockHolding.findMany({
    where: {
      OR: [{ lastUpdated: null }, { lastUpdated: { lt: today } }],
    },
  })

  const results = await Promise.allSettled(
    holdings.map(async (h) => {
      const price = await fetchClosingPrice(h.symbol)
      if (price !== null) {
        return prisma.stockHolding.update({
          where: { id: h.id },
          data: { lastClosingPrice: price, lastUpdated: new Date() },
        })
      }
    })
  )

  const updated = results.filter((r) => r.status === 'fulfilled' && r.value != null).length
  return NextResponse.json({ updated })
}
