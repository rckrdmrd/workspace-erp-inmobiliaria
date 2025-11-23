import { ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationConfig: ValidationPipeOptions = {
  // Whitelist: Strip properties that don't have decorators
  whitelist: true,

  // Forbid non-whitelisted properties (throw error instead of stripping)
  forbidNonWhitelisted: true,

  // Transform payloads to DTO instances
  transform: true,

  // Transform options
  transformOptions: {
    enableImplicitConversion: true, // Auto-convert primitive types
  },

  // Error messages
  disableErrorMessages: process.env.NODE_ENV === 'production',

  // Validation error format
  exceptionFactory: (errors: ValidationError[]) => {
    const messages = errors.map((error: ValidationError) => ({
      field: error.property,
      constraints: error.constraints,
      value: error.value,
    }));

    return {
      statusCode: 400,
      message: 'Validation failed',
      errors: messages,
    };
  },

  // Skip missing properties validation
  skipMissingProperties: false,

  // Skip null values validation
  skipNullProperties: false,

  // Skip undefined values validation
  skipUndefinedProperties: false,

  // Validate nested objects
  validationError: {
    target: false, // Don't expose target object
    value: process.env.NODE_ENV !== 'production', // Show value only in non-production
  },
};
