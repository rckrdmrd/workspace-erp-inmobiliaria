/**
 * FeatureFlagControls Component
 *
 * PARTIAL IMPLEMENTATION - Feature flag system
 *
 * This component provides a UI for managing feature flags.
 * Currently uses mock data for flag management, but integrates with organization features.
 *
 * Current Status:
 * - Organization-level features are implemented (via useOrganizations hook)
 * - Global feature flags are NOT yet implemented in backend
 *
 * Backend Implementation Required for Full Feature Flags:
 * - POST /api/admin/feature-flags (create flag)
 * - GET /api/admin/feature-flags (list flags)
 * - PATCH /api/admin/feature-flags/:key (update flag)
 * - DELETE /api/admin/feature-flags/:key (delete flag)
 * - GET /api/admin/feature-flags/:key/history (get change history)
 *
 * Workaround:
 * - For now, use organization features (already implemented) for per-org flags
 * - Global feature flags can be managed via environment variables or application config
 *
 * Note: Feature flags at the organization level work via:
 * - PATCH /api/admin/organizations/:id/features
 */

import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Flag, ToggleLeft, ToggleRight, Users, Calendar, History } from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetRoles: string[];
  targetUsers: string[];
  scheduledActivation?: string;
  scheduledDeactivation?: string;
  createdAt: string;
  updatedAt: string;
  lastChangedBy: string;
}

