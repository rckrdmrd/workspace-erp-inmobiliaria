# ET-FIN-005: Dashboard de Control de Gestión

**ID:** ET-FIN-005 | **Módulo:** MAE-014

## Controlling Dashboard Service
```typescript
@Injectable()
export class ControllingService {
  async getDashboard(projectId?: string): Promise<ControllingDashboard> {
    const scope = projectId ? { projectId } : {};
    
    return {
      kpis: await this.calculateKPIs(scope),
      cashFlow: await this.cashFlowService.getSummary(scope),
      budgetVsActual: await this.getBudgetComparison(scope),
      alerts: await this.getActiveAlerts(scope)
    };
  }

  private async calculateKPIs(scope: Scope): Promise<KPIs> {
    const receivables = await this.receivableRepo.find(scope);
    const payables = await this.payableRepo.find(scope);
    
    return {
      dso: this.calculateDSO(receivables), // Days Sales Outstanding
      dpo: this.calculateDPO(payables),     // Days Payable Outstanding
      liquidityRatio: await this.getLiquidityRatio(scope),
      profitMargin: await this.getProfitMargin(scope)
    };
  }
}
```

---
**Generado:** 2025-11-21
