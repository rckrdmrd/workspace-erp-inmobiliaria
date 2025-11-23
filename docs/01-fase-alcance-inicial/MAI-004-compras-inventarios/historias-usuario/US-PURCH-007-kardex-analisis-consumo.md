# US-PURCH-007: Kárdex y Análisis de Consumo

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 13
**Story Points:** 5
**Prioridad:** Media

---

## Historia de Usuario

**Como** Gerente de Operaciones
**Quiero** visualizar el kárdex detallado por material y analizar consumos vs presupuesto
**Para** detectar desviaciones, sobreconsumos y optimizar las compras futuras

---

## Criterios de Aceptación

### AC1: Kárdex Detallado por Material
```
┌──────────────────────────────────────────────────────┐
│ KÁRDEX - Cemento CPC 30R                             │
│ Almacén: Fracc. Los Pinos                           │
│ Período: [Noviembre 2025 ▼]                         │
├──────────────────────────────────────────────────────┤
│ Fecha │Movim. │ Detalle       │Entr.│Sal.│Saldo│C.U.││
├───────┼───────┼───────────────┼─────┼────┼─────┼────┤│
│01/Nov │ENT-234│OC-145 Cemex   │120 t│    │120  │4350││
│05/Nov │SAL-456│Cimentación E1 │     │25t │95   │4350││
│10/Nov │SAL-457│Cimentación E1 │     │30t │65   │4350││
│15/Nov │ENT-235│OC-146 Cemex   │80 t │    │145  │4400││
│20/Nov │SAL-458│Cimentación E2 │     │45t │100  │4367││
│25/Nov │SAL-459│Muros E1       │     │20t │80   │4380││
│30/Nov │       │Inventario final│     │    │80   │4380││
└───────┴───────┴───────────────┴─────┴────┴─────┴────┘

Resumen del período:
┌──────────────────────────────────────┐
│ Entradas:       200 ton  $876,000    │
│ Salidas:        120 ton  $524,400    │
│ Saldo final:     80 ton  $351,600    │
│ Costo promedio:          $4,380/ton  │
└──────────────────────────────────────┘

[📊 Ver gráfica] [📄 Exportar PDF] [📑 Excel]
```

### AC2: Análisis de Consumo vs Presupuesto
```
┌──────────────────────────────────────────────────────┐
│ ANÁLISIS DE CONSUMO - Cemento CPC 30R                │
│ Proyecto: Fracc. Los Pinos | Avance: 45%            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ■ Comparativo Cantidad                               │
│   Presupuesto Total:        250 ton                  │
│   Presupuestado al 45%:     112.5 ton                │
│   Consumo Real:             120 ton                  │
│   Desviación:               +7.5 ton (+6.7%) 🟡      │
│                                                      │
│ ■ Proyección al 100%                                 │
│   Proyección lineal:        267 ton                  │
│   Sobreconsumo esperado:    +17 ton (+6.8%)          │
│   Impacto económico:        +$74,460 📊              │
│                                                      │
│ ■ Tendencia de Consumo                               │
│   Consumo Semanal (ton)                              │
│     30│                    ╱╲                        │
│       │               ╱───╯  ╲                       │
│     25│          ╱───╯        ╲___                   │
│       │     ╱───╯                 ╲                  │
│     20│╱───╯                       ╲___              │
│       └──────────────────────────────────→           │
│        S1  S2  S3  S4  S5  S6  S7  S8                │
│                                                      │
│   Promedio: 22.5 ton/semana                          │
│   Tendencia: Estable                                 │
│                                                      │
│ ■ Causas Identificadas                               │
│   • Mayor desperdicio en mezclas (4% vs 3% presup)  │
│   • Cambio de diseño en cimentación (+5 viviendas)  │
│                                                      │
│ ■ Recomendaciones                                    │
│   ✓ Revisar dosificaciones con laboratorio          │
│   ✓ Capacitar cuadrillas en manejo de material      │
│   ✓ Actualizar presupuesto por cambio de alcance    │
│                                                      │
│          [📧 Enviar Reporte]  [💾 Guardar Análisis]  │
└──────────────────────────────────────────────────────┘
```

