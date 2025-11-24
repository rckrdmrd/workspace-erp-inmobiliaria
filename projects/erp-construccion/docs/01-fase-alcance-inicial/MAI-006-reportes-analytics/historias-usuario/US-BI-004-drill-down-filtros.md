# US-BI-004: Navegacion Drill-Down y Filtros Dinamicos

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 20
**Story Points:** 5
**Prioridad:** Media
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Analista de BI
**Quiero** navegar desde vistas consolidadas hasta el detalle granular con drill-down
**Para** explorar datos con diferentes niveles de profundidad y encontrar insights especificos

---

## Criterios de Aceptacion

### 1. Navegacion Drill-Down Multi-Nivel
- [ ] Puedo hacer clic en cualquier metrica agregada para ver su detalle
- [ ] La navegacion soporta hasta 5 niveles de profundidad:
  - **Nivel 1:** Corporativo (todos los proyectos)
  - **Nivel 2:** Por proyecto individual
  - **Nivel 3:** Por partida o fase de obra
  - **Nivel 4:** Por concepto especifico
  - **Nivel 5:** Transacciones individuales
- [ ] Cada nivel muestra datos relevantes al contexto
- [ ] El cambio de nivel es instantaneo (<500ms)

### 2. Breadcrumbs de Navegacion
- [ ] Veo breadcrumbs mostrando mi ruta de navegacion actual:
  ```
  Inicio > Proyectos > Los Pinos > Estructura > Cimentacion > Detalle
  ```
- [ ] Puedo hacer clic en cualquier nivel del breadcrumb para regresar
- [ ] Los filtros activos se mantienen al navegar por breadcrumbs
- [ ] El breadcrumb se actualiza automaticamente al cambiar de nivel

### 3. Filtros Globales Dinamicos
- [ ] Veo un panel de filtros siempre visible con opciones:
  - **Periodo:** Fecha inicio y fin, o presets (Hoy, Semana, Mes, Trimestre, Ano, Custom)
  - **Proyectos:** Multi-select de proyectos
  - **Region:** Multi-select de regiones geograficas
  - **Tipo de Obra:** Vertical, Horizontal, Remodelacion
  - **Estado:** Activo, Pausado, Completado, Cancelado
  - **Responsable:** Multi-select de directores/gerentes
- [ ] Los filtros se aplican en tiempo real sin necesidad de boton "Aplicar"
- [ ] Los filtros persisten entre vistas y niveles de drill-down
- [ ] Puedo guardar combinaciones de filtros como "Vistas guardadas"

### 4. Contador de Registros y Resumen
- [ ] Veo un contador mostrando cuantos registros cumplen los filtros actuales:
  ```
  Mostrando 347 de 1,250 proyectos
  ```
- [ ] Veo un resumen de los valores agregados con filtros aplicados:
  - Total presupuesto filtrado
  - Promedio de avance
  - Suma de desviaciones
- [ ] El resumen se actualiza en tiempo real al cambiar filtros

### 5. Filtros Contextuales por Columna
- [ ] Puedo hacer clic en encabezado de columna para filtrar:
  - **Numericos:** Rangos, mayor/menor que, entre valores
  - **Texto:** Contiene, empieza con, termina con
  - **Fechas:** Antes/despues de, entre fechas, ultimos N dias
  - **Categoricos:** Multi-select de opciones unicas
- [ ] Los filtros de columna se combinan con filtros globales (AND)
- [ ] Veo icono indicando que columna tiene filtro activo
- [ ] Puedo limpiar filtro de columna individual

### 6. Segmentacion Avanzada
- [ ] Puedo crear segmentos personalizados con condiciones multiples:
  ```
  Segmento: "Proyectos en Riesgo"
  - Desviacion costo > 10% AND
  - Avance < 50% AND
  - Dias restantes < 60
  ```
- [ ] Puedo guardar segmentos para reutilizar
- [ ] Puedo compartir segmentos con mi equipo
- [ ] Los segmentos guardados aparecen como filtros rapidos

### 7. Drill-Down desde Graficas
- [ ] Puedo hacer clic en barra de grafica de barras para ver detalle
- [ ] Puedo hacer clic en segmento de grafica de pastel para filtrar
- [ ] Puedo hacer clic en punto de grafica de lineas para ver ese periodo
- [ ] Al hacer drill-down, la grafica se actualiza al nuevo nivel
- [ ] Puedo volver al nivel anterior con boton "Volver"

