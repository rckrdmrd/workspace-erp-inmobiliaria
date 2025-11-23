# RF-COST-002: Presupuestos Maestros (Obra, Etapa, Prototipo)

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17
**Responsable:** Equipo de Producto

---

## 1. Descripción General

Sistema de elaboración, gestión y control de presupuestos de construcción en tres niveles jerárquicos:
1. **Presupuesto de Obra**: Costo total del proyecto completo
2. **Presupuesto de Etapa**: Costo por etapa constructiva
3. **Presupuesto de Prototipo**: Costo unitario por tipo de vivienda

Permite estimar costos con precisión, controlar presupuesto vs real, analizar desviaciones y tomar decisiones informadas durante la ejecución del proyecto.

---

## 2. Objetivos de Negocio

### 2.1 Precisión en Estimación
- Presupuestos detallados partida por partida
- Integración automática desde catálogo de conceptos
- Cálculo de volumetrías basado en planos/prototipos
- Margen de error <3% vs costo real

### 2.2 Control Multi-nivel
- **Nivel Obra**: Vista consolidada de todo el proyecto
- **Nivel Etapa**: Control por fase de ejecución
- **Nivel Prototipo**: Costo estándar por tipo de vivienda
- Relación clara entre niveles (suma de etapas = presupuesto obra)

### 2.3 Versionado y Trazabilidad
- Presupuesto original (baseline)
- Presupuestos ajustados (volúmenes adicionales, cambios)
- Histórico completo de versiones
- Comparación versión actual vs baseline

### 2.4 Análisis de Rentabilidad
- Precio de venta proyectado
- Margen bruto por vivienda/proyecto
- Punto de equilibrio
- ROI estimado

---

## 3. Alcance Funcional

### 3.1 Presupuesto de Obra

#### Estructura
```
Proyecto: Fraccionamiento Los Pinos
Presupuesto: PRES-2025-001
Versión: 2 (actual)
Fecha: 15/11/2025
Responsable: Ing. Juan Pérez

┌─────────────────────────────────────────────────────────────┐
│ RESUMEN GENERAL                                             │
├─────────────────────────────────────────────────────────────┤
│ Alcance total: 150 viviendas en 3 etapas                    │
│ Superficie construida: 6,750 m² (45 m²/vivienda)            │
│ Urbanización: 2.5 hectáreas                                 │
│                                                              │
│ COSTO TOTAL OBRA:                           $127,500,000    │
│   ├─ Costo directo:                         $95,625,000     │
│   ├─ Indirectos (12%):                      $11,475,000     │
│   ├─ Financiamiento (3%):                   $2,868,750      │
│   ├─ Utilidad (10%):                        $9,562,500      │
│   └─ Cargos adicionales (2%):               $1,912,500      │
│                                                              │
│ Precio venta proyectado:                    $165,750,000    │
│ Margen bruto:                               $38,250,000     │
│ % Margen:                                   30%             │
└─────────────────────────────────────────────────────────────┘

DESGLOSE POR DIVISIÓN (CMIC)
┌───┬──────────────────────┬────────────┬─────────┬──────────┐
│ # │ División             │ Importe    │ %       │ $/m²     │
├───┼──────────────────────┼────────────┼─────────┼──────────┤
│ 01│ Preliminares         │ $1,912,500 │ 1.5%    │ $283     │
│ 02│ Cimentación          │ $11,475,000│ 9.0%    │ $1,700   │
│ 03│ Estructura           │ $19,125,000│ 15.0%   │ $2,833   │
│ 04│ Albañilería          │ $15,937,500│ 12.5%   │ $2,361   │
│ 05│ Inst. Hidráulicas    │ $3,825,000 │ 3.0%    │ $567     │
│ 06│ Inst. Sanitarias     │ $3,825,000 │ 3.0%    │ $567     │
│ 07│ Inst. Eléctricas     │ $5,100,000 │ 4.0%    │ $756     │
│ 08│ Inst. Especiales     │ $2,550,000 │ 2.0%    │ $378     │
│ 09│ Acabados             │ $22,312,500│ 17.5%   │ $3,305   │
│ 10│ Herrería             │ $5,737,500 │ 4.5%    │ $850     │
│ 11│ Carpintería          │ $3,825,000 │ 3.0%    │ $567     │
│ 12│ Vidriería            │ $2,550,000 │ 2.0%    │ $378     │
│ 13│ Pintura              │ $5,100,000 │ 4.0%    │ $756     │
│ 14│ Impermeabilización   │ $2,550,000 │ 2.0%    │ $378     │
│ 15│ Urbanización         │ $19,125,000│ 15.0%   │ $2,833   │
│ 16│ Jardinería           │ $2,550,000 │ 2.0%    │ $378     │
├───┼──────────────────────┼────────────┼─────────┼──────────┤
│   │ TOTAL COSTO DIRECTO  │ $127,500,000│ 100.0% │ $18,889  │
└───┴──────────────────────┴────────────┴─────────┴──────────┘
```

