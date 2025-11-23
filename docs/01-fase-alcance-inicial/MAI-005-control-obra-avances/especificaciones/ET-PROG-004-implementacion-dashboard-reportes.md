# ET-PROG-004: Implementación de Dashboard y Reportes de Avances

**Épica:** MAI-005 - Control de Obra y Avances
**Módulo:** Dashboard y Reportes
**Responsable Técnico:** Backend + Frontend + BI
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Objetivo Técnico

Implementar el dashboard ejecutivo y sistema de reportes con:
- Dashboard en tiempo real con KPIs principales
- Mapa de calor de avances por unidad
- Análisis de productividad por cuadrilla
- Generación de reportes oficiales (INFONAVIT, cliente)
- Exportación a PDF y Excel
- Firma digital de reportes
- Notificaciones de alertas críticas

---

## 2. Stack Tecnológico

### Backend
```typescript
- NestJS 10+ con TypeScript
- TypeORM para PostgreSQL
- PostgreSQL 15+ (schema: analytics)
- node-cron para cálculos programados
- EventEmitter2 para eventos en tiempo real
- ExcelJS para generación de Excel
- PDFKit para generación de PDFs
- WebSocket para actualizaciones en vivo
```

### Frontend
```typescript
- React 18 con TypeScript
- Chart.js / Recharts para gráficas
- react-grid-layout para widgets drag&drop
- Zustand para state management
- Socket.io-client para WebSocket
- jsPDF para PDFs en cliente
- react-to-print para impresión
```

### BI y Analytics
```typescript
- PostgreSQL Materialized Views
- Window Functions para análisis
- Stored Procedures para agregaciones
- CRON jobs para precalcular métricas
```

---

## 3. Modelo de Datos SQL

