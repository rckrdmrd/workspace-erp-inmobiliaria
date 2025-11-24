# US-BI-001: Dashboard Corporativo Multi-Proyecto

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 19
**Story Points:** 8
**Prioridad:** Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Director General
**Quiero** ver un dashboard consolidado de todos los proyectos en ejecucion
**Para** monitorear el portafolio completo con KPIs corporativos y detectar problemas rapidamente

---

## Criterios de Aceptacion

### 1. Vista Consolidada de Proyectos
- [ ] Puedo acceder al dashboard corporativo desde el menu principal
- [ ] Veo un resumen de todos los proyectos activos en una sola pantalla
- [ ] La informacion se actualiza en tiempo real (o con refresh manual)
- [ ] Puedo filtrar por:
  - Estado del proyecto (Activo, En pausa, Atrasado, Completado)
  - Region o zona geografica
  - Tipo de proyecto (Vertical, Horizontal)
  - Rango de fechas
- [ ] El dashboard carga en menos de 3 segundos

### 2. KPIs Corporativos Principales
- [ ] Visualizo los siguientes KPIs consolidados:
  - **Total de Proyectos:** Activos / Total
  - **Inversion Total:** Suma de todos los presupuestos
  - **Avance General:** % promedio ponderado por monto
  - **Margen Promedio:** % de utilidad consolidado
  - **Proyectos en Riesgo:** Cantidad con semaforo rojo
  - **Desviacion Presupuestal Total:** Variacion acumulada
  - **Tiempo Restante Promedio:** Dias para conclusion
  - **ROI Consolidado:** Retorno sobre inversion

### 3. Grafica de Distribucion de Proyectos
- [ ] Veo un grafico de dona o barras mostrando:
  - Distribucion por estado (Activo, Atrasado, En tiempo)
  - Distribucion por region
  - Distribucion por tipo de obra
- [ ] Puedo hacer clic en un segmento para filtrar la tabla de proyectos

### 4. Tabla Comparativa de Proyectos
- [ ] Veo una tabla con todos los proyectos mostrando:
  - Nombre del proyecto
  - Presupuesto total
  - Avance fisico %
  - Avance financiero %
  - Desviacion de costo (%, $)
  - Desviacion de tiempo (dias)
  - Semaforo de salud (Verde/Amarillo/Rojo)
  - Fecha estimada de termino
  - Responsable
- [ ] Puedo ordenar por cualquier columna
- [ ] Puedo hacer clic en un proyecto para ver su detalle

### 5. Mapa de Calor de Proyectos
- [ ] Veo un mapa geografico con marcadores de cada proyecto
- [ ] Los marcadores usan colores segun el estado de salud:
  - Verde: En tiempo y presupuesto
  - Amarillo: Desviacion menor (5-10%)
  - Rojo: Desviacion critica (>10%)
- [ ] Al hacer hover sobre un marcador veo:
  - Nombre del proyecto
  - Avance %
  - Desviacion principal
- [ ] Puedo hacer clic en un marcador para ir al detalle del proyecto

### 6. Grafica de Evolucion Temporal
- [ ] Veo una grafica de lineas mostrando la evolucion mensual de:
  - Inversion acumulada vs presupuesto
  - Avance fisico acumulado
  - Cantidad de proyectos activos
- [ ] Puedo seleccionar el rango de fechas (ultimos 3, 6, 12 meses)
- [ ] Puedo comparar el comportamiento real vs proyectado

### 7. Alertas y Notificaciones
- [ ] Veo un panel de alertas mostrando:
  - Proyectos con atraso >15 dias
  - Proyectos con sobrecosto >10%
  - Proyectos sin avance reportado en 7 dias
  - Proyectos proximos a terminar (ultimos 30 dias)
- [ ] Las alertas se ordenan por criticidad
- [ ] Puedo descartar o marcar alertas como revisadas

