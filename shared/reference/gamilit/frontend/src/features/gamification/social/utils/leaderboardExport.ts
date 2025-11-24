/**
 * Leaderboard Export Utilities
 *
 * Functions for exporting leaderboard data to various formats
 * - CSV export
 * - PDF export (basic implementation - can be enhanced with jsPDF)
 */

import type { LeaderboardEntry } from '../types/leaderboardsTypes';
import type { ExtendedLeaderboardType } from '../components/Leaderboards/EnhancedLeaderboardTabs';
import type { TimePeriod, Metric } from '../components/Leaderboards/LeaderboardFilters';

interface ExportOptions {
  entries: LeaderboardEntry[];
  leaderboardType: ExtendedLeaderboardType;
  timePeriod: TimePeriod;
  metric: Metric;
  includeHeaders?: boolean;
}

/**
 * Export leaderboard data to CSV format
 */
export const exportToCSV = (options: ExportOptions): void => {
  const {
    entries,
    leaderboardType,
    timePeriod,
    metric,
    includeHeaders = true
  } = options;

  // Define CSV headers
  const headers = [
    'Rank',
    'Username',
    'Rank Badge',
    'XP',
    'Level',
    'ML Coins',
    'Change',
    'Change Type'
  ];

  // Convert entries to CSV rows
  const rows = entries.map(entry => [
    entry.rank,
    `"${entry.username}"`, // Quote username to handle commas
    `"${entry.rankBadge}"`,
    entry.xp,
    entry.score, // Using score as level placeholder
    entry.mlCoins,
    entry.change,
    entry.changeType
  ]);

  // Build CSV content
  let csv = '';

  if (includeHeaders) {
    csv += headers.join(',') + '\n';
  }

  csv += rows.map(row => row.join(',')).join('\n');

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `leaderboard_${leaderboardType}_${timePeriod}_${metric}_${timestamp}.csv`;

  // Create and download file
  downloadFile(csv, filename, 'text/csv');
};

/**
 * Export leaderboard data to PDF format
 * Note: This is a basic implementation. For production, consider using jsPDF or pdfmake
 */
export const exportToPDF = (options: ExportOptions): void => {
  const {
    entries,
    leaderboardType,
    timePeriod,
    metric
  } = options;

  // For now, create a simple HTML-based PDF (print-friendly)
  const timestamp = new Date().toLocaleDateString();

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Leaderboard Report</title>
      <style>
        @page { margin: 1cm; }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
        }
        h1 {
          color: #f97316;
          border-bottom: 3px solid #f97316;
          padding-bottom: 10px;
        }
        .metadata {
          margin: 20px 0;
          padding: 15px;
          background: #f3f4f6;
          border-radius: 8px;
        }
        .metadata p {
          margin: 5px 0;
          color: #6b7280;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background: linear-gradient(to right, #3b82f6, #f97316);
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        tr:hover {
          background: #f3f4f6;
        }
        .rank-1, .rank-2, .rank-3 {
          font-weight: bold;
        }
        .rank-1 { color: #fbbf24; }
        .rank-2 { color: #9ca3af; }
        .rank-3 { color: #fb923c; }
        .change-up { color: #10b981; }
        .change-down { color: #ef4444; }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>🏆 Tabla de Clasificación - GLIT Platform</h1>

      <div class="metadata">
        <p><strong>Tipo de Clasificación:</strong> ${getLeaderboardTypeLabel(leaderboardType)}</p>
        <p><strong>Período:</strong> ${getTimePeriodLabel(timePeriod)}</p>
        <p><strong>Métrica:</strong> ${getMetricLabel(metric)}</p>
        <p><strong>Total de Participantes:</strong> ${entries.length}</p>
        <p><strong>Fecha de Generación:</strong> ${timestamp}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Usuario</th>
            <th>Rango</th>
            <th>XP</th>
            <th>ML Coins</th>
            <th>Cambio</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(entry => `
            <tr>
              <td class="rank-${entry.rank <= 3 ? entry.rank : ''}">${entry.rank}</td>
              <td>${escapeHtml(entry.username)}</td>
              <td>${escapeHtml(entry.rankBadge)}</td>
              <td>${entry.xp.toLocaleString()}</td>
              <td>${entry.mlCoins.toLocaleString()}</td>
              <td class="change-${entry.changeType}">
                ${entry.changeType === 'up' ? '↑' : entry.changeType === 'down' ? '↓' : '→'} ${Math.abs(entry.change)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Generado por GLIT Platform - © ${new Date().getFullYear()}</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing/saving as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Trigger print dialog after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  } else {
    alert('Por favor, permite las ventanas emergentes para exportar a PDF');
  }
};

/**
 * Download a file with the given content
 */
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Helper: Get human-readable label for leaderboard type
 */
const getLeaderboardTypeLabel = (type: ExtendedLeaderboardType): string => {
  const labels: Record<ExtendedLeaderboardType, string> = {
    global: 'Global',
    school: 'Escuela',
    grade: 'Grado',
    friends: 'Amigos',
    guild: 'Gremio'
  };
  return labels[type];
};

/**
 * Helper: Get human-readable label for time period
 */
const getTimePeriodLabel = (period: TimePeriod): string => {
  const labels: Record<TimePeriod, string> = {
    all_time: 'Todo el Tiempo',
    month: 'Este Mes',
    week: 'Esta Semana',
    today: 'Hoy'
  };
  return labels[period];
};

/**
 * Helper: Get human-readable label for metric
 */
const getMetricLabel = (metric: Metric): string => {
  const labels: Record<Metric, string> = {
    xp: 'Puntos de Experiencia',
    level: 'Nivel',
    ml_coins: 'ML Coins',
    achievements: 'Logros'
  };
  return labels[metric];
};

/**
 * Helper: Escape HTML special characters
 */
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Export leaderboard with the specified format
 */
export const exportLeaderboard = (
  format: 'csv' | 'pdf',
  options: ExportOptions
): void => {
  if (format === 'csv') {
    exportToCSV(options);
  } else if (format === 'pdf') {
    exportToPDF(options);
  }
};
