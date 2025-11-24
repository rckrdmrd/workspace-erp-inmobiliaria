# US-HR-005: Exportación IMSS/INFONAVIT

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-004, RF-HR-005
**ET:** ET-HR-004, ET-HR-005
**Tipo:** Historia de Usuario
**Prioridad:** Crítica (Cumplimiento Legal) 🔴
**Story Points:** 12
**Sprint:** 11-12 (2 sprints)
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📖 Historia de Usuario

**Como** Gerente de RRHH o Contador
**Quiero** gestionar automáticamente altas/bajas en IMSS, generar archivos SUA y calcular aportaciones INFONAVIT
**Para** cumplir con obligaciones legales, evitar multas y sanciones, y tener trazabilidad completa de movimientos ante instituciones gubernamentales

---

## 🎯 Criterios de Aceptación

### CA-1: Alta de Trabajador ante IMSS 🆕

**Dado que** registro un nuevo empleado en el sistema
**Cuando** el empleado pasa validación de datos fiscales
**Entonces** puedo registrarlo ante el IMSS:

1. **Validación Previa:**
   - ✅ CURP válido (18 caracteres)
   - ✅ NSS válido (11 dígitos)
   - ✅ RFC válido (13 caracteres)
   - ✅ Fecha de nacimiento < hoy
   - ✅ Salario ≥ $248.93 (salario mínimo 2025)
   - ❌ Si falta algún dato: error "Complete datos fiscales antes del alta IMSS"

2. **Pantalla de Alta IMSS:**
   - Ver modal "Registrar Alta ante IMSS"
   - Datos pre-llenados del empleado:
     - Nombre completo: Juan Pérez García
     - CURP: BADD110313HCMLNS09
     - NSS: 12345678901
     - RFC: BADD110313AB1
     - Fecha de nacimiento: 13/03/1990
     - Género: Masculino
   - Campos editables:
     - **Salario Base de Cotización (SBC):** $500.00 (puede ser diferente al salario diario)
     - **Fecha de alta:** 2025-11-17 (default: hoy, editable)
     - **Tipo de trabajador:**
       - ○ Permanente (default)
       - ○ Eventual
       - ○ Por obra determinada
     - **Tipo de salario:**
       - ○ Fijo (default)
       - ○ Variable
       - ○ Mixto

3. **Enviar Alta (Sandbox Mode):**
   - Hacer clic en "Enviar Alta a IMSS"
   - Spinner: "Enviando a IMSS..."
   - **En modo sandbox:** Simular respuesta después de 2 segundos
   - Response mock:
     ```json
     {
       "success": true,
       "folio": "IMSS-2025-11-17-00123",
       "message": "Alta registrada exitosamente",
       "fechaAlta": "2025-11-17",
       "nss": "12345678901"
     }
     ```
   - Guardar log en base de datos:
     ```json
     {
       "employeeId": "uuid",
       "operationType": "alta",
       "requestPayload": {...},
       "responsePayload": {...},
       "status": "success",
       "imssFolio": "IMSS-2025-11-17-00123",
       "createdAt": "2025-11-17T10:30:00Z"
     }
     ```

4. **Confirmación:**
   - Toast: "✓ Alta registrada en IMSS con folio IMSS-2025-11-17-00123"
   - Badge en perfil del empleado: "IMSS: Registrado ✓"
   - Link para ver comprobante

**Y** el sistema debe recordar que el empleado ya está dado de alta (no permitir duplicados)

### CA-2: Baja de Trabajador ante IMSS 🚫

**Dado que** un empleado termina su relación laboral
**Cuando** registro su baja en el sistema
**Entonces** debo dar de baja en IMSS:

1. **Trigger Automático:**
   - Al dar de baja empleado en sistema (US-HR-001)
   - Modal aparece automáticamente: "¿Registrar baja ante IMSS?"
   - Opciones:
     - "Sí, registrar ahora" (recomendado)
     - "Recordarme después"
     - "No registrar (requiere justificación)"

2. **Formulario de Baja:**
   - Fecha de baja: 2025-11-17 (default: fecha de terminación, no editable)
   - Motivo de baja (obligatorio):
     - ○ Renuncia voluntaria
     - ○ Despido sin responsabilidad del trabajador
     - ○ Despido con responsabilidad del trabajador
     - ○ Término de contrato
     - ○ Defunción
     - ○ Otro
   - Si "Otro": campo de texto obligatorio
   - Advertencia: ⚠️ "Tienes 5 días hábiles para reportar la baja ante IMSS"

