# US-COST-005: Presupuesto de Prototipo con Generadores

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 8
**Story Points:** 5 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Ingeniero de Costos
**Quiero** generar presupuesto de prototipo con volumetrías automáticas
**Para** calcular costo unitario por vivienda en minutos

---

## Criterios de Aceptación

### ✅ AC1: Generadores Automáticos

**Entrada: Características del prototipo**
- Superficie construida: 45 m²
- Terreno: 120 m²
- Recámaras: 2
- Baños: 1
- Perímetro edificación: 30 m
- Altura promedio: 2.70 m

**Generadores ejecutan fórmulas:**
```javascript
Excavación = desplantDepth * perímetro * 0.60 * 0.80
          = 0.80 × 30 × 0.60 × 0.80
          = 11.52 m³

Muro block = perímetro × altura - openingsArea
          = 30 × 2.70 - 12
          = 69 m²

Losa azotea = builtArea × 1.0
           = 45 × 1.0
           = 45 m²
```

**Resultado:** 200 partidas con cantidades calculadas

### ✅ AC2: Plantilla de Conceptos

**Sistema carga plantilla "Vivienda Unifamiliar 1 Nivel":**
- 200 conceptos predefinidos
- Agrupados por división CMIC
- Cada concepto tiene:
  - Código del catálogo
  - Nombre
  - Unidad
  - Generador (fórmula) o cantidad manual
  - Precio unitario del catálogo

**Ejemplo de partidas:**
```
02 CIMENTACIÓN
  02.01.001 Excavación manual             11.52 m³  × $180  = $2,074
  02.01.002 Plantilla concreto pobre      30.00 m²  × $125  = $3,750
  02.01.003 Cimiento corrido armado       5.00 m³   × $7,492 = $37,460

03 ESTRUCTURA
  03.01.001 Castillos 15x15 armados       2.50 m³   × $9,800 = $24,500
  03.02.001 Dalas 15x20 armadas           2.00 m³   × $9,500 = $19,000
  03.03.001 Losa 12cm aligerada           45.00 m²  × $1,850 = $83,250
```

### ✅ AC3: Resumen por División

**Cálculo final:**
```
División               Importe      %      $/m²
────────────────────────────────────────────────
01 Preliminares        $2,250      0.3%   $50
02 Cimentación         $69,034     8.4%   $1,534
03 Estructura          $126,750    15.4%  $2,817
04 Albañilería         $102,450    12.4%  $2,277
...
────────────────────────────────────────────────
COSTO DIRECTO          $650,000    78.7%  $14,444
Indirectos (12%)       $78,000     9.4%   $1,733
Financiamiento (3%)    $19,500     2.4%   $433
Utilidad (10%)         $65,000     7.9%   $1,444
Cargos (2%)            $13,000     1.6%   $289
────────────────────────────────────────────────
TOTAL                  $825,500    100%   $18,344/m²
```

---

## Definición de Done

- [ ] Plantilla de 200 conceptos base
- [ ] 20+ generadores automáticos
- [ ] Fórmulas editables
- [ ] Recalcular al cambiar características
- [ ] Resumen por división
- [ ] Indicadores: $/m², costo total
- [ ] Exportar APU completo
- [ ] Vincular a prototipo

---

**Estado:** ✅ Ready for Development
