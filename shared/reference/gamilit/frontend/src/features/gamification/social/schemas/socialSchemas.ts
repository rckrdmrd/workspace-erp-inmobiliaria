/**
 * Social Schemas
 * Zod validation schemas for gamification and social features
 */

import { z } from 'zod';

// Achievement Schemas
export const achievementCategorySchema = z.enum(['progress', 'mastery', 'social', 'hidden']);
export const achievementRaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);

export const achievementProgressSchema = z.object({
  current: z.number().min(0),
  required: z.number().min(1),
});

export const achievementRequirementsSchema = z.object({
  prerequisiteAchievements: z.array(z.string()).optional(),
  rank: z.string().optional(),
  level: z.number().min(1).optional(),
  exercisesCompleted: z.number().min(0).optional(),
  perfectScores: z.number().min(0).optional(),
  friendsCount: z.number().min(0).optional(),
  guildMembership: z.boolean().optional(),
});

export const achievementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: achievementCategorySchema,
  rarity: achievementRaritySchema,
  icon: z.string().min(1),
  mlCoinsReward: z.number().min(0).max(200),
  xpReward: z.number().min(0).max(1000),
  isUnlocked: z.boolean(),
  unlockedAt: z.date().optional(),
  progress: achievementProgressSchema.optional(),
  requirements: achievementRequirementsSchema.optional(),
  isHidden: z.boolean().optional(),
});

// Power-up Schemas
export const powerUpCategorySchema = z.enum(['core', 'advanced']);
export const powerUpStatusSchema = z.enum(['available', 'active', 'cooldown', 'locked']);

export const powerUpEffectSchema = z.object({
  type: z.enum(['hint', 'vision', 'retry', 'time', 'multiplier', 'complete', 'boost', 'protection']),
  value: z.number().min(0),
  description: z.string().min(1),
});

export const powerUpSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  type: powerUpCategorySchema,
  price: z.number().min(0).max(200),
  icon: z.string().min(1),
  effect: powerUpEffectSchema,
  duration: z.number().min(0).optional(),
  cooldown: z.number().min(0).optional(),
  status: powerUpStatusSchema,
  activatedAt: z.date().optional(),
  expiresAt: z.date().optional(),
  cooldownEndsAt: z.date().optional(),
  usageCount: z.number().min(0),
  maxUsages: z.number().min(1).optional(),
  owned: z.boolean(),
  quantity: z.number().min(0),
});

// Leaderboard Schemas
export const leaderboardTypeSchema = z.enum(['global', 'school', 'grade', 'friends']);
export const timePeriodSchema = z.enum(['daily', 'weekly', 'monthly', 'all-time']);
export const rankChangeSchema = z.enum(['up', 'down', 'same', 'new']);

export const leaderboardEntrySchema = z.object({
  rank: z.number().min(1),
  userId: z.string().min(1),
  username: z.string().min(1).max(50),
  avatar: z.string().min(1),
  rankBadge: z.string().min(1),
  score: z.number().min(0),
  xp: z.number().min(0),
  mlCoins: z.number().min(0),
  change: z.number(),
  changeType: rankChangeSchema,
  isCurrentUser: z.boolean(),
  school: z.string().optional(),
  grade: z.number().min(1).max(12).optional(),
});

export const leaderboardFilterSchema = z.object({
  type: leaderboardTypeSchema,
  timePeriod: timePeriodSchema,
  school: z.string().optional(),
  grade: z.number().min(1).max(12).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Guild Schemas
export const guildRoleSchema = z.enum(['leader', 'officer', 'member']);
export const guildStatusSchema = z.enum(['active', 'recruiting', 'full', 'inactive']);
export const challengeStatusSchema = z.enum(['active', 'completed', 'failed', 'upcoming']);

export const guildSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  emblem: z.string().min(1),
  leaderId: z.string().min(1),
  memberCount: z.number().min(1).max(50),
  maxMembers: z.number().min(1).max(50),
  level: z.number().min(1),
  xp: z.number().min(0),
  createdAt: z.date(),
  isPublic: z.boolean(),
  status: guildStatusSchema,
  requirements: z.object({
    minLevel: z.number().min(1).optional(),
    minRank: z.string().optional(),
  }).optional(),
  stats: z.object({
    totalExercisesCompleted: z.number().min(0),
    totalMlCoinsEarned: z.number().min(0),
    totalAchievements: z.number().min(0),
    averageScore: z.number().min(0).max(100),
  }),
});

export const guildCreationSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  emblem: z.string().min(1),
  isPublic: z.boolean(),
  requirements: z.object({
    minLevel: z.number().min(1).optional(),
    minRank: z.string().optional(),
  }).optional(),
});

export const guildMemberSchema = z.object({
  userId: z.string().min(1),
  username: z.string().min(1).max(50),
  avatar: z.string().min(1),
  role: guildRoleSchema,
  joinedAt: z.date(),
  contributionScore: z.number().min(0),
  lastActive: z.date(),
  rank: z.string().min(1),
  level: z.number().min(1),
});

// Friend Schemas
export const friendRequestStatusSchema = z.enum(['pending', 'accepted', 'declined', 'cancelled']);
export const activityTypeSchema = z.enum(['achievement', 'rankup', 'exercise', 'challenge', 'guild']);

export const friendSchema = z.object({
  userId: z.string().min(1),
  username: z.string().min(1).max(50),
  avatar: z.string().min(1),
  rank: z.string().min(1),
  level: z.number().min(1),
  xp: z.number().min(0),
  mlCoins: z.number().min(0),
  lastActive: z.date(),
  friendsSince: z.date(),
  isOnline: z.boolean(),
  commonInterests: z.array(z.string()),
  mutualFriends: z.number().min(0),
});

export const friendRequestSchema = z.object({
  senderId: z.string().min(1),
  receiverId: z.string().min(1),
  message: z.string().max(200).optional(),
});

export const activityPraiseSchema = z.object({
  activityId: z.string().min(1),
  userId: z.string().min(1),
});
