/**
 * Guilds Mock Data
 * 10 guilds with members, challenges, and activities
 */

import type { Guild, GuildMember, GuildChallenge, GuildActivity } from '../types/guildsTypes';

// 10 Guilds
export const guildsMockData: Guild[] = [
  {
    id: 'guild-001',
    name: 'Detectives Élite',
    description: 'Los mejores detectives reunidos para resolver los misterios más difíciles de la literatura',
    emblem: 'detective',
    leaderId: 'user-1',
    memberCount: 45,
    maxMembers: 50,
    level: 25,
    xp: 125000,
    createdAt: new Date('2024-11-01'),
    isPublic: true,
    status: 'active',
    requirements: {
      minLevel: 10,
      minRank: 'Ajaw',
    },
    stats: {
      totalExercisesCompleted: 2340,
      totalMlCoinsEarned: 567890,
      totalAchievements: 156,
      averageScore: 92.5,
    },
  },
  {
    id: 'guild-002',
    name: 'Lectores Unidos',
    description: 'Amantes de la lectura comprometidos con mejorar juntos',
    emblem: 'book',
    leaderId: 'user-10',
    memberCount: 38,
    maxMembers: 50,
    level: 18,
    xp: 89000,
    createdAt: new Date('2024-12-05'),
    isPublic: true,
    status: 'recruiting',
    stats: {
      totalExercisesCompleted: 1560,
      totalMlCoinsEarned: 345670,
      totalAchievements: 98,
      averageScore: 87.3,
    },
  },
  {
    id: 'guild-003',
    name: 'Academia Maya',
    description: 'Exploramos el conocimiento con la sabiduría de los antiguos mayas',
    emblem: 'pyramid',
    leaderId: 'user-25',
    memberCount: 50,
    maxMembers: 50,
    level: 30,
    xp: 156000,
    createdAt: new Date('2024-10-15'),
    isPublic: false,
    status: 'full',
    requirements: {
      minLevel: 15,
      minRank: "Ah K'in",
    },
    stats: {
      totalExercisesCompleted: 3120,
      totalMlCoinsEarned: 890000,
      totalAchievements: 234,
      averageScore: 94.8,
    },
  },
  {
    id: 'guild-004',
    name: 'Los Exploradores',
    description: 'Nuevos aventureros aprendiendo juntos',
    emblem: 'compass',
    leaderId: 'user-45',
    memberCount: 15,
    maxMembers: 30,
    level: 8,
    xp: 24000,
    createdAt: new Date('2025-01-10'),
    isPublic: true,
    status: 'recruiting',
    stats: {
      totalExercisesCompleted: 450,
      totalMlCoinsEarned: 89000,
      totalAchievements: 34,
      averageScore: 78.5,
    },
  },
  {
    id: 'guild-005',
    name: 'Guerreros del Saber',
    description: 'Conquistamos el conocimiento con determinación',
    emblem: 'sword',
    leaderId: 'user-67',
    memberCount: 42,
    maxMembers: 50,
    level: 22,
    xp: 108000,
    createdAt: new Date('2024-11-20'),
    isPublic: true,
    status: 'active',
    requirements: {
      minLevel: 8,
    },
    stats: {
      totalExercisesCompleted: 1980,
      totalMlCoinsEarned: 456000,
      totalAchievements: 128,
      averageScore: 89.2,
    },
  },
  {
    id: 'guild-006',
    name: 'Círculo de Lectura',
    description: 'Un espacio tranquilo para lectores apasionados',
    emblem: 'book-open',
    leaderId: 'user-89',
    memberCount: 25,
    maxMembers: 30,
    level: 14,
    xp: 56000,
    createdAt: new Date('2024-12-15'),
    isPublic: true,
    status: 'active',
    stats: {
      totalExercisesCompleted: 980,
      totalMlCoinsEarned: 234000,
      totalAchievements: 67,
      averageScore: 85.7,
    },
  },
  {
    id: 'guild-007',
    name: 'Maestros de la Literatura',
    description: 'Los más experimentados guían a los nuevos',
    emblem: 'graduation-cap',
    leaderId: 'user-102',
    memberCount: 35,
    maxMembers: 40,
    level: 28,
    xp: 138000,
    createdAt: new Date('2024-10-28'),
    isPublic: false,
    status: 'active',
    requirements: {
      minLevel: 20,
      minRank: 'Halach Uinic',
    },
    stats: {
      totalExercisesCompleted: 2680,
      totalMlCoinsEarned: 678000,
      totalAchievements: 189,
      averageScore: 93.4,
    },
  },
  {
    id: 'guild-008',
    name: 'Velocistas',
    description: 'Competimos por velocidad y precisión',
    emblem: 'zap',
    leaderId: 'user-123',
    memberCount: 20,
    maxMembers: 25,
    level: 16,
    xp: 68000,
    createdAt: new Date('2024-12-20'),
    isPublic: true,
    status: 'recruiting',
    stats: {
      totalExercisesCompleted: 1240,
      totalMlCoinsEarned: 298000,
      totalAchievements: 87,
      averageScore: 88.9,
    },
  },
  {
    id: 'guild-009',
    name: 'Amigos del Campus',
    description: 'Compañeros de escuela estudiando juntos',
    emblem: 'users',
    leaderId: 'user-145',
    memberCount: 18,
    maxMembers: 25,
    level: 10,
    xp: 38000,
    createdAt: new Date('2025-01-05'),
    isPublic: true,
    status: 'active',
    stats: {
      totalExercisesCompleted: 670,
      totalMlCoinsEarned: 156000,
      totalAchievements: 45,
      averageScore: 82.3,
    },
  },
  {
    id: 'guild-010',
    name: 'Leyendas Literarias',
    description: 'Elite de élites - Solo para los mejores',
    emblem: 'crown',
    leaderId: 'user-167',
    memberCount: 30,
    maxMembers: 30,
    level: 35,
    xp: 189000,
    createdAt: new Date('2024-09-10'),
    isPublic: false,
    status: 'full',
    requirements: {
      minLevel: 30,
      minRank: "K'uk'ulkan",
    },
    stats: {
      totalExercisesCompleted: 3890,
      totalMlCoinsEarned: 1200000,
      totalAchievements: 298,
      averageScore: 96.7,
    },
  },
];

