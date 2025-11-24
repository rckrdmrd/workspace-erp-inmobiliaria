# ET-DOC-005: Workflow de Aprobación

**ID:** ET-DOC-005 | **Módulo:** MAE-016

## Approval Workflow Service
```typescript
@Injectable()
export class ApprovalWorkflowService {
  async initiateApproval(documentId: string, workflowId: string): Promise<void> {
    const workflow = await this.workflowRepo.findOne(workflowId);
    const document = await this.documentRepo.findOne(documentId);
    
    for (const step of workflow.steps) {
      await this.approvalRepo.save({
        documentId,
        approverRole: step.role,
        order: step.order,
        status: 'pending',
        deadline: this.addDays(new Date(), step.deadlineDays)
      });
    }
    
    await this.notifyNextApprover(documentId);
  }

  async approve(approvalId: string, userId: string, comments?: string): Promise<void> {
    const approval = await this.approvalRepo.findOne(approvalId);
    approval.status = 'approved';
    approval.approvedBy = userId;
    approval.approvedAt = new Date();
    approval.comments = comments;
    await this.approvalRepo.save(approval);
    
    const hasNext = await this.hasNextApprover(approval.documentId);
    
    if (hasNext) {
      await this.notifyNextApprover(approval.documentId);
    } else {
      await this.finalizeApproval(approval.documentId);
    }
  }
}
```

---
**Generado:** 2025-11-21
