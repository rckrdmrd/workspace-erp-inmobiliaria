# ET-HSE-003: Servicio de EPP

**ID:** ET-HSE-003 | **Módulo:** MAA-017

## EPP Service
```typescript
@Injectable()
export class EPPService {
  async assignToEmployee(
    eppId: string,
    employeeId: string,
    quantity: number
  ): Promise<EPPAssignment> {
    const epp = await this.eppRepo.findOne(eppId);
    
    if (epp.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    
    const assignment = await this.assignmentRepo.save({
      eppId,
      employeeId,
      quantity,
      assignedAt: new Date(),
      expiresAt: this.addDays(new Date(), epp.usefulLifeDays)
    });
    
    epp.stock -= quantity;
    await this.eppRepo.save(epp);
    
    return assignment;
  }

  @Cron('0 8 * * 1') // Monday 8am
  async checkExpirations(): Promise<void> {
    const expiring = await this.assignmentRepo.findExpiring(30);
    
    for (const assignment of expiring) {
      await this.notificationService.send({
        to: assignment.employee.email,
        subject: 'EPP próximo a vencer',
        template: 'epp_expiration',
        data: assignment
      });
    }
  }
}
```

---
**Generado:** 2025-11-21
