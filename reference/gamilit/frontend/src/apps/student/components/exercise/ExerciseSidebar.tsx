/**
 * ExerciseSidebar Component
 * Collapsible sidebar with power-ups, hints, progress, and stats
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { usePowerUps } from '@/features/gamification/social/hooks/usePowerUps';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Star,
  Coins,
  Clock,
  Target,
  Award,
} from 'lucide-react';
import type { PowerUp } from '@/features/gamification/social/types/powerUpsTypes';
import type { ExerciseAttempt } from '@/apps/student/hooks/useExerciseState';

interface ExerciseSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  availableCoins: number;
  currentScore: number;
  timeElapsed: number;
  hintsUsed: number;
  attempts: ExerciseAttempt[];
  bestScore: number;
  onOpenHints: () => void;
  onUsePowerUp: (powerUpId: string) => void;
  className?: string;
}

export const ExerciseSidebar: React.FC<ExerciseSidebarProps> = ({
  isOpen,
  onToggle,
  availableCoins,
  currentScore,
  timeElapsed,
  hintsUsed,
  attempts,
  bestScore,
  onOpenHints,
  onUsePowerUp,
  className = '',
}) => {
  const { getAvailablePowerUps, getActivePowerUps, usePowerUp } = usePowerUps();
  const [activeTab, setActiveTab] = useState<'powerups' | 'hints' | 'progress' | 'stats'>('powerups');

  const availablePowerUps = getAvailablePowerUps();
  const activePowerUps = getActivePowerUps();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUsePowerUp = (powerUpId: string) => {
    usePowerUp(powerUpId);
    onUsePowerUp(powerUpId);
  };

  const tabs = [
    { id: 'powerups', label: 'Power-ups', icon: Zap },
    { id: 'hints', label: 'Pistas', icon: Lightbulb },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <>
      {/* Toggle Button - Mobile */}
      <motion.button
        onClick={onToggle}
        className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-detective-orange text-white p-3 rounded-l-detective shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed lg:sticky top-0 right-0 h-screen lg:h-auto
              w-80 lg:w-full bg-white dark:bg-gray-800
              shadow-2xl lg:shadow-none z-30 overflow-y-auto
              ${className}
            `}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-detective-orange to-detective-gold p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Panel Lateral</h2>
                <button
                  onClick={onToggle}
                  className="lg:hidden text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* ML Coins Display */}
              <div className="flex items-center gap-2 bg-white/20 rounded-detective px-4 py-2">
                <Coins className="w-5 h-5 text-white" />
                <span className="text-white font-bold">{availableCoins} ML Coins</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-gray-100 dark:bg-gray-900">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      p-3 rounded-detective text-xs font-semibold transition-all
                      ${
                        activeTab === tab.id
                          ? 'bg-detective-orange text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-detective-text-secondary hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Power-ups Tab */}
              {activeTab === 'powerups' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-bold text-detective-text uppercase tracking-wide">
                    Power-ups Disponibles
                  </h3>

                  {/* Active Power-ups */}
                  {activePowerUps.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-detective-text-secondary font-semibold">ACTIVOS</p>
                      {activePowerUps.map((powerUp) => (
                        <div
                          key={powerUp.powerUpId}
                          className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-detective p-3"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-detective-text">
                              {powerUp.name}
                            </span>
                          </div>
                          <p className="text-xs text-detective-text-secondary">
                            {Math.floor(powerUp.remainingTime / 60)}m {powerUp.remainingTime % 60}s
                            restantes
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available Power-ups */}
                  {availablePowerUps.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-detective-text-secondary font-semibold">
                        DISPONIBLES
                      </p>
                      {availablePowerUps.map((powerUp) => (
                        <motion.div
                          key={powerUp.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white dark:bg-gray-900 border-2 border-detective-orange rounded-detective p-3"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <Zap className="w-5 h-5 text-detective-orange flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-detective-text">
                                {powerUp.name}
                              </p>
                              <p className="text-xs text-detective-text-secondary">
                                {powerUp.description}
                              </p>
                            </div>
                          </div>
                          <DetectiveButton
                            variant="primary"

                            onClick={() => handleUsePowerUp(powerUp.id)}
                            className="w-full"
                            disabled={powerUp.status !== 'available'}
                          >
                            Usar Power-up
                          </DetectiveButton>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-detective-text-secondary italic text-center py-4">
                      No tienes power-ups disponibles
                    </p>
                  )}
                </motion.div>
              )}

              {/* Hints Tab */}
              {activeTab === 'hints' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-bold text-detective-text uppercase tracking-wide">
                    Sistema de Pistas
                  </h3>

                  <DetectiveCard variant="gold" padding="md">
                    <div className="text-center space-y-3">
                      <Lightbulb className="w-12 h-12 text-detective-gold mx-auto" />
                      <p className="text-sm text-detective-text">
                        ¿Necesitas ayuda? Usa pistas para avanzar en el ejercicio
                      </p>
                      <DetectiveButton
                        variant="gold"

                        onClick={onOpenHints}
                        icon={<Lightbulb className="w-4 h-4" />}
                        className="w-full"
                      >
                        Ver Pistas
                      </DetectiveButton>
                      <p className="text-xs text-detective-text-secondary">
                        Pistas usadas: {hintsUsed}
                      </p>
                    </div>
                  </DetectiveCard>
                </motion.div>
              )}

              {/* Progress Tab */}
              {activeTab === 'progress' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-bold text-detective-text uppercase tracking-wide">
                    Intentos Anteriores
                  </h3>

                  {attempts.length > 0 ? (
                    <div className="space-y-2">
                      {attempts.map((attempt, index) => (
                        <DetectiveCard key={attempt.id} variant="default" padding="sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-detective-text-secondary">
                              Intento {index + 1}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                attempt.completed
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {attempt.completed ? 'Completado' : 'Incompleto'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-detective-text-secondary">Puntuación</p>
                              <p className="font-bold text-detective-text">{attempt.score}</p>
                            </div>
                            <div>
                              <p className="text-detective-text-secondary">Tiempo</p>
                              <p className="font-bold text-detective-text">
                                {formatTime(attempt.time_spent)}
                              </p>
                            </div>
                          </div>
                        </DetectiveCard>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-detective-text-secondary italic text-center py-4">
                      Aún no hay intentos registrados
                    </p>
                  )}
                </motion.div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-bold text-detective-text uppercase tracking-wide">
                    Estadísticas
                  </h3>

                  <div className="space-y-3">
                    {/* Current Score */}
                    <DetectiveCard variant="default" padding="md">
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-detective-orange" />
                        <div>
                          <p className="text-xs text-detective-text-secondary">Puntuación Actual</p>
                          <p className="text-2xl font-bold text-detective-text">{currentScore}</p>
                        </div>
                      </div>
                    </DetectiveCard>

                    {/* Best Score */}
                    <DetectiveCard variant="gold" padding="md">
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-detective-gold" />
                        <div>
                          <p className="text-xs text-detective-text-secondary">Mejor Puntuación</p>
                          <p className="text-2xl font-bold text-detective-text">{bestScore}</p>
                        </div>
                      </div>
                    </DetectiveCard>

                    {/* Time */}
                    <DetectiveCard variant="default" padding="md">
                      <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-detective-blue" />
                        <div>
                          <p className="text-xs text-detective-text-secondary">Tiempo</p>
                          <p className="text-2xl font-bold text-detective-text">
                            {formatTime(timeElapsed)}
                          </p>
                        </div>
                      </div>
                    </DetectiveCard>

                    {/* Hints Used */}
                    <DetectiveCard variant="default" padding="md">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-8 h-8 text-detective-gold" />
                        <div>
                          <p className="text-xs text-detective-text-secondary">Pistas Usadas</p>
                          <p className="text-2xl font-bold text-detective-text">{hintsUsed}</p>
                        </div>
                      </div>
                    </DetectiveCard>

                    {/* Total Attempts */}
                    <DetectiveCard variant="default" padding="md">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-detective-orange" />
                        <div>
                          <p className="text-xs text-detective-text-secondary">Total Intentos</p>
                          <p className="text-2xl font-bold text-detective-text">{attempts.length}</p>
                        </div>
                      </div>
                    </DetectiveCard>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};
