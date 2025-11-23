# US-BI-003: Dashboards Personalizables con Widgets

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 20
**Story Points:** 8
**Prioridad:** Media-Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Gerente de Operaciones
**Quiero** crear dashboards personalizados con widgets arrastrables (drag & drop)
**Para** visualizar solo las metricas mas relevantes para mi rol y necesidades especificas

---

## Criterios de Aceptacion

### 1. Crear Nuevo Dashboard Personalizado
- [ ] Puedo acceder a "Mis Dashboards" desde el menu principal
- [ ] Puedo crear un nuevo dashboard con:
  - Nombre descriptivo (max 50 caracteres)
  - Descripcion opcional
  - Visibilidad: Privado / Compartido con equipo / Publico
  - Layout: 1 columna, 2 columnas, o 3 columnas
- [ ] El dashboard se guarda y aparece en mi lista de dashboards
- [ ] Puedo crear hasta 10 dashboards personalizados

### 2. Catalogo de Widgets Disponibles
- [ ] Veo un catalogo con widgets disponibles organizados por categoria:
  - **KPIs:** Metricas numericas individuales
  - **Graficas:** Lineas, barras, pastel, dona
  - **Tablas:** Tablas de datos con paginacion
  - **Mapas:** Mapas geograficos
  - **Alertas:** Panel de notificaciones
  - **Texto:** Notas y descripciones
- [ ] Cada widget muestra:
  - Icono representativo
  - Nombre del widget
  - Descripcion breve
  - Preview miniatura
- [ ] Puedo buscar widgets por nombre o categoria

### 3. Agregar Widgets al Dashboard (Drag & Drop)
- [ ] Puedo arrastrar un widget del catalogo al area del dashboard
- [ ] Al soltar el widget, se abre configuracion:
  - Titulo del widget
  - Fuente de datos (proyecto, periodo, filtros)
  - Parametros especificos del widget
  - Tamano (pequeno, mediano, grande)
- [ ] El widget se renderiza inmediatamente con datos reales
- [ ] Puedo agregar hasta 12 widgets por dashboard

### 4. Reorganizar Widgets (Drag & Drop)
- [ ] Puedo arrastrar widgets dentro del dashboard para reordenar
- [ ] Los widgets se ajustan automaticamente al soltar
- [ ] El layout se guarda automaticamente al hacer cambios
- [ ] Veo indicador visual de donde quedara el widget al mover
- [ ] El orden se mantiene entre sesiones

### 5. Redimensionar Widgets
- [ ] Puedo cambiar el tamano de cada widget:
  - Pequeno: 1x1 (para KPIs)
  - Mediano: 2x1 (para graficas pequenas)
  - Grande: 2x2 (para graficas complejas)
  - Extra Grande: 3x2 (para tablas)
- [ ] Los widgets se redimensionan con esquinas arrastrables
- [ ] Los demas widgets se ajustan automaticamente
- [ ] El tamano se guarda con el dashboard

### 6. Configurar Widgets Individualmente
- [ ] Puedo editar configuracion de cualquier widget haciendo clic en icono de engrane
- [ ] Opciones de configuracion comunes:
  - Titulo personalizado
  - Periodo de datos (hoy, semana, mes, trimestre, ano)
  - Filtros (proyecto, region, tipo)
  - Formato de numeros (moneda, porcentaje, entero)
  - Colores del tema
  - Mostrar/ocultar leyenda
- [ ] Los cambios se aplican en tiempo real
- [ ] Puedo duplicar un widget configurado

### 7. Widgets Especificos Disponibles
- [ ] **KPI Widget:** Muestra metrica unica con tendencia
- [ ] **Grafica de Avance:** Curva S de proyecto seleccionado
- [ ] **Top 5 Proyectos:** Ranking por criterio seleccionado
- [ ] **Semaforo de Salud:** Estado de multiples proyectos
- [ ] **Presupuesto vs Real:** Comparacion financiera
- [ ] **Distribucion de Costos:** Grafica de pastel
- [ ] **Calendario de Hitos:** Proximos eventos importantes
- [ ] **Mapa de Proyectos:** Ubicacion geografica con estado
- [ ] **Tabla de Pendientes:** Actividades por vencer
- [ ] **Alerta de Sobrecostos:** Proyectos con desviacion
- [ ] **Comparacion de Margenes:** Multi-proyecto
- [ ] **Timeline de Obra:** Diagrama Gantt compacto

