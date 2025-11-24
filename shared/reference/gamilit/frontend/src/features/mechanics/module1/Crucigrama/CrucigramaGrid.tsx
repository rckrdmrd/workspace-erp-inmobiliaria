import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CrucigramaCell } from './crucigramaTypes';
import { cn } from '@shared/utils/cn';

export interface CrucigramaGridProps {
  grid: CrucigramaCell[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellInput: (row: number, col: number, value: string) => void;
}

export const CrucigramaGrid: React.FC<CrucigramaGridProps> = ({
  grid,
  selectedCell,
  onCellClick,
  onCellInput
}) => {
  const cellRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (selectedCell) {
      const key = `${selectedCell.row}-${selectedCell.col}`;
      cellRefs.current[key]?.focus();
    }
  }, [selectedCell]);

  const handleKeyDown = (
    e: React.KeyboardEvent,
    row: number,
    col: number
  ) => {
    if (e.key === 'ArrowRight' && col < grid[0].length - 1) {
      onCellClick(row, col + 1);
    } else if (e.key === 'ArrowLeft' && col > 0) {
      onCellClick(row, col - 1);
    } else if (e.key === 'ArrowDown' && row < grid.length - 1) {
      onCellClick(row + 1, col);
    } else if (e.key === 'ArrowUp' && row > 0) {
      onCellClick(row - 1, col);
    } else if (e.key === 'Backspace') {
      onCellInput(row, col, '');
    }
  };

  return (
    <div className="inline-block bg-white p-4 rounded-lg shadow-lg">
      <div
        role="grid"
        aria-label="Grid del crucigrama"
        className="gap-px bg-gray-300 border-2 border-gray-400"
      >
        {grid.map((rowCells, rowIndex) => (
          <div key={rowIndex} role="row" className="flex">
            {rowCells.map((cell, colIndex) => {
              const key = `${cell.row}-${cell.col}`;
              const isSelected =
                selectedCell?.row === cell.row && selectedCell?.col === cell.col;

              if (cell.isBlack) {
                return (
                  <div
                    key={key}
                    role="gridcell"
                    aria-rowindex={rowIndex + 1}
                    aria-colindex={colIndex + 1}
                    aria-label="Celda bloqueada"
                    className="w-10 h-10 bg-gray-800"
                  />
                );
              }

              const cellLabel = cell.number
                ? `Celda ${cell.number}`
                : `Fila ${rowIndex + 1}, columna ${colIndex + 1}`;

              return (
                <motion.div
                  key={key}
                  role="gridcell"
                  aria-rowindex={rowIndex + 1}
                  aria-colindex={colIndex + 1}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'w-10 h-10 bg-white relative cursor-pointer',
                    isSelected && 'ring-2 ring-blue-500'
                  )}
                  onClick={() => onCellClick(cell.row, cell.col)}
                >
                  {/* Display multiple numbers if they exist */}
                  {cell.numbers && cell.numbers.length > 0 ? (
                    <span
                      className="absolute top-0 left-0.5 text-[10px] font-bold text-gray-600 leading-tight"
                      aria-hidden="true"
                    >
                      {cell.numbers.join(',')}
                    </span>
                  ) : cell.number ? (
                    <span
                      className="absolute top-0 left-0.5 text-xs font-bold text-gray-600"
                      aria-hidden="true"
                    >
                      {cell.number}
                    </span>
                  ) : null}
                  <input
                    ref={(el) => { cellRefs.current[key] = el; }}
                    type="text"
                    maxLength={1}
                    value={cell.userInput || ''}
                    onChange={(e) =>
                      onCellInput(cell.row, cell.col, e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => handleKeyDown(e, cell.row, cell.col)}
                    aria-label={cellLabel}
                    className="w-full h-full text-center text-lg font-bold uppercase bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    style={{ caretColor: 'transparent' }}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
