import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  ContentTemplate,
  MarieCurieContent,
  MediaFile,
  ContentAuthor, // ✨ NUEVO - P2 (Autores de contenido)
  ContentCategory, // ✨ NUEVO - P2 (Categorías jerárquicas)
} from './entities';

// Services
import {
  ContentTemplatesService,
  MarieCurieContentService,
  MediaFilesService,
  ContentAuthorsService,
  ContentCategoriesService,
} from './services';

// Controllers
import {
  ContentTemplatesController,
  MarieCurieContentController,
  MediaFilesController,
  ContentAuthorsController,
  ContentCategoriesController,
} from './controllers';

// Constants
import { DB_SCHEMAS } from '@/shared/constants';

/**
 * ContentModule
 *
 * @description Módulo de gestión de contenido educativo y multimedia.
 *              Incluye plantillas reutilizables, contenido sobre Marie Curie,
 *              y gestión completa de archivos multimedia.
 *
 * @features
 * - Plantillas de contenido reutilizables (5 tipos)
 * - Contenido curado sobre Marie Curie (9 categorías)
 * - Gestión de archivos multimedia (6 tipos)
 * - Workflow de publicación (draft → published)
 * - Procesamiento de archivos (uploading → ready)
 * - Full-text search en español
 * - Estadísticas de almacenamiento y uso
 *
 * @exports
 * - ContentTemplatesService
 * - MarieCurieContentService
 * - MediaFilesService
 * - ContentAuthorsService (P2 - Gestión de perfiles de autores)
 * - ContentCategoriesService (P2 - Categorías jerárquicas para contenido)
 */
@Module({
  imports: [
    // Connection 'content' handles schema 'content_management'
    TypeOrmModule.forFeature(
      [
        ContentTemplate,
        MarieCurieContent,
        MediaFile,
        ContentAuthor, // ✨ NUEVO - P2 (Autores de contenido)
        ContentCategory, // ✨ NUEVO - P2 (Categorías jerárquicas)
      ],
      'content',
    ),
  ],
  providers: [
    ContentTemplatesService,
    MarieCurieContentService,
    MediaFilesService,
    ContentAuthorsService, // ✨ NUEVO - P2
    ContentCategoriesService, // ✨ NUEVO - P2
  ],
  controllers: [
    ContentTemplatesController,
    MarieCurieContentController,
    MediaFilesController,
    ContentAuthorsController, // ✨ NUEVO - P2
    ContentCategoriesController, // ✨ NUEVO - P2
  ],
  exports: [
    ContentTemplatesService,
    MarieCurieContentService,
    MediaFilesService,
    ContentAuthorsService, // ✨ NUEVO - P2
    ContentCategoriesService, // ✨ NUEVO - P2
  ],
})
export class ContentModule {}
