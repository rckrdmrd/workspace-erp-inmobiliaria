# ET-COST-004: Implementación de Análisis de Rentabilidad y Márgenes

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
-- Tabla: profitability_analysis (Análisis de rentabilidad)
CREATE TABLE budgets.profitability_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),
  project_id UUID NOT NULL REFERENCES projects.projects(id),

  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  analysis_type VARCHAR(20) CHECK (analysis_type IN ('actual', 'projected', 'scenario')),

  -- Ingresos
  total_revenue DECIMAL(15,2) NOT NULL,
  average_sale_price DECIMAL(12,2),
  units_to_sell INTEGER,

  -- Costos
  construction_cost DECIMAL(15,2),
  land_cost DECIMAL(15,2),
  marketing_cost DECIMAL(15,2),
  administrative_cost DECIMAL(15,2),
  financial_cost DECIMAL(15,2),
  total_costs DECIMAL(15,2),

  -- Rentabilidad
  gross_profit DECIMAL(15,2),
  gross_margin DECIMAL(6,2), -- Porcentaje
  net_profit DECIMAL(15,2),
  net_margin DECIMAL(6,2),

  -- Indicadores
  roi DECIMAL(6,2),
  irr DECIMAL(6,2), -- TIR
  payback_months INTEGER,
  break_even_units INTEGER,

  -- Punto de equilibrio
  fixed_costs DECIMAL(15,2),
  variable_cost_per_unit DECIMAL(12,2),
  contribution_margin DECIMAL(12,2),

  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profitability_project ON budgets.profitability_analysis(project_id);
CREATE INDEX idx_profitability_date ON budgets.profitability_analysis(analysis_date DESC);


-- Tabla: prototype_profitability (Rentabilidad por prototipo)
CREATE TABLE budgets.prototype_profitability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id),
  prototype_id UUID NOT NULL REFERENCES projects.housing_prototypes(id),

  -- Volumen
  units_planned INTEGER NOT NULL,
  units_sold INTEGER DEFAULT 0,
  units_delivered INTEGER DEFAULT 0,

  -- Financiero
  sale_price DECIMAL(12,2) NOT NULL,
  construction_cost DECIMAL(12,2) NOT NULL,
  land_cost_allocated DECIMAL(12,2),
  indirect_costs DECIMAL(12,2),

  unit_profit DECIMAL(12,2),
  unit_margin DECIMAL(6,2), -- Porcentaje

  total_profit DECIMAL(15,2),

  -- Performance
  average_construction_days INTEGER,
  sales_conversion_rate DECIMAL(5,2), -- % de unidades vendidas

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_project_prototype UNIQUE (project_id, prototype_id)
);

CREATE INDEX idx_prototype_profit_project ON budgets.prototype_profitability(project_id);
```

## 2. Funciones SQL

```sql
-- Función: Calcular análisis de rentabilidad
CREATE OR REPLACE FUNCTION budgets.calculate_profitability(
  p_project_id UUID
) RETURNS budgets.profitability_analysis AS $$
DECLARE
  v_result budgets.profitability_analysis;
  v_budget RECORD;
  v_project RECORD;
