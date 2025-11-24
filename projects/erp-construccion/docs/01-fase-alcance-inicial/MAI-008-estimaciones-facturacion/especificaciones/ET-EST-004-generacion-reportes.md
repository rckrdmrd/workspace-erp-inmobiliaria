# ET-EST-004: Generación de Reportes PDF/Excel

**ID:** ET-EST-004  
**Módulo:** MAI-008  
**Relacionado con:** RF-EST-004

---

## 🔧 Backend Service

### estimation-report.service.ts

```typescript
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

@Injectable()
export class EstimationReportService {
  
  async generatePDF(estimacionId: string, templateName: string): Promise<Buffer> {
    const estimation = await this.estimationsRepo.findOne(estimacionId, {
      relations: ['items', 'project', 'contract']
    });

    const template = await this.getTemplate(templateName);
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));

    // Header
    this.addHeader(doc, estimation, template);
    
    // Resumen financiero
    this.addFinancialSummary(doc, estimation);
    
    // Detalle de items
    this.addItemsTable(doc, estimation.items);
    
    // Amortizaciones y retenciones
    this.addAmortizacionesRetenciones(doc, estimation);
    
    // Firmas
    this.addSignatures(doc, estimation);

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async generateExcel(estimacionId: string): Promise<Buffer> {
    const estimation = await this.estimationsRepo.findOne(estimacionId, {
      relations: ['items']
    });

    const workbook = new ExcelJS.Workbook();
    
    // Hoja 1: Resumen
    const resumenSheet = workbook.addWorksheet('Resumen');
    this.populateResumenSheet(resumenSheet, estimation);
    
    // Hoja 2: Detalle
    const detalleSheet = workbook.addWorksheet('Detalle');
    this.populateDetalleSheet(detalleSheet, estimation.items);
    
    // Hoja 3: Amortizaciones
    const amortSheet = workbook.addWorksheet('Amortizaciones');
    await this.populateAmortizacionesSheet(amortSheet, estimation);

    return workbook.xlsx.writeBuffer();
  }

  private addHeader(doc: PDFDocument, estimation: Estimation, template: Template): void {
    // Logo
    if (template.logo) {
      doc.image(template.logo, 50, 50, { width: 100 });
    }

    doc.fontSize(18).text('ESTIMACIÓN DE OBRA', 200, 60);
    doc.fontSize(12).text(`No. ${estimation.numero}`, 200, 85);
    
    doc.fontSize(10).text(`Proyecto: ${estimation.project.nombre}`, 50, 120);
    doc.text(`Periodo: ${format(estimation.periodoInicio, 'dd/MM/yyyy')} - ${format(estimation.periodoFin, 'dd/MM/yyyy')}`, 50, 135);
  }

  private addFinancialSummary(doc: PDFDocument, estimation: Estimation): void {
    doc.moveDown(2);
    doc.fontSize(14).text('RESUMEN FINANCIERO', { underline: true });
    doc.moveDown();

    const formatMoney = (amount: number) => 
      new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
        .format(amount / 100);

    doc.fontSize(11);
    doc.text(`Monto Bruto:           ${formatMoney(estimation.montoBruto)}`, { indent: 20 });
    doc.text(`(-) Amortización:      ${formatMoney(estimation.amortizacionAnticipo)}`, { indent: 20 });
    doc.text(`(-) Retenciones:       ${formatMoney(estimation.totalRetenciones)}`, { indent: 20 });
    doc.moveTo(70, doc.y).lineTo(300, doc.y).stroke();
    doc.text(`Monto Neto:            ${formatMoney(estimation.montoNeto)}`, { indent: 20 });
  }

  private addItemsTable(doc: PDFDocument, items: EstimationItem[]): void {
    doc.moveDown(2);
    doc.fontSize(14).text('DETALLE DE CONCEPTOS', { underline: true });
    doc.moveDown();

    // Table headers
    const tableTop = doc.y;
    doc.fontSize(9);
    doc.text('No.', 50, tableTop);
    doc.text('Concepto', 80, tableTop);
    doc.text('Unidad', 300, tableTop);
    doc.text('Cantidad', 350, tableTop);
    doc.text('P.U.', 410, tableTop);
    doc.text('Importe', 480, tableTop);

    let y = tableTop + 20;
    items.forEach((item, index) => {
      doc.text(String(index + 1), 50, y);
      doc.text(item.descripcion.substring(0, 40), 80, y);
      doc.text(item.unidad, 300, y);
      doc.text(String(item.cantidadEstimadaActual), 350, y);
      doc.text(formatMoney(item.precioUnitario), 410, y);
      doc.text(formatMoney(item.importeActual), 480, y);
      y += 20;
    });
  }

  private populateDetalleSheet(sheet: ExcelJS.Worksheet, items: EstimationItem[]): void {
    sheet.columns = [
      { header: 'No.', key: 'numero', width: 5 },
      { header: 'Concepto', key: 'concepto', width: 50 },
      { header: 'Unidad', key: 'unidad', width: 10 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'P.U.', key: 'precioUnitario', width: 15 },
      { header: 'Importe', key: 'importe', width: 15 }
    ];

    items.forEach((item, index) => {
      sheet.addRow({
        numero: index + 1,
        concepto: item.descripcion,
        unidad: item.unidad,
        cantidad: item.cantidadEstimadaActual,
        precioUnitario: item.precioUnitario / 100,
        importe: { formula: `D${sheet.rowCount + 1}*E${sheet.rowCount + 1}` }
      });
    });

    // Formato
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
  }
}
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
