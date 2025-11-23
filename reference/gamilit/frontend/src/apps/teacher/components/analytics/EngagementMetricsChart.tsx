import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Activity } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { EngagementMetrics } from '../../types';

interface EngagementMetricsChartProps {
  metrics: EngagementMetrics;
}

export function EngagementMetricsChart({ metrics }: EngagementMetricsChartProps) {
  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DetectiveCard hoverable={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-detective-orange" />
                <span className="text-sm text-detective-text-secondary">DAU</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.comparison_previous_period.dau_change)}
                <span className={`text-xs font-semibold ${getTrendColor(metrics.comparison_previous_period.dau_change)}`}>
                  {metrics.comparison_previous_period.dau_change >= 0 ? '+' : ''}
                  {metrics.comparison_previous_period.dau_change.toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-detective-text">{metrics.dau}</p>
            <p className="text-xs text-detective-text-secondary">Usuarios Activos Diarios</p>
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-detective-gold" />
                <span className="text-sm text-detective-text-secondary">WAU</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.comparison_previous_period.wau_change)}
                <span className={`text-xs font-semibold ${getTrendColor(metrics.comparison_previous_period.wau_change)}`}>
                  {metrics.comparison_previous_period.wau_change >= 0 ? '+' : ''}
                  {metrics.comparison_previous_period.wau_change.toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-detective-text">{metrics.wau}</p>
            <p className="text-xs text-detective-text-secondary">Usuarios Activos Semanales</p>
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-detective-accent" />
                <span className="text-sm text-detective-text-secondary">Duración</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.comparison_previous_period.engagement_change)}
                <span className={`text-xs font-semibold ${getTrendColor(metrics.comparison_previous_period.engagement_change)}`}>
                  {metrics.comparison_previous_period.engagement_change >= 0 ? '+' : ''}
                  {metrics.comparison_previous_period.engagement_change.toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-detective-text">
              {Math.floor(metrics.session_duration_avg / 60)}m
            </p>
            <p className="text-xs text-detective-text-secondary">Duración Promedio de Sesión</p>
          </div>
        </DetectiveCard>
      </div>

      {/* Session Stats */}
      <DetectiveCard>
        <h3 className="text-lg font-bold text-detective-text mb-4">Estadísticas de Sesión</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-detective-bg-secondary p-4 rounded-lg">
            <p className="text-sm text-detective-text-secondary mb-2">Sesiones por Usuario</p>
            <p className="text-2xl font-bold text-detective-text">
              {metrics.sessions_per_user.toFixed(1)}
            </p>
          </div>
          <div className="bg-detective-bg-secondary p-4 rounded-lg">
            <p className="text-sm text-detective-text-secondary mb-2">Período de Análisis</p>
            <p className="text-2xl font-bold text-detective-text">{metrics.period}</p>
          </div>
        </div>
      </DetectiveCard>

      {/* Feature Usage */}
      <DetectiveCard>
        <h3 className="text-lg font-bold text-detective-text mb-4">Uso de Funcionalidades</h3>
        <div className="space-y-3">
          {metrics.feature_usage.map((feature, index) => {
            const maxUsage = Math.max(...metrics.feature_usage.map((f) => f.usage_count), 1);
            const percentage = (feature.usage_count / maxUsage) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-detective-text font-medium">
                    {feature.feature_name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-detective-text-secondary">
                      {feature.unique_users} usuarios
                    </span>
                    <span className="text-sm font-bold text-detective-text">
                      {feature.usage_count} usos
                    </span>
                  </div>
                </div>
                <div className="w-full bg-detective-bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-detective-orange to-detective-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </DetectiveCard>

      {/* Comparison */}
      <DetectiveCard>
        <h3 className="text-lg font-bold text-detective-text mb-4">
          Comparación con Período Anterior
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-detective-text-secondary mb-2">Cambio DAU</p>
            <div className="flex items-center justify-center gap-2">
              {getTrendIcon(metrics.comparison_previous_period.dau_change)}
              <p className={`text-2xl font-bold ${getTrendColor(metrics.comparison_previous_period.dau_change)}`}>
                {metrics.comparison_previous_period.dau_change >= 0 ? '+' : ''}
                {metrics.comparison_previous_period.dau_change.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-detective-text-secondary mb-2">Cambio WAU</p>
            <div className="flex items-center justify-center gap-2">
              {getTrendIcon(metrics.comparison_previous_period.wau_change)}
              <p className={`text-2xl font-bold ${getTrendColor(metrics.comparison_previous_period.wau_change)}`}>
                {metrics.comparison_previous_period.wau_change >= 0 ? '+' : ''}
                {metrics.comparison_previous_period.wau_change.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-detective-text-secondary mb-2">Cambio Engagement</p>
            <div className="flex items-center justify-center gap-2">
              {getTrendIcon(metrics.comparison_previous_period.engagement_change)}
              <p className={`text-2xl font-bold ${getTrendColor(metrics.comparison_previous_period.engagement_change)}`}>
                {metrics.comparison_previous_period.engagement_change >= 0 ? '+' : ''}
                {metrics.comparison_previous_period.engagement_change.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </DetectiveCard>
    </div>
  );
}
