# ET-HR-004: Implementación Integración IMSS

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-004
**Tipo:** Especificación Técnica
**Prioridad:** Crítica (Cumplimiento Legal)
**Estado:** 🚧 En Implementación
**Última actualización:** 2025-11-17

---

## 🔧 Implementación Backend

### 1. IMSSIntegrationService

**Archivo:** `apps/backend/src/modules/hr/integrations/imss/imss-integration.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Employee } from '../../employees/entities/employee.entity';
import { IMSSIntegrationLog } from './entities/imss-integration-log.entity';
import { SUAFile } from './entities/sua-file.entity';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class IMSSIntegrationService {
  private readonly apiUrl: string;
  private readonly registroPatronal: string;
  private readonly certificatePath: string;
  private readonly privateKeyPath: string;

  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(IMSSIntegrationLog)
    private logRepo: Repository<IMSSIntegrationLog>,
    @InjectRepository(SUAFile)
    private suaFileRepo: Repository<SUAFile>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiUrl = configService.get('IMSS_API_URL');
    this.registroPatronal = configService.get('IMSS_REGISTRO_PATRONAL');
    this.certificatePath = configService.get('IMSS_CERTIFICATE_PATH');
    this.privateKeyPath = configService.get('IMSS_PRIVATE_KEY_PATH');
  }

  /**
   * Alta de trabajador ante IMSS
   */
  async registrarTrabajador(employeeId: string): Promise<any> {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Empleado no encontrado');
    }

    // Validar que tenga NSS, CURP, RFC
    if (!employee.nss || !employee.curp || !employee.rfc) {
      throw new BadRequestException('Faltan datos fiscales del empleado');
    }

    const payload = {
      registro_patronal: this.registroPatronal,
      nss: employee.nss,
      curp: employee.curp,
      nombre: employee.firstName,
      apellido_paterno: employee.lastName.split(' ')[0],
      apellido_materno: employee.lastName.split(' ')[1] || '',
      fecha_nacimiento: employee.dateOfBirth,
      sexo: employee.gender === 'male' ? 'H' : 'M',
      salario_base_cotizacion: employee.currentSalary,
      fecha_alta: employee.hireDate,
      tipo_trabajador: employee.contractType === 'permanent' ? '1' : '2',
      tipo_salario: '0', // Fijo
    };

    try {
      const response = await this.makeIMSSRequest('/afiliacion/alta', payload);

      // Guardar log
      await this.saveLog(employeeId, 'alta', payload, response, 'success', response.folio);

      return response;
    } catch (error) {
      await this.saveLog(employeeId, 'alta', payload, null, 'failed', null, error.message);
      throw error;
    }
  }

  /**
   * Baja de trabajador ante IMSS
   */
  async bajaTrabajador(
    employeeId: string,
    fechaBaja: Date,
    motivoBaja: string,
  ): Promise<any> {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    const payload = {
      registro_patronal: this.registroPatronal,
      nss: employee.nss,
      fecha_baja: fechaBaja,
      tipo_baja: this.mapBajaType(motivoBaja),
      causa_baja: motivoBaja,
    };

    try {
      const response = await this.makeIMSSRequest('/afiliacion/baja', payload);
      await this.saveLog(employeeId, 'baja', payload, response, 'success', response.folio);
      return response;
    } catch (error) {
      await this.saveLog(employeeId, 'baja', payload, null, 'failed', null, error.message);
      throw error;
    }
  }

  /**
   * Modificación salarial ante IMSS
   */
  async modificacionSalarial(
    employeeId: string,
    nuevoSBC: number,
    fechaEfectiva: Date,
  ): Promise<any> {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    // Solo notificar si cambio > 5% o > 1 UMA (~103 MXN)
    const cambio = Math.abs(nuevoSBC - employee.currentSalary);
    const porcentajeCambio = (cambio / employee.currentSalary) * 100;

    if (porcentajeCambio < 5 && cambio < 103) {
      return { skipped: true, reason: 'Cambio menor al 5% y 1 UMA' };
    }

    const payload = {
      registro_patronal: this.registroPatronal,
      nss: employee.nss,
      nuevo_sbc: nuevoSBC,
      fecha_efectiva: fechaEfectiva,
      tipo_modificacion: 'Modificación salarial',
    };

    try {
      const response = await this.makeIMSSRequest('/afiliacion/modificacion', payload);
      await this.saveLog(
        employeeId,
        'modificacion',
        payload,
        response,
        'success',
        response.folio,
      );
      return response;
    } catch (error) {
      await this.saveLog(
        employeeId,
        'modificacion',
        payload,
        null,
        'failed',
        null,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Generar archivo SUA mensual
   */
  async generarArchivoSUA(
    constructoraId: string,
    periodMonth: number,
    periodYear: number,
    generatedBy: string,
  ): Promise<SUAFile> {
    // Obtener empleados activos del mes
    const employees = await this.getActiveEmployeesForMonth(
      constructoraId,
      periodMonth,
      periodYear,
    );

    // Construir archivo SUA
    let suaContent = '';

    // Header
    suaContent += this.buildSUAHeader(periodMonth, periodYear);

    // Registro patronal
    suaContent += this.buildRegistroPatronal();

    // Trabajadores
    let totalContributions = 0;
    employees.forEach((emp) => {
      const line = this.buildEmployeeLine(emp, periodMonth, periodYear);
      suaContent += line + '\n';
      totalContributions += this.calculateIMSSContributions(emp.currentSalary, 30);
    });

    // Totales
    suaContent += this.buildTotalsLine(employees.length, totalContributions);

    // Calcular hash
    const fileHash = crypto.createHash('sha256').update(suaContent).digest('hex');

    // Guardar en BD
    const suaFile = this.suaFileRepo.create({
      constructoraId,
      periodMonth,
      periodYear,
      fileContent: suaContent,
      fileHash,
      totalEmployees: employees.length,
      totalContributions,
      generatedBy,
    });

    return await this.suaFileRepo.save(suaFile);
  }

  /**
   * Calcular cuotas IMSS (simplificado)
   */
  private calculateIMSSContributions(sbc: number, dias: number): number {
    // Promedio de cuotas: ~27% del SBC
    const tasaPromedio = 0.27;
    const contribucionDiaria = sbc * tasaPromedio;
    return contribucionDiaria * dias;
  }

  /**
   * Construir línea de empleado en archivo SUA
   */
  private buildEmployeeLine(employee: Employee, month: number, year: number): string {
    const nss = employee.nss.padEnd(11, ' ');
    const nombre = (employee.lastName + ' ' + employee.firstName)
      .substring(0, 50)
      .padEnd(50, ' ');
    const sbc = employee.currentSalary.toFixed(2).padStart(10, '0');
    const dias = '30'; // Días cotizados (simplificado)

    // Formato SUA: 80 caracteres
    return `${nss}${nombre}${dias.padStart(2, '0')}${sbc}`;
  }

  /**
   * Request HTTP a API IMSS con certificado digital
   */
  private async makeIMSSRequest(endpoint: string, payload: any): Promise<any> {
    // Cargar certificado y llave privada
    const cert = fs.readFileSync(this.certificatePath);
    const key = fs.readFileSync(this.privateKeyPath);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: new (require('https').Agent)({
        cert,
        key,
        rejectUnauthorized: false, // Solo para sandbox, en prod debe ser true
      }),
    };

    const response = await firstValueFrom(
      this.httpService.post(this.apiUrl + endpoint, payload, config),
    );

    return response.data;
  }

  private async saveLog(
    employeeId: string,
    operationType: string,
    request: any,
    response: any,
    status: string,
    folio: string | null,
    errorMessage: string | null = null,
  ) {
    const log = this.logRepo.create({
      employeeId,
      operationType,
      requestPayload: request,
      responsePayload: response,
      status,
      imssFolio: folio,
      errorMessage,
    });

    await this.logRepo.save(log);
  }

  private mapBajaType(motivo: string): string {
    if (motivo.includes('renuncia')) return '1';
    if (motivo.includes('despido')) return '2';
    if (motivo.includes('defunción')) return '3';
    return '1'; // Default
  }

  private buildSUAHeader(month: number, year: number): string {
    return `*************${month.toString().padStart(2, '0')}${year}${this.registroPatronal}\n`;
  }

  private buildRegistroPatronal(): string {
    return `${this.registroPatronal}CONSTRUCCIONES SA\n`;
  }

  private buildTotalsLine(totalEmps: number, totalAmount: number): string {
    return `99999999999TOTALES          ${totalEmps.toString().padStart(5, '0')}${totalAmount.toFixed(2).padStart(15, '0')}\n`;
  }

  private async getActiveEmployeesForMonth(
    constructoraId: string,
    month: number,
    year: number,
  ): Promise<Employee[]> {
    // Obtener empleados activos durante el mes
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await this.employeeRepo
      .createQueryBuilder('emp')
      .where('emp.constructoraId = :constructoraId', { constructoraId })
      .andWhere('emp.hireDate <= :endDate', { endDate })
      .andWhere('(emp.terminationDate IS NULL OR emp.terminationDate >= :startDate)', {
        startDate,
      })
      .getMany();
  }
}
```

---

## 🔐 Configuración

### Variables de Entorno

```bash
# .env.production
IMSS_API_URL=https://api.imss.gob.mx/v1
IMSS_REGISTRO_PATRONAL=A1234567890
IMSS_CERTIFICATE_PATH=/path/to/certificate.cer
IMSS_PRIVATE_KEY_PATH=/path/to/private.key
```

### Secrets Management (Kubernetes)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: imss-certificates
type: Opaque
data:
  certificate.cer: <base64-encoded-cert>
  private.key: <base64-encoded-key>
```

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
