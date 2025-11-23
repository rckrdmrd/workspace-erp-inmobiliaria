import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface ConceptNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

export interface MapaConceptualData extends BaseExercise {
  nodes: ConceptNode[];
  connections: Connection[];
  correctConnections: string[];
}
