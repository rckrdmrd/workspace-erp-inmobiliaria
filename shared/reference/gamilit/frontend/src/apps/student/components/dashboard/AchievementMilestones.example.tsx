import React from 'react';
import { AchievementMilestones } from './AchievementMilestones';

/**
 * Ejemplo de uso del componente AchievementMilestones
 *
 * Este archivo muestra cómo usar el componente con datos de ejemplo
 */

// Datos de ejemplo
const exampleMilestones = [
  {
    id: 'milestone-1',
    title: 'Primera Semana Completa',
    description: 'Completa 5 casos en una semana',
    progress: 3,
    total: 5,
    completed: false,
    reward: {
      xp: 100,
      mlCoins: 50,
    },
    icon: 'target' as const,
  },
  {
    id: 'milestone-2',
    title: 'Detective Experto',
    description: 'Alcanza 1000 puntos de experiencia',
    progress: 750,
    total: 1000,
    completed: false,
    reward: {
      xp: 200,
      mlCoins: 100,
    },
    icon: 'trophy' as const,
  },
  {
    id: 'milestone-3',
    title: 'Racha de Fuego',
    description: 'Mantén una racha de 7 días',
    progress: 7,
    total: 7,
    completed: true,
    reward: {
      xp: 150,
      mlCoins: 75,
    },
    icon: 'star' as const,
  },
];

// Ejemplo con milestones vacíos
const emptyMilestones: any[] = [];

export const AchievementMilestonesExample: React.FC = () => {
  return (
    <div className="space-y-8 p-8 bg-gray-100 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Ejemplo 1: Con 3 Milestones
        </h1>
        <AchievementMilestones milestones={exampleMilestones} />
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">
          Ejemplo 2: Sin Milestones (Estado Vacío)
        </h1>
        <AchievementMilestones milestones={emptyMilestones} />
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">
          Ejemplo 3: Con 1 Solo Milestone
        </h1>
        <AchievementMilestones milestones={[exampleMilestones[0]]} />
      </div>
    </div>
  );
};

export default AchievementMilestonesExample;

/**
 * USO EN TU DASHBOARD:
 *
 * import { AchievementMilestones } from './components/dashboard';
 *
 * function Dashboard() {
 *   const milestones = [
 *     // tus datos de milestones aquí
 *   ];
 *
 *   return (
 *     <div>
 *       <AchievementMilestones milestones={milestones} />
 *     </div>
 *   );
 * }
 */
