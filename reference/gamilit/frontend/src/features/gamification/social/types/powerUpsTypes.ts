/**
 * Power-up Types
 * Defines all types for the power-up system
 */

// PowerUp Type - Synchronized with Backend (FASE 2)
export type PowerUpType = 'pistas' | 'vision_lectora' | 'segunda_oportunidad';

// PowerUp Type Labels for UI Display
export const PowerUpTypeLabels: Record<PowerUpType, string> = {
  pistas: 'Pistas',
  vision_lectora: 'Visión Lectora',
  segunda_oportunidad: 'Segunda Oportunidad'
};

// PowerUp Type Descriptions
export const PowerUpTypeDescriptions: Record<PowerUpType, string> = {
  pistas: 'Revela una pista para el ejercicio actual',
  vision_lectora: 'Resalta palabras clave en el texto',
  segunda_oportunidad: 'Permite reintentar un ejercicio fallado'
};

// Legacy types for shop/inventory system
export type PowerUpCategory = 'core' | 'advanced';
export type PowerUpStatus = 'available' | 'active' | 'cooldown' | 'locked';

export interface PowerUpEffect {
  type: 'hint' | 'vision' | 'retry' | 'time' | 'multiplier' | 'complete' | 'boost' | 'protection';
  value: number;
  description: string;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  type: PowerUpCategory; // Changed from PowerUpType to PowerUpCategory for shop system
  price: number;
  icon: string;
  effect: PowerUpEffect;
  duration?: number; // in minutes (null for instant effects)
  cooldown?: number; // in minutes
  status: PowerUpStatus;
  activatedAt?: Date;
  expiresAt?: Date;
  cooldownEndsAt?: Date;
  usageCount: number;
  maxUsages?: number;
  owned: boolean;
  quantity: number;
}

export interface ActivePowerUp {
  powerUpId: string;
  name: string;
  icon: string;
  expiresAt: Date;
  remainingTime: number; // in seconds
  effect: PowerUpEffect;
}

export interface PowerUpUsageConfirmation {
  powerUp: PowerUp;
  confirmed: boolean;
  timestamp?: Date;
}

export interface PowerUpInventory {
  owned: PowerUp[];
  active: ActivePowerUp[];
  totalSpent: number;
  totalUsages: number;
}
