/**
 * Social Features Module - DTOs Barrel Export
 *
 * @description Exporta todos los DTOs del módulo de características sociales.
 * Centraliza las importaciones para facilitar el uso en controladores y servicios.
 *
 * @module social/dto
 */

// Friendship DTOs
export { CreateFriendshipDto } from './create-friendship.dto';
export { FriendshipResponseDto } from './friendship-response.dto';
export { UpdateFriendshipStatusDto } from './update-friendship-status.dto';

// School DTOs
export { CreateSchoolDto } from './create-school.dto';
export { SchoolResponseDto } from './school-response.dto';

// Classroom DTOs
export { CreateClassroomDto } from './create-classroom.dto';
export { ClassroomResponseDto } from './classroom-response.dto';

// ClassroomMember DTOs
export { CreateClassroomMemberDto } from './create-classroom-member.dto';
export { ClassroomMemberResponseDto } from './classroom-member-response.dto';
export { UpdateClassroomMemberStatusDto } from './update-classroom-member-status.dto';

// Team DTOs
export { CreateTeamDto } from './create-team.dto';
export { TeamResponseDto } from './team-response.dto';

// TeamMember DTOs
export { CreateTeamMemberDto } from './create-team-member.dto';
export { TeamMemberResponseDto } from './team-member-response.dto';

// TeamChallenge DTOs
export { CreateTeamChallengeDto } from './create-team-challenge.dto';
export { TeamChallengeResponseDto } from './team-challenge-response.dto';

// PeerChallenge DTOs ✨ NUEVO - P2 (Epic EXT-009)
export { CreatePeerChallengeDto, ChallengeType } from './create-peer-challenge.dto';
export { UpdatePeerChallengeDto } from './update-peer-challenge.dto';

// ChallengeParticipant DTOs ✨ NUEVO - P2 (Epic EXT-009)
export { AddChallengeParticipantDto } from './add-challenge-participant.dto';
export { UpdateParticipantScoreDto } from './update-participant-score.dto';
export { DistributeRewardsDto } from './distribute-rewards.dto';

// DiscussionThread DTOs ✨ NUEVO - P0 (DB-100 Ciclo B.3 - 2025-11-11)
export { CreateDiscussionThreadDto } from './create-discussion-thread.dto';
export { UpdateDiscussionThreadDto } from './update-discussion-thread.dto';
export { DiscussionThreadResponseDto } from './discussion-thread-response.dto';