3. **Enviar Baja:**
   - Validar que fecha de baja ≥ fecha de alta
   - Enviar request a API IMSS (o sandbox)
   - Response:
     ```json
     {
       "success": true,
       "folio": "IMSS-2025-11-17-00456",
       "message": "Baja registrada exitosamente",
       "fechaBaja": "2025-11-17",
       "nss": "12345678901"
     }
     ```

4. **Confirmación:**
   - Toast: "✓ Baja registrada en IMSS"
   - Badge en empleado: "IMSS: Dado de baja 🔴"
   - Empleado ya no aparece en archivo SUA mensual

### CA-3: Modificación Salarial ante IMSS 💰

**Dado que** cambio el salario de un empleado
**Cuando** el cambio es > 5% o > 1 UMA (~$103 MXN)
**Entonces** debo notificar a IMSS:

1. **Detección Automática:**
   - Empleado con salario actual: $500.00
   - Se modifica a: $550.00
   - Cambio: $50.00 (10%)
   - Sistema detecta que > 5% → requiere notificación IMSS
   - Modal aparece: "Este cambio requiere notificación al IMSS"

2. **Formulario de Modificación:**
   - Salario anterior: $500.00 (no editable)
   - **Nuevo SBC:** $550.00 (editable)
   - **Fecha efectiva:** 2025-12-01 (editable, no puede ser pasada)
   - Tipo de modificación: "Modificación salarial"

3. **Enviar Modificación:**
   - Request a API IMSS
   - Response:
     ```json
     {
       "success": true,
       "folio": "IMSS-2025-11-17-00789",
       "fechaEfectiva": "2025-12-01"
     }
     ```

4. **Manejo de Cambios Menores:**
   - Si cambio < 5% y < 1 UMA:
   - Mensaje: "ℹ️ Cambio menor al 5%. No requiere notificación inmediata al IMSS"
   - Se acumulan para reporte mensual en SUA

### CA-4: Generación de Archivo SUA Mensual 📁

**Dado que** necesito presentar declaración mensual al IMSS
**Cuando** accedo a "IMSS" > "Generar Archivo SUA"
**Entonces** puedo:

1. **Seleccionar Periodo:**
   - Mes: Noviembre
   - Año: 2025
   - Mostrar: "Noviembre 2025 (01/11/2025 - 30/11/2025)"

2. **Vista Previa de Empleados:**
   - Tabla con empleados que se incluirán:

   | NSS | Nombre | Días Cotizados | SBC | Cuotas IMSS |
   |-----|--------|----------------|-----|-------------|
   | 12345678901 | Juan Pérez | 30 | $500 | $4,050 |
   | 98765432109 | María López | 28 | $450 | $3,402 |
   | ... | ... | ... | ... | ... |

   - Totales:
     - Empleados: 52
     - Total cuotas: $187,400

3. **Validaciones Previas:**
   - ✅ Todos los empleados tienen NSS
   - ✅ Todos los empleados dados de alta en IMSS
   - ⚠️ 2 empleados con ausencias > 5 días (se marcan pero se incluyen)
   - ❌ 1 empleado sin fecha de alta IMSS (bloquea generación)

4. **Generar Archivo:**
   - Hacer clic en "Generar Archivo SUA"
   - Formato del archivo: Layout SUA estándar (80 caracteres por línea)
   - Contenido ejemplo:
     ```
     *************112025A1234567890
     A1234567890CONSTRUCCIONES SA DE CV
     12345678901PEREZ GARCIA JUAN               30500.00
     98765432109LOPEZ MARTINEZ MARIA            28450.00
     ...
     99999999999TOTALES                         0052187400.00
     ```

5. **Descarga:**
   - Archivo generado: `SUA_202511_A1234567890.txt`
   - Tamaño: ~5 KB
   - Encoding: ASCII (requerido por IMSS)
   - Toast: "✓ Archivo SUA generado exitosamente"

6. **Guardar Registro:**
   - Guardar en tabla `sua_files`:
     ```json
     {
       "periodMonth": 11,
       "periodYear": 2025,
       "fileContent": "...",
       "fileHash": "sha256-hash",
       "totalEmployees": 52,
       "totalContributions": 187400.00,
       "generatedBy": "user-uuid",
       "createdAt": "2025-11-17T15:00:00Z"
     }
     ```

**Y** poder regenerar el archivo en cualquier momento (con los datos actuales)

