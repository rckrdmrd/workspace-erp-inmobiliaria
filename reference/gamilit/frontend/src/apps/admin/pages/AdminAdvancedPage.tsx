import React, { useState } from 'react';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { TenantManagementPanel } from '../components/advanced/TenantManagementPanel';
import { FeatureFlagControls } from '../components/advanced/FeatureFlagControls';
import { ABTestingDashboard } from '../components/advanced/ABTestingDashboard';
import { EconomicInterventionPanel } from '../components/advanced/EconomicInterventionPanel';

const AdvancedAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'flags' | 'experiments' | 'economy'>('tenants');

  const tabs = [
    { id: 'tenants' as const, label: 'Tenant Management', component: TenantManagementPanel },
    { id: 'flags' as const, label: 'Feature Flags', component: FeatureFlagControls },
    { id: 'experiments' as const, label: 'A/B Testing', component: ABTestingDashboard },
    { id: 'economy' as const, label: 'Economic Tools', component: EconomicInterventionPanel },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || TenantManagementPanel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <GamifiedHeader user={{
        id: 'mock-admin-advancedadmin-id',
        email: 'admin@gamilit.com',
        role: 'super_admin',
        displayName: 'Admin AdvancedAdmin'
      }} />

      <main className="detective-container py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-detective-title mb-2">Advanced Administration</h1>
          <p className="text-detective-base text-gray-400">Multi-tenant, feature flags, experiments, and economy</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-detective-orange text-white'
                  : 'bg-detective-bg-secondary text-gray-400 hover:bg-detective-bg-secondary/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <ActiveComponent />
      </main>
    </div>
  );
};

export default AdvancedAdmin;
