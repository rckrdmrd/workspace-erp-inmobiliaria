import React, { useMemo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown, Clock, Sparkles } from 'lucide-react';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';
import { getColorSchemeByName } from '@shared/utils/colorPalette';
import { cn } from '@shared/utils/cn';
import type { MLCoinsData } from '../../hooks/useDashboardData';

interface MLCoinsWidgetProps {
  data: MLCoinsData | null;
  loading?: boolean;
}

export function MLCoinsWidget({ data, loading }: MLCoinsWidgetProps) {
  // Use Sunset color scheme (amber/orange) for coins
  const colorScheme = useMemo(() => getColorSchemeByName('sunset'), []);

  const balanceSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  React.useEffect(() => {
    if (data?.balance) {
      balanceSpring.set(data.balance);
    }
  }, [data?.balance, balanceSpring]);

  const displayBalance = useTransform(balanceSpring, (value) =>
    Math.round(value).toLocaleString()
  );

  if (loading || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative bg-white rounded-xl shadow-md overflow-hidden',
          'border-2 h-full p-6',
          colorScheme.border,
          colorScheme.shadow
        )}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  const netChange = data.todayEarned - data.todaySpent;
  const isPositive = netChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative bg-white rounded-xl shadow-lg overflow-hidden',
        'border-2 h-full max-h-[600px]',
        colorScheme.border,
        colorScheme.shadow
      )}
    >
      {/* Gradient background overlay */}
      <div
        className={cn(
          'absolute inset-0 opacity-10',
          'bg-gradient-to-br',
          colorScheme.iconGradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 p-6 overflow-y-auto h-full">
        {/* Header with colorful icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br shadow-md',
                colorScheme.iconGradient
              )}
            >
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">ML Coins</h3>
              <p className="text-xs text-gray-600">Tu tesoro detectivesco</p>
            </div>
          </div>
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
          </motion.div>
        </div>

        {/* Balance with gradient */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <motion.div
            className="text-5xl font-black mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.span>{displayBalance}</motion.span>
            <span className="text-3xl ml-2">ML</span>
          </motion.div>

          {/* Today's change with badge */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold',
                isPositive
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {netChange} ML
              </span>
            </div>
            <span className="text-xs text-gray-600">hoy</span>
          </div>
        </div>

        {/* Stats with colorful cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-500 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-700">Ganado</span>
            </div>
            <p className="text-2xl font-black text-green-700">
              +{data.todayEarned}
            </p>
            <p className="text-xs text-green-600">ML hoy</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-red-500 rounded-lg">
                <TrendingDown className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-red-700">Gastado</span>
            </div>
            <p className="text-2xl font-black text-red-700">
              -{data.todaySpent}
            </p>
            <p className="text-xs text-red-600">ML hoy</p>
          </motion.div>
        </div>

        {/* Recent transactions with colorful cards */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            Transacciones Recientes
          </h4>
          <div className="space-y-2">
            {data.recentTransactions.slice(0, 3).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200',
                  'hover:shadow-md hover:-translate-y-0.5',
                  transaction.type === 'earned'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm',
                      transaction.type === 'earned'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-red-500 to-rose-500'
                    )}
                  >
                    {transaction.type === 'earned' ? (
                      <TrendingUp className="w-5 h-5 text-white" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
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
                  className={cn(
                    'text-lg font-black flex-shrink-0 px-2 py-1 rounded-lg',
                    transaction.type === 'earned'
                      ? 'text-green-700'
                      : 'text-red-700'
                  )}
                >
                  {transaction.type === 'earned' ? '+' : '-'}
                  {transaction.amount}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