### CA-5: Cálculo de Aportaciones Bimestrales INFONAVIT 🏠

**Dado que** debo pagar aportaciones INFONAVIT bimestralmente
**Cuando** accedo a "INFONAVIT" > "Calcular Aportaciones"
**Entonces** puedo:

1. **Seleccionar Bimestre:**
   - Bimestre (dropdown):
     - Bimestre 1: Enero-Febrero
     - Bimestre 2: Marzo-Abril
     - Bimestre 3: Mayo-Junio
     - Bimestre 4: Julio-Agosto
     - Bimestre 5: Septiembre-Octubre
     - Bimestre 6: Noviembre-Diciembre
   - Año: 2025

2. **Cálculo Automático:**
   - Sistema calcula aportaciones del 5% del SBC
   - Fórmula: `Aportación = SBC × Días Cotizados × 5%`
   - Ejemplo:
     - Empleado: Juan Pérez
     - SBC: $500
     - Días cotizados (bimestre): 60
     - Aportación: $500 × 60 × 0.05 = **$1,500**

3. **Vista Previa:**

   | NSS | Nombre | SBC | Días | Aportación 5% |
   |-----|--------|-----|------|---------------|
   | 12345678901 | Juan Pérez | $500 | 60 | $1,500 |
   | 98765432109 | María López | $450 | 60 | $1,350 |
   | ... | ... | ... | ... | ... |

   - **Total aportaciones:** $78,000

4. **Incluir Descuentos por Créditos:**
   - Si empleado tiene crédito INFONAVIT activo:
   - Mostrar columna adicional: "Descuento Crédito"
   - Ejemplo:
     - Empleado con crédito de 2.5 VSM
     - Descuento bimestral: $14,934 (2 meses × 30 días × $248.93 × 2.5)
   - **Total descuentos:** $45,000
   - **Monto total a pagar:** $78,000 (aportaciones) + $45,000 (descuentos) = **$123,000**

### CA-6: Generación de Archivo de Pago INFONAVIT 📄

**Dado que** tengo el cálculo de aportaciones bimestrales
**Cuando** hago clic en "Generar Archivo de Pago"
**Entonces**:

1. **Archivo Generado:**
   - Formato: Layout INFONAVIT estándar
   - Contenido:
     ```
     HEADER|A1234567890|BIMESTRE 5-2025
     APORTACION|12345678901|1500.00|60
     APORTACION|98765432109|1350.00|60
     DESCUENTO|12345678901|1234567890123|14934.00
     TOTAL|52|78000.00|45000.00
     ```

2. **Línea de Captura Bancaria:**
   - Generar línea de captura para pago en banco
   - Formato: `INFONAVIT[registro][periodo][monto]`
   - Ejemplo: `INFONAVITA123456789020255000000123000`
   - Mostrar en pantalla para copiar:
     ```
     ┌──────────────────────────────────────┐
     │ Línea de Captura Bancaria:           │
     │                                      │
     │ INFONAVITA123456789020255000000123000│
     │                                      │
     │ Monto: $123,000.00                   │
     │ Vencimiento: 17/12/2025              │
     │           [Copiar]                   │
     └──────────────────────────────────────┘
     ```

3. **Descarga:**
   - Archivo: `INFONAVIT_Bim5_2025.txt`
   - Hash SHA-256 para validación de integridad
   - Guardar registro en DB

### CA-7: Consulta de Acreditados INFONAVIT 🔍

**Dado que** necesito saber qué empleados tienen crédito INFONAVIT
**Cuando** accedo a "INFONAVIT" > "Consultar Acreditados"
**Entonces**:

1. **Consulta Automática (Sandbox):**
   - Hacer clic en "Actualizar desde INFONAVIT"
   - Spinner: "Consultando acreditados..."
   - Simular respuesta de API:
     ```json
     {
       "acreditados": [
         {
           "nss": "12345678901",
           "numero_credito": "1234567890123",
           "tipo_descuento": "VSM",
           "descuento_mensual": 2.5,
           "saldo_pendiente": 285000.00,
           "fecha_inicio": "2020-05-15"
         }
       ]
     }
     ```

2. **Actualizar Registros:**
   - Buscar empleado por NSS
   - Crear o actualizar registro de crédito:
     - Número de crédito
     - Tipo de descuento: VSM (Veces Salario Mínimo)
     - Valor de descuento: 2.5
     - Saldo pendiente: $285,000
   - Toast: "✓ 1 crédito actualizado"

