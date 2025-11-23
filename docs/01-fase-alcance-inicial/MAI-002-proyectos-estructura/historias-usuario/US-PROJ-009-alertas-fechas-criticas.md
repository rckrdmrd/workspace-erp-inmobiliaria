# US-PROJ-009: Alertas de Fechas Críticas

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 6
**Story Points:** 3 SP
**Prioridad:** P1 (Alta)
**Estimación:** 1-2 días

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** registrar fechas críticas contractuales o regulatorias con alertas automáticas
**Para** evitar incumplimientos, penalizaciones y asegurar entregas a tiempo

---

## Criterios de Aceptación

### ✅ AC1: Listado de Fechas Críticas

**Dado** que accedo a "Fechas Críticas"
**Entonces** veo tabla:

| Fecha | Descripción | Tipo | Entidad | Consecuencias | Días Restantes | Estado |
|-------|-------------|------|---------|---------------|----------------|--------|
| 15/12/2025 | Entrega INFONAVIT | Contractual | INFONAVIT | $500,000 + 2% mes | 28 días | ⏱️ Próxima |
| 01/02/2026 | Renovación seguro | Regulatoria | Aseguradora | Pérdida de cobertura | 75 días | ⏸️ Pendiente |
| 15/05/2026 | Finiquito gobierno | Contractual | Municipio | Retención de garantía | 178 días | ⏸️ Pendiente |

**Estados:**
- ⏱️ Próxima (<30 días)
- ⏸️ Pendiente (>30 días)
- ⚠️ En riesgo (<7 días)
- ✅ Cumplida
- ❌ Incumplida

**Ordenamiento:** Por fecha (más próxima primero)

### ✅ AC2: Registrar Fecha Crítica

**Formulario:**
- Descripción: "Entrega primera etapa a INFONAVIT"
- Fecha: [15/12/2025]
- Es fecha límite inamovible: ☑
- Tipo de compromiso: Contractual / Regulatoria / Financiero / Cliente / Interno
- Entidad relacionada: "INFONAVIT"
- Consecuencias si se incumple:
  ```
  Penalización de $500,000 MXN
  + Intereses del 2% mensual
  + Posible rescisión de contrato
  ```
- Alerta (días antes): [30]

**Validaciones:**
- Fecha debe ser futura
- Descripción obligatoria
- Si es inamovible, marcar en rojo

### ✅ AC3: Sistema de Alertas Automáticas

**Configuración de alertas:**
- Primera alerta: 30 días antes
- Segunda alerta: 15 días antes
- Tercera alerta: 7 días antes
- Alertas diarias: últimos 3 días

**Cuando** llega el momento de alerta
**Entonces** sistema envía:
- ✉️ Email al Director del proyecto
- 📱 Notificación in-app
- 📊 Actualiza dashboard con badge "⚠️ 2 fechas críticas próximas"

**Ejemplo de email:**
```
Asunto: ⚠️ Fecha crítica próxima: Entrega INFONAVIT en 30 días

Proyecto: Fraccionamiento Los Pinos
Fecha crítica: 15/12/2025 (en 30 días)

Descripción:
Entrega primera etapa a INFONAVIT

Consecuencias si se incumple:
Penalización de $500,000 MXN + intereses del 2% mensual

Entidad: INFONAVIT
Tipo: Contractual - FECHA LÍMITE INAMOVIBLE

Acciones recomendadas:
- Verificar avance físico actual: 82%
- Acelerar trabajos de acabados
- Coordinar inspección pre-entrega

[Ver Proyecto] [Marcar como Cumplida]
```

### ✅ AC4: Marcar Fecha como Cumplida/Incumplida

**Dado** fecha crítica "Entrega INFONAVIT" el 15/12/2025
**Cuando** llega el 15/12/2025 y se cumplió
**Entonces** hago clic "Marcar como Cumplida"
**Y** sistema pide:
- Fecha real de cumplimiento: [15/12/2025]
- Notas: "Entrega realizada sin observaciones"

**Si NO se cumplió:**
- Botón "Reportar Incumplimiento"
- Fecha de incumplimiento: [15/12/2025]
- Motivos del incumplimiento: [Textarea]
- Acciones correctivas: [Textarea]
- Sistema marca en rojo
- Notificación automática a Admin y Director

### ✅ AC5: Dashboard de Fechas Críticas

**Widget en dashboard principal:**
```
┌────────────────────────────────────────┐
│ ⚠️ Fechas Críticas Próximas (2)        │
├────────────────────────────────────────┤
│                                        │
│ 🔴 En 7 días: Entrega INFONAVIT        │
│    15/12/2025 - Penalización $500K     │
│                                        │
│ 🟡 En 28 días: Renovación de seguro    │
│    01/02/2026 - Pérdida de cobertura   │
│                                        │
│               [Ver Todas las Fechas →] │
└────────────────────────────────────────┘
```

**Colores:**
- 🔴 Rojo: <7 días
- 🟡 Amarillo: 7-30 días
- 🟢 Verde: >30 días

---

## Escenarios de Prueba

**Escenario 1:** Crear fecha crítica con penalización
**Given** proyecto con contrato INFONAVIT
**When** registro fecha crítica:
- Fecha: 15/12/2025
- Tipo: Contractual
- Entidad: INFONAVIT
- Consecuencias: Penalización $500,000
**Then** fecha se guarda y alertas se configuran

**Escenario 2:** Recibir alerta 30 días antes
**Given** fecha crítica el 15/12/2025
**And** estamos el 15/11/2025 (30 días antes)
**When** cron job se ejecuta a las 9:00 AM
**Then** Director recibe email de alerta
**And** dashboard muestra badge "⚠️ 1 fecha próxima"

**Escenario 3:** Marcar fecha como incumplida
**Given** fecha crítica el 15/12/2025
**And** no se cumplió
**When** marco como incumplida
**Then** estado cambia a "Incumplida"
**And** Admin y Director reciben notificación
**And** registro queda en historial

---

## Definición de Done

- [ ] CRUD de fechas críticas completo
- [ ] Sistema de alertas automáticas (cron job)
- [ ] Emails enviados correctamente
- [ ] Widget de dashboard funcional
- [ ] Marcar como cumplida/incumplida
- [ ] Cálculo de días restantes en tiempo real
- [ ] Notificaciones in-app
- [ ] Tests de envío de alertas
- [ ] Configuración de múltiples alertas por fecha

---

## Notas Técnicas

**Endpoints:**
```
POST   /api/projects/:projectId/critical-dates
GET    /api/projects/:projectId/critical-dates
PUT    /api/critical-dates/:id/mark-met
PUT    /api/critical-dates/:id/mark-missed
DELETE /api/critical-dates/:id
```

**Cron Job (diario 9:00 AM):**
```typescript
@Cron('0 9 * * *')
async checkCriticalDates() {
  const today = new Date();

  // Fechas próximas (30, 15, 7, 3, 2, 1 días)
  const upcomingDates = await this.findUpcoming([30, 15, 7, 3, 2, 1]);

  for (const date of upcomingDates) {
    if (shouldSendAlert(date, today)) {
      await this.sendAlert(date);
      await this.updateLastAlertSent(date.id);
    }
  }
}
```

**Email Template:**
- Subject: "⚠️ Fecha crítica próxima: {descripcion} en {dias} días"
- Body: HTML template con detalles completos
- Botones de acción: Ver Proyecto, Marcar como Cumplida

---

**Estado:** ✅ Ready for Development
