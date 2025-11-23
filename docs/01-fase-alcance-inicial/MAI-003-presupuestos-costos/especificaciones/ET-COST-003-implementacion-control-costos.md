# ET-COST-003: Implementación de Control de Costos Reales y Desviaciones

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
-- Tabla: actual_costs (Costos reales)
CREATE TABLE budgets.actual_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenant discriminator (tenant = constructora)
  -- Actual costs tracking per constructora (see GLOSARIO.md)
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),
  project_id UUID NOT NULL REFERENCES projects.projects(id),
  stage_id UUID REFERENCES projects.stages(id),
  budget_item_id UUID NOT NULL REFERENCES budgets.budget_items(id),

  -- Origen del costo
  source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('purchase', 'payroll', 'subcontract', 'equipment', 'other')),
  source_id UUID, -- ID de OC, nómina, subcontrato, etc.
  source_document_number VARCHAR(50),

  -- Montos
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MXN',
  includes_vat BOOLEAN DEFAULT true,

  -- Fechas
  transaction_date DATE NOT NULL,
  accounting_period VARCHAR(7) NOT NULL, -- 2025-11

  -- Clasificación
  cost_type VARCHAR(20) CHECK (cost_type IN ('material', 'labor', 'equipment', 'subcontract', 'indirect')),

  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_actual_costs_project ON budgets.actual_costs(project_id);
CREATE INDEX idx_actual_costs_budget_item ON budgets.actual_costs(budget_item_id);
CREATE INDEX idx_actual_costs_period ON budgets.actual_costs(accounting_period);


-- Tabla: cost_variances (Desviaciones)
CREATE TABLE budgets.cost_variances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id),
  budget_item_id UUID REFERENCES budgets.budget_items(id),

  analysis_date DATE NOT NULL,

  -- Montos
  budgeted_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) NOT NULL,
  variance DECIMAL(15,2) NOT NULL, -- Real - Presupuestado
  variance_percentage DECIMAL(6,2) NOT NULL,

  -- Descomposición
  price_variance DECIMAL(15,2),
  quantity_variance DECIMAL(15,2),
  mixed_variance DECIMAL(15,2),

  -- Clasificación
  status VARCHAR(20) CHECK (status IN ('within_tolerance', 'warning', 'critical')),

  -- Causa raíz y plan de acción
  root_cause TEXT,
  action_plan TEXT,
  responsible_user_id UUID,
  action_deadline DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variances_project ON budgets.cost_variances(project_id);
CREATE INDEX idx_variances_status ON budgets.cost_variances(status);


