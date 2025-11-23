# RF-QUA-002: No Conformidades y CAPA

**ID:** RF-QUA-002 | **Módulo:** MAI-009 | **Prioridad:** Alta | **SP:** 8

## Descripción
Gestión de no conformidades detectadas en inspecciones, con acciones correctivas (CAPA), asignación de responsables y verificación de cierre.

## Reglas de Negocio

**RN-NC-001: Clasificación de Severidad**
```typescript
enum NCSeverity {
  MINOR = 'minor',      // Estético, no afecta función. Ejemplo: Pintura manchada
  MAJOR = 'major',      // Afecta función, no crítico. Ejemplo: Puerta desnivelada
  CRITICAL = 'critical' // Riesgo seguridad/habitabilidad. Ejemplo: Grieta estructural
}
```

**RN-NC-002: Tiempos de Cierre**
- Crítica: 24 horas
- Mayor: 72 horas
- Menor: 7 días

**RN-NC-003: Flujo CAPA**
```
NC Detectada → Acción Correctiva (corregir defecto) 
            → Acción Preventiva (evitar recurrencia)
            → Verificación → Cierre
```

## Estructura de Datos

```typescript
interface NonConformity {
  id: string;
  inspectionId: string;
  housingId: string;
  severity: NCSeverity;
  description: string;
  category: string; // 'structural', 'finishes', 'installations'
  detectedBy: string;
  detectedAt: Date;
  photo: string;
  status: 'open' | 'in_progress' | 'corrected' | 'verified' | 'closed';
  assignedTo: string;
  correctiveAction: string;
  preventiveAction: string;
  correctedAt: Date;
  verifiedBy: string;
  closedAt: Date;
}
```

## Criterios de Aceptación
1. Inspección detecta NC → Registra automáticamente ✅
2. Asigna a responsable según categoria ✅
3. Responsable corrige → Sube foto evidencia ✅
4. Supervisor verifica → Cierra NC ✅
5. Alertas si excede tiempo límite ✅

---
**Generado:** 2025-11-20
