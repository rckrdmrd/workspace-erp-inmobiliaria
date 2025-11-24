# US-BI-002: Analisis de Desempeno y Margenes

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 19
**Story Points:** 5
**Prioridad:** Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** CFO (Director Financiero)
**Quiero** analizar margenes de utilidad y rentabilidad por proyecto
**Para** identificar proyectos mas y menos rentables y tomar decisiones estrategicas de inversion

---

## Criterios de Aceptacion

### 1. Vista de Analisis de Margenes
- [ ] Puedo acceder al modulo "Analisis de Margenes" desde el menu de BI
- [ ] Veo una vista consolidada de todos los proyectos con sus margenes
- [ ] Puedo filtrar por:
  - Periodo (mes, trimestre, ano, rango personalizado)
  - Estado del proyecto (Activo, Completado, Todos)
  - Region geografica
  - Tipo de proyecto
  - Rango de presupuesto
- [ ] Los datos se actualizan en tiempo real al cambiar filtros

### 2. Tabla Comparativa de Rentabilidad
- [ ] Veo una tabla con todos los proyectos mostrando:
  - Nombre del proyecto
  - Presupuesto original
  - Costo real acumulado
  - Ingresos facturados
  - **Margen Bruto:** (Ingresos - Costos) / Ingresos * 100
  - **Margen Neto:** Considerando gastos indirectos
  - **ROI:** (Utilidad / Inversion) * 100
  - **Variacion vs Presupuesto:** % de desviacion
  - Estado financiero (semaforo)
- [ ] Puedo ordenar por cualquier columna
- [ ] Los margenes se resaltan con colores:
  - Verde: Margen > 20%
  - Amarillo: Margen 10-20%
  - Rojo: Margen < 10%

### 3. Grafica de Evolucion de Margenes
- [ ] Veo una grafica de lineas mostrando evolucion mensual de:
  - Margen bruto promedio
  - Margen neto promedio
  - ROI acumulado
- [ ] Puedo comparar hasta 5 proyectos simultaneamente
- [ ] Puedo seleccionar el periodo de analisis (6, 12, 24 meses)
- [ ] La grafica muestra linea de referencia del objetivo corporativo (ej: 18%)

### 4. Analisis de Costos por Categoria
- [ ] Veo un grafico de pastel o barras mostrando distribucion de costos:
  - Materiales (%)
  - Mano de obra (%)
  - Maquinaria y equipo (%)
  - Subcontratos (%)
  - Gastos indirectos (%)
- [ ] Puedo comparar la distribucion real vs presupuestada
- [ ] Puedo hacer drill-down a nivel de partida especifica
- [ ] Veo alertas si alguna categoria excede +15% lo presupuestado

### 5. Top Proyectos Rentables y No Rentables
- [ ] Veo dos listas lado a lado:
  - **Top 5 Mas Rentables:** Proyectos con mayor margen neto
  - **Top 5 Menos Rentables:** Proyectos con menor margen (o perdida)
- [ ] Cada proyecto muestra:
  - Nombre
  - Margen neto %
  - Utilidad/Perdida en $
  - Factor principal de exito/problema
- [ ] Puedo hacer clic para ver detalle del proyecto

### 6. Analisis de Variaciones
- [ ] Veo un panel mostrando variaciones clave:
  - **Variacion de Precio:** Cambios en costos unitarios vs presupuesto
  - **Variacion de Cantidad:** Cambios en volumenes ejecutados
  - **Variacion de Eficiencia:** Productividad real vs planeada
- [ ] Para cada tipo de variacion veo:
  - Monto total de variacion
  - % de impacto en el margen
  - Principales conceptos que contribuyen
  - Tendencia (mejorando/empeorando)

### 7. Proyecciones de Margen Final
- [ ] Veo una proyeccion del margen final esperado basado en:
  - % de avance actual
  - Tendencia de costos
  - Costos comprometidos pendientes
- [ ] Se muestran 3 escenarios:
  - **Optimista:** Mejor caso (90% confianza)
  - **Esperado:** Escenario mas probable (50% confianza)
  - **Pesimista:** Peor caso (10% confianza)
