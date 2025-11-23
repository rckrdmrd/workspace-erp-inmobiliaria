/**
 * Test Users for Development
 *
 * SINCRONIZADO CON:
 * - Database Seeds: /apps/database/seeds/dev/auth_management/01-seed-test-users.sql
 *
 * ISSUE: #8 (P1) - Usuarios de Prueba
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 - Día 2
 *
 * IMPORTANTE: Estos usuarios están pre-cargados en la base de datos
 * de desarrollo. Las contraseñas son hasheadas con bcrypt.
 */

export interface TestUser {
  email: string;
  password: string; // Contraseña en texto plano (solo para desarrollo)
  name: string;
  role: 'student' | 'teacher' | 'admin';
  description: string;
  avatar?: string;
}

export const TEST_USERS: TestUser[] = [
  {
    email: 'student@gamilit.com',
    password: 'Test1234',
    name: 'Estudiante Demo',
    role: 'student',
    description: 'Cuenta de prueba para estudiante',
    avatar: '👨‍🎓'
  },
  {
    email: 'teacher@gamilit.com',
    password: 'Test1234',
    name: 'Profesor Demo',
    role: 'teacher',
    description: 'Cuenta de prueba para profesor',
    avatar: '👨‍🏫'
  },
  {
    email: 'admin@gamilit.com',
    password: 'Test1234',
    name: 'Admin Demo',
    role: 'admin',
    description: 'Cuenta de prueba para administrador',
    avatar: '👨‍💼'
  }
];

/**
 * Usuarios adicionales del proyecto original
 * (De: /projects/gamilit-platform-web/src/features/auth/mocks/authMocks.ts)
 */
export const LEGACY_TEST_USERS: TestUser[] = [
  {
    email: 'admin@gamilit.com',
    password: 'Password123!',
    name: 'Marie Curie',
    role: 'admin',
    description: 'Admin - Científica legendaria',
    avatar: '🧪'
  },
  {
    email: 'detective@gamilit.com',
    password: 'Password123!',
    name: 'Detective Gamilit',
    role: 'student',
    description: 'Estudiante - Detective en entrenamiento',
    avatar: '🕵️'
  }
];

/**
 * Obtener usuario de prueba por email
 */
export const getTestUserByEmail = (email: string): TestUser | undefined => {
  return TEST_USERS.find(user => user.email === email) ||
         LEGACY_TEST_USERS.find(user => user.email === email);
};

/**
 * Obtener usuarios de prueba por rol
 */
export const getTestUsersByRole = (role: TestUser['role']): TestUser[] => {
  return [...TEST_USERS, ...LEGACY_TEST_USERS].filter(user => user.role === role);
};
