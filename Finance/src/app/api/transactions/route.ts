import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  const transactions = await prisma.transaction.findMany({
    where: category ? { category } : undefined,
    orderBy: { date: 'desc' },
    take: category ? undefined : 20,
  })

  return NextResponse.json(transactions)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const transaction = await prisma.transaction.create({
    data: {
      type: body.type,
      category: body.category,
      amount: parseFloat(body.amount),
      date: new Date(body.date),
      description: body.description ?? null,
      isRecurring: body.isRecurring ?? false,
    },
  })
  return NextResponse.json(transaction, { status: 201 })
}
