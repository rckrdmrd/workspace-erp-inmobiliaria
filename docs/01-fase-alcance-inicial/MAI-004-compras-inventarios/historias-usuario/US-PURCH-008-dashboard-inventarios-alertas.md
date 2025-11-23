# US-PURCH-008: Dashboard de Inventarios y Alertas

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 14
**Story Points:** 5
**Prioridad:** Media

---

## Historia de Usuario

**Como** Gerente de Operaciones
**Quiero** visualizar un dashboard ejecutivo de inventarios con alertas automáticas
**Para** tomar decisiones rápidas sobre compras y evitar paros de obra por falta de material

---

## Criterios de Aceptación

### AC1: Dashboard Ejecutivo de Inventarios
```
┌─────────────────────────────────────────────────────────┐
│ DASHBOARD DE INVENTARIOS                                │
│ Actualizado: 30/Nov/2025 18:00          [🔄 Actualizar]│
├─────────────────────────────────────────────────────────┤
│ ■ Resumen General                                       │
│   ┌──────────────┬──────────────┬─────────────────┐    │
│   │ Almacenes    │ Materiales   │ Valor Total     │    │
│   │              │              │                 │    │
│   │      5       │    1,847     │  $11,280,000    │    │
│   │    activos   │   en stock   │                 │    │
│   └──────────────┴──────────────┴─────────────────┘    │
│                                                         │
│ ■ Alertas Activas (12)                                  │
│   🔴 Stock crítico:        3 materiales                 │
│   🟡 Punto reorden:        6 materiales                 │
│   🟠 Sobreconsumo:         2 materiales                 │
│   ⏰ Sin movimiento 90d:   1 material                   │
│                                                         │
│   [Ver Todas las Alertas →]                            │
│                                                         │
│ ■ Top 5 Materiales por Valor                            │
│   ┌─────────────────────┬──────────────┬───────────┐   │
│   │ Material            │ Valor        │ % Total   │   │
│   ├─────────────────────┼──────────────┼───────────┤   │
│   │ Acero fy=4200       │ $3,250,000   │ 28.8%     │   │
│   │ Cemento CPC 30R     │ $1,840,000   │ 16.3%     │   │
│   │ Block 15cm          │ $875,000     │ 7.8%      │   │
│   │ Concreto premezclado│ $720,000     │ 6.4%      │   │
│   │ Varilla corrugada   │ $650,000     │ 5.8%      │   │
│   └─────────────────────┴──────────────┴───────────┘   │
│                                                         │
│ ■ Rotación de Inventario                                │
│   Índice rotación:      8.5 veces/año ✓                │
│   Días inventario:      43 días                         │
│   Meta:                 <60 días                        │
│                                                         │
│   ╔═══════════════════════════════════════════╗        │
│   ║ ████████████████████████░░░░░░░░░░ 72%    ║        │
│   ╚═══════════════════════════════════════════╝        │
│                                                         │
│ ■ Movimientos del Día                                   │
│   Entradas:  $245,000 (5 movimientos)                  │
│   Salidas:   $187,500 (8 movimientos)                  │
│   Traspasos: 2                                          │
└─────────────────────────────────────────────────────────┘
```

### AC2: Sistema de Alertas Inteligentes
```
ALERTAS ACTIVAS (12)

Filtros: [Todas ▼] [Críticas primero ▼]

┌──────────────────────────────────────────────────────┐
│ 🔴 CRÍTICO: Stock Bajo Mínimo                        │
│ Material: Varilla 3/8" fy=4200                       │
│ Almacén: Fracc. Los Pinos                           │
│                                                      │
│ Stock actual:     150 kg                            │
│ Stock mínimo:     500 kg                            │
│ Faltante:         350 kg                            │
│                                                      │
│ Consumo promedio: 85 kg/día                         │
│ Días restantes:   1.8 días ⚠️                       │
│                                                      │
│ Acción requerida:                                    │
│ → Generar requisición urgente                       │
│ → Solicitar traspaso de Alm. General                │
│                                                      │
│ Creada: Hace 2 horas                                │
│ [📋 Crear Requisición] [🔕 Silenciar] [✓ Resolver] │
├──────────────────────────────────────────────────────┤
│ 🟡 INFO: Punto de Reorden Alcanzado                 │
│ Material: Block 15cm                                │
│ Almacén: Torre Central                              │
│                                                      │
│ Stock actual:     2,000 pza                         │
│ Punto reorden:    2,000 pza                         │
│                                                      │
│ Consumo semanal:  1,500 pza                         │
│ Lead time:        7 días                            │
│                                                      │
│ Sugerencia:                                          │
│ → Ordenar 6,000 pza (4 semanas de consumo)         │
│ → Proveedores recomendados:                         │
│   • Bloques del Norte (A-87pts)                     │
│   • Prefabricados SA (A-85pts)                      │
│                                                      │
│ [📋 Crear RFQ] [🔕 Posponer] [✓ Resolver]          │
├──────────────────────────────────────────────────────┤
│ 🔴 CRÍTICO: Sobreconsumo                            │
│ Material: Acero fy=4200                             │
│ Proyecto: Fracc. Los Pinos                          │
│ Partida: 03-Estructura                              │
│                                                      │
│ Presupuestado (45%):  38.2 ton                      │
│ Consumo real:         42.5 ton                      │
│ Desviación:          +4.3 ton (+11.3%) 🔴          │
│                                                      │
│ Proyección al 100%:   94.4 ton                      │
│ Presupuesto total:    85.0 ton                      │
│ Sobrecosto esperado:  +$192,700                     │
│                                                      │
│ Causas posibles:                                     │
│ • Cambio en diseño estructural                      │
│ • Mayor desperdicio de corte                        │
│                                                      │
│ [📊 Ver Análisis] [📧 Notificar] [✓ Reconocido]   │
└──────────────────────────────────────────────────────┘
```