3. **Ver Lista de Acreditados:**

   | Empleado | NSS | Núm. Crédito | Tipo | Descuento | Saldo |
   |----------|-----|--------------|------|-----------|-------|
   | Juan Pérez | 123...901 | 1234...123 | VSM | 2.5 | $285,000 |

4. **Cálculo de Descuento:**
   - Al generar nómina o archivo INFONAVIT
   - Calcular descuento automáticamente:
     - Tipo VSM: $248.93 × 2.5 × 30 días = $18,669.75/mes
     - Validar que no exceda 30% del salario bruto
     - Si excede: ajustar a 30% máximo

### CA-8: Historial de Movimientos IMSS 📜

**Dado que** necesito trazabilidad de movimientos ante IMSS
**Cuando** accedo a un empleado > "Historial IMSS"
**Entonces** veo:

1. **Timeline de Movimientos:**
   ```
   📅 17/11/2025 - 10:30 AM
   ✅ ALTA IMSS
   Folio: IMSS-2025-11-17-00123
   SBC: $500.00
   Usuario: Juan Rodríguez (RRHH)

   📅 01/12/2025 - 14:15 PM
   💰 MODIFICACIÓN SALARIAL
   Folio: IMSS-2025-12-01-00789
   SBC anterior: $500.00 → Nuevo: $550.00
   Usuario: María González (RRHH)

   📅 15/03/2026 - 09:00 AM
   🚫 BAJA IMSS
   Folio: IMSS-2026-03-15-00456
   Motivo: Renuncia voluntaria
   Usuario: Juan Rodríguez (RRHH)
   ```

2. **Filtros:**
   - Por tipo: Alta, Baja, Modificación
   - Por fecha: Últimos 30 días, 6 meses, 1 año, Todo

3. **Descargar Comprobante:**
   - Hacer clic en un movimiento
   - Ver modal con detalles completos
   - Botón "Descargar comprobante PDF"

### CA-9: Dashboard de Cumplimiento 📊

**Dado que** soy Gerente de RRHH
**Cuando** accedo a "RRHH" > "Dashboard de Cumplimiento"
**Entonces** veo:

1. **Métricas de IMSS:**
   ```
   ┌─────────────────────────────────┐
   │ IMSS - Estado de Cumplimiento   │
   ├─────────────────────────────────┤
   │ ✅ Empleados dados de alta: 52  │
   │ ⚠️ Altas pendientes: 3           │
   │ ⚠️ Bajas pendientes: 1           │
   │ ✅ Archivo SUA mes actual: ✓    │
   │ Última actualización: Hoy 10:30 │
   └─────────────────────────────────┘
   ```

2. **Métricas de INFONAVIT:**
   ```
   ┌─────────────────────────────────┐
   │ INFONAVIT - Estado              │
   ├─────────────────────────────────┤
   │ Empleados con crédito: 8        │
   │ Total descuentos mes: $149,358  │
   │ ⚠️ Pago bimestral vence: 17/12  │
   │   (faltan 30 días)              │
   │ Último archivo generado: ✓      │
   └─────────────────────────────────┘
   ```

3. **Alertas:**
   - 🔴 **Urgente:** 1 baja de empleado pendiente de reportar (día 4 de 5)
   - 🟡 **Advertencia:** Pago INFONAVIT vence en 30 días
   - 🟢 **Ok:** Todos los archivos SUA generados a tiempo

### CA-10: Permisos por Rol 🔐

**Roles y Permisos:**

| Acción | Director | Engineer | Resident | HR | Finance |
|--------|----------|----------|----------|-----|---------|
| Alta/baja/mod IMSS | ✅ | ❌ | ❌ | ✅ | ❌ |
| Generar archivo SUA | ✅ | ❌ | ❌ | ✅ | ✅ |
| Calcular aportaciones INFONAVIT | ✅ | ❌ | ❌ | ✅ | ✅ |
| Consultar acreditados | ✅ | ❌ | ❌ | ✅ | ❌ |
| Ver historial de movimientos | ✅ | ❌ | ❌ | ✅ | ✅ |
| Descargar comprobantes | ✅ | ❌ | ❌ | ✅ | ✅ |

---

## 🔧 Detalles Técnicos

### Integración IMSS (Sandbox)

