# US-PROG-008: Generación de Reportes Oficiales

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 18
**Story Points:** 5
**Prioridad:** Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Director de Proyecto
**Quiero** generar reportes oficiales (INFONAVIT, cliente, inversionistas) con firma digital
**Para** entregar documentación formal del avance del proyecto con respaldo legal

---

## Criterios de Aceptación

### 1. Tipos de Reportes Disponibles ✅
- [ ] Puedo seleccionar entre diferentes tipos de reportes:
  - **Reporte INFONAVIT:** Formato oficial para organismos de vivienda
  - **Reporte Ejecutivo:** Resumen para dirección y accionistas
  - **Reporte de Calidad:** Checklists, NCs, inspecciones
  - **Reporte Financiero:** Avance financiero vs presupuesto
  - **Reporte de Productividad:** Análisis de cuadrillas y rendimientos
  - **Reporte Fotográfico:** Álbum de evidencias
  - **Reporte Personalizado:** Selecciono qué secciones incluir

### 2. Configuración del Reporte ✅
- [ ] Al crear un reporte, puedo especificar:
  - Tipo de reporte
  - Proyecto
  - Período: Del [01/Ene/2025] al [31/Ene/2025]
  - Formato: PDF, Excel, PowerPoint
  - Template a usar (si hay múltiples)
  - Secciones a incluir (checkboxes)
  - Logo/branding personalizado
- [ ] Puedo guardar configuraciones como templates personalizados
- [ ] Puedo programar generación automática (diaria, semanal, mensual)

### 3. Reporte INFONAVIT ✅
- [ ] El reporte incluye secciones obligatorias:
  - **Carátula:** Datos del proyecto, desarrolladora, INFONAVIT
  - **Resumen Ejecutivo:**
    - Avance físico global: 85%
    - Avance financiero: 82%
    - Viviendas terminadas: 42/50
    - Estado del proyecto: En tiempo / Retrasado / Adelantado
  - **Avance por Etapa:**
    - Tabla con % de avance por etapa constructiva:
      ```
      Cimentación:     100%  ✓
      Estructura:       95%  ✓
      Instalaciones:    80%  🟡
      Acabados:         45%  🔴
      ```
  - **Avance por Vivienda:**
    - Tabla detallada de cada unidad
    - Manzana, Lote, Tipo, % Avance, Status
  - **Curva S:**
    - Gráfica programado vs ejecutado
    - Con línea de baseline y actual
  - **Fotografías:**
    - Al menos 10 fotos representativas
    - Con pie de foto: fecha, ubicación, descripción
  - **Observaciones:**
    - Notas sobre avance, incidencias, cambios
- [ ] El PDF cumple con formato oficial INFONAVIT
- [ ] Incluye numeración de páginas y fecha de generación

### 4. Reporte Ejecutivo ✅
- [ ] Incluye secciones:
  - **Portada:** Logo, nombre del proyecto, período
  - **KPIs Principales:**
    - Gráficas visuales de SPI, CPI
    - Semáforos indicando estado
  - **Avance Físico y Financiero:**
    - Gráficas de barras comparativas
    - Tablas de datos
  - **Alertas y Riesgos:**
    - Lista de alertas críticas
    - Acciones tomadas
  - **Proyecciones:**
    - Fecha estimada de término
    - Costo proyectado al cierre
  - **Próximos Hitos:**
    - Calendario de hitos importantes
- [ ] Diseño profesional con gráficas de alta calidad
- [ ] Máximo 5-10 páginas (ejecutivo)

### 5. Reporte de Calidad ✅
- [ ] Incluye:
  - Resumen de checklists realizados
  - % de cumplimiento global
  - Detalle de no conformidades:
    - Abiertas vs cerradas
    - Por severidad
    - Por responsable
  - Gráfica de tendencia de calidad
  - Fotos de inspecciones
  - Tabla de acciones correctivas
- [ ] Anexa PDFs de checklists individuales

