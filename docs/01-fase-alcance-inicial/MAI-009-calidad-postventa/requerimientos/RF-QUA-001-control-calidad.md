# RF-QUA-001: Control de Calidad en Construcción

**ID:** RF-QUA-001 | **Módulo:** MAI-009 | **Prioridad:** Alta | **SP:** 8

## Descripción
Sistema de checklists dinámicos para inspecciones de calidad en cada etapa constructiva, con evidencias fotográficas y aprobación de etapas.

## Reglas de Negocio

**RN-QUA-001: Checklists por Etapa**
```typescript
const checklistsPorEtapa = {
  cimentacion: ["Excavación profundidad", "Plantilla compactada", "Acero armado", "Colado concreto"],
  estructura: ["Castillos nivelados", "Cadenas desplantadas", "Losa espesor", "Vibrado concreto"],
  acabados: ["Aplanados nivel", "Pintura uniforme", "Pisos sin fisuras", "Carpintería funcional"]
};
```

**RN-QUA-002: Aprobación de Etapas**
- Etapa se aprueba si: Todos items OK O NC menores únicamente
- NC mayores/críticas → Bloquea siguiente etapa hasta corregir

**RN-QUA-003: Evidencias Obligatorias**
- Cada inspección: Mínimo 5 fotos por vivienda
- Fotos con geolocalización y timestamp
- Si NC: Foto del defecto + foto de corrección

## Estructura de Datos

```typescript
interface Inspection {
  id: string;
  checklistId: string;
  housingId: string;
  inspectorId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  startedAt: Date;
  completedAt: Date;
  results: InspectionResult[];
  photos: string[];
  observations: string;
}

interface InspectionResult {
  itemId: string;
  result: 'ok' | 'nc';
  ncSeverity?: 'minor' | 'major' | 'critical';
  photo?: string;
  notes?: string;
}
```

## Criterios de Aceptación
1. Residente selecciona checklist → Carga items dinámicamente ✅
2. Inspecciona vivienda → Marca OK/NC por item ✅
3. NC detectada → Genera no conformidad automática ✅
4. Completa inspección → Sistema determina aprobación ✅
5. Genera PDF con evidencias ✅

---
**Generado:** 2025-11-20
