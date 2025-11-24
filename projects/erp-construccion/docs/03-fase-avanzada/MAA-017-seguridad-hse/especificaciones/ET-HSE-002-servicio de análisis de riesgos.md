# ET-HSE-002: Servicio de Análisis de Riesgos

**ID:** ET-HSE-002 | **Módulo:** MAA-017

## Risk Analysis Service
```typescript
@Injectable()
export class RiskService {
  async createAnalysis(dto: CreateRiskAnalysisDto): Promise<RiskAnalysis> {
    const riskLevel = this.calculateRiskLevel(dto.probability, dto.severity);
    
    const analysis = await this.riskRepo.save({
      ...dto,
      riskLevel
    });
    
    if (riskLevel === 'intolerable' || riskLevel === 'important') {
      await this.notificationService.send({
        to: 'hse-manager@constructora.com',
        subject: 'Riesgo Alto Detectado',
        template: 'high_risk_alert',
        data: analysis
      });
    }
    
    return analysis;
  }

  private calculateRiskLevel(probability: number, severity: number): RiskLevel {
    const score = probability * severity;
    if (score <= 4) return 'trivial';
    if (score <= 8) return 'tolerable';
    if (score <= 12) return 'moderate';
    if (score <= 16) return 'important';
    return 'intolerable';
  }
}
```

---
**Generado:** 2025-11-21
