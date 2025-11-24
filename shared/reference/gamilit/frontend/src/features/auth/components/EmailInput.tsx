import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { InputDetective, InputDetectiveProps } from '@shared/components/base/InputDetective';
import { validateEmail } from '@shared/utils/validation';

interface EmailInputProps extends Omit<InputDetectiveProps, 'type' | 'icon'> {
  showValidation?: boolean;
}

/**
 * Input especializado para emails
 * Incluye validación visual y feedback instantáneo
 */
export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  showValidation = true,
  error,
  ...props
}) => {
  const [isValid, setIsValid] = useState(false);
  const emailValue = typeof value === 'string' ? value : '';

  useEffect(() => {
    if (emailValue && showValidation && !error) {
      setIsValid(validateEmail(emailValue));
    } else {
      setIsValid(false);
    }
  }, [emailValue, showValidation, error]);

  return (
    <div className="relative">
      <InputDetective
        {...props}
        type="email"
        value={value}
        onChange={onChange}
        error={error}
        icon={<Mail className="w-5 h-5" />}
      />
      {showValidation && isValid && !error && (
        <div className="absolute right-3 top-[38px] -translate-y-1/2">
          <CheckCircle2 className="w-5 h-5 text-detective-success" />
        </div>
      )}
    </div>
  );
};