-- Tabla: cost_projections (Proyecciones)
CREATE TABLE budgets.cost_projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id),

  projection_date DATE NOT NULL,
  physical_progress DECIMAL(5,2) NOT NULL,

  -- Datos base
  budgeted_total_cost DECIMAL(15,2) NOT NULL,
  actual_cost_to_date DECIMAL(15,2) NOT NULL,

  -- Proyecciones (3 métodos)
  linear_projection DECIMAL(15,2),
  cpi_based_projection DECIMAL(15,2),
  weighted_projection DECIMAL(15,2),
  recommended_eac DECIMAL(15,2), -- Estimate at Completion

  -- Índices de desempeño
  cpi DECIMAL(5,3), -- Cost Performance Index
  spi DECIMAL(5,3), -- Schedule Performance Index

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projections_project ON budgets.cost_projections(project_id);
```

## 2. Funciones y Triggers

```sql
-- Función: Calcular desviaciones automáticamente
CREATE OR REPLACE FUNCTION budgets.calculate_variances(
  p_project_id UUID,
  p_analysis_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
  budget_item_id UUID,
  budgeted_amount DECIMAL,
  actual_amount DECIMAL,
  variance DECIMAL,
  variance_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bi.id as budget_item_id,
    bi.amount as budgeted_amount,
    COALESCE(SUM(ac.amount), 0) as actual_amount,
    COALESCE(SUM(ac.amount), 0) - bi.amount as variance,
    CASE
      WHEN bi.amount > 0 THEN ((COALESCE(SUM(ac.amount), 0) - bi.amount) / bi.amount) * 100
      ELSE 0
    END as variance_percentage
  FROM budgets.budget_items bi
  INNER JOIN budgets.budgets b ON bi.budget_id = b.id
  LEFT JOIN budgets.actual_costs ac ON ac.budget_item_id = bi.id
  WHERE b.project_id = p_project_id
    AND bi.level = 3 -- Solo conceptos
  GROUP BY bi.id, bi.amount;
END;
$$ LANGUAGE plpgsql;


-- Función: Calcular proyección EAC
CREATE OR REPLACE FUNCTION budgets.calculate_eac(
  p_project_id UUID
) RETURNS TABLE(
  linear_eac DECIMAL,
  cpi_eac DECIMAL,
  weighted_eac DECIMAL
) AS $$
DECLARE
  v_budget DECIMAL;
  v_actual DECIMAL;
  v_progress DECIMAL;
  v_cpi DECIMAL;
  v_earned_value DECIMAL;
BEGIN
  -- Obtener datos del proyecto
  SELECT
    b.total_cost,
    COALESCE(SUM(ac.amount), 0),
    p.physical_progress
  INTO v_budget, v_actual, v_progress
  FROM budgets.budgets b
  LEFT JOIN budgets.actual_costs ac ON ac.project_id = b.project_id
  INNER JOIN projects.projects p ON p.id = b.project_id
  WHERE b.project_id = p_project_id
    AND b.budget_type = 'project'
  GROUP BY b.total_cost, p.physical_progress;

  -- Valor ganado
  v_earned_value := v_budget * (v_progress / 100);

  -- CPI (Cost Performance Index)
  IF v_actual > 0 THEN
    v_cpi := v_earned_value / v_actual;
  ELSE
    v_cpi := 1.0;
  END IF;

  -- EAC Lineal: (Real / %Avance) * 100
  linear_eac := CASE
    WHEN v_progress > 0 THEN (v_actual / v_progress) * 100
    ELSE v_budget
  END;

  -- EAC basado en CPI: Presupuesto / CPI
  cpi_eac := CASE
    WHEN v_cpi > 0 THEN v_budget / v_cpi
    ELSE v_budget
  END;

  -- EAC Ponderado: Real + [(Presup - ValorGanado) / CPI]
  weighted_eac := v_actual + ((v_budget - v_earned_value) / v_cpi);

  RETURN QUERY SELECT linear_eac, cpi_eac, weighted_eac;
END;
$$ LANGUAGE plpgsql;


-- Trigger: Generar alerta si desviación > 5%
CREATE OR REPLACE FUNCTION budgets.check_variance_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF ABS(NEW.variance_percentage) > 5.0 THEN
    -- Actualizar status a critical
    NEW.status := 'critical';

    -- Insertar notificación (asumiendo tabla de notificaciones)
    -- INSERT INTO notifications (...) VALUES (...);

    RAISE NOTICE 'Alerta: Desviación crítica en partida % (%% %%)',
      NEW.budget_item_id, NEW.variance_percentage, '%';
  ELSIF ABS(NEW.variance_percentage) > 3.0 THEN
    NEW.status := 'warning';
  ELSE
    NEW.status := 'within_tolerance';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_variance_alert
  BEFORE INSERT OR UPDATE ON budgets.cost_variances
  FOR EACH ROW
  EXECUTE FUNCTION budgets.check_variance_alert();
```

## 3. TypeORM Entities (Simplificado)

```typescript
// src/budgets/entities/actual-cost.entity.ts
@Entity('actual_costs', { schema: 'budgets' })
export class ActualCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'budget_item_id' })
  budgetItemId: string;

  @Column({ name: 'source_type' })
  sourceType: 'purchase' | 'payroll' | 'subcontract' | 'equipment' | 'other';

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'accounting_period', length: 7 })
  accountingPeriod: string; // 2025-11
}

// src/budgets/entities/cost-variance.entity.ts
@Entity('cost_variances', { schema: 'budgets' })
export class CostVariance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'budget_item_id', nullable: true })
  budgetItemId: string;

  @Column({ name: 'budgeted_amount', type: 'decimal', precision: 15, scale: 2 })
  budgetedAmount: number;

  @Column({ name: 'actual_amount', type: 'decimal', precision: 15, scale: 2 })
  actualAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  variance: number;

  @Column({ name: 'variance_percentage', type: 'decimal', precision: 6, scale: 2 })
  variancePercentage: number;

  @Column({ default: 'within_tolerance' })
  status: 'within_tolerance' | 'warning' | 'critical';

  @Column({ name: 'root_cause', type: 'text', nullable: true })
  rootCause: string;

  @Column({ name: 'action_plan', type: 'text', nullable: true })
  actionPlan: string;
}
```

## 4. Service (Métodos Clave)

```typescript
// src/budgets/services/cost-control.service.ts
@Injectable()
export class CostControlService {
  async registerCost(dto: RegisterCostDto, constructoraId: string): Promise<ActualCost> {
    // Registrar costo real
    const cost = this.actualCostRepo.create({
      ...dto,
      constructoraId,
      accountingPeriod: this.getAccountingPeriod(dto.transactionDate),
    });

    await this.actualCostRepo.save(cost);

    // Recalcular desviaciones
    await this.recalculateVariances(dto.projectId);

    return cost;
  }

  async recalculateVariances(projectId: string): Promise<void> {
    // Llamar función SQL
    const variances = await this.varianceRepo.query(
      'SELECT * FROM budgets.calculate_variances($1)',
      [projectId],
    );

    // Actualizar o insertar desviaciones
    for (const v of variances) {
      await this.varianceRepo.upsert(
        {
          projectId,
          budgetItemId: v.budget_item_id,
          analysisDate: new Date(),
          budgetedAmount: v.budgeted_amount,
          actualAmount: v.actual_amount,
          variance: v.variance,
          variancePercentage: v.variance_percentage,
        },
        ['projectId', 'budgetItemId'],
      );
    }
  }

