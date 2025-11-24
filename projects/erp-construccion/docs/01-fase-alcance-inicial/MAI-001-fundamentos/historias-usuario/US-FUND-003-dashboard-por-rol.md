# US-FUND-003: Dashboard Principal por Rol

**Épica:** MAI-001 - Fundamentos
**Sprint:** Sprint 2-3 (Semanas 2-3)
**Story Points:** 8 SP
**Presupuesto:** $2,900 MXN
**Prioridad:** Alta
**Estado:** 🚧 Planificado

---

## Descripción

Como **usuario del sistema de gestión de obra**, quiero **ver un dashboard personalizado según mi rol** para **visualizar la información y métricas relevantes a mis responsabilidades en la constructora**.

**Contexto del Alcance Inicial:**
El MVP incluye 7 dashboards diferentes (uno por rol de construcción), cada uno mostrando KPIs y widgets relevantes. Los datos son reales de la base de datos (proyectos, presupuestos, empleados). No incluye gráficas avanzadas interactivas ni personalización de widgets, que se agregarán en extensiones futuras.

**Diferencias con GAMILIT:**
- 7 variantes de dashboard vs 2 (estudiante/profesor)
- Sin gamificación (no hay niveles, XP, coins, badges)
- KPIs de construcción (presupuestos, avances de obra, compras, nómina)
- Dashboard varía por constructora activa (multi-tenancy)

---

## Criterios de Aceptación Generales

### Para Todos los Roles
- [ ] **CA-01:** El dashboard muestra un saludo personalizado con nombre del usuario y rol actual
- [ ] **CA-02:** Se indica la constructora activa (nombre y logo) con selector para cambiar
- [ ] **CA-03:** El dashboard es responsive (mobile, tablet, desktop)
- [ ] **CA-04:** Se muestran widgets relevantes según el rol del usuario
- [ ] **CA-05:** Cada widget tiene un título claro y acción rápida (ver más)
- [ ] **CA-06:** Los números y métricas se actualizan en tiempo real
- [ ] **CA-07:** Se muestran alertas y notificaciones importantes en un panel lateral
- [ ] **CA-08:** El layout se adapta automáticamente al cambiar de rol o constructora
- [ ] **CA-09:** Skeleton loaders mientras carga la información
- [ ] **CA-10:** Manejo de estado vacío ("No hay proyectos activos")

---

## Especificaciones Técnicas

### Backend (NestJS)

**Endpoints por Rol:**
```
GET /api/dashboard/director
GET /api/dashboard/engineer
GET /api/dashboard/resident
GET /api/dashboard/purchases
GET /api/dashboard/finance
GET /api/dashboard/hr
GET /api/dashboard/post-sales

Todos comparten estructura base:
- Headers: Authorization: Bearer {token}
- Response: {
    user: { id, fullName, photoUrl, role },
    constructora: { id, nombre, logoUrl },
    widgets: [...],  // Específico por rol
    alerts: [...],   // Alertas importantes
    recentActivity: [...], // Actividad reciente
    quickActions: [...] // Acciones rápidas
  }
```

**Servicios:**
- **DashboardService:** Factory que delega a service específico por rol
- **DirectorDashboardService:** KPIs para director
- **EngineerDashboardService:** KPIs para ingeniero
- **ResidentDashboardService:** KPIs para residente
- ... (uno por cada rol)

**Optimización:**
- Queries SQL optimizadas con agregaciones
- Caching de datos que cambian poco (configuración, logos)
- Índices en columnas de filtrado frecuente
- Lazy loading de widgets secundarios

### Frontend (React + Vite)

**Arquitectura de Componentes:**
```typescript
components/
├── dashboards/
│   ├── DashboardContainer.tsx         // Container principal
│   ├── DirectorDashboard.tsx          // Dashboard específico
│   ├── EngineerDashboard.tsx
│   ├── ResidentDashboard.tsx
│   ├── PurchasesDashboard.tsx
│   ├── FinanceDashboard.tsx
│   ├── HRDashboard.tsx
│   └── PostSalesDashboard.tsx
├── widgets/
│   ├── WidgetCard.tsx                 // Base card reutilizable
│   ├── StatWidget.tsx                 // Número + icono + trend
│   ├── ChartWidget.tsx                // Gráfica simple
│   ├── ListWidget.tsx                 // Lista de items
│   └── TableWidget.tsx                // Tabla básica
└── shared/
    ├── DashboardHeader.tsx            // Saludo + selector de constructora
    ├── AlertsPanel.tsx                // Panel lateral de alertas
    ├── QuickActionsBar.tsx            // Barra de acciones rápidas
    └── EmptyState.tsx                 // Estado vacío genérico
```

