# ET-CON-004: Workflow de Aprobación

**ID:** ET-CON-004 | **Módulo:** MAI-012

## Approval Workflow Service
```typescript
@Injectable()
export class ApprovalWorkflowService {
  async initiate(contractId: string): Promise<void> {
    const contract = await this.contractService.findOne(contractId);
    const levels = this.getApprovalLevels(contract.montoContratado);
    
    for (const level of levels) {
      await this.createApprovalStep(contractId, level);
    }
    
    await this.notifyNextApprover(contractId);
  }

  private getApprovalLevels(monto: number): ApprovalLevel[] {
    if (monto < 1000000) return ['legal', 'director'];
    if (monto < 5000000) return ['legal', 'direccion', 'ceo'];
    return ['legal', 'direccion', 'ceo', 'consejo'];
  }

  async approve(contractId: string, userId: string): Promise<void> {
    await this.markStepApproved(contractId, userId);
    const hasMoreSteps = await this.hasMoreSteps(contractId);
    
    if (hasMoreSteps) {
      await this.notifyNextApprover(contractId);
    } else {
      await this.contractService.activate(contractId);
    }
  }
}
```

---
**Generado:** 2025-11-20
