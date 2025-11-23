import { InfografiaInteractivaData } from './infografiaInteractivaTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockInfografiaInteractivaExercises: InfografiaInteractivaData[] = [{
  id: 'info-001',
  title: 'Infografía Interactiva: Logros de Marie Curie',
  description: 'Explora los principales logros de Marie Curie haciendo clic en cada tarjeta',
  difficulty: DifficultyLevel.BEGINNER,
  estimatedTime: 360,
  topic: 'Marie Curie - Logros',
  hints: [],
  cards: [
    { id: 'c1', title: 'Primer Nobel', content: 'Premio Nobel de Física en 1903', position: { x: 100, y: 100 }, icon: 'trophy', revealed: false },
    { id: 'c2', title: 'Segundo Nobel', content: 'Premio Nobel de Química en 1911', position: { x: 300, y: 100 }, icon: 'trophy', revealed: false },
    { id: 'c3', title: 'Descubrimiento', content: 'Descubrió Radio y Polonio', position: { x: 200, y: 250 }, icon: 'atom', revealed: false }
  ]
}];
