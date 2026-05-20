import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const holdings = await prisma.stockHolding.findMany({ orderBy: { symbol: 'asc' } })
  return NextResponse.json(holdings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const holding = await prisma.stockHolding.upsert({
    where: { symbol: body.symbol.toUpperCase() },
    update: {
      shares: parseFloat(body.shares),
      averageCost: body.averageCost ? parseFloat(body.averageCost) : null,
    },
    create: {
      symbol: body.symbol.toUpperCase(),
      shares: parseFloat(body.shares),
      averageCost: body.averageCost ? parseFloat(body.averageCost) : null,
    },
  })
  return NextResponse.json(holding, { status: 201 })
}
