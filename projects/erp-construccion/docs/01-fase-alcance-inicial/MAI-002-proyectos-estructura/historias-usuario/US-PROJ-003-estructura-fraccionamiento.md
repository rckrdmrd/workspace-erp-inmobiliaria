# US-PROJ-003: Crear Estructura de Fraccionamiento Horizontal

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 4
**Story Points:** 8 SP
**Prioridad:** P0 (Crítica)
**Estimación:** 3-4 días
**Versión:** 1.0

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** crear la estructura jerárquica completa de un fraccionamiento horizontal (Etapas → Manzanas → Lotes → Viviendas)
**Para** organizar y controlar el desarrollo del proyecto con todos sus componentes físicos

---

## Contexto de Negocio

Un fraccionamiento horizontal típico se estructura como:

```
Fraccionamiento Los Pinos
├── Etapa 1
│   ├── Manzana A (20 lotes)
│   ├── Manzana B (22 lotes)
│   └── Manzana C (18 lotes)
├── Etapa 2
│   ├── Manzana D (25 lotes)
│   └── Manzana E (20 lotes)
└── Etapa 3
    └── ...
```

La creación debe ser:
- **Rápida**: Wizard de 4 pasos
- **Flexible**: Creación masiva de lotes
- **Validada**: No permitir duplicados de códigos
- **Eficiente**: Asignación de prototipos en masa

---

## Criterios de Aceptación

### ✅ AC1: Acceso al Wizard de Estructura

**Dado** que soy Director/Admin
**Y** tengo un proyecto tipo "Fraccionamiento Horizontal"
**Cuando** accedo al detalle del proyecto
**Entonces** debo ver botón "Crear Estructura"
**Y** al hacer clic, se abre wizard de 4 pasos:
1. Crear Etapas
2. Crear Manzanas
3. Crear Lotes (en masa)
4. Resumen y Confirmación

---

### ✅ AC2: Paso 1 - Crear Etapas

**Formulario por etapa:**
- Código (auto-generado: ETAPA-1, ETAPA-2)
- Nombre (ej: "Etapa 1 - Los Pinos Norte")
- Área total (m²)
- Fechas planificadas: inicio, fin
- Número de manzanas estimadas

**Validaciones:**
- Código único dentro del proyecto
- Área > 0
- Fecha fin >= Fecha inicio

**Funcionalidad:**
- Botón "+ Agregar Etapa" para crear múltiples
- Mínimo 1 etapa obligatoria
- Vista previa: "3 etapas, 185 lotes estimados"

---

### ✅ AC3: Paso 2 - Crear Manzanas por Etapa

**Dado** que completé Paso 1 con 3 etapas
**Entonces** en Paso 2 veo:

```
Etapa 1:
  [+ Agregar Manzana]
  - Manzana A: 20 lotes, 2,400 m²
  - Manzana B: 22 lotes, 2,640 m²

Etapa 2:
  [+ Agregar Manzana]
  - Manzana C: 25 lotes, 3,000 m²
```

**Formulario por manzana:**
- Código (sugerido: MZA-A, MZA-B, editable)
- Nombre
- Número de lotes
- Área total (m²)
- Infraestructura: ☑ Agua ☑ Drenaje ☑ Electricidad ☑ Alumbrado ☑ Pavimento

**Funcionalidad:**
- Asistente de códigos (A, B, C... Z, AA, AB...)
- Calculadora: "20 lotes × 120m² = 2,400m² + 30% áreas verdes = 3,120m² total"
- Mínimo 1 manzana por etapa

---

### ✅ AC4: Paso 3 - Crear Lotes en Masa

**Dado** que completé Paso 2 con manzanas creadas
**Entonces** en Paso 3 puedo crear lotes en masa por manzana:

```
Manzana A (20 lotes):
  [Creación Masiva]

  Cantidad: [20]
  Código prefijo: [LOTE-]
  Número inicial: [1]

  Dimensiones:
  - Área: [120] m²
  - Frente: [6] m
  - Fondo: [20] m
  - Forma: [Rectangular ▼]

  Se crearán: LOTE-001, LOTE-002, ... LOTE-020

  [Crear Lotes]
```

**O** creación individual:
- Botón "+ Agregar Lote Manual"
- Para lotes con dimensiones especiales (esquina, irregular)

**Validaciones:**
- Máximo 500 lotes por operación
- Códigos únicos dentro de la etapa
- Área > 0

---

### ✅ AC5: Paso 4 - Resumen y Confirmación

**Muestra resumen completo:**

```
┌────────────────────────────────────────────────────────┐
│ Resumen de Estructura                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Total Etapas: 3                                        │
│ Total Manzanas: 8                                      │
│ Total Lotes: 185                                       │
│ Área Total: 67,200 m²                                  │
│                                                        │
│ Desglose por Etapa:                                    │
│                                                        │
│ Etapa 1 - Los Pinos Norte                              │
│   • 3 manzanas (A, B, C)                               │
│   • 62 lotes                                           │
│   • 22,320 m²                                          │
│                                                        │
│ Etapa 2 - Los Pinos Centro                             │
│   • 3 manzanas (D, E, F)                               │
│   • 68 lotes                                           │
│   • 24,480 m²                                          │
│                                                        │
│ Etapa 3 - Los Pinos Sur                                │
│   • 2 manzanas (G, H)                                  │
│   • 55 lotes                                           │
│   • 20,400 m²                                          │
│                                                        │
│             [← Regresar]        [Crear Estructura →]  │
└────────────────────────────────────────────────────────┘
```

