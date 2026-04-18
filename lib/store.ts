import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  imageUrl?: string
  extractedText?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

interface BookkeepingState {
  isAuthenticated: boolean
  transactions: Transaction[]
  categories: Category[]
  totalIncome: number
  totalExpenses: number
  
  // Actions
  setAuthenticated: (value: boolean) => void
  addTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  getBalance: () => number
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Sales', icon: 'TrendingUp', color: 'from-emerald-400 to-teal-500', type: 'income' },
  { id: '2', name: 'Services', icon: 'Briefcase', color: 'from-blue-400 to-cyan-500', type: 'income' },
  { id: '3', name: 'Investments', icon: 'PiggyBank', color: 'from-violet-400 to-purple-500', type: 'income' },
  { id: '4', name: 'Supplies', icon: 'Package', color: 'from-orange-400 to-amber-500', type: 'expense' },
  { id: '5', name: 'Utilities', icon: 'Zap', color: 'from-yellow-400 to-orange-500', type: 'expense' },
  { id: '6', name: 'Travel', icon: 'Plane', color: 'from-pink-400 to-rose-500', type: 'expense' },
  { id: '7', name: 'Food', icon: 'Coffee', color: 'from-amber-400 to-yellow-500', type: 'expense' },
  { id: '8', name: 'Other', icon: 'MoreHorizontal', color: 'from-gray-400 to-slate-500', type: 'expense' },
]

export const useBookkeepingStore = create<BookkeepingState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      transactions: [],
      categories: defaultCategories,
      totalIncome: 0,
      totalExpenses: 0,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      addTransaction: (transaction) => {
        set((state) => {
          const newTransactions = [transaction, ...state.transactions]
          const totalIncome = newTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
          const totalExpenses = newTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
          return {
            transactions: newTransactions,
            totalIncome,
            totalExpenses,
          }
        })
      },

      deleteTransaction: (id) => {
        set((state) => {
          const newTransactions = state.transactions.filter((t) => t.id !== id)
          const totalIncome = newTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
          const totalExpenses = newTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
          return {
            transactions: newTransactions,
            totalIncome,
            totalExpenses,
          }
        })
      },

      getBalance: () => {
        const state = get()
        return state.totalIncome - state.totalExpenses
      },
    }),
    {
      name: 'bookkeeping-storage',
    }
  )
)
