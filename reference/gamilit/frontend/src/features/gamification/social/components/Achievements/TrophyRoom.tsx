/**
 * TrophyRoom Component
 * Gallery view of unlocked achievements
 */

import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import { AchievementCard } from './AchievementCard';

export const TrophyRoom: React.FC = () => {
  const { unlockedAchievements, stats } = useAchievements();

  const legendaryAchievements = unlockedAchievements.filter((a) => a.rarity === 'legendary');
  const epicAchievements = unlockedAchievements.filter((a) => a.rarity === 'epic');
  const rareAchievements = unlockedAchievements.filter((a) => a.rarity === 'rare');
  const commonAchievements = unlockedAchievements.filter((a) => a.rarity === 'common');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-detective-orange to-detective-gold p-8 rounded-detective text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-detective-3xl font-bold mb-2">Sala de Trofeos</h1>
            <p className="text-detective-lg opacity-90">
              Tus logros más preciados
            </p>
          </div>
          <Icons.Trophy className="w-20 h-20 opacity-50" />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-detective-3xl font-bold">{legendaryAchievements.length}</p>
            <p className="text-detective-sm opacity-80">Legendarios</p>
          </div>
          <div className="text-center">
            <p className="text-detective-3xl font-bold">{epicAchievements.length}</p>
            <p className="text-detective-sm opacity-80">Épicos</p>
          </div>
          <div className="text-center">
            <p className="text-detective-3xl font-bold">{rareAchievements.length}</p>
            <p className="text-detective-sm opacity-80">Raros</p>
          </div>
          <div className="text-center">
            <p className="text-detective-3xl font-bold">{commonAchievements.length}</p>
            <p className="text-detective-sm opacity-80">Comunes</p>
          </div>
        </div>
      </div>

      {/* Legendary Section */}
      {legendaryAchievements.length > 0 && (
        <div>
          <h2 className="text-detective-2xl font-bold text-detective-text mb-4 flex items-center gap-2">
            <Icons.Crown className="w-6 h-6 text-detective-gold" />
            Legendarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legendaryAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Epic Section */}
      {epicAchievements.length > 0 && (
        <div>
          <h2 className="text-detective-2xl font-bold text-detective-text mb-4 flex items-center gap-2">
            <Icons.Star className="w-6 h-6 text-detective-orange" />
            Épicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {epicAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Rare and Common in tabs or collapsed */}
      {(rareAchievements.length > 0 || commonAchievements.length > 0) && (
        <div>
          <h2 className="text-detective-2xl font-bold text-detective-text mb-4">
            Otros Logros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...rareAchievements, ...commonAchievements].map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {unlockedAchievements.length === 0 && (
        <div className="text-center py-12">
          <Icons.Trophy className="w-24 h-24 text-gray-200 mx-auto mb-4" />
          <p className="text-detective-xl text-detective-text-secondary">
            Aún no has desbloqueado ningún logro
          </p>
          <p className="text-detective-base text-detective-text-secondary mt-2">
            Completa ejercicios para comenzar tu colección
          </p>
        </div>
      )}
    </div>
  );
};
