# ET-PRE-003: Motor de Licitaciones

**ID:** ET-PRE-003 | **Módulo:** MAI-018

## Tender Service
```typescript
@Injectable()
export class TenderService {
  async createTender(dto: CreateTenderDto): Promise<Tender> {
    const numero = await this.generateTenderNumber(dto.type);
    const tender = await this.tenderRepo.save({ ...dto, numero, status: 'draft' });
    return tender;
  }

  async publish(tenderId: string): Promise<Tender> {
    const tender = await this.findOne(tenderId);
    this.validateTenderDates(tender);
    tender.status = 'published';
    await this.notifyVendors(tender);
    return this.tenderRepo.save(tender);
  }

  async receiveProposal(tenderId: string, dto: CreateProposalDto): Promise<Proposal> {
    const tender = await this.findOne(tenderId);
    if (tender.status !== 'receiving' && tender.status !== 'published') {
      throw new BadRequestException('Tender not accepting proposals');
    }
    if (new Date() > tender.fechaLimitePropuestas) {
      throw new BadRequestException('Deadline exceeded');
    }
    return this.proposalRepo.save({ tenderId, ...dto });
  }
}
```

---
**Generado:** 2025-11-20
