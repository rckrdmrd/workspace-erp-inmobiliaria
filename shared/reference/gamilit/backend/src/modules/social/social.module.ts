import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_SCHEMAS } from '@/shared/constants';
import * as entities from './entities';
import * as services from './services';
import * as controllers from './controllers';

/**
 * SocialModule
 *
 * @description Módulo de características sociales de Gamilit.
 * Gestiona amistades, escuelas, aulas, equipos y desafíos colaborativos.
 *
 * @entities
 * - Friendship: Relaciones de amistad entre usuarios
 * - School: Instituciones educativas
 * - Classroom: Aulas virtuales
 * - ClassroomMember: Membresía de estudiantes en aulas
 * - Team: Equipos colaborativos
 * - TeamMember: Membresía de usuarios en equipos
 * - TeamChallenge: Desafíos asignados a equipos
 * - AssignmentClassroom: Asignaciones asignadas a aulas completas
 * - PeerChallenge: Desafíos peer-to-peer entre estudiantes (Epic EXT-009)
 * - ChallengeParticipant: Participantes de peer challenges con rankings
 *
 * @services
 * - FriendshipsService: Gestión de amistades y bloqueos
 * - SchoolsService: CRUD de instituciones educativas
 * - ClassroomsService: CRUD de aulas virtuales
 * - ClassroomMembersService: Gestión de membresía en aulas
 * - TeamsService: CRUD de equipos colaborativos
 * - TeamMembersService: Gestión de membresía en equipos
 * - TeamChallengesService: Gestión de desafíos de equipos
 *
 * @controllers
 * - FriendshipsController: 10 endpoints para amistades
 * - SchoolsController: 8 endpoints para escuelas
 * - ClassroomsController: 12 endpoints para aulas
 * - ClassroomMembersController: 10 endpoints para miembros de aulas
 * - TeamsController: 13 endpoints para equipos
 * - TeamMembersController: 8 endpoints para miembros de equipos
 * - TeamChallengesController: 9 endpoints para desafíos
 * - PeerChallengesController: 16 endpoints para peer challenges (Epic EXT-009)
 * - ChallengeParticipantsController: 15 endpoints para participantes (Epic EXT-009)
 *
 * @totalEndpoints 101 endpoints RESTful con documentación Swagger completa
 */
@Module({
  imports: [
    // Connection 'social' handles schema 'social_features'
    TypeOrmModule.forFeature(
      [
        entities.Friendship,
        entities.School,
        entities.Classroom,
        entities.ClassroomMember,
        entities.Team,
        entities.TeamMember,
        entities.TeamChallenge,
        entities.AssignmentClassroom, // ✨ NUEVO - P2 (Assignments → Classrooms)
        entities.PeerChallenge, // ✨ NUEVO - P2 (Epic EXT-009)
        entities.ChallengeParticipant, // ✨ NUEVO - P2 (Epic EXT-009)
      ],
      'social',
    ),
  ],
  providers: [
    services.FriendshipsService,
    services.SchoolsService,
    services.ClassroomsService,
    services.ClassroomMembersService,
    services.TeamsService,
    services.TeamMembersService,
    services.TeamChallengesService,
    services.PeerChallengesService, // ✨ NUEVO - P2 (Epic EXT-009)
    services.ChallengeParticipantsService, // ✨ NUEVO - P2 (Epic EXT-009)
  ],
  controllers: [
    controllers.FriendshipsController,
    controllers.SchoolsController,
    controllers.ClassroomsController,
    controllers.ClassroomMembersController,
    controllers.TeamsController,
    controllers.TeamMembersController,
    controllers.TeamChallengesController,
    controllers.PeerChallengesController, // ✨ NUEVO - P2 (Epic EXT-009)
    controllers.ChallengeParticipantsController, // ✨ NUEVO - P2 (Epic EXT-009)
  ],
  exports: [
    services.FriendshipsService,
    services.SchoolsService,
    services.ClassroomsService,
    services.ClassroomMembersService,
    services.TeamsService,
    services.TeamMembersService,
    services.TeamChallengesService,
    services.PeerChallengesService, // ✨ NUEVO - P2 (Epic EXT-009)
    services.ChallengeParticipantsService, // ✨ NUEVO - P2 (Epic EXT-009)
  ],
})
export class SocialModule {}