BEGIN
  -- Obtener presupuesto y proyecto
  SELECT * INTO v_budget
  FROM budgets.budgets
  WHERE project_id = p_project_id AND budget_type = 'project';

  SELECT * INTO v_project
  FROM projects.projects
  WHERE id = p_project_id;

  -- Calcular ingresos
  v_result.total_revenue := v_budget.sale_price;
  v_result.average_sale_price := v_budget.sale_price / v_budget.housing_units_count;
  v_result.units_to_sell := v_budget.housing_units_count;

  -- Costos
  v_result.construction_cost := v_budget.total_cost;
  v_result.land_cost := v_project.land_cost; -- Asumiendo que existe en projects
  v_result.marketing_cost := v_result.total_revenue * 0.03; -- 3%
  v_result.administrative_cost := v_result.total_revenue * 0.015; -- 1.5%
  v_result.financial_cost := (v_result.construction_cost + v_result.land_cost) * 0.02; -- 2% estimado

  v_result.total_costs := v_result.construction_cost + v_result.land_cost +
                          v_result.marketing_cost + v_result.administrative_cost +
                          v_result.financial_cost;

  -- Rentabilidad
  v_result.gross_profit := v_result.total_revenue - v_result.total_costs;
  v_result.gross_margin := (v_result.gross_profit / v_result.total_revenue) * 100;

  v_result.net_profit := v_result.gross_profit; -- Simplificado
  v_result.net_margin := v_result.gross_margin;

  -- ROI
  v_result.roi := (v_result.net_profit / v_result.total_costs) * 100;

  -- Punto de equilibrio
  v_result.fixed_costs := v_result.land_cost + v_project.urbanization_cost; -- Ejemplo
  v_result.variable_cost_per_unit := v_result.construction_cost / v_result.units_to_sell;
  v_result.contribution_margin := v_result.average_sale_price - v_result.variable_cost_per_unit;

  v_result.break_even_units := CEIL(v_result.fixed_costs / v_result.contribution_margin);

  -- Otros campos
  v_result.project_id := p_project_id;
  v_result.analysis_date := CURRENT_DATE;
  v_result.analysis_type := 'actual';

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;


-- Función: Calcular rentabilidad por prototipo
CREATE OR REPLACE FUNCTION budgets.calculate_prototype_profitability(
  p_project_id UUID,
  p_prototype_id UUID
) RETURNS budgets.prototype_profitability AS $$
DECLARE
  v_result budgets.prototype_profitability;
  v_budget RECORD;
BEGIN
  -- Obtener presupuesto del prototipo
  SELECT * INTO v_budget
  FROM budgets.budgets
  WHERE prototype_id = p_prototype_id AND budget_type = 'prototype';

  -- Obtener datos del proyecto
  SELECT
    COUNT(*) as units_planned,
    SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as units_sold,
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as units_delivered
  INTO v_result.units_planned, v_result.units_sold, v_result.units_delivered
  FROM projects.lots
  WHERE project_id = p_project_id AND prototype_id = p_prototype_id;

  v_result.project_id := p_project_id;
  v_result.prototype_id := p_prototype_id;

  -- Costos y precio
  v_result.construction_cost := v_budget.total_cost;
  v_result.sale_price := v_budget.sale_price;
  v_result.land_cost_allocated := 125000; -- Ejemplo: costo fijo por lote

  v_result.unit_profit := v_result.sale_price - v_result.construction_cost - v_result.land_cost_allocated;
  v_result.unit_margin := (v_result.unit_profit / v_result.sale_price) * 100;

  v_result.total_profit := v_result.unit_profit * v_result.units_planned;

  -- Performance
  v_result.sales_conversion_rate := CASE
    WHEN v_result.units_planned > 0 THEN (v_result.units_sold::DECIMAL / v_result.units_planned) * 100
    ELSE 0
  END;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

## 3. TypeORM Entities

```typescript
// src/budgets/entities/profitability-analysis.entity.ts
@Entity('profitability_analysis', { schema: 'budgets' })
export class ProfitabilityAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @Column({ name: 'analysis_type' })
  analysisType: 'actual' | 'projected' | 'scenario';

  @Column({ name: 'total_revenue', type: 'decimal', precision: 15, scale: 2 })
  totalRevenue: number;

  @Column({ name: 'total_costs', type: 'decimal', precision: 15, scale: 2 })
  totalCosts: number;

  @Column({ name: 'gross_profit', type: 'decimal', precision: 15, scale: 2 })
  grossProfit: number;

  @Column({ name: 'gross_margin', type: 'decimal', precision: 6, scale: 2 })
  grossMargin: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  roi: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  irr: number;

  @Column({ name: 'break_even_units', type: 'integer', nullable: true })
  breakEvenUnits: number;
}
```

