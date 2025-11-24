# RF-PROG-004: Dashboard y Reportes de Avances

**Épica:** MAI-005 - Control de Obra y Avances
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Dashboard ejecutivo y reportes especializados para visualización de avance físico-financiero, proyecciones, análisis de productividad y reportes para clientes, dirección e INFONAVIT.

---

## 2. Objetivos de Negocio

- **Visibilidad:** Estado de obra en tiempo real
- **Toma de decisiones:** KPIs y métricas clave
- **Comunicación:** Reportes para stakeholders
- **Cumplimiento:** Documentación para INFONAVIT y clientes

---

## 3. Alcance Funcional

### 3.1 Dashboard Ejecutivo de Proyecto

**Vista Principal:**
```
┌─────────────────────────────────────────────────────────┐
│ DASHBOARD - Fracc. Los Pinos Etapa 1                   │
│ Actualizado: 15/Feb/2025 18:00 hrs                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ■ Estado General                                        │
│   ┌──────────────┬──────────────┬─────────────────┐   │
│   │ Avance Físico│Avance Financ│Tiempo Transcurrido  │
│   │              │              │                 │   │
│   │    85%       │    82%       │     45%         │   │
│   │   🟡 -7%    │   ✓ -3%     │    ✓ OK         │   │
│   └──────────────┴──────────────┴─────────────────┘   │
│                                                         │
│ ■ Curva S (Programado vs Real)                          │
│   ┌─────────────────────────────────────────────────┐  │
│   │100│                                      ╱────   │  │
│   │ 90│                                 ╱───        │  │
│   │ 80│                          ╱─────             │  │
│   │ 70│                    ╱────      ■ Programado  │  │
│   │ 60│              ╱────            ■ Real (85%)  │  │
│   │ 50│       ╱─────                                │  │
│   │ 40│ ╱────                          Desv: -7%    │  │
│   │   └──────────────────────────────────────────→  │  │
│   │    Ene  Feb  Mar  Abr  May  Jun  Jul  Ago  Sep │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│ ■ Partidas Críticas                                     │
│   🔴 Rellenos:         -30% (60% vs 90% programado)    │
│   🟡 Muros PB:         -15% (35% vs 50% programado)    │
│   ✓ Cimentación:       +2% (adelantada)                │
│                                                         │
│ ■ Próximos Hitos                                        │
│   18/Feb  Fin cimentación         (3 días) 🟡 Riesgo  │
│   30/Abr  Fin estructura          (74 días) ✓ OK       │
│   15/May  50% avance (ministrac.) (89 días) ✓ OK       │
│                                                         │
│ ■ Recursos en Obra Hoy                                  │
│   Cuadrillas activas:  8                               │
│   Trabajadores:        78                              │
│   Viviendas activas:   23 (de 50)                     │
│                                                         │
│ ■ Evidencias Capturadas                                 │
│   Fotos hoy:          45                               │
│   Checklists hoy:      3                               │
│   Última actualización: Hace 15 minutos                │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Vista Detallada por Partida

**Análisis de Partida:**
```
ANÁLISIS DETALLADO: 02 - Cimentación

