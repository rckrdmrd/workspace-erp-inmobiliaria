import { MapaConceptualData } from './mapaConceptualTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockMapaConceptualExercises: MapaConceptualData[] = [{
  id: 'mapa-001',
  title: 'Mapa Conceptual: Descubrimientos de Marie Curie',
  description: 'Conecta los conceptos relacionados con los descubrimientos de Marie Curie',
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 600,
  topic: 'Marie Curie - Conceptos',
  hints: [{ id: 'hint-m1', text: 'El polonio y el radio son elementos', cost: 5 }],
  nodes: [
    { id: 'n1', label: 'Marie Curie', x: 400, y: 50, category: 'persona' },
    { id: 'n2', label: 'Radioactividad', x: 200, y: 150, category: 'fenomeno' },
    { id: 'n3', label: 'Polonio', x: 400, y: 250, category: 'elemento' },
    { id: 'n4', label: 'Radio', x: 600, y: 250, category: 'elemento' },
    { id: 'n5', label: 'Premio Nobel', x: 400, y: 350, category: 'premio' }
  ],
  connections: [],
  correctConnections: ['n1-n2', 'n1-n3', 'n1-n4', 'n2-n3', 'n2-n4', 'n1-n5']
}];