#### Componentes
- **Identificación**: Código, nombre, versión, fecha
- **Alcance**: Viviendas, m², lotes, etapas
- **Desglose**: Por división CMIC (16 capítulos)
- **Resumen Financiero**: CD, CI, CF, U, CA, total
- **Indicadores**: $/m², $/vivienda, margen
- **Cronograma**: Distribución de costos en el tiempo (curva S)

### 3.2 Presupuesto de Etapa

#### Estructura
```
Etapa 1: Primera Sección
Presupuesto: PRES-2025-001-E1
Alcance: 50 viviendas (33% del proyecto)

┌─────────────────────────────────────────────────────────────┐
│ RESUMEN ETAPA 1                                             │
├─────────────────────────────────────────────────────────────┤
│ Viviendas: 50 (Casa Tipo A: 30, Casa Tipo B: 20)           │
│ Superficie: 2,250 m²                                        │
│ Urbanización: 0.8 hectáreas                                 │
│                                                              │
│ COSTO TOTAL ETAPA 1:                        $42,500,000     │
│                                                              │
│ Distribución por tipo de vivienda:                          │
│   ├─ Casa Tipo A (30 uds × $800K):         $24,000,000     │
│   ├─ Casa Tipo B (20 uds × $850K):         $17,000,000     │
│   └─ Obras generales (urbanización):        $1,500,000      │
└─────────────────────────────────────────────────────────────┘

DESGLOSE DETALLADO
┌──────────────────────┬────────────┬─────────┬────────────┐
│ Partida              │ Unidad     │ Cantidad│ Importe    │
├──────────────────────┼────────────┼─────────┼────────────┤
│ VIVIENDAS                                                │
│ Casa Tipo A          │ vivienda   │ 30      │ $24,000,000│
│ Casa Tipo B          │ vivienda   │ 20      │ $17,000,000│
│                                                          │
│ URBANIZACIÓN                                             │
│ Terracerías          │ m³         │ 2,400   │ $360,000   │
│ Base hidráulica      │ m³         │ 1,600   │ $320,000   │
│ Pavimento asfalto    │ m²         │ 3,200   │ $640,000   │
│ Banquetas            │ m²         │ 1,200   │ $180,000   │
│ ─────────────────────────────────────────────────────── │
│ TOTAL ETAPA 1:                               $42,500,000 │
└──────────────────────────────────────────────────────────┘
```

#### Componentes
- **Relación con Obra**: Etapa pertenece a presupuesto maestro
- **Alcance Específico**: Viviendas, distribución por prototipo
- **Obras Generales**: Urbanización, infraestructura común
- **Validación**: Suma de presupuestos de etapas ≤ presupuesto obra

### 3.3 Presupuesto de Prototipo