### 6. Firma Digital ✅
- [ ] Puedo firmar el reporte digitalmente antes de enviar
- [ ] La firma incluye:
  - Imagen de la firma (capturada con mouse/touch)
  - Nombre completo
  - Puesto
  - Fecha y hora exacta de firma
  - Hash del documento (para verificar que no ha sido modificado)
- [ ] El PDF muestra "FIRMADO DIGITALMENTE" con datos del firmante
- [ ] Puedo requerir múltiples firmas:
  - Director de Proyecto
  - Superintendente
  - Cliente
- [ ] El documento se bloquea después de la firma (no editable)

### 7. Generación y Almacenamiento ✅
- [ ] Al generar el reporte:
  - Se crea un registro en la base de datos
  - Se genera código único: RPT-2025-00001
  - Se ejecuta la generación (puede tomar 10-30 segundos)
  - Se sube a storage (S3, Google Cloud)
  - Se guarda la ruta del archivo
- [ ] Veo progreso: "Generando reporte... 45%"
- [ ] Cuando termina, puedo:
  - Descargar inmediatamente
  - Enviar por email
  - Compartir link temporal (24 horas)

### 8. Envío Automático ✅
- [ ] Puedo configurar envío automático de reportes:
  - Frecuencia: Diario, Semanal (lunes), Mensual (día 1)
  - Destinatarios: Lista de emails
  - Tipo de reporte
  - Incluir como adjunto o link de descarga
- [ ] El sistema envía automáticamente según programación
- [ ] Recibo notificación de envío exitoso/fallido

### 9. Historial de Reportes ✅
- [ ] Puedo ver historial de todos los reportes generados:
  - Código
  - Tipo
  - Fecha de generación
  - Generado por
  - Período cubierto
  - Estado: Generado, Firmado, Enviado
  - Destinatarios (si fue enviado)
- [ ] Puedo descargar reportes anteriores
- [ ] Puedo ver quién descargó cada reporte y cuándo

### 10. Exportación a Excel ✅
- [ ] Para reportes de datos (no ejecutivos), puedo exportar a Excel
- [ ] El Excel incluye:
  - Múltiples hojas: KPIs, Avances, Costos, Cronograma
  - Tablas con formato
  - Gráficas incrustadas
  - Filtros y ordenamiento habilitado
- [ ] Compatible con Excel 2016+

---

## Mockup / Wireframe

