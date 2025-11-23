import { Expose } from 'class-transformer';
import {
  DifficultyLevelEnum,
  ContentStatusEnum,
} from '@shared/constants/enums.constants';

/**
 * ModuleResponseDto
 *
 * @description DTO de respuesta con información completa del módulo.
 *              Utilizado para retornar datos del módulo al cliente.
 */
export class ModuleResponseDto {
  @Expose()
  id!: string;

  @Expose()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  @Expose()
  title!: string;

  @Expose()
  subtitle?: string;

  @Expose()
  description?: string;

  @Expose()
  summary?: string;

  @Expose()
  content!: Record<string, any>;

  @Expose()
  order_index!: number;

  @Expose()
  module_code?: string;

  // =====================================================
  // DIFFICULTY & CONTENT
  // =====================================================

  @Expose()
  difficulty_level!: DifficultyLevelEnum;

  @Expose()
  grade_levels!: string[];

  @Expose()
  subjects!: string[];

  // =====================================================
  // TIMING & DURATION
  // =====================================================

  @Expose()
  estimated_duration_minutes!: number;

  @Expose()
  estimated_sessions!: number;

  // =====================================================
  // LEARNING OBJECTIVES & COMPETENCIES
  // =====================================================

  @Expose()
  learning_objectives?: string[];

  @Expose()
  competencies?: string[];

  @Expose()
  skills_developed?: string[];

  // =====================================================
  // PREREQUISITES
  // =====================================================

  @Expose()
  prerequisites?: string[];

  @Expose()
  prerequisite_skills?: string[];

  // =====================================================
  // GAMIFICATION & REWARDS
  // =====================================================

  @Expose()
  maya_rank_required?: string;

  @Expose()
  maya_rank_granted?: string;

  @Expose()
  xp_reward!: number;

  @Expose()
  ml_coins_reward!: number;

  // =====================================================
  // STATUS & PUBLICATION
  // =====================================================

  @Expose()
  status!: ContentStatusEnum;

  @Expose()
  is_published!: boolean;

  @Expose()
  is_featured!: boolean;

  @Expose()
  is_free!: boolean;

  @Expose()
  is_demo_module!: boolean;

  @Expose()
  published_at?: Date;

  @Expose()
  archived_at?: Date;

  // =====================================================
  // VERSIONING & REVISION
  // =====================================================

  @Expose()
  version!: number;

  @Expose()
  version_notes?: string;

  @Expose()
  created_by?: string;

  @Expose()
  reviewed_by?: string;

  @Expose()
  approved_by?: string;

  // =====================================================
  // METADATA & INDEXING
  // =====================================================

  @Expose()
  keywords?: string[];

  @Expose()
  tags?: string[];

  @Expose()
  thumbnail_url?: string;

  @Expose()
  cover_image_url?: string;

  @Expose()
  settings!: Record<string, any>;

  @Expose()
  metadata!: Record<string, any>;

  // =====================================================
  // AUDIT FIELDS
  // =====================================================

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;

  @Expose()
  total_exercises!: number;
}
