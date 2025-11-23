/**
 * TransactionHistory - Display transaction list with filters
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import type { TransactionType, AnalyticsPeriod } from '../../types/economyTypes';

interface TransactionHistoryProps {
  limit?: number;
  showFilters?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  limit = 20,
  showFilters = true,
}) => {
  const { transactions, formatTransactionAmount, getTransactionColor } = useTransactions();
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredTransactions = transactions
    .filter((t) => filterType === 'all' || t.type === filterType)
    .filter((t) =>
      searchQuery
        ? t.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .slice(0, limit);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-detective shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-detective-2xl font-bold text-detective-text">
          Transaction History
        </h3>
        {showFilters && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-detective-text-secondary" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-detective-orange/30 rounded-detective focus:outline-none focus:border-detective-orange"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-detective-orange/10 border border-detective-orange/30 rounded-detective hover:bg-detective-orange/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-detective-sm">
                  {filterType === 'all' ? 'All' : filterType === 'earn' ? 'Earned' : 'Spent'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-detective shadow-card-hover border border-detective-orange/20 overflow-hidden z-10">
                  {(['all', 'earn', 'spend'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-detective-bg transition-colors"
                    >
                      {type === 'all' ? 'All Transactions' : type === 'earn' ? 'Earned Only' : 'Spent Only'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-detective-text-secondary">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-detective-bg rounded-detective hover:bg-detective-bg-secondary transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    p-2 rounded-full
                    ${transaction.type === 'earn' ? 'bg-detective-success/20' : 'bg-detective-danger/20'}
                  `}
                >
                  {transaction.type === 'earn' ? (
                    <TrendingUp className="w-5 h-5 text-detective-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-detective-danger" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-detective-text">{transaction.description}</p>
                  <p className="text-detective-sm text-detective-text-secondary">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-detective-lg ${getTransactionColor(transaction)}`}>
                  {formatTransactionAmount(transaction)}
                </p>
                <p className="text-detective-sm text-detective-text-secondary">
                  Balance: {transaction.balanceAfter.toLocaleString()} ML
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {transactions.length > limit && (
        <div className="mt-6 text-center">
          <button className="text-detective-orange hover:text-detective-orange-dark font-medium">
            View All Transactions ({transactions.length})
          </button>
        </div>
      )}
    </div>
  );
};