```
Generador de Reportes:
┌──────────────────────────────────────────────────────────────┐
│ 📄 Generar Reporte                                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─ Tipo de Reporte ─────────────────────────────────────┐    │
│ │ ⦿ Reporte INFONAVIT (Oficial)                         │    │
│ │ ○ Reporte Ejecutivo                                   │    │
│ │ ○ Reporte de Calidad                                  │    │
│ │ ○ Reporte Financiero                                  │    │
│ │ ○ Reporte Personalizado                               │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                               │
│ Proyecto:  [Fracc. Los Pinos ▼]                              │
│                                                               │
│ Período:                                                      │
│ Desde: [01/Ene/2025]   Hasta: [31/Ene/2025]                  │
│                                                               │
│ Formato:   ⦿ PDF   ○ Excel   ○ PowerPoint                    │
│                                                               │
│ ┌─ Secciones a Incluir ─────────────────────────────────┐    │
│ │ ☑ Carátula                                            │    │
│ │ ☑ Resumen Ejecutivo                                   │    │
│ │ ☑ Avance por Etapa                                    │    │
│ │ ☑ Avance por Vivienda                                 │    │
│ │ ☑ Curva S                                             │    │
│ │ ☑ Fotografías (10 más recientes)                      │    │
│ │ ☑ Observaciones                                       │    │
│ └────────────────────────────────────────────────────────┘    │
│                                                               │
│ Firma Digital:                                                │
│ ☑ Requiere firma antes de enviar                             │
│ Firmantes: [Juan Pérez - Director ▼] [+ Agregar]             │
│                                                               │
│ Envío:                                                        │
│ ☑ Enviar por email al generar                                │
│ Destinatarios: director@example.com, cliente@example.com     │
│                                                               │
│                          [Vista Previa]  [Generar Reporte]   │
└──────────────────────────────────────────────────────────────┘

Generando Reporte:
┌──────────────────────────────────────────────────────────────┐
│ Generando Reporte...                                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ ████████████████████████░░░░░░░░░░  65%                      │
│                                                               │
│ ✓ Recopilando datos del proyecto                             │
│ ✓ Calculando KPIs y métricas                                 │
│ ✓ Generando gráficas                                         │
│ ⌛ Procesando fotografías...                                  │
│ ○ Compilando PDF                                             │
│ ○ Aplicando firma digital                                    │
│                                                               │
│ Tiempo estimado: 15 segundos                                 │
└──────────────────────────────────────────────────────────────┘

Firma Digital:
┌──────────────────────────────────────────────────────────────┐
│ ✍️ Firmar Reporte                                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Documento: RPT-2025-00001 - Reporte INFONAVIT Enero 2025     │
│ Páginas: 25                                                   │
│ Hash: a3f5e8b2d1c4f7e9a0b3c6d8e1f4a7b9c2e5f8a1d4            │
│                                                               │
│ Por favor, firme abajo:                                       │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │                                                        │   │
│ │              [Área de Firma]                           │   │
│ │           Dibuje con mouse/dedo                        │   │
│ │                                                        │   │
│ │                  J. Pérez                              │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ Nombre: Juan Pérez                                            │
│ Puesto: Director de Proyecto                                 │
│ Fecha: 31/Enero/2025 18:30                                   │
│                                                               │
│                              [Limpiar]  [Firmar Documento]   │
└──────────────────────────────────────────────────────────────┘

Historial de Reportes:
┌──────────────────────────────────────────────────────────────┐
│ 📋 Historial de Reportes                                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Filtros: [Tipo ▼] [Proyecto ▼] [Mes ▼]  [Buscar...]         │
│                                                               │
│ Total: 45 reportes                          [+ Nuevo Reporte]│
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ RPT-2025-00015  │  31/Ene/25  │  INFONAVIT  │  Firmado │   │
│ │ Fracc. Los Pinos - Enero 2025                          │   │
│ │ Generado por: Juan Pérez                               │   │
│ │ Firmado por: Juan Pérez, María González                │   │
│ │ Enviado a: 3 destinatarios                             │   │
│ │                                                         │   │
│ │ [Descargar] [Reenviar] [Ver Detalle]                   │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ RPT-2025-00014  │  15/Ene/25  │  Ejecutivo  │  Enviado │   │
│ │ Fracc. Los Pinos - Quincenal                           │   │
│ │ Generado por: Juan Pérez                               │   │
│ │ Enviado a: 5 destinatarios                             │   │
│ │                                                         │   │
│ │ [Descargar] [Reenviar] [Ver Detalle]                   │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ ...más reportes...                                            │
└──────────────────────────────────────────────────────────────┘

PDF Generado (Vista Previa):
┌──────────────────────────────────────────────────────────┐
│                                                           │
│                     [LOGO INFONAVIT]                      │
│                                                           │
│           REPORTE DE AVANCE DE OBRA                       │
│           PROGRAMA DE VIVIENDA VERTICAL                   │
│                                                           │
│           Proyecto: Fracc. Los Pinos                      │
│           Desarrolladora: Constructora XYZ, S.A. de C.V.  │
│           Período: Enero 2025                             │
│                                                           │
│ ──────────────────────────────────────────────────────────│
│                                                           │
│ RESUMEN EJECUTIVO                                         │
│                                                           │
│ Avance Físico Global:      85%                            │
│ Avance Financiero:         82%                            │
│ Viviendas Terminadas:      42 de 50 (84%)                 │
│ Estado del Proyecto:       EN TIEMPO ✓                    │
│                                                           │
│ AVANCE POR ETAPA                                          │
│                                                           │
│ ┌────────────────┬──────────┬──────────┐                 │
│ │ Etapa          │ % Avance │ Status   │                 │
│ ├────────────────┼──────────┼──────────┤                 │
│ │ Cimentación    │   100%   │    ✓     │                 │
│ │ Estructura     │    95%   │    ✓     │                 │
│ │ Instalaciones  │    80%   │    🟡    │                 │
│ │ Acabados       │    45%   │    🔴    │                 │
│ └────────────────┴──────────┴──────────┘                 │
│                                                           │
│ ...                                                       │
│                                                           │
│ ──────────────────────────────────────────────────────────│
│                                                           │
│ FIRMADO DIGITALMENTE                                      │
│                                                           │
│ [Firma Digital]                                           │
│ Juan Pérez                                                │
│ Director de Proyecto                                      │
│ 31/Enero/2025 18:30                                       │
│ Hash: a3f5e8b2d1c4f7e9a0b3c6d8e1f4a7b9c2e5f8a1d4        │
│                                                           │
│ Página 1 de 25            Generado: 31/Ene/2025 18:30    │
└──────────────────────────────────────────────────────────┘
```

