import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TeamMember } from '../entities';
import { CreateTeamMemberDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { TeamMemberRoleEnum } from '@shared/constants/enums.constants';

/**
 * TeamMembersService
 *
 * Gestión de membresía de usuarios en equipos
 * - CRUD de miembros de equipos
 * - Roles: owner, admin, member
 * - Transferencia de ownership
 * - Prevención de remoción del último owner
 * - Auto-promoción de admin a owner cuando sea necesario
 */
@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember, 'social')
    private readonly teamMemberRepo: Repository<TeamMember>,
  ) {}

  /**
   * Agrega un miembro a un equipo
   * @param dto - Datos del miembro
   * @returns Nuevo miembro creado
   * @throws ConflictException si el usuario ya es miembro del equipo
   */
  async create(dto: CreateTeamMemberDto): Promise<TeamMember> {
    // Verificar que no exista membresía previa activa
    const existingMember = await this.teamMemberRepo.findOne({
      where: {
        team_id: dto.team_id,
        user_id: dto.user_id,
        left_at: IsNull(),
      },
    });

    if (existingMember) {
      throw new ConflictException(
        `User ${dto.user_id} is already a member of team ${dto.team_id}`,
      );
    }

    const member = this.teamMemberRepo.create({
      ...dto,
      joined_at: new Date(),
      role: dto.role || TeamMemberRoleEnum.MEMBER,
    });

    return await this.teamMemberRepo.save(member);
  }

  /**
   * Obtiene todos los miembros de un equipo (incluyendo inactivos)
   * @param teamId - ID del equipo
   * @returns Lista de miembros ordenados por fecha de ingreso
   */
  async findByTeamId(teamId: string): Promise<TeamMember[]> {
    return await this.teamMemberRepo.find({
      where: { team_id: teamId },
      order: { joined_at: 'ASC' },
    });
  }

  /**
   * Obtiene todos los equipos en los que participa un usuario
   * @param userId - ID del usuario
   * @returns Lista de membresías ordenadas por fecha de ingreso
   */
  async findByUserId(userId: string): Promise<TeamMember[]> {
    return await this.teamMemberRepo.find({
      where: { user_id: userId },
      order: { joined_at: 'DESC' },
    });
  }

  /**
   * Obtiene una membresía específica de un usuario en un equipo
   * @param teamId - ID del equipo
   * @param userId - ID del usuario
   * @returns Membresía encontrada
   * @throws NotFoundException si no existe la membresía
   */
  async findByTeamAndUser(teamId: string, userId: string): Promise<TeamMember> {
    const member = await this.teamMemberRepo.findOne({
      where: {
        team_id: teamId,
        user_id: userId,
        left_at: IsNull(),
      },
    });

    if (!member) {
      throw new NotFoundException(
        `User ${userId} is not a member of team ${teamId}`,
      );
    }

    return member;
  }

  /**
   * Actualiza el rol de un miembro
   * @param id - ID de la membresía
   * @param role - Nuevo rol
   * @returns Membresía actualizada
   * @throws NotFoundException si no existe la membresía
   * @throws BadRequestException si se intenta degradar al único owner
   */
  async updateRole(id: string, role: string): Promise<TeamMember> {
    const member = await this.teamMemberRepo.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    // Si el miembro actual es owner, verificar que no sea el único
    if (member.role === TeamMemberRoleEnum.OWNER && role !== TeamMemberRoleEnum.OWNER) {
      const ownerCount = await this.teamMemberRepo.count({
        where: {
          team_id: member.team_id,
          role: TeamMemberRoleEnum.OWNER,
          left_at: IsNull(),
        },
      });

      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot remove the last owner from the team');
      }
    }

    member.role = role;
    return await this.teamMemberRepo.save(member);
  }

  /**
   * Retira un miembro de un equipo
   * @param id - ID de la membresía
   * @returns Membresía actualizada
   * @throws NotFoundException si no existe la membresía
   * @throws BadRequestException si se intenta remover al único owner
   */
  async remove(id: string): Promise<TeamMember> {
    const member = await this.teamMemberRepo.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    // Si el miembro es owner, verificar que no sea el único
    if (member.role === TeamMemberRoleEnum.OWNER) {
      const ownerCount = await this.teamMemberRepo.count({
        where: {
          team_id: member.team_id,
          role: TeamMemberRoleEnum.OWNER,
          left_at: IsNull(),
        },
      });

      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot remove the last owner from the team');
      }
    }

    member.left_at = new Date();
    return await this.teamMemberRepo.save(member);
  }

  /**
   * Obtiene solo los miembros activos de un equipo
   * @param teamId - ID del equipo
   * @returns Lista de miembros activos ordenados por rol
   */
  async getActiveMembers(teamId: string): Promise<TeamMember[]> {
    return await this.teamMemberRepo.find({
      where: {
        team_id: teamId,
        left_at: IsNull(),
      },
      order: {
        role: 'ASC', // owner < admin < member (alfabético)
        joined_at: 'ASC',
      },
    });
  }

  /**
   * Transfiere el ownership de un equipo a otro miembro
   * @param teamId - ID del equipo
   * @param newOwnerId - ID del nuevo owner
   * @returns Membresía del nuevo owner actualizada
   * @throws NotFoundException si el equipo o el nuevo owner no existen
   * @throws BadRequestException si el nuevo owner no es miembro activo
   */
  async transferOwnership(teamId: string, newOwnerId: string): Promise<TeamMember> {
    // Verificar que el nuevo owner sea miembro activo
    const newOwnerMember = await this.teamMemberRepo.findOne({
      where: {
        team_id: teamId,
        user_id: newOwnerId,
        left_at: IsNull(),
      },
    });

    if (!newOwnerMember) {
      throw new NotFoundException(
        `User ${newOwnerId} is not an active member of team ${teamId}`,
      );
    }

    // Degradar a todos los owners actuales a admin
    const currentOwners = await this.teamMemberRepo.find({
      where: {
        team_id: teamId,
        role: TeamMemberRoleEnum.OWNER,
        left_at: IsNull(),
      },
    });

    for (const owner of currentOwners) {
      owner.role = TeamMemberRoleEnum.ADMIN;
      await this.teamMemberRepo.save(owner);
    }

    // Promover al nuevo owner
    newOwnerMember.role = TeamMemberRoleEnum.OWNER;
    return await this.teamMemberRepo.save(newOwnerMember);
  }
}
