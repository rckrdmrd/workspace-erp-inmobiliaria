# RF-EST-004: Generación de Documentos y Reportes

**ID:** RF-EST-004  
**Módulo:** MAI-008  
**Prioridad:** Alta  
**Story Points:** 5 SP

---

## 📋 Descripción

Sistema para generar documentos oficiales de estimaciones en formatos estándar (PDF, Excel) con layouts configurables según requerimientos del cliente y exportación de datos para análisis.

---

## 🎯 Objetivos

1. Generar PDFs de estimaciones con formato oficial
2. Exportar a Excel con fórmulas y formato
3. Templates configurables por cliente/proyecto
4. Anexos y documentos soporte
5. Firma digital y trazabilidad

---

## 📐 Formatos de Documentos

### PDF - Estimación Oficial

**Estructura estándar:**

```
┌─────────────────────────────────────────┐
│ ESTIMACIÓN DE OBRA No. EST-PRJ001-001  │
├─────────────────────────────────────────┤
│                                         │
│ DATOS GENERALES                         │
│ Proyecto: Desarrollo Habitacional XYZ  │
│ Contrato: CONT-2025-001                 │
│ Cliente: INFONAVIT Delegación Norte     │
│ Periodo: 01 Nov - 30 Nov 2025           │
│                                         │
│ RESUMEN FINANCIERO                      │
│ Monto Bruto:           $12,500,000.00   │
│ (-) Amortización:      $ 2,500,000.00   │
│ (-) Retenciones:       $   500,000.00   │
│ ────────────────────────────────────    │
│ Monto Neto:            $ 9,500,000.00   │
│                                         │
│ DETALLE DE CONCEPTOS                    │
│ No. │ Concepto │ Cant. │ P.U. │ Importe│
│  1  │ Vivienda │  25   │ 500K │ 12.5M  │
│     │ Tipo A   │       │      │        │
│                                         │
│ AMORTIZACIONES                          │
│ Anticipo inicial: $10,000,000           │
│ Amortizado anterior: $0                 │
│ Amortización actual: $2,500,000         │
│ Saldo pendiente: $7,500,000             │
│                                         │
│ RETENCIONES                             │
│ Fondo garantía 5%: $500,000             │
│ ISR: $0                                 │
│ Total retenido: $500,000                │
│                                         │
│ FIRMAS                                  │
│ _____________    _____________          │
│ Ingeniero        Director                │
│                                         │
│ Generado: 2025-11-20 14:35:22           │
│ Usuario: Juan Pérez                     │
└─────────────────────────────────────────┘
```

**Variantes:**
- **INFONAVIT:** Logo oficial, formato específico
- **Gobierno:** Carátula con sellos oficiales
- **Privado:** Formato empresarial

### Excel - Exportación Detallada

**Hojas:**
1. **Resumen:** Datos generales y totales
2. **Detalle:** Partidas con fórmulas
3. **Amortizaciones:** Tracking de anticipo
4. **Retenciones:** Desglose y acumulados
5. **Números Generadores:** Cantidades y memorias de cálculo

**Fórmulas activas:**
```excel
=SUMA(D2:D100)  // Totales
=D2*E2          // Importes
=IF(F2>0, F2*0.05, 0)  // Retenciones
```

### XML - Factura Electrónica (CFDI)

**Para integración con SAT:**
```xml
<cfdi:Comprobante>
  <cfdi:Emisor>...</cfdi:Emisor>
  <cfdi:Receptor>...</cfdi:Receptor>
  <cfdi:Conceptos>
    <cfdi:Concepto 
      ClaveProdServ="71101600"
      Cantidad="25"
      Descripcion="Vivienda Tipo A"
      ValorUnitario="500000"
      Importe="12500000">
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos>...</cfdi:Impuestos>
</cfdi:Comprobante>
```

---

## 🛠️ Generación de Reportes

### Reporte Consolidado de Estimaciones

**Filtros:**
- Proyecto / Múltiples proyectos
- Rango de fechas
- Estado (autorizadas, pagadas, pendientes)
- Cliente / Subcontratista

**Contenido:**
| Estimación | Fecha | Proyecto | Tipo | Monto Neto | Estado |
|------------|-------|----------|------|------------|--------|
| EST-001 | 2025-11 | PRJ-001 | Cliente | $9.5M | Pagada |
| EST-002 | 2025-11 | PRJ-001 | Sub-PLOM | $573K | Autorizada |