#### Estructura
```
Prototipo: Casa Tipo A v2
Código: CASA-2025-001
Presupuesto Unitario: PRES-PROT-001

┌─────────────────────────────────────────────────────────────┐
│ CARACTERÍSTICAS                                             │
├─────────────────────────────────────────────────────────────┤
│ Tipología: Casa unifamiliar 1 nivel                         │
│ Recámaras: 2    Baños: 1    Estacionamiento: 1             │
│ Superficie construida: 45 m²                                │
│ Terreno requerido: 120 m²                                   │
└─────────────────────────────────────────────────────────────┘

PRESUPUESTO DETALLADO
┌───┬──────────────────────┬────────┬─────────┬─────┬─────────┐
│ # │ Concepto             │ Unidad │ Cantidad│ PU  │ Importe │
├───┼──────────────────────┼────────┼─────────┼─────┼─────────┤
│ 01│ PRELIMINARES                                            │
│   │ Limpieza terreno     │ m²     │ 45      │ $15 │ $675    │
│   │ Trazo y nivelación   │ m²     │ 45      │ $35 │ $1,575  │
├───┼──────────────────────┼────────┼─────────┼─────┼─────────┤
│ 02│ CIMENTACIÓN                                             │
│   │ Excavación           │ m³     │ 18      │ $180│ $3,240  │
│   │ Plantilla concreto   │ m²     │ 30      │ $125│ $3,750  │
│   │ Cimiento corrido     │ m³     │ 5       │ $7,492│$37,460│
│   │ Cadena desplante     │ m³     │ 3       │ $8,250│$24,750│
├───┼──────────────────────┼────────┼─────────┼─────┼─────────┤
│ 03│ ESTRUCTURA                                              │
│   │ Castillos 15x15      │ m³     │ 2.5     │ $9,800│$24,500│
│   │ Dalas 15x20          │ m³     │ 2.0     │ $9,500│$19,000│
│   │ Losa 12cm aligerada  │ m²     │ 45      │ $1,850│$83,250│
├───┼──────────────────────┼────────┼─────────┼─────┼─────────┤
│ 04│ ALBAÑILERÍA                                             │
│   │ Muro block 15cm      │ m²     │ 120     │ $385 │ $46,200│
│   │ Aplanado interior    │ m²     │ 240     │ $145 │ $34,800│
│   │ Aplanado exterior    │ m²     │ 120     │ $165 │ $19,800│
│   │ ...                                                     │
│   │ (180 partidas más)                                      │
│   │ ...                                                     │
├───┼──────────────────────┼────────┼─────────┼─────┼─────────┤
│   │ COSTO DIRECTO                                │ $650,000 │
│   │ Indirectos (12%)                             │ $78,000  │
│   │ Financiamiento (3%)                          │ $19,500  │
│   │ Utilidad (10%)                               │ $65,000  │
│   │ Cargos (2%)                                  │ $13,000  │
│   │ ─────────────────────────────────────────────────────  │
│   │ COSTO TOTAL CONSTRUCCIÓN                     │ $825,500 │
│   │                                                         │
│   │ Costo unitario:                 $18,344 / m²           │
│   │ Costo vivienda (sin terreno):   $825,500              │
└───┴─────────────────────────────────────────────────────────┘
```

#### Componentes
- **Catálogo de Conceptos**: Integración automática desde catálogo
- **Volumetrías**: Cálculo basado en medidas del prototipo
- **Generadores**: Fórmulas para cálculo automático
  - Ej: "m² de losa = superficie construida × 1.0"
  - Ej: "m² muro = perímetro × altura promedio"
- **Costo Unitario**: $/m² para comparaciones
- **Actualización Automática**: Si cambia precio en catálogo, recalcula presupuesto

### 3.4 Versionado de Presupuestos

