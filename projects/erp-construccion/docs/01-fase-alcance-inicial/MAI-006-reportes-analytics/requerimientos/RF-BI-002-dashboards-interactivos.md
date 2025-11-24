# RF-BI-002: Dashboards Interactivos de BI

**Epica:** MAI-006 - Reportes y Business Intelligence
**Modulo:** Dashboards Interactivos
**Responsable:** Product Owner
**Fecha:** 2025-11-17
**Version:** 1.0

---

## 1. Objetivo

Proporcionar dashboards interactivos configurables que permitan a usuarios de diferentes niveles crear, personalizar y compartir visualizaciones de datos con capacidades de drill-down, filtrado dinamico y segmentacion en tiempo real para analisis profundo de metricas de proyectos.

---

## 2. Casos de Uso

### CU-BI-006: Dashboard Personalizable con Widgets

**Actor:** Gerente de Proyecto, Director de Operaciones, CFO
**Precondiciones:**
- Usuario autenticado con permisos de visualizacion
- Existen datos de proyectos en el sistema

**Flujo Principal:**

1. Usuario accede a modulo de dashboards personalizados
2. Usuario selecciona "Crear Nuevo Dashboard"
3. Sistema muestra galeria de widgets disponibles:
   - Graficas de barras (avance fisico/financiero)
   - Graficas de lineas (tendencias temporales)
   - Graficas circulares (distribucion de costos)
   - Tablas dinamicas (detalles de partidas)
   - KPI Cards (metricas clave)
   - Mapas de calor (riesgos)
   - Gauges (SPI, CPI)
   - Timeline (cronograma)
4. Usuario arrastra y suelta widgets en grid responsive:
   ```
   ┌─────────────────────────────────────────────────┐
   │ Mi Dashboard - Proyecto Fraccionamiento Valle  │
   ├─────────────────────────────────────────────────┤
   │                                                  │
   │ ┌─ Avance General ──┐ ┌─ SPI/CPI ────────────┐ │
   │ │                   │ │         ┌───┐        │ │
   │ │  Fisico:  68%     │ │   SPI   │1.1│  On   │ │
   │ │  ████████░░       │ │         └───┘ Track  │ │
   │ │                   │ │         ┌───┐        │ │
   │ │  Financiero: 65%  │ │   CPI   │1.0│  On   │ │
   │ │  ███████░░░       │ │         └───┘Budget  │ │
   │ └───────────────────┘ └──────────────────────┘ │
   │                                                  │
   │ ┌─ Costos por Partida ──────────────────────┐  │
   │ │                                            │  │
   │ │ Obra Civil      $45M  ███████████████      │  │
   │ │ Instalaciones   $18M  ██████               │  │
   │ │ Acabados        $12M  ████                 │  │
   │ │ Urbanizacion    $25M  ████████             │  │
   │ └────────────────────────────────────────────┘  │
   │                                                  │
   │ ┌─ Tendencia de Avance ──────────────────────┐  │
   │ │                                             │  │
   │ │ 100%│                          ╱─ Planif.  │  │
   │ │  80%│                    ●───●              │  │
   │ │  60%│              ●───●        Real        │  │
   │ │  40%│        ●───●                          │  │
   │ │  20%│  ●───●                                │  │
   │ │   0%└──────────────────────────→            │  │
   │ │     Ene Feb Mar Abr May Jun                │  │
   │ └─────────────────────────────────────────────┘  │
   │                                                  │
   │             [+ Agregar Widget] [Guardar]        │
   └─────────────────────────────────────────────────┘
   ```
5. Usuario configura cada widget:
   - Selecciona fuente de datos (proyecto, partida, periodo)
   - Configura metricas a mostrar
   - Define colores y estilos
   - Establece umbrales y alertas
6. Usuario guarda dashboard con nombre descriptivo
7. Usuario define si dashboard es privado o compartido

**Postcondiciones:**
- Dashboard personalizado creado y guardado
- Widgets se actualizan automaticamente con datos en tiempo real

**Wireframe - Configuracion de Widget:**

```
┌───────────────────────────────────────────────┐
│ Configurar Widget: Grafica de Barras         │
├───────────────────────────────────────────────┤
│                                                │
│ Nombre del Widget:                            │
│ [Costos por Partida                        ]  │
│                                                │
│ Fuente de Datos:                              │
│ ○ Proyecto Actual                             │
│ ● Multiples Proyectos                         │
│   ☑ Fracc. Del Valle                          │
│   ☑ Torres del Sol                            │
│   ☐ Privada Roble                             │
│                                                │
│ Metrica:                                      │
│ [▼ Costo Acumulado         ]                  │
│                                                │
│ Agrupar por:                                  │
│ [▼ Partida Presupuestal    ]                  │
│                                                │
│ Periodo:                                      │
│ ○ Mes Actual                                  │
│ ○ Trimestre Actual                            │
│ ● Acumulado a la Fecha                       │
│                                                │
│ Visualizacion:                                │
│ ☑ Mostrar valores                             │
│ ☑ Mostrar porcentajes                         │
│ ☐ Ordenar descendente                         │
│                                                │
│ Colores:                                      │
│ Esquema: [▼ Azules         ]                  │
│                                                │
│         [Cancelar]  [Vista Previa]  [Aplicar] │
└───────────────────────────────────────────────┘
```

