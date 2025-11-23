/**
 * Test data para AchievementMilestones component
 *
 * Usa estos datos para testing y desarrollo
 */

export const mockMilestones = [
  {
    id: 'milestone-1',
    title: 'Primera Semana Completa',
    description: 'Completa 5 casos en una semana',
    progress: 3,
    total: 5,
    completed: false,
    reward: {
      xp: 100,
      mlCoins: 50,
    },
    icon: 'target' as const,
  },
  {
    id: 'milestone-2',
    title: 'Detective Experto',
    description: 'Alcanza 1000 puntos de experiencia',
    progress: 750,
    total: 1000,
    completed: false,
    reward: {
      xp: 200,
      mlCoins: 100,
    },
    icon: 'trophy' as const,
  },
  {
    id: 'milestone-3',
    title: 'Racha de Fuego',
    description: 'Mantén una racha de 7 días',
    progress: 7,
    total: 7,
    completed: true,
    reward: {
      xp: 150,
      mlCoins: 75,
    },
    icon: 'star' as const,
  },
];

export const mockMilestonesInProgress = [
  {
    id: 'milestone-4',
    title: 'Maestro de la Lectura',
    description: 'Completa 10 casos diferentes',
    progress: 6,
    total: 10,
    completed: false,
    reward: {
      xp: 250,
      mlCoins: 125,
    },
    icon: 'trophy' as const,
  },
  {
    id: 'milestone-5',
    title: 'Investigador Persistente',
    description: 'Acumula 50 horas de lectura',
    progress: 32,
    total: 50,
    completed: false,
    reward: {
      xp: 300,
      mlCoins: 150,
    },
    icon: 'target' as const,
  },
];

export const mockMilestonesCompleted = [
  {
    id: 'milestone-6',
    title: 'Principiante Detective',
    description: 'Completa tu primer caso',
    progress: 1,
    total: 1,
    completed: true,
    reward: {
      xp: 50,
      mlCoins: 25,
    },
    icon: 'star' as const,
  },
  {
    id: 'milestone-7',
    title: 'Lector Constante',
    description: 'Lee durante 3 días seguidos',
    progress: 3,
    total: 3,
    completed: true,
    reward: {
      xp: 75,
      mlCoins: 40,
    },
    icon: 'star' as const,
  },
];

export const mockMilestonesAlmostComplete = [
  {
    id: 'milestone-8',
    title: 'Casi Campeón',
    description: 'Alcanza 5000 XP total',
    progress: 4950,
    total: 5000,
    completed: false,
    reward: {
      xp: 500,
      mlCoins: 250,
    },
    icon: 'trophy' as const,
  },
  {
    id: 'milestone-9',
    title: 'Un Paso Más',
    description: 'Completa 20 casos',
    progress: 19,
    total: 20,
    completed: false,
    reward: {
      xp: 400,
      mlCoins: 200,
    },
    icon: 'target' as const,
  },
];

export const mockMilestonesJustStarted = [
  {
    id: 'milestone-10',
    title: 'Nuevo Desafío',
    description: 'Completa 100 casos',
    progress: 5,
    total: 100,
    completed: false,
    reward: {
      xp: 1000,
      mlCoins: 500,
    },
    icon: 'trophy' as const,
  },
];

export const mockMilestonesMixed = [
  mockMilestones[0], // En progreso
  mockMilestonesCompleted[0], // Completado
  mockMilestonesAlmostComplete[0], // Casi completo
];

// Estado vacío
export const mockMilestonesEmpty: any[] = [];
