# ET-COST-002: Implementación de Presupuestos (Obra, Etapa, Prototipo)

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
-- Tabla: budgets (Presupuestos maestros)
CREATE TABLE budgets.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenant discriminator (tenant = constructora)
  -- Each budget belongs to a constructora (see GLOSARIO.md)
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects.projects(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES projects.stages(id) ON DELETE CASCADE,
  prototype_id UUID REFERENCES projects.housing_prototypes(id) ON DELETE CASCADE,

  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  budget_type VARCHAR(20) NOT NULL CHECK (budget_type IN ('project', 'stage', 'prototype')),

  version INTEGER DEFAULT 1,
  is_baseline BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'approved', 'closed')),

  -- Alcance
  housing_units_count INTEGER,
  total_built_area DECIMAL(12,2),
  total_land_area DECIMAL(12,2),

  -- Montos
  direct_cost DECIMAL(15,2) DEFAULT 0,
  indirect_percentage DECIMAL(5,2) DEFAULT 12.00,
  indirect_amount DECIMAL(15,2) DEFAULT 0,
  financing_percentage DECIMAL(5,2) DEFAULT 3.00,
  financing_amount DECIMAL(15,2) DEFAULT 0,
  profit_percentage DECIMAL(5,2) DEFAULT 10.00,
  profit_amount DECIMAL(15,2) DEFAULT 0,
  additional_charges DECIMAL(15,2) DEFAULT 0,
  total_cost DECIMAL(15,2) DEFAULT 0,

  -- Precio y rentabilidad
  sale_price DECIMAL(15,2),
  gross_margin DECIMAL(15,2),
  margin_percentage DECIMAL(5,2),
  roi DECIMAL(5,2),

  -- Indicadores
  cost_per_sqm DECIMAL(10,2),
  cost_per_unit DECIMAL(12,2),

  -- Auditoría
  approved_by UUID,
  approved_at TIMESTAMP,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_one_parent CHECK (
    (project_id IS NOT NULL AND stage_id IS NULL AND prototype_id IS NULL) OR
    (project_id IS NULL AND stage_id IS NOT NULL AND prototype_id IS NULL) OR
    (project_id IS NULL AND stage_id IS NULL AND prototype_id IS NOT NULL)
  )
);

CREATE INDEX idx_budgets_project ON budgets.budgets(project_id);
CREATE INDEX idx_budgets_type ON budgets.budgets(budget_type);
CREATE INDEX idx_budgets_status ON budgets.budgets(status);


-- Tabla: budget_items (Partidas del presupuesto)
CREATE TABLE budgets.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets.budgets(id) ON DELETE CASCADE,
  parent_item_id UUID REFERENCES budgets.budget_items(id),

  level INTEGER NOT NULL CHECK (level IN (1, 2, 3)), -- 1=División, 2=Grupo, 3=Concepto
  sort_order INTEGER DEFAULT 0,

  -- Concepto (si es partida individual)
  concept_id UUID REFERENCES budgets.concept_catalog(id),

  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(20),
  quantity DECIMAL(12,4),
  unit_price DECIMAL(12,2),
  amount DECIMAL(15,2),

  -- Generadores (para presupuestos de prototipo)
  has_generator BOOLEAN DEFAULT false,
  generator_formula TEXT,
  generator_inputs JSONB,

  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budget_items_budget ON budgets.budget_items(budget_id);
CREATE INDEX idx_budget_items_parent ON budgets.budget_items(parent_item_id);
CREATE INDEX idx_budget_items_concept ON budgets.budget_items(concept_id);


