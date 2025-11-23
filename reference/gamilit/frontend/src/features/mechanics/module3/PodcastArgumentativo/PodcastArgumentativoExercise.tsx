import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, FileAudio } from 'lucide-react';
import { DetectiveCard } from '@/shared/components/base/DetectiveCard';
import { DetectiveButton } from '@/shared/components/base/DetectiveButton';
import { FeedbackModal } from '@/shared/components/mechanics/FeedbackModal';
import { fetchPodcastExercise, analyzeRecording } from './podcastArgumentativoAPI';
import type { PodcastExercise, Recording } from './podcastArgumentativoTypes';
import type { ArgumentAnalysis } from '../../shared/aiTypes';
import { saveProgress as saveProgressUtil, loadProgress, clearProgress } from '@/shared/utils/storage';

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
  hasRecording: boolean;
  recordingDuration: number;
  currentScore: number;
  analyzed: boolean;
}

export const PodcastArgumentativoExercise: React.FC<ExerciseProps> = ({
  moduleId,
  lessonId,
  exerciseId,
  userId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  difficulty = 'medium'
}) => {
  const [exercise, setExercise] = useState<PodcastExercise | null>(null);
  const [recording, setRecording] = useState<Recording>({
    id: '',
    audioBlob: null,
    transcription: '',
    analysis: null,
    duration: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
  const [currentScore, setCurrentScore] = useState(initialData?.currentScore || 0);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const actionsRef = useRef<any>(null);

  useEffect(() => {
    loadExercise();
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
  }, [recording, currentScore]);

  // Update progress
  useEffect(() => {
    const progress = calculateProgress();
    onProgressUpdate?.(progress);

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);
  }, [recording, analysis]);

  const calculateProgress = () => {
    let progress = 0;
    if (recording.audioBlob) progress += 50;
    if (analysis) progress += 50;
    return progress;
  };

  const loadExercise = async () => {
    const data = await fetchPodcastExercise('podcast-1');
    setExercise(data);
  };

  const saveProgress = () => {
    const state: ExerciseState = {
      hasRecording: recording.audioBlob !== null,
      recordingDuration: recording.duration,
      currentScore,
      analyzed: analysis !== null
    };
    saveProgressUtil(exerciseId, state);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecording((prev) => ({ ...prev, audioBlob: blob, duration: timer }));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono. Por favor verifica los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!recording.audioBlob) return;
    setAnalyzing(true);
    try {
      const mockTranscription =
        'Marie Curie fue una científica extraordinaria que superó innumerables obstáculos. Su trabajo con elementos radiactivos revolucionó la física y la medicina. A pesar de enfrentar discriminación de género, perseveró y ganó dos Premios Nobel. Su legado inspira a científicas de todo el mundo.';
      const result = await analyzeRecording(mockTranscription);
      setRecording((prev) => ({ ...prev, transcription: mockTranscription }));
      setAnalysis(result);

      // Calculate score based on analysis metrics
      const avgScore = (result.clarity + result.logic + result.evidence + result.persuasion) / 4;
      const newScore = Math.round(avgScore * 100);
      setCurrentScore(newScore);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleComplete = () => {
    setShowFeedback(true);
  };

  const calculateFinalScore = () => {
    const baseScore = currentScore;
    const timeBonus = timer <= (exercise?.timeLimit || 300) ? 20 : 0;
    const completionBonus = recording.audioBlob && analysis ? 10 : 0;
    return Math.min(100, baseScore + timeBonus + completionBonus);
  };

  const handleReset = () => {
    setRecording({ id: '', audioBlob: null, transcription: '', analysis: null, duration: 0 });
    setAnalysis(null);
    setCurrentScore(0);
    setTimer(0);
  };

  // Attach actions ref
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck: handleComplete,
        getState: () => ({ recording, currentScore, analysis })
      };
    }
  }, [recording, currentScore, analysis]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-detective-orange-50 to-detective-blue-50">
        <div className="text-detective-lg text-detective-text-secondary">Cargando ejercicio...</div>
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
              <FileAudio className="w-8 h-8" />
              <h1 className="text-detective-3xl font-bold">Podcast Argumentativo</h1>
            </div>
            <p className="text-detective-lg mb-2">{exercise.topic}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p>{exercise.prompt}</p>
            </div>
          </motion.div>

          {/* Recording Controls */}
          <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light mt-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-detective-orange mb-2">{formatTime(timer)}</div>
              <div className="text-detective-sm text-detective-text-secondary">
                Tiempo límite: {formatTime(exercise.timeLimit)}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {!isRecording && !recording.audioBlob && (
                <DetectiveButton
                  variant="primary"

                  onClick={startRecording}
                  icon={<Mic className="w-6 h-6" />}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Iniciar Grabación
                </DetectiveButton>
              )}
              {isRecording && (
                <DetectiveButton
                  variant="secondary"

                  onClick={stopRecording}
                  icon={<Square className="w-6 h-6" />}
                  className="bg-gray-800 hover:bg-gray-900 animate-pulse"
                >
                  Detener Grabación
                </DetectiveButton>
              )}
            </div>

            {recording.audioBlob && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 p-4 bg-detective-bg rounded-lg">
                  <FileAudio className="w-6 h-6 text-detective-orange" />
                  <span className="text-detective-base font-medium">
                    Grabación completada ({formatTime(recording.duration)})
                  </span>
                </div>
                <DetectiveButton
                  variant="primary"

                  onClick={handleAnalyze}
                  disabled={analyzing}
                  loading={analyzing}
                  className="w-full"
                >
                  {analyzing ? 'Analizando...' : 'Analizar Podcast'}
                </DetectiveButton>
              </div>
            )}
          </div>

          {/* Transcription */}
          {recording.transcription && (
            <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light">
              <h3 className="text-detective-lg font-semibold text-detective-blue mb-3">Transcripción</h3>
              <p className="text-detective-sm text-detective-text leading-relaxed p-4 bg-gray-50 rounded-lg">
                {recording.transcription}
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light">
                <h3 className="text-detective-lg font-semibold text-detective-blue mb-4">
                  Análisis del Argumento
                </h3>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Claridad', value: analysis.clarity, color: 'text-blue-600' },
                    { label: 'Lógica', value: analysis.logic, color: 'text-green-600' },
                    { label: 'Evidencia', value: analysis.evidence, color: 'text-orange-600' },
                    { label: 'Persuasión', value: analysis.persuasion, color: 'text-purple-600' }
                  ].map((metric) => (
                    <div key={metric.label} className="text-center p-4 bg-detective-bg rounded-lg">
                      <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                        {Math.round(metric.value * 100)}
                      </div>
                      <div className="text-detective-xs text-detective-text-secondary">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div className="mb-4">
                  <h4 className="text-detective-base font-semibold mb-2">Retroalimentación</h4>
                  <ul className="space-y-1">
                    {analysis.feedback.map((f, idx) => (
                      <li key={idx} className="text-detective-sm flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <h4 className="text-detective-base font-semibold mb-2">Áreas de Mejora</h4>
                  <ul className="space-y-1">
                    {analysis.improvements.map((i, idx) => (
                      <li key={idx} className="text-detective-sm flex items-start gap-2">
                        <span className="text-detective-orange">→</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

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
              disabled={!analysis}
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
          title: currentScore >= 70 ? '¡Excelente Argumentación!' : 'Buen Trabajo',
          message: `Has completado el podcast argumentativo con ${currentScore} puntos.`,
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

export default PodcastArgumentativoExercise;
