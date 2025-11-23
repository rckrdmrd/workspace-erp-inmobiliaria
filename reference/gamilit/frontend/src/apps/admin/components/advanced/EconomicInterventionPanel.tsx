import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Coins, TrendingUp, TrendingDown, Settings, DollarSign, Gift, AlertTriangle } from 'lucide-react';

interface EconomyStats {
  totalCoinsInCirculation: number;
  averageUserBalance: number;
  medianUserBalance: number;
  inflationRate: number;
  dailyEarnings: number;
  dailySpending: number;
  topEarners: { userId: string; userName: string; balance: number }[];
}

interface EconomicEvent {
  id: string;
  type: 'promotion' | 'discount' | 'bonus' | 'adjustment';
  name: string;
  description: string;
  multiplier: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const EconomicInterventionPanel: React.FC = () => {
  const [stats] = useState<EconomyStats>({
    totalCoinsInCirculation: 2500000,
    averageUserBalance: 1250,
    medianUserBalance: 850,
    inflationRate: 2.3,
    dailyEarnings: 125000,
    dailySpending: 98000,
    topEarners: [
      { userId: '1', userName: 'student_pro_123', balance: 15800 },
      { userId: '2', userName: 'math_wizard_99', balance: 12450 },
      { userId: '3', userName: 'study_champion', balance: 11200 },
      { userId: '4', userName: 'learning_master', balance: 9850 },
      { userId: '5', userName: 'quiz_king', balance: 8900 },
    ],
  });

  const [events, setEvents] = useState<EconomicEvent[]>([
    {
      id: '1',
      type: 'promotion',
      name: 'Weekend Bonus',
      description: '2x coins earned on weekends',
      multiplier: 2.0,
      startDate: '2024-10-19',
      endDate: '2024-10-20',
      active: false,
    },
    {
      id: '2',
      type: 'discount',
      name: 'Avatar Sale',
      description: '25% off all avatar purchases',
      multiplier: 0.75,
      startDate: '2024-10-15',
      endDate: '2024-10-22',
      active: true,
    },
  ]);

  const [adjustingRates, setAdjustingRates] = useState(false);
  const [earningRate, setEarningRate] = useState(100);
  const [spendingCost, setSpendingCost] = useState(100);
  const [showAddCoins, setShowAddCoins] = useState(false);
  const [coinsAmount, setCoinsAmount] = useState(0);
  const [targetUser, setTargetUser] = useState('');

  const handleAddCoins = async () => {
    if (!targetUser || coinsAmount <= 0) {
      alert('Please enter a valid user ID and amount');
      return;
    }

    if (!confirm(`Add ${coinsAmount} coins to user ${targetUser}? This will be logged in audit trail.`)) return;

    try {
      // API call would go here
      console.log('Adding coins:', { targetUser, coinsAmount });
      alert('Coins added successfully!');
      setShowAddCoins(false);
      setCoinsAmount(0);
      setTargetUser('');
    } catch (error) {
      console.error('Failed to add coins:', error);
      alert('Failed to add coins');
    }
  };

  const handleRemoveCoins = async () => {
    if (!targetUser || coinsAmount <= 0) {
      alert('Please enter a valid user ID and amount');
      return;
    }

    if (!confirm(`Remove ${coinsAmount} coins from user ${targetUser}? This will be logged in audit trail.`)) return;

    try {
      console.log('Removing coins:', { targetUser, coinsAmount });
      alert('Coins removed successfully!');
      setShowAddCoins(false);
      setCoinsAmount(0);
      setTargetUser('');
    } catch (error) {
      console.error('Failed to remove coins:', error);
      alert('Failed to remove coins');
    }
  };

  const handleAdjustRates = async () => {
    if (
      !confirm(
        `Adjust earning rate to ${earningRate}% and spending cost to ${spendingCost}%? This affects all users immediately.`
      )
    )
      return;

    try {
      console.log('Adjusting rates:', { earningRate, spendingCost });
      alert('Rates adjusted successfully!');
      setAdjustingRates(false);
    } catch (error) {
      console.error('Failed to adjust rates:', error);
      alert('Failed to adjust rates');
    }
  };

  const handleToggleEvent = (id: string) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, active: !event.active } : event)));
  };

  const inflationStatus = stats.inflationRate > 5 ? 'critical' : stats.inflationRate > 3 ? 'warning' : 'healthy';
  const inflationColor =
    inflationStatus === 'critical' ? 'text-red-500' : inflationStatus === 'warning' ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coins className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">Economic Intervention Panel</h2>
            <p className="text-detective-small text-gray-400">ML Coins economy management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <DetectiveButton
            variant="primary"
            icon={<DollarSign className="w-4 h-4" />}
            onClick={() => setShowAddCoins(!showAddCoins)}
          >
            Manage Coins
          </DetectiveButton>
          <DetectiveButton
            variant="blue"
            icon={<Settings className="w-4 h-4" />}
            onClick={() => setAdjustingRates(!adjustingRates)}
          >
            Adjust Rates
          </DetectiveButton>
        </div>
      </div>

      {/* Warning Banner */}
      <DetectiveCard className="bg-red-500/10 border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
          <div>
            <h3 className="text-detective-base font-semibold text-red-500 mb-1">Critical Actions - Use with Caution</h3>
            <p className="text-detective-small text-gray-400">
              All economic interventions are logged and audited. Improper use can destabilize the economy and affect
              user experience. Always validate impact predictions before applying changes.
            </p>
          </div>
        </div>
      </DetectiveCard>

      {/* Economy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetectiveCard className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <Coins className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-detective-small text-gray-400">Total in Circulation</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.totalCoinsInCirculation.toLocaleString()}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-detective-small text-gray-400">Avg User Balance</p>
              <p className="text-2xl font-bold text-blue-500">{stats.averageUserBalance.toLocaleString()}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-detective-small text-gray-400">Daily Earnings</p>
              <p className="text-2xl font-bold text-green-500">{stats.dailyEarnings.toLocaleString()}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className={`bg-gradient-to-br from-${inflationStatus === 'critical' ? 'red' : inflationStatus === 'warning' ? 'yellow' : 'green'}-500/10 to-${inflationStatus === 'critical' ? 'red' : inflationStatus === 'warning' ? 'yellow' : 'green'}-600/5 border border-${inflationStatus === 'critical' ? 'red' : inflationStatus === 'warning' ? 'yellow' : 'green'}-500/30`}>
          <div className="flex items-center gap-3">
            <TrendingUp className={`w-6 h-6 ${inflationColor}`} />
            <div>
              <p className="text-detective-small text-gray-400">Inflation Rate</p>
              <p className={`text-2xl font-bold ${inflationColor}`}>{stats.inflationRate}%</p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Add/Remove Coins Modal */}
      {showAddCoins && (
        <DetectiveCard className="border-2 border-detective-orange">
          <h3 className="text-detective-subtitle mb-4">Manual Coin Adjustment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">User ID or Email</label>
              <input
                type="text"
                className="input-detective"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Amount (ML Coins)</label>
              <input
                type="number"
                className="input-detective"
                value={coinsAmount || ''}
                onChange={(e) => setCoinsAmount(parseInt(e.target.value) || 0)}
                placeholder="1000"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <DetectiveButton variant="green" icon={<DollarSign className="w-4 h-4" />} onClick={handleAddCoins}>
              Add Coins
            </DetectiveButton>
            <DetectiveButton
              variant="primary"
              icon={<TrendingDown className="w-4 h-4" />}
              onClick={handleRemoveCoins}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove Coins
            </DetectiveButton>
            <DetectiveButton variant="primary" onClick={() => setShowAddCoins(false)}>
              Cancel
            </DetectiveButton>
          </div>
        </DetectiveCard>
      )}

      {/* Adjust Rates Modal */}
      {adjustingRates && (
        <DetectiveCard className="border-2 border-detective-orange">
          <h3 className="text-detective-subtitle mb-4">Adjust Economic Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">
                Earning Rate Multiplier: {earningRate}%
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={earningRate}
                onChange={(e) => setEarningRate(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {earningRate < 100 ? 'Decreased earnings' : earningRate > 100 ? 'Increased earnings' : 'Normal rate'}
              </p>
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">
                Spending Cost Multiplier: {spendingCost}%
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={spendingCost}
                onChange={(e) => setSpendingCost(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {spendingCost < 100 ? 'Discounted prices' : spendingCost > 100 ? 'Increased prices' : 'Normal prices'}
              </p>
            </div>
          </div>

          {/* Impact Prediction */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4">
            <h4 className="text-detective-base font-semibold text-blue-500 mb-2">Impact Prediction</h4>
            <div className="grid grid-cols-2 gap-4 text-detective-small">
              <div>
                <p className="text-gray-400">Expected daily earnings change:</p>
                <p className="text-detective-text font-bold">
                  {((earningRate - 100) / 100) * stats.dailyEarnings > 0 ? '+' : ''}
                  {(((earningRate - 100) / 100) * stats.dailyEarnings).toFixed(0)} coins/day
                </p>
              </div>
              <div>
                <p className="text-gray-400">Expected spending change:</p>
                <p className="text-detective-text font-bold">
                  {((spendingCost - 100) / 100) * stats.dailySpending > 0 ? '+' : ''}
                  {(((spendingCost - 100) / 100) * stats.dailySpending).toFixed(0)} coins/day
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <DetectiveButton variant="green" onClick={handleAdjustRates}>
              Apply Changes
            </DetectiveButton>
            <DetectiveButton variant="primary" onClick={() => setAdjustingRates(false)}>
              Cancel
            </DetectiveButton>
          </div>
        </DetectiveCard>
      )}

      {/* Economic Events */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Economic Events & Promotions</h3>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border ${
                event.active ? 'border-green-500/30 bg-green-500/10' : 'border-gray-500/30 bg-gray-500/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Gift className={`w-5 h-5 ${event.active ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="text-detective-base font-semibold">{event.name}</h4>
                    <p className="text-detective-small text-gray-400">{event.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleEvent(event.id)}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    event.active
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {event.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3 text-detective-small">
                <div>
                  <p className="text-gray-400">Multiplier</p>
                  <p className="text-detective-text font-bold">{event.multiplier}x</p>
                </div>
                <div>
                  <p className="text-gray-400">Start Date</p>
                  <p className="text-detective-text">{new Date(event.startDate).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className="text-detective-text">{new Date(event.endDate).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DetectiveCard>

      {/* Economy Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">Economy Health Indicators</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-detective-small text-gray-400">Daily Flow Balance</span>
                <span className="text-detective-base font-bold text-green-500">
                  +{(stats.dailyEarnings - stats.dailySpending).toLocaleString()} coins
                </span>
              </div>
              <div className="h-2 bg-detective-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-green-500"
                  style={{ width: `${(stats.dailySpending / stats.dailyEarnings) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Spending is {((stats.dailySpending / stats.dailyEarnings) * 100).toFixed(1)}% of earnings
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-detective-small text-gray-400">Wealth Distribution</span>
                <span className="text-detective-base">Median: {stats.medianUserBalance}</span>
              </div>
              <p className="text-xs text-gray-500">
                Average is {((stats.averageUserBalance / stats.medianUserBalance - 1) * 100).toFixed(1)}% higher than
                median
              </p>
            </div>
          </div>
        </DetectiveCard>

        {/* Top Earners */}
        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">Top Coin Holders</h3>
          <div className="space-y-2">
            {stats.topEarners.map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-detective-orange/20 flex items-center justify-center text-detective-orange font-bold">
                    {index + 1}
                  </div>
                  <span className="text-detective-base">{user.userName}</span>
                </div>
                <span className="text-detective-base font-bold text-yellow-500">{user.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </DetectiveCard>
      </div>
    </div>
  );
};
