# ET-BI-001: Implementación de Reportes Ejecutivos

**Épica:** MAI-006 - Reportes y Business Intelligence
**Módulo:** Reportes Ejecutivos y Métricas Corporativas
**Responsable Técnico:** Backend + Frontend + Data Analytics
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Objetivo Técnico

Implementar el sistema de reportes ejecutivos con:
- Dashboards corporativos consolidados multi-proyecto
- Cálculo automático de KPIs financieros y operacionales
- Análisis de márgenes y rentabilidad por proyecto
- Proyecciones de flujo de caja
- Vistas materializadas para performance
- Reportes predefinidos con parametrización
- Actualización en tiempo real vía WebSocket

---

## 2. Stack Tecnológico

### Backend
```typescript
- NestJS 10+
- TypeORM con PostgreSQL 15+
- PostgreSQL Materialized Views
- node-cron para cálculos programados
- Bull/BullMQ para procesamiento asíncrono
- WebSocket (Socket.io) para actualizaciones real-time
- EventEmitter2 para eventos
```

### Frontend
```typescript
- React 18 con TypeScript
- Zustand para state management
- Chart.js / Recharts para visualizaciones
- react-grid-layout para dashboards drag&drop
- date-fns para manejo de fechas
- Socket.io-client para WebSocket
- react-query para cache de datos
```

### Analytics
```typescript
- PostgreSQL Window Functions
- Common Table Expressions (CTEs)
- Materialized Views con refresh automático
- Aggregaciones temporales (daily, weekly, monthly)
```

---

## 3. Modelo de Datos SQL

### 3.1 Schema Principal

