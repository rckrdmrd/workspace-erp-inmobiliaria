# ET-PRE-004: Evaluación de Propuestas

**ID:** ET-PRE-004 | **Módulo:** MAI-018

## Proposal Evaluation Service
```typescript
@Injectable()
export class ProposalEvaluationService {
  private readonly WEIGHTS = {
    precio: 0.40,
    calidad: 0.30,
    experiencia: 0.20,
    tiempo: 0.10
  };

  async evaluateProposals(tenderId: string): Promise<EvaluationResult[]> {
    const proposals = await this.proposalRepo.findByTender(tenderId);
    const tender = await this.tenderService.findOne(tenderId);
    
    const evaluated = proposals.map(p => this.evaluateSingle(p, tender, proposals));
    const sorted = evaluated.sort((a, b) => b.scoreTotal - a.scoreTotal);
    
    return sorted;
  }

  private evaluateSingle(proposal: Proposal, tender: Tender, all: Proposal[]): EvaluationResult {
    const minPrice = Math.min(...all.map(p => p.montoPropuesto));
    const scorePrecio = (minPrice / proposal.montoPropuesto) * 100;
    const scoreCalidad = proposal.scoreTecnico;
    const scoreExperiencia = await this.getVendorExperience(proposal.vendorId);
    const scoreTiempo = this.evaluateTime(proposal.plazoDias, tender.plazoMaximo);
    
    const scoreTotal = 
      scorePrecio * this.WEIGHTS.precio +
      scoreCalidad * this.WEIGHTS.calidad +
      scoreExperiencia * this.WEIGHTS.experiencia +
      scoreTiempo * this.WEIGHTS.tiempo;
    
    return { proposalId: proposal.id, scorePrecio, scoreCalidad, scoreExperiencia, scoreTiempo, scoreTotal };
  }

  async selectWinner(tenderId: string, proposalId: string): Promise<void> {
    await this.proposalRepo.update(proposalId, { status: 'winner' });
    await this.tenderRepo.update(tenderId, { status: 'awarded' });
    await this.notifyWinner(proposalId);
    await this.generateContract(proposalId);
  }
}
```

---
**Generado:** 2025-11-20
