# ET-PRE-002: Servicio de Viabilidad

**ID:** ET-PRE-002 | **Módulo:** MAI-018

## Feasibility Service
```typescript
@Injectable()
export class FeasibilityService {
  async createStudy(projectId: string): Promise<FeasibilityStudy> {
    const project = await this.projectService.findOne(projectId);
    
    const marketAnalysis = await this.analyzeMarket(project.location);
    const technicalAnalysis = await this.analyzeTechnical(project);
    const financialAnalysis = await this.analyzeFinancial(project);
    
    const tir = this.calculateTIR(financialAnalysis);
    const vpn = this.calculateVPN(financialAnalysis);
    const roi = this.calculateROI(financialAnalysis);
    
    return this.studyRepo.save({
      projectId, marketAnalysis, technicalAnalysis, financialAnalysis,
      tir, vpn, roi, riskScore: this.calculateRiskScore(marketAnalysis, technicalAnalysis)
    });
  }

  private calculateTIR(data: FinancialAnalysis): number {
    // Internal Rate of Return calculation
    const cashFlows = data.projectedCashFlows;
    return this.irr(cashFlows);
  }
}
```

---
**Generado:** 2025-11-20