### 8. Exportacion con Filtros Aplicados
- [ ] Puedo exportar datos con filtros activos aplicados
- [ ] El archivo exportado incluye nota de filtros usados
- [ ] Puedo exportar:
  - Vista actual (datos visibles en pantalla)
  - Todos los datos filtrados (incluyendo datos paginados)
  - Nivel de detalle seleccionado
- [ ] El nombre del archivo incluye timestamp y descripcion de filtros

### 9. Historial de Navegacion
- [ ] Puedo ver mi historial de navegacion reciente (ultimas 10 vistas)
- [ ] Cada entrada muestra:
  - Ruta de breadcrumbs
  - Filtros aplicados
  - Timestamp
- [ ] Puedo hacer clic en entrada del historial para regresar a esa vista exacta
- [ ] El historial se guarda en sesion del navegador

### 10. Performance con Grandes Volumenes
- [ ] El sistema maneja eficientemente hasta 100,000 registros
- [ ] Uso de paginacion virtual para tablas grandes
- [ ] Los filtros se aplican en backend (no filtrado en frontend)
- [ ] Indicador de carga mientras se aplican filtros complejos
- [ ] Cache de resultados de filtros frecuentes

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Analisis de Proyectos                                    🔍 Busqueda     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ Breadcrumbs ────────────────────────────────────────────────────────────┐│
│ │ Inicio > Proyectos > Los Pinos > Estructura                     [⬅️ Volver]│
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Filtros Globales ───────────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ Periodo:  [📅 01/01/2025] - [📅 31/12/2025]  [Mes actual ▼]              ││
│ │                                                                           ││
│ │ Proyectos: [Los Pinos] [Vertical Reforma] [+ 3 mas...]  [Seleccionar ▼] ││
│ │                                                                           ││
│ │ Region: [Norte ✓] [Sur ✓] [Centro ✓] [Oeste ✓]                          ││
│ │                                                                           ││
│ │ Estado: [🟢 Activos ✓] [🟡 En Pausa] [✅ Completados]                     ││
│ │                                                                           ││
│ │ [💾 Guardar Vista] [🗑️ Limpiar Filtros] [⭐ Vistas Guardadas ▼]          ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Resumen Filtrado ───────────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ Mostrando: 5 de 18 proyectos  |  Total Presup: $207.4M  |  Avance: 68.2% ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Datos - Nivel: Partidas de "Los Pinos" ────────────────────────────────┐ │
│ │                                                                           │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐     │ │
│ │ │Partida       🔽│Presupuesto🔽│Real     🔽│Desv.%🔽│Avance🔽│Accion│     │ │
│ │ ├──────────────────────────────────────────────────────────────────┤     │ │
│ │ │Preliminares    │ $2,450,000  │$2,398,000│ -2.1% │ 100%  │[📊]  │ ← Drill│ │
│ │ │Cimentacion     │ $8,750,000  │$8,892,000│ +1.6% │ 100%  │[📊]  │     │ │
│ │ │Estructura      │$15,200,000  │$12,450,000│-18.1%│  82%  │[📊]  │ ← Click│ │
│ │ │Albañileria     │ $9,500,000  │ $6,120,000│-35.6%│  64%  │[📊]  │     │ │
│ │ │Instalaciones   │ $6,300,000  │ $2,450,000│-61.1%│  39%  │[📊]  │     │ │
│ │ │Acabados        │ $3,000,000  │   $0      │  0%   │   0%  │[📊]  │     │ │
│ │ └──────────────────────────────────────────────────────────────────┘     │ │
│ │                                                                           │ │
│ │ Pagina 1 de 1  [20 por pagina ▼]                                         │ │
│ │                                                                           │ │
│ │ Filtros de columna activos: Avance > 50% ✓  [Limpiar]                    │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Drill-Down al hacer click en "Estructura" ─────────────────────────────┐ │
│ │                                                                           │ │
│ │ Breadcrumb actualizado:                                                  │ │
│ │ Inicio > Proyectos > Los Pinos > Estructura > [Conceptos]                │ │
│ │                                                                           │ │
│ │ Mostrando: 24 conceptos de partida "Estructura"                          │ │
│ │                                                                           │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐     │ │
│ │ │Concepto         │Cantidad│Unidad│PU     │Importe │Real    │Desv.│     │ │
│ │ ├──────────────────────────────────────────────────────────────────┤     │ │
│ │ │Acero fy=4200    │ 85.5 t │  ton │$18,500│$1,581,750│$1,623,000│+2.6│  │ │
│ │ │Concreto f'c=250 │ 420 m³ │  m³  │$2,100 │  $882,000│  $856,000│-2.9│  │ │
│ │ │Cimbra contacto  │1,850 m²│  m²  │$185   │  $342,250│  $335,000│-2.1│  │ │
│ │ └──────────────────────────────────────────────────────────────────┘     │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Segmentos Guardados ────────────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ [⭐ Proyectos en Riesgo]  [⭐ Alto Rendimiento]  [⭐ Proximos a Terminar] │ │
│ │                                                                           │ │
│ │ [+ Crear Nuevo Segmento]                                                 │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│                    [📥 Exportar con Filtros] [🔄 Actualizar] [⚙️ Config]     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. USUARIO ACCEDE A VISTA CORPORATIVA
   ↓
   Dashboard Corporativo → Tabla de Proyectos
   ↓
   Se muestran todos los proyectos (Nivel 1)
   Breadcrumb: [Inicio > Proyectos]

