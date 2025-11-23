# RF-PURCH-004: Kárdex y Alertas de Stock

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Sistema de control detallado por material (kárdex) con análisis de consumo, proyecciones de faltantes, comparación contra presupuesto y alertas automáticas de stock mínimo, sobreconsumo y materiales obsoletos.

---

## 2. Objetivos de Negocio

- **Prevención:** Evitar paros de obra por falta de material
- **Control:** Detectar sobreconsumo vs presupuesto
- **Optimización:** Reducir inventario ocioso (capital inmovilizado)
- **Visibilidad:** Dashboard ejecutivo de inventarios

---

## 3. Alcance Funcional

### 3.1 Kárdex por Material

**Vista Detallada:**
```
┌────────────────────────────────────────────────────────────────┐
│ KÁRDEX - Cemento CPC 30R                                       │
│ Almacén: Fracc. Los Pinos | Período: Nov 2025                 │
├────────────────────────────────────────────────────────────────┤
│ Fecha │ Movim. │ Detalle        │Entrada│Salida│Saldo│Costo U││
├───────┼────────┼────────────────┼───────┼──────┼─────┼───────┤│
│01/Nov │ENT-234 │OC-145 Cemex    │120 ton│      │120  │$4,350 ││
│05/Nov │SAL-456 │Cimentación E1  │       │25 ton│95   │$4,350 ││
│10/Nov │SAL-457 │Cimentación E1  │       │30 ton│65   │$4,350 ││
│15/Nov │ENT-235 │OC-146 Cemex    │80 ton │      │145  │$4,400 ││
│20/Nov │SAL-458 │Cimentación E2  │       │45 ton│100  │$4,367*││
│25/Nov │SAL-459 │Muros E1        │       │20 ton│80   │$4,380 ││
│30/Nov │        │Inventario final│       │      │80   │$4,380 ││
└───────┴────────┴────────────────┴───────┴──────┴─────┴───────┘
*Costo promedio ponderado

Resumen Noviembre:
  Entradas:    200 ton  ($876,000)
  Salidas:     120 ton  ($524,400)
  Saldo final:  80 ton  ($351,600)
  Costo promedio: $4,380/ton
```

### 3.2 Análisis de Consumo

**Comparativo Presupuesto vs Real:**
```
┌────────────────────────────────────────────────────────────┐
│ ANÁLISIS DE CONSUMO - Cemento CPC 30R                      │
│ Proyecto: Fracc. Los Pinos | Avance: 45%                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Presupuesto Total:       250 ton                           │
│ Presupuestado al 45%:    112.5 ton                         │
│ Consumo Real:            120 ton                           │
│ Desviación:              +7.5 ton (+6.7%) 🟡               │
│                                                            │
│ Proyección al 100%:      267 ton                           │
│ Sobreconsumo esperado:   +17 ton (+6.8%)                   │
│ Impacto económico:       +$74,460 📊                       │
│                                                            │
│ ■ Causas Identificadas:                                    │
│   • Mayor desperdicio en mezclas (4% vs 3% presup)        │
│   • Cambio de diseño en cimentación (+5 viviendas)        │
│                                                            │
│ ■ Recomendaciones:                                         │
│   ✓ Revisar dosificaciones con laboratorio                │
│   ✓ Capacitar cuadrillas en manejo de material            │
│   ✓ Actualizar presupuesto por cambio de alcance          │
└────────────────────────────────────────────────────────────┘
```

**Gráfica de Tendencia:**
```
Consumo Semanal (ton)
  30│                    ╱╲
    │               ╱───╯  ╲
  25│          ╱───╯        ╲___
    │     ╱───╯                 ╲
  20│╱───╯                       ╲___
    │                                 ╲
  15│                                  ╲___
    └─────────────────────────────────────→
     S1  S2  S3  S4  S5  S6  S7  S8  Semanas

Promedio: 22.5 ton/semana
Tendencia: Estable
```

### 3.3 Alertas Automáticas

