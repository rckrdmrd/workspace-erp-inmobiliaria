import React from 'react';
import { Shield, User, UserCog } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onSelect: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  const roles = [
    { id: 'student', name: 'Estudiante', icon: User, color: 'blue' },
    { id: 'admin_teacher', name: 'Profesor/Admin', icon: UserCog, color: 'green' },
    { id: 'super_admin', name: 'Super Admin', icon: Shield, color: 'purple' }
  ];

  return (
    <div className="space-y-2">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            selectedRole === role.id
              ? 'border-detective-orange bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <role.icon className={`w-6 h-6 text-${role.color}-600`} />
          <span className="text-detective-body font-medium">{role.name}</span>
        </button>
      ))}
    </div>
  );
};
