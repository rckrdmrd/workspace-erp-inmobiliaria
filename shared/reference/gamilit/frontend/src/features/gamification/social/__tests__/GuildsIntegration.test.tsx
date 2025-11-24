/**
 * Guilds Integration Tests
 *
 * Tests for guilds/teams system integrating store with UI flows.
 *
 * Test Coverage:
 * - Store Initialization (2 tests): Initial state, structure
 * - Join Guild Flow (3 tests): Join guild, update state, isInGuild flag
 * - Leave Guild Flow (2 tests): Leave guild, clear members
 * - Create Guild Flow (3 tests): Create new guild, auto-join, default values
 * - Guild Members (2 tests): Members tracking, empty members on leave
 * - Guild Challenges (2 tests): Challenges tracking, structure
 * - Guild Activities (2 tests): Activities tracking, structure
 * - Refresh Guild Data (2 tests): Refresh functionality, state updates
 *
 * Total: 18 tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGuildsStore } from '../store/guildsStore';
import type { Guild, GuildMember } from '../types/guildsTypes';

describe('Guilds Integration Tests', () => {
  // ============================================================================
  // SETUP & MOCK DATA
  // ============================================================================

  const mockGuild1: Guild = {
    id: 'guild-1',
    name: 'Guerreros Maya',
    description: 'Guild de lectores avanzados',
    emblem: 'sword',
    leaderId: 'leader-1',
    memberCount: 25,
    maxMembers: 50,
    level: 5,
    xp: 12500,
    createdAt: new Date('2025-01-01'),
    isPublic: true,
    status: 'recruiting',
    stats: {
      totalExercisesCompleted: 500,
      totalMlCoinsEarned: 15000,
      totalAchievements: 75,
      averageScore: 85,
    },
  };

  const mockGuild2: Guild = {
    id: 'guild-2',
    name: 'Sabios del Conocimiento',
    description: 'Guild de estudiantes dedicados',
    emblem: 'book',
    leaderId: 'leader-2',
    memberCount: 15,
    maxMembers: 30,
    level: 3,
    xp: 5000,
    createdAt: new Date('2025-02-01'),
    isPublic: true,
    status: 'active',
    stats: {
      totalExercisesCompleted: 200,
      totalMlCoinsEarned: 6000,
      totalAchievements: 30,
      averageScore: 78,
    },
  };

  beforeEach(() => {
    // Reset store to initial state
    useGuildsStore.setState({
      allGuilds: [mockGuild1, mockGuild2],
      userGuild: null,
      guildMembers: [],
      guildChallenges: [],
      guildActivities: [],
      isInGuild: false,
    });
  });

  // ============================================================================
  // STORE INITIALIZATION TESTS
  // ============================================================================

  describe('Store Initialization', () => {
    it('should initialize with correct structure', () => {
      const state = useGuildsStore.getState();

      expect(state).toHaveProperty('allGuilds');
      expect(state).toHaveProperty('userGuild');
      expect(state).toHaveProperty('guildMembers');
      expect(state).toHaveProperty('guildChallenges');
      expect(state).toHaveProperty('guildActivities');
      expect(state).toHaveProperty('isInGuild');
      expect(state).toHaveProperty('joinGuild');
      expect(state).toHaveProperty('leaveGuild');
      expect(state).toHaveProperty('createGuild');
      expect(state).toHaveProperty('refreshGuildData');
    });

    it('should start with no user guild', () => {
      const state = useGuildsStore.getState();

      expect(state.userGuild).toBeNull();
      expect(state.isInGuild).toBe(false);
      expect(state.guildMembers).toEqual([]);
    });
  });

  // ============================================================================
  // JOIN GUILD FLOW TESTS
  // ============================================================================

  describe('Join Guild Flow', () => {
    it('should join guild successfully', () => {
      const { joinGuild } = useGuildsStore.getState();

      joinGuild('guild-1');

      const state = useGuildsStore.getState();

      expect(state.userGuild).not.toBeNull();
      expect(state.userGuild?.id).toBe('guild-1');
      expect(state.userGuild?.name).toBe('Guerreros Maya');
    });

    it('should set isInGuild flag to true', () => {
      const { joinGuild } = useGuildsStore.getState();

      expect(useGuildsStore.getState().isInGuild).toBe(false);

      joinGuild('guild-1');

      expect(useGuildsStore.getState().isInGuild).toBe(true);
    });

    it('should not join non-existent guild', () => {
      const { joinGuild } = useGuildsStore.getState();

      joinGuild('non-existent-guild');

      const state = useGuildsStore.getState();

      expect(state.userGuild).toBeNull();
      expect(state.isInGuild).toBe(false);
    });
  });

  // ============================================================================
  // LEAVE GUILD FLOW TESTS
  // ============================================================================

  describe('Leave Guild Flow', () => {
    it('should leave guild and clear user guild', () => {
      const { joinGuild, leaveGuild } = useGuildsStore.getState();

      // Join first
      joinGuild('guild-1');
      expect(useGuildsStore.getState().userGuild).not.toBeNull();

      // Leave
      leaveGuild();

      const state = useGuildsStore.getState();

      expect(state.userGuild).toBeNull();
      expect(state.isInGuild).toBe(false);
    });

    it('should clear guild members when leaving', () => {
      const { joinGuild, leaveGuild } = useGuildsStore.getState();

      // Setup: Add some members
      const mockMembers: GuildMember[] = [
        {
          userId: 'member-1',
          username: 'Member 1',
          avatar: '/avatars/member1.png',
          role: 'member',
          joinedAt: new Date(),
          contributionScore: 100,
          lastActive: new Date(),
          rank: 'Ixim',
          level: 5,
        },
      ];

      joinGuild('guild-1');
      useGuildsStore.setState({ guildMembers: mockMembers });

      expect(useGuildsStore.getState().guildMembers).toHaveLength(1);

      // Leave
      leaveGuild();

      const state = useGuildsStore.getState();

      expect(state.guildMembers).toEqual([]);
    });
  });

  // ============================================================================
  // CREATE GUILD FLOW TESTS
  // ============================================================================

  describe('Create Guild Flow', () => {
    it('should create new guild', () => {
      const { createGuild } = useGuildsStore.getState();

      const initialGuildCount = useGuildsStore.getState().allGuilds.length;

      createGuild({
        name: 'Nueva Guild',
        description: 'Una guild nueva',
        emblem: 'shield',
      });

      const state = useGuildsStore.getState();

      expect(state.allGuilds.length).toBe(initialGuildCount + 1);
      expect(state.allGuilds[initialGuildCount].name).toBe('Nueva Guild');
    });

    it('should auto-join created guild', () => {
      const { createGuild } = useGuildsStore.getState();

      createGuild({
        name: 'Mi Guild',
        description: 'Mi propia guild',
      });

      const state = useGuildsStore.getState();

      expect(state.userGuild).not.toBeNull();
      expect(state.userGuild?.name).toBe('Mi Guild');
      expect(state.isInGuild).toBe(true);
    });

    it('should set default values for new guild', () => {
      const { createGuild } = useGuildsStore.getState();

      createGuild({
        name: 'Test Guild',
      });

      const state = useGuildsStore.getState();
      const newGuild = state.userGuild;

      expect(newGuild?.level).toBe(1);
      expect(newGuild?.xp).toBe(0);
      expect(newGuild?.memberCount).toBe(1);
      expect(newGuild?.maxMembers).toBe(50);
      expect(newGuild?.status).toBe('recruiting');
      expect(newGuild?.leaderId).toBe('current-user');
      expect(newGuild?.stats.totalExercisesCompleted).toBe(0);
    });
  });

  // ============================================================================
  // GUILD MEMBERS TESTS
  // ============================================================================

  describe('Guild Members', () => {
    it('should track guild members', () => {
      const { joinGuild } = useGuildsStore.getState();

      const mockMembers: GuildMember[] = [
        {
          userId: 'member-1',
          username: 'Líder',
          avatar: '/avatars/leader.png',
          role: 'leader',
          joinedAt: new Date(),
          contributionScore: 500,
          lastActive: new Date(),
          rank: "Ah K'in",
          level: 15,
        },
        {
          userId: 'member-2',
          username: 'Oficial',
          avatar: '/avatars/officer.png',
          role: 'officer',
          joinedAt: new Date(),
          contributionScore: 300,
          lastActive: new Date(),
          rank: "Ix K'an",
          level: 12,
        },
      ];

      joinGuild('guild-1');
      useGuildsStore.setState({ guildMembers: mockMembers });

      const state = useGuildsStore.getState();

      expect(state.guildMembers).toHaveLength(2);
      expect(state.guildMembers[0].role).toBe('leader');
      expect(state.guildMembers[1].role).toBe('officer');
    });

    it('should have empty members when not in guild', () => {
      const state = useGuildsStore.getState();

      expect(state.guildMembers).toEqual([]);
    });
  });

  // ============================================================================
  // GUILD CHALLENGES TESTS
  // ============================================================================

  describe('Guild Challenges', () => {
    it('should track guild challenges', () => {
      const { joinGuild } = useGuildsStore.getState();

      const mockChallenge = {
        id: 'challenge-1',
        guildId: 'guild-1',
        title: 'Desafío Semanal',
        description: 'Completar 100 ejercicios',
        type: 'collaborative' as const,
        status: 'active' as const,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        goal: {
          type: 'exercises' as const,
          target: 100,
          current: 35,
        },
        rewards: {
          mlCoins: 1000,
          xp: 500,
          guildXp: 2000,
        },
        participants: ['member-1', 'member-2'],
      };

      joinGuild('guild-1');
      useGuildsStore.setState({ guildChallenges: [mockChallenge] });

      const state = useGuildsStore.getState();

      expect(state.guildChallenges).toHaveLength(1);
      expect(state.guildChallenges[0].title).toBe('Desafío Semanal');
      expect(state.guildChallenges[0].goal.current).toBe(35);
      expect(state.guildChallenges[0].goal.target).toBe(100);
    });

    it('should have correct challenge structure', () => {
      const mockChallenge = {
        id: 'challenge-2',
        guildId: 'guild-1',
        title: 'Competencia de Puntos',
        description: 'Obtener mayor puntuación',
        type: 'competitive' as const,
        status: 'upcoming' as const,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        goal: {
          type: 'score' as const,
          target: 5000,
          current: 0,
        },
        rewards: {
          mlCoins: 2000,
          xp: 1000,
          guildXp: 3000,
        },
        participants: [],
      };

      useGuildsStore.setState({ guildChallenges: [mockChallenge] });

      const state = useGuildsStore.getState();
      const challenge = state.guildChallenges[0];

      expect(challenge.type).toBe('competitive');
      expect(challenge.status).toBe('upcoming');
      expect(challenge.goal.type).toBe('score');
    });
  });

  // ============================================================================
  // GUILD ACTIVITIES TESTS
  // ============================================================================

  describe('Guild Activities', () => {
    it('should track guild activities', () => {
      const mockActivities = [
        {
          id: 'activity-1',
          guildId: 'guild-1',
          userId: 'user-1',
          username: 'Usuario 1',
          type: 'join' as const,
          description: 'Se unió a la guild',
          timestamp: new Date(),
        },
        {
          id: 'activity-2',
          guildId: 'guild-1',
          userId: 'user-2',
          username: 'Usuario 2',
          type: 'achievement' as const,
          description: 'Desbloqueó un logro',
          timestamp: new Date(),
        },
      ];

      useGuildsStore.setState({ guildActivities: mockActivities });

      const state = useGuildsStore.getState();

      expect(state.guildActivities).toHaveLength(2);
      expect(state.guildActivities[0].type).toBe('join');
      expect(state.guildActivities[1].type).toBe('achievement');
    });

    it('should have correct activity types', () => {
      const mockActivity = {
        id: 'activity-3',
        guildId: 'guild-1',
        userId: 'user-3',
        username: 'Usuario 3',
        type: 'levelup' as const,
        description: 'La guild subió de nivel',
        timestamp: new Date(),
      };

      useGuildsStore.setState({ guildActivities: [mockActivity] });

      const state = useGuildsStore.getState();

      expect(state.guildActivities[0].type).toBe('levelup');
    });
  });

  // ============================================================================
  // REFRESH GUILD DATA TESTS
  // ============================================================================

  describe('Refresh Guild Data', () => {
    it('should refresh guild data', () => {
      const { refreshGuildData } = useGuildsStore.getState();

      const initialGuilds = useGuildsStore.getState().allGuilds;

      refreshGuildData();

      const state = useGuildsStore.getState();

      expect(state.allGuilds).toEqual(initialGuilds);
      expect(Array.isArray(state.allGuilds)).toBe(true);
    });

    it('should maintain guild state after refresh', () => {
      const { joinGuild, refreshGuildData } = useGuildsStore.getState();

      joinGuild('guild-1');

      const userGuildBefore = useGuildsStore.getState().userGuild;

      refreshGuildData();

      const userGuildAfter = useGuildsStore.getState().userGuild;

      expect(userGuildAfter).toEqual(userGuildBefore);
    });
  });
});