### 8. Compartir y Duplicar Dashboards
- [ ] Puedo compartir un dashboard con:
  - Usuarios especificos (por email o rol)
  - Todo mi equipo
  - Toda la organizacion
- [ ] Los usuarios con acceso pueden:
  - Ver el dashboard (solo lectura)
  - Duplicar para crear su propia version
  - Recibir notificaciones de cambios
- [ ] Puedo revocar acceso en cualquier momento
- [ ] Puedo clonar un dashboard publico para personalizarlo

### 9. Vistas Predefinidas (Templates)
- [ ] El sistema incluye templates predefinidos:
  - **Dashboard Ejecutivo:** KPIs corporativos
  - **Dashboard de Proyecto:** Metricas de obra
  - **Dashboard Financiero:** Analisis de costos y margenes
  - **Dashboard de Operaciones:** Avances y productividad
- [ ] Puedo usar un template como punto de partida
- [ ] Puedo guardar mi dashboard como template para otros

### 10. Actualizacion y Refresh de Datos
- [ ] Los widgets se actualizan automaticamente cada 5 minutos
- [ ] Puedo forzar actualizacion manual con boton "Refresh"
- [ ] Veo timestamp de ultima actualizacion en cada widget
- [ ] Puedo configurar frecuencia de auto-refresh por dashboard

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Mis Dashboards                                    [+ Nuevo Dashboard]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ Dashboard: Mi Vista Ejecutiva ────────────────────────────────────────┐  │
│ │                                                                          │  │
│ │ [✏️ Editar] [🔄 Refresh] [⚙️ Configurar] [👥 Compartir] [⋮ Mas]         │  │
│ │                                                                          │  │
│ │ Modo Edicion: [ON]  |  Layout: [2 Columnas ▼]  |  [+ Agregar Widget]   │  │
│ │                                                                          │  │
│ │ ┌─────────────────────────────┬─────────────────────────────┐           │  │
│ │ │                             │                             │           │  │
│ │ │ 💰 Margen Promedio          │ 📈 Avance General           │           │  │
│ │ │                             │                             │           │  │
│ │ │        18.3%                │        67.5%                │           │  │
│ │ │      ↗ +1.2%                │      ↗ +3.2%                │           │  │
│ │ │                             │                             │           │  │
│ │ │ [⚙️]                  [⋮]   │ [⚙️]                  [⋮]   │           │  │
│ │ └─────────────────────────────┴─────────────────────────────┘           │  │
│ │                                                                          │  │
│ │ ┌───────────────────────────────────────────────────────────┐           │  │
│ │ │                                                            │           │  │
│ │ │ 📊 Evolucion de Costos - Ultimos 6 meses                  │           │  │
│ │ │                                                            │           │  │
│ │ │  $M                                                        │           │  │
│ │ │  60│                                  ╱─                   │           │  │
│ │ │  50│                            ╱────╯                     │           │  │
│ │ │  40│                      ╱────╯                           │           │  │
│ │ │  30│                ╱────╯                                 │           │  │
│ │ │  20│          ╱────╯                                       │           │  │
│ │ │  10│    ╱────╯                                             │           │  │
│ │ │   0└──────────────────────────────────────────             │           │  │
│ │ │     M   J   J   A   S   O   N                             │           │  │
│ │ │                                                            │           │  │
│ │ │ [⚙️]                                                 [⋮]   │           │  │
│ │ └───────────────────────────────────────────────────────────┘           │  │
│ │                                                                          │  │
│ │ ┌─────────────────────────────┬─────────────────────────────┐           │  │
│ │ │                             │                             │           │  │
│ │ │ 🚨 Alertas Criticas         │ 🏆 Top 3 Proyectos          │           │  │
│ │ │                             │                             │           │  │
│ │ │ 🔴 Vertical Ref: -8.2%      │ 1. El Bosque    🟢 89%      │           │  │
│ │ │ 🟡 Conjunto Nte: +8d        │ 2. Los Pinos    🟢 78%      │           │  │
│ │ │ 🔴 Alameda: Sin reporte     │ 3. Resid. Sur   🟢 62%      │           │  │
│ │ │                             │                             │           │  │
│ │ │ [⚙️]                  [⋮]   │ [⚙️]                  [⋮]   │           │  │
│ │ └─────────────────────────────┴─────────────────────────────┘           │  │
│ │                                                                          │  │
│ │ Ultima actualizacion: 18/11/2025 14:32                                  │  │
│ └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ ┌─ Catalogo de Widgets ───────────────────────────────────────────────────┐  │
│ │                                                                          │  │
│ │ Buscar: [____________]  Categoria: [Todas ▼]                            │  │
│ │                                                                          │  │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │  │
│ │ │ 💰 KPI   │ │ 📊 Graf. │ │ 📍 Mapa  │ │ 📋 Tabla │ │ 🚨 Alert │       │  │
│ │ │ Numerico │ │ Barras   │ │ Proyect. │ │ Datos    │ │ Critica  │       │  │
│ │ │          │ │          │ │          │ │          │ │          │       │  │
│ │ │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  │       │  │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │  │
│ │                                                                          │  │
│ │ [Ver mas widgets...]                                                    │  │
│ └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│                                    [💾 Guardar Dashboard] [❌ Cancelar]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. CREAR DASHBOARD PERSONALIZADO
   ↓
   Usuario → Mis Dashboards → [+ Nuevo Dashboard]
   ↓
   Formulario:
   - Nombre: "Mi Vista Ejecutiva"
   - Descripcion: "Dashboard para monitoreo diario"
   - Layout: 2 columnas
   - Visibilidad: Privado
   ↓
   [Crear] → Dashboard vacio en modo edicion

