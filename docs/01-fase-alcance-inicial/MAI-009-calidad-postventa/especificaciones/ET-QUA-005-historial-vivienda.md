# ET-QUA-005: Historial Integrado de Vivienda

**ID:** ET-QUA-005 | **Módulo:** MAI-009

## Schema

```sql
CREATE TABLE quality.housing_history (
  id UUID PRIMARY KEY,
  housing_id UUID,
  event_type VARCHAR(50), -- 'inspection', 'nc', 'ticket', 'delivery'
  event_date TIMESTAMPTZ,
  title VARCHAR(200),
  description TEXT,
  severity VARCHAR(20),
  status VARCHAR(50),
  photos TEXT[],
  responsible_user UUID,
  metadata JSONB
);

CREATE INDEX idx_housing_history_housing ON quality.housing_history(housing_id, event_date DESC);
```

## Backend Service

```typescript
@Injectable()
export class HousingHistoryService {
  async getTimeline(housingId: string, filters?: TimelineFilters): Promise<TimelineEvent[]> {
    const qb = this.historyRepo.createQueryBuilder('h')
      .where('h.housing_id = :housingId', { housingId })
      .orderBy('h.event_date', 'DESC');
    
    if (filters?.eventType) qb.andWhere('h.event_type = :type', { type: filters.eventType });
    if (filters?.startDate) qb.andWhere('h.event_date >= :start', { start: filters.startDate });
    
    return qb.getMany();
  }

  async exportPDF(housingId: string): Promise<Buffer> {
    const timeline = await this.getTimeline(housingId);
    const housing = await this.housingRepo.findOne(housingId);
    
    // Generar PDF con timeline completa
    return this.pdfService.generateHousingHistory({ housing, timeline });
  }
}
```

---
**Generado:** 2025-11-20
