# US-COST-002: Análisis de Precios Unitarios Compuestos

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 7
**Story Points:** 5 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Ingeniero de Costos
**Quiero** crear conceptos compuestos con análisis de precios unitarios
**Para** calcular costos detallados partida por partida

---

## Criterios de Aceptación

### ✅ AC1: Crear Concepto Compuesto

**Formulario con 4 secciones:**

**1. Información Básica**
- Código: CC-2025-001 (auto)
- Nombre: "Cimentación corrida concreto armado"
- Categoría: Cimentación
- Unidad: m³

**2. Materiales**
| Material | Cantidad | Unidad | PU | Subtotal |
|----------|----------|--------|-----|-----------|
| Concreto f'c=200 | 1.05 | m³ | $2,450 | $2,572 |
| Acero fy=4200 | 80 | kg | $18 | $1,440 |
| Cimbra madera | 4 | m² | $125 | $500 |
| **Total Materiales** | | | | **$4,512** |

**3. Mano de Obra**
| Categoría | Jornales | $/día | FSR | Subtotal |
|-----------|----------|-------|-----|----------|
| Oficial albañil | 0.25 | $450 | 1.50 | $675 |
| Ayudante | 0.50 | $300 | 1.50 | $450 |
| **Total MO** | | | | **$1,125** |

**4. Cálculo Final**
```
Costo Directo:         $5,637
+ Indirectos (12%):    $676
+ Financiamiento (3%): $169
+ Utilidad (10%):      $564
+ Cargos (2%):         $113
────────────────────────────
Precio Unitario:       $7,159
+ IVA (16%):           $1,145
────────────────────────────
TOTAL:                 $8,304/m³
```

### ✅ AC2: Editar Componentes

**Funcionalidad:**
- Agregar/eliminar materiales
- Modificar cantidades
- Recalcular automáticamente

**Ejemplo:**
Si cambio acero de 80 kg a 85 kg:
- Costo acero: $1,530 (+$90)
- Costo directo: $5,727
- PU final: $7,274 (+$115)

### ✅ AC3: Copiar Concepto

**Flujo:**
1. Concepto "Cimentación corrida" seleccionado
2. Clic "Copiar Concepto"
3. Sistema crea copia:
   - Código: CC-2025-002
   - Nombre: "Copia de Cimentación corrida"
   - Todos los componentes copiados
4. Editar según necesidad

---

## Definición de Done

- [ ] Formulario de 4 secciones
- [ ] Agregar materiales desde catálogo
- [ ] Agregar MO con FSR
- [ ] Cálculo automático de PU
- [ ] 5 factores: indirectos, financ, utilidad, cargos, IVA
- [ ] Edición en tiempo real
- [ ] Copiar conceptos
- [ ] Vista previa de APU (Análisis de Precio Unitario)

---

**Estado:** ✅ Ready for Development
