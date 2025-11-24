# ET-ADM-002: Implementación de Centros de Costo Jerárquicos

**ID:** ET-ADM-002
**Módulo:** MAI-013 - Administración & Seguridad
**Tipo:** Especificación Técnica
**Prioridad:** P1 (Alta)
**Fecha de creación:** 2025-11-20
**Versión:** 1.0
**Relacionado con:** RF-ADM-003

---

## 📋 Descripción

Especificación técnica para implementar una estructura de centros de costo jerárquica con:
- Árbol de N niveles (ilimitado)
- Imputación automática de costos
- Distribución de gastos indirectos (overhead)
- Reportes consolidados multinivel

---

## 🗄️ Base de Datos (PostgreSQL)

### Schema

```sql
CREATE SCHEMA IF NOT EXISTS admin;
```

### ENUMs

```sql
CREATE TYPE admin.cost_center_type AS ENUM (
  'direct',           -- Producción (obras)
  'indirect',         -- Administración
  'shared_service'    -- Servicios compartidos
);

CREATE TYPE admin.allocation_method AS ENUM (
  'direct',                    -- Asignación directa
  'proportional_revenue',      -- % sobre ingresos
  'proportional_cost',         -- % sobre costos directos
  'proportional_headcount',    -- % sobre headcount
  'equal',                     -- Distribución equitativa
  'custom'                     -- Fórmula personalizada
);
```

### Tabla: cost_centers

```sql
CREATE TABLE admin.cost_centers (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- "101.2", "001", etc.
  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Jerarquía (Closure Table Pattern)
  parent_id UUID REFERENCES admin.cost_centers(id),
  level INT NOT NULL DEFAULT 0,
  path TEXT NOT NULL, -- "100/101/101.2" (para queries rápidas)
  full_path TEXT, -- "Obra Los Pinos / Etapa 1 / Cimentación"

  -- Clasificación
  type admin.cost_center_type NOT NULL,
  category VARCHAR(100), -- "Construcción", "Administración", etc.

  -- Vinculación multi-tenancy
  constructora_id UUID NOT NULL REFERENCES constructoras.constructoras(id),
  project_id UUID REFERENCES projects.projects(id),
  stage_id UUID REFERENCES projects.stages(id),

  -- Control presupuestal
  budget_amount DECIMAL(15,2),
  budget_year INT,
  responsible_user_id UUID REFERENCES auth_management.users(id),

  -- Estado
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL,

  CONSTRAINT cost_centers_code_format CHECK (code ~* '^[0-9]{1,3}(\.[0-9]{1,3})*$')
);

-- Índices
CREATE INDEX idx_cost_centers_code ON admin.cost_centers(code);
CREATE INDEX idx_cost_centers_parent ON admin.cost_centers(parent_id);
CREATE INDEX idx_cost_centers_path ON admin.cost_centers USING GIST (path gist_trgm_ops);
CREATE INDEX idx_cost_centers_constructora ON admin.cost_centers(constructora_id);
CREATE INDEX idx_cost_centers_project ON admin.cost_centers(project_id);
CREATE INDEX idx_cost_centers_type ON admin.cost_centers(type);
CREATE INDEX idx_cost_centers_active ON admin.cost_centers(is_active) WHERE is_active = TRUE;

-- Trigger para calcular path y full_path automáticamente
CREATE OR REPLACE FUNCTION update_cost_center_paths()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := NEW.code;
    NEW.full_path := NEW.name;
    NEW.level := 0;
  ELSE
    SELECT
      parent.path || '/' || NEW.code,
      parent.full_path || ' / ' || NEW.name,
      parent.level + 1
    INTO NEW.path, NEW.full_path, NEW.level
    FROM admin.cost_centers parent
    WHERE parent.id = NEW.parent_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cost_center_paths
  BEFORE INSERT OR UPDATE ON admin.cost_centers
  FOR EACH ROW
  EXECUTE FUNCTION update_cost_center_paths();
```

### Tabla: cost_imputations (Imputaciones)

