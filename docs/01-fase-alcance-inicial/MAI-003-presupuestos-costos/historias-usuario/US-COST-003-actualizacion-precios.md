# US-COST-003: Actualización Masiva de Precios

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 7
**Story Points:** 3 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Gerente Administrativo
**Quiero** actualizar precios masivamente por categoría o proveedor
**Para** ajustar el catálogo rápidamente ante cambios de mercado

---

## Criterios de Aceptación

### ✅ AC1: Selección de Conceptos

**Opciones de selección:**
1. Por categoría: "Todos los cementantes"
2. Por proveedor: "Todos de Cemex"
3. Por búsqueda: "Todos con 'acero'"
4. Selección manual: Checkboxes

**Ejemplo:**
```
Categoría: Cementantes
12 conceptos seleccionados:
✓ Cemento CPC 30R
✓ Cemento blanco
✓ Cal hidratada
...
```

### ✅ AC2: Tipos de Ajuste

**Opción 1: Porcentual**
- Ajuste: +4.5%
- Vigencia: 01/Dic/2025
- Motivo: "Ajuste INPC Nov 2025"

**Opción 2: Precio Fijo**
- Nuevo precio: $4,500
- Aplicar a todos seleccionados

**Preview antes de aplicar:**
| Concepto | Actual | Nuevo | Δ |
|----------|--------|-------|---|
| Cemento CPC 30R | $4,300 | $4,493 | +4.5% |
| Cemento blanco | $5,200 | $5,434 | +4.5% |
| ... | ... | ... | ... |

### ✅ AC3: Historial de Cambios

**Por cada concepto:**
```
Cemento CPC 30R - Historial

2025-01-01: $4,150 → Precio inicial
2025-03-15: $4,300 (+3.6%) → Ajuste trimestral
2025-06-01: $4,350 (+1.2%) → Incremento proveedor
2025-12-01: $4,493 (+3.3%) → Ajuste INPC Nov 2025 ← Actual
```

**Gráfica de tendencia:** Último año

### ✅ AC4: Notificaciones

**Cuando actualizo precios:**
- Sistema emite evento: `concepts.prices_updated`
- Notifica a:
  - Ingenieros de costos
  - Directores de proyecto
- Mensaje: "12 conceptos actualizados (+4.5%)"
- Sugerencia: "Revisar presupuestos activos"

---

## Definición de Done

- [ ] Selección múltiple de conceptos
- [ ] Ajuste porcentual y fijo
- [ ] Preview antes de aplicar
- [ ] Historial de precios
- [ ] Gráfica de tendencia
- [ ] Notificaciones automáticas
- [ ] Registro en audit log

---

**Estado:** ✅ Ready for Development
