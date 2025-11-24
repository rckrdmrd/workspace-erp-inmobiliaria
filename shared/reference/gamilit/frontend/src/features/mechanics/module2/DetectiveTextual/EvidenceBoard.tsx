/**
 * Evidence Board Component - Connection visualization for Detective Textual
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Check, X } from 'lucide-react';
import type { Evidence, EvidenceConnection } from './detectiveTextualTypes';

interface EvidenceBoardProps {
  evidence: Evidence[];
  connections: EvidenceConnection[];
  onCreateConnection: (fromId: string, toId: string, relationship: string) => void;
  onRemoveConnection: (connectionId: string) => void;
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  evidence,
  connections,
  onCreateConnection,
  onRemoveConnection,
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [relationship, setRelationship] = useState('');

  const discoveredEvidence = evidence.filter((e) => e.discovered);

  const handleEvidenceClick = (evidenceId: string) => {
    if (!connectionMode) {
      setConnectionMode(true);
      setSelectedEvidence(evidenceId);
    } else if (selectedEvidence === evidenceId) {
      setConnectionMode(false);
      setSelectedEvidence(null);
    } else {
      if (relationship.trim()) {
        onCreateConnection(selectedEvidence!, evidenceId, relationship);
        setConnectionMode(false);
        setSelectedEvidence(null);
        setRelationship('');
      }
    }
  };

  return (
    <div className="w-full h-full bg-detective-bg-secondary rounded-detective p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-detective-xl font-bold text-detective-blue">
          Tablero de Evidencias
        </h3>
        <div className="flex items-center gap-2">
          <Link2 className={`w-5 h-5 ${connectionMode ? 'text-detective-orange' : 'text-detective-text-secondary'}`} />
          <span className="text-detective-sm text-detective-text-secondary">
            {connectionMode ? 'Selecciona segunda evidencia' : 'Click para conectar'}
          </span>
        </div>
      </div>

      {connectionMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-white p-4 rounded-lg border-2 border-detective-orange"
        >
          <label className="block text-detective-sm font-medium text-detective-text mb-2">
            ¿Cómo se relacionan estas evidencias?
          </label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Describe la relación..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-detective-orange"
          />
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <AnimatePresence>
          {discoveredEvidence.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleEvidenceClick(ev.id)}
              className={`
                p-4 rounded-lg cursor-pointer transition-all
                ${selectedEvidence === ev.id ? 'bg-detective-orange text-white shadow-orange-lg' : 'bg-white text-detective-text shadow-card hover:shadow-card-hover'}
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-detective-xs font-semibold uppercase tracking-wide">
                  {ev.type}
                </span>
                <span className="text-detective-xs opacity-70">
                  {ev.date || 'Sin fecha'}
                </span>
              </div>
              <h4 className="text-detective-sm font-bold mb-2">{ev.title}</h4>
              <p className="text-detective-xs line-clamp-3">{ev.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h4 className="text-detective-base font-semibold text-detective-blue mb-3">
          Conexiones Identificadas ({connections.length})
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {connections.map((conn) => {
            const fromEv = evidence.find((e) => e.id === conn.fromEvidenceId);
            const toEv = evidence.find((e) => e.id === conn.toEvidenceId);

            return (
              <motion.div
                key={conn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 bg-detective-bg rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-detective-xs font-medium text-detective-orange">
                      {fromEv?.title}
                    </span>
                    <Link2 className="w-3 h-3 text-detective-text-secondary" />
                    <span className="text-detective-xs font-medium text-detective-orange">
                      {toEv?.title}
                    </span>
                  </div>
                  <p className="text-detective-xs text-detective-text-secondary">
                    {conn.relationship}
                  </p>
                </div>
                {conn.isCorrect !== undefined && (
                  <div className="flex-shrink-0">
                    {conn.isCorrect ? (
                      <Check className="w-5 h-5 text-detective-success" />
                    ) : (
                      <X className="w-5 h-5 text-detective-danger" />
                    )}
                  </div>
                )}
                {conn.userCreated && (
                  <button
                    onClick={() => onRemoveConnection(conn.id)}
                    className="flex-shrink-0 text-detective-danger hover:bg-detective-danger hover:text-white rounded p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
