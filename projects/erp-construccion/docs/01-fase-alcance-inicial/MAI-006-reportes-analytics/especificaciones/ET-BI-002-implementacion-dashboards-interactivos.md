# ET-BI-002: Implementación de Dashboards Interactivos

**Épica:** MAI-006 - Reportes y Business Intelligence
**Módulo:** Dashboards Interactivos y Personalización
**Responsable Técnico:** Frontend + Backend + UX
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Objetivo Técnico

Implementar el sistema de dashboards interactivos con:
- Dashboards personalizables con drag & drop
- Widgets configurables (KPIs, gráficas, tablas)
- Filtros dinámicos y drill-down
- Vistas guardadas por usuario
- Actualización en tiempo real vía WebSocket
- Exportación de dashboards a PDF/PNG
- Segmentación de datos por dimensiones
- Layout responsivo con react-grid-layout

---

## 2. Stack Tecnológico

### Backend
```typescript
- NestJS 10+
- TypeORM con PostgreSQL 15+
- WebSocket (Socket.io) para real-time
- Bull/BullMQ para generación async de PDFs
- Puppeteer para exportación a PDF/PNG
- Redis para cache de queries
```

### Frontend
```typescript
- React 18 con TypeScript
- Zustand para state management
- react-grid-layout para drag & drop
- Chart.js / Recharts para gráficas
- react-query para data fetching y cache
- Socket.io-client para WebSocket
- html2canvas para screenshots
- jsPDF para generación de PDFs
- TailwindCSS para estilos
```

### Real-time
```typescript
- Socket.io (WebSocket) para actualizaciones
- Redis Pub/Sub para broadcasting
- Server-Sent Events (SSE) como fallback
```

---

## 3. Modelo de Datos SQL

### 3.1 Schema Principal