┌──────────────────────────────────────────────────────┐
│ ■ Resumen                                            │
│   Status:          🟡 Retraso leve                   │
│   Programado:      92%                               │
│   Real:            85%                               │
│   Desviación:      -7 puntos                         │
│   Duración plan:   6 semanas                         │
│   Duración real:   6.8 semanas (+0.8 sem)           │
│                                                      │
│ ■ Desglose por Subconcepto                           │
│ ┌─────────────────┬─────┬──────┬──────┬──────────┐  │
│ │ Concepto        │ Plan│ Real │ Desv │ Status   │  │
│ ├─────────────────┼─────┼──────┼──────┼──────────┤  │
│ │ Excavación      │100% │ 100% │  0%  │ ✓        │  │
│ │ Plantilla       │100% │ 100% │  0%  │ ✓        │  │
│ │ Cimentación     │ 95% │  90% │ -5%  │ 🟡       │  │
│ │ Rellenos        │ 90% │  60% │-30%  │ 🔴       │  │
│ └─────────────────┴─────┴──────┴──────┴──────────┘  │
│                                                      │
│ ■ Productividad                                       │
│   Rendimiento real:    12.8 m³/día                   │
│   Rendimiento plan:    14.2 m³/día                   │
│   Eficiencia:          90% 🟡                        │
│                                                      │
│   Horas-hombre total:  1,245 h                       │
│   Horas-hombre plan:   1,180 h                       │
│   Sobrecosto MO:       +5.5%                         │
│                                                      │
│ ■ Materiales Consumidos                               │
│   Cemento:        85.2 ton  (vs 82.0 plan) +3.9%    │
│   Acero:          4.8 ton   (vs 4.5 plan)  +6.7%    │
│   Grava:          125.5 m³  (vs 128.0 plan) -2.0%   │
│                                                      │
│ ■ Causas de Desviación                                │
│   1. Lluvia (5 días perdidos)                        │
│   2. Material húmedo en rellenos                     │
│   3. Falta de cuadrilla adicional                    │
│                                                      │
│ ■ Plan de Acción                                      │
│   ✓ Contratada cuadrilla extra (Implementado)       │
│   ⏳ Aceleración en rellenos (En proceso)            │
│   ⏳ Turno extra sábados (Pendiente aprobación)      │
└──────────────────────────────────────────────────────┘
```

### 3.3 Mapa de Calor de Avances

**Vista por Lotes:**
```
MAPA DE CALOR - Avance por Vivienda
Fracc. Los Pinos - Etapa 1 (50 viviendas)

Manzana 1:
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 01 │ 02 │ 03 │ 04 │ 05 │ 06 │ 07 │ 08 │ 09 │ 10 │
│100%│100%│100%│ 95%│ 92%│ 88%│ 85%│ 82%│ 78%│ 75%│
│ 🟢 │ 🟢 │ 🟢 │ 🟢 │ 🟢 │ 🟡 │ 🟡 │ 🟡 │ 🟡 │ 🟡 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘

Manzana 2:
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │ 20 │
│ 72%│ 68%│ 65%│ 62%│ 58%│ 55%│ 52%│ 48%│ 45%│ 42%│
│ 🟡 │ 🟡 │ 🟡 │ 🟡 │ 🟠 │ 🟠 │ 🟠 │ 🟠 │ 🟠 │ 🟠 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘

Manzana 3:
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 21 │ 22 │ 23 │ 24 │ 25 │ 26 │ 27 │ 28 │ 29 │ 30 │
│ 38%│ 35%│ 32%│ 28%│ 25%│ 22%│ 18%│ 15%│ 12%│  8%│
│ 🟠 │ 🟠 │ 🔴 │ 🔴 │ 🔴 │ 🔴 │ 🔴 │ 🔴 │ 🔴 │ 🔴 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘

Manzana 4-5: Pendientes (Lotes 31-50) → Inicio: Mar/2025

Leyenda:
  🟢 >80%  Avanzado      🟡 60-80% En tiempo
  🟠 40-60% Atrasado     🔴 <40%   Crítico

