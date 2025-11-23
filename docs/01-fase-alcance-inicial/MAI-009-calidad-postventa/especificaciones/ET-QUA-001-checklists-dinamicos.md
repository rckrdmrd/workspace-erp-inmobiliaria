# ET-QUA-001: Checklists Dinámicos

**ID:** ET-QUA-001 | **Módulo:** MAI-009

## Schema

```sql
CREATE TABLE quality.checklists (
  id UUID PRIMARY KEY,
  nombre VARCHAR(200),
  etapa VARCHAR(50), -- 'cimentacion', 'estructura', 'acabados'
  es_activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE quality.checklist_items (
  id UUID PRIMARY KEY,
  checklist_id UUID REFERENCES quality.checklists(id),
  categoria VARCHAR(100),
  descripcion TEXT,
  orden INT,
  es_critico BOOLEAN DEFAULT FALSE
);

CREATE TABLE quality.inspections (
  id UUID PRIMARY KEY,
  checklist_id UUID,
  housing_id UUID,
  inspector_id UUID,
  status VARCHAR(20) DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE quality.inspection_results (
  id UUID PRIMARY KEY,
  inspection_id UUID,
  item_id UUID,
  result VARCHAR(10), -- 'ok', 'nc'
  nc_severity VARCHAR(20),
  photo_url TEXT,
  notes TEXT
);
```

## Backend Service

```typescript
@Injectable()
export class InspectionService {
  async createInspection(housingId: string, checklistId: string): Promise<Inspection> {
    const checklist = await this.checklistsRepo.findOne(checklistId, { relations: ['items'] });
    const inspection = this.inspectionsRepo.create({ housingId, checklistId, status: 'in_progress' });
    return this.inspectionsRepo.save(inspection);
  }

  async recordResult(inspectionId: string, itemId: string, result: 'ok' | 'nc', data: any): Promise<void> {
    const inspectionResult = this.resultsRepo.create({ inspectionId, itemId, result, ...data });
    await this.resultsRepo.save(inspectionResult);
    
    // Si es NC, generar no conformidad automáticamente
    if (result === 'nc') {
      await this.ncService.createFromInspection(inspectionId, itemId, data);
    }
  }

  async completeInspection(inspectionId: string): Promise<{ approved: boolean; reason?: string }> {
    const results = await this.resultsRepo.find({ where: { inspectionId } });
    const criticalNCs = results.filter(r => r.result === 'nc' && r.ncSeverity === 'critical');
    
    const approved = criticalNCs.length === 0;
    
    await this.inspectionsRepo.update(inspectionId, {
      status: approved ? 'approved' : 'rejected',
      completedAt: new Date()
    });
    
    return { approved, reason: criticalNCs.length > 0 ? 'NC críticas detectadas' : undefined };
  }
}
```

---
**Generado:** 2025-11-20
