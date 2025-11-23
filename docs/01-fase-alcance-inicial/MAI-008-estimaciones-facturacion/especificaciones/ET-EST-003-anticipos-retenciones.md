# ET-EST-003: Sistema de Anticipos y Retenciones

**ID:** ET-EST-003  
**Módulo:** MAI-008  
**Relacionado con:** RF-EST-003

---

## 📋 Tablas de Base de Datos

```sql
-- Anticipos
CREATE TABLE estimations.advances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'received', 'granted'
  monto BIGINT NOT NULL,
  porcentaje DECIMAL(5,2),
  fecha_pago DATE NOT NULL,
  referencia VARCHAR(100),
  
  -- Amortización
  porcentaje_amortizacion_por_estimacion DECIMAL(5,2),
  saldo_pendiente BIGINT DEFAULT 0,
  total_amortizado BIGINT DEFAULT 0,
  
  -- Garantías (si aplica)
  garantia_id UUID,
  
  status VARCHAR(20) DEFAULT 'active'
);

-- Retenciones acumuladas
CREATE TABLE estimations.retentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  tipo VARCHAR(30) NOT NULL, -- 'fondo_garantia', 'fianza', 'isr', 'iva'
  porcentaje DECIMAL(5,2) NOT NULL,
  
  monto_acumulado BIGINT DEFAULT 0,
  monto_liberado BIGINT DEFAULT 0,
  saldo_pendiente BIGINT DEFAULT 0,
  
  fecha_liberacion_estimada DATE,
  condiciones_liberacion TEXT,
  
  status VARCHAR(20) DEFAULT 'active'
);
```

---

## 🔧 Backend Services

### advance.service.ts

```typescript
@Injectable()
export class AdvanceService {
  async createAdvance(dto: CreateAdvanceDto): Promise<Advance> {
    const advance = this.advancesRepo.create({
      ...dto,
      saldoPendiente: dto.monto,
      totalAmortizado: 0
    });
    
    return this.advancesRepo.save(advance);
  }

  async amortizeAdvance(
    advanceId: string,
    estimacionMonto: number,
    estimacionNumero: number
  ): Promise<number> {
    const advance = await this.advancesRepo.findOne(advanceId);
    
    if (advance.saldoPendiente <= 0) return 0;

    const amortizacion = Math.min(
      advance.saldoPendiente,
      estimacionMonto * (advance.porcentajeAmortizacionPorEstimacion / 100)
    );

    advance.totalAmortizado += amortizacion;
    advance.saldoPendiente -= amortizacion;

    await this.advancesRepo.save(advance);
    return amortizacion;
  }

  async getAdvanceStatus(contractId: string): Promise<AdvanceStatus> {
    const advance = await this.advancesRepo.findOne({ 
      where: { contractId, status: 'active' } 
    });

    if (!advance) return null;

    return {
      montoInicial: advance.monto,
      totalAmortizado: advance.totalAmortizado,
      saldoPendiente: advance.saldoPendiente,
      porcentajeAmortizado: (advance.totalAmortizado / advance.monto) * 100
    };
  }
}
```

### retention.service.ts

```typescript
@Injectable()
export class RetentionService {
  async acumularRetencion(
    contractId: string,
    tipo: string,
    monto: number
  ): Promise<void> {
    const retention = await this.retentionsRepo.findOne({
      where: { contractId, tipo }
    });

    if (retention) {
      retention.montoAcumulado += monto;
      retention.saldoPendiente += monto;
      await this.retentionsRepo.save(retention);
    }
  }

  async liberarRetencion(
    retentionId: string,
    montoLiberar: number,
    razon: string
  ): Promise<void> {
    const retention = await this.retentionsRepo.findOne(retentionId);

    if (retention.saldoPendiente < montoLiberar) {
      throw new BadRequestException('Monto a liberar excede saldo pendiente');
    }

    retention.montoLiberado += montoLiberar;
    retention.saldoPendiente -= montoLiberar;

    await this.retentionsRepo.save(retention);

    // Audit log
    await this.auditService.log({
      action: 'retention_released',
      entityId: retentionId,
      amount: montoLiberar,
      reason: razon
    });
  }

  async getRetencionesAcumuladas(contractId: string): Promise<RetentionSummary[]> {
    return this.retentionsRepo.find({
      where: { contractId },
      order: { tipo: 'ASC' }
    });
  }
}
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
