# US-PROJ-004: Crear Estructura de Torre Vertical

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 4
**Story Points:** 6 SP
**Prioridad:** P1 (Alta)
**Estimación:** 2-3 días

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** crear la estructura de un edificio vertical (Torre/Edificio → Niveles → Departamentos)
**Para** organizar proyectos de construcción vertical con su distribución por pisos

---

## Criterios de Aceptación

### ✅ AC1: Wizard Adaptado para Edificios

**Dado** proyecto tipo "edificio_vertical"
**Entonces** wizard muestra:
1. Crear Torres/Edificios
2. Crear Niveles (en vez de Manzanas)
3. Crear Departamentos (en vez de Lotes)
4. Resumen

**Terminología adaptada:**
- Etapa = Torre/Edificio
- Manzana = Nivel/Piso
- Lote = Departamento
- Código departamento: DEPTO-101, DEPTO-102 (piso-número)

### ✅ AC2: Creación de Niveles

**Formulario:**
- Código: NIVEL-PB, NIVEL-1, NIVEL-2...
- Número de piso: -1 (sótano), 0 (PB), 1, 2, 3...
- Departamentos por nivel: 4
- Área construida del nivel: 480 m²

**Plantilla común:**
- "Crear N niveles iguales": 8 niveles, 4 deptos c/u
- Auto-numeración: NIVEL-1 a NIVEL-8

### ✅ AC3: Creación de Departamentos

**Código sugerido:** `DEPTO-{piso}{número}`
- Nivel 1: DEPTO-101, DEPTO-102, DEPTO-103, DEPTO-104
- Nivel 2: DEPTO-201, DEPTO-202, DEPTO-203, DEPTO-204

**Creación masiva por nivel:**
- Cantidad: 4
- Área: 75 m² cada uno
- Orientación: Norte, Sur, Este, Oeste

### ✅ AC4: Vista de Torre

**TreeView:**
```
🏢 Torre Central (8 niveles, 32 deptos)
├─ 📐 NIVEL-8 (4 deptos, 85% construcción)
├─ 📐 NIVEL-7 (4 deptos, 90% construcción)
├─ 📐 NIVEL-6 (4 deptos, 95% construcción)
└─ ...
```

---

## Escenarios de Prueba

**Escenario:** Crear torre de 10 niveles con 4 deptos por nivel
**Given** proyecto "Torre Residencial"
**When** completo wizard:
- 1 torre
- 10 niveles
- 40 departamentos
**Then** estructura se crea con códigos DEPTO-101 a DEPTO-1004

---

## Definición de Done

- [ ] Wizard adaptado para torres
- [ ] Terminología correcta (Torre, Nivel, Depto)
- [ ] Códigos con formato piso-número
- [ ] Plantilla de niveles repetitivos
- [ ] TreeView funcional
- [ ] Tests de creación masiva

---

## Notas Técnicas

**Diferencias con Fraccionamiento:**
- `blockId` representa nivel, no manzana
- Códigos departamento: formato XXX (3 dígitos)
- Orientación del departamento (Norte/Sur/Este/Oeste)

---

**Estado:** ✅ Ready for Development