### AC3: Comparativo Multi-Material
```
REPORTE: Consumo vs Presupuesto
Proyecto: Fracc. Los Pinos
Período: Noviembre 2025

┌──────────────┬──────────┬──────────┬──────────┬────────┐
│ Material     │ Presup.  │ Consumo  │ Desv.    │ Status │
├──────────────┼──────────┼──────────┼──────────┼────────┤
│ Cemento CPC  │ 112.5 ton│ 120 ton  │ +6.7%    │ 🟡     │
│ Acero fy4200 │  38.2 ton│  42.5 ton│ +11.3%   │ 🔴     │
│ Block 15cm   │ 4,500 pza│ 4,200 pza│ -6.7%    │ 🟢     │
│ Grava 3/4"   │  85 m³   │  82 m³   │ -3.5%    │ 🟢     │
│ Arena        │  95 m³   │  97 m³   │ +2.1%    │ 🟢     │
└──────────────┴──────────┴──────────┴──────────┴────────┘

Leyenda:
  🟢 OK:       Desviación < 5%
  🟡 Warning:  Desviación 5-10%
  🔴 Critical: Desviación > 10%

Resumen:
  Materiales OK:       3 (60%)
  Materiales Warning:  1 (20%)
  Materiales Critical: 1 (20%)

  Costo presupuestado: $1,490,000
  Costo real:          $1,580,350
  Sobrecosto:          +$90,350 (+6.1%)

Materiales críticos que requieren atención:
→ Acero fy=4200: +11.3% (+4.3 ton)
  Revisar planos estructurales y desperdicios
```

### AC4: Análisis ABC de Inventario
```
CLASIFICACIÓN ABC - INVENTARIO
Almacén: Fracc. Los Pinos
Fecha: 30/Nov/2025

┌──────────────────────────────────────────────────────┐
│ CLASE A (80% del valor, 20% de ítems)               │
│ Control estricto - Inventario justo                 │
├──────────────────────────────────────────────────────┤
│ Material         │ Stock   │ Valor      │ % Acum.   │
│ Acero fy=4200    │ 42.5 ton│ $871,250   │ 35.2%     │
│ Cemento CPC 30R  │ 80 ton  │ $351,600   │ 49.4%     │
│ Concreto premez  │ 120 m³  │ $384,000   │ 64.9%     │
│ Block 15cm       │ 2,500pza│ $225,000   │ 74.0%     │
│ Varilla corrugada│ 1,800 kg│ $167,400   │ 80.8%     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CLASE B (15% del valor, 30% de ítems)               │
│ Control moderado                                     │
├──────────────────────────────────────────────────────┤
│ Grava 3/4"       │ 85 m³   │ $32,640    │ 82.1%     │
│ Arena            │ 87 m³   │ $25,491    │ 83.1%     │
│ Cal hidratada    │ 450 kg  │ $8,100     │ 83.4%     │
│ ... 4 materiales más                                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CLASE C (5% del valor, 50% de ítems)                │
│ Control básico                                       │
├──────────────────────────────────────────────────────┤
│ Consumibles menores, herramienta, etc.              │
│ 15 materiales                                        │
└──────────────────────────────────────────────────────┘

Recomendaciones por clase:
  Clase A:
    • Punto de reorden: Lead time × consumo promedio
    • Revisión semanal de stock
    • Múltiples proveedores

  Clase B:
    • Revisión quincenal
    • 1-2 proveedores confiables

  Clase C:
    • Orden trimestral por lote
    • Stock de seguridad alto
```

### AC5: Gráficas de Tendencias
```
Visualizaciones disponibles:

1. Consumo Mensual Comparado
   ┌─────────────────────────────────────┐
   │    Presupuestado vs Real            │
   │ ton                                 │
   │ 40│  ■ Presupuestado  ■ Real       │
   │   │  ██                ██████       │
   │ 30│  ██      ██        ██  ██      │
   │   │  ██  ██  ██  ██    ██  ██  ██  │
   │ 20│  ██  ██  ██  ██  ████  ██  ██  │
   │   │████  ██████  ██████  ████  ████│
   │ 10│██  ████  ██████  ████  ██████  │
   │   └─────────────────────────────────│
   │    Ene Feb Mar Abr May Jun Jul Ago  │
   └─────────────────────────────────────┘

2. Rotación de Inventario
3. Días de stock disponible
4. Valor del inventario en el tiempo

[Cambiar vista] [Comparar períodos] [Exportar]
```

---

## Notas Técnicas

### Backend
- CRON diario para análisis de consumo
- Stored procedure para clasificación ABC
- Cálculo de proyecciones con regresión lineal
- Generación de reportes en background (queue)

### Frontend
- Chart.js / Recharts para gráficas
- Exportar a Excel con formato
- Filtros de fecha con presets (mes actual, trimestre, año)
- Drill-down: click en material → ver kárdex detallado

---

## Definición de Hecho (DoD)

- [ ] Kárdex detallado por material/almacén
- [ ] Análisis consumo vs presupuesto
- [ ] Proyección de sobreconsumo
- [ ] Clasificación ABC automática
- [ ] Gráficas de tendencias
- [ ] Exportación a PDF/Excel
- [ ] Recomendaciones automáticas
- [ ] Tests de cálculos de proyección

---

**Referencias:** RF-PURCH-004, ET-PURCH-004
