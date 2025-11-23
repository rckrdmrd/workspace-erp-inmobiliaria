/**
 * Friends Integration Tests
 *
 * Tests for friends system integrating store with UI flows.
 *
 * Test Coverage:
 * - Store Initialization (2 tests): Initial state, structure
 * - Add Friend Flow (3 tests): Add from recommendations, update state
 * - Remove Friend Flow (2 tests): Remove friend, update lists
 * - Friend Requests Flow (5 tests): Send, accept, decline requests
 * - Recommendations (2 tests): Filter recommendations, recommendations update
 * - Activities Flow (2 tests): Praise activity, activity updates
 * - Online Friends (2 tests): Online status, refresh
 *
 * Total: 18 tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFriendsStore } from '../store/friendsStore';
import type { Friend, FriendRequest, FriendRecommendation } from '../types/friendsTypes';

describe('Friends Integration Tests', () => {
  // ============================================================================
  // SETUP & MOCK DATA
  // ============================================================================

  beforeEach(() => {
    // Reset store to initial state
    const { friends, friendRequests, recommendations, activities, onlineFriends } = useFriendsStore.getState();

    // Keep initial mock data structure
    useFriendsStore.setState({
      friends: [],
      friendRequests: [],
      recommendations: [
        {
          userId: 'user-rec-1',
          username: 'Luna Maya',
          avatar: '/avatars/luna.png',
          rank: 'chilan',
          level: 12,
          reason: 'Intereses comunes en lectura',
          commonInterests: ['lectura', 'comprensión'],
          mutualFriends: 3,
          score: 85,
        },
        {
          userId: 'user-rec-2',
          username: 'Carlos Sol',
          avatar: '/avatars/carlos.png',
          rank: 'al_mehen',
          level: 8,
          reason: 'Mismo nivel de progreso',
          commonInterests: ['matemáticas'],
          mutualFriends: 1,
          score: 70,
        },
      ],
      activities: [],
      onlineFriends: [],
    });
  });

  // ============================================================================
  // STORE INITIALIZATION TESTS
  // ============================================================================

  describe('Store Initialization', () => {
    it('should initialize with correct structure', () => {
      const state = useFriendsStore.getState();

      expect(state).toHaveProperty('friends');
      expect(state).toHaveProperty('friendRequests');
      expect(state).toHaveProperty('recommendations');
      expect(state).toHaveProperty('activities');
      expect(state).toHaveProperty('onlineFriends');
      expect(state).toHaveProperty('addFriend');
      expect(state).toHaveProperty('removeFriend');
      expect(state).toHaveProperty('sendFriendRequest');
      expect(state).toHaveProperty('acceptFriendRequest');
      expect(state).toHaveProperty('declineFriendRequest');
    });

    it('should start with empty friends list', () => {
      const state = useFriendsStore.getState();

      expect(state.friends).toEqual([]);
      expect(state.recommendations).toHaveLength(2);
    });
  });

  // ============================================================================
  // ADD FRIEND FLOW TESTS
  // ============================================================================

  describe('Add Friend Flow', () => {
    it('should add friend from recommendations', () => {
      const { addFriend } = useFriendsStore.getState();

      addFriend('user-rec-1');

      const state = useFriendsStore.getState();

      expect(state.friends).toHaveLength(1);
      expect(state.friends[0].username).toBe('Luna Maya');
      expect(state.friends[0].userId).toBe('user-rec-1');
    });

    it('should remove added friend from recommendations', () => {
      const { addFriend } = useFriendsStore.getState();

      const initialRecommendations = useFriendsStore.getState().recommendations.length;

      addFriend('user-rec-1');

      const state = useFriendsStore.getState();

      expect(state.recommendations).toHaveLength(initialRecommendations - 1);
      expect(state.recommendations.find((r) => r.userId === 'user-rec-1')).toBeUndefined();
    });

    it('should not add friend if not in recommendations', () => {
      const { addFriend } = useFriendsStore.getState();

      addFriend('non-existent-user');

      const state = useFriendsStore.getState();

      expect(state.friends).toHaveLength(0);
    });
  });

  // ============================================================================
  // REMOVE FRIEND FLOW TESTS
  // ============================================================================

  describe('Remove Friend Flow', () => {
    it('should remove friend from list', () => {
      const { addFriend, removeFriend } = useFriendsStore.getState();

      // Add friend first
      addFriend('user-rec-1');
      expect(useFriendsStore.getState().friends).toHaveLength(1);

      // Remove friend
      removeFriend('user-rec-1');

      const state = useFriendsStore.getState();
      expect(state.friends).toHaveLength(0);
    });

    it('should handle removing non-existent friend', () => {
      const { removeFriend } = useFriendsStore.getState();

      removeFriend('non-existent-user');

      const state = useFriendsStore.getState();
      expect(state.friends).toHaveLength(0);
    });
  });

  // ============================================================================
  // FRIEND REQUESTS FLOW TESTS
  // ============================================================================

  describe('Friend Requests Flow', () => {
    it('should send friend request', () => {
      const { sendFriendRequest } = useFriendsStore.getState();

      sendFriendRequest('user-target-1', 'Hola, seamos amigos!');

      const state = useFriendsStore.getState();

      expect(state.friendRequests).toHaveLength(1);
      expect(state.friendRequests[0].receiverId).toBe('user-target-1');
      expect(state.friendRequests[0].message).toBe('Hola, seamos amigos!');
      expect(state.friendRequests[0].status).toBe('pending');
    });

    it('should accept friend request', () => {
      const { acceptFriendRequest } = useFriendsStore.getState();

      // Setup: Add a pending request
      const mockRequest: FriendRequest = {
        id: 'request-1',
        senderId: 'user-sender-1',
        senderName: 'Nuevo Amigo',
        senderAvatar: '/avatars/nuevo.png',
        senderRank: 'al_mehen',
        senderLevel: 5,
        receiverId: 'current-user',
        sentAt: new Date(),
        status: 'pending',
      };

      useFriendsStore.setState({ friendRequests: [mockRequest] });

      // Accept request
      acceptFriendRequest('request-1');

      const state = useFriendsStore.getState();

      // Should add to friends
      expect(state.friends).toHaveLength(1);
      expect(state.friends[0].username).toBe('Nuevo Amigo');

      // Should remove from requests
      expect(state.friendRequests).toHaveLength(0);
    });

    it('should decline friend request', () => {
      const { declineFriendRequest } = useFriendsStore.getState();

      // Setup: Add a pending request
      const mockRequest: FriendRequest = {
        id: 'request-2',
        senderId: 'user-sender-2',
        senderName: 'Usuario',
        senderAvatar: '/avatars/user.png',
        senderRank: 'al_mehen',
        senderLevel: 3,
        receiverId: 'current-user',
        sentAt: new Date(),
        status: 'pending',
      };

      useFriendsStore.setState({ friendRequests: [mockRequest] });

      // Decline request
      declineFriendRequest('request-2');

      const state = useFriendsStore.getState();

      // Should remove from requests without adding to friends
      expect(state.friendRequests).toHaveLength(0);
      expect(state.friends).toHaveLength(0);
    });

    it('should handle accepting non-existent request', () => {
      const { acceptFriendRequest } = useFriendsStore.getState();

      acceptFriendRequest('non-existent-request');

      const state = useFriendsStore.getState();

      expect(state.friends).toHaveLength(0);
      expect(state.friendRequests).toHaveLength(0);
    });

    it('should send request without message', () => {
      const { sendFriendRequest } = useFriendsStore.getState();

      sendFriendRequest('user-target-2');

      const state = useFriendsStore.getState();

      expect(state.friendRequests).toHaveLength(1);
      expect(state.friendRequests[0].message).toBeUndefined();
    });
  });

  // ============================================================================
  // RECOMMENDATIONS TESTS
  // ============================================================================

  describe('Recommendations', () => {
    it('should filter high-score recommendations', () => {
      const state = useFriendsStore.getState();

      const highScoreRecommendations = state.recommendations.filter((r) => r.score >= 80);

      expect(highScoreRecommendations).toHaveLength(1);
      expect(highScoreRecommendations[0].username).toBe('Luna Maya');
    });

    it('should update recommendations when friend is added', () => {
      const { addFriend } = useFriendsStore.getState();

      const initialCount = useFriendsStore.getState().recommendations.length;

      addFriend('user-rec-1');

      const newCount = useFriendsStore.getState().recommendations.length;

      expect(newCount).toBe(initialCount - 1);
    });
  });

  // ============================================================================
  // ACTIVITIES FLOW TESTS
  // ============================================================================

  describe('Activities Flow', () => {
    it('should praise activity', () => {
      const { praiseActivity } = useFriendsStore.getState();

      // Setup: Add activity
      const mockActivity = {
        id: 'activity-1',
        userId: 'friend-1',
        username: 'Amigo',
        avatar: '/avatars/amigo.png',
        type: 'achievement' as const,
        description: 'Desbloqueó "Maestro de Lectura"',
        timestamp: new Date(),
        praised: false,
      };

      useFriendsStore.setState({ activities: [mockActivity] });

      // Praise activity
      praiseActivity('activity-1');

      const state = useFriendsStore.getState();
      const activity = state.activities.find((a) => a.id === 'activity-1');

      expect(activity?.praised).toBe(true);
    });

    it('should toggle praise on activity', () => {
      const { praiseActivity } = useFriendsStore.getState();

      // Setup: Add activity
      const mockActivity = {
        id: 'activity-2',
        userId: 'friend-2',
        username: 'Amigo 2',
        avatar: '/avatars/amigo2.png',
        type: 'rankup' as const,
        description: 'Subió a rango Ah Kin',
        timestamp: new Date(),
        praised: false,
      };

      useFriendsStore.setState({ activities: [mockActivity] });

      // Praise
      praiseActivity('activity-2');
      expect(useFriendsStore.getState().activities[0].praised).toBe(true);

      // Un-praise
      praiseActivity('activity-2');
      expect(useFriendsStore.getState().activities[0].praised).toBe(false);
    });
  });

  // ============================================================================
  // ONLINE FRIENDS TESTS
  // ============================================================================

  describe('Online Friends', () => {
    it('should track online friends separately', () => {
      const { addFriend } = useFriendsStore.getState();

      // Add friends
      addFriend('user-rec-1');
      addFriend('user-rec-2');

      const state = useFriendsStore.getState();

      expect(state.friends).toHaveLength(2);
      expect(state.onlineFriends).toBeDefined();
    });

    it('should refresh online friends', () => {
      const { refreshFriends } = useFriendsStore.getState();

      refreshFriends();

      const state = useFriendsStore.getState();

      expect(state.onlineFriends).toBeDefined();
      expect(Array.isArray(state.onlineFriends)).toBe(true);
    });
  });
});
