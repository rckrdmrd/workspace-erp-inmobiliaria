# RF-PURCH-001: Catálogo de Proveedores y Cotizaciones

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17
**Responsable:** Equipo de Producto

---

## 1. Descripción General

Sistema de gestión de proveedores con catálogo centralizado, evaluación de desempeño, comparación de cotizaciones y selección automatizada del mejor proveedor según múltiples criterios (precio, tiempo de entrega, calidad, condiciones de pago).

**Objetivo:**
Optimizar el proceso de compras mediante la selección inteligente de proveedores basada en datos históricos y condiciones actuales.

---

## 2. Objetivos de Negocio

### 2.1 Centralización
- Catálogo único de proveedores por constructora
- Historial completo de compras y desempeño
- Eliminar proveedores duplicados

### 2.2 Optimización de Costos
- Comparación automática de 3+ cotizaciones
- Selección del mejor precio con calidad garantizada
- Ahorro estimado: 5-10% en costos de materiales

### 2.3 Evaluación Objetiva
- Calificación automática basada en cumplimiento
- Indicadores: precio, calidad, puntualidad, servicio
- Proveedores certificados vs no certificados

### 2.4 Agilidad
- Solicitud de cotizaciones masivas
- Comparación en tiempo real
- Aprobación de OC en minutos vs días

---

## 3. Alcance Funcional

### 3.1 Catálogo de Proveedores

#### Información Básica
```
Nombre Comercial: Cemex México S.A. de C.V.
RFC: CEM850101ABC
Razón Social: Cemex México S.A. de C.V.
Giro: Materiales de Construcción

Contacto Principal:
  Nombre: Juan Pérez López
  Cargo: Gerente de Ventas - Zona Norte
  Email: juan.perez@cemex.com
  Teléfono: +52 81 8888-1234
  Celular: +52 81 1234-5678
```

#### Categorías de Proveedor
- **Materiales:** Cemento, acero, agregados, block, prefabricados, acabados
- **Servicios:** Maquinaria, transporte, mano de obra especializada
- **Arrendamiento:** Equipo pesado, andamios, cimbra
- **Servicios Profesionales:** Laboratorios, topografía, ingeniería

#### Información Financiera
```
Condiciones de Pago:
  - Crédito: 30 días
  - Descuento pronto pago: 2% a 10 días
  - Anticipo requerido: No

Cuenta Bancaria:
  Banco: BBVA Bancomer
  Cuenta: 0123456789
  CLABE: 012180001234567890
```

#### Dirección Fiscal y de Entrega
```
Fiscal:
  Calle: Av. Constitución 444
  Colonia: Centro
  CP: 64000
  Ciudad: Monterrey, N.L.

Planta/Almacén Principal:
  Calle: Carretera Nacional Km 305
  Colonia: Santa Catarina
  CP: 66350
  Horario: Lun-Vie 7:00-17:00, Sáb 8:00-13:00
```

### 3.2 Evaluación de Proveedores

#### Sistema de Calificación (0-100 puntos)
```
┌─────────────────────────┬────────┬────────┬───────────┐
│ Criterio                │ Peso   │ Calif. │ Puntaje   │
├─────────────────────────┼────────┼────────┼───────────┤
│ Precio competitivo      │ 30%    │ 85     │ 25.5      │
│ Calidad de productos    │ 25%    │ 92     │ 23.0      │
│ Cumplimiento en entrega │ 25%    │ 88     │ 22.0      │
│ Servicio postventa      │ 10%    │ 90     │ 9.0       │
│ Condiciones de pago     │ 10%    │ 80     │ 8.0       │
├─────────────────────────┼────────┼────────┼───────────┤
│ TOTAL                   │ 100%   │        │ 87.5 🟢   │
└─────────────────────────┴────────┴────────┴───────────┘

Clasificación:
🟢 90-100: Excelente (Proveedor Certificado)
🟡 70-89:  Bueno (Proveedor Aprobado)
🔴 <70:    Regular (Requiere supervisión)
```

#### Indicadores Automáticos
**Calculados desde órdenes de compra:**
```
Historial Últimos 12 Meses:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Órdenes de compra:        45
Monto total:              $12,450,000
Ticket promedio:          $276,667

Cumplimiento:
  Entregas a tiempo:      40/45 (88.9%) 🟢
  Entregas incompletas:   2/45 (4.4%)
  Devoluciones:           1/45 (2.2%)

Precio:
  Competitividad:         85/100
  Descuentos aplicados:   $124,500 (1.0%)

Calidad:
  Incidencias:            3 menores
  Reclamaciones:          0 mayores
  Certificaciones:        ISO 9001, ISO 14001
```

