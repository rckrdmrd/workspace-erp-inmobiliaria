/**
 * LiveLeaderboard Usage Examples
 *
 * This file demonstrates different ways to use the LiveLeaderboard component
 */

import React, { useState } from 'react';
import { LiveLeaderboard, LeaderboardTypeVariant } from './LiveLeaderboard';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export const BasicLeaderboardExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <LiveLeaderboard userId="current-user-id" />
    </div>
  );
};

// ============================================================================
// Example 2: With Custom Initial Type
// ============================================================================

export const CustomTypeLeaderboardExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <LiveLeaderboard
        userId="current-user-id"
        initialType="streak"
      />
    </div>
  );
};

// ============================================================================
// Example 3: With Custom Refresh Settings
// ============================================================================

export const CustomRefreshLeaderboardExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <LiveLeaderboard
        userId="current-user-id"
        autoRefresh={true}
        refreshInterval={60000} // 1 minute
        itemsPerPage={15}
      />
    </div>
  );
};

// ============================================================================
// Example 4: With User Click Handler
// ============================================================================

export const ClickableLeaderboardExample: React.FC = () => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    console.log('Navigating to user profile:', userId);
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <LiveLeaderboard
        userId="current-user-id"
        onUserClick={handleUserClick}
      />
    </div>
  );
};

// ============================================================================
// Example 5: Controlled Type Selection
// ============================================================================

export const ControlledLeaderboardExample: React.FC = () => {
  const [selectedType, setSelectedType] = useState<LeaderboardTypeVariant>('xp');

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* External type selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-bold mb-2">Selecciona un tipo:</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('xp')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'xp' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            XP
          </button>
          <button
            onClick={() => setSelectedType('completion')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'completion' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Completion
          </button>
          <button
            onClick={() => setSelectedType('streak')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'streak' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Streak
          </button>
          <button
            onClick={() => setSelectedType('detective')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'detective' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Detective
          </button>
        </div>
      </div>

      {/* Leaderboard with controlled type */}
      <LiveLeaderboard
        userId="current-user-id"
        initialType={selectedType}
      />
    </div>
  );
};

// ============================================================================
// Example 6: Multiple Leaderboards Side by Side
// ============================================================================

export const MultipleLeaderboardsExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Clasificación XP</h2>
          <LiveLeaderboard
            userId="current-user-id"
            initialType="xp"
            itemsPerPage={10}
            autoRefresh={false}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Clasificación Racha</h2>
          <LiveLeaderboard
            userId="current-user-id"
            initialType="streak"
            itemsPerPage={10}
            autoRefresh={false}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Example 7: With Custom Styling
// ============================================================================

export const StyledLeaderboardExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Tabla de Clasificación Global
          </h1>
          <LiveLeaderboard
            userId="current-user-id"
            className="bg-white rounded-xl overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Example 8: Dashboard Integration
// ============================================================================

export const DashboardLeaderboardExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sidebar - User Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Mis Estadísticas</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">XP Total</p>
              <p className="text-2xl font-bold text-blue-600">12,450</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Completado</p>
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Racha</p>
              <p className="text-2xl font-bold text-orange-600">24 días</p>
            </div>
          </div>
        </div>

        {/* Main Content - Leaderboard */}
        <div className="xl:col-span-2">
          <LiveLeaderboard
            userId="current-user-id"
            initialType="detective"
            itemsPerPage={15}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Example 9: Mobile Optimized
// ============================================================================

export const MobileLeaderboardExample: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <LiveLeaderboard
        userId="current-user-id"
        itemsPerPage={10}
        className="text-sm"
      />
    </div>
  );
};

// ============================================================================
// Example 10: With Analytics Tracking
// ============================================================================

export const AnalyticsLeaderboardExample: React.FC = () => {
  const handleUserClick = (userId: string) => {
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'leaderboard_user_click', {
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }

    console.log('User clicked:', userId);
    // Navigate to profile or show modal
  };

  return (
    <div className="container mx-auto p-6">
      <LiveLeaderboard
        userId="current-user-id"
        onUserClick={handleUserClick}
      />
    </div>
  );
};

// ============================================================================
// Example 11: No Auto-Refresh (Manual Only)
// ============================================================================

export const ManualRefreshLeaderboardExample: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Esta tabla de clasificación solo se actualiza manualmente.
          Haz clic en el botón "Actualizar" para ver los cambios más recientes.
        </p>
      </div>
      <LiveLeaderboard
        userId="current-user-id"
        autoRefresh={false}
      />
    </div>
  );
};

// ============================================================================
// Example 12: With Loading State Handling
// ============================================================================

export const LoadingStateLeaderboardExample: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  React.useEffect(() => {
    // Simulate loading user data
    setTimeout(() => setIsReady(true), 1000);
  }, []);

  if (!isReady) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <LiveLeaderboard userId="current-user-id" />
    </div>
  );
};

// ============================================================================
// Export all examples
// ============================================================================

export const AllExamples = {
  BasicLeaderboardExample,
  CustomTypeLeaderboardExample,
  CustomRefreshLeaderboardExample,
  ClickableLeaderboardExample,
  ControlledLeaderboardExample,
  MultipleLeaderboardsExample,
  StyledLeaderboardExample,
  DashboardLeaderboardExample,
  MobileLeaderboardExample,
  AnalyticsLeaderboardExample,
  ManualRefreshLeaderboardExample,
  LoadingStateLeaderboardExample
};
