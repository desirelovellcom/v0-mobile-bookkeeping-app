'use client'

import { useBookkeepingStore } from '@/lib/store'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Bell,
  Settings
} from 'lucide-react'

export function Dashboard() {
  const { transactions, totalIncome, totalExpenses, getBalance } = useBookkeepingStore()
  const balance = getBalance()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back</p>
            <h1 className="text-2xl font-bold text-white">Your Business</h1>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
              <Bell className="w-5 h-5 text-white/70" />
            </button>
            <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
              <Settings className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <p className="text-black/70 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-4xl font-bold text-black mb-6">{formatCurrency(balance)}</h2>
            
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-black/70 text-xs">Income</p>
                  <p className="text-black font-semibold">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-black/70 text-xs">Expenses</p>
                  <p className="text-black font-semibold">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <p className="text-muted-foreground text-sm">This Month</p>
            <p className="text-white text-xl font-bold">{formatCurrency(totalIncome)}</p>
            <p className="text-emerald-400 text-xs mt-1">Income</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-3">
              <TrendingDown className="w-5 h-5 text-black" />
            </div>
            <p className="text-muted-foreground text-sm">This Month</p>
            <p className="text-white text-xl font-bold">{formatCurrency(totalExpenses)}</p>
            <p className="text-rose-400 text-xs mt-1">Expenses</p>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <button className="text-muted-foreground text-sm hover:text-white transition-colors">
            See all
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-white font-medium mb-1">No transactions yet</p>
            <p className="text-muted-foreground text-sm">
              Tap the scan button to add your first receipt
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                      : 'bg-gradient-to-br from-rose-400 to-pink-500'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-6 h-6 text-black" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-black" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {transaction.category}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">
                    {transaction.description}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