[Vista por Partida] [Vista 3D] [Exportar]
```

### 3.4 Análisis de Productividad

**Dashboard de Eficiencia:**
```
┌──────────────────────────────────────────────────────┐
│ ANÁLISIS DE PRODUCTIVIDAD - Febrero 2025            │
├──────────────────────────────────────────────────────┤
│ ■ Rendimientos por Partida                           │
│ ┌──────────────┬──────┬──────┬────────┬─────────┐  │
│ │ Partida      │ Real │ Plan │ Efic.  │ Unidad  │  │
│ ├──────────────┼──────┼──────┼────────┼─────────┤  │
│ │ Excavación   │ 28.5 │ 30.0 │  95% ✓ │ m³/día  │  │
│ │ Cimentación  │ 12.8 │ 14.2 │  90% 🟡│ m³/día  │  │
│ │ Muros block  │ 45.2 │ 48.0 │  94% ✓ │ m²/día  │  │
│ │ Colado losa  │  3.2 │  3.5 │  91% 🟡│ viv/día │  │
│ │ Inst. hidráu │  2.8 │  3.0 │  93% ✓ │ viv/día │  │
│ └──────────────┴──────┴──────┴────────┴─────────┘  │
│                                                      │
│ ■ Eficiencia por Cuadrilla                           │
│   Cuadrilla A (Cimentación):  94% ✓ Excelente       │
│   Cuadrilla B (Block):         91% 🟡 Bueno         │
│   Cuadrilla C (Acabados):      88% 🟡 Aceptable     │
│   Cuadrilla D (Instalaciones): 96% ✓ Excelente      │
│                                                      │
│ ■ Horas-Hombre                                        │
│   Total del mes:       8,450 h                       │
│   Productivas:         7,250 h (85.8%)              │
│   No productivas:      1,200 h (14.2%) 🟡           │
│     Lluvia:            720 h (60%)                   │
│     Falta material:    280 h (23%)                   │
│     Otros:             200 h (17%)                   │
│                                                      │
│ ■ Tendencia Mensual                                   │
│   Efic                                               │
│   100│        ●───●        ●─────●                  │
│    95│   ●───                                       │
│    90│●─                                            │
│    85│                                              │
│      └─────────────────────────────────────→        │
│       Ene  Feb  Mar  Abr  May  Jun                 │
│                                                      │
│   Mejora continua: +2% mensual ✓                    │
└──────────────────────────────────────────────────────┘
```

### 3.5 Reporte para Cliente/INFONAVIT

**Reporte Oficial:**
```
╔══════════════════════════════════════════════════════╗
║   REPORTE DE AVANCE MENSUAL - FEBRERO 2025          ║
║                                                      ║
║   PROYECTO: Fraccionamiento Los Pinos - Etapa 1     ║
║   CLIENTE: INFONAVIT (Convenio IF-2025-001)         ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║ 1. AVANCE FÍSICO ACUMULADO                           ║
║                                                      ║
║    Avance al inicio del mes:  32.5%                 ║
║    Avance al final del mes:   38.2%                 ║
║    Incremento del mes:        +5.7 puntos           ║
║                                                      ║
║    Meta contractual:          38.0%                 ║
║    Cumplimiento:              ✓ 100.5%              ║
║                                                      ║
║ 2. AVANCE POR PARTIDA                                ║
║                                                      ║
║    Partida              Programado    Real   Status ║
║    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║    Preliminares           100.0%    100.0%    ✓    ║
║    Cimentación             92.0%     85.0%    🟡   ║
║    Estructura              12.0%     12.0%    ✓    ║
║    Instalaciones            0.0%      0.0%    -    ║
║    Acabados                 0.0%      0.0%    -    ║
║    Urbanización             0.0%      0.0%    -    ║
║                                                      ║
║ 3. AVANCE POR VIVIENDA                               ║
║                                                      ║
║    Estado              Cantidad    %Total           ║
║    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║    100% terminadas         10       20.0%           ║
║    80-99% avanzadas        12       24.0%           ║
║    50-79% en proceso       15       30.0%           ║
║    20-49% iniciadas        13       26.0%           ║
║    <20% sin iniciar         0        0.0%           ║
║                                                      ║
║ 4. HITOS CUMPLIDOS                                   ║
║                                                      ║
║    ✓ Trazo y nivelación (14/Ene)                    ║
║    ✓ 30% avance físico (28/Feb)                     ║
║                                                      ║
║ 5. PRÓXIMOS HITOS                                    ║
║                                                      ║
║    • Fin cimentación (18/Feb) - En riesgo          ║
║    • Fin estructura (30/Abr)  - Programado         ║
║    • 50% avance (15/May)      - Programado         ║
║                                                      ║
║ 6. EVIDENCIAS FOTOGRÁFICAS                           ║
║                                                      ║
║    Total de fotografías del mes:  1,247            ║
║    Checklists de calidad:          150             ║
║    No conformidades:                12 (resueltas) ║
║                                                      ║
║    [Ver anexo fotográfico adjunto]                  ║
║                                                      ║
║ 7. OBSERVACIONES Y COMENTARIOS                       ║
║                                                      ║
║    • Retraso leve en cimentación por lluvias       ║
║    • Plan de recuperación implementado             ║
║    • Proyección de término: En tiempo              ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║ ELABORÓ:                     AUTORIZÓ:              ║
║                                                      ║
║ _____________________        _____________________   ║
║ Ing. Pedro Ramírez           Ing. Juan Director     ║
║ Residente de Obra            Director de Proyectos  ║
║                                                      ║
║ Fecha: 28/Febrero/2025                              ║
╚══════════════════════════════════════════════════════╝