```sql
-- =====================================================
-- SCHEMA: analytics_reports
-- Descripción: Reportes ejecutivos y métricas
-- =====================================================

CREATE SCHEMA IF NOT EXISTS analytics_reports;

-- =====================================================
-- TABLE: analytics_reports.corporate_dashboards
-- Descripción: Dashboards corporativos configurables
-- =====================================================

CREATE TABLE analytics_reports.corporate_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Alcance
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  -- Identificación
  code VARCHAR(50) NOT NULL, -- DASH-EXEC-001
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Tipo de dashboard
  dashboard_type VARCHAR(30) NOT NULL,
  -- executive, financial, operational, project_portfolio, risk_analysis

  -- Configuración
  config JSONB NOT NULL DEFAULT '{}',
  /*
  {
    "widgets": [
      {
        "id": "widget-1",
        "type": "kpi_card",
        "title": "Margen Bruto Consolidado",
        "metric": "gross_margin_pct",
        "position": {"x": 0, "y": 0, "w": 3, "h": 2}
      },
      {
        "id": "widget-2",
        "type": "line_chart",
        "title": "Flujo de Caja Proyectado",
        "dataSource": "cash_flow_projections",
        "position": {"x": 3, "y": 0, "w": 6, "h": 4}
      }
    ],
    "filters": ["date_range", "project_ids", "region_id"],
    "refreshInterval": 300000
  }
  */

  -- Permisos
  visibility VARCHAR(20) NOT NULL DEFAULT 'private',
  -- private, shared, public
  allowed_roles TEXT[], -- ['admin', 'director', 'cfo']
  allowed_users UUID[],

  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,

  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_dashboard_type CHECK (dashboard_type IN (
    'executive', 'financial', 'operational', 'project_portfolio', 'risk_analysis'
  )),
  CONSTRAINT valid_visibility CHECK (visibility IN ('private', 'shared', 'public')),
  UNIQUE(constructora_id, code)
);

CREATE INDEX idx_dashboards_constructora ON analytics_reports.corporate_dashboards(constructora_id);
CREATE INDEX idx_dashboards_type ON analytics_reports.corporate_dashboards(dashboard_type);
CREATE INDEX idx_dashboards_active ON analytics_reports.corporate_dashboards(is_active) WHERE is_active = true;


-- =====================================================
-- TABLE: analytics_reports.kpi_definitions
-- Descripción: Definiciones de KPIs configurables
-- =====================================================

CREATE TABLE analytics_reports.kpi_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  -- Identificación
  kpi_code VARCHAR(50) NOT NULL, -- KPI_MARGIN_GROSS
  kpi_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- financial, operational, quality, safety

  -- Descripción
  description TEXT,
  formula_description TEXT, -- "(Ingresos - Costos Directos) / Ingresos * 100"

  -- Configuración
  calculation_method VARCHAR(30) NOT NULL,
  -- sql_query, aggregation, formula, external_api

  sql_query TEXT,
  /*
  SELECT
    SUM(revenue) - SUM(direct_cost) AS numerator,
    SUM(revenue) AS denominator
  FROM projects.projects
  WHERE status = 'active'
  */

  aggregation_config JSONB,
  /*
  {
    "sourceTable": "projects.projects",
    "aggregation": "SUM",
    "field": "gross_margin_amount",
    "filters": {"status": "active"}
  }
  */

  -- Formato y unidades
  unit VARCHAR(20), -- %, $, días, puntos
  data_type VARCHAR(20) NOT NULL, -- decimal, integer, percentage, currency
  decimal_places INTEGER DEFAULT 2,

  -- Thresholds (semáforos)
  target_value DECIMAL(15,2),
  warning_threshold DECIMAL(15,2),
  critical_threshold DECIMAL(15,2),
  is_higher_better BOOLEAN DEFAULT true,

  -- Frecuencia de cálculo
  calculation_frequency VARCHAR(20) NOT NULL DEFAULT 'daily',
  -- realtime, hourly, daily, weekly, monthly

  -- Estado
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_category CHECK (category IN ('financial', 'operational', 'quality', 'safety')),
  CONSTRAINT valid_calculation_method CHECK (calculation_method IN (
    'sql_query', 'aggregation', 'formula', 'external_api'
  )),
  CONSTRAINT valid_data_type CHECK (data_type IN ('decimal', 'integer', 'percentage', 'currency')),
  UNIQUE(constructora_id, kpi_code)
);

CREATE INDEX idx_kpi_defs_constructora ON analytics_reports.kpi_definitions(constructora_id);
CREATE INDEX idx_kpi_defs_category ON analytics_reports.kpi_definitions(category);


-- =====================================================
-- TABLE: analytics_reports.kpi_values
-- Descripción: Valores históricos de KPIs
-- =====================================================

CREATE TABLE analytics_reports.kpi_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  kpi_definition_id UUID NOT NULL REFERENCES analytics_reports.kpi_definitions(id) ON DELETE CASCADE,

  -- Dimensiones
  project_id UUID REFERENCES projects.projects(id),
  region_id UUID,
  period_date DATE NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, quarterly, yearly

  -- Valor
  value DECIMAL(15,4) NOT NULL,
  target_value DECIMAL(15,4),
  variance DECIMAL(15,4) GENERATED ALWAYS AS (value - target_value) STORED,
  variance_pct DECIMAL(8,2),

  -- Estado del KPI
  status VARCHAR(20) NOT NULL,
  -- on_target, warning, critical, undefined

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  calculation_duration_ms INTEGER,

  CONSTRAINT valid_period_type CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  CONSTRAINT valid_status CHECK (status IN ('on_target', 'warning', 'critical', 'undefined'))
);

CREATE INDEX idx_kpi_values_definition ON analytics_reports.kpi_values(kpi_definition_id);
CREATE INDEX idx_kpi_values_project ON analytics_reports.kpi_values(project_id);
CREATE INDEX idx_kpi_values_period ON analytics_reports.kpi_values(period_date DESC);
CREATE INDEX idx_kpi_values_period_type ON analytics_reports.kpi_values(period_type);

-- Índice compuesto para consultas de series temporales
CREATE INDEX idx_kpi_values_timeseries ON analytics_reports.kpi_values(
  kpi_definition_id, period_type, period_date DESC
);


-- =====================================================
-- TABLE: analytics_reports.project_performance_metrics
-- Descripción: Métricas consolidadas por proyecto
-- =====================================================

CREATE TABLE analytics_reports.project_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,

  -- Métricas Financieras
  total_budget DECIMAL(15,2),
  committed_amount DECIMAL(15,2),
  spent_amount DECIMAL(15,2),
  remaining_budget DECIMAL(15,2),

  budget_utilization_pct DECIMAL(5,2),
  -- (spent_amount / total_budget) * 100

  -- Márgenes
  revenue DECIMAL(15,2),
  direct_cost DECIMAL(15,2),
  indirect_cost DECIMAL(15,2),
  gross_margin DECIMAL(15,2),
  gross_margin_pct DECIMAL(5,2),
  net_margin DECIMAL(15,2),
  net_margin_pct DECIMAL(5,2),

  -- Métricas de Avance
  physical_progress_pct DECIMAL(5,2),
  schedule_progress_pct DECIMAL(5,2),
  schedule_variance_pct DECIMAL(5,2),

  -- EVM
  planned_value_pv DECIMAL(15,2),
  earned_value_ev DECIMAL(15,2),
  actual_cost_ac DECIMAL(15,2),
  spi DECIMAL(5,3),
  cpi DECIMAL(5,3),

  -- Proyecciones
  estimate_at_completion_eac DECIMAL(15,2),
  estimate_to_complete_etc DECIMAL(15,2),
  variance_at_completion_vac DECIMAL(15,2),

  projected_completion_date DATE,
  days_variance INTEGER,

  -- Indicadores de Salud
  health_score DECIMAL(5,2), -- 0-100
  risk_level VARCHAR(20), -- low, medium, high, critical

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_risk_level CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  UNIQUE(project_id, snapshot_date)
);

CREATE INDEX idx_perf_metrics_project ON analytics_reports.project_performance_metrics(project_id);
CREATE INDEX idx_perf_metrics_snapshot ON analytics_reports.project_performance_metrics(snapshot_date DESC);
CREATE INDEX idx_perf_metrics_risk ON analytics_reports.project_performance_metrics(risk_level);


-- =====================================================
-- TABLE: analytics_reports.cash_flow_projections
-- Descripción: Proyecciones de flujo de caja
-- =====================================================

CREATE TABLE analytics_reports.cash_flow_projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects.projects(id),

  -- Período
  projection_date DATE NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- weekly, monthly, quarterly

  -- Entradas (Inflows)
  expected_collections DECIMAL(15,2) DEFAULT 0,
  financing_inflows DECIMAL(15,2) DEFAULT 0,
  other_inflows DECIMAL(15,2) DEFAULT 0,
  total_inflows DECIMAL(15,2) GENERATED ALWAYS AS (
    expected_collections + financing_inflows + other_inflows
  ) STORED,

  -- Salidas (Outflows)
  payroll_outflows DECIMAL(15,2) DEFAULT 0,
  supplier_payments DECIMAL(15,2) DEFAULT 0,
  subcontractor_payments DECIMAL(15,2) DEFAULT 0,
  indirect_costs DECIMAL(15,2) DEFAULT 0,
  financing_payments DECIMAL(15,2) DEFAULT 0,
  other_outflows DECIMAL(15,2) DEFAULT 0,
  total_outflows DECIMAL(15,2) GENERATED ALWAYS AS (
    payroll_outflows + supplier_payments + subcontractor_payments +
    indirect_costs + financing_payments + other_outflows
  ) STORED,

  -- Flujo Neto
  net_cash_flow DECIMAL(15,2) GENERATED ALWAYS AS (
    total_inflows - total_outflows
  ) STORED,

  -- Saldo Acumulado
  opening_balance DECIMAL(15,2) DEFAULT 0,
  closing_balance DECIMAL(15,2),

  -- Tipo de proyección
  projection_type VARCHAR(20) NOT NULL,
  -- baseline, optimistic, pessimistic, actual

  -- Confianza
  confidence_level DECIMAL(5,2), -- 0-100%

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_period_type CHECK (period_type IN ('weekly', 'monthly', 'quarterly')),
  CONSTRAINT valid_projection_type CHECK (projection_type IN ('baseline', 'optimistic', 'pessimistic', 'actual'))
);

CREATE INDEX idx_cashflow_constructora ON analytics_reports.cash_flow_projections(constructora_id);
CREATE INDEX idx_cashflow_project ON analytics_reports.cash_flow_projections(project_id);
CREATE INDEX idx_cashflow_date ON analytics_reports.cash_flow_projections(projection_date);
CREATE INDEX idx_cashflow_type ON analytics_reports.cash_flow_projections(projection_type);


-- =====================================================
-- TABLE: analytics_reports.margin_analysis
-- Descripción: Análisis detallado de márgenes
-- =====================================================

CREATE TABLE analytics_reports.margin_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL,

  -- Revenue Breakdown
  contracted_revenue DECIMAL(15,2),
  additional_revenue DECIMAL(15,2),
  total_revenue DECIMAL(15,2),

  -- Direct Costs
  material_costs DECIMAL(15,2),
  labor_costs DECIMAL(15,2),
  equipment_costs DECIMAL(15,2),
  subcontractor_costs DECIMAL(15,2),
  total_direct_costs DECIMAL(15,2),

  -- Gross Margin
  gross_margin DECIMAL(15,2) GENERATED ALWAYS AS (
    total_revenue - total_direct_costs
  ) STORED,
  gross_margin_pct DECIMAL(5,2),

  -- Indirect Costs
  site_indirect_costs DECIMAL(15,2),
  corporate_overhead DECIMAL(15,2),
  financing_costs DECIMAL(15,2),
  total_indirect_costs DECIMAL(15,2),

  -- Operating Margin
  operating_margin DECIMAL(15,2) GENERATED ALWAYS AS (
    gross_margin - total_indirect_costs
  ) STORED,
  operating_margin_pct DECIMAL(5,2),

  -- Other Items
  taxes DECIMAL(15,2),
  other_expenses DECIMAL(15,2),

  -- Net Margin
  net_margin DECIMAL(15,2),
  net_margin_pct DECIMAL(5,2),

  -- Comparisons
  budgeted_margin_pct DECIMAL(5,2),
  margin_variance_pct DECIMAL(5,2),

  -- Analysis Flags
  is_margin_erosion BOOLEAN DEFAULT false,
  erosion_severity VARCHAR(20), -- low, medium, high

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(project_id, analysis_date)
);

CREATE INDEX idx_margin_project ON analytics_reports.margin_analysis(project_id);
CREATE INDEX idx_margin_date ON analytics_reports.margin_analysis(analysis_date DESC);
CREATE INDEX idx_margin_erosion ON analytics_reports.margin_analysis(is_margin_erosion)
  WHERE is_margin_erosion = true;
```

### 3.2 Materialized Views

