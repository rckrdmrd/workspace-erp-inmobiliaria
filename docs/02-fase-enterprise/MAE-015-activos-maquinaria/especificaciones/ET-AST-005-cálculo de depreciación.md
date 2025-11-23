# ET-AST-005: Cálculo de Depreciación

**ID:** ET-AST-005 | **Módulo:** MAE-015

## Depreciation Service
```typescript
@Injectable()
export class DepreciationService {
  @Cron('0 2 1 * *') // 1st day of month at 2am
  async calculateMonthlyDepreciation(): Promise<void> {
    const assets = await this.assetRepo.findActive();
    
    for (const asset of assets) {
      const monthlyDep = this.calculateMonthly(asset);
      
      await this.depreciationRepo.save({
        assetId: asset.id,
        month: new Date(),
        amount: monthlyDep,
        method: asset.depreciationMethod
      });
      
      asset.currentBookValue -= monthlyDep;
      await this.assetRepo.save(asset);
    }
  }

  private calculateMonthly(asset: Asset): number {
    switch (asset.depreciationMethod) {
      case 'straight_line':
        return asset.acquisitionCost / (asset.usefulLifeYears * 12);
      case 'accelerated':
        return this.calculateAccelerated(asset);
      case 'by_use':
        return this.calculateByUse(asset);
      default:
        return 0;
    }
  }
}
```

---
**Generado:** 2025-11-21
