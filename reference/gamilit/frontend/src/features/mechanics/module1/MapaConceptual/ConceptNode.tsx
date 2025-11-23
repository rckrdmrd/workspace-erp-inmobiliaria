import React from 'react';
import { motion } from 'framer-motion';
import { ConceptNode as NodeType } from './mapaConceptualTypes';
import { cn } from '@shared/utils/cn';

export const ConceptNode: React.FC<{ node: NodeType; isSelected: boolean; onClick: () => void }> = ({ node, isSelected, onClick }) => (
  <motion.div
    drag
    dragMomentum={false}
    whileHover={{ scale: 1.1 }}
    onClick={onClick}
    style={{ left: node.x, top: node.y }}
    className={cn('absolute px-4 py-2 rounded-lg font-semibold cursor-pointer transform -translate-x-1/2 -translate-y-1/2', isSelected ? 'bg-blue-500 text-white ring-4 ring-blue-300' : 'bg-white border-2 border-gray-300 hover:border-blue-400')}
  >
    {node.label}
  </motion.div>
);
