# ET-EST-005: Workflow de Estados

**ID:** ET-EST-005  
**Módulo:** MAI-008  
**Relacionado con:** RF-EST-005

---

## 🔧 Backend Service

### estimation-workflow.service.ts

```typescript
@Injectable()
export class EstimationWorkflowService {
  
  async transitionTo(
    estimacionId: string,
    newStatus: EstimationStatus,
    userId: string,
    comentario?: string
  ): Promise<Estimation> {
    const estimation = await this.estimationsRepo.findOne(estimacionId);
    const user = await this.usersRepo.findOne(userId);

    // Validar transición permitida
    this.validateTransition(estimation.status, newStatus, user.role);

    const previousStatus = estimation.status;
    estimation.status = newStatus;

    // Actualizar campos según estado
    switch (newStatus) {
      case EstimationStatus.SUBMITTED:
        estimation.submittedAt = new Date();
        estimation.submittedBy = userId;
        break;
      case EstimationStatus.REVIEWED:
        estimation.reviewedAt = new Date();
        estimation.reviewedBy = userId;
        break;
      case EstimationStatus.AUTHORIZED:
        estimation.authorizedAt = new Date();
        estimation.authorizedBy = userId;
        break;
      case EstimationStatus.PAID:
        estimation.paidAt = new Date();
        break;
    }

    await this.estimationsRepo.save(estimation);

    // Registrar en historial
    await this.recordWorkflowHistory(
      estimacionId,
      previousStatus,
      newStatus,
      userId,
      user.role,
      comentario
    );

    // Enviar notificaciones
    await this.sendWorkflowNotifications(estimation, newStatus);

    // Audit log
    await this.auditService.log({
      action: 'estimation_status_changed',
      entityId: estimacionId,
      from: previousStatus,
      to: newStatus,
      userId
    });

    return estimation;
  }

  private validateTransition(
    currentStatus: EstimationStatus,
    newStatus: EstimationStatus,
    userRole: string
  ): void {
    const allowedTransitions = {
      draft: {
        submitted: ['engineer', 'resident']
      },
      submitted: {
        reviewed: ['finance'],
        draft: ['engineer', 'finance']
      },
      reviewed: {
        authorized: ['director', 'finance'],
        submitted: ['finance']
      },
      authorized: {
        paid: ['finance']
      }
    };

    const allowed = allowedTransitions[currentStatus]?.[newStatus];
    if (!allowed || !allowed.includes(userRole)) {
      throw new ForbiddenException(
        `Usuario con rol ${userRole} no puede cambiar de ${currentStatus} a ${newStatus}`
      );
    }
  }

  private async sendWorkflowNotifications(
    estimation: Estimation,
    newStatus: EstimationStatus
  ): Promise<void> {
    const notifications = {
      submitted: {
        to: 'finance_team',
        subject: `Nueva estimación ${estimation.numero} pendiente de revisar`,
        template: 'estimation-submitted'
      },
      reviewed: {
        to: 'director',
        subject: `Estimación ${estimation.numero} requiere autorización`,
        template: 'estimation-reviewed'
      },
      authorized: {
        to: 'finance_team',
        subject: `Estimación ${estimation.numero} autorizada para pago`,
        template: 'estimation-authorized'
      }
    };

    const config = notifications[newStatus];
    if (config) {
      await this.notificationService.send({
        ...config,
        data: { estimation }
      });
    }
  }

  @Cron('0 */6 * * *') // Cada 6 horas
  async checkPendingEstimations(): Promise<void> {
    const pendientes = await this.estimationsRepo.find({
      where: { status: In([EstimationStatus.SUBMITTED, EstimationStatus.REVIEWED]) }
    });

    for (const est of pendientes) {
      const horasPendiente = differenceInHours(new Date(), est.submittedAt);

      if (horasPendiente > 48) {
        await this.escalateEstimation(est, 'critical');
      } else if (horasPendiente > 24) {
        await this.escalateEstimation(est, 'warning');
      }
    }
  }

  private async escalateEstimation(estimation: Estimation, level: string): Promise<void> {
    await this.notificationService.send({
      to: level === 'critical' ? ['director', 'cfo'] : ['finance_supervisor'],
      subject: `⚠️ Estimación ${estimation.numero} pendiente hace ${differenceInHours(new Date(), estimation.submittedAt)}h`,
      priority: level === 'critical' ? 'high' : 'medium',
      channels: level === 'critical' ? ['email', 'sms'] : ['email']
    });
  }
}
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