---

### CU-BI-007: Drill-Down y Navegacion Jerarquica

**Actor:** Gerente de Proyecto, Analista de Costos
**Precondiciones:**
- Dashboard configurado con widgets
- Datos disponibles en multiples niveles de detalle

**Flujo Principal:**

1. Usuario visualiza dashboard con grafica de costos consolidados
2. Usuario hace clic en barra de "Obra Civil - $45M"
3. Sistema ejecuta drill-down, mostrando desglose nivel 2:
   ```
   Obra Civil: $45M
   ├─ Cimentacion:        $12M (27%)
   ├─ Estructura:         $18M (40%)
   ├─ Albanileria:        $10M (22%)
   └─ Impermeabilizacion: $5M  (11%)
   ```
4. Usuario hace clic en "Estructura - $18M"
5. Sistema muestra nivel 3 de detalle:
   ```
   Estructura: $18M
   ├─ Columnas:    $7M  (39%)
   ├─ Trabes:      $6M  (33%)
   ├─ Losas:       $4M  (22%)
   └─ Escaleras:   $1M  (6%)
   ```
6. Usuario hace clic en "Columnas - $7M"
7. Sistema muestra tabla detallada con ordenes de compra:
   ```
   ┌──────────────────────────────────────────────────────────┐
   │ Detalle: Columnas                                        │
   ├──────────────────────────────────────────────────────────┤
   │ OC       │Proveedor    │Concepto    │Monto  │Fecha      │
   │──────────┼─────────────┼────────────┼───────┼───────────┤
   │ OC-1234  │Concreto ABC │Concreto 3k │$4.2M  │2025-01-15 │
   │ OC-1235  │Acero XYZ    │Varillas #6 │$2.1M  │2025-01-20 │
   │ OC-1236  │Concreto ABC │Bombeo      │$0.5M  │2025-02-05 │
   │ OC-1237  │Rental Inc   │Cimbra      │$0.2M  │2025-01-10 │
   └──────────────────────────────────────────────────────────┘
   ```
8. Usuario puede navegar hacia atras usando breadcrumbs:
   ```
   Dashboard > Obra Civil > Estructura > Columnas
   ```
9. Usuario puede cambiar nivel de agregacion dinamicamente

**Postcondiciones:**
- Usuario obtiene visibilidad completa desde macro a micro
- Navegacion jerarquica mantiene contexto

