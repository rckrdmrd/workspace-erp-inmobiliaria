import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2, Coins } from 'lucide-react';
import type { AIHint } from './detectiveTextualTypes';

interface AIHintSystemProps {
  onRequestHint: () => Promise<AIHint>;
  availableCoins: number;
  hintsUsed: number;
}

export const AIHintSystem: React.FC<AIHintSystemProps> = ({
  onRequestHint,
  availableCoins,
  hintsUsed,
}) => {
  const [hints, setHints] = useState<AIHint[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRequestHint = async () => {
    setLoading(true);
    try {
      const hint = await onRequestHint();
      setHints([...hints, hint]);
    } catch (error) {
      console.error('Error requesting hint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-detective-gold" />
          <h4 className="text-detective-lg font-semibold text-detective-blue">
            Sistema de Pistas IA
          </h4>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-detective-bg rounded-full">
          <Coins className="w-4 h-4 text-detective-gold" />
          <span className="text-detective-sm font-medium">{availableCoins} ML Coins</span>
        </div>
      </div>

      <button
        onClick={handleRequestHint}
        disabled={loading || availableCoins < 10}
        className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          loading || availableCoins < 10
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-detective-orange text-white hover:bg-detective-orange-dark shadow-orange'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando pista...
          </>
        ) : (
          <>
            <Lightbulb className="w-4 h-4" />
            Solicitar Pista (-10 Coins)
          </>
        )}
      </button>

      <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {hints.map((hint, idx) => (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-detective-bg border-l-4 border-detective-gold rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-detective-gold text-white flex items-center justify-center text-detective-xs font-bold">
                  {idx + 1}
                </div>
                <p className="flex-1 text-detective-sm text-detective-text">{hint.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hintsUsed > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-detective-xs text-yellow-800">
            Has usado {hintsUsed} pista{hintsUsed > 1 ? 's' : ''}. Cada pista reduce tu puntuación final.
          </p>
        </div>
      )}
    </div>
  );
};