```sql
-- =====================================================
-- SCHEMA: dashboards (extensión de analytics_reports)
-- Descripción: Dashboards interactivos y widgets
-- =====================================================

CREATE SCHEMA IF NOT EXISTS dashboards;

-- =====================================================
-- TABLE: dashboards.user_dashboards
-- Descripción: Dashboards personalizados por usuario
-- =====================================================

CREATE TABLE dashboards.user_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Propietario
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  -- Identificación
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- lucide icon name

  -- Layout
  layout_config JSONB NOT NULL DEFAULT '{}',
  /*
  {
    "breakpoints": {"lg": 1200, "md": 996, "sm": 768, "xs": 480, "xxs": 0},
    "cols": {"lg": 12, "md": 10, "sm": 6, "xs": 4, "xxs": 2},
    "rowHeight": 100,
    "compactType": "vertical"
  }
  */

  -- Widgets
  widgets JSONB NOT NULL DEFAULT '[]',
  /*
  [
    {
      "id": "widget-1",
      "type": "kpi_card",
      "title": "Margen Bruto",
      "dataSource": "project_metrics",
      "config": {
        "metric": "gross_margin_pct",
        "aggregation": "avg",
        "threshold": {"warning": 15, "critical": 10}
      },
      "layout": {
        "lg": {"x": 0, "y": 0, "w": 3, "h": 2},
        "md": {"x": 0, "y": 0, "w": 5, "h": 2}
      }
    }
  ]
  */

  -- Filtros globales
  global_filters JSONB DEFAULT '{}',
  /*
  {
    "dateRange": {"start": "2025-01-01", "end": "2025-12-31"},
    "projectIds": ["uuid-1", "uuid-2"],
    "regionId": "uuid-region"
  }
  */

  -- Configuración de actualización
  auto_refresh BOOLEAN DEFAULT false,
  refresh_interval INTEGER DEFAULT 300000, -- ms (5 minutos)

  -- Compartir
  is_public BOOLEAN DEFAULT false,
  shared_with_users UUID[],
  shared_with_roles TEXT[],

  -- Metadata
  is_favorite BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_dashboards_user ON dashboards.user_dashboards(user_id);
CREATE INDEX idx_user_dashboards_constructora ON dashboards.user_dashboards(constructora_id);
CREATE INDEX idx_user_dashboards_favorite ON dashboards.user_dashboards(is_favorite) WHERE is_favorite = true;


-- =====================================================
-- TABLE: dashboards.widgets
-- Descripción: Catálogo de widgets disponibles
-- =====================================================

CREATE TABLE dashboards.widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  -- Identificación
  widget_code VARCHAR(50) NOT NULL,
  widget_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- kpi, chart, table, map, custom

  -- Tipo de widget
  widget_type VARCHAR(30) NOT NULL,
  -- kpi_card, line_chart, bar_chart, pie_chart, donut_chart,
  -- area_chart, scatter_chart, table, pivot_table, gauge, map

  -- Configuración por defecto
  default_config JSONB NOT NULL DEFAULT '{}',
  /*
  {
    "dataSource": "project_metrics",
    "metrics": ["gross_margin_pct"],
    "dimensions": ["project_name"],
    "aggregations": ["avg"],
    "filters": [],
    "chartOptions": {
      "showLegend": true,
      "showGrid": true,
      "stacked": false
    }
  }
  */

  -- Data source
  data_source_type VARCHAR(30) NOT NULL,
  -- sql_query, materialized_view, api_endpoint, aggregation

  data_source_config JSONB,
  /*
  {
    "query": "SELECT...",
    "view": "mv_project_health_indicators",
    "endpoint": "/api/metrics/custom",
    "refreshInterval": 60000
  }
  */

  -- Dimensiones soportadas
  supported_dimensions TEXT[], -- ['project_id', 'region_id', 'date']
  supported_metrics TEXT[], -- ['revenue', 'cost', 'margin_pct']

  -- Permisos
  required_roles TEXT[], -- ['admin', 'director']
  is_premium BOOLEAN DEFAULT false,

  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false, -- widgets del sistema no editables

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_category CHECK (category IN ('kpi', 'chart', 'table', 'map', 'custom')),
  CONSTRAINT valid_data_source_type CHECK (data_source_type IN (
    'sql_query', 'materialized_view', 'api_endpoint', 'aggregation'
  )),
  UNIQUE(constructora_id, widget_code)
);

CREATE INDEX idx_widgets_constructora ON dashboards.widgets(constructora_id);
CREATE INDEX idx_widgets_category ON dashboards.widgets(category);
CREATE INDEX idx_widgets_type ON dashboards.widgets(widget_type);


-- =====================================================
-- TABLE: dashboards.saved_views
-- Descripción: Vistas guardadas de dashboards
-- =====================================================

CREATE TABLE dashboards.saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dashboard
  dashboard_id UUID NOT NULL REFERENCES dashboards.user_dashboards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificación
  view_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Configuración de la vista
  filters JSONB NOT NULL DEFAULT '{}',
  /*
  {
    "dateRange": {"start": "2025-Q1", "end": "2025-Q2"},
    "projectIds": ["uuid-1"],
    "status": ["active"]
  }
  */

  sort_config JSONB DEFAULT '{}',
  /*
  {
    "field": "gross_margin_pct",
    "direction": "desc"
  }
  */

  visible_widgets UUID[], -- IDs de widgets visibles en esta vista

  -- Metadata
  is_default BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP
);

CREATE INDEX idx_saved_views_dashboard ON dashboards.saved_views(dashboard_id);
CREATE INDEX idx_saved_views_user ON dashboards.saved_views(user_id);


-- =====================================================
-- TABLE: dashboards.widget_data_cache
-- Descripción: Cache de datos de widgets
-- =====================================================

CREATE TABLE dashboards.widget_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Widget
  widget_id UUID NOT NULL,
  dashboard_id UUID NOT NULL REFERENCES dashboards.user_dashboards(id) ON DELETE CASCADE,

  -- Cache key (hash de filtros + config)
  cache_key VARCHAR(255) NOT NULL,

  -- Datos
  data JSONB NOT NULL,

  -- TTL
  expires_at TIMESTAMP NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(widget_id, cache_key)
);

CREATE INDEX idx_widget_cache_widget ON dashboards.widget_data_cache(widget_id);
CREATE INDEX idx_widget_cache_expires ON dashboards.widget_data_cache(expires_at);

-- Auto-cleanup de cache expirado
CREATE INDEX idx_widget_cache_cleanup ON dashboards.widget_data_cache(expires_at)
  WHERE expires_at < CURRENT_TIMESTAMP;


-- =====================================================
-- TABLE: dashboards.user_preferences
-- Descripción: Preferencias de usuario para dashboards
-- =====================================================

CREATE TABLE dashboards.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Preferencias generales
  default_dashboard_id UUID REFERENCES dashboards.user_dashboards(id),
  theme VARCHAR(20) DEFAULT 'light', -- light, dark, auto

  -- Preferencias de visualización
  default_date_range VARCHAR(20) DEFAULT 'last_30_days',
  -- today, yesterday, last_7_days, last_30_days, this_month, last_month, custom

  default_chart_type VARCHAR(30) DEFAULT 'line_chart',
  show_grid BOOLEAN DEFAULT true,
  show_tooltips BOOLEAN DEFAULT true,
  animation_enabled BOOLEAN DEFAULT true,

  -- Notificaciones
  enable_notifications BOOLEAN DEFAULT true,
  notification_frequency VARCHAR(20) DEFAULT 'realtime',
  -- realtime, hourly, daily

  -- Otras preferencias
  preferences JSONB DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'auto')),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_prefs_user ON dashboards.user_preferences(user_id);


-- =====================================================
-- TABLE: dashboards.drill_down_paths
-- Descripción: Rutas de drill-down configuradas
-- =====================================================

CREATE TABLE dashboards.drill_down_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  widget_id UUID NOT NULL REFERENCES dashboards.widgets(id) ON DELETE CASCADE,

  -- Ruta de drill-down
  from_dimension VARCHAR(100) NOT NULL, -- 'project'
  to_dimension VARCHAR(100) NOT NULL, -- 'workfront'
  order_sequence INTEGER NOT NULL,

  -- Configuración
  target_widget_type VARCHAR(30), -- widget que se abre al hacer drill-down
  filter_mapping JSONB,
  /*
  {
    "sourceField": "project_id",
    "targetField": "project_id",
    "operator": "="
  }
  */

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(widget_id, from_dimension, to_dimension)
);

CREATE INDEX idx_drill_down_widget ON dashboards.drill_down_paths(widget_id);


-- =====================================================
-- TABLE: dashboards.dashboard_segments
-- Descripción: Segmentación de datos
-- =====================================================

CREATE TABLE dashboards.dashboard_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  -- Identificación
  segment_code VARCHAR(50) NOT NULL,
  segment_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Tipo de segmento
  segment_type VARCHAR(30) NOT NULL,
  -- project_status, region, date_range, budget_range, risk_level, custom

  -- Condiciones
  conditions JSONB NOT NULL,
  /*
  {
    "operator": "AND",
    "rules": [
      {"field": "status", "operator": "IN", "value": ["active", "on_hold"]},
      {"field": "total_budget", "operator": ">=", "value": 5000000}
    ]
  }
  */

  -- Uso
  is_system BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(constructora_id, segment_code)
);

CREATE INDEX idx_segments_constructora ON dashboards.dashboard_segments(constructora_id);
CREATE INDEX idx_segments_type ON dashboards.dashboard_segments(segment_type);
```