**Wireframe - Drill-Down:**

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard > Costos > Obra Civil > Estructura                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─ Estructura: $18M ─────────────────────────────────────┐  │
│ │                                                          │  │
│ │ ┌────────────────────────┐                              │  │
│ │ │ Columnas     $7M  39%  │ ← Clic aqui para profundizar│  │
│ │ ├────────────────────────┤                              │  │
│ │ │ Trabes       $6M  33%  │                              │  │
│ │ ├────────────────────────┤                              │  │
│ │ │ Losas        $4M  22%  │                              │  │
│ │ ├────────────────────────┤                              │  │
│ │ │ Escaleras    $1M   6%  │                              │  │
│ │ └────────────────────────┘                              │  │
│ │                                                          │  │
│ │ Analisis:                                                │  │
│ │ • Mayor costo en elementos verticales (72%)             │  │
│ │ • Columnas representan 39% del total                    │  │
│ │ • Avance: 65% (en linea con programacion)               │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                              │
│ [← Regresar] [Exportar Detalle] [Agregar Filtro]           │
└─────────────────────────────────────────────────────────────┘
```

---

### CU-BI-008: Filtros Dinamicos y Segmentacion

**Actor:** Director de Operaciones, Gerente de Proyecto
**Precondiciones:**
- Dashboard con multiples widgets configurados
- Datos con dimensiones filtrables

**Flujo Principal:**

1. Usuario accede a dashboard corporativo multi-proyecto
2. Usuario activa panel de filtros globales:
   ```
   ┌─ Filtros Globales ──────────────────┐
   │                                      │
   │ Proyectos:                           │
   │ ☑ Fracc. Del Valle                   │
   │ ☑ Torres del Sol                     │
   │ ☐ Privada Roble                      │
   │ ☑ Fracc. Los Pinos                   │
   │                                      │
   │ Periodo:                             │
   │ Desde: [01/01/2025] Hasta: [30/06/25]│
   │                                      │
   │ Tipo de Proyecto:                    │
   │ ☑ Fraccionamiento                    │
   │ ☑ Vertical                           │
   │ ☐ Mixto                              │
   │                                      │
   │ Estado:                              │
   │ ☐ Planeacion                         │
   │ ☑ En Construccion                    │
   │ ☐ En Cierre                          │
   │                                      │
   │ Rango de Presupuesto:                │
   │ Min: [$50M] Max: [$200M]             │
   │                                      │
   │        [Limpiar] [Aplicar Filtros]   │
   └──────────────────────────────────────┘
   ```
3. Usuario selecciona 3 proyectos y aplica filtro
4. Sistema actualiza todos los widgets del dashboard:
   - KPIs se recalculan para proyectos seleccionados
   - Graficas muestran solo datos filtrados
   - Totales y promedios se ajustan
5. Usuario aplica filtro de periodo (Q1-2025)
6. Sistema muestra comparativo temporal:
   ```
   ┌─ Avance Trimestral Q1-2025 ──────────────┐
   │                                           │
   │ Proyecto        │Ene  │Feb  │Mar  │Total │
   │─────────────────┼─────┼─────┼─────┼──────┤
   │ Fracc. Valle    │ 8%  │ 12% │ 15% │ 35%  │
   │ Torres Sol      │ 10% │ 14% │ 11% │ 35%  │
   │ Fracc. Pinos    │ 6%  │ 9%  │ 10% │ 25%  │
   └───────────────────────────────────────────┘
   ```
7. Usuario guarda combinacion de filtros como "Vista Rapida"
8. Usuario puede alternar entre vistas guardadas con un clic

**Postcondiciones:**
- Dashboard muestra datos filtrados consistentemente
- Filtros guardados disponibles para uso futuro

**Wireframe - Segmentacion Avanzada:**

```
┌──────────────────────────────────────────────────────────┐
│ Segmentacion Avanzada                                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Crear Segmento:                                          │
│                                                           │
│ ┌─ Regla 1 ──────────────────────────────────────────┐   │
│ │ Campo: [▼ SPI                ]                      │   │
│ │ Operador: [▼ Menor que       ]                      │   │
│ │ Valor: [0.90                 ]                      │   │
│ └─────────────────────────────────────────────────────┘   │
│ [+ Y]  [+ O]                                             │
│                                                           │
│ ┌─ Regla 2 ──────────────────────────────────────────┐   │
│ │ Campo: [▼ Margen Neto        ]                      │   │
│ │ Operador: [▼ Menor que       ]                      │   │
│ │ Valor: [15%                  ]                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                           │
│ Resultado: 3 proyectos coinciden                         │
│ • Residencial Lago                                       │
│ • Fracc. Los Pinos                                       │
│ • Privada Encinos                                        │
│                                                           │
│ Guardar Segmento como: [Proyectos en Riesgo          ]  │
│                                                           │
│            [Cancelar]  [Aplicar]  [Guardar Segmento]     │
└──────────────────────────────────────────────────────────┘
```

---

### CU-BI-009: Exportacion de Visualizaciones

**Actor:** Director General, Gerente de Proyecto, CFO
**Precondiciones:**
- Dashboard configurado con widgets
- Usuario tiene permisos de exportacion

**Flujo Principal:**

1. Usuario visualiza dashboard completo
2. Usuario hace clic en boton "Exportar"
3. Sistema muestra opciones de exportacion:
   ```
   ┌─ Exportar Dashboard ─────────────────┐
   │                                       │
   │ Formato:                              │
   │ ○ PDF (Documento)                     │
   │ ● PowerPoint (Presentacion)           │
   │ ○ Excel (Datos + Graficas)            │
   │ ○ Imagen PNG (Alta resolucion)        │
   │                                       │
   │ Contenido:                            │
   │ ● Dashboard Completo                  │
   │ ○ Widgets Seleccionados               │
   │   ☐ Avance General                    │
   │   ☐ SPI/CPI                           │
   │   ☐ Costos por Partida                │
   │                                       │
   │ Opciones:                             │
   │ ☑ Incluir filtros aplicados           │
   │ ☑ Incluir fecha de generacion         │
   │ ☑ Incluir marca de agua               │
   │ ☐ Incluir datos detallados            │
   │                                       │
   │ Orientacion:                          │
   │ ● Horizontal (Landscape)              │
   │ ○ Vertical (Portrait)                 │
   │                                       │
   │      [Cancelar]  [Vista Previa]       │
   │                  [Exportar]           │
   └───────────────────────────────────────┘
   ```
4. Usuario selecciona formato PowerPoint
5. Sistema genera presentacion con:
   - Portada con logo y titulo
   - Una diapositiva por widget
   - Graficas como imagenes vectoriales
   - Tablas de datos en formato editable
   - Pie de pagina con fecha y filtros aplicados
6. Usuario descarga archivo "Dashboard_Proyecto_Valle_2025-11-17.pptx"
7. Usuario abre presentacion y verifica calidad
8. Usuario puede editar presentacion en PowerPoint

**Flujo Alternativo - Exportacion Programada:**

1. Usuario configura exportacion automatica:
   ```
   ┌─ Programar Exportacion ──────────────┐
   │                                       │
   │ Dashboard: [Mi Dashboard Semanal   ]  │
   │                                       │
   │ Frecuencia:                           │
   │ ○ Diaria                              │
   │ ● Semanal (Lunes)                     │
   │ ○ Mensual (Dia 1)                     │
   │ ○ Personalizada                       │
   │                                       │
   │ Formato: [▼ PDF             ]         │
   │                                       │
   │ Enviar a:                             │
   │ [gerencia@constructora.com        ]   │
   │ [+ Agregar destinatario]              │
   │                                       │
   │ Hora de envio: [08:00 AM]             │
   │                                       │
   │ ☑ Activo                              │
   │                                       │
   │        [Cancelar]  [Guardar]          │
   └───────────────────────────────────────┘
   ```
2. Sistema programa job recurrente
3. Cada lunes a las 8:00 AM, sistema:
   - Genera dashboard con datos actualizados
   - Exporta a PDF
   - Envia por correo a destinatarios

**Postcondiciones:**
- Archivo exportado disponible para descarga
- Visualizaciones mantienen formato y calidad
- Exportaciones programadas configuradas

---

## 3. Requerimientos Funcionales

### RF-BI-002.1: Creacion y Personalizacion de Dashboards
- El sistema DEBE permitir crear dashboards personalizados con interfaz drag-and-drop
- El sistema DEBE ofrecer galeria de widgets pre-configurados (minimo 8 tipos)
- El sistema DEBE permitir redimensionar y reposicionar widgets en grid responsive
- El sistema DEBE permitir guardar dashboards con nombre y descripcion
- El sistema DEBE permitir definir dashboards como privados o compartidos
- El sistema DEBE permitir duplicar dashboards existentes

### RF-BI-002.2: Configuracion de Widgets
- El sistema DEBE permitir configurar fuente de datos por widget
- El sistema DEBE permitir seleccionar metricas y dimensiones a visualizar
- El sistema DEBE ofrecer multiples tipos de graficas (barras, lineas, circular, gauge, tabla)
- El sistema DEBE permitir configurar colores, estilos y umbrales
- El sistema DEBE validar configuracion antes de aplicar
- El sistema DEBE mostrar vista previa de widget antes de guardar

### RF-BI-002.3: Drill-Down y Navegacion Jerarquica
- El sistema DEBE permitir drill-down en graficas haciendo clic en elementos
- El sistema DEBE soportar al menos 4 niveles de profundidad
- El sistema DEBE mostrar breadcrumbs de navegacion jerarquica
- El sistema DEBE permitir regresar a nivel anterior
- El sistema DEBE mantener contexto de filtros durante drill-down
- El sistema DEBE mostrar detalle de transacciones en nivel mas bajo

### RF-BI-002.4: Filtros Dinamicos
- El sistema DEBE ofrecer panel de filtros globales aplicables a todo el dashboard
- El sistema DEBE permitir filtrar por proyecto, periodo, tipo, estado, presupuesto
- El sistema DEBE actualizar todos los widgets al aplicar filtros
- El sistema DEBE permitir guardar combinaciones de filtros como "Vistas Rapidas"
- El sistema DEBE permitir limpiar todos los filtros con un boton
- El sistema DEBE mantener filtros activos al cambiar entre dashboards

### RF-BI-002.5: Segmentacion Avanzada
- El sistema DEBE permitir crear segmentos con reglas AND/OR
- El sistema DEBE soportar operadores: igual, diferente, mayor, menor, contiene, entre
- El sistema DEBE mostrar preview de registros que coinciden con segmento
- El sistema DEBE permitir guardar segmentos para reutilizacion
- El sistema DEBE permitir aplicar multiples segmentos simultaneamente

### RF-BI-002.6: Exportacion de Visualizaciones
- El sistema DEBE permitir exportar dashboards a PDF, PowerPoint, Excel, PNG
- El sistema DEBE mantener calidad de graficas en exportacion (vectorial cuando posible)
- El sistema DEBE permitir seleccionar widgets especificos para exportar
- El sistema DEBE incluir metadata (fecha, filtros, usuario) en exportaciones
- El sistema DEBE generar archivos con nomenclatura estandar
- El sistema DEBE permitir programar exportaciones automaticas con recurrencia

### RF-BI-002.7: Actualizacion en Tiempo Real
- El sistema DEBE actualizar widgets automaticamente cada 5 minutos
- El sistema DEBE mostrar indicador de ultima actualizacion
- El sistema DEBE permitir forzar actualizacion manual
- El sistema DEBE usar websockets para actualizaciones en tiempo real
- El sistema DEBE notificar cuando datos estan desactualizados

---

## 4. Modelo de Datos

```typescript
// Dashboard Configuration
interface Dashboard {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  visibility: 'private' | 'shared' | 'public';
  sharedWith: string[]; // user IDs
  createdAt: Date;
  updatedAt: Date;

