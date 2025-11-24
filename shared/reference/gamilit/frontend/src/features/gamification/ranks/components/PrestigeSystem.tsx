/**
 * PrestigeSystem Component
 *
 * Prestige interface with confirmation modal and benefits preview.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, RefreshCw, AlertCircle, Check, X } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { useRanksStore } from '../store/ranksStore';
import { getPrestigeBonusByLevel } from '../mockData/ranksMockData';
import { PrestigeStarIcon } from './MayaIconography';

export interface PrestigeSystemProps {
  className?: string;
}

/**
 * PrestigeSystem Component
 */
export const PrestigeSystem: React.FC<PrestigeSystemProps> = ({ className = '' }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const userProgress = useRanksStore(state => state.userProgress);
  const prestigeProgress = useRanksStore(state => state.prestigeProgress);
  const canPrestige = useRanksStore(state => state.canPrestige);
  const prestige = useRanksStore(state => state.prestige);

  const nextPrestigeLevel = prestigeProgress.level + 1;
  const nextPrestigeBonus = getPrestigeBonusByLevel(nextPrestigeLevel);

  const handlePrestige = async () => {
    await prestige();
    setShowConfirmModal(false);
  };

  // Check eligibility
  const isEligible = canPrestige();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Prestige Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-8 h-8 text-amber-500" />
          <h2 className="text-3xl font-bold text-detective-text">
            Sistema de Prestige
          </h2>
        </div>
        <p className="text-detective-text-secondary max-w-2xl mx-auto">
          Al alcanzar el rango K'uk'ulkan, puedes prestigiar para reiniciar tu progresión
          con bonuses permanentes y recompensas exclusivas.
        </p>
      </div>

      {/* Current Prestige Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-detective-text">
            Prestige Actual
          </h3>
          <div className="flex items-center gap-1">
            {Array.from({ length: prestigeProgress.level }, (_, i) => (
              <PrestigeStarIcon key={i} size={20} className="text-amber-500" />
            ))}
            {prestigeProgress.level === 0 && (
              <span className="text-detective-text-secondary">Sin prestige</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-detective-text">
              {prestigeProgress.level}
            </div>
            <div className="text-xs text-detective-text-secondary">
              Nivel de Prestige
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-600">
              +{(prestigeProgress.cumulativeMultiplier * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-detective-text-secondary">
              Bonus Acumulado
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-detective-text">
              {prestigeProgress.totalPrestiges}
            </div>
            <div className="text-xs text-detective-text-secondary">
              Veces Prestigiado
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-detective-text">
              {prestigeProgress.totalXPAllTime.toLocaleString()}
            </div>
            <div className="text-xs text-detective-text-secondary">
              XP Total
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Prestige Preview */}
      {nextPrestigeBonus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-detective-text">
                Prestige Nivel {nextPrestigeLevel}
              </h3>
              <p className="text-sm text-detective-text-secondary">
                Beneficios al prestigiar
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bonus Multiplier */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                +{(nextPrestigeBonus.bonusMultiplier * 100).toFixed(0)}%
              </div>
              <div>
                <div className="font-semibold text-detective-text">
                  Multiplicador Permanente
                </div>
                <div className="text-sm text-detective-text-secondary">
                  Se aplica a todas las ganancias de XP y ML Coins
                </div>
              </div>
            </div>

            {/* Unlocked Features */}
            {nextPrestigeBonus.unlockedFeatures.length > 0 && (
              <div>
                <h4 className="font-semibold text-detective-text mb-2">
                  Características Desbloqueadas
                </h4>
                <ul className="space-y-1">
                  {nextPrestigeBonus.unlockedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cosmetics */}
            {nextPrestigeBonus.cosmetics.length > 0 && (
              <div>
                <h4 className="font-semibold text-detective-text mb-2">
                  Cosméticos Exclusivos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {nextPrestigeBonus.cosmetics.map((cosmetic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                    >
                      {cosmetic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Prestige Button */}
      <div className="flex flex-col items-center gap-4">
        {!isEligible && (
          <div className="flex items-center gap-2 text-detective-text-secondary">
            <AlertCircle className="w-5 h-5" />
            <span>
              Debes alcanzar el rango K'uk'ulkan y nivel 50 para prestigiar
            </span>
          </div>
        )}
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={!isEligible}
          className={cn(
            'px-8 py-4 rounded-xl font-bold text-lg transition-all',
            isEligible
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Prestigiar Ahora
          </span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-detective-text mb-2">
                  ¿Confirmar Prestige?
                </h3>
                <p className="text-detective-text-secondary">
                  Tu progreso actual se reiniciará al rango NACOM nivel 1,
                  pero mantendrás todos los bonuses permanentes.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <div className="font-semibold text-detective-text">
                  Lo que mantendrás:
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Bonus de multiplicador permanente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Racha de actividad actual</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Cosméticos y características desbloqueadas</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePrestige}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