```sql
CREATE TABLE admin.cost_imputations (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Centro de costo destino
  cost_center_id UUID NOT NULL REFERENCES admin.cost_centers(id),

  -- Origen de la imputación
  source_type VARCHAR(50) NOT NULL, -- 'purchase_order', 'payroll', 'equipment_usage', 'overhead'
  source_id UUID NOT NULL,

  -- Monto
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MXN',

  -- Fecha
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  period VARCHAR(7) NOT NULL, -- "2025-11" (año-mes)

  -- Descripción
  description TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL,

  CONSTRAINT cost_imputations_amount_positive CHECK (amount > 0)
);

-- Índices
CREATE INDEX idx_cost_imputations_cost_center ON admin.cost_imputations(cost_center_id);
CREATE INDEX idx_cost_imputations_source ON admin.cost_imputations(source_type, source_id);
CREATE INDEX idx_cost_imputations_date ON admin.cost_imputations(date);
CREATE INDEX idx_cost_imputations_period ON admin.cost_imputations(period);

-- Particionamiento por periodo (optimización)
-- CREATE TABLE admin.cost_imputations_2025_11 PARTITION OF admin.cost_imputations
--   FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

### Tabla: overhead_allocation_rules

```sql
CREATE TABLE admin.overhead_allocation_rules (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Centro de costo indirecto (origen)
  indirect_cost_center_id UUID NOT NULL REFERENCES admin.cost_centers(id),

  -- Método de distribución
  method admin.allocation_method NOT NULL,

  -- Frecuencia
  frequency VARCHAR(20) NOT NULL DEFAULT 'monthly', -- 'monthly', 'quarterly', 'annual'

  -- Estado
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL,

  CONSTRAINT overhead_rules_frequency_check CHECK (frequency IN ('monthly', 'quarterly', 'annual'))
);

-- Índices
CREATE INDEX idx_overhead_rules_indirect_cc ON admin.overhead_allocation_rules(indirect_cost_center_id);
CREATE INDEX idx_overhead_rules_active ON admin.overhead_allocation_rules(is_active) WHERE is_active = TRUE;
```

### Funciones SQL Útiles

#### Obtener todos los hijos de un centro

```sql
CREATE OR REPLACE FUNCTION get_cost_center_children(p_cost_center_id UUID)
RETURNS TABLE (
  id UUID,
  code VARCHAR,
  name VARCHAR,
  level INT,
  total_cost DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cc.id,
    cc.code,
    cc.name,
    cc.level,
    COALESCE(SUM(ci.amount), 0) AS total_cost
  FROM admin.cost_centers cc
  LEFT JOIN admin.cost_imputations ci ON ci.cost_center_id = cc.id
  WHERE cc.path LIKE (
    SELECT path || '%' FROM admin.cost_centers WHERE id = p_cost_center_id
  )
  GROUP BY cc.id, cc.code, cc.name, cc.level
  ORDER BY cc.path;
END;
$$ LANGUAGE plpgsql;
```

#### Consolidar costos de un centro y sus hijos

```sql
CREATE OR REPLACE FUNCTION get_consolidated_costs(
  p_cost_center_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS DECIMAL AS $$
DECLARE
  v_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(ci.amount), 0)
  INTO v_total
  FROM admin.cost_imputations ci
  INNER JOIN admin.cost_centers cc ON cc.id = ci.cost_center_id
  WHERE cc.path LIKE (
    SELECT path || '%' FROM admin.cost_centers WHERE id = p_cost_center_id
  )
    AND ci.date BETWEEN p_start_date AND p_end_date;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔧 Backend (NestJS + TypeScript)

### Entity: cost-center.entity.ts

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Constructora } from '../../constructoras/entities/constructora.entity';
import { Project } from '../../projects/entities/project.entity';
import { CostImputation } from './cost-imputation.entity';
import { CostCenterType } from '../enums/cost-center-type.enum';