  layout: {
    columns: number; // grid columns (typically 12)
    rowHeight: number; // px
  };

  widgets: Widget[];

  globalFilters?: {
    projectIds?: string[];
    dateRange?: { from: Date; to: Date };
    projectTypes?: string[];
    status?: string[];
    budgetRange?: { min: number; max: number };
  };

  autoRefresh: boolean;
  refreshInterval: number; // seconds
}

// Widget Configuration
interface Widget {
  id: string;
  dashboardId: string;
  type: WidgetType;
  title: string;

  // Layout position in grid
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Data configuration
  dataSource: {
    type: 'project' | 'multi-project' | 'consolidated';
    projectIds?: string[];
    metric: string; // 'cost', 'progress', 'spi', 'cpi', etc.
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    groupBy?: string; // dimension to group by
    dateRange?: { from: Date; to: Date };
  };

  // Visualization settings
  visualization: {
    chartType: ChartType;
    colors: string[];
    showValues: boolean;
    showPercentages: boolean;
    showLegend: boolean;
    thresholds?: {
      value: number;
      color: string;
      operator: '>' | '<' | '>=' | '<=' | '=' | '!=';
    }[];
  };

  // Drill-down configuration
  drillDown?: {
    enabled: boolean;
    levels: {
      dimension: string;
      label: string;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
}

type WidgetType =
  | 'kpi-card'
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'gauge'
  | 'table'
  | 'heat-map'
  | 'timeline';

type ChartType =
  | 'vertical-bar'
  | 'horizontal-bar'
  | 'stacked-bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'gauge'
  | 'table';

// Saved Views (Filter Combinations)
interface SavedView {
  id: string;
  dashboardId: string;
  name: string;
  filters: Dashboard['globalFilters'];
  createdBy: string;
  createdAt: Date;
}

// Segmentation
interface Segment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  logicalOperator: 'AND' | 'OR';
  createdBy: string;
  createdAt: Date;

  // Cache for performance
  matchingRecords?: string[]; // IDs
  lastEvaluated?: Date;
}

interface SegmentRule {
  field: string; // 'spi', 'cpi', 'margin', 'budget', etc.
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'between';
  value: any;
  value2?: any; // for 'between' operator
}

// Export Configuration
interface ExportConfig {
  dashboardId: string;
  format: 'pdf' | 'pptx' | 'xlsx' | 'png';