#### Control de Versiones
```
Presupuesto: PRES-2025-001
Proyecto: Fraccionamiento Los Pinos

┌─────────┬────────────┬──────────────┬─────────────┬────────────┐
│ Versión │ Fecha      │ Tipo         │ Monto       │ Variación  │
├─────────┼────────────┼──────────────┼─────────────┼────────────┤
│ v1.0    │ 01/09/2025 │ Original     │ $120,000,000│ Baseline   │
│         │            │ (Baseline)   │             │            │
├─────────┼────────────┼──────────────┼─────────────┼────────────┤
│ v1.1    │ 15/10/2025 │ Ajuste       │ $122,400,000│ +2.0%      │
│         │            │ precios      │             │ (+$2.4M)   │
├─────────┼────────────┼──────────────┼─────────────┼────────────┤
│ v2.0    │ 01/11/2025 │ Cambio       │ $127,500,000│ +6.3%      │
│         │            │ alcance      │             │ (+$7.5M)   │
│         │            │ (20 viv más) │             │ vs baseline│
├─────────┼────────────┼──────────────┼─────────────┼────────────┤
│ v2.1    │ 15/11/2025 │ Ajuste       │ $127,500,000│ Sin cambio │
│         │ (Actual)   │ conceptos    │             │            │
└─────────┴────────────┴──────────────┴─────────────┴────────────┘

Motivo v2.0: Cliente requiere ampliar de 130 a 150 viviendas
Aprobado por: Director General
Impacto: +$7.5M (+6.3%), margen se mantiene en 30%
```

#### Tipos de Versiones
- **Baseline (v1.0)**: Presupuesto original aprobado
- **Ajuste de precios (vX.Y)**: Actualización de PU sin cambio de alcance
- **Cambio de alcance (vX.0)**: Modificación de cantidades/conceptos
- **Volúmenes adicionales**: Conceptos extraordinarios

#### Comparación de Versiones
```
Comparativo: v1.0 (Baseline) vs v2.1 (Actual)

┌──────────────────────┬────────────┬────────────┬────────────┐
│ División             │ v1.0       │ v2.1       │ Δ          │
├──────────────────────┼────────────┼────────────┼────────────┤
│ Cimentación          │ $10,800,000│ $11,475,000│ +6.3%      │
│ Estructura           │ $18,000,000│ $19,125,000│ +6.3%      │
│ Albañilería          │ $15,000,000│ $15,937,500│ +6.3%      │
│ ...                  │ ...        │ ...        │ ...        │
├──────────────────────┼────────────┼────────────┼────────────┤
│ TOTAL                │ $120,000,000│$127,500,000│ +6.3%     │
└──────────────────────┴────────────┴────────────┴────────────┘

Análisis:
✓ Incremento proporcional (6.3%) en todas las partidas
✓ Razón: Ampliar de 130 a 150 viviendas (+20 uds)
✓ Costo unitario por vivienda se mantiene: $850K
```

### 3.5 Generadores de Presupuesto

#### Concepto
Fórmulas predefinidas para calcular cantidades automáticamente basándose en características del prototipo.

#### Ejemplos de Generadores
```javascript
// Generador: Excavación para cimentación
{
  concept: "Excavación",
  unit: "m³",
  formula: "desplantDepth * (buildingPerimeter * 0.60) * 0.80",
  inputs: {
    desplantDepth: 0.80, // m
    buildingPerimeter: 30, // m
    excavationWidth: 0.60 // m
  },
  result: 14.40 // m³
}

// Generador: Muro de block
{
  concept: "Muro block 15cm",
  unit: "m²",
  formula: "wallPerimeter * averageHeight - openingsArea",
  inputs: {
    wallPerimeter: 45, // m
    averageHeight: 2.70, // m
    openingsArea: 12 // m² (puertas + ventanas)
  },
  result: 109.50 // m²
}

// Generador: Losa de azotea
{
  concept: "Losa 12cm aligerada",
  unit: "m²",
  formula: "builtArea * 1.0",
  inputs: {
    builtArea: 45 // m²
  },
  result: 45 // m²
}

// Generador: Instalación eléctrica
{
  concept: "Salidas eléctricas",
  unit: "salida",
  formula: "bedrooms * 6 + bathrooms * 4 + kitchen * 8 + living * 6",
  inputs: {
    bedrooms: 2,
    bathrooms: 1,
    kitchen: 1,
    living: 1
  },
  result: 30 // salidas
}
```

#### Beneficios
- **Automatización**: Calcular volumetrías en segundos
- **Consistencia**: Mismo criterio para todos los presupuestos
- **Actualización**: Si cambia característica del prototipo, recalcula
- **Personalización**: Cada constructora define sus generadores

