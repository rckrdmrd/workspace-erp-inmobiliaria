/**
 * Maya Ranks & Progression System - Mock Data
 *
 * Realistic mock data for testing and development of the rank system.
 */

import type {
  RankDefinition,
  MayaRank,
  UserRankProgress,
  PrestigeBonus,
  MultiplierSource,
  ProgressionHistoryEntry,
  XPEvent,
  RankUpEvent,
} from '../types/ranksTypes';

// ============================================================================
// RANK DEFINITIONS
// ============================================================================

/**
 * Complete definitions for all 5 Maya ranks
 * Official names and data according to /docs/01-requerimientos/gamificacion/01-RANGOS-MAYA.md
 */
export const MAYA_RANKS: Record<MayaRank, RankDefinition> = {
  Ajaw: {
    id: 'Ajaw',
    name: 'Ajaw',
    nameSpanish: 'Señor / Gobernante',
    description: 'Iniciado en el camino del conocimiento. Completaste el Módulo 1 - Comprensión Literal.',
    mlCoinsRequired: 0,
    multiplier: 1.0,
    colorFrom: '#60a5fa',
    colorTo: '#2563eb',
    gradient: 'from-rank-detective-from to-rank-detective-to',
    icon: 'detective-badge',
    benefits: [
      'Acceso a Módulo 1 (Comprensión Literal)',
      'Multiplicador ML Coins: 1.0x',
      'Bonus de promoción: 50 ML Coins',
    ],
    order: 0,
  },
  Nacom: {
    id: 'Nacom',
    name: 'Nacom',
    nameSpanish: 'Capitán de Guerra',
    description: 'Explorador de nuevos horizontes. Completaste el Módulo 2 - Comprensión Inferencial.',
    mlCoinsRequired: 200,
    multiplier: 1.25,
    colorFrom: '#4ade80',
    colorTo: '#16a34a',
    gradient: 'from-rank-sargento-from to-rank-sargento-to',
    icon: 'sergeant-shield',
    benefits: [
      'Acceso a Módulo 2 (Comprensión Inferencial)',
      'Multiplicador ML Coins: 1.25x',
      'Bonus de promoción: 75 ML Coins',
      'Insignia de Nacom',
      'Cosméticos nivel 1',
    ],
    order: 1,
  },
  'Ah K\'in': {
    id: 'Ah K\'in',
    name: 'Ah K\'in',
    nameSpanish: 'Sacerdote del Sol',
    description: 'Analista crítico de textos. Completaste el Módulo 3 - Comprensión Crítica.',
    mlCoinsRequired: 500,
    multiplier: 1.5,
    colorFrom: '#fb923c',
    colorTo: '#ea580c',
    gradient: 'from-rank-teniente-from to-rank-teniente-to',
    icon: 'lieutenant-star',
    benefits: [
      'Acceso a Módulo 3 (Comprensión Crítica)',
      'Multiplicador ML Coins: 1.5x',
      'Bonus de promoción: 100 ML Coins',
      'Acceso a Gremios',
      'Cosméticos nivel 2',
      'Título personalizado',
    ],
    order: 2,
  },
  'Halach Uinic': {
    id: 'Halach Uinic',
    name: 'Halach Uinic',
    nameSpanish: 'Hombre Verdadero',
    description: 'Crítico experto en lectura digital. Completaste el Módulo 4 - Lectura Digital.',
    mlCoinsRequired: 1000,
    multiplier: 1.75,
    colorFrom: '#a78bfa',
    colorTo: '#7c3aed',
    gradient: 'from-rank-capitan-from to-rank-capitan-to',
    icon: 'captain-medal',
    benefits: [
      'Acceso a Módulo 4 (Lectura Digital)',
      'Multiplicador ML Coins: 1.75x',
      'Bonus de promoción: 125 ML Coins',
      'Crear Gremios',
      'Cosméticos nivel 3',
      'Badge animado',
      'Mentoría de novatos',
    ],
    order: 3,
  },
  'K\'uk\'ulkan': {
    id: 'K\'uk\'ulkan',
    name: 'K\'uk\'ulkan',
    nameSpanish: 'Serpiente Emplumada',
    description: 'Maestro de la producción lectora. Completaste el Módulo 5 - Producción Lectora. Máximo nivel alcanzado.',
    mlCoinsRequired: 2000,
    multiplier: 2.0,
    colorFrom: '#f59e0b',
    colorTo: '#d97706',
    gradient: 'from-rank-comisario-from to-rank-comisario-to',
    icon: 'master-crown',
    benefits: [
      'Acceso a Módulo 5 (Producción Lectora)',
      'Multiplicador ML Coins: 2.0x',
      'Bonus de promoción: 150 ML Coins',
      'Acceso a todo el contenido',
      'Gestión avanzada de Gremios',
      'Todos los cosméticos',
      'Badge animado dorado',
      'Programa de mentoría premium',
      'Elegibilidad para Prestige',
    ],
    order: 4,
  },
};

