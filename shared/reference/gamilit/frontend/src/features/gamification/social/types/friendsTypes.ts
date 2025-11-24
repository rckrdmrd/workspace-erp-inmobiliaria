/**
 * Friends Types
 * Defines all types for the friend system
 */

import type { RankType } from '@shared/components/base/RankBadge';

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type ActivityType = 'achievement' | 'rankup' | 'exercise' | 'challenge' | 'guild';

export interface Friend {
  userId: string;
  username: string;
  avatar: string;
  rank: RankType;
  level: number;
  xp: number;
  mlCoins: number;
  lastActive: Date;
  friendsSince: Date;
  isOnline: boolean;
  commonInterests: string[];
  mutualFriends: number;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRank: RankType;
  senderLevel: number;
  receiverId: string;
  sentAt: Date;
  status: FriendRequestStatus;
  message?: string;
}

export interface FriendRecommendation {
  userId: string;
  username: string;
  avatar: string;
  rank: RankType;
  level: number;
  reason: string;
  commonInterests: string[];
  mutualFriends: number;
  score: number; // recommendation score
}

export interface FriendActivity {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  relatedData?: {
    achievementId?: string;
    achievementName?: string;
    exerciseId?: string;
    exerciseName?: string;
    newRank?: RankType;
    challengeId?: string;
  };
  praised: boolean;
}

export interface StudyInvitation {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  exerciseId: string;
  exerciseName: string;
  sentAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface FriendStats {
  totalFriends: number;
  onlineFriends: number;
  pendingRequests: number;
  sentRequests: number;
  mutualFriends: number;
  recommendations: number;
}
