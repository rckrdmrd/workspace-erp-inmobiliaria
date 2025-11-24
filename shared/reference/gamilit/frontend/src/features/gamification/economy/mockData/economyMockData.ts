/**
 * Economy Mock Data - Transactions & Metrics
 *
 * Mock transaction history and economic metrics for development/testing
 */

import type {
  Transaction,
  EconomicMetrics,
  EarningSourceData,
  SpendingCategoryData,
  InterventionTrigger,
} from '../types/economyTypes';

/**
 * Mock Transaction History (20+ transactions)
 */
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earn',
    amount: 20,
    source: 'exercise_completion',
    description: 'Completed "Detective Textual" exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    balanceAfter: 1245,
    metadata: {
      exerciseId: 'detective_textual_001',
    },
  },
  {
    id: '2',
    type: 'spend',
    amount: -75,
    source: 'shop',
    description: 'Purchased Detective Hat',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    balanceAfter: 1225,
    metadata: {
      itemId: 'cosmetic_001',
    },
  },
  {
    id: '3',
    type: 'earn',
    amount: 5,
    source: 'streak_bonus',
    description: 'Maintained 7-day streak',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    balanceAfter: 1300,
  },
  {
    id: '4',
    type: 'earn',
    amount: 12,
    source: 'perfect_score',
    description: 'Perfect score on Crucigrama exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    balanceAfter: 1295,
    metadata: {
      exerciseId: 'crucigrama_001',
    },
  },
  {
    id: '5',
    type: 'spend',
    amount: -50,
    source: 'shop',
    description: 'Purchased Laboratory Background',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    balanceAfter: 1283,
    metadata: {
      itemId: 'profile_001',
    },
  },
  {
    id: '6',
    type: 'earn',
    amount: 100,
    source: 'achievement_unlock',
    description: 'Unlocked "First Steps" achievement',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    balanceAfter: 1333,
    metadata: {
      achievementId: 'first_steps',
    },
  },
  {
    id: '7',
    type: 'earn',
    amount: 15,
    source: 'exercise_completion',
    description: 'Completed "Timeline" exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    balanceAfter: 1233,
  },
  {
    id: '8',
    type: 'earn',
    amount: 10,
    source: 'daily_login',
    description: 'Daily login bonus',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    balanceAfter: 1218,
  },
  {
    id: '9',
    type: 'spend',
    amount: -120,
    source: 'shop',
    description: 'Purchased Sherlock Holmes Pipe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    balanceAfter: 1208,
    metadata: {
      itemId: 'cosmetic_008',
    },
  },
  {
    id: '10',
    type: 'earn',
    amount: 50,
    source: 'guild_challenge',
    description: 'Completed guild challenge',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    balanceAfter: 1328,
  },
  {
    id: '11',
    type: 'earn',
    amount: 18,
    source: 'exercise_completion',
    description: 'Completed "Sopa de Letras" exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    balanceAfter: 1278,
  },
  {
    id: '12',
    type: 'spend',
    amount: -25,
    source: 'shop',
    description: 'Purchased Celebration Emote Pack',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    balanceAfter: 1260,
    metadata: {
      itemId: 'social_001',
    },
  },
  {
    id: '13',
    type: 'earn',
    amount: 25,
    source: 'leaderboard_reward',
    description: 'Weekly leaderboard top 10',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    balanceAfter: 1285,
  },
  {
    id: '14',
    type: 'earn',
    amount: 20,
    source: 'exercise_completion',
    description: 'Completed "Verificador Fake News" exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
    balanceAfter: 1260,
  },
  {
    id: '15',
    type: 'earn',
    amount: 75,
    source: 'achievement_unlock',
    description: 'Unlocked "Speed Reader" achievement',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    balanceAfter: 1240,
    metadata: {
      achievementId: 'speed_reader',
    },
  },
  {
    id: '16',
    type: 'spend',
    amount: -100,
    source: 'shop',
    description: 'Purchased Guild Banner Template',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
    balanceAfter: 1165,
    metadata: {
      itemId: 'guild_001',
    },
  },
  {
    id: '17',
    type: 'earn',
    amount: 15,
    source: 'exercise_completion',
    description: 'Completed "Mapa Conceptual" exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    balanceAfter: 1265,
  },
  {
    id: '18',
    type: 'earn',
    amount: 30,
    source: 'referral_bonus',
    description: 'Friend joined using your referral',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    balanceAfter: 1250,
  },
  {
    id: '19',
    type: 'spend',
    amount: -200,
    source: 'shop',
    description: 'Purchased Bonus Marie Curie Biography',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16),
    balanceAfter: 1220,
    metadata: {
      itemId: 'premium_003',
    },
  },
  {
    id: '20',
    type: 'earn',
    amount: 200,
    source: 'achievement_unlock',
    description: 'Unlocked "Master Detective" achievement',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17),
    balanceAfter: 1420,
    metadata: {
      achievementId: 'master_detective',
    },
  },
  {
    id: '21',
    type: 'earn',
    amount: 22,
    source: 'exercise_completion',
    description: 'Completed "Construcción Hipótesis" exercise',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
    balanceAfter: 1220,
  },
  {
    id: '22',
    type: 'earn',
    amount: 10,
    source: 'daily_login',
    description: 'Daily login bonus',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19),
    balanceAfter: 1198,
  },
];

/**
 * Mock Earning Sources Data (for analytics)
 */
