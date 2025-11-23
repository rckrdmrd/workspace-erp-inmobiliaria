# RF-QUA-005: Historial de Vivienda

**ID:** RF-QUA-005 | **Módulo:** MAI-009 | **Prioridad:** Media | **SP:** 8

## Descripción
Historial integrado por vivienda con todas las inspecciones, no conformidades y tickets desde construcción hasta postventa, exportable para auditorías.

## Reglas de Negocio

**RN-HIST-001: Timeline Integrada**
```typescript
interface HousingTimeline {
  housingId: string;
  events: TimelineEvent[];
}

interface TimelineEvent {
  type: 'inspection' | 'nc' | 'ticket' | 'delivery' | 'warranty';
  date: Date;
  title: string;
  description: string;
  severity?: string;
  status: string;
  photos: string[];
  responsibleUser: string;
}
```

**RN-HIST-002: Trazabilidad Completa**
- Todas las inspecciones de calidad realizadas
- No conformidades detectadas y su cierre
- Tickets de postventa atendidos
- Cambios de status de la vivienda
- Entregas y reentregas

**RN-HIST-003: Exportación para Auditorías**
- PDF con timeline completa
- Excel con datos tabulares
- Evidencias fotográficas en ZIP
- Firma digital del historial

## Criterios de Aceptación
1. Vista timeline por vivienda → Muestra todos eventos cronológicos ✅
2. Filtros por tipo de evento y rango de fechas ✅
3. Click en evento → Muestra detalles y fotos ✅
4. Exporta PDF con timeline completa ✅
5. Descarga ZIP con todas las evidencias ✅

---
**Generado:** 2025-11-20
