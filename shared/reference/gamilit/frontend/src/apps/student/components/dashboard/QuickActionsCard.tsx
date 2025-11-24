import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, BarChart, Zap } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { cn } from '@shared/utils/cn';

export interface QuickActionsCardProps {
  onContinueCase: () => void;
  onViewProgress: () => void;
  onDailyChallenge: () => void;
  currentCaseTitle?: string;
  completionPercentage?: number;
  challengeAvailable?: boolean;
}

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  onClick: () => void;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onContinueCase,
  onViewProgress,
  onDailyChallenge,
  currentCaseTitle = 'Último caso',
  completionPercentage = 0,
  challengeAvailable = true,
}) => {
  const quickActions: QuickAction[] = [
    {
      id: 'continue-case',
      icon: PlayCircle,
      label: 'Continuar Caso',
      sublabel: currentCaseTitle,
      onClick: onContinueCase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      id: 'view-progress',
      icon: BarChart,
      label: 'Ver Progreso',
      sublabel: `${completionPercentage}% completado`,
      onClick: onViewProgress,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'daily-challenge',
      icon: Zap,
      label: 'Reto Diario',
      sublabel: challengeAvailable ? '¡Disponible!' : 'Completado hoy',
      onClick: onDailyChallenge,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  ];

  return (
    <DetectiveCard padding="md" className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-detective-text">
          Acciones Rápidas
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Accesos directos a tus actividades principales
        </p>
      </div>

      {/* Grid Layout - 3 columnas en desktop, 1 en mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              onClick={action.onClick}
              className={cn(
                'flex flex-col items-center justify-center',
                'p-6 rounded-lg border-2 transition-all duration-200',
                action.bgColor,
                action.borderColor,
                'hover:shadow-lg active:shadow-sm',
                'min-h-[140px]',
                // Deshabilitar si el reto diario no está disponible
                action.id === 'daily-challenge' && !challengeAvailable && 'opacity-60'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
              }}
              whileHover={{
                scale: 1.05,
                y: -4,
              }}
              whileTap={{ scale: 0.95 }}
              disabled={action.id === 'daily-challenge' && !challengeAvailable}
            >
              {/* Icon Container con animación de pulso */}
              <motion.div
                className={cn(
                  'mb-3 p-3 rounded-full',
                  action.bgColor,
                  'ring-2',
                  action.borderColor.replace('border-', 'ring-')
                )}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: index * 0.3,
                  ease: 'easeInOut',
                }}
              >
                <Icon className={cn('w-8 h-8', action.color)} />
              </motion.div>

              {/* Label */}
              <span className={cn('text-base font-bold mb-1', action.color)}>
                {action.label}
              </span>

              {/* Sublabel */}
              <span className="text-xs text-gray-600 text-center px-2">
                {action.sublabel}
              </span>

              {/* Badge para indicadores especiales */}
              {action.id === 'daily-challenge' && challengeAvailable && (
                <motion.div
                  className="mt-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'easeInOut',
                  }}
                >
                  ¡Nuevo!
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer informativo opcional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Completa actividades diarias para ganar más recompensas
        </p>
      </div>
    </DetectiveCard>
  );
};