### 3.6 Análisis de Rentabilidad

#### Dashboard de Rentabilidad
```
┌─────────────────────────────────────────────────────────────┐
│ ANÁLISIS DE RENTABILIDAD                                    │
│ Proyecto: Fraccionamiento Los Pinos                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ■ Costos                                                     │
│   Costo total construcción:          $127,500,000           │
│   Costo terreno (asumido):           $18,750,000            │
│   Otros gastos (legales, comercial): $4,500,000             │
│   ─────────────────────────────────────────────────         │
│   COSTO TOTAL PROYECTO:              $150,750,000           │
│                                                              │
│ ■ Ingresos Proyectados                                      │
│   150 viviendas × $1,105,000/ud:     $165,750,000           │
│                                                              │
│ ■ Rentabilidad                                              │
│   Margen bruto:                      $15,000,000            │
│   % Margen:                          9.9%                   │
│   ROI:                               10%                    │
│                                                              │
│ ■ Punto de Equilibrio                                       │
│   Viviendas a vender:                136 de 150 (91%)       │
│   Ingresos requeridos:               $150,750,000           │
│                                                              │
│ ■ Sensibilidad                                              │
│   Si costo sube 5%:                  Margen = 4.8%          │
│   Si precio baja 3%:                 Margen = 6.8%          │
│   Margen mínimo aceptable:           8%                     │
│   ⚠️ ADVERTENCIA: Margen bajo umbral mínimo                 │
└─────────────────────────────────────────────────────────────┘
```

#### Indicadores
- **Margen Bruto**: (Precio Venta - Costo Total) / Precio Venta
- **ROI**: (Utilidad Neta / Inversión Total) × 100
- **Punto de Equilibrio**: Viviendas mínimas a vender para recuperar inversión
- **Análisis de Sensibilidad**: Impacto de variaciones en costo/precio

---

## 4. Casos de Uso Principales

### CU-001: Crear Presupuesto de Prototipo
**Actor:** Ingeniero de Costos
**Flujo:**
1. Accede a Prototipo "Casa Tipo A v2"
2. Clic "Generar Presupuesto"
3. Sistema carga plantilla base (200 conceptos típicos)
4. Ejecuta generadores automáticos:
   - Calcula volumetrías basándose en medidas
   - Asigna cantidades a conceptos
5. Ingeniero revisa y ajusta:
   - Modifica cantidades manualmente si es necesario
   - Agrega conceptos específicos
   - Elimina conceptos no aplicables
6. Define factores:
   - Indirectos: 12%
   - Financiamiento: 3%
   - Utilidad: 10%
   - Cargos: 2%
7. Sistema calcula costo total: $825,500
8. Guarda presupuesto
9. Presupuesto vinculado a prototipo

**Resultado:**
- Costo unitario: $18,344/m²
- Tiempo de elaboración: 2 horas (vs 8 horas manual)

### CU-002: Crear Presupuesto de Obra desde Prototipos
**Actor:** Director de Proyectos
**Flujo:**
1. Accede a Proyecto "Fraccionamiento Los Pinos"
2. Clic "Crear Presupuesto Maestro"
3. Define alcance:
   - 150 viviendas distribuidas en 3 etapas
   - Etapa 1: 50 viv (30 Tipo A + 20 Tipo B)
   - Etapa 2: 50 viv (35 Tipo A + 15 Tipo B)
   - Etapa 3: 50 viv (40 Tipo A + 10 Tipo B)
4. Sistema calcula automáticamente:
   - Costo viviendas = (105 × $825K) + (45 × $850K)
   - = $86,625,000 + $38,250,000
   - = $124,875,000
5. Agrega obras generales:
   - Urbanización: $2,500,000
   - Infraestructura: $125,000
6. Sistema totaliza: $127,500,000
7. Define precio de venta: $1,105,000/vivienda
8. Sistema calcula rentabilidad:
   - Ingresos: $165,750,000
   - Margen: 30%
9. Aprueba presupuesto (baseline v1.0)
10. Presupuesto activo para el proyecto