/**
 * Array of ranks in progression order - Official sequence
 */
export const RANKS_IN_ORDER: RankDefinition[] = [
  MAYA_RANKS.Ajaw,
  MAYA_RANKS.Nacom,
  MAYA_RANKS['Ah K\'in'],
  MAYA_RANKS['Halach Uinic'],
  MAYA_RANKS['K\'uk\'ulkan'],
];

// ============================================================================
// PRESTIGE BONUSES
// ============================================================================

/**
 * Prestige tier bonuses (levels 1-10)
 */
export const PRESTIGE_BONUSES: PrestigeBonus[] = [
  {
    level: 1,
    bonusMultiplier: 0.1,
    unlockedFeatures: ['Prestige Badge Bronze', 'Perfil dorado'],
    cosmetics: ['Bronze Star', 'Prestige Frame 1'],
    abilities: ['XP Boost pasivo +10%'],
    badge: 'prestige-1',
    color: '#cd7f32',
  },
  {
    level: 2,
    bonusMultiplier: 0.15,
    unlockedFeatures: ['Prestige Badge Silver', 'Animaciones especiales'],
    cosmetics: ['Silver Star', 'Prestige Frame 2', 'Particle Effects'],
    abilities: ['XP Boost pasivo +15%', 'Streak Protection'],
    badge: 'prestige-2',
    color: '#c0c0c0',
  },
  {
    level: 3,
    bonusMultiplier: 0.2,
    unlockedFeatures: ['Prestige Badge Gold', 'Título "Veteran"'],
    cosmetics: ['Gold Star', 'Prestige Frame 3', 'Glow Effects'],
    abilities: ['XP Boost pasivo +20%', 'Streak Protection', 'Double Daily Rewards'],
    badge: 'prestige-3',
    color: '#ffd700',
  },
  {
    level: 4,
    bonusMultiplier: 0.25,
    unlockedFeatures: ['Prestige Badge Platinum', 'Título "Elite"'],
    cosmetics: ['Platinum Star', 'Prestige Frame 4', 'Aura Effects'],
    abilities: ['XP Boost pasivo +25%', 'Streak Protection', 'Double Daily Rewards', 'Priority Support'],
    badge: 'prestige-4',
    color: '#e5e4e2',
  },
  {
    level: 5,
    bonusMultiplier: 0.3,
    unlockedFeatures: ['Prestige Badge Diamond', 'Título "Master"'],
    cosmetics: ['Diamond Star', 'Prestige Frame 5', 'Legendary Aura'],
    abilities: ['XP Boost pasivo +30%', 'Streak Protection', 'Triple Daily Rewards', 'Priority Support', 'Beta Access'],
    badge: 'prestige-5',
    color: '#b9f2ff',
  },
  {
    level: 6,
    bonusMultiplier: 0.35,
    unlockedFeatures: ['Prestige Badge Ruby', 'Título "Grandmaster"'],
    cosmetics: ['Ruby Star', 'Prestige Frame 6', 'Mythical Aura'],
    abilities: ['XP Boost pasivo +35%', 'Permanent Streak Shield', 'Triple Daily Rewards', 'VIP Support'],
    badge: 'prestige-6',
    color: '#e0115f',
  },
  {
    level: 7,
    bonusMultiplier: 0.4,
    unlockedFeatures: ['Prestige Badge Emerald', 'Título "Legend"'],
    cosmetics: ['Emerald Star', 'Prestige Frame 7', 'Divine Aura'],
    abilities: ['XP Boost pasivo +40%', 'Permanent Streak Shield', 'Quadruple Daily Rewards', 'VIP Support', 'Exclusive Events'],
    badge: 'prestige-7',
    color: '#50c878',
  },
  {
    level: 8,
    bonusMultiplier: 0.45,
    unlockedFeatures: ['Prestige Badge Sapphire', 'Título "Immortal"'],
    cosmetics: ['Sapphire Star', 'Prestige Frame 8', 'Celestial Aura'],
    abilities: ['XP Boost pasivo +45%', 'Permanent Streak Shield', 'Quadruple Daily Rewards', 'Dedicated Support'],
    badge: 'prestige-8',
    color: '#0f52ba',
  },
  {
    level: 9,
    bonusMultiplier: 0.5,
    unlockedFeatures: ['Prestige Badge Obsidian', 'Título "Transcendent"'],
    cosmetics: ['Obsidian Star', 'Prestige Frame 9', 'Cosmic Aura'],
    abilities: ['XP Boost pasivo +50%', 'Permanent Streak Shield', 'Quintuple Daily Rewards', 'Dedicated Support', 'Content Creator Tools'],
    badge: 'prestige-9',
    color: '#3b2f2f',
  },
  {
    level: 10,
    bonusMultiplier: 0.6,
    unlockedFeatures: ['Prestige Badge Rainbow', 'Título "Eternal Champion"'],
    cosmetics: ['Rainbow Star', 'Prestige Frame 10', 'Rainbow Aura', 'All Exclusive Items'],
    abilities: ['XP Boost pasivo +60%', 'Permanent Streak Shield', 'Quintuple Daily Rewards', 'White Glove Support', 'Ultimate Mentor Status'],
    badge: 'prestige-10',
    color: '#ff69b4',
  },
];

