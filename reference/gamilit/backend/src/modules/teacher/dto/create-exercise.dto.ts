/**
 * DTOs for Exercise Creation
 */

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExerciseType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  DRAG_DROP = 'drag_drop',
  ORDERING = 'ordering',
  MATCHING = 'matching',
}

export enum ExerciseDifficulty {
  FACIL = 'facil',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  EXPERTO = 'experto',
}

// Hint DTO
export class HintDto {
  @ApiProperty({ description: 'Hint text' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ description: 'ML Coins cost for this hint' })
  @IsNumber()
  @Min(0)
  ml_coins_cost!: number;

  @ApiProperty({ description: 'Display order' })
  @IsNumber()
  @Min(0)
  order!: number;
}

// Multiple Choice Content
export class OptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty()
  @IsBoolean()
  is_correct!: boolean;
}

export class MultipleChoiceContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question!: string;

  @ApiProperty({ type: [OptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options!: OptionDto[];
}

// True/False Content
export class TrueFalseContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  statement!: string;

  @ApiProperty()
  @IsBoolean()
  correct_answer!: boolean;
}

// Fill Blank Content
export class BlankDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  position!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  correct_answer!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  accept_variations?: string[];
}

export class FillBlankContentDto {
  @ApiProperty({ description: 'Text with ___ placeholders for blanks' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ type: [BlankDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlankDto)
  blanks!: BlankDto[];
}

// Ordering Content
export class SequenceItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  correct_position!: number;
}

export class OrderingContentDto {
  @ApiProperty({ type: [SequenceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SequenceItemDto)
  sequence!: SequenceItemDto[];
}

// Drag Drop Content
export class DragItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image_url?: string;
}

export class DropZoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty()
  @IsBoolean()
  accepts_multiple!: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  correct_items!: string[];
}

export class DragDropContentDto {
  @ApiProperty({ type: [DragItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DragItemDto)
  items!: DragItemDto[];

  @ApiProperty({ type: [DropZoneDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DropZoneDto)
  drop_zones!: DropZoneDto[];
}

// Matching Content
export class MatchItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image_url?: string;
}

export class MatchPairDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  left_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  right_id!: string;
}

export class MatchingContentDto {
  @ApiProperty({ type: [MatchItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchItemDto)
  left_items!: MatchItemDto[];

  @ApiProperty({ type: [MatchItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchItemDto)
  right_items!: MatchItemDto[];

  @ApiProperty({ type: [MatchPairDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchPairDto)
  correct_pairs!: MatchPairDto[];
}

// Main Create Exercise DTO
export class CreateExerciseDto {
  @ApiProperty({ description: 'Exercise title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Exercise instructions' })
  @IsString()
  @IsNotEmpty()
  instructions!: string;

  @ApiProperty({ enum: ExerciseType })
  @IsEnum(ExerciseType)
  type!: ExerciseType;

  @ApiProperty({ enum: ExerciseDifficulty })
  @IsEnum(ExerciseDifficulty)
  difficulty!: ExerciseDifficulty;

  @ApiProperty({ description: 'XP reward for completion' })
  @IsNumber()
  @Min(0)
  xp_reward!: number;

  @ApiProperty({ description: 'ML Coins reward for completion' })
  @IsNumber()
  @Min(0)
  ml_coins_reward!: number;

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  time_limit_seconds?: number;

  @ApiPropertyOptional({ description: 'Module ID to assign to' })
  @IsUUID()
  @IsOptional()
  module_id?: string;

  @ApiPropertyOptional({ description: 'Activity ID to assign to' })
  @IsUUID()
  @IsOptional()
  activity_id?: string;

  @ApiPropertyOptional({ type: [HintDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HintDto)
  @IsOptional()
  hints?: HintDto[];

  @ApiProperty({ description: 'Exercise content (type-specific)' })
  @IsNotEmpty()
  content!:
    | MultipleChoiceContentDto
    | TrueFalseContentDto
    | FillBlankContentDto
    | OrderingContentDto
    | DragDropContentDto
    | MatchingContentDto;

  @ApiProperty({ description: 'Whether to publish immediately' })
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}

export class UpdateExerciseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({ enum: ExerciseDifficulty })
  @IsEnum(ExerciseDifficulty)
  @IsOptional()
  difficulty?: ExerciseDifficulty;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  xp_reward?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  ml_coins_reward?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  time_limit_seconds?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}