- [ ] Veo un grafico de embudo mostrando la proyeccion

### 8. Exportacion y Reportes
- [ ] Puedo exportar analisis completo a Excel con multiples hojas:
  - Resumen ejecutivo
  - Tabla comparativa
  - Evolucion temporal
  - Distribucion de costos
  - Top proyectos
- [ ] Puedo generar PDF ejecutivo con graficas
- [ ] Puedo programar envio mensual automatico al equipo financiero

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💰 Analisis de Margenes y Rentabilidad                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Filtros: [Periodo: 2025 ▼] [Estado: Activos ▼] [Region: Todas ▼]           │
│                                                                              │
│ ┌─ Resumen Consolidado ────────────────────────────────────────────────┐    │
│ │                                                                       │    │
│ │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│ │  │ Margen Bruto │  │ Margen Neto  │  │ ROI Promedio │  │ Utilidad │ │    │
│ │  │   Promedio   │  │   Promedio   │  │  Consolidado │  │   Total  │ │    │
│ │  │              │  │              │  │              │  │          │ │    │
│ │  │   🟢 22.5%   │  │   🟢 18.3%   │  │   🟢 21.7%   │  │ $44.5 M  │ │    │
│ │  │   ↗ +1.2%    │  │   ↗ +0.8%    │  │   ↗ +2.1%    │  │ ↗ +5.2M  │ │    │
│ │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─ Tabla Comparativa de Proyectos ────────────────────────────────────────┐ │
│ │                                                                          │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐    │ │
│ │ │Proyecto      │Presup.│Costo │Ingreso│Mar.B│Mar.N│ROI  │Var.│Est│    │ │
│ │ ├──────────────────────────────────────────────────────────────────┤    │ │
│ │ │Los Pinos     │$45.2M │$38.1M│$45.8M │17.8%│14.2%│20.3%│+2.1│🟢 │    │ │
│ │ │Vertical Ref. │$38.5M │$35.2M│$38.9M │ 9.5%│ 7.1%│10.5%│-8.2│🔴 │    │ │
│ │ │Resid. Sur    │$52.1M │$43.8M│$53.2M │17.7%│14.8%│21.5%│+1.5│🟢 │    │ │
│ │ │Conjunto Nte. │$28.7M │$26.1M│$29.1M │ 3.4%│ 2.1%│11.5%│+5.8│🟡 │    │ │
│ │ │El Bosque     │$41.9M │$34.2M│$42.5M │19.5%│16.3%│24.3%│+1.1│🟢 │    │ │
│ │ └──────────────────────────────────────────────────────────────────┘    │ │
│ │                                                                          │ │
│ │ Promedio:  Mar.Bruto: 22.5%  |  Mar.Neto: 18.3%  |  ROI: 21.7%         │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Evolucion de Margenes ───────────┬─ Distribucion de Costos ──────────┐  │
│ │                                    │                                    │  │
│ │  %                                 │      Distribucion Real vs Presup. │  │
│ │  25│                               │                                    │  │
│ │  20│   ╱─────╲                     │      Materiales      48%  [████]  │  │
│ │  15│  ╱       ╲─────╲              │      Presup: 45%     [███ ]       │  │
│ │  10│ ╱                ╲            │                                    │  │
│ │   5│╱                  ╲           │      Mano Obra       28%  [███]   │  │
│ │   0└─────────────────────────      │      Presup: 30%     [███ ]       │  │
│ │    E F M A M J J A S O N D         │                                    │  │
│ │                                    │      Subcontratos    15%  [██]    │  │
│ │  ─── Margen Bruto                  │      Presup: 15%     [██ ]        │  │
│ │  ─── Margen Neto                   │                                    │  │
│ │  ─── Objetivo (18%)                │      Indirectos       9%  [█]     │  │
│ │                                    │      Presup: 10%     [█ ]         │  │
│ └────────────────────────────────────┴────────────────────────────────────┘  │
│                                                                              │
│ ┌─ Top 5 Mas Rentables ──────────────┬─ Top 5 Menos Rentables ───────────┐  │
│ │                                     │                                    │  │
│ │ 1. El Bosque        🟢 16.3%        │ 1. Vertical Reforma  🔴  7.1%     │  │
│ │    Utilidad: $6.8M                  │    Utilidad: $2.7M                │  │
│ │    Factor: Eficiencia en MO         │    Factor: Sobrecosto materiales  │  │
│ │                                     │                                    │  │
│ │ 2. Residencial Sur  🟢 14.8%        │ 2. Conjunto Norte    🟡  2.1%     │  │
│ │    Utilidad: $7.7M                  │    Utilidad: $0.6M                │  │
│ │    Factor: Negociacion proveedores  │    Factor: Baja productividad     │  │
│ │                                     │                                    │  │
│ │ 3. Los Pinos        🟢 14.2%        │ 3. Proyecto Delta    🔴 -1.5%     │  │
│ │    Utilidad: $6.4M                  │    Perdida: -$0.5M                │  │
│ │    Factor: Economia escala          │    Factor: Retrabajos calidad     │  │
│ └─────────────────────────────────────┴────────────────────────────────────┘  │
│                                                                              │
│ ┌─ Proyeccion Margen Final ────────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │  Proyecto: Los Pinos (78% avance)                                        │ │
│ │                                                                           │ │
│ │      Optimista:  18.5%  [$8.4M]  ▓▓▓▓▓▓▓▓▓░                              │ │
│ │      Esperado:   16.2%  [$7.3M]  ▓▓▓▓▓▓▓▓░░                              │ │
│ │      Pesimista:  13.8%  [$6.2M]  ▓▓▓▓▓▓▓░░░                              │ │
│ │                                                                           │ │
│ │  Rango de confianza 90%: $6.2M - $8.4M                                   │ │
│ │  Tendencia actual: ↗ Mejorando (ultima semana costos -3%)                │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│                      [📥 Exportar Excel] [📄 PDF] [📧 Programar]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. ACCEDER AL ANALISIS DE MARGENES
   ↓
   Usuario (CFO/Gerente Financiero) → Menu BI → Analisis de Margenes
   ↓
   Sistema carga datos financieros de todos los proyectos

