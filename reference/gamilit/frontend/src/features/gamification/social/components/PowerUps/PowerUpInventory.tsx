/**
 * PowerUpInventory Component
 *
 * Displays user's power-up inventory with real-time data from backend
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useInventoryManagement } from '@/features/gamification/economy/hooks/useInventoryQuery';
import type { PowerUpType } from '@/features/gamification/economy/api/inventoryAPI';

interface PowerUpCardProps {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  available: number;
  cost: number;
  onUse: () => void;
}

const PowerUpCard: React.FC<PowerUpCardProps> = ({
  type,
  name,
  description,
  icon,
  available,
  cost,
  onUse,
}) => {
  return (
    <div className="bg-white rounded-detective shadow-card p-4 border-2 border-detective-orange/20 hover:border-detective-orange transition-all">
      <div className="flex items-start gap-3">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-detective-lg font-bold text-detective-text">{name}</h3>
          <p className="text-detective-sm text-detective-text-secondary mb-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Package className="w-4 h-4 text-detective-orange" />
              <span className="text-detective-sm font-semibold">
                Disponibles: {available}
              </span>
            </div>
            <button
              onClick={onUse}
              disabled={available <= 0}
              className="px-3 py-1 bg-detective-orange text-white rounded-detective text-detective-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-detective-orange-dark transition-colors"
            >
              Usar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PowerUpInventory: React.FC = () => {
  const { inventory, isLoading, isError, getTotalPowerUps, usePowerUp, isUsing } =
    useInventoryManagement();
  const [selectedType, setSelectedType] = useState<PowerUpType | null>(null);

  const handleUse = (type: PowerUpType) => {
    setSelectedType(type);
    // In a real scenario, you would prompt for exerciseId
    // For now, using a placeholder
    const exerciseId = 'placeholder-exercise-id';
    usePowerUp({ powerupType: type, exerciseId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.Loader className="w-8 h-8 animate-spin text-detective-orange" />
        <span className="ml-3 text-detective-lg text-detective-text-secondary">
          Cargando inventario...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-detective border border-red-200">
        <Icons.AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-detective-lg text-red-700 mb-2">Error al cargar inventario</p>
        <p className="text-detective-base text-red-600">
          Por favor, intenta recargar la página
        </p>
      </div>
    );
  }

  const totalPowerUps = getTotalPowerUps();

  const powerUpsList = [
    {
      type: 'pistas' as PowerUpType,
      name: 'Pistas',
      description: 'Obtén pistas útiles para resolver ejercicios',
      icon: '💡',
      available: inventory?.pistas.available || 0,
      cost: inventory?.pistas.cost || 50,
    },
    {
      type: 'vision_lectora' as PowerUpType,
      name: 'Visión Lectora',
      description: 'Mejora tu comprensión lectora temporalmente',
      icon: '👁️',
      available: inventory?.visionLectora.available || 0,
      cost: inventory?.visionLectora.cost || 100,
    },
    {
      type: 'segunda_oportunidad' as PowerUpType,
      name: 'Segunda Oportunidad',
      description: 'Obtén una segunda oportunidad para intentar el ejercicio',
      icon: '🔄',
      available: inventory?.segundaOportunidad.available || 0,
      cost: inventory?.segundaOportunidad.cost || 150,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-detective-2xl font-bold text-detective-text">Mi Inventario</h2>
        <div className="flex items-center gap-2 bg-detective-bg px-4 py-2 rounded-detective">
          <Icons.Package className="w-5 h-5 text-detective-orange" />
          <span className="font-semibold text-detective-text">
            {totalPowerUps} Power-ups
          </span>
        </div>
      </div>

      {totalPowerUps > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {powerUpsList.map((powerUp) => (
            <PowerUpCard
              key={powerUp.type}
              {...powerUp}
              onUse={() => handleUse(powerUp.type)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-detective shadow-card">
          <Icons.Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-detective-lg text-detective-text-secondary mb-2">
            No tienes power-ups en tu inventario
          </p>
          <p className="text-detective-base text-detective-text-secondary">
            Visita la tienda para comprar power-ups
          </p>
        </div>
      )}

      {isUsing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-detective p-6 shadow-xl">
            <Icons.Loader className="w-8 h-8 animate-spin text-detective-orange mx-auto" />
            <p className="mt-3 text-detective-text">Usando power-up...</p>
          </div>
        </div>
      )}
    </div>
  );
};
