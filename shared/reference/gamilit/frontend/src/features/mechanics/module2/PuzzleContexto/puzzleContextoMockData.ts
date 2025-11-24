import type { PuzzleContextoData } from './puzzleContextoTypes';

export const mockPuzzleData: PuzzleContextoData = {
  id: 'ex-2-4',
  title: 'Puzzle de Contexto',
  subtitle: 'Ordenar fragmentos para crear una inferencia coherente',
  description: 'Ordena los fragmentos para formar una inferencia completa y coherente sobre Marie Curie.',
  instructions: 'Arrastra los fragmentos desordenados al área de construcción para formar la inferencia en el orden correcto.',
  completeInference: 'A pesar de las barreras sociales y económicas que enfrentó como mujer inmigrante, demostró una determinación extraordinaria, convirtiéndose en pionera de la ciencia moderna.',
  fragments: [
    {
      id: 'frag-a',
      label: 'A',
      text: 'demostró una determinación extraordinaria',
      correctPosition: 2
    },
    {
      id: 'frag-b',
      label: 'B',
      text: 'A pesar de las barreras sociales y económicas',
      correctPosition: 0
    },
    {
      id: 'frag-c',
      label: 'C',
      text: 'que enfrentó como mujer inmigrante',
      correctPosition: 1
    },
    {
      id: 'frag-d',
      label: 'D',
      text: 'convirtiéndose en pionera de la ciencia moderna',
      correctPosition: 3
    }
  ],
  correctOrder: ['frag-b', 'frag-c', 'frag-a', 'frag-d']
};
