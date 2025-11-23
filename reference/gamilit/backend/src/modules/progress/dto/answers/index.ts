/**
 * Exercise Answer DTOs - Index
 *
 * @description Exports all 18 exercise answer DTOs and the validator utility
 * (15 original + 3 additional for discrepancy fixes)
 *
 * FE-059: Centralized answer validation for all exercise types
 * DB-117: Additional DTOs for discrepancy resolution
 */

// Module 1 - Literal Comprehension
export { WordSearchAnswersDto } from './word-search-answers.dto';
export { TrueFalseAnswersDto } from './true-false-answers.dto';
export { CrucigramaAnswersDto } from './crucigrama-answers.dto';
export { TimelineAnswersDto } from './timeline-answers.dto';
export { FillInBlankAnswersDto } from './fill-in-blank-answers.dto';

// Module 2 - Inferential Comprehension
export { DetectiveTextualAnswersDto } from './detective-textual-answers.dto';
export { ConstruccionHipotesisAnswersDto } from './construccion-hipotesis-answers.dto';
export { PrediccionNarrativaAnswersDto } from './prediccion-narrativa-answers.dto';
export { PuzzleContextoAnswersDto } from './puzzle-contexto-answers.dto';
export { RuedaInferenciasAnswersDto } from './rueda-inferencias-answers.dto';

// Module 3 - Critical Thinking
export { TribunalOpinionesAnswersDto } from './tribunal-opiniones-answers.dto';
export { AnalisisFuentesAnswersDto } from './analisis-fuentes-answers.dto';
export { DebateDigitalAnswersDto } from './debate-digital-answers.dto';
export { PodcastArgumentativoAnswersDto } from './podcast-argumentativo-answers.dto';
export { MatrizPerspectivasAnswersDto } from './matriz-perspectivas-answers.dto';

// Discrepancy Fixes (DB-117)
export { DetectiveConnectionsAnswersDto } from './detective-connections-answers.dto';
export { PredictionScenariosAnswersDto } from './prediction-scenarios-answers.dto';
export { CauseEffectMatchingAnswersDto } from './cause-effect-matching-answers.dto';

// Validator utility
export { ExerciseAnswerValidator } from './exercise-answer.validator';
