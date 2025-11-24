# US-PURCH-005: Recibir Material en Almacén

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 12
**Story Points:** 5
**Prioridad:** Alta

---

## Historia de Usuario

**Como** Almacenista
**Quiero** registrar la recepción de materiales contra órdenes de compra
**Para** actualizar el inventario y validar que lo recibido coincide con lo ordenado

---

## Criterios de Aceptación

### AC1: Registrar Entrada de Material
```
Almacenista José García inicia sesión
Va a: Almacén → Recepciones → [+ Nueva Recepción]

┌──────────────────────────────────────────────────────┐
│ RECEPCIÓN DE MATERIAL                                │
├──────────────────────────────────────────────────────┤
│ Almacén: [Fracc. Los Pinos ▼]                       │
│ Fecha: 07/Dic/2025                                  │
│                                                      │
│ Orden de Compra: *                                   │
│ [🔍 Buscar OC...        ] o escanear código QR      │
│                                                      │
│ → Busca: "OC-2025-00145"                            │
│                                                      │
│ ✓ OC-2025-00145 encontrada                          │
│   Proveedor: Materiales del Norte                   │
│   Fecha entrega esperada: 07/Dic/2025 ✓ A tiempo    │
│   Status: Enviada                                   │
│                                                      │
│ MATERIALES ORDENADOS                                 │
│ ┌────────────┬────────┬────────┬──────────┬────────┐│
│ │ Material   │Ordenado│Recibido│ Aceptado │Rechazad││
│ ├────────────┼────────┼────────┼──────────┼────────┤│
│ │Cemento CPC │ 120 ton│[80]ton │ [80] ton │[0] ton ││
│ │            │        │        │          │        ││
│ │Grava 3/4"  │ 85 m³  │[85]m³  │ [85] m³  │[0] m³  ││
│ │            │        │        │          │        ││
│ │Arena       │ 100 m³ │[100]m³ │ [97] m³  │[3] m³  ││
│ │ Motivo rechazo: [Material húmedo, mala calidad  ]││
│ └────────────┴────────┴────────┴──────────┴────────┘│
│                                                      │
│ Documentos del proveedor:                            │
│ Remisión: [R-12345    ]                             │
│ Factura: [Pendiente ▼] (puede ser posterior)       │
│ Guía transporte: [GT-9876  ]                        │
│                                                      │
│ Transportista: [Transportes Rápidos SA]            │
│                                                      │
│ Fotos/evidencias: [📸 Subir fotos] (opcional)       │
│                                                      │
│ Observaciones:                                       │
│ [Entrega parcial de cemento (80 de 120 ton).       ]│
│ [Arena con humedad, se rechazaron 3 m³.            ]│
│ [Pendiente recibir 40 ton de cemento.              ]│
│                                                      │
│              [Guardar]  [Completar Recepción]       │
└──────────────────────────────────────────────────────┘

Validaciones:
- Cantidad recibida ≤ ordenada
- Aceptado + Rechazado = Recibido
- Si hay rechazados, motivo obligatorio
```

### AC2: Actualización Automática de Inventario
```
Al guardar recepción:

1. Se crea movimiento: ENT-2025-00234

2. Actualización de stock:

   ANTES:
   ┌────────────┬────────┬────────┬────────┐
   │ Material   │ Stock  │ Costo  │ Valor  │
   ├────────────┼────────┼────────┼────────┤
   │ Cemento    │ 40 ton │ $4,200 │$168,000│
   │ Grava      │ 20 m³  │ $380   │ $7,600 │
   │ Arena      │ 15 m³  │ $290   │ $4,350 │
   └────────────┴────────┴────────┴────────┘

   DESPUÉS (automático):
   ┌────────────┬────────┬────────┬────────┐
   │ Material   │ Stock  │ Costo  │ Valor  │
   ├────────────┼────────┼────────┼────────┤
   │ Cemento    │120 ton │ $4,267*│$512,040│
   │ Grava      │105 m³  │ $384*  │$40,320 │
   │ Arena      │112 m³  │ $293*  │$32,816 │
   └────────────┴────────┴────────┴────────┘
   *Costo promedio ponderado

3. Actualización de OC:
   OC-2025-00145
   Status: pending → partially_received (80/120 cemento)

   Cemento CPC 30R:
     Ordenado: 120 ton
     Recibido: 80 ton (66.7%)
     Pendiente: 40 ton
     Próxima entrega: Por confirmar

4. Lotes PEPS creados:
   Cemento - Lote ENT-2025-00234 - 80 ton @ $4,280
   Grava   - Lote ENT-2025-00234 - 85 m³ @ $390
   Arena   - Lote ENT-2025-00234 - 97 m³ @ $285
```

