# ET-QUA-002: Sistema de No Conformidades

**ID:** ET-QUA-002 | **Módulo:** MAI-009

## Schema

```sql
CREATE TYPE quality.nc_severity AS ENUM ('minor', 'major', 'critical');
CREATE TYPE quality.nc_status AS ENUM ('open', 'in_progress', 'corrected', 'verified', 'closed');

CREATE TABLE quality.non_conformities (
  id UUID PRIMARY KEY,
  numero VARCHAR(50) UNIQUE, -- NC-2025-001
  inspection_id UUID,
  housing_id UUID,
  severity quality.nc_severity,
  category VARCHAR(50),
  description TEXT,
  photo_url TEXT,
  detected_by UUID,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  status quality.nc_status DEFAULT 'open',
  assigned_to UUID,
  sla_deadline TIMESTAMPTZ,
  corrective_action TEXT,
  preventive_action TEXT,
  corrected_at TIMESTAMPTZ,
  verification_photo TEXT,
  verified_by UUID,
  closed_at TIMESTAMPTZ
);
```

## Backend Service

```typescript
@Injectable()
export class NonConformityService {
  async create(dto: CreateNCDto): Promise<NonConformity> {
    const slaDeadline = this.calculateSLADeadline(dto.severity);
    const numero = await this.getNextNumber();
    
    const nc = this.ncRepo.create({ ...dto, numero, slaDeadline, status: 'open' });
    await this.ncRepo.save(nc);
    
    // Asignar automáticamente según categoría
    await this.autoAssign(nc);
    
    // Alerta si es crítica
    if (dto.severity === 'critical') {
      await this.alertCriticalNC(nc);
    }
    
    return nc;
  }

  private calculateSLADeadline(severity: NCSeverity): Date {
    const hours = { minor: 168, major: 72, critical: 24 };
    return new Date(Date.now() + hours[severity] * 60 * 60 * 1000);
  }

  @Cron('0 */1 * * *') // Cada hora
  async checkOverdueSL(): Promise<void> {
    const overdue = await this.ncRepo.find({
      where: { status: In(['open', 'in_progress']), slaDeadline: LessThan(new Date()) }
    });
    
    for (const nc of overdue) {
      await this.escalateNC(nc);
    }
  }
}
```

---
**Generado:** 2025-11-20