#### Configuración por Material
```
Material: Cemento CPC 30R
┌──────────────────────────────────────────┐
│ CONFIGURACIÓN DE ALERTAS                 │
├──────────────────────────────────────────┤
│ Stock Mínimo:      20 ton                │
│ Stock Máximo:      150 ton               │
│ Punto Reorden:     40 ton                │
│ Lead Time:         5 días                │
│                                          │
│ Alertas Activas:                         │
│ ☑ Stock bajo mínimo                      │
│ ☑ Punto de reorden alcanzado             │
│ ☑ Sobreconsumo vs presupuesto >5%        │
│ ☐ Material sin movimiento 90 días        │
│ ☑ Stock sobre máximo                     │
│                                          │
│ Notificar a:                             │
│ • Gerente de Compras (email)             │
│ • Residente de Obra (in-app)             │
└──────────────────────────────────────────┘
```

#### Tipos de Alertas

**1. Stock Mínimo**
```
⚠️ ALERTA: Stock Bajo Mínimo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Material: Varilla 3/8" fy=4200
Almacén: Fracc. Los Pinos

Stock actual:    150 kg
Stock mínimo:    500 kg
Faltante:        350 kg

Consumo promedio: 85 kg/día
Días restantes:   1.8 días ⚠️

Acción requerida:
→ Generar requisición urgente
→ Solicitar traspaso de Alm. General
→ Alertar a residente de posible paro
```

**2. Punto de Reorden**
```
🔔 NOTIFICACIÓN: Punto de Reorden
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Material: Block 15cm
Stock actual:    2,000 pza
Punto reorden:   2,000 pza

Consumo semanal: 1,500 pza
Lead time:       7 días

Sugerencia:
→ Ordenar 6,000 pza (4 semanas de consumo)
→ Proveedores recomendados:
   • Bloques del Norte (A-87pts)
   • Prefabricados SA (A-85pts)
```

**3. Sobreconsumo**
```
🔴 ALERTA CRÍTICA: Sobreconsumo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Material: Acero fy=4200
Partida: 03-Estructura

Presupuestado (45%):  38.2 ton
Consumo real:         42.5 ton
Desviación:          +4.3 ton (+11.3%) 🔴

Proyección al 100%:   94.4 ton
Presupuesto total:    85.0 ton
Sobrecosto esperado:  +9.4 ton (+11%)
Impacto económico:    +$192,700

Causas posibles:
• Cambio en diseño estructural
• Mayor desperdicio de corte
• Error en cuantificación inicial

Acción inmediata:
→ Reunión con ingeniero estructural
→ Revisión de planos ejecutivos
→ Plan de mitigación obligatorio
```

**4. Material Obsoleto**
```
⏰ ALERTA: Material Sin Movimiento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Material: Azulejo blanco 20x20
Almacén: Almacén General
Stock: 85 m²
Valor: $25,500

Sin movimiento desde: 15/Ago/2025 (107 días)

Sugerencia:
→ Verificar si es material discontinuado
→ Ofrecer a otros proyectos
→ Liquidar con descuento
→ Donar si no hay demanda
```

### 3.4 Dashboard de Inventarios

**Vista Ejecutiva:**
```
┌─────────────────────────────────────────────────────────┐
│ DASHBOARD DE INVENTARIOS                                │
│ Actualizado: 30/Nov/2025 18:00                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ■ Resumen General                                       │
│   Almacenes activos:        5                           │
│   Materiales en stock:      1,847                       │
│   Valor total inventario:   $11,280,000                 │
│                                                         │
│ ■ Alertas Activas (12)                                  │
│   🔴 Stock crítico:         3 materiales                │
│   🟡 Punto reorden:         6 materiales                │
│   🟠 Sobreconsumo:          2 materiales                │
│   ⏰ Sin movimiento 90d:    1 material                  │
│                                                         │
│ ■ Top 5 Materiales por Valor                            │
│   1. Acero fy=4200          $3,250,000 (28.8%)          │
│   2. Cemento CPC 30R        $1,840,000 (16.3%)          │
│   3. Block 15cm             $875,000 (7.8%)             │
│   4. Concreto premezclado   $720,000 (6.4%)             │
│   5. Varilla corrugada      $650,000 (5.8%)             │
│                                                         │
│ ■ Rotación de Inventario                                │
│   Índice rotación:          8.5 veces/año ✓             │
│   Días inventario:          43 días                     │
│   Meta:                     <60 días                    │
└─────────────────────────────────────────────────────────┘
```