### AC3: Manejo de Rechazos y Devoluciones
```
Si hay material rechazado (3 m³ de arena):

1. Se registra en recepción con motivo
2. Se genera alerta para Compras:

⚠️ MATERIAL RECHAZADO EN RECEPCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OC: OC-2025-00145
Proveedor: Materiales del Norte
Almacén: Fracc. Los Pinos

Material: Arena
Cantidad rechazada: 3 m³
Motivo: Material húmedo, mala calidad

Recibió: José García (Almacenista)
Fecha: 07/Dic/2025

Acción requerida:
→ Contactar proveedor
→ Solicitar reposición
→ Considerar para evaluación del proveedor

3. Email automático a Compras
4. Se registra en historial del proveedor
5. Afecta calificación del proveedor
```

### AC4: Comprobante de Recepción
```
Sistema genera comprobante imprimible:

╔══════════════════════════════════════════════════════╗
║        COMPROBANTE DE RECEPCIÓN DE MATERIALES        ║
║              ENT-2025-00234                          ║
╠══════════════════════════════════════════════════════╣
║ Almacén: Fracc. Los Pinos                            ║
║ Fecha: 07 de Diciembre de 2025                       ║
║ Hora: 10:30 AM                                       ║
║                                                      ║
║ ORDEN DE COMPRA: OC-2025-00145                       ║
║ Proveedor: Materiales del Norte SA de CV            ║
║ Remisión: R-12345                                    ║
║ Transportista: Transportes Rápidos SA               ║
╠══════════════════════════════════════════════════════╣
║ Material        │ Ordenado │ Recibido │ Status      ║
╠═════════════════╪══════════╪══════════╪═════════════╣
║ Cemento CPC 30R │ 120 ton  │  80 ton  │ ⚠️ Parcial  ║
║ Grava 3/4"      │  85 m³   │  85 m³   │ ✓ Completo ║
║ Arena           │ 100 m³   │  97 m³   │ ⚠️ Rechazos ║
║                 │          │          │   3 m³      ║
╠═════════════════╧══════════╧══════════╧═════════════╣
║ OBSERVACIONES:                                       ║
║ • Entrega parcial de cemento (80 de 120 ton)        ║
║ • Arena con humedad, rechazados 3 m³                 ║
║ • Pendiente recibir 40 ton de cemento               ║
╠══════════════════════════════════════════════════════╣
║ Recibió: José García (Almacenista)                  ║
║                                                      ║
║ Firma: _____________________                         ║
║                                                      ║
║ Entregó: ___________________                         ║
║          (Transportista)                             ║
╚══════════════════════════════════════════════════════╝

[Imprimir]  [Enviar por Email]  [Descargar PDF]
```

---

## Notas Técnicas

### Backend
- Trigger automático para actualizar stock (PEPS)
- Cálculo de costo promedio ponderado
- Actualizar status de OC en base a % recibido
- Generar alertas si hay rechazos
- Event: `inventory.material_received` para integraciones

### Frontend
- Lectura QR/código de barras para OC
- Captura de fotos con cámara del dispositivo
- Cálculo en tiempo real de aceptado/rechazado
- Firma digital del transportista (canvas)

---

## Definición de Hecho (DoD)

- [ ] Registro de recepción vinculado a OC
- [ ] Entrada parcial y completa
- [ ] Registro de rechazos con motivo
- [ ] Actualización automática de stock (PEPS)
- [ ] Actualización de status de OC
- [ ] Comprobante de recepción imprimible
- [ ] Alertas por rechazos
- [ ] Tests de cálculo de costos promedio

---

**Referencias:** RF-PURCH-002, RF-PURCH-003, ET-PURCH-002, ET-PURCH-003
