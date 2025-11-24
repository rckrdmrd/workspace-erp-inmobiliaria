import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useUserActivity, useExportData } from '../../hooks/useAdminData';
import { Users, Clock, Download, Filter, MapPin } from 'lucide-react';

export const UserActivityMonitor: React.FC = () => {
  const [filters, setFilters] = useState({ role: '', dateFrom: '', action: '' });
  const { activities, onlineUsers, activeSessions, loading } = useUserActivity(filters);
  const { exportToCSV } = useExportData();

  const handleExport = () => {
    exportToCSV(activities, 'user_activity');
  };

  const topUsers = activities
    .reduce((acc, activity) => {
      const existing = acc.find((u) => u.userId === activity.userId);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ userId: activity.userId, userName: activity.userName, count: 1 });
      }
      return acc;
    }, [] as { userId: string; userName: string; count: number }[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activityByHour = activities.reduce((acc, activity) => {
    const hour = new Date(activity.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (loading) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">User Activity Monitor</h2>
            <p className="text-detective-small text-gray-400">Real-time user tracking</p>
          </div>
        </div>
        <DetectiveButton variant="blue" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
          Export CSV
        </DetectiveButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DetectiveCard className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-detective-small text-gray-400">Online Now</p>
              <p className="text-3xl font-bold text-green-500">{onlineUsers}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-detective-small text-gray-400">Active Sessions</p>
              <p className="text-3xl font-bold text-blue-500">{activeSessions}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-detective-small text-gray-400">Total Activities</p>
              <p className="text-3xl font-bold text-purple-500">{activities.length}</p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Filters */}
      <DetectiveCard>
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-detective-orange" />
          <h3 className="text-detective-subtitle">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-detective-small text-gray-400 mb-2">Role</label>
            <select
              className="input-detective"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="admin_teacher">Teacher</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-detective-small text-gray-400 mb-2">Date From</label>
            <input
              type="date"
              className="input-detective"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-detective-small text-gray-400 mb-2">Action</label>
            <input
              type="text"
              className="input-detective"
              placeholder="Search action..."
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            />
          </div>
        </div>
      </DetectiveCard>

      {/* Top Active Users */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Top Active Users</h3>
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div
              key={user.userId}
              className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-detective-orange/20 flex items-center justify-center text-detective-orange font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-detective-base font-semibold">{user.userName}</p>
                  <p className="text-detective-small text-gray-400">{user.userId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-detective-base font-bold text-detective-orange">{user.count}</p>
                <p className="text-detective-small text-gray-400">activities</p>
              </div>
            </div>
          ))}
        </div>
      </DetectiveCard>

      {/* Activity Timeline */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Activity by Hour (Last 24h)</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {Array.from({ length: 24 }, (_, i) => {
            const count = activityByHour[i] || 0;
            const maxCount = Math.max(...Object.values(activityByHour), 1);
            const height = (count / maxCount) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full group">
                  <div
                    className="w-full bg-gradient-to-t from-detective-orange to-detective-orange/50 rounded-t transition-all"
                    style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {count} activities
                  </div>
                </div>
                <span className="text-xs text-gray-400">{i.toString().padStart(2, '0')}h</span>
              </div>
            );
          })}
        </div>
      </DetectiveCard>

      {/* Recent Activities */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Recent Activities (Last 10)</h3>
        <div className="space-y-2">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-secondary/70 transition-colors"
            >
              <div className="flex-1">
                <p className="text-detective-base font-semibold">{activity.userName}</p>
                <p className="text-detective-small text-gray-400">{activity.action}</p>
              </div>
              <div className="text-right">
                <p className="text-detective-small text-gray-400">
                  {new Date(activity.timestamp).toLocaleString('es-ES')}
                </p>
                {activity.ipAddress && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {activity.ipAddress}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DetectiveCard>
    </div>
  );
};
