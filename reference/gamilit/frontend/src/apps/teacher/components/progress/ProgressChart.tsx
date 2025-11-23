import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ProgressChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  showLegend?: boolean;
  height?: number;
}

export function ProgressChart({
  title,
  data,
  type = 'bar',
  showLegend = true,
  height = 300,
}: ProgressChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const getColor = (index: number, customColor?: string) => {
    if (customColor) return customColor;
    const colors = [
      'bg-detective-orange',
      'bg-detective-gold',
      'bg-detective-accent',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
    ];
    return colors[index % colors.length];
  };

  const getTrend = (value: number, threshold: number = 70) => {
    if (value > threshold) return { icon: TrendingUp, color: 'text-green-500' };
    if (value < threshold - 20) return { icon: TrendingDown, color: 'text-red-500' };
    return { icon: Minus, color: 'text-yellow-500' };
  };

  if (type === 'bar') {
    return (
      <div className="bg-detective-bg-secondary p-6 rounded-lg">
        <h3 className="text-lg font-bold text-detective-text mb-6">{title}</h3>
        <div className="space-y-4" style={{ minHeight: height }}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const Trend = getTrend(item.value).icon;
            const trendColor = getTrend(item.value).color;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-detective-text font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-detective-text">
                      {item.value.toFixed(0)}%
                    </span>
                    <Trend className={`w-4 h-4 ${trendColor}`} />
                  </div>
                </div>
                <div className="w-full bg-detective-bg rounded-full h-3 overflow-hidden">
                  <div
                    className={`${getColor(index, item.color)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className="bg-detective-bg-secondary p-6 rounded-lg">
        <h3 className="text-lg font-bold text-detective-text mb-6">{title}</h3>
        <div className="relative" style={{ height }}>
          <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={300 - (y * 3)}
                x2="800"
                y2={300 - (y * 3)}
                stroke="currentColor"
                className="text-detective-border opacity-30"
                strokeWidth="1"
              />
            ))}

            {/* Line path */}
            <polyline
              points={data
                .map((item, index) => {
                  const x = (index / (data.length - 1)) * 800;
                  const y = 300 - (item.value * 3);
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="currentColor"
              className="text-detective-orange"
              strokeWidth="3"
            />

            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 800;
              const y = 300 - (item.value * 3);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="currentColor"
                  className="text-detective-orange"
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <span key={index} className="text-xs text-detective-text-secondary">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;

    return (
      <div className="bg-detective-bg-secondary p-6 rounded-lg">
        <h3 className="text-lg font-bold text-detective-text mb-6">{title}</h3>
        <div className="flex items-center justify-center gap-8">
          <div className="relative" style={{ width: height, height }}>
            <svg width={height} height={height} viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const radius = 80;
                const startAngle = currentAngle;
                currentAngle += angle;
                const endAngle = currentAngle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 100 + radius * Math.cos(startRad);
                const y1 = 100 + radius * Math.sin(startRad);
                const x2 = 100 + radius * Math.cos(endRad);
                const y2 = 100 + radius * Math.sin(endRad);

                const largeArcFlag = angle > 180 ? 1 : 0;

                const colorMap: Record<string, string> = {
                  'bg-detective-orange': '#FF8C42',
                  'bg-detective-gold': '#FFD700',
                  'bg-detective-accent': '#4ECDC4',
                  'bg-blue-500': '#3B82F6',
                  'bg-green-500': '#10B981',
                  'bg-purple-500': '#8B5CF6',
                };

                const color = colorMap[getColor(index, item.color)] || '#FF8C42';

                return (
                  <path
                    key={index}
                    d={`M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-detective-bg"
                  />
                );
              })}
              <circle cx="100" cy="100" r="50" fill="currentColor" className="text-detective-bg" />
            </svg>
          </div>

          {showLegend && (
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${getColor(index, item.color)}`} />
                  <span className="text-sm text-detective-text">
                    {item.label}: {item.value.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
