/**
 * Exercise Submission Example
 *
 * Example component showing how to use the Progress API
 * for submitting exercises and displaying results.
 */

import { useState } from 'react';
import { submitExercise } from '../api';
import type { SubmitExerciseResponse } from '../api';

interface ExerciseSubmissionExampleProps {
  exerciseId: string;
  userId: string;
  onComplete?: (result: SubmitExerciseResponse) => void;
}

export function ExerciseSubmissionExample({
  exerciseId,
  userId,
  onComplete,
}: ExerciseSubmissionExampleProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitExerciseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [exerciseStartTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit the exercise
      const submissionResult = await submitExercise(exerciseId, {
        userId,
        answers,
        startedAt: exerciseStartTime,
        hintsUsed,
        powerupsUsed: [], // Add powerups if needed
        sessionId: `session_${Date.now()}`,
      });

      setResult(submissionResult);
      onComplete?.(submissionResult);
    } catch (err: any) {
      console.error('Submission error:', err);

      // Handle specific error codes
      if (err.code === 'RATE_LIMIT_EXCEEDED') {
        setError(`Por favor espera ${err.retryAfter} segundos antes de intentar nuevamente.`);
      } else if (err.code === 'SUBMISSION_TOO_FAST') {
        setError('Toma un poco más de tiempo para completar el ejercicio.');
      } else if (err.code === 'SESSION_EXPIRED') {
        setError('Tu sesión ha expirado. Por favor recarga el ejercicio.');
      } else {
        setError('Error al enviar el ejercicio. Por favor intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  return (
    <div className="exercise-submission">
      {/* Exercise Questions (simplified for example) */}
      <div className="questions">
        <h2>Exercise Questions</h2>
        {/* Add your exercise questions here */}
        <input
          type="text"
          placeholder="Answer to question 1"
          onChange={(e) => handleAnswerChange('q1', e.target.value)}
        />
      </div>

      {/* Hints Button */}
      <button
        onClick={() => setHintsUsed((prev) => prev + 1)}
        disabled={isSubmitting}
      >
        Use Hint ({hintsUsed} used)
      </button>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || Object.keys(answers).length === 0}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Exercise'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="error" style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="results" style={{ marginTop: '2rem' }}>
          <h3>Results</h3>

          {/* Score */}
          <div className="score">
            <h4>Score: {result.score}/100</h4>
            {result.isPerfect && <p>Perfect Score!</p>}
            <p>
              Correct: {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>

          {/* Rewards */}
          <div className="rewards">
            <h4>Rewards</h4>
            <p>ML Coins: +{result.rewards.mlCoins}</p>
            <p>XP: +{result.rewards.xp}</p>

            {/* Bonuses */}
            {Object.keys(result.rewards.bonuses).length > 0 && (
              <div className="bonuses">
                <h5>Bonuses:</h5>
                <ul>
                  {result.rewards.bonuses.perfectScore && (
                    <li>Perfect Score: +{result.rewards.bonuses.perfectScore}</li>
                  )}
                  {result.rewards.bonuses.speedBonus && (
                    <li>Speed Bonus: +{result.rewards.bonuses.speedBonus}</li>
                  )}
                  {result.rewards.bonuses.noHints && (
                    <li>No Hints: +{result.rewards.bonuses.noHints}</li>
                  )}
                  {result.rewards.bonuses.firstAttempt && (
                    <li>First Attempt: +{result.rewards.bonuses.firstAttempt}</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Rank Up */}
          {result.rankUp && (
            <div className="rank-up" style={{ backgroundColor: '#ffd700', padding: '1rem' }}>
              <h4>Congratulations! You ranked up!</h4>
              <p>
                {result.rankUp.previousRank} → {result.rankUp.newRank}
              </p>
              <p>Bonus ML Coins: +{result.rankUp.bonusMLCoins}</p>
              <p>New Multiplier: {result.rankUp.newMultiplier}x</p>
            </div>
          )}

          {/* Achievements */}
          {result.achievements && result.achievements.length > 0 && (
            <div className="achievements">
              <h4>Achievements Unlocked!</h4>
              <ul>
                {result.achievements.map((achievement) => (
                  <li key={achievement.id}>
                    {achievement.icon} {achievement.name} ({achievement.rarity})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback */}
          <div className="feedback">
            <h4>Feedback</h4>
            <p>{result.feedback.overall}</p>

            <h5>Answer Review:</h5>
            <ul>
              {result.feedback.answerReview.map((review) => (
                <li
                  key={review.questionId}
                  style={{ color: review.isCorrect ? 'green' : 'red' }}
                >
                  <strong>Question {review.questionId}:</strong>{' '}
                  {review.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  {!review.isCorrect && (
                    <>
                      <br />
                      Your answer: {review.userAnswer}
                      <br />
                      Correct answer: {review.correctAnswer}
                      {review.explanation && (
                        <>
                          <br />
                          <em>{review.explanation}</em>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
