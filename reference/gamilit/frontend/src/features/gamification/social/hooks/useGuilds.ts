/**
 * useGuilds Hook
 */

import { useGuildsStore } from '../store/guildsStore';

export const useGuilds = () => {
  const {
    allGuilds,
    userGuild,
    guildMembers,
    guildChallenges,
    guildActivities,
    isInGuild,
    joinGuild,
    leaveGuild,
    createGuild,
    refreshGuildData,
  } = useGuildsStore();

  const getPublicGuilds = () => {
    return allGuilds.filter((g) => g.isPublic);
  };

  const getRecruitingGuilds = () => {
    return allGuilds.filter((g) => g.status === 'recruiting');
  };

  const getActiveChallenges = () => {
    return guildChallenges.filter((c) => c.status === 'active');
  };

  const getGuildLeaders = () => {
    return guildMembers.filter((m) => m.role === 'leader' || m.role === 'officer');
  };

  const canJoinGuild = (guildId: string, userLevel: number = 1, userRank: string = 'Nacom') => {
    const guild = allGuilds.find((g) => g.id === guildId);
    if (!guild || guild.memberCount >= guild.maxMembers) return false;

    if (guild.requirements?.minLevel && userLevel < guild.requirements.minLevel) {
      return false;
    }

    return true;
  };

  return {
    allGuilds,
    userGuild,
    guildMembers,
    guildChallenges,
    guildActivities,
    isInGuild,
    joinGuild,
    leaveGuild,
    createGuild,
    refreshGuildData,
    getPublicGuilds,
    getRecruitingGuilds,
    getActiveChallenges,
    getGuildLeaders,
    canJoinGuild,
  };
};