### CU-003: Actualizar Presupuesto por Cambio de Precios
**Actor:** Gerente Administrativo
**Flujo:**
1. Catálogo de conceptos se actualizó (cemento +4.5%)
2. Sistema notifica: "12 presupuestos afectados"
3. Gerente accede a presupuesto PRES-2025-001
4. Clic "Recalcular con Nuevos Precios"
5. Sistema genera preview:
   - Versión actual (v2.1): $127,500,000
   - Con nuevos precios: $128,235,000
   - Incremento: +0.58%
6. Gerente revisa impacto:
   - Margen se reduce de 30% a 29.5%
   - Aún dentro de umbral aceptable
7. Confirma actualización
8. Sistema crea v2.2 con nuevos precios
9. Historial mantiene v2.1 como referencia

### CU-004: Crear Volumen Adicional
**Actor:** Residente de Obra
**Flujo:**
1. Durante ejecución: cliente solicita ampliación en 10 casas
2. Director accede a presupuesto PRES-2025-001 v2.2
3. Clic "Crear Volumen Adicional"
4. Define:
   - Alcance: 10 viviendas Tipo A
   - Motivo: "Ampliación por demanda del cliente"
   - Precio especial: $900,000/ud (vs $825,500 estándar)
5. Sistema calcula:
   - Costo adicional: $8,255,000
   - Ingreso adicional: $9,000,000
   - Margen incremental: $745,000 (8.3%)
6. Genera cotización para cliente
7. Cliente aprueba
8. Sistema crea v3.0:
   - Alcance: 160 viviendas (vs 150 original)
   - Costo: $135,755,000
   - Ingreso: $174,750,000
   - Margen: 28.7%
9. Actualiza cronograma y curva S

### CU-005: Comparar Presupuesto vs Costo Real
**Actor:** Director de Proyectos
**Flujo:**
1. Accede a Dashboard de Presupuesto
2. Selecciona "Comparativo Presupuestado vs Real"
3. Sistema muestra:
```
Avance: 45% (68 de 150 viviendas terminadas)

┌──────────────┬────────────┬────────────┬────────────┬─────────┐
│ División     │ Presup.    │ Real       │ Δ          │ Status  │
├──────────────┼────────────┼────────────┼────────────┼─────────┤
│ Cimentación  │ $5,163,750 │ $5,008,200 │ -3.0% ✓    │ 🟢      │
│ Estructura   │ $8,606,250 │ $9,035,100 │ +5.0% ⚠️   │ 🟡      │
│ Albañilería  │ $7,171,875 │ $7,386,120 │ +3.0%      │ 🟢      │
│ ...          │ ...        │ ...        │ ...        │ ...     │
├──────────────┼────────────┼────────────┼────────────┼─────────┤
│ TOTAL (45%)  │ $57,375,000│ $58,104,250│ +1.3%      │ 🟢      │
└──────────────┴────────────┴────────────┴────────────┴─────────┘

Proyección al 100%:
  Presupuesto total:     $127,500,000
  Proyección real:       $129,120,555 (+1.3%)
  Desviación esperada:   +$1,620,555

⚠️ ALERTA: Estructura con sobrecosto del 5%
Causa: Incremento precio acero en Feb 2025
Acción: Renegociar con proveedor
```
4. Genera reporte para junta directiva
5. Define plan de acción para estructura

---

## 5. Modelo de Datos Simplificado