2. APLICAR FILTROS
   ↓
   Usuario selecciona periodo: "2025"
   Usuario filtra estado: "Activos"
   ↓
   Sistema re-calcula metricas para proyectos filtrados
   ↓
   KPIs y graficas se actualizan dinamicamente

3. ANALIZAR TABLA COMPARATIVA
   ↓
   Usuario ordena tabla por "Margen Neto" (descendente)
   ↓
   Sistema muestra proyectos desde mas rentable a menos rentable
   ↓
   Usuario identifica proyecto con margen bajo (Vertical Reforma: 7.1%)

4. INVESTIGAR CAUSAS
   ↓
   Usuario hace clic en "Vertical Reforma"
   ↓
   Sistema muestra detalle de distribucion de costos
   ↓
   Usuario ve que Materiales = 55% (presupuestado: 45%)
   ↓
   Usuario identifica sobrecosto en materiales como causa principal

5. REVISAR EVOLUCION
   ↓
   Usuario selecciona "Vertical Reforma" en grafica de evolucion
   ↓
   Sistema muestra tendencia: Margen inicio 12% → actual 7.1%
   ↓
   Usuario identifica que deterioro inicio hace 3 meses

6. ANALIZAR PROYECCION
   ↓
   Usuario selecciona "Proyeccion Margen Final"
   ↓
   Sistema calcula 3 escenarios basado en tendencia
   ↓
   Escenario pesimista: Margen final 5.2%
   ↓
   Usuario decide tomar acciones correctivas

7. EXPORTAR PARA JUNTA DIRECTIVA
   ↓
   Usuario hace clic en "Exportar PDF"
   ↓
   Sistema genera reporte ejecutivo con:
   - Resumen de margenes consolidados
   - Tabla comparativa completa
   - Graficas de evolucion y distribucion
   - Top proyectos rentables/no rentables
   - Proyecciones y recomendaciones
   ↓
   PDF se descarga para presentacion
