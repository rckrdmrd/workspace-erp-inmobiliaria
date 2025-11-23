import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { InputDetective, InputDetectiveProps } from '@shared/components/base/InputDetective';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface PasswordInputProps extends Omit<InputDetectiveProps, 'type' | 'icon'> {
  showStrengthMeter?: boolean;
  showCriteria?: boolean;
}

/**
 * Input especializado para contraseñas
 * Incluye toggle de visibilidad y medidor de fortaleza opcional
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  showStrengthMeter = false,
  showCriteria = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <InputDetective
          {...props}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-detective-text-secondary hover:text-detective-text transition-colors"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {showStrengthMeter && typeof value === 'string' && (
        <PasswordStrengthMeter
          password={value}
          showCriteria={showCriteria}
        />
      )}
    </div>
  );
};
