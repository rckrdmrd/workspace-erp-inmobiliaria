import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Module as ModuleEntity,
  Exercise,
  AssessmentRubric,
  MediaResource,
  ContentApproval,
} from './entities';
import { Profile } from '../auth/entities/profile.entity';
import {
  ModulesService,
  ExercisesService,
  MediaService,
} from './services';
import {
  ModulesController,
  ExercisesController,
  MediaController,
} from './controllers';
import { DB_SCHEMAS } from '@shared/constants';
import { ProgressModule } from '../progress/progress.module';

/**
 * EducationalModule
 *
 * Módulo NestJS que encapsula toda la lógica educativa.
 * Incluye:
 * - Módulos educativos (con contenido estructurado)
 * - Ejercicios (27+ tipos diferentes)
 * - Recursos multimedia (imágenes, videos, audio, documentos)
 * - Rúbricas de evaluación
 *
 * Exporta tres servicios principales:
 * - ModulesService: Gestión de módulos
 * - ExercisesService: Gestión de ejercicios
 * - MediaService: Gestión de recursos multimedia
 *
 * Expone tres controladores REST:
 * - ModulesController: API para módulos educativos
 * - ExercisesController: API para ejercicios
 * - MediaController: API para recursos multimedia
 */
@Module({
  imports: [
    // Connection 'educational' handles schema 'educational_content'
    TypeOrmModule.forFeature(
      [ModuleEntity, Exercise, AssessmentRubric, MediaResource, ContentApproval],
      'educational',
    ),
    // Import Profile entity from auth schema (for ExercisesController)
    TypeOrmModule.forFeature([Profile], 'auth'),
    // Import ProgressModule to access ExerciseSubmissionService for submit endpoint
    ProgressModule,
  ],
  controllers: [ModulesController, ExercisesController, MediaController],
  providers: [ModulesService, ExercisesService, MediaService],
  exports: [ModulesService, ExercisesService, MediaService],
})
export class EducationalModule {}
