import React from 'react';
import { Check, X } from 'lucide-react';

interface PermissionMatrixProps {
  role: string;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ role }) => {
  const permissions = [
    { name: 'Ver contenido', student: true, teacher: true, admin: true },
    { name: 'Crear ejercicios', student: false, teacher: true, admin: true },
    { name: 'Editar ejercicios', student: false, teacher: true, admin: true },
    { name: 'Eliminar ejercicios', student: false, teacher: false, admin: true },
    { name: 'Gestionar usuarios', student: false, teacher: false, admin: true },
    { name: 'Ver analytics', student: false, teacher: true, admin: true },
    { name: 'Configurar sistema', student: false, teacher: false, admin: true },
  ];

  const hasPermission = (permission: any) => {
    if (role === 'student') return permission.student;
    if (role === 'admin_teacher') return permission.teacher;
    if (role === 'super_admin') return permission.admin;
    return false;
  };

  return (
    <div className="space-y-2">
      {permissions.map((permission) => (
        <div key={permission.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-detective-body">{permission.name}</span>
          {hasPermission(permission) ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <X className="w-5 h-5 text-red-600" />
          )}
        </div>
      ))}
    </div>
  );
};