---

## Notas Técnicas

### Generación de PDF con PDFKit

```typescript
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

async generateINFONAVITReport(data: ReportData): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  // Portada
  doc.fontSize(24).text('REPORTE DE AVANCE DE OBRA', { align: 'center' });
  doc.fontSize(12).text(`Proyecto: ${data.projectName}`, { align: 'center' });

  // Resumen Ejecutivo
  doc.addPage();
  doc.fontSize(18).text('RESUMEN EJECUTIVO');
  doc.fontSize(12).text(`Avance Físico: ${data.physicalProgress}%`);

  // Curva S (image)
  if (data.sCurveImage) {
    doc.addPage();
    doc.image(data.sCurveImage, { width: 500 });
  }

  // Firma
  if (data.signature) {
    doc.addPage();
    doc.text('FIRMADO DIGITALMENTE');
    doc.image(data.signature.imageBase64, { width: 200 });
    doc.text(`${data.signature.name} - ${data.signature.position}`);
    doc.text(`Hash: ${data.documentHash}`);
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
```

### Exportación a Excel con ExcelJS

```typescript
import ExcelJS from 'exceljs';

async generateExcelReport(data: ReportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Hoja 1: KPIs
  const kpiSheet = workbook.addWorksheet('KPIs');
  kpiSheet.columns = [
    { header: 'Indicador', key: 'indicator', width: 30 },
    { header: 'Valor', key: 'value', width: 15 },
    { header: 'Meta', key: 'target', width: 15 },
  ];
  kpiSheet.addRow({ indicator: 'Avance Físico', value: data.physicalProgress, target: data.plannedProgress });

  // Hoja 2: Avances por Unidad
  const unitsSheet = workbook.addWorksheet('Avances');
  unitsSheet.columns = [
    { header: 'Lote', key: 'lot', width: 10 },
    { header: 'Manzana', key: 'block', width: 10 },
    { header: '% Avance', key: 'progress', width: 15 },
  ];
  data.units.forEach((unit) => unitsSheet.addRow(unit));

  return workbook.xlsx.writeBuffer();
}
```

---

## Endpoints Necesarios

```typescript
POST   /api/analytics/reports                  // Generar reporte
GET    /api/analytics/reports                  // Listar reportes
GET    /api/analytics/reports/:id              // Detalle de reporte
GET    /api/analytics/reports/:id/download     // Descargar
POST   /api/analytics/reports/:id/sign         // Firmar
POST   /api/analytics/reports/:id/send         // Enviar por email
POST   /api/analytics/reports/schedule         // Programar envío automático
```

---

## Definición de "Done"

- [x] Generación de PDF con PDFKit
- [x] Templates para INFONAVIT, Ejecutivo, Calidad
- [x] Firma digital con canvas
- [x] Exportación a Excel con ExcelJS
- [x] Almacenamiento en S3/Google Cloud
- [x] Envío automático por email
- [x] Historial de reportes
- [x] Programación de reportes recurrentes
- [x] Tests unitarios >80%
- [x] Aprobado por Product Owner

---

**Estimación:** 5 Story Points
**Dependencias:** US-PROG-007 (Dashboard)
**Fecha:** 2025-11-17
