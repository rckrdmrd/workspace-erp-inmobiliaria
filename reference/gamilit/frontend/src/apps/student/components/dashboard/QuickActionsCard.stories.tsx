/**
 * Storybook Stories for QuickActionsCard
 *
 * Este archivo contiene historias visuales del componente QuickActionsCard
 * para demostración y testing visual.
 */

import React from 'react';
import { QuickActionsCard } from './QuickActionsCard';

export default {
  title: 'Student/Dashboard/QuickActionsCard',
  component: QuickActionsCard,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'detective',
      values: [
        { name: 'detective', value: '#FFF7ED' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

/**
 * Historia por defecto: Estado básico del componente
 */
export const Default = () => (
  <div className="max-w-4xl">
    <QuickActionsCard
      onContinueCase={() => console.log('Continuar caso')}
      onViewProgress={() => console.log('Ver progreso')}
      onDailyChallenge={() => console.log('Reto diario')}
    />
  </div>
);

/**
 * Historia con datos personalizados
 */
export const WithCustomData = () => (
  <div className="max-w-4xl">
    <QuickActionsCard
      onContinueCase={() => console.log('Continuar: El Misterio de la Biblioteca')}
      onViewProgress={() => console.log('Ver progreso: 75%')}
      onDailyChallenge={() => console.log('Reto diario disponible')}
      currentCaseTitle="El Misterio de la Biblioteca"
      completionPercentage={75}
      challengeAvailable={true}
    />
  </div>
);

/**
 * Historia con reto diario completado
 */
export const DailyChallengeCompleted = () => (
  <div className="max-w-4xl">
    <QuickActionsCard
      onContinueCase={() => console.log('Continuar caso')}
      onViewProgress={() => console.log('Ver progreso')}
      onDailyChallenge={() => console.log('Reto ya completado')}
      currentCaseTitle="Detective Novato"
      completionPercentage={45}
      challengeAvailable={false}
    />
  </div>
);

/**
 * Historia con progreso completo
 */
export const FullProgress = () => (
  <div className="max-w-4xl">
    <QuickActionsCard
      onContinueCase={() => console.log('Continuar caso')}
      onViewProgress={() => console.log('Ver progreso: 100%')}
      onDailyChallenge={() => console.log('Reto diario')}
      currentCaseTitle="El Código Secreto"
      completionPercentage={100}
      challengeAvailable={true}
    />
  </div>
);

/**
 * Historia con progreso bajo
 */
export const LowProgress = () => (
  <div className="max-w-4xl">
    <QuickActionsCard
      onContinueCase={() => console.log('Continuar caso')}
      onViewProgress={() => console.log('Ver progreso: 5%')}
      onDailyChallenge={() => console.log('Reto diario')}
      currentCaseTitle="Primer Caso"
      completionPercentage={5}
      challengeAvailable={true}
    />
  </div>
);

/**
 * Historia en dispositivo móvil
 */
export const Mobile = () => (
  <div className="max-w-md">
    <QuickActionsCard
      onContinueCase={() => console.log('Continuar caso')}
      onViewProgress={() => console.log('Ver progreso')}
      onDailyChallenge={() => console.log('Reto diario')}
      currentCaseTitle="El Enigma del Parque"
      completionPercentage={60}
      challengeAvailable={true}
    />
  </div>
);

/**
 * Historia mostrando múltiples estados
 */
export const AllStates = () => (
  <div className="space-y-8 max-w-4xl">
    <div>
      <h3 className="text-xl font-bold mb-4">Caso en Progreso + Reto Disponible</h3>
      <QuickActionsCard
        onContinueCase={() => console.log('Continuar caso')}
        onViewProgress={() => console.log('Ver progreso')}
        onDailyChallenge={() => console.log('Reto diario')}
        currentCaseTitle="El Misterio de la Biblioteca"
        completionPercentage={35}
        challengeAvailable={true}
      />
    </div>

    <div>
      <h3 className="text-xl font-bold mb-4">Caso Avanzado + Reto Completado</h3>
      <QuickActionsCard
        onContinueCase={() => console.log('Continuar caso')}
        onViewProgress={() => console.log('Ver progreso')}
        onDailyChallenge={() => console.log('Reto diario')}
        currentCaseTitle="El Detective Experto"
        completionPercentage={85}
        challengeAvailable={false}
      />
    </div>

    <div>
      <h3 className="text-xl font-bold mb-4">Sin Progreso + Reto Disponible</h3>
      <QuickActionsCard
        onContinueCase={() => console.log('Continuar caso')}
        onViewProgress={() => console.log('Ver progreso')}
        onDailyChallenge={() => console.log('Reto diario')}
        currentCaseTitle="Primera Aventura"
        completionPercentage={0}
        challengeAvailable={true}
      />
    </div>
  </div>
);

/**
 * Historia integrada en un dashboard completo
 */
export const InDashboardLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 p-6">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Dashboard del Detective
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Casos Resueltos</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Puntos Totales</p>
                <p className="text-2xl font-bold text-blue-600">450</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Módulos</h2>
            <p className="text-gray-600">Lista de módulos disponibles...</p>
          </div>
        </div>

        {/* Sidebar con Quick Actions */}
        <div className="space-y-6">
          <QuickActionsCard
            onContinueCase={() => alert('Navegando a caso actual...')}
            onViewProgress={() => alert('Navegando a progreso...')}
            onDailyChallenge={() => alert('Iniciando reto diario...')}
            currentCaseTitle="El Caso del Código Secreto"
            completionPercentage={68}
            challengeAvailable={true}
          />

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Misiones</h2>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium">Completa 5 ejercicios</p>
                <p className="text-xs text-gray-600">3/5 completados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Historia de prueba de interacción
 */
export const Interactive = () => {
  const [clicks, setClicks] = React.useState({
    continueCase: 0,
    viewProgress: 0,
    dailyChallenge: 0,
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Click Counters</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Continuar Caso</p>
            <p className="text-2xl font-bold text-orange-600">{clicks.continueCase}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ver Progreso</p>
            <p className="text-2xl font-bold text-blue-600">{clicks.viewProgress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reto Diario</p>
            <p className="text-2xl font-bold text-yellow-600">{clicks.dailyChallenge}</p>
          </div>
        </div>
      </div>

      <QuickActionsCard
        onContinueCase={() => setClicks(prev => ({ ...prev, continueCase: prev.continueCase + 1 }))}
        onViewProgress={() => setClicks(prev => ({ ...prev, viewProgress: prev.viewProgress + 1 }))}
        onDailyChallenge={() => setClicks(prev => ({ ...prev, dailyChallenge: prev.dailyChallenge + 1 }))}
        currentCaseTitle="Caso Interactivo"
        completionPercentage={Math.min((clicks.continueCase * 10), 100)}
        challengeAvailable={clicks.dailyChallenge === 0}
      />
    </div>
  );
};
