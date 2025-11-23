# US-PURCH-004: Aprobar y Generar Orden de Compra

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 12
**Story Points:** 8
**Prioridad:** Alta

---

## Historia de Usuario

**Como** Gerente de Compras
**Quiero** generar órdenes de compra formales desde cotizaciones aprobadas
**Para** formalizar el pedido con el proveedor y tener trazabilidad del proceso

---

## Criterios de Aceptación

### AC1: Generar OC desde Cotización
```
Flujo:
1. Comparativo de cotizaciones muestra:
   "Materiales del Norte - Score 82.0"
   [Generar Orden de Compra]

2. Sistema pre-llena formulario OC:

┌──────────────────────────────────────────────────────┐
│ ORDEN DE COMPRA                                      │
├──────────────────────────────────────────────────────┤
│ Folio: OC-2025-00145 (automático)                   │
│ Fecha: 20/Nov/2025                                  │
│                                                      │
│ PROVEEDOR                                            │
│ Materiales del Norte SA de CV                       │
│ RFC: MAT901010XXX                                   │
│ Contacto: Ana López - 81-1234-5678                  │
│ ana.lopez@materialesdn.com                          │
│                                                      │
│ PROYECTO Y ENTREGA                                   │
│ Proyecto: Fracc. Los Pinos                          │
│ Entregar en:                                        │
│   Av. Los Pinos #100, Col. Valle Verde             │
│   Monterrey, N.L. CP 64000                          │
│ Fecha entrega: [07/Dic/2025]                        │
│                                                      │
│ MATERIALES                                           │
│ ┌──────────────┬──────┬─────┬────────┬──────────┐  │
│ │ Descripción  │ Cant │ Unid│ P.U.   │ Total    │  │
│ ├──────────────┼──────┼─────┼────────┼──────────┤  │
│ │ Cemento CPC  │ 120  │ ton │ $4,280 │ $513,600 │  │
│ │ Grava 3/4"   │ 85   │ m³  │ $390   │ $33,150  │  │
│ │ Arena        │ 100  │ m³  │ $285   │ $28,500  │  │
│ └──────────────┴──────┴─────┴────────┴──────────┘  │
│                                                      │
│ Subtotal:                              $575,250     │
│ IVA 16%:                               $92,040      │
│ TOTAL:                                 $667,290     │
│                                                      │
│ CONDICIONES                                          │
│ Forma de pago: 30 días fecha factura                │
│ ☑ Incluye descarga en obra                          │
│ Garantía: [30] días                                 │
│                                                      │
│ Condiciones especiales:                              │
│ [Precio incluye transporte. Descarga en horario    ]│
│ [de 8am a 5pm de lunes a viernes.                  ]│
│                                                      │
│        [Vista Previa PDF]  [Aprobar y Enviar]       │
└──────────────────────────────────────────────────────┘
```

### AC2: Vista Previa y Aprobación
```
PDF generado (Vista previa):

╔══════════════════════════════════════════════════════╗
║                  CONSTRUCTORA XYZ                    ║
║            RFC: CON850101XXX                         ║
║    Av. Principal #123, Monterrey, N.L.               ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║           ORDEN DE COMPRA                            ║
║              OC-2025-00145                           ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║ Fecha: 20 de Noviembre de 2025                       ║
║                                                      ║
║ PROVEEDOR:                                           ║
║ Materiales del Norte SA de CV                        ║
║ RFC: MAT901010XXX                                    ║
║ Contacto: Ana López                                  ║
║ Tel: 81-1234-5678                                    ║
║                                                      ║
║ PROYECTO:                                            ║
║ Fraccionamiento Los Pinos                            ║
║                                                      ║
║ ENTREGAR EN:                                         ║
║ Av. Los Pinos #100                                   ║
║ Col. Valle Verde, Monterrey, N.L.                    ║
║ CP: 64000                                            ║
║                                                      ║
║ FECHA DE ENTREGA REQUERIDA: 07/Dic/2025             ║
╠══════════════════════════════════════════════════════╣
║ # │ Descripción        │Cant│Unid│ P.U.  │ Total   ║
╠═══╪════════════════════╪════╪════╪═══════╪═════════╣
║ 1 │ Cemento CPC 30R    │120 │ton │$4,280 │$513,600 ║
║ 2 │ Grava 3/4"         │ 85 │m³  │$390   │$33,150  ║
║ 3 │ Arena              │100 │m³  │$285   │$28,500  ║
╠═══╧════════════════════╧════╧════╧═══════╧═════════╣
║                            Subtotal:     $575,250   ║
║                            IVA 16%:      $92,040    ║
║                            TOTAL:        $667,290   ║
╠══════════════════════════════════════════════════════╣
║ CONDICIONES:                                         ║
║ • Forma de pago: 30 días fecha factura              ║
║ • Entrega: LAB (libre a bordo) en obra              ║
║ • Incluye descarga en horario de 8am a 5pm          ║
║ • Garantía: 30 días                                 ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║ Autorizado por:                                      ║
║                                                      ║
║ _______________________                              ║
║ Gerente de Compras                                   ║
║ Fecha: _______________                               ║
╚══════════════════════════════════════════════════════╝

[⬇️ Descargar]  [📧 Enviar Email]  [← Editar]  [✓ Aprobar]
```

