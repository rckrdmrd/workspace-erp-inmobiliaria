# US-PURCH-002: Solicitar Cotizaciones (RFQ)

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 11
**Story Points:** 8
**Prioridad:** Alta

---

## Historia de Usuario

**Como** Gerente de Compras
**Quiero** solicitar cotizaciones a múltiples proveedores simultáneamente
**Para** comparar precios y condiciones antes de generar una orden de compra

---

## Criterios de Aceptación

### AC1: Crear Solicitud de Cotización (RFQ)
```
┌──────────────────────────────────────────────────────┐
│ NUEVA SOLICITUD DE COTIZACIÓN                        │
├──────────────────────────────────────────────────────┤
│ Código: [RFQ-2025-00045] (auto)                     │
│ Proyecto: [Fracc. Los Pinos ▼]                      │
│ Fecha límite respuesta: [25/Nov/2025] *             │
│ Fecha entrega requerida: [05/Dic/2025] *            │
│                                                      │
│ Materiales Solicitados:         [+ Agregar material]│
│ ┌──────────────────┬────────┬──────┬──────────────┐ │
│ │ Material         │ Cant.  │ Unid │ Presup. Ref. │ │
│ ├──────────────────┼────────┼──────┼──────────────┤ │
│ │ Cemento CPC 30R  │ 120    │ ton  │ $4,200       │ │
│ │ Grava 3/4"       │ 85     │ m³   │ $380         │ │
│ │ Arena            │ 100    │ m³   │ $295         │ │
│ └──────────────────┴────────┴──────┴──────────────┘ │
│                                                      │
│ Dirección de entrega: *                              │
│ [Av. Los Pinos #100, Col. Valle Verde              ]│
│ [Monterrey, N.L. CP 64000                           ]│
│                                                      │
│ Condiciones deseadas:                                │
│ Forma de pago: [30 días ▼]                          │
│ ☑ Incluye descarga en obra                          │
│ ☐ Se requiere anticipo                              │
│                                                      │
│ Proveedores invitados: *      [+ Buscar proveedor]  │
│ ┌────────────────────────────────────────────────┐  │
│ │ ☑ Cemex México SA (A-87)      [Eliminar]      │  │
│ │ ☑ Materiales del Norte (B-72)  [Eliminar]      │  │
│ │ ☑ Agregados Premium (A-85)     [Eliminar]      │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│         [Guardar Borrador]  [Enviar a Proveedores]  │
└──────────────────────────────────────────────────────┘

Validaciones:
- Fecha límite >= hoy + 3 días
- Al menos 1 material
- Al menos 2 proveedores invitados
- Proveedores deben tener categoría del material
```

### AC2: Proveedor Recibe y Responde Cotización
```
Email enviado a proveedor:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Asunto: Solicitud de Cotización RFQ-2025-00045

Estimado Juan Pérez,

Solicitamos su cotización para:
- Cemento CPC 30R: 120 ton
- Grava 3/4": 85 m³
- Arena: 100 m³

Fecha límite: 25/Nov/2025
Entrega requerida: 05/Dic/2025
Lugar: Fracc. Los Pinos, Monterrey

Responder en línea:
[Ir a Portal de Proveedores]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Portal del Proveedor:
┌──────────────────────────────────────────────────────┐
│ COTIZACIÓN: RFQ-2025-00045                           │
│ Cliente: Constructora XYZ                            │
│ Vence: 25/Nov/2025 (3 días)                         │
├──────────────────────────────────────────────────────┤
│ Material         │ Cant.│ P.U.    │ Subtotal       ││
│ Cemento CPC 30R  │ 120  │ [$4,350]│ $522,000       ││
│ Grava 3/4"       │ 85   │ [$380]  │ $32,300        ││
│ Arena            │ 100  │ [$295]  │ $29,500        ││
│                                                      │
│ Fecha entrega comprometida: [03/Dic/2025]           │
│ Condiciones pago: [30 días ▼]                       │
│ Vigencia cotización: [15 días]                      │
│                                                      │
│ Notas adicionales:                                   │
│ [Incluye transporte y descarga. Precio válido       ]│
│ [hasta fin de mes.                                  ]│
│                                                      │
│ Adjuntar: [📎 Subir archivo] (opcional)             │
│                                                      │
│                    [Enviar Cotización]               │
└──────────────────────────────────────────────────────┘
```

