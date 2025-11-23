# ET-HR-005: Implementación Integración INFONAVIT

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-005
**Tipo:** Especificación Técnica
**Prioridad:** Crítica (Cumplimiento Legal)
**Estado:** 🚧 En Implementación
**Última actualización:** 2025-11-17

---

## 🔧 Implementación Backend

### 1. INFONAVITIntegrationService

**Archivo:** `apps/backend/src/modules/hr/integrations/infonavit/infonavit-integration.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Employee } from '../../employees/entities/employee.entity';
import { INFONAVITCredit } from './entities/infonavit-credit.entity';
import { INFONAVITPaymentFile } from './entities/infonavit-payment-file.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class INFONAVITIntegrationService {
  private readonly apiUrl: string;
  private readonly registroPatronal: string;
  private readonly apiKey: string;
  private readonly accessToken: string;

  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(INFONAVITCredit)
    private creditRepo: Repository<INFONAVITCredit>,
    @InjectRepository(INFONAVITPaymentFile)
    private paymentFileRepo: Repository<INFONAVITPaymentFile>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiUrl = configService.get('INFONAVIT_API_URL');
    this.registroPatronal = configService.get('INFONAVIT_REGISTRO_PATRONAL');
    this.apiKey = configService.get('INFONAVIT_API_KEY');
    this.accessToken = configService.get('INFONAVIT_ACCESS_TOKEN');
  }

  /**
   * Calcular aportaciones bimestrales (5% del SBC)
   */
  async calcularAportaciones(
    constructoraId: string,
    periodNumber: number, // 1-6 (bimestre)
    periodYear: number,
  ): Promise<{ totalAportaciones: number; empleados: any[] }> {
    // Determinar fechas del bimestre
    const { startDate, endDate } = this.getBimestreDates(periodNumber, periodYear);

    // Obtener empleados activos en el bimestre
    const employees = await this.getActiveEmployeesForPeriod(
      constructoraId,
      startDate,
      endDate,
    );

    let totalAportaciones = 0;
    const detalles = [];

    for (const employee of employees) {
      // Días cotizados en el bimestre (simplificado: 60 días por bimestre)
      const diasCotizados = 60;

      // Aportación INFONAVIT = SBC × días × 5%
      const aportacion = employee.currentSalary * diasCotizados * 0.05;

      totalAportaciones += aportacion;

      detalles.push({
        employeeId: employee.id,
        nss: employee.nss,
        nombre: employee.fullName,
        sbc: employee.currentSalary,
        diasCotizados,
        aportacion,
      });
    }

    return {
      totalAportaciones,
      empleados: detalles,
    };
  }

  /**
   * Consultar trabajadores con crédito INFONAVIT
   */
  async consultarAcreditados(constructoraId: string): Promise<void> {
    const payload = {
      registro_patronal: this.registroPatronal,
    };

    try {
      const response = await this.makeINFONAVITRequest('/acreditados/consulta', payload);

      // Procesar lista de acreditados
      for (const acreditado of response.acreditados || []) {
        // Buscar empleado por NSS
        const employee = await this.employeeRepo.findOne({
          where: {
            nss: acreditado.nss,
            constructoraId,
          },
        });

        if (!employee) continue;

        // Actualizar o crear crédito
        let credit = await this.creditRepo.findOne({
          where: {
            employeeId: employee.id,
            creditNumber: acreditado.numero_credito,
          },
        });

        if (credit) {
          // Actualizar existente
          credit.discountValue = acreditado.descuento_mensual;
          credit.outstandingBalance = acreditado.saldo_pendiente;
        } else {
          // Crear nuevo
          credit = this.creditRepo.create({
            employeeId: employee.id,
            creditNumber: acreditado.numero_credito,
            discountType: acreditado.tipo_descuento || 'VSM',
            discountValue: acreditado.descuento_mensual,
            outstandingBalance: acreditado.saldo_pendiente,
            startDate: new Date(acreditado.fecha_inicio),
            isActive: true,
          });
        }

        await this.creditRepo.save(credit);
      }
    } catch (error) {
      console.error('Error consultando acreditados INFONAVIT:', error);
      throw error;
    }
  }

  /**
   * Calcular descuento por crédito INFONAVIT para un empleado
   */
  async calcularDescuentoCredito(
    employeeId: string,
    salarioBruto: number,
  ): Promise<number> {
    const credit = await this.creditRepo.findOne({
      where: {
        employeeId,
        isActive: true,
      },
    });

    if (!credit) {
      return 0;
    }

    let descuento = 0;

    switch (credit.discountType) {
      case 'VSM': {
        // Veces Salario Mínimo
        const salarioMinimo = 248.93; // 2025
        const diasMes = 30;
        descuento = salarioMinimo * credit.discountValue * diasMes;
        break;
      }
      case 'percentage': {
        // Porcentaje del salario bruto
        descuento = salarioBruto * (credit.discountValue / 100);
        break;
      }
      case 'fixed': {
        // Cuota fija
        descuento = credit.discountValue;
        break;
      }
    }

    // Validar que no exceda 30% del salario bruto
    const maxDescuento = salarioBruto * 0.3;
    if (descuento > maxDescuento) {
      descuento = maxDescuento;
    }

    return descuento;
  }

  /**
   * Generar archivo de pago bimestral
   */
  async generarArchivoPago(
    constructoraId: string,
    periodNumber: number,
    periodYear: number,
    generatedBy: string,
  ): Promise<INFONAVITPaymentFile> {
    // Calcular aportaciones
    const { totalAportaciones, empleados } = await this.calcularAportaciones(
      constructoraId,
      periodNumber,
      periodYear,
    );

    // Obtener descuentos por créditos
    const creditos = await this.creditRepo.find({
      where: { isActive: true },
      relations: ['employee'],
    });

    let totalDescuentos = 0;
    const descuentosDetalle = [];

    for (const credito of creditos) {
      // Calcular descuento mensual × 2 (bimestre)
      const descuentoBimestral = (await this.calcularDescuentoCredito(
        credito.employeeId,
        credito.employee.currentSalary * 30, // Salario mensual estimado
      )) * 2;

      totalDescuentos += descuentoBimestral;

      descuentosDetalle.push({
        employeeId: credito.employeeId,
        nss: credito.employee.nss,
        creditoNumero: credito.creditNumber,
        descuento: descuentoBimestral,
      });
    }

    // Construir archivo de pago
    let fileContent = '';

    // Header
    fileContent += `HEADER|${this.registroPatronal}|BIMESTRE ${periodNumber}-${periodYear}\n`;

    // Aportaciones
    empleados.forEach((emp) => {
      fileContent += `APORTACION|${emp.nss}|${emp.aportacion.toFixed(2)}|${emp.diasCotizados}\n`;
    });

    // Descuentos
    descuentosDetalle.forEach((desc) => {
      fileContent += `DESCUENTO|${desc.nss}|${desc.creditoNumero}|${desc.descuento.toFixed(2)}\n`;
    });

    // Total
    fileContent += `TOTAL|${empleados.length}|${totalAportaciones.toFixed(2)}|${totalDescuentos.toFixed(2)}\n`;

    // Calcular hash
    const crypto = require('crypto');
    const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');

    // Generar línea de captura (simulado)
    const lineaCaptura = this.generarLineaCaptura(
      totalAportaciones + totalDescuentos,
      periodNumber,
      periodYear,
    );

    // Guardar en BD
    const paymentFile = this.paymentFileRepo.create({
      constructoraId,
      periodNumber,
      periodYear,
      fileContent,
      fileHash,
      totalEmployees: empleados.length,
      totalContributions: totalAportaciones,
      totalDiscounts: totalDescuentos,
      paymentReference: lineaCaptura,
      paymentStatus: 'pending',
      generatedBy,
    });

    return await this.paymentFileRepo.save(paymentFile);
  }

  /**
   * Request HTTP a API INFONAVIT con OAuth 2.0
   */
  private async makeINFONAVITRequest(endpoint: string, payload: any): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        'X-API-Key': this.apiKey,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.apiUrl + endpoint, payload, config),
    );

    return response.data;
  }

  /**
   * Generar línea de captura bancaria
   */
  private generarLineaCaptura(monto: number, bimestre: number, year: number): string {
    // Formato simplificado: INFONAVIT + REGISTRO + BIMESTRE + MONTO
    const registro = this.registroPatronal.padEnd(10, '0');
    const periodo = `${year}${bimestre.toString().padStart(2, '0')}`;
    const montoStr = Math.round(monto).toString().padStart(12, '0');

    return `INFONAVIT${registro}${periodo}${montoStr}`;
  }

  /**
   * Obtener fechas de bimestre
   */
  private getBimestreDates(bimestre: number, year: number): { startDate: Date; endDate: Date } {
    const bimestreMap = {
      1: { start: new Date(year, 0, 1), end: new Date(year, 1, 28) }, // Ene-Feb
      2: { start: new Date(year, 2, 1), end: new Date(year, 3, 30) }, // Mar-Abr
      3: { start: new Date(year, 4, 1), end: new Date(year, 5, 30) }, // May-Jun
      4: { start: new Date(year, 6, 1), end: new Date(year, 7, 31) }, // Jul-Ago
      5: { start: new Date(year, 8, 1), end: new Date(year, 9, 31) }, // Sep-Oct
      6: { start: new Date(year, 10, 1), end: new Date(year, 11, 31) }, // Nov-Dic
    };

    return {
      startDate: bimestreMap[bimestre].start,
      endDate: bimestreMap[bimestre].end,
    };
  }

  private async getActiveEmployeesForPeriod(
    constructoraId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Employee[]> {
    return await this.employeeRepo
      .createQueryBuilder('emp')
      .where('emp.constructoraId = :constructoraId', { constructoraId })
      .andWhere('emp.hireDate <= :endDate', { endDate })
      .andWhere('(emp.terminationDate IS NULL OR emp.terminationDate >= :startDate)', {
        startDate,
      })
      .andWhere('emp.status = :status', { status: 'active' })
      .getMany();
  }
}
```

