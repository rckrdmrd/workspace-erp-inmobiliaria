import { IsObject, IsNotEmpty, IsArray, ValidateNested, IsString, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Classification type for statements
 * Based on DocumentoDeDiseño_Mecanicas_GAMILIT_v6.3
 */
export enum StatementClassification {
  HECHO = 'hecho',           // Verifiable fact
  OPINION = 'opinion',       // Subjective value judgment
  INTERPRETACION = 'interpretacion' // Reasonable deduction based on evidence
}

/**
 * Verdict for statement evaluation
 */
export enum StatementVerdict {
  BIEN_FUNDAMENTADA = 'bien_fundamentada',        // ✅ Solid evidence + valid logic
  PARCIALMENTE_FUNDAMENTADA = 'parcialmente_fundamentada', // ⚠️ Has evidence but limited
  SIN_FUNDAMENTO = 'sin_fundamento'               // ❌ No evidence or invalid logic
}

/**
 * Individual statement evaluation by user
 */
export class StatementEvaluation {
  @IsString()
  @IsNotEmpty()
  statementId!: string;

  @IsEnum(StatementClassification, {
    message: 'classification must be hecho, opinion, or interpretacion'
  })
  classification!: StatementClassification;

  @IsEnum(StatementVerdict, {
    message: 'verdict must be bien_fundamentada, parcialmente_fundamentada, or sin_fundamento'
  })
  verdict!: StatementVerdict;

  @IsString()
  @IsOptional()
  justification?: string; // 2-3 line justification (optional but recommended)
}

/**
 * TribunalOpinionesAnswersDto
 *
 * @description DTO for validating Tribunal de Opiniones (Module 3.1) answers
 * Classification of statements as HECHO/OPINIÓN/INTERPRETACIÓN
 * and evaluation of their foundations
 *
 * Expected format from frontend:
 * {
 *   "evaluations": [
 *     {
 *       "statementId": "stmt-1",
 *       "classification": "hecho",
 *       "verdict": "bien_fundamentada",
 *       "justification": "Dato histórico verificable en registros oficiales"
 *     },
 *     {
 *       "statementId": "stmt-2",
 *       "classification": "opinion",
 *       "verdict": "sin_fundamento",
 *       "justification": "Juicio de valor subjetivo sin criterios objetivos"
 *     }
 *   ]
 * }
 *
 * Aligned with DocumentoDeDiseño_Mecanicas_GAMILIT_v6.3
 */
export class TribunalOpinionesAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatementEvaluation)
  @IsNotEmpty({ message: 'evaluations array is required' })
  evaluations!: StatementEvaluation[];

  constructor() {
    this.evaluations = [];
  }
}