### 8. Exportacion y Compartir
- [ ] Puedo exportar el dashboard completo a PDF
- [ ] Puedo exportar la tabla de proyectos a Excel
- [ ] Puedo programar envio automatico semanal por email
- [ ] El PDF incluye graficas y tablas con fecha de generacion

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Dashboard Corporativo - Portafolio de Proyectos           🔄 Actualizar │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ KPIs Principales ────────────────────────────────────────────────────┐   │
│ │                                                                        │   │
│ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│ │  │ Proyectos   │  │ Inversion   │  │ Avance      │  │ Margen      │  │   │
│ │  │   Activos   │  │   Total     │  │  General    │  │  Promedio   │  │   │
│ │  │             │  │             │  │             │  │             │  │   │
│ │  │   15 / 18   │  │ $245.5 MDP  │  │   67.3 %    │  │   18.2 %    │  │   │
│ │  │   🟢 83%    │  │ ↑ 12% mes   │  │ ↗ +3.2%     │  │ ↗ +1.5%     │  │   │
│ │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│ │                                                                        │   │
│ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│ │  │ Proyectos   │  │ Desviacion  │  │ Tiempo      │  │ ROI         │  │   │
│ │  │  en Riesgo  │  │ Presupuesto │  │ Restante    │  │ Consolidado │  │   │
│ │  │             │  │             │  │             │  │             │  │   │
│ │  │   3 / 15    │  │  -$4.2 MDP  │  │  145 dias   │  │   21.4 %    │  │   │
│ │  │   🔴 20%    │  │ ↓ -1.7%     │  │ 📅 Jun 2026 │  │ ↗ +2.1%     │  │   │
│ │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│ └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│ ┌─ Distribucion de Proyectos ─────────────┬─ Evolucion Mensual ──────────┐  │
│ │                                          │                              │  │
│ │     Por Estado                           │  $MDP                        │  │
│ │                                          │  300│                        │  │
│ │        🟢 En Tiempo      60%             │  250│         ╱╲             │  │
│ │        🟡 Con Atraso     20%             │  200│       ╱    ╲           │  │
│ │        🔴 Critico        20%             │  150│     ╱        ╲─        │  │
│ │                                          │  100│   ╱                    │  │
│ │                    🔴 20%                │   50│ ╱                      │  │
│ │              ┌────────┐                  │    0└──────────────────────  │  │
│ │              │        │                  │      E F M A M J J A S O N D │  │
│ │       🟡 20% │  🟢    │                  │                              │  │
│ │          ┌───┤  60%   │                  │  ─── Presupuesto             │  │
│ │          │   │        │                  │  ─── Real                    │  │
│ │          └───┴────────┘                  │  ─── Avance %                │  │
│ └──────────────────────────────────────────┴──────────────────────────────┘  │
│                                                                              │
│ ┌─ Proyectos Activos ──────────────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ Filtros: [Estado: Todos ▼] [Region: Todas ▼] [Tipo: Todos ▼]            │ │
│ │                                                                           │ │
│ │ ┌────────────────────────────────────────────────────────────────────┐   │ │
│ │ │Proyecto         │Presup. │Av.Fis│Av.Fin│Desv.$│Desv.T│Estado│Resp.│   │ │
│ │ ├────────────────────────────────────────────────────────────────────┤   │ │
│ │ │Fracc.Los Pinos  │$45.2M  │ 78%  │ 75%  │+2.3% │ -5d  │ 🟢   │JGM  │   │ │
│ │ │Vertical Reforma │$38.5M  │ 45%  │ 50%  │-8.2% │+12d  │ 🔴   │MRG  │   │ │
│ │ │Residencial Sur  │$52.1M  │ 62%  │ 63%  │+1.5% │ -2d  │ 🟢   │APL  │   │ │
│ │ │Conjunto Norte   │$28.7M  │ 55%  │ 52%  │+5.8% │ +8d  │ 🟡   │LFH  │   │ │
│ │ │Fracc.El Bosque  │$41.9M  │ 89%  │ 87%  │+1.1% │ -3d  │ 🟢   │JGM  │   │ │
│ │ └────────────────────────────────────────────────────────────────────┘   │ │
│ │                                                                           │ │
│ │ Mostrando 5 de 15 proyectos                         [Ver todos →]        │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Alertas Criticas ───────────────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ 🔴 Vertical Reforma: Sobrecosto de $3.2M (8.2%)                          │ │
│ │ 🟡 Conjunto Norte: Atraso de 8 dias en ruta critica                      │ │
│ │ 🔴 Proyecto Alameda: Sin reporte de avance hace 10 dias                  │ │
│ │                                                                           │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│                    [📥 Exportar Excel] [📄 Exportar PDF] [⚙️ Configurar]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. ACCEDER AL DASHBOARD
   ↓
   Usuario (Director/Ejecutivo) → Login → Menu Principal → Dashboard Corporativo
   ↓
   Sistema carga datos agregados de todos los proyectos

2. VISUALIZAR KPIS
   ↓
   Backend ejecuta queries agregadas:
   - COUNT de proyectos por estado
   - SUM de presupuestos totales
   - AVG ponderado de avances
   - Calculos de desviaciones y ROI
   ↓
   Frontend renderiza tarjetas de KPI con datos actualizados
   ↓
   Se muestran indicadores de tendencia (↑↓)

