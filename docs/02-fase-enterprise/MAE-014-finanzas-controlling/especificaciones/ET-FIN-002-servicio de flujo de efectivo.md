# ET-FIN-002: Servicio de Flujo de Efectivo

**ID:** ET-FIN-002 | **Módulo:** MAE-014

## Cash Flow Service
```typescript
@Injectable()
export class CashFlowService {
  async getProjection(projectId: string, months: number): Promise<CashFlowProjection> {
    const incomes = await this.getProjectedIncomes(projectId, months);
    const expenses = await this.getProjectedExpenses(projectId, months);
    
    return this.buildProjection(incomes, expenses, months);
  }

  async compareRealVsProjected(projectId: string, month: Date): Promise<Comparison> {
    const projected = await this.getMonthProjection(projectId, month);
    const actual = await this.getMonthActual(projectId, month);
    
    return {
      projected, actual,
      variance: actual.total - projected.total,
      variancePercent: ((actual.total - projected.total) / projected.total) * 100
    };
  }

  async checkLiquidityAlert(projectId: string): Promise<LiquidityAlert | null> {
    const balance = await this.getCurrentBalance(projectId);
    const avgDailyExpense = await this.getAvgDailyExpense(projectId);
    const coverageDays = balance / avgDailyExpense;
    
    if (coverageDays < 15) {
      return { level: 'critical', coverageDays, message: 'Liquidez crítica' };
    }
    return null;
  }
}
```

---
**Generado:** 2025-11-21
