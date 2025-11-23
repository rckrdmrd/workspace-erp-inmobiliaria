import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, Target, GraduationCap } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';

/**
 * ExerciseGuide Component
 *
 * Displays pedagogical content for exercises in an expandable/collapsible format.
 * Shows: Objective, How to Solve, Recommended Strategy, and Pedagogical Notes.
 *
 * @component
 * @version 1.0.0
 * @since FE-060 (2025-11-19)
 */

interface ExerciseGuideProps {
  /**
   * Objetivo pedagógico expandido del ejercicio (200-500 palabras)
   * Describe qué aprenderá el estudiante y por qué es importante según
   * el modelo de comprensión lectora de Daniel Cassany.
   */
  objective?: string;

  /**
   * Guía detallada de cómo resolver el ejercicio (300-800 palabras)
   * Pasos pedagógicos, estrategias de pensamiento, y consejos para
   * completar exitosamente el ejercicio.
   */
  how_to_solve?: string;

  /**
   * Estrategias recomendadas para resolver eficientemente (100-300 palabras)
   * Tips, trucos, y mejores prácticas para estudiantes.
   */
  recommended_strategy?: string;

  /**
   * Notas metodológicas para educadores (100-400 palabras)
   * Contexto pedagógico, relación con competencias, y alineación con modelo Cassany.
   */
  pedagogical_notes?: string;

  /**
   * Initial expanded state (default: false)
   */
  defaultExpanded?: boolean;

  /**
   * Custom CSS classes
   */
  className?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  content?: string;
  bgColor: string;
  iconColor: string;
}

export const ExerciseGuide: React.FC<ExerciseGuideProps> = ({
  objective,
  how_to_solve,
  recommended_strategy,
  pedagogical_notes,
  defaultExpanded = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Build sections array from available content
  const sections: Section[] = [
    {
      id: 'objective',
      title: 'Objetivo de Aprendizaje',
      icon: Target,
      content: objective,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'how_to_solve',
      title: 'Cómo Resolver',
      icon: BookOpen,
      content: how_to_solve,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'recommended_strategy',
      title: 'Estrategias Recomendadas',
      icon: Lightbulb,
      content: recommended_strategy,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      id: 'pedagogical_notes',
      title: 'Notas Pedagógicas',
      icon: GraduationCap,
      content: pedagogical_notes,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ].filter(section => section.content); // Only show sections with content

  // Don't render if no content available
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-4 flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
        aria-expanded={isExpanded}
        aria-controls="exercise-guide-content"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          <span className="font-semibold text-lg">Guía Pedagógica del Ejercicio</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {sections.length} {sections.length === 1 ? 'sección' : 'secciones'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6" />
        ) : (
          <ChevronDown className="w-6 h-6" />
        )}
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="exercise-guide-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DetectiveCard className={`${section.bgColor} border-l-4 border-${section.iconColor.split('-')[1]}-500`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
                        <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                          {section.title}
                        </h3>
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </DetectiveCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExerciseGuide;
