/**
 * Mock functions para desarrollo sin backend
 * Simula operaciones de autenticación con delays realistas
 */

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  emailVerified: boolean;
}

export interface MockLoginResponse {
  success: boolean;
  token?: string;
  user?: MockUser;
  error?: string;
}

export interface MockRegisterResponse {
  success: boolean;
  message?: string;
  user?: MockUser;
  error?: string;
}

export interface MockPasswordRecoveryResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Base de datos mock simple
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@gamilit.com',
    fullName: 'Marie Curie',
    role: 'admin',
    emailVerified: true
  },
  {
    id: '2',
    email: 'detective@gamilit.com',
    fullName: 'Detective Gamilit',
    role: 'student',
    emailVerified: true
  }
];

// Contraseña válida para pruebas: Password123!
const VALID_PASSWORD = 'Password123!';

// Contador de intentos fallidos por email
const failedAttempts: Record<string, number> = {};

/**
 * Mock de login con validación de credenciales
 * Simula rate limiting después de 3 intentos fallidos
 */
export const mockLogin = async (
  email: string,
  password: string
): Promise<MockLoginResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verificar rate limiting
  const attempts = failedAttempts[email] || 0;
  if (attempts >= 3) {
    return {
      success: false,
      error: 'Cuenta bloqueada temporalmente. Intenta nuevamente en 15 minutos.'
    };
  }

  // Buscar usuario
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || password !== VALID_PASSWORD) {
    failedAttempts[email] = (failedAttempts[email] || 0) + 1;
    return {
      success: false,
      error: 'Credenciales inválidas'
    };
  }

  // Reset intentos fallidos en login exitoso
  delete failedAttempts[email];

  return {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user
  };
};

/**
 * Mock de registro de nuevo usuario
 * Valida que el email no exista previamente
 */
export const mockRegister = async (data: {
  fullName: string;
  email: string;
  password: string;
}): Promise<MockRegisterResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Verificar si el email ya existe
  const existingUser = MOCK_USERS.find(
    u => u.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      error: 'Este email ya está registrado'
    };
  }

  // Crear nuevo usuario mock
  // Note: emailVerified is now always true since email verification is disabled
  const newUser: MockUser = {
    id: String(MOCK_USERS.length + 1),
    email: data.email,
    fullName: data.fullName,
    role: 'student',
    emailVerified: true // Always verified - email verification is disabled
  };

  // Agregar a la base de datos mock
  MOCK_USERS.push(newUser);

  return {
    success: true,
    message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.',
    user: newUser
  };
};

/**
 * Mock de solicitud de recuperación de contraseña
 * Simula envío de email de recuperación
 */
export const mockPasswordRecovery = async (
  email: string
): Promise<MockPasswordRecoveryResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Por seguridad, siempre retornar éxito (no revelar si el email existe)
  return {
    success: true,
    message: 'Si el email existe, recibirás un enlace de recuperación en breve.'
  };
};

/**
 * Mock de reset de contraseña
 * Valida el token y actualiza la contraseña
 */
export const mockPasswordReset = async (
  token: string,
  newPassword: string
): Promise<MockPasswordRecoveryResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validar token (mock simple)
  if (!token || token.length < 10) {
    return {
      success: false,
      error: 'Token inválido o expirado'
    };
  }

  return {
    success: true,
    message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.'
  };
};

/**
 * Mock de verificación de email
 * Simula activación de cuenta
 *
 * @deprecated Since 2025-10 - Email verification is now disabled.
 * All users are automatically verified upon registration.
 * This function is kept for backward compatibility only.
 */
export const mockEmailVerification = async (
  token: string
): Promise<MockPasswordRecoveryResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validar token
  if (!token || token.length < 10) {
    return {
      success: false,
      error: 'Token de verificación inválido o expirado'
    };
  }

  return {
    success: true,
    message: 'Email verificado exitosamente. Tu cuenta está activada.'
  };
};

/**
 * Mock de verificación 2FA
 * Simula validación de código 2FA
 */
export const mockTwoFactorVerification = async (
  code: string
): Promise<MockPasswordRecoveryResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 600));

  // Código válido mock: 123456
  if (code === '123456') {
    return {
      success: true,
      message: 'Código verificado exitosamente'
    };
  }

  return {
    success: false,
    error: 'Código inválido o expirado'
  };
};

/**
 * Mock de reenvío de código de verificación
 *
 * @deprecated Since 2025-10 - Email verification is now disabled.
 * All users are automatically verified upon registration.
 * This function is kept for backward compatibility only.
 */
export const mockResendVerificationCode = async (): Promise<MockPasswordRecoveryResponse> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Código de verificación reenviado'
  };
};
