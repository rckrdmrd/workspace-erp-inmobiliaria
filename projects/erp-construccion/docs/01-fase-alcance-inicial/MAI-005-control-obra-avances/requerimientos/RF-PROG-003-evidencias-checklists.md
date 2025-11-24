# RF-PROG-003: Evidencias Fotográficas y Checklists

**Épica:** MAI-005 - Control de Obra y Avances
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Sistema de captura, almacenamiento y organización de evidencias fotográficas georeferenciadas con marcas de agua. Incluye checklists de calidad por etapa constructiva para asegurar cumplimiento normativo y contractual.

---

## 2. Objetivos de Negocio

- **Evidencia:** Respaldo visual de cada etapa constructiva
- **Calidad:** Verificación de cumplimiento mediante checklists
- **Trazabilidad:** Vinculación foto-concepto-vivienda-fecha
- **Cumplimiento:** Documentación para INFONAVIT, cliente y auditorías

---

## 3. Alcance Funcional

### 3.1 Captura de Evidencias Fotográficas

**Formulario de Carga:**
```
┌──────────────────────────────────────────────────────┐
│ SUBIR EVIDENCIAS FOTOGRÁFICAS                        │
├──────────────────────────────────────────────────────┤
│ Proyecto: Fracc. Los Pinos                           │
│ Fecha: 15/Feb/2025 14:30                            │
│                                                      │
│ Ubicación:                                           │
│ Etapa: [1 ▼]                                        │
│ Frente: [B ▼]                                       │
│ Lote/vivienda: [23 ▼] (opcional)                   │
│                                                      │
│ Concepto/Actividad: [02.03 Cimentación ▼]          │
│ Subconcepto: [Colado de zapatas ▼] (opcional)      │
│                                                      │
│ Tipo de foto:                                        │
│ (●) Avance  ( ) Incidencia  ( ) Acabado final      │
│                                                      │
│ Fotos (arrastrar o click):                           │
│ ┌─────────┬─────────┬─────────┬─────────┐          │
│ │ [FOTO1] │ [FOTO2] │ [FOTO3] │ [FOTO4] │          │
│ │ 2.1 MB  │ 1.8 MB  │ 2.5 MB  │ 1.9 MB  │          │
│ │ ✓       │ ✓       │ ✓       │ ✓       │          │
│ └─────────┴─────────┴─────────┴─────────┘          │
│                                                      │
│ ☑ Agregar marca de agua automática                  │
│   (Proyecto, Fecha, Lote, Concepto)                 │
│                                                      │
│ ☑ Georreferenciar (ubicación GPS)                   │
│   📍 Lat: 25.6866, Lng: -100.3161                   │
│   Verificado: Dentro de obra ✓                      │
│                                                      │
│ Descripción:                                         │
│ [Colado de zapatas en lotes 20-23. Concreto 250   ]│
│ [kg/cm². Rev

isión de acero previa.                ]│
│                                                      │
│ Tags: #cimentación #zapatas #colado #calidad       │
│                                                      │
│            [Cancelar]  [Subir Evidencias]           │
└──────────────────────────────────────────────────────┘

Validaciones:
- Formato: JPG, PNG, HEIC (max 10MB c/u)
- Máximo: 20 fotos por carga
- Geolocalización dentro de radio de 500m de obra
- Fecha foto no puede ser futura
```

### 3.2 Galería de Evidencias

