# US-PROG-006: Checklists de Calidad

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 17
**Story Points:** 5
**Prioridad:** Media
**Asignado a:** Backend + Mobile

---

## Historia de Usuario

**Como** Inspector de Calidad
**Quiero** completar checklists de inspección con firma digital
**Para** asegurar que cada etapa constructiva cumple con los estándares de calidad y documentar no conformidades

---

## Criterios de Aceptación

### 1. Templates de Checklists ✅
- [ ] El administrador puede crear templates de checklists con:
  - Código: CHK-CIMENT-001
  - Nombre: "Checklist de Cimentación"
  - Etapa aplicable: Cimentación
  - Partida/subpartida
  - Versión del template
- [ ] Cada template contiene una lista de items configurables:
  ```
  Item #1:
  - Pregunta: "¿El armado cumple con el proyecto estructural?"
  - Tipo: Sí/No (boolean)
  - Es obligatorio: Sí
  - Requiere foto: Sí
  - Ayuda: "Verificar planos estructurales..."

  Item #2:
  - Pregunta: "Espesor del firme (cm)"
  - Tipo: Numérico
  - Valor de referencia: 10 cm
  - Tolerancia: ±1 cm
  - Requiere medición: Sí
  ```

### 2. Crear Checklist desde Template ✅
- [ ] Puedo iniciar un nuevo checklist seleccionando:
  - Proyecto
  - Unidad/lote (opcional)
  - Template a usar
  - Fecha de inspección
- [ ] El sistema copia todos los items del template
- [ ] Se genera código único: CHK-2025-00001
- [ ] El checklist inicia en estado "draft"

### 3. Completar Items del Checklist (Mobile) ✅
- [ ] Puedo ver lista de items a inspeccionar
- [ ] Para cada item puedo:
  - **Tipo Boolean (Sí/No):**
    - Marcar [✓] Conforme o [✗] No Conforme
  - **Tipo Numérico:**
    - Ingresar medición: [10.5] cm
    - Ver si está dentro de tolerancia: 10.5 cm vs 10±1 cm ✓
  - **Tipo Texto:**
    - Ingresar observación libre
  - **Adjuntar fotos:**
    - Tomar hasta 5 fotos por item
    - Las fotos se vinculan al item específico
  - **Agregar notas:**
    - Comentarios adicionales por item
- [ ] Veo progreso: "15/20 items completados (75%)"

### 4. Registrar No Conformidades ✅
- [ ] Si un item NO es conforme, puedo registrar una NC (No Conformidad)
- [ ] Para cada NC capturo:
  - Severidad: Menor / Mayor / Crítica
  - Descripción detallada
  - Acción correctiva propuesta
  - Responsable de corregir
  - Fecha límite de corrección
  - Fotos de evidencia
- [ ] El sistema muestra resumen de NCs:
  - Total: 3
  - Críticas: 1
  - Mayores: 2
  - Menores: 0

### 5. Calcular Compliance ✅
- [ ] El sistema calcula automáticamente:
  - Total de items: 20
  - Items conformes: 17
  - % de cumplimiento: 85%
- [ ] Muestra indicador visual:
  - >= 95%: Verde (Excelente)
  - 80-94%: Amarillo (Aceptable)
  - < 80%: Rojo (Requiere atención)

### 6. Firma Digital ✅
- [ ] Al completar todos los items, puedo firmar digitalmente
- [ ] Uso el dedo en la pantalla táctil para dibujar mi firma
- [ ] La firma se captura como imagen Base64
- [ ] Se guarda:
  - Firma (imagen)
  - Quién firmó (nombre, puesto)
  - Cuándo firmó (timestamp)
- [ ] Al firmar, el checklist cambia a estado "completed"

### 7. Generar PDF ✅
- [ ] El sistema genera automáticamente un PDF del checklist con:
  - Encabezado con logo y datos del proyecto
  - Resumen:
    - Unidad inspeccionada
    - Fecha
    - Inspector
    - % Compliance
  - Tabla de items con resultados
  - Sección de no conformidades
  - Fotos incluidas (thumbnails)
  - Firma digital al final
