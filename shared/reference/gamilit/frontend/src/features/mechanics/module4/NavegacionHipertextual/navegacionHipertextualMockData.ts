import { NavegacionHipertextualData } from './navegacionHipertextualTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockNavegacionHipertextualExercises: NavegacionHipertextualData[] = [{
  id: 'nav-001',
  title: 'Navegación Hipertextual: Vida de Marie Curie',
  description: 'Explora la biografía de Marie Curie siguiendo enlaces',
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 480,
  topic: 'Marie Curie - Biografía Interactiva',
  hints: [],
  nodes: [
    { id: 'n1', title: 'Inicio', content: 'Marie Curie fue una científica polaca...', links: [{ targetId: 'n2', label: 'Infancia' }, { targetId: 'n3', label: 'Estudios' }] },
    { id: 'n2', title: 'Infancia', content: 'Nació en Varsovia en 1867...', links: [{ targetId: 'n3', label: 'Siguente' }] },
    { id: 'n3', title: 'Estudios', content: 'Estudió en la Sorbona...', links: [{ targetId: 'n1', label: 'Volver' }] }
  ],
  startNodeId: 'n1',
  targetNodeId: 'n3'
}];