Anexos:
  - Anexo A: Curva S (programado vs real)
  - Anexo B: Evidencias fotográficas (100 fotos)
  - Anexo C: Checklists de calidad
  - Anexo D: Reporte de no conformidades

[Generar PDF]  [Firmar Digitalmente]  [Enviar]
```

### 3.6 Alertas y Notificaciones

**Panel de Alertas:**
```
┌──────────────────────────────────────────────────────┐
│ ALERTAS Y NOTIFICACIONES                             │
│ Proyecto: Fracc. Los Pinos                           │
├──────────────────────────────────────────────────────┤
│ 🔴 CRÍTICAS (2)                                      │
│   • Rellenos con retraso >20%                       │
│     Acción: Plan de recuperación aprobado           │
│     [Ver detalles]                                   │
│                                                      │
│   • Hito "Fin cimentación" en riesgo (3 días)       │
│     Acción: Turno extra aprobado                    │
│     [Ver plan]                                       │
│                                                      │
│ 🟡 WARNINGS (5)                                      │
│   • Muros PB con retraso -15%                       │
│   • Eficiencia cuadrilla C: 88% (meta >90%)         │
│   • Sobreconsumo cemento +3.9%                      │
│   • 12 viviendas sin avance en 7 días               │
│   • Checklist pendiente: Lote 45                    │
│                                                      │
│ 🟢 LOGROS (3)                                        │
│   ✓ Hito 30% avance cumplido                        │
│   ✓ Cuadrilla D eficiencia 96%                      │
│   ✓ Frente A adelantado +2%                         │
│                                                      │
│ ⏰ PRÓXIMOS (3)                                      │
│   → Reporte mensual vence en 2 días                 │
│   → Visita INFONAVIT programada: 20/Feb             │
│   → Estimación #3 disponible: 25/Feb                │
└──────────────────────────────────────────────────────┘

Notificaciones configuradas:
  ☑ Email diario resumen (8:00 am)
  ☑ WhatsApp alertas críticas (inmediato)
  ☑ Dashboard push (tiempo real)
  ☐ SMS para hitos (deshabilitado)
```

### 3.7 Exportaciones y Reportes

**Catálogo de Reportes:**
```
┌──────────────────────────────────────────────────────┐
│ GENERADOR DE REPORTES                                │
├──────────────────────────────────────────────────────┤
│ Tipo de reporte:                                     │
│ (●) Avance mensual oficial                          │
│ ( ) Curva S comparativa                             │
│ ( ) Productividad por cuadrilla                     │
│ ( ) Consumo de materiales                           │
│ ( ) Evidencias fotográficas                         │
│ ( ) Checklists de calidad                           │
│ ( ) Reporte ejecutivo                               │
│                                                      │
│ Período:                                             │
│ Desde: [01/Feb/2025]  Hasta: [28/Feb/2025]         │
│                                                      │
│ Incluir:                                             │
│ ☑ Curva S gráfica                                   │
│ ☑ Tabla de avances por partida                      │
│ ☑ Top 10 fotografías                                │
│ ☑ Resumen de checklists                             │
│ ☐ Análisis de desviaciones                          │
│ ☐ Plan de recuperación                              │
│                                                      │
│ Formato de salida:                                   │
│ (●) PDF  ( ) Excel  ( ) PowerPoint                 │
│                                                      │
│ Plantilla:                                           │
│ [INFONAVIT Oficial ▼]                               │
│                                                      │
│ Idioma: [Español ▼]                                 │
│                                                      │
│ ☑ Incluir firma digital                             │
│ ☑ Marca de agua en fotos                            │
│                                                      │
│          [Vista Previa]  [Generar Reporte]          │
└──────────────────────────────────────────────────────┘

