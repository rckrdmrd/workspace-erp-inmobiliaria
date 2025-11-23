# RF-EST-002: Estimaciones hacia Subcontratistas

**ID:** RF-EST-002  
**Módulo:** MAI-008  
**Prioridad:** Alta  
**Story Points:** 13 SP

---

## 📋 Descripción

Sistema para generar y gestionar estimaciones de pago a subcontratistas y proveedores basadas en avances físicos de subcontratos, con control de anticipos, retenciones y calendario de pagos.

---

## 🎯 Objetivos

1. Generar estimaciones desde avances de subcontratos verificados
2. Calcular automáticamente amortizaciones y retenciones según subcontrato
3. Workflow de autorización adaptado a subcontratistas
4. Control de calendario de pagos programados
5. Portal para que subcontratistas vean estatus

---

## 📐 Reglas de Negocio

### RN-SUB-001: Cálculo de Monto Bruto

```typescript
// Por porcentaje de avance
monto_bruto = monto_subcontrato × (porcentaje_avance / 100)

// O por partidas
monto_bruto = Σ(partidas_ejecutadas × precio_unitario)
```

**Validaciones:**
- Avance físico verificado por residente
- No exceder monto total del subcontrato
- Validar contra calendario de obra pactado

### RN-SUB-002: Amortización de Anticipo

```typescript
// Típico: Anticipo 10-20%
anticipo_inicial = monto_subcontrato × (porcentaje_anticipo / 100)

// Amortización proporcional al avance
amortizacion = min(
  saldo_anticipo,
  (porcentaje_avance / 100) × anticipo_inicial
)
```

**Ejemplo:**
- Subcontrato plomería: $2,000,000
- Anticipo 10%: $200,000
- Avance 30%: Amortiza 30% × $200,000 = $60,000

### RN-SUB-003: Retenciones

```typescript
base_retenciones = monto_bruto - amortizacion

retenciones = {
  fondo_garantia: base_retenciones × 0.10,  // 10% típico
  fianza_cumplimiento: base_retenciones × (tasa_fianza / 100) || 0,
  otras: monto_especificado || 0
}

total_retenciones = Σ(retenciones)
```

**Reglas:**
- Retención típica: 10% (más alta que a cliente)
- Se liberan al finiquitar y cumplir garantías
- Retención máxima: Configurable por subcontrato

### RN-SUB-004: Numeración

```
EST-[PROYECTO]-[SUBCONTRATO]-[AÑO]-[CONSECUTIVO]

Ejemplo:
- EST-PRJ001-SUB-PLOM-2025-001
- EST-PRJ001-SUB-PLOM-2025-002
```

### RN-SUB-005: Calendario de Pagos

```typescript
// Fecha programada según términos
fecha_pago_programada = fecha_autorizacion + dias_pago_contrato

// Ejemplo: Pago a 30 días
fecha_autorizacion = 2025-11-20
fecha_pago_programada = 2025-12-20
```

**Alertas:**
- 5 días antes: Alerta a finanzas
- Día de vencimiento: Notificación urgente
- Pasado vencimiento: Alerta a director + subcontratista

---

## 🏛️ Estructura de Datos

### Estimación a Subcontratista

```typescript
interface EstimacionSubcontratista {
  id: string;
  numero: string;
  
  // Relaciones
  proyectoId: string;
  subcontratoId: string;
  subcontratistaId: string;
  
  // Periodo y avance
  periodoInicio: Date;
  periodoFin: Date;
  numeroEstimacion: number;
  porcentajeAvanceFisico: number;
  porcentajeAvanceAcumulado: number;
  
  // Montos
  montoBruto: number;
  amortizacionAnticipo: number;
  totalRetenciones: number;
  montoNeto: number;
  
  // Retenciones específicas
  retencionFondoGarantia: number;
  retencionFianza: number;
  
  // Estado y pagos
  status: EstimationStatus;
  fechaProgramadaPago: Date;
  fechaPagoReal: Date;
  referenciaPago: string;
  
  // Workflow
  verificadoPorResidente: boolean;
  verificadorId: string;
  autorizadoPorFinanzas: boolean;
  autorizadorId: string;
  
  observaciones: string;
  documentos: string[];
}
```

