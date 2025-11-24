/**
 * useFriends Hook
 */

import { useFriendsStore } from '../store/friendsStore';

export const useFriends = () => {
  const {
    friends,
    friendRequests,
    recommendations,
    activities,
    onlineFriends,
    addFriend,
    removeFriend,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    praiseActivity,
    refreshFriends,
  } = useFriendsStore();

  const getPendingRequests = () => {
    return friendRequests.filter((r) => r.status === 'pending');
  };

  const getTopRecommendations = (limit: number = 5) => {
    return recommendations.slice(0, limit);
  };

  const getRecentActivities = (limit: number = 10) => {
    return activities.slice(0, limit);
  };

  const getFriendById = (userId: string) => {
    return friends.find((f) => f.userId === userId);
  };

  const getOnlineCount = () => {
    return onlineFriends.length;
  };

  const getTotalFriends = () => {
    return friends.length;
  };

  return {
    friends,
    friendRequests,
    recommendations,
    activities,
    onlineFriends,
    addFriend,
    removeFriend,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    praiseActivity,
    refreshFriends,
    getPendingRequests,
    getTopRecommendations,
    getRecentActivities,
    getFriendById,
    getOnlineCount,
    getTotalFriends,
  };
};
