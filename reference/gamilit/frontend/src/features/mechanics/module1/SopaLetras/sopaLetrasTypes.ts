import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

/**
 * Configuración de Sopa de Letras (mapea a exercise.config en BD)
 */
export interface SopaLetrasConfig {
  gridSize: {
    rows: number;
    cols: number;
  };
  useStaticGrid?: boolean;  // Si true, usar grid estático del PDF
  directions?: string[];  // Direcciones permitidas
  selectionMode?: string;  // Modo de selección (click-drag, click-click)
  highlightFound?: boolean;  // Resaltar palabras encontradas
}

/**
 * Posición de palabra en el grid (viene de exercise.content.wordsPositions en BD)
 */
export interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction:
    | 'horizontal'
    | 'vertical'
    | 'diagonal'
    | 'horizontal-reverse'
    | 'vertical-reverse'
    | 'diagonal-reverse';
  found?: boolean;  // Estado local del frontend
}

/**
 * Contenido de Sopa de Letras (mapea a exercise.content en BD)
 * ⚠️ FE-059: wordsPositions is NEVER sent by backend (sanitized for security)
 */
export interface SopaLetrasContent {
  grid: string[][];  // Grid estático (si useStaticGrid=true) o generado
  words: string[];  // Lista de palabras a buscar
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  wordsPositions?: never;
}

/**
 * Datos completos de Sopa de Letras
 */
export interface SopaLetrasData extends BaseExercise {
  config: SopaLetrasConfig;
  content: SopaLetrasContent;
  // Propiedades de conveniencia (derivadas de config)
  rows: number;  // = config.gridSize.rows
  cols: number;  // = config.gridSize.cols
}

/**
 * Celda seleccionada (estado local)
 */
export interface SelectedCell {
  row: number;
  col: number;
}