// ============================================================================
// MOCK USER PROGRESS DATA
// ============================================================================

/**
 * Mock user progress - Beginner (NACOM)
 */
export const MOCK_USER_NACOM: UserRankProgress = {
  currentRank: 'Nacom',
  currentLevel: 5,
  currentXP: 250,
  xpToNextLevel: 600,
  totalXP: 750,
  mlCoinsEarned: 150,
  prestigeLevel: 0,
  multiplier: 1.0,
  lastRankUp: new Date('2025-10-01'),
  activityStreak: 7,
  lastActivityDate: new Date('2025-10-16'),
  canRankUp: false,
  nextRank: 'Ajaw',
  canPrestige: false,
};

/**
 * Mock user progress - Intermediate (Ajaw - Nivel 1)
 */
export const MOCK_USER_AJAW: UserRankProgress = {
  currentRank: 'Ajaw',
  currentLevel: 12,
  currentXP: 450,
  xpToNextLevel: 1300,
  totalXP: 2850,
  mlCoinsEarned: 400,
  prestigeLevel: 0,
  multiplier: 1.25,
  lastRankUp: new Date('2025-09-20'),
  activityStreak: 21,
  lastActivityDate: new Date('2025-10-16'),
  canRankUp: false,
  nextRank: "Ah K'in",
  canPrestige: false,
};

/**
 * Mock user progress - Advanced (Ah K'in - Nivel 3)
 */
export const MOCK_USER_AH_KIN: UserRankProgress = {
  currentRank: "Ah K'in",
  currentLevel: 20,
  currentXP: 800,
  xpToNextLevel: 2100,
  totalXP: 8200,
  mlCoinsEarned: 850,
  prestigeLevel: 0,
  multiplier: 1.5,
  lastRankUp: new Date('2025-08-15'),
  activityStreak: 45,
  lastActivityDate: new Date('2025-10-16'),
  canRankUp: false,
  nextRank: 'Halach Uinic',
  canPrestige: false,
};

/**
 * Mock user progress - Expert (Halach Uinic - Nivel 4)
 */