**Estado (Zustand):**
```typescript
interface DashboardStore {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: (role: ConstructionRole) => Promise<void>;
  refreshDashboard: () => Promise<void>;
}
```

---

## Dashboards por Rol

### 1. Dashboard Director

**KPIs Principales:**
- Total de proyectos activos
- Valor total de cartera (suma de presupuestos)
- Margen de utilidad promedio
- Proyectos con retraso
- Flujo de efectivo del mes

**Widgets:**
```typescript
[
  { type: 'stat', title: 'Proyectos Activos', value: 12, trend: +2 },
  { type: 'stat', title: 'Cartera Total', value: '$45.2M', trend: +8.5 },
  { type: 'stat', title: 'Margen Promedio', value: '18.5%', trend: -1.2 },
  { type: 'chart', title: 'Avance de Proyectos', data: [...] },
  { type: 'list', title: 'Proyectos en Riesgo', items: [...] },
  { type: 'table', title: 'Top 5 Proyectos por Margen', rows: [...] },
]
```

**Alertas Típicas:**
- "Proyecto Residencial Valle: presupuesto al 95%, avance físico 78%"
- "3 órdenes de compra pendientes de aprobación"
- "Flujo de efectivo negativo proyectado para próximo mes"

**Acciones Rápidas:**
- Crear nuevo proyecto
- Ver reportes ejecutivos
- Aprobar presupuestos pendientes
- Ver flujo de efectivo

---

### 2. Dashboard Engineer (Ingeniero)

**KPIs Principales:**
- Proyectos asignados
- Presupuestos en revisión
- Avance promedio de proyectos
- Requisiciones pendientes de validar

**Widgets:**
```typescript
[
  { type: 'stat', title: 'Mis Proyectos', value: 5 },
  { type: 'stat', title: 'Presupuestos Activos', value: 8 },
  { type: 'chart', title: 'Avance vs Programado', data: [...] },
  { type: 'list', title: 'Requisiciones Pendientes', items: [...] },
  { type: 'table', title: 'Proyectos con Desviación', rows: [...] },
]
```

**Alertas Típicas:**
- "Proyecto Torre Norte: avance 5% por debajo de lo programado"
- "Presupuesto Plaza Comercial requiere revisión"
- "Nueva requisición de materiales en Proyecto Residencial"

**Acciones Rápidas:**
- Ver programación de obra
- Revisar presupuestos
- Validar requisiciones
- Actualizar avances

---

### 3. Dashboard Resident (Residente de Obra)

**KPIs Principales:**
- Obra(s) asignada(s)
- Avance físico esta semana
- Empleados activos en obra
- Incidencias abiertas

**Widgets:**
```typescript
[
  { type: 'stat', title: 'Mi Obra', value: 'Torre Norte' },
  { type: 'stat', title: 'Avance Hoy', value: '+2.5%' },
  { type: 'stat', title: 'Personal en Obra', value: 45 },
  { type: 'list', title: 'Checklists Pendientes', items: [...] },
  { type: 'list', title: 'Incidencias Abiertas', items: [...] },
]
```

**Alertas Típicas:**
- "Checklist de seguridad pendiente para hoy"
- "Entrega de material programada para mañana 8 AM"
- "2 empleados sin registro de asistencia hoy"

**Acciones Rápidas:**
- Capturar avance de obra
- Registrar asistencia (móvil)
- Reportar incidencia
- Ver programación semanal

---

### 4. Dashboard Purchases (Compras)

**KPIs Principales:**
- Órdenes de compra activas
- Presupuesto de compras del mes
- Órdenes pendientes de recepción
- Inventario bajo en stock

**Widgets:**
```typescript
[
  { type: 'stat', title: 'OC Activas', value: 28 },
  { type: 'stat', title: 'Presupuesto Mes', value: '$1.2M', trend: -15 },
  { type: 'list', title: 'OC Pendientes de Aprobar', items: [...] },
  { type: 'list', title: 'Recepciones Pendientes', items: [...] },
  { type: 'table', title: 'Materiales en Stock Bajo', rows: [...] },
]
```

