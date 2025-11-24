# ET-PROJ-001: Implementación de Catálogo de Proyectos

**Epic:** MAI-002 - Proyectos y Estructura de Obra
**RF:** RF-PROJ-001
**Tipo:** Especificación Técnica
**Prioridad:** Crítica (P0)
**Estado:** 🚧 En Implementación
**Última actualización:** 2025-11-17

---

## 🔧 Implementación Backend

### 1. Project Entity

**Archivo:** `apps/backend/src/modules/projects/entities/project.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ProjectType {
  FRACCIONAMIENTO_HORIZONTAL = 'fraccionamiento_horizontal',
  CONJUNTO_HABITACIONAL = 'conjunto_habitacional',
  EDIFICIO_VERTICAL = 'edificio_vertical',
  MIXTO = 'mixto',
}

export enum ProjectStatus {
  LICITACION = 'licitacion',
  ADJUDICADO = 'adjudicado',
  EJECUCION = 'ejecucion',
  ENTREGADO = 'entregado',
  CERRADO = 'cerrado',
}

export enum ClientType {
  PUBLICO = 'publico',
  PRIVADO = 'privado',
  MIXTO = 'mixto',
}

export enum ContractType {
  LLAVE_EN_MANO = 'llave_en_mano',
  PRECIO_ALZADO = 'precio_alzado',
  ADMINISTRACION = 'administracion',
  MIXTO = 'mixto',
}

@Entity('projects', { schema: 'projects' })
@Index(['constructoraId', 'status'])
@Index(['projectCode'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  projectCode: string; // PROJ-2025-001

  // Multi-tenant discriminator (tenant = constructora)
  // Used for Row-Level Security (RLS) to isolate data between constructoras
  // See: docs/00-overview/GLOSARIO.md for terminology clarification
  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProjectType })
  projectType: ProjectType;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.LICITACION })
  status: ProjectStatus;

  // Cliente
  @Column({ type: 'enum', enum: ClientType })
  clientType: ClientType;

  @Column({ type: 'varchar', length: 200 })
  clientName: string;

  @Column({ type: 'varchar', length: 13 })
  clientRFC: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  clientContactName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  clientContactEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  clientContactPhone: string;

  @Column({ type: 'enum', enum: ContractType })
  contractType: ContractType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  contractAmount: number;

  // Ubicación
  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 100 })
  municipality: string;

  @Column({ type: 'varchar', length: 5 })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalArea: number; // m²

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  buildableArea: number; // m²

  // Fechas
  @Column({ type: 'date', nullable: true })
  biddingDate: Date;

  @Column({ type: 'date', nullable: true })
  awardDate: Date;

  @Column({ type: 'date' })
  contractStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'integer' }) // meses
  contractDuration: number;

  @Column({ type: 'date' })
  scheduledEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  closureDate: Date;

  // Información legal
  @Column({ type: 'varchar', length: 50, nullable: true })
  constructionLicenseNumber: string;

  @Column({ type: 'date', nullable: true })
  licenseIssueDate: Date;

  @Column({ type: 'date', nullable: true })
  licenseExpirationDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  environmentalImpactNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  landUseApproved: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  approvedPlanNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  infonavitNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fovisssteNumber: string;

  // Métricas (calculadas)
  @Column({ type: 'integer', default: 0 })
  totalHousingUnits: number;

  @Column({ type: 'integer', default: 0 })
  deliveredHousingUnits: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  physicalProgress: number; // %

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  exercisedCost: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  budgetDeviation: number; // %

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @OneToMany(() => Stage, (stage) => stage.project)
  stages: Stage[];

  @OneToMany(() => ProjectTeamAssignment, (assignment) => assignment.project)
  teamAssignments: ProjectTeamAssignment[];

  @OneToMany(() => ProjectDocument, (doc) => doc.project)
  documents: ProjectDocument[];
}
```

---

### 2. ProjectsService

