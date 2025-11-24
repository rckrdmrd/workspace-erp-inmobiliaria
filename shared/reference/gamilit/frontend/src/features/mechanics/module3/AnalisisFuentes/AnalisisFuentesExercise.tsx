import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { DetectiveCard } from '@/shared/components/base/DetectiveCard';
import { DetectiveButton } from '@/shared/components/base/DetectiveButton';
import { FeedbackModal } from '@/shared/components/mechanics/FeedbackModal';
import { fetchSources, analyzeSource, checkClaim } from './analisisFuentesAPI';
import type { Source } from './analisisFuentesTypes';
import type { SourceCredibility, FactCheckResult } from '../../shared/aiTypes';
import { calculateTimeBonus, calculateCompletionBonus } from '@/shared/utils/scoring';
import { saveProgress as saveProgressUtil } from '@/shared/utils/storage';

interface ExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: number) => void;
  initialData?: ExerciseState;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ExerciseState {
  analyzedSources: string[];
  checkedClaims: number;
  currentScore: number;
}

export const AnalisisFuentesExercise: React.FC<ExerciseProps> = ({
  exerciseId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
}) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [analysis, setAnalysis] = useState<SourceCredibility | null>(null);
  const [claim, setClaim] = useState('');
  const [factCheck, setFactCheck] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedSources, setAnalyzedSources] = useState<string[]>(initialData?.analyzedSources || []);
  const [checkedClaims, setCheckedClaims] = useState(initialData?.checkedClaims || 0);
  const [currentScore, setCurrentScore] = useState(initialData?.currentScore || 0);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const actionsRef = useRef<any>(null);

  useEffect(() => {
    loadSources();
  }, []);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
  }, [analyzedSources, checkedClaims, currentScore]);

  // FE-055 & FE-059: Update progress with user answers
  useEffect(() => {
    if (onProgressUpdate) {
      const totalTasks = sources.length + 3; // Sources to analyze + 3 claims to check
      const completedTasks = analyzedSources.length + checkedClaims;

      // Prepare user answers in backend DTO format
      // Backend expects: { ranking: ["src1", "src3", "src2"] }
      // Ranking sources by order analyzed (proxy for perceived credibility)
      const userAnswers = {
        ranking: analyzedSources // Sources analyzed in order
      };

      onProgressUpdate({
        progress: {
          currentStep: completedTasks,
          totalSteps: totalTasks,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed: 0,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: userAnswers
      });

      console.log('📊 [AnalisisFuentes] Progress update sent:', {
        analyzedSources: analyzedSources.length,
        checkedClaims
      });
    }

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);
  }, [analyzedSources, checkedClaims, sources.length, onProgressUpdate, startTime]);

  const loadSources = async () => {
    try {
      const data = await fetchSources();
      setSources(data);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = () => {
    const state: ExerciseState = {
      analyzedSources,
      checkedClaims,
      currentScore
    };
    // Save using shared utility
    saveProgressUtil(exerciseId, state);
  };

  // FE-059 NOTE: This component uses AI services (analyzeSource, checkClaim) for real-time analysis
  // Unlike other exercises, it doesn't rely on stored "correct answers" in the exercise data
  // The SourceAnalysis.credibilityScore field is sanitized in exercise data
  // but analysis.credibilityScore (from SourceCredibility/AI) is a runtime calculation
  // TODO: When integrating with backend, backend should perform source analysis or store rankings
  const handleAnalyze = async (source: Source) => {
    setSelectedSource(source);
    setAnalyzing(true);
    try {
      const result = await analyzeSource(source.url);
      setAnalysis(result);

      // Track analyzed source
      if (!analyzedSources.includes(source.id)) {
        setAnalyzedSources([...analyzedSources, source.id]);
        // FE-059: Local scoring will be replaced with backend scoring
        const newScore = currentScore + 10;
        setCurrentScore(newScore);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFactCheck = async () => {
    if (!claim.trim()) return;
    setAnalyzing(true);
    try {
      const result = await checkClaim(claim);
      setFactCheck(result);
      setCheckedClaims(checkedClaims + 1);
      const newScore = currentScore + (result.isAccurate ? 15 : 5);
      setCurrentScore(newScore);
      setClaim('');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleComplete = () => {
    setShowFeedback(true);
  };

  const calculateFinalScore = () => {
    const baseScore = currentScore;
    const timeBonus = calculateTimeBonus(startTime, new Date(), 20, 60);
    const completionBonus = calculateCompletionBonus(analyzedSources.length, sources.length, 20);
    return Math.min(100, baseScore + timeBonus + completionBonus);
  };

  const handleReset = () => {
    setAnalyzedSources([]);
    setCheckedClaims(0);
    setCurrentScore(0);
    setSelectedSource(null);
    setAnalysis(null);
    setFactCheck(null);
    setClaim('');
  };

  // Attach actions ref
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck: handleComplete,
        getState: () => ({ analyzedSources, checkedClaims, currentScore })
      };
    }
  }, [analyzedSources, checkedClaims, currentScore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-detective-orange-50 to-detective-blue-50">
        <div className="text-detective-lg text-detective-text-secondary">Cargando fuentes...</div>
      </div>
    );
  }

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-detective-blue to-detective-orange rounded-detective-lg p-6 text-white shadow-detective-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileSearch className="w-8 h-8" />
              <h1 className="text-detective-3xl font-bold">Análisis de Fuentes</h1>
            </div>
            <p className="text-detective-base">Evalúa la credibilidad de fuentes sobre Marie Curie</p>
          </motion.div>

          {/* Sources and Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Available Sources */}
            <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light">
              <h3 className="text-detective-lg font-semibold text-detective-blue mb-4">Fuentes Disponibles</h3>
              <div className="space-y-4">
                {sources.map((source) => (
                  <motion.div
                    key={source.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleAnalyze(source)}
                    className={`bg-white rounded-lg p-4 shadow-detective-sm cursor-pointer hover:shadow-detective-md transition-all border-2 ${
                      analyzedSources.includes(source.id) ? 'border-detective-orange' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-detective-base font-semibold">{source.title}</h4>
                      <ExternalLink className="w-4 h-4 text-detective-orange" />
                    </div>
                    <p className="text-detective-xs text-detective-text-secondary mb-2">{source.url}</p>
                    <p className="text-detective-sm text-detective-text">{source.excerpt}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-detective-bg text-detective-xs rounded">
                      {source.type}
                    </span>
                    {analyzedSources.includes(source.id) && (
                      <span className="inline-block mt-2 ml-2 px-2 py-1 bg-green-100 text-green-800 text-detective-xs rounded">
                        ✓ Analizada
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Credibility Analysis */}
            {selectedSource && analysis && (
              <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light">
                <h3 className="text-detective-lg font-semibold text-detective-blue mb-4">Análisis de Credibilidad</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-detective-base font-semibold">{selectedSource.title}</h4>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-detective-gold" />
                      <span className="text-2xl font-bold text-detective-orange">
                        {Math.round(analysis.credibilityScore * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-detective-sm font-medium">Nivel de Sesgo:</span>
                      <span className="ml-2 px-3 py-1 bg-gray-100 rounded text-detective-sm">
                        {analysis.biasLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-detective-sm font-medium">Reporte Factual:</span>
                      <span className="ml-2 px-3 py-1 bg-gray-100 rounded text-detective-sm">
                        {analysis.factualReporting}
                      </span>
                    </div>
                    {analysis.warnings.length > 0 && (
                      <div>
                        <h5 className="text-detective-sm font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          Advertencias
                        </h5>
                        <ul className="space-y-1">
                          {analysis.warnings.map((w, idx) => (
                            <li key={idx} className="text-detective-xs text-yellow-800">• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.strengths.length > 0 && (
                      <div>
                        <h5 className="text-detective-sm font-semibold mb-2">Fortalezas</h5>
                        <ul className="space-y-1">
                          {analysis.strengths.map((s, idx) => (
                            <li key={idx} className="text-detective-xs text-green-800">• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fact Checker */}
          <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light mt-6">
            <h3 className="text-detective-lg font-semibold text-detective-blue mb-4">Verificador de Afirmaciones</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFactCheck()}
                placeholder="Ingresa una afirmación sobre Marie Curie..."
                className="flex-1 px-4 py-3 border border-detective-border-medium rounded-detective-lg focus:outline-none focus:ring-2 focus:ring-detective-orange"
              />
              <DetectiveButton
                variant="primary"

                onClick={handleFactCheck}
                disabled={!claim.trim() || analyzing}
                loading={analyzing}
              >
                Verificar
              </DetectiveButton>
            </div>
            {factCheck && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-detective-lg ${
                  factCheck.isAccurate
                    ? 'bg-green-50 border-2 border-green-400'
                    : 'bg-red-50 border-2 border-red-400'
                }`}
              >
                <h4 className="font-semibold mb-2">
                  {factCheck.isAccurate ? '✓ Afirmación Precisa' : '✗ Afirmación Inexacta'}
                </h4>
                <p className="text-detective-sm mb-3">{factCheck.explanation}</p>
                <div className="text-detective-xs">
                  <strong>Confianza:</strong> {Math.round(factCheck.confidence * 100)}%
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {onExit && (
              <DetectiveButton
                variant="secondary"

                onClick={onExit}
              >
                Salir
              </DetectiveButton>
            )}
            <DetectiveButton
              variant="gold"

              onClick={handleReset}
            >
              Reiniciar
            </DetectiveButton>
            <DetectiveButton
              variant="primary"

              onClick={handleComplete}
            >
              Completar Ejercicio
            </DetectiveButton>
          </div>
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        feedback={{
          type: currentScore >= 70 ? 'success' : 'partial',
          title: currentScore >= 70 ? '¡Excelente Análisis!' : 'Buen Trabajo',
          message: `Has completado el análisis de fuentes con ${currentScore} puntos.`,
          score: calculateFinalScore(),
          showConfetti: currentScore >= 70
        }}
        onClose={() => {
          setShowFeedback(false);
          if (currentScore >= 70) {
            onComplete?.(calculateFinalScore(), timeSpent);
          }
        }}
        onRetry={handleReset}
      />
    </>
  );
};

export default AnalisisFuentesExercise;