```

---

## Notas Tecnicas

### Formulas de Calculo

```typescript
// 1. Margen Bruto
const margenBruto = ((ingresosTotales - costoDirecto) / ingresosTotales) * 100;

// 2. Margen Neto
const margenNeto = ((ingresosTotales - costoTotal - gastosIndirectos) / ingresosTotales) * 100;

// 3. ROI (Return on Investment)
const roi = ((utilidadNeta / inversionTotal) * 100);

// 4. Variacion de Presupuesto
const variacion = ((costoReal - presupuestoOriginal) / presupuestoOriginal) * 100;

// 5. Distribucion de Costos
const distribucion = {
  materiales: (costoMateriales / costoTotal) * 100,
  manoObra: (costoManoObra / costoTotal) * 100,
  subcontratos: (costoSubcontratos / costoTotal) * 100,
  indirectos: (gastosIndirectos / costoTotal) * 100
};

// 6. Proyeccion de Margen Final
function proyectarMargenFinal(proyecto) {
  const avance = proyecto.avanceFisico;
  const costoAcumulado = proyecto.costoReal;
  const presupuestoRestante = proyecto.presupuestoTotal - costoAcumulado;

  // Tendencia de costo por % de avance
  const costoPorPunto = costoAcumulado / avance;
  const costoProyectado = costoPorPunto * 100;

  // Escenarios
  const optimista = costoProyectado * 0.95;  // 5% mejor
  const esperado = costoProyectado;
  const pesimista = costoProyectado * 1.05;  // 5% peor

  return {
    optimista: calcularMargen(proyecto.ingresos, optimista),
    esperado: calcularMargen(proyecto.ingresos, esperado),
    pesimista: calcularMargen(proyecto.ingresos, pesimista)
  };
}
```

### Endpoints Necesarios

```typescript
GET    /api/analytics/margins                     // Vista principal
GET    /api/analytics/margins/comparative-table   // Tabla comparativa
GET    /api/analytics/margins/evolution           // Evolucion temporal
GET    /api/analytics/margins/cost-distribution   // Distribucion costos
GET    /api/analytics/margins/top-projects        // Top rentables
GET    /api/analytics/margins/projections/:id     // Proyecciones
GET    /api/analytics/margins/variances/:id       // Analisis variaciones
POST   /api/analytics/margins/export-excel        // Export Excel
POST   /api/analytics/margins/export-pdf          // Export PDF
```

### Reglas de Negocio

1. **Clasificacion de Semaforos:**
   - Verde: Margen neto >= 15%
   - Amarillo: Margen neto 10-14.9%
   - Rojo: Margen neto < 10%

2. **Alertas Automaticas:**
   - Alerta si margen < objetivo corporativo (18%)
   - Alerta si tendencia descendente >2% en ultimo mes
   - Alerta si proyeccion pesimista < 10%

3. **Calculo de Gastos Indirectos:**
   - Se asignan proporcionalmente segun presupuesto
   - Porcentaje configurable (default: 8%)

---

## Definicion de "Done"

- [ ] Vista de analisis de margenes accesible desde menu BI
- [ ] Filtros funcionales (periodo, estado, region, tipo)
- [ ] Tabla comparativa con 9 columnas de metricas
- [ ] Calculo correcto de margen bruto, neto y ROI
- [ ] Grafica de evolucion temporal con multiples proyectos
- [ ] Grafico de distribucion de costos (real vs presupuesto)
- [ ] Top 5 mas/menos rentables calculados correctamente
- [ ] Panel de proyecciones con 3 escenarios
- [ ] Exportacion a Excel con multiples hojas
- [ ] Exportacion a PDF ejecutivo con graficas
- [ ] Tests unitarios de formulas financieras
- [ ] Tests de integracion de endpoints
- [ ] Validacion con CFO y equipo financiero
- [ ] Documentacion de formulas y reglas de negocio

---

**Estimacion:** 5 Story Points
**Dependencias:** Requiere MAI-002 (Proyectos), MAI-003 (Costos)
**Fecha:** 2025-11-18
