import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, Bot, User } from 'lucide-react';
import { DetectiveCard } from '@/shared/components/base/DetectiveCard';
import { DetectiveButton } from '@/shared/components/base/DetectiveButton';
import { FeedbackModal } from '@/shared/components/mechanics/FeedbackModal';
import { sendDebateMessage } from './debateDigitalAPI';
import { debateTopic } from './debateDigitalMockData';
import type { DebateMessage } from './debateDigitalTypes';
import { calculateTimeBonus } from '@/shared/utils/scoring';
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
  messages: DebateMessage[];
  currentScore: number;
  totalMessages: number;
}

export const DebateDigitalExercise: React.FC<ExerciseProps> = ({
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
  const [messages, setMessages] = useState<DebateMessage[]>(initialData?.messages || []);
  const [input, setInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [currentScore, setCurrentScore] = useState(initialData?.currentScore || 0);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add initial AI message if starting fresh
    if (messages.length === 0) {
      const aiIntro: DebateMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: 'Hola, soy tu oponente en este debate. Defenderé la posición de que la fama benefició la investigación de Marie Curie, dándole acceso a financiación y colaboraciones internacionales. ¿Cuál es tu argumento inicial?',
        timestamp: new Date()
      };
      setMessages([aiIntro]);
    }
  }, []);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
  }, [messages, currentScore]);

  // Update progress
  useEffect(() => {
    const userMessages = messages.filter((m) => m.sender === 'user').length;
    const targetMessages = 5; // Minimum messages for completion
    const progress = Math.min(100, (userMessages / targetMessages) * 100);
    onProgressUpdate?.(progress);

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);
  }, [messages]);

  const saveProgress = () => {
    const state: ExerciseState = {
      messages,
      currentScore,
      totalMessages: messages.length
    };
    saveProgressUtil(exerciseId, state);
  };

  const handleSend = async () => {
    if (!input.trim() || aiTyping) return;

    const userMsg: DebateMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAiTyping(true);

    // Calculate score based on message quality
    const messageScore = Math.min(20, input.trim().split(' ').length); // Word count bonus
    setCurrentScore((prev) => prev + messageScore);

    try {
      const response = await sendDebateMessage(input, 'scientificSharing');
      const aiMsg: DebateMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.message,
        timestamp: new Date(),
        argumentStrength: response.argumentScore
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setAiTyping(false);
    }
  };

  const handleComplete = () => {
    setShowFeedback(true);
  };

  const calculateFinalScore = () => {
    const userMessages = messages.filter((m) => m.sender === 'user').length;
    const baseScore = currentScore;
    const participationBonus = Math.min(30, userMessages * 5);
    const timeBonus = calculateTimeBonus(startTime, new Date(), 20, 120);
    return Math.min(100, baseScore + participationBonus + timeBonus);
  };

  const handleReset = () => {
    const aiIntro: DebateMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: 'Hola, soy tu oponente en este debate. Defenderé la posición de que la fama benefició la investigación de Marie Curie, dándole acceso a financiación y colaboraciones internacionales. ¿Cuál es tu argumento inicial?',
      timestamp: new Date()
    };
    setMessages([aiIntro]);
    setInput('');
    setCurrentScore(0);
  };

  // Attach actions ref
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck: handleComplete,
        getState: () => ({ messages, currentScore })
      };
    }
  }, [messages, currentScore]);

  const userMessageCount = messages.filter((m) => m.sender === 'user').length;

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
              <MessageCircle className="w-8 h-8" />
              <h1 className="text-detective-3xl font-bold">Debate Digital</h1>
            </div>
            <p className="text-detective-lg mb-2">{debateTopic.title}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="font-medium">{debateTopic.question}</p>
            </div>
          </motion.div>

          {/* Chat Container */}
          <div className="mt-6 bg-white rounded-detective border-2 border-detective-border-light">
            <div className="flex flex-col" style={{ height: '600px' }}>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          msg.sender === 'user'
                            ? 'bg-detective-orange text-white'
                            : 'bg-gray-100 text-detective-text'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {msg.sender === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-detective-xs font-semibold">
                            {msg.sender === 'user' ? 'Tú' : 'IA Oponente'}
                          </span>
                        </div>
                        <p className="text-detective-sm">{msg.text}</p>
                        {msg.argumentStrength && (
                          <div className="mt-2 text-detective-xs opacity-75">
                            Fuerza del argumento: {Math.round(msg.argumentStrength * 100)}%
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {aiTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-detective-sm">IA está escribiendo...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu argumento..."
                    className="flex-1 px-4 py-3 border border-detective-border-medium rounded-detective-lg focus:outline-none focus:ring-2 focus:ring-detective-orange"
                    disabled={aiTyping}
                  />
                  <DetectiveButton
                    variant="primary"

                    onClick={handleSend}
                    disabled={!input.trim() || aiTyping}
                    icon={<Send className="w-5 h-5" />}
                  >
                    Enviar
                  </DetectiveButton>
                </div>
              </div>
            </div>
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
              disabled={userMessageCount < 3}
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
          type: userMessageCount >= 5 ? 'success' : 'partial',
          title: userMessageCount >= 5 ? '¡Excelente Debate!' : 'Buen Debate',
          message: `Has participado con ${userMessageCount} argumento(s) obteniendo ${currentScore} puntos.`,
          score: calculateFinalScore(),
          showConfetti: userMessageCount >= 5
        }}
        onClose={() => {
          setShowFeedback(false);
          if (userMessageCount >= 3) {
            onComplete?.(calculateFinalScore(), timeSpent);
          }
        }}
        onRetry={handleReset}
      />
    </>
  );
};

export default DebateDigitalExercise;