### AC3: Comparativo de Cotizaciones
```
COMPARATIVO: RFQ-2025-00045
Status: 3 cotizaciones recibidas, 0 pendientes

┌─────────────────────────────────────────────────────────────┐
│         │ Cemex      │ Materiales │ Agregados  │ Presup.   │
│         │ México     │ del Norte  │ Premium    │ Referencia│
├─────────┼────────────┼────────────┼────────────┼───────────┤
│Cemento  │ $4,350/ton │ $4,280/ton │ $4,400/ton │ $4,200    │
│120 ton  │ $522,000   │ $513,600 ✓│ $528,000   │ $504,000  │
│         │            │            │            │           │
│Grava    │ $380/m³    │ $390/m³    │ $375/m³ ✓ │ $380      │
│85 m³    │ $32,300    │ $33,150    │ $31,875    │ $32,300   │
│         │            │            │            │           │
│Arena    │ $295/m³    │ $285/m³ ✓ │ $300/m³    │ $295      │
│100 m³   │ $29,500    │ $28,500    │ $30,000    │ $29,500   │
├─────────┼────────────┼────────────┼────────────┼───────────┤
│Subtotal │ $583,800   │ $575,250   │ $589,875   │ $565,800  │
│IVA 16%  │ $93,408    │ $92,040    │ $94,380    │ $90,528   │
│TOTAL    │ $677,208   │ $667,290 ✓│ $684,255   │ $656,328  │
├─────────┼────────────┼────────────┼────────────┼───────────┤
│Entrega  │ 05/Dic ✓  │ 07/Dic     │ 05/Dic ✓  │ 05/Dic    │
│Pago     │ 30 días    │ 30 días    │ 30 días    │ 30 días   │
│Calif.   │ A-87       │ B-72       │ A-85       │           │
├─────────┼────────────┼────────────┼────────────┼───────────┤
│Score    │ 86.5       │ 82.0       │ 85.0       │           │
│         │🥈 2do lugar│🥇 MEJOR    │🥉 3er lugar│           │
└─────────┴────────────┴────────────┴────────────┴───────────┘

Análisis Automático:
  Mejor precio:    Materiales del Norte (-1.5% vs siguiente)
  Mejor proveedor: Cemex (calificación A-87)
  Mejor balance:   Materiales del Norte (Score 82.0)

                    ⚡ RECOMENDACIÓN ⚡
  Seleccionar: Materiales del Norte
  Ahorro vs presupuesto: $10,962 (1.9%)

[Aceptar Recomendación]  [Seleccionar Otra]  [Cancelar RFQ]
```

### AC4: Generar OC desde Cotización
```
Flujo:
1. Usuario selecciona cotización ganadora
2. Sistema pre-llena OC con datos de la cotización
3. Usuario revisa y ajusta si necesario
4. Se genera OC-2025-00145 automáticamente
5. Cotización marca como "accepted"
6. RFQ marca como "closed"
7. Otras cotizaciones marcan como "rejected"
8. Email a proveedor ganador con OC en PDF
```

---

## Notas Técnicas

### Backend
- CRON job para cerrar RFQs vencidos
- Algoritmo de scoring:
  ```
  score = priceScore * 0.40 +
          supplierRating * 0.35 +
          deliveryScore * 0.25
  ```
- Notificaciones automáticas por email

### Frontend
- Portal público para proveedores (sin autenticación, token en URL)
- Tabla comparativa con highlights automáticos
- Exportar comparativo a Excel/PDF

---

## Definición de Hecho (DoD)

- [ ] Crear RFQ con múltiples proveedores
- [ ] Portal de proveedor funcional
- [ ] Comparativo visual de cotizaciones
- [ ] Scoring automático
- [ ] Generación de OC desde cotización
- [ ] Emails a proveedores
- [ ] Tests E2E del flujo completo

---

**Referencias:** RF-PURCH-001, ET-PURCH-001
