/**
 * Content Management Module - Main Export
 *
 * @description Punto de entrada principal del módulo Content Management.
 * @usage import { ContentModule } from '@modules/content';
 */

export { ContentModule } from './content.module';

// Re-export entities, DTOs, services, and controllers for convenience
export * from './entities';
export * from './dto';
export * from './services';
export * from './controllers';
