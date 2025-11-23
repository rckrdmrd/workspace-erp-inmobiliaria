/**
 * Power-ups Mock Data
 * 8 power-ups: 4 core + 4 advanced
 */

import type { PowerUp } from '../types/powerUpsTypes';

export const powerUpsMockData: PowerUp[] = [
  // Core Power-ups (4)
  {
    id: 'powerup-001',
    name: 'Pistas Mejoradas',
    description: 'Obtén pistas más detalladas y específicas que te guiarán mejor hacia la solución correcta',
    type: 'core',
    price: 15,
    icon: 'lightbulb',
    effect: {
      type: 'hint',
      value: 2,
      description: 'Recibe 2 pistas adicionales con más detalles',
    },
    duration: undefined,
    cooldown: 10,
    status: 'available',
    usageCount: 5,
    owned: true,
    quantity: 3,
  },
  {
    id: 'powerup-002',
    name: 'Visión Lectora',
    description: 'Asistencia de lectura mejorada con IA que resalta información clave y conceptos importantes',
    type: 'core',
    price: 25,
    icon: 'eye',
    effect: {
      type: 'vision',
      value: 1,
      description: 'Resalta información clave con IA',
    },
    duration: 30,
    cooldown: 60,
    status: 'available',
    usageCount: 3,
    owned: true,
    quantity: 2,
  },
  {
    id: 'powerup-003',
    name: 'Segunda Oportunidad',
    description: 'Reinicia el ejercicio actual sin perder tu progreso ni recibir penalización en tu puntuación',
    type: 'core',
    price: 15,
    icon: 'rotate-ccw',
    effect: {
      type: 'retry',
      value: 1,
      description: 'Reinicia ejercicio sin penalización',
    },
    duration: undefined,
    cooldown: 30,
    status: 'available',
    usageCount: 7,
    owned: true,
    quantity: 4,
  },
  {
    id: 'powerup-004',
    name: 'Extensión de Tiempo',
    description: 'Añade 5 minutos adicionales a ejercicios con límite de tiempo para que puedas trabajar más tranquilo',
    type: 'core',
    price: 10,
    icon: 'clock',
    effect: {
      type: 'time',
      value: 5,
      description: 'Añade 5 minutos al temporizador',
    },
    duration: undefined,
    cooldown: 15,
    status: 'available',
    usageCount: 4,
    owned: true,
    quantity: 5,
  },
  // Advanced Power-ups (4)
  {
    id: 'powerup-005',
    name: 'Multiplicador Temporal',
    description: 'Duplica todas las ML Coins que ganes durante la próxima hora de juego',
    type: 'advanced',
    price: 50,
    icon: 'zap',
    effect: {
      type: 'multiplier',
      value: 2,
      description: 'Multiplica ML Coins x2 por 1 hora',
    },
    duration: 60,
    cooldown: 180,
    status: 'cooldown',
    usageCount: 2,
    activatedAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now()),
    cooldownEndsAt: new Date(Date.now() + 7200000),
    owned: true,
    quantity: 1,
  },
  {
    id: 'powerup-006',
    name: 'Auto-Completar',
    description: 'Completa instantáneamente un ejercicio con puntuación perfecta (úsalo sabiamente)',
    type: 'advanced',
    price: 100,
    icon: 'fast-forward',
    effect: {
      type: 'complete',
      value: 1,
      description: 'Completa ejercicio al instante con 100%',
    },
    duration: undefined,
    cooldown: 360,
    status: 'available',
    usageCount: 1,
    maxUsages: 5,
    owned: true,
    quantity: 1,
  },
  {
    id: 'powerup-007',
    name: 'Boost Colaborativo',
    description: 'Otorga un bono temporal de velocidad y puntos a todos los miembros de tu gremio',
    type: 'advanced',
    price: 30,
    icon: 'users',
    effect: {
      type: 'boost',
      value: 1.5,
      description: 'Bono 50% para todo el gremio por 30 min',
    },
    duration: 30,
    cooldown: 120,
    status: 'locked',
    usageCount: 0,
    owned: false,
    quantity: 0,
  },
  {
    id: 'powerup-008',
    name: 'Protección de Racha',
    description: 'Protege tu racha de estudio una vez, evitando que se rompa si no estudias un día',
    type: 'advanced',
    price: 75,
    icon: 'shield',
    effect: {
      type: 'protection',
      value: 1,
      description: 'Protege racha de romperse una vez',
    },
    duration: undefined,
    cooldown: undefined,
    status: 'available',
    usageCount: 0,
    owned: true,
    quantity: 1,
  },
];

// Helper functions
export const getOwnedPowerUps = (): PowerUp[] => {
  return powerUpsMockData.filter((powerUp) => powerUp.owned);
};

export const getActivePowerUps = (): PowerUp[] => {
  return powerUpsMockData.filter((powerUp) => powerUp.status === 'active');
};

export const getAvailablePowerUps = (): PowerUp[] => {
  return powerUpsMockData.filter((powerUp) => powerUp.status === 'available' && powerUp.owned);
};

export const getShopPowerUps = (): PowerUp[] => {
  return powerUpsMockData;
};

export const getPowerUpById = (id: string): PowerUp | undefined => {
  return powerUpsMockData.find((powerUp) => powerUp.id === id);
};
