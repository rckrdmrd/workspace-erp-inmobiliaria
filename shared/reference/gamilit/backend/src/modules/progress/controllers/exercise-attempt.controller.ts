import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ExerciseAttemptService } from '../services';
import {
  CreateExerciseAttemptDto,
  ExerciseAttemptResponseDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ExerciseAttemptController
 *
 * @description Gestión de intentos individuales de ejercicios.
 * Endpoints para tracking de intentos, scores y uso de comodines.
 *
 * @route /api/v1/progress/attempts
 */
@ApiTags('Progress - Exercise Attempts')
@Controller(extractBasePath(API_ROUTES.PROGRESS.BASE))
export class ExerciseAttemptController {
  constructor(private readonly attemptService: ExerciseAttemptService) {}

  /**
   * Crea un nuevo intento de ejercicio
   *
   * @param createAttemptDto - Datos para crear el intento
   * @returns Nuevo intento de ejercicio
   *
   * @example
   * POST /api/v1/progress/attempts
   * Request: {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "exercise_id": "880e8400-e29b-41d4-a716-446655440000",
   *   "session_id": "770e8400-e29b-41d4-a716-446655440000",
   *   "attempt_number": 1
   * }
   */
  @Post('attempts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create exercise attempt',
    description:
      'Registra un nuevo intento de ejercicio por parte de un usuario en una sesión',
  })
  @ApiResponse({
    status: 201,
    description: 'Intento creado exitosamente',
    type: ExerciseAttemptResponseDto,
    schema: {
      example: {
        id: '990e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        exercise_id: '880e8400-e29b-41d4-a716-446655440000',
        session_id: '770e8400-e29b-41d4-a716-446655440000',
        attempt_number: 1,
        started_at: '2025-01-16T10:15:00Z',
        is_completed: false,
        created_at: '2025-01-16T10:15:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  async create(@Body() createAttemptDto: CreateExerciseAttemptDto) {
    return await this.attemptService.create(createAttemptDto);
  }

  /**
   * Obtiene todos los intentos de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de intentos ordenados por fecha de inicio (más recientes primero)
   *
   * @example
   * GET /api/v1/progress/attempts/users/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('attempts/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user attempts',
    description: 'Obtiene todos los intentos de ejercicios realizados por un usuario',
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
    description: 'Lista de intentos obtenida exitosamente',
    type: [ExerciseAttemptResponseDto],
    schema: {
      example: [
        {
          id: '990e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          attempt_number: 2,
          started_at: '2025-01-16T14:30:00Z',
          completed_at: '2025-01-16T14:45:00Z',
          time_taken: '00:15:00',
          score: 85,
          result: 'correct',
          is_completed: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.attemptService.findByUserId(userId);
  }

  /**
   * Obtiene todos los intentos de un ejercicio específico
   *
   * @param exerciseId - ID del ejercicio (UUID)
   * @returns Lista de intentos del ejercicio
   *
   * @example
   * GET /api/v1/progress/attempts/exercises/880e8400-e29b-41d4-a716-446655440000
   */
  @Get('attempts/exercises/:exerciseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get exercise attempts',
    description: 'Obtiene todos los intentos realizados en un ejercicio específico',
  })
  @ApiParam({
    name: 'exerciseId',
    description: 'ID del ejercicio en formato UUID',
    type: String,
    required: true,
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de intentos del ejercicio obtenida exitosamente',
    type: [ExerciseAttemptResponseDto],
    schema: {
      example: [
        {
          id: '990e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          attempt_number: 1,
          score: 75,
          result: 'partial',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ejercicio no encontrado',
  })
  async findByExerciseId(@Param('exerciseId') exerciseId: string) {
    return await this.attemptService.findByExerciseId(exerciseId);
  }

  /**
   * Obtiene intentos de un usuario en un ejercicio específico
   *
   * @param userId - ID del usuario (UUID)
   * @param exerciseId - ID del ejercicio (UUID)
   * @returns Lista de intentos del usuario en ese ejercicio
   *
   * @example
   * GET /api/v1/progress/attempts/users/550e8400-e29b-41d4-a716-446655440000/exercises/880e8400-e29b-41d4-a716-446655440000
   */
  @Get('attempts/users/:userId/exercises/:exerciseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user attempts for specific exercise',
    description: 'Obtiene todos los intentos de un usuario en un ejercicio específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'exerciseId',
    description: 'ID del ejercicio en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de intentos obtenida exitosamente',
    type: [ExerciseAttemptResponseDto],
    schema: {
      example: [
        {
          id: '990e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          attempt_number: 1,
          score: 75,
          result: 'partial',
          started_at: '2025-01-16T10:15:00Z',
          completed_at: '2025-01-16T10:30:00Z',
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440001',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          attempt_number: 2,
          score: 95,
          result: 'correct',
          started_at: '2025-01-16T14:00:00Z',
          completed_at: '2025-01-16T14:12:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o ejercicio no encontrado',
  })
  async findByUserAndExercise(
    @Param('userId') userId: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return await this.attemptService.findByUserAndExercise(userId, exerciseId);
  }

  /**
   * Obtiene el siguiente número de intento para un usuario en un ejercicio
   *
   * @param userId - ID del usuario (UUID)
   * @param exerciseId - ID del ejercicio (UUID)
   * @returns Siguiente número de intento disponible
   *
   * @example
   * GET /api/v1/progress/attempts/users/550e8400-e29b-41d4-a716-446655440000/exercises/880e8400-e29b-41d4-a716-446655440000/next-number
   * Response: { "next_attempt_number": 3 }
   */
  @Get('attempts/users/:userId/exercises/:exerciseId/next-number')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get next attempt number',
    description:
      'Calcula el siguiente número de intento disponible para un usuario en un ejercicio específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'exerciseId',
    description: 'ID del ejercicio en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Siguiente número de intento obtenido exitosamente',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        exercise_id: '880e8400-e29b-41d4-a716-446655440000',
        next_attempt_number: 3,
        total_attempts: 2,
      },
    },
  })
  async getNextAttemptNumber(
    @Param('userId') userId: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return await this.attemptService.getNextAttemptNumber(userId, exerciseId);
  }

  /**
   * Envía las respuestas de un intento
   *
   * @param id - ID del intento (UUID)
   * @param body - Respuestas del usuario
   * @returns Intento actualizado con resultado y score
   *
   * @example
   * POST /api/v1/progress/attempts/990e8400-e29b-41d4-a716-446655440000/submit
   * Request: {
   *   "answers": {
   *     "question1": "answer1",
   *     "question2": "answer2"
   *   }
   * }
   */
  @Post('attempts/:id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit attempt answers',
    description:
      'Envía las respuestas de un intento, calcula el score y marca como completado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del intento en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Intento enviado y calificado exitosamente',
    type: ExerciseAttemptResponseDto,
    schema: {
      example: {
        id: '990e8400-e29b-41d4-a716-446655440000',
        score: 85,
        result: 'correct',
        is_completed: true,
        completed_at: '2025-01-16T10:30:00Z',
        time_taken: '00:15:00',
        user_answers: {
          question1: 'answer1',
          question2: 'answer2',
        },
        correct_answers_count: 8,
        incorrect_answers_count: 2,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Intento ya completado o respuestas inválidas',
  })
  @ApiResponse({
    status: 404,
    description: 'Intento no encontrado',
  })
  async submitAttempt(
    @Param('id') id: string,
    @Body() body: { answers: object },
  ) {
    return await this.attemptService.submitAttempt(id, body.answers);
  }

  /**
   * Obtiene estadísticas de intentos de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Estadísticas agregadas de todos los intentos
   *
   * @example
   * GET /api/v1/progress/attempts/users/550e8400-e29b-41d4-a716-446655440000/stats
   */
  @Get('attempts/users/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get attempt statistics',
    description: 'Obtiene estadísticas agregadas de intentos de ejercicios de un usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de intentos obtenidas exitosamente',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        total_attempts: 45,
        completed_attempts: 42,
        average_score: 82.5,
        success_rate: 78.5,
        average_time_per_attempt: '00:12:30',
        total_hints_used: 15,
        total_comodines_used: 8,
        exercises_mastered: 12,
        exercises_struggling: 3,
        improvement_trend: 'positive',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getAttemptStats(@Param('userId') userId: string) {
    return await this.attemptService.getAttemptStats(userId);
  }

  /**
   * Obtiene el mejor intento de un usuario en un ejercicio
   *
   * @param userId - ID del usuario (UUID)
   * @param exerciseId - ID del ejercicio (UUID)
   * @returns Intento con el score más alto
   *
   * @example
   * GET /api/v1/progress/attempts/users/550e8400-e29b-41d4-a716-446655440000/exercises/880e8400-e29b-41d4-a716-446655440000/best
   */
  @Get('attempts/users/:userId/exercises/:exerciseId/best')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get best attempt',
    description:
      'Obtiene el intento con el score más alto de un usuario en un ejercicio específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'exerciseId',
    description: 'ID del ejercicio en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Mejor intento obtenido exitosamente',
    type: ExerciseAttemptResponseDto,
    schema: {
      example: {
        id: '990e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        exercise_id: '880e8400-e29b-41d4-a716-446655440000',
        attempt_number: 2,
        score: 95,
        result: 'correct',
        time_taken: '00:12:00',
        hints_used: 1,
        completed_at: '2025-01-16T14:12:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron intentos para el usuario y ejercicio especificados',
  })
  async getBestAttempt(
    @Param('userId') userId: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return await this.attemptService.getBestAttempt(userId, exerciseId);
  }

  /**
   * Registra el uso de comodines en un intento
   *
   * @param id - ID del intento (UUID)
   * @param body - Lista de comodines usados
   * @returns Intento actualizado con comodines registrados
   *
   * @example
   * PATCH /api/v1/progress/attempts/990e8400-e29b-41d4-a716-446655440000/comodines
   * Request: {
   *   "comodines": ["pistas", "vision_lectora"]
   * }
   */
  @Patch('attempts/:id/comodines')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Track comodines usage',
    description:
      'Registra los comodines (power-ups) utilizados durante un intento de ejercicio',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del intento en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Uso de comodines registrado exitosamente',
    type: ExerciseAttemptResponseDto,
    schema: {
      example: {
        id: '990e8400-e29b-41d4-a716-446655440000',
        comodines_used: ['pistas', 'vision_lectora'],
        comodines_cost: 150,
        updated_at: '2025-01-16T10:25:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Comodines inválidos o intento ya completado',
  })
  @ApiResponse({
    status: 404,
    description: 'Intento no encontrado',
  })
  async trackComodinesUsage(
    @Param('id') id: string,
    @Body() body: { comodines: string[] },
  ) {
    return await this.attemptService.trackComodinesUsage(id, body.comodines);
  }
}
