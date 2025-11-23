# ET-AST-003: Motor de Mantenimiento

**ID:** ET-AST-003 | **Módulo:** MAE-015

## Maintenance Service
```typescript
@Injectable()
export class MaintenanceService {
  async schedulePreventive(assetId: string): Promise<MaintenanceSchedule[]> {
    const asset = await this.assetService.findOne(assetId);
    const template = await this.getMaintenanceTemplate(asset.type);
    
    const schedules = template.intervals.map(interval => ({
      assetId,
      type: 'preventive',
      scheduledDate: this.calculateNextDate(interval),
      checklist: template.checklist
    }));
    
    return this.scheduleRepo.save(schedules);
  }

  @Cron('0 8 * * *') // Daily at 8am
  async sendMaintenanceAlerts(): Promise<void> {
    const upcoming = await this.scheduleRepo.findUpcoming(30);
    
    for (const schedule of upcoming) {
      const daysUntil = this.getDaysUntil(schedule.scheduledDate);
      if ([30, 15, 7].includes(daysUntil)) {
        await this.notificationService.send({
          to: schedule.asset.responsibleEmail,
          subject: `Mantenimiento próximo: ${schedule.asset.name}`,
          template: 'maintenance_alert'
        });
      }
    }
  }
}
```

---
**Generado:** 2025-11-21
