# ET-FIN-004: Conciliación Bancaria

**ID:** ET-FIN-004 | **Módulo:** MAE-014

## Bank Reconciliation Service
```typescript
@Injectable()
export class BankReconciliationService {
  async importStatement(file: Buffer, format: 'csv' | 'ofx'): Promise<BankStatement[]> {
    const parser = format === 'csv' ? new CSVParser() : new OFXParser();
    const transactions = await parser.parse(file);
    
    return this.statementRepo.save(transactions.map(t => ({
      date: t.date,
      reference: t.reference,
      amount: t.amount,
      description: t.description,
      status: 'pending'
    })));
  }

  async autoMatch(statementId: string): Promise<MatchResult> {
    const statement = await this.statementRepo.findOne(statementId);
    
    // Buscar match por monto y referencia
    const candidates = await this.findCandidates(statement);
    
    if (candidates.length === 1 && this.isConfidentMatch(candidates[0], statement)) {
      await this.createMatch(statement.id, candidates[0].id);
      return { matched: true, transaction: candidates[0] };
    }
    
    return { matched: false, candidates };
  }
}
```

---
**Generado:** 2025-11-21
