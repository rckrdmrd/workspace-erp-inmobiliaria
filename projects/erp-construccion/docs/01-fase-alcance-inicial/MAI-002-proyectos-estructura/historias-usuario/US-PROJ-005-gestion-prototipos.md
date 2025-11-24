# US-PROJ-005: Gestión de Prototipos de Vivienda

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 5
**Story Points:** 5 SP
**Prioridad:** P1 (Alta)
**Estimación:** 2-3 días

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** crear y gestionar un catálogo de prototipos de vivienda con todas sus características técnicas y costos
**Para** reutilizar modelos estándar y asignarlos a lotes de manera eficiente

---

## Criterios de Aceptación

### ✅ AC1: Catálogo de Prototipos

**Dado** que accedo a "Prototipos"
**Entonces** veo galería con:
- Imagen fachada/render
- Nombre: "Casa Tipo A - Modelo Compacto"
- Código: CASA-2025-001
- Categoría: Casa Unifamiliar / Departamento / Dúplex
- Segmento: Interés Social / Medio / Residencial / Premium
- Características: 2 rec., 1 baño, 1 auto, 45 m²
- Costo: $382,500 MXN
- Versión: v1
- Usado en: 12 lotes

**Filtros:**
- Por categoría
- Por segmento
- Por rango de precio
- Solo activos / Todos

### ✅ AC2: Crear Prototipo

**Formulario (6 secciones):**

**1. Básica:**
- Nombre, código (auto), categoría, segmento, descripción

**2. Características:**
- Niveles, recámaras, baños, medios baños, cajones estacionamiento

**3. Áreas:**
- Terreno requerido, construida nivel 1, nivel 2, total

**4. Distribución:**
- ☑ Sala ☑ Comedor ☑ Cocina integral ☑ Cuarto servicio

**5. Acabados:**
- Pisos, muros, cocina, baños, puertas, ventanas

**6. Costos:**
- Costo por m², costo construcción, urbanización, total llave en mano

**Validaciones:**
- Total construida = nivel 1 + nivel 2
- Costo total = construcción + urbanización
- Campos obligatorios completos

### ✅ AC3: Versionado de Prototipos

**Dado** prototipo "Casa Tipo A v1" existente
**Cuando** hago clic "Crear Nueva Versión"
**Entonces:**
- Sistema clona datos de v1
- Puedo modificar: áreas, costos, acabados
- Debo especificar: "Cambios desde versión anterior"
- Al guardar: v1 se marca como "deprecated", v2 queda "active"
- Código mantiene: CASA-2025-001 (mismo), versión incrementa

**Historial de versiones:**
```
v2 (activa) - 15/11/2025
  Cambios: "Incremento de área de cocina en 5 m²"
v1 (depreciada) - 01/09/2025
  Original
```

### ✅ AC4: Galería Visual

**Vista de cards:**
- Grid 3 columnas (desktop)
- Imagen principal (o placeholder si no hay)
- Info clave visible
- Badge de segmento con color
- Hover: botones editar/ver/clonar

**Vista de detalle:**
- Tabs: Características / Áreas / Acabados / Costos / Historial
- Botones: Editar / Nueva Versión / Depreciar / Eliminar
- Lotes que usan este prototipo (si >0, no se puede eliminar)

---

## Escenarios de Prueba

**Escenario 1:** Crear prototipo "Casa Tipo A"
**Given** accedo a "Nuevo Prototipo"
**When** completo formulario:
- Nombre: Casa Tipo A
- Categoría: Casa Unifamiliar
- Segmento: Interés Social
- 2 rec, 1 baño, 45 m², $382,500
**Then** sistema genera CASA-2025-001 v1
**And** aparece en galería

**Escenario 2:** Crear versión 2 con área incrementada
**Given** existe Casa Tipo A v1 (45 m²)
**When** creo nueva versión con 50 m²
**Then** v1 queda deprecated, v2 activa
**And** lotes asignados a v1 NO se actualizan (snapshot)

---

## Definición de Done

- [ ] CRUD de prototipos completo
- [ ] Galería responsive con filtros
- [ ] Versionado funcional
- [ ] Depreciación de versiones antiguas
- [ ] Validación: no eliminar si usageCount > 0
- [ ] Auto-generación de códigos
- [ ] Formulario con 60+ campos
- [ ] Tests unitarios de versionado

---

## Notas Técnicas

**Endpoints:**
```
GET    /api/housing-prototypes
GET    /api/housing-prototypes/:id
POST   /api/housing-prototypes
POST   /api/housing-prototypes/version
PUT    /api/housing-prototypes/:id
DELETE /api/housing-prototypes/:id
PUT    /api/housing-prototypes/:id/deprecate
```

**Auto-código:**
- CASA-YYYY-XXX
- DEPTO-YYYY-XXX
- DUPLEX-YYYY-XXX

---

**Estado:** ✅ Ready for Development
