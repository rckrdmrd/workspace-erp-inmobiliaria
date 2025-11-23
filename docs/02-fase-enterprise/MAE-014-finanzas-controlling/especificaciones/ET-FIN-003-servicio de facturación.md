# ET-FIN-003: Servicio de Facturación

**ID:** ET-FIN-003 | **Módulo:** MAE-014

## Invoice Service
```typescript
@Injectable()
export class InvoiceService {
  async createFromEstimation(estimationId: string): Promise<Invoice> {
    const estimation = await this.estimationService.findOne(estimationId);
    
    const invoice = await this.invoiceRepo.save({
      projectId: estimation.projectId,
      clientId: estimation.clientId,
      amount: estimation.montoNeto,
      concept: `Estimación ${estimation.numero}`,
      dueDate: this.calculateDueDate(estimation)
    });
    
    await this.cfdiService.stamp(invoice); // Timbrado SAT
    return invoice;
  }

  async applyPayment(invoiceId: string, amount: number): Promise<void> {
    const invoice = await this.findOne(invoiceId);
    invoice.paidAmount += amount;
    invoice.status = invoice.paidAmount >= invoice.amount ? 'paid' : 'partial';
    await this.invoiceRepo.save(invoice);
  }
}
```

---
**Generado:** 2025-11-21
