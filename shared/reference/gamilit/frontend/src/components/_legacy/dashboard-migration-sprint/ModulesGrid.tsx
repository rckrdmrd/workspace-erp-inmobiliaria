/**
 * ModulesGrid Component
 *
 * ISSUE: #2.1 (P0) - Dashboard Modules Grid
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 + Sprint 1 - Opción B
 *
 * Grid de módulos educativos con progreso y control de acceso
 */

import { useState, useEffect } from 'react';
import { ModuleCard } from './ModuleCard';
import { Loader2, BookOpen, Filter } from 'lucide-react';
import type { Module } from '@/shared/types/educational.types';
import type { ModuleProgress } from '@/shared/types/progress.types';

interface ModulesGridProps {
  modules: Module[];
  userProgress: Record<string, ModuleProgress>;
  onModuleClick: (moduleId: string) => void;
  isLoading?: boolean;
}

/**
 * Grid principal de módulos educativos
 * Muestra todos los módulos disponibles con su progreso
 */
export const ModulesGrid = ({
  modules,
  userProgress,
  onModuleClick,
  isLoading = false
}: ModulesGridProps) => {
  const [filteredModules, setFilteredModules] = useState<Module[]>(modules);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    let filtered = [...modules];

    // Filtro por dificultad
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(m => m.difficulty === selectedDifficulty);
    }

    // Filtro por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(m => {
        const progress = userProgress[m.id];
        return progress?.status === selectedStatus;
      });
    }

    setFilteredModules(filtered);
  }, [modules, selectedDifficulty, selectedStatus, userProgress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Cargando módulos...</span>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No hay módulos disponibles</h3>
        <p className="text-gray-600 mt-2">Los módulos aparecerán aquí cuando estén disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-7 h-7 mr-2 text-purple-600" />
            Módulos Educativos
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredModules.length} módulo{filteredModules.length !== 1 ? 's' : ''} disponible{filteredModules.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          >
            <option value="all">Todas las dificultades</option>
            <option value="very_easy">Muy Fácil</option>
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
            <option value="very_hard">Muy Difícil</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completado</option>
            <option value="locked">Bloqueado</option>
          </select>
        </div>
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={userProgress[module.id]}
            onClick={() => onModuleClick(module.id)}
          />
        ))}
      </div>

      {/* Empty state si no hay resultados filtrados */}
      {filteredModules.length === 0 && modules.length > 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No se encontraron módulos</h3>
          <p className="text-gray-600 mt-2">
            Intenta ajustar los filtros para ver más resultados.
          </p>
          <button
            onClick={() => {
              setSelectedDifficulty('all');
              setSelectedStatus('all');
            }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};