### 3.3 Solicitud de Cotizaciones

#### Creación de RFQ (Request for Quotation)
```
┌──────────────────────────────────────────────────────┐
│ SOLICITUD DE COTIZACIÓN #RFQ-2025-145               │
├──────────────────────────────────────────────────────┤
│ Proyecto: Fraccionamiento Los Pinos                  │
│ Solicitante: Ing. Pedro Ramírez (Residente)          │
│ Fecha solicitud: 15/Nov/2025                         │
│ Fecha límite cotización: 20/Nov/2025 17:00h         │
│                                                      │
│ Materiales Requeridos:                               │
│ ┌────────────────────────┬────────┬────────┬───────┐│
│ │ Material               │ Cant.  │ Unidad │ Req.  ││
│ ├────────────────────────┼────────┼────────┼───────┤│
│ │ Cemento CPC 30R        │ 120    │ ton    │ Urg.  ││
│ │ Grava 3/4"             │ 85     │ m³     │ Norm. ││
│ │ Arena                  │ 100    │ m³     │ Norm. ││
│ │ Varilla 3/8" fy=4200   │ 8,500  │ kg     │ Urg.  ││
│ └────────────────────────┴────────┴────────┴───────┘│
│                                                      │
│ Condiciones:                                         │
│ • Entrega en obra (Fracc. Los Pinos)                │
│ • Fecha entrega: 25/Nov/2025                         │
│ • Forma de pago: 30 días                             │
│ • Incluye descarga                                   │
│                                                      │
│ Proveedores invitados: [3 seleccionados]            │
│ ☑ Cemex                                              │
│ ☑ Cruz Azul                                          │
│ ☑ Materiales del Norte                              │
│                                                      │
│                    [Cancelar]  [Enviar Solicitud]    │
└──────────────────────────────────────────────────────┘
```

#### Envío Automático
- Email con PDF adjunto a 3 proveedores
- Portal web para captura de cotización
- Recordatorio automático 24h antes del cierre

### 3.4 Comparación de Cotizaciones

#### Matriz Comparativa
```
┌──────────────────────────────────────────────────────────────────────┐
│ COMPARACIÓN DE COTIZACIONES - RFQ-2025-145                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ Material: Cemento CPC 30R (120 ton)                                 │
│                                                                      │
│ ┌────────────┬──────────┬────────┬─────────┬──────────┬──────────┐ │
│ │ Proveedor  │ Precio/  │ Total  │ Entrega │ Pago     │ Calif.   │ │
│ │            │ ton      │        │         │          │          │ │
│ ├────────────┼──────────┼────────┼─────────┼──────────┼──────────┤ │
│ │ Cemex      │ $4,350 ⭐│ $522K  │ 25/Nov ✓│ 30 días  │ 87.5 🟢  │ │
│ │ Cruz Azul  │ $4,280 🏆│ $513.6K│ 27/Nov  │ 15 días  │ 82.0 🟡  │ │
│ │ Mat. Norte │ $4,450   │ $534K  │ 25/Nov ✓│ 30 días  │ 75.0 🟡  │ │
│ └────────────┴──────────┴────────┴─────────┴──────────┴──────────┘ │
│                                                                      │
│ Análisis Automático:                                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ 🏆 Mejor precio:     Cruz Azul (-$8,400 vs presupuesto)            │
│ ⭐ Recomendado:      Cemex (balance precio/servicio/calidad)        │
│ ⚠️ Más caro:         Mat. Norte (+$12,000 vs promedio)             │
│                                                                      │
│ Presupuesto partida: $4,300/ton × 120 = $516,000                   │
│ Mejor oferta ahorra: $2,400 (0.5%)                                 │
│                                                                      │
│                       [Rechazar Todas]  [Aprobar Cemex]             │
└──────────────────────────────────────────────────────────────────────┘
```