-- Tabla: budget_versions (Historial de versiones)
CREATE TABLE budgets.budget_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets.budgets(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  version_type VARCHAR(30) CHECK (version_type IN ('baseline', 'price_adjustment', 'scope_change', 'additional_volume')),
  previous_version_id UUID REFERENCES budgets.budget_versions(id),

  total_cost DECIMAL(15,2),
  variation_amount DECIMAL(15,2),
  variation_percentage DECIMAL(6,2),

  reason TEXT,
  approved_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_budget_version UNIQUE (budget_id, version)
);
```

## 2. Triggers

```sql
-- Trigger: Calcular totales del presupuesto
CREATE OR REPLACE FUNCTION budgets.calculate_budget_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Sumar partidas de nivel 3 (conceptos individuales)
  UPDATE budgets.budgets b
  SET
    direct_cost = COALESCE((
      SELECT SUM(amount)
      FROM budgets.budget_items
      WHERE budget_id = NEW.budget_id AND level = 3
    ), 0),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.budget_id;

  -- Calcular costos indirectos, financiamiento, etc.
  UPDATE budgets.budgets
  SET
    indirect_amount = direct_cost * (indirect_percentage / 100),
    financing_amount = (direct_cost + indirect_amount) * (financing_percentage / 100),
    profit_amount = (direct_cost + indirect_amount + financing_amount) * (profit_percentage / 100),
    total_cost = direct_cost + indirect_amount + financing_amount + profit_amount + additional_charges,
    cost_per_sqm = CASE
      WHEN total_built_area > 0 THEN total_cost / total_built_area
      ELSE 0
    END,
    cost_per_unit = CASE
      WHEN housing_units_count > 0 THEN total_cost / housing_units_count
      ELSE 0
    END,
    gross_margin = CASE
      WHEN sale_price IS NOT NULL THEN sale_price - total_cost
      ELSE NULL
    END,
    margin_percentage = CASE
      WHEN sale_price IS NOT NULL AND sale_price > 0 THEN ((sale_price - total_cost) / sale_price) * 100
      ELSE NULL
    END
  WHERE id = NEW.budget_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_budget_items_calculate
  AFTER INSERT OR UPDATE OR DELETE ON budgets.budget_items
  FOR EACH ROW
  EXECUTE FUNCTION budgets.calculate_budget_totals();