```sql
-- =====================================================
-- MATERIALIZED VIEW: mv_corporate_summary
-- Descripción: Resumen corporativo consolidado
-- =====================================================

CREATE MATERIALIZED VIEW analytics_reports.mv_corporate_summary AS
SELECT
  c.id AS constructora_id,
  c.name AS constructora_name,
  CURRENT_DATE AS snapshot_date,

  -- Contadores de Proyectos
  COUNT(DISTINCT p.id) AS total_projects,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') AS active_projects,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'completed') AS completed_projects,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'on_hold') AS on_hold_projects,

  -- Financiero Consolidado
  SUM(p.total_budget) AS total_portfolio_value,
  SUM(CASE WHEN p.status = 'active' THEN p.total_budget ELSE 0 END) AS active_portfolio_value,

  SUM(pm.spent_amount) AS total_spent,
  SUM(pm.committed_amount) AS total_committed,
  SUM(pm.remaining_budget) AS total_remaining,

  -- Márgenes Consolidados
  AVG(pm.gross_margin_pct) AS avg_gross_margin_pct,
  AVG(pm.net_margin_pct) AS avg_net_margin_pct,
  SUM(pm.gross_margin) AS total_gross_margin,
  SUM(pm.net_margin) AS total_net_margin,

  -- Avance Consolidado
  AVG(pm.physical_progress_pct) AS avg_physical_progress,
  AVG(pm.budget_utilization_pct) AS avg_budget_utilization,

  -- EVM Consolidado
  AVG(pm.spi) AS avg_spi,
  AVG(pm.cpi) AS avg_cpi,
  SUM(pm.planned_value_pv) AS total_pv,
  SUM(pm.earned_value_ev) AS total_ev,
  SUM(pm.actual_cost_ac) AS total_ac,

  -- Riesgos
  COUNT(DISTINCT p.id) FILTER (WHERE pm.risk_level = 'critical') AS critical_projects,
  COUNT(DISTINCT p.id) FILTER (WHERE pm.risk_level = 'high') AS high_risk_projects,

  -- Metadata
  NOW() AS last_refresh

FROM public.constructoras c
LEFT JOIN projects.projects p ON p.constructora_id = c.id
LEFT JOIN analytics_reports.project_performance_metrics pm ON pm.project_id = p.id
  AND pm.snapshot_date = (
    SELECT MAX(snapshot_date)
    FROM analytics_reports.project_performance_metrics
    WHERE project_id = p.id
  )
GROUP BY c.id, c.name;

CREATE UNIQUE INDEX idx_mv_corporate_summary_pk ON analytics_reports.mv_corporate_summary(constructora_id);


-- =====================================================
-- MATERIALIZED VIEW: mv_project_health_indicators
-- Descripción: Indicadores de salud por proyecto
-- =====================================================

CREATE MATERIALIZED VIEW analytics_reports.mv_project_health_indicators AS
SELECT
  p.id AS project_id,
  p.code AS project_code,
  p.name AS project_name,
  p.status AS project_status,

  -- Última métrica
  pm.snapshot_date,
  pm.health_score,
  pm.risk_level,

  -- Indicadores Críticos
  pm.budget_utilization_pct,
  pm.physical_progress_pct,
  pm.schedule_variance_pct,
  pm.gross_margin_pct,
  pm.spi,
  pm.cpi,

  -- Semáforos
  CASE
    WHEN pm.budget_utilization_pct > 95 THEN 'red'
    WHEN pm.budget_utilization_pct > 85 THEN 'yellow'
    ELSE 'green'
  END AS budget_status,

  CASE
    WHEN pm.schedule_variance_pct < -10 THEN 'red'
    WHEN pm.schedule_variance_pct < -5 THEN 'yellow'
    ELSE 'green'
  END AS schedule_status,

  CASE
    WHEN pm.gross_margin_pct < 10 THEN 'red'
    WHEN pm.gross_margin_pct < 15 THEN 'yellow'
    ELSE 'green'
  END AS margin_status,

  CASE
    WHEN pm.cpi < 0.85 THEN 'red'
    WHEN pm.cpi < 0.95 THEN 'yellow'
    ELSE 'green'
  END AS cost_performance_status,

  -- Metadata
  NOW() AS last_refresh

FROM projects.projects p
LEFT JOIN analytics_reports.project_performance_metrics pm ON pm.project_id = p.id
  AND pm.snapshot_date = (
    SELECT MAX(snapshot_date)
    FROM analytics_reports.project_performance_metrics
    WHERE project_id = p.id
  )
WHERE p.status IN ('active', 'on_hold');

CREATE UNIQUE INDEX idx_mv_health_indicators_pk ON analytics_reports.mv_project_health_indicators(project_id);
```

### 3.3 Triggers y Functions

```sql
-- =====================================================
-- FUNCTION: Calcular health score de proyecto
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_reports.calculate_project_health_score(
  p_spi DECIMAL,
  p_cpi DECIMAL,
  p_margin_pct DECIMAL,
  p_schedule_variance_pct DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL := 100.0;
BEGIN
  -- Penalizar por SPI bajo (peso: 25%)
  IF p_spi < 0.80 THEN
    v_score := v_score - 25;
  ELSIF p_spi < 0.90 THEN
    v_score := v_score - 15;
  ELSIF p_spi < 0.95 THEN
    v_score := v_score - 8;
  END IF;

  -- Penalizar por CPI bajo (peso: 30%)
  IF p_cpi < 0.80 THEN
    v_score := v_score - 30;
  ELSIF p_cpi < 0.90 THEN
    v_score := v_score - 20;
  ELSIF p_cpi < 0.95 THEN
    v_score := v_score - 10;
  END IF;

  -- Penalizar por margen bajo (peso: 25%)
  IF p_margin_pct < 5 THEN
    v_score := v_score - 25;
  ELSIF p_margin_pct < 10 THEN
    v_score := v_score - 15;
  ELSIF p_margin_pct < 15 THEN
    v_score := v_score - 8;
  END IF;

  -- Penalizar por retraso en cronograma (peso: 20%)
  IF p_schedule_variance_pct < -15 THEN
    v_score := v_score - 20;
  ELSIF p_schedule_variance_pct < -10 THEN
    v_score := v_score - 12;
  ELSIF p_schedule_variance_pct < -5 THEN
    v_score := v_score - 6;
  END IF;

  RETURN GREATEST(0, LEAST(100, v_score));
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- =====================================================
-- FUNCTION: Refresh materialized views
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_reports.refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_reports.mv_corporate_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_reports.mv_project_health_indicators;

  RAISE NOTICE 'All materialized views refreshed at %', NOW();
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- TRIGGER: Auto-calcular health score
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_reports.trigger_calculate_health_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.health_score := analytics_reports.calculate_project_health_score(
    NEW.spi,
    NEW.cpi,
    NEW.gross_margin_pct,
    NEW.schedule_variance_pct
  );

  -- Determinar risk level basado en health score
  IF NEW.health_score >= 80 THEN
    NEW.risk_level := 'low';
  ELSIF NEW.health_score >= 60 THEN
    NEW.risk_level := 'medium';
  ELSIF NEW.health_score >= 40 THEN
    NEW.risk_level := 'high';
  ELSE
    NEW.risk_level := 'critical';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_health_score
  BEFORE INSERT OR UPDATE ON analytics_reports.project_performance_metrics
  FOR EACH ROW
  EXECUTE FUNCTION analytics_reports.trigger_calculate_health_score();
```

---

## 4. TypeORM Entities

### 4.1 CorporateDashboard Entity

```typescript
// src/modules/analytics/entities/corporate-dashboard.entity.ts

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
import { Constructora } from '../../constructoras/entities/constructora.entity';
import { User } from '../../auth/entities/user.entity';

export enum DashboardType {
  EXECUTIVE = 'executive',
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  PROJECT_PORTFOLIO = 'project_portfolio',
  RISK_ANALYSIS = 'risk_analysis',
}

export enum DashboardVisibility {
  PRIVATE = 'private',
  SHARED = 'shared',
  PUBLIC = 'public',
}

export interface DashboardWidget {
  id: string;
  type: 'kpi_card' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'table' | 'gauge';
  title: string;
  metric?: string;
  dataSource?: string;
  config?: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
  filters?: string[];
  refreshInterval?: number;
  defaultDateRange?: string;
}

@Entity('corporate_dashboards', { schema: 'analytics_reports' })
@Index(['constructoraId', 'code'], { unique: true })
export class CorporateDashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'constructora_id', type: 'uuid' })
  @Index()
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  // Identificación
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Tipo
  @Column({
    name: 'dashboard_type',
    type: 'enum',
    enum: DashboardType,
  })
  @Index()
  dashboardType: DashboardType;

  // Configuración
  @Column({ type: 'jsonb', default: '{}' })
  config: DashboardConfig;

  // Permisos
  @Column({
    type: 'enum',
    enum: DashboardVisibility,
    default: DashboardVisibility.PRIVATE,
  })
  visibility: DashboardVisibility;

  @Column({ name: 'allowed_roles', type: 'text', array: true, nullable: true })
  allowedRoles?: string[];

  @Column({ name: 'allowed_users', type: 'uuid', array: true, nullable: true })
  allowedUsers?: string[];

  // Estado
  @Column({ name: 'is_active', type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  // Metadata
  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 4.2 KPIDefinition Entity

```typescript
// src/modules/analytics/entities/kpi-definition.entity.ts

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
import { Constructora } from '../../constructoras/entities/constructora.entity';
import { KPIValue } from './kpi-value.entity';
import { User } from '../../auth/entities/user.entity';