export const MOCK_USER_HALACH_UINIC: UserRankProgress = {
  currentRank: 'Halach Uinic',
  currentLevel: 35,
  currentXP: 1500,
  xpToNextLevel: 3600,
  totalXP: 18500,
  mlCoinsEarned: 1500,
  prestigeLevel: 0,
  multiplier: 1.75,
  lastRankUp: new Date('2025-07-10'),
  activityStreak: 90,
  lastActivityDate: new Date('2025-10-16'),
  canRankUp: false,
  nextRank: "K'uk'ulkan",
  canPrestige: false,
};

/**
 * Mock user progress - Master (K'uk'ulkan - Nivel 5) - Ready for Prestige
 */
export const MOCK_USER_KUKULKAN: UserRankProgress = {
  currentRank: "K'uk'ulkan",
  currentLevel: 50,
  currentXP: 2800,
  xpToNextLevel: 5100,
  totalXP: 45000,
  mlCoinsEarned: 3200,
  prestigeLevel: 0,
  multiplier: 2.0,
  lastRankUp: new Date('2025-06-01'),
  activityStreak: 137,
  lastActivityDate: new Date('2025-10-16'),
  canRankUp: false,
  nextRank: null,
  canPrestige: true,
};

/**
 * Mock user progress - Prestiged User (Level 1)
 */
export const MOCK_USER_PRESTIGE_1: UserRankProgress = {
  currentRank: 'Nacom',
  currentLevel: 8,
  currentXP: 450,
  xpToNextLevel: 900,
  totalXP: 1350,
  mlCoinsEarned: 270,
  prestigeLevel: 1,
  multiplier: 1.1, // Base 1.0 + Prestige 0.1
  lastRankUp: new Date('2025-09-01'),
  activityStreak: 46,
  lastActivityDate: new Date('2025-10-16'),
  canRankUp: false,
  nextRank: 'Ajaw',
  canPrestige: false,
};

// ============================================================================
// MOCK MULTIPLIER SOURCES
// ============================================================================

/**
 * Mock multiplier sources for a user
 */
export const MOCK_MULTIPLIER_SOURCES: MultiplierSource[] = [
  {
    type: 'rank',
    name: 'Rango Ajaw',
    value: 1.25,
    isPermanent: true,
    description: 'Multiplicador base del rango Sargento',
    icon: 'shield',
  },
  {
    type: 'prestige',
    name: 'Prestige Nivel 1',
    value: 1.1,
    isPermanent: true,
    description: 'Bonus permanente por prestigio',
    icon: 'star',
  },
  {
    type: 'streak',
    name: 'Racha de 21 días',
    value: 1.15,
    isPermanent: false,
    description: 'Bonus por actividad constante',
    icon: 'flame',
  },
  {
    type: 'guild',
    name: 'Guild "Los Detectives"',
    value: 1.05,
    expiresAt: new Date('2025-10-23'),
    isPermanent: false,
    description: 'Bonus por membresía de guild activo',
    icon: 'users',
  },
  {
    type: 'event',
    name: 'Evento Halloween 2025',
    value: 1.2,
    expiresAt: new Date('2025-10-31'),
    isPermanent: false,
    description: 'Bonus especial del evento de Halloween',
    icon: 'ghost',
  },
];

// ============================================================================
// MOCK XP EVENTS
// ============================================================================

/**
 * Mock XP events for history
 */
export const MOCK_XP_EVENTS: XPEvent[] = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    amount: 100,
    source: 'exercise_completion',
    timestamp: new Date('2025-10-16T10:30:00'),
    description: 'Completado: Crucigrama Nivel 5',
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    amount: 150,
    source: 'perfect_score',
    timestamp: new Date('2025-10-16T11:45:00'),
    description: 'Score perfecto en Detective Textual',
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    amount: 50,
    source: 'streak_bonus',
    timestamp: new Date('2025-10-16T12:00:00'),
    description: 'Bonus por racha de 21 días',
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    amount: 200,
    source: 'achievement_unlock',
    timestamp: new Date('2025-10-15T18:20:00'),
    description: 'Desbloqueado: "Maestro de la Comprensión"',
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    amount: 25,
    source: 'social_interaction',
    timestamp: new Date('2025-10-15T14:00:00'),
    description: 'Ayudaste a un compañero',
  },
];

