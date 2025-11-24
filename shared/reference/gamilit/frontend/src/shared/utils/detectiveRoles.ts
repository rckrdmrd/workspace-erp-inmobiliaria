/**
 * Detective Roles Utility
 *
 * Provides mapping between technical role names and detective-themed terminology
 * used throughout the GLIT platform for a more immersive experience.
 */

export interface DetectiveRoleConfig {
  name: string;
  badge: string;
  color: string;
}

export const DETECTIVE_ROLES: Record<string, DetectiveRoleConfig> = {
  super_admin: {
    name: 'Comisario Jefe',
    badge: '🎖️',
    color: 'orange'
  },
  admin_teacher: {
    name: 'Inspector Jefe',
    badge: '🎖️',
    color: 'amber'
  },
  student: {
    name: 'Detective Novato',
    badge: '🔍',
    color: 'blue'
  }
};

/**
 * Get the detective-themed name for a given technical role
 * @param role - The technical role identifier (super_admin, admin_teacher, student)
 * @returns The detective-themed role name
 */
export function getDetectiveRoleName(role: string): string {
  return DETECTIVE_ROLES[role]?.name || role;
}

/**
 * Get the emoji badge for a given role
 * @param role - The technical role identifier
 * @returns The emoji badge associated with the role
 */
export function getDetectiveRoleBadge(role: string): string {
  return DETECTIVE_ROLES[role]?.badge || '';
}

/**
 * Get the color theme for a given role
 * @param role - The technical role identifier
 * @returns The color name for the role
 */
export function getDetectiveRoleColor(role: string): string {
  return DETECTIVE_ROLES[role]?.color || 'gray';
}

/**
 * Get the full configuration for a given role
 * @param role - The technical role identifier
 * @returns The complete role configuration object
 */
export function getDetectiveRoleConfig(role: string): DetectiveRoleConfig | undefined {
  return DETECTIVE_ROLES[role];
}