2. APLICAR FILTROS GLOBALES
   ↓
   Usuario selecciona:
   - Periodo: "Q4 2025"
   - Estado: "Activos"
   - Region: "Norte, Sur"
   ↓
   Sistema ejecuta query con filtros
   ↓
   Tabla se actualiza mostrando 5 de 18 proyectos
   ↓
   Resumen se actualiza: Total Presup: $207.4M

3. DRILL-DOWN A PROYECTO ESPECIFICO
   ↓
   Usuario hace clic en fila "Los Pinos"
   ↓
   Sistema navega a Nivel 2 (Detalle de Proyecto)
   ↓
   Breadcrumb: [Inicio > Proyectos > Los Pinos]
   ↓
   Se muestran partidas del proyecto
   ↓
   Filtros globales se mantienen activos

4. DRILL-DOWN A PARTIDA
   ↓
   Usuario hace clic en "Estructura"
   ↓
   Sistema navega a Nivel 3 (Conceptos de Partida)
   ↓
   Breadcrumb: [Inicio > Proyectos > Los Pinos > Estructura]
   ↓
   Se muestran 24 conceptos de la partida

5. APLICAR FILTRO DE COLUMNA
   ↓
   Usuario hace clic en icono de filtro en columna "Desviacion"
   ↓
   Selecciona: "Mayor a 5%"
   ↓
   Tabla se filtra mostrando solo conceptos con desv > 5%
   ↓
   Icono de filtro activo aparece en columna

6. GUARDAR SEGMENTO
   ↓
   Usuario hace clic en [+ Crear Segmento]
   ↓
   Modal:
   - Nombre: "Sobrecostos Criticos"
   - Condiciones:
     * Desviacion > 10%
     * Avance > 50%
   ↓
   [Guardar] → Segmento disponible en filtros rapidos

7. NAVEGAR CON BREADCRUMBS
   ↓
   Usuario hace clic en "Los Pinos" en breadcrumb
   ↓
   Sistema regresa a Nivel 2 (Partidas del proyecto)
   ↓
   Filtros se mantienen
   ↓
   Vista se restaura instantaneamente

8. EXPORTAR DATOS FILTRADOS
   ↓
   Usuario hace clic en [Exportar con Filtros]
   ↓
   Modal:
   - Nivel a exportar: [Nivel actual ▼]
   - Formato: [Excel ▼]
   - Incluir graficas: [✓]
   ↓
   Sistema genera archivo:
   "Proyectos_Norte_Sur_Q4_2025_20251118.xlsx"
   ↓
   Archivo incluye nota de filtros aplicados
