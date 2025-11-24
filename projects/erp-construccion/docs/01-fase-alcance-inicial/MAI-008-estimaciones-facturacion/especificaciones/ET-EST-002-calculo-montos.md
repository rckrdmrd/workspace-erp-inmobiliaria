# ET-EST-002: Cálculo Automático de Montos

**ID:** ET-EST-002  
**Módulo:** MAI-008  
**Relacionado con:** RF-EST-001, RF-EST-002

---

## 🧮 EstimationCalculator Service

```typescript
@Injectable()
export class EstimationCalculatorService {
  
  /**
   * Calcula monto bruto desde items
   */
  calculateMontoBruto(items: EstimationItemDto[]): number {
    return items.reduce((total, item) => {
      return total + (item.cantidadEstimadaActual * item.precioUnitario);
    }, 0);
  }

  /**
   * Calcula amortización de anticipo
   */
  async calculateAmortizacion(
    montoBruto: number,
    contractId: string,
    estimacionNumero: number
  ): Promise<number> {
    // Obtener anticipo del contrato
    const anticipo = await this.getAnticipo(contractId);
    if (!anticipo) return 0;

    // Obtener amortizaciones previas
    const amortizadoAnterior = await this.getTotalAmortizado(contractId, estimacionNumero - 1);
    const saldoAnticipo = anticipo.monto - amortizadoAnterior;

    if (saldoAnticipo <= 0) return 0;

    // Calcular amortización actual
    const porcentaje = anticipo.porcentajeAmortizacionPorEstimacion / 100;
    const amortizacion = Math.min(
      saldoAnticipo,
      montoBruto * porcentaje
    );

    return Math.round(amortizacion);
  }

  /**
   * Calcula retenciones
   */
  calculateRetenciones(
    montoBruto: number,
    amortizacion: number,
    contractConfig: RetentionConfig
  ): RetentionesDetalle {
    const base = montoBruto - amortizacion;

    const retenciones = {
      fondoGarantia: Math.round(base * (contractConfig.porcentajeFondoGarantia / 100)),
      isr: contractConfig.retieneISR ? Math.round(base * (contractConfig.tasaISR / 100)) : 0,
      iva: contractConfig.retieneIVA ? Math.round(base * (contractConfig.tasaIVA / 100)) : 0,
      otras: contractConfig.otrasRetenciones || 0
    };

    const total = Object.values(retenciones).reduce((sum, val) => sum + val, 0);

    return {
      ...retenciones,
      total
    };
  }

  /**
   * Calcula monto neto final
   */
  calculateMontoNeto(
    montoBruto: number,
    amortizacion: number,
    totalRetenciones: number
  ): number {
    const neto = montoBruto - amortizacion - totalRetenciones;
    if (neto < 0) {
      throw new BadRequestException('Monto neto no puede ser negativo');
    }
    return neto;
  }

  /**
   * Cálculo completo de estimación
   */
  async calculateEstimationTotals(
    items: EstimationItemDto[],
    contractId: string,
    estimacionNumero: number,
    estimationType: EstimationType
  ): Promise<EstimationTotals> {
    // 1. Monto bruto
    const montoBruto = this.calculateMontoBruto(items);

    // 2. Amortización
    const amortizacion = await this.calculateAmortizacion(
      montoBruto,
      contractId,
      estimacionNumero
    );

    // 3. Retenciones
    const contractConfig = await this.getContractConfig(contractId, estimationType);
    const retenciones = this.calculateRetenciones(montoBruto, amortizacion, contractConfig);

    // 4. Monto neto
    const montoNeto = this.calculateMontoNeto(montoBruto, amortizacion, retenciones.total);

    return {
      montoBruto,
      amortizacion,
      retenciones,
      montoNeto
    };
  }
}
```

---

## 📊 Fórmulas de Cálculo

### Para Estimación a Cliente

```typescript
// Ejemplo real
const calculo = {
  // Entrada
  viviendas_terminadas: 25,
  precio_unitario: 500_000_00, // $500K en centavos
  
  // Paso 1: Monto bruto
  monto_bruto: 25 * 500_000_00 = 12_500_000_00, // $12.5M
  
  // Paso 2: Amortización
  anticipo_inicial: 10_000_000_00, // $10M (20% del contrato)
  porcentaje_amortizacion: 25,
  amortizacion: Math.min(
    10_000_000_00,  // Saldo disponible
    12_500_000_00 * 0.25  // 25% del bruto
  ) = 2_500_000_00, // $2.5M
  
  // Paso 3: Base retenciones
  base_retenciones: 12_500_000_00 - 2_500_000_00 = 10_000_000_00,
  
  // Paso 4: Retenciones
  retencion_fondo_garantia: 10_000_000_00 * 0.05 = 500_000_00, // 5%
  retencion_isr: 0,
  retencion_iva: 0,
  total_retenciones: 500_000_00,
  
  // Paso 5: Monto neto
  monto_neto: 12_500_000_00 - 2_500_000_00 - 500_000_00 = 9_500_000_00  // $9.5M
};
```

### Para Estimación a Subcontratista

```typescript
const calculoSub = {
  // Entrada
  monto_subcontrato: 2_000_000_00, // $2M
  porcentaje_avance: 30,
  
  // Paso 1: Monto bruto
  monto_bruto: 2_000_000_00 * 0.30 = 600_000_00, // $600K
  
  // Paso 2: Amortización proporcional
  anticipo: 2_000_000_00 * 0.10 = 200_000_00, // 10% anticipo
  amortizacion: 200_000_00 * 0.30 = 60_000_00, // 30% del anticipo
  
  // Paso 3: Retenciones
  base: 600_000_00 - 60_000_00 = 540_000_00,
  retencion: 540_000_00 * 0.10 = 54_000_00, // 10%
  
  // Paso 4: Neto
  monto_neto: 600_000_00 - 60_000_00 - 54_000_00 = 486_000_00  // $486K
};
```

---

## ✅ Validaciones

```typescript
@Injectable()
export class EstimationValidatorService {
  
  /**
   * Valida que no se exceda el monto del contrato
   */
  async validateContractLimit(
    contractId: string,
    newMontoBruto: number
  ): Promise<void> {
    const contract = await this.contractsRepo.findOne(contractId);
    const estimatedTotal = await this.getTotalEstimated(contractId);
    
    if (estimatedTotal + newMontoBruto > contract.montoTotal) {
      throw new BadRequestException(
        `Excede monto del contrato. Disponible: $${(contract.montoTotal - estimatedTotal) / 100}`
      );
    }
  }

  /**
   * Valida que no se dupliquen conceptos
   */
  async validateNoDuplicateItems(
    projectId: string,
    items: EstimationItemDto[]
  ): Promise<void> {
    const previousItems = await this.getEstimatedItems(projectId);
    
    for (const item of items) {
      const alreadyEstimated = previousItems.find(
        prev => prev.conceptCatalogId === item.conceptCatalogId
      );
      
      if (alreadyEstimated) {
        throw new BadRequestException(
          `Concepto "${item.descripcion}" ya fue estimado previamente`
        );
      }
    }
  }

  /**
   * Valida avances verificados
   */
  async validateVerifiedProgress(items: EstimationItemDto[]): Promise<void> {
    for (const item of items) {
      if (!item.avanceObraId) {
        throw new BadRequestException(
          `Item "${item.descripcion}" no tiene avance de obra vinculado`
        );
      }
      
      const avance = await this.avancesRepo.findOne(item.avanceObraId);
      if (avance.status !== 'verified') {
        throw new BadRequestException(
          `Avance de "${item.descripcion}" no está verificado`
        );
      }
    }
  }
}
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