- [ ] El PDF se almacena y se puede descargar
- [ ] Puedo enviar el PDF por email a stakeholders

### 8. Seguimiento de NCs ✅
- [ ] Puedo ver dashboard de NCs abiertas vs cerradas
- [ ] Puedo marcar una NC como "resuelta" cuando se corrige
- [ ] Debo adjuntar fotos de verificación al cerrar una NC
- [ ] El sistema envía recordatorios cuando una NC está próxima a vencer
- [ ] Puedo filtrar NCs por:
  - Estado (abiertas/cerradas)
  - Severidad
  - Proyecto/unidad
  - Responsable

---

## Mockup / Wireframe

```
App Móvil - Checklist:
┌─────────────────────────────┐
│ ◀ Checklist de Cimentación  │
├─────────────────────────────┤
│                             │
│ CHK-2025-00001              │
│ Lote 23 - Manzana A         │
│ 15/Ene/2025                 │
│                             │
│ Progreso: 15/20 (75%)       │
│ ████████████░░░░             │
│                             │
│ ┌───────────────────────┐   │
│ │ Item 1 ✓              │   │
│ │ ¿Armado conforme      │   │
│ │  a planos?            │   │
│ │                       │   │
│ │ [✓ Sí]  [ No]         │   │
│ │ 📷 2 fotos            │   │
│ │ Notas: Conforme       │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ Item 2 ⚠️             │   │
│ │ Espesor del firme     │   │
│ │ Ref: 10 ± 1 cm        │   │
│ │                       │   │
│ │ Medido: [9.5] cm      │   │
│ │ ⚠️ Fuera de tolerancia│   │
│ │                       │   │
│ │ [Registrar NC]        │   │
│ └───────────────────────┘   │
│                             │
│ ...más items...             │
│                             │
│ [Guardar Borrador]          │
│ [Completar y Firmar]        │
└─────────────────────────────┘

Registro de NC:
┌─────────────────────────────┐
│ ◀ Nueva No Conformidad      │
├─────────────────────────────┤
│                             │
│ Item: Espesor del firme     │
│ Medido: 9.5 cm (Ref: 10±1)  │
│                             │
│ Severidad:                  │
│ ○ Menor                     │
│ ⦿ Mayor                     │
│ ○ Crítica                   │
│                             │
│ Descripción:                │
│ ┌───────────────────────┐   │
│ │Espesor insuficiente   │   │
│ │en zona sur del lote   │   │
│ └───────────────────────┘   │
│                             │
│ Acción Correctiva:          │
│ ┌───────────────────────┐   │
│ │Demoler y reconstruir  │   │
│ │con espesor correcto   │   │
│ └───────────────────────┘   │
│                             │
│ Responsable:                │
│ [Juan Pérez - Obra ▼]       │
│                             │
│ Fecha Límite:               │
│ [20/Ene/2025]               │
│                             │
│ Fotos:                      │
│ [📷][📷][+ Agregar]         │
│                             │
│      [Cancelar] [Guardar]   │
└─────────────────────────────┘

Firma Digital:
┌─────────────────────────────┐
│ ◀ Firmar Checklist          │
├─────────────────────────────┤
│                             │
│ Resumen:                    │
│ Total items: 20             │
│ Conformes: 17 (85%)         │
│ No Conformidades: 3         │
│                             │
│ Por favor, firme abajo:     │
│                             │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │   [Área de Firma]     │   │
│ │    Dibuje con dedo    │   │
│ │                       │   │
│ │     J. Pérez          │   │
│ └───────────────────────┘   │
│                             │
│ [Limpiar]  [Firmar]         │
│                             │
│ Nombre: Juan Pérez          │
│ Puesto: Inspector QC        │
│ Fecha: 15/Ene/2025 17:45    │
└─────────────────────────────┘

Dashboard Web - NCs:
┌──────────────────────────────────────────────────────────┐
│ 📋 Seguimiento de No Conformidades                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Filtros: [Abiertas ▼] [Todas Severidades ▼] [Proyecto ▼]│
│                                                           │
│ ┌─ Resumen ───────────────────────────────────────────┐  │
│ │ Total NCs: 12  |  Abiertas: 8  |  Cerradas: 4       │  │
│ │ Críticas: 2  |  Mayores: 6  |  Menores: 4           │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ NC-001  │ Mayor │ Espesor insuficiente │ Abierta     │ │
│ │ Lote 23 │ Vence: 20/Ene │ Resp: Juan Pérez          │ │
│ │ ⚠️ Vence en 5 días                                   │ │
│ │ [Ver Detalle] [Marcar Resuelta]                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ NC-002  │ Crítica │ Armado incompleto │ Abierta      │ │
│ │ Lote 24 │ Vence: 18/Ene │ Resp: María González      │ │
│ │ 🔴 VENCIDA hace 2 días                               │ │
│ │ [Ver Detalle] [Marcar Resuelta]                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│ ...más NCs...                                             │
└──────────────────────────────────────────────────────────┘

PDF Generado:
┌──────────────────────────────────────────────────┐
│                                                   │
│            [LOGO]  Fracc. Los Pinos               │
│                                                   │
│         CHECKLIST DE INSPECCIÓN DE CALIDAD        │
│                                                   │
│  Código: CHK-2025-00001                           │
│  Unidad: Lote 23 - Manzana A                      │
│  Fecha: 15/Enero/2025                             │
│  Inspector: Juan Pérez - Inspector QC             │
│                                                   │
│  Resultado: 85% Cumplimiento (ACEPTABLE)          │
│                                                   │
│ ─────────────────────────────────────────────────  │
│  ITEMS INSPECCIONADOS                             │
│ ─────────────────────────────────────────────────  │
│                                                   │
│  1. ¿Armado conforme a planos?       ✓ SÍ        │
│     Notas: Conforme                               │
│                                                   │
│  2. Espesor del firme (cm)          ✗ 9.5 cm     │
│     Ref: 10 ± 1 cm | FUERA DE TOLERANCIA         │
│     NC-001 registrada                             │
│                                                   │
│  ...                                              │
│                                                   │
│ ─────────────────────────────────────────────────  │
│  NO CONFORMIDADES (3)                             │
│ ─────────────────────────────────────────────────  │
│                                                   │
│  NC-001 (Mayor): Espesor insuficiente             │
│  Acción: Demoler y reconstruir                    │
│  Responsable: Juan Pérez                          │
│  Fecha límite: 20/Ene/2025                        │
│                                                   │
│  ...                                              │
│                                                   │
│ ─────────────────────────────────────────────────  │
│  FIRMA                                            │
│                                                   │
│         [Firma Digital]                           │
│         Juan Pérez                                │
│         Inspector QC                              │
│         15/Enero/2025 17:45                       │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## Endpoints Necesarios

```typescript
// Templates
GET    /api/evidence/checklist-templates
POST   /api/evidence/checklist-templates
GET    /api/evidence/checklist-templates/:id
PUT    /api/evidence/checklist-templates/:id

// Checklists
POST   /api/evidence/checklists              // Crear desde template
GET    /api/evidence/checklists/:id
PUT    /api/evidence/checklists/:id          // Actualizar items
POST   /api/evidence/checklists/:id/sign     // Firmar
GET    /api/evidence/checklists/:id/pdf      // Descargar PDF

// No Conformidades
POST   /api/evidence/checklists/:id/nc       // Registrar NC
GET    /api/evidence/nc                      // Listar NCs
PUT    /api/evidence/nc/:id/resolve          // Resolver NC
GET    /api/evidence/nc/dashboard            // Dashboard de NCs
```

---

## Definición de "Done"

- [x] CRUD de templates funcional
- [x] Creación de checklists desde templates
- [x] App móvil para completar checklists
- [x] Registro de NCs con fotos
- [x] Firma digital con canvas
- [x] Cálculo automático de compliance
- [x] Generación de PDF con PDFKit
- [x] Dashboard de seguimiento de NCs
- [x] Notificaciones de NCs vencidas
- [x] Tests unitarios >80%
- [x] Aprobado por Product Owner

---

**Estimación:** 5 Story Points
**Dependencias:** US-PROG-005 (Fotos)
**Fecha:** 2025-11-17
