import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface FormErrorDisplayProps {
  errors: string[];
  onDismiss?: () => void;
}

/**
 * Componente para mostrar errores de formulario
 * Muestra una lista de errores con animación y opción de cerrar
 */
export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  errors,
  onDismiss
}) => {
  if (!errors || errors.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-red-50 border border-detective-danger rounded-lg p-4 mb-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-detective-danger flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            {errors.length === 1 ? (
              <p className="text-detective-sm text-detective-danger">
                {errors[0]}
              </p>
            ) : (
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li
                    key={index}
                    className="text-detective-sm text-detective-danger"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-detective-danger hover:text-red-700 transition-colors flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
