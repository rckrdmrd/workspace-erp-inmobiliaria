# ET-HSE-005: Métricas y KPIs HSE

**ID:** ET-HSE-005 | **Módulo:** MAA-017

## HSE Metrics Service
```typescript
@Injectable()
export class HSEMetricsService {
  async calculateTRIFR(projectId: string, year: number): Promise<number> {
    const incidents = await this.incidentRepo.find({
      where: { 
        projectId,
        type: In(['first_aid', 'medical_treatment', 'lost_time', 'fatality']),
        occurredAt: Between(
          new Date(`${year}-01-01`),
          new Date(`${year}-12-31`)
        )
      }
    });
    
    const totalHours = await this.getTotalWorkedHours(projectId, year);
    
    // TRIFR = (Total Recordable Injuries / Total Hours Worked) * 1,000,000
    return (incidents.length / totalHours) * 1000000;
  }

  async calculateLTIFR(projectId: string, year: number): Promise<number> {
    const lostTimeIncidents = await this.incidentRepo.count({
      where: {
        projectId,
        type: In(['lost_time', 'fatality']),
        occurredAt: Between(
          new Date(`${year}-01-01`),
          new Date(`${year}-12-31`)
        )
      }
    });
    
    const totalHours = await this.getTotalWorkedHours(projectId, year);
    
    // LTIFR = (Lost Time Injuries / Total Hours Worked) * 1,000,000
    return (lostTimeIncidents / totalHours) * 1000000;
  }

  async getDaysWithoutAccidents(projectId: string): Promise<number> {
    const lastAccident = await this.incidentRepo.findOne({
      where: { projectId, type: In(['lost_time', 'fatality']) },
      order: { occurredAt: 'DESC' }
    });
    
    if (!lastAccident) return 0;
    
    const now = new Date();
    const diffMs = now.getTime() - lastAccident.occurredAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
}
```

---
**Generado:** 2025-11-21