## 4. Service

```typescript
// src/budgets/services/profitability.service.ts
@Injectable()
export class ProfitabilityService {
  async analyzeProject(projectId: string): Promise<ProfitabilityAnalysis> {
    // Llamar función SQL
    const result = await this.profitabilityRepo.query(
      'SELECT * FROM budgets.calculate_profitability($1)',
      [projectId],
    );

    // Guardar análisis
    const analysis = this.profitabilityRepo.create(result[0]);
    await this.profitabilityRepo.save(analysis);

    return analysis;
  }

  async compareProjects(constructoraId: string): Promise<any[]> {
    // Obtener análisis más reciente de cada proyecto activo
    const analyses = await this.profitabilityRepo
      .createQueryBuilder('pa')
      .innerJoin('projects.projects', 'p', 'p.id = pa.project_id')
      .where('p.constructora_id = :constructoraId', { constructoraId })
      .andWhere('p.status IN (:...statuses)', { statuses: ['adjudicado', 'ejecucion'] })
      .orderBy('pa.analysis_date', 'DESC')
      .distinctOn(['pa.project_id'])
      .getMany();

    return analyses.map((a) => ({
      projectId: a.projectId,
      grossMargin: a.grossMargin,
      roi: a.roi,
      totalRevenue: a.totalRevenue,
      grossProfit: a.grossProfit,
    }));
  }

  async simulateScenario(projectId: string, scenario: ScenarioDto): Promise<ProfitabilityAnalysis> {
    const baseAnalysis = await this.profitabilityRepo.findOne({
      where: { projectId, analysisType: 'actual' },
      order: { analysisDate: 'DESC' },
    });

    // Aplicar cambios del escenario
    const simulated = { ...baseAnalysis };
    simulated.analysisType = 'scenario';

    if (scenario.priceVariation) {
      simulated.totalRevenue *= (1 + scenario.priceVariation / 100);
      simulated.averageSalePrice *= (1 + scenario.priceVariation / 100);
    }

    if (scenario.costVariation) {
      simulated.constructionCost *= (1 + scenario.costVariation / 100);
      simulated.totalCosts = simulated.constructionCost + simulated.landCost + simulated.marketingCost + simulated.administrativeCost + simulated.financialCost;
    }

    if (scenario.unitsVariation) {
      simulated.unitsToSell *= (1 + scenario.unitsVariation / 100);
      simulated.totalRevenue = simulated.averageSalePrice * simulated.unitsToSell;
    }

    // Recalcular rentabilidad
    simulated.grossProfit = simulated.totalRevenue - simulated.totalCosts;
    simulated.grossMargin = (simulated.grossProfit / simulated.totalRevenue) * 100;
    simulated.roi = (simulated.grossProfit / simulated.totalCosts) * 100;

    return simulated;
  }

  async getSensitivityMatrix(projectId: string): Promise<any> {
    const baseAnalysis = await this.profitabilityRepo.findOne({
      where: { projectId, analysisType: 'actual' },
      order: { analysisDate: 'DESC' },
    });

    const priceVariations = [-5, -3, 0, 3, 5];
    const costVariations = [-5, -3, 0, 3, 5];

    const matrix = [];

    for (const priceVar of priceVariations) {
      const row = [];
      for (const costVar of costVariations) {
        const scenario = await this.simulateScenario(projectId, {
          priceVariation: priceVar,
          costVariation: costVar,
        });
        row.push({
          priceVariation: priceVar,
          costVariation: costVar,
          margin: scenario.grossMargin,
        });
      }
      matrix.push(row);
    }

    return {
      baseMargin: baseAnalysis.grossMargin,
      matrix,
    };
  }
}

interface ScenarioDto {
  priceVariation?: number; // +3 = +3%
  costVariation?: number;
  unitsVariation?: number;
}
```

## 5. React Components