  content: {
    type: 'full' | 'selected';
    widgetIds?: string[]; // if type is 'selected'
  };

  options: {
    includeFilters: boolean;
    includeTimestamp: boolean;
    includeWatermark: boolean;
    includeRawData: boolean;
    orientation: 'landscape' | 'portrait';
  };

  // For scheduled exports
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    time: string; // "HH:mm"
    recipients: string[]; // email addresses
    subject?: string;
    body?: string;
  };
}

// Export Job (for tracking)
interface ExportJob {
  id: string;
  dashboardId: string;
  configId?: string; // if from scheduled export
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: ExportConfig['format'];
  filePath?: string;
  fileSize?: number;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

// Drill-Down Navigation State
interface DrillDownState {
  widgetId: string;
  sessionId: string;
  breadcrumbs: {
    level: number;
    dimension: string;
    value: any;
    label: string;
  }[];
  currentLevel: number;
  filters: Record<string, any>;
}
```

### SQL Schema

```sql
-- Dashboards
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('private', 'shared', 'public')),
  layout JSONB NOT NULL DEFAULT '{"columns": 12, "rowHeight": 100}',
  global_filters JSONB,
  auto_refresh BOOLEAN DEFAULT true,
  refresh_interval INTEGER DEFAULT 300,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_dashboard_owner (owner_id),
  INDEX idx_dashboard_visibility (visibility)
);

-- Dashboard Sharing
CREATE TABLE dashboard_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  permission VARCHAR(20) DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(dashboard_id, user_id),
  INDEX idx_share_user (user_id)
);

-- Widgets
CREATE TABLE widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  position JSONB NOT NULL,
  data_source JSONB NOT NULL,
  visualization JSONB NOT NULL,
  drill_down JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_widget_dashboard (dashboard_id)
);

-- Saved Views
CREATE TABLE saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  filters JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_view_dashboard (dashboard_id)
);

-- Segments
CREATE TABLE segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rules JSONB NOT NULL,
  logical_operator VARCHAR(10) DEFAULT 'AND',
  matching_records JSONB,
  last_evaluated TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_segment_creator (created_by)
);

-- Export Configurations
CREATE TABLE export_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  format VARCHAR(10) NOT NULL,
  content JSONB NOT NULL,
  options JSONB NOT NULL,
  schedule JSONB,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_export_config_dashboard (dashboard_id),
  INDEX idx_export_config_scheduled (created_at) WHERE schedule->>'enabled' = 'true'
);