---

## 🔄 Estados del Workflow

```
Borrador → Enviada por Subcontratista
  → Verificada por Residente
  → Revisada por Ingeniero
  → Autorizada por Finanzas
  → Programada para Pago
  → Pagada
```

**Diferencias vs estimación a cliente:**
- Requiere verificación física por residente
- Finanzas programa fecha de pago
- Subcontratista puede ver estatus en portal

---

## 📊 Casos de Uso

### CU-001: Subcontratista Genera Estimación

**Actor:** Subcontratista (Usuario Externo)

**Flujo:**
1. Subcontratista accede a portal con credenciales
2. Selecciona su subcontrato activo
3. Indica avance físico alcanzado (%)
4. Carga evidencias (fotos, reportes)
5. Sistema calcula monto neto preliminar
6. Subcontratista envía a revisión
7. Sistema notifica a residente

### CU-002: Residente Verifica Avance

**Actor:** Residente de Obra

**Flujo:**
1. Residente recibe notificación de estimación pendiente
2. Accede a detalle de estimación
3. Revisa evidencias cargadas
4. Verifica avance físico en campo
5. Confirma o ajusta porcentaje de avance
6. Sistema recalcula montos si hubo ajuste
7. Residente autoriza y envía a ingeniero

### CU-003: Programar Pago

**Actor:** Finanzas

**Flujo:**
1. Finanzas revisa estimaciones autorizadas
2. Valida disponibilidad de flujo de caja
3. Programa fecha de pago
4. Sistema genera orden de pago
5. Registra en calendario de flujo de caja
6. Notifica a subcontratista fecha programada

---

## 🧮 Ejemplo Completo

### Contexto
- **Subcontrato:** Instalaciones eléctricas
- **Monto:** $3,000,000 MXN
- **Anticipo:** 15% = $450,000 (ya pagado)
- **Retención:** 10% fondo garantía
- **Plazo de pago:** 30 días

### Estimación 1 - Avance 25%

```
Monto bruto:
  $3,000,000 × 25% = $750,000

Amortización anticipo:
  25% × $450,000 = $112,500
  Saldo anticipo: $450,000 - $112,500 = $337,500

Base retenciones:
  $750,000 - $112,500 = $637,500

Retención 10%:
  $637,500 × 10% = $63,750
  Acumulado retenciones: $63,750

Monto neto a pagar:
  $750,000 - $112,500 - $63,750 = $573,750

Fecha autorización: 2025-11-20
Fecha programada pago: 2025-12-20 (30 días)
```

### Estimación 2 - Avance adicional 30% (55% acumulado)

```
Monto bruto nuevo trabajo:
  $3,000,000 × 30% = $900,000

Amortización:
  30% × $450,000 = $135,000
  Saldo anticipo: $337,500 - $135,000 = $202,500

Base retenciones:
  $900,000 - $135,000 = $765,000

Retención 10%:
  $765,000 × 10% = $76,500
  Acumulado retenciones: $63,750 + $76,500 = $140,250

Monto neto:
  $900,000 - $135,000 - $76,500 = $688,500
```

---

## ✅ Criterios de Aceptación

1. **Portal de subcontratistas:**
   - Pueden ver sus subcontratos activos
   - Generar estimaciones
   - Ver estatus en tiempo real
   - Descargar documentos

2. **Verificación física:**
   - Residente debe aprobar avance antes de pago
   - Sistema bloquea pago sin verificación

3. **Calendario de pagos:**
   - Fecha programada calculada automáticamente
   - Alertas 5 días antes
   - Dashboard de pagos comprometidos

4. **Retenciones acumuladas:**
   - Por subcontrato, ver total retenido
   - Proyección de liberación
   - Reporte de retenciones

5. **Trazabilidad:**
   - Evidencias fotográficas vinculadas
   - Historial de ajustes de avance
   - Registro de verificaciones

---

## 🔗 Referencias

- [ET-EST-001: Modelo de datos](../especificaciones/ET-EST-001-modelo-datos.md)
- [US-EST-002: Crear estimación a subcontratista](../historias-usuario/US-EST-002-crear-estimacion-subcontratista.md)

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