export const FeatureFlagControls: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: '1',
      name: 'AI Assistant Beta',
      key: 'ai_assistant_beta',
      description: 'Enable AI-powered learning assistant for selected users',
      enabled: true,
      rolloutPercentage: 25,
      targetRoles: ['admin_teacher'],
      targetUsers: [],
      createdAt: '2024-09-01',
      updatedAt: '2024-10-15',
      lastChangedBy: 'admin@glit.com',
    },
    {
      id: '2',
      name: 'New Dashboard UI',
      key: 'new_dashboard_ui',
      description: 'Redesigned student dashboard with improved UX',
      enabled: false,
      rolloutPercentage: 0,
      targetRoles: [],
      targetUsers: ['user1@test.com', 'user2@test.com'],
      scheduledActivation: '2024-10-20T00:00:00Z',
      createdAt: '2024-10-01',
      updatedAt: '2024-10-10',
      lastChangedBy: 'admin@glit.com',
    },
    {
      id: '3',
      name: 'Gamification V2',
      key: 'gamification_v2',
      description: 'Enhanced gamification system with new achievements',
      enabled: true,
      rolloutPercentage: 100,
      targetRoles: ['student', 'admin_teacher'],
      targetUsers: [],
      createdAt: '2024-08-15',
      updatedAt: '2024-09-30',
      lastChangedBy: 'admin@glit.com',
    },
  ]);

  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setFlags((prev) =>
      prev.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled, updatedAt: new Date().toISOString() } : flag))
    );
  };

  const handleUpdateRollout = (id: string, percentage: number) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag.id === id ? { ...flag, rolloutPercentage: percentage, updatedAt: new Date().toISOString() } : flag
      )
    );
  };

  const handleSave = () => {
    if (!editingFlag) return;
    setFlags((prev) =>
      prev.map((flag) => (flag.id === editingFlag.id ? { ...editingFlag, updatedAt: new Date().toISOString() } : flag))
    );
    setEditingFlag(null);
  };

  // Mock history data
  const flagHistory = [
    { timestamp: '2024-10-15T10:30:00Z', action: 'Rollout increased to 25%', by: 'admin@glit.com' },
    { timestamp: '2024-10-10T14:20:00Z', action: 'Enabled for admin_teacher role', by: 'admin@glit.com' },
    { timestamp: '2024-09-01T09:00:00Z', action: 'Feature flag created', by: 'admin@glit.com' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flag className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">Feature Flag Controls</h2>
            <p className="text-detective-small text-gray-400">{flags.length} feature flags</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DetectiveCard className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
          <div className="flex items-center gap-3">
            <ToggleRight className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-detective-small text-gray-400">Enabled</p>
              <p className="text-2xl font-bold text-green-500">{flags.filter((f) => f.enabled).length}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30">
          <div className="flex items-center gap-3">
            <ToggleLeft className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-detective-small text-gray-400">Disabled</p>
              <p className="text-2xl font-bold text-red-500">{flags.filter((f) => !f.enabled).length}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-detective-small text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-blue-500">
                {flags.filter((f) => f.scheduledActivation || f.scheduledDeactivation).length}
              </p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Edit Modal */}
      {editingFlag && (
        <DetectiveCard className="border-2 border-detective-orange">
          <h3 className="text-detective-subtitle mb-4">Edit Feature Flag</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Name</label>
              <input
                type="text"
                className="input-detective"
                value={editingFlag.name}
                onChange={(e) => setEditingFlag({ ...editingFlag, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Key</label>
              <input
                type="text"
                className="input-detective font-mono"
                value={editingFlag.key}
                onChange={(e) => setEditingFlag({ ...editingFlag, key: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-detective-small text-gray-400 mb-2">Description</label>
              <textarea
                className="input-detective"
                rows={2}
                value={editingFlag.description}
                onChange={(e) => setEditingFlag({ ...editingFlag, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Target Roles</label>
              <input
                type="text"
                className="input-detective"
                value={editingFlag.targetRoles.join(', ')}
                onChange={(e) =>
                  setEditingFlag({ ...editingFlag, targetRoles: e.target.value.split(',').map((r) => r.trim()) })
                }
                placeholder="student, admin_teacher"
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Target Users</label>
              <input
                type="text"
                className="input-detective"
                value={editingFlag.targetUsers.join(', ')}
                onChange={(e) =>
                  setEditingFlag({ ...editingFlag, targetUsers: e.target.value.split(',').map((u) => u.trim()) })
                }
                placeholder="user1@test.com, user2@test.com"
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Scheduled Activation</label>
              <input
                type="datetime-local"
                className="input-detective"
                value={editingFlag.scheduledActivation ? editingFlag.scheduledActivation.slice(0, 16) : ''}
                onChange={(e) =>
                  setEditingFlag({
                    ...editingFlag,
                    scheduledActivation: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Scheduled Deactivation</label>
              <input
                type="datetime-local"
                className="input-detective"
                value={editingFlag.scheduledDeactivation ? editingFlag.scheduledDeactivation.slice(0, 16) : ''}
                onChange={(e) =>
                  setEditingFlag({
                    ...editingFlag,
                    scheduledDeactivation: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <DetectiveButton variant="green" onClick={handleSave}>
              Save Changes
            </DetectiveButton>
            <DetectiveButton variant="primary" onClick={() => setEditingFlag(null)}>
              Cancel
            </DetectiveButton>
          </div>
        </DetectiveCard>
      )}

      {/* Flags List */}
      <div className="space-y-4">
        {flags.map((flag) => (
          <DetectiveCard key={flag.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-detective-base font-semibold">{flag.name}</h4>
                  <button
                    onClick={() => handleToggle(flag.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                      flag.enabled
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                        : 'bg-red-500/20 text-red-500 border border-red-500/30'
                    }`}
                  >
                    {flag.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span className="text-xs font-bold">{flag.enabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                  <span className="px-2 py-1 bg-detective-orange/20 text-detective-orange rounded text-xs font-mono">
                    {flag.key}
                  </span>
                </div>
                <p className="text-detective-small text-gray-400 mb-3">{flag.description}</p>

                {/* Rollout Percentage */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-detective-small text-gray-400">Rollout Percentage</label>
                    <span className="text-detective-base font-bold text-detective-orange">
                      {flag.rolloutPercentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={flag.rolloutPercentage}
                    onChange={(e) => handleUpdateRollout(flag.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-detective-bg-secondary rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${flag.rolloutPercentage}%, #1f2937 ${flag.rolloutPercentage}%, #1f2937 100%)`,
                    }}
                  />
                </div>

                {/* Targeting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {flag.targetRoles.length > 0 && (
                    <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-detective-small text-blue-500">Target Roles</span>
                      </div>
                      <p className="text-xs text-gray-400">{flag.targetRoles.join(', ')}</p>
                    </div>
                  )}

                  {flag.targetUsers.length > 0 && (
                    <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-detective-small text-purple-500">Target Users</span>
                      </div>
                      <p className="text-xs text-gray-400">{flag.targetUsers.length} specific users</p>
                    </div>
                  )}

                  {flag.scheduledActivation && (
                    <div className="p-2 bg-green-500/10 border border-green-500/30 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-detective-small text-green-500">Scheduled Activation</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(flag.scheduledActivation).toLocaleString('es-ES')}
                      </p>
                    </div>
                  )}

                  {flag.scheduledDeactivation && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-detective-small text-red-500">Scheduled Deactivation</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(flag.scheduledDeactivation).toLocaleString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>Updated: {new Date(flag.updatedAt).toLocaleString('es-ES')}</span>
                  <span>By: {flag.lastChangedBy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <DetectiveButton variant="blue" onClick={() => setEditingFlag(flag)}>
                  Edit
                </DetectiveButton>
                <DetectiveButton
                  variant="primary"

                  icon={<History className="w-4 h-4" />}
                  onClick={() => setShowHistory(showHistory === flag.id ? null : flag.id)}
                >
                  History
                </DetectiveButton>
              </div>
            </div>

            {/* History */}
            {showHistory === flag.id && (
              <div className="mt-4 p-3 bg-detective-bg-secondary rounded-lg">
                <h5 className="text-detective-small font-semibold mb-2">Change History</h5>
                <div className="space-y-2">
                  {flagHistory.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{entry.action}</span>
                      <div className="text-right">
                        <p className="text-gray-500">{entry.by}</p>
                        <p className="text-gray-600">{new Date(entry.timestamp).toLocaleString('es-ES')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DetectiveCard>
        ))}
      </div>
    </div>
  );
};