### AC3: Configuración de Alertas por Material
```
CONFIGURAR ALERTAS: Cemento CPC 30R
Almacén: Fracc. Los Pinos

┌──────────────────────────────────────────────────────┐
│ UMBRALES DE STOCK                                    │
├──────────────────────────────────────────────────────┤
│ Stock Mínimo:      [20] ton                         │
│ Stock Máximo:      [150] ton                        │
│ Punto de Reorden:  [40] ton                         │
│ Lead Time:         [5] días                         │
│                                                      │
│ ■ Tipos de Alerta                                    │
│ ☑ Stock bajo mínimo (Crítico)                       │
│ ☑ Punto de reorden alcanzado (Info)                │
│ ☑ Sobreconsumo vs presupuesto >5% (Warning)        │
│ ☐ Material sin movimiento 90 días                   │
│ ☑ Stock sobre máximo (Warning)                     │
│                                                      │
│ ■ Notificaciones                                     │
│ Notificar a:                                         │
│ ☑ Gerente de Compras         (email + in-app)      │
│ ☑ Residente de Obra          (in-app)              │
│ ☑ Almacenista                (in-app)              │
│                                                      │
│ Frecuencia de recordatorios:                         │
│ (●) Diario  ( ) Cada 3 días  ( ) Semanal           │
│                                                      │
│                        [Guardar Configuración]       │
└──────────────────────────────────────────────────────┘

Reglas de Negocio:
- Stock mínimo < Punto reorden < Stock máximo
- Lead time en días hábiles
- Notificaciones solo a usuarios con permisos
```

### AC4: Historial de Alertas y Acciones
```
HISTORIAL DE ALERTAS
Material: Cemento CPC 30R
Período: Últimos 30 días

┌──────────────────────────────────────────────────────┐
│ Fecha  │ Tipo        │ Status    │ Acción Tomada    ││
├────────┼─────────────┼───────────┼──────────────────┤│
│25/Nov  │Stock crítico│✅ Resuelta│REQ-2025-00125    ││
│        │15 ton       │           │generada y aprob. ││
│        │Resolvió: Gerente Compras (26/Nov 10:30)    ││
│        │                                             │
│18/Nov  │Punto reorden│✅ Resuelta│OC-2025-00142     ││
│        │40 ton       │           │120 ton ordenadas ││
│        │Resolvió: Gerente Compras (18/Nov 14:00)    ││
│        │                                             │
│12/Nov  │Sobreconsumo │🔕 Silenc. │Justificado por   ││
│        │+8%          │           │cambio de alcance ││
│        │Silenciado por: Director Proyectos          ││
│        │                                             │
│05/Nov  │Stock crítico│✅ Resuelta│Traspaso desde    ││
│        │18 ton       │           │Alm. General      ││
│        │Resolvió: Almacenista (05/Nov 16:45)        ││
└──────────────────────────────────────────────────────┘

Métricas del período:
  Total alertas:        15
  Resueltas:           12 (80%)
  Tiempo promedio:     4.2 horas
  Alertas recurrentes: 2 (revisar configuración)
```

### AC5: Notificaciones en Tiempo Real
```
Panel de Notificaciones (campanita):

🔔 12 no leídas

┌──────────────────────────────────────────────────────┐
│ 🔴 Stock crítico: Varilla 3/8" (150kg)              │
│    Almacén: Fracc. Los Pinos                         │
│    Hace 2 horas                           [Ver más] │
│                                                      │
│ 🟡 Punto reorden: Block 15cm (2,000 pza)           │
│    Almacén: Torre Central                            │
│    Hace 4 horas                           [Ver más] │
│                                                      │
│ ✅ Material recibido: Cemento CPC (80 ton)          │
│    OC-2025-00145 - Fracc. Los Pinos                 │
│    Ayer                                   [Ver más] │
│                                                      │
│ 📋 Requisición aprobada: REQ-2025-00123             │
│    Aprobado por: Gerente Compras                     │
│    Hace 2 días                            [Ver más] │
└──────────────────────────────────────────────────────┘

Email diario (resumen):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Asunto: Resumen Diario de Inventarios

Buenos días,

Alertas del día:
- 3 materiales en stock crítico
- 6 materiales en punto de reorden
- 2 materiales con sobreconsumo

Movimientos del día:
- Entradas: $245,000
- Salidas: $187,500

Acciones requeridas:
→ Revisar alertas críticas en el dashboard

[Ver Dashboard Completo]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Notas Técnicas

### Backend
- CRON diario para verificar alertas (6am)
- WebSocket para notificaciones en tiempo real
- Queue para emails (evitar bloqueos)
- Configuración de alertas por material/almacén
- Historial completo de alertas

### Frontend
- Dashboard con auto-refresh cada 5 min
- Notificaciones toast para alertas nuevas
- Iconos por severidad (crítico/warning/info)
- Filtros y búsqueda de alertas
- Acciones rápidas desde la alerta

---

## Definición de Hecho (DoD)

- [ ] Dashboard ejecutivo de inventarios
- [ ] 5 tipos de alertas automáticas
- [ ] Configuración de umbrales por material
- [ ] Notificaciones in-app + email
- [ ] Historial de alertas con acciones
- [ ] Métricas de resolución de alertas
- [ ] Acciones rápidas desde alertas
- [ ] Tests de generación de alertas

---

**Referencias:** RF-PURCH-004, ET-PURCH-004
