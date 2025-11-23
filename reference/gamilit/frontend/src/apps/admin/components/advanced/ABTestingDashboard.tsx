import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Beaker, Play, Pause, Trophy, TrendingUp, Users, CheckCircle } from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: Variant[];
  trafficSplit: Record<string, number>;
  metrics: string[];
  startDate?: string;
  endDate?: string;
  results?: ExperimentResults;
}

interface Variant {
  id: string;
  name: string;
  description: string;
}

interface ExperimentResults {
  totalUsers: number;
  variantStats: Record<string, VariantStats>;
  winner?: string;
  confidenceLevel?: number;
}

interface VariantStats {
  users: number;
  conversions: number;
  conversionRate: number;
  avgEngagement: number;
}

export const ABTestingDashboard: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: '1',
      name: 'New Onboarding Flow',
      description: 'Test new vs old onboarding experience',
      status: 'running',
      variants: [
        { id: 'A', name: 'Control (Old Flow)', description: 'Current onboarding experience' },
        { id: 'B', name: 'New Flow v1', description: 'Simplified 3-step onboarding' },
        { id: 'C', name: 'New Flow v2', description: 'Interactive tutorial onboarding' },
      ],
      trafficSplit: { A: 50, B: 25, C: 25 },
      metrics: ['completion_rate', 'time_to_complete', 'first_exercise_started'],
      startDate: '2024-10-10',
      results: {
        totalUsers: 1250,
        variantStats: {
          A: { users: 625, conversions: 450, conversionRate: 72, avgEngagement: 8.5 },
          B: { users: 312, conversions: 265, conversionRate: 84.9, avgEngagement: 9.2 },
          C: { users: 313, conversions: 280, conversionRate: 89.5, avgEngagement: 9.8 },
        },
        winner: 'C',
        confidenceLevel: 95,
      },
    },
    {
      id: '2',
      name: 'Dashboard Layout Test',
      description: 'Compare different dashboard layouts',
      status: 'paused',
      variants: [
        { id: 'A', name: 'Grid Layout', description: 'Card-based grid layout' },
        { id: 'B', name: 'List Layout', description: 'Vertical list layout' },
      ],
      trafficSplit: { A: 50, B: 50 },
      metrics: ['time_on_page', 'clicks', 'navigation_depth'],
      startDate: '2024-10-01',
      results: {
        totalUsers: 850,
        variantStats: {
          A: { users: 425, conversions: 340, conversionRate: 80, avgEngagement: 7.2 },
          B: { users: 425, conversions: 357, conversionRate: 84, avgEngagement: 7.8 },
        },
      },
    },
    {
      id: '3',
      name: 'Call-to-Action Button Color',
      description: 'Test button color impact on conversions',
      status: 'draft',
      variants: [
        { id: 'A', name: 'Orange (Current)', description: 'Current detective orange' },
        { id: 'B', name: 'Blue', description: 'Blue variant' },
        { id: 'C', name: 'Green', description: 'Green variant' },
      ],
      trafficSplit: { A: 34, B: 33, C: 33 },
      metrics: ['click_through_rate', 'conversion_rate'],
    },
  ]);

  const [creatingExperiment, setCreatingExperiment] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  const handleStartExperiment = (id: string) => {
    setExperiments((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, status: 'running' as const, startDate: new Date().toISOString() } : exp
      )
    );
  };

  const handlePauseExperiment = (id: string) => {
    setExperiments((prev) => prev.map((exp) => (exp.id === id ? { ...exp, status: 'paused' as const } : exp)));
  };

  const handleDeclareWinner = (experimentId: string, variantId: string) => {
    if (!confirm(`Declare variant ${variantId} as winner and end experiment?`)) return;

    setExperiments((prev) =>
      prev.map((exp) =>
        exp.id === experimentId
          ? {
              ...exp,
              status: 'completed' as const,
              endDate: new Date().toISOString(),
              results: { ...exp.results!, winner: variantId },
            }
          : exp
      )
    );
  };

  const selectedExp = experiments.find((e) => e.id === selectedExperiment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Beaker className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">A/B Testing Dashboard</h2>
            <p className="text-detective-small text-gray-400">{experiments.length} experiments</p>
          </div>
        </div>
        <DetectiveButton
          variant="primary"
          icon={<Beaker className="w-4 h-4" />}
          onClick={() => setCreatingExperiment(true)}
        >
          New Experiment
        </DetectiveButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DetectiveCard className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-detective-small text-gray-400">Running</p>
              <p className="text-2xl font-bold text-green-500">
                {experiments.filter((e) => e.status === 'running').length}
              </p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <Pause className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-detective-small text-gray-400">Paused</p>
              <p className="text-2xl font-bold text-yellow-500">
                {experiments.filter((e) => e.status === 'paused').length}
              </p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-detective-small text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-blue-500">
                {experiments.filter((e) => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-detective-small text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-purple-500">
                {experiments.reduce((sum, e) => sum + (e.results?.totalUsers || 0), 0)}
              </p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Experiments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-detective-base font-semibold">All Experiments</h3>
          {experiments.map((exp) => (
            <DetectiveCard
              key={exp.id}
              className={`cursor-pointer ${selectedExperiment === exp.id ? 'border-2 border-detective-orange' : ''}`}
              onClick={() => setSelectedExperiment(exp.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-detective-base font-semibold">{exp.name}</h4>
                  <p className="text-detective-small text-gray-400">{exp.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    exp.status === 'running'
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                      : exp.status === 'paused'
                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                      : exp.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {exp.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-detective-small">
                  <span className="text-gray-400">Variants:</span>
                  <span className="text-detective-text">{exp.variants.length}</span>
                </div>
                {exp.results && (
                  <div className="flex items-center gap-2 text-detective-small">
                    <span className="text-gray-400">Users:</span>
                    <span className="text-detective-text">{exp.results.totalUsers}</span>
                  </div>
                )}
                {exp.results?.winner && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-detective-small text-yellow-500">Winner: Variant {exp.results.winner}</span>
                  </div>
                )}
              </div>
            </DetectiveCard>
          ))}
        </div>

        {/* Experiment Details */}
        <div>
          {selectedExp ? (
            <div className="space-y-4">
              <DetectiveCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-detective-subtitle">{selectedExp.name}</h3>
                  <div className="flex gap-2">
                    {selectedExp.status === 'draft' && (
                      <DetectiveButton
                        variant="green"

                        icon={<Play className="w-4 h-4" />}
                        onClick={() => handleStartExperiment(selectedExp.id)}
                      >
                        Start
                      </DetectiveButton>
                    )}
                    {selectedExp.status === 'running' && (
                      <DetectiveButton
                        variant="primary"

                        icon={<Pause className="w-4 h-4" />}
                        onClick={() => handlePauseExperiment(selectedExp.id)}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Pause
                      </DetectiveButton>
                    )}
                    {selectedExp.status === 'paused' && (
                      <DetectiveButton
                        variant="green"

                        icon={<Play className="w-4 h-4" />}
                        onClick={() => handleStartExperiment(selectedExp.id)}
                      >
                        Resume
                      </DetectiveButton>
                    )}
                  </div>
                </div>

                <p className="text-detective-small text-gray-400 mb-4">{selectedExp.description}</p>

                <div className="space-y-2 mb-4">
                  {selectedExp.startDate && (
                    <div className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded">
                      <span className="text-detective-small text-gray-400">Start Date</span>
                      <span className="text-detective-small">
                        {new Date(selectedExp.startDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                  {selectedExp.endDate && (
                    <div className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded">
                      <span className="text-detective-small text-gray-400">End Date</span>
                      <span className="text-detective-small">
                        {new Date(selectedExp.endDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-detective-base font-semibold mb-2">Traffic Split</h4>
                  <div className="space-y-2">
                    {selectedExp.variants.map((variant) => (
                      <div key={variant.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-detective-small">Variant {variant.id}</span>
                          <span className="text-detective-small font-bold">
                            {selectedExp.trafficSplit[variant.id]}%
                          </span>
                        </div>
                        <div className="h-2 bg-detective-bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-detective-orange"
                            style={{ width: `${selectedExp.trafficSplit[variant.id]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-detective-base font-semibold mb-2">Metrics Tracked</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExp.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs"
                      >
                        {metric.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </DetectiveCard>

              {/* Results */}
              {selectedExp.results && (
                <DetectiveCard>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-detective-base font-semibold">Results</h4>
                    {selectedExp.results.confidenceLevel && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-sm">
                        {selectedExp.results.confidenceLevel}% Confidence
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedExp.variants.map((variant) => {
                      const stats = selectedExp.results?.variantStats[variant.id];
                      if (!stats) return null;

                      const isWinner = selectedExp.results?.winner === variant.id;

                      return (
                        <div
                          key={variant.id}
                          className={`p-4 rounded-lg border ${
                            isWinner
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-detective-bg-secondary bg-detective-bg-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h5 className="text-detective-base font-semibold">Variant {variant.id}</h5>
                              {isWinner && <Trophy className="w-5 h-5 text-yellow-500" />}
                            </div>
                            {selectedExp.status === 'running' && !selectedExp.results?.winner && (
                              <DetectiveButton
                                variant="primary"

                                onClick={() => handleDeclareWinner(selectedExp.id, variant.id)}
                              >
                                Declare Winner
                              </DetectiveButton>
                            )}
                          </div>

                          <p className="text-detective-small text-gray-400 mb-3">{variant.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-400">Users</p>
                              <p className="text-lg font-bold">{stats.users}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Conversions</p>
                              <p className="text-lg font-bold">{stats.conversions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Conversion Rate</p>
                              <p className="text-lg font-bold text-detective-orange">{stats.conversionRate}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Avg Engagement</p>
                              <p className="text-lg font-bold">{stats.avgEngagement}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DetectiveCard>
              )}

              {/* Statistical Significance */}
              {selectedExp.results && selectedExp.status === 'running' && (
                <DetectiveCard className="bg-blue-500/10 border border-blue-500/30">
                  <h4 className="text-detective-base font-semibold text-blue-500 mb-2">Statistical Significance</h4>
                  <p className="text-detective-small text-gray-400">
                    Experiment has reached {selectedExp.results.confidenceLevel}% confidence level. You can declare a
                    winner or continue collecting data for higher confidence.
                  </p>
                </DetectiveCard>
              )}
            </div>
          ) : (
            <DetectiveCard>
              <div className="text-center py-12 text-gray-400">
                <Beaker className="w-12 h-12 mx-auto mb-2" />
                <p>Select an experiment to view details</p>
              </div>
            </DetectiveCard>
          )}
        </div>
      </div>
    </div>
  );
};