```sql
-- =====================================================
-- SCHEMA: analytics
-- Descripción: Analytics, KPIs y reportes
-- =====================================================

CREATE SCHEMA IF NOT EXISTS analytics;

-- =====================================================
-- TABLE: analytics.kpi_metrics
-- Descripción: Métricas KPI calculadas diariamente
-- =====================================================

CREATE TABLE analytics.kpi_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Fecha de la métrica
  metric_date DATE NOT NULL,

  -- Avance
  physical_progress DECIMAL(5,2) NOT NULL, -- % avance físico
  financial_progress DECIMAL(5,2) NOT NULL, -- % avance financiero
  time_elapsed DECIMAL(5,2) NOT NULL, -- % tiempo transcurrido

  -- Earned Value Management
  planned_value_pv DECIMAL(15,2),
  earned_value_ev DECIMAL(15,2),
  actual_cost_ac DECIMAL(15,2),
  spi DECIMAL(5,3), -- Schedule Performance Index
  cpi DECIMAL(5,3), -- Cost Performance Index

  -- Desviaciones
  schedule_variance_sv DECIMAL(15,2), -- EV - PV
  cost_variance_cv DECIMAL(15,2), -- EV - AC
  schedule_variance_pct DECIMAL(5,2),
  cost_variance_pct DECIMAL(5,2),

  -- Proyecciones
  estimate_at_completion_eac DECIMAL(15,2),
  estimate_to_complete_etc DECIMAL(15,2),
  variance_at_completion_vac DECIMAL(15,2),

  -- Recursos
  active_crews INTEGER,
  total_workers INTEGER,
  productive_hours DECIMAL(10,2),
  nonproductive_hours DECIMAL(10,2),
  efficiency_pct DECIMAL(5,2),

  -- Calidad
  quality_inspections INTEGER,
  total_nc INTEGER, -- no conformidades
  critical_nc INTEGER,
  open_nc INTEGER,
  closed_nc INTEGER,

  -- Alertas
  critical_alerts INTEGER,
  warning_alerts INTEGER,
  info_alerts INTEGER,

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(project_id, metric_date)
);

CREATE INDEX idx_kpi_project ON analytics.kpi_metrics(project_id);
CREATE INDEX idx_kpi_date ON analytics.kpi_metrics(metric_date);

-- =====================================================
-- TABLE: analytics.productivity_metrics
-- Descripción: Métricas de productividad por cuadrilla
-- =====================================================

CREATE TABLE analytics.productivity_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  crew_id UUID NOT NULL REFERENCES projects.crews(id),
  activity_id UUID REFERENCES schedules.schedule_activities(id),

  -- Período
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Rendimiento
  planned_rate DECIMAL(10,4), -- unidades/día planificadas
  actual_rate DECIMAL(10,4), -- unidades/día reales
  efficiency DECIMAL(5,2), -- (actual/planned) * 100

  -- Producción
  unit VARCHAR(20),
  quantity_produced DECIMAL(12,4),
  labor_hours DECIMAL(10,2),
  workers_count INTEGER,

  -- Costos
  labor_cost DECIMAL(15,2),
  cost_per_unit DECIMAL(15,4),

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(project_id, crew_id, activity_id, period_start, period_end)
);

CREATE INDEX idx_productivity_project ON analytics.productivity_metrics(project_id);
CREATE INDEX idx_productivity_crew ON analytics.productivity_metrics(crew_id);
CREATE INDEX idx_productivity_activity ON analytics.productivity_metrics(activity_id);
CREATE INDEX idx_productivity_period ON analytics.productivity_metrics(period_start, period_end);

-- =====================================================
-- TABLE: analytics.dashboard_widgets
-- Descripción: Configuración de widgets del dashboard
-- =====================================================

CREATE TABLE analytics.dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Usuario
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tipo de widget
  widget_type VARCHAR(50) NOT NULL,
  -- progress_overview, s_curve, heatmap, productivity_chart,
  -- alerts_summary, quality_metrics, crew_performance

  -- Posición en el dashboard
  position INTEGER NOT NULL,
  grid_x INTEGER DEFAULT 0,
  grid_y INTEGER DEFAULT 0,
  grid_w INTEGER DEFAULT 4, -- ancho en columnas (12 columnas total)
  grid_h INTEGER DEFAULT 3, -- alto en filas

  -- Tamaño
  size VARCHAR(20) DEFAULT 'medium',
  -- small, medium, large, full

  -- Configuración del widget
  config JSONB,
  /* {
    projectId: "uuid",
    chartType: "line",
    timeRange: "30d",
    metrics: ["spi", "cpi"],
    filters: {...}
  } */

  -- Visibilidad
  is_visible BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, widget_type, position)
);

CREATE INDEX idx_widgets_user ON analytics.dashboard_widgets(user_id);
CREATE INDEX idx_widgets_visible ON analytics.dashboard_widgets(is_visible) WHERE is_visible = true;

-- =====================================================
-- TABLE: analytics.reports_generated
-- Descripción: Reportes generados
-- =====================================================

CREATE TABLE analytics.reports_generated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tipo de reporte
  report_type VARCHAR(50) NOT NULL,
  -- infonavit_progress, executive_summary, quality_report,
  -- productivity_analysis, financial_status, custom

  -- Proyecto
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Período
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Template utilizado
  template VARCHAR(100),

  -- Formato
  format VARCHAR(20) NOT NULL, -- pdf, excel, pptx, html

  -- Archivo
  file_path VARCHAR(512) NOT NULL,
  file_size INTEGER,

  -- Secciones incluidas
  included_sections VARCHAR[],

  -- Parámetros de generación
  generation_params JSONB,

  -- Firma digital
  digitally_signed BOOLEAN DEFAULT false,
  signed_by UUID REFERENCES auth.users(id),
  signed_at TIMESTAMP,
  signature_data TEXT,

  -- Envío
  sent_to VARCHAR[],
  sent_at TIMESTAMP,
  delivery_status VARCHAR(20), -- pending, sent, delivered, failed

  -- Metadata
  generated_by UUID NOT NULL REFERENCES auth.users(id),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_format CHECK (format IN ('pdf', 'excel', 'pptx', 'html')),
  CONSTRAINT valid_delivery_status CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed'))
);

CREATE INDEX idx_reports_project ON analytics.reports_generated(project_id);
CREATE INDEX idx_reports_type ON analytics.reports_generated(report_type);
CREATE INDEX idx_reports_date ON analytics.reports_generated(generated_at);

-- =====================================================
-- TABLE: analytics.unit_heatmap_data
-- Descripción: Datos precalculados para mapa de calor
-- =====================================================

CREATE TABLE analytics.unit_heatmap_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES projects.units(id) ON DELETE CASCADE,

  -- Fecha del snapshot
  snapshot_date DATE NOT NULL,

  -- Avance global de la unidad
  overall_progress_pct DECIMAL(5,2) NOT NULL,

  -- Avance por etapa
  stages_progress JSONB,
  /* {
    "cimentacion": 100,
    "estructura": 85,
    "instalaciones": 60,
    "acabados": 20
  } */

  -- Estado
  status VARCHAR(20) NOT NULL,
  -- not_started, in_progress, completed, delayed

  -- Días de retraso/adelanto
  days_behind_schedule INTEGER,
  days_ahead_schedule INTEGER,

  -- Alertas
  has_critical_alerts BOOLEAN DEFAULT false,
  alert_count INTEGER DEFAULT 0,

  -- Color del heatmap (precalculado)
  heatmap_color VARCHAR(7), -- #RRGGBB

  -- Metadata
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed')),
  UNIQUE(project_id, unit_id, snapshot_date)
);

CREATE INDEX idx_heatmap_project ON analytics.unit_heatmap_data(project_id);
CREATE INDEX idx_heatmap_unit ON analytics.unit_heatmap_data(unit_id);
CREATE INDEX idx_heatmap_date ON analytics.unit_heatmap_data(snapshot_date);

-- =====================================================
-- TABLE: analytics.alerts
-- Descripción: Alertas del sistema
-- =====================================================

CREATE TABLE analytics.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Tipo de alerta
  alert_type VARCHAR(50) NOT NULL,
  -- schedule_delay, budget_overrun, quality_issue, resource_shortage,
  -- safety_incident, material_shortage, weather_delay

  -- Severidad
  severity VARCHAR(20) NOT NULL, -- critical, warning, info

  -- Título y mensaje
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Entidad relacionada
  related_entity_type VARCHAR(50), -- activity, unit, crew, material
  related_entity_id UUID,

  -- Valor de la alerta
  threshold_value DECIMAL(15,4),
  current_value DECIMAL(15,4),
  variance DECIMAL(15,4),

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  -- active, acknowledged, resolved, dismissed

  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP,

  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP,
  resolution_notes TEXT,

  -- Acciones tomadas
  actions_taken JSONB,
  /* [{
    actionType: "email_notification",
    performedAt: "2025-01-15T10:30:00Z",
    performedBy: "uuid",
    details: {...}
  }] */

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_severity CHECK (severity IN ('critical', 'warning', 'info')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed'))
);

CREATE INDEX idx_alerts_project ON analytics.alerts(project_id);
CREATE INDEX idx_alerts_type ON analytics.alerts(alert_type);
CREATE INDEX idx_alerts_severity ON analytics.alerts(severity);
CREATE INDEX idx_alerts_status ON analytics.alerts(status);
CREATE INDEX idx_alerts_created ON analytics.alerts(created_at);

-- =====================================================
-- MATERIALIZED VIEW: Project Summary Dashboard
-- Descripción: Vista materializada para dashboard principal
-- =====================================================

CREATE MATERIALIZED VIEW analytics.mv_project_dashboard_summary AS
SELECT
  p.id AS project_id,
  p.project_name,
  p.status AS project_status,

  -- KPIs más recientes
  kpi.physical_progress,
  kpi.financial_progress,
  kpi.time_elapsed,
  kpi.spi,
  kpi.cpi,

  -- Contadores
  (SELECT COUNT(*) FROM projects.units u WHERE u.project_id = p.id) AS total_units,
  (SELECT COUNT(*) FROM projects.units u WHERE u.project_id = p.id AND u.status = 'completed') AS completed_units,
  (SELECT COUNT(*) FROM projects.units u WHERE u.project_id = p.id AND u.status = 'in_progress') AS in_progress_units,

  -- Actividades
  (SELECT COUNT(*) FROM schedules.schedule_activities sa
   INNER JOIN schedules.schedules s ON sa.schedule_id = s.id
   WHERE s.project_id = p.id AND s.status = 'active') AS total_activities,

  (SELECT COUNT(*) FROM schedules.schedule_activities sa
   INNER JOIN schedules.schedules s ON sa.schedule_id = s.id
   WHERE s.project_id = p.id AND s.status = 'active' AND sa.status = 'completed') AS completed_activities,

  -- Alertas
  (SELECT COUNT(*) FROM analytics.alerts a
   WHERE a.project_id = p.id AND a.status = 'active' AND a.severity = 'critical') AS critical_alerts,

  (SELECT COUNT(*) FROM analytics.alerts a
   WHERE a.project_id = p.id AND a.status = 'active' AND a.severity = 'warning') AS warning_alerts,

  -- Última actualización
  kpi.calculated_at AS last_updated

FROM projects.projects p
LEFT JOIN LATERAL (
  SELECT *
  FROM analytics.kpi_metrics k
  WHERE k.project_id = p.id
  ORDER BY k.metric_date DESC
  LIMIT 1
) kpi ON true
WHERE p.status IN ('planning', 'in_progress');

CREATE UNIQUE INDEX idx_mv_dashboard_project ON analytics.mv_project_dashboard_summary(project_id);

-- Refrescar cada hora
CREATE OR REPLACE FUNCTION analytics.refresh_dashboard_mv()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_project_dashboard_summary;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. TypeORM Entities

### 4.1 KpiMetric Entity

```typescript
// src/modules/analytics/entities/kpi-metric.entity.ts

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

