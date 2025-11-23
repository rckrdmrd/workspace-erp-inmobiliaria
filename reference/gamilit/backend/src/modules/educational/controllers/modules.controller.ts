import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ModulesService } from '../services';
import { CreateModuleDto, ModuleResponseDto } from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { DifficultyLevelEnum } from '@/shared/constants/enums.constants';
import { ExercisesService } from '../services/exercises.service';
import { ExerciseSubmissionService } from '@/modules/progress/services';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

/**
 * ModulesController
 *
 * @description Gestión de módulos educativos de Marie Curie.
 * Endpoints para crear, leer, actualizar y eliminar módulos educativos,
 * así como filtrar por dificultad y obtener prerequisitos.
 *
 * @route /api/v1/educational/modules
 */
@ApiTags('Educational - Modules')
@Controller(extractBasePath(API_ROUTES.EDUCATIONAL.BASE))
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly exercisesService: ExercisesService,
    private readonly exerciseSubmissionService: ExerciseSubmissionService,
  ) {}

  /**
   * Obtiene todos los módulos educativos ordenados por índice
   *
   * @returns Array de módulos ordenados por order_index
   *
   * @example
   * GET /api/v1/educational/modules
   * Response: [
   *   {
   *     "id": "550e8400-e29b-41d4-a716-446655440000",
   *     "title": "Marie Curie - Infancia",
   *     "subtitle": "Los primeros años de Marie Curie",
   *     "difficulty_level": "beginner",
   *     "order_index": 0,
   *     ...
   *   }
   * ]
   */
  @UseGuards(JwtAuthGuard)
  @Get('modules')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all modules',
    description: 'Obtiene todos los módulos educativos ordenados por índice de secuencia, con progreso del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos obtenida exitosamente',
    type: [ModuleResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Marie Curie - Infancia',
          subtitle: 'Los primeros años de Marie Curie en Polonia',
          description: 'Conoce la historia de la infancia de Marie Curie',
          order_index: 0,
          difficulty_level: 'beginner',
          grade_levels: ['6', '7', '8'],
          subjects: ['Historia', 'Ciencias'],
          estimated_duration_minutes: 45,
          xp_reward: 100,
          ml_coins_reward: 50,
          status: 'published',
          is_published: true,
          total_exercises: 5,
          completed_exercises: 3,
          progress: 60,
          completed: false,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(@Request() req: any) {
    const userId = req.user.id;

    // Obtener todos los módulos
    const modules = await this.modulesService.findAll();

    // Obtener todas las submissions del usuario
    const allSubmissions = await this.exerciseSubmissionService.findByUserId(userId);

    // Crear un mapa de ejercicios completados
    const completedExercisesMap = new Map<string, boolean>();
    allSubmissions.forEach((submission) => {
      if (submission.status === 'graded') {
        completedExercisesMap.set(submission.exercise_id, true);
      }
    });

    // Obtener todos los ejercicios
    const allExercises = await this.exercisesService.findAll();

    // Agrupar ejercicios por módulo
    const exercisesByModule = new Map<string, any[]>();
    allExercises.forEach((exercise) => {
      if (!exercisesByModule.has(exercise.module_id)) {
        exercisesByModule.set(exercise.module_id, []);
      }
      exercisesByModule.get(exercise.module_id)!.push(exercise);
    });

    // Calcular progreso para cada módulo
    return modules.map((module) => {
      const moduleExercises = exercisesByModule.get(module.id) || [];
      const totalExercises = moduleExercises.length;
      const completedExercises = moduleExercises.filter((ex) =>
        completedExercisesMap.has(ex.id),
      ).length;
      const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
      const completed = totalExercises > 0 && completedExercises === totalExercises;

      return {
        ...module,
        total_exercises: totalExercises,
        completed_exercises: completedExercises,
        progress,
        completed,
      };
    });
  }

  /**
   * Obtiene módulos filtrados por nivel de dificultad
   *
   * IMPORTANTE: Esta ruta debe ir ANTES de 'modules/:id' para evitar
   * que 'difficulty' sea capturado como un ID.
   *
   * @param difficulty - Nivel de dificultad
   * @returns Array de módulos con esa dificultad
   *
   * @example
   * GET /api/v1/educational/modules/difficulty/beginner
   */
  @Get('modules/difficulty/:difficulty')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get modules by difficulty',
    description: 'Obtiene todos los módulos de un nivel de dificultad específico',
  })
  @ApiParam({
    name: 'difficulty',
    description: 'Nivel de dificultad del módulo',
    enum: DifficultyLevelEnum,
    required: true,
    example: 'beginner',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos filtrados por dificultad',
    type: [ModuleResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Marie Curie - Infancia',
          difficulty_level: 'beginner',
          order_index: 0,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nivel de dificultad inválido',
  })
  async findByDifficulty(@Param('difficulty') difficulty: DifficultyLevelEnum) {
    return await this.modulesService.findByDifficulty(difficulty);
  }

  /**
   * Busca módulos por palabra clave
   *
   * IMPORTANTE: Esta ruta debe ir ANTES de 'modules/:id' para evitar
   * que 'search' sea capturado como un ID.
   *
   * @param q - Palabra clave a buscar (query parameter)
   * @returns Array de módulos que coinciden con la búsqueda
   *
   * @example
   * GET /api/v1/educational/modules/search?q=curie
   * Response: [
   *   {
   *     "id": "550e8400-e29b-41d4-a716-446655440000",
   *     "title": "Marie Curie - Infancia",
   *     "subtitle": "Los primeros años de Marie Curie",
   *     "order_index": 0,
   *     ...
   *   }
   * ]
   */
  @Get('modules/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search modules',
    description: 'Busca módulos por palabra clave en título, subtítulo y descripción',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos que coinciden con la búsqueda',
    type: [ModuleResponseDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Marie Curie - Infancia',
          subtitle: 'Los primeros años de Marie Curie',
          order_index: 0,
          difficulty_level: 'beginner',
          total_exercises: 5,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetro de búsqueda inválido',
  })
  async searchModules(@Query('q') keyword: string) {
    return await this.modulesService.search(keyword || '');
  }

  /**
   * Obtiene módulos con progreso del usuario
   *
   * IMPORTANTE: Esta ruta debe ir ANTES de 'modules/:id' para evitar
   * que 'user' sea capturado como un ID.
   *
   * @param userId - ID del usuario
   * @returns Array de módulos con progreso incluido
   *
   * @example
   * GET /api/v1/educational/modules/user/550e8400-e29b-41d4-a716-446655440000
   * Response: [
   *   {
   *     "id": "module-uuid",
   *     "title": "Marie Curie - Infancia",
   *     "description": "Conoce la historia...",
   *     "difficulty": "beginner",
   *     "estimatedTime": 45,
   *     "xpReward": 100,
   *     "mlCoinsReward": 50,
   *     "progress": 50,
   *     "completedExercises": 3,
   *     "totalExercises": 6,
   *     "status": "in_progress"
   *   }
   * ]
   */
  @Get('modules/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user modules with progress',
    description: 'Obtiene todos los módulos con información de progreso del usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos con progreso del usuario',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Marie Curie - Infancia',
          description: 'Conoce la historia de la infancia de Marie Curie',
          difficulty: 'beginner',
          estimatedTime: 45,
          xpReward: 100,
          mlCoinsReward: 50,
          progress: 50,
          completedExercises: 3,
          totalExercises: 6,
          status: 'in_progress',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserModules(@Param('userId') userId: string) {
    return await this.modulesService.getUserModules(userId);
  }

  /**
   * Obtiene un módulo específico por ID
   *
   * IMPORTANTE: Esta ruta debe ir DESPUÉS de rutas más específicas
   * como 'modules/difficulty/:difficulty' y 'modules/search' para evitar conflictos.
   *
   * @param id - ID del módulo (UUID)
   * @returns Módulo encontrado
   *
   * @example
   * GET /api/v1/educational/modules/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('modules/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get module by ID',
    description: 'Obtiene un módulo educativo específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo en formato UUID',
    type: String,
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo encontrado exitosamente',
    type: ModuleResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Marie Curie - Infancia',
        subtitle: 'Los primeros años de Marie Curie en Polonia',
        description: 'Conoce la historia de la infancia de Marie Curie',
        summary: 'Marie Sklodowska nació en Varsovia, Polonia...',
        content: {
          marie_curie_story: 'Marie Curie nació en Varsovia...',
          reading_materials: ['texto1.pdf', 'texto2.pdf'],
          historical_context: 'Polonia en el siglo XIX...',
          scientific_concepts: ['Física', 'Química', 'Radioactividad'],
        },
        order_index: 0,
        module_code: 'MC-001',
        difficulty_level: 'beginner',
        grade_levels: ['6', '7', '8'],
        subjects: ['Historia', 'Ciencias'],
        estimated_duration_minutes: 45,
        estimated_sessions: 2,
        learning_objectives: [
          'Conocer la infancia de Marie Curie',
          'Entender el contexto histórico',
        ],
        competencies: ['Comprensión lectora', 'Pensamiento crítico'],
        skills_developed: ['Análisis', 'Síntesis'],
        prerequisites: [],
        prerequisite_skills: ['Lectura básica'],
        maya_rank_required: 'Ajaw',
        maya_rank_granted: null,
        xp_reward: 100,
        ml_coins_reward: 50,
        status: 'published',
        is_published: true,
        is_featured: false,
        is_free: true,
        is_demo_module: false,
        is_published_date: '2025-01-15T10:00:00Z',
        version: 1,
        keywords: ['Marie Curie', 'Infancia', 'Ciencia'],
        tags: ['historia', 'ciencia', 'biografía'],
        thumbnail_url: 'https://example.com/thumbnail.jpg',
        cover_image_url: 'https://example.com/cover.jpg',
        total_exercises: 5,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-11-04T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Module with ID 550e8400-e29b-41d4-a716-446655440000 not found',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.modulesService.findById(id);
  }

  /**
   * Crea un nuevo módulo educativo
   *
   * @param createModuleDto - Datos del módulo a crear
   * @returns Módulo creado
   *
   * @example
   * POST /api/v1/educational/modules
   * Request: {
   *   "title": "Marie Curie - Infancia",
   *   "order_index": 0,
   *   "difficulty_level": "beginner",
   *   ...
   * }
   */
  @Post('modules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new module [Admin only]',
    description: 'Crea un nuevo módulo educativo. Requiere permisos de administrador.',
  })
  @ApiResponse({
    status: 201,
    description: 'Módulo creado exitosamente',
    type: ModuleResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Marie Curie - Infancia',
        order_index: 0,
        difficulty_level: 'beginner',
        status: 'draft',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
    schema: {
      example: {
        statusCode: 400,
        message: ['title should not be empty', 'order_index must be a positive number'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de administrador',
  })
  async create(@Body() createModuleDto: CreateModuleDto) {
    return await this.modulesService.create(createModuleDto);
  }

  /**
   * Actualiza un módulo educativo existente
   *
   * @param id - ID del módulo a actualizar
   * @param updateModuleDto - Datos a actualizar (parciales)
   * @returns Módulo actualizado
   *
   * @example
   * PATCH /api/v1/educational/modules/550e8400-e29b-41d4-a716-446655440000
   * Request: {
   *   "title": "Marie Curie - Infancia (Actualizado)",
   *   "status": "published"
   * }
   */
  @Patch('modules/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update module [Admin only]',
    description: 'Actualiza un módulo educativo existente. Requiere permisos de administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo actualizado exitosamente',
    type: ModuleResponseDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Marie Curie - Infancia (Actualizado)',
        status: 'published',
        updated_at: '2025-01-15T11:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  async update(@Param('id') id: string, @Body() updateModuleDto: Partial<CreateModuleDto>) {
    return await this.modulesService.update(id, updateModuleDto);
  }

  /**
   * Elimina un módulo educativo
   *
   * @param id - ID del módulo a eliminar
   * @returns Resultado de la operación
   *
   * @example
   * DELETE /api/v1/educational/modules/550e8400-e29b-41d4-a716-446655440000
   */
  @Delete('modules/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete module [Admin only]',
    description:
      'Elimina un módulo educativo. ADVERTENCIA: Esto eliminará en cascada todos los ejercicios asociados. Requiere permisos de administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo eliminado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Module deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  async remove(@Param('id') id: string) {
    const deleted = await this.modulesService.delete(id);
    return {
      success: deleted,
      message: deleted ? 'Module deleted successfully' : 'Module not found',
    };
  }

  /**
   * Obtiene los módulos prerequisitos de un módulo específico
   *
   * @param id - ID del módulo
   * @returns Array de módulos prerequisitos
   *
   * @example
   * GET /api/v1/educational/modules/550e8400-e29b-41d4-a716-446655440000/prerequisites
   * Response: [
   *   {
   *     "id": "440e8400-e29b-41d4-a716-446655440001",
   *     "title": "Introducción a la Lectura",
   *     "order_index": 0
   *   }
   * ]
   */
  @Get('modules/:id/prerequisites')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get module prerequisites',
    description:
      'Obtiene la lista de módulos prerequisitos que deben completarse antes de este módulo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos prerequisitos obtenida exitosamente',
    type: [ModuleResponseDto],
    schema: {
      example: [
        {
          id: '440e8400-e29b-41d4-a716-446655440001',
          title: 'Introducción a la Lectura',
          subtitle: 'Conceptos básicos de comprensión lectora',
          order_index: 0,
          difficulty_level: 'very_easy',
          total_exercises: 3,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  async getPrerequisites(@Param('id') id: string) {
    return await this.modulesService.getPrerequisites(id);
  }
}
