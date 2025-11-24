/**
 * EarningSourcesBreakdown - Pie chart showing earning sources
 */

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { mockEarningSourcesData } from '../../mockData/economyMockData';

export const EarningSourcesBreakdown: React.FC = () => {
  const data = mockEarningSourcesData;

  return (
    <div className="bg-white rounded-detective shadow-card p-6">
      <h3 className="text-detective-2xl font-bold text-detective-text mb-6">
        Earning Sources
      </h3>

      <div className="space-y-4">
        {data.map((source, index) => {
          const Icon = (LucideIcons as any)[source.icon] || LucideIcons.Circle;

          return (
            <motion.div
              key={source.source}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: source.color }} />
                  </div>
                  <span className="font-medium text-detective-text">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-detective-text">
                    {source.amount.toLocaleString()} ML
                  </p>
                  <p className="text-detective-sm text-detective-text-secondary">
                    {source.percentage}%
                  </p>
                </div>
              </div>
              <div className="relative h-2 bg-detective-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${source.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ backgroundColor: source.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-detective-bg rounded-detective">
        <p className="text-detective-sm text-detective-text-secondary text-center">
          Total earned from all sources:{' '}
          <span className="font-bold text-detective-text">
            {data.reduce((sum, s) => sum + s.amount, 0).toLocaleString()} ML
          </span>
        </p>
      </div>
    </div>
  );
};
