/**
 * Progress Dashboard Example
 *
 * Example component showing how to use the Progress API
 * for displaying user progress and statistics.
 */

import { useState, useEffect } from 'react';
import { getProgress, getModuleProgress, getUserActivities } from '../api';
import type { UserProgressOverview, ModuleProgressDetail, Activity } from '../api';

interface ProgressDashboardExampleProps {
  userId: string;
}

export function ProgressDashboardExample({ userId }: ProgressDashboardExampleProps) {
  const [progress, setProgress] = useState<UserProgressOverview | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleDetail, setModuleDetail] = useState<ModuleProgressDetail | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial progress data
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [progressData, activitiesData] = await Promise.all([
          getProgress(userId),
          getUserActivities(userId, 10),
        ]);

        setProgress(progressData);
        setActivities(activitiesData);
      } catch (err: any) {
        console.error('Error loading progress:', err);
        setError('Error al cargar el progreso. Por favor intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  // Load module details when a module is selected
  useEffect(() => {
    if (!selectedModule) {
      setModuleDetail(null);
      return;
    }

    const loadModuleDetail = async () => {
      try {
        const detail = await getModuleProgress(userId, selectedModule);
        setModuleDetail(detail);
      } catch (err: any) {
        console.error('Error loading module detail:', err);
      }
    };

    loadModuleDetail();
  }, [userId, selectedModule]);

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!progress) {
    return <div>No progress data available</div>;
  }

  return (
    <div className="progress-dashboard">
      {/* Overall Progress */}
      <section className="overall-progress">
        <h2>Overall Progress</h2>
        <div className="progress-stats">
          <div>
            <strong>Progress:</strong> {progress.overallProgress.overallPercentage}%
          </div>
          <div>
            <strong>Modules:</strong> {progress.overallProgress.completedModules}/
            {progress.overallProgress.totalModules}
          </div>
          <div>
            <strong>Exercises:</strong> {progress.overallProgress.completedExercises}/
            {progress.overallProgress.totalExercises}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              width: `${progress.overallProgress.overallPercentage}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </section>

      {/* Study Streak */}
      <section className="study-streak" style={{ marginTop: '2rem' }}>
        <h2>Study Streak</h2>
        <div className="streak-info">
          <div>
            <strong>Current Streak:</strong> {progress.studyStreak.currentStreak} days
          </div>
          <div>
            <strong>Longest Streak:</strong> {progress.studyStreak.longestStreak} days
          </div>
          <div>
            <strong>Last Study:</strong>{' '}
            {new Date(progress.studyStreak.lastStudyDate).toLocaleDateString()}
          </div>
        </div>
      </section>

      {/* Module Progress */}
      <section className="module-progress" style={{ marginTop: '2rem' }}>
        <h2>Module Progress</h2>
        <div className="modules-list">
          {progress.moduleProgress.map((module) => (
            <div
              key={module.moduleId}
              className="module-card"
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor:
                  selectedModule === module.moduleId ? '#f0f0f0' : 'white',
              }}
              onClick={() => setSelectedModule(module.moduleId)}
            >
              <h3>{module.moduleName}</h3>
              <div>
                <strong>Progress:</strong> {module.progressPercentage}%
              </div>
              <div>
                <strong>Exercises:</strong> {module.completedExercises}/
                {module.totalExercises}
              </div>
              <div>
                <strong>Average Score:</strong> {module.averageScore.toFixed(1)}
              </div>
              <div>
                <strong>Time Spent:</strong> {module.timeSpent} minutes
              </div>
              <div>
                <strong>Last Activity:</strong>{' '}
                {new Date(module.lastActivityAt).toLocaleDateString()}
              </div>

              {/* Module Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  marginTop: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: `${module.progressPercentage}%`,
                    height: '100%',
                    backgroundColor: '#2196f3',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module Detail (when selected) */}
      {moduleDetail && (
        <section className="module-detail" style={{ marginTop: '2rem' }}>
          <h2>Module Details</h2>
          <div>
            <strong>Started:</strong> {new Date(moduleDetail.startedAt).toLocaleDateString()}
          </div>
          {moduleDetail.completedAt && (
            <div>
              <strong>Completed:</strong>{' '}
              {new Date(moduleDetail.completedAt).toLocaleDateString()}
            </div>
          )}
          <div>
            <strong>Total Time:</strong> {Math.floor(moduleDetail.totalTimeSpent / 60)}{' '}
            minutes
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ marginTop: '1rem' }}>
            <h4>Strengths:</h4>
            <ul>
              {moduleDetail.strengths.map((strength, index) => (
                <li key={index} style={{ color: 'green' }}>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <h4>Areas to Improve:</h4>
            <ul>
              {moduleDetail.weaknesses.map((weakness, index) => (
                <li key={index} style={{ color: 'orange' }}>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Exercise Progress */}
          <div style={{ marginTop: '1rem' }}>
            <h4>Exercise Progress:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Exercise</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem' }}>Attempts</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem' }}>Best Score</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem' }}>Avg Score</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {moduleDetail.exerciseProgress.map((exercise) => (
                  <tr
                    key={exercise.exerciseId}
                    style={{ borderBottom: '1px solid #eee' }}
                  >
                    <td style={{ padding: '0.5rem' }}>{exercise.exerciseTitle}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      {exercise.attempts}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      {exercise.bestScore}
                      {exercise.perfectScore && ' 🏆'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      {exercise.averageScore.toFixed(1)}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      {exercise.completed ? '✓ Completed' : '○ In Progress'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent Activities */}
      <section className="recent-activities" style={{ marginTop: '2rem' }}>
        <h2>Recent Activities</h2>
        <ul>
          {activities.map((activity, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <strong>{activity.type}:</strong> {activity.description}
              <br />
              <small>{new Date(activity.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
