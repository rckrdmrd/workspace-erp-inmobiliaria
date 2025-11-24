import { EmparejamientoData } from './emparejamientoTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockEmparejamientoExercises: EmparejamientoData[] = [{
  id: 'emp-001',
  title: 'Relaciona palabras con definiciones',
  description: 'Conecta cada descubrimiento con su descripción correcta. Empareja los elementos científicos descubiertos por Marie Curie con sus características. Módulo 1 - Ejercicio 3',
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 360,
  topic: 'Marie Curie - Módulo 1: Comprensión Literal',
  hints: [
    { id: 'h1', text: 'El Radio es conocido por brillar en la oscuridad', cost: 15 },
    { id: 'h2', text: 'El Polonio fue nombrado por Polonia, país natal de Marie', cost: 15 },
    { id: 'h3', text: 'La Pechblenda es un mineral rico en uranio', cost: 15 }
  ],
  cards: [
    { id: 'q1', content: 'Radio', matchId: 'm1', type: 'question', isFlipped: false, isMatched: false },
    { id: 'a1', content: 'Elemento que brilla en la oscuridad', matchId: 'm1', type: 'answer', isFlipped: false, isMatched: false },
    { id: 'q2', content: 'Polonio', matchId: 'm2', type: 'question', isFlipped: false, isMatched: false },
    { id: 'a2', content: 'Elemento nombrado en honor a su país natal', matchId: 'm2', type: 'answer', isFlipped: false, isMatched: false },
    { id: 'q3', content: 'Radiactividad', matchId: 'm3', type: 'question', isFlipped: false, isMatched: false },
    { id: 'a3', content: 'Término acuñado por Marie para describir la emisión de rayos', matchId: 'm3', type: 'answer', isFlipped: false, isMatched: false },
    { id: 'q4', content: 'Pechblenda', matchId: 'm4', type: 'question', isFlipped: false, isMatched: false },
    { id: 'a4', content: 'Mineral del cual extrajo elementos radiactivos', matchId: 'm4', type: 'answer', isFlipped: false, isMatched: false }
  ]
}];
