# ET-HSE-004: Motor de Inspecciones

**ID:** ET-HSE-004 | **Módulo:** MAA-017

## Inspection Service
```typescript
@Injectable()
export class InspectionService {
  async createInspection(projectId: string): Promise<SafetyInspection> {
    const template = await this.getChecklistTemplate('construction');
    
    return this.inspectionRepo.save({
      projectId,
      checklist: template,
      inspectedAt: new Date(),
      status: 'in_progress'
    });
  }

  async addFinding(
    inspectionId: string,
    finding: CreateFindingDto
  ): Promise<Finding> {
    const findingEntity = await this.findingRepo.save({
      inspectionId,
      description: finding.description,
      riskLevel: finding.riskLevel,
      photos: finding.photos
    });
    
    // Auto-create corrective action
    await this.correctiveActionRepo.save({
      findingId: findingEntity.id,
      description: finding.correctiveAction,
      responsibleId: finding.responsibleId,
      dueDate: this.addDays(new Date(), this.getDueDays(finding.riskLevel)),
      status: 'pending'
    });
    
    return findingEntity;
  }

  private getDueDays(riskLevel: RiskLevel): number {
    const days = { intolerable: 1, important: 3, moderate: 7, tolerable: 15, trivial: 30 };
    return days[riskLevel];
  }
}
```

---
**Generado:** 2025-11-21
