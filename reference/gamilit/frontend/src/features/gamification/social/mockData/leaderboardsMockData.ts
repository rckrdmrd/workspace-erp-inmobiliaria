/**
 * Leaderboards Mock Data
 * 100+ entries for global, school, grade, and friends leaderboards
 */

import type { LeaderboardEntry, LeaderboardData } from '../types/leaderboardsTypes';

// Helper to generate random entries
const generateLeaderboardEntry = (rank: number, isCurrentUser = false): LeaderboardEntry => {
  const firstNames = ['Ana', 'Carlos', 'María', 'Luis', 'Sofia', 'Diego', 'Valentina', 'Miguel', 'Isabella', 'Javier', 'Camila', 'Pablo', 'Lucía', 'Andrés', 'Elena'];
  const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales'];
  const schools = ['Colegio Nacional', 'Instituto Tecnológico', 'Escuela Secundaria Federal', 'Colegio Bilingüe', 'Preparatoria Estatal'];
  const ranks = ['Nacom', 'Ajaw', "Ah K'in", 'Halach Uinic', "K'uk'ulkan"];

  const firstName = isCurrentUser ? 'Tú' : firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = isCurrentUser ? '' : lastNames[Math.floor(Math.random() * lastNames.length)];
  const username = isCurrentUser ? 'Tú' : `${firstName} ${lastName}`;

  const baseScore = 10000 - (rank * 50) + Math.floor(Math.random() * 100);
  const change = Math.floor(Math.random() * 21) - 10; // -10 to +10

  let changeType: 'up' | 'down' | 'same' | 'new';
  if (rank <= 3 && Math.random() > 0.7) {
    changeType = 'new';
  } else if (change > 0) {
    changeType = 'up';
  } else if (change < 0) {
    changeType = 'down';
  } else {
    changeType = 'same';
  }

  return {
    rank,
    userId: isCurrentUser ? 'current-user' : `user-${rank}`,
    username,
    avatar: `/avatars/avatar-${rank % 10}.png`,
    rankBadge: ranks[Math.floor((rank - 1) / 20) % ranks.length],
    score: baseScore,
    xp: baseScore * 2,
    mlCoins: Math.floor(baseScore * 0.5),
    change,
    changeType,
    isCurrentUser,
    school: schools[Math.floor(Math.random() * schools.length)],
    grade: Math.floor(Math.random() * 6) + 7, // Grades 7-12
  };
};

// Global Leaderboard (100 entries)
export const globalLeaderboardData: LeaderboardData = {
  type: 'global',
  timePeriod: 'all-time',
  entries: [
    ...Array.from({ length: 14 }, (_, i) => generateLeaderboardEntry(i + 1)),
    generateLeaderboardEntry(15, true), // Current user at rank 15
    ...Array.from({ length: 85 }, (_, i) => generateLeaderboardEntry(i + 16)),
  ],
  userRank: 15,
  totalParticipants: 5432,
  lastUpdated: new Date(),
  season: 'Temporada 1 - 2025',
};

// School Leaderboard (20 entries)
export const schoolLeaderboardData: LeaderboardData = {
  type: 'school',
  timePeriod: 'monthly',
  entries: [
    ...Array.from({ length: 7 }, (_, i) => generateLeaderboardEntry(i + 1)),
    generateLeaderboardEntry(8, true), // Current user at rank 8
    ...Array.from({ length: 12 }, (_, i) => generateLeaderboardEntry(i + 9)),
  ],
  userRank: 8,
  totalParticipants: 234,
  lastUpdated: new Date(),
};

// Grade Leaderboard (20 entries)
export const gradeLeaderboardData: LeaderboardData = {
  type: 'grade',
  timePeriod: 'weekly',
  entries: [
    ...Array.from({ length: 4 }, (_, i) => generateLeaderboardEntry(i + 1)),
    generateLeaderboardEntry(5, true), // Current user at rank 5
    ...Array.from({ length: 15 }, (_, i) => generateLeaderboardEntry(i + 6)),
  ],
  userRank: 5,
  totalParticipants: 87,
  lastUpdated: new Date(),
};

// Friends Leaderboard (15 entries)
export const friendsLeaderboardData: LeaderboardData = {
  type: 'friends',
  timePeriod: 'weekly',
  entries: [
    generateLeaderboardEntry(1),
    generateLeaderboardEntry(2, true), // Current user at rank 2
    ...Array.from({ length: 13 }, (_, i) => generateLeaderboardEntry(i + 3)),
  ],
  userRank: 2,
  totalParticipants: 15,
  lastUpdated: new Date(),
};

// Top 10 for quick display
export const top10GlobalLeaderboard = globalLeaderboardData.entries.slice(0, 10);

// Helper functions
export const getLeaderboardByType = (type: 'global' | 'school' | 'grade' | 'friends'): LeaderboardData => {
  switch (type) {
    case 'global':
      return globalLeaderboardData;
    case 'school':
      return schoolLeaderboardData;
    case 'grade':
      return gradeLeaderboardData;
    case 'friends':
      return friendsLeaderboardData;
    default:
      return globalLeaderboardData;
  }
};

export const getCurrentUserRank = (type: 'global' | 'school' | 'grade' | 'friends'): number => {
  const leaderboard = getLeaderboardByType(type);
  return leaderboard.userRank || 0;
};

export const getTopThree = (type: 'global' | 'school' | 'grade' | 'friends'): LeaderboardEntry[] => {
  const leaderboard = getLeaderboardByType(type);
  return leaderboard.entries.slice(0, 3);
};