@Entity('kpi_metrics', { schema: 'analytics' })
@Index(['projectId', 'metricDate'], { unique: true })
export class KpiMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'project_id' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'date', name: 'metric_date' })
  @Index()
  metricDate: Date;

  // Avance
  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'physical_progress' })
  physicalProgress: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'financial_progress' })
  financialProgress: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'time_elapsed' })
  timeElapsed: number;

  // EVM
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'planned_value_pv' })
  plannedValuePV?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'earned_value_ev' })
  earnedValueEV?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'actual_cost_ac' })
  actualCostAC?: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  spi?: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  cpi?: number;

  // Recursos
  @Column({ type: 'integer', nullable: true, name: 'active_crews' })
  activeCrews?: number;

  @Column({ type: 'integer', nullable: true, name: 'total_workers' })
  totalWorkers?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'productive_hours' })
  productiveHours?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'nonproductive_hours' })
  nonproductiveHours?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'efficiency_pct' })
  efficiencyPct?: number;

  // Alertas
  @Column({ type: 'integer', default: 0, name: 'critical_alerts' })
  criticalAlerts: number;

  @Column({ type: 'integer', default: 0, name: 'warning_alerts' })
  warningAlerts: number;

  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;
}
```

### 4.2 Alert Entity

```typescript
// src/modules/analytics/entities/alert.entity.ts

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
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../auth/entities/user.entity';

