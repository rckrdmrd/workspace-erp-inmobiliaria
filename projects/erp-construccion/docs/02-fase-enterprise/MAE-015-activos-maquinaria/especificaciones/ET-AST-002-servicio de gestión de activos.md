# ET-AST-002: Servicio de Gestión de Activos

**ID:** ET-AST-002 | **Módulo:** MAE-015

## Asset Service
```typescript
@Injectable()
export class AssetService {
  async assignToProject(assetId: string, projectId: string): Promise<Assignment> {
    const asset = await this.findOne(assetId);
    if (asset.status !== 'available') {
      throw new BadRequestException('Asset not available');
    }
    
    asset.status = 'in_use';
    asset.currentLocation = projectId;
    await this.assetRepo.save(asset);
    
    return this.assignmentRepo.save({
      assetId, projectId, assignedAt: new Date()
    });
  }

  async returnFromProject(assignmentId: string, hoursUsed: number): Promise<void> {
    const assignment = await this.assignmentRepo.findOne(assignmentId);
    assignment.returnedAt = new Date();
    assignment.hoursUsed = hoursUsed;
    await this.assignmentRepo.save(assignment);
    
    const asset = await this.findOne(assignment.assetId);
    asset.status = 'available';
    await this.assetRepo.save(asset);
  }
}
```

---
**Generado:** 2025-11-21
