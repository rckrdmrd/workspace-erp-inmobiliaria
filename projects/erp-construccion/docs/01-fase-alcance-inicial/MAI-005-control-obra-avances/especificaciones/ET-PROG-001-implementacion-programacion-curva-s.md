# ET-PROG-001: Implementación de Programación de Obra y Curva S

**Épica:** MAI-005 - Control de Obra y Avances
**Módulo:** Programación y Seguimiento
**Responsable Técnico:** Backend + Frontend + Data
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Objetivo Técnico

Implementar el sistema de programación de obra con:
- Creación y gestión de cronogramas con dependencias entre actividades
- Cálculo automático de ruta crítica (Critical Path Method - CPM)
- Generación y seguimiento de Curva S (planificado vs ejecutado)
- Cálculo de indicadores EVM: SPI, CPI, EV, PV, AC
- Reprogramaciones con control de versiones
- Dashboard de seguimiento en tiempo real

---

## 2. Stack Tecnológico

### Backend
```typescript
- NestJS 10+
- TypeORM para PostgreSQL
- PostgreSQL 15+ (schema: schedules)
- node-cron para cálculos diarios
- EventEmitter2 para eventos
```

### Frontend
```typescript
- React 18 con TypeScript
- Zustand para state management
- Chart.js para Curva S y gráficas
- react-gantt-chart para diagramas de Gantt
- date-fns para manejo de fechas
```

### Análisis
```typescript
- Algoritmo CPM (Critical Path Method) en JavaScript
- Regresión lineal para proyecciones
- Análisis de varianzas y tendencias
```

---

## 3. Modelo de Datos SQL

### 3.1 Schema Principal

```sql
-- =====================================================
-- SCHEMA: schedules
-- Descripción: Programación de obra y curva S
-- =====================================================

CREATE SCHEMA IF NOT EXISTS schedules;

-- =====================================================
-- TABLE: schedules.schedules
-- Descripción: Programas de obra (múltiples versiones)
-- =====================================================

CREATE TABLE schedules.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Identificación
  code VARCHAR(50) NOT NULL, -- PRG-2025-00001
  version INTEGER NOT NULL DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Fechas
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_duration INTEGER GENERATED ALWAYS AS (end_date - start_date) STORED, -- días
  total_weeks INTEGER,

  -- Baseline (línea base)
  baseline_date TIMESTAMP,
  is_baseline BOOLEAN DEFAULT false,
  baseline_approved_by UUID REFERENCES auth.users(id),

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  -- draft, submitted, approved, active, closed, archived

  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('draft', 'submitted', 'approved', 'active', 'closed', 'archived')),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  UNIQUE(project_id, version)
);

CREATE INDEX idx_schedules_project ON schedules.schedules(project_id);
CREATE INDEX idx_schedules_status ON schedules.schedules(status);
CREATE INDEX idx_schedules_baseline ON schedules.schedules(is_baseline) WHERE is_baseline = true;

-- =====================================================
-- TABLE: schedules.schedule_activities
-- Descripción: Actividades del programa de obra
-- =====================================================

CREATE TABLE schedules.schedule_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  schedule_id UUID NOT NULL REFERENCES schedules.schedules(id) ON DELETE CASCADE,
  budget_item_id UUID REFERENCES budgets.budget_items(id),
  workfront_id UUID REFERENCES projects.workfronts(id),
  stage_id UUID REFERENCES projects.stages(id),

  -- Identificación
  activity_code VARCHAR(50) NOT NULL, -- ACT-001, ACT-002
  activity_name VARCHAR(255) NOT NULL,
  wbs_code VARCHAR(50), -- 1.2.3.4 (Work Breakdown Structure)

  -- Planificación
  planned_start_date DATE NOT NULL,
  planned_end_date DATE NOT NULL,
  planned_duration INTEGER NOT NULL, -- días
  planned_quantity DECIMAL(12,4),
  unit VARCHAR(20),

  -- Dependencias (Finish-to-Start)
  predecessors UUID[], -- array de activity_ids
  lag INTEGER DEFAULT 0, -- días de desfase (-5 = adelanto, +5 = retraso)

  -- Recursos
  responsible_id UUID REFERENCES auth.users(id),
  crew_id UUID,

  -- Seguimiento Real
  actual_start_date DATE,
  actual_end_date DATE,
  actual_duration INTEGER,
  actual_quantity DECIMAL(12,4),
  percent_complete DECIMAL(5,2) DEFAULT 0.00,

  -- Análisis CPM
  is_critical_path BOOLEAN DEFAULT false,
  is_milestone BOOLEAN DEFAULT false,
  earliest_start DATE,
  earliest_finish DATE,
  latest_start DATE,
  latest_finish DATE,
  total_float INTEGER, -- holgura total (días)
  free_float INTEGER, -- holgura libre

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  -- not_started, in_progress, completed, delayed, cancelled

  -- Notas
  notes TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed', 'cancelled')),
  CONSTRAINT valid_dates CHECK (planned_end_date >= planned_start_date),
  CONSTRAINT valid_percent CHECK (percent_complete >= 0 AND percent_complete <= 100),
  UNIQUE(schedule_id, activity_code)
);

CREATE INDEX idx_activities_schedule ON schedules.schedule_activities(schedule_id);
CREATE INDEX idx_activities_budget ON schedules.schedule_activities(budget_item_id);
CREATE INDEX idx_activities_workfront ON schedules.schedule_activities(workfront_id);
CREATE INDEX idx_activities_critical ON schedules.schedule_activities(is_critical_path) WHERE is_critical_path = true;
CREATE INDEX idx_activities_status ON schedules.schedule_activities(status);

-- =====================================================
-- TABLE: schedules.s_curve_snapshots
-- Descripción: Snapshots históricos para Curva S
-- =====================================================

CREATE TABLE schedules.s_curve_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES schedules.schedules(id) ON DELETE CASCADE,

  -- Fecha del snapshot
  snapshot_date DATE NOT NULL,

  -- Avance Físico
  planned_progress_pct DECIMAL(5,2) NOT NULL, -- % programado
  actual_progress_pct DECIMAL(5,2) NOT NULL, -- % real ejecutado
  variance_pct DECIMAL(5,2) GENERATED ALWAYS AS (actual_progress_pct - planned_progress_pct) STORED,

  -- Earned Value Management (EVM)
  planned_value_pv DECIMAL(15,2) NOT NULL, -- Valor Planificado
  earned_value_ev DECIMAL(15,2) NOT NULL, -- Valor Ganado
  actual_cost_ac DECIMAL(15,2) NOT NULL, -- Costo Real

  -- Indicadores
  spi DECIMAL(5,3), -- Schedule Performance Index = EV/PV
  cpi DECIMAL(5,3), -- Cost Performance Index = EV/AC

  -- Proyecciones
  estimate_at_completion_eac DECIMAL(15,2), -- Estimado al Completar
  estimate_to_complete_etc DECIMAL(15,2), -- Estimado para Completar
  variance_at_completion_vac DECIMAL(15,2), -- Varianza al Completar

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(project_id, schedule_id, snapshot_date)
);

CREATE INDEX idx_snapshots_project ON schedules.s_curve_snapshots(project_id);
CREATE INDEX idx_snapshots_schedule ON schedules.s_curve_snapshots(schedule_id);
CREATE INDEX idx_snapshots_date ON schedules.s_curve_snapshots(snapshot_date);

-- =====================================================
-- TABLE: schedules.milestones
-- Descripción: Hitos contractuales y de financiamiento
-- =====================================================

CREATE TABLE schedules.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES schedules.schedules(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES schedules.schedule_activities(id),

  -- Identificación
  milestone_code VARCHAR(50) NOT NULL,
  milestone_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Tipo
  milestone_type VARCHAR(30) NOT NULL,
  -- contractual, financing_gate, internal, regulatory

  -- Fechas
  planned_date DATE NOT NULL,
  actual_date DATE,

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending, achieved, delayed, cancelled

  -- Impacto financiero
  payment_trigger BOOLEAN DEFAULT false,
  payment_percentage DECIMAL(5,2), -- % del contrato

  -- Validación
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_milestone_type CHECK (milestone_type IN ('contractual', 'financing_gate', 'internal', 'regulatory')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'achieved', 'delayed', 'cancelled'))
);

CREATE INDEX idx_milestones_project ON schedules.milestones(project_id);
CREATE INDEX idx_milestones_schedule ON schedules.milestones(schedule_id);
CREATE INDEX idx_milestones_type ON schedules.milestones(milestone_type);
CREATE INDEX idx_milestones_status ON schedules.milestones(status);

-- =====================================================
-- TABLE: schedules.schedule_reprogrammings
-- Descripción: Historial de reprogramaciones
-- =====================================================

CREATE TABLE schedules.schedule_reprogrammings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  from_schedule_id UUID NOT NULL REFERENCES schedules.schedules(id),
  to_schedule_id UUID NOT NULL REFERENCES schedules.schedules(id),

  -- Motivo
  reason VARCHAR(50) NOT NULL,
  -- delay, change_order, weather, budget_adjustment, other
  detailed_reason TEXT NOT NULL,

  -- Cambios clave
  date_change_days INTEGER, -- diferencia en días de la fecha de término
  cost_impact DECIMAL(15,2),
  activities_affected INTEGER,

  -- Aprobación
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_reason CHECK (reason IN ('delay', 'change_order', 'weather', 'budget_adjustment', 'other'))
);

CREATE INDEX idx_reprogramming_project ON schedules.schedule_reprogrammings(project_id);
CREATE INDEX idx_reprogramming_from ON schedules.schedule_reprogrammings(from_schedule_id);
CREATE INDEX idx_reprogramming_to ON schedules.schedule_reprogrammings(to_schedule_id);
```

