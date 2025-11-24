# RF-EST-003: Control de Anticipos y Retenciones

**ID:** RF-EST-003  
**Módulo:** MAI-008  
**Prioridad:** Alta  
**Story Points:** 8 SP

---

## 📋 Descripción

Sistema centralizado para gestionar anticipos recibidos/otorgados, sus amortizaciones por estimación, y control de retenciones acumuladas con proyección de liberaciones.

---

## 🎯 Objetivos

1. Registrar anticipos recibidos de clientes y otorgados a subcontratistas
2. Calcular y aplicar amortizaciones automáticas por estimación
3. Control de saldos pendientes de amortizar
4. Gestión de retenciones acumuladas por tipo
5. Proyección y liberación de retenciones

---

## 📐 Reglas de Negocio

### Anticipos Recibidos (de Cliente)

**RN-ANT-001: Registro de Anticipo**
```typescript
interface AnticipoRecibido {
  contratoId: string;
  monto: number;
  porcentaje: number;  // % del contrato
  fechaRecepcion: Date;
  referenciaBancaria: string;
  
  // Amortización
  porcentajeAmortizacionPorEstimacion: number;  // 25% típico
  saldoPendiente: number;
  totalAmortizado: number;
}
```

**Cálculo:**
```typescript
anticipo = monto_contrato × (porcentaje_anticipo / 100)

// Por estimación:
amortizacion = (porcentaje_amortizacion / 100) × anticipo_inicial
saldo_pendiente = anticipo_inicial - Σ(amortizaciones)
```

**RN-ANT-002: Validaciones**
- Anticipo <= 30% del contrato (límite legal típico)
- Solo 1 anticipo activo por contrato
- Debe amortizarse antes de finiquito

### Anticipos Otorgados (a Subcontratista)

**RN-ANT-003: Anticipo a Subcontratista**
```typescript
interface AnticipoOtorgado {
  subcontratoId: string;
  monto: number;
  porcentaje: number;  // 10-20% típico
  fechaPago: Date;
  garantiaId: string;  // Fianza que respalda el anticipo
  
  amortizacionProporcional: boolean;  // true: por % avance
  saldoPendiente: number;
}
```

**Cálculo amortización proporcional:**
```typescript
// Si avance 30%:
amortizacion = (30 / 100) × anticipo_inicial
```

**RN-ANT-004: Garantías**
- Anticipo >10% requiere fianza/garantía
- Validar vigencia de garantía antes de pagar
- Liberar garantía al amorti zar 100%

### Retenciones

**RN-RET-001: Tipos de Retención**
```typescript
enum TipoRetencion {
  FONDO_GARANTIA = 'fondo_garantia',    // 5-10%
  FIANZA_CUMPLIMIENTO = 'fianza',       // 5%
  ISR = 'isr',                          // Variable
  IVA_RETENIDO = 'iva',                 // Casos específicos
  OTRA = 'other'
}
```

**RN-RET-002: Acumulación**
```typescript
interface RetencionAcumulada {
  contratoId: string;
  tipo: TipoRetencion;
  porcentaje: number;
  
  montoAcumulado: number;
  montoLiberado: number;
  saldoPendiente: number;
  
  fechaLiberacionEstimada: Date;
  condicionesLiberacion: string;
}
```

**RN-RET-003: Liberación de Retenciones**

Condiciones para liberar:
1. **Fondo de garantía:**
   - Obra 100% terminada
   - Periodo de garantía cumplido (1-2 años)
   - Sin pendientes de calidad

2. **Fianza cumplimiento:**
   - Contrato finiquitado
   - Sin adeudos ni reclamaciones

3. **ISR/IVA:**
   - Declaración fiscal presentada
   - Pago de impuestos demostrado

**Cálculo liberación:**
```typescript
// Liberación parcial proporcional
if (tipo === 'fondo_garantia' && tiempo_garantia >= meses_requeridos) {
  monto_a_liberar = saldo_pendiente × (porcentaje_liberacion / 100)
}

// Liberación total
if (condiciones_cumplidas) {
  monto_a_liberar = saldo_pendiente
}
```

---

## 📊 Dashboard de Anticipos y Retenciones

### Vista para Finanzas

**Anticipos Pendientes de Amortizar:**
| Contrato | Anticipo Inicial | Amortizado | Saldo | % Pendiente |
|----------|------------------|------------|-------|-------------|
| PRJ-001 | $10,000,000 | $6,000,000 | $4,000,000 | 40% |
| PRJ-002 | $5,000,000 | $5,000,000 | $0 | 0% |

**Retenciones Acumuladas:**
| Proyecto | Tipo | Acumulado | Fecha Est. Liberación |
|----------|------|-----------|----------------------|
| PRJ-001 | Fondo Garantía | $2,500,000 | 2026-12-31 |
| PRJ-001 | ISR | $150,000 | Al finiquito |

### Proyección de Flujo

```typescript
// Próxima estimación proyectada
estimacion_futura = {
  monto_bruto: $15,000,000,
  amortizacion_estimada: $2,000,000,
  retencion_estimada: $650,000,
  monto_neto_proyectado: $12,350,000,
  fecha_cobro_estimada: '2025-12-15'
}
```

---

## 🧮 Ejemplo Completo

### Contexto
- **Contrato:** $50M
- **Anticipo cliente:** 20% = $10M (recibido)
- **Amortización:** 25% por estimación

### Tracking de Anticipo

| Estimación | Monto Bruto | Amortización | Saldo Anticipo |
|------------|-------------|--------------|----------------|
| Inicial | - | - | $10,000,000 |
| EST-001 | $12,500,000 | $2,500,000 | $7,500,000 |
| EST-002 | $10,000,000 | $2,500,000 | $5,000,000 |
| EST-003 | $8,000,000 | $2,000,000 | $3,000,000 |
| EST-004 | $12,000,000 | $3,000,000 | $0 |

**Análisis:**
- Anticipo completamente amortizado en 4 estimaciones
- Liberación de garantía: Al completar anticipo

### Tracking de Retenciones

| Estimación | Base | Retención 5% | Acumulado |
|------------|------|--------------|-----------|
| EST-001 | $10,000,000 | $500,000 | $500,000 |
| EST-002 | $7,500,000 | $375,000 | $875,000 |
| EST-003 | $6,000,000 | $300,000 | $1,175,000 |
| Total acumulado al finiquito | | | $2,500,000 |

**Liberación:**
- Fecha estimada: 2027-01-01 (2 años garantía)
- Condición: Sin defectos de calidad

---

## ✅ Criterios de Aceptación

1. **Registro de anticipos:**
   - Captura monto, fecha, referencia bancaria
   - Validación porcentaje <= 30%
   - Solo 1 anticipo activo por contrato

2. **Amortizaciones automáticas:**
   - Se calculan por estimación
   - Actualizan saldo pendiente
   - Alertan cuando saldo = 0

3. **Control de retenciones:**
   - Acumulan por tipo
   - Proyectan fecha de liberación
   - Generan recordatorios

4. **Reportes:**
   - Estado de anticipos (amortizado vs pendiente)
   - Retenciones acumuladas
   - Proyección de liberaciones

5. **Alertas:**
   - Anticipo próximo a amortizarse 100%
   - Retenciones elegibles para liberación
   - Garantías próximas a vencer

---

## 🔗 Referencias

- [ET-EST-003: Sistema de anticipos y retenciones](../especificaciones/ET-EST-003-anticipos-retenciones.md)
- [US-EST-003: Aplicar anticipos y amortizaciones](../historias-usuario/US-EST-003-aplicar-anticipos.md)

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