**Vista por Vivienda:**
```
EVIDENCIAS - Lote 23 (Prototipo Tipo A)

Filtros: [Todas las partidas ▼] [Últimos 30 días ▼] [🔍]

┌──────────────────────────────────────────────────────┐
│ 15/Feb/2025 - Cimentación (4 fotos)                 │
│ ┌───────┬───────┬───────┬───────┐                   │
│ │       │       │       │       │                   │
│ │ IMG1  │ IMG2  │ IMG3  │ IMG4  │                   │
│ │       │       │       │       │                   │
│ │ Zapata│ Acero │ Colado│ Acabado                   │
│ │ Z-01  │corrido│ muros │       │                   │
│ └───────┴───────┴───────┴───────┘                   │
│ Por: Ing. Pedro Ramírez                              │
│ 📍 Verificado en sitio                               │
│                                                      │
│ 10/Feb/2025 - Preliminares (3 fotos)                │
│ ┌───────┬───────┬───────┐                           │
│ │ Trazo │Nivel 0│Plantil│                           │
│ └───────┴───────┴───────┘                           │
│                                                      │
│ 05/Feb/2025 - Excavación (2 fotos)                  │
│ ┌───────┬───────┐                                    │
│ │ Excav │ Fondo │                                    │
│ └───────┴───────┘                                    │
└──────────────────────────────────────────────────────┘

Total: 87 fotos | Última: 15/Feb/2025

[📷 Agregar Fotos]  [📊 Vista Timeline]  [⬇️ Descargar Todo]
```

### 3.3 Vista de Foto Individual

**Detalle Completo:**
```
╔══════════════════════════════════════════════════════╗
║ EVIDENCIA FOTOGRÁFICA                                ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║                   [IMAGEN]                           ║
║        Colado de zapatas Lote 23                     ║
║                                                      ║
║  Marca de agua visible:                              ║
║  "Fracc. Los Pinos | Lote 23 | 15/Feb/2025 14:32"  ║
╠══════════════════════════════════════════════════════╣
║ Información                                          ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║ Proyecto:     Fracc. Los Pinos - Etapa 1            ║
║ Lote:         23 (Prototipo Tipo A)                 ║
║ Partida:      02.03 Cimentación                     ║
║ Subconcepto:  Colado de zapatas                     ║
║                                                      ║
║ Fecha captura: 15/Feb/2025 14:32                    ║
║ Capturado por: Ing. Pedro Ramírez                   ║
║ Dispositivo:   iPhone 13 Pro                        ║
║ Origen:        App móvil                            ║
║                                                      ║
║ Geolocalización:                                     ║
║ 📍 25.6866° N, 100.3161° W                          ║
║ Verificado: ✓ Dentro de obra (45m del centroide)   ║
║ [Ver en mapa →]                                     ║
║                                                      ║
║ Descripción:                                         ║
║ "Colado de zapatas en lotes 20-23. Concreto 250    ║
║ kg/cm². Revisión de acero previa."                  ║
║                                                      ║
║ Tags: #cimentación #zapatas #colado #calidad       ║
║                                                      ║
║ Metadata EXIF:                                       ║
║ Resolución: 4032 × 3024 (12.2 MP)                  ║
║ Tamaño:     2.3 MB                                  ║
║ Hash SHA256: a3f5...8b2c (integridad verificada)   ║
╠══════════════════════════════════════════════════════╣
║ [⬅ Anterior]  [Editar Info]  [Siguiente ➡]         ║
╚══════════════════════════════════════════════════════╝
```

### 3.4 Checklists de Calidad

