/**
 * Guild Types
 * Defines all types for the guild/team system
 */

export type GuildRole = 'leader' | 'officer' | 'member';
export type GuildStatus = 'active' | 'recruiting' | 'full' | 'inactive';
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'upcoming';

export interface Guild {
  id: string;
  name: string;
  description: string;
  emblem: string;
  leaderId: string;
  memberCount: number;
  maxMembers: number;
  level: number;
  xp: number;
  createdAt: Date;
  isPublic: boolean;
  status: GuildStatus;
  requirements?: {
    minLevel?: number;
    minRank?: string;
  };
  stats: {
    totalExercisesCompleted: number;
    totalMlCoinsEarned: number;
    totalAchievements: number;
    averageScore: number;
  };
}

export interface GuildMember {
  userId: string;
  username: string;
  avatar: string;
  role: GuildRole;
  joinedAt: Date;
  contributionScore: number;
  lastActive: Date;
  rank: string;
  level: number;
}

export interface GuildChallenge {
  id: string;
  guildId: string;
  title: string;
  description: string;
  type: 'collaborative' | 'competitive';
  status: ChallengeStatus;
  startDate: Date;
  endDate: Date;
  goal: {
    type: 'exercises' | 'score' | 'achievements';
    target: number;
    current: number;
  };
  rewards: {
    mlCoins: number;
    xp: number;
    guildXp: number;
  };
  participants: string[]; // user IDs
}

export interface GuildInvitation {
  id: string;
  guildId: string;
  guildName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  sentAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface GuildActivity {
  id: string;
  guildId: string;
  userId: string;
  username: string;
  type: 'join' | 'leave' | 'achievement' | 'challenge' | 'levelup';
  description: string;
  timestamp: Date;
}

export interface GuildLeaderboardEntry {
  rank: number;
  guild: Guild;
  totalScore: number;
  change: number;
  isUserGuild: boolean;
}
