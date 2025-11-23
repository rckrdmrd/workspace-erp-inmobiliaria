/**
 * MLCoinsSection Component
 *
 * Displays ML Coins economy dashboard with earnings, spending, balance,
 * transaction history, and quick actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  ShoppingBag,
  Wallet,
  Sparkles,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MLCoinsData } from '../../hooks/useDashboardData';

interface MLCoinsSectionProps {
  data: MLCoinsData;
}

export function MLCoinsSection({ data }: MLCoinsSectionProps) {
  const navigate = useNavigate();

  const netChange = data.todayEarned - data.todaySpent;
  const isPositive = netChange >= 0;

  // Calculate percentages for mini chart
  const total = data.todayEarned + data.todaySpent;
  const earnedPercent = total > 0 ? (data.todayEarned / total) * 100 : 50;
  const spentPercent = total > 0 ? (data.todaySpent / total) * 100 : 50;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-detective-text flex items-center gap-2">
          <Coins className="w-7 h-7 text-detective-gold" />
          Economía ML Coins
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-md border-2 border-green-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-detective-text">Ganado Hoy</h3>
            </div>
          </div>

          <motion.div
            className="text-4xl font-bold text-green-600 mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          >
            +{data.todayEarned}
            <span className="text-2xl ml-2">ML</span>
          </motion.div>

          <p className="text-sm text-green-700">
            Sigue así para alcanzar tu meta diaria
          </p>

          {/* Mini pulse animation */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Today's Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 shadow-md border-2 border-red-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500 rounded-lg">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-detective-text">Gastado Hoy</h3>
            </div>
          </div>

          <motion.div
            className="text-4xl font-bold text-red-600 mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
          >
            -{data.todaySpent}
            <span className="text-2xl ml-2">ML</span>
          </motion.div>

          <p className="text-sm text-red-700">
            Inversión en tu progreso
          </p>
        </motion.div>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-100 rounded-xl p-6 shadow-md border-2 border-yellow-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-detective-text">Balance Total</h3>
            </div>

            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
            >
              <Coins className="w-6 h-6 text-detective-gold" />
            </motion.div>
          </div>

          <motion.div
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
          >
            {data.balance.toLocaleString()}
            <span className="text-2xl ml-2">ML</span>
          </motion.div>

          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {netChange} ML hoy
            </span>
          </div>
        </motion.div>
      </div>

      {/* Mini Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h3 className="font-semibold text-detective-text mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-detective-orange" />
          Balance de Hoy
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden flex">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${earnedPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
            >
              {earnedPercent > 15 && (
                <span className="text-xs text-white font-semibold">
                  +{data.todayEarned}
                </span>
              )}
            </motion.div>
            <motion.div
              className="bg-gradient-to-r from-red-500 to-rose-500 h-full flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${spentPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
            >
              {spentPercent > 15 && (
                <span className="text-xs text-white font-semibold">
                  -{data.todaySpent}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-detective-text-secondary">Ganado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-detective-text-secondary">Gastado</span>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-detective-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-detective-orange" />
            Transacciones Recientes
          </h3>
          <button
            onClick={() => navigate('/student/wallet')}
            className="text-sm font-medium text-detective-orange hover:text-detective-orange-dark transition-colors flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {data.recentTransactions.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-detective-bg rounded-lg hover:bg-detective-bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  {transaction.type === 'earned' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-detective-text truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-detective-text-secondary">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(transaction.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`text-base font-bold flex-shrink-0 ${
                  transaction.type === 'earned'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {transaction.type === 'earned' ? '+' : '-'}
                {transaction.amount} ML
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/student/shop')}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <ShoppingBag className="w-6 h-6" />
          <div className="text-left flex-1">
            <div className="font-semibold">Ir a la Tienda</div>
            <div className="text-xs opacity-90">Compra power-ups y más</div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/student/wallet')}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Wallet className="w-6 h-6" />
          <div className="text-left flex-1">
            <div className="font-semibold">Ver Billetera</div>
            <div className="text-xs opacity-90">Historial completo</div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-6 h-6" />
          <div className="text-left flex-1">
            <div className="font-semibold">Ganar Más</div>
            <div className="text-xs opacity-90">Completa ejercicios</div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