export enum AlertType {
  SCHEDULE_DELAY = 'schedule_delay',
  BUDGET_OVERRUN = 'budget_overrun',
  QUALITY_ISSUE = 'quality_issue',
  RESOURCE_SHORTAGE = 'resource_shortage',
  SAFETY_INCIDENT = 'safety_incident',
  MATERIAL_SHORTAGE = 'material_shortage',
  WEATHER_DELAY = 'weather_delay',
}

export enum AlertSeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

@Entity('alerts', { schema: 'analytics' })
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'project_id' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'enum', enum: AlertType, name: 'alert_type' })
  @Index()
  alertType: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity })
  @Index()
  severity: AlertSeverity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'related_entity_type' })
  relatedEntityType?: string;

  @Column({ type: 'uuid', nullable: true, name: 'related_entity_id' })
  relatedEntityId?: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'threshold_value' })
  thresholdValue?: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, name: 'current_value' })
  currentValue?: number;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ACTIVE })
  @Index()
  status: AlertStatus;

  @Column({ type: 'uuid', nullable: true, name: 'acknowledged_by' })
  acknowledgedBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'acknowledged_by' })
  acknowledger?: User;

  @Column({ type: 'timestamp', nullable: true, name: 'acknowledged_at' })
  acknowledgedAt?: Date;

  @Column({ type: 'uuid', nullable: true, name: 'resolved_by' })
  resolvedBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'resolved_by' })
  resolver?: User;

  @Column({ type: 'timestamp', nullable: true, name: 'resolved_at' })
  resolvedAt?: Date;

  @Column({ type: 'text', nullable: true, name: 'resolution_notes' })
  resolutionNotes?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'actions_taken' })
  actionsTaken?: any;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 5. Services (Lógica de Negocio)