```typescript
// imss-integration.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as https from 'https';

@Injectable()
export class IMSSIntegrationService {
  private readonly apiUrl: string;
  private readonly certificatePath: string;
  private readonly privateKeyPath: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiUrl = configService.get('IMSS_API_URL');
    this.certificatePath = configService.get('IMSS_CERTIFICATE_PATH');
    this.privateKeyPath = configService.get('IMSS_PRIVATE_KEY_PATH');
  }

  /**
   * Alta de trabajador ante IMSS
   */
  async registrarTrabajador(employeeId: string): Promise<any> {
    const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });

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
    };

    try {
      const response = await this.makeIMSSRequest('/afiliacion/alta', payload);

      await this.saveLog(employeeId, 'alta', payload, response, 'success', response.folio);

      return response;
    } catch (error) {
      await this.saveLog(employeeId, 'alta', payload, null, 'failed', null, error.message);
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
  ): Promise<string> {
    const employees = await this.getActiveEmployeesForMonth(
      constructoraId,
      periodMonth,
      periodYear,
    );

    let suaContent = '';

    // Header
    suaContent += `*************${periodMonth.toString().padStart(2, '0')}${periodYear}${this.registroPatronal}\n`;

    // Registro patronal
    suaContent += `${this.registroPatronal}CONSTRUCCIONES SA DE CV\n`;

    // Trabajadores
    let totalContributions = 0;
    employees.forEach((emp) => {
      const line = this.buildEmployeeLine(emp, periodMonth, periodYear);
      suaContent += line + '\n';
      totalContributions += this.calculateIMSSContributions(emp.currentSalary, 30);
    });

    // Totales
    suaContent += `99999999999TOTALES${' '.repeat(30)}${employees.length.toString().padStart(5, '0')}${totalContributions.toFixed(2).padStart(15, '0')}\n`;

    return suaContent;
  }

  /**
   * Request HTTP a API IMSS con certificado digital
   */
  private async makeIMSSRequest(endpoint: string, payload: any): Promise<any> {
    const cert = fs.readFileSync(this.certificatePath);
    const key = fs.readFileSync(this.privateKeyPath);

    const config = {
      headers: { 'Content-Type': 'application/json' },
      httpsAgent: new https.Agent({
        cert,
        key,
        rejectUnauthorized: false, // Solo para sandbox
      }),
    };

    const response = await firstValueFrom(
      this.httpService.post(this.apiUrl + endpoint, payload, config),
    );

    return response.data;
  }
}
```

### Integración INFONAVIT

```typescript
// infonavit-integration.service.ts
@Injectable()
export class INFONAVITIntegrationService {
  /**
   * Calcular aportaciones bimestrales (5% del SBC)
   */
  async calcularAportaciones(
    constructoraId: string,
    periodNumber: number, // 1-6 (bimestre)
    periodYear: number,
  ): Promise<{ totalAportaciones: number; empleados: any[] }> {
    const { startDate, endDate } = this.getBimestreDates(periodNumber, periodYear);

    const employees = await this.getActiveEmployeesForPeriod(
      constructoraId,
      startDate,
      endDate,
    );

    let totalAportaciones = 0;
    const detalles = [];

    for (const employee of employees) {
      const diasCotizados = 60; // Simplificado: 60 días por bimestre
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

    return { totalAportaciones, empleados: detalles };
  }

  /**
   * Calcular descuento por crédito INFONAVIT
   */
  async calcularDescuentoCredito(
    employeeId: string,
    salarioBruto: number,
  ): Promise<number> {
    const credit = await this.creditRepo.findOne({
      where: { employeeId, isActive: true },
    });

    if (!credit) return 0;

    let descuento = 0;

    switch (credit.discountType) {
      case 'VSM': {
        const salarioMinimo = 248.93; // 2025
        descuento = salarioMinimo * credit.discountValue * 30;
        break;
      }
      case 'percentage': {
        descuento = salarioBruto * (credit.discountValue / 100);
        break;
      }
      case 'fixed': {
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
}
```

---

## 🧪 Casos de Prueba

### TC-IMSS-001: Alta de Trabajador ✅

**Precondiciones:**
- Empleado con datos completos (CURP, NSS, RFC)
- No dado de alta previamente en IMSS

**Pasos:**
1. Ir a empleado > "Registrar en IMSS"
2. Verificar datos pre-llenados
3. Confirmar SBC: $500
4. Hacer clic en "Enviar Alta"

**Resultado esperado:**
- Request enviado a API IMSS
- Response 200 OK con folio
- Log guardado con status "success"
- Badge "IMSS: Registrado ✓" visible
- Toast: "✓ Alta registrada con folio IMSS-2025-11-17-00123"

