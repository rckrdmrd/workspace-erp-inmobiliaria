# US-PURCH-003: Crear Requisición desde Obra

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 12
**Story Points:** 5
**Prioridad:** Alta

---

## Historia de Usuario

**Como** Residente de Obra
**Quiero** solicitar materiales que necesito para las actividades programadas
**Para** que el departamento de compras gestione la adquisición sin retrasar la construcción

---

## Criterios de Aceptación

### AC1: Crear Nueva Requisición
```
┌──────────────────────────────────────────────────────┐
│ NUEVA REQUISICIÓN DE MATERIALES                      │
├──────────────────────────────────────────────────────┤
│ Código: REQ-2025-00123 (automático)                 │
│ Proyecto: Fracc. Los Pinos                          │
│ Solicitante: Ing. Pedro Ramírez (Residente)         │
│ Fecha: 20/Nov/2025                                  │
│                                                      │
│ Fecha necesaria: [25/Nov/2025] *                    │
│ Urgencia: (●) Normal  ( ) Urgente                   │
│                                                      │
│ Materiales Requeridos:        [+ Buscar material]   │
│ ┌──────────────┬──────┬─────┬──────────┬──────────┐ │
│ │ Material     │ Cant │ Unid│ Presup.  │Disponible││
│ ├──────────────┼──────┼─────┼──────────┼──────────┤ │
│ │ Cemento CPC  │ 120  │ ton │ $516,000 │✓ Sí      ││
│ │   Partida:02-Cimentación                        ││
│ │   📊 Presupuestado:250t | Ejercido:130t |Disp:120││
│ │                                                  ││
│ │ Grava 3/4"   │ 85   │ m³  │ $32,300  │✓ Sí      ││
│ │   Partida:02-Cimentación                        ││
│ │   📊 Presupuestado:200m³|Ejercido:115m³|Disp:85 ││
│ │                                                  ││
│ │ Arena        │ 100  │ m³  │ $29,500  │⚠️ Excede ││
│ │   Partida:02-Cimentación                        ││
│ │   📊 Presupuestado:80m³|Ejercido:0m³|Disp:80    ││
│ │   ⚠️ Solicitas 100 m³ pero solo hay 80 disponib.││
│ └──────────────┴──────┴─────┴──────────┴──────────┘ │
│                                                      │
│ Justificación: *                                     │
│ [Cimentación etapa 2 según programa de obra.       ]│
│ [Inicio: 25/Nov/2025. Requiere materiales previo.  ]│
│                                                      │
│ Total estimado: $577,800                            │
│                                                      │
│    [Guardar Borrador]  [Enviar a Aprobación]        │
└──────────────────────────────────────────────────────┘

Validaciones:
- Fecha necesaria >= hoy + 5 días (lead time mínimo)
- Todos los materiales existen en presupuesto
- Si excede presupuesto disponible: Mostrar alerta
- Justificación obligatoria si urgente o excede presup
```

### AC2: Flujo de Aprobación por Monto
```
REQ-2025-00123: $577,800
Aplicar matriz de aprobación:

Nivel 1: Gerente de Compras (monto >$50K)
  Status: Pendiente
  Notificado: gerente.compras@constructora.com

┌──────────────────────────────────────────────────────┐
│ REQUISICIÓN REQ-2025-00123                           │
│ Solicitante: Ing. Pedro Ramírez                      │
│ Monto: $577,800                                      │
│ Urgencia: Normal                                     │
├──────────────────────────────────────────────────────┤
│ Materiales:                                          │
│   • Cemento CPC 30R: 120 ton                        │
│   • Grava 3/4": 85 m³                               │
│   • Arena: 100 m³ ⚠️ Excede presupuesto            │
│                                                      │
│ Justificación:                                       │
│ "Cimentación etapa 2 según programa..."            │
│                                                      │
│ Comentarios: (opcional)                              │
│ [Arena excede por cambio en diseño de zapatas.      ]│
│ [Ya validado con Director de Proyectos.            ]│
│                                                      │
│         [✓ Aprobar]  [✗ Rechazar]  [↩️ Devolver]    │
└──────────────────────────────────────────────────────┘

Al aprobar:
- Status: approved
- Se puede generar RFQ automáticamente
- Notificación a solicitante
```

### AC3: Historial de Requisiciones
```
Vista del Residente:

MIS REQUISICIONES
Filtros: [Todas ▼] [Este mes ▼]  [🔍 Buscar...]

┌──────────────────────────────────────────────────────┐
│ Código         │ Fecha  │ Monto     │ Status       ││
├────────────────┼────────┼───────────┼──────────────┤│
│ REQ-2025-00123 │20/Nov  │ $577,800  │🟡 Pendiente  ││
│   3 materiales │        │           │ Nivel 1/1    ││
│                                                      │
│ REQ-2025-00118 │15/Nov  │ $245,000  │✅ Aprobada   ││
│   2 materiales │        │           │ OC generada  ││
│                                                      │
│ REQ-2025-00112 │10/Nov  │ $680,000  │✅ Aprobada   ││
│   5 materiales │        │           │ Cotizando    ││
│                                                      │
│ REQ-2025-00105 │05/Nov  │ $125,000  │📦 Recibida   ││
│   3 materiales │        │           │ En almacén   ││
└──────────────────────────────────────────────────────┘

Al hacer clic en REQ-2025-00123:
  Ver detalle completo
  Timeline de aprobaciones
  RFQs/OCs generadas
  Recibos de almacén
```

### AC4: Alertas y Notificaciones
```
Notificaciones del residente:

🔔 Requisición REQ-2025-00123 aprobada
   Gerente de Compras aprobó tu solicitud
   Próximo paso: Cotización con proveedores
   Hace 2 horas

🔔 Material recibido en almacén
   REQ-2025-00105: Cemento CPC 30R (80 ton)
   Almacén: Fracc. Los Pinos
   Ayer

⚠️ Requisición REQ-2025-00098 rechazada
   Motivo: "Material fuera de presupuesto sin autorización"
   Por: Director de Proyectos
   Hace 3 días
```

---

## Notas Técnicas

### Backend
- Endpoint: `POST /api/requisitions`
- Validar disponibilidad presupuestal en tiempo real
- Determinar flujo de aprobación según monto
- Notificaciones por email + in-app

### Frontend
- Autocompletado de materiales desde presupuesto
- Indicador visual de disponibilidad presupuestal
- Timeline de aprobaciones con Stepper component
- Notificaciones en tiempo real (WebSocket)

---

## Definición de Hecho (DoD)

- [ ] Crear requisición con materiales del presupuesto
- [ ] Validación de disponibilidad presupuestal
- [ ] Flujo de aprobación por niveles
- [ ] Notificaciones a aprobadores
- [ ] Historial de requisiciones del usuario
- [ ] Comentarios en aprobaciones/rechazos
- [ ] Tests de validaciones

---

**Referencias:** RF-PURCH-002, ET-PURCH-002
