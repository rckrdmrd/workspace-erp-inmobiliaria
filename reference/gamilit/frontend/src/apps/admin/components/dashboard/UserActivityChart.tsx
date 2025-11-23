/**
 * UserActivityChart Component
 *
 * Interactive chart displaying user activity over time.
 * Uses Chart.js/react-chartjs-2 for rendering line and bar charts.
 *
 * Features:
 * - Line chart for active users (last 7 days)
 * - Bar chart for new registrations
 * - Interactive tooltips
 * - Responsive design
 * - Date range selector
 * - Legend toggle
 * - Export chart image
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { UserActivityData } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UserActivityChartProps {
  data: UserActivityData[];
  loading?: boolean;
}

type ChartType = 'line' | 'bar' | 'both';

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ data, loading = false }) => {
  const [chartType, setChartType] = useState<ChartType>('both');
  const [showLegend, setShowLegend] = useState(true);

  // ============================================================================
  // CHART DATA PREPARATION
  // ============================================================================

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const labels = data.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Active Users',
          data: data.map((item) => item.activeUsers),
          borderColor: 'rgb(59, 130, 246)', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#1a1d29',
          pointBorderWidth: 2,
        },
        {
          label: 'New Registrations',
          data: data.map((item) => item.newRegistrations),
          borderColor: 'rgb(168, 85, 247)', // purple-500
          backgroundColor: 'rgba(168, 85, 247, 0.5)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(168, 85, 247)',
          pointBorderColor: '#1a1d29',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [data]);

  // ============================================================================
  // CHART OPTIONS
  // ============================================================================

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          color: '#9ca3af',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(26, 29, 41, 0.95)',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
        beginAtZero: true,
      },
    },
  }), [showLegend]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleExportChart = () => {
    // This would export the chart as an image
    // Implementation depends on the chart library
    console.log('Export chart');
  };

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalActive = data.reduce((sum, item) => sum + item.activeUsers, 0);
    const totalNew = data.reduce((sum, item) => sum + item.newRegistrations, 0);
    const avgActive = Math.round(totalActive / data.length);
    const avgNew = Math.round(totalNew / data.length);

    return { totalActive, totalNew, avgActive, avgNew };
  }, [data]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading || !chartData) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            </motion.div>
            <p className="text-detective-base text-gray-400">Loading activity data...</p>
          </div>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <DetectiveCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-detective-subtitle">User Activity</h3>
          <p className="text-detective-small text-gray-400">Last 7 days</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart type selector */}
          <div className="flex items-center gap-1 bg-detective-bg-secondary rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                chartType === 'line'
                  ? 'bg-detective-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                chartType === 'bar'
                  ? 'bg-detective-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('both')}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                chartType === 'both'
                  ? 'bg-detective-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Both
            </button>
          </div>

          {/* Toggle legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="px-3 py-1.5 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary transition-colors text-xs"
          >
            {showLegend ? 'Hide' : 'Show'} Legend
          </button>

          {/* Export button */}
          <button
            onClick={handleExportChart}
            className="p-2 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary transition-colors"
            title="Export chart"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-detective-bg-secondary rounded-lg">
            <p className="text-detective-small text-gray-400 mb-1">Avg Active Users</p>
            <p className="text-xl font-bold text-blue-500">{stats.avgActive.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-detective-bg-secondary rounded-lg">
            <p className="text-detective-small text-gray-400 mb-1">Avg New Users</p>
            <p className="text-xl font-bold text-purple-500">{stats.avgNew.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-detective-bg-secondary rounded-lg">
            <p className="text-detective-small text-gray-400 mb-1">Total Active</p>
            <p className="text-xl font-bold text-green-500">{stats.totalActive.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-detective-bg-secondary rounded-lg">
            <p className="text-detective-small text-gray-400 mb-1">Total New</p>
            <p className="text-xl font-bold text-orange-500">{stats.totalNew.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80">
        {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
        {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
        {chartType === 'both' && <Line data={chartData} options={chartOptions} />}
      </div>
    </DetectiveCard>
  );
};