@Entity({ schema: 'admin', name: 'cost_centers' })
export class CostCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: string;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'parent_id' })
  parent?: CostCenter;

  @OneToMany(() => CostCenter, cc => cc.parent)
  children: CostCenter[];

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ type: 'text' })
  path: string;

  @Column({ name: 'full_path', type: 'text', nullable: true })
  fullPath?: string;

  @Column({ type: 'enum', enum: CostCenterType })
  type: CostCenterType;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  @Column({ name: 'project_id', nullable: true })
  projectId?: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ name: 'budget_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  budgetAmount?: number;

  @Column({ name: 'budget_year', type: 'int', nullable: true })
  budgetYear?: number;

  @Column({ name: 'responsible_user_id', nullable: true })
  responsibleUserId?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @OneToMany(() => CostImputation, ci => ci.costCenter)
  imputations: CostImputation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;
}
```

### Service: cost-centers.service.ts

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostCenter } from './entities/cost-center.entity';
import { CostImputation } from './entities/cost-imputation.entity';
import { CreateCostCenterDto, UpdateCostCenterDto } from './dto';

@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private costCentersRepo: Repository<CostCenter>,
    @InjectRepository(CostImputation)
    private imputationsRepo: Repository<CostImputation>,
  ) {}

  async create(dto: CreateCostCenterDto, userId: string): Promise<CostCenter> {
    // Validar código único
    const existing = await this.costCentersRepo.findOne({
      where: { code: dto.code, constructoraId: dto.constructoraId }
    });

    if (existing) {
      throw new BadRequestException('Cost center code already exists');
    }

    // Si tiene padre, validar que existe
    if (dto.parentId) {
      const parent = await this.costCentersRepo.findOne({
        where: { id: dto.parentId }
      });

      if (!parent) {
        throw new NotFoundException('Parent cost center not found');
      }
    }

    const costCenter = this.costCentersRepo.create({
      ...dto,
      createdBy: userId
    });

    return this.costCentersRepo.save(costCenter);
  }

  async findAll(constructoraId: string, filters?: any): Promise<CostCenter[]> {
    const qb = this.costCentersRepo.createQueryBuilder('cc')
      .where('cc.constructora_id = :constructoraId', { constructoraId });

    if (filters.type) {
      qb.andWhere('cc.type = :type', { type: filters.type });
    }

    if (filters.projectId) {
      qb.andWhere('cc.project_id = :projectId', { projectId: filters.projectId });
    }

    if (filters.isActive !== undefined) {
      qb.andWhere('cc.is_active = :isActive', { isActive: filters.isActive });
    }

    qb.orderBy('cc.path', 'ASC');

    return qb.getMany();
  }

  async getTreeStructure(constructoraId: string): Promise<CostCenter[]> {
    // Obtener todos los centros
    const allCenters = await this.findAll(constructoraId, { isActive: true });

    // Construir árbol
    const tree = this.buildTree(allCenters);

    return tree;
  }

  private buildTree(centers: CostCenter[], parentId: string | null = null): CostCenter[] {
    return centers
      .filter(cc => cc.parentId === parentId)
      .map(cc => ({
        ...cc,
        children: this.buildTree(centers, cc.id)
      }));
  }

  async getConsolidatedCosts(
    costCenterId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await this.costCentersRepo.query(
      'SELECT get_consolidated_costs($1, $2, $3) AS total',
      [costCenterId, startDate, endDate]
    );

    return parseFloat(result[0].total) || 0;
  }

  async imputeCost(
    costCenterId: string,
    sourceType: string,
    sourceId: string,
    amount: number,
    date: Date,
    description: string,
    userId: string
  ): Promise<CostImputation> {
    // Validar centro existe
    const costCenter = await this.costCentersRepo.findOne({
      where: { id: costCenterId }
    });

    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    // Calcular periodo (YYYY-MM)
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const imputation = this.imputationsRepo.create({
      costCenterId,
      sourceType,
      sourceId,
      amount,
      date,
      period,
      description,
      createdBy: userId
    });

    return this.imputationsRepo.save(imputation);
  }

  async distributeOverhead(
    indirectCostCenterId: string,
    period: string // "2025-11"
  ): Promise<void> {
    // 1. Obtener total de gastos indirectos del periodo
    const [year, month] = period.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const totalOverhead = await this.getConsolidatedCosts(
      indirectCostCenterId,
      startDate,
      endDate
    );

    // 2. Obtener regla de distribución
    const rule = await this.overheadRulesRepo.findOne({
      where: { indirectCostCenterId, isActive: true }
    });

    if (!rule) {
      throw new NotFoundException('No overhead allocation rule found');
    }

    // 3. Obtener centros de costo directos (obras activas)
    const directCenters = await this.costCentersRepo.find({
      where: { type: CostCenterType.DIRECT, isActive: true }
    });

    // 4. Calcular distribución según método
    let allocations: { costCenterId: string; amount: number }[] = [];

    switch (rule.method) {
      case AllocationMethod.PROPORTIONAL_REVENUE:
        allocations = await this.calculateProportionalByRevenue(
          directCenters,
          totalOverhead,
          startDate,
          endDate
        );
        break;

      case AllocationMethod.PROPORTIONAL_COST:
        allocations = await this.calculateProportionalByCost(
          directCenters,
          totalOverhead,
          startDate,
          endDate
        );
        break;

      case AllocationMethod.EQUAL:
        const amountPerCenter = totalOverhead / directCenters.length;
        allocations = directCenters.map(cc => ({
          costCenterId: cc.id,
          amount: amountPerCenter
        }));
        break;

      default:
        throw new BadRequestException('Unsupported allocation method');
    }

    // 5. Crear imputaciones de distribución
    for (const allocation of allocations) {
      await this.imputeCost(
        allocation.costCenterId,
        'overhead',
        indirectCostCenterId,
        allocation.amount,
        endDate,
        `Distribución de gastos indirectos - ${period}`,
        'system'
      );
    }
  }

  private async calculateProportionalByRevenue(
    centers: CostCenter[],
    totalOverhead: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ costCenterId: string; amount: number }[]> {
    // Obtener ingresos por centro
    const revenues = await Promise.all(
      centers.map(async cc => ({
        costCenterId: cc.id,
        revenue: await this.getRevenue(cc.projectId, startDate, endDate)
      }))
    );

    const totalRevenue = revenues.reduce((sum, r) => sum + r.revenue, 0);

    return revenues.map(r => ({
      costCenterId: r.costCenterId,
      amount: (r.revenue / totalRevenue) * totalOverhead
    }));
  }

  private async calculateProportionalByCost(
    centers: CostCenter[],
    totalOverhead: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ costCenterId: string; amount: number }[]> {
    // Obtener costos directos por centro
    const costs = await Promise.all(
      centers.map(async cc => ({
        costCenterId: cc.id,
        cost: await this.getConsolidatedCosts(cc.id, startDate, endDate)
      }))
    );

    const totalCost = costs.reduce((sum, c) => sum + c.cost, 0);

    return costs.map(c => ({
      costCenterId: c.costCenterId,
      amount: (c.cost / totalCost) * totalOverhead
    }));
  }

  private async getRevenue(
    projectId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    // TODO: Query revenue from estimations/invoices
    return 0;
  }
}
```