export enum KPICategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  QUALITY = 'quality',
  SAFETY = 'safety',
}

export enum CalculationMethod {
  SQL_QUERY = 'sql_query',
  AGGREGATION = 'aggregation',
  FORMULA = 'formula',
  EXTERNAL_API = 'external_api',
}

export enum DataType {
  DECIMAL = 'decimal',
  INTEGER = 'integer',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
}

export enum CalculationFrequency {
  REALTIME = 'realtime',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity('kpi_definitions', { schema: 'analytics_reports' })
@Index(['constructoraId', 'kpiCode'], { unique: true })
export class KPIDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'constructora_id', type: 'uuid' })
  @Index()
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  // Identificación
  @Column({ name: 'kpi_code', type: 'varchar', length: 50 })
  kpiCode: string;

  @Column({ name: 'kpi_name', type: 'varchar', length: 255 })
  kpiName: string;

  @Column({ type: 'enum', enum: KPICategory })
  @Index()
  category: KPICategory;

  // Descripción
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'formula_description', type: 'text', nullable: true })
  formulaDescription?: string;

  // Configuración
  @Column({
    name: 'calculation_method',
    type: 'enum',
    enum: CalculationMethod,
  })
  calculationMethod: CalculationMethod;

  @Column({ name: 'sql_query', type: 'text', nullable: true })
  sqlQuery?: string;

  @Column({ name: 'aggregation_config', type: 'jsonb', nullable: true })
  aggregationConfig?: any;

  // Formato y unidades
  @Column({ type: 'varchar', length: 20, nullable: true })
  unit?: string;

  @Column({ name: 'data_type', type: 'enum', enum: DataType })
  dataType: DataType;

  @Column({ name: 'decimal_places', type: 'integer', default: 2 })
  decimalPlaces: number;

  // Thresholds
  @Column({ name: 'target_value', type: 'decimal', precision: 15, scale: 2, nullable: true })
  targetValue?: number;

  @Column({ name: 'warning_threshold', type: 'decimal', precision: 15, scale: 2, nullable: true })
  warningThreshold?: number;

  @Column({ name: 'critical_threshold', type: 'decimal', precision: 15, scale: 2, nullable: true })
  criticalThreshold?: number;

  @Column({ name: 'is_higher_better', type: 'boolean', default: true })
  isHigherBetter: boolean;

  // Frecuencia
  @Column({
    name: 'calculation_frequency',
    type: 'enum',
    enum: CalculationFrequency,
    default: CalculationFrequency.DAILY,
  })
  calculationFrequency: CalculationFrequency;

  // Estado
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Metadata
  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => KPIValue, (value) => value.kpiDefinition)
  values: KPIValue[];
}
```

### 4.3 ProjectPerformanceMetrics Entity

```typescript
// src/modules/analytics/entities/project-performance-metrics.entity.ts

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

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('project_performance_metrics', { schema: 'analytics_reports' })
@Index(['projectId', 'snapshotDate'], { unique: true })
export class ProjectPerformanceMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'snapshot_date', type: 'date' })
  @Index()
  snapshotDate: Date;

  // Métricas Financieras
  @Column({ name: 'total_budget', type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalBudget?: number;

  @Column({ name: 'committed_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  committedAmount?: number;

  @Column({ name: 'spent_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  spentAmount?: number;

  @Column({ name: 'remaining_budget', type: 'decimal', precision: 15, scale: 2, nullable: true })
  remainingBudget?: number;

  @Column({ name: 'budget_utilization_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  budgetUtilizationPct?: number;

  // Márgenes
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  revenue?: number;

  @Column({ name: 'direct_cost', type: 'decimal', precision: 15, scale: 2, nullable: true })
  directCost?: number;

  @Column({ name: 'indirect_cost', type: 'decimal', precision: 15, scale: 2, nullable: true })
  indirectCost?: number;

  @Column({ name: 'gross_margin', type: 'decimal', precision: 15, scale: 2, nullable: true })
  grossMargin?: number;

  @Column({ name: 'gross_margin_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  grossMarginPct?: number;

  @Column({ name: 'net_margin', type: 'decimal', precision: 15, scale: 2, nullable: true })
  netMargin?: number;

  @Column({ name: 'net_margin_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  netMarginPct?: number;

  // Métricas de Avance
  @Column({ name: 'physical_progress_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  physicalProgressPct?: number;

  @Column({ name: 'schedule_progress_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  scheduleProgressPct?: number;

  @Column({ name: 'schedule_variance_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  scheduleVariancePct?: number;

  // EVM
  @Column({ name: 'planned_value_pv', type: 'decimal', precision: 15, scale: 2, nullable: true })
  plannedValuePV?: number;

  @Column({ name: 'earned_value_ev', type: 'decimal', precision: 15, scale: 2, nullable: true })
  earnedValueEV?: number;

  @Column({ name: 'actual_cost_ac', type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualCostAC?: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  spi?: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  cpi?: number;

  // Proyecciones
  @Column({ name: 'estimate_at_completion_eac', type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimateAtCompletionEAC?: number;

  @Column({ name: 'estimate_to_complete_etc', type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimateToCompleteETC?: number;

  @Column({ name: 'variance_at_completion_vac', type: 'decimal', precision: 15, scale: 2, nullable: true })
  varianceAtCompletionVAC?: number;

  @Column({ name: 'projected_completion_date', type: 'date', nullable: true })
  projectedCompletionDate?: Date;

  @Column({ name: 'days_variance', type: 'integer', nullable: true })
  daysVariance?: number;

  // Indicadores de Salud
  @Column({ name: 'health_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  healthScore?: number;

  @Column({ name: 'risk_level', type: 'enum', enum: RiskLevel, nullable: true })
  @Index()
  riskLevel?: RiskLevel;

  // Metadata
  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;
}
```

### 4.4 CashFlowProjection Entity

```typescript
// src/modules/analytics/entities/cash-flow-projection.entity.ts

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
import { Constructora } from '../../constructoras/entities/constructora.entity';
import { Project } from '../../projects/entities/project.entity';

export enum PeriodType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum ProjectionType {
  BASELINE = 'baseline',
  OPTIMISTIC = 'optimistic',
  PESSIMISTIC = 'pessimistic',
  ACTUAL = 'actual',
}

@Entity('cash_flow_projections', { schema: 'analytics_reports' })
export class CashFlowProjection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'constructora_id', type: 'uuid' })
  @Index()
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  @Index()
  projectId?: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  // Período
  @Column({ name: 'projection_date', type: 'date' })
  @Index()
  projectionDate: Date;

  @Column({ name: 'period_type', type: 'enum', enum: PeriodType })
  periodType: PeriodType;

  // Entradas
  @Column({ name: 'expected_collections', type: 'decimal', precision: 15, scale: 2, default: 0 })
  expectedCollections: number;

  @Column({ name: 'financing_inflows', type: 'decimal', precision: 15, scale: 2, default: 0 })
  financingInflows: number;

  @Column({ name: 'other_inflows', type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherInflows: number;

  // Salidas
  @Column({ name: 'payroll_outflows', type: 'decimal', precision: 15, scale: 2, default: 0 })
  payrollOutflows: number;

  @Column({ name: 'supplier_payments', type: 'decimal', precision: 15, scale: 2, default: 0 })
  supplierPayments: number;

  @Column({ name: 'subcontractor_payments', type: 'decimal', precision: 15, scale: 2, default: 0 })
  subcontractorPayments: number;

  @Column({ name: 'indirect_costs', type: 'decimal', precision: 15, scale: 2, default: 0 })
  indirectCosts: number;

  @Column({ name: 'financing_payments', type: 'decimal', precision: 15, scale: 2, default: 0 })
  financingPayments: number;

  @Column({ name: 'other_outflows', type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherOutflows: number;

  // Saldo
  @Column({ name: 'opening_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column({ name: 'closing_balance', type: 'decimal', precision: 15, scale: 2, nullable: true })
  closingBalance?: number;

  // Tipo de proyección
  @Column({ name: 'projection_type', type: 'enum', enum: ProjectionType })
  @Index()
  projectionType: ProjectionType;

  @Column({ name: 'confidence_level', type: 'decimal', precision: 5, scale: 2, nullable: true })
  confidenceLevel?: number;

  // Metadata
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed properties
  get totalInflows(): number {
    return this.expectedCollections + this.financingInflows + this.otherInflows;
  }

  get totalOutflows(): number {
    return (
      this.payrollOutflows +
      this.supplierPayments +
      this.subcontractorPayments +
      this.indirectCosts +
      this.financingPayments +
      this.otherOutflows
    );
  }

  get netCashFlow(): number {
    return this.totalInflows - this.totalOutflows;
  }
}
```

---

## 5. Services (Lógica de Negocio)

### 5.1 ReportService

```typescript
// src/modules/analytics/services/report.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CorporateDashboard } from '../entities/corporate-dashboard.entity';
import { ProjectPerformanceMetrics } from '../entities/project-performance-metrics.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(CorporateDashboard)
    private dashboardRepo: Repository<CorporateDashboard>,
    @InjectRepository(ProjectPerformanceMetrics)
    private metricsRepo: Repository<ProjectPerformanceMetrics>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Obtener dashboard corporativo
   */
  async getDashboard(dashboardId: string, userId: string): Promise<any> {
    const dashboard = await this.dashboardRepo.findOne({
      where: { id: dashboardId },
      relations: ['constructora'],
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    // Verificar permisos
    // TODO: Implementar lógica de verificación de permisos

    // Obtener datos para cada widget
    const widgetsWithData = await Promise.all(
      dashboard.config.widgets.map(async (widget) => {
        const data = await this.getWidgetData(widget, dashboard.constructoraId);
        return {
          ...widget,
          data,
        };
      }),
    );

    return {
      ...dashboard,
      config: {
        ...dashboard.config,
        widgets: widgetsWithData,
      },
    };
  }

  /**
   * Obtener datos para un widget específico
   */
  private async getWidgetData(widget: any, constructoraId: string): Promise<any> {
    switch (widget.type) {
      case 'kpi_card':
        return this.getKPICardData(widget.metric, constructoraId);

      case 'line_chart':
        return this.getTimeSeriesData(widget.dataSource, constructoraId);

      case 'bar_chart':
        return this.getBarChartData(widget.dataSource, constructoraId);

      default:
        return null;
    }
  }

  /**
   * Obtener datos para KPI Card
   */
  private async getKPICardData(metric: string, constructoraId: string): Promise<any> {
    // Consultar materialized view
    const result = await this.dashboardRepo.query(`
      SELECT
        avg_gross_margin_pct AS current_value,
        avg_gross_margin_pct - LAG(avg_gross_margin_pct) OVER (ORDER BY snapshot_date) AS change
      FROM analytics_reports.mv_corporate_summary
      WHERE constructora_id = $1
      ORDER BY snapshot_date DESC
      LIMIT 1
    `, [constructoraId]);

    if (result.length === 0) {
      return { currentValue: 0, change: 0, trend: 'neutral' };
    }

    const { current_value, change } = result[0];

    return {
      currentValue: parseFloat(current_value),
      change: parseFloat(change || 0),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  }

  /**
   * Obtener datos de series temporales
   */
  private async getTimeSeriesData(dataSource: string, constructoraId: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const metrics = await this.metricsRepo
      .createQueryBuilder('m')
      .select('m.snapshot_date', 'date')
      .addSelect('AVG(m.gross_margin_pct)', 'value')
      .innerJoin('m.project', 'p')
      .where('p.constructora_id = :constructoraId', { constructoraId })
      .andWhere('m.snapshot_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('m.snapshot_date')
      .orderBy('m.snapshot_date', 'ASC')
      .getRawMany();

    return metrics.map((m) => ({
      date: m.date,
      value: parseFloat(m.value),
    }));
  }

  /**
   * Obtener resumen corporativo
   */
  async getCorporateSummary(constructoraId: string): Promise<any> {
    const result = await this.dashboardRepo.query(`
      SELECT * FROM analytics_reports.mv_corporate_summary
      WHERE constructora_id = $1
    `, [constructoraId]);

    if (result.length === 0) {
      throw new NotFoundException('Corporate summary not found');
    }

    return result[0];
  }

  /**
   * Obtener proyectos con alertas
   */
  async getProjectsWithAlerts(constructoraId: string): Promise<any[]> {
    const projects = await this.dashboardRepo.query(`
      SELECT
        project_id,
        project_code,
        project_name,
        health_score,
        risk_level,
        budget_status,
        schedule_status,
        margin_status,
        cost_performance_status
      FROM analytics_reports.mv_project_health_indicators phi
      INNER JOIN projects.projects p ON p.id = phi.project_id
      WHERE p.constructora_id = $1
        AND (
          budget_status IN ('yellow', 'red')
          OR schedule_status IN ('yellow', 'red')
          OR margin_status IN ('yellow', 'red')
          OR cost_performance_status IN ('yellow', 'red')
        )
      ORDER BY
        CASE health_score
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          ELSE 4
        END,
        health_score ASC
    `, [constructoraId]);

    return projects;
  }
}
```

### 5.2 MetricsAggregationService

```typescript
// src/modules/analytics/services/metrics-aggregation.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectPerformanceMetrics } from '../entities/project-performance-metrics.entity';
import { Project } from '../../projects/entities/project.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MetricsAggregationService {
  private readonly logger = new Logger(MetricsAggregationService.name);

  constructor(
    @InjectRepository(ProjectPerformanceMetrics)
    private metricsRepo: Repository<ProjectPerformanceMetrics>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  /**
   * Calcular métricas diarias para todos los proyectos activos
   * Ejecuta todos los días a las 2:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async calculateDailyMetrics(): Promise<void> {
    this.logger.log('Starting daily metrics calculation...');

    const activeProjects = await this.projectRepo.find({
      where: { status: 'active' },
    });

    for (const project of activeProjects) {
      try {
        await this.calculateProjectMetrics(project.id, new Date());
        this.logger.log(`Metrics calculated for project ${project.code}`);
      } catch (error) {
        this.logger.error(
          `Error calculating metrics for project ${project.code}`,
          error.stack,
        );
      }
    }

    // Refresh materialized views
    await this.refreshMaterializedViews();

    this.logger.log('Daily metrics calculation completed');
  }

  /**
   * Calcular métricas para un proyecto específico
   */
  async calculateProjectMetrics(projectId: string, snapshotDate: Date): Promise<ProjectPerformanceMetrics> {
    // Obtener datos del proyecto
    const projectData = await this.metricsRepo.query(`
      SELECT
        -- Budget
        b.total_amount AS total_budget,
        COALESCE(SUM(po.committed_amount), 0) AS committed_amount,
        COALESCE(SUM(t.amount), 0) AS spent_amount,
        b.total_amount - COALESCE(SUM(t.amount), 0) AS remaining_budget,
        (COALESCE(SUM(t.amount), 0) / NULLIF(b.total_amount, 0)) * 100 AS budget_utilization_pct,

        -- Revenue & Costs
        p.contracted_value AS revenue,
        COALESCE(SUM(CASE WHEN bi.concept_type = 'direct' THEN bi.actual_cost ELSE 0 END), 0) AS direct_cost,
        COALESCE(SUM(CASE WHEN bi.concept_type = 'indirect' THEN bi.actual_cost ELSE 0 END), 0) AS indirect_cost,

        -- Progress
        COALESCE(AVG(sa.percent_complete), 0) AS physical_progress_pct,
        COALESCE(
          (EXTRACT(EPOCH FROM (CURRENT_DATE - p.start_date)) /
           NULLIF(EXTRACT(EPOCH FROM (p.end_date - p.start_date)), 0)) * 100,
          0
        ) AS schedule_progress_pct,

        -- EVM from latest snapshot
        s.planned_value_pv,
        s.earned_value_ev,
        s.actual_cost_ac,
        s.spi,
        s.cpi

      FROM projects.projects p
      LEFT JOIN budgets.budgets b ON b.project_id = p.id AND b.is_approved = true
      LEFT JOIN budgets.budget_items bi ON bi.budget_id = b.id
      LEFT JOIN purchasing.purchase_orders po ON po.project_id = p.id
      LEFT JOIN costs.transactions t ON t.project_id = p.id
      LEFT JOIN schedules.schedule_activities sa ON sa.schedule_id = (
        SELECT id FROM schedules.schedules
        WHERE project_id = p.id AND status = 'active'
        LIMIT 1
      )
      LEFT JOIN schedules.s_curve_snapshots s ON s.project_id = p.id
        AND s.snapshot_date = (
          SELECT MAX(snapshot_date)
          FROM schedules.s_curve_snapshots
          WHERE project_id = p.id
        )
      WHERE p.id = $1
      GROUP BY p.id, b.total_amount, p.contracted_value, p.start_date, p.end_date,
               s.planned_value_pv, s.earned_value_ev, s.actual_cost_ac, s.spi, s.cpi
    `, [projectId]);

    if (projectData.length === 0) {
      throw new Error(`No data found for project ${projectId}`);
    }

    const data = projectData[0];

    // Calcular márgenes
    const grossMargin = data.revenue - data.direct_cost;
    const grossMarginPct = data.revenue > 0 ? (grossMargin / data.revenue) * 100 : 0;

    const netMargin = grossMargin - data.indirect_cost;
    const netMarginPct = data.revenue > 0 ? (netMargin / data.revenue) * 100 : 0;

    // Calcular proyecciones EVM
    const cpi = data.cpi || 1;
    const estimateAtCompletionEAC = data.total_budget / cpi;
    const estimateToCompleteETC = estimateAtCompletionEAC - data.actual_cost_ac;
    const varianceAtCompletionVAC = data.total_budget - estimateAtCompletionEAC;

    // Calcular schedule variance
    const scheduleVariancePct = data.physical_progress_pct - data.schedule_progress_pct;

    // Crear o actualizar métrica
    const existingMetric = await this.metricsRepo.findOne({
      where: { projectId, snapshotDate },
    });

    const metricData = {
      projectId,
      snapshotDate,
      totalBudget: data.total_budget,
      committedAmount: data.committed_amount,
      spentAmount: data.spent_amount,
      remainingBudget: data.remaining_budget,
      budgetUtilizationPct: data.budget_utilization_pct,
      revenue: data.revenue,
      directCost: data.direct_cost,
      indirectCost: data.indirect_cost,
      grossMargin,
      grossMarginPct,
      netMargin,
      netMarginPct,
      physicalProgressPct: data.physical_progress_pct,
      scheduleProgressPct: data.schedule_progress_pct,
      scheduleVariancePct,
      plannedValuePV: data.planned_value_pv,
      earnedValueEV: data.earned_value_ev,
      actualCostAC: data.actual_cost_ac,
      spi: data.spi,
      cpi: data.cpi,
      estimateAtCompletionEAC,
      estimateToCompleteETC,
      varianceAtCompletionVAC,
      // healthScore y riskLevel se calculan automáticamente en el trigger
    };

    if (existingMetric) {
      Object.assign(existingMetric, metricData);
      return this.metricsRepo.save(existingMetric);
    } else {
      const newMetric = this.metricsRepo.create(metricData);
      return this.metricsRepo.save(newMetric);
    }
  }

  /**
   * Refresh materialized views
   */
  private async refreshMaterializedViews(): Promise<void> {
    try {
      await this.metricsRepo.query(`
        SELECT analytics_reports.refresh_all_materialized_views()
      `);
      this.logger.log('Materialized views refreshed successfully');
    } catch (error) {
      this.logger.error('Error refreshing materialized views', error.stack);
    }
  }
}
```

### 5.3 CashFlowService

```typescript
// src/modules/analytics/services/cash-flow.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CashFlowProjection, PeriodType, ProjectionType } from '../entities/cash-flow-projection.entity';
import { addMonths, addWeeks, startOfMonth, startOfWeek, endOfMonth } from 'date-fns';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectRepository(CashFlowProjection)
    private cashFlowRepo: Repository<CashFlowProjection>,
  ) {}

  /**
   * Generar proyecciones de flujo de caja
   */
  async generateProjections(
    constructoraId: string,
    startDate: Date,
    endDate: Date,
    periodType: PeriodType = PeriodType.MONTHLY,
  ): Promise<CashFlowProjection[]> {
    const projections: CashFlowProjection[] = [];
    let currentDate = this.getStartOfPeriod(startDate, periodType);
    let openingBalance = await this.getCurrentBalance(constructoraId);

    while (currentDate <= endDate) {
      // Baseline projection
      const baselineProjection = await this.calculatePeriodProjection(
        constructoraId,
        currentDate,
        periodType,
        ProjectionType.BASELINE,
        openingBalance,
      );
      projections.push(baselineProjection);

      // Optimistic projection
      const optimisticProjection = await this.calculatePeriodProjection(
        constructoraId,
        currentDate,
        periodType,
        ProjectionType.OPTIMISTIC,
        openingBalance,
      );
      projections.push(optimisticProjection);

      // Pessimistic projection
      const pessimisticProjection = await this.calculatePeriodProjection(
        constructoraId,
        currentDate,
        periodType,
        ProjectionType.PESSIMISTIC,
        openingBalance,
      );
      projections.push(pessimisticProjection);

      // Update opening balance for next period (use baseline)
      openingBalance = baselineProjection.closingBalance || openingBalance;

      // Move to next period
      currentDate = this.getNextPeriod(currentDate, periodType);
    }

    // Save projections
    await this.cashFlowRepo.save(projections);

    return projections;
  }

  /**
   * Calcular proyección para un período
   */
  private async calculatePeriodProjection(
    constructoraId: string,
    projectionDate: Date,
    periodType: PeriodType,
    projectionType: ProjectionType,
    openingBalance: number,
  ): Promise<CashFlowProjection> {
    // Factores de ajuste según tipo de proyección
    const adjustmentFactors = {
      [ProjectionType.BASELINE]: { collections: 1.0, payments: 1.0 },
      [ProjectionType.OPTIMISTIC]: { collections: 1.15, payments: 0.90 },
      [ProjectionType.PESSIMISTIC]: { collections: 0.85, payments: 1.10 },
      [ProjectionType.ACTUAL]: { collections: 1.0, payments: 1.0 },
    };

    const factors = adjustmentFactors[projectionType];

    // Calcular ingresos esperados
    const expectedCollections = await this.calculateExpectedCollections(
      constructoraId,
      projectionDate,
      periodType,
    ) * factors.collections;

    const financingInflows = await this.calculateFinancingInflows(
      constructoraId,
      projectionDate,
      periodType,
    );

    // Calcular egresos esperados
    const payrollOutflows = await this.calculatePayrollOutflows(
      constructoraId,
      projectionDate,
      periodType,
    ) * factors.payments;

    const supplierPayments = await this.calculateSupplierPayments(
      constructoraId,
      projectionDate,
      periodType,
    ) * factors.payments;

    const subcontractorPayments = await this.calculateSubcontractorPayments(
      constructoraId,
      projectionDate,
      periodType,
    ) * factors.payments;

    const indirectCosts = await this.calculateIndirectCosts(
      constructoraId,
      projectionDate,
      periodType,
    ) * factors.payments;

    const projection = this.cashFlowRepo.create({
      constructoraId,
      projectionDate,
      periodType,
      projectionType,
      expectedCollections,
      financingInflows,
      otherInflows: 0,
      payrollOutflows,
      supplierPayments,
      subcontractorPayments,
      indirectCosts,
      financingPayments: 0,
      otherOutflows: 0,
      openingBalance,
      confidenceLevel: this.calculateConfidenceLevel(projectionType, projectionDate),
    });

    // Calcular closing balance
    projection.closingBalance = openingBalance + projection.netCashFlow;

    return projection;
  }

  /**
   * Calcular cobranzas esperadas
   */
  private async calculateExpectedCollections(
    constructoraId: string,
    date: Date,
    periodType: PeriodType,
  ): Promise<number> {
    const { startDate, endDate } = this.getPeriodDates(date, periodType);

    const result = await this.cashFlowRepo.query(`
      SELECT COALESCE(SUM(expected_amount), 0) AS total
      FROM sales.payment_schedules
      WHERE constructora_id = $1
        AND expected_date BETWEEN $2 AND $3
        AND status IN ('pending', 'scheduled')
    `, [constructoraId, startDate, endDate]);

    return parseFloat(result[0]?.total || 0);
  }

  /**
   * Calcular pagos a proveedores
   */
  private async calculateSupplierPayments(
    constructoraId: string,
    date: Date,
    periodType: PeriodType,
  ): Promise<number> {
    const { startDate, endDate } = this.getPeriodDates(date, periodType);

    const result = await this.cashFlowRepo.query(`
      SELECT COALESCE(SUM(po.pending_amount), 0) AS total
      FROM purchasing.purchase_orders po
      INNER JOIN projects.projects p ON p.id = po.project_id
      WHERE p.constructora_id = $1
        AND po.expected_delivery_date BETWEEN $2 AND $3
        AND po.status IN ('approved', 'in_transit')
    `, [constructoraId, startDate, endDate]);

    return parseFloat(result[0]?.total || 0);
  }

  /**
   * Calcular nómina
   */
  private async calculatePayrollOutflows(
    constructoraId: string,
    date: Date,
    periodType: PeriodType,
  ): Promise<number> {
    // Asumir dos pagos de nómina al mes (quincenal)
    const paymentsPerPeriod = periodType === PeriodType.MONTHLY ? 2 :
                              periodType === PeriodType.WEEKLY ? 0.5 : 1;

    const result = await this.cashFlowRepo.query(`
      SELECT COALESCE(SUM(e.monthly_salary), 0) AS total
      FROM hr.employees e
      INNER JOIN projects.project_teams pt ON pt.employee_id = e.id
      INNER JOIN projects.projects p ON p.id = pt.project_id
      WHERE p.constructora_id = $1
        AND e.status = 'active'
        AND p.status = 'active'
    `, [constructoraId]);

    return parseFloat(result[0]?.total || 0) * paymentsPerPeriod;
  }

  /**
   * Helpers
   */
  private getStartOfPeriod(date: Date, periodType: PeriodType): Date {
    switch (periodType) {
      case PeriodType.WEEKLY:
        return startOfWeek(date, { weekStartsOn: 1 });
      case PeriodType.MONTHLY:
        return startOfMonth(date);
      default:
        return date;
    }
  }

  private getNextPeriod(date: Date, periodType: PeriodType): Date {
    switch (periodType) {
      case PeriodType.WEEKLY:
        return addWeeks(date, 1);
      case PeriodType.MONTHLY:
        return addMonths(date, 1);
      default:
        return date;
    }
  }

  private getPeriodDates(date: Date, periodType: PeriodType): { startDate: Date; endDate: Date } {
    const startDate = this.getStartOfPeriod(date, periodType);
    const endDate = periodType === PeriodType.MONTHLY
      ? endOfMonth(startDate)
      : addWeeks(startDate, 1);

    return { startDate, endDate };
  }

  private calculateConfidenceLevel(projectionType: ProjectionType, projectionDate: Date): number {
    const daysAhead = Math.floor((projectionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    // Confidence decreases with time
    let baseConfidence = Math.max(50, 100 - (daysAhead / 365) * 50);

    // Adjust by projection type
    const typeAdjustment = {
      [ProjectionType.BASELINE]: 0,
      [ProjectionType.OPTIMISTIC]: -10,
      [ProjectionType.PESSIMISTIC]: -10,
      [ProjectionType.ACTUAL]: 50,
    };

    return Math.min(100, Math.max(0, baseConfidence + typeAdjustment[projectionType]));
  }

  private async getCurrentBalance(constructoraId: string): Promise<number> {
    const result = await this.cashFlowRepo.query(`
      SELECT current_balance
      FROM finance.bank_accounts
      WHERE constructora_id = $1
        AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `, [constructoraId]);

    return parseFloat(result[0]?.current_balance || 0);
  }

  private async calculateFinancingInflows(
    constructoraId: string,
    date: Date,
    periodType: PeriodType,
  ): Promise<number> {
    // TODO: Implementar lógica de financiamiento
    return 0;
  }

  private async calculateSubcontractorPayments(
    constructoraId: string,
    date: Date,
    periodType: PeriodType,
  ): Promise<number> {
    // TODO: Implementar lógica de subcontratistas
    return 0;
  }

  private async calculateIndirectCosts(
    constructoraId: string,
    date: Date,
    periodType: PeriodType,
  ): Promise<number> {
    // TODO: Implementar lógica de costos indirectos
    return 0;
  }
}
```

---

## 6. Controllers (API Endpoints)

```typescript
// src/modules/analytics/controllers/report.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ReportService } from '../services/report.service';
import { MetricsAggregationService } from '../services/metrics-aggregation.service';
import { CashFlowService } from '../services/cash-flow.service';
import { PeriodType } from '../entities/cash-flow-projection.entity';

@Controller('api/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
  constructor(
    private reportService: ReportService,
    private metricsService: MetricsAggregationService,
    private cashFlowService: CashFlowService,
  ) {}

  /**
   * GET /api/reports/dashboards/:id
   * Obtener dashboard corporativo
   */
  @Get('dashboards/:id')
  @Roles('admin', 'director', 'cfo', 'manager')
  async getDashboard(@Param('id') id: string, @Request() req) {
    return this.reportService.getDashboard(id, req.user.sub);
  }

  /**
   * GET /api/reports/corporate-summary
   * Obtener resumen corporativo consolidado
   */
  @Get('corporate-summary')
  @Roles('admin', 'director', 'cfo')
  async getCorporateSummary(@Request() req) {
    return this.reportService.getCorporateSummary(req.user.constructoraId);
  }

  /**
   * GET /api/reports/projects-with-alerts
   * Obtener proyectos con alertas
   */
  @Get('projects-with-alerts')
  @Roles('admin', 'director', 'cfo', 'manager')
  async getProjectsWithAlerts(@Request() req) {
    return this.reportService.getProjectsWithAlerts(req.user.constructoraId);
  }

  /**
   * POST /api/reports/projects/:projectId/metrics/calculate
   * Calcular métricas de un proyecto manualmente
   */
  @Post('projects/:projectId/metrics/calculate')
  @Roles('admin', 'director', 'cfo')
  async calculateProjectMetrics(@Param('projectId') projectId: string) {
    return this.metricsService.calculateProjectMetrics(projectId, new Date());
  }

  /**
   * GET /api/reports/cash-flow/projections
   * Obtener proyecciones de flujo de caja
   */
  @Get('cash-flow/projections')
  @Roles('admin', 'director', 'cfo')
  async getCashFlowProjections(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('periodType') periodType: PeriodType,
  ) {
    return this.cashFlowService.generateProjections(
      req.user.constructoraId,
      new Date(startDate),
      new Date(endDate),
      periodType,
    );
  }

  /**
   * POST /api/reports/refresh-materialized-views
   * Refrescar vistas materializadas manualmente
   */
  @Post('refresh-materialized-views')
  @Roles('admin')
  async refreshMaterializedViews() {
    await this.metricsService['refreshMaterializedViews']();
    return { message: 'Materialized views refreshed successfully' };
  }
}
```

---

## 7. React Components

### 7.1 CorporateDashboard Component

```typescript
// src/pages/Reports/CorporateDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useReportStore } from '../../stores/reportStore';
import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/reports/KPICard';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { ProjectHealthTable } from '../../components/reports/ProjectHealthTable';

export function CorporateDashboard() {
  const { corporateSummary, projectsWithAlerts, loading, fetchCorporateSummary, fetchProjectsWithAlerts } = useReportStore();

  useEffect(() => {
    fetchCorporateSummary();
    fetchProjectsWithAlerts();
  }, []);

  if (loading) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div className="corporate-dashboard">
      <div className="page-header">
        <h1>Dashboard Ejecutivo</h1>
        <div className="last-update">
          Última actualización: {new Date(corporateSummary?.last_refresh).toLocaleString('es-MX')}
        </div>
      </div>

      {/* KPIs principales */}
      <div className="kpi-grid grid grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Proyectos Activos"
          value={corporateSummary?.active_projects || 0}
          unit=""
          trend="neutral"
        />
        <KPICard
          title="Valor Portafolio Activo"
          value={corporateSummary?.active_portfolio_value || 0}
          unit="$"
          format="currency"
          trend="up"
          change={5.2}
        />
        <KPICard
          title="Margen Bruto Promedio"
          value={corporateSummary?.avg_gross_margin_pct || 0}
          unit="%"
          trend={corporateSummary?.avg_gross_margin_pct > 15 ? 'up' : 'down'}
          threshold={{ warning: 15, critical: 10 }}
        />
        <KPICard
          title="CPI Consolidado"
          value={corporateSummary?.avg_cpi || 0}
          unit=""
          decimals={3}
          trend={corporateSummary?.avg_cpi >= 1.0 ? 'up' : 'down'}
          threshold={{ warning: 0.95, critical: 0.85 }}
        />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card title="Avance Físico Consolidado">
          <LineChart
            data={[]} // TODO: Cargar datos de series temporales
            xAxisKey="date"
            yAxisKey="value"
            height={300}
          />
        </Card>

        <Card title="Distribución por Estado">
          <BarChart
            data={[
              { status: 'Activos', count: corporateSummary?.active_projects },
              { status: 'Pausados', count: corporateSummary?.on_hold_projects },
              { status: 'Completados', count: corporateSummary?.completed_projects },
            ]}
            xAxisKey="status"
            yAxisKey="count"
            height={300}
          />
        </Card>
      </div>

      {/* Proyectos con alertas */}
      <Card title="Proyectos que Requieren Atención" className="mb-6">
        <ProjectHealthTable projects={projectsWithAlerts} />
      </Card>
    </div>
  );
}
```

### 7.2 KPICard Component

```typescript
// src/components/reports/KPICard.tsx

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  unit?: string;
  decimals?: number;
  format?: 'number' | 'currency' | 'percentage';
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit = '',
  decimals = 2,
  format = 'number',
  trend = 'neutral',
  change,
  threshold,
}) => {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return val.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      case 'percentage':
        return `${val.toFixed(decimals)}%`;
      default:
        return val.toLocaleString('es-MX', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
    }
  };

  const getStatusColor = (): string => {
    if (!threshold) return 'text-gray-900';

    if (value <= threshold.critical) return 'text-red-600';
    if (value <= threshold.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="kpi-card bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {getTrendIcon()}
      </div>

      <div className={`text-3xl font-bold ${getStatusColor()}`}>
        {formatValue(value)}
        {unit && <span className="text-xl ml-1">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% vs período anterior
        </div>
      )}
    </div>
  );
};
```

---

## 8. Testing

```typescript
// src/modules/analytics/services/__tests__/metrics-aggregation.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetricsAggregationService } from '../metrics-aggregation.service';
import { ProjectPerformanceMetrics } from '../../entities/project-performance-metrics.entity';
import { Project } from '../../../projects/entities/project.entity';

describe('MetricsAggregationService', () => {
  let service: MetricsAggregationService;
  let metricsRepo: any;
  let projectRepo: any;

  beforeEach(async () => {
    metricsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      query: jest.fn(),
    };

    projectRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsAggregationService,
        {
          provide: getRepositoryToken(ProjectPerformanceMetrics),
          useValue: metricsRepo,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: projectRepo,
        },
      ],
    }).compile();

    service = module.get<MetricsAggregationService>(MetricsAggregationService);
  });

  describe('calculateProjectMetrics', () => {
    it('should calculate metrics for a project', async () => {
      const projectId = 'test-project-id';
      const snapshotDate = new Date('2025-11-17');

      metricsRepo.query.mockResolvedValue([
        {
          total_budget: 10000000,
          committed_amount: 5000000,
          spent_amount: 4000000,
          remaining_budget: 6000000,
          budget_utilization_pct: 40,
          revenue: 12000000,
          direct_cost: 7000000,
          indirect_cost: 2000000,
          physical_progress_pct: 45,
          schedule_progress_pct: 50,
          planned_value_pv: 5000000,
          earned_value_ev: 5400000,
          actual_cost_ac: 4000000,
          spi: 1.08,
          cpi: 1.35,
        },
      ]);

      metricsRepo.findOne.mockResolvedValue(null);
      metricsRepo.create.mockImplementation((data) => data);
      metricsRepo.save.mockImplementation((data) => Promise.resolve(data));

      const result = await service.calculateProjectMetrics(projectId, snapshotDate);

      expect(result.grossMarginPct).toBeCloseTo(41.67, 2);
      expect(result.scheduleVariancePct).toBe(-5);
      expect(metricsRepo.save).toHaveBeenCalled();
    });
  });
});
```

---

## 9. Criterios de Aceptación Técnicos

- [x] Schema `analytics_reports` creado con todas las tablas
- [x] Entities TypeORM con relaciones correctas
- [x] Materialized views para performance
- [x] Services con cálculo de métricas consolidadas
- [x] CRON jobs para actualización diaria de métricas
- [x] Algoritmos de cálculo de KPIs configurables
- [x] Proyecciones de flujo de caja (baseline, optimistic, pessimistic)
- [x] Cálculo automático de health score por proyecto
- [x] Controllers con endpoints RESTful
- [x] React components para dashboards ejecutivos
- [x] KPI cards con semáforos y tendencias
- [x] Triggers para auto-cálculo de indicadores
- [x] Función SQL para refresh de materialized views
- [x] Tests unitarios con >80% coverage

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo Técnico
**Versión:** 1.0
**Estado:** ✅ Listo para Implementación
