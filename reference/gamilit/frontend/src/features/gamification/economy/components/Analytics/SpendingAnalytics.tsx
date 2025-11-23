/**
 * SpendingAnalytics - User spending dashboard
 */

import { motion } from 'framer-motion';
import { TrendingDown, ShoppingBag, PieChart } from 'lucide-react';
import { mockSpendingCategoryData } from '../../mockData/economyMockData';
import { useEconomyStore } from '../../store/economyStore';

export const SpendingAnalytics: React.FC = () => {
  const stats = useEconomyStore((state) => state.getEconomyStats());
  const data = mockSpendingCategoryData;

  return (
    <div className="bg-white rounded-detective shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-detective-danger/10 rounded-full">
          <TrendingDown className="w-6 h-6 text-detective-danger" />
        </div>
        <div>
          <h2 className="text-detective-2xl font-bold text-detective-text">
            Spending Analytics
          </h2>
          <p className="text-detective-sm text-detective-text-secondary">
            Where your ML Coins are going
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-detective-bg rounded-detective">
          <p className="text-detective-sm text-detective-text-secondary mb-1">
            Total Spent
          </p>
          <p className="text-detective-xl font-bold text-detective-danger">
            {stats.totalSpent.toLocaleString()} ML
          </p>
        </div>
        <div className="p-4 bg-detective-bg rounded-detective">
          <p className="text-detective-sm text-detective-text-secondary mb-1">
            Favorite Category
          </p>
          <p className="text-detective-xl font-bold text-detective-text capitalize">
            {stats.favoriteCategory}
          </p>
        </div>
        <div className="p-4 bg-detective-bg rounded-detective">
          <p className="text-detective-sm text-detective-text-secondary mb-1">
            Biggest Purchase
          </p>
          <p className="text-detective-xl font-bold text-detective-text">
            {stats.biggestPurchase.amount} ML
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="font-bold text-detective-lg text-detective-text flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Spending by Category
        </h3>
        {data.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-detective-text capitalize">
                  {category.category}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-detective-text">
                  {category.amount.toLocaleString()} ML
                </p>
                <p className="text-detective-sm text-detective-text-secondary">
                  {category.itemCount} items • {category.percentage}%
                </p>
              </div>
            </div>
            <div className="relative h-2 bg-detective-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
