/**
 * Guilds Store
 */

import { create } from 'zustand';
import type { Guild, GuildMember, GuildChallenge, GuildActivity } from '../types/guildsTypes';
import {
  guildsMockData,
  getUserGuild,
  guildMembersMockData,
  guildChallengesMockData,
  guildActivitiesMockData
} from '../mockData/guildsMockData';

interface GuildsStore {
  allGuilds: Guild[];
  userGuild: Guild | null;
  guildMembers: GuildMember[];
  guildChallenges: GuildChallenge[];
  guildActivities: GuildActivity[];
  isInGuild: boolean;

  joinGuild: (guildId: string) => void;
  leaveGuild: () => void;
  createGuild: (guild: Partial<Guild>) => void;
  refreshGuildData: () => void;
}

export const useGuildsStore = create<GuildsStore>((set) => ({
  allGuilds: guildsMockData,
  userGuild: getUserGuild() || null,
  guildMembers: guildMembersMockData,
  guildChallenges: guildChallengesMockData,
  guildActivities: guildActivitiesMockData,
  isInGuild: !!getUserGuild(),

  joinGuild: (guildId: string) => {
    set((state) => {
      const guild = state.allGuilds.find((g) => g.id === guildId);
      if (!guild) return state;

      return {
        userGuild: guild,
        isInGuild: true,
      };
    });
  },

  leaveGuild: () => {
    set({
      userGuild: null,
      isInGuild: false,
      guildMembers: [],
    });
  },

  createGuild: (guildData: Partial<Guild>) => {
    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name: guildData.name || 'New Guild',
      description: guildData.description || '',
      emblem: guildData.emblem || 'shield',
      leaderId: 'current-user',
      memberCount: 1,
      maxMembers: 50,
      level: 1,
      xp: 0,
      createdAt: new Date(),
      isPublic: guildData.isPublic ?? true,
      status: 'recruiting',
      stats: {
        totalExercisesCompleted: 0,
        totalMlCoinsEarned: 0,
        totalAchievements: 0,
        averageScore: 0,
      },
    };

    set((state) => ({
      allGuilds: [...state.allGuilds, newGuild],
      userGuild: newGuild,
      isInGuild: true,
    }));
  },

  refreshGuildData: () => {
    set((state) => ({
      allGuilds: [...state.allGuilds],
    }));
  },
}));