**Al confirmar:**
- Transacción atómica (todo o nada)
- Barra de progreso: "Creando estructura... 45%"
- Al completar: "Estructura creada: 3 etapas, 8 manzanas, 185 lotes"
- Redirige a vista de árbol jerárquico

---

### ✅ AC6: Vista de Árbol Jerárquico

**Después de crear estructura, debo ver TreeView:**

```
▼ 🏘️ Fraccionamiento Los Pinos
  │
  ├─▼ 📂 Etapa 1 - Los Pinos Norte (planeada, 62 lotes)
  │  │
  │  ├─▼ 🏗️ Manzana A (20 lotes, 0% infraestructura)
  │  │  ├─ 📦 LOTE-001 (120 m², disponible)
  │  │  ├─ 📦 LOTE-002 (120 m², disponible)
  │  │  └─ ... (18 más)
  │  │
  │  ├─▼ 🏗️ Manzana B (22 lotes)
  │  │  └─ ...
  │  │
  │  └─▼ 🏗️ Manzana C (20 lotes)
  │     └─ ...
  │
  ├─▶ 📂 Etapa 2 (colapsada)
  │
  └─▶ 📂 Etapa 3 (colapsada)
```

**Funcionalidades del árbol:**
- Expandir/colapsar niveles
- Filtros: por estado, por prototipo asignado
- Búsqueda: por código de lote
- Acciones rápidas: editar, eliminar, asignar prototipo
- Exportar a Excel

---

### ✅ AC7: Edición de Estructura Existente

**Dado** que ya existe estructura creada
**Entonces** puedo:

**Agregar elementos:**
- "+ Nueva Etapa" (al proyecto)
- "+ Nueva Manzana" (a una etapa)
- "+ Nuevos Lotes" (a una manzana, en masa o individual)

**Editar elementos:**
- Cambiar nombre, código, dimensiones
- Actualizar estado (planeada → en_proceso → terminada)
- Marcar infraestructura completada

**Eliminar elementos:**
- Solo si NO tienen hijos (lote sin vivienda, manzana sin lotes)
- Confirmación: "¿Eliminar Manzana A y sus 20 lotes?"

---

### ✅ AC8: Validaciones de Negocio

**Códigos únicos:**
- Etapa: único en proyecto
- Manzana: único en etapa
- Lote: único en etapa (puede repetirse en diferentes etapas)

**Restricciones:**
- No permitir eliminar etapa con lotes vendidos
- No permitir eliminar manzana con lotes en construcción
- Al eliminar manzana, eliminar cascada de lotes

**Cálculos automáticos:**
- `totalLots` en manzana = COUNT(lots)
- `totalLots` en etapa = SUM(totalLots de manzanas)
- `totalAreaSqm` = SUM(areaSqm de lotes)

---

## Escenarios de Prueba

### Escenario 1: Crear Estructura Completa (Happy Path)

**Given** proyecto "Fraccionamiento Los Pinos" en estado Adjudicado
**When** completo wizard con:
- 3 etapas
- 8 manzanas totales
- 185 lotes creados en masa
**Then** estructura se crea exitosamente
**And** puedo ver árbol jerárquico completo
**And** métricas del proyecto se actualizan: totalHousingUnits = 185

---

### Escenario 2: Crear Lotes en Masa con Códigos Secuenciales

**Given** Manzana A necesita 50 lotes
**When** uso creación masiva:
- Cantidad: 50
- Prefijo: LOTE-
- Inicio: 1
**Then** sistema crea: LOTE-001, LOTE-002, ... LOTE-050
**And** todos con área 120 m² y forma rectangular

---

### Escenario 3: Validación de Código Duplicado

**Given** ya existe lote LOTE-001 en Manzana A
**When** intento crear otro LOTE-001 en la misma Manzana A
**Then** sistema muestra error: "El código LOTE-001 ya existe en esta etapa"
**And** no permite guardar

---

## Definición de Done (DoD)

- [ ] Wizard de 4 pasos funcional
- [ ] Creación masiva de lotes (hasta 500)
- [ ] Validación de códigos únicos
- [ ] TreeView con expandir/colapsar
- [ ] Edición de elementos existentes
- [ ] Eliminación con validación de dependencias
- [ ] Transacción atómica (rollback si falla)
- [ ] Tests de creación masiva
- [ ] Performance: crear 500 lotes en <3 segundos
- [ ] Responsive (mobile/tablet/desktop)

---

## Notas Técnicas

**Endpoints:**
```
POST /api/projects/:projectId/stages
POST /api/stages/:stageId/blocks
POST /api/stages/:stageId/lots/bulk
GET  /api/projects/:projectId/structure/tree
```

**Bulk Creation:**
```typescript
{
  "stageId": "uuid",
  "blockId": "uuid",
  "quantity": 50,
  "codePrefix": "LOTE-",
  "startNumber": 1,
  "areaSqm": 120,
  "frontMeters": 6,
  "depthMeters": 20,
  "shape": "rectangular"
}
```

---

## Dependencias

**Depende de:**
- ✅ US-PROJ-001: Catálogo de Proyectos
- ✅ ET-PROJ-002: Especificación de estructura jerárquica

**Bloquea a:**
- US-PROJ-006: Asignación de Prototipos (necesita lotes)

---

**Fecha:** 2025-11-17
**Estado:** ✅ Ready for Development