2. AGREGAR WIDGETS
   ↓
   Usuario ve catalogo de widgets
   ↓
   Arrastra "KPI - Margen Promedio" al dashboard
   ↓
   Modal de configuracion:
   - Titulo: "Margen Promedio"
   - Periodo: "Mes actual"
   - Proyectos: "Todos los activos"
   - Formato: "Porcentaje con 1 decimal"
   ↓
   [Guardar] → Widget se renderiza con datos

3. CONFIGURAR WIDGET
   ↓
   Usuario hace clic en icono de engrane del widget
   ↓
   Panel de configuracion se abre
   ↓
   Usuario cambia:
   - Periodo: "Ultimos 3 meses"
   - Mostrar tendencia: SI
   ↓
   Widget se actualiza en tiempo real

4. REORGANIZAR LAYOUT
   ↓
   Usuario arrastra widget "Evolucion Costos" a la parte superior
   ↓
   Otros widgets se reajustan automaticamente
   ↓
   Usuario suelta el mouse
   ↓
   Layout se guarda automaticamente

5. REDIMENSIONAR WIDGET
   ↓
   Usuario arrastra esquina inferior derecha de "Tabla de Proyectos"
   ↓
   Widget se expande a tamano "Extra Grande"
   ↓
   Widgets debajo se ajustan
   ↓
   Tamano se guarda

6. COMPARTIR DASHBOARD
   ↓
   Usuario hace clic en [👥 Compartir]
   ↓
   Modal:
   - Compartir con: [Equipo de Operaciones ▼]
   - Permisos: [Solo lectura ▼]
   - Notificar: [✓]
   ↓
   [Compartir] → Email enviado a equipo

7. USAR TEMPLATE
   ↓
   Usuario → [+ Nuevo Dashboard] → [Desde Template]
   ↓
   Lista de templates:
   - Dashboard Ejecutivo
   - Dashboard de Proyecto
   - Dashboard Financiero
   ↓
   Usuario selecciona "Dashboard Ejecutivo"
   ↓
   Dashboard se crea pre-configurado con widgets
   ↓
   Usuario personaliza segun necesidad