**Archivo:** `apps/backend/src/modules/projects/projects.service.ts`

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus, ProjectType } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Crear nuevo proyecto
   */
  async create(
    dto: CreateProjectDto,
    constructoraId: string,
    userId: string,
  ): Promise<Project> {
    // Generar código único
    const projectCode = await this.generateProjectCode(constructoraId);

    // Calcular fecha de terminación programada
    const scheduledEndDate = this.calculateScheduledEndDate(
      dto.contractStartDate,
      dto.contractDuration,
    );

    const project = this.projectRepo.create({
      ...dto,
      projectCode,
      constructoraId,
      scheduledEndDate,
      status: ProjectStatus.ADJUDICADO,
      createdBy: userId,
    });

    const saved = await this.projectRepo.save(project);

    // Emitir evento
    this.eventEmitter.emit('project.created', saved);

    return saved;
  }

  /**
   * Listar proyectos con filtros
   */
  async findAll(
    constructoraId: string,
    filters?: {
      status?: ProjectStatus;
      projectType?: ProjectType;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.projectRepo
      .createQueryBuilder('project')
      .where('project.constructoraId = :constructoraId', { constructoraId })
      .orderBy('project.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }

    if (filters?.projectType) {
      query.andWhere('project.projectType = :projectType', {
        projectType: filters.projectType,
      });
    }

    if (filters?.search) {
      query.andWhere(
        '(project.name ILIKE :search OR project.projectCode ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [projects, total] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      items: projects,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Obtener proyecto por ID
   */
  async findOne(id: string, constructoraId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id, constructoraId },
      relations: ['stages', 'teamAssignments', 'documents'],
    });

    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return project;
  }

  /**
   * Actualizar proyecto
   */
  async update(
    id: string,
    dto: UpdateProjectDto,
    constructoraId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, constructoraId);

    // Validar transiciones de estado si se está cambiando
    if (dto.status && dto.status !== project.status) {
      this.validateStatusTransition(project.status, dto.status);
    }

    Object.assign(project, dto);
    project.updatedBy = userId;

    const updated = await this.projectRepo.save(project);

    // Emitir evento si cambió de estado
    if (dto.status && dto.status !== project.status) {
      this.eventEmitter.emit('project.status_changed', {
        project: updated,
        oldStatus: project.status,
        newStatus: dto.status,
      });
    }

    return updated;
  }

  /**
   * Cambiar estado del proyecto
   */
  async changeStatus(
    id: string,
    newStatus: ProjectStatus,
    constructoraId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, constructoraId);

    this.validateStatusTransition(project.status, newStatus);

    const oldStatus = project.status;
    project.status = newStatus;
    project.updatedBy = userId;

    // Actualizar fechas según el nuevo estado
    if (newStatus === ProjectStatus.EJECUCION && !project.actualStartDate) {
      project.actualStartDate = new Date();
    }

    if (newStatus === ProjectStatus.ENTREGADO && !project.deliveryDate) {
      project.deliveryDate = new Date();
    }

    if (newStatus === ProjectStatus.CERRADO && !project.closureDate) {
      project.closureDate = new Date();
    }

    const updated = await this.projectRepo.save(project);

    this.eventEmitter.emit('project.status_changed', {
      project: updated,
      oldStatus,
      newStatus,
    });

    return updated;
  }

  /**
   * Calcular métricas del proyecto
   */
  async calculateMetrics(id: string, constructoraId: string): Promise<any> {
    const project = await this.findOne(id, constructoraId);

    // Calcular avance físico (de stages)
    const physicalProgress = await this.calculatePhysicalProgress(id);

    // Calcular avance financiero
    const financialProgress = (project.exercisedCost / project.contractAmount) * 100;

    // Calcular desviación presupuestal
    const budgetDeviation =
      ((project.exercisedCost - project.contractAmount) / project.contractAmount) * 100;

    // Calcular desviación temporal
    const temporalDeviation = this.calculateTemporalDeviation(project, physicalProgress);

    // Actualizar en BD
    project.physicalProgress = physicalProgress;
    project.budgetDeviation = budgetDeviation;
    await this.projectRepo.save(project);

    return {
      physical: {
        progress: physicalProgress,
        totalUnits: project.totalHousingUnits,
        delivered: project.deliveredHousingUnits,
      },
      financial: {
        budget: project.contractAmount,
        exercised: project.exercisedCost,
        available: project.contractAmount - project.exercisedCost,
        progress: financialProgress,
        deviation: budgetDeviation,
      },
      temporal: {
        contractDuration: project.contractDuration,
        scheduledEnd: project.scheduledEndDate,
        actualEnd: project.actualEndDate,
        deviation: temporalDeviation,
      },
    };
  }

  /**
   * Generar código de proyecto secuencial
   */
  private async generateProjectCode(constructoraId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PROJ-${year}-`;

    // Obtener último código del año
    const lastProject = await this.projectRepo
      .createQueryBuilder('project')
      .where('project.constructoraId = :constructoraId', { constructoraId })
      .andWhere('project.projectCode LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('project.projectCode', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastProject) {
      const lastSequence = parseInt(lastProject.projectCode.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(3, '0')}`;
  }

  /**
   * Calcular fecha de terminación programada
   */
  private calculateScheduledEndDate(startDate: Date, durationMonths: number): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate;
  }

  /**
   * Validar transición de estado
   */
  private validateStatusTransition(
    currentStatus: ProjectStatus,
    newStatus: ProjectStatus,
  ): void {
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.LICITACION]: [ProjectStatus.ADJUDICADO],
      [ProjectStatus.ADJUDICADO]: [ProjectStatus.EJECUCION],
      [ProjectStatus.EJECUCION]: [ProjectStatus.ENTREGADO],
      [ProjectStatus.ENTREGADO]: [ProjectStatus.CERRADO],
      [ProjectStatus.CERRADO]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `No se puede cambiar de estado ${currentStatus} a ${newStatus}`,
      );
    }
  }

  /**
   * Calcular avance físico del proyecto
   */
  private async calculatePhysicalProgress(projectId: string): Promise<number> {
    // Query para obtener promedio de avance de todas las etapas
    const result = await this.projectRepo.query(
      `
      SELECT AVG(s.physical_progress) as avg_progress
      FROM projects.stages s
      WHERE s.project_id = $1
    `,
      [projectId],
    );

    return parseFloat(result[0]?.avg_progress || 0);
  }

  /**
   * Calcular desviación temporal
   */
  private calculateTemporalDeviation(
    project: Project,
    physicalProgress: number,
  ): number {
    const now = new Date();
    const totalDays =
      (project.scheduledEndDate.getTime() - project.contractStartDate.getTime()) /
      (1000 * 60 * 60 * 24);
    const elapsedDays =
      (now.getTime() - project.contractStartDate.getTime()) / (1000 * 60 * 60 * 24);

    const expectedProgress = (elapsedDays / totalDays) * 100;
    return physicalProgress - expectedProgress;
  }
}
```

---

### 3. ProjectsController

**Archivo:** `apps/backend/src/modules/projects/projects.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('director', 'engineer')
  @ApiOperation({ summary: 'Crear nuevo proyecto' })
  async create(@Body() dto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(
      dto,
      req.user.constructoraId,
      req.user.userId,
    );
  }

  @Get()
  @Roles('director', 'engineer', 'resident', 'purchases', 'finance', 'hr')
  @ApiOperation({ summary: 'Listar proyectos' })
  async findAll(@Request() req, @Query() query) {
    return this.projectsService.findAll(req.user.constructoraId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.constructoraId);
  }

  @Patch(':id')
  @Roles('director', 'engineer')
  @ApiOperation({ summary: 'Actualizar proyecto' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(
      id,
      dto,
      req.user.constructoraId,
      req.user.userId,
    );
  }

  @Post(':id/change-status')
  @Roles('director', 'engineer', 'resident')
  @ApiOperation({ summary: 'Cambiar estado del proyecto' })
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.projectsService.changeStatus(
      id,
      status as any,
      req.user.constructoraId,
      req.user.userId,
    );
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Obtener métricas del proyecto' })
  async getMetrics(@Param('id') id: string, @Request() req) {
    return this.projectsService.calculateMetrics(id, req.user.constructoraId);
  }
}
```

---

## 🎨 Implementación Frontend

### 1. ProjectForm Component

**Archivo:** `apps/frontend/src/features/projects/components/ProjectForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const projectSchema = z.object({
  name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  projectType: z.enum([
    'fraccionamiento_horizontal',
    'conjunto_habitacional',
    'edificio_vertical',
    'mixto',
  ]),
  clientType: z.enum(['publico', 'privado', 'mixto']),
  clientName: z.string().min(3),
  clientRFC: z.string().length(12).or(z.string().length(13)),
  contractType: z.enum(['llave_en_mano', 'precio_alzado', 'administracion', 'mixto']),
  contractAmount: z.number().positive(),
  address: z.string().min(10),
  state: z.string(),
  municipality: z.string(),
  postalCode: z.string().length(5),
  totalArea: z.number().positive(),
  buildableArea: z.number().positive(),
  contractStartDate: z.string(),
  contractDuration: z.number().int().positive(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export function ProjectForm({ projectId, onSuccess }: { projectId?: string; onSuccess: () => void }) {
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectType: 'fraccionamiento_horizontal',
      clientType: 'publico',
      contractType: 'llave_en_mano',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormData) => apiService.post('/projects', data),
    onSuccess: () => {
      toast.success('Proyecto creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear proyecto');
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información Básica</h3>

        <Input
          label="Nombre del Proyecto"
          placeholder="Fraccionamiento Villas del Sol"
          {...form.register('name')}
          error={form.formState.errors.name?.message}
        />

        <Select
          label="Tipo de Proyecto"
          {...form.register('projectType')}
          options={[
            { value: 'fraccionamiento_horizontal', label: 'Fraccionamiento Horizontal' },
            { value: 'conjunto_habitacional', label: 'Conjunto Habitacional' },
            { value: 'edificio_vertical', label: 'Edificio Vertical' },
            { value: 'mixto', label: 'Mixto' },
          ]}
        />
      </div>

      {/* Datos del Cliente */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Datos del Cliente</h3>

        <Select
          label="Tipo de Cliente"
          {...form.register('clientType')}
          options={[
            { value: 'publico', label: 'Público' },
            { value: 'privado', label: 'Privado' },
            { value: 'mixto', label: 'Mixto' },
          ]}
        />

        <Input
          label="Nombre del Cliente"
          placeholder="INFONAVIT Jalisco"
          {...form.register('clientName')}
          error={form.formState.errors.clientName?.message}
        />

        <Input
          label="RFC del Cliente"
          placeholder="INF850101ABC"
          maxLength={13}
          {...form.register('clientRFC')}
          error={form.formState.errors.clientRFC?.message}
        />
      </div>

      {/* Contrato */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información Contractual</h3>

        <Select
          label="Tipo de Contrato"
          {...form.register('contractType')}
          options={[
            { value: 'llave_en_mano', label: 'Llave en Mano' },
            { value: 'precio_alzado', label: 'Precio Alzado' },
            { value: 'administracion', label: 'Administración' },
            { value: 'mixto', label: 'Mixto' },
          ]}
        />

        <Input
          label="Monto Contratado (MXN)"
          type="number"
          step="0.01"
          placeholder="125000000"
          {...form.register('contractAmount', { valueAsNumber: true })}
          error={form.formState.errors.contractAmount?.message}
        />

        <Input
          label="Fecha de Inicio"
          type="date"
          {...form.register('contractStartDate')}
          error={form.formState.errors.contractStartDate?.message}
        />

        <Input
          label="Duración (meses)"
          type="number"
          placeholder="24"
          {...form.register('contractDuration', { valueAsNumber: true })}
          error={form.formState.errors.contractDuration?.message}
        />
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ubicación</h3>

        <Input
          label="Dirección Completa"
          placeholder="Carretera Federal 200 Km 45"
          {...form.register('address')}
          error={form.formState.errors.address?.message}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Estado"
            placeholder="Jalisco"
            {...form.register('state')}
            error={form.formState.errors.state?.message}
          />

          <Input
            label="Municipio"
            placeholder="Zapopan"
            {...form.register('municipality')}
            error={form.formState.errors.municipality?.message}
          />

          <Input
            label="Código Postal"
            placeholder="45100"
            maxLength={5}
            {...form.register('postalCode')}
            error={form.formState.errors.postalCode?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Superficie Total (m²)"
            type="number"
            step="0.01"
            placeholder="150000"
            {...form.register('totalArea', { valueAsNumber: true })}
            error={form.formState.errors.totalArea?.message}
          />

          <Input
            label="Superficie Construible (m²)"
            type="number"
            step="0.01"
            placeholder="120000"
            {...form.register('buildableArea', { valueAsNumber: true })}
            error={form.formState.errors.buildableArea?.message}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <Button type="submit" loading={createMutation.isPending}>
          Crear Proyecto
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
```

---

### 2. ProjectCard Component

**Archivo:** `apps/frontend/src/features/projects/components/ProjectCard.tsx`

```typescript
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

const statusColors = {
  licitacion: 'bg-blue-500',
  adjudicado: 'bg-green-500',
  ejecucion: 'bg-yellow-500',
  entregado: 'bg-purple-500',
  cerrado: 'bg-gray-500',
};

const statusLabels = {
  licitacion: 'Licitación',
  adjudicado: 'Adjudicado',
  ejecucion: 'En Ejecución',
  entregado: 'Entregado',
  cerrado: 'Cerrado',
};

export function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{project.projectCode}</p>
          <h3 className="text-xl font-semibold mt-1">{project.name}</h3>
        </div>
        <Badge className={statusColors[project.status]}>
          {statusLabels[project.status]}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{project.municipality}, {project.state}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(project.contractStartDate).toLocaleDateString('es-MX')} -
            {new Date(project.scheduledEndDate).toLocaleDateString('es-MX')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>${project.contractAmount.toLocaleString('es-MX')}</span>
        </div>
      </div>

      {project.status === 'ejecucion' && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Avance Físico</span>
            <span className="font-semibold">{project.physicalProgress}%</span>
          </div>
          <Progress value={project.physicalProgress} />
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <span className="text-sm">
          {project.totalHousingUnits} viviendas
        </span>
        {project.deliveredHousingUnits > 0 && (
          <span className="text-sm text-green-600">
            • {project.deliveredHousingUnits} entregadas
          </span>
        )}
      </div>
    </Card>
  );
}
```

---

## 🧪 Tests

```typescript
// projects.service.spec.ts
describe('ProjectsService', () => {
  it('should generate unique project codes', async () => {
    const code1 = await service.generateProjectCode('constructora-uuid');
    const code2 = await service.generateProjectCode('constructora-uuid');

    expect(code1).toMatch(/PROJ-2025-\d{3}/);
    expect(code1).not.toBe(code2);
  });

  it('should validate status transitions', () => {
    expect(() =>
      service['validateStatusTransition']('licitacion', 'ejecucion')
    ).toThrow('No se puede cambiar de estado');

    expect(() =>
      service['validateStatusTransition']('licitacion', 'adjudicado')
    ).not.toThrow();
  });
});
```

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
