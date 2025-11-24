/**
 * Friends Store
 */

import { create } from 'zustand';
import type { Friend, FriendRequest, FriendRecommendation, FriendActivity } from '../types/friendsTypes';
import {
  friendsMockData,
  friendRequestsMockData,
  friendRecommendationsMockData,
  friendActivitiesMockData,
  getOnlineFriends,
  getPendingFriendRequests
} from '../mockData/friendsMockData';

interface FriendsStore {
  friends: Friend[];
  friendRequests: FriendRequest[];
  recommendations: FriendRecommendation[];
  activities: FriendActivity[];
  onlineFriends: Friend[];

  addFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;
  sendFriendRequest: (userId: string, message?: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  praiseActivity: (activityId: string) => void;
  refreshFriends: () => void;
}

export const useFriendsStore = create<FriendsStore>((set) => ({
  friends: friendsMockData,
  friendRequests: friendRequestsMockData,
  recommendations: friendRecommendationsMockData,
  activities: friendActivitiesMockData,
  onlineFriends: getOnlineFriends(),

  addFriend: (userId: string) => {
    set((state) => {
      const recommendation = state.recommendations.find((r) => r.userId === userId);
      if (!recommendation) return state;

      const newFriend: Friend = {
        userId: recommendation.userId,
        username: recommendation.username,
        avatar: recommendation.avatar,
        rank: recommendation.rank,
        level: recommendation.level,
        xp: 0,
        mlCoins: 0,
        lastActive: new Date(),
        friendsSince: new Date(),
        isOnline: false,
        commonInterests: recommendation.commonInterests,
        mutualFriends: recommendation.mutualFriends,
      };

      return {
        friends: [...state.friends, newFriend],
        recommendations: state.recommendations.filter((r) => r.userId !== userId),
      };
    });
  },

  removeFriend: (userId: string) => {
    set((state) => ({
      friends: state.friends.filter((f) => f.userId !== userId),
    }));
  },

  sendFriendRequest: (userId: string, message?: string) => {
    const newRequest: FriendRequest = {
      id: `request-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'Tú',
      senderAvatar: '/avatars/avatar-you.png',
      senderRank: 'chilan',
      senderLevel: 18,
      receiverId: userId,
      sentAt: new Date(),
      status: 'pending',
      message,
    };

    set((state) => ({
      friendRequests: [...state.friendRequests, newRequest],
    }));
  },

  acceptFriendRequest: (requestId: string) => {
    set((state) => {
      const request = state.friendRequests.find((r) => r.id === requestId);
      if (!request) return state;

      const newFriend: Friend = {
        userId: request.senderId,
        username: request.senderName,
        avatar: request.senderAvatar,
        rank: request.senderRank,
        level: request.senderLevel,
        xp: 0,
        mlCoins: 0,
        lastActive: new Date(),
        friendsSince: new Date(),
        isOnline: false,
        commonInterests: [],
        mutualFriends: 0,
      };

      return {
        friends: [...state.friends, newFriend],
        friendRequests: state.friendRequests.filter((r) => r.id !== requestId),
      };
    });
  },

  declineFriendRequest: (requestId: string) => {
    set((state) => ({
      friendRequests: state.friendRequests.filter((r) => r.id !== requestId),
    }));
  },

  praiseActivity: (activityId: string) => {
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId ? { ...a, praised: !a.praised } : a
      ),
    }));
  },

  refreshFriends: () => {
    set((state) => ({
      onlineFriends: getOnlineFriends(),
    }));
  },
}));
