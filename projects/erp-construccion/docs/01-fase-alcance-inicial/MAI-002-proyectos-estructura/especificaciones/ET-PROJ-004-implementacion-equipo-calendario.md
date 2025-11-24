# ET-PROJ-004: Implementación de Equipo y Calendario

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Requerimiento base:** RF-PROJ-004
**Prioridad:** P0 (Crítica)
**Estimación:** 6 SP
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Resumen Ejecutivo

Esta especificación técnica implementa:
- **Asignación de Equipo**: Director, Residentes, Ingenieros, Supervisores por proyecto
- **Gestión de Workload**: Validación de límites de carga de trabajo por rol
- **Milestones**: Hitos del proyecto con dependencias y fechas
- **Fechas Críticas**: Alertas automáticas para compromisos contractuales
- **Dashboard de Equipo**: Vista consolidada de asignaciones y disponibilidad

El sistema garantiza que ningún usuario exceda su capacidad de trabajo y emite alertas proactivas sobre fechas cercanas.

---

## 2. Arquitectura de Base de Datos

### 2.1 Schema SQL

```sql
-- Schema: projects
CREATE SCHEMA IF NOT EXISTS projects;

-- =====================================================
-- TABLA: projects.project_team_assignments
-- =====================================================
CREATE TABLE projects.project_team_assignments (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Multi-tenant discriminator (inherited from project)
  -- tenant = constructora in this system (see GLOSARIO.md)
  constructora_id UUID NOT NULL,
  user_id UUID NOT NULL,

  -- Rol y especialidad
  role VARCHAR(50) NOT NULL,
  -- Valores: director | resident | engineer | supervisor | purchases_manager

  specialty VARCHAR(100),
  -- Valores: structural | installations | electrical | costs | quality | safety

  -- Asignación
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  is_primary BOOLEAN DEFAULT false,
  -- Indica si es el responsable principal (ej: Residente principal vs suplente)

  -- Workload
  workload_percentage INTEGER NOT NULL DEFAULT 100,
  -- Ej: 100 = dedicación completa, 50 = medio tiempo, 25 = cuarto tiempo

  -- Responsabilidades específicas
  responsibilities TEXT[],
  -- Ej: ["Supervision de cimentacion", "Control de calidad", "Seguridad"]

  notes TEXT,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT check_workload_range CHECK (workload_percentage > 0 AND workload_percentage <= 100),
  CONSTRAINT check_valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_team_assignments_project ON projects.project_team_assignments(project_id);
CREATE INDEX idx_team_assignments_user ON projects.project_team_assignments(user_id);
CREATE INDEX idx_team_assignments_constructora ON projects.project_team_assignments(constructora_id);
CREATE INDEX idx_team_assignments_role ON projects.project_team_assignments(role);
CREATE INDEX idx_team_assignments_active ON projects.project_team_assignments(is_active);

-- =====================================================
-- TABLA: projects.project_milestones
-- =====================================================
CREATE TABLE projects.project_milestones (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Multi-tenant discriminator (inherited from project)
  -- tenant = constructora in this system (see GLOSARIO.md)
  constructora_id UUID NOT NULL,

  -- Información básica
  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Tipo de hito
  milestone_type VARCHAR(50) NOT NULL,
  -- Valores:
  -- project_kickoff | permits_obtained | construction_start
  -- foundation_complete | structure_complete | installations_complete
  -- finishes_complete | first_delivery | final_delivery
  -- project_closure | other

  -- Fechas
  planned_date DATE NOT NULL,
  actual_date DATE,

  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- Valores: pending | in_progress | completed | delayed | cancelled

  -- Responsable
  responsible_user_id UUID,

  -- Dependencias
  depends_on_milestone_ids UUID[],
  -- Array de IDs de milestones que deben completarse antes

  -- Entregables
  deliverables TEXT[],
  -- Ej: ["Licencia de construccion", "Planos aprobados", "Contrato firmado"]

  completion_notes TEXT,

  -- Alertas
  alert_days_before INTEGER DEFAULT 7,
  last_alert_sent_at TIMESTAMP,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT check_valid_milestone_dates CHECK (actual_date IS NULL OR actual_date >= planned_date - INTERVAL '90 days')
);

CREATE INDEX idx_milestones_project ON projects.project_milestones(project_id);
CREATE INDEX idx_milestones_constructora ON projects.project_milestones(constructora_id);
CREATE INDEX idx_milestones_status ON projects.project_milestones(status);
CREATE INDEX idx_milestones_type ON projects.project_milestones(milestone_type);
CREATE INDEX idx_milestones_planned_date ON projects.project_milestones(planned_date);

-- =====================================================
-- TABLA: projects.critical_dates
-- =====================================================
CREATE TABLE projects.critical_dates (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  constructora_id UUID NOT NULL,

  -- Información básica
  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Fecha
  date DATE NOT NULL,
  is_hard_deadline BOOLEAN DEFAULT true,
  -- true = fecha inamovible, false = fecha sugerida

  -- Origen del compromiso
  commitment_type VARCHAR(50),
  -- Valores: contractual | regulatory | financial | client_requested | internal

  related_entity VARCHAR(100),
  -- Ej: "INFONAVIT", "Cliente: ABC Construction", "Autoridad Municipal"

  -- Consecuencias
  consequences_if_missed TEXT,
  -- Ej: "Penalización de $500,000 MXN + intereses del 2% mensual"

  -- Alertas
  alert_days_before INTEGER DEFAULT 30,
  last_alert_sent_at TIMESTAMP,

  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- Valores: pending | at_risk | met | missed

  met_date DATE,
  missed_notes TEXT,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_critical_dates_project ON projects.critical_dates(project_id);
CREATE INDEX idx_critical_dates_constructora ON projects.critical_dates(constructora_id);
CREATE INDEX idx_critical_dates_date ON projects.critical_dates(date);
CREATE INDEX idx_critical_dates_status ON projects.critical_dates(status);

-- =====================================================
-- TABLA: projects.construction_phases
-- =====================================================
CREATE TABLE projects.construction_phases (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  constructora_id UUID NOT NULL,

  -- Información básica
  phase_name VARCHAR(100) NOT NULL,
  -- Valores: preliminaries | earthworks | foundation | structure | masonry
  --          installations | finishes | urbanization | cleanup

  phase_order INTEGER NOT NULL,
  description TEXT,

  -- Fechas planificadas
  planned_start_date DATE,
  planned_end_date DATE,
  planned_duration_days INTEGER,

  -- Fechas reales
  actual_start_date DATE,
  actual_end_date DATE,
  actual_duration_days INTEGER,

  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'not_started',
  -- Valores: not_started | in_progress | completed | delayed

  -- Avance
  physical_progress DECIMAL(5, 2) DEFAULT 0.00,

  -- Responsable
  responsible_user_id UUID,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_project_phase_order UNIQUE (project_id, phase_order)
);

CREATE INDEX idx_phases_project ON projects.construction_phases(project_id);
CREATE INDEX idx_phases_status ON projects.construction_phases(status);
CREATE INDEX idx_phases_order ON projects.construction_phases(phase_order);

-- =====================================================
-- FUNCIONES para validación de workload
-- =====================================================

-- Función: Calcular workload total de un usuario
CREATE OR REPLACE FUNCTION get_user_total_workload(
  p_user_id UUID,
  p_constructora_id UUID
) RETURNS INTEGER AS $$
DECLARE
  total_workload INTEGER;
BEGIN
  SELECT COALESCE(SUM(workload_percentage), 0)
  INTO total_workload
  FROM projects.project_team_assignments
  WHERE user_id = p_user_id
    AND constructora_id = p_constructora_id
    AND is_active = true
    AND (end_date IS NULL OR end_date >= CURRENT_DATE);

  RETURN total_workload;
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener límite de workload por rol
CREATE OR REPLACE FUNCTION get_role_workload_limit(p_role VARCHAR) RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'director' THEN 500        -- Max 5 proyectos a 100%
    WHEN 'resident' THEN 200        -- Max 2 proyectos a 100%
    WHEN 'engineer' THEN 800        -- Max 8 proyectos a 100%
    WHEN 'supervisor' THEN 100      -- Max 1 proyecto a 100%
    WHEN 'purchases_manager' THEN 1000  -- Centralizado, múltiples proyectos
    ELSE 100
  END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

ALTER TABLE projects.project_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.critical_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.construction_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY team_assignments_isolation ON projects.project_team_assignments
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);

CREATE POLICY milestones_isolation ON projects.project_milestones
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);

CREATE POLICY critical_dates_isolation ON projects.critical_dates
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);

CREATE POLICY construction_phases_isolation ON projects.construction_phases
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);
```

