import React, { useState } from 'react';
import { Headphones, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  time: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const ComprensiónAuditivaExercise: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const audioUrl = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABkYXRhAAAAAA=='; // Mock audio

  const questions: Question[] = [
    {
      id: '1',
      time: 10,
      question: '¿Dónde nació Marie Curie?',
      options: ['Francia', 'Polonia', 'Rusia', 'Alemania'],
      correctAnswer: 1,
    },
    {
      id: '2',
      time: 30,
      question: '¿Qué elemento descubrió Marie Curie?',
      options: ['Uranio', 'Polonio', 'Hierro', 'Oro'],
      correctAnswer: 1,
    },
    {
      id: '3',
      time: 50,
      question: '¿Cuántos Premios Nobel ganó Marie Curie?',
      options: ['Uno', 'Dos', 'Tres', 'Ninguno'],
      correctAnswer: 1,
    },
  ];

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="min-h-screen bg-detective-bg p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-detective shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="w-8 h-8 text-detective-orange" />
            <h1 className="text-3xl font-bold text-detective-text">Comprensión Auditiva</h1>
          </div>
          <p className="text-detective-text-secondary mb-4">
            Escucha el audio sobre Marie Curie y responde las preguntas.
          </p>

          <div className="bg-detective-bg-secondary rounded-detective p-6">
            <audio
              controls
              className="w-full mb-4"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            >
              <source src={audioUrl} type="audio/wav" />
              Tu navegador no soporta el elemento de audio.
            </audio>
            <p className="text-detective-text-secondary text-sm text-center">
              🎧 Nota: Este es un audio de demostración. En producción, se cargarían audios reales sobre Marie Curie.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`bg-white rounded-detective shadow-card p-6 transition-opacity ${
                currentTime < question.time ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-detective-blue text-white rounded-full font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-detective-text font-medium mb-3">{question.question}</p>
                  {currentTime < question.time && (
                    <p className="text-detective-text-secondary text-sm mb-3">
                      ⏱ Esta pregunta se desbloqueará en {question.time}s del audio
                    </p>
                  )}
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(question.id, optIndex)}
                        disabled={currentTime < question.time}
                        className={`w-full text-left px-4 py-3 rounded-detective border-2 transition-all ${
                          answers[question.id] === optIndex
                            ? 'bg-detective-orange text-white border-detective-orange'
                            : 'bg-white border-gray-300 hover:border-detective-orange disabled:hover:border-gray-300'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </button>
                    ))}
                  </div>

                  {showResults && answers[question.id] !== undefined && (
                    <div className={`mt-3 p-3 rounded-detective ${
                      answers[question.id] === question.correctAnswer
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-red-50 border-2 border-red-200'
                    }`}>
                      {answers[question.id] === question.correctAnswer ? (
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">¡Correcto!</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 text-red-800 mb-1">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Incorrecto</span>
                          </div>
                          <p className="text-red-700 text-sm">
                            La respuesta correcta es: {question.options[question.correctAnswer]}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(answers).length === questions.length && !showResults && (
          <div className="bg-white rounded-detective shadow-card p-6">
            <button
              onClick={() => setShowResults(true)}
              className="w-full py-3 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium text-lg"
            >
              Ver Resultados
            </button>
          </div>
        )}

        {showResults && (
          <div className="bg-gradient-to-r from-detective-orange to-detective-gold text-white rounded-detective shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-2">Resultados</h3>
            <p className="text-5xl font-bold mb-4">{calculateScore()}%</p>
            <p>
              Respondiste correctamente {questions.filter(q => answers[q.id] === q.correctAnswer).length} de {questions.length} preguntas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