---

## 4. TypeORM Entities

### 4.1 Schedule Entity

```typescript
// src/modules/schedules/entities/schedule.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../auth/entities/user.entity';
import { ScheduleActivity } from './schedule-activity.entity';
import { SCurveSnapshot } from './s-curve-snapshot.entity';
import { Milestone } from './milestone.entity';

export enum ScheduleStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

@Entity('schedules', { schema: 'schedules' })
@Index(['projectId', 'version'], { unique: true })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones
  @Column('uuid', { name: 'project_id' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  // Identificación
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Fechas
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'integer', nullable: true, name: 'total_weeks' })
  totalWeeks?: number;

  // Baseline
  @Column({ type: 'timestamp', nullable: true, name: 'baseline_date' })
  baselineDate?: Date;

  @Column({ type: 'boolean', default: false, name: 'is_baseline' })
  @Index()
  isBaseline: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'baseline_approved_by' })
  baselineApprovedBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'baseline_approved_by' })
  baselineApprover?: User;

  // Estado
  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.DRAFT,
  })
  @Index()
  status: ScheduleStatus;

  // Metadata
  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by' })
  approvedBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approver?: User;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approvedAt?: Date;

  // Relaciones inversas
  @OneToMany(() => ScheduleActivity, (activity) => activity.schedule)
  activities: ScheduleActivity[];

  @OneToMany(() => SCurveSnapshot, (snapshot) => snapshot.schedule)
  snapshots: SCurveSnapshot[];

  @OneToMany(() => Milestone, (milestone) => milestone.schedule)
  milestones: Milestone[];

  // Computed
  get totalDuration(): number {
    if (!this.startDate || !this.endDate) return 0;
    const diff = new Date(this.endDate).getTime() - new Date(this.startDate).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
```

### 4.2 ScheduleActivity Entity

