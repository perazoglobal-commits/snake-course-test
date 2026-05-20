import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchClosingPrice } from '@/lib/finnhub'

export async function GET() {
  const holdings = await prisma.stockHolding.findMany({ orderBy: { symbol: 'asc' } })
  return NextResponse.json(holdings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const symbol = body.symbol.toUpperCase()

  const price = await fetchClosingPrice(symbol)
  const priceFields = price !== null
    ? { lastClosingPrice: price, lastUpdated: new Date() }
    : {}

  const holding = await prisma.stockHolding.upsert({
    where: { symbol },
    update: {
      shares: parseFloat(body.shares),
      averageCost: body.averageCost ? parseFloat(body.averageCost) : null,
      ...priceFields,
    },
    create: {
      symbol,
      shares: parseFloat(body.shares),
      averageCost: body.averageCost ? parseFloat(body.averageCost) : null,
      ...priceFields,
    },
  })
  return NextResponse.json(holding, { status: 201 })
}
