# US-PROJ-006: Asignación de Prototipos a Lotes

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 5
**Story Points:** 3 SP
**Prioridad:** P1 (Alta)
**Estimación:** 1-2 días

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** asignar prototipos de vivienda a lotes individuales o en masa
**Para** definir qué tipo de casa se construirá en cada lote y heredar características del prototipo

---

## Criterios de Aceptación

### ✅ AC1: Asignación Individual

**Dado** que estoy viendo detalle de un lote
**Cuando** hago clic "Asignar Prototipo"
**Entonces** veo modal con:
- Catálogo de prototipos activos (galería)
- Filtros por categoría/segmento
- Vista previa del prototipo seleccionado
- Info: "Este lote requiere 120 m², el prototipo ocupa 45 m² ✓"

**Al asignar:**
- `lot.prototypeId` = UUID del prototipo
- `lot.prototypeVersion` = versión actual (ej: 2)
- Mostrar confirmación: "Prototipo Casa Tipo A v2 asignado a LOTE-001"

### ✅ AC2: Asignación en Masa

**Dado** que estoy en vista de lotes
**Cuando** selecciono 20 lotes (checkboxes)
**Y** hago clic "Asignar Prototipo en Masa"
**Entonces** veo modal:

```
┌──────────────────────────────────────────────────┐
│ Asignar Prototipo a 20 Lotes                     │
├──────────────────────────────────────────────────┤
│                                                  │
│ Lotes seleccionados:                            │
│ LOTE-001, LOTE-002, LOTE-003, ... (+17 más)     │
│                                                  │
│ Prototipo:                                       │
│ [Seleccionar prototipo ▼]                       │
│                                                  │
│ ● Casa Tipo A v2                                 │
│   2 rec, 1 baño, 45 m², $382,500                │
│   [Vista Previa]                                 │
│                                                  │
│ ✅ Validación:                                    │
│ ☑ Todos los lotes tienen >= 120 m²             │
│ ☑ Ningún lote tiene vivienda construida         │
│                                                  │
│                      [Cancelar]  [Asignar a 20] │
└──────────────────────────────────────────────────┘
```

**Al confirmar:**
- Actualiza 20 lotes en transacción
- Incrementa `usageCount` del prototipo en +20
- Notificación: "Prototipo asignado a 20 lotes"

### ✅ AC3: Validaciones

**No permitir asignar si:**
- Lote ya tiene vivienda construida
- Área del lote < área requerida por prototipo
- Prototipo está deprecated (advertencia, permitir con confirmación)

**Advertencias (no bloquean):**
- "El prototipo seleccionado requiere 120 m², este lote tiene 115 m²"
- "Este prototipo está deprecated (v1), se recomienda usar v2"

### ✅ AC4: Reasignación

**Dado** lote con prototipo ya asignado
**Cuando** asigno otro prototipo
**Entonces** sistema pregunta:
```
⚠️ Cambiar prototipo asignado

Lote LOTE-001 tiene asignado:
  Casa Tipo A v2

Nuevo prototipo:
  Casa Tipo B v1

¿Confirmas el cambio?

[Cancelar]  [Cambiar Prototipo]
```

**Al cambiar:**
- Decrementa `usageCount` del prototipo anterior
- Incrementa `usageCount` del nuevo prototipo
- Si lote tiene vivienda: NO permitir cambio

### ✅ AC5: Vista de Lotes con Prototipos

**En TreeView, mostrar:**
```
📦 LOTE-001 (120 m², disponible)
   🏠 Casa Tipo A v2
   👤 Sin asignar a cliente
```

**Filtros adicionales:**
- "Lotes sin prototipo"
- "Lotes con prototipo X"
- "Lotes por segmento"

---

## Escenarios de Prueba

**Escenario 1:** Asignar en masa a 50 lotes
**Given** 50 lotes sin prototipo
**When** selecciono todos y asigno Casa Tipo A v2
**Then** 50 lotes quedan con prototypeId y version
**And** usageCount incrementa +50

**Escenario 2:** Intentar asignar a lote con vivienda
**Given** LOTE-001 tiene vivienda en construcción
**When** intento asignar prototipo
**Then** sistema bloquea: "No se puede cambiar prototipo de lote con vivienda"

---

## Definición de Done

- [ ] Asignación individual funcional
- [ ] Asignación en masa (hasta 500 lotes)
- [ ] Validaciones de área y estado
- [ ] Reasignación con confirmación
- [ ] Incremento/decremento de usageCount
- [ ] Filtros en TreeView
- [ ] Tests de asignación masiva
- [ ] Performance: asignar 500 lotes <2 seg

---

## Notas Técnicas

**Endpoints:**
```
PUT  /api/lots/:id/assign-prototype
PUT  /api/lots/bulk-assign-prototype

Body:
{
  "lotIds": ["uuid1", "uuid2", ...],
  "prototypeId": "uuid",
  "prototypeVersion": 2
}
```

---

**Estado:** ✅ Ready for Development
