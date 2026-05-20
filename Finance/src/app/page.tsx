export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NetBalanceCard } from '@/components/dashboard/NetBalanceCard'
import { PortfolioValueCard } from '@/components/dashboard/PortfolioValueCard'
import { NetWorthCard } from '@/components/dashboard/NetWorthCard'
import { ExpensePieChart } from '@/components/dashboard/ExpensePieChart'

export default async function DashboardPage() {
  const [transactions, holdings] = await Promise.all([
    prisma.transaction.findMany(),
    prisma.stockHolding.findMany(),
  ])

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses

  const portfolioValue = holdings
    .filter((h) => h.lastClosingPrice !== null)
    .reduce((sum, h) => sum + h.shares * h.lastClosingPrice!, 0)

  const netWorth = netBalance + portfolioValue

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const expensesByCategory = transactions
    .filter((t) => t.type === 'EXPENSE' && new Date(t.date) >= startOfMonth)
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NetBalanceCard value={netBalance} />
        <PortfolioValueCard value={portfolioValue} />
        <NetWorthCard value={netWorth} />
      </div>
      <ExpensePieChart data={pieData} />
    </div>
  )
}
