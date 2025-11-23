import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { validatePasswordStrength, getPasswordCriteria } from '@shared/utils/validation';

interface PasswordStrengthMeterProps {
  password: string;
  showCriteria?: boolean;
}

/**
 * Componente que muestra la fortaleza de una contraseña
 * Incluye barra de progreso visual y lista de criterios
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showCriteria = true
}) => {
  if (!password) return null;

  const strength = validatePasswordStrength(password);
  const criteria = getPasswordCriteria(password);

  return (
    <div className="mt-2">
      {/* Barra de progreso */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-detective-sm text-detective-text-secondary">
            Fortaleza:
          </span>
          <span
            className="text-detective-sm font-semibold"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength.percentage}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full transition-colors"
            style={{ backgroundColor: strength.color }}
          />
        </div>
      </div>

      {/* Criterios de validación */}
      {showCriteria && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-1 mt-3"
        >
          <CriteriaItem
            met={criteria.minLength}
            text="Mínimo 8 caracteres"
          />
          <CriteriaItem
            met={criteria.hasUppercase}
            text="Una letra mayúscula"
          />
          <CriteriaItem
            met={criteria.hasLowercase}
            text="Una letra minúscula"
          />
          <CriteriaItem
            met={criteria.hasNumber}
            text="Un número"
          />
          <CriteriaItem
            met={criteria.hasSpecialChar}
            text="Un símbolo especial (!@#$%...)"
          />
        </motion.div>
      )}
    </div>
  );
};

interface CriteriaItemProps {
  met: boolean;
  text: string;
}

const CriteriaItem: React.FC<CriteriaItemProps> = ({ met, text }) => {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-detective-success" />
      ) : (
        <X className="w-4 h-4 text-detective-text-secondary" />
      )}
      <span
        className={`text-detective-sm ${
          met ? 'text-detective-success' : 'text-detective-text-secondary'
        }`}
      >
        {text}
      </span>
    </div>
  );
};
