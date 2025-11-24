import { AnalisisMemesData } from './analisisMemesTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockAnalisisMemesExercises: AnalisisMemesData[] = [{
  id: 'meme-001',
  title: 'Análisis de Meme: Marie Curie en la Cultura Popular',
  description: 'Analiza un meme sobre Marie Curie identificando elementos clave',
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 420,
  topic: 'Marie Curie - Análisis Visual',
  hints: [{ id: 'h1', text: 'Busca referencias a la radioactividad', cost: 5 }],
  memeUrl: '/images/marie-curie-meme.jpg',
  memeTitle: 'Marie Curie trabajando con elementos radioactivos',
  expectedAnnotations: [
    { id: 'a1', x: 100, y: 100, text: 'Referencia a radioactividad', category: 'contexto' },
    { id: 'a2', x: 200, y: 150, text: 'Humor sobre peligros del laboratorio', category: 'humor' }
  ]
}];