### Controller: cost-centers.controller.ts

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CostCentersService } from './cost-centers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermissions } from '../admin/decorators/require-permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PermissionAction } from '../admin/enums/permission-action.enum';
import { CreateCostCenterDto, UpdateCostCenterDto } from './dto';

@Controller('admin/cost-centers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CostCentersController {
  constructor(private costCentersService: CostCentersService) {}

  @Get()
  @RequirePermissions('admin', PermissionAction.READ)
  async findAll(
    @CurrentUser() user: any,
    @Query() filters: any
  ) {
    return this.costCentersService.findAll(user.constructoraId, filters);
  }

  @Get('tree')
  @RequirePermissions('admin', PermissionAction.READ)
  async getTree(@CurrentUser() user: any) {
    return this.costCentersService.getTreeStructure(user.constructoraId);
  }

  @Get(':id/consolidated-costs')
  @RequirePermissions('admin', PermissionAction.READ)
  async getConsolidatedCosts(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const total = await this.costCentersService.getConsolidatedCosts(
      id,
      new Date(startDate),
      new Date(endDate)
    );

    return { total };
  }

  @Post()
  @RequirePermissions('admin', PermissionAction.CREATE)
  async create(
    @Body() dto: CreateCostCenterDto,
    @CurrentUser() user: any
  ) {
    return this.costCentersService.create(dto, user.id);
  }

  @Post('distribute-overhead')
  @RequirePermissions('admin', PermissionAction.APPROVE)
  async distributeOverhead(
    @Body() dto: { indirectCostCenterId: string; period: string }
  ) {
    await this.costCentersService.distributeOverhead(
      dto.indirectCostCenterId,
      dto.period
    );

    return { message: 'Overhead distributed successfully' };
  }
}
```

---

## 🎨 Frontend (React + TypeScript)

### Component: CostCenterTree.tsx

```typescript
import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { api } from '../services/api';