### 3.5 Reportes Especializados

**1. Consumo por Proyecto**
```
REPORTE: Consumo de Materiales por Proyecto
Período: Nov 2025

Proyecto: Fracc. Los Pinos
┌──────────────────┬─────────┬──────────┬────────────┐
│ Material         │ Consumo │ Costo    │ %Total     │
├──────────────────┼─────────┼──────────┼────────────┤
│ Cemento CPC 30R  │ 120 ton │ $524,400 │ 35.2%      │
│ Acero fy=4200    │ 42.5 ton│ $871,250 │ 58.5%      │
│ Block 15cm       │ 4,500pza│ $94,500  │ 6.3%       │
│ TOTAL            │         │$1,490,150│ 100%       │
└──────────────────┴─────────┴──────────┴────────────┘
```

**2. Análisis ABC**
```
Clasificación ABC de Inventario

Clase A (80% del valor, 20% de items):
  • Acero fy=4200
  • Cemento CPC 30R
  • Concreto premezclado
  → Control estricto, inventario justo

Clase B (15% del valor, 30% de items):
  • Block 15cm
  • Varilla corrugada
  • Arena, grava
  → Control moderado

Clase C (5% del valor, 50% de items):
  • Consumibles menores
  • Herramienta menor
  → Control básico
```

---

## 4. Modelo de Datos

```typescript
// material_stock_config
{
  id: UUID,
  materialId: UUID,
  warehouseId: UUID,
  
  minimumStock: DECIMAL(12,4),
  maximumStock: DECIMAL(12,4),
  reorderPoint: DECIMAL(12,4),
  leadTimeDays: INTEGER,
  
  alertOnMinimum: BOOLEAN,
  alertOnReorder: BOOLEAN,
  alertOnOverconsumption: BOOLEAN,
  alertOnNoMovement: BOOLEAN,
  noMovementDays: INTEGER DEFAULT 90,
  
  notifyUsers: UUID[],
}

// consumption_analysis
{
  id: UUID,
  projectId: UUID,
  materialId: UUID,
  period: VARCHAR(7), // 2025-11
  
  budgetedQuantity: DECIMAL(12,4),
  actualQuantity: DECIMAL(12,4),
  variance: DECIMAL(12,4),
  variancePercentage: DECIMAL(6,2),
  
  averageWeeklyConsumption: DECIMAL(12,4),
  projectedTotal: DECIMAL(12,4),
  
  status: ENUM('ok', 'warning', 'critical'),
  analysisDate: DATE,
}

// stock_alerts
{
  id: UUID,
  alertType: ENUM('minimum_stock', 'reorder_point', 'overconsumption', 'no_movement', 'maximum_stock'),
  severity: ENUM('info', 'warning', 'critical'),
  
  warehouseId: UUID,
  materialId: UUID,
  projectId: UUID NULLABLE,
  
  message: TEXT,
  currentValue: DECIMAL(12,4),
  thresholdValue: DECIMAL(12,4),
  
  status: ENUM('active', 'acknowledged', 'resolved'),
  notifiedUsers: UUID[],
  createdAt: TIMESTAMP,
  resolvedAt: TIMESTAMP NULLABLE,
}
```

---

## 5. Criterios de Aceptación

- [ ] Kárdex detallado por material/almacén
- [ ] Análisis consumo vs presupuesto
- [ ] 5 tipos de alertas configurables
- [ ] Dashboard ejecutivo de inventarios
- [ ] Proyección de faltantes
- [ ] Clasificación ABC
- [ ] Reportes de rotación
- [ ] Notificaciones automáticas
- [ ] Gráficas de tendencias

---

**Estado:** ✅ Ready for Development