---

### 5. Dashboard Finance (Finanzas)

**KPIs Principales:**
- Flujo de efectivo del mes
- Cuentas por pagar vencidas
- Presupuesto vs Real
- Pagos programados esta semana

**Widgets:**
```typescript
[
  { type: 'stat', title: 'Flujo Mes', value: '$2.3M', trend: +12 },
  { type: 'stat', title: 'Pagos Vencidos', value: 5, alert: true },
  { type: 'chart', title: 'Presupuesto vs Real', data: [...] },
  { type: 'list', title: 'Pagos Esta Semana', items: [...] },
  { type: 'table', title: 'CxP Vencidas', rows: [...] },
]
```

---

### 6. Dashboard HR (Recursos Humanos)

**KPIs Principales:**
- Empleados activos
- Asistencias registradas hoy
- Nómina del periodo
- Incidencias laborales

**Widgets:**
```typescript
[
  { type: 'stat', title: 'Empleados Activos', value: 156 },
  { type: 'stat', title: 'Asistencias Hoy', value: 142, percent: 91 },
  { type: 'stat', title: 'Nómina Periodo', value: '$456K' },
  { type: 'list', title: 'Faltas Sin Justificar', items: [...] },
  { type: 'list', title: 'Altas Pendientes IMSS', items: [...] },
]
```

---

### 7. Dashboard Post Sales (Postventa)

**KPIs Principales:**
- Incidencias abiertas
- Garantías activas
- Tiempo promedio de respuesta
- Clientes satisfechos (NPS)

**Widgets:**
```typescript
[
  { type: 'stat', title: 'Incidencias Abiertas', value: 12 },
  { type: 'stat', title: 'Garantías Activas', value: 34 },
  { type: 'stat', title: 'Tiempo Respuesta', value: '2.3 días' },
  { type: 'list', title: 'Incidencias Urgentes', items: [...] },
  { type: 'table', title: 'Garantías por Vencer', rows: [...] },
]
```

---

## Dependencias

**Antes:**
- ✅ US-FUND-001 (Autenticación JWT - requiere usuario autenticado)
- ✅ US-FUND-002 (Perfil - usa foto y nombre)
- ✅ RF-AUTH-001 (Sistema de roles - necesita roles definidos)
- ✅ RF-AUTH-003 (Multi-tenancy - dashboard por constructora)

**Después:**
- Punto de entrada principal del sistema después del login
- Base para navegación a módulos específicos
- Todos los módulos se acceden desde widgets del dashboard

---

## Definición de Hecho (DoD)

- [ ] 7 endpoints de dashboard implementados (uno por rol)
- [ ] Services específicos por rol con lógica de KPIs
- [ ] Queries SQL optimizadas (máx 5 queries por dashboard)
- [ ] 7 componentes de dashboard frontend
- [ ] Widgets reutilizables (StatWidget, ChartWidget, ListWidget, TableWidget)
- [ ] Responsive design probado en 3 breakpoints
- [ ] Loading states con skeletons
- [ ] Error handling y empty states
- [ ] Tests unitarios backend (>80% coverage)
- [ ] Tests E2E para carga de dashboard por rol
- [ ] Performance: dashboard carga en <2 segundos
- [ ] Documentación Swagger de endpoints
- [ ] Code review aprobado

---

## Notas del Alcance Inicial

### Incluido en MVP ✅
- ✅ 7 dashboards específicos por rol
- ✅ KPIs y métricas en tiempo real
- ✅ Widgets básicos (stat, list, table)
- ✅ Alertas y notificaciones inline
- ✅ Acciones rápidas por rol
- ✅ Selector de constructora en header
- ✅ Responsive design

### NO Incluido en MVP ❌
- ❌ Gráficas interactivas avanzadas (solo barras/líneas simples)
- ❌ Filtros de tiempo (última semana, mes, año)
- ❌ Exportación de datos
- ❌ Personalización de widgets (drag & drop)
- ❌ Comparativas entre proyectos/períodos
- ❌ Drill-down en gráficas
- ❌ Notificaciones push en tiempo real
- ❌ Dashboard multi-constructora (vista consolidada)