### AC3: Envío y Seguimiento de OC
```
Al aprobar OC-2025-00145:

1. Status cambia: pending → approved
2. Email automático al proveedor:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
De: compras@constructoraxyz.com
Para: ana.lopez@materialesdn.com
Asunto: Orden de Compra OC-2025-00145

Estimada Ana López,

Adjuntamos orden de compra OC-2025-00145
por $667,290 (IVA incluido).

Materiales:
- Cemento CPC 30R: 120 ton
- Grava 3/4": 85 m³
- Arena: 100 m³

Fecha entrega: 07/Dic/2025
Lugar: Fracc. Los Pinos, Monterrey

Por favor confirmar recepción de esta orden.

Saludos,
Constructora XYZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Adjunto: OC-2025-00145.pdf

3. Registro en timeline:
   20/Nov 09:30 - OC creada
   20/Nov 09:45 - OC aprobada
   20/Nov 09:46 - Email enviado a proveedor
```

### AC4: Dashboard de OCs Activas
```
┌──────────────────────────────────────────────────────┐
│ ÓRDENES DE COMPRA ACTIVAS                            │
│                                                      │
│ Filtros: [Todos los status ▼] [Nov 2025 ▼]         │
│                                                      │
│ Status:                                              │
│   🟡 Pendientes: 3                                  │
│   🟢 Aprobadas: 8                                   │
│   📦 En tránsito: 5                                 │
│   ✅ Recibidas: 12                                  │
├──────────────────────────────────────────────────────┤
│ Código      │Proveedor    │Monto    │Entrega│Status││
├─────────────┼─────────────┼─────────┼───────┼──────┤│
│OC-2025-00145│Materiales DN│$667,290 │07/Dic │🟢 Env││
│  Cemento, Grava, Arena    │         │       │      ││
│                                                      │
│OC-2025-00144│Cemex        │$522,000 │05/Dic │📦 Trá││
│  Cemento CPC 30R (120 ton)│         │       │      ││
│  ⚠️ Entrega parcial: 80 ton recibidas               ││
│                                                      │
│OC-2025-00143│Aceros SA    │$450,000 │01/Dic │⏰ Ret││
│  Varilla 3/8" fy=4200     │         │       │      ││
│  ⚠️ 2 días de retraso                               ││
└──────────────────────────────────────────────────────┘

Acciones por OC:
  [👁 Ver]  [📄 PDF]  [📧 Reenviar]  [✏️ Editar]  [❌ Cancelar]
```

---

## Notas Técnicas

### Backend
- Generación PDF con jsPDF o Puppeteer
- Numeración secuencial con locks de BD
- Email transaccional con SendGrid/AWS SES
- Webhook para confirmación de lectura (opcional)

### Frontend
- Vista previa PDF en modal
- Editor rich-text para condiciones
- Drag & drop para reordenar items
- Firma digital (futuro)

---

## Definición de Hecho (DoD)

- [ ] Generación de OC desde cotización
- [ ] Numeración secuencial OC-YYYY-NNNNN
- [ ] Vista previa PDF
- [ ] Envío automático por email
- [ ] Dashboard de OCs con filtros
- [ ] Timeline de seguimiento
- [ ] Cancelación de OC con motivo
- [ ] Tests de generación PDF

---

**Referencias:** RF-PURCH-002, ET-PURCH-002