```

---

## Notas Tecnicas

### Arquitectura de Widgets

```typescript
// Interface base para widgets
interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  position: { x: number; y: number };
  config: WidgetConfig;
  dataSource: DataSource;
}

// Tipos de widgets disponibles
enum WidgetType {
  KPI = 'kpi',
  LineChart = 'line-chart',
  BarChart = 'bar-chart',
  PieChart = 'pie-chart',
  Table = 'table',
  Map = 'map',
  Alert = 'alert',
  Text = 'text',
  Calendar = 'calendar'
}

// Configuracion de widget KPI
interface KPIWidgetConfig {
  metric: string;            // 'margin', 'progress', 'cost'
  period: string;            // 'today', 'week', 'month', 'quarter'
  projects: string[];        // Array de IDs de proyectos
  format: 'currency' | 'percentage' | 'number';
  showTrend: boolean;
  trendPeriod: string;       // 'day', 'week', 'month'
  threshold?: {
    warning: number;
    critical: number;
  };
}

// Dashboard personalizado
interface CustomDashboard {
  id: string;
  userId: string;
  name: string;
  description: string;
  layout: '1col' | '2col' | '3col';
  visibility: 'private' | 'team' | 'public';
  widgets: Widget[];
  sharedWith: string[];      // Array de user IDs
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Endpoints Necesarios

```typescript
// Dashboards
POST   /api/dashboards                        // Crear dashboard
GET    /api/dashboards                        // Listar mis dashboards
GET    /api/dashboards/:id                    // Obtener dashboard
PUT    /api/dashboards/:id                    // Actualizar dashboard
DELETE /api/dashboards/:id                    // Eliminar dashboard
POST   /api/dashboards/:id/share              // Compartir dashboard
POST   /api/dashboards/:id/clone              // Clonar dashboard

// Widgets
POST   /api/dashboards/:id/widgets            // Agregar widget
PUT    /api/dashboards/:id/widgets/:widgetId  // Actualizar widget
DELETE /api/dashboards/:id/widgets/:widgetId  // Eliminar widget
PUT    /api/dashboards/:id/widgets/reorder    // Reordenar widgets

// Templates
GET    /api/dashboard-templates               // Listar templates
POST   /api/dashboards/from-template/:id      // Crear desde template

// Data para widgets
POST   /api/widgets/data                      // Obtener datos del widget
```

### Grid System para Drag & Drop

```typescript
// Sistema de grid responsivo
const GRID_SYSTEM = {
  columns: {
    '1col': 1,
    '2col': 2,
    '3col': 3
  },
  sizes: {
    small: { w: 1, h: 1 },      // 1x1
    medium: { w: 2, h: 1 },     // 2x1
    large: { w: 2, h: 2 },      // 2x2
    xlarge: { w: 3, h: 2 }      // 3x2
  },
  gap: 16,  // pixels entre widgets
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1280
  }
};

// Libreria recomendada: react-grid-layout
import GridLayout from 'react-grid-layout';

const layout = widgets.map(w => ({
  i: w.id,
  x: w.position.x,
  y: w.position.y,
  w: GRID_SYSTEM.sizes[w.size].w,
  h: GRID_SYSTEM.sizes[w.size].h
}));
```

---

## Definicion de "Done"

- [ ] CRUD completo de dashboards personalizados
- [ ] Catalogo de 12 widgets minimo implementados
- [ ] Funcionalidad drag & drop para agregar widgets
- [ ] Funcionalidad drag & drop para reorganizar
- [ ] Redimensionamiento de widgets funcional
- [ ] Configuracion individual de cada widget
- [ ] Sistema de compartir con permisos
- [ ] 4 templates predefinidos disponibles
- [ ] Auto-refresh cada 5 minutos
- [ ] Guardado automatico de cambios
- [ ] Responsive design para tablets
- [ ] Tests de integracion de widgets
- [ ] Documentacion de API de widgets
- [ ] Performance: dashboard con 12 widgets carga en <2s
- [ ] Validado con Gerentes de Operaciones

---

**Estimacion:** 8 Story Points
**Dependencias:** Requiere todos los modulos anteriores para fuentes de datos
**Fecha:** 2025-11-18
