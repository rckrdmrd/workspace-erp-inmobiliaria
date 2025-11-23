# US-COST-001: Catálogo de Conceptos y Búsqueda

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 7
**Story Points:** 5 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Ingeniero de Costos
**Quiero** gestionar un catálogo de conceptos de obra con búsqueda y filtros
**Para** reutilizar conceptos entre proyectos y mantener precios actualizados

---

## Criterios de Aceptación

### ✅ AC1: Listado de Conceptos

**Dado** que accedo a "Catálogo de Conceptos"
**Entonces** veo tabla paginada:

| Código | Nombre | Tipo | Categoría | Unidad | PU | Estado |
|--------|--------|------|-----------|--------|-----|--------|
| MAT-2025-001 | Cemento CPC 30R | Material | Cementantes | ton | $4,300 | Activo |
| MO-2025-015 | Oficial albañil | MO | Albañilería | jornal | $675 | Activo |
| CC-2025-045 | Cimentación corrida | Compuesto | Cimentación | m³ | $7,492 | Activo |

**Paginación:** 20 conceptos por página

### ✅ AC2: Búsqueda y Filtros

**Funcionalidad:**
- Búsqueda full-text por código/nombre/descripción
- Filtros: Tipo, Categoría, Estado
- Respuesta: <200ms

**Ejemplo:**
```
Búsqueda: "cemento"
Resultados: 3 conceptos encontrados
- Cemento CPC 30R
- Cemento blanco
- Adhesivo base cemento
```

### ✅ AC3: Crear Concepto Simple

**Formulario:**
- Código: Auto-generado (MAT-2025-XXX)
- Nombre: "Cemento CPC 30R gris 50kg"
- Tipo: Material
- Categoría: Cementantes
- Unidad: ton
- Precio base: $4,300
- Factor desperdicio: 1.03 (3%)
- Proveedor preferido: [Selector]

**Validación:**
- Código único
- Precio > 0

### ✅ AC4: Importar desde Excel

**Flujo:**
1. Descargar plantilla (.xlsx)
2. Completar 500 conceptos
3. Subir archivo
4. Sistema valida:
   - Códigos únicos
   - Precios válidos
   - Unidades correctas
5. Preview de 10 primeros
6. Confirmar importación
7. 500 conceptos creados

**Manejo de errores:**
- Mostrar filas con error
- Permitir corregir y reintentar

---

## Escenarios de Prueba

**Escenario 1:** Crear 200 conceptos
**Given** catálogo vacío
**When** creo 200 conceptos
**Then** búsqueda responde en <200ms

**Escenario 2:** Importar Excel con errores
**Given** archivo con 10 errores
**When** importo
**Then** sistema muestra 10 errores
**And** permite corregir

---

## Definición de Done

- [ ] CRUD completo de conceptos
- [ ] 4 tipos: material, MO, maquinaria, compuesto
- [ ] Búsqueda full-text <200ms
- [ ] Filtros por tipo/categoría/estado
- [ ] Importación desde Excel
- [ ] Exportación a Excel
- [ ] Tests unitarios
- [ ] Documentación API

---

**Estado:** ✅ Ready for Development