Reportes recientes:
  📄 Avance Mensual Ene-2025.pdf (28/Ene, 2.3 MB)
  📄 Reporte INFONAVIT Dic-2024.pdf (30/Dic, 5.1 MB)
  📊 Análisis Productividad Q4-2024.xlsx (31/Dic, 850 KB)
```

---

## 4. Modelo de Datos

```typescript
// dashboard_widgets (configuración de dashboard)
{
  id: UUID,
  userId: UUID,
  widgetType: VARCHAR(50),
  position: INTEGER,
  size: VARCHAR(20), // 'small', 'medium', 'large'
  config: JSONB,
  isVisible: BOOLEAN DEFAULT true
}

// kpi_metrics (métricas calculadas)
{
  id: UUID,
  projectId: UUID,
  metricDate: DATE,

  physicalProgress: DECIMAL(5,2),
  financialProgress: DECIMAL(5,2),
  timeElapsed: DECIMAL(5,2),

  spi: DECIMAL(5,3), // Schedule Performance Index
  cpi: DECIMAL(5,3), // Cost Performance Index

  productiveHours: DECIMAL(10,2),
  nonproductiveHours: DECIMAL(10,2),
  efficiency: DECIMAL(5,2),

  criticalAlerts: INTEGER,
  warningAlerts: INTEGER,

  createdAt: TIMESTAMP
}

// reports_generated (reportes generados)
{
  id: UUID,
  reportType: VARCHAR(50),
  projectId: UUID,

  periodStart: DATE,
  periodEnd: DATE,

  template: VARCHAR(100),
  format: ENUM('pdf', 'excel', 'pptx'),

  filePath: VARCHAR(512),
  fileSize: INTEGER,

  includedSections: VARCHAR[],

  generatedBy: UUID,
  generatedAt: TIMESTAMP,

  digitallySigned: BOOLEAN DEFAULT false,
  signedBy: UUID NULLABLE,
  signedAt: TIMESTAMP NULLABLE,

  sentTo: VARCHAR[], // emails
  sentAt: TIMESTAMP NULLABLE
}

// productivity_metrics (métricas de productividad)
{
  id: UUID,
  projectId: UUID,
  activityId: UUID,
  crewId: UUID,

  periodStart: DATE,
  periodEnd: DATE,

  plannedRate: DECIMAL(10,4), // unidades/día
  actualRate: DECIMAL(10,4),
  efficiency: DECIMAL(5,2),

  unit: VARCHAR(20),

  laborHours: DECIMAL(10,2),
  quantityProduced: DECIMAL(12,4),

  createdAt: TIMESTAMP
}

// alerts_config (configuración de alertas)
{
  id: UUID,
  projectId: UUID,
  alertType: VARCHAR(50),

  threshold: DECIMAL(10,2),
  severity: ENUM('info', 'warning', 'critical'),

  notificationChannels: VARCHAR[], // ['email', 'whatsapp', 'push']
  recipients: UUID[],

  isActive: BOOLEAN DEFAULT true,

  createdAt: TIMESTAMP
}
```

---

## 5. Criterios de Aceptación

- [ ] Dashboard ejecutivo con KPIs en tiempo real
- [ ] Curva S programado vs real
- [ ] Mapa de calor de avances por lote
- [ ] Análisis de productividad por cuadrilla
- [ ] Alertas automáticas (críticas, warnings, logros)
- [ ] Reporte mensual oficial (PDF)
- [ ] Generador de reportes configurables
- [ ] Exportación a PDF, Excel, PowerPoint
- [ ] Firma digital en reportes
- [ ] Notificaciones multicanal (email, WhatsApp, push)
- [ ] Widgets personalizables por usuario
- [ ] Histórico de métricas y KPIs

---

**Estado:** ✅ Ready for Development
