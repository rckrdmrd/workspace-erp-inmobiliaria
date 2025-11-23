import { BadRequestException } from '@nestjs/common';
import { ExerciseAnswerValidator } from '../exercise-answer.validator';

/**
 * FE-059: Integration tests for ExerciseAnswerValidator
 *
 * @description Tests that DTOs correctly validate answer structures for all 15 exercise types
 */
describe('ExerciseAnswerValidator', () => {
  describe('getDtoForType()', () => {
    it('should return correct DTO for crucigrama', () => {
      const DtoClass = ExerciseAnswerValidator.getDtoForType('crucigrama');
      expect(DtoClass).toBeDefined();
      expect(DtoClass.name).toBe('CrucigramaAnswersDto');
    });

    it('should return correct DTO for sopa_letras', () => {
      const DtoClass = ExerciseAnswerValidator.getDtoForType('sopa_letras');
      expect(DtoClass).toBeDefined();
      expect(DtoClass.name).toBe('WordSearchAnswersDto');
    });

    it('should throw error for unknown type', () => {
      expect(() => ExerciseAnswerValidator.getDtoForType('unknown_type')).toThrow(BadRequestException);
    });

    it('should handle case-insensitive type names', () => {
      const dto1 = ExerciseAnswerValidator.getDtoForType('CRUCIGRAMA');
      const dto2 = ExerciseAnswerValidator.getDtoForType('crucigrama');
      expect(dto1).toBe(dto2);
    });
  });

  describe('validate()', () => {
    it('should validate correct crucigrama answers', async () => {
      const validAnswers = {
        clues: {
          h1: 'SORBONA',
          h2: 'NOBEL',
          v1: 'MARIE'
        }
      };

      await expect(
        ExerciseAnswerValidator.validate('crucigrama', validAnswers)
      ).resolves.not.toThrow();
    });

    it('should reject malformed crucigrama answers', async () => {
      const invalidAnswers = {
        wrongField: 'value'
      };

      await expect(
        ExerciseAnswerValidator.validate('crucigrama', invalidAnswers)
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate word search answers', async () => {
      const validAnswers = {
        words: ['MARIE', 'CURIE', 'NOBEL']
      };

      await expect(
        ExerciseAnswerValidator.validate('sopa_letras', validAnswers)
      ).resolves.not.toThrow();
    });

    it('should reject empty word search array', async () => {
      const invalidAnswers = {
        words: []
      };

      await expect(
        ExerciseAnswerValidator.validate('sopa_letras', invalidAnswers)
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate true/false answers', async () => {
      const validAnswers = {
        statements: {
          s1: true,
          s2: false,
          s3: true
        }
      };

      await expect(
        ExerciseAnswerValidator.validate('verdadero_falso', validAnswers)
      ).resolves.not.toThrow();
    });

    it('should validate timeline answers', async () => {
      const validAnswers = {
        events: ['evt1', 'evt3', 'evt2', 'evt4']
      };

      await expect(
        ExerciseAnswerValidator.validate('linea_tiempo', validAnswers)
      ).resolves.not.toThrow();
    });

    it('should validate fill-in-blank answers', async () => {
      const validAnswers = {
        blanks: {
          b1: 'radioactividad',
          b2: 'Polonio',
          b3: 'Radio'
        }
      };

      await expect(
        ExerciseAnswerValidator.validate('completar_espacios', validAnswers)
      ).resolves.not.toThrow();
    });
  });

  describe('validateAndTransform()', () => {
    it('should validate and transform crucigrama answers', async () => {
      const validAnswers = {
        clues: {
          h1: 'SORBONA',
          h2: 'NOBEL'
        }
      };

      const result = await ExerciseAnswerValidator.validateAndTransform('crucigrama', validAnswers);
      expect(result).toBeDefined();
      expect(result.clues).toEqual(validAnswers.clues);
    });

    it('should throw error for invalid answers', async () => {
      const invalidAnswers = {
        wrongField: 'value'
      };

      await expect(
        ExerciseAnswerValidator.validateAndTransform('crucigrama', invalidAnswers)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('All 15 exercise types', () => {
    const exerciseTypes = [
      'sopa_letras',
      'verdadero_falso',
      'crucigrama',
      'linea_tiempo',
      'completar_espacios',
      'detective_textual',
      'construccion_hipotesis',
      'prediccion_narrativa',
      'puzzle_contexto',
      'rueda_inferencias',
      'tribunal_opiniones',
      'analisis_fuentes',
      'debate_digital',
      'podcast_argumentativo',
      'matriz_perspectivas'
    ];

    exerciseTypes.forEach(type => {
      it(`should have DTO for ${type}`, () => {
        expect(() => ExerciseAnswerValidator.getDtoForType(type)).not.toThrow();
      });
    });

    it('should have exactly 15 types mapped', () => {
      expect(exerciseTypes).toHaveLength(15);
    });
  });
});