-- Export Jobs
CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id),
  config_id UUID REFERENCES export_configs(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  format VARCHAR(10) NOT NULL,
  file_path VARCHAR(500),
  file_size BIGINT,
  error TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  INDEX idx_export_job_status (status),
  INDEX idx_export_job_created (created_at)
);
```

---

## 5. Criterios de Aceptacion

### Creacion y Personalizacion de Dashboards
- [ ] Interfaz drag-and-drop funciona en navegadores Chrome, Firefox, Safari
- [ ] Galeria muestra al menos 8 tipos de widgets diferentes
- [ ] Grid responsive se ajusta correctamente a pantallas 1920x1080, 1366x768, tablets
- [ ] Dashboards se guardan correctamente con toda su configuracion
- [ ] Dashboards compartidos son visibles para usuarios autorizados
- [ ] Duplicar dashboard crea copia exacta con nuevo ID

### Configuracion de Widgets
- [ ] Configuracion de widget se valida antes de aplicar
- [ ] Vista previa muestra widget exactamente como aparecera en dashboard
- [ ] Cambio de tipo de grafica actualiza opciones de visualizacion disponibles
- [ ] Umbrales de colores se aplican correctamente en visualizaciones
- [ ] Widgets muestran mensaje de error si configuracion es invalida

### Drill-Down y Navegacion
- [ ] Clic en elemento de grafica ejecuta drill-down correctamente
- [ ] Breadcrumbs muestran ruta completa de navegacion
- [ ] Boton "Regresar" funciona en todos los niveles
- [ ] Filtros se mantienen durante navegacion jerarquica
- [ ] Nivel mas bajo muestra tabla con transacciones individuales
- [ ] Drill-down funciona en graficas de barras, lineas y circulares

### Filtros Dinamicos
- [ ] Aplicar filtros actualiza todos los widgets consistentemente
- [ ] Filtros se aplican en <2 segundos para dashboards con hasta 10 widgets
- [ ] Vistas rapidas guardadas restauran filtros correctamente
- [ ] Limpiar filtros restaura vista original del dashboard
- [ ] Filtros de rango de fecha validan que fecha inicio < fecha fin

### Segmentacion
- [ ] Reglas AND/OR funcionan correctamente en combinacion
- [ ] Preview muestra numero correcto de registros que coinciden
- [ ] Segmentos guardados se pueden aplicar en cualquier dashboard compatible
- [ ] Operador "between" valida que valor1 < valor2
- [ ] Segmentos complejos (>5 reglas) se evaluan en <3 segundos

### Exportacion
- [ ] Exportacion a PDF mantiene calidad de graficas (minimo 300 DPI)
- [ ] Exportacion a PowerPoint genera diapositivas editables
- [ ] Exportacion a Excel incluye datos y graficas
- [ ] Exportacion a PNG genera imagen de alta resolucion (minimo 1920x1080)
- [ ] Archivos exportados tienen nomenclatura: Dashboard_Nombre_YYYY-MM-DD.ext
- [ ] Exportaciones programadas se ejecutan en horario configurado (±5 min)
- [ ] Correos de exportaciones automaticas se envian a todos los destinatarios

### Actualizacion en Tiempo Real
- [ ] Widgets se actualizan automaticamente cada 5 minutos
- [ ] Indicador "Actualizado hace X minutos" es preciso
- [ ] Forzar actualizacion manual funciona inmediatamente
- [ ] Actualizaciones no interrumpen interaccion del usuario
- [ ] Notificacion aparece si datos tienen >15 minutos de antiguedad

---

## 6. Notas Tecnicas

### Implementacion de Drag-and-Drop

```typescript
import { useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

const DashboardEditor = ({ dashboard, onLayoutChange }) => {
  const layout = dashboard.widgets.map(widget => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.width,
    h: widget.position.height,
    minW: 2,
    minH: 2
  }));

  const handleLayoutChange = useCallback((newLayout) => {
    const updatedWidgets = dashboard.widgets.map(widget => {
      const layoutItem = newLayout.find(item => item.i === widget.id);
      return {
        ...widget,
        position: {
          x: layoutItem.x,
          y: layoutItem.y,
          width: layoutItem.w,
          height: layoutItem.h
        }
      };
    });

    onLayoutChange(updatedWidgets);
  }, [dashboard.widgets, onLayoutChange]);

  return (
    <GridLayout
      className="dashboard-grid"
      layout={layout}
      cols={12}
      rowHeight={100}
      width={1200}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".widget-drag-handle"
      resizeHandles={['se']}
    >
      {dashboard.widgets.map(widget => (
        <div key={widget.id} className="widget-container">
          <WidgetRenderer widget={widget} />
        </div>
      ))}
    </GridLayout>
  );
};
```

### Implementacion de Drill-Down

```typescript
interface DrillDownContext {
  widgetId: string;
  breadcrumbs: Breadcrumb[];
  filters: Record<string, any>;
}

