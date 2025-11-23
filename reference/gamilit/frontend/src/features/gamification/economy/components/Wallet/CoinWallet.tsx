/**
 * CoinWallet - Main Wallet Component
 * Displays balance, quick stats, and recent transactions
 */

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { CoinBalanceWidget } from './CoinBalanceWidget';
import { useCoins } from '../../hooks/useCoins';
import { useTransactions } from '../../hooks/useTransactions';

export const CoinWallet: React.FC = () => {
  const { balance, getSpendingPercentage, getBalanceTier } = useCoins();
  const { getTotalEarned, getTotalSpent, getRecentTransactions } = useTransactions();

  const recentTransactions = getRecentTransactions(5);
  const totalEarned7d = getTotalEarned('7d');
  const totalSpent7d = getTotalSpent('7d');
  const netChange = totalEarned7d - totalSpent7d;

  const balanceTier = getBalanceTier();
  const tierMessages = {
    broke: 'Time to earn some coins!',
    poor: 'Building your fortune...',
    comfortable: 'Nice balance!',
    wealthy: 'You are doing great!',
    rich: 'Rolling in ML Coins!',
  };

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-detective-orange to-detective-gold p-8 rounded-detective shadow-orange-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-detective-base font-medium opacity-90">
                Your ML Coins Wallet
              </h2>
              <p className="text-white/80 text-detective-sm">{tierMessages[balanceTier]}</p>
            </div>
          </div>
          <CoinBalanceWidget balance={balance.current} showLabel={false} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-detective p-4">
            <p className="text-white/70 text-detective-sm mb-1">Lifetime Earned</p>
            <p className="text-white text-detective-xl font-bold">
              {balance.lifetime.toLocaleString()} ML
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-detective p-4">
            <p className="text-white/70 text-detective-sm mb-1">Total Spent</p>
            <p className="text-white text-detective-xl font-bold">
              {balance.spent.toLocaleString()} ML
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-detective p-4">
            <p className="text-white/70 text-detective-sm mb-1">Spending Rate</p>
            <p className="text-white text-detective-xl font-bold">
              {getSpendingPercentage()}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-detective-success/20 rounded-full">
              <TrendingUp className="w-5 h-5 text-detective-success" />
            </div>
            <span className="text-detective-text-secondary text-detective-sm">
              Earned (7d)
            </span>
          </div>
          <p className="text-detective-2xl font-bold text-detective-success">
            +{totalEarned7d.toLocaleString()} ML
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-detective-danger/20 rounded-full">
              <TrendingDown className="w-5 h-5 text-detective-danger" />
            </div>
            <span className="text-detective-text-secondary text-detective-sm">
              Spent (7d)
            </span>
          </div>
          <p className="text-detective-2xl font-bold text-detective-danger">
            -{totalSpent7d.toLocaleString()} ML
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${netChange >= 0 ? 'bg-detective-success/20' : 'bg-detective-danger/20'}`}>
              <Zap className={`w-5 h-5 ${netChange >= 0 ? 'text-detective-success' : 'text-detective-danger'}`} />
            </div>
            <span className="text-detective-text-secondary text-detective-sm">
              Net Change
            </span>
          </div>
          <p className={`text-detective-2xl font-bold ${netChange >= 0 ? 'text-detective-success' : 'text-detective-danger'}`}>
            {netChange >= 0 ? '+' : ''}{netChange.toLocaleString()} ML
          </p>
        </motion.div>
      </div>
    </div>
  );
};