**Checklist por Etapa Constructiva:**
```
┌──────────────────────────────────────────────────────┐
│ CHECKLIST DE CALIDAD - CIMENTACIÓN                   │
│ Lote: 23 | Prototipo: Tipo A                        │
│ Fecha: 15/Feb/2025                                  │
│ Inspector: Ing. Carlos Méndez (Control de Calidad)  │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ■ EXCAVACIÓN Y NIVELACIÓN                            │
│ ☑ Excavación a profundidad de proyecto (1.20m)      │
│    Evidencia: [📷 2 fotos]                          │
│ ☑ Nivel de fondo de excavación verificado           │
│    Tolerancia: ±2cm ✓                               │
│ ☑ Limpieza de fondo (sin tierra suelta)             │
│ ☐ Compactación de fondo (No aplica para este proto) │
│                                                      │
│ ■ ACERO DE REFUERZO                                  │
│ ☑ Diámetro de varillas según plano (#3, #4)         │
│    Medido: ✓ Conforme                               │
│ ☑ Separación de varillas (20cm)                     │
│    Tolerancia: ±1cm ✓                               │
│ ☑ Recubrimiento mínimo (5cm)                         │
│    Medido: 6cm ✓                                    │
│ ☑ Traslapes y anclajes correctos                    │
│    Longitud traslape: 40 diámetros ✓                │
│ ☑ Silletas/espaciadores colocados                   │
│    Evidencia: [📷 3 fotos]                          │
│                                                      │
│ ■ CIMBRA (Si aplica)                                 │
│ ☑ Nivel y plomada de cimbra                         │
│ ☑ Rigidez adecuada                                   │
│ ☑ Desmoldante aplicado                              │
│                                                      │
│ ■ CONCRETO                                            │
│ ☑ Resistencia especificada (f'c=250 kg/cm²)         │
│    Cilindros tomados: 3 (Lab: XYZ)                  │
│    Ticket de entrega: #12345                        │
│ ☑ Revenimiento en especificación (10-12 cm)         │
│    Medido: 11 cm ✓                                  │
│ ☑ Colado continuo sin juntas frías                  │
│ ☑ Vibrado adecuado                                   │
│    Evidencia: [📷 1 foto]                           │
│ ☑ Curado iniciado (agua/membrana)                   │
│    Método: Riego cada 4h por 7 días                │
│                                                      │
│ ■ GEOMETRÍA Y DIMENSIONES                            │
│ ☑ Dimensiones de zapatas (1.20 x 1.20 x 0.30m)     │
│    Tolerancia: ±2cm ✓                               │
│ ☑ Espesor de losa (10cm)                            │
│    Tolerancia: ±1cm ✓                               │
│                                                      │
│ ■ NO CONFORMIDADES                                   │
│ ⚠️ NC-001: Segregación leve en esquina SE zapata Z3 │
│    Severidad: Menor                                 │
│    Acción: Resane con mortero epóxico               │
│    Responsable: Maestro Juan Pérez                  │
│    Fecha límite: 18/Feb/2025                        │
│    Status: Pendiente                                │
│                                                      │
│ ■ APROBACIÓN                                          │
│ Cumplimiento: 95% (19 de 20 items OK)               │
│ Status: ✅ APROBADO CON OBSERVACIONES                │
│                                                      │
│ Firma Inspector: _______________________             │
│ Fecha: 15/Feb/2025                                  │
│                                                      │
│         [Guardar]  [Generar PDF]  [Enviar]          │
└──────────────────────────────────────────────────────┘
```

### 3.5 Catálogo de Checklists

**Templates por Partida:**
```
CATÁLOGO DE CHECKLISTS DE CALIDAD

┌──────────────────────────────────────────────────────┐
│ Partida                │ Items │ Oblig. │ Template  ││
├────────────────────────┼───────┼────────┼───────────┤│
│ 01-Preliminares        │  8    │  100%  │ [Usar]    ││
│ 02-Cimentación         │ 20    │  90%   │ [Usar]    ││
│ 03-Estructura          │ 25    │  95%   │ [Usar]    ││
│   03.01 Muros          │ 15    │  90%   │ [Usar]    ││
│   03.02 Losas          │ 18    │  95%   │ [Usar]    ││
│ 04-Instalaciones       │ 35    │  100%  │ [Usar]    ││
│   04.01 Hidráulicas    │ 12    │  100%  │ [Usar]    ││
│   04.02 Sanitarias     │ 10    │  100%  │ [Usar]    ││
│   04.03 Eléctricas     │ 13    │  100%  │ [Usar]    ││
│ 05-Acabados            │ 30    │  95%   │ [Usar]    ││
│   05.01 Yesos          │  8    │  90%   │ [Usar]    ││
│   05.02 Pisos          │ 10    │  100%  │ [Usar]    ││
│   05.03 Azulejos       │  7    │  100%  │ [Usar]    ││
│   05.04 Pintura        │  5    │  95%   │ [Usar]    ││
│ 06-Urbanización        │ 15    │  90%   │ [Usar]    ││
│ 07-Entrega Final       │ 40    │  100%  │ [Usar]    ││
└──────────────────────────────────────────────────────┘

[+ Crear Checklist Personalizado]
```

### 3.6 Reportes de Evidencias

