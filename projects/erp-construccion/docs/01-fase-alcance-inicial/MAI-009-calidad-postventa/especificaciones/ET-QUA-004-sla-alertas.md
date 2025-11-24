# ET-QUA-004: SLA y Alertas

**ID:** ET-QUA-004 | **Módulo:** MAI-009

## Configuración SLA

```typescript
const slaConfig = {
  urgent: { hours: 24, warningAt: 50, criticalAt: 80 },
  high: { hours: 48, warningAt: 50, criticalAt: 80 },
  medium: { days: 7, warningAt: 50, criticalAt: 80 },
  low: { days: 15, warningAt: 50, criticalAt: 80 }
};

@Injectable()
export class SLAMonitorService {
  @Cron('0 */1 * * *')
  async monitorSLA(): Promise<void> {
    const activeTickets = await this.ticketsRepo.find({ where: { status: In(['created', 'assigned', 'in_progress']) } });
    
    for (const ticket of activeTickets) {
      const percentElapsed = this.calculatePercentElapsed(ticket);
      
      if (percentElapsed >= 80) {
        await this.sendCriticalAlert(ticket);
      } else if (percentElapsed >= 50) {
        await this.sendWarningAlert(ticket);
      }
    }
  }
}
```

---
**Generado:** 2025-11-20