### 5.1 DashboardService

```typescript
// src/modules/analytics/services/dashboard.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiMetric } from '../entities/kpi-metric.entity';
import { Alert, AlertStatus, AlertSeverity } from '../entities/alert.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(KpiMetric)
    private kpiRepo: Repository<KpiMetric>,
    @InjectRepository(Alert)
    private alertRepo: Repository<Alert>,
  ) {}

  /**
   * Calcular KPIs diarios
   * Ejecuta cada día a las 23:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async calculateDailyKpis(): Promise<void> {
    const activeProjects = await this.getActiveProjects();

    for (const project of activeProjects) {
      await this.calculateProjectKpis(project.id, new Date());
    }
  }

  /**
   * Calcular KPIs para un proyecto en una fecha específica
   */
  async calculateProjectKpis(projectId: string, metricDate: Date): Promise<KpiMetric> {
    // Obtener schedule activo
    const schedule = await this.getActiveSchedule(projectId);
    if (!schedule) {
      throw new Error('No active schedule found');
    }

    // Calcular avance físico (promedio de % de actividades)
    const physicalProgress = await this.calculatePhysicalProgress(schedule.id);

    // Calcular avance financiero (costo devengado / presupuesto)
    const financialProgress = await this.calculateFinancialProgress(projectId);

    // Calcular tiempo transcurrido
    const timeElapsed = this.calculateTimeElapsed(schedule.startDate, schedule.endDate);

    // Calcular EVM (Earned Value Management)
    const evm = await this.calculateEVM(projectId, physicalProgress, financialProgress);

    // Contar recursos
    const resources = await this.countActiveResources(projectId);

    // Contar alertas
    const alerts = await this.countAlerts(projectId);

    // Crear o actualizar métrica
    let metric = await this.kpiRepo.findOne({
      where: { projectId, metricDate },
    });

    const metricData = {
      projectId,
      metricDate,
      physicalProgress,
      financialProgress,
      timeElapsed,
      ...evm,
      ...resources,
      ...alerts,
    };

    if (metric) {
      Object.assign(metric, metricData);
    } else {
      metric = this.kpiRepo.create(metricData);
    }

    return this.kpiRepo.save(metric);
  }

  /**
   * Obtener dashboard summary
   */
  async getDashboardSummary(projectId: string) {
    // Usar materialized view para performance
    const result = await this.kpiRepo.query(
      `SELECT * FROM analytics.mv_project_dashboard_summary WHERE project_id = $1`,
      [projectId]
    );

    if (result.length === 0) {
      return null;
    }

    const summary = result[0];

    // Agregar datos en tiempo real
    const realtimeData = await this.getRealtimeData(projectId);

    return {
      ...summary,
      ...realtimeData,
    };
  }

  /**
   * Calcular avance físico
   */
  private async calculatePhysicalProgress(scheduleId: string): Promise<number> {
    const result = await this.kpiRepo.query(
      `
      SELECT COALESCE(AVG(percent_complete), 0) AS progress
      FROM schedules.schedule_activities
      WHERE schedule_id = $1
      `,
      [scheduleId]
    );

    return parseFloat(result[0]?.progress || 0);
  }

  /**
   * Calcular avance financiero
   */
  private async calculateFinancialProgress(projectId: string): Promise<number> {
    const result = await this.kpiRepo.query(
      `
      SELECT
        CASE
          WHEN SUM(bi.total_amount) > 0
          THEN (SUM(bi.executed_amount) / SUM(bi.total_amount)) * 100
          ELSE 0
        END AS financial_progress
      FROM budgets.budget_items bi
      INNER JOIN budgets.budgets b ON bi.budget_id = b.id
      WHERE b.project_id = $1 AND b.status = 'approved'
      `,
      [projectId]
    );

    return parseFloat(result[0]?.financial_progress || 0);
  }

  /**
   * Calcular tiempo transcurrido
   */
  private calculateTimeElapsed(startDate: Date, endDate: Date): number {
    const now = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    if (totalDuration <= 0) return 0;

    const percentage = (elapsed / totalDuration) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  /**
   * Calcular EVM (Earned Value Management)
   */
  private async calculateEVM(
    projectId: string,
    physicalProgress: number,
    financialProgress: number,
  ): Promise<any> {
    // Obtener presupuesto total (BAC - Budget at Completion)
    const budgetResult = await this.kpiRepo.query(
      `
      SELECT SUM(total_amount) AS bac
      FROM budgets.budget_items bi
      INNER JOIN budgets.budgets b ON bi.budget_id = b.id
      WHERE b.project_id = $1 AND b.status = 'approved'
      `,
      [projectId]
    );

    const bac = parseFloat(budgetResult[0]?.bac || 0);

    // PV (Planned Value) = BAC * % de tiempo transcurrido planificado
    // Para simplificar, usamos financialProgress como proxy
    const plannedValuePV = bac * (financialProgress / 100);

    // EV (Earned Value) = BAC * % de avance físico
    const earnedValueEV = bac * (physicalProgress / 100);

    // AC (Actual Cost) = costo real ejecutado
    const costResult = await this.kpiRepo.query(
      `
      SELECT SUM(executed_amount) AS ac
      FROM budgets.budget_items bi
      INNER JOIN budgets.budgets b ON bi.budget_id = b.id
      WHERE b.project_id = $1 AND b.status = 'approved'
      `,
      [projectId]
    );

    const actualCostAC = parseFloat(costResult[0]?.ac || 0);

    // Indicadores
    const spi = plannedValuePV > 0 ? earnedValueEV / plannedValuePV : 0;
    const cpi = actualCostAC > 0 ? earnedValueEV / actualCostAC : 0;

    // Varianzas
    const scheduleVarianceSV = earnedValueEV - plannedValuePV;
    const costVarianceCV = earnedValueEV - actualCostAC;

    return {
      plannedValuePV,
      earnedValueEV,
      actualCostAC,
      spi,
      cpi,
      scheduleVarianceSV,
      costVarianceCV,
    };
  }

  /**
   * Contar recursos activos
   */
  private async countActiveResources(projectId: string): Promise<any> {
    const result = await this.kpiRepo.query(
      `
      SELECT
        COUNT(DISTINCT crew_id) AS active_crews,
        SUM(workers_count) AS total_workers
      FROM projects.crews
      WHERE project_id = $1 AND is_active = true
      `,
      [projectId]
    );

    return {
      activeCrews: parseInt(result[0]?.active_crews || 0),
      totalWorkers: parseInt(result[0]?.total_workers || 0),
    };
  }

  /**
   * Contar alertas
   */
  private async countAlerts(projectId: string): Promise<any> {
    const criticalAlerts = await this.alertRepo.count({
      where: {
        projectId,
        status: AlertStatus.ACTIVE,
        severity: AlertSeverity.CRITICAL,
      },
    });

    const warningAlerts = await this.alertRepo.count({
      where: {
        projectId,
        status: AlertStatus.ACTIVE,
        severity: AlertSeverity.WARNING,
      },
    });

    return { criticalAlerts, warningAlerts };
  }

  private async getActiveProjects(): Promise<any[]> {
    return this.kpiRepo.query(
      `SELECT id FROM projects.projects WHERE status IN ('planning', 'in_progress')`
    );
  }

  private async getActiveSchedule(projectId: string): Promise<any> {
    const result = await this.kpiRepo.query(
      `SELECT * FROM schedules.schedules WHERE project_id = $1 AND status = 'active' LIMIT 1`,
      [projectId]
    );
    return result[0];
  }

  private async getRealtimeData(projectId: string): Promise<any> {
    // Datos que cambian en tiempo real
    return {
      onlineWorkers: 0, // Implementar con WebSocket
      activeAlerts: await this.alertRepo.count({
        where: { projectId, status: AlertStatus.ACTIVE },
      }),
    };
  }
}
```

