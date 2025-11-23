/**
 * API Endpoints Constants - Frontend
 *
 * @description URLs completas para llamadas API desde Frontend React.
 * @usage import { API_ENDPOINTS } from '@/shared/constants';
 *
 * IMPORTANTE:
 * - Debe coincidir EXACTAMENTE con Backend routes.constants.ts
 * - Validado automáticamente por validate-api-contract.ts en CI/CD
 * - NO hardcodear URLs en fetch/axios/useQuery sin usar constantes
 *
 * @see /docs/03-desarrollo/CONSTANTS-ARCHITECTURE.md
 * @see /apps/backend/src/shared/constants/routes.constants.ts
 */

/**
 * Base URL (configurable por entorno)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * API Endpoints por módulo
 * IMPORTANTE: Estructura debe coincidir EXACTAMENTE con Backend API_ROUTES
 */
export const API_ENDPOINTS = {
  // Auth Module
  AUTH: {
    BASE: `${API_BASE_URL}/auth`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Users Module
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
    PROFILE: (id: string) => `${API_BASE_URL}/users/${id}/profile`,
    PREFERENCES: (id: string) => `${API_BASE_URL}/users/${id}/preferences`,
    ROLES: (id: string) => `${API_BASE_URL}/users/${id}/roles`,
    STATS: (id: string) => `${API_BASE_URL}/users/${id}/stats`,
  },

  // Gamification Module
  GAMIFICATION: {
    BASE: `${API_BASE_URL}/gamification`,

    // Achievements
    ACHIEVEMENTS: `${API_BASE_URL}/gamification/achievements`,
    ACHIEVEMENT_BY_ID: (id: string) => `${API_BASE_URL}/gamification/achievements/${id}`,
    USER_ACHIEVEMENTS: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/achievements`,
    GRANT_ACHIEVEMENT: (userId: string, achievementId: string) =>
      `${API_BASE_URL}/gamification/users/${userId}/achievements/${achievementId}`,

    // Leaderboard
    LEADERBOARD: `${API_BASE_URL}/gamification/leaderboard`,
    LEADERBOARD_BY_PERIOD: (period: string) => `${API_BASE_URL}/gamification/leaderboard/${period}`,

    // User Stats & Ranks
    USER_STATS: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/stats`,
    USER_RANK: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/rank`,
    RANK_HISTORY: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/rank/history`,

    // Rewards & ML Coins
    REWARDS: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/rewards`,
    ML_COINS_BALANCE: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/ml-coins`,
    ML_COINS_TRANSACTIONS: (userId: string) =>
      `${API_BASE_URL}/gamification/users/${userId}/ml-coins/transactions`,

    // Missions
    MISSIONS: `${API_BASE_URL}/gamification/missions`,
    MISSION_BY_ID: (id: string) => `${API_BASE_URL}/gamification/missions/${id}`,
    USER_MISSIONS: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/missions`,
    ASSIGN_MISSION: (userId: string, missionId: string) =>
      `${API_BASE_URL}/gamification/users/${userId}/missions/${missionId}`,

    // Comodines (Power-ups)
    COMODINES: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/comodines`,
    PURCHASE_COMODIN: (userId: string, type: string) =>
      `${API_BASE_URL}/gamification/users/${userId}/comodines/${type}/purchase`,
    USE_COMODIN: (userId: string, type: string) =>
      `${API_BASE_URL}/gamification/users/${userId}/comodines/${type}/use`,

    // Notifications
    NOTIFICATIONS: (userId: string) => `${API_BASE_URL}/gamification/users/${userId}/notifications`,
    MARK_NOTIFICATION_READ: (userId: string, notificationId: string) =>
      `${API_BASE_URL}/gamification/users/${userId}/notifications/${notificationId}/read`,
  },

  // Educational Module
  EDUCATIONAL: {
    BASE: `${API_BASE_URL}/educational`,

    // Modules
    MODULES: `${API_BASE_URL}/educational/modules`,
    MODULE_BY_ID: (id: string) => `${API_BASE_URL}/educational/modules/${id}`,
    MODULE_EXERCISES: (moduleId: string) => `${API_BASE_URL}/educational/modules/${moduleId}/exercises`,
    MODULE_PROGRESS: (moduleId: string, userId: string) =>
      `${API_BASE_URL}/educational/modules/${moduleId}/progress/${userId}`,

    // Exercises
    EXERCISES: `${API_BASE_URL}/educational/exercises`,
    EXERCISE_BY_ID: (id: string) => `${API_BASE_URL}/educational/exercises/${id}`,
    EXERCISE_SUBMIT: (id: string) => `${API_BASE_URL}/educational/exercises/${id}/submit`,
    EXERCISE_VALIDATE: (id: string) => `${API_BASE_URL}/educational/exercises/${id}/validate`,
    EXERCISE_HINTS: (id: string) => `${API_BASE_URL}/educational/exercises/${id}/hints`,

    // Media Resources
    MEDIA_RESOURCES: `${API_BASE_URL}/educational/media`,
    MEDIA_BY_ID: (id: string) => `${API_BASE_URL}/educational/media/${id}`,
    MEDIA_UPLOAD: `${API_BASE_URL}/educational/media/upload`,

    // Assessment Rubrics
    RUBRICS: `${API_BASE_URL}/educational/rubrics`,
    RUBRIC_BY_ID: (id: string) => `${API_BASE_URL}/educational/rubrics/${id}`,
  },

  // Progress Module
  PROGRESS: {
    BASE: `${API_BASE_URL}/progress`,

    // User Progress
    USER_PROGRESS: (userId: string) => `${API_BASE_URL}/progress/users/${userId}`,
    MODULE_PROGRESS: (userId: string, moduleId: string) =>
      `${API_BASE_URL}/progress/users/${userId}/modules/${moduleId}`,

    // Exercise Attempts
    EXERCISE_ATTEMPTS: (userId: string, exerciseId: string) =>
      `${API_BASE_URL}/progress/users/${userId}/exercises/${exerciseId}/attempts`,
    ATTEMPT_BY_ID: (attemptId: string) => `${API_BASE_URL}/progress/attempts/${attemptId}`,

    // Learning Sessions
    SESSIONS: (userId: string) => `${API_BASE_URL}/progress/users/${userId}/sessions`,
    SESSION_BY_ID: (sessionId: string) => `${API_BASE_URL}/progress/sessions/${sessionId}`,
    START_SESSION: (userId: string) => `${API_BASE_URL}/progress/users/${userId}/sessions/start`,
    END_SESSION: (sessionId: string) => `${API_BASE_URL}/progress/sessions/${sessionId}/end`,

    // Exercise Submissions
    SUBMISSIONS: (userId: string, exerciseId: string) =>
      `${API_BASE_URL}/progress/users/${userId}/exercises/${exerciseId}/submissions`,
    SUBMISSION_BY_ID: (submissionId: string) => `${API_BASE_URL}/progress/submissions/${submissionId}`,
  },

  // Social Module
  SOCIAL: {
    BASE: `${API_BASE_URL}/social`,

    // Friendships
    FRIENDS: (userId: string) => `${API_BASE_URL}/social/users/${userId}/friends`,
    FRIEND_REQUESTS: (userId: string) => `${API_BASE_URL}/social/users/${userId}/friend-requests`,
    SEND_FRIEND_REQUEST: (userId: string, friendId: string) =>
      `${API_BASE_URL}/social/users/${userId}/friends/${friendId}/request`,
    ACCEPT_FRIEND_REQUEST: (userId: string, friendId: string) =>
      `${API_BASE_URL}/social/users/${userId}/friends/${friendId}/accept`,

    // Schools
    SCHOOLS: `${API_BASE_URL}/social/schools`,
    SCHOOL_BY_ID: (id: string) => `${API_BASE_URL}/social/schools/${id}`,
    SCHOOL_CLASSROOMS: (schoolId: string) => `${API_BASE_URL}/social/schools/${schoolId}/classrooms`,

    // Classrooms
    CLASSROOMS: `${API_BASE_URL}/social/classrooms`,
    CLASSROOM_BY_ID: (id: string) => `${API_BASE_URL}/social/classrooms/${id}`,
    CLASSROOM_MEMBERS: (classroomId: string) => `${API_BASE_URL}/social/classrooms/${classroomId}/members`,
    JOIN_CLASSROOM: (classroomId: string) => `${API_BASE_URL}/social/classrooms/${classroomId}/join`,
    LEAVE_CLASSROOM: (classroomId: string) => `${API_BASE_URL}/social/classrooms/${classroomId}/leave`,

    // Teams
    TEAMS: `${API_BASE_URL}/social/teams`,
    TEAM_BY_ID: (id: string) => `${API_BASE_URL}/social/teams/${id}`,
    TEAM_MEMBERS: (teamId: string) => `${API_BASE_URL}/social/teams/${teamId}/members`,
    TEAM_CHALLENGES: (teamId: string) => `${API_BASE_URL}/social/teams/${teamId}/challenges`,
    JOIN_TEAM: (teamId: string) => `${API_BASE_URL}/social/teams/${teamId}/join`,
  },

  // Content Management Module
  CONTENT: {
    BASE: `${API_BASE_URL}/content`,

    // Templates
    TEMPLATES: `${API_BASE_URL}/content/templates`,
    TEMPLATE_BY_ID: (id: string) => `${API_BASE_URL}/content/templates/${id}`,

    // Marie Curie Content (specific content type)
    MARIE_CURIE: `${API_BASE_URL}/content/marie-curie`,
    MARIE_CURIE_BY_ID: (id: string) => `${API_BASE_URL}/content/marie-curie/${id}`,

    // Media Files
    MEDIA_FILES: `${API_BASE_URL}/content/media-files`,
    MEDIA_FILE_BY_ID: (id: string) => `${API_BASE_URL}/content/media-files/${id}`,
    UPLOAD_MEDIA: `${API_BASE_URL}/content/media-files/upload`,
  },

  // Health & Monitoring
  HEALTH: {
    BASE: `${API_BASE_URL}/health`,
    LIVENESS: `${API_BASE_URL}/health/liveness`,
    READINESS: `${API_BASE_URL}/health/readiness`,
    METRICS: `${API_BASE_URL}/health/metrics`,
  },
} as const;

/**
 * Type Helpers
 */
export type ApiEndpoint = string | ((...args: string[]) => string);