### Extensiones Futuras ⚠️
- ⚠️ **Fase 2:** Gráficas avanzadas con Chart.js o Recharts
- ⚠️ **Fase 2:** Dashboard personalizable (agregar/quitar widgets)
- ⚠️ **Fase 2:** Exportar dashboards a PDF/Excel
- ⚠️ **Fase 2:** Comparativas y análisis históricos
- ⚠️ **Fase 2:** Vista consolidada multi-constructora (para directores)

---

## Tareas de Implementación

### Backend (Estimado: 18h)

**Total Backend:** 18h (~4.5 SP)

- [ ] **Tarea B.1:** Services de dashboard por rol - Estimado: 10h
  - [ ] Subtarea B.1.1: DirectorDashboardService con KPIs principales - 1.5h
  - [ ] Subtarea B.1.2: EngineerDashboardService con presupuestos y programación - 1.5h
  - [ ] Subtarea B.1.3: ResidentDashboardService con avances y asistencias - 1.5h
  - [ ] Subtarea B.1.4: PurchasesDashboardService con OC e inventario - 1.5h
  - [ ] Subtarea B.1.5: FinanceDashboardService con flujo y CxP - 1.5h
  - [ ] Subtarea B.1.6: HRDashboardService con nómina y asistencias - 1h
  - [ ] Subtarea B.1.7: PostSalesDashboardService con incidencias - 1h

- [ ] **Tarea B.2:** Endpoints REST - Estimado: 5h
  - [ ] Subtarea B.2.1: DashboardController con 7 endpoints (GET por rol) - 2h
  - [ ] Subtarea B.2.2: Guard para validar que usuario tenga el rol - 1h
  - [ ] Subtarea B.2.3: Serialización de respuesta consistente - 1h
  - [ ] Subtarea B.2.4: Documentación Swagger completa - 1h

- [ ] **Tarea B.3:** Optimización y queries - Estimado: 3h
  - [ ] Subtarea B.3.1: Queries SQL optimizadas con agregaciones - 1.5h
  - [ ] Subtarea B.3.2: Índices en base de datos - 0.5h
  - [ ] Subtarea B.3.3: Caching de datos estáticos (logos, configuración) - 1h

### Frontend (Estimado: 12h)

**Total Frontend:** 12h (~3 SP)

- [ ] **Tarea F.1:** Widgets reutilizables - Estimado: 4h
  - [ ] Subtarea F.1.1: WidgetCard base con header y body - 0.5h
  - [ ] Subtarea F.1.2: StatWidget (número, icono, trend) - 1h
  - [ ] Subtarea F.1.3: ListWidget (lista con iconos y badges) - 1h
  - [ ] Subtarea F.1.4: TableWidget (tabla básica responsive) - 1h
  - [ ] Subtarea F.1.5: ChartWidget con Recharts (barras/líneas simples) - 0.5h

- [ ] **Tarea F.2:** Dashboards específicos - Estimado: 6h
  - [ ] Subtarea F.2.1: DashboardContainer con lógica de routing por rol - 1h
  - [ ] Subtarea F.2.2: DirectorDashboard con 6 widgets - 1h
  - [ ] Subtarea F.2.3: EngineerDashboard con 5 widgets - 0.75h
  - [ ] Subtarea F.2.4: ResidentDashboard con 5 widgets - 0.75h
  - [ ] Subtarea F.2.5: PurchasesDashboard con 5 widgets - 0.75h
  - [ ] Subtarea F.2.6: FinanceDashboard con 5 widgets - 0.75h
  - [ ] Subtarea F.2.7: HR y PostSales Dashboards - 1h

- [ ] **Tarea F.3:** Layout y componentes compartidos - Estimado: 2h
  - [ ] Subtarea F.3.1: DashboardHeader con saludo y selector - 0.75h
  - [ ] Subtarea F.3.2: AlertsPanel lateral - 0.5h
  - [ ] Subtarea F.3.3: QuickActionsBar - 0.5h
  - [ ] Subtarea F.3.4: EmptyState genérico - 0.25h

### Testing (Estimado: 4h)

**Total Testing:** 4h (~1 SP)

- [ ] **Tarea T.1:** Tests unitarios backend - Estimado: 2h
  - [ ] Subtarea T.1.1: Tests de DirectorDashboardService (KPIs) - 0.5h
  - [ ] Subtarea T.1.2: Tests de otros services (sampling) - 1h
  - [ ] Subtarea T.1.3: Tests de DashboardController - 0.5h

