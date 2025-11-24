import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { ArticleParser } from './ArticleParser';
import { FactCheckDashboard } from './FactCheckDashboard';
import { mockArticles, mockFactCheckResults } from './verificadorFakeNewsMockData';
import { Claim, FactCheckResult, ExerciseProps, VerificadorState, NewsArticle } from './verificadorFakeNewsTypes';
import { FeedbackData, normalizeProgressUpdate } from '@shared/components/mechanics/mechanicsTypes';
import { saveProgress as saveProgressUtil } from '@/shared/utils/storage';

export const VerificadorFakeNewsExercise: React.FC<ExerciseProps> = ({
  exerciseId,
  onComplete,
  onProgressUpdate,
  initialData,
  exercise,
}) => {
  // State management
  const [selectedArticleId, setSelectedArticleId] = useState(initialData?.selectedArticleId || mockArticles[0].id);
  const [claims, setClaims] = useState<Claim[]>(initialData?.claims || []);
  const [results, setResults] = useState<FactCheckResult[]>(initialData?.results || []);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const selectedArticle = exercise?.articles?.find((a: NewsArticle) => a.id === selectedArticleId) || mockArticles.find((a: NewsArticle) => a.id === selectedArticleId);
  const articles = exercise?.articles || mockArticles;

  // Calculate progress
  const calculateProgress = () => {
    if (claims.length === 0) return 0;
    return Math.round((results.length / Math.max(claims.length, 1)) * 100);
  };

  // Calculate score
  const calculateScore = () => {
    if (results.length === 0) return 0;

    const verifiedCount = results.length;
    const accurateVerifications = results.filter(r => r.verdict === 'true' || r.verdict === 'false').length;
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

    const verificationScore = (verifiedCount / Math.max(claims.length, 1)) * 40;
    const accuracyScore = (accurateVerifications / Math.max(verifiedCount, 1)) * 40;
    const confidenceScore = avgConfidence * 20;

    return Math.round(verificationScore + accuracyScore + confidenceScore);
  };

  // Progress tracking
  useEffect(() => {
    const progress = calculateProgress();
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    onProgressUpdate?.(
      normalizeProgressUpdate(
        progress,
        results.length,
        Math.max(claims.length, 1),
        0,
        timeSpent
      )
    );
  }, [claims, results]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const currentState: VerificadorState = {
        selectedArticleId,
        claims,
        results,
      };
      saveProgressUtil(exerciseId, currentState);
    }, 30000); // Every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [selectedArticleId, claims, results, exerciseId]);

  // Handle claim extraction
  const handleClaimExtraction = (text: string, start: number, end: number) => {
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      text,
      context: selectedArticle?.content.slice(Math.max(0, start - 50), Math.min(selectedArticle.content.length, end + 50)) || '',
      position: { start, end },
    };
    setClaims([...claims, newClaim]);
  };

  // Handle claim verification
  const handleVerifyClaim = async (claimId: string) => {
    // Mock API call - simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get mock results for this article
    const articleResults = mockFactCheckResults[selectedArticleId] || [];
    const mockResult = articleResults[results.length % articleResults.length];

    if (mockResult) {
      const newResult: FactCheckResult = {
        ...mockResult,
        claimId,
      };
      setResults([...results, newResult]);
    }
  };

  const highlightedClaims = claims.map((claim) => ({
    ...claim.position,
    verified: results.some((r) => r.claimId === claim.id),
  }));

  // Reset handler
  const handleReset = () => {
    setClaims([]);
    setResults([]);
    setFeedback(null);
    setShowFeedback(false);
  };

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Exercise Description */}
          <div className="bg-gradient-to-r from-detective-blue to-detective-orange rounded-detective p-6 text-white shadow-detective-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h2 className="text-detective-2xl font-bold">Verificador de Noticias Falsas</h2>
            </div>
            <p className="text-detective-base opacity-90 mb-4">
              Analiza artículos sobre Marie Curie y verifica la veracidad de las afirmaciones.
            </p>

            <div className="flex gap-4 items-center">
              <label className="text-white font-medium">Selecciona un artículo:</label>
              <select
                value={selectedArticleId}
                onChange={(e) => {
                  setSelectedArticleId(e.target.value);
                  handleReset();
                }}
                className="px-4 py-2 border-2 border-white/30 rounded-detective bg-white/10 text-white focus:border-white focus:outline-none transition-colors"
              >
                {articles.map((article) => (
                  <option key={article.id} value={article.id} className="text-detective-text">
                    {article.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content - Article and Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedArticle && (
              <ArticleParser
                article={selectedArticle}
                onClaimSelect={handleClaimExtraction}
                highlightedClaims={highlightedClaims}
              />
            )}
            <FactCheckDashboard
              claims={claims}
              results={results}
              onVerifyClaim={handleVerifyClaim}
            />
          </div>

          {/* Score Summary */}
          {results.length > 0 && (
            <DetectiveCard variant="default" padding="lg">
              <h3 className="text-detective-2xl font-bold mb-4 text-detective-text">
                Resumen de Verificación
              </h3>
              <p className="text-detective-text-secondary mb-4">
                Has verificado {results.length} afirmación(es).
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-detective p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="text-3xl font-bold text-green-600">
                      {results.filter((r) => r.verdict === 'true').length}
                    </p>
                  </div>
                  <p className="text-sm text-detective-text">Verdaderas</p>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-detective p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <p className="text-3xl font-bold text-red-600">
                      {results.filter((r) => r.verdict === 'false').length}
                    </p>
                  </div>
                  <p className="text-sm text-detective-text">Falsas</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-detective p-4 text-center">
                  <p className="text-3xl font-bold text-detective-blue mb-2">
                    {Math.round((results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 100)}%
                  </p>
                  <p className="text-sm text-detective-text">Confianza Promedio</p>
                </div>
              </div>
            </DetectiveCard>
          )}
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success' && onComplete) {
              const timeSpent = Math.floor(
                (new Date().getTime() - startTime.getTime()) / 1000
              );
              onComplete(calculateScore(), timeSpent);
            }
          }}
          onRetry={() => {
            setShowFeedback(false);
          }}
        />
      )}
    </>
  );
};
