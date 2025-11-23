/**
 * useTransactions Hook - Transaction Management
 *
 * Custom hook for managing and analyzing transaction history
 */

import { useCallback, useMemo } from 'react';
import { useEconomyStore } from '../store/economyStore';
import type { Transaction, TransactionFilters, AnalyticsPeriod } from '../types/economyTypes';

export const useTransactions = () => {
  const transactions = useEconomyStore((state) => state.transactions);
  const getTransactionHistory = useEconomyStore((state) => state.getTransactionHistory);
  const clearTransactionHistory = useEconomyStore((state) => state.clearTransactionHistory);

  /**
   * Get transactions for a specific period
   */
  const getTransactionsByPeriod = useCallback(
    (period: AnalyticsPeriod): Transaction[] => {
      const now = new Date();
      let dateFrom: Date;

      switch (period) {
        case '24h':
          dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'all':
        default:
          return transactions;
      }

      return transactions.filter((t) => t.timestamp >= dateFrom);
    },
    [transactions]
  );

  /**
   * Get earn transactions only
   */
  const earnTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === 'earn');
  }, [transactions]);

  /**
   * Get spend transactions only
   */
  const spendTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === 'spend');
  }, [transactions]);

  /**
   * Calculate total earned in period
   */
  const getTotalEarned = useCallback(
    (period: AnalyticsPeriod = 'all'): number => {
      const periodTransactions = getTransactionsByPeriod(period);
      return periodTransactions
        .filter((t) => t.type === 'earn')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    [getTransactionsByPeriod]
  );

  /**
   * Calculate total spent in period
   */
  const getTotalSpent = useCallback(
    (period: AnalyticsPeriod = 'all'): number => {
      const periodTransactions = getTransactionsByPeriod(period);
      return Math.abs(
        periodTransactions
          .filter((t) => t.type === 'spend')
          .reduce((sum, t) => sum + t.amount, 0)
      );
    },
    [getTransactionsByPeriod]
  );

  /**
   * Get net change (earned - spent)
   */
  const getNetChange = useCallback(
    (period: AnalyticsPeriod = 'all'): number => {
      return getTotalEarned(period) - getTotalSpent(period);
    },
    [getTotalEarned, getTotalSpent]
  );

  /**
   * Get transaction count by type
   */
  const getTransactionCount = useCallback(
    (type?: 'earn' | 'spend', period: AnalyticsPeriod = 'all'): number => {
      const periodTransactions = getTransactionsByPeriod(period);
      if (!type) return periodTransactions.length;
      return periodTransactions.filter((t) => t.type === type).length;
    },
    [getTransactionsByPeriod]
  );

  /**
   * Get average transaction amount
   */
  const getAverageAmount = useCallback(
    (type?: 'earn' | 'spend', period: AnalyticsPeriod = 'all'): number => {
      const periodTransactions = getTransactionsByPeriod(period);
      const filtered = type
        ? periodTransactions.filter((t) => t.type === type)
        : periodTransactions;

      if (filtered.length === 0) return 0;

      const total = filtered.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return Math.round(total / filtered.length);
    },
    [getTransactionsByPeriod]
  );

  /**
   * Get largest transaction
   */
  const getLargestTransaction = useCallback(
    (type?: 'earn' | 'spend', period: AnalyticsPeriod = 'all'): Transaction | null => {
      const periodTransactions = getTransactionsByPeriod(period);
      const filtered = type
        ? periodTransactions.filter((t) => t.type === type)
        : periodTransactions;

      if (filtered.length === 0) return null;

      return filtered.reduce((largest, current) =>
        Math.abs(current.amount) > Math.abs(largest.amount) ? current : largest
      );
    },
    [getTransactionsByPeriod]
  );

  /**
   * Get transactions grouped by source
   */
  const getTransactionsBySource = useCallback(
    (period: AnalyticsPeriod = 'all'): Record<string, Transaction[]> => {
      const periodTransactions = getTransactionsByPeriod(period);
      const grouped: Record<string, Transaction[]> = {};

      periodTransactions.forEach((transaction) => {
        if (!grouped[transaction.source]) {
          grouped[transaction.source] = [];
        }
        grouped[transaction.source].push(transaction);
      });

      return grouped;
    },
    [getTransactionsByPeriod]
  );

  /**
   * Get top earning sources
   */
  const getTopEarningSources = useCallback(
    (limit: number = 5, period: AnalyticsPeriod = 'all') => {
      const periodTransactions = getTransactionsByPeriod(period);
      const earnOnly = periodTransactions.filter((t) => t.type === 'earn');

      const sourceAmounts: Record<string, number> = {};
      earnOnly.forEach((t) => {
        sourceAmounts[t.source] = (sourceAmounts[t.source] || 0) + t.amount;
      });

      return Object.entries(sourceAmounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([source, amount]) => ({ source, amount }));
    },
    [getTransactionsByPeriod]
  );

  /**
   * Get transaction trend (comparing periods)
   */
  const getTransactionTrend = useCallback(
    (currentPeriod: AnalyticsPeriod, previousPeriod: AnalyticsPeriod) => {
      const currentTotal = getTotalEarned(currentPeriod);
      const previousTotal = getTotalEarned(previousPeriod);

      if (previousTotal === 0) return 0;

      return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
    },
    [getTotalEarned]
  );

  /**
   * Get recent transactions
   */
  const getRecentTransactions = useCallback(
    (limit: number = 10): Transaction[] => {
      return transactions.slice(0, limit);
    },
    [transactions]
  );

  /**
   * Format transaction amount with sign
   */
  const formatTransactionAmount = useCallback((transaction: Transaction): string => {
    const sign = transaction.type === 'earn' ? '+' : '-';
    const amount = Math.abs(transaction.amount).toLocaleString('en-US');
    return `${sign}${amount} ML`;
  }, []);

  /**
   * Get transaction color class
   */
  const getTransactionColor = useCallback((transaction: Transaction): string => {
    return transaction.type === 'earn' ? 'text-detective-success' : 'text-detective-danger';
  }, []);

  return {
    // State
    transactions,
    earnTransactions,
    spendTransactions,

    // Queries
    getTransactionHistory,
    getTransactionsByPeriod,
    getTransactionsBySource,
    getTopEarningSources,
    getRecentTransactions,

    // Statistics
    getTotalEarned,
    getTotalSpent,
    getNetChange,
    getTransactionCount,
    getAverageAmount,
    getLargestTransaction,
    getTransactionTrend,

    // Utilities
    formatTransactionAmount,
    getTransactionColor,

    // Actions
    clearTransactionHistory,
  };
};