// Guild Members (for current user's guild)
export const guildMembersMockData: GuildMember[] = [
  {
    userId: 'user-1',
    username: 'Carlos Martínez',
    avatar: '/avatars/avatar-1.png',
    role: 'leader',
    joinedAt: new Date('2024-11-01'),
    contributionScore: 15680,
    lastActive: new Date(),
    rank: 'Halach Uinic',
    level: 28,
  },
  {
    userId: 'current-user',
    username: 'Tú',
    avatar: '/avatars/avatar-you.png',
    role: 'officer',
    joinedAt: new Date('2024-11-15'),
    contributionScore: 8920,
    lastActive: new Date(),
    rank: "Ah K'in",
    level: 18,
  },
  {
    userId: 'user-2',
    username: 'Ana García',
    avatar: '/avatars/avatar-2.png',
    role: 'officer',
    joinedAt: new Date('2024-11-05'),
    contributionScore: 12450,
    lastActive: new Date(Date.now() - 3600000),
    rank: "Ah K'in",
    level: 22,
  },
  {
    userId: 'user-3',
    username: 'Luis Rodríguez',
    avatar: '/avatars/avatar-3.png',
    role: 'member',
    joinedAt: new Date('2024-11-20'),
    contributionScore: 6780,
    lastActive: new Date(Date.now() - 7200000),
    rank: 'Ajaw',
    level: 15,
  },
  {
    userId: 'user-4',
    username: 'María López',
    avatar: '/avatars/avatar-4.png',
    role: 'member',
    joinedAt: new Date('2024-12-01'),
    contributionScore: 5430,
    lastActive: new Date(Date.now() - 86400000),
    rank: 'Ajaw',
    level: 14,
  },
];

// Guild Challenges
export const guildChallengesMockData: GuildChallenge[] = [
  {
    id: 'challenge-001',
    guildId: 'guild-001',
    title: 'Maratón de Lectura Semanal',
    description: 'Completa 100 ejercicios como gremio esta semana',
    type: 'collaborative',
    status: 'active',
    startDate: new Date(Date.now() - 86400000 * 3),
    endDate: new Date(Date.now() + 86400000 * 4),
    goal: {
      type: 'exercises',
      target: 100,
      current: 67,
    },
    rewards: {
      mlCoins: 50,
      xp: 200,
      guildXp: 5000,
    },
    participants: ['user-1', 'current-user', 'user-2', 'user-3', 'user-4'],
  },
  {
    id: 'challenge-002',
    guildId: 'guild-001',
    title: 'Búsqueda de Logros',
    description: 'Desbloquea 20 logros nuevos entre todos',
    type: 'collaborative',
    status: 'active',
    startDate: new Date(Date.now() - 86400000 * 5),
    endDate: new Date(Date.now() + 86400000 * 9),
    goal: {
      type: 'achievements',
      target: 20,
      current: 12,
    },
    rewards: {
      mlCoins: 75,
      xp: 300,
      guildXp: 8000,
    },
    participants: ['user-1', 'current-user', 'user-2'],
  },
  {
    id: 'challenge-003',
    guildId: 'guild-001',
    title: 'Batalla contra Academia Maya',
    description: 'Competencia de puntuación total contra otro gremio',
    type: 'competitive',
    status: 'upcoming',
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 9),
    goal: {
      type: 'score',
      target: 50000,
      current: 0,
    },
    rewards: {
      mlCoins: 100,
      xp: 500,
      guildXp: 15000,
    },
    participants: [],
  },
];

// Guild Activities
export const guildActivitiesMockData: GuildActivity[] = [
  {
    id: 'activity-001',
    guildId: 'guild-001',
    userId: 'current-user',
    username: 'Tú',
    type: 'achievement',
    description: 'desbloqueó el logro "Perfeccionista"',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: 'activity-002',
    guildId: 'guild-001',
    userId: 'user-2',
    username: 'Ana García',
    type: 'challenge',
    description: 'completó 5 ejercicios para el desafío semanal',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'activity-003',
    guildId: 'guild-001',
    userId: 'user-3',
    username: 'Luis Rodríguez',
    type: 'levelup',
    description: 'subió al nivel 15',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'activity-004',
    guildId: 'guild-001',
    userId: 'user-4',
    username: 'María López',
    type: 'join',
    description: 'se unió al gremio',
    timestamp: new Date(Date.now() - 86400000),
  },
];

// Helper functions
export const getUserGuild = (): Guild | undefined => {
  return guildsMockData.find((guild) => guild.id === 'guild-001');
};

export const getPublicGuilds = (): Guild[] => {
  return guildsMockData.filter((guild) => guild.isPublic);
};

export const getRecruitingGuilds = (): Guild[] => {
  return guildsMockData.filter((guild) => guild.status === 'recruiting');
};

export const getGuildById = (id: string): Guild | undefined => {
  return guildsMockData.find((guild) => guild.id === id);
};
