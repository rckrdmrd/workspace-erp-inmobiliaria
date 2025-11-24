import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
} from 'lucide-react';

type ExerciseStatus = 'draft' | 'published' | 'archived';
type ExerciseType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'ordering';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface Exercise {
  id: string;
  title: string;
  module: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  status: ExerciseStatus;
  points: number;
  created_at: string;
  updated_at: string;
  usage_count: number;
}

/**
 * TeacherContentManagement - Gestión de contenido educativo para maestros
 *
 * Permite a los maestros:
 * - Ver módulos y ejercicios existentes
 * - Crear ejercicios personalizados
 * - Clonar y modificar ejercicios
 * - Gestionar preguntas y respuestas
 * - Vista previa de ejercicios
 *
 * @component
 */
export default function TeacherContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<ExerciseStatus | 'all'>('all');

  // Mock data - reemplazar con datos reales del API
  const modules = [
    { id: 'module-1', title: 'Módulo 1: Vida de Marie Curie', exercises: 12 },
    { id: 'module-2', title: 'Módulo 2: Radiactividad', exercises: 10 },
    { id: 'module-3', title: 'Módulo 3: Método Científico', exercises: 8 },
    { id: 'module-4', title: 'Módulo 4: Mujeres en la Ciencia', exercises: 15 },
  ];

  const exercises: Exercise[] = [
    {
      id: 'ex-1',
      title: 'Crucigrama Científico: Elementos',
      module: 'Módulo 1',
      type: 'fill_blank',
      difficulty: 'beginner',
      status: 'published',
      points: 100,
      created_at: '2025-10-10',
      updated_at: '2025-10-15',
      usage_count: 45,
    },
    {
      id: 'ex-2',
      title: 'Selección Múltiple: Descubrimientos',
      module: 'Módulo 1',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      status: 'published',
      points: 120,
      created_at: '2025-10-11',
      updated_at: '2025-10-14',
      usage_count: 38,
    },
    {
      id: 'ex-3',
      title: 'Verdadero/Falso: Biografía Curie',
      module: 'Módulo 1',
      type: 'true_false',
      difficulty: 'beginner',
      status: 'draft',
      points: 80,
      created_at: '2025-10-12',
      updated_at: '2025-10-16',
      usage_count: 0,
    },
  ];

  // Filter exercises
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === 'all' || exercise.module.includes(selectedModule);
    const matchesType = selectedType === 'all' || exercise.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || exercise.status === selectedStatus;

    return matchesSearch && matchesModule && matchesType && matchesStatus;
  });

  const getTypeLabel = (type: ExerciseType): string => {
    const labels: Record<ExerciseType, string> = {
      multiple_choice: 'Opción Múltiple',
      true_false: 'Verdadero/Falso',
      fill_blank: 'Rellenar Espacios',
      matching: 'Emparejar',
      ordering: 'Ordenar',
    };
    return labels[type] || type;
  };

  const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
    const labels: Record<DifficultyLevel, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    const colors: Record<DifficultyLevel, string> = {
      beginner: 'text-green-600 bg-green-100',
      intermediate: 'text-yellow-600 bg-yellow-100',
      advanced: 'text-red-600 bg-red-100',
    };
    return colors[difficulty] || '';
  };

  const getStatusIcon = (status: ExerciseStatus) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'archived':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: ExerciseStatus): string => {
    const labels: Record<ExerciseStatus, string> = {
      published: 'Publicado',
      draft: 'Borrador',
      archived: 'Archivado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-detective-text">Gestión de Contenido</h1>
          <p className="text-detective-text-secondary mt-1">
            Crea y administra ejercicios personalizados para tus estudiantes
          </p>
        </div>
        <DetectiveButton onClick={() => alert('Crear nuevo ejercicio')}>
          <Plus className="w-5 h-5" />
          Nuevo Ejercicio
        </DetectiveButton>
      </div>

      {/* Modules Overview */}
      <DetectiveCard>
        <h2 className="text-xl font-bold text-detective-text mb-4">Módulos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <BookOpen className="w-5 h-5 text-detective-orange" />
                <span className="text-xs text-detective-text-secondary">
                  {module.exercises} ejercicios
                </span>
              </div>
              <h3 className="text-sm font-semibold text-detective-text">{module.title}</h3>
            </div>
          ))}
        </div>
      </DetectiveCard>

      {/* Filters and Search */}
      <DetectiveCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-detective-bg-secondary text-detective-text rounded-lg border border-gray-700 focus:border-detective-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-4 py-2 bg-detective-bg-secondary text-detective-text rounded-lg border border-gray-700 focus:border-detective-orange focus:outline-none"
          >
            <option value="all">Todos los módulos</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-detective-bg-secondary text-detective-text rounded-lg border border-gray-700 focus:border-detective-orange focus:outline-none"
          >
            <option value="all">Todos los tipos</option>
            <option value="multiple_choice">Opción Múltiple</option>
            <option value="true_false">Verdadero/Falso</option>
            <option value="fill_blank">Rellenar Espacios</option>
            <option value="matching">Emparejar</option>
            <option value="ordering">Ordenar</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mt-4">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-detective-orange text-white'
                  : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
              }`}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status as ExerciseStatus)}
            </button>
          ))}
        </div>
      </DetectiveCard>

      {/* Exercises List */}
      <DetectiveCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-detective-text">
            Ejercicios ({filteredExercises.length})
          </h2>
          <div className="flex items-center gap-2 text-sm text-detective-text-secondary">
            <Filter className="w-4 h-4" />
            <span>Filtrado activo</span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-detective-text">
                      {exercise.title}
                    </h3>
                    {getStatusIcon(exercise.status)}
                    <span className="text-xs text-detective-text-secondary">
                      {getStatusLabel(exercise.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-detective-text-secondary">
                    <span>{exercise.module}</span>
                    <span>•</span>
                    <span>{getTypeLabel(exercise.type)}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}
                    >
                      {getDifficultyLabel(exercise.difficulty)}
                    </span>
                    <span>•</span>
                    <span>{exercise.points} puntos</span>
                    <span>•</span>
                    <span>Usado {exercise.usage_count} veces</span>
                  </div>

                  <div className="text-xs text-detective-text-secondary mt-2">
                    Creado: {exercise.created_at} | Actualizado: {exercise.updated_at}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Vista previa: ${exercise.title}`)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Vista previa"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Probar: ${exercise.title}`)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Probar ejercicio"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Editar: ${exercise.title}`)}
                    className="p-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange/90 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Clonar: ${exercise.title}`)}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    title="Clonar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar "${exercise.title}"?`)) {
                        alert('Ejercicio eliminado');
                      }
                    }}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-detective-text-secondary">
                No se encontraron ejercicios
              </p>
              <p className="text-sm text-detective-text-secondary mt-1">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </DetectiveCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DetectiveCard hoverable={false}>
          <div className="text-center">
            <p className="text-3xl font-bold text-detective-text">{exercises.length}</p>
            <p className="text-sm text-detective-text-secondary mt-1">Total Ejercicios</p>
          </div>
        </DetectiveCard>
        <DetectiveCard hoverable={false}>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">
              {exercises.filter((e) => e.status === 'published').length}
            </p>
            <p className="text-sm text-detective-text-secondary mt-1">Publicados</p>
          </div>
        </DetectiveCard>
        <DetectiveCard hoverable={false}>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {exercises.filter((e) => e.status === 'draft').length}
            </p>
            <p className="text-sm text-detective-text-secondary mt-1">Borradores</p>
          </div>
        </DetectiveCard>
        <DetectiveCard hoverable={false}>
          <div className="text-center">
            <p className="text-3xl font-bold text-detective-gold">
              {exercises.reduce((sum, e) => sum + e.usage_count, 0)}
            </p>
            <p className="text-sm text-detective-text-secondary mt-1">Usos Totales</p>
          </div>
        </DetectiveCard>
      </div>
    </div>
  );
}