export const mockEarningSourcesData: EarningSourceData[] = [
  {
    source: 'Exercise Completion',
    amount: 450,
    percentage: 45,
    color: '#f97316',
    icon: 'BookOpen',
  },
  {
    source: 'Achievement Unlocks',
    amount: 300,
    percentage: 30,
    color: '#f59e0b',
    icon: 'Trophy',
  },
  {
    source: 'Streak Bonus',
    amount: 100,
    percentage: 10,
    color: '#10b981',
    icon: 'Flame',
  },
  {
    source: 'Guild Challenges',
    amount: 80,
    percentage: 8,
    color: '#3b82f6',
    icon: 'Users',
  },
  {
    source: 'Daily Login',
    amount: 40,
    percentage: 4,
    color: '#8b5cf6',
    icon: 'Calendar',
  },
  {
    source: 'Other',
    amount: 30,
    percentage: 3,
    color: '#6b7280',
    icon: 'MoreHorizontal',
  },
];

/**
 * Mock Spending Category Data (for analytics)
 */
export const mockSpendingCategoryData: SpendingCategoryData[] = [
  {
    category: 'cosmetics',
    amount: 420,
    percentage: 42,
    itemCount: 6,
    color: '#f97316',
  },
  {
    category: 'premium',
    amount: 300,
    percentage: 30,
    itemCount: 2,
    color: '#f59e0b',
  },
  {
    category: 'profile',
    amount: 150,
    percentage: 15,
    itemCount: 4,
    color: '#3b82f6',
  },
  {
    category: 'guild',
    amount: 100,
    percentage: 10,
    itemCount: 2,
    color: '#8b5cf6',
  },
  {
    category: 'social',
    amount: 30,
    percentage: 3,
    itemCount: 3,
    color: '#10b981',
  },
];

/**
 * Mock Economic Metrics (for admin dashboard)
 */
export const mockEconomicMetrics: EconomicMetrics = {
  inflationRate: 2.5, // 2.5% monthly inflation (healthy)
  mlVelocity: 1.1, // 1.1 circulation speed (healthy range: 0.8-1.2)
  totalSupply: 125000, // Total ML Coins in circulation
  totalDemand: 98000, // Total ML Coins spent in period
  activeUsers: 450, // Users with transactions in period
  averageBalance: 278, // Average balance per user
  healthStatus: 'healthy',
  lastUpdated: new Date(),
};

/**
 * Mock Economic Metrics - Warning State
 */
export const mockEconomicMetricsWarning: EconomicMetrics = {
  inflationRate: 4.2,
  mlVelocity: 0.7,
  totalSupply: 200000,
  totalDemand: 75000,
  activeUsers: 320,
  averageBalance: 625,
  healthStatus: 'warning',
  lastUpdated: new Date(),
};

/**
 * Mock Intervention Triggers
 */
export const mockInterventionTriggers: InterventionTrigger[] = [
  {
    id: 'trigger_001',
    type: 'inflation',
    severity: 'medium',
    message: 'Inflation rate exceeding target threshold (4.2% vs 3% target)',
    triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    metrics: {
      inflationRate: 4.2,
    },
    suggestedActions: [
      'Introduce new coin sinks (shop items)',
      'Reduce earning rates temporarily',
      'Launch limited-time premium items',
    ],
  },
  {
    id: 'trigger_002',
    type: 'low_velocity',
    severity: 'low',
    message: 'ML Coins velocity below optimal range (0.7 vs 0.8-1.2 target)',
    triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    metrics: {
      mlVelocity: 0.7,
    },
    suggestedActions: [
      'Launch promotional events',
      'Introduce time-limited discounts',
      'Create urgency with seasonal items',
    ],
  },
];

/**
 * Generate random transaction
 */
export const generateRandomTransaction = (): Transaction => {
  const isEarn = Math.random() > 0.4;
  const sources = [
    'exercise_completion',
    'streak_bonus',
    'perfect_score',
    'achievement_unlock',
    'daily_login',
  ];
  const amounts = isEarn ? [10, 15, 20, 25, 50, 100] : [25, 50, 75, 100, 150, 200];

  return {
    id: crypto.randomUUID(),
    type: isEarn ? 'earn' : 'spend',
    amount: isEarn
      ? amounts[Math.floor(Math.random() * amounts.length)]
      : -amounts[Math.floor(Math.random() * amounts.length)],
    source: isEarn ? sources[Math.floor(Math.random() * sources.length)] : 'shop',
    description: isEarn
      ? 'Earned ML Coins from activity'
      : 'Purchased shop item',
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    balanceAfter: Math.floor(Math.random() * 2000),
  };
};

/**
 * Initial balance for demo
 */
export const mockInitialBalance = {
  current: 1245,
  lifetime: 2500,
  spent: 1000,
  pending: 25,
};

/**
 * Economic health thresholds
 */
export const economicHealthThresholds = {
  inflation: {
    healthy: { min: 0, max: 3 },
    warning: { min: 3, max: 5 },
    critical: { min: 5, max: Infinity },
  },
  velocity: {
    healthy: { min: 0.8, max: 1.2 },
    warning: { min: 0.6, max: 1.4 },
    critical: { min: 0, max: Infinity },
  },
};

/**
 * Calculate economic health status
 */
export const calculateEconomicHealth = (
  inflationRate: number,
  mlVelocity: number
): 'healthy' | 'warning' | 'critical' => {
  const inflationCritical =
    inflationRate >= economicHealthThresholds.inflation.critical.min;
  const velocityCritical =
    mlVelocity < 0.6 || mlVelocity > 1.4;

  if (inflationCritical || velocityCritical) return 'critical';

  const inflationWarning =
    inflationRate >= economicHealthThresholds.inflation.warning.min;
  const velocityWarning =
    mlVelocity < economicHealthThresholds.velocity.healthy.min ||
    mlVelocity > economicHealthThresholds.velocity.healthy.max;

  if (inflationWarning || velocityWarning) return 'warning';

  return 'healthy';
};