### TC-IMSS-002: Generación de Archivo SUA ✅

**Precondiciones:**
- 52 empleados activos en noviembre 2025
- Todos dados de alta en IMSS

**Pasos:**
1. Ir a "IMSS" > "Generar Archivo SUA"
2. Seleccionar noviembre 2025
3. Ver preview de 52 empleados
4. Hacer clic en "Generar"

**Resultado esperado:**
- Archivo descargado: `SUA_202511_A1234567890.txt`
- Formato correcto (80 caracteres por línea)
- Header: `*************112025A1234567890`
- 52 líneas de empleados
- Línea de totales al final
- Registro guardado en DB

### TC-INFONAVIT-001: Cálculo de Aportaciones ✅

**Precondiciones:**
- Bimestre 5 (Sep-Oct) 2025
- 52 empleados con SBC promedio $500

**Pasos:**
1. Ir a "INFONAVIT" > "Calcular Aportaciones"
2. Seleccionar Bimestre 5, 2025
3. Ver cálculo automático

**Resultado esperado:**
- Empleado Juan Pérez:
  - SBC: $500
  - Días: 60
  - Aportación: $500 × 60 × 0.05 = $1,500 ✓
- Total 52 empleados: ~$78,000

### TC-INFONAVIT-002: Descuento por Crédito ✅

**Precondiciones:**
- Empleado con crédito tipo VSM: 2.5
- Salario bruto mensual: $10,500

**Pasos:**
1. Calcular descuento automáticamente

**Resultado esperado:**
- Descuento VSM: $248.93 × 2.5 × 30 = $18,669.75
- Validar 30% máximo: $10,500 × 0.3 = $3,150
- **Descuento aplicado:** $3,150 (limitado a 30%) ✓

---

## 📦 Dependencias

### Dependencias de Otros US

- ✅ **US-HR-001:** Empleados con datos fiscales completos
- ⏳ **US-HR-003:** Cálculo de SBC

### Configuración Requerida

```bash
# .env.production
IMSS_API_URL=https://api.imss.gob.mx/v1
IMSS_REGISTRO_PATRONAL=A1234567890
IMSS_CERTIFICATE_PATH=/secrets/imss-cert.cer
IMSS_PRIVATE_KEY_PATH=/secrets/imss-key.key

INFONAVIT_API_URL=https://api.infonavit.org.mx/v1
INFONAVIT_REGISTRO_PATRONAL=1234567890
INFONAVIT_API_KEY=your-api-key
INFONAVIT_ACCESS_TOKEN=your-oauth-token
```

---

## ⚠️ Riesgos

### R-1: Cambios en API Gubernamentales

**Descripción:** IMSS/INFONAVIT pueden cambiar APIs sin aviso
**Impacto:** Crítico
**Probabilidad:** Media
**Mitigación:**
- Modo sandbox para desarrollo
- Monitoreo de errores 24/7
- Contacto directo con soporte técnico gubernamental

### R-2: Certificados Digitales Expirados

**Descripción:** Certificados .cer/.key expiran anualmente
**Impacto:** Alto
**Probabilidad:** Alta
**Mitigación:**
- Alertas 30 días antes de expiración
- Proceso documentado de renovación
- Respaldo de certificados en vault seguro

---

## 📊 Métricas de Éxito

- ✅ 100% de altas/bajas reportadas dentro de plazo legal (5 días)
- ✅ 0 multas o sanciones de IMSS/INFONAVIT
- ✅ Archivos SUA generados antes del día 17 de cada mes
- ✅ 100% de créditos INFONAVIT rastreados correctamente

---

## 📋 Checklist de Implementación

### Backend
- [ ] Implementar IMSSIntegrationService
- [ ] Implementar INFONAVITIntegrationService
- [ ] Crear endpoints de alta/baja/modificación
- [ ] Implementar generación de archivo SUA
- [ ] Implementar cálculo de aportaciones
- [ ] Crear sistema de logs de integración
- [ ] Configurar certificados digitales

### Frontend
- [ ] Crear pantalla de alta IMSS
- [ ] Crear generador de archivo SUA
- [ ] Crear calculadora de aportaciones INFONAVIT
- [ ] Crear dashboard de cumplimiento
- [ ] Implementar timeline de movimientos

### Testing
- [ ] Tests de cálculos (5%, 30% límite)
- [ ] Tests de generación de archivos
- [ ] Tests de integración con sandbox

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
