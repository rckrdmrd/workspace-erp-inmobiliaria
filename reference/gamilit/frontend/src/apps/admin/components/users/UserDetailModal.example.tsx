/**
 * UserDetailModal - Ejemplo de Integración
 *
 * Este archivo muestra cómo integrar el UserDetailModal en una página de gestión de usuarios
 */

import React, { useState, useEffect } from 'react';
import { UserDetailModal } from './UserDetailModal';
import { useUserManagement } from '../../hooks/useUserManagement';
import type { SystemUser } from '../../types';

// Tipo para los datos del formulario
interface UserFormData {
  full_name: string;
  email: string;
  role: SystemUser['role'];
  status: SystemUser['status'];
  organizationName?: string;
  phone?: string;
  department?: string;
  position?: string;
}

/**
 * Ejemplo 1: Página de Gestión de Usuarios Básica
 */
export function UsersPageExample() {
  const { users, fetchUsers, updateUserRole } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar usuarios al montar
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handler para abrir modal
  const handleViewDetails = (user: SystemUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handler para cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Opcional: limpiar usuario seleccionado después de la animación
    setTimeout(() => setSelectedUser(null), 300);
  };

  // Handler para actualizar usuario
  const handleUpdateUser = async (
    userId: string,
    userData: Partial<UserFormData>
  ): Promise<void> => {
    try {
      // Actualizar rol si cambió
      if (userData.role) {
        await updateUserRole(userId, userData.role);
      }

      // Aquí podrías agregar más actualizaciones según tu API
      // await updateUserProfile(userId, userData);

      // Refrescar lista de usuarios
      await fetchUsers();

      console.log('Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error; // El modal manejará el error
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}

/**
 * Ejemplo 2: Modal Solo Lectura (sin botón editar)
 */
export function UserDetailsReadOnlyExample() {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleUser: SystemUser = {
    id: '123',
    full_name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'student',
    status: 'active',
    organizationName: 'GLIT Academy',
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  };

  return (
    <div>
      <button
        onClick={() => {
          setSelectedUser(sampleUser);
          setIsModalOpen(true);
        }}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
      >
        Ver Usuario de Ejemplo
      </button>

      {/* Modal sin prop onUpdate = solo lectura */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

/**
 * Ejemplo 3: Integración con API Custom
 */
export function UserDetailsWithCustomAPIExample() {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler personalizado con lógica de negocio compleja
  const handleUpdateUser = async (
    userId: string,
    userData: Partial<UserFormData>
  ): Promise<void> => {
    try {
      // Validaciones personalizadas
      if (userData.email && !userData.email.includes('@')) {
        throw new Error('Email inválido');
      }

      if (userData.phone && !/^\+?\d{10,}$/.test(userData.phone.replace(/\s/g, ''))) {
        throw new Error('Teléfono inválido');
      }

      // Llamadas a API específicas
      const updatePromises = [];

      if (userData.full_name || userData.email) {
        updatePromises.push(
          fetch(`/api/users/${userId}/profile`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              full_name: userData.full_name,
              email: userData.email,
            }),
          })
        );
      }

      if (userData.role) {
        updatePromises.push(
          fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: userData.role }),
          })
        );
      }

      if (userData.status) {
        updatePromises.push(
          fetch(`/api/users/${userId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: userData.status }),
          })
        );
      }

      // Ejecutar todas las actualizaciones en paralelo
      await Promise.all(updatePromises);

      // Actualizar usuario en estado local
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              ...userData,
            }
          : null
      );

      // Mostrar notificación de éxito
      console.log('✅ Usuario actualizado correctamente');

      // Opcional: Refrescar datos desde el servidor
      const response = await fetch(`/api/users/${userId}`);
      const updatedUser = await response.json();
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      // Mostrar notificación de error
      throw error;
    }
  };

  return (
    <UserDetailModal
      user={selectedUser}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onUpdate={handleUpdateUser}
    />
  );
}

/**
 * Ejemplo 4: Con Toast Notifications
 */
export function UserDetailsWithToastsExample() {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulación de sistema de toasts (reemplazar con tu librería real)
  const showToast = (message: string, type: 'success' | 'error') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Aquí irían toast.success() o toast.error() de react-hot-toast, sonner, etc.
  };

  const handleUpdateUser = async (
    userId: string,
    userData: Partial<UserFormData>
  ): Promise<void> => {
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Actualizar usuario local
      setSelectedUser((prev) => (prev ? { ...prev, ...userData } : null));

      // Toast de éxito
      showToast('Usuario actualizado correctamente', 'success');
    } catch (error) {
      // Toast de error
      showToast(
        error instanceof Error ? error.message : 'Error al actualizar usuario',
        'error'
      );
      throw error;
    }
  };

  return (
    <UserDetailModal
      user={selectedUser}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onUpdate={handleUpdateUser}
    />
  );
}

/**
 * Ejemplo 5: Con Confirmación de Cambios
 */
export function UserDetailsWithConfirmationExample() {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{
    userId: string;
    userData: Partial<UserFormData>;
  } | null>(null);

  const handleUpdateUser = async (
    userId: string,
    userData: Partial<UserFormData>
  ): Promise<void> => {
    // Verificar si el cambio requiere confirmación
    const requiresConfirmation = userData.role || userData.status;

    if (requiresConfirmation) {
      // Guardar actualización pendiente y mostrar diálogo
      setPendingUpdate({ userId, userData });
      setShowConfirmDialog(true);
      return;
    }

    // Actualizar sin confirmación
    await performUpdate(userId, userData);
  };

  const performUpdate = async (
    userId: string,
    userData: Partial<UserFormData>
  ): Promise<void> => {
    try {
      // Lógica de actualización
      console.log('Actualizando usuario:', userId, userData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSelectedUser((prev) => (prev ? { ...prev, ...userData } : null));
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    if (pendingUpdate) {
      await performUpdate(pendingUpdate.userId, pendingUpdate.userData);
      setShowConfirmDialog(false);
      setPendingUpdate(null);
    }
  };

  return (
    <>
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateUser}
      />

      {/* Diálogo de confirmación (implementar con tu librería de modales) */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirmar Cambios</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres realizar estos cambios? Esta acción puede
              afectar los permisos del usuario.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingUpdate(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsersPageExample;