---

## 3. Implementación Backend (NestJS)

### 3.1 Entities

#### ProjectTeamAssignment Entity

```typescript
// apps/backend/src/modules/projects/entities/project-team-assignment.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';

export enum ProjectRole {
  DIRECTOR = 'director',
  RESIDENT = 'resident',
  ENGINEER = 'engineer',
  SUPERVISOR = 'supervisor',
  PURCHASES_MANAGER = 'purchases_manager',
}

export enum Specialty {
  STRUCTURAL = 'structural',
  INSTALLATIONS = 'installations',
  ELECTRICAL = 'electrical',
  COSTS = 'costs',
  QUALITY = 'quality',
  SAFETY = 'safety',
}

@Entity('project_team_assignments', { schema: 'projects' })
@Index(['projectId', 'userId'])
@Index(['userId'])
@Index(['constructoraId'])
@Index(['role'])
@Index(['isActive'])
export class ProjectTeamAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  @Column({ type: 'uuid' })
  userId: string;

  // Rol y especialidad
  @Column({ type: 'enum', enum: ProjectRole })
  role: ProjectRole;

  @Column({ type: 'enum', enum: Specialty, nullable: true })
  specialty: Specialty;

  // Asignación
  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  // Workload
  @Column({ type: 'integer', default: 100 })
  workloadPercentage: number;

  // Responsabilidades
  @Column({ type: 'text', array: true, nullable: true })
  responsibilities: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
```

#### Milestone Entity

