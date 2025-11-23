# US-PROG-007: Dashboard Ejecutivo en Tiempo Real

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 18
**Story Points:** 8
**Prioridad:** Alta
**Asignado a:** Backend + Frontend + BI

---

## Historia de Usuario

**Como** Director General
**Quiero** visualizar el dashboard ejecutivo con KPIs en tiempo real
**Para** monitorear el estado de todos los proyectos y tomar decisiones informadas

---

## Criterios de Aceptación

### 1. Vista General de Proyectos ✅
- [ ] Puedo ver tarjetas de todos mis proyectos activos
- [ ] Cada tarjeta muestra:
  ```
  Fracc. Los Pinos
  ─────────────────────────────
  Avance Físico:    85%  🟡 -7%
  Avance Financiero: 82%  ✓ -3%
  Tiempo:           45%  ✓ OK
  SPI: 0.923  |  CPI: 0.947
  Alertas: 3 🔴 | 5 🟡
  ```
- [ ] El color indica estado:
  - Verde: Todo bien (dentro de umbrales)
  - Amarillo: Advertencia (desviación 5-10%)
  - Rojo: Crítico (desviación >10%)
- [ ] Puedo hacer clic para ver detalle del proyecto

### 2. KPIs Principales ✅
- [ ] Veo panel con indicadores clave:
  - **Avance Físico:** % de avance real vs programado
  - **Avance Financiero:** Costo ejecutado vs presupuesto
  - **Tiempo Transcurrido:** % del plazo utilizado
  - **SPI (Schedule Performance Index):** EV/PV
  - **CPI (Cost Performance Index):** EV/AC
  - **Varianza de Costo:** EV - AC
  - **Varianza de Tiempo:** EV - PV
- [ ] Cada indicador muestra:
  - Valor actual
  - Tendencia (↑ mejorando, → estable, ↓ empeorando)
  - Comparación vs mes anterior
  - Color según umbral

### 3. Curva S en Tiempo Real ✅
- [ ] Veo gráfica de Curva S actualizada automáticamente
- [ ] Dos líneas:
  - Azul: Programado (baseline)
  - Roja: Real (actualizado con últimos avances)
- [ ] Puedo seleccionar rango de fechas
- [ ] Puedo comparar múltiples proyectos en la misma gráfica
- [ ] Veo punto actual con tooltip mostrando:
  - Fecha
  - % Programado
  - % Real
  - Desviación

### 4. Mapa de Calor de Unidades ✅
- [ ] Veo mapa de calor visual del proyecto
- [ ] Cada unidad/lote se representa como un bloque con color:
  - Verde: 100% completado
  - Amarillo: 50-99% en progreso
  - Rojo: 0-49% atrasado
  - Gris: No iniciado
- [ ] Puedo hacer hover para ver detalle:
  ```
  Lote 23 - Manzana A
  Avance: 85%
  Última actualización: 15/Ene/25
  Días de retraso: 3
  ```
- [ ] Puedo hacer clic para ver detalle completo de la unidad

### 5. Alertas y Notificaciones ✅
- [ ] Veo panel de alertas categorizadas:
  - 🔴 Críticas (3): Requieren atención inmediata
  - 🟡 Advertencias (5): Monitoreo necesario
  - ℹ️ Informativas (12): Solo para conocimiento
- [ ] Para cada alerta veo:
  - Tipo: Retraso en actividad, sobrecosto, falta de material
  - Proyecto/actividad afectada
  - Descripción breve
  - Fecha de generación
  - Estado: Nueva, Reconocida, Resuelta
- [ ] Puedo hacer clic para ver detalle y tomar acción
- [ ] Puedo marcar alertas como "reconocidas"

### 6. Productividad de Cuadrillas ✅
- [ ] Veo ranking de cuadrillas por eficiencia:
  ```
  Top 5 Cuadrillas:
  1. Estructura 1   →  112%  ↑ +5%
  2. Acabados 3     →  108%  ↑ +2%
  3. Cimiento 2     →  105%  → 0%
  4. Instalaciones 1→  98%   ↓ -3%
  5. Estructura 2   →  95%   ↓ -7%
  ```
- [ ] Eficiencia = (Producción Real / Producción Planificada) × 100
- [ ] Puedo ver detalle por cuadrilla:
  - Actividades asignadas
  - Producción diaria/semanal
  - Horas-hombre trabajadas
  - Rendimiento vs estándar

### 7. Widgets Configurables ✅
- [ ] Puedo personalizar mi dashboard arrastrando widgets
- [ ] Widgets disponibles:
  - Curva S
  - KPIs principales
  - Mapa de calor
  - Alertas
  - Productividad
  - Calidad (% compliance)
  - Costos
  - Cronograma
- [ ] Puedo redimensionar widgets
- [ ] Puedo ocultar/mostrar widgets
- [ ] Mi configuración se guarda automáticamente

