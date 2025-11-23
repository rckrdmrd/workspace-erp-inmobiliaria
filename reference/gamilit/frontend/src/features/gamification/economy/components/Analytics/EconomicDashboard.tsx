/**
 * EconomicDashboard - Admin economic monitoring dashboard
 */

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { mockEconomicMetrics, mockInterventionTriggers } from '../../mockData/economyMockData';

export const EconomicDashboard: React.FC = () => {
  const metrics = mockEconomicMetrics;
  const triggers = mockInterventionTriggers;

  const healthStatusConfig = {
    healthy: { color: 'detective-success', icon: CheckCircle, text: 'Healthy' },
    warning: { color: 'detective-gold', icon: AlertTriangle, text: 'Warning' },
    critical: { color: 'detective-danger', icon: XCircle, text: 'Critical' },
  };

  const status = healthStatusConfig[metrics.healthStatus];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-detective shadow-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-detective-2xl font-bold text-detective-text">
              Economic Monitoring Dashboard
            </h2>
            <p className="text-detective-sm text-detective-text-secondary">
              Real-time ML Coins economy health metrics
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 bg-${status.color}/10 rounded-detective`}>
            <StatusIcon className={`w-5 h-5 text-${status.color}`} />
            <span className={`font-bold text-${status.color}`}>{status.text}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-detective-orange/10 rounded-full">
              <TrendingUp className="w-5 h-5 text-detective-orange" />
            </div>
            <span className="text-detective-sm text-detective-text-secondary">
              Inflation Rate
            </span>
          </div>
          <p className="text-detective-3xl font-bold text-detective-text">
            {metrics.inflationRate.toFixed(1)}%
          </p>
          <p className="text-detective-xs text-detective-text-secondary mt-1">
            Target: &lt;3% monthly
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-detective-blue/10 rounded-full">
              <Activity className="w-5 h-5 text-detective-blue" />
            </div>
            <span className="text-detective-sm text-detective-text-secondary">
              ML Velocity
            </span>
          </div>
          <p className="text-detective-3xl font-bold text-detective-text">
            {metrics.mlVelocity.toFixed(2)}
          </p>
          <p className="text-detective-xs text-detective-text-secondary mt-1">
            Healthy: 0.8-1.2
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-detective-gold/10 rounded-full">
              <TrendingUp className="w-5 h-5 text-detective-gold" />
            </div>
            <span className="text-detective-sm text-detective-text-secondary">
              Total Supply
            </span>
          </div>
          <p className="text-detective-3xl font-bold text-detective-text">
            {(metrics.totalSupply / 1000).toFixed(0)}K
          </p>
          <p className="text-detective-xs text-detective-text-secondary mt-1">
            ML in circulation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-detective shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-detective-success/10 rounded-full">
              <TrendingDown className="w-5 h-5 text-detective-success" />
            </div>
            <span className="text-detective-sm text-detective-text-secondary">
              Total Demand
            </span>
          </div>
          <p className="text-detective-3xl font-bold text-detective-text">
            {(metrics.totalDemand / 1000).toFixed(0)}K
          </p>
          <p className="text-detective-xs text-detective-text-secondary mt-1">
            ML spent in period
          </p>
        </motion.div>
      </div>

      {/* Supply vs Demand Chart */}
      <div className="bg-white rounded-detective shadow-card p-6">
        <h3 className="font-bold text-detective-lg text-detective-text mb-4">
          Supply vs Demand
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-detective-sm text-detective-text-secondary">Supply</span>
              <span className="font-bold">{metrics.totalSupply.toLocaleString()} ML</span>
            </div>
            <div className="relative h-8 bg-detective-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1 }}
                className="absolute left-0 top-0 h-full bg-detective-gold rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-detective-sm text-detective-text-secondary">Demand</span>
              <span className="font-bold">{metrics.totalDemand.toLocaleString()} ML</span>
            </div>
            <div className="relative h-8 bg-detective-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metrics.totalDemand / metrics.totalSupply) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute left-0 top-0 h-full bg-detective-orange rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Triggers */}
      {triggers.length > 0 && (
        <div className="bg-white rounded-detective shadow-card p-6">
          <h3 className="font-bold text-detective-lg text-detective-text mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-detective-gold" />
            Intervention Triggers
          </h3>
          <div className="space-y-4">
            {triggers.map((trigger, index) => (
              <motion.div
                key={trigger.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-detective border-l-4 ${
                  trigger.severity === 'high' ? 'bg-detective-danger/10 border-detective-danger' :
                  trigger.severity === 'medium' ? 'bg-detective-gold/10 border-detective-gold' :
                  'bg-detective-blue/10 border-detective-blue'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`text-detective-xs font-bold uppercase ${
                      trigger.severity === 'high' ? 'text-detective-danger' :
                      trigger.severity === 'medium' ? 'text-detective-gold' :
                      'text-detective-blue'
                    }`}>
                      {trigger.severity} Priority
                    </span>
                    <h4 className="font-bold text-detective-text mt-1">{trigger.type}</h4>
                  </div>
                  <span className="text-detective-xs text-detective-text-secondary">
                    {new Date(trigger.triggeredAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-detective-sm text-detective-text mb-3">
                  {trigger.message}
                </p>
                <div className="space-y-1">
                  <p className="text-detective-xs font-medium text-detective-text-secondary">
                    Suggested Actions:
                  </p>
                  {trigger.suggestedActions.map((action, i) => (
                    <p key={i} className="text-detective-xs text-detective-text pl-4">
                      • {action}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