const useDrillDown = (widget: Widget) => {
  const [context, setContext] = useState<DrillDownContext>({
    widgetId: widget.id,
    breadcrumbs: [],
    filters: {}
  });

  const drillDown = useCallback((dimension: string, value: any, label: string) => {
    const newBreadcrumb = {
      level: context.breadcrumbs.length,
      dimension,
      value,
      label
    };

    setContext(prev => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, newBreadcrumb],
      filters: {
        ...prev.filters,
        [dimension]: value
      }
    }));

    // Fetch data for next level
    fetchDrillDownData(widget, newBreadcrumb.level + 1, {
      ...context.filters,
      [dimension]: value
    });
  }, [context, widget]);

  const drillUp = useCallback(() => {
    if (context.breadcrumbs.length === 0) return;

    const newBreadcrumbs = context.breadcrumbs.slice(0, -1);
    const removedCrumb = context.breadcrumbs[context.breadcrumbs.length - 1];

    const newFilters = { ...context.filters };
    delete newFilters[removedCrumb.dimension];

    setContext({
      widgetId: widget.id,
      breadcrumbs: newBreadcrumbs,
      filters: newFilters
    });
  }, [context, widget]);

  return { context, drillDown, drillUp };
};

// Example usage in chart component
const BarChartWidget = ({ widget, data }) => {
  const { context, drillDown } = useDrillDown(widget);

  const handleBarClick = (bar) => {
    if (!widget.drillDown?.enabled) return;

    const nextLevel = context.breadcrumbs.length;
    const levelConfig = widget.drillDown.levels[nextLevel];

    if (levelConfig) {
      drillDown(levelConfig.dimension, bar.key, bar.label);
    }
  };

  return (
    <ResponsiveBar
      data={data}
      onClick={handleBarClick}
      // ... other props
    />
  );
};
```

### Implementacion de Filtros Dinamicos

```typescript
const DashboardFilters = ({ dashboard, onFilterChange }) => {
  const [filters, setFilters] = useState(dashboard.globalFilters || {});

  const applyFilters = useCallback(() => {
    // Trigger re-fetch of all widget data with new filters
    dashboard.widgets.forEach(widget => {
      fetchWidgetData(widget, filters);
    });

    onFilterChange(filters);
  }, [filters, dashboard.widgets, onFilterChange]);

  const handleProjectFilter = (projectIds: string[]) => {
    setFilters(prev => ({ ...prev, projectIds }));
  };

  const handleDateRangeFilter = (from: Date, to: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { from, to }
    }));
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <FilterPanel>
      <MultiSelect
        label="Proyectos"
        options={allProjects}
        value={filters.projectIds}
        onChange={handleProjectFilter}
      />

      <DateRangePicker
        from={filters.dateRange?.from}
        to={filters.dateRange?.to}
        onChange={handleDateRangeFilter}
      />

      <ButtonGroup>
        <Button onClick={clearFilters}>Limpiar</Button>
        <Button variant="primary" onClick={applyFilters}>
          Aplicar Filtros
        </Button>
      </ButtonGroup>
    </FilterPanel>
  );
};
```

### Generacion de Exportaciones

```typescript
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

class DashboardExporter {
  async exportToPDF(dashboard: Dashboard, config: ExportConfig): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: config.options.orientation,
      unit: 'px',
      format: 'a4'
    });

    // Add title page
    pdf.setFontSize(24);
    pdf.text(dashboard.name, 40, 60);

    if (config.options.includeTimestamp) {
      pdf.setFontSize(12);
      pdf.text(`Generado: ${new Date().toLocaleString()}`, 40, 80);
    }

    // Add each widget as a new page
    const widgets = config.content.type === 'full'
      ? dashboard.widgets
      : dashboard.widgets.filter(w => config.content.widgetIds?.includes(w.id));

    for (const [index, widget] of widgets.entries()) {
      if (index > 0) pdf.addPage();

      const element = document.getElementById(`widget-${widget.id}`);
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 40, 40, 500, 350);

      // Add widget title
      pdf.setFontSize(16);
      pdf.text(widget.title, 40, 30);
    }

    return pdf.output('blob');
  }

  async exportToPowerPoint(dashboard: Dashboard, config: ExportConfig): Promise<Blob> {
    const pptx = new pptxgen();

    // Title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(dashboard.name, {
      x: 1, y: 2.5, w: 8, h: 1,
      fontSize: 36, bold: true, align: 'center'
    });

    if (config.options.includeTimestamp) {
      titleSlide.addText(`Generado: ${new Date().toLocaleString()}`, {
        x: 1, y: 4, w: 8, h: 0.5,
        fontSize: 14, align: 'center'
      });
    }

    // Widget slides
    const widgets = config.content.type === 'full'
      ? dashboard.widgets
      : dashboard.widgets.filter(w => config.content.widgetIds?.includes(w.id));

    for (const widget of widgets) {
      const slide = pptx.addSlide();
      slide.addText(widget.title, {
        x: 0.5, y: 0.5, w: 9, h: 0.75,
        fontSize: 24, bold: true
      });

      const element = document.getElementById(`widget-${widget.id}`);
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      slide.addImage({
        data: imgData,
        x: 0.5, y: 1.5, w: 9, h: 5
      });
    }

    const blob = await pptx.write({ outputType: 'blob' });
    return blob as Blob;
  }

  async exportToExcel(dashboard: Dashboard, config: ExportConfig): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    const widgets = config.content.type === 'full'
      ? dashboard.widgets
      : dashboard.widgets.filter(w => config.content.widgetIds?.includes(w.id));

    for (const widget of widgets) {
      const data = await fetchWidgetData(widget, dashboard.globalFilters);
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Sanitize sheet name (Excel max 31 chars, no special chars)
      const sheetName = widget.title.substring(0, 31).replace(/[:\\\/?*\[\]]/g, '');
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    return new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  async exportToPNG(dashboard: Dashboard): Promise<Blob> {
    const element = document.getElementById(`dashboard-${dashboard.id}`);
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      width: 1920,
      height: 1080
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
    });
  }
}