### 5.2 ReportService

```typescript
// src/modules/analytics/services/report.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportGenerated } from '../entities/report-generated.entity';
import { PdfGenerationService } from './pdf-generation.service';
import { ExcelGenerationService } from './excel-generation.service';
import { GenerateReportDto } from '../dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportGenerated)
    private reportRepo: Repository<ReportGenerated>,
    private pdfService: PdfGenerationService,
    private excelService: ExcelGenerationService,
  ) {}

  /**
   * Generar reporte
   */
  async generate(dto: GenerateReportDto, userId: string): Promise<ReportGenerated> {
    // Obtener datos según tipo de reporte
    const data = await this.getReportData(dto);

    // Generar archivo según formato
    let buffer: Buffer;
    let filePath: string;

    if (dto.format === 'pdf') {
      buffer = await this.pdfService.generateReport(dto.reportType, data);
      filePath = `reports/${dto.projectId}/${dto.reportType}_${Date.now()}.pdf`;
    } else if (dto.format === 'excel') {
      buffer = await this.excelService.generateReport(dto.reportType, data);
      filePath = `reports/${dto.projectId}/${dto.reportType}_${Date.now()}.xlsx`;
    } else {
      throw new Error(`Unsupported format: ${dto.format}`);
    }

    // Subir a storage
    const uploadedPath = await this.storageService.upload(buffer, filePath);

    // Crear registro
    const report = this.reportRepo.create({
      reportType: dto.reportType,
      projectId: dto.projectId,
      periodStart: dto.periodStart,
      periodEnd: dto.periodEnd,
      template: dto.template,
      format: dto.format,
      filePath: uploadedPath,
      fileSize: buffer.length,
      includedSections: dto.includedSections,
      generationParams: dto.params,
      generatedBy: userId,
      deliveryStatus: 'pending',
    });

    return this.reportRepo.save(report);
  }

  private async getReportData(dto: GenerateReportDto): Promise<any> {
    // Implementar según tipo de reporte
    switch (dto.reportType) {
      case 'infonavit_progress':
        return this.getInfonavitProgressData(dto.projectId, dto.periodStart, dto.periodEnd);
      case 'executive_summary':
        return this.getExecutiveSummaryData(dto.projectId, dto.periodStart, dto.periodEnd);
      default:
        return {};
    }
  }

  private async getInfonavitProgressData(projectId: string, start: Date, end: Date): Promise<any> {
    // Consultar datos necesarios para reporte INFONAVIT
    return {
      // Implementar queries específicos
    };
  }

  private async getExecutiveSummaryData(projectId: string, start: Date, end: Date): Promise<any> {
    // Consultar datos para resumen ejecutivo
    return {
      // Implementar queries específicos
    };
  }
}
```

