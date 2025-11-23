/**
 * Social Features Module - Entities Barrel Export
 *
 * @description Exporta todas las entidades del módulo de características sociales.
 * Centraliza las importaciones para facilitar el uso en otros módulos.
 *
 * @module social/entities
 */

export { Friendship } from './friendship.entity';
export { School } from './school.entity';
export { Classroom } from './classroom.entity';
export { ClassroomMember } from './classroom-member.entity';
export { Team } from './team.entity';
export { TeamMember } from './team-member.entity';
export { TeamChallenge } from './team-challenge.entity';
export { AssignmentClassroom } from './assignment-classroom.entity'; // ✨ NUEVO - P2 (Assignments → Classrooms)
export { PeerChallenge } from './peer-challenge.entity'; // ✨ NUEVO - P2 (Epic EXT-009)
export { ChallengeParticipant } from './challenge-participant.entity'; // ✨ NUEVO - P2 (Epic EXT-009)
export { DiscussionThread } from './discussion-thread.entity'; // ✨ NUEVO - P0 (DB-100 Ciclo B.3 - 2025-11-11)
export { TeacherClassroom, TeacherClassroomRole } from './teacher-classroom.entity'; // ✨ NUEVO - P0 (BE-088 - 2025-11-11)