// Scheduled export job processor
class ScheduledExportProcessor {
  async processScheduledExports() {
    const now = new Date();
    const configs = await db.exportConfigs.findMany({
      where: {
        'schedule.enabled': true
      }
    });

    for (const config of configs) {
      if (this.shouldExecuteNow(config.schedule, now)) {
        await this.executeExport(config);
      }
    }
  }

  private shouldExecuteNow(schedule: any, now: Date): boolean {
    const [hour, minute] = schedule.time.split(':').map(Number);

    if (now.getHours() !== hour || now.getMinutes() !== minute) {
      return false;
    }

    switch (schedule.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return now.getDay() === schedule.dayOfWeek;
      case 'monthly':
        return now.getDate() === schedule.dayOfMonth;
      default:
        return false;
    }
  }

  private async executeExport(config: ExportConfig) {
    const job = await db.exportJobs.create({
      data: {
        dashboardId: config.dashboardId,
        configId: config.id,
        status: 'pending',
        format: config.format,
        createdBy: 'system'
      }
    });

    try {
      await db.exportJobs.update({
        where: { id: job.id },
        data: { status: 'processing' }
      });

      const dashboard = await db.dashboards.findUnique({
        where: { id: config.dashboardId },
        include: { widgets: true }
      });

      const exporter = new DashboardExporter();
      let blob: Blob;

      switch (config.format) {
        case 'pdf':
          blob = await exporter.exportToPDF(dashboard, config);
          break;
        case 'pptx':
          blob = await exporter.exportToPowerPoint(dashboard, config);
          break;
        case 'xlsx':
          blob = await exporter.exportToExcel(dashboard, config);
          break;
        case 'png':
          blob = await exporter.exportToPNG(dashboard);
          break;
      }

      const fileName = `${dashboard.name}_${format(new Date(), 'yyyy-MM-dd')}.${config.format}`;
      const filePath = await uploadToStorage(blob, fileName);

      await db.exportJobs.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          filePath,
          fileSize: blob.size,
          completedAt: new Date()
        }
      });

      // Send email to recipients
      if (config.schedule.recipients.length > 0) {
        await sendExportEmail(config.schedule.recipients, {
          subject: config.schedule.subject || `Dashboard: ${dashboard.name}`,
          body: config.schedule.body || 'Adjunto encontrará el reporte solicitado.',
          attachment: { fileName, filePath }
        });
      }

    } catch (error) {
      await db.exportJobs.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error: error.message
        }
      });
    }
  }
}

// Run scheduled exports every minute
setInterval(() => {
  const processor = new ScheduledExportProcessor();
  processor.processScheduledExports();
}, 60 * 1000);
```

### WebSocket para Actualizacion en Tiempo Real

```typescript
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

class DashboardRealtimeService {
  private io: Server;

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('subscribe-dashboard', (dashboardId: string) => {
        socket.join(`dashboard:${dashboardId}`);
        console.log(`Socket ${socket.id} subscribed to dashboard ${dashboardId}`);
      });

      socket.on('unsubscribe-dashboard', (dashboardId: string) => {
        socket.leave(`dashboard:${dashboardId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Called when widget data changes
  emitWidgetUpdate(dashboardId: string, widgetId: string, data: any) {
    this.io.to(`dashboard:${dashboardId}`).emit('widget-updated', {
      widgetId,
      data,
      timestamp: new Date()
    });
  }

  // Called when dashboard configuration changes
  emitDashboardUpdate(dashboardId: string, dashboard: Dashboard) {
    this.io.to(`dashboard:${dashboardId}`).emit('dashboard-updated', {
      dashboard,
      timestamp: new Date()
    });
  }
}

// Client-side hook
const useDashboardRealtime = (dashboardId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('subscribe-dashboard', dashboardId);

    newSocket.on('widget-updated', ({ widgetId, data, timestamp }) => {
      // Update widget data in state
      updateWidgetData(widgetId, data);

      // Show notification
      toast.info(`Widget actualizado: ${timestamp.toLocaleTimeString()}`);
    });

    newSocket.on('dashboard-updated', ({ dashboard, timestamp }) => {
      // Reload dashboard configuration
      loadDashboard(dashboard);
    });

    return () => {
      newSocket.emit('unsubscribe-dashboard', dashboardId);
      newSocket.close();
    };
  }, [dashboardId]);

  return socket;
};
```

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo de Producto
**Version:** 1.0
**Estado:** Listo para Revision