interface CostCenter {
  id: string;
  code: string;
  name: string;
  type: string;
  level: number;
  children?: CostCenter[];
  totalCost?: number;
}

export const CostCenterTree: React.FC = () => {
  const [tree, setTree] = useState<CostCenter[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    const response = await api.get('/admin/cost-centers/tree');
    setTree(response.data);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: CostCenter) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);

    return (
      <div key={node.id} className="mb-1">
        <div
          className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer ${
            node.level === 0 ? 'font-bold' : ''
          }`}
          style={{ paddingLeft: `${node.level * 24 + 8}px` }}
        >
          {hasChildren && (
            <button onClick={() => toggleExpand(node.id)} className="p-1">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          <span
            className={`px-2 py-1 rounded text-xs ${
              node.type === 'direct'
                ? 'bg-blue-100 text-blue-800'
                : node.type === 'indirect'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {node.code}
          </span>

          <span className="flex-1">{node.name}</span>

          {node.totalCost !== undefined && (
            <span className="text-sm text-gray-600">
              ${node.totalCost.toLocaleString()}
            </span>
          )}

          <button className="p-1 hover:bg-gray-200 rounded">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children.map(child => renderNode(child))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Centros de Costo</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Crear Centro
        </button>
      </div>

      <div>{tree.map(node => renderNode(node))}</div>
    </div>
  );
};
```

---

## 🧪 Tests

```typescript
describe('CostCentersService', () => {
  it('should create cost center with auto-calculated path', async () => {
    const parent = await service.create({
      code: '100',
      name: 'Obra A',
      type: CostCenterType.DIRECT,
      constructoraId: 'uuid-empresa'
    }, 'uuid-user');

    expect(parent.path).toBe('100');
    expect(parent.level).toBe(0);

    const child = await service.create({
      code: '101',
      name: 'Etapa 1',
      type: CostCenterType.DIRECT,
      parentId: parent.id,
      constructoraId: 'uuid-empresa'
    }, 'uuid-user');

    expect(child.path).toBe('100/101');
    expect(child.level).toBe(1);
  });

  it('should consolidate costs from children', async () => {
    const parent = await createCostCenter({ code: '100' });
    const child1 = await createCostCenter({ code: '101', parentId: parent.id });
    const child2 = await createCostCenter({ code: '102', parentId: parent.id });

    await service.imputeCost(child1.id, 'purchase', 'uuid-1', 10000, new Date(), '', 'user');
    await service.imputeCost(child2.id, 'purchase', 'uuid-2', 15000, new Date(), '', 'user');

    const total = await service.getConsolidatedCosts(
      parent.id,
      new Date('2025-11-01'),
      new Date('2025-11-30')
    );

    expect(total).toBe(25000);
  });
});
```

---

## 🔗 Referencias

- **Requerimiento funcional:** [RF-ADM-003](../requerimientos/RF-ADM-003-centros-costo.md)
- **Historia de usuario:** [US-ADM-003](../historias-usuario/US-ADM-003-centros-costo.md)
- **Módulo:** [README.md](../README.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Estado:** ✅ Completo