### 8. Actualizaciones en Tiempo Real ✅
- [ ] El dashboard se actualiza automáticamente vía WebSocket
- [ ] Cuando se aprueba un avance, veo actualización instantánea:
  - KPIs se recalculan
  - Curva S se actualiza
  - Mapa de calor cambia de color
- [ ] Veo badge de "Actualizado hace 2 minutos"
- [ ] Puedo forzar refresh manual con botón

### 9. Exportación y Reportes ✅
- [ ] Puedo exportar el dashboard completo como PDF
- [ ] Puedo programar envío automático de reporte ejecutivo:
  - Frecuencia: Diario, Semanal, Mensual
  - Destinatarios: Lista de emails
  - Incluir: Qué widgets/secciones
- [ ] El PDF incluye:
  - Snapshot de todos los widgets
  - Gráficas en alta resolución
  - Tablas de datos
  - Timestamp de generación

---

## Mockup / Wireframe

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 📊 Dashboard Ejecutivo                     🔔(8)  👤 Juan Pérez  [⚙️]     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Mis Proyectos (3)    [Ver Todos]           Actualizado hace 2 min [🔄]    │
│                                                                             │
│ ┌───────────────┬───────────────┬───────────────┐                          │
│ │ Fracc. Pinos  │ Residencial   │ Torres del    │                          │
│ │ 50 viviendas  │ Valle Verde   │ Sol           │                          │
│ │               │ 120 deptos    │ 80 deptos     │                          │
│ │ Avance: 85% 🟡│ Avance: 92% ✓ │ Avance: 45% 🔴│                          │
│ │ SPI: 0.92     │ SPI: 1.05     │ SPI: 0.78     │                          │
│ │ CPI: 0.95     │ CPI: 1.02     │ CPI: 0.88     │                          │
│ │ 🔴 3 | 🟡 5   │ 🟡 2          │ 🔴 7 | 🟡 12  │                          │
│ └───────────────┴───────────────┴───────────────┘                          │
│                                                                             │
│ ═══════════════════════════════════════════════════════════════════════════ │
│                       Fracc. Los Pinos - Detalle                            │
│ ═══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│ ┌─ KPIs Principales ──────────────────────────────────────────────────┐    │
│ │                                                                      │    │
│ │ ┌──────────────┬──────────────┬──────────────┬──────────────┐       │    │
│ │ │ Avance Físico│Avance Financ.│ Tiempo Trans.│     SPI      │       │    │
│ │ ├──────────────┼──────────────┼──────────────┼──────────────┤       │    │
│ │ │    85%       │    82%       │    45%       │   0.923      │       │    │
│ │ │  🟡 -7%     │  ✓ -3%      │  ✓ OK       │  🔴 Atrás   │       │    │
│ │ │  ↓ -2%      │  → 0%       │  → 0%       │  ↓ -0.05    │       │    │
│ │ └──────────────┴──────────────┴──────────────┴──────────────┘       │    │
│ │                                                                      │    │
│ │ ┌──────────────┬──────────────┬──────────────┬──────────────┐       │    │
│ │ │     CPI      │   Var. Costo │  Var. Tiempo │   BAC/EAC    │       │    │
│ │ ├──────────────┼──────────────┼──────────────┼──────────────┤       │    │
│ │ │   0.947      │   -$800K     │   -$700K     │ $16.8M/$17.7M│       │    │
│ │ │  🟡 OK      │  🔴 Sobre   │  🔴 Atrás   │  🔴 +5.6%   │       │    │
│ │ │  ↓ -0.02    │  ↓ Empeora  │  ↓ Empeora  │  ↑ Aumenta  │       │    │
│ │ └──────────────┴──────────────┴──────────────┴──────────────┘       │    │
│ └──────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│ ┌─ Curva S ─────────────────────────┐ ┌─ Alertas Críticas ──────────────┐ │
│ │                                    │ │                                 │ │
│ │100│                           ╱──  │ │ 🔴 Actividad ACT-025 retrasada │ │
│ │ 90│                      ╱───      │ │    15 días. Impacta ruta       │ │
│ │ 80│                 ╱───           │ │    crítica.                    │ │
│ │ 70│            ╱────                │ │    [Ver Detalle]               │ │
│ │ 60│       ╱────                     │ │                                 │ │
│ │ 50│  ╱────  ● Hoy (85% vs 92%)     │ │ 🔴 Sobrecosto en partida       │ │
│ │   └─────────────────────────────→  │ │    02.03 (+12%)                │ │
│ │   Ene Feb Mar Abr May Jun Jul Aug  │ │    [Ver Detalle]               │ │
│ │                                    │ │                                 │ │
│ │   ─ Programado  ─ Real             │ │ 🟡 Material: Cemento bajo      │ │
│ └────────────────────────────────────┘ │    stock (5 días restantes)    │ │
│                                         │    [Ver Detalle]               │ │
│ ┌─ Mapa de Calor - Avance por Unidad ┐ │                                 │ │
│ │                                     │ │ [Ver Todas las Alertas (8)]    │ │
│ │ Manzana A: [■][■][■][□][□]         │ └─────────────────────────────────┘ │
│ │            100 100 85  50  20       │                                    │
│ │                                     │ ┌─ Productividad de Cuadrillas ──┐ │
│ │ Manzana B: [■][■][■][■][□]         │ │                                 │ │
│ │            100 100 100 95  0        │ │ Top 5:                          │ │
│ │                                     │ │ 1. Estructura 1    112% ↑       │ │
│ │ Manzana C: [■][□][□][□][□]         │ │ 2. Acabados 3      108% ↑       │ │
│ │            100 75  40  15  0        │ │ 3. Cimiento 2      105% →       │ │
│ │                                     │ │ 4. Instalaciones 1  98% ↓       │ │
│ │ Leyenda: ■ 100%  ▓ 75-99%          │ │ 5. Estructura 2     95% ↓       │ │
│ │          ▒ 50-74%  ░ 25-49%  □ 0%  │ │                                 │ │
│ └─────────────────────────────────────┘ │ [Ver Detalle]                   │ │
│                                         └─────────────────────────────────┘ │
│                                                                             │
│                                              [Exportar PDF] [Configurar]    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Notas Técnicas