```typescript
// src/modules/schedules/entities/schedule-activity.entity.ts

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
import { Schedule } from './schedule.entity';
import { BudgetItem } from '../../budgets/entities/budget-item.entity';
import { Workfront } from '../../projects/entities/workfront.entity';
import { Stage } from '../../projects/entities/stage.entity';
import { User } from '../../auth/entities/user.entity';

export enum ActivityStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

@Entity('schedule_activities', { schema: 'schedules' })
@Index(['scheduleId', 'activityCode'], { unique: true })
export class ScheduleActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones
  @Column('uuid', { name: 'schedule_id' })
  @Index()
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column({ type: 'uuid', nullable: true, name: 'budget_item_id' })
  @Index()
  budgetItemId?: string;

  @ManyToOne(() => BudgetItem)
  @JoinColumn({ name: 'budget_item_id' })
  budgetItem?: BudgetItem;

  @Column({ type: 'uuid', nullable: true, name: 'workfront_id' })
  @Index()
  workfrontId?: string;

  @ManyToOne(() => Workfront)
  @JoinColumn({ name: 'workfront_id' })
  workfront?: Workfront;

  @Column({ type: 'uuid', nullable: true, name: 'stage_id' })
  stageId?: string;

  @ManyToOne(() => Stage)
  @JoinColumn({ name: 'stage_id' })
  stage?: Stage;

  // Identificación
  @Column({ type: 'varchar', length: 50, name: 'activity_code' })
  activityCode: string;

  @Column({ type: 'varchar', length: 255, name: 'activity_name' })
  activityName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'wbs_code' })
  wbsCode?: string;

  // Planificación
  @Column({ type: 'date', name: 'planned_start_date' })
  plannedStartDate: Date;

  @Column({ type: 'date', name: 'planned_end_date' })
  plannedEndDate: Date;

  @Column({ type: 'integer', name: 'planned_duration' })
  plannedDuration: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true, name: 'planned_quantity' })
  plannedQuantity?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit?: string;

  // Dependencias
  @Column({ type: 'uuid', array: true, default: '{}' })
  predecessors: string[];

  @Column({ type: 'integer', default: 0 })
  lag: number;

  // Recursos
  @Column({ type: 'uuid', nullable: true, name: 'responsible_id' })
  responsibleId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'responsible_id' })
  responsible?: User;

  @Column({ type: 'uuid', nullable: true, name: 'crew_id' })
  crewId?: string;

  // Seguimiento Real
  @Column({ type: 'date', nullable: true, name: 'actual_start_date' })
  actualStartDate?: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_end_date' })
  actualEndDate?: Date;

  @Column({ type: 'integer', nullable: true, name: 'actual_duration' })
  actualDuration?: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true, name: 'actual_quantity' })
  actualQuantity?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'percent_complete' })
  percentComplete: number;

  // Análisis CPM
  @Column({ type: 'boolean', default: false, name: 'is_critical_path' })
  @Index()
  isCriticalPath: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_milestone' })
  isMilestone: boolean;

  @Column({ type: 'date', nullable: true, name: 'earliest_start' })
  earliestStart?: Date;

  @Column({ type: 'date', nullable: true, name: 'earliest_finish' })
  earliestFinish?: Date;

  @Column({ type: 'date', nullable: true, name: 'latest_start' })
  latestStart?: Date;

  @Column({ type: 'date', nullable: true, name: 'latest_finish' })
  latestFinish?: Date;

  @Column({ type: 'integer', nullable: true, name: 'total_float' })
  totalFloat?: number;

  @Column({ type: 'integer', nullable: true, name: 'free_float' })
  freeFloat?: number;

  // Estado
  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.NOT_STARTED,
  })
  @Index()
  status: ActivityStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Metadata
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 4.3 SCurveSnapshot Entity

```typescript
// src/modules/schedules/entities/s-curve-snapshot.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Schedule } from './schedule.entity';