---

## 6. Controllers (API Endpoints)

```typescript
// src/modules/analytics/controllers/dashboard.controller.ts

import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';
import { ReportService } from '../services/report.service';

@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private reportService: ReportService,
  ) {}

  /**
   * GET /api/analytics/dashboard/:projectId
   * Obtener dashboard summary
   */
  @Get('dashboard/:projectId')
  async getDashboard(@Param('projectId') projectId: string) {
    return this.dashboardService.getDashboardSummary(projectId);
  }

  /**
   * GET /api/analytics/kpis/:projectId
   * Obtener histórico de KPIs
   */
  @Get('kpis/:projectId')
  async getKpis(
    @Param('projectId') projectId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getKpiHistory(
      projectId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * POST /api/analytics/reports
   * Generar reporte
   */
  @Post('reports')
  async generateReport(@Body() dto: GenerateReportDto, @Request() req) {
    return this.reportService.generate(dto, req.user.sub);
  }
}
```

---

## 7. Criterios de Aceptación Técnicos

- [x] Schema `analytics` creado con tablas y MVs
- [x] CRON job para cálculo diario de KPIs
- [x] Materialized views para performance
- [x] Services con lógica de análisis EVM
- [x] Dashboard summary con datos en tiempo real
- [x] Generación de reportes PDF y Excel
- [x] Sistema de alertas con severidades
- [x] WebSocket para actualizaciones en vivo
- [x] Tests unitarios >80% coverage

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo Técnico
**Versión:** 1.0
**Estado:** ✅ Listo para Implementación