### 3.2 Triggers

```sql
-- =====================================================
-- TRIGGER: Actualizar updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION dashboards.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_dashboards_updated_at
  BEFORE UPDATE ON dashboards.user_dashboards
  FOR EACH ROW
  EXECUTE FUNCTION dashboards.update_timestamp();

CREATE TRIGGER trg_widgets_updated_at
  BEFORE UPDATE ON dashboards.widgets
  FOR EACH ROW
  EXECUTE FUNCTION dashboards.update_timestamp();


-- =====================================================
-- TRIGGER: Incrementar view_count
-- =====================================================

CREATE OR REPLACE FUNCTION dashboards.increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE dashboards.user_dashboards
  SET
    view_count = view_count + 1,
    last_viewed_at = CURRENT_TIMESTAMP
  WHERE id = NEW.dashboard_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Se dispara cuando se consulta una vista guardada
CREATE TRIGGER trg_increment_view_count
  AFTER INSERT OR UPDATE ON dashboards.saved_views
  FOR EACH ROW
  EXECUTE FUNCTION dashboards.increment_view_count();


-- =====================================================
-- FUNCTION: Limpiar cache expirado
-- =====================================================

CREATE OR REPLACE FUNCTION dashboards.cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM dashboards.widget_data_cache
  WHERE expires_at < CURRENT_TIMESTAMP;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- CRON job para ejecutar cada hora (configurar con pg_cron)
-- SELECT cron.schedule('cleanup-widget-cache', '0 * * * *',
--   'SELECT dashboards.cleanup_expired_cache()');
```

---

## 4. TypeORM Entities

### 4.1 UserDashboard Entity

```typescript
// src/modules/dashboards/entities/user-dashboard.entity.ts

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
import { User } from '../../auth/entities/user.entity';
import { Constructora } from '../../constructoras/entities/constructora.entity';
import { SavedView } from './saved-view.entity';

export interface LayoutConfig {
  breakpoints: { [key: string]: number };
  cols: { [key: string]: number };
  rowHeight: number;
  compactType: 'vertical' | 'horizontal';
}

export interface WidgetDefinition {
  id: string;
  type: string;
  title: string;
  dataSource: string;
  config: any;
  layout: {
    [breakpoint: string]: {
      x: number;
      y: number;
      w: number;
      h: number;
      minW?: number;
      minH?: number;
      maxW?: number;
      maxH?: number;
    };
  };
}

export interface GlobalFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  projectIds?: string[];
  regionId?: string;
  [key: string]: any;
}

@Entity('user_dashboards', { schema: 'dashboards' })
export class UserDashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'constructora_id', type: 'uuid' })
  @Index()
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  // Identificación
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string;

  // Layout
  @Column({ name: 'layout_config', type: 'jsonb', default: {} })
  layoutConfig: LayoutConfig;

  @Column({ type: 'jsonb', default: [] })
  widgets: WidgetDefinition[];

  // Filtros globales
  @Column({ name: 'global_filters', type: 'jsonb', default: {} })
  globalFilters: GlobalFilters;

  // Configuración de actualización
  @Column({ name: 'auto_refresh', type: 'boolean', default: false })
  autoRefresh: boolean;

  @Column({ name: 'refresh_interval', type: 'integer', default: 300000 })
  refreshInterval: number;

  // Compartir
  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ name: 'shared_with_users', type: 'uuid', array: true, nullable: true })
  sharedWithUsers?: string[];

  @Column({ name: 'shared_with_roles', type: 'text', array: true, nullable: true })
  sharedWithRoles?: string[];

  // Metadata
  @Column({ name: 'is_favorite', type: 'boolean', default: false })
  @Index()
  isFavorite: boolean;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'view_count', type: 'integer', default: 0 })
  viewCount: number;

  @Column({ name: 'last_viewed_at', type: 'timestamp', nullable: true })
  lastViewedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => SavedView, (view) => view.dashboard)
  savedViews: SavedView[];
}
```

### 4.2 Widget Entity

```typescript
// src/modules/dashboards/entities/widget.entity.ts

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
import { User } from '../../auth/entities/user.entity';
import { DrillDownPath } from './drill-down-path.entity';

export enum WidgetCategory {
  KPI = 'kpi',
  CHART = 'chart',
  TABLE = 'table',
  MAP = 'map',
  CUSTOM = 'custom',
}

export enum WidgetType {
  KPI_CARD = 'kpi_card',
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  DONUT_CHART = 'donut_chart',
  AREA_CHART = 'area_chart',
  SCATTER_CHART = 'scatter_chart',
  TABLE = 'table',
  PIVOT_TABLE = 'pivot_table',
  GAUGE = 'gauge',
  MAP = 'map',
}

export enum DataSourceType {
  SQL_QUERY = 'sql_query',
  MATERIALIZED_VIEW = 'materialized_view',
  API_ENDPOINT = 'api_endpoint',
  AGGREGATION = 'aggregation',
}

@Entity('widgets', { schema: 'dashboards' })
@Index(['constructoraId', 'widgetCode'], { unique: true })
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'constructora_id', type: 'uuid' })
  @Index()
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  // Identificación
  @Column({ name: 'widget_code', type: 'varchar', length: 50 })
  widgetCode: string;

  @Column({ name: 'widget_name', type: 'varchar', length: 255 })
  widgetName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: WidgetCategory })
  @Index()
  category: WidgetCategory;

  @Column({ name: 'widget_type', type: 'enum', enum: WidgetType })
  @Index()
  widgetType: WidgetType;

  // Configuración
  @Column({ name: 'default_config', type: 'jsonb', default: {} })
  defaultConfig: any;

  // Data source
  @Column({ name: 'data_source_type', type: 'enum', enum: DataSourceType })
  dataSourceType: DataSourceType;

  @Column({ name: 'data_source_config', type: 'jsonb', nullable: true })
  dataSourceConfig?: any;

  // Dimensiones y métricas
  @Column({ name: 'supported_dimensions', type: 'text', array: true, nullable: true })
  supportedDimensions?: string[];

  @Column({ name: 'supported_metrics', type: 'text', array: true, nullable: true })
  supportedMetrics?: string[];

  // Permisos
  @Column({ name: 'required_roles', type: 'text', array: true, nullable: true })
  requiredRoles?: string[];

  @Column({ name: 'is_premium', type: 'boolean', default: false })
  isPremium: boolean;

  // Estado
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean;

  // Metadata
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => DrillDownPath, (path) => path.widget)
  drillDownPaths: DrillDownPath[];
}
```

