/**
 * UnderConstructionExercise Component
 *
 * GAP-005 Resolution - Component for exercises in backlog modules
 * FECHA: 2025-11-23
 * ARCHITECTURE-ANALYST
 *
 * Displays a user-friendly "Under Construction" message for exercises
 * that are designed but not yet implemented (backlog status).
 */

import React from 'react';
import { Construction, Calendar, Lightbulb, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ExerciseData {
  id?: string;
  title?: string;
  type?: string;
  moduleTitle?: string;
  description?: string;
}

interface UnderConstructionExerciseProps {
  exercise?: ExerciseData;
  exerciseTitle?: string;
  moduleName?: string;
  exerciseType?: string;
  estimatedAvailability?: string;
  // Optional props to maintain compatibility with Exercise component interface
  onComplete?: () => void;
  onProgressUpdate?: (update: any) => void;
  actionsRef?: React.MutableRefObject<any>;
}

export const UnderConstructionExercise: React.FC<UnderConstructionExerciseProps> = ({
  exercise,
  exerciseTitle,
  moduleName,
  exerciseType,
  estimatedAvailability = 'próximamente',
}) => {
  const navigate = useNavigate();

  // Use exercise data if provided, otherwise use direct props
  const title = exerciseTitle || exercise?.title || 'Este ejercicio';
  const module = moduleName || exercise?.moduleTitle || 'este módulo';
  const type = exerciseType || exercise?.type || 'ejercicio';

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200">
          {/* Header with Construction Theme */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-white bg-opacity-20 p-6 rounded-full backdrop-blur-sm">
                <Construction className="w-16 h-16" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-center mb-2">
              🚧 Ejercicio En Construcción
            </h1>
            <p className="text-center text-amber-50 text-lg">
              {title}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Main Message */}
            <div className="text-center space-y-3">
              <p className="text-xl text-gray-700 leading-relaxed">
                Este ejercicio de <span className="font-semibold text-amber-600">{module}</span> está
                actualmente en desarrollo y estará disponible {estimatedAvailability}.
              </p>
            </div>

            {/* Info Boxes */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {/* What's Coming */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      ¿Qué viene?
                    </h3>
                    <p className="text-sm text-blue-800">
                      Nuevos ejercicios interactivos de lectura digital y producción de textos
                      basados en Marie Curie.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Estimated Date */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">
                      Disponibilidad
                    </h3>
                    <p className="text-sm text-purple-800">
                      Los módulos 4 y 5 se encuentran fuera del alcance de entrega actual.
                      Se liberarán en futuras actualizaciones.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Current Modules Available */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mt-6">
              <h3 className="font-semibold text-green-900 mb-3 text-center">
                ✅ Módulos Disponibles Ahora
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Módulo 1:</strong> Comprensión Literal</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Módulo 2:</strong> Comprensión Inferencial</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Módulo 3:</strong> Comprensión Crítica y Valorativa</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a Módulos
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-600 text-sm mt-6"
        >
          Mientras tanto, continúa explorando los módulos disponibles para ganar XP y ML Coins
        </motion.p>
      </motion.div>
    </div>
  );
};

export default UnderConstructionExercise;
