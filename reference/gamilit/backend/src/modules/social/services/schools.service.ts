import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../entities';
import { CreateSchoolDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';

/**
 * SchoolsService
 *
 * Gestión de instituciones educativas (escuelas y colegios)
 * - CRUD de escuelas
 * - Multi-tenant: aislamiento por tenant
 * - Validación de códigos únicos
 * - Tracking de capacidad y estadísticas
 * - Configuraciones personalizables
 */
@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School, 'social')
    private readonly schoolRepo: Repository<School>,
  ) {}

  /**
   * Crea una nueva escuela
   * @param dto - Datos para crear la escuela
   * @returns Nueva escuela creada
   * @throws ConflictException si el código ya existe
   */
  async create(dto: CreateSchoolDto): Promise<School> {
    // Validar código único si se proporciona
    if (dto.code) {
      const existingSchool = await this.schoolRepo.findOne({
        where: { code: dto.code },
      });

      if (existingSchool) {
        throw new ConflictException(`School with code ${dto.code} already exists`);
      }
    }

    const school = this.schoolRepo.create({
      ...dto,
      current_students_count: 0,
      current_teachers_count: 0,
      is_active: true,
      is_verified: false,
      settings: dto.settings || {},
      metadata: dto.metadata || {},
    });

    return await this.schoolRepo.save(school);
  }

  /**
   * Obtiene todas las escuelas, opcionalmente filtradas por tenant
   * @param tenantId - ID del tenant (opcional)
   * @returns Lista de escuelas ordenadas por nombre
   */
  async findAll(tenantId?: string): Promise<School[]> {
    const whereCondition = tenantId ? { tenant_id: tenantId } : {};

    return await this.schoolRepo.find({
      where: whereCondition,
      order: { name: 'ASC' },
    });
  }

  /**
   * Obtiene una escuela por ID
   * @param id - ID de la escuela
   * @returns Escuela encontrada
   * @throws NotFoundException si la escuela no existe
   */
  async findById(id: string): Promise<School> {
    const school = await this.schoolRepo.findOne({ where: { id } });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }

  /**
   * Obtiene una escuela por su código único
   * @param code - Código de la escuela
   * @returns Escuela encontrada
   * @throws NotFoundException si la escuela no existe
   */
  async findByCode(code: string): Promise<School> {
    const school = await this.schoolRepo.findOne({ where: { code } });

    if (!school) {
      throw new NotFoundException(`School with code ${code} not found`);
    }

    return school;
  }

  /**
   * Actualiza una escuela
   * @param id - ID de la escuela
   * @param dto - Campos a actualizar
   * @returns Escuela actualizada
   * @throws NotFoundException si la escuela no existe
   * @throws ConflictException si el nuevo código ya existe
   */
  async update(id: string, dto: Partial<CreateSchoolDto>): Promise<School> {
    const school = await this.schoolRepo.findOne({ where: { id } });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    // Si se actualiza el código, validar unicidad
    if (dto.code && dto.code !== school.code) {
      const existingSchool = await this.schoolRepo.findOne({
        where: { code: dto.code },
      });

      if (existingSchool) {
        throw new ConflictException(`School with code ${dto.code} already exists`);
      }
    }

    Object.assign(school, dto);
    return await this.schoolRepo.save(school);
  }

  /**
   * Desactiva una escuela (soft delete)
   * @param id - ID de la escuela
   * @returns Escuela desactivada
   * @throws NotFoundException si la escuela no existe
   */
  async delete(id: string): Promise<School> {
    const school = await this.schoolRepo.findOne({ where: { id } });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    school.is_active = false;
    return await this.schoolRepo.save(school);
  }

  /**
   * Obtiene estadísticas de una escuela
   * @param id - ID de la escuela
   * @returns Estadísticas de estudiantes, profesores y aulas
   * @throws NotFoundException si la escuela no existe
   */
  async getSchoolStats(id: string): Promise<{
    student_count: number;
    teacher_count: number;
    classroom_count: number;
    capacity_usage_percentage: number;
    is_at_capacity: boolean;
  }> {
    const school = await this.schoolRepo.findOne({ where: { id } });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    const capacityUsage =
      school.max_students > 0
        ? (school.current_students_count / school.max_students) * 100
        : 0;

    return {
      student_count: school.current_students_count,
      teacher_count: school.current_teachers_count,
      classroom_count: 0, // TODO: Query classrooms table when available
      capacity_usage_percentage: Number(capacityUsage.toFixed(2)),
      is_at_capacity: school.current_students_count >= school.max_students,
    };
  }

  /**
   * Actualiza las configuraciones de una escuela
   * @param id - ID de la escuela
   * @param settings - Nuevas configuraciones (se mezclan con las existentes)
   * @returns Escuela actualizada
   * @throws NotFoundException si la escuela no existe
   */
  async updateSettings(
    id: string,
    settings: Record<string, any>,
  ): Promise<School> {
    const school = await this.schoolRepo.findOne({ where: { id } });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    school.settings = {
      ...school.settings,
      ...settings,
    };

    return await this.schoolRepo.save(school);
  }
}
