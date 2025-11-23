/**
 * FriendsPage - Social Friends Management
 *
 * Features:
 * - Friends list with avatars and stats
 * - Friend requests (sent/received)
 * - Search users to add as friends
 * - Online status indicator
 * - Friend activities feed
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  UserCheck,
  UserX,
  Clock,
  Activity,
  Trophy,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

// Components
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { RankBadge } from '@shared/components/base/RankBadge';

// Hooks & Store
import { useFriends } from '@/features/gamification/social/hooks/useFriends';
import { useUserGamification } from '@shared/hooks/useUserGamification';

// Utils
import { cn } from '@shared/utils/cn';

type TabType = 'friends' | 'requests' | 'search' | 'activities';

export default function FriendsPage() {
  const navigate = useNavigate();

  // Hooks
  const {
    friends,
    recommendations,
    activities,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    praiseActivity,
    getOnlineCount,
    getTotalFriends,
    getPendingRequests,
  } = useFriends();

  // Local State
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Filter friends based on search and online status
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnline = !showOnlineOnly || friend.isOnline;
    return matchesSearch && matchesOnline;
  });

  // Get pending requests
  const pendingRequests = getPendingRequests();

  // Format last active time
  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Handle friend request
  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
    // Show success notification
  };

  const handleAcceptRequest = async (requestId: string) => {
    await acceptFriendRequest(requestId);
  };

  const handleDeclineRequest = async (requestId: string) => {
    await declineFriendRequest(requestId);
  };

  const handleRemoveFriend = async (userId: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      await removeFriend(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <GamifiedHeader
        user={user ?? undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      <main className="detective-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-detective-text mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-detective-orange" />
            Friends & Social
          </h1>
          <p className="text-detective-text-secondary">
            Connect with fellow detectives and track your friends' progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <DetectiveCard hoverable={false}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-detective-blue/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-detective-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-detective-text">{getTotalFriends()}</p>
                <p className="text-sm text-detective-text-secondary">Total Friends</p>
              </div>
            </div>
          </DetectiveCard>

          <DetectiveCard hoverable={false}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-detective-text">{getOnlineCount()}</p>
                <p className="text-sm text-detective-text-secondary">Online Now</p>
              </div>
            </div>
          </DetectiveCard>

          <DetectiveCard hoverable={false}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-detective-orange/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-detective-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold text-detective-text">{pendingRequests.length}</p>
                <p className="text-sm text-detective-text-secondary">Pending Requests</p>
              </div>
            </div>
          </DetectiveCard>

          <DetectiveCard hoverable={false}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-detective-text">{recommendations.length}</p>
                <p className="text-sm text-detective-text-secondary">Recommendations</p>
              </div>
            </div>
          </DetectiveCard>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'friends' as TabType, label: 'My Friends', icon: Users, count: friends.length },
            { id: 'requests' as TabType, label: 'Requests', icon: UserPlus, count: pendingRequests.length },
            { id: 'search' as TabType, label: 'Find Friends', icon: Search, count: 0 },
            { id: 'activities' as TabType, label: 'Activity Feed', icon: Activity, count: activities.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-detective-orange text-white shadow-lg'
                    : 'bg-white text-detective-text hover:bg-detective-bg'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    isActive ? 'bg-white/20' : 'bg-detective-orange text-white'
                  )}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Friends List Tab */}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search and Filter */}
              <DetectiveCard hoverable={false} className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-detective-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlineOnly}
                      onChange={(e) => setShowOnlineOnly(e.target.checked)}
                      className="w-4 h-4 text-detective-orange focus:ring-detective-orange rounded"
                    />
                    <span className="text-detective-text font-medium">Online Only</span>
                  </label>
                </div>
              </DetectiveCard>

              {/* Friends Grid */}
              {filteredFriends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFriends.map((friend, index) => (
                    <motion.div
                      key={friend.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DetectiveCard>
                        <div className="space-y-3">
                          {/* Friend Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-detective-orange to-detective-gold rounded-full flex items-center justify-center">
                                  <span className="text-white text-lg font-bold">
                                    {friend.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                {friend.isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-detective-text">{friend.username}</h3>
                                <p className="text-xs text-detective-text-secondary">
                                  {friend.isOnline ? 'Online' : formatLastActive(friend.lastActive)}
                                </p>
                              </div>
                            </div>
                            <RankBadge rank={friend.rank} showIcon={false} />
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-detective-bg rounded-lg">
                              <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                              <p className="text-sm font-bold text-detective-text">Lvl {friend.level}</p>
                            </div>
                            <div className="text-center p-2 bg-detective-bg rounded-lg">
                              <Zap className="w-4 h-4 text-detective-orange mx-auto mb-1" />
                              <p className="text-sm font-bold text-detective-text">{friend.xp}</p>
                            </div>
                            <div className="text-center p-2 bg-detective-bg rounded-lg">
                              <Trophy className="w-4 h-4 text-detective-gold mx-auto mb-1" />
                              <p className="text-sm font-bold text-detective-text">{friend.mlCoins}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {/* Navigate to profile */}}
                              className="flex-1 px-3 py-2 bg-detective-blue text-white rounded-lg hover:bg-detective-blue-dark transition-colors text-sm font-medium"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleRemoveFriend(friend.userId)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </DetectiveCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <DetectiveCard hoverable={false}>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-detective-text-secondary/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-detective-text mb-2">No Friends Found</h3>
                    <p className="text-detective-text-secondary mb-4">
                      {searchQuery ? 'Try a different search term' : 'Start connecting with fellow detectives!'}
                    </p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="px-6 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium"
                    >
                      Find Friends
                    </button>
                  </div>
                </DetectiveCard>
              )}
            </motion.div>
          )}

          {/* Friend Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <DetectiveCard key={request.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              {request.senderName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-detective-text text-lg">{request.senderName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <RankBadge rank={request.senderRank} showIcon={false} />
                              <span className="text-sm text-detective-text-secondary">Level {request.senderLevel}</span>
                            </div>
                            {request.message && (
                              <p className="text-sm text-detective-text-secondary mt-2">"{request.message}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                          >
                            <UserX className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    </DetectiveCard>
                  ))}
                </div>
              ) : (
                <DetectiveCard hoverable={false}>
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-detective-text-secondary/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-detective-text mb-2">No Pending Requests</h3>
                    <p className="text-detective-text-secondary">
                      You don't have any friend requests at the moment.
                    </p>
                  </div>
                </DetectiveCard>
              )}
            </motion.div>
          )}

          {/* Find Friends Tab */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search Input */}
              <DetectiveCard hoverable={false} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-detective-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange text-lg"
                  />
                </div>
              </DetectiveCard>

              {/* Recommendations */}
              <h2 className="text-2xl font-bold text-detective-text mb-4">Recommended Friends</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <DetectiveCard key={rec.userId}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-detective-blue to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {rec.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-detective-text">{rec.username}</h3>
                          <RankBadge rank={rec.rank} showIcon={false} />
                        </div>
                      </div>

                      <p className="text-sm text-detective-text-secondary">{rec.reason}</p>

                      {rec.mutualFriends > 0 && (
                        <p className="text-xs text-detective-text-secondary">
                          {rec.mutualFriends} mutual friend{rec.mutualFriends > 1 ? 's' : ''}
                        </p>
                      )}

                      <button
                        onClick={() => handleSendRequest(rec.userId)}
                        className="w-full px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Friend
                      </button>
                    </div>
                  </DetectiveCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <DetectiveCard key={activity.id} hoverable={false}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-detective-orange to-detective-gold rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {activity.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-detective-text">
                              <span className="font-bold">{activity.username}</span> {activity.description}
                            </p>
                            <p className="text-xs text-detective-text-secondary">
                              {formatLastActive(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => praiseActivity(activity.id)}
                          className={cn(
                            'px-3 py-2 rounded-lg transition-colors',
                            activity.praised
                              ? 'bg-detective-gold text-white'
                              : 'bg-detective-bg text-detective-text hover:bg-detective-gold hover:text-white'
                          )}
                        >
                          <Trophy className="w-5 h-5" />
                        </button>
                      </div>
                    </DetectiveCard>
                  ))}
                </div>
              ) : (
                <DetectiveCard hoverable={false}>
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-detective-text-secondary/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-detective-text mb-2">No Activities Yet</h3>
                    <p className="text-detective-text-secondary">
                      Friend activities will appear here when they complete exercises and unlock achievements.
                    </p>
                  </div>
                </DetectiveCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