- [ ] **Tarea T.2:** Tests E2E - Estimado: 1.5h
  - [ ] Subtarea T.2.1: Tests de carga de dashboard por rol - 1h
  - [ ] Subtarea T.2.2: Tests de cambio de constructora (recarga dashboard) - 0.5h

- [ ] **Tarea T.3:** Tests frontend - Estimado: 0.5h
  - [ ] Subtarea T.3.1: Tests de widgets reutilizables - 0.25h
  - [ ] Subtarea T.3.2: Tests de DashboardContainer - 0.25h

---

## Resumen de Horas

| Categoría | Estimado | Story Points |
|-----------|----------|--------------|
| Backend | 18h | 4.5 SP |
| Frontend | 12h | 3 SP |
| Testing | 4h | 1 SP |
| **TOTAL** | **34h** | **8.5 SP ≈ 8 SP** |

**Ajuste:** Se redondea a 8 SP considerando reutilización de componentes.

---

## Cronograma Propuesto

**Sprint:** Sprint 2-3 (Semanas 2-3)
**Duración:** 4.5 días
**Equipo:**
- 1 Backend developer (18h)
- 1 Frontend developer (12h)
- QA compartido (4h)

**Hitos:**
- Días 1-2: Services backend + endpoints
- Días 3-4: Widgets y dashboards frontend
- Día 4.5: Testing + ajustes

---

## Testing

### Tests E2E

```typescript
describe('Dashboard API (E2E)', () => {
  describe('Director Dashboard', () => {
    it('should return KPIs for director role', async () => {
      const director = await createUser({ role: 'director' });
      const token = await getAuthToken(director);

      const response = await request(app.getHttpServer())
        .get('/dashboard/director')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.widgets).toBeArray();
      expect(response.body.widgets[0]).toHaveProperty('type', 'stat');
      expect(response.body.widgets[0]).toHaveProperty('title', 'Proyectos Activos');
    });

    it('should reject non-director users', async () => {
      const engineer = await createUser({ role: 'engineer' });
      const token = await getAuthToken(engineer);

      await request(app.getHttpServer())
        .get('/dashboard/director')
        .set('Authorization', `Bearer ${token}`)
        .expect(403); // Forbidden
    });
  });

  describe('Multi-tenancy', () => {
    it('should show different data when switching constructora', async () => {
      const user = await createUser();
      await assignToConstructora(user.id, 'constructora-a');
      await assignToConstructora(user.id, 'constructora-b');

      // Dashboard en constructora A
      const tokenA = await getAuthToken(user, 'constructora-a');
      const responseA = await request(app.getHttpServer())
        .get('/dashboard/director')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      // Dashboard en constructora B
      const tokenB = await getAuthToken(user, 'constructora-b');
      const responseB = await request(app.getHttpServer())
        .get('/dashboard/director')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      // Datos deben ser diferentes
      expect(responseA.body.constructora.id).toBe('constructora-a');
      expect(responseB.body.constructora.id).toBe('constructora-b');
      expect(responseA.body.widgets[0].value).not.toBe(responseB.body.widgets[0].value);
    });
  });
});
```

---

## Estimación

**Desglose de Esfuerzo (8 SP = ~4 días = 32h):**
- Backend services (7 roles): 2.5 días (18h)
- Frontend widgets + dashboards: 1.5 días (12h)
- Testing: 0.5 días (4h)
- Ajustes: -0.5 días (reutilización)

**Riesgos:**
- ⚠️ Complejidad de queries SQL para KPIs (múltiples joins, agregaciones)
- ⚠️ Performance en constructoras con muchos proyectos (>100)
- ⚠️ Mantenimiento de 7 dashboards diferentes (DRY)

**Mitigaciones:**
- ✅ Reutilizar widgets entre dashboards
- ✅ Optimizar queries con índices y caching
- ✅ Lazy loading de widgets no críticos
- ✅ Tests de performance con datos de producción simulados

---

## Recursos Externos

**Librerías Frontend:**
- `recharts` (gráficas simples - barras, líneas, áreas)
- `react-icons` (iconos para widgets)
- `date-fns` (formateo de fechas)

**Referencias de Diseño:**
- Tailwind UI Dashboard components
- Material-UI Dashboard examples

---

**Creado:** 2025-11-17
**Actualizado:** 2025-11-17
**Responsable:** Equipo Fullstack
**Reutilización GAMILIT:** 50% (estructura de dashboard, adaptado a 7 roles vs 2)