// ============================================================================
// MOCK RANK UP EVENTS
// ============================================================================

/**
 * Mock rank up events for history
 */
export const MOCK_RANK_UP_EVENTS: RankUpEvent[] = [
  {
    fromRank: 'Nacom',
    toRank: 'Ajaw',
    timestamp: new Date('2025-09-20T15:30:00'),
    newBenefits: [
      'Acceso a ejercicios intermedios',
      '1.25x multiplicador',
      'Insignia de Sargento',
    ],
    newMultiplier: 1.25,
    isPrestige: false,
  },
  {
    fromRank: 'Ajaw',
    toRank: "Ah K'in",
    timestamp: new Date('2025-08-15T09:15:00'),
    newBenefits: [
      'Acceso a ejercicios avanzados',
      '1.5x multiplicador',
      'Acceso a Gremios',
    ],
    newMultiplier: 1.5,
    isPrestige: false,
  },
];

// ============================================================================
// MOCK PROGRESSION HISTORY
// ============================================================================

/**
 * Mock progression history entries
 */
export const MOCK_PROGRESSION_HISTORY: ProgressionHistoryEntry[] = [
  {
    id: 'hist-001',
    type: 'rank_up',
    timestamp: new Date('2025-09-20T15:30:00'),
    title: 'Ascendido a Ajaw',
    description: 'Has alcanzado el rango de Sargento. ¡Felicitaciones!',
    rank: 'Ajaw',
    xpSnapshot: 2000,
    levelSnapshot: 10,
    multiplierSnapshot: 1.25,
  },
  {
    id: 'hist-002',
    type: 'milestone',
    timestamp: new Date('2025-10-01T12:00:00'),
    title: 'Racha de 30 días',
    description: 'Has mantenido una racha de actividad de 30 días consecutivos',
    xpSnapshot: 3500,
    levelSnapshot: 15,
    multiplierSnapshot: 1.25,
  },
  {
    id: 'hist-003',
    type: 'level_up',
    timestamp: new Date('2025-10-10T14:20:00'),
    title: 'Nivel 20 alcanzado',
    description: 'Has subido al nivel 20. Sigue así.',
    rank: 'Ajaw',
    xpSnapshot: 5000,
    levelSnapshot: 20,
    multiplierSnapshot: 1.25,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get rank definition by ID
 */
export function getRankById(rankId: MayaRank): RankDefinition {
  return MAYA_RANKS[rankId];
}

/**
 * Get next rank in progression
 */
export function getNextRank(currentRank: MayaRank): RankDefinition | null {
  const currentIndex = RANKS_IN_ORDER.findIndex(r => r.id === currentRank);
  if (currentIndex === -1 || currentIndex === RANKS_IN_ORDER.length - 1) {
    return null;
  }
  return RANKS_IN_ORDER[currentIndex + 1];
}

/**
 * Get previous rank in progression
 */
export function getPreviousRank(currentRank: MayaRank): RankDefinition | null {
  const currentIndex = RANKS_IN_ORDER.findIndex(r => r.id === currentRank);
  if (currentIndex <= 0) {
    return null;
  }
  return RANKS_IN_ORDER[currentIndex - 1];
}

/**
 * Calculate XP needed for next level
 */
export function calculateXPForLevel(level: number): number {
  return level * 100;
}

/**
 * Get prestige bonus by level
 */
export function getPrestigeBonusByLevel(level: number): PrestigeBonus | undefined {
  return PRESTIGE_BONUSES.find(p => p.level === level);
}

/**
 * Calculate total multiplier from sources
 */
export function calculateTotalMultiplier(sources: MultiplierSource[]): number {
  return sources.reduce((total, source) => total * source.value, 1.0);
}

/**
 * Check if user can rank up
 */
export function canUserRankUp(progress: UserRankProgress): boolean {
  const nextRank = getNextRank(progress.currentRank);
  if (!nextRank) return false;
  return progress.mlCoinsEarned >= nextRank.mlCoinsRequired;
}
