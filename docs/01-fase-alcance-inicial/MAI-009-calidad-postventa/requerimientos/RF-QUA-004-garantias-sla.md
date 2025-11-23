# RF-QUA-004: Garantías y SLA

**ID:** RF-QUA-004 | **Módulo:** MAI-009 | **Prioridad:** Alta | **SP:** 8

## Descripción
Control de SLA (Service Level Agreement) por tipo de ticket, alertas automáticas por incumplimiento y dashboard de cumplimiento.

## Reglas de Negocio

**RN-SLA-001: Tiempos de Respuesta**
```typescript
const slaByPriority = {
  urgent: { hours: 24, escalateAfter: 12 },
  high: { hours: 48, escalateAfter: 36 },
  medium: { days: 7, escalateAfter: 5 },
  low: { days: 15, escalateAfter: 12 }
};
```

**RN-SLA-002: Escalación Automática**
```typescript
// Si ticket sin asignar > 50% del SLA:
//   → Notificar supervisor
// Si ticket sin resolver > SLA:
//   → Alerta crítica a director
//   → Escalación a INFONAVIT si aplica
```

**RN-SLA-003: Periodo de Garantía**
- Vivienda completa: 2 años
- Instalaciones hidráulicas: 1 año
- Pintura exterior: 6 meses
- Herrería: 1 año

## Estructura de Datos

```typescript
interface TicketSLA {
  ticketId: string;
  slaDeadline: Date;
  elapsedTime: number; // minutos
  remainingTime: number;
  percentageElapsed: number;
  isOverdue: boolean;
  escalated: boolean;
  escalatedAt: Date;
}

interface WarrantyPeriod {
  housingId: string;
  component: string; // 'vivienda', 'plomeria', 'pintura', etc.
  startDate: Date;
  endDate: Date;
  remainingDays: number;
  isActive: boolean;
}
```

## Criterios de Aceptación
1. Ticket creado → Calcula SLA deadline automáticamente ✅
2. 50% tiempo transcurrido → Alerta supervisor ✅
3. SLA vencido → Alerta crítica director ✅
4. Dashboard muestra cumplimiento SLA en tiempo real ✅
5. Reportes de garantías activas/por vencer ✅

---
**Generado:** 2025-11-20