### WebSocket para Tiempo Real

```typescript
// Backend - Event Emitter
this.eventEmitter.emit('progress.record.approved', {
  projectId,
  record,
});

// WebSocket Gateway
@WebSocketGateway()
export class DashboardGateway {
  @SubscribeMessage('subscribe-project')
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() projectId: string) {
    client.join(`project:${projectId}`);
  }

  @OnEvent('progress.record.approved')
  handleProgressApproved(payload: any) {
    this.server.to(`project:${payload.projectId}`).emit('dashboard-update', {
      type: 'progress-updated',
      data: payload,
    });
  }
}

// Frontend - Socket.io Client
const socket = io('ws://localhost:3000');

socket.emit('subscribe-project', projectId);

socket.on('dashboard-update', (data) => {
  // Actualizar state de Zustand
  updateDashboard(data);
});
```

### Materialized View para Performance

```sql
-- Vista materializada refrescada cada hora
CREATE MATERIALIZED VIEW analytics.mv_project_dashboard_summary AS
SELECT
  p.id AS project_id,
  p.project_name,
  kpi.physical_progress,
  kpi.financial_progress,
  kpi.spi,
  kpi.cpi,
  COUNT(DISTINCT u.id) AS total_units,
  COUNT(DISTINCT CASE WHEN u.status = 'completed' THEN u.id END) AS completed_units,
  (SELECT COUNT(*) FROM analytics.alerts WHERE project_id = p.id AND status = 'active' AND severity = 'critical') AS critical_alerts
FROM projects.projects p
LEFT JOIN analytics.kpi_metrics kpi ON kpi.project_id = p.id
  AND kpi.metric_date = CURRENT_DATE
LEFT JOIN projects.units u ON u.project_id = p.id
WHERE p.status IN ('planning', 'in_progress')
GROUP BY p.id, p.project_name, kpi.physical_progress, kpi.financial_progress, kpi.spi, kpi.cpi;

-- Refrescar automáticamente
REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_project_dashboard_summary;
```

### CRON Job para Cálculo Diario

```typescript
@Cron(CronExpression.EVERY_DAY_AT_11PM)
async calculateDailyKpis(): Promise<void> {
  const activeProjects = await this.getActiveProjects();

  for (const project of activeProjects) {
    await this.calculateProjectKpis(project.id, new Date());
  }

  // Refrescar materialized view
  await this.dataSource.query(
    'REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_project_dashboard_summary'
  );
}
```

---

## Endpoints Necesarios

```typescript
GET    /api/analytics/dashboard/:projectId
GET    /api/analytics/dashboard/summary         // Todos los proyectos
GET    /api/analytics/kpis/:projectId
GET    /api/analytics/s-curve/:projectId
GET    /api/analytics/heatmap/:projectId
GET    /api/analytics/alerts/:projectId
GET    /api/analytics/productivity/:projectId
POST   /api/analytics/dashboard/export-pdf
GET    /api/analytics/widgets/:userId           // Configuración de widgets
PUT    /api/analytics/widgets/:userId           // Guardar configuración
```

---

## Definición de "Done"

- [x] Dashboard responsive con widgets
- [x] WebSocket para actualizaciones en tiempo real
- [x] CRON job calculando KPIs diarios
- [x] Materialized views para performance
- [x] Curva S con Chart.js
- [x] Mapa de calor visual
- [x] Panel de alertas funcional
- [x] Widgets drag&drop configurables
- [x] Exportación a PDF
- [x] Tests unitarios >80%
- [x] Aprobado por Product Owner

---

**Estimación:** 8 Story Points
**Dependencias:** US-PROG-001, US-PROG-002, US-PROG-004
**Fecha:** 2025-11-17