```

## 3. TypeORM Entities (Simplificado)

```typescript
// src/budgets/entities/budget.entity.ts
@Entity('budgets', { schema: 'budgets' })
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ name: 'stage_id', nullable: true })
  stageId: string;

  @Column({ name: 'prototype_id', nullable: true })
  prototypeId: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'budget_type' })
  budgetType: 'project' | 'stage' | 'prototype';

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ name: 'is_baseline', default: false })
  isBaseline: boolean;

  @Column({ default: 'draft' })
  status: 'draft' | 'active' | 'approved' | 'closed';

  // Alcance
  @Column({ name: 'housing_units_count', nullable: true })
  housingUnitsCount: number;

  @Column({ name: 'total_built_area', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalBuiltArea: number;

  // Montos (calculados por trigger)
  @Column({ name: 'direct_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
  directCost: number;

  @Column({ name: 'total_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  @Column({ name: 'sale_price', type: 'decimal', precision: 15, scale: 2, nullable: true })
  salePrice: number;

  @Column({ name: 'margin_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  marginPercentage: number;

  // Relación con partidas
  @OneToMany(() => BudgetItem, (item) => item.budget, { cascade: true })
  items: BudgetItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// src/budgets/entities/budget-item.entity.ts
@Entity('budget_items', { schema: 'budgets' })
export class BudgetItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'budget_id' })
  budgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.items)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @Column({ name: 'concept_id', nullable: true })
  conceptId: string;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 20, nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'integer' })
  level: 1 | 2 | 3;
}
```

## 4. Service (Métodos Clave)

```typescript
// src/budgets/services/budget.service.ts
@Injectable()
export class BudgetService {
  async createFromPrototype(prototypeId: string, constructoraId: string): Promise<Budget> {
    // 1. Obtener prototipo con sus características
    const prototype = await this.prototypeService.findOne(prototypeId);

    // 2. Crear presupuesto base
    const budget = this.budgetRepo.create({
      constructoraId,
      prototypeId,
      budgetType: 'prototype',
      code: await this.generateCode('prototype', constructoraId),
      name: `Presupuesto ${prototype.name}`,
      housingUnitsCount: 1,
      totalBuiltArea: prototype.totalBuiltArea,
    });
    await this.budgetRepo.save(budget);

    // 3. Cargar plantilla de conceptos base (200 partidas típicas)
    const templateItems = await this.loadTemplate('vivienda-unifamiliar');

    // 4. Ejecutar generadores automáticos
    const items = [];
    for (const template of templateItems) {
      if (template.hasGenerator) {
        const quantity = this.executeGenerator(template.generatorFormula, prototype);
        items.push({
          budgetId: budget.id,
          conceptId: template.conceptId,
          code: template.code,
          name: template.name,
          unit: template.unit,
          quantity,
          unitPrice: template.unitPrice,
          amount: quantity * template.unitPrice,
          level: 3,
        });
      }
    }

    await this.budgetItemRepo.save(items);

    return budget;
  }

  private executeGenerator(formula: string, prototype: any): number {
    // Ejemplo: formula = "builtArea * 1.0"
    const context = {
      builtArea: prototype.totalBuiltArea,
      landArea: prototype.landAreaRequired,
      bedrooms: prototype.bedrooms,
      bathrooms: prototype.bathrooms,
      // ... más variables
    };

    // Evaluar fórmula de forma segura (usar librería math.js o similar)
    return eval(formula.replace(/(\w+)/g, (match) => context[match] || match));
  }

  async createVersion(budgetId: string, versionType: string, reason: string): Promise<void> {
    const budget = await this.budgetRepo.findOne({ where: { id: budgetId } });

    const newVersion = budget.version + 1;

    // Crear registro de versión
    await this.versionRepo.save({
      budgetId,
      version: newVersion,
      versionType,
      totalCost: budget.totalCost,
      reason,
    });

    budget.version = newVersion;
    await this.budgetRepo.save(budget);
  }

  async compareVersions(budgetId: string, v1: number, v2: number): Promise<any> {
    // Obtener datos de ambas versiones y comparar
    const version1 = await this.versionRepo.findOne({ where: { budgetId, version: v1 } });
    const version2 = await this.versionRepo.findOne({ where: { budgetId, version: v2 } });

    return {
      version1: { version: v1, totalCost: version1.totalCost },
      version2: { version: v2, totalCost: version2.totalCost },
      variance: {
        amount: version2.totalCost - version1.totalCost,
        percentage: ((version2.totalCost - version1.totalCost) / version1.totalCost) * 100,
      },
    };
  }
}
```

## 5. React Components (Simplificado)

```typescript
// src/pages/Budgets/BudgetDetail.tsx
export function BudgetDetail({ budgetId }: { budgetId: string }) {
  const { budget, loading, fetchBudget } = useBudgetStore();

  useEffect(() => {
    fetchBudget(budgetId);
  }, [budgetId]);

  if (loading) return <Loader />;

  return (
    <div>
      <BudgetHeader budget={budget} />
      <BudgetSummary budget={budget} />
      <BudgetItemsTree items={budget.items} />
      <BudgetAnalysis budget={budget} />
    </div>
  );
}

// src/components/Budget/BudgetSummary.tsx
export function BudgetSummary({ budget }: { budget: Budget }) {
  return (
    <div className="budget-summary">
      <div className="summary-card">
        <h3>Costo Total</h3>
        <p className="amount">${budget.totalCost.toLocaleString()}</p>
      </div>
      <div className="summary-card">
        <h3>Costo Directo</h3>
        <p>${budget.directCost.toLocaleString()}</p>
      </div>
      <div className="summary-card">
        <h3>$/m²</h3>
        <p>${budget.costPerSqm.toLocaleString()}</p>
      </div>
      {budget.salePrice && (
        <div className="summary-card">
          <h3>Margen</h3>
          <p className={budget.marginPercentage >= 10 ? 'positive' : 'negative'}>
            {budget.marginPercentage.toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
```

---

**Estado:** ✅ Ready for Implementation

**Nota:** Este documento contiene los componentes esenciales. Para detalles completos de DTOs, validaciones y componentes UI, referirse a ET-COST-001 como patrón.
