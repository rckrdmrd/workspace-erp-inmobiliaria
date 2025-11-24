import React, { useState } from 'react';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { RoleSelector } from '@features/auth/components/RoleSelector';
import { PermissionMatrix } from '@features/auth/components/PermissionMatrix';
import { Shield } from 'lucide-react';

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <GamifiedHeader user={{
        id: 'mock-roles-permissions-id',
        email: 'admin@glit.com',
        role: 'super_admin',
        displayName: 'Admin Roles'
      }} />

      <main className="detective-container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-detective-orange" />
          <h1 className="text-detective-title">Roles y Permisos</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DetectiveCard>
              <h2 className="text-detective-subtitle mb-4">Roles del Sistema</h2>
              <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
            </DetectiveCard>
          </div>

          <div className="lg:col-span-2">
            <DetectiveCard>
              <h2 className="text-detective-subtitle mb-4">Permisos de {selectedRole}</h2>
              <PermissionMatrix role={selectedRole} />
            </DetectiveCard>
          </div>
        </div>
      </main>
    </div>
  );
}