```typescript
// apps/backend/src/modules/projects/entities/milestone.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';

export enum MilestoneType {
  PROJECT_KICKOFF = 'project_kickoff',
  PERMITS_OBTAINED = 'permits_obtained',
  CONSTRUCTION_START = 'construction_start',
  FOUNDATION_COMPLETE = 'foundation_complete',
  STRUCTURE_COMPLETE = 'structure_complete',
  INSTALLATIONS_COMPLETE = 'installations_complete',
  FINISHES_COMPLETE = 'finishes_complete',
  FIRST_DELIVERY = 'first_delivery',
  FINAL_DELIVERY = 'final_delivery',
  PROJECT_CLOSURE = 'project_closure',
  OTHER = 'other',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

@Entity('project_milestones', { schema: 'projects' })
@Index(['projectId'])
@Index(['constructoraId'])
@Index(['status'])
@Index(['milestoneType'])
@Index(['plannedDate'])
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: MilestoneType })
  milestoneType: MilestoneType;

  // Fechas
  @Column({ type: 'date' })
  plannedDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDate: Date;

  // Estado
  @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.PENDING })
  status: MilestoneStatus;

  // Responsable
  @Column({ type: 'uuid', nullable: true })
  responsibleUserId: string;

  // Dependencias
  @Column({ type: 'uuid', array: true, nullable: true })
  dependsOnMilestoneIds: string[];

  // Entregables
  @Column({ type: 'text', array: true, nullable: true })
  deliverables: string[];

  @Column({ type: 'text', nullable: true })
  completionNotes: string;

  // Alertas
  @Column({ type: 'integer', default: 7 })
  alertDaysBefore: number;

  @Column({ type: 'timestamp', nullable: true })
  lastAlertSentAt: Date;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
```

#### CriticalDate Entity

```typescript
// apps/backend/src/modules/projects/entities/critical-date.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';

export enum CommitmentType {
  CONTRACTUAL = 'contractual',
  REGULATORY = 'regulatory',
  FINANCIAL = 'financial',
  CLIENT_REQUESTED = 'client_requested',
  INTERNAL = 'internal',
}

export enum CriticalDateStatus {
  PENDING = 'pending',
  AT_RISK = 'at_risk',
  MET = 'met',
  MISSED = 'missed',
}

@Entity('critical_dates', { schema: 'projects' })
@Index(['projectId'])
@Index(['constructoraId'])
@Index(['date'])
@Index(['status'])
export class CriticalDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Fecha
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: true })
  isHardDeadline: boolean;

  // Origen del compromiso
  @Column({ type: 'enum', enum: CommitmentType, nullable: true })
  commitmentType: CommitmentType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relatedEntity: string;

  // Consecuencias
  @Column({ type: 'text', nullable: true })
  consequencesIfMissed: string;

  // Alertas
  @Column({ type: 'integer', default: 30 })
  alertDaysBefore: number;

  @Column({ type: 'timestamp', nullable: true })
  lastAlertSentAt: Date;

  // Estado
  @Column({ type: 'enum', enum: CriticalDateStatus, default: CriticalDateStatus.PENDING })
  status: CriticalDateStatus;

  @Column({ type: 'date', nullable: true })
  metDate: Date;

  @Column({ type: 'text', nullable: true })
  missedNotes: string;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
```

### 3.2 DTOs

```typescript
// apps/backend/src/modules/projects/dto/create-team-assignment.dto.ts

import { IsUUID, IsEnum, IsDateString, IsInt, IsBoolean, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ProjectRole, Specialty } from '../entities/project-team-assignment.entity';

export class CreateTeamAssignmentDto {
  @IsUUID()
  userId: string;

  @IsEnum(ProjectRole)
  role: ProjectRole;

  @IsOptional()
  @IsEnum(Specialty)
  specialty?: Specialty;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsInt()
  @Min(1)
  @Max(100)
  workloadPercentage: number;

  @IsOptional()
  @IsArray()
  responsibilities?: string[];

  @IsOptional()
  notes?: string;
}

// apps/backend/src/modules/projects/dto/create-milestone.dto.ts

import { IsString, IsEnum, IsDateString, IsUUID, IsInt, IsOptional, IsArray } from 'class-validator';
import { MilestoneType } from '../entities/milestone.entity';

export class CreateMilestoneDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(MilestoneType)
  milestoneType: MilestoneType;

  @IsDateString()
  plannedDate: string;

  @IsOptional()
  @IsUUID()
  responsibleUserId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  dependsOnMilestoneIds?: string[];

  @IsOptional()
  @IsArray()
  deliverables?: string[];

  @IsOptional()
  @IsInt()
  alertDaysBefore?: number;
}

// apps/backend/src/modules/projects/dto/create-critical-date.dto.ts

import { IsString, IsDateString, IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { CommitmentType } from '../entities/critical-date.entity';

export class CreateCriticalDateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  isHardDeadline?: boolean;

  @IsOptional()
  @IsEnum(CommitmentType)
  commitmentType?: CommitmentType;

  @IsOptional()
  @IsString()
  relatedEntity?: string;

  @IsOptional()
  @IsString()
  consequencesIfMissed?: string;

  @IsOptional()
  @IsInt()
  alertDaysBefore?: number;
}
```

### 3.3 Services

#### TeamAssignmentsService