3. INTERACTUAR CON GRAFICAS
   ↓
   Usuario hace clic en segmento del grafico de dona
   ↓
   Sistema filtra tabla de proyectos segun seleccion
   ↓
   Se actualizan KPIs para reflejar el filtro aplicado

4. ANALIZAR PROYECTOS ESPECIFICOS
   ↓
   Usuario hace clic en fila de tabla o marcador en mapa
   ↓
   Sistema redirige a dashboard especifico del proyecto
   ↓
   Contexto: desde dashboard corporativo

5. REVISAR ALERTAS
   ↓
   Usuario revisa panel de alertas
   ↓
   Hace clic en alerta especifica
   ↓
   Sistema navega al proyecto con problema
   ↓
   Usuario toma acciones correctivas

6. EXPORTAR REPORTE
   ↓
   Usuario selecciona "Exportar PDF"
   ↓
   Sistema genera PDF con:
   - Fecha y hora de generacion
   - KPIs actuales
   - Graficas (imagenes)
   - Tabla de proyectos completa
   ↓
   PDF se descarga automaticamente
```

---

## Notas Tecnicas

### Calculos de KPIs

```typescript
// 1. Avance General Ponderado
const avanceGeneral = projects.reduce((acc, p) => {
  return acc + (p.avanceFisico * p.presupuestoTotal);
}, 0) / totalPresupuesto;

// 2. Margen Promedio Consolidado
const margenPromedio = projects.reduce((acc, p) => {
  const margen = (p.presupuestoTotal - p.costoReal) / p.presupuestoTotal;
  return acc + (margen * p.presupuestoTotal);
}, 0) / totalPresupuesto;

// 3. Desviacion Presupuestal Total
const desviacionTotal = projects.reduce((acc, p) => {
  return acc + (p.costoReal - p.presupuestoOriginal);
}, 0);

// 4. ROI Consolidado
const roiConsolidado = ((totalIngresos - totalCostos) / totalCostos) * 100;

// 5. Semaforo de Salud del Proyecto
function calcularSemaforo(proyecto) {
  const desviacionCosto = Math.abs(proyecto.costoReal - proyecto.presupuesto) / proyecto.presupuesto;
  const desviacionTiempo = proyecto.diasAtraso;

  if (desviacionCosto > 0.10 || desviacionTiempo > 15) return 'ROJO';
  if (desviacionCosto > 0.05 || desviacionTiempo > 7) return 'AMARILLO';
  return 'VERDE';
}
```

### Endpoints Necesarios

```typescript
GET    /api/dashboard/corporate                 // Dashboard completo
GET    /api/dashboard/corporate/kpis            // Solo KPIs
GET    /api/dashboard/corporate/projects        // Tabla de proyectos
GET    /api/dashboard/corporate/alerts          // Alertas activas
GET    /api/dashboard/corporate/trends          // Evolucion temporal
POST   /api/dashboard/corporate/export-pdf     // Exportar a PDF
POST   /api/dashboard/corporate/export-excel   // Exportar a Excel
POST   /api/dashboard/corporate/schedule-email // Programar envio
```

### Consideraciones de Performance

1. **Cacheo de Datos:**
   - Los KPIs consolidados se cachean por 5 minutos
   - Se invalida cache al reportar nuevos avances
   - Redis para cacheo distribuido

2. **Queries Optimizadas:**
   - Uso de indices en columnas de filtrado
   - Queries agregadas en lugar de multiples consultas
   - Paginacion para tablas grandes

3. **Lazy Loading:**
   - El mapa geografico se carga solo si el usuario hace scroll
   - Las graficas se renderizan bajo demanda
   - Imagenes optimizadas en formato WebP

---

## Definicion de "Done"

- [ ] Dashboard corporativo accesible desde menu principal
- [ ] 8 KPIs principales calculados y mostrados correctamente
- [ ] Graficas de distribucion y evolucion implementadas
- [ ] Tabla de proyectos con ordenamiento y filtros
- [ ] Mapa de calor geografico funcional
- [ ] Panel de alertas con reglas de negocio definidas
- [ ] Exportacion a PDF con todos los elementos
- [ ] Exportacion a Excel de tabla de proyectos
- [ ] Tiempo de carga < 3 segundos con 50 proyectos
- [ ] Responsive design para tablet
- [ ] Tests unitarios de calculos de KPIs
- [ ] Tests de integracion de endpoints
- [ ] Documentacion de API actualizada
- [ ] Aprobado por Director General y CFO

---

**Estimacion:** 8 Story Points
**Dependencias:** Requiere MAI-002 (Proyectos), MAI-003 (Costos), MAI-005 (Avances)
**Fecha:** 2025-11-18