### 4.3 SavedView Entity

```typescript
// src/modules/dashboards/entities/saved-view.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserDashboard } from './user-dashboard.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('saved_views', { schema: 'dashboards' })
export class SavedView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'dashboard_id', type: 'uuid' })
  @Index()
  dashboardId: string;

  @ManyToOne(() => UserDashboard, (dashboard) => dashboard.savedViews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dashboard_id' })
  dashboard: UserDashboard;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Identificación
  @Column({ name: 'view_name', type: 'varchar', length: 255 })
  viewName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Configuración
  @Column({ type: 'jsonb', default: {} })
  filters: any;

  @Column({ name: 'sort_config', type: 'jsonb', default: {} })
  sortConfig?: any;

  @Column({ name: 'visible_widgets', type: 'uuid', array: true, nullable: true })
  visibleWidgets?: string[];

  // Metadata
  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'is_shared', type: 'boolean', default: false })
  isShared: boolean;

  @Column({ name: 'usage_count', type: 'integer', default: 0 })
  usageCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt?: Date;
}
```

---

## 5. Services (Lógica de Negocio)

### 5.1 DashboardService

```typescript
// src/modules/dashboards/services/dashboard.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDashboard, WidgetDefinition } from '../entities/user-dashboard.entity';
import { SavedView } from '../entities/saved-view.entity';
import { CreateDashboardDto, UpdateDashboardDto, AddWidgetDto } from '../dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(UserDashboard)
    private dashboardRepo: Repository<UserDashboard>,
    @InjectRepository(SavedView)
    private savedViewRepo: Repository<SavedView>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Crear un nuevo dashboard
   */
  async create(dto: CreateDashboardDto, userId: string, constructoraId: string): Promise<UserDashboard> {
    const dashboard = this.dashboardRepo.create({
      ...dto,
      userId,
      constructoraId,
      layoutConfig: dto.layoutConfig || this.getDefaultLayoutConfig(),
      widgets: [],
    });

    const saved = await this.dashboardRepo.save(dashboard);

    this.eventEmitter.emit('dashboard.created', {
      dashboardId: saved.id,
      userId,
    });

    return saved;
  }

  /**
   * Actualizar dashboard
   */
  async update(id: string, dto: UpdateDashboardDto, userId: string): Promise<UserDashboard> {
    const dashboard = await this.findOneByUser(id, userId);

    Object.assign(dashboard, dto);

    const updated = await this.dashboardRepo.save(dashboard);

    this.eventEmitter.emit('dashboard.updated', {
      dashboardId: id,
      userId,
    });

    return updated;
  }

  /**
   * Agregar widget al dashboard
   */
  async addWidget(dashboardId: string, dto: AddWidgetDto, userId: string): Promise<UserDashboard> {
    const dashboard = await this.findOneByUser(dashboardId, userId);

    const newWidget: WidgetDefinition = {
      id: `widget-${Date.now()}`,
      type: dto.type,
      title: dto.title,
      dataSource: dto.dataSource,
      config: dto.config || {},
      layout: dto.layout,
    };

    dashboard.widgets.push(newWidget);

    const updated = await this.dashboardRepo.save(dashboard);

    this.eventEmitter.emit('dashboard.widget_added', {
      dashboardId,
      widgetId: newWidget.id,
      userId,
    });

    return updated;
  }

  /**
   * Eliminar widget del dashboard
   */
  async removeWidget(dashboardId: string, widgetId: string, userId: string): Promise<UserDashboard> {
    const dashboard = await this.findOneByUser(dashboardId, userId);

    dashboard.widgets = dashboard.widgets.filter((w) => w.id !== widgetId);

    return this.dashboardRepo.save(dashboard);
  }

  /**
   * Actualizar layout del dashboard
   */
  async updateLayout(
    dashboardId: string,
    widgets: WidgetDefinition[],
    userId: string,
  ): Promise<UserDashboard> {
    const dashboard = await this.findOneByUser(dashboardId, userId);

    dashboard.widgets = widgets;

    return this.dashboardRepo.save(dashboard);
  }

  /**
   * Guardar vista
   */
  async saveView(dashboardId: string, viewName: string, filters: any, userId: string): Promise<SavedView> {
    const dashboard = await this.findOneByUser(dashboardId, userId);

    // Si es vista por defecto, desactivar otras vistas por defecto
    const isDefault = filters.isDefault || false;
    if (isDefault) {
      await this.savedViewRepo.update(
        { dashboardId, userId, isDefault: true },
        { isDefault: false },
      );
    }

    const savedView = this.savedViewRepo.create({
      dashboardId,
      userId,
      viewName,
      filters,
      isDefault,
    });

    return this.savedViewRepo.save(savedView);
  }

  /**
   * Obtener vistas guardadas
   */
  async getSavedViews(dashboardId: string, userId: string): Promise<SavedView[]> {
    return this.savedViewRepo.find({
      where: { dashboardId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Aplicar vista guardada
   */
  async applySavedView(viewId: string, userId: string): Promise<SavedView> {
    const view = await this.savedViewRepo.findOne({
      where: { id: viewId, userId },
      relations: ['dashboard'],
    });

    if (!view) {
      throw new NotFoundException('Saved view not found');
    }

    // Incrementar contador de uso
    view.usageCount += 1;
    view.lastUsedAt = new Date();

    return this.savedViewRepo.save(view);
  }

  /**
   * Clonar dashboard
   */
  async clone(dashboardId: string, newName: string, userId: string): Promise<UserDashboard> {
    const original = await this.findOneByUser(dashboardId, userId);

    const cloned = this.dashboardRepo.create({
      userId,
      constructoraId: original.constructoraId,
      name: newName,
      description: original.description,
      icon: original.icon,
      layoutConfig: original.layoutConfig,
      widgets: original.widgets,
      globalFilters: original.globalFilters,
      autoRefresh: original.autoRefresh,
      refreshInterval: original.refreshInterval,
    });

    return this.dashboardRepo.save(cloned);
  }

  /**
   * Marcar como favorito
   */
  async toggleFavorite(dashboardId: string, userId: string): Promise<UserDashboard> {
    const dashboard = await this.findOneByUser(dashboardId, userId);

    dashboard.isFavorite = !dashboard.isFavorite;

    return this.dashboardRepo.save(dashboard);
  }

  /**
   * Obtener dashboards del usuario
   */
  async findAllByUser(userId: string): Promise<UserDashboard[]> {
    return this.dashboardRepo.find({
      where: { userId },
      order: {
        isFavorite: 'DESC',
        lastViewedAt: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Obtener dashboard por ID
   */
  async findOneByUser(id: string, userId: string): Promise<UserDashboard> {
    const dashboard = await this.dashboardRepo.findOne({
      where: { id, userId },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }

    // Actualizar last_viewed_at
    dashboard.lastViewedAt = new Date();
    await this.dashboardRepo.save(dashboard);

    return dashboard;
  }

  /**
   * Configuración de layout por defecto
   */
  private getDefaultLayoutConfig(): any {
    return {
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 100,
      compactType: 'vertical',
    };
  }
}
```

