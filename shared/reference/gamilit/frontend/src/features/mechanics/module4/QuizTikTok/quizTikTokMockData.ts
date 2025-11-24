import { QuizTikTokData } from './quizTikTokTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockQuizTikTokExercises: QuizTikTokData[] = [{
  id: 'tiktok-001',
  title: 'Quiz TikTok: Marie Curie',
  description: 'Responde preguntas sobre Marie Curie con formato vertical',
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 180,
  topic: 'Marie Curie - Quiz Rápido',
  hints: [],
  questions: [
    { id: 'q1', question: '¿En qué año nació Marie Curie?', options: ['1865', '1867', '1870', '1872'], correctAnswer: 1, backgroundColor: '#f59e0b' },
    { id: 'q2', question: '¿Cuántos Premios Nobel ganó?', options: ['1', '2', '3', '4'], correctAnswer: 1, backgroundColor: '#3b82f6' },
    { id: 'q3', question: '¿Qué elemento descubrió primero?', options: ['Radio', 'Polonio', 'Curio', 'Uranio'], correctAnswer: 1, backgroundColor: '#8b5cf6' }
  ]
}];
