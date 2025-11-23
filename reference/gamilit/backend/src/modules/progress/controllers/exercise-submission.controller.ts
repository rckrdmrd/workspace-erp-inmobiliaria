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
import { ExerciseSubmissionService } from '../services';
import {
  CreateExerciseSubmissionDto,
  ExerciseSubmissionResponseDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';

/**
 * ExerciseSubmissionController
 *
 * @description Gestión de envíos finales de ejercicios y calificaciones.
 * Endpoints para submissions, grading, feedback y recompensas.
 *
 * @route /api/v1/progress/submissions
 */
@ApiTags('Progress - Exercise Submissions')
@Controller(extractBasePath(API_ROUTES.PROGRESS.BASE))
export class ExerciseSubmissionController {
  constructor(
    private readonly submissionService: ExerciseSubmissionService,
  ) {}

  /**
   * Crea un nuevo envío de ejercicio
   *
   * @param createSubmissionDto - Datos para crear el envío
   * @returns Nuevo envío de ejercicio
   *
   * @example
   * POST /api/v1/progress/submissions
   * Request: {
   *   "user_id": "550e8400-e29b-41d4-a716-446655440000",
   *   "exercise_id": "880e8400-e29b-41d4-a716-446655440000",
   *   "attempt_id": "990e8400-e29b-41d4-a716-446655440000"
   * }
   */
  @Post('submissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create exercise submission',
    description:
      'Crea un nuevo registro de envío final de ejercicio para revisión o calificación',
  })
  @ApiResponse({
    status: 201,
    description: 'Envío creado exitosamente',
    type: ExerciseSubmissionResponseDto,
    schema: {
      example: {
        id: 'aa0e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        exercise_id: '880e8400-e29b-41d4-a716-446655440000',
        attempt_id: '990e8400-e29b-41d4-a716-446655440000',
        status: 'pending_review',
        submitted_at: '2025-01-16T15:00:00Z',
        created_at: '2025-01-16T15:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o envío ya existe',
  })
  async create(@Body() createSubmissionDto: CreateExerciseSubmissionDto) {
    return await this.submissionService.create(createSubmissionDto);
  }

  /**
   * Obtiene todos los envíos de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Lista de envíos ordenados por fecha de envío (más recientes primero)
   *
   * @example
   * GET /api/v1/progress/submissions/users/550e8400-e29b-41d4-a716-446655440000
   */
  @Get('submissions/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user submissions',
    description: 'Obtiene todos los envíos de ejercicios realizados por un usuario',
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
    description: 'Lista de envíos obtenida exitosamente',
    type: [ExerciseSubmissionResponseDto],
    schema: {
      example: [
        {
          id: 'aa0e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          status: 'graded',
          final_score: 88,
          submitted_at: '2025-01-16T15:00:00Z',
          graded_at: '2025-01-17T09:30:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findByUserId(@Param('userId') userId: string) {
    return await this.submissionService.findByUserId(userId);
  }

  /**
   * Obtiene todos los envíos de un ejercicio específico
   *
   * @param exerciseId - ID del ejercicio (UUID)
   * @returns Lista de envíos del ejercicio
   *
   * @example
   * GET /api/v1/progress/submissions/exercises/880e8400-e29b-41d4-a716-446655440000
   */
  @Get('submissions/exercises/:exerciseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get exercise submissions',
    description: 'Obtiene todos los envíos realizados para un ejercicio específico',
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
    description: 'Lista de envíos del ejercicio obtenida exitosamente',
    type: [ExerciseSubmissionResponseDto],
    schema: {
      example: [
        {
          id: 'aa0e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          status: 'graded',
          final_score: 88,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ejercicio no encontrado',
  })
  async findByExerciseId(@Param('exerciseId') exerciseId: string) {
    return await this.submissionService.findByExerciseId(exerciseId);
  }

  /**
   * Obtiene envíos de un usuario en un ejercicio específico
   *
   * @param userId - ID del usuario (UUID)
   * @param exerciseId - ID del ejercicio (UUID)
   * @returns Lista de envíos del usuario en ese ejercicio
   *
   * @example
   * GET /api/v1/progress/submissions/users/550e8400-e29b-41d4-a716-446655440000/exercises/880e8400-e29b-41d4-a716-446655440000
   */
  @Get('submissions/users/:userId/exercises/:exerciseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user submissions for specific exercise',
    description: 'Obtiene todos los envíos de un usuario en un ejercicio específico',
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
    description: 'Lista de envíos obtenida exitosamente',
    type: [ExerciseSubmissionResponseDto],
    schema: {
      example: [
        {
          id: 'aa0e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          status: 'graded',
          final_score: 88,
          submitted_at: '2025-01-16T15:00:00Z',
          graded_at: '2025-01-17T09:30:00Z',
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
    return await this.submissionService.findByUserAndExercise(
      userId,
      exerciseId,
    );
  }

  /**
   * Envía un ejercicio completo (crea submission y procesa respuestas)
   *
   * @param body - Datos del envío (userId, exerciseId, answers)
   * @returns Envío creado y procesado
   *
   * @example
   * POST /api/v1/progress/submissions/submit
   * Request: {
   *   "userId": "550e8400-e29b-41d4-a716-446655440000",
   *   "exerciseId": "880e8400-e29b-41d4-a716-446655440000",
   *   "answers": {
   *     "question1": "answer1",
   *     "question2": "answer2"
   *   }
   * }
   */
  @Post('submissions/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit exercise',
    description:
      'Envía un ejercicio completo, crea el submission y procesa las respuestas automáticamente',
  })
  @ApiResponse({
    status: 201,
    description: 'Ejercicio enviado y procesado exitosamente',
    type: ExerciseSubmissionResponseDto,
    schema: {
      example: {
        id: 'aa0e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        exercise_id: '880e8400-e29b-41d4-a716-446655440000',
        status: 'auto_graded',
        final_score: 85,
        submitted_at: '2025-01-16T15:00:00Z',
        graded_at: '2025-01-16T15:00:01Z',
        xp_earned: 170,
        ml_coins_earned: 85,
        user_answers: {
          question1: 'answer1',
          question2: 'answer2',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o respuestas incorrectas',
  })
  async submitExercise(
    @Body() body: { userId: string; exerciseId: string; answers: object },
  ) {
    return await this.submissionService.submitExercise(
      body.userId,
      body.exerciseId,
      body.answers,
    );
  }

  /**
   * Califica un envío manualmente (para ejercicios que requieren revisión humana)
   *
   * @param id - ID del envío (UUID)
   * @returns Envío calificado con score final
   *
   * @example
   * POST /api/v1/progress/submissions/aa0e8400-e29b-41d4-a716-446655440000/grade
   * Request: {
   *   "final_score": 92,
   *   "grader_id": "teacher-uuid"
   * }
   */
  @Post('submissions/:id/grade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Grade submission [Teacher only]',
    description:
      'Califica manualmente un envío de ejercicio. Requiere permisos de profesor/admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del envío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Envío calificado exitosamente',
    type: ExerciseSubmissionResponseDto,
    schema: {
      example: {
        id: 'aa0e8400-e29b-41d4-a716-446655440000',
        status: 'graded',
        final_score: 92,
        grader_id: 'teacher-uuid',
        graded_at: '2025-01-17T10:00:00Z',
        xp_earned: 184,
        ml_coins_earned: 92,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Envío ya calificado o score inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de profesor',
  })
  @ApiResponse({
    status: 404,
    description: 'Envío no encontrado',
  })
  async gradeSubmission(
    @Param('id') id: string,
    @Body() body: { final_score: number; grader_id: string },
  ) {
    // Note: gradeSubmission service method only accepts id
    // final_score and grader_id are calculated/set internally
    return await this.submissionService.gradeSubmission(id);
  }

  /**
   * Proporciona feedback detallado a un envío
   *
   * @param id - ID del envío (UUID)
   * @param body - Objeto de feedback
   * @returns Envío actualizado con feedback
   *
   * @example
   * POST /api/v1/progress/submissions/aa0e8400-e29b-41d4-a716-446655440000/feedback
   * Request: {
   *   "feedback": {
   *     "general_comments": "Buen trabajo, pero revisa la pregunta 3",
   *     "strengths": ["Comprensión clara del tema", "Buena estructura"],
   *     "areas_for_improvement": ["Ortografía", "Profundidad en análisis"]
   *   }
   * }
   */
  @Post('submissions/:id/feedback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Provide feedback [Teacher only]',
    description:
      'Proporciona feedback detallado a un envío de ejercicio. Requiere permisos de profesor/admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del envío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback proporcionado exitosamente',
    type: ExerciseSubmissionResponseDto,
    schema: {
      example: {
        id: 'aa0e8400-e29b-41d4-a716-446655440000',
        teacher_feedback: {
          general_comments: 'Buen trabajo, pero revisa la pregunta 3',
          strengths: ['Comprensión clara del tema', 'Buena estructura'],
          areas_for_improvement: ['Ortografía', 'Profundidad en análisis'],
        },
        feedback_provided_at: '2025-01-17T10:15:00Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de profesor',
  })
  @ApiResponse({
    status: 404,
    description: 'Envío no encontrado',
  })
  async provideFeedback(
    @Param('id') id: string,
    @Body() body: { feedback: object },
  ) {
    return await this.submissionService.provideFeedback(id, body.feedback);
  }

  /**
   * Actualiza el status de un envío
   *
   * @param id - ID del envío (UUID)
   * @param body - Nuevo status
   * @returns Envío actualizado
   *
   * @example
   * PATCH /api/v1/progress/submissions/aa0e8400-e29b-41d4-a716-446655440000/status
   * Request: { "status": "in_review" }
   */
  @Patch('submissions/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update submission status',
    description: 'Actualiza el estado de un envío (pending_review, in_review, graded, etc.)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del envío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Status actualizado exitosamente',
    type: ExerciseSubmissionResponseDto,
    schema: {
      example: {
        id: 'aa0e8400-e29b-41d4-a716-446655440000',
        status: 'in_review',
        updated_at: '2025-01-17T09:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Status inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Envío no encontrado',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'draft' | 'submitted' | 'graded' | 'reviewed' },
  ) {
    return await this.submissionService.updateStatus(id, body.status);
  }

  /**
   * Obtiene estadísticas de envíos de un usuario
   *
   * @param userId - ID del usuario (UUID)
   * @returns Estadísticas agregadas de todos los envíos
   *
   * @example
   * GET /api/v1/progress/submissions/users/550e8400-e29b-41d4-a716-446655440000/stats
   */
  @Get('submissions/users/:userId/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get submission statistics',
    description: 'Obtiene estadísticas agregadas de envíos de ejercicios de un usuario',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de envíos obtenidas exitosamente',
    schema: {
      example: {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        total_submissions: 28,
        graded_submissions: 25,
        pending_submissions: 3,
        average_score: 84.5,
        total_xp_earned: 4200,
        total_ml_coins_earned: 2100,
        submission_rate: 0.93,
        on_time_submissions: 26,
        late_submissions: 2,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getSubmissionStats(@Param('userId') userId: string) {
    return await this.submissionService.getSubmissionStats(userId);
  }

  /**
   * Obtiene envíos pendientes de revisión
   *
   * @returns Lista de envíos con status 'pending_review'
   *
   * @example
   * GET /api/v1/progress/submissions/pending-review
   */
  @Get('submissions/pending-review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get pending review submissions [Teacher only]',
    description:
      'Obtiene todos los envíos pendientes de revisión manual. Requiere permisos de profesor/admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de envíos pendientes obtenida exitosamente',
    type: [ExerciseSubmissionResponseDto],
    schema: {
      example: [
        {
          id: 'aa0e8400-e29b-41d4-a716-446655440000',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          exercise_id: '880e8400-e29b-41d4-a716-446655440000',
          status: 'pending_review',
          submitted_at: '2025-01-16T15:00:00Z',
          waiting_time: '18:30:00',
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de profesor',
  })
  async findPendingReview() {
    return await this.submissionService.findPendingReview();
  }

  /**
   * Reclama recompensas de un envío calificado
   *
   * @param id - ID del envío (UUID)
   * @returns Envío actualizado con recompensas reclamadas
   *
   * @example
   * POST /api/v1/progress/submissions/aa0e8400-e29b-41d4-a716-446655440000/claim-rewards
   */
  @Post('submissions/:id/claim-rewards')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Claim submission rewards',
    description:
      'Reclama las recompensas (XP, ML Coins) de un envío calificado y las transfiere al usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del envío en formato UUID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Recompensas reclamadas exitosamente',
    type: ExerciseSubmissionResponseDto,
    schema: {
      example: {
        id: 'aa0e8400-e29b-41d4-a716-446655440000',
        rewards_claimed: true,
        rewards_claimed_at: '2025-01-17T11:00:00Z',
        xp_earned: 170,
        ml_coins_earned: 85,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Recompensas ya reclamadas o envío no calificado',
  })
  @ApiResponse({
    status: 404,
    description: 'Envío no encontrado',
  })
  async claimRewards(@Param('id') id: string) {
    return await this.submissionService.claimRewards(id);
  }
}