```typescript
// apps/backend/src/modules/projects/services/team-assignments.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProjectTeamAssignment, ProjectRole } from '../entities/project-team-assignment.entity';
import { CreateTeamAssignmentDto } from '../dto/create-team-assignment.dto';
import { UpdateTeamAssignmentDto } from '../dto/update-team-assignment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TeamAssignmentsService {
  constructor(
    @InjectRepository(ProjectTeamAssignment)
    private assignmentRepo: Repository<ProjectTeamAssignment>,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    projectId: string,
    dto: CreateTeamAssignmentDto,
    constructoraId: string,
    currentUserId: string,
  ): Promise<ProjectTeamAssignment> {
    // Validate workload limit
    await this.validateWorkloadLimit(dto.userId, dto.role, dto.workloadPercentage, constructoraId);

    // Validate: only one primary director per project
    if (dto.role === ProjectRole.DIRECTOR && dto.isPrimary) {
      const existingDirector = await this.assignmentRepo.findOne({
        where: {
          projectId,
          role: ProjectRole.DIRECTOR,
          isPrimary: true,
          isActive: true,
        },
      });

      if (existingDirector) {
        throw new BadRequestException('Ya existe un Director principal asignado a este proyecto');
      }
    }

    const assignment = this.assignmentRepo.create({
      ...dto,
      projectId,
      constructoraId,
      createdBy: currentUserId,
    });

    const saved = await this.assignmentRepo.save(assignment);
    this.eventEmitter.emit('team_assignment.created', saved);
    return saved;
  }

  async findAll(
    projectId: string,
    constructoraId: string,
    filters?: { role?: ProjectRole; isActive?: boolean },
  ): Promise<ProjectTeamAssignment[]> {
    const query = this.assignmentRepo
      .createQueryBuilder('assignment')
      .where('assignment.projectId = :projectId', { projectId })
      .andWhere('assignment.constructoraId = :constructoraId', { constructoraId })
      .orderBy('assignment.isPrimary', 'DESC')
      .addOrderBy('assignment.startDate', 'ASC');

    if (filters?.role) {
      query.andWhere('assignment.role = :role', { role: filters.role });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('assignment.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async findOne(id: string, constructoraId: string): Promise<ProjectTeamAssignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id, constructoraId },
      relations: ['project'],
    });

    if (!assignment) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return assignment;
  }

  async update(
    id: string,
    dto: UpdateTeamAssignmentDto,
    constructoraId: string,
    currentUserId: string,
  ): Promise<ProjectTeamAssignment> {
    const assignment = await this.findOne(id, constructoraId);

    // If changing workload, validate new limit
    if (dto.workloadPercentage && dto.workloadPercentage !== assignment.workloadPercentage) {
      const currentWorkload = await this.getUserTotalWorkload(
        assignment.userId,
        constructoraId,
      );
      const newWorkload = currentWorkload - assignment.workloadPercentage + dto.workloadPercentage;
      const limit = this.getRoleWorkloadLimit(assignment.role);

      if (newWorkload > limit) {
        throw new BadRequestException(
          `El usuario ya tiene una carga de ${currentWorkload}%. ` +
            `El cambio a ${dto.workloadPercentage}% excedería el límite de ${limit}% para su rol.`,
        );
      }
    }

    Object.assign(assignment, dto);
    assignment.updatedBy = currentUserId;

    return this.assignmentRepo.save(assignment);
  }

  async deactivate(
    id: string,
    endDate: Date,
    constructoraId: string,
    currentUserId: string,
  ): Promise<ProjectTeamAssignment> {
    const assignment = await this.findOne(id, constructoraId);

    assignment.isActive = false;
    assignment.endDate = endDate;
    assignment.updatedBy = currentUserId;

    const updated = await this.assignmentRepo.save(assignment);
    this.eventEmitter.emit('team_assignment.deactivated', updated);

    return updated;
  }

  async getUserTotalWorkload(userId: string, constructoraId: string): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT get_user_total_workload($1, $2) as total`,
      [userId, constructoraId],
    );
    return result[0]?.total || 0;
  }

  async getUserAssignments(
    userId: string,
    constructoraId: string,
    onlyActive = true,
  ): Promise<ProjectTeamAssignment[]> {
    const query = this.assignmentRepo
      .createQueryBuilder('assignment')
      .where('assignment.userId = :userId', { userId })
      .andWhere('assignment.constructoraId = :constructoraId', { constructoraId })
      .leftJoinAndSelect('assignment.project', 'project')
      .orderBy('assignment.startDate', 'DESC');

    if (onlyActive) {
      query.andWhere('assignment.isActive = true');
    }

    return query.getMany();
  }

  async getTeamDashboard(projectId: string, constructoraId: string): Promise<any> {
    const assignments = await this.findAll(projectId, constructoraId, { isActive: true });

    // Group by role
    const byRole = assignments.reduce((acc, assignment) => {
      if (!acc[assignment.role]) {
        acc[assignment.role] = [];
      }
      acc[assignment.role].push(assignment);
      return acc;
    }, {} as Record<string, ProjectTeamAssignment[]>);

    // Calculate total workload by user
    const userWorkloads = new Map<string, number>();
    for (const assignment of assignments) {
      const current = userWorkloads.get(assignment.userId) || 0;
      userWorkloads.set(assignment.userId, current + assignment.workloadPercentage);
    }

    return {
      totalMembers: assignments.length,
      byRole: Object.entries(byRole).map(([role, members]) => ({
        role,
        count: members.length,
        members,
      })),
      userWorkloads: Array.from(userWorkloads.entries()).map(([userId, workload]) => ({
        userId,
        totalWorkload: workload,
        limit: this.getRoleWorkloadLimit(
          assignments.find((a) => a.userId === userId)?.role || ProjectRole.SUPERVISOR,
        ),
        available: this.getRoleWorkloadLimit(
          assignments.find((a) => a.userId === userId)?.role || ProjectRole.SUPERVISOR,
        ) - workload,
      })),
    };
  }

  private async validateWorkloadLimit(
    userId: string,
    role: ProjectRole,
    newWorkload: number,
    constructoraId: string,
  ): Promise<void> {
    const currentWorkload = await this.getUserTotalWorkload(userId, constructoraId);
    const totalWorkload = currentWorkload + newWorkload;
    const limit = this.getRoleWorkloadLimit(role);

    if (totalWorkload > limit) {
      throw new BadRequestException(
        `El usuario ya tiene una carga de ${currentWorkload}%. ` +
          `Asignar ${newWorkload}% adicional excedería el límite de ${limit}% para el rol ${role}.`,
      );
    }
  }

  private getRoleWorkloadLimit(role: ProjectRole): number {
    const limits: Record<ProjectRole, number> = {
      [ProjectRole.DIRECTOR]: 500,
      [ProjectRole.RESIDENT]: 200,
      [ProjectRole.ENGINEER]: 800,
      [ProjectRole.SUPERVISOR]: 100,
      [ProjectRole.PURCHASES_MANAGER]: 1000,
    };
    return limits[role] || 100;
  }

  async remove(id: string, constructoraId: string): Promise<void> {
    const assignment = await this.findOne(id, constructoraId);
    await this.assignmentRepo.remove(assignment);
    this.eventEmitter.emit('team_assignment.deleted', { id });
  }
}
```

#### MilestonesService

```typescript
// apps/backend/src/modules/projects/services/milestones.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone, MilestoneStatus } from '../entities/milestone.entity';
import { CreateMilestoneDto } from '../dto/create-milestone.dto';
import { UpdateMilestoneDto } from '../dto/update-milestone.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepo: Repository<Milestone>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    projectId: string,
    dto: CreateMilestoneDto,
    constructoraId: string,
    userId: string,
  ): Promise<Milestone> {
    // Validate dependencies exist
    if (dto.dependsOnMilestoneIds && dto.dependsOnMilestoneIds.length > 0) {
      await this.validateDependencies(dto.dependsOnMilestoneIds, projectId, constructoraId);
    }

    const milestone = this.milestoneRepo.create({
      ...dto,
      projectId,
      constructoraId,
      createdBy: userId,
    });

    const saved = await this.milestoneRepo.save(milestone);
    this.eventEmitter.emit('milestone.created', saved);
    return saved;
  }

  async findAll(
    projectId: string,
    constructoraId: string,
    filters?: { status?: MilestoneStatus },
  ): Promise<Milestone[]> {
    const query = this.milestoneRepo
      .createQueryBuilder('milestone')
      .where('milestone.projectId = :projectId', { projectId })
      .andWhere('milestone.constructoraId = :constructoraId', { constructoraId })
      .orderBy('milestone.plannedDate', 'ASC');

    if (filters?.status) {
      query.andWhere('milestone.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string, constructoraId: string): Promise<Milestone> {
    const milestone = await this.milestoneRepo.findOne({
      where: { id, constructoraId },
      relations: ['project'],
    });

    if (!milestone) {
      throw new NotFoundException(`Hito con ID ${id} no encontrado`);
    }

    return milestone;
  }

  async update(
    id: string,
    dto: UpdateMilestoneDto,
    constructoraId: string,
    userId: string,
  ): Promise<Milestone> {
    const milestone = await this.findOne(id, constructoraId);

    Object.assign(milestone, dto);
    milestone.updatedBy = userId;

    return this.milestoneRepo.save(milestone);
  }

  async markComplete(
    id: string,
    actualDate: Date,
    completionNotes: string,
    constructoraId: string,
    userId: string,
  ): Promise<Milestone> {
    const milestone = await this.findOne(id, constructoraId);

    // Validate dependencies are completed
    if (milestone.dependsOnMilestoneIds && milestone.dependsOnMilestoneIds.length > 0) {
      const dependencies = await this.milestoneRepo.find({
        where: { constructoraId },
      });

      const incompleteDeps = dependencies.filter(
        (dep) =>
          milestone.dependsOnMilestoneIds.includes(dep.id) &&
          dep.status !== MilestoneStatus.COMPLETED,
      );

      if (incompleteDeps.length > 0) {
        throw new BadRequestException(
          `No se puede completar este hito. ${incompleteDeps.length} dependencias aún están pendientes.`,
        );
      }
    }

    milestone.status = MilestoneStatus.COMPLETED;
    milestone.actualDate = actualDate;
    milestone.completionNotes = completionNotes;
    milestone.updatedBy = userId;

    const updated = await this.milestoneRepo.save(milestone);
    this.eventEmitter.emit('milestone.completed', updated);

    return updated;
  }

  async getTimeline(projectId: string, constructoraId: string): Promise<any> {
    const milestones = await this.findAll(projectId, constructoraId);

    // Sort by planned date
    const sorted = milestones.sort(
      (a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime(),
    );

    return sorted.map((milestone, index) => ({
      ...milestone,
      order: index + 1,
      isDelayed: this.isMilestoneDelayed(milestone),
      daysUntil: this.getDaysUntilPlanned(milestone),
    }));
  }

  private isMilestoneDelayed(milestone: Milestone): boolean {
    if (milestone.status === MilestoneStatus.COMPLETED) return false;

    const now = new Date();
    const planned = new Date(milestone.plannedDate);
    return now > planned;
  }

  private getDaysUntilPlanned(milestone: Milestone): number {
    if (milestone.status === MilestoneStatus.COMPLETED) return 0;

    const now = new Date();
    const planned = new Date(milestone.plannedDate);
    const diff = planned.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private async validateDependencies(
    dependencyIds: string[],
    projectId: string,
    constructoraId: string,
  ): Promise<void> {
    const dependencies = await this.milestoneRepo.find({
      where: { projectId, constructoraId },
    });

    const validIds = dependencies.map((d) => d.id);
    const invalidIds = dependencyIds.filter((id) => !validIds.includes(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Las siguientes dependencias no existen: ${invalidIds.join(', ')}`,
      );
    }
  }

  async remove(id: string, constructoraId: string): Promise<void> {
    const milestone = await this.findOne(id, constructoraId);

    // Check if any other milestone depends on this one
    const dependents = await this.milestoneRepo.find({
      where: { projectId: milestone.projectId, constructoraId },
    });

    const hasDependents = dependents.some(
      (m) => m.dependsOnMilestoneIds && m.dependsOnMilestoneIds.includes(id),
    );

    if (hasDependents) {
      throw new BadRequestException(
        'No se puede eliminar este hito porque otros hitos dependen de él',
      );
    }

    await this.milestoneRepo.remove(milestone);
    this.eventEmitter.emit('milestone.deleted', { id });
  }
}
```

### 3.4 Controllers

```typescript
// apps/backend/src/modules/projects/controllers/team-assignments.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { TeamAssignmentsService } from '../services/team-assignments.service';
import { CreateTeamAssignmentDto } from '../dto/create-team-assignment.dto';
import { UpdateTeamAssignmentDto } from '../dto/update-team-assignment.dto';
import { ProjectRole } from '../entities/project-team-assignment.entity';

@Controller('projects/:projectId/team')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamAssignmentsController {
  constructor(private teamService: TeamAssignmentsService) {}

  @Post()
  @Roles('director', 'admin')
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTeamAssignmentDto,
    @Request() req,
  ) {
    return this.teamService.create(projectId, dto, req.user.constructoraId, req.user.sub);
  }

  @Get()
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findAll(
    @Param('projectId') projectId: string,
    @Query('role') role: ProjectRole,
    @Query('isActive') isActive: boolean,
    @Request() req,
  ) {
    return this.teamService.findAll(projectId, req.user.constructoraId, { role, isActive });
  }

  @Get('dashboard')
  @Roles('director', 'admin')
  async getDashboard(@Param('projectId') projectId: string, @Request() req) {
    return this.teamService.getTeamDashboard(projectId, req.user.constructoraId);
  }

  @Get(':id')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.teamService.findOne(id, req.user.constructoraId);
  }

  @Put(':id')
  @Roles('director', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamAssignmentDto,
    @Request() req,
  ) {
    return this.teamService.update(id, dto, req.user.constructoraId, req.user.sub);
  }

  @Put(':id/deactivate')
  @Roles('director', 'admin')
  async deactivate(
    @Param('id') id: string,
    @Body('endDate') endDate: Date,
    @Request() req,
  ) {
    return this.teamService.deactivate(id, endDate, req.user.constructoraId, req.user.sub);
  }

  @Delete(':id')
  @Roles('director', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    await this.teamService.remove(id, req.user.constructoraId);
    return { message: 'Asignación eliminada exitosamente' };
  }
}

// apps/backend/src/modules/projects/controllers/milestones.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { MilestonesService } from '../services/milestones.service';
import { CreateMilestoneDto } from '../dto/create-milestone.dto';
import { UpdateMilestoneDto } from '../dto/update-milestone.dto';
import { MilestoneStatus } from '../entities/milestone.entity';

@Controller('projects/:projectId/milestones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MilestonesController {
  constructor(private milestonesService: MilestonesService) {}

  @Post()
  @Roles('director', 'resident', 'admin')
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateMilestoneDto,
    @Request() req,
  ) {
    return this.milestonesService.create(projectId, dto, req.user.constructoraId, req.user.sub);
  }

  @Get()
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findAll(
    @Param('projectId') projectId: string,
    @Query('status') status: MilestoneStatus,
    @Request() req,
  ) {
    return this.milestonesService.findAll(projectId, req.user.constructoraId, { status });
  }

  @Get('timeline')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async getTimeline(@Param('projectId') projectId: string, @Request() req) {
    return this.milestonesService.getTimeline(projectId, req.user.constructoraId);
  }

  @Get(':id')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.milestonesService.findOne(id, req.user.constructoraId);
  }

  @Put(':id')
  @Roles('director', 'resident', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMilestoneDto,
    @Request() req,
  ) {
    return this.milestonesService.update(id, dto, req.user.constructoraId, req.user.sub);
  }

  @Put(':id/complete')
  @Roles('director', 'resident', 'admin')
  async markComplete(
    @Param('id') id: string,
    @Body('actualDate') actualDate: Date,
    @Body('completionNotes') completionNotes: string,
    @Request() req,
  ) {
    return this.milestonesService.markComplete(
      id,
      actualDate,
      completionNotes,
      req.user.constructoraId,
      req.user.sub,
    );
  }

  @Delete(':id')
  @Roles('director', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    await this.milestonesService.remove(id, req.user.constructoraId);
    return { message: 'Hito eliminado exitosamente' };
  }
}
```

---

## 4. Implementación Frontend (React + TypeScript)

### 4.1 Components

#### TeamRoster Component

```typescript
// apps/frontend/src/features/projects/components/TeamRoster.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, User, Award, Briefcase } from 'lucide-react';
import { projectsApi } from '../../../services/projects.api';
import type { ProjectTeamAssignment } from '../../../types/projects.types';

interface TeamRosterProps {
  projectId: string;
}

export function TeamRoster({ projectId }: TeamRosterProps) {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['team-dashboard', projectId],
    queryFn: () => projectsApi.getTeamDashboard(projectId),
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'director':
        return <Award className="h-5 w-5" />;
      case 'resident':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleName = (role: string): string => {
    const names: Record<string, string> = {
      director: 'Director',
      resident: 'Residente',
      engineer: 'Ingeniero',
      supervisor: 'Supervisor',
      purchases_manager: 'Gerente de Compras',
    };
    return names[role] || role;
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando equipo...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Equipo del Proyecto</h2>
        <span className="ml-auto text-sm text-gray-600">
          {dashboard?.totalMembers} miembros
        </span>
      </div>

      <div className="space-y-6">
        {dashboard?.byRole.map((roleGroup: any) => (
          <div key={roleGroup.role}>
            <div className="flex items-center gap-2 mb-3">
              {getRoleIcon(roleGroup.role)}
              <h3 className="font-semibold text-gray-800">{getRoleName(roleGroup.role)}</h3>
              <span className="text-sm text-gray-500">({roleGroup.count})</span>
            </div>

            <div className="space-y-2 pl-7">
              {roleGroup.members.map((member: ProjectTeamAssignment) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{member.userId}</p>
                    {member.specialty && (
                      <p className="text-sm text-gray-600">Especialidad: {member.specialty}</p>
                    )}
                    {member.isPrimary && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        Principal
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">{member.workloadPercentage}% carga</p>
                    <p className="text-xs text-gray-500">
                      Desde {new Date(member.startDate).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Workload Summary */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-3">Carga de Trabajo</h3>
        <div className="space-y-2">
          {dashboard?.userWorkloads.map((userWorkload: any) => (
            <div key={userWorkload.userId} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-32 truncate">{userWorkload.userId}</span>
              <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    userWorkload.totalWorkload > userWorkload.limit
                      ? 'bg-red-500'
                      : userWorkload.totalWorkload > userWorkload.limit * 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(userWorkload.totalWorkload / userWorkload.limit) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-20 text-right">
                {userWorkload.totalWorkload}% / {userWorkload.limit}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### MilestoneTimeline Component

```typescript
// apps/frontend/src/features/projects/components/MilestoneTimeline.tsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { projectsApi } from '../../../services/projects.api';
import type { Milestone } from '../../../types/projects.types';

interface MilestoneTimelineProps {
  projectId: string;
}

export function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const queryClient = useQueryClient();

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['milestones-timeline', projectId],
    queryFn: () => projectsApi.getMilestoneTimeline(projectId),
  });

  const completeMutation = useMutation({
    mutationFn: (data: { id: string; actualDate: Date; notes: string }) =>
      projectsApi.completeMilestone(data.id, data.actualDate, data.notes),
    onSuccess: () => {
      toast.success('Hito marcado como completado');
      queryClient.invalidateQueries({ queryKey: ['milestones-timeline', projectId] });
    },
  });

  const getStatusIcon = (milestone: any) => {
    if (milestone.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (milestone.isDelayed) {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    return <Clock className="h-5 w-5 text-blue-600" />;
  };

  const getStatusColor = (milestone: any): string => {
    if (milestone.status === 'completed') return 'border-green-500 bg-green-50';
    if (milestone.isDelayed) return 'border-red-500 bg-red-50';
    if (milestone.daysUntil <= 7) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando hitos...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Hitos del Proyecto</h2>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Milestones */}
        <div className="space-y-4">
          {milestones?.map((milestone: any, index: number) => (
            <div key={milestone.id} className="relative pl-14">
              {/* Icon */}
              <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200">
                {getStatusIcon(milestone)}
              </div>

              {/* Content */}
              <div className={`p-4 rounded-lg border-l-4 ${getStatusColor(milestone)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{milestone.name}</h3>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      milestone.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : milestone.isDelayed
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {milestone.status}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Planificado:</span>{' '}
                    {new Date(milestone.plannedDate).toLocaleDateString('es-MX')}
                  </div>
                  {milestone.actualDate && (
                    <div>
                      <span className="font-medium">Completado:</span>{' '}
                      {new Date(milestone.actualDate).toLocaleDateString('es-MX')}
                    </div>
                  )}
                  {!milestone.actualDate && milestone.daysUntil !== undefined && (
                    <div>
                      {milestone.daysUntil > 0 ? (
                        <span>En {milestone.daysUntil} días</span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Atrasado {Math.abs(milestone.daysUntil)} días
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {milestone.deliverables && milestone.deliverables.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Entregables:</span>
                    <ul className="list-disc list-inside ml-2 text-gray-600">
                      {milestone.deliverables.map((deliverable: string, idx: number) => (
                        <li key={idx}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {milestone.status !== 'completed' && (
                  <button
                    onClick={() =>
                      completeMutation.mutate({
                        id: milestone.id,
                        actualDate: new Date(),
                        notes: 'Marcado como completado',
                      })
                    }
                    className="mt-3 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Marcar como Completado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Cron Jobs para Alertas

```typescript
// apps/backend/src/modules/projects/services/alerts.service.ts

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Milestone } from '../entities/milestone.entity';
import { CriticalDate } from '../entities/critical-date.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepo: Repository<Milestone>,
    @InjectRepository(CriticalDate)
    private criticalDateRepo: Repository<CriticalDate>,
    private eventEmitter: EventEmitter2,
  ) {}

  // Run daily at 9:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendMilestoneAlerts(): Promise<void> {
    const today = new Date();

    // Get milestones approaching their planned date
    const milestones = await this.milestoneRepo
      .createQueryBuilder('milestone')
      .where('milestone.status = :status', { status: 'pending' })
      .andWhere('milestone.plannedDate >= :today', { today })
      .getMany();

    for (const milestone of milestones) {
      const daysUntil = this.getDaysUntil(milestone.plannedDate);

      if (daysUntil <= milestone.alertDaysBefore) {
        // Check if alert was already sent recently (within last 24 hours)
        if (this.shouldSendAlert(milestone.lastAlertSentAt)) {
          this.eventEmitter.emit('alert.milestone_approaching', {
            milestone,
            daysUntil,
          });

          milestone.lastAlertSentAt = new Date();
          await this.milestoneRepo.save(milestone);
        }
      }
    }
  }

  // Run daily at 9:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendCriticalDateAlerts(): Promise<void> {
    const today = new Date();

    const criticalDates = await this.criticalDateRepo
      .createQueryBuilder('cd')
      .where('cd.status = :status', { status: 'pending' })
      .andWhere('cd.date >= :today', { today })
      .getMany();

    for (const criticalDate of criticalDates) {
      const daysUntil = this.getDaysUntil(criticalDate.date);

      if (daysUntil <= criticalDate.alertDaysBefore) {
        if (this.shouldSendAlert(criticalDate.lastAlertSentAt)) {
          this.eventEmitter.emit('alert.critical_date_approaching', {
            criticalDate,
            daysUntil,
          });

          criticalDate.lastAlertSentAt = new Date();
          await this.criticalDateRepo.save(criticalDate);
        }
      }
    }
  }

  private getDaysUntil(date: Date): number {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private shouldSendAlert(lastAlertSent: Date | null): boolean {
    if (!lastAlertSent) return true;

    const hoursSinceLastAlert =
      (new Date().getTime() - new Date(lastAlertSent).getTime()) / (1000 * 60 * 60);

    // Send alert if last one was more than 24 hours ago
    return hoursSinceLastAlert >= 24;
  }
}
```

---

## 6. Validaciones de Negocio

1. **Workload:**
   - Total workload de un usuario no debe exceder límite de su rol
   - Director: max 500%, Residente: max 200%, Ingeniero: max 800%
   - Validación en creación y actualización de asignaciones

2. **Equipo:**
   - Solo un Director principal (isPrimary = true) por proyecto
   - Al menos un Residente activo en proyectos en ejecución
   - Fechas: endDate >= startDate

3. **Milestones:**
   - Dependencias deben existir en el mismo proyecto
   - No se puede completar un hito si sus dependencias están pendientes
   - No se puede eliminar un hito si otros dependen de él

4. **Fechas Críticas:**
   - Alertas enviadas automáticamente según alertDaysBefore
   - No duplicar alertas (máximo 1 cada 24 horas)

---

## 7. Eventos Emitidos

```typescript
'team_assignment.created': { assignment: ProjectTeamAssignment }
'team_assignment.deactivated': { assignment: ProjectTeamAssignment }
'team_assignment.deleted': { id: string }

'milestone.created': { milestone: Milestone }
'milestone.completed': { milestone: Milestone }
'milestone.deleted': { id: string }

'critical_date.created': { criticalDate: CriticalDate }
'critical_date.met': { criticalDate: CriticalDate }
'critical_date.missed': { criticalDate: CriticalDate }

'alert.milestone_approaching': { milestone: Milestone, daysUntil: number }
'alert.critical_date_approaching': { criticalDate: CriticalDate, daysUntil: number }
```

---

**Fecha de generación:** 2025-11-17
**Autor:** Sistema de Documentación Técnica
**Versión:** 1.0
**Estado:** ✅ Completo