**Gráficos:**
- Estimaciones por mes (barras)
- Distribución cliente vs subcontratistas (pie)
- Flujo de caja proyectado (línea)

### Reporte de Antigüedad de Estimaciones

**Por cobrar (a cliente):**
```
0-30 días:   $15,000,000
31-60 días:  $ 8,000,000
61-90 días:  $ 2,000,000
>90 días:    $   500,000 ⚠️ Crítico
```

**Por pagar (a subcontratistas):**
```
Vencidas:    $ 1,200,000 🚨 Urgente
Esta semana: $ 3,500,000
Próximas 2 semanas: $ 5,000,000
```

### Análisis de Rentabilidad por Proyecto

```typescript
analisis = {
  proyecto: "PRJ-001",
  monto_contrato: $50,000,000,
  estimado_cliente: $35,000,000,
  pagado_subcontratistas: $22,000,000,
  margen_actual: $13,000,000,
  porcentaje_margen: 37.1%,
  proyeccion_final: {
    estimado_total: $50,000,000,
    costo_total: $34,000,000,
    margen_estimado: $16,000,000,
    porcentaje: 32%
  }
}
```

---

## 📊 Templates Configurables

### Configuración por Cliente

```typescript
interface ReportTemplate {
  clienteId: string;
  nombre: string;
  formato: 'pdf' | 'excel' | 'xml';
  
  // PDF
  logo: string;
  encabezado: string;
  piedePagina: string;
  colores: { primario: string; secundario: string };
  fuentes: { titulo: string; cuerpo: string };
  
  // Estructura
  mostrarNumGeneradores: boolean;
  mostrarAmortizaciones: boolean;
  mostrarRetenciones: boolean;
  mostrarFirmas: boolean;
  
  // Excel
  formatoTablas: string;
  incluirFormulas: boolean;
  hojas: string[];
}
```

**Ejemplos:**
- **INFONAVIT:** Logo oficial, formato 2 columnas, firmas digitales
- **Gobierno Estatal:** Carátula con escudo, tabla detallada, anexos obligatorios
- **Cliente Privado:** Formato ejecutivo, resumen en primera página

---

## 🔒 Firma Digital y Trazabilidad

### Firma Electrónica

```typescript
interface FirmaDocumento {
  documentoId: string;
  tipo: 'pdf' | 'xml';
  
  firmantes: {
    usuarioId: string;
    rol: string;
    timestamp: Date;
    certificado: string;  // e.firma, certificado digital
    hash: string;  // SHA-256 del documento
  }[];
  
  validacion: {
    integro: boolean;
    firmantes_validos: boolean;
    fecha_firma: Date;
  };
}
```

**Proceso:**
1. Sistema genera PDF
2. Ingeniero firma digitalmente
3. Director firma (si >$100K)
4. Sistema sella con timestamp
5. Hash almacenado para verificación

### Trazabilidad de Documentos

**Log de generación:**
```typescript
{
  documentoId: "DOC-EST-001-PDF-20251120",
  estimacionId: "EST-001",
  formato: "pdf",
  template: "INFONAVIT-oficial",
  generadoPor: "juan.perez",
  timestamp: "2025-11-20T14:35:22Z",
  version: 2,
  cambios: "Corrección monto retención",
  hashSHA256: "a1b2c3d4...",
  firmado: true
}
```

---

## ✅ Criterios de Aceptación

1. **Generación de PDFs:**
   - < 5 segundos para estimación con 100 partidas
   - Layout ajustado a template configurado
   - Logos e imágenes en alta calidad

2. **Exportación a Excel:**
   - Fórmulas funcionales
   - Formato con colores y bordes
   - Hojas organizadas

3. **Templates:**
   - Admin puede crear/editar templates
   - Asociar template a cliente/proyecto
   - Preview antes de generar

4. **Firma digital:**
   - Soporta e.firma (SAT)
   - Validación de integridad
   - Timestamp confiable

5. **Reportes:**
   - Filtros dinámicos
   - Exportación a PDF/Excel/CSV
   - Gráficos interactivos

---

## 🔗 Referencias

- [ET-EST-004: Generación de reportes](../especificaciones/ET-EST-004-generacion-reportes.md)
- [US-EST-005: Generar PDF](../historias-usuario/US-EST-005-generar-pdf.md)

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