**Reporte por Período:**
```
REPORTE DE EVIDENCIAS FOTOGRÁFICAS
Proyecto: Fracc. Los Pinos - Etapa 1
Período: Febrero 2025

┌──────────────────────────────────────────────────────┐
│ ■ Resumen Ejecutivo                                  │
│   Total de fotos:        1,247                      │
│   Viviendas con evidencias: 50 (100%)               │
│   Partidas documentadas: 6 de 6 (100%)              │
│   Fotos geolocalizadas: 1,189 (95.3%)              │
│   Promedio fotos/vivienda: 24.9                     │
│                                                      │
│ ■ Distribución por Partida                           │
│   01-Preliminares:     98 fotos ( 7.9%)            │
│   02-Cimentación:     287 fotos (23.0%)            │
│   03-Estructura:      412 fotos (33.0%)            │
│   04-Instalaciones:   298 fotos (23.9%)            │
│   05-Acabados:        142 fotos (11.4%)            │
│   06-Urbanización:     10 fotos ( 0.8%)            │
│                                                      │
│ ■ Checklists de Calidad                              │
│   Checklists aplicados: 150                         │
│   Cumplimiento promedio: 97.2% ✓                   │
│   No conformidades:   12 (8%)                       │
│     Menores:  10                                    │
│     Mayores:   2                                    │
│   Todas resueltas: ✓                                │
│                                                      │
│ ■ Almacenamiento                                      │
│   Espacio utilizado: 4.8 GB                         │
│   Respaldo en nube: ✓ Sincronizado                 │
│   Integridad: 100% verificada (SHA256)              │
└──────────────────────────────────────────────────────┘

[Exportar PDF]  [Descargar ZIP]  [Enviar a Cliente]
```

### 3.7 Búsqueda Avanzada

**Filtros Múltiples:**
```
┌──────────────────────────────────────────────────────┐
│ BÚSQUEDA DE EVIDENCIAS                               │
├──────────────────────────────────────────────────────┤
│ Proyecto: [Fracc. Los Pinos ▼]                      │
│ Etapa: [Todas ▼]                                    │
│                                                      │
│ Rango de fechas:                                     │
│ Desde: [01/Feb/2025]  Hasta: [28/Feb/2025]         │
│                                                      │
│ Ubicación:                                           │
│ Frente: [Todos ▼]                                   │
│ Lote/vivienda: [Todos ▼]                           │
│                                                      │
│ Concepto/Partida:                                    │
│ [02 - Cimentación ▼]                                │
│ Subconcepto: [Todos ▼]                              │
│                                                      │
│ Tipo de foto:                                        │
│ ☑ Avance  ☑ Incidencia  ☑ Acabado final            │
│                                                      │
│ Capturado por:                                       │
│ [Todos los usuarios ▼]                              │
│                                                      │
│ Tags: [#cimentación  #calidad  +]                   │
│                                                      │
│ ☑ Solo con geolocalización                          │
│ ☐ Solo con marca de agua                            │
│                                                      │
│ Búsqueda en descripción:                             │
│ [zapatas                                     🔍]     │
│                                                      │
│            [Limpiar Filtros]  [Buscar]              │
└──────────────────────────────────────────────────────┘

Resultados: 23 fotos encontradas
```

---

## 4. Modelo de Datos