#### Criterios de Selección Automática
```python
def select_best_supplier(quotes, weights):
    scores = []
    for quote in quotes:
        price_score = 100 - ((quote.price - min_price) / min_price * 100)
        delivery_score = 100 if quote.delivery <= required_date else 50
        quality_score = quote.supplier.rating
        payment_score = 100 if quote.payment_terms >= 30 else 70

        total_score = (
            price_score * weights['price'] +
            delivery_score * weights['delivery'] +
            quality_score * weights['quality'] +
            payment_score * weights['payment']
        )
        scores.append((quote, total_score))

    return max(scores, key=lambda x: x[1])

# Pesos configurables por constructora
weights = {
    'price': 0.40,      # 40% peso del precio
    'delivery': 0.25,   # 25% cumplimiento entrega
    'quality': 0.25,    # 25% calificación proveedor
    'payment': 0.10     # 10% condiciones de pago
}
```

### 3.5 Certificación de Proveedores

#### Programa de Certificación
```
Requisitos para Certificación:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Calificación global ≥ 90 puntos
✓ Mínimo 20 OCs en últimos 12 meses
✓ 95% cumplimiento en entregas
✓ <2% devoluciones/reclamaciones
✓ Certificaciones ISO 9001 vigente
✓ Sin adeudos pendientes
✓ Inspección de planta aprobada

Beneficios Proveedor Certificado:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Badge "Proveedor Certificado"
⚡ Aprobación automática OCs <$50K
📈 Prioridad en RFQs
💰 Pago preferente (7-15 días)
🤝 Contratos marco anuales
```

### 3.6 Alertas y Notificaciones

**Configuración de Alertas:**
```
Alertas Automáticas:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Calificación proveedor cae <70
   → Notificar: Gerente de Compras
   → Acción: Revisar relación comercial

2. Precio cotización >10% presupuesto
   → Notificar: Director + Ing. Costos
   → Acción: Requiere aprobación especial

3. Proveedor sin compras en 6 meses
   → Notificar: Compras
   → Acción: Actualizar catálogo

4. RFQ sin respuesta 24h antes cierre
   → Notificar: Proveedor (recordatorio)

5. Proveedor con 3+ entregas tardías
   → Notificar: Director Proyectos
   → Acción: Evaluación de desempeño
```

---

## 4. Casos de Uso Principales

### CU-001: Registrar Nuevo Proveedor
**Actor:** Gerente de Compras
**Flujo:**
1. Accede a "Catálogo de Proveedores"
2. Clic "+ Nuevo Proveedor"
3. Completa formulario (3 pestañas):
   - Datos generales (RFC, razón social, giro)
   - Contactos (principal + alternos)
   - Información financiera
4. Selecciona categorías: Materiales > Cementantes
5. Define condiciones comerciales:
   - Crédito: 30 días
   - Descuento: 2% a 10 días
6. Sube documentos:
   - Constancia situación fiscal (PDF)
   - Carátula bancaria
   - Certificados (ISO, etc.)
7. Guarda proveedor
8. Status inicial: "En evaluación"

### CU-002: Solicitar Cotizaciones
**Actor:** Residente de Obra
**Flujo:**
1. Accede a proyecto "Fracc. Los Pinos"
2. Clic "Nueva Requisición"
3. Agrega 4 materiales desde catálogo
4. Sistema sugiere 3 proveedores automáticamente:
   - Basado en categoría material
   - Con mejores calificaciones
   - Con entregas en la zona
5. Ajusta proveedores manualmente (puede agregar/quitar)
6. Define condiciones:
   - Fecha entrega: 25/Nov
   - Lugar: Obra Los Pinos
   - Forma pago: 30 días
7. Envía RFQ
8. Sistema envía emails + crea portal para captura

### CU-003: Comparar y Aprobar Cotización
**Actor:** Gerente de Compras
**Flujo:**
1. Recibe notificación: "3 cotizaciones recibidas para RFQ-145"
2. Accede a comparación
3. Ve matriz con 3 proveedores
4. Sistema recomienda: Cemex (balance precio/calidad)
5. Revisa detalles:
   - Precio: $4,350/ton (vs presupuesto $4,300)
   - Desviación: +1.2% (dentro tolerancia 5%)
   - Calificación: 87.5 puntos (Excelente)
   - Entrega: A tiempo
6. Aprueba cotización Cemex
7. Sistema genera OC automáticamente
8. Notifica a residente: "OC-2025-00145 aprobada"

### CU-004: Evaluar Desempeño de Proveedor
**Actor:** Director de Proyectos
**Flujo:**
1. Accede a perfil proveedor "Aceros del Norte"
2. Ve indicadores últimos 12 meses:
   - 28 OCs, $8.5M total
   - Cumplimiento: 71.4% (20/28 a tiempo) 🟡
   - Calificación actual: 68 puntos 🔴