```typescript
// Tabla: budgets
{
  id: UUID,
  constructoraId: UUID,
  projectId: UUID NULLABLE, // Presupuesto de obra
  stageId: UUID NULLABLE, // Presupuesto de etapa
  prototypeId: UUID NULLABLE, // Presupuesto de prototipo

  code: VARCHAR(20) UNIQUE, // PRES-2025-001
  name: VARCHAR(255),
  type: ENUM('project', 'stage', 'prototype'),

  version: INTEGER DEFAULT 1,
  isBaseline: BOOLEAN DEFAULT false,
  status: ENUM('draft', 'active', 'approved', 'closed'),

  // Alcance
  housingUnitsCount: INTEGER,
  totalBuiltArea: DECIMAL(12,2),
  totalLandArea: DECIMAL(12,2),

  // Montos
  directCost: DECIMAL(15,2),
  indirectPercentage: DECIMAL(5,2),
  indirectAmount: DECIMAL(15,2),
  financingPercentage: DECIMAL(5,2),
  financingAmount: DECIMAL(15,2),
  profitPercentage: DECIMAL(5,2),
  profitAmount: DECIMAL(15,2),
  additionalCharges: DECIMAL(15,2),
  totalCost: DECIMAL(15,2),

  // Precio y rentabilidad
  salePrice: DECIMAL(15,2) NULLABLE,
  grossMargin: DECIMAL(15,2) NULLABLE,
  marginPercentage: DECIMAL(5,2) NULLABLE,
  roi: DECIMAL(5,2) NULLABLE,

  // Indicadores
  costPerSqm: DECIMAL(10,2),
  costPerUnit: DECIMAL(12,2) NULLABLE,

  // Auditoría
  approvedBy: UUID NULLABLE,
  approvedAt: TIMESTAMP NULLABLE,
  createdBy: UUID,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}

// Tabla: budget_items
{
  id: UUID,
  budgetId: UUID,

  // Jerarquía
  parentItemId: UUID NULLABLE,
  level: INTEGER, // 1=División, 2=Grupo, 3=Concepto
  sortOrder: INTEGER,

  // Si es concepto individual
  conceptId: UUID NULLABLE,

  // Datos
  code: VARCHAR(20),
  name: VARCHAR(255),
  unit: VARCHAR(20),
  quantity: DECIMAL(12,4),
  unitPrice: DECIMAL(12,2),
  amount: DECIMAL(15,2),

  // Generadores (para presupuestos de prototipo)
  hasGenerator: BOOLEAN DEFAULT false,
  generatorFormula: TEXT NULLABLE,
  generatorInputs: JSONB NULLABLE,

  // Notas
  notes: TEXT,

  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}

// Tabla: budget_versions
{
  id: UUID,
  budgetId: UUID,
  version: INTEGER,
  versionType: ENUM('baseline', 'price_adjustment', 'scope_change', 'additional_volume'),
  previousVersionId: UUID NULLABLE,

  totalCost: DECIMAL(15,2),
  variationAmount: DECIMAL(15,2),
  variationPercentage: DECIMAL(6,2),

  reason: TEXT,
  approvedBy: UUID,
  createdAt: TIMESTAMP
}
```

---

## 6. Dependencias con Otros Módulos

### Entrada (consume de):
- **MAI-003 Catálogo**: Conceptos y precios unitarios
- **MAI-002 Proyectos**: Estructura de obra, etapas, prototipos
- **MAI-002 Prototipos**: Características para generadores

### Salida (provee a):
- **MAI-003 Control de Costos**: Presupuesto como baseline para comparación
- **MAI-004 Compras**: Cantidades presupuestadas para planificar compras
- **MAI-006 Reportes**: Datos para análisis de rentabilidad

---

## 7. Criterios de Aceptación

- [ ] Presupuestos en 3 niveles (obra, etapa, prototipo)
- [ ] Integración automática con catálogo de conceptos
- [ ] Generadores automáticos de volumetrías
- [ ] Versionado completo con historial
- [ ] Comparación baseline vs versión actual
- [ ] Cálculo de rentabilidad (margen, ROI, punto equilibrio)
- [ ] Desglose por división CMIC (16 capítulos)
- [ ] Actualización por cambio de precios en catálogo
- [ ] Volúmenes adicionales
- [ ] Exportación a Excel/PDF
- [ ] Importación desde OPUS/Neodata

---

## 8. Métricas de Éxito

- **Precisión**: Desviación presupuesto vs real <3%
- **Eficiencia**: Tiempo de elaboración -80% (2h vs 10h)
- **Adopción**: 100% de proyectos con presupuesto formal
- **Actualización**: Presupuestos recalculados en <24h tras cambio de precios

---

**Estado:** ✅ Ready for Development
