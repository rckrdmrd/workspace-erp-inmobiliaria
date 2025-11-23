import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MetricsHistory } from '../../hooks/useSystemMetrics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface MetricsChartProps {
  data: MetricsHistory[];
  label: string;
  color?: string;
  threshold?: number;
  unit?: string;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  label,
  color = '#f97316',
  threshold,
  unit = ''
}) => {
  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      ...(threshold
        ? [
            {
              label: 'Threshold',
              data: data.map(() => threshold),
              borderColor: '#ef4444',
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: { family: 'Courier New, monospace' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#f97316',
        bodyColor: '#e5e7eb',
        borderColor: '#f97316',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)}${unit}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 10,
          font: { family: 'Courier New, monospace', size: 10 },
        },
        grid: { color: '#374151' },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: { family: 'Courier New, monospace' },
          callback: (value: any) => `${value}${unit}`,
        },
        grid: { color: '#374151' },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};