3. Genera reporte de incidencias:
   - 8 entregas tardías
   - 2 materiales rechazados
4. Convoca reunión con proveedor
5. Acuerda plan de mejora
6. Actualiza status: "En plan de mejora"
7. Programa revisión en 3 meses

---

## 5. Modelo de Datos Simplificado

```typescript
// Tabla: suppliers (Proveedores)
{
  id: UUID,
  constructoraId: UUID,

  // Identificación
  taxId: VARCHAR(13), // RFC
  legalName: VARCHAR(255),
  commercialName: VARCHAR(255),
  businessType: VARCHAR(100), // Giro

  // Categorías (array)
  categories: VARCHAR[], // ['materials', 'services', 'rental']

  // Contacto principal
  contactName: VARCHAR(255),
  contactPosition: VARCHAR(100),
  contactEmail: VARCHAR(255),
  contactPhone: VARCHAR(20),

  // Financiero
  paymentTermsDays: INTEGER DEFAULT 30,
  earlyPaymentDiscount: DECIMAL(5,2),
  requiresAdvance: BOOLEAN DEFAULT false,

  // Bancario
  bankName: VARCHAR(100),
  accountNumber: VARCHAR(20),
  clabe: VARCHAR(18),

  // Evaluación
  rating: DECIMAL(5,2) DEFAULT 0, // 0-100
  certificationStatus: ENUM('none', 'in_evaluation', 'certified'),

  // Auditoría
  status: ENUM('active', 'inactive', 'blocked'),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}

// Tabla: rfqs (Solicitudes de cotización)
{
  id: UUID,
  code: VARCHAR(20), // RFQ-2025-145
  projectId: UUID,
  requestedBy: UUID,

  // Fechas
  requestDate: DATE,
  quoteDueDate: TIMESTAMP,
  deliveryDate: DATE,

  // Items
  items: JSONB, // [{materialId, quantity, unit, urgency}]

  // Condiciones
  deliveryAddress: TEXT,
  paymentTerms: VARCHAR(50),
  includesUnloading: BOOLEAN,

  // Proveedores invitados
  invitedSuppliers: UUID[],

  status: ENUM('draft', 'sent', 'closed', 'cancelled'),
  createdAt: TIMESTAMP
}

// Tabla: quotes (Cotizaciones)
{
  id: UUID,
  rfqId: UUID,
  supplierId: UUID,

  items: JSONB, // [{materialId, unitPrice, total, leadTime}]
  totalAmount: DECIMAL(15,2),

  deliveryDate: DATE,
  paymentTerms: VARCHAR(50),
  validUntil: DATE,

  notes: TEXT,
  attachments: VARCHAR[],

  status: ENUM('pending', 'submitted', 'accepted', 'rejected'),
  submittedAt: TIMESTAMP
}

// Tabla: supplier_ratings (Evaluaciones)
{
  id: UUID,
  supplierId: UUID,
  evaluationPeriod: VARCHAR(7), // 2025-11

  priceScore: DECIMAL(5,2),
  qualityScore: DECIMAL(5,2),
  deliveryScore: DECIMAL(5,2),
  serviceScore: DECIMAL(5,2),
  paymentScore: DECIMAL(5,2),

  overallRating: DECIMAL(5,2),

  // Métricas calculadas
  totalOrders: INTEGER,
  totalAmount: DECIMAL(15,2),
  onTimeDeliveries: INTEGER,
  lateDeliveries: INTEGER,
  returns: INTEGER,

  createdAt: TIMESTAMP
}
```

---

## 6. Criterios de Aceptación

- [ ] CRUD completo de proveedores
- [ ] Catálogo con categorización
- [ ] Sistema de calificación automática (5 criterios)
- [ ] Solicitud de cotizaciones a múltiples proveedores
- [ ] Comparación automática con recomendación
- [ ] Certificación de proveedores (programa)
- [ ] Alertas configurables
- [ ] Historial completo de compras por proveedor
- [ ] Portal web para captura de cotizaciones
- [ ] Exportación de reportes

---

## 7. Métricas de Éxito

- **Ahorro:** 5-10% en costos de materiales
- **Eficiencia:** -60% tiempo proceso de cotización (2 días vs 5 días)
- **Calidad:** 80% de proveedores con calificación >80 puntos
- **Competitividad:** Mínimo 3 cotizaciones por RFQ

---

**Estado:** ✅ Ready for Development