```

---

## Notas Tecnicas

### Estructura de Niveles de Drill-Down

```typescript
// Jerarquia de navegacion
const drillDownLevels = {
  level1: {
    name: 'Corporativo',
    entity: 'projects',
    endpoint: '/api/analytics/projects',
    columns: ['name', 'budget', 'progress', 'margin', 'status'],
    drillDownTo: 'level2'
  },
  level2: {
    name: 'Proyecto',
    entity: 'budget-items',
    endpoint: '/api/analytics/projects/:id/budget-items',
    columns: ['item', 'budget', 'actual', 'variance', 'progress'],
    drillDownTo: 'level3'
  },
  level3: {
    name: 'Partida',
    entity: 'concepts',
    endpoint: '/api/analytics/budget-items/:id/concepts',
    columns: ['concept', 'quantity', 'unit', 'unit-price', 'amount', 'actual'],
    drillDownTo: 'level4'
  },
  level4: {
    name: 'Concepto',
    entity: 'transactions',
    endpoint: '/api/analytics/concepts/:id/transactions',
    columns: ['date', 'document', 'quantity', 'price', 'amount', 'status'],
    drillDownTo: 'level5'
  },
  level5: {
    name: 'Transaccion',
    entity: 'transaction-detail',
    endpoint: '/api/analytics/transactions/:id',
    columns: ['field', 'value'],
    drillDownTo: null
  }
};
```

### Sistema de Filtros

```typescript
// Estructura de filtros
interface FilterState {
  global: GlobalFilters;
  columns: ColumnFilters;
  segments: Segment[];
  breadcrumbs: Breadcrumb[];
}

interface GlobalFilters {
  period: {
    start: Date;
    end: Date;
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  };
  projects: string[];       // Array de project IDs
  regions: string[];
  types: string[];
  status: string[];
  responsibles: string[];
}

interface ColumnFilter {
  column: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'contains' | 'in';
  value: any;
}

interface Segment {
  id: string;
  name: string;
  conditions: ColumnFilter[];
  operator: 'AND' | 'OR';
  isShared: boolean;
  createdBy: string;
}

// Aplicacion de filtros
function buildQuery(filters: FilterState, level: string): QueryParams {
  const query = {
    ...filters.global,
    columnFilters: filters.columns,
    level: level
  };

  // Aplicar segmento si esta activo
  if (filters.activeSegment) {
    query.segment = filters.activeSegment.conditions;
  }

  return query;
}
```

### Endpoints Necesarios

```typescript
// Navegacion drill-down
GET    /api/analytics/drill-down/projects                    // Nivel 1
GET    /api/analytics/drill-down/projects/:id/budget-items   // Nivel 2
GET    /api/analytics/drill-down/budget-items/:id/concepts   // Nivel 3
GET    /api/analytics/drill-down/concepts/:id/transactions   // Nivel 4
GET    /api/analytics/drill-down/transactions/:id            // Nivel 5

// Filtros
POST   /api/analytics/filters/apply                          // Aplicar filtros
POST   /api/analytics/filters/save                           // Guardar vista
GET    /api/analytics/filters/saved                          // Obtener vistas guardadas

// Segmentos
POST   /api/analytics/segments                               // Crear segmento
GET    /api/analytics/segments                               // Listar segmentos
PUT    /api/analytics/segments/:id                           // Actualizar segmento
DELETE /api/analytics/segments/:id                           // Eliminar segmento

// Exportacion
POST   /api/analytics/export                                 // Exportar con filtros
```

### Optimizacion de Performance

```typescript
// 1. Queries optimizadas con indices
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_region ON projects(region);
CREATE INDEX idx_budget_items_project ON budget_items(project_id);

// 2. Cache de resultados frecuentes
const cacheKey = `analytics:${level}:${hash(filters)}`;
const cachedResult = await redis.get(cacheKey);
if (cachedResult) return JSON.parse(cachedResult);

// 3. Paginacion virtual para grandes datasets
const pagination = {
  limit: 100,
  offset: page * 100,
  totalCount: await countTotal(filters)
};

// 4. Lazy loading de detalles
const basicData = await fetchBasicColumns(filters);
// Detalles adicionales se cargan bajo demanda
```

---

## Definicion de "Done"

- [ ] Navegacion drill-down funcional con 5 niveles
- [ ] Breadcrumbs mostrando ruta de navegacion
- [ ] Filtros globales con 6 categorias minimo
- [ ] Filtros aplicandose en tiempo real (<500ms)
- [ ] Filtros contextuales por columna funcionales
- [ ] Sistema de segmentos con CRUD completo
- [ ] Contador de registros filtrados
- [ ] Resumen de valores agregados
- [ ] Drill-down desde graficas implementado
- [ ] Exportacion con filtros aplicados
- [ ] Historial de navegacion (10 entradas)
- [ ] Performance con 100k registros validada
- [ ] Tests de integracion de filtros
- [ ] Tests de performance de queries
- [ ] Documentacion de API completa
- [ ] Validado con Analistas de BI

---

**Estimacion:** 5 Story Points
**Dependencias:** Requiere US-BI-001 (Dashboard Corporativo)
**Fecha:** 2025-11-18
