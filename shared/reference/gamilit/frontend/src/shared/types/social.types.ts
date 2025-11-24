/**
 * Social Features Types
 *
 * SINCRONIZADO CON:
 * - Backend: /apps/backend/src/modules/social/entities/
 * - Database: /apps/database/ddl/schemas/social_features/
 *
 * ISSUE: #6 (P0) - Sincronización Types Backend ↔ Frontend
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 - Día 1
 */

// ==========================================
// FRIENDSHIPS
// ==========================================

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked'
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: Date;
  updated_at: Date;
}

export interface FriendshipWithUser extends Friendship {
  friend: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    current_rank: string;
    ml_coins: number;
  };
}

// ==========================================
// TEAMS
// ==========================================

/**
 * Roles de miembros de equipo (jerarquía estándar)
 * @updated 2025-11-04 - Sincronizado con Backend y DB
 */
export enum TeamMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface Team {
  id: string;
  name: string;
  description: string;
  created_by: string;
  max_members: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  joined_at: Date;
}

export interface TeamWithMembers extends Team {
  members: Array<{
    id: string;
    user_id: string;
    role: TeamMemberRole;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
  member_count: number;
}

// ==========================================
// CLASSROOMS
// ==========================================

export enum ClassroomMemberRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
  ASSISTANT = 'assistant'
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  code: string; // Código único para unirse
  teacher_id: string;
  school_id?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ClassroomMember {
  id: string;
  classroom_id: string;
  user_id: string;
  role: ClassroomMemberRole;
  joined_at: Date;
}

export interface ClassroomWithStats extends Classroom {
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  student_count: number;
  average_progress: number;
  active_students: number;
}

// ==========================================
// SCHOOLS
// ==========================================

export interface School {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ==========================================
// TEAM CHALLENGES
// ==========================================

export enum TeamChallengeStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface TeamChallenge {
  id: string;
  team_id: string;
  challenge_id: string;
  status: TeamChallengeStatus;
  started_at?: Date;
  completed_at?: Date;
  score: number;
  created_at: Date;
  updated_at: Date;
}

export interface TeamChallengeWithDetails extends TeamChallenge {
  team: Team;
  challenge: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
  };
}

// ==========================================
// DTOs - Create/Update
// ==========================================

export interface CreateFriendshipDto {
  friend_id: string;
}

export interface UpdateFriendshipDto {
  status: FriendshipStatus;
}

export interface CreateTeamDto {
  name: string;
  description: string;
  max_members?: number;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  max_members?: number;
  is_active?: boolean;
}

export interface CreateClassroomDto {
  name: string;
  description: string;
  school_id?: string;
}

export interface UpdateClassroomDto {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface JoinClassroomDto {
  code: string;
}

export interface CreateTeamChallengeDto {
  team_id: string;
  challenge_id: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface FriendshipsResponse {
  friendships: FriendshipWithUser[];
  total: number;
  pending_count: number;
  accepted_count: number;
}

export interface TeamsResponse {
  teams: TeamWithMembers[];
  total: number;
}

export interface ClassroomsResponse {
  classrooms: ClassroomWithStats[];
  total: number;
}
