# RF-QUA-003: Sistema de Tickets Postventa

**ID:** RF-QUA-003 | **Módulo:** MAI-009 | **Prioridad:** Alta | **SP:** 8

## Descripción
Sistema de tickets para atención de garantías, creación desde app móvil por derechohabientes, asignación automática a técnicos y seguimiento en tiempo real.

## Reglas de Negocio

**RN-TKT-001: Prioridad Automática**
```typescript
const priorityRules = {
  'fuga_agua': 'urgent',        // 24h SLA
  'corto_circuito': 'urgent',   // 24h
  'puerta_no_cierra': 'urgent', // 24h
  'plomeria_general': 'high',   // 48h
  'electrico_general': 'high',  // 48h
  'acabados': 'medium',         // 7 días
  'varios': 'low'               // 15 días
};
```

**RN-TKT-002: Asignación Automática**
```typescript
// Asignar a técnico disponible con:
// 1. Especialidad correcta
// 2. Menor carga de trabajo
// 3. Más cercano geográficamente
```

**RN-TKT-003: Estados del Ticket**
```
created → assigned → in_progress → resolved → closed
```

## Estructura de Datos

```typescript
interface PostSaleTicket {
  id: string;
  numero: string; // TKT-2025-001
  housingId: string;
  derechohabienteId: string;
  category: 'plumbing' | 'electrical' | 'finishes' | 'carpentry' | 'structural' | 'other';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  description: string;
  photos: string[];
  status: TicketStatus;
  createdAt: Date;
  slaDeadline: Date;
  assignedTo: string;
  assignedAt: Date;
  resolvedAt: Date;
  resolutionNotes: string;
  resolutionPhotos: string[];
  satisfactionRating: number; // 1-5
  closedAt: Date;
}
```

## Criterios de Aceptación
1. Derechohabiente crea ticket desde app → Sistema asigna prioridad ✅
2. Asigna automáticamente a técnico disponible ✅
3. Técnico recibe notificación → Agenda visita ✅
4. Atiende problema → Sube fotos solución ✅
5. Cliente califica servicio → Sistema cierra ticket ✅

---
**Generado:** 2025-11-20
