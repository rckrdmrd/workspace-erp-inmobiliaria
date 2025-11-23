# ET-CON-005: Generación de Documentos

**ID:** ET-CON-005 | **Módulo:** MAI-012

## Document Generation Service
```typescript
@Injectable()
export class ContractDocumentService {
  async generatePDF(contractId: string): Promise<Buffer> {
    const contract = await this.contractService.findOne(contractId);
    const html = await this.templateEngine.renderTemplate(contract.templateId, contract);
    
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});
    
    this.addLegalHeader(doc);
    this.addContractBody(doc, html);
    this.addSignatureSection(doc);
    doc.end();
    
    return Buffer.concat(chunks);
  }

  async generateAddendum(addendumId: string): Promise<Buffer> {
    const addendum = await this.addendumRepo.findOne(addendumId);
    // Similar PDF generation for addendums
  }
}
```

---
**Generado:** 2025-11-20