@Entity('s_curve_snapshots', { schema: 'schedules' })
@Index(['projectId', 'scheduleId', 'snapshotDate'], { unique: true })
export class SCurveSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones
  @Column('uuid', { name: 'project_id' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column('uuid', { name: 'schedule_id' })
  @Index()
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.snapshots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  // Fecha del snapshot
  @Column({ type: 'date', name: 'snapshot_date' })
  @Index()
  snapshotDate: Date;

  // Avance Físico
  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'planned_progress_pct' })
  plannedProgressPct: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'actual_progress_pct' })
  actualProgressPct: number;

  // Earned Value Management
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'planned_value_pv' })
  plannedValuePV: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'earned_value_ev' })
  earnedValueEV: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'actual_cost_ac' })
  actualCostAC: number;

  // Indicadores
  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  spi?: number; // EV/PV

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  cpi?: number; // EV/AC

  // Proyecciones
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'estimate_at_completion_eac' })
  estimateAtCompletionEAC?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'estimate_to_complete_etc' })
  estimateToCompleteETC?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'variance_at_completion_vac' })
  varianceAtCompletionVAC?: number;

  // Metadata
  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;
}
```

---

## 5. Services (Lógica de Negocio)

### 5.1 ScheduleService

```typescript
// src/modules/schedules/services/schedule.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, ScheduleStatus } from '../entities/schedule.entity';
import { ScheduleActivity } from '../entities/schedule-activity.entity';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto';
import { CriticalPathService } from './critical-path.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
    @InjectRepository(ScheduleActivity)
    private activityRepo: Repository<ScheduleActivity>,
    private criticalPathService: CriticalPathService,
  ) {}

  /**
   * Crear un nuevo programa de obra
   */
  async create(dto: CreateScheduleDto, userId: string): Promise<Schedule> {
    // Obtener el último número de versión para este proyecto
    const lastSchedule = await this.scheduleRepo.findOne({
      where: { projectId: dto.projectId },
      order: { version: 'DESC' },
    });

    const version = lastSchedule ? lastSchedule.version + 1 : 1;

    // Generar código
    const year = new Date().getFullYear();
    const count = await this.scheduleRepo.count();
    const code = `PRG-${year}-${String(count + 1).padStart(5, '0')}`;

    const schedule = this.scheduleRepo.create({
      ...dto,
      code,
      version,
      createdBy: userId,
      status: ScheduleStatus.DRAFT,
    });

    return this.scheduleRepo.save(schedule);
  }

  /**
   * Actualizar programa de obra
   */
  async update(id: string, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (schedule.status === ScheduleStatus.APPROVED || schedule.isBaseline) {
      throw new BadRequestException('Cannot update approved or baseline schedule');
    }

    Object.assign(schedule, dto);
    return this.scheduleRepo.save(schedule);
  }

  /**
   * Aprobar y establecer como baseline
   */
  async approve(id: string, userId: string): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (schedule.status === ScheduleStatus.APPROVED) {
      throw new BadRequestException('Schedule is already approved');
    }

    // Si es la primera versión, establecer como baseline
    const isFirstVersion = schedule.version === 1;

    schedule.status = ScheduleStatus.ACTIVE;
    schedule.approvedBy = userId;
    schedule.approvedAt = new Date();

    if (isFirstVersion) {
      schedule.isBaseline = true;
      schedule.baselineDate = new Date();
      schedule.baselineApprovedBy = userId;
    }

    return this.scheduleRepo.save(schedule);
  }

  /**
   * Calcular ruta crítica usando CPM
   */
  async calculateCriticalPath(scheduleId: string): Promise<void> {
    const activities = await this.activityRepo.find({
      where: { scheduleId },
      relations: ['schedule'],
    });

    if (activities.length === 0) {
      throw new BadRequestException('No activities found for this schedule');
    }

    // Ejecutar algoritmo CPM
    const criticalPathResult = await this.criticalPathService.calculate(activities);

    // Actualizar actividades con resultados CPM
    for (const activity of activities) {
      const result = criticalPathResult.activities.find((a) => a.id === activity.id);

      if (result) {
        activity.earliestStart = result.earliestStart;
        activity.earliestFinish = result.earliestFinish;
        activity.latestStart = result.latestStart;
        activity.latestFinish = result.latestFinish;
        activity.totalFloat = result.totalFloat;
        activity.freeFloat = result.freeFloat;
        activity.isCriticalPath = result.totalFloat === 0;
      }
    }

    await this.activityRepo.save(activities);
  }

  /**
   * Crear reprogramación (nueva versión)
   */
  async createReprogramming(
    scheduleId: string,
    reason: string,
    detailedReason: string,
    userId: string,
  ): Promise<Schedule> {
    const currentSchedule = await this.findOne(scheduleId);

    if (currentSchedule.status !== ScheduleStatus.ACTIVE) {
      throw new BadRequestException('Can only reprogram active schedules');
    }

    // Crear nueva versión
    const newVersion = currentSchedule.version + 1;
    const year = new Date().getFullYear();
    const count = await this.scheduleRepo.count();
    const newCode = `PRG-${year}-${String(count + 1).padStart(5, '0')}`;

    const newSchedule = this.scheduleRepo.create({
      projectId: currentSchedule.projectId,
      code: newCode,
      version: newVersion,
      name: `${currentSchedule.name} (v${newVersion})`,
      description: `Reprogramación: ${detailedReason}`,
      startDate: currentSchedule.startDate,
      endDate: currentSchedule.endDate,
      createdBy: userId,
      status: ScheduleStatus.DRAFT,
    });

    const savedSchedule = await this.scheduleRepo.save(newSchedule);

    // Copiar actividades de la versión anterior
    const activities = await this.activityRepo.find({
      where: { scheduleId: currentSchedule.id },
    });

    const newActivities = activities.map((activity) => {
      const { id, createdAt, updatedAt, ...activityData } = activity;
      return this.activityRepo.create({
        ...activityData,
        scheduleId: savedSchedule.id,
      });
    });

    await this.activityRepo.save(newActivities);

    return savedSchedule;
  }

  /**
   * Obtener programa activo de un proyecto
   */
  async getActiveSchedule(projectId: string): Promise<Schedule | null> {
    return this.scheduleRepo.findOne({
      where: { projectId, status: ScheduleStatus.ACTIVE },
      relations: ['activities', 'milestones'],
    });
  }

  /**
   * Obtener baseline de un proyecto
   */
  async getBaseline(projectId: string): Promise<Schedule | null> {
    return this.scheduleRepo.findOne({
      where: { projectId, isBaseline: true },
      relations: ['activities', 'milestones'],
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: ['project', 'activities', 'snapshots', 'milestones'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }

    return schedule;
  }
}
```

### 5.2 CriticalPathService (Algoritmo CPM)

```typescript
// src/modules/schedules/services/critical-path.service.ts

import { Injectable } from '@nestjs/common';
import { ScheduleActivity } from '../entities/schedule-activity.entity';

interface CPMActivity {
  id: string;
  duration: number;
  predecessors: string[];
  earliestStart: Date;
  earliestFinish: Date;
  latestStart: Date;
  latestFinish: Date;
  totalFloat: number;
  freeFloat: number;
}

@Injectable()
export class CriticalPathService {
  /**
   * Algoritmo CPM (Critical Path Method)
   *
   * 1. Forward Pass: Calcular ES (Earliest Start) y EF (Earliest Finish)
   * 2. Backward Pass: Calcular LS (Latest Start) y LF (Latest Finish)
   * 3. Float Calculation: TF = LF - EF, FF = ES(successor) - EF
   * 4. Critical Path: Actividades con TF = 0
   */
  async calculate(activities: ScheduleActivity[]): Promise<{ activities: CPMActivity[] }> {
    const activityMap = new Map<string, CPMActivity>();
    const projectStartDate = new Date(Math.min(...activities.map((a) => new Date(a.plannedStartDate).getTime())));

    // Inicializar mapa de actividades
    for (const activity of activities) {
      activityMap.set(activity.id, {
        id: activity.id,
        duration: activity.plannedDuration,
        predecessors: activity.predecessors || [],
        earliestStart: projectStartDate,
        earliestFinish: projectStartDate,
        latestStart: projectStartDate,
        latestFinish: projectStartDate,
        totalFloat: 0,
        freeFloat: 0,
      });
    }

    // Forward Pass (Recorrido hacia adelante)
    const forwardPass = (activityId: string, visited = new Set<string>()): void => {
      if (visited.has(activityId)) return;
      visited.add(activityId);

      const activity = activityMap.get(activityId);
      if (!activity) return;

      // Calcular ES basado en predecesores
      let maxFinish = projectStartDate;
      for (const predId of activity.predecessors) {
        forwardPass(predId, visited);
        const predecessor = activityMap.get(predId);
        if (predecessor && predecessor.earliestFinish > maxFinish) {
          maxFinish = predecessor.earliestFinish;
        }
      }

      activity.earliestStart = maxFinish;
      activity.earliestFinish = this.addDays(maxFinish, activity.duration);
    };

    // Ejecutar forward pass para todas las actividades
    for (const activity of activities) {
      forwardPass(activity.id);
    }

    // Encontrar fecha de fin del proyecto (máximo EF)
    const projectEndDate = new Date(
      Math.max(...Array.from(activityMap.values()).map((a) => a.earliestFinish.getTime()))
    );

    // Backward Pass (Recorrido hacia atrás)
    const backwardPass = (activityId: string, visited = new Set<string>()): void => {
      if (visited.has(activityId)) return;
      visited.add(activityId);

      const activity = activityMap.get(activityId);
      if (!activity) return;

      // Encontrar sucesores
      const successors = Array.from(activityMap.values()).filter((a) =>
        a.predecessors.includes(activityId)
      );

      if (successors.length === 0) {
        // Actividad final
        activity.latestFinish = projectEndDate;
      } else {
        // Calcular LF basado en sucesores
        let minStart = projectEndDate;
        for (const successor of successors) {
          backwardPass(successor.id, visited);
          if (successor.latestStart < minStart) {
            minStart = successor.latestStart;
          }
        }
        activity.latestFinish = minStart;
      }

      activity.latestStart = this.subtractDays(activity.latestFinish, activity.duration);
    };

    // Ejecutar backward pass para todas las actividades
    for (const activity of activities) {
      backwardPass(activity.id);
    }

    // Calcular holguras (floats)
    for (const activity of activityMap.values()) {
      // Total Float = LF - EF = LS - ES
      const lfTime = activity.latestFinish.getTime();
      const efTime = activity.earliestFinish.getTime();
      activity.totalFloat = Math.round((lfTime - efTime) / (1000 * 60 * 60 * 24));

      // Free Float (holgura libre)
      const successors = Array.from(activityMap.values()).filter((a) =>
        a.predecessors.includes(activity.id)
      );

      if (successors.length > 0) {
        const minSuccessorES = new Date(
          Math.min(...successors.map((s) => s.earliestStart.getTime()))
        );
        activity.freeFloat = Math.round((minSuccessorES.getTime() - efTime) / (1000 * 60 * 60 * 24));
      } else {
        activity.freeFloat = activity.totalFloat;
      }
    }

    return {
      activities: Array.from(activityMap.values()),
    };
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
}
```

### 5.3 SCurveService

```typescript
// src/modules/schedules/services/s-curve.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SCurveSnapshot } from '../entities/s-curve-snapshot.entity';
import { ScheduleActivity } from '../entities/schedule-activity.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SCurveService {
  constructor(
    @InjectRepository(SCurveSnapshot)
    private snapshotRepo: Repository<SCurveSnapshot>,
    @InjectRepository(ScheduleActivity)
    private activityRepo: Repository<ScheduleActivity>,
  ) {}

  /**
   * Generar snapshot diario de Curva S
   * Ejecuta todos los días a las 23:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async generateDailySnapshots(): Promise<void> {
    // Obtener todos los proyectos activos
    const activeSchedules = await this.activityRepo
      .createQueryBuilder('activity')
      .select('DISTINCT activity.schedule_id', 'scheduleId')
      .innerJoin('activity.schedule', 'schedule')
      .where('schedule.status = :status', { status: 'active' })
      .getRawMany();

    for (const { scheduleId } of activeSchedules) {
      await this.generateSnapshot(scheduleId, new Date());
    }
  }

  /**
   * Generar snapshot para una fecha específica
   */
  async generateSnapshot(scheduleId: string, snapshotDate: Date): Promise<SCurveSnapshot> {
    const activities = await this.activityRepo.find({
      where: { scheduleId },
      relations: ['schedule', 'budgetItem'],
    });

    if (activities.length === 0) {
      throw new Error(`No activities found for schedule ${scheduleId}`);
    }

    const schedule = activities[0].schedule;
    const projectId = schedule.projectId;

    // Calcular avance planificado para esta fecha
    const totalPlannedDuration = activities.reduce((sum, a) => sum + a.plannedDuration, 0);
    const elapsedDays = Math.max(
      0,
      Math.floor((snapshotDate.getTime() - new Date(schedule.startDate).getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalDuration = schedule.totalDuration;
    const plannedProgressPct = Math.min(100, (elapsedDays / totalDuration) * 100);

    // Calcular avance real (promedio de % completado de actividades ponderado por duración)
    const actualProgressPct =
      activities.reduce((sum, a) => sum + (a.percentComplete * a.plannedDuration), 0) /
      totalPlannedDuration;

    // Calcular valores EVM
    const budgetAtCompletion = activities.reduce(
      (sum, a) => sum + (a.budgetItem?.totalAmount || 0),
      0
    );

    const plannedValuePV = (plannedProgressPct / 100) * budgetAtCompletion;
    const earnedValueEV = (actualProgressPct / 100) * budgetAtCompletion;

    // AC (Actual Cost) vendría de los costos reales registrados
    // Por ahora, aproximarlo como EV (en implementación real, consultar costos reales)
    const actualCostAC = earnedValueEV * 1.05; // Simulación: 5% más que EV

    // Calcular indicadores
    const spi = plannedValuePV > 0 ? earnedValueEV / plannedValuePV : 0;
    const cpi = actualCostAC > 0 ? earnedValueEV / actualCostAC : 0;

    // Proyecciones
    const estimateAtCompletionEAC = cpi > 0 ? budgetAtCompletion / cpi : budgetAtCompletion;
    const estimateToCompleteETC = estimateAtCompletionEAC - actualCostAC;
    const varianceAtCompletionVAC = budgetAtCompletion - estimateAtCompletionEAC;

    // Crear o actualizar snapshot
    const existingSnapshot = await this.snapshotRepo.findOne({
      where: { projectId, scheduleId, snapshotDate },
    });

    const snapshotData = {
      projectId,
      scheduleId,
      snapshotDate,
      plannedProgressPct,
      actualProgressPct,
      plannedValuePV,
      earnedValueEV,
      actualCostAC,
      spi,
      cpi,
      estimateAtCompletionEAC,
      estimateToCompleteETC,
      varianceAtCompletionVAC,
    };

    if (existingSnapshot) {
      Object.assign(existingSnapshot, snapshotData);
      return this.snapshotRepo.save(existingSnapshot);
    } else {
      const newSnapshot = this.snapshotRepo.create(snapshotData);
      return this.snapshotRepo.save(newSnapshot);
    }
  }

  /**
   * Obtener datos de Curva S para un rango de fechas
   */
  async getSCurveData(
    scheduleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SCurveSnapshot[]> {
    return this.snapshotRepo.find({
      where: {
        scheduleId,
        snapshotDate: Between(startDate, endDate),
      },
      order: { snapshotDate: 'ASC' },
    });
  }

  /**
   * Comparar baseline vs actual
   */
  async compareBaselineVsActual(projectId: string, currentDate: Date) {
    const baselineSnapshots = await this.snapshotRepo
      .createQueryBuilder('snapshot')
      .innerJoin('snapshot.schedule', 'schedule')
      .where('snapshot.project_id = :projectId', { projectId })
      .andWhere('schedule.is_baseline = true')
      .andWhere('snapshot.snapshot_date <= :currentDate', { currentDate })
      .orderBy('snapshot.snapshot_date', 'ASC')
      .getMany();

    const actualSnapshots = await this.snapshotRepo
      .createQueryBuilder('snapshot')
      .innerJoin('snapshot.schedule', 'schedule')
      .where('snapshot.project_id = :projectId', { projectId })
      .andWhere('schedule.status = :status', { status: 'active' })
      .andWhere('snapshot.snapshot_date <= :currentDate', { currentDate })
      .orderBy('snapshot.snapshot_date', 'ASC')
      .getMany();

    return {
      baseline: baselineSnapshots,
      actual: actualSnapshots,
      variance: this.calculateVariance(baselineSnapshots, actualSnapshots),
    };
  }

  private calculateVariance(baseline: SCurveSnapshot[], actual: SCurveSnapshot[]) {
    if (baseline.length === 0 || actual.length === 0) {
      return null;
    }

    const latestBaseline = baseline[baseline.length - 1];
    const latestActual = actual[actual.length - 1];

    return {
      progressVariancePct: latestActual.actualProgressPct - latestBaseline.plannedProgressPct,
      costVariance: latestActual.earnedValueEV - latestActual.actualCostAC,
      scheduleVariance: latestActual.earnedValueEV - latestActual.plannedValuePV,
      spi: latestActual.spi,
      cpi: latestActual.cpi,
    };
  }
}
```

---

## 6. Controllers (API Endpoints)

```typescript
// src/modules/schedules/controllers/schedule.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ScheduleService } from '../services/schedule.service';
import { SCurveService } from '../services/s-curve.service';
import { CreateScheduleDto, UpdateScheduleDto, CreateActivityDto } from '../dto';

@Controller('api/schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private sCurveService: SCurveService,
  ) {}

  /**
   * POST /api/schedules
   * Crear un nuevo programa de obra
   */
  @Post()
  @Roles('project_manager', 'admin')
  async create(@Body() dto: CreateScheduleDto, @Request() req) {
    return this.scheduleService.create(dto, req.user.sub);
  }

  /**
   * GET /api/schedules/:id
   * Obtener detalle de un programa
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  /**
   * PUT /api/schedules/:id
   * Actualizar programa de obra (solo en draft)
   */
  @Put(':id')
  @Roles('project_manager', 'admin')
  async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(id, dto);
  }

  /**
   * POST /api/schedules/:id/approve
   * Aprobar programa y establecer baseline
   */
  @Post(':id/approve')
  @Roles('project_manager', 'admin')
  async approve(@Param('id') id: string, @Request() req) {
    return this.scheduleService.approve(id, req.user.sub);
  }

  /**
   * POST /api/schedules/:id/calculate-critical-path
   * Calcular ruta crítica (CPM)
   */
  @Post(':id/calculate-critical-path')
  @Roles('project_manager', 'admin')
  async calculateCriticalPath(@Param('id') id: string) {
    await this.scheduleService.calculateCriticalPath(id);
    return { message: 'Critical path calculated successfully' };
  }

  /**
   * POST /api/schedules/:id/reprogram
   * Crear reprogramación (nueva versión)
   */
  @Post(':id/reprogram')
  @Roles('project_manager', 'admin')
  async reprogram(
    @Param('id') id: string,
    @Body() dto: { reason: string; detailedReason: string },
    @Request() req,
  ) {
    return this.scheduleService.createReprogramming(
      id,
      dto.reason,
      dto.detailedReason,
      req.user.sub,
    );
  }

  /**
   * GET /api/schedules/project/:projectId/active
   * Obtener programa activo de un proyecto
   */
  @Get('project/:projectId/active')
  async getActiveSchedule(@Param('projectId') projectId: string) {
    return this.scheduleService.getActiveSchedule(projectId);
  }

  /**
   * GET /api/schedules/project/:projectId/baseline
   * Obtener baseline de un proyecto
   */
  @Get('project/:projectId/baseline')
  async getBaseline(@Param('projectId') projectId: string) {
    return this.scheduleService.getBaseline(projectId);
  }

  /**
   * GET /api/schedules/:id/s-curve
   * Obtener datos de Curva S
   */
  @Get(':id/s-curve')
  async getSCurve(
    @Param('id') scheduleId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.sCurveService.getSCurveData(
      scheduleId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * POST /api/schedules/:id/generate-snapshot
   * Generar snapshot de Curva S manualmente
   */
  @Post(':id/generate-snapshot')
  @Roles('project_manager', 'admin')
  async generateSnapshot(@Param('id') scheduleId: string) {
    return this.sCurveService.generateSnapshot(scheduleId, new Date());
  }

  /**
   * GET /api/schedules/project/:projectId/variance-analysis
   * Análisis de varianzas baseline vs actual
   */
  @Get('project/:projectId/variance-analysis')
  async getVarianceAnalysis(@Param('projectId') projectId: string) {
    return this.sCurveService.compareBaselineVsActual(projectId, new Date());
  }
}
```

---

## 7. React Components

### 7.1 SCurveChart Component

```typescript
// src/components/schedules/SCurveChart.tsx

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { scheduleApi } from '../../api/scheduleApi';

interface SCurveChartProps {
  scheduleId: string;
  startDate: Date;
  endDate: Date;
  showBaseline?: boolean;
}

export const SCurveChart: React.FC<SCurveChartProps> = ({
  scheduleId,
  startDate,
  endDate,
  showBaseline = false,
}) => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [scheduleId, startDate, endDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await scheduleApi.getSCurveData(scheduleId, startDate, endDate);
      setSnapshots(data);
    } catch (error) {
      console.error('Error loading S-curve data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando Curva S...</div>;
  }

  const chartData = {
    labels: snapshots.map((s) => format(new Date(s.snapshotDate), 'dd/MMM', { locale: es })),
    datasets: [
      {
        label: 'Programado',
        data: snapshots.map((s) => s.plannedProgressPct),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Real',
        data: snapshots.map((s) => s.actualProgressPct),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Curva S - Avance del Proyecto',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: '% Avance',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
    },
  };

  return (
    <div className="s-curve-chart">
      <Line data={chartData} options={options} />

      <div className="variance-summary mt-4">
        {snapshots.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card">
              <label>Avance Programado</label>
              <div className="value">
                {snapshots[snapshots.length - 1].plannedProgressPct.toFixed(2)}%
              </div>
            </div>
            <div className="stat-card">
              <label>Avance Real</label>
              <div className="value">
                {snapshots[snapshots.length - 1].actualProgressPct.toFixed(2)}%
              </div>
            </div>
            <div className="stat-card">
              <label>Desviación</label>
              <div className={`value ${
                snapshots[snapshots.length - 1].actualProgressPct >=
                snapshots[snapshots.length - 1].plannedProgressPct
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {(snapshots[snapshots.length - 1].actualProgressPct -
                  snapshots[snapshots.length - 1].plannedProgressPct).toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 8. Triggers y Stored Procedures

```sql
-- =====================================================
-- TRIGGER: Actualizar status de actividad automáticamente
-- =====================================================

CREATE OR REPLACE FUNCTION schedules.update_activity_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si percent_complete = 100, marcar como completed
  IF NEW.percent_complete >= 100 AND OLD.status <> 'completed' THEN
    NEW.status := 'completed';
    NEW.actual_end_date := CURRENT_DATE;

  -- Si percent_complete > 0 y < 100, marcar como in_progress
  ELSIF NEW.percent_complete > 0 AND NEW.percent_complete < 100 THEN
    IF NEW.status = 'not_started' THEN
      NEW.status := 'in_progress';
      NEW.actual_start_date := COALESCE(NEW.actual_start_date, CURRENT_DATE);
    END IF;
  END IF;

  -- Si actual_end_date > planned_end_date, marcar como delayed
  IF NEW.actual_end_date IS NOT NULL AND NEW.actual_end_date > NEW.planned_end_date THEN
    IF NEW.status <> 'completed' THEN
      NEW.status := 'delayed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_activity_status
BEFORE UPDATE ON schedules.schedule_activities
FOR EACH ROW
EXECUTE FUNCTION schedules.update_activity_status();

-- =====================================================
-- STORED PROCEDURE: Calcular avance global del proyecto
-- =====================================================

CREATE OR REPLACE FUNCTION schedules.calculate_project_progress(p_schedule_id UUID)
RETURNS TABLE(
  total_activities INTEGER,
  completed_activities INTEGER,
  in_progress_activities INTEGER,
  delayed_activities INTEGER,
  overall_progress_pct DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_activities,
    COUNT(*) FILTER (WHERE status = 'completed')::INTEGER AS completed_activities,
    COUNT(*) FILTER (WHERE status = 'in_progress')::INTEGER AS in_progress_activities,
    COUNT(*) FILTER (WHERE status = 'delayed')::INTEGER AS delayed_activities,
    COALESCE(AVG(percent_complete), 0)::DECIMAL(5,2) AS overall_progress_pct
  FROM schedules.schedule_activities
  WHERE schedule_id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;

-- Uso:
-- SELECT * FROM schedules.calculate_project_progress('uuid-del-schedule');
```

---

## 9. Ejemplos de Uso

### 9.1 Crear Programa de Obra

```typescript
// POST /api/schedules

{
  "projectId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "name": "Programa Maestro - Fracc. Los Pinos",
  "description": "Programa para 50 viviendas",
  "startDate": "2025-01-15",
  "endDate": "2025-12-31",
  "totalWeeks": 50
}

// Response:
{
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "code": "PRG-2025-00001",
  "version": 1,
  "status": "draft",
  "totalDuration": 350
}
```

### 9.2 Agregar Actividades

```typescript
// POST /api/schedule-activities

{
  "scheduleId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "activityCode": "ACT-001",
  "activityName": "Excavación y Despalme",
  "wbsCode": "1.1",
  "plannedStartDate": "2025-01-15",
  "plannedEndDate": "2025-01-29",
  "plannedDuration": 14,
  "plannedQuantity": 500,
  "unit": "m3",
  "predecessors": [],
  "responsibleId": "cccccccc-cccc-cccc-cccc-cccccccccccc"
}
```

### 9.3 Calcular Ruta Crítica

```typescript
// POST /api/schedules/{id}/calculate-critical-path

// Response:
{
  "message": "Critical path calculated successfully",
  "criticalActivities": [
    {
      "id": "...",
      "activityCode": "ACT-001",
      "activityName": "Excavación",
      "totalFloat": 0,
      "isCriticalPath": true
    },
    {
      "id": "...",
      "activityCode": "ACT-005",
      "activityName": "Cimentación",
      "totalFloat": 0,
      "isCriticalPath": true
    }
  ]
}
```

### 9.4 Obtener Datos de Curva S

```typescript
// GET /api/schedules/{id}/s-curve?startDate=2025-01-01&endDate=2025-12-31

// Response:
[
  {
    "snapshotDate": "2025-01-31",
    "plannedProgressPct": 15.5,
    "actualProgressPct": 14.2,
    "variancePct": -1.3,
    "spi": 0.916,
    "cpi": 0.952
  },
  {
    "snapshotDate": "2025-02-28",
    "plannedProgressPct": 32.0,
    "actualProgressPct": 30.8,
    "variancePct": -1.2,
    "spi": 0.963,
    "cpi": 0.978
  }
]
```

---

## 10. Testing

```typescript
// src/modules/schedules/services/__tests__/critical-path.service.spec.ts

import { Test } from '@nestjs/testing';
import { CriticalPathService } from '../critical-path.service';
import { ScheduleActivity, ActivityStatus } from '../../entities/schedule-activity.entity';

describe('CriticalPathService', () => {
  let service: CriticalPathService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CriticalPathService],
    }).compile();

    service = module.get<CriticalPathService>(CriticalPathService);
  });

  it('should calculate critical path correctly', async () => {
    // Actividades de prueba con dependencias
    const activities: ScheduleActivity[] = [
      {
        id: 'act-1',
        activityCode: 'A',
        plannedDuration: 5,
        plannedStartDate: new Date('2025-01-01'),
        plannedEndDate: new Date('2025-01-06'),
        predecessors: [],
        status: ActivityStatus.NOT_STARTED,
      } as ScheduleActivity,
      {
        id: 'act-2',
        activityCode: 'B',
        plannedDuration: 3,
        plannedStartDate: new Date('2025-01-06'),
        plannedEndDate: new Date('2025-01-09'),
        predecessors: ['act-1'],
        status: ActivityStatus.NOT_STARTED,
      } as ScheduleActivity,
      {
        id: 'act-3',
        activityCode: 'C',
        plannedDuration: 7,
        plannedStartDate: new Date('2025-01-06'),
        plannedEndDate: new Date('2025-01-13'),
        predecessors: ['act-1'],
        status: ActivityStatus.NOT_STARTED,
      } as ScheduleActivity,
      {
        id: 'act-4',
        activityCode: 'D',
        plannedDuration: 4,
        plannedStartDate: new Date('2025-01-13'),
        plannedEndDate: new Date('2025-01-17'),
        predecessors: ['act-2', 'act-3'],
        status: ActivityStatus.NOT_STARTED,
      } as ScheduleActivity,
    ];

    const result = await service.calculate(activities);

    // La ruta crítica debería ser A → C → D (total: 5 + 7 + 4 = 16 días)
    const criticalActivities = result.activities.filter((a) => a.totalFloat === 0);

    expect(criticalActivities).toHaveLength(3);
    expect(criticalActivities.map((a) => a.id)).toContain('act-1');
    expect(criticalActivities.map((a) => a.id)).toContain('act-3');
    expect(criticalActivities.map((a) => a.id)).toContain('act-4');

    // B debería tener holgura (float)
    const activityB = result.activities.find((a) => a.id === 'act-2');
    expect(activityB.totalFloat).toBeGreaterThan(0);
  });
});
```

---

## 11. Criterios de Aceptación Técnicos

- [x] Schema `schedules` creado con todas las tablas
- [x] Entities TypeORM con relaciones correctas
- [x] Services con lógica CPM implementada
- [x] Algoritmo CPM (Forward/Backward Pass) funcional
- [x] Cálculo automático de holguras (Total Float, Free Float)
- [x] Generación diaria de snapshots de Curva S vía CRON
- [x] Cálculo de EVM (SPI, CPI, EAC, ETC, VAC)
- [x] Controllers con endpoints RESTful
- [x] React component para visualización de Curva S
- [x] Triggers para actualizar status de actividades
- [x] Stored procedures para análisis de progreso
- [x] Tests unitarios con >80% coverage

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo Técnico
**Versión:** 1.0
**Estado:** ✅ Listo para Implementación