```typescript
// src/pages/Profitability/ProfitabilityDashboard.tsx
export function ProfitabilityDashboard({ projectId }: { projectId: string }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    profitabilityApi.analyze(projectId).then(setAnalysis);
  }, [projectId]);

  if (!analysis) return <Loader />;

  return (
    <div className="profitability-dashboard">
      <FinancialSummary analysis={analysis} />
      <BreakEvenChart analysis={analysis} />
      <ROIIndicators analysis={analysis} />
      <ScenarioSimulator projectId={projectId} baseAnalysis={analysis} />
    </div>
  );
}

// Componente de simulador de escenarios
export function ScenarioSimulator({ projectId, baseAnalysis }: any) {
  const [scenario, setScenario] = useState({
    priceVariation: 0,
    costVariation: 0,
    unitsVariation: 0,
  });
  const [result, setResult] = useState(null);

  const simulate = async () => {
    const res = await profitabilityApi.simulateScenario(projectId, scenario);
    setResult(res);
  };

  return (
    <div className="scenario-simulator">
      <h3>Simulador de Escenarios</h3>

      <div className="scenario-inputs">
        <label>
          Variación Precio (%):
          <input
            type="number"
            value={scenario.priceVariation}
            onChange={(e) => setScenario({ ...scenario, priceVariation: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Variación Costo (%):
          <input
            type="number"
            value={scenario.costVariation}
            onChange={(e) => setScenario({ ...scenario, costVariation: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Variación Unidades (%):
          <input
            type="number"
            value={scenario.unitsVariation}
            onChange={(e) => setScenario({ ...scenario, unitsVariation: parseFloat(e.target.value) })}
          />
        </label>
        <button onClick={simulate}>Simular</button>
      </div>

      {result && (
        <div className="scenario-results">
          <h4>Resultados</h4>
          <div className="comparison">
            <div>
              <h5>Base</h5>
              <p>Margen: {baseAnalysis.grossMargin.toFixed(1)}%</p>
              <p>Utilidad: ${baseAnalysis.grossProfit.toLocaleString()}</p>
            </div>
            <div>
              <h5>Escenario</h5>
              <p>Margen: {result.grossMargin.toFixed(1)}%</p>
              <p>Utilidad: ${result.grossProfit.toLocaleString()}</p>
            </div>
            <div className="delta">
              <h5>Variación</h5>
              <p className={result.grossMargin >= baseAnalysis.grossMargin ? 'positive' : 'negative'}>
                {(result.grossMargin - baseAnalysis.grossMargin).toFixed(1)} puntos
              </p>
              <p>${(result.grossProfit - baseAnalysis.grossProfit).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Matriz de sensibilidad
export function SensitivityMatrix({ projectId }: { projectId: string }) {
  const [matrix, setMatrix] = useState(null);

  useEffect(() => {
    profitabilityApi.getSensitivityMatrix(projectId).then(setMatrix);
  }, [projectId]);

  if (!matrix) return <Loader />;

  return (
    <div className="sensitivity-matrix">
      <h3>Matriz de Sensibilidad</h3>
      <table>
        <thead>
          <tr>
            <th>Costo \ Precio</th>
            <th>-5%</th>
            <th>-3%</th>
            <th>Base</th>
            <th>+3%</th>
            <th>+5%</th>
          </tr>
        </thead>
        <tbody>
          {matrix.matrix.map((row, i) => (
            <tr key={i}>
              <td>{ row[0].costVariation}%</td>
              {row.map((cell, j) => (
                <td key={j} className={getColorClass(cell.margin)}>
                  {cell.margin.toFixed(1)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getColorClass(margin: number): string {
  if (margin > 10) return 'positive';
  if (margin > 5) return 'warning';
  return 'negative';
}
```

---

**Estado:** ✅ Ready for Implementation

**Nota:** Esta ET complementa a las anteriores (ET-COST-001 a ET-COST-003). Para implementación completa del módulo de presupuestos, se deben implementar las 4 ETs en conjunto.