  async getProjectionEAC(projectId: string): Promise<any> {
    const result = await this.projectionRepo.query(
      'SELECT * FROM budgets.calculate_eac($1)',
      [projectId],
    );

    const projection = {
      linearEAC: result[0].linear_eac,
      cpiEAC: result[0].cpi_eac,
      weightedEAC: result[0].weighted_eac,
      recommendedEAC: result[0].weighted_eac, // Usar ponderado como recomendado
    };

    // Guardar proyección
    await this.projectionRepo.save({
      projectId,
      projectionDate: new Date(),
      ...projection,
    });

    return projection;
  }

  async getCostControlDashboard(projectId: string): Promise<any> {
    // Obtener presupuesto
    const budget = await this.budgetRepo.findOne({
      where: { projectId, budgetType: 'project' },
    });

    // Obtener costos reales acumulados
    const actualCostsResult = await this.actualCostRepo
      .createQueryBuilder('ac')
      .select('SUM(ac.amount)', 'total')
      .where('ac.project_id = :projectId', { projectId })
      .getRawOne();

    const actualCosts = actualCostsResult.total || 0;

    // Obtener proyecto con avance físico
    const project = await this.projectRepo.findOne({ where: { id: projectId } });

    // Calcular proyección
    const projection = await this.getProjectionEAC(projectId);

    // Obtener desviaciones críticas
    const criticalVariances = await this.varianceRepo.find({
      where: { projectId, status: 'critical' },
      order: { variancePercentage: 'DESC' },
      take: 5,
    });

    return {
      budget: {
        total: budget.totalCost,
        direct: budget.directCost,
      },
      actual: {
        total: actualCosts,
        percentage: (actualCosts / budget.totalCost) * 100,
      },
      progress: {
        physical: project.physicalProgress,
        financial: (actualCosts / budget.totalCost) * 100,
      },
      variance: {
        amount: actualCosts - (budget.totalCost * (project.physicalProgress / 100)),
        percentage: ((actualCosts - (budget.totalCost * (project.physicalProgress / 100))) / budget.totalCost) * 100,
      },
      projection,
      criticalVariances,
    };
  }

  private getAccountingPeriod(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
}
```

## 5. React Components

```typescript
// src/pages/CostControl/CostControlDashboard.tsx
export function CostControlDashboard({ projectId }: { projectId: string }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    costControlApi.getDashboard(projectId).then(setDashboard);
  }, [projectId]);

  if (!dashboard) return <Loader />;

  return (
    <div className="cost-control-dashboard">
      <SummaryCards data={dashboard} />
      <CurveS data={dashboard} />
      <VarianceChart variances={dashboard.criticalVariances} />
      <ProjectionPanel projection={dashboard.projection} />
    </div>
  );
}

// Componente de Curva S
export function CurveS({ data }: { data: any }) {
  const chartData = useMemo(() => ({
    labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Presupuestado',
        data: [0, 15, 30, 45, 65, 85, 100],
        borderColor: 'blue',
      },
      {
        label: 'Real',
        data: [0, 16, 32, data.progress.financial, null, null, null],
        borderColor: 'green',
      },
      {
        label: 'Proyectado',
        data: [null, null, null, data.progress.financial, 70, 90, 105],
        borderColor: 'red',
        borderDash: [5, 5],
      },
    ],
  }), [data]);

  return (
    <div className="curve-s-chart">
      <h3>Curva S - Avance Financiero</h3>
      <Line data={chartData} />
    </div>
  );
}
```

## 6. Cron Job para Análisis Diario

```typescript
// src/budgets/tasks/cost-analysis.task.ts
@Injectable()
export class CostAnalysisTask {
  constructor(private costControlService: CostControlService) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async analyzeDailyCosts() {
    // Obtener proyectos activos
    const activeProjects = await this.projectRepo.find({
      where: { status: 'execution' },
    });

    for (const project of activeProjects) {
      // Recalcular desviaciones
      await this.costControlService.recalculateVariances(project.id);

      // Actualizar proyección
      await this.costControlService.getProjectionEAC(project.id);

      // Generar alertas si es necesario
      const variances = await this.varianceRepo.find({
        where: { projectId: project.id, status: 'critical' },
      });

      if (variances.length > 0) {
        await this.notificationService.sendAlert({
          projectId: project.id,
          type: 'critical_variance',
          count: variances.length,
        });
      }
    }
  }
}
```

---

**Estado:** ✅ Ready for Implementation

**Nota:** Para integración con módulos de Compras, Nómina y Subcontratos, referirse a MAI-004 y MAI-007.
