export type TransactionType = 'INCOME' | 'EXPENSE'

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Housing',
  'Transportation',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Education',
  'Subscription',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Dividend',
  'Gift',
  'Other',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]

export interface Transaction {
  id: string
  type: TransactionType
  category: string
  amount: number
  date: string
  description: string | null
  isRecurring: boolean
  createdAt: string
}

export interface StockHolding {
  id: string
  symbol: string
  shares: number
  averageCost: number | null
  lastClosingPrice: number | null
  lastUpdated: string | null
  createdAt: string
}
