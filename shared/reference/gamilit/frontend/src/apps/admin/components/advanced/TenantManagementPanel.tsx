/**
 * TenantManagementPanel Component
 *
 * FUTURE FEATURE - Multi-tenancy support
 *
 * This component is designed for future multi-tenancy support.
 * Currently uses mock data as the backend does not have multi-tenancy routes yet.
 *
 * Backend Implementation Required:
 * - POST /api/admin/tenants (create tenant)
 * - GET /api/admin/tenants (list tenants)
 * - GET /api/admin/tenants/:id (get tenant details)
 * - PUT /api/admin/tenants/:id (update tenant)
 * - DELETE /api/admin/tenants/:id (delete tenant)
 * - POST /api/admin/tenants/:id/suspend (suspend tenant)
 * - POST /api/admin/tenants/:id/activate (activate tenant)
 *
 * Note: For now, Organizations serve as the primary entity for managing schools/institutions.
 * Multi-tenancy can be implemented later when needed for true data isolation.
 */

import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Building2, Plus, Edit, Power, PowerOff, Users, TrendingUp, Database } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'trial';
  plan: 'free' | 'pro' | 'enterprise';
  users: number;
  storage: number;
  storageLimit: number;
  createdAt: string;
  lastActive: string;
}

export const TenantManagementPanel: React.FC = () => {
  const [tenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Escuela Primaria Central',
      domain: 'central.gamilit.com',
      status: 'active',
      plan: 'pro',
      users: 450,
      storage: 25.5,
      storageLimit: 100,
      createdAt: '2024-01-15',
      lastActive: '2024-10-16T10:30:00Z',
    },
    {
      id: '2',
      name: 'Instituto Tecnológico',
      domain: 'tech.gamilit.com',
      status: 'active',
      plan: 'enterprise',
      users: 1200,
      storage: 85.3,
      storageLimit: 500,
      createdAt: '2024-02-01',
      lastActive: '2024-10-16T09:15:00Z',
    },
    {
      id: '3',
      name: 'Academia de Idiomas',
      domain: 'idiomas.gamilit.com',
      status: 'trial',
      plan: 'free',
      users: 50,
      storage: 2.1,
      storageLimit: 10,
      createdAt: '2024-10-10',
      lastActive: '2024-10-15T14:20:00Z',
    },
  ]);

  const [editingTenant, setEditingTenant] = useState<Partial<Tenant> | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const handleSuspend = async (id: string) => {
    if (!confirm('Suspend this tenant? Users will lose access immediately.')) return;
    console.log('Suspending tenant:', id);
  };

  const handleActivate = async (id: string) => {
    console.log('Activating tenant:', id);
  };

  const handleCreate = () => {
    setEditingTenant({
      name: '',
      domain: '',
      status: 'trial',
      plan: 'free',
      users: 0,
      storage: 0,
      storageLimit: 10,
    });
  };

  const handleSave = async () => {
    console.log('Saving tenant:', editingTenant);
    setEditingTenant(null);
  };

  const selectedTenantData = tenants.find((t) => t.id === selectedTenant);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">Multi-tenant Management</h2>
            <p className="text-detective-small text-gray-400">{tenants.length} tenants configured</p>
          </div>
        </div>
        <DetectiveButton variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          New Tenant
        </DetectiveButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DetectiveCard className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
          <div className="flex items-center gap-3">
            <Power className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-detective-small text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-500">
                {tenants.filter((t) => t.status === 'active').length}
              </p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-detective-small text-gray-400">Trial</p>
              <p className="text-2xl font-bold text-yellow-500">
                {tenants.filter((t) => t.status === 'trial').length}
              </p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30">
          <div className="flex items-center gap-3">
            <PowerOff className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-detective-small text-gray-400">Suspended</p>
              <p className="text-2xl font-bold text-red-500">
                {tenants.filter((t) => t.status === 'suspended').length}
              </p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-detective-small text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-blue-500">
                {tenants.reduce((sum, t) => sum + t.users, 0)}
              </p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Create/Edit Modal */}
      {editingTenant && (
        <DetectiveCard className="border-2 border-detective-orange">
          <h3 className="text-detective-subtitle mb-4">
            {editingTenant.id ? 'Edit Tenant' : 'Create New Tenant'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Tenant Name *</label>
              <input
                type="text"
                className="input-detective"
                value={editingTenant.name || ''}
                onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                placeholder="School/Institution name..."
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Domain *</label>
              <input
                type="text"
                className="input-detective"
                value={editingTenant.domain || ''}
                onChange={(e) => setEditingTenant({ ...editingTenant, domain: e.target.value })}
                placeholder="subdomain.gamilit.com"
              />
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Plan</label>
              <select
                className="input-detective"
                value={editingTenant.plan || 'free'}
                onChange={(e) =>
                  setEditingTenant({ ...editingTenant, plan: e.target.value as 'free' | 'pro' | 'enterprise' })
                }
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-detective-small text-gray-400 mb-2">Storage Limit (GB)</label>
              <input
                type="number"
                className="input-detective"
                value={editingTenant.storageLimit || 10}
                onChange={(e) => setEditingTenant({ ...editingTenant, storageLimit: parseFloat(e.target.value) })}
                min="1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <DetectiveButton variant="green" onClick={handleSave}>
              Save Tenant
            </DetectiveButton>
            <DetectiveButton variant="primary" onClick={() => setEditingTenant(null)}>
              Cancel
            </DetectiveButton>
          </div>
        </DetectiveCard>
      )}

      {/* Tenants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-detective-base font-semibold">All Tenants</h3>
          {tenants.map((tenant) => (
            <DetectiveCard
              key={tenant.id}
              className={`cursor-pointer ${
                selectedTenant === tenant.id ? 'border-2 border-detective-orange' : ''
              }`}
              onClick={() => setSelectedTenant(tenant.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-detective-base font-semibold">{tenant.name}</h4>
                  <p className="text-detective-small text-gray-400">{tenant.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      tenant.status === 'active'
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                        : tenant.status === 'trial'
                        ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-500 border border-red-500/30'
                    }`}
                  >
                    {tenant.status.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">{tenant.plan}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-detective-small text-gray-400">Users</p>
                  <p className="text-detective-base font-bold">{tenant.users}</p>
                </div>
                <div>
                  <p className="text-detective-small text-gray-400">Storage</p>
                  <p className="text-detective-base font-bold">
                    {tenant.storage}GB / {tenant.storageLimit}GB
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 bg-detective-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-detective-orange to-yellow-500"
                  style={{ width: `${(tenant.storage / tenant.storageLimit) * 100}%` }}
                ></div>
              </div>
            </DetectiveCard>
          ))}
        </div>

        {/* Tenant Details */}
        <div>
          {selectedTenantData ? (
            <div className="space-y-4">
              <DetectiveCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-detective-subtitle">{selectedTenantData.name}</h3>
                  <div className="flex gap-2">
                    <DetectiveButton
                      variant="blue"

                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => setEditingTenant(selectedTenantData)}
                    >
                      Edit
                    </DetectiveButton>
                    {selectedTenantData.status === 'active' ? (
                      <DetectiveButton
                        variant="primary"

                        icon={<PowerOff className="w-4 h-4" />}
                        onClick={() => handleSuspend(selectedTenantData.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Suspend
                      </DetectiveButton>
                    ) : (
                      <DetectiveButton
                        variant="green"

                        icon={<Power className="w-4 h-4" />}
                        onClick={() => handleActivate(selectedTenantData.id)}
                      >
                        Activate
                      </DetectiveButton>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-detective-small text-gray-400">Domain</span>
                    <span className="text-detective-base font-mono">{selectedTenantData.domain}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-detective-small text-gray-400">Plan</span>
                    <span className="text-detective-base uppercase">{selectedTenantData.plan}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-detective-small text-gray-400">Created</span>
                    <span className="text-detective-base">
                      {new Date(selectedTenantData.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg">
                    <span className="text-detective-small text-gray-400">Last Active</span>
                    <span className="text-detective-base">
                      {new Date(selectedTenantData.lastActive).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              </DetectiveCard>

              <DetectiveCard>
                <h4 className="text-detective-base font-semibold mb-3">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <Users className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-detective-small text-gray-400">Users</p>
                    <p className="text-2xl font-bold text-blue-500">{selectedTenantData.users}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <Database className="w-6 h-6 text-purple-500 mb-2" />
                    <p className="text-detective-small text-gray-400">Storage Used</p>
                    <p className="text-2xl font-bold text-purple-500">{selectedTenantData.storage}GB</p>
                  </div>
                </div>
              </DetectiveCard>

              <DetectiveCard className="bg-yellow-500/10 border border-yellow-500/30">
                <h4 className="text-detective-base font-semibold mb-2 text-yellow-500">Tenant Isolation</h4>
                <p className="text-detective-small text-gray-400">
                  All tenant data is isolated at the database level. Users from different tenants cannot access each
                  other's data.
                </p>
              </DetectiveCard>
            </div>
          ) : (
            <DetectiveCard>
              <div className="text-center py-12 text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-2" />
                <p>Select a tenant to view details</p>
              </div>
            </DetectiveCard>
          )}
        </div>
      </div>
    </div>
  );
};