```typescript
// photos (evidencias fotográficas)
{
  id: UUID,
  projectId: UUID,
  stageId: UUID NULLABLE,
  workfrontId: UUID NULLABLE,
  unitId: UUID NULLABLE, // lote/vivienda

  activityId: UUID NULLABLE,
  budgetItemId: UUID NULLABLE,

  photoType: ENUM('progress', 'incident', 'final', 'quality_check'),

  originalFilename: VARCHAR(255),
  storedFilename: VARCHAR(255),
  filePath: VARCHAR(512),
  fileSize: INTEGER, // bytes
  mimeType: VARCHAR(50),

  width: INTEGER,
  height: INTEGER,
  resolution: VARCHAR(20), // "4032x3024"

  captureDate: TIMESTAMP,
  uploadDate: TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  hasWatermark: BOOLEAN DEFAULT false,
  watermarkText: TEXT,

  geolocation: POINT, // PostGIS
  geoVerified: BOOLEAN DEFAULT false,
  distanceFromSite: DECIMAL(8,2), // metros

  description: TEXT,
  tags: VARCHAR[],

  uploadedBy: UUID,
  uploadedVia: ENUM('web', 'mobile', 'api'),

  // EXIF metadata
  deviceModel: VARCHAR(100),
  exifData: JSONB,

  // Hash para verificar integridad
  sha256Hash: VARCHAR(64),

  // Vinculación opcional
  progressRecordId: UUID NULLABLE,
  checklistId: UUID NULLABLE,

  isDeleted: BOOLEAN DEFAULT false,
  deletedAt: TIMESTAMP NULLABLE,
  deletedBy: UUID NULLABLE
}

// quality_checklists (checklists de calidad)
{
  id: UUID,
  projectId: UUID,
  unitId: UUID NULLABLE,

  templateId: UUID, // checklist template
  templateVersion: INTEGER,

  partida: VARCHAR(50),
  subpartida: VARCHAR(50) NULLABLE,

  inspectionDate: DATE,
  inspectorId: UUID,

  items: JSONB,
  /* [{
    itemId: string,
    question: string,
    isCompliant: boolean,
    measurement: number (optional),
    tolerance: string,
    notes: string,
    photoIds: UUID[]
  }] */

  totalItems: INTEGER,
  compliantItems: INTEGER,
  compliancePercent: DECIMAL(5,2) GENERATED,

  nonConformities: JSONB,
  /* [{
    ncId: string,
    severity: 'minor'|'major'|'critical',
    description: string,
    correctiveAction: string,
    responsibleId: UUID,
    dueDate: DATE,
    status: 'open'|'closed',
    closedDate: DATE
  }] */

  status: ENUM('draft', 'completed', 'approved', 'rejected'),
  approvalStatus: ENUM('approved', 'approved_with_observations', 'rejected'),

  approvedBy: UUID NULLABLE,
  approvedAt: TIMESTAMP NULLABLE,

  signatureData: TEXT, // base64 de firma digital
  signedAt: TIMESTAMP NULLABLE,

  pdfGenerated: BOOLEAN DEFAULT false,
  pdfPath: VARCHAR(512),

  createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

// checklist_templates (templates de checklists)
{
  id: UUID,
  code: VARCHAR(20),
  name: VARCHAR(255),

  partida: VARCHAR(50),
  subpartida: VARCHAR(50) NULLABLE,

  items: JSONB,
  /* [{
    itemId: string,
    order: number,
    question: string,
    type: 'boolean'|'measurement'|'selection',
    isRequired: boolean,
    tolerance: string (optional),
    options: string[] (for selection type)
  }] */

  version: INTEGER DEFAULT 1,
  isActive: BOOLEAN DEFAULT true,

  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}

// photo_albums (álbumes para organización)
{
  id: UUID,
  projectId: UUID,
  name: VARCHAR(255),
  description: TEXT,

  albumType: ENUM('by_unit', 'by_activity', 'by_date', 'custom'),

  photoIds: UUID[], // array de photo IDs

  coverPhotoId: UUID NULLABLE,

  createdBy: UUID,
  createdAt: TIMESTAMP
}
```

---

## 5. Criterios de Aceptación

- [ ] Carga de fotos desde web y app móvil
- [ ] Marcas de agua automáticas configurables
- [ ] Geolocalización automática con validación
- [ ] Organización por proyecto/etapa/lote/concepto
- [ ] Galería con filtros y búsqueda
- [ ] Metadata EXIF completa
- [ ] Hash SHA256 para verificar integridad
- [ ] Catálogo de checklists por partida
- [ ] Checklists con fotos vinculadas
- [ ] Registro de no conformidades
- [ ] Exportación de reportes (PDF, ZIP)
- [ ] Búsqueda avanzada con múltiples filtros
- [ ] Álbumes personalizados

---

**Estado:** ✅ Ready for Development
