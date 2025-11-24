import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDiscussionThreadDto } from './create-discussion-thread.dto';

/**
 * UpdateDiscussionThreadDto
 *
 * @description DTO para actualizar un hilo de discusión
 * @extends CreateDiscussionThreadDto (todos los campos son opcionales excepto IDs de relación)
 * @see Entity: DiscussionThread
 * @see DDL: social_features.discussion_threads
 *
 * @note Se usa típicamente para:
 *       - Actualizar título o contenido
 *       - Fijar/desfijar thread (is_pinned)
 *       - Bloquear/desbloquear thread (is_locked)
 *       - NO se actualizan classroom_id, team_id, created_by (son fijos)
 *
 * @created 2025-11-11 (DB-100 Ciclo B.3)
 * @version 1.0
 */
export class UpdateDiscussionThreadDto extends PartialType(
  OmitType(CreateDiscussionThreadDto, ['classroom_id', 'team_id', 'created_by'] as const),
) {}