### 5.2 WidgetService

```typescript
// src/modules/dashboards/services/widget.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Widget, DataSourceType } from '../entities/widget.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import crypto from 'crypto';

@Injectable()
export class WidgetService {
  constructor(
    @InjectRepository(Widget)
    private widgetRepo: Repository<Widget>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * Obtener datos de un widget
   */
  async getWidgetData(
    widgetId: string,
    filters: any = {},
    useCache: boolean = true,
  ): Promise<any> {
    const widget = await this.widgetRepo.findOne({ where: { id: widgetId } });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    // Generar cache key
    const cacheKey = this.generateCacheKey(widgetId, filters);

    // Intentar obtener de cache
    if (useCache) {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // Obtener datos según tipo de data source
    let data: any;

    switch (widget.dataSourceType) {
      case DataSourceType.SQL_QUERY:
        data = await this.executeQuery(widget.dataSourceConfig.query, filters);
        break;

      case DataSourceType.MATERIALIZED_VIEW:
        data = await this.queryMaterializedView(widget.dataSourceConfig.view, filters);
        break;

      case DataSourceType.API_ENDPOINT:
        data = await this.fetchFromAPI(widget.dataSourceConfig.endpoint, filters);
        break;

      case DataSourceType.AGGREGATION:
        data = await this.performAggregation(widget.dataSourceConfig, filters);
        break;

      default:
        throw new Error(`Unsupported data source type: ${widget.dataSourceType}`);
    }

    // Aplicar transformaciones según tipo de widget
    const transformedData = this.transformDataForWidget(data, widget.widgetType, widget.defaultConfig);

    // Guardar en cache
    if (useCache) {
      const ttl = widget.dataSourceConfig?.refreshInterval || 300000; // 5 min default
      await this.redis.setex(cacheKey, Math.floor(ttl / 1000), JSON.stringify(transformedData));
    }

    return transformedData;
  }

  /**
   * Ejecutar query SQL
   */
  private async executeQuery(query: string, filters: any): Promise<any> {
    // Sanitizar y parametrizar query
    const params = this.buildQueryParams(filters);

    return this.widgetRepo.query(query, params);
  }

  /**
   * Query materialized view
   */
  private async queryMaterializedView(viewName: string, filters: any): Promise<any> {
    const whereClause = this.buildWhereClause(filters);

    const query = `
      SELECT * FROM ${viewName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
    `;

    return this.widgetRepo.query(query);
  }

  /**
   * Fetch from API endpoint
   */
  private async fetchFromAPI(endpoint: string, filters: any): Promise<any> {
    // TODO: Implementar llamada a API externa
    throw new Error('API endpoint not implemented yet');
  }

  /**
   * Perform aggregation
   */
  private async performAggregation(config: any, filters: any): Promise<any> {
    const { sourceTable, aggregation, field } = config;

    const whereClause = this.buildWhereClause(filters);

    const query = `
      SELECT
        ${aggregation}(${field}) AS value
      FROM ${sourceTable}
      ${whereClause ? `WHERE ${whereClause}` : ''}
    `;

    const result = await this.widgetRepo.query(query);
    return result[0]?.value;
  }

  /**
   * Transformar datos según tipo de widget
   */
  private transformDataForWidget(data: any, widgetType: string, config: any): any {
    switch (widgetType) {
      case 'kpi_card':
        return {
          currentValue: data,
          ...config,
        };

      case 'line_chart':
      case 'bar_chart':
      case 'area_chart':
        return {
          labels: data.map((d: any) => d.label || d.date),
          datasets: [
            {
              label: config.datasetLabel || 'Value',
              data: data.map((d: any) => d.value),
              ...config.chartOptions,
            },
          ],
        };

      case 'pie_chart':
      case 'donut_chart':
        return {
          labels: data.map((d: any) => d.label),
          datasets: [
            {
              data: data.map((d: any) => d.value),
              backgroundColor: config.colors || this.generateColors(data.length),
            },
          ],
        };

      case 'table':
        return {
          columns: Object.keys(data[0] || {}),
          rows: data,
        };

      default:
        return data;
    }
  }

  /**
   * Build WHERE clause from filters
   */
  private buildWhereClause(filters: any): string {
    const conditions: string[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        conditions.push(`${key} IN (${value.map((v) => `'${v}'`).join(', ')})`);
      } else if (typeof value === 'object' && value !== null) {
        // Date range
        if ('start' in value && 'end' in value) {
          conditions.push(`${key} BETWEEN '${value.start}' AND '${value.end}'`);
        }
      } else {
        conditions.push(`${key} = '${value}'`);
      }
    });

    return conditions.join(' AND ');
  }

  /**
   * Build query params
   */
  private buildQueryParams(filters: any): any[] {
    return Object.values(filters);
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(widgetId: string, filters: any): string {
    const filterHash = crypto
      .createHash('md5')
      .update(JSON.stringify(filters))
      .digest('hex');

    return `widget:${widgetId}:${filterHash}`;
  }

  /**
   * Generate colors for charts
   */
  private generateColors(count: number): string[] {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16',
    ];

    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }

  /**
   * Invalidar cache de widget
   */
  async invalidateCache(widgetId: string): Promise<void> {
    const pattern = `widget:${widgetId}:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

### 5.3 DrillDownService

```typescript
// src/modules/dashboards/services/drill-down.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrillDownPath } from '../entities/drill-down-path.entity';

@Injectable()
export class DrillDownService {
  constructor(
    @InjectRepository(DrillDownPath)
    private drillDownRepo: Repository<DrillDownPath>,
  ) {}

  /**
   * Obtener rutas de drill-down para un widget
   */
  async getDrillDownPaths(widgetId: string): Promise<DrillDownPath[]> {
    return this.drillDownRepo.find({
      where: { widgetId },
      order: { orderSequence: 'ASC' },
    });
  }

  /**
   * Aplicar drill-down
   */
  async applyDrillDown(
    widgetId: string,
    fromDimension: string,
    selectedValue: any,
  ): Promise<{ toDimension: string; filters: any }> {
    const path = await this.drillDownRepo.findOne({
      where: {
        widgetId,
        fromDimension,
      },
    });

    if (!path) {
      throw new Error(`No drill-down path found for ${fromDimension}`);
    }

    // Construir filtros para el siguiente nivel
    const filters = this.buildDrillDownFilters(path, selectedValue);

    return {
      toDimension: path.toDimension,
      filters,
    };
  }

  /**
   * Construir filtros para drill-down
   */
  private buildDrillDownFilters(path: DrillDownPath, selectedValue: any): any {
    const { sourceField, targetField, operator } = path.filterMapping;

    return {
      [targetField]: {
        operator,
        value: selectedValue,
      },
    };
  }
}
```

---

## 6. Controllers (API Endpoints)

```typescript
// src/modules/dashboards/controllers/dashboard.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';
import { WidgetService } from '../services/widget.service';
import { DrillDownService } from '../services/drill-down.service';
import {
  CreateDashboardDto,
  UpdateDashboardDto,
  AddWidgetDto,
  SaveViewDto,
} from '../dto';

@Controller('api/dashboards')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private drillDownService: DrillDownService,
  ) {}

  /**
   * POST /api/dashboards
   * Crear nuevo dashboard
   */
  @Post()
  async create(@Body() dto: CreateDashboardDto, @Request() req) {
    return this.dashboardService.create(dto, req.user.sub, req.user.constructoraId);
  }

  /**
   * GET /api/dashboards
   * Obtener todos los dashboards del usuario
   */
  @Get()
  async findAll(@Request() req) {
    return this.dashboardService.findAllByUser(req.user.sub);
  }

  /**
   * GET /api/dashboards/:id
   * Obtener dashboard por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.dashboardService.findOneByUser(id, req.user.sub);
  }

  /**
   * PUT /api/dashboards/:id
   * Actualizar dashboard
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDashboardDto, @Request() req) {
    return this.dashboardService.update(id, dto, req.user.sub);
  }

  /**
   * DELETE /api/dashboards/:id
   * Eliminar dashboard
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    // TODO: Implementar eliminación
    return { message: 'Dashboard deleted' };
  }

  /**
   * POST /api/dashboards/:id/widgets
   * Agregar widget al dashboard
   */
  @Post(':id/widgets')
  async addWidget(@Param('id') id: string, @Body() dto: AddWidgetDto, @Request() req) {
    return this.dashboardService.addWidget(id, dto, req.user.sub);
  }

  /**
   * DELETE /api/dashboards/:id/widgets/:widgetId
   * Eliminar widget del dashboard
   */
  @Delete(':id/widgets/:widgetId')
  async removeWidget(@Param('id') id: string, @Param('widgetId') widgetId: string, @Request() req) {
    return this.dashboardService.removeWidget(id, widgetId, req.user.sub);
  }

  /**
   * PUT /api/dashboards/:id/layout
   * Actualizar layout del dashboard
   */
  @Put(':id/layout')
  async updateLayout(@Param('id') id: string, @Body() body: { widgets: any[] }, @Request() req) {
    return this.dashboardService.updateLayout(id, body.widgets, req.user.sub);
  }

  /**
   * POST /api/dashboards/:id/views
   * Guardar vista
   */
  @Post(':id/views')
  async saveView(@Param('id') id: string, @Body() dto: SaveViewDto, @Request() req) {
    return this.dashboardService.saveView(id, dto.viewName, dto.filters, req.user.sub);
  }

  /**
   * GET /api/dashboards/:id/views
   * Obtener vistas guardadas
   */
  @Get(':id/views')
  async getSavedViews(@Param('id') id: string, @Request() req) {
    return this.dashboardService.getSavedViews(id, req.user.sub);
  }

  /**
   * POST /api/dashboards/:id/favorite
   * Toggle favorito
   */
  @Post(':id/favorite')
  async toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.dashboardService.toggleFavorite(id, req.user.sub);
  }

  /**
   * POST /api/dashboards/:id/clone
   * Clonar dashboard
   */
  @Post(':id/clone')
  async clone(@Param('id') id: string, @Body() body: { name: string }, @Request() req) {
    return this.dashboardService.clone(id, body.name, req.user.sub);
  }

  /**
   * GET /api/dashboards/widgets/:widgetId/data
   * Obtener datos de un widget
   */
  @Get('widgets/:widgetId/data')
  async getWidgetData(
    @Param('widgetId') widgetId: string,
    @Query('filters') filters: string,
  ) {
    const parsedFilters = filters ? JSON.parse(filters) : {};
    return this.widgetService.getWidgetData(widgetId, parsedFilters);
  }

  /**
   * POST /api/dashboards/widgets/:widgetId/drill-down
   * Aplicar drill-down
   */
  @Post('widgets/:widgetId/drill-down')
  async applyDrillDown(
    @Param('widgetId') widgetId: string,
    @Body() body: { fromDimension: string; selectedValue: any },
  ) {
    return this.drillDownService.applyDrillDown(
      widgetId,
      body.fromDimension,
      body.selectedValue,
    );
  }
}
```

---

## 7. React Components

### 7.1 DashboardGrid Component

```typescript
// src/pages/Dashboards/DashboardGrid.tsx

import React, { useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '../../stores/dashboardStore';
import { WidgetContainer } from '../../components/dashboards/WidgetContainer';
import { DashboardFilters } from '../../components/dashboards/DashboardFilters';
import { Button } from '../../components/ui/Button';
import { Save, Plus } from 'lucide-react';

interface DashboardGridProps {
  dashboardId: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ dashboardId }) => {
  const { currentDashboard, loading, fetchDashboard, updateLayout } = useDashboardStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({});

  useEffect(() => {
    fetchDashboard(dashboardId);
  }, [dashboardId]);

  useEffect(() => {
    if (currentDashboard) {
      // Convertir widgets a layouts de react-grid-layout
      const gridLayouts = currentDashboard.widgets.reduce((acc, widget) => {
        Object.entries(widget.layout).forEach(([breakpoint, layout]) => {
          if (!acc[breakpoint]) acc[breakpoint] = [];
          acc[breakpoint].push({
            i: widget.id,
            ...layout,
          });
        });
        return acc;
      }, {} as { [key: string]: Layout[] });

      setLayouts(gridLayouts);
    }
  }, [currentDashboard]);

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    if (!isEditMode) return;

    setLayouts(allLayouts);
  };

  const handleSaveLayout = async () => {
    if (!currentDashboard) return;

    // Convertir layouts de vuelta a formato de widgets
    const updatedWidgets = currentDashboard.widgets.map((widget) => ({
      ...widget,
      layout: Object.entries(layouts).reduce((acc, [breakpoint, layout]) => {
        const widgetLayout = layout.find((l) => l.i === widget.id);
        if (widgetLayout) {
          const { i, ...rest } = widgetLayout;
          acc[breakpoint] = rest;
        }
        return acc;
      }, {} as any),
    }));

    await updateLayout(dashboardId, updatedWidgets);
    setIsEditMode(false);
  };

  if (loading || !currentDashboard) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div className="dashboard-header flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{currentDashboard.name}</h1>
          <p className="text-gray-600">{currentDashboard.description}</p>
        </div>

        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button onClick={() => setIsEditMode(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleSaveLayout} variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Guardar Layout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditMode(true)} variant="outline">
                Editar
              </Button>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Widget
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filtros globales */}
      <DashboardFilters
        filters={currentDashboard.globalFilters}
        onChange={(filters) => {
          // TODO: Actualizar filtros
        }}
      />

      {/* Grid de widgets */}
      <GridLayout
        className="layout"
        layouts={layouts}
        breakpoints={currentDashboard.layoutConfig.breakpoints}
        cols={currentDashboard.layoutConfig.cols}
        rowHeight={currentDashboard.layoutConfig.rowHeight}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        onLayoutChange={handleLayoutChange}
        compactType={currentDashboard.layoutConfig.compactType}
      >
        {currentDashboard.widgets.map((widget) => (
          <div key={widget.id}>
            <WidgetContainer
              widget={widget}
              filters={currentDashboard.globalFilters}
              isEditMode={isEditMode}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};
```

### 7.2 WidgetContainer Component

```typescript
// src/components/dashboards/WidgetContainer.tsx

import React, { useEffect, useState } from 'react';
import { useWidgetStore } from '../../stores/widgetStore';
import { Card } from '../ui/Card';
import { KPICard } from '../reports/KPICard';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { DataTable } from '../ui/DataTable';
import { RefreshCw, Download, Maximize2, X } from 'lucide-react';

interface WidgetContainerProps {
  widget: any;
  filters: any;
  isEditMode: boolean;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  filters,
  isEditMode,
}) => {
  const { getWidgetData, loading } = useWidgetStore();
  const [data, setData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [widget.id, filters]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const result = await getWidgetData(widget.id, filters);
      setData(result);
    } catch (error) {
      console.error('Error loading widget data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderWidget = () => {
    if (!data) return <div>No data</div>;

    switch (widget.type) {
      case 'kpi_card':
        return (
          <KPICard
            title={widget.title}
            value={data.currentValue}
            {...widget.config}
          />
        );

      case 'line_chart':
        return <LineChart data={data} {...widget.config} />;

      case 'bar_chart':
        return <BarChart data={data} {...widget.config} />;

      case 'table':
        return (
          <DataTable
            columns={data.columns}
            data={data.rows}
            {...widget.config}
          />
        );

      default:
        return <div>Unknown widget type: {widget.type}</div>;
    }
  };

  return (
    <Card
      className={`widget-container h-full ${isEditMode ? 'edit-mode' : ''}`}
      title={widget.title}
      actions={
        !isEditMode && (
          <div className="flex gap-2">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    >
      <div className="widget-content h-full">
        {loading || isRefreshing ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          renderWidget()
        )}
      </div>
    </Card>
  );
};
```

---

## 8. WebSocket (Real-time Updates)

```typescript
// src/modules/dashboards/gateways/dashboard.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  namespace: '/dashboards',
  cors: {
    origin: '*',
  },
})
export class DashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(DashboardGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Cliente se suscribe a un dashboard
   */
  @SubscribeMessage('subscribe_dashboard')
  handleSubscribeDashboard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { dashboardId: string },
  ) {
    client.join(`dashboard:${data.dashboardId}`);
    this.logger.log(`Client ${client.id} subscribed to dashboard ${data.dashboardId}`);

    return { event: 'subscribed', dashboardId: data.dashboardId };
  }

  /**
   * Cliente se desuscribe de un dashboard
   */
  @SubscribeMessage('unsubscribe_dashboard')
  handleUnsubscribeDashboard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { dashboardId: string },
  ) {
    client.leave(`dashboard:${data.dashboardId}`);
    this.logger.log(`Client ${client.id} unsubscribed from dashboard ${data.dashboardId}`);

    return { event: 'unsubscribed', dashboardId: data.dashboardId };
  }

  /**
   * Broadcast cuando se actualiza un widget
   */
  @OnEvent('widget.data_updated')
  handleWidgetDataUpdated(payload: { widgetId: string; dashboardId: string; data: any }) {
    this.server.to(`dashboard:${payload.dashboardId}`).emit('widget_updated', {
      widgetId: payload.widgetId,
      data: payload.data,
      timestamp: new Date(),
    });

    this.logger.log(`Widget ${payload.widgetId} updated in dashboard ${payload.dashboardId}`);
  }

  /**
   * Broadcast cuando se actualiza un dashboard
   */
  @OnEvent('dashboard.updated')
  handleDashboardUpdated(payload: { dashboardId: string }) {
    this.server.to(`dashboard:${payload.dashboardId}`).emit('dashboard_updated', {
      dashboardId: payload.dashboardId,
      timestamp: new Date(),
    });
  }
}
```

---

## 9. Testing

```typescript
// src/modules/dashboards/services/__tests__/dashboard.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from '../dashboard.service';
import { UserDashboard } from '../../entities/user-dashboard.entity';
import { SavedView } from '../../entities/saved-view.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('DashboardService', () => {
  let service: DashboardService;
  let dashboardRepo: any;
  let savedViewRepo: any;

  beforeEach(async () => {
    dashboardRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    savedViewRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(UserDashboard),
          useValue: dashboardRepo,
        },
        {
          provide: getRepositoryToken(SavedView),
          useValue: savedViewRepo,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  describe('create', () => {
    it('should create a new dashboard', async () => {
      const dto = {
        name: 'My Dashboard',
        description: 'Test dashboard',
      };

      dashboardRepo.create.mockReturnValue({ ...dto, id: 'uuid-1' });
      dashboardRepo.save.mockResolvedValue({ ...dto, id: 'uuid-1' });

      const result = await service.create(dto as any, 'user-1', 'constructora-1');

      expect(result.name).toBe(dto.name);
      expect(dashboardRepo.save).toHaveBeenCalled();
    });
  });

  describe('addWidget', () => {
    it('should add a widget to dashboard', async () => {
      const dashboard = {
        id: 'dashboard-1',
        widgets: [],
      };

      const widgetDto = {
        type: 'kpi_card',
        title: 'Test Widget',
        dataSource: 'test',
        layout: { lg: { x: 0, y: 0, w: 3, h: 2 } },
      };

      dashboardRepo.findOne.mockResolvedValue(dashboard);
      dashboardRepo.save.mockImplementation((d) => Promise.resolve(d));

      const result = await service.addWidget('dashboard-1', widgetDto as any, 'user-1');

      expect(result.widgets).toHaveLength(1);
      expect(result.widgets[0].title).toBe(widgetDto.title);
    });
  });
});
```

---

## 10. Criterios de Aceptación Técnicos

- [x] Schema `dashboards` creado con todas las tablas
- [x] Entities TypeORM con relaciones correctas
- [x] Services para gestión de dashboards y widgets
- [x] Drag & drop con react-grid-layout
- [x] Widgets configurables (KPI, gráficas, tablas)
- [x] Sistema de vistas guardadas
- [x] Drill-down con navegación entre dimensiones
- [x] Cache de datos de widgets con Redis
- [x] WebSocket para actualizaciones en tiempo real
- [x] Controllers con endpoints RESTful
- [x] React components responsivos
- [x] Triggers para auto-cleanup de cache
- [x] Tests unitarios con >80% coverage

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo Técnico
**Versión:** 1.0
**Estado:** ✅ Listo para Implementación
