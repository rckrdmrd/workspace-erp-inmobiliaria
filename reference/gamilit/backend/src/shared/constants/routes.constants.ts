/**
 * API Routes Constants - Backend
 *
 * @description Single source of truth para rutas API del backend NestJS.
 * @usage import { API_ROUTES } from '@/shared/constants';
 *
 * IMPORTANTE:
 * - Debe coincidir EXACTAMENTE con Frontend api-endpoints.ts
 * - Validado automáticamente por validate-api-contract.ts en CI/CD
 *
 * @see /docs/03-desarrollo/CONSTANTS-ARCHITECTURE.md
 */

/**
 * API Version
 */
export const API_VERSION = 'v1';

/**
 * API Base Path
 */
export const API_BASE = `/api/${API_VERSION}`;

/**
 * API Routes por módulo
 */
export const API_ROUTES = {
  // Auth Module
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
  },

  // Users Module
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
    PREFERENCES: (id: string) => `/users/${id}/preferences`,
    ROLES: (id: string) => `/users/${id}/roles`,
    STATS: (id: string) => `/users/${id}/stats`,
  },

  // Gamification Module
  GAMIFICATION: {
    BASE: '/gamification',

    // Achievements
    ACHIEVEMENTS: '/gamification/achievements',
    ACHIEVEMENT_BY_ID: (id: string) => `/gamification/achievements/${id}`,
    USER_ACHIEVEMENTS: (userId: string) => `/gamification/users/${userId}/achievements`,
    GRANT_ACHIEVEMENT: (userId: string, achievementId: string) =>
      `/gamification/users/${userId}/achievements/${achievementId}`,

    // Leaderboard
    LEADERBOARD: '/gamification/leaderboard',
    LEADERBOARD_BY_PERIOD: (period: string) => `/gamification/leaderboard/${period}`,

    // User Stats & Ranks
    USER_STATS: (userId: string) => `/gamification/users/${userId}/stats`,
    USER_RANK: (userId: string) => `/gamification/users/${userId}/rank`,
    RANK_HISTORY: (userId: string) => `/gamification/users/${userId}/rank/history`,

    // Rewards & ML Coins
    REWARDS: (userId: string) => `/gamification/users/${userId}/rewards`,
    ML_COINS_BALANCE: (userId: string) => `/gamification/users/${userId}/ml-coins`,
    ML_COINS_TRANSACTIONS: (userId: string) =>
      `/gamification/users/${userId}/ml-coins/transactions`,

    // Missions
    MISSIONS: '/gamification/missions',
    MISSION_BY_ID: (id: string) => `/gamification/missions/${id}`,
    USER_MISSIONS: (userId: string) => `/gamification/users/${userId}/missions`,
    ASSIGN_MISSION: (userId: string, missionId: string) =>
      `/gamification/users/${userId}/missions/${missionId}`,

    // Comodines (Power-ups)
    COMODINES: (userId: string) => `/gamification/users/${userId}/comodines`,
    PURCHASE_COMODIN: (userId: string, type: string) =>
      `/gamification/users/${userId}/comodines/${type}/purchase`,
    USE_COMODIN: (userId: string, type: string) =>
      `/gamification/users/${userId}/comodines/${type}/use`,

    // Notifications
    NOTIFICATIONS: (userId: string) => `/gamification/users/${userId}/notifications`,
    MARK_NOTIFICATION_READ: (userId: string, notificationId: string) =>
      `/gamification/users/${userId}/notifications/${notificationId}/read`,
  },

  // Educational Module
  EDUCATIONAL: {
    BASE: '/educational',

    // Modules
    MODULES: '/educational/modules',
    MODULE_BY_ID: (id: string) => `/educational/modules/${id}`,
    MODULE_EXERCISES: (moduleId: string) => `/educational/modules/${moduleId}/exercises`,
    MODULE_PROGRESS: (moduleId: string, userId: string) =>
      `/educational/modules/${moduleId}/progress/${userId}`,

    // Exercises
    EXERCISES: '/educational/exercises',
    EXERCISE_BY_ID: (id: string) => `/educational/exercises/${id}`,
    EXERCISE_SUBMIT: (id: string) => `/educational/exercises/${id}/submit`,
    EXERCISE_VALIDATE: (id: string) => `/educational/exercises/${id}/validate`,
    EXERCISE_HINTS: (id: string) => `/educational/exercises/${id}/hints`,

    // Media Resources
    MEDIA_RESOURCES: '/educational/media',
    MEDIA_BY_ID: (id: string) => `/educational/media/${id}`,
    MEDIA_UPLOAD: '/educational/media/upload',

    // Assessment Rubrics
    RUBRICS: '/educational/rubrics',
    RUBRIC_BY_ID: (id: string) => `/educational/rubrics/${id}`,
  },

  // Progress Module
  PROGRESS: {
    BASE: '/progress',

    // Module Progress Routes
    USER_PROGRESS: (userId: string) => `/progress/users/${userId}`,
    MODULE_PROGRESS: (userId: string, moduleId: string) =>
      `/progress/users/${userId}/modules/${moduleId}`,
    UPDATE_PROGRESS_PERCENTAGE: (id: string) => `/progress/${id}/percentage`,
    COMPLETE_MODULE: (id: string) => `/progress/${id}/complete`,
    MODULE_STATS: (moduleId: string) => `/progress/modules/${moduleId}/stats`,
    USER_PROGRESS_SUMMARY: (userId: string) => `/progress/users/${userId}/summary`,
    USER_IN_PROGRESS: (userId: string) => `/progress/users/${userId}/in-progress`,
    USER_LEARNING_PATH: (userId: string) => `/progress/users/${userId}/learning-path`,

    // Learning Sessions Routes
    SESSIONS: '/progress/sessions',
    SESSIONS_BY_USER: (userId: string) => `/progress/sessions/users/${userId}`,
    SESSION_BY_ID: (sessionId: string) => `/progress/sessions/${sessionId}`,
    END_SESSION: (sessionId: string) => `/progress/sessions/${sessionId}/end`,
    UPDATE_ENGAGEMENT: (sessionId: string) => `/progress/sessions/${sessionId}/engagement`,
    ACTIVE_SESSION: (userId: string) => `/progress/sessions/users/${userId}/active`,
    SESSION_STATS: (userId: string) => `/progress/sessions/users/${userId}/stats`,
    SESSION_DATE_RANGE: (userId: string) => `/progress/sessions/users/${userId}/range`,

    // Exercise Attempts Routes
    ATTEMPTS: '/progress/attempts',
    ATTEMPTS_BY_USER: (userId: string) => `/progress/attempts/users/${userId}`,
    ATTEMPTS_BY_EXERCISE: (exerciseId: string) => `/progress/attempts/exercises/${exerciseId}`,
    ATTEMPTS_BY_USER_EXERCISE: (userId: string, exerciseId: string) =>
      `/progress/attempts/users/${userId}/exercises/${exerciseId}`,
    NEXT_ATTEMPT_NUMBER: (userId: string, exerciseId: string) =>
      `/progress/attempts/users/${userId}/exercises/${exerciseId}/next-number`,
    SUBMIT_ATTEMPT: (attemptId: string) => `/progress/attempts/${attemptId}/submit`,
    ATTEMPT_STATS: (userId: string) => `/progress/attempts/users/${userId}/stats`,
    BEST_ATTEMPT: (userId: string, exerciseId: string) =>
      `/progress/attempts/users/${userId}/exercises/${exerciseId}/best`,
    TRACK_COMODINES: (attemptId: string) => `/progress/attempts/${attemptId}/comodines`,

    // Exercise Submissions Routes
    SUBMISSIONS: '/progress/submissions',
    SUBMISSIONS_BY_USER: (userId: string) => `/progress/submissions/users/${userId}`,
    SUBMISSIONS_BY_EXERCISE: (exerciseId: string) =>
      `/progress/submissions/exercises/${exerciseId}`,
    SUBMISSIONS_BY_USER_EXERCISE: (userId: string, exerciseId: string) =>
      `/progress/submissions/users/${userId}/exercises/${exerciseId}`,
    SUBMIT_EXERCISE: '/progress/submissions/submit',
    GRADE_SUBMISSION: (submissionId: string) => `/progress/submissions/${submissionId}/grade`,
    PROVIDE_FEEDBACK: (submissionId: string) =>
      `/progress/submissions/${submissionId}/feedback`,
    UPDATE_STATUS: (submissionId: string) => `/progress/submissions/${submissionId}/status`,
    SUBMISSION_STATS: (userId: string) => `/progress/submissions/users/${userId}/stats`,
    PENDING_REVIEW: '/progress/submissions/pending-review',
    CLAIM_REWARDS: (submissionId: string) => `/progress/submissions/${submissionId}/claim-rewards`,

    // Scheduled Missions Routes
    SCHEDULED_MISSIONS: '/progress/scheduled-missions',
    SCHEDULED_MISSIONS_BY_CLASSROOM: (classroomId: string) =>
      `/progress/scheduled-missions/classrooms/${classroomId}`,
    SCHEDULED_MISSIONS_BY_USER: (userId: string) =>
      `/progress/scheduled-missions/users/${userId}`,
    ACTIVE_MISSIONS: '/progress/scheduled-missions/active',
    UPCOMING_MISSIONS: (userId: string) => `/progress/scheduled-missions/users/${userId}/upcoming`,
    START_MISSION: (missionId: string) => `/progress/scheduled-missions/${missionId}/start`,
    COMPLETE_MISSION: (missionId: string) => `/progress/scheduled-missions/${missionId}/complete`,
    UPDATE_MISSION_PROGRESS: (missionId: string) =>
      `/progress/scheduled-missions/${missionId}/progress`,
    CLAIM_BONUS_REWARDS: (missionId: string) =>
      `/progress/scheduled-missions/${missionId}/claim-rewards`,
  },

  // Social Module
  SOCIAL: {
    BASE: '/social',

    // Friendships Routes (~10 endpoints)
    USER_FRIENDS: (userId: string) => `/social/users/${userId}/friends`,
    PENDING_FRIEND_REQUESTS: (userId: string) => `/social/users/${userId}/friends/pending`,
    SENT_FRIEND_REQUESTS: (userId: string) => `/social/users/${userId}/friends/sent`,
    SEND_FRIEND_REQUEST: '/social/friendships/request',
    ACCEPT_FRIEND_REQUEST: (friendshipId: string) => `/social/friendships/${friendshipId}/accept`,
    REJECT_FRIEND_REQUEST: (friendshipId: string) => `/social/friendships/${friendshipId}/reject`,
    BLOCK_USER: (userId: string, friendId: string) => `/social/users/${userId}/block/${friendId}`,
    UNBLOCK_USER: (userId: string, friendId: string) => `/social/users/${userId}/block/${friendId}`,
    REMOVE_FRIEND: (userId: string, friendId: string) => `/social/users/${userId}/friends/${friendId}`,
    CHECK_FRIENDSHIP: (userId1: string, userId2: string) => `/social/users/${userId1}/${userId2}/friendship`,

    // Schools Routes (~8 endpoints)
    SCHOOLS: '/social/schools',
    SCHOOL_BY_ID: (id: string) => `/social/schools/${id}`,
    SCHOOL_BY_CODE: (code: string) => `/social/schools/code/${code}`,
    CREATE_SCHOOL: '/social/schools',
    UPDATE_SCHOOL: (id: string) => `/social/schools/${id}`,
    DELETE_SCHOOL: (id: string) => `/social/schools/${id}`,
    SCHOOL_STATS: (id: string) => `/social/schools/${id}/stats`,
    SCHOOL_SETTINGS: (id: string) => `/social/schools/${id}/settings`,

    // Classrooms Routes (~12 endpoints)
    CLASSROOMS: '/social/classrooms',
    CLASSROOM_BY_ID: (id: string) => `/social/classrooms/${id}`,
    CLASSROOM_BY_CODE: (code: string) => `/social/classrooms/code/${code}`,
    CREATE_CLASSROOM: '/social/classrooms',
    UPDATE_CLASSROOM: (id: string) => `/social/classrooms/${id}`,
    DELETE_CLASSROOM: (id: string) => `/social/classrooms/${id}`,
    CLASSROOM_STATS: (id: string) => `/social/classrooms/${id}/stats`,
    ACTIVE_CLASSROOMS: (teacherId: string) => `/social/teachers/${teacherId}/classrooms/active`,
    ENROLL_STUDENT: (classroomId: string, studentId: string) => `/social/classrooms/${classroomId}/students/${studentId}`,
    REMOVE_STUDENT: (classroomId: string, studentId: string) => `/social/classrooms/${classroomId}/students/${studentId}`,
    UPDATE_CLASSROOM_SCHEDULE: (id: string) => `/social/classrooms/${id}/schedule`,
    CLASSROOM_MEMBERS: (classroomId: string) => `/social/classrooms/${classroomId}/members`,

    // Classroom Members Routes (~10 endpoints)
    GET_CLASSROOM_MEMBERS: (classroomId: string) => `/social/classroom-members/classrooms/${classroomId}`,
    GET_USER_CLASSROOMS: (userId: string) => `/social/classroom-members/users/${userId}`,
    GET_CLASSROOM_MEMBER: (classroomId: string, userId: string) => `/social/classroom-members/classrooms/${classroomId}/users/${userId}`,
    CREATE_CLASSROOM_MEMBER: '/social/classroom-members',
    UPDATE_MEMBER_STATUS: (id: string) => `/social/classroom-members/${id}/status`,
    RECORD_GRADE: (id: string) => `/social/classroom-members/${id}/grade`,
    UPDATE_ATTENDANCE: (id: string) => `/social/classroom-members/${id}/attendance`,
    WITHDRAW_MEMBER: (id: string) => `/social/classroom-members/${id}/withdraw`,
    ACTIVE_CLASSROOM_MEMBERS: (classroomId: string) => `/social/classroom-members/classrooms/${classroomId}/active`,
    CLASSROOM_LEADERBOARD: (classroomId: string) => `/social/classroom-members/classrooms/${classroomId}/leaderboard`,

    // Teams Routes (~13 endpoints)
    TEAMS: '/social/teams',
    TEAM_BY_ID: (id: string) => `/social/teams/${id}`,
    TEAM_BY_CODE: (code: string) => `/social/teams/code/${code}`,
    CREATE_TEAM: '/social/teams',
    UPDATE_TEAM: (id: string) => `/social/teams/${id}`,
    DELETE_TEAM: (id: string) => `/social/teams/${id}`,
    ADD_TEAM_MEMBER: (teamId: string, userId: string) => `/social/teams/${teamId}/members/${userId}`,
    REMOVE_TEAM_MEMBER: (teamId: string, userId: string) => `/social/teams/${teamId}/members/${userId}`,
    UPDATE_TEAM_SCORE: (id: string) => `/social/teams/${id}/score`,
    ADD_TEAM_XP: (id: string) => `/social/teams/${id}/xp`,
    TEAM_LEADERBOARD: (classroomId: string) => `/social/classrooms/${classroomId}/teams/leaderboard`,
    TEAM_STATS: (id: string) => `/social/teams/${id}/stats`,
    TEAM_MEMBERS: (teamId: string) => `/social/teams/${teamId}/members`,

    // Team Members Routes (~8 endpoints)
    GET_TEAM_MEMBERS: (teamId: string) => `/social/team-members/teams/${teamId}`,
    GET_USER_TEAMS: (userId: string) => `/social/team-members/users/${userId}`,
    GET_TEAM_MEMBER: (teamId: string, userId: string) => `/social/team-members/teams/${teamId}/users/${userId}`,
    CREATE_TEAM_MEMBER: '/social/team-members',
    UPDATE_TEAM_MEMBER_ROLE: (id: string) => `/social/team-members/${id}/role`,
    DELETE_TEAM_MEMBER: (id: string) => `/social/team-members/${id}`,
    ACTIVE_TEAM_MEMBERS: (teamId: string) => `/social/team-members/teams/${teamId}/active`,
    TRANSFER_TEAM_OWNERSHIP: (teamId: string) => `/social/team-members/teams/${teamId}/transfer-ownership`,

    // Team Challenges Routes (~9 endpoints)
    GET_TEAM_CHALLENGES: (teamId: string) => `/social/team-challenges/teams/${teamId}`,
    GET_CHALLENGE_TEAMS: (challengeId: string) => `/social/team-challenges/challenges/${challengeId}`,
    GET_TEAM_CHALLENGE: (teamId: string, challengeId: string) => `/social/team-challenges/teams/${teamId}/challenges/${challengeId}`,
    CREATE_TEAM_CHALLENGE: '/social/team-challenges',
    UPDATE_CHALLENGE_STATUS: (id: string) => `/social/team-challenges/${id}/status`,
    RECORD_CHALLENGE_SCORE: (id: string) => `/social/team-challenges/${id}/score`,
    COMPLETE_CHALLENGE: (id: string) => `/social/team-challenges/${id}/complete`,
    FAIL_CHALLENGE: (id: string) => `/social/team-challenges/${id}/fail`,
    CHALLENGE_LEADERBOARD: (challengeId: string) => `/social/team-challenges/challenges/${challengeId}/leaderboard`,
  },

  // Content Management Module
  CONTENT: {
    BASE: '/content',

    // Content Templates (9 endpoints)
    TEMPLATES: '/content/templates',
    TEMPLATE_BY_ID: (id: string) => `/content/templates/${id}`,
    CREATE_TEMPLATE: '/content/templates',
    UPDATE_TEMPLATE: (id: string) => `/content/templates/${id}`,
    DELETE_TEMPLATE: (id: string) => `/content/templates/${id}`,
    INCREMENT_TEMPLATE_USAGE: (id: string) => `/content/templates/${id}/use`,
    TEMPLATES_BY_TYPE: (type: string) => `/content/templates/type/${type}`,
    TEMPLATES_BY_CATEGORY: (category: string) => `/content/templates/category/${category}`,
    POPULAR_TEMPLATES: '/content/templates/popular',

    // Marie Curie Content (10 endpoints)
    MARIE_CURIE: '/content/marie-curie',
    MARIE_CURIE_BY_ID: (id: string) => `/content/marie-curie/${id}`,
    MARIE_CURIE_BY_CATEGORY: (category: string) => `/content/marie-curie/category/${category}`,
    CREATE_MARIE_CURIE: '/content/marie-curie',
    UPDATE_MARIE_CURIE: (id: string) => `/content/marie-curie/${id}`,
    DELETE_MARIE_CURIE: (id: string) => `/content/marie-curie/${id}`,
    PUBLISH_MARIE_CURIE: (id: string) => `/content/marie-curie/${id}/publish`,
    MARIE_CURIE_PUBLISHED: '/content/marie-curie/published',
    MARIE_CURIE_FEATURED: '/content/marie-curie/featured',

    // Media Files (13 endpoints)
    MEDIA_FILES: '/content/media-files',
    MEDIA_FILE_BY_ID: (id: string) => `/content/media-files/${id}`,
    UPLOAD_MEDIA: '/content/media-files',
    UPDATE_MEDIA: (id: string) => `/content/media-files/${id}`,
    DELETE_MEDIA: (id: string) => `/content/media-files/${id}`,
    MEDIA_BY_TYPE: (fileType: string) => `/content/media-files/type/${fileType}`,
    SEARCH_MEDIA_BY_TAGS: '/content/media-files/search',
    UPDATE_MEDIA_STATUS: (id: string) => `/content/media-files/${id}/status`,
    MEDIA_STATS: '/content/media-files/stats',
    MEDIA_BY_UPLOADER: (userId: string) => `/content/media-files/users/${userId}`,
    GENERATE_THUMBNAIL: (id: string) => `/content/media-files/${id}/thumbnail`,
    INCREMENT_MEDIA_COUNTER: (id: string, counterType: string) => `/content/media-files/${id}/increment/${counterType}`,
  },

  // Health & Monitoring
  HEALTH: {
    BASE: '/health',
    LIVENESS: '/health/liveness',
    READINESS: '/health/readiness',
    METRICS: '/health/metrics',
  },
} as const;

/**
 * Helper: Construir URL completa con base
 *
 * @example
 * buildApiUrl('/auth/login') => '/api/v1/auth/login'
 */
export const buildApiUrl = (route: string): string => {
  return `${API_BASE}${route}`;
};

/**
 * Helper: Extraer base path (para @Controller)
 *
 * @example
 * extractBasePath('/users') => 'users'
 */
export const extractBasePath = (route: string): string => {
  return route.replace(/^\//, '');
};

/**
 * Helper: Construir ruta con parámetros
 *
 * @example
 * buildRoute('/users/:id', { id: '123' }) => '/users/123'
 */
export const buildRoute = (template: string, params: Record<string, string>): string => {
  let route = template;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });
  return route;
};
