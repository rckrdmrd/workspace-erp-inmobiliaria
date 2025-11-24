import React, { useState } from 'react';
import { motion } from 'framer-motion';
// TODO: Implement these exercise components
// import { DraggableItem, DropZone, CategoryBadge, InlineFeedback } from '@shared/components/exercises';
import { cn } from '@shared/utils/cn';

export interface MatchingPair {
  id: string;
  itemA: string;
  itemB: string;
  category?: string;
}

export interface MatchingDragDropProps {
  pairs: MatchingPair[];
  connections: Map<string, string>; // itemB id -> itemA id
  onConnect: (itemAId: string, itemBId: string) => void;
  onDisconnect: (itemBId: string) => void;
  showFeedback?: boolean;
  groupALabel?: string;
  groupBLabel?: string;
}

export const MatchingDragDrop: React.FC<MatchingDragDropProps> = ({
  pairs,
  connections,
  onConnect,
  onDisconnect,
  showFeedback = false,
  groupALabel = 'Grupo A',
  groupBLabel = 'Grupo B',
}) => {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  const handleDrop = (itemAId: string, itemBId: string) => {
    onConnect(itemAId, itemBId);
    setDraggingItemId(null);
  };

  const isConnectionCorrect = (itemBId: string): boolean | null => {
    if (!showFeedback) return null;
    const connectedItemAId = connections.get(itemBId);
    if (!connectedItemAId) return null;

    const pair = pairs.find(p => p.id === itemBId);
    return pair?.itemA === connectedItemAId;
  };

  // Items del grupo A que no están conectados
  const unconnectedItemsA = pairs.filter(
    (pair) => !Array.from(connections.values()).includes(pair.id)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Columna A - Items para arrastrar */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <CategoryBadge type="groupA" />
          {groupALabel}
        </h4>

        <div className="space-y-3">
          {pairs.map((pair, index) => {
            const isConnected = Array.from(connections.values()).includes(pair.id);

            return (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DraggableItem
                  id={pair.id}
                  variant="blue"

                  isConnected={isConnected}
                  onDragStart={() => setDraggingItemId(pair.id)}
                  onDragEnd={() => setDraggingItemId(null)}
                >
                  <div className="flex items-start gap-2">
                    <CategoryBadge type="groupA" />
                    <p className="text-sm text-gray-800 flex-1">{pair.itemA}</p>
                  </div>
                </DraggableItem>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Columna B - Zonas de drop */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <CategoryBadge type="groupB" />
          {groupBLabel}
        </h4>

        <div className="space-y-3">
          {pairs.map((pair, index) => {
            const connectedItemAId = connections.get(pair.id);
            const isCorrect = isConnectionCorrect(pair.id);
            const isEmpty = !connectedItemAId;

            // Find the connected item A
            const connectedPair = connectedItemAId
              ? pairs.find((p) => p.id === connectedItemAId)
              : null;

            return (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all',
                    'bg-white',
                    isCorrect === true && 'border-green-300 bg-green-50',
                    isCorrect === false && 'border-red-300 bg-red-50',
                    isCorrect === null && 'border-orange-300'
                  )}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <CategoryBadge type="groupB" />
                    <p className="text-sm text-gray-800 flex-1 font-medium">
                      {pair.itemB}
                    </p>
                  </div>

                  {/* Drop Zone */}
                  <DropZone
                    id={pair.id}
                    variant="matching"
                    isEmpty={isEmpty}
                    onDrop={(itemAId: string) => handleDrop(itemAId, pair.id)}
                    minHeight="60px"
                  >
                    {connectedPair && (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <CategoryBadge type="groupA" />
                          <p className="text-sm text-gray-700">
                            {connectedPair.itemA}
                          </p>
                        </div>
                        <button
                          onClick={() => onDisconnect(pair.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                          title="Desconectar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </DropZone>
                </div>

                {/* Inline Feedback */}
                {showFeedback && connectedItemAId && (
                  <InlineFeedback
                    type={isCorrect ? 'correct' : 'incorrect'}
                    message={
                      isCorrect
                        ? '¡Correcto! Esta es la pareja adecuada.'
                        : 'Esta pareja no es correcta. Intenta con otra opción.'
                    }
                    show={true}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingDragDrop;