---

## 🔐 Configuración

### Variables de Entorno

```bash
# .env.production
INFONAVIT_API_URL=https://api.infonavit.org.mx/v1
INFONAVIT_REGISTRO_PATRONAL=1234567890
INFONAVIT_API_KEY=your-api-key-here
INFONAVIT_ACCESS_TOKEN=your-oauth-token-here
```

### OAuth 2.0 Flow

```typescript
// Obtener access token
async function refreshAccessToken() {
  const response = await axios.post('https://api.infonavit.org.mx/oauth/token', {
    grant_type: 'client_credentials',
    client_id: process.env.INFONAVIT_CLIENT_ID,
    client_secret: process.env.INFONAVIT_CLIENT_SECRET,
  });

  return response.data.access_token;
}
```

---

## 🧪 Tests

```typescript
describe('INFONAVITIntegrationService', () => {
  it('should calculate 5% contributions correctly', async () => {
    const result = await service.calcularAportaciones('constructora-id', 1, 2025);

    // Empleado con SBC $350/día × 60 días × 5% = $1,050
    expect(result.totalAportaciones).toBeGreaterThan(0);
    expect(result.empleados).toHaveLength(5);
    expect(result.empleados[0].aportacion).toBe(350 * 60 * 0.05);
  });

  it('should calculate VSM discount correctly', async () => {
    const descuento = await service.calcularDescuentoCredito('emp-id', 10500);

    // 2.5 VSM = $248.93 × 2.5 × 30 = $18,669.75
    expect(descuento).toBeCloseTo(18669.75, 2);
  });

  it('should not exceed 30% of gross salary', async () => {
    const descuento = await service.calcularDescuentoCredito('emp-id', 5000);

    expect(descuento).toBeLessThanOrEqual(5000 * 0.3);
  });
});
```

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
