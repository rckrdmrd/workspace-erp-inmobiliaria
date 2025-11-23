# US-HR-004: Integración con Nómina Externa

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** No aplica (funcionalidad de integración)
**ET:** No aplica
**Tipo:** Historia de Usuario
**Prioridad:** Media
**Story Points:** 8
**Sprint:** 10-11
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📖 Historia de Usuario

**Como** Gerente de RRHH o Contador
**Quiero** exportar automáticamente asistencias, incidencias y nómina a mi sistema de nómina externo (CONTPAQi, Aspel NOI, Excel)
**Para** procesar la nómina sin captura manual, reducir errores y tener trazabilidad completa entre asistencia y pago

---

## 🎯 Criterios de Aceptación

### CA-1: Configuración de Sistema de Nómina 🔧

**Dado que** soy Gerente de RRHH con permisos de configuración
**Cuando** accedo a "Configuración" > "Integración de Nómina"
**Entonces** puedo:

1. **Seleccionar Tipo de Sistema:**
   - Opciones disponibles:
     - ☐ CONTPAQi Nóminas
     - ☐ Aspel NOI
     - ☐ Tress Nomipaq
     - ☐ Excel personalizado
     - ☐ API REST personalizada
     - ☐ CSV genérico
   - Seleccionar uno

2. **Configurar Mapeo de Campos:**
   - Ver tabla de mapeo de campos:

   | Campo Interno | Campo Externo | Transformación |
   |---------------|---------------|----------------|
   | employeeCode | NUMERO_EMPLEADO | Ninguna |
   | curp | CURP | Ninguna |
   | nss | NSS | Ninguna |
   | fullName | NOMBRE_COMPLETO | Concatenar |
   | currentSalary | SALARIO_DIARIO | Ninguna |
   | daysWorked | DIAS_TRABAJADOS | Suma mensual |

   - Poder editar nombres de campos externos
   - Poder agregar campos personalizados

3. **Configurar Formato de Exportación:**
   - **Si Excel:**
     - Seleccionar template (.xlsx) con formato deseado
     - Definir hoja donde se escribirán datos
     - Fila de inicio: 5 (ejemplo)
   - **Si CSV:**
     - Delimitador: coma, punto y coma, tab
     - Encoding: UTF-8, Latin1
     - Incluir headers: Sí/No
   - **Si API REST:**
     - URL del endpoint: `https://api.nomina.example.com/v1/attendance`
     - Método: POST
     - Headers personalizados (API Key, etc.)
     - Formato del body: JSON, XML

4. **Programar Exportación Automática:**
   - Frecuencia:
     - ☐ Diaria (lunes a viernes a las 6 PM)
     - ☐ Semanal (viernes a las 6 PM)
     - ☐ Quincenal (días 15 y último del mes)
     - ☐ Mensual (último día del mes)
   - Email de notificación al completar
   - Email de alerta si falla

**Y** guardar configuración con validación completa

### CA-2: Exportación Manual de Asistencias 📤

**Dado que** soy Gerente de RRHH
**Cuando** accedo a "RRHH" > "Exportar a Nómina"
**Entonces** puedo:

1. **Seleccionar Periodo:**
   - Fecha inicio: 2025-11-01
   - Fecha fin: 2025-11-15
   - O seleccionar: "Última quincena", "Último mes"
   - Mostrar preview: "Del 1 al 15 de noviembre (15 días)"

2. **Seleccionar Empleados:**
   - Opción: "Todos los empleados activos" (default)
   - O filtrar por:
     - Obra específica
     - Cuadrilla específica
     - Lista personalizada (checkboxes)
   - Mostrar contador: "52 empleados seleccionados"

3. **Vista Previa de Datos:**
   - Ver tabla con datos que se exportarán:

   | Empleado | NSS | Días Trabajados | Faltas | Incap. | Salario | Total |
   |----------|-----|-----------------|--------|--------|---------|-------|
   | Juan Pérez | 12345678901 | 13 | 2 | 0 | $500 | $6,500 |
   | María López | 98765432109 | 15 | 0 | 0 | $450 | $6,750 |
   | ... | ... | ... | ... | ... | ... | ... |

   - Paginación: 20 empleados por página
   - Totales en footer:
     - Total empleados: 52
     - Total días trabajados: 742
     - Total neto estimado: $371,000

4. **Validaciones Previas:**
   - ✅ Todos los empleados tienen NSS válido
   - ✅ No hay asistencias pendientes de aprobar
   - ⚠️ 3 empleados con advertencias GPS
   - ❌ 1 empleado sin CURP registrado

   Si hay errores críticos (❌):
   - No permitir exportación
   - Mostrar lista de empleados con problemas
   - Botón: "Ir a corregir datos"

5. **Exportar:**
   - Botón: "Exportar a [CONTPAQi]"
   - Spinner: "Generando archivo..."
   - Descarga automática del archivo:
     - Nombre: `Nomina_2025-11-01_2025-11-15_52empleados.xlsx`
     - Tamaño: ~150 KB
   - Toast: "✓ Archivo exportado correctamente"

**Y** registrar log de exportación con usuario, fecha y periodo

### CA-3: Formato de Exportación para CONTPAQi 📊

**Dado que** seleccioné CONTPAQi como sistema de nómina
**Cuando** exporto asistencias
**Entonces** el archivo Excel generado debe tener:

1. **Estructura de Archivo:**
   ```
   Hoja: ASISTENCIAS

   Fila 1: [Logo]
   Fila 2: Reporte de Asistencias
   Fila 3: Periodo: 01/11/2025 - 15/11/2025
   Fila 4: [Vacío]
   Fila 5: [Headers]
   Fila 6+: [Datos]
   ```

2. **Columnas Requeridas:**
   - A: NUMERO_EMPLEADO (texto)
   - B: NOMBRE_COMPLETO (texto)
   - C: NSS (texto, 11 dígitos)
   - D: CURP (texto, 18 caracteres)
   - E: RFC (texto, 13 caracteres)
   - F: DIAS_TRABAJADOS (número, 2 decimales)
   - G: FALTAS (número entero)
   - H: INCAPACIDADES (número entero)
   - I: SALARIO_DIARIO (moneda, 2 decimales)
   - J: TOTAL_PERCIBIDO (fórmula: =F*I)

3. **Formato de Celdas:**
   - Headers (fila 5): Negrita, fondo azul, texto blanco
   - Datos: Arial 10, alineación izquierda para texto, derecha para números
   - Columnas de moneda: formato $#,##0.00

4. **Validaciones de Integridad:**
   - NSS: 11 dígitos exactos, sin guiones
   - CURP: 18 caracteres, mayúsculas
   - DIAS_TRABAJADOS: Max 15 en quincena, 31 en mes
   - SALARIO_DIARIO: Min $248.93 (salario mínimo 2025)

### CA-4: Formato CSV Genérico 📄

**Dado que** seleccioné CSV genérico
**Cuando** exporto
**Entonces** el archivo CSV debe:

1. **Estructura:**
   ```csv
   EMPLEADO_CODIGO,NOMBRE,NSS,CURP,DIAS_TRAB,FALTAS,SALARIO,TOTAL
   EMP-00001,"Pérez García Juan",12345678901,BADD110313HCMLNS09,13,2,500.00,6500.00
   EMP-00002,"López Martínez María",98765432109,LOMM900515MDFPRD08,15,0,450.00,6750.00
   ```

2. **Configuración:**
   - Delimitador: Configurable (coma por defecto)
   - Encoding: UTF-8 con BOM (para Excel)
   - Línea de headers: Sí (configurable)
   - Comillas para texto: Sí (para nombres con comas)

3. **Manejo de Caracteres Especiales:**
   - Acentos: Preservados con UTF-8
   - Ñ: Preservada
   - Comas en nombres: Encerrar en comillas dobles

### CA-5: Integración API REST 🔌

**Dado que** seleccioné API REST personalizada
**Cuando** se ejecuta la exportación (manual o automática)
**Entonces** el sistema debe:

1. **Preparar Payload JSON:**
   ```json
   {
     "period": {
       "startDate": "2025-11-01",
       "endDate": "2025-11-15"
     },
     "company": {
       "id": "constructora-uuid",
       "name": "Constructora ABC",
       "rfc": "CABC850101XYZ"
     },
     "employees": [
       {
         "employeeCode": "EMP-00001",
         "fullName": "Juan Pérez García",
         "nss": "12345678901",
         "curp": "BADD110313HCMLNS09",
         "rfc": "BADD110313AB1",
         "daysWorked": 13,
         "absences": 2,
         "incapacities": 0,
         "dailySalary": 500.00,
         "totalGross": 6500.00
       }
     ],
     "summary": {
       "totalEmployees": 52,
       "totalDays": 742,
       "totalGross": 371000.00
     }
   }
   ```

2. **Enviar Request HTTP:**
   ```typescript
   const response = await axios.post(
     config.payrollApiUrl,
     payload,
     {
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${config.apiKey}`,
         'X-Company-ID': constructoraId,
       },
       timeout: 30000, // 30 segundos
     }
   );
   ```

3. **Manejo de Respuestas:**
   - **200 OK:**
     - Mensaje: "✓ Datos enviados correctamente a sistema de nómina"
     - Guardar `response.data.batchId` para trazabilidad
   - **400 Bad Request:**
     - Mostrar errores de validación del sistema externo
     - Ejemplo: "Empleado NSS 12345678901 no existe en sistema de nómina"
   - **401 Unauthorized:**
     - Error: "API Key inválida, contacta al administrador"
   - **500 Server Error:**
     - Reintentar automáticamente 3 veces con delay (1s, 2s, 4s)
     - Si falla: enviar email de alerta y mostrar error

4. **Logs de Integración:**
   - Registrar cada llamada API:
     - Timestamp
     - URL
     - Payload (resumen, no datos sensibles)
     - Response status
     - Tiempo de respuesta
   - Retención: 90 días

### CA-6: Exportación Automática Programada ⏰

**Dado que** configuré exportación automática quincenal
**Cuando** llega la fecha programada (día 15 a las 6 PM)
**Entonces** el sistema debe:

1. **Ejecutar Exportación Automáticamente:**
   - Detectar que es día 15 del mes
   - A las 18:00 hrs ejecutar job
   - Calcular periodo automáticamente:
     - Si día 15: del 1 al 15
     - Si último día del mes: del 16 al último día

2. **Validar Datos:**
   - Verificar que no hay asistencias pendientes de aprobar
   - Verificar que todos los empleados tienen datos completos
   - Si hay problemas críticos:
     - NO exportar
     - Enviar email a RRHH con lista de problemas
     - Programar reintento para mañana

3. **Generar y Enviar:**
   - Generar archivo según configuración
   - Si es archivo (Excel/CSV):
     - Enviar por email a RRHH con archivo adjunto
   - Si es API:
     - Enviar request
   - Guardar archivo en servidor en:
     - `/storage/payroll-exports/2025/11/nomina_20251115.xlsx`

4. **Notificar Resultado:**
   - Email a RRHH:
     ```
     Asunto: ✓ Exportación automática de nómina completada

     Se exportaron 52 empleados del periodo 01/11/2025 - 15/11/2025

     Resumen:
     - Total días trabajados: 742
     - Total neto estimado: $371,000
     - Archivo adjunto: nomina_20251115.xlsx

     Generado automáticamente el 15/11/2025 a las 18:05 hrs
     ```

   - Si falla:
     ```
     Asunto: ❌ Error en exportación automática de nómina

     No se pudo completar la exportación.

     Errores:
     - 3 empleados sin NSS registrado
     - 5 asistencias pendientes de aprobar

     Por favor, corrige estos problemas y ejecuta la exportación manualmente.
     ```

### CA-7: Incluir Incidencias en Exportación 📝

**Dado que** hay incidencias registradas (faltas, incapacidades, permisos)
**Cuando** exporto asistencias
**Entonces** deben incluirse:

1. **Tipos de Incidencias:**
   - **Falta:** Día laboral sin asistencia (injustificada)
   - **Falta Justificada:** Con documento de respaldo
   - **Incapacidad:** Por enfermedad (IMSS)
   - **Permiso:** Autorizado por supervisor
   - **Vacaciones:** Días de descanso programados
   - **Día Festivo:** Día no laboral pagado

2. **Cálculo de Incidencias:**
   ```
   Periodo: 15 días laborales
   - Asistencias: 13 días
   - Faltas: 2 días
   - Incapacidades: 0 días
   - Permisos: 0 días
   Total verificado: 13 + 2 = 15 ✓
   ```

3. **Columnas en Exportación:**
   - DIAS_TRABAJADOS: 13
   - FALTAS: 2
   - INCAPACIDADES: 0
   - PERMISOS: 0
   - VACACIONES: 0

4. **Validación de Consistencia:**
   - Suma de incidencias debe = días del periodo
   - Si no coincide: marcar con warning
   - Permitir ajuste manual antes de exportar

### CA-8: Importación de Resultados de Nómina (Opcional) 📥

**Dado que** la nómina fue procesada en el sistema externo
**Cuando** importo los resultados de vuelta
**Entonces** puedo:

1. **Subir Archivo de Resultados:**
   - Formato: Excel o CSV
   - Columnas esperadas:
     - EMPLEADO_CODIGO
     - TOTAL_PERCEPCIONES
     - TOTAL_DEDUCCIONES
     - NETO_A_PAGAR
     - FECHA_PAGO

2. **Mapear Datos:**
   - Sistema valida que cada empleado existe
   - Valida que periodo coincide
   - Crea registros en tabla `payroll_results`:
     ```json
     {
       "employeeId": "uuid",
       "period": "2025-11-01_2025-11-15",
       "totalPerceptions": 6500.00,
       "totalDeductions": 1235.00,
       "netPay": 5265.00,
       "paymentDate": "2025-11-16"
     }
     ```

3. **Visualizar en Empleado:**
   - En detalle del empleado, nueva sección: "Historial de Nómina"
   - Mostrar tabla con pagos pasados
   - Solo lectura (no editable)

### CA-9: Permisos por Rol 🔐

**Roles y Permisos:**

| Acción | Director | Engineer | Resident | HR | Finance |
|--------|----------|----------|----------|-----|---------|
| Configurar integración | ✅ | ❌ | ❌ | ✅ | ❌ |
| Exportar manualmente | ✅ | ❌ | ❌ | ✅ | ✅ |
| Ver exportaciones pasadas | ✅ | ❌ | ❌ | ✅ | ✅ |
| Descargar archivos | ✅ | ❌ | ❌ | ✅ | ✅ |
| Importar resultados | ✅ | ❌ | ❌ | ✅ | ✅ |

---

## 🔧 Detalles Técnicos

### Servicio de Exportación

```typescript
// payroll-export.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class PayrollExportService {
  /**
   * Exportar asistencias a Excel (CONTPAQi format)
   */
  async exportToExcel(
    period: { startDate: Date; endDate: Date },
    employeeIds: string[]
  ): Promise<Buffer> {
    // 1. Obtener datos de asistencias
    const data = await this.getAttendanceData(period, employeeIds);

    // 2. Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ASISTENCIAS');

    // 3. Header
    worksheet.getCell('A1').value = 'Reporte de Asistencias';
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    worksheet.getCell('A2').value = `Periodo: ${this.formatDate(period.startDate)} - ${this.formatDate(period.endDate)}`;

    // 4. Column headers (row 5)
    const headers = [
      'NUMERO_EMPLEADO',
      'NOMBRE_COMPLETO',
      'NSS',
      'CURP',
      'RFC',
      'DIAS_TRABAJADOS',
      'FALTAS',
      'INCAPACIDADES',
      'SALARIO_DIARIO',
      'TOTAL_PERCIBIDO',
    ];

    worksheet.getRow(5).values = headers;
    worksheet.getRow(5).font = { bold: true };
    worksheet.getRow(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' },
    };
    worksheet.getRow(5).font = { color: { argb: 'FFFFFF' }, bold: true };

    // 5. Data rows
    let rowIndex = 6;
    for (const employee of data) {
      worksheet.getRow(rowIndex).values = [
        employee.employeeCode,
        employee.fullName,
        employee.nss,
        employee.curp,
        employee.rfc,
        employee.daysWorked,
        employee.absences,
        employee.incapacities,
        employee.dailySalary,
        { formula: `F${rowIndex}*I${rowIndex}` }, // Total
      ];

      // Format salary columns
      worksheet.getCell(`I${rowIndex}`).numFmt = '$#,##0.00';
      worksheet.getCell(`J${rowIndex}`).numFmt = '$#,##0.00';

      rowIndex++;
    }

    // 6. Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // 7. Return buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Exportar a CSV
   */
  async exportToCSV(
    period: { startDate: Date; endDate: Date },
    employeeIds: string[],
    config: CSVConfig
  ): Promise<string> {
    const data = await this.getAttendanceData(period, employeeIds);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'employeeCode', title: 'EMPLEADO_CODIGO' },
        { id: 'fullName', title: 'NOMBRE' },
        { id: 'nss', title: 'NSS' },
        { id: 'curp', title: 'CURP' },
        { id: 'daysWorked', title: 'DIAS_TRAB' },
        { id: 'absences', title: 'FALTAS' },
        { id: 'dailySalary', title: 'SALARIO' },
        { id: 'total', title: 'TOTAL' },
      ],
    });

    const records = data.map(emp => ({
      ...emp,
      total: emp.daysWorked * emp.dailySalary,
    }));

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    return csv;
  }

  /**
   * Enviar a API externa
   */
  async sendToAPI(
    period: { startDate: Date; endDate: Date },
    employeeIds: string[],
    apiConfig: APIConfig
  ): Promise<any> {
    const data = await this.getAttendanceData(period, employeeIds);

    const payload = {
      period: {
        startDate: period.startDate.toISOString().split('T')[0],
        endDate: period.endDate.toISOString().split('T')[0],
      },
      employees: data.map(emp => ({
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        nss: emp.nss,
        curp: emp.curp,
        rfc: emp.rfc,
        daysWorked: emp.daysWorked,
        absences: emp.absences,
        incapacities: emp.incapacities,
        dailySalary: emp.dailySalary,
        totalGross: emp.daysWorked * emp.dailySalary,
      })),
    };

    const response = await axios.post(apiConfig.url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`,
      },
      timeout: 30000,
    });

    // Log the integration
    await this.logIntegration({
      type: 'api_export',
      status: response.status,
      responseTime: response.duration,
      recordCount: data.length,
    });

    return response.data;
  }

  /**
   * Obtener datos de asistencias con incidencias
   */
  private async getAttendanceData(
    period: { startDate: Date; endDate: Date },
    employeeIds: string[]
  ) {
    // Query complejo que une asistencias + incidencias
    const result = await this.db.query(`
      WITH attendance_summary AS (
        SELECT
          e.id as employee_id,
          e.employee_code,
          CONCAT(e.first_name, ' ', e.last_name) as full_name,
          e.nss,
          e.curp,
          e.rfc,
          e.current_salary as daily_salary,
          COALESCE(SUM(lc.days_worked), 0) as days_worked
        FROM hr.employees e
        LEFT JOIN hr.labor_costs lc ON lc.employee_id = e.id
          AND lc.work_date >= $1
          AND lc.work_date <= $2
        WHERE e.id = ANY($3)
        GROUP BY e.id
      ),
      incidences_summary AS (
        SELECT
          employee_id,
          COUNT(*) FILTER (WHERE type = 'absence') as absences,
          COUNT(*) FILTER (WHERE type = 'incapacity') as incapacities,
          COUNT(*) FILTER (WHERE type = 'permission') as permissions
        FROM hr.incidences
        WHERE incidence_date >= $1 AND incidence_date <= $2
        GROUP BY employee_id
      )
      SELECT
        a.*,
        COALESCE(i.absences, 0) as absences,
        COALESCE(i.incapacities, 0) as incapacities,
        COALESCE(i.permissions, 0) as permissions
      FROM attendance_summary a
      LEFT JOIN incidences_summary i ON i.employee_id = a.employee_id
      ORDER BY a.full_name
    `, [period.startDate, period.endDate, employeeIds]);

    return result.rows;
  }
}
```

### Job Programado

```typescript
// payroll-export.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PayrollExportService } from './payroll-export.service';

@Injectable()
export class PayrollExportCron {
  constructor(
    private payrollExportService: PayrollExportService,
    private emailService: EmailService,
  ) {}

  /**
   * Ejecutar exportación automática quincenalmente
   * Día 15 y último día del mes a las 6 PM
   */
  @Cron('0 18 15,L * *', { // L = último día del mes
    name: 'payroll-export-automatic',
    timeZone: 'America/Mexico_City',
  })
  async handleAutomaticExport() {
    console.log('🕐 Iniciando exportación automática de nómina...');

    const today = new Date();
    const period = this.calculatePeriod(today);

    try {
      // 1. Validar que no hay problemas
      const validation = await this.validateExportReady(period);

      if (!validation.isValid) {
        await this.emailService.send({
          to: 'rrhh@constructora.com',
          subject: '❌ Exportación automática de nómina: Errores detectados',
          body: this.buildErrorEmail(validation.errors),
        });
        return;
      }

      // 2. Exportar
      const buffer = await this.payrollExportService.exportToExcel(
        period,
        validation.employeeIds
      );

      // 3. Guardar archivo
      const filename = `nomina_${this.formatDate(today)}.xlsx`;
      await this.storageService.save(`payroll-exports/${filename}`, buffer);

      // 4. Enviar email con archivo
      await this.emailService.send({
        to: 'rrhh@constructora.com',
        subject: '✓ Exportación automática de nómina completada',
        body: this.buildSuccessEmail(validation.summary),
        attachments: [
          {
            filename,
            content: buffer,
          },
        ],
      });

      console.log('✓ Exportación automática completada');
    } catch (error) {
      console.error('Error en exportación automática:', error);

      await this.emailService.send({
        to: 'rrhh@constructora.com',
        subject: '❌ Error en exportación automática de nómina',
        body: `Error técnico: ${error.message}`,
      });
    }
  }

  private calculatePeriod(date: Date): { startDate: Date; endDate: Date } {
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    if (day === 15) {
      // Primera quincena: del 1 al 15
      return {
        startDate: new Date(year, month, 1),
        endDate: new Date(year, month, 15),
      };
    } else {
      // Segunda quincena: del 16 al último día
      return {
        startDate: new Date(year, month, 16),
        endDate: new Date(year, month + 1, 0), // Último día del mes
      };
    }
  }
}
```

---

## 🧪 Casos de Prueba

### TC-PAY-001: Exportación Manual a Excel ✅

**Precondiciones:**
- 52 empleados activos
- Periodo: 01/11/2025 - 15/11/2025
- Configuración: CONTPAQi Excel

**Pasos:**
1. Ir a "RRHH" > "Exportar a Nómina"
2. Seleccionar periodo 01/11 - 15/11
3. Seleccionar "Todos los empleados activos"
4. Hacer clic en "Exportar"

**Resultado esperado:**
- Archivo descargado: `Nomina_2025-11-01_2025-11-15_52empleados.xlsx`
- Tamaño: ~150 KB
- Al abrir archivo:
  - Hoja "ASISTENCIAS" existe
  - Fila 5 tiene headers correcto
  - Fila 6 tiene primer empleado
  - 52 empleados en total (filas 6-57)
  - Columnas formateadas correctamente
  - Totales calculados con fórmulas

### TC-PAY-002: Validación Antes de Exportar ❌

**Precondiciones:**
- 3 empleados sin NSS registrado
- 5 asistencias pendientes de aprobar

**Pasos:**
1. Intentar exportar nómina

**Resultado esperado:**
- Validación falla
- Mensaje de error:
  ```
  ❌ No se puede exportar

  Problemas encontrados:
  - 3 empleados sin NSS:
    • Juan López (EMP-00045)
    • María García (EMP-00051)
    • Carlos Ruiz (EMP-00052)
  - 5 asistencias pendientes de aprobar

  Por favor, corrige estos problemas antes de exportar.
  ```
- Botón "Ir a corregir" visible
- Botón "Exportar" deshabilitado

### TC-PAY-003: Exportación a CSV ✅

**Precondiciones:**
- Configuración: CSV genérico
- Delimitador: coma
- Encoding: UTF-8

**Pasos:**
1. Exportar nómina a CSV

**Resultado esperado:**
- Archivo: `Nomina_2025-11-01_2025-11-15.csv`
- Contenido:
  ```csv
  EMPLEADO_CODIGO,NOMBRE,NSS,CURP,DIAS_TRAB,FALTAS,SALARIO,TOTAL
  EMP-00001,"Pérez García Juan",12345678901,BADD110313HCMLNS09,13,2,500.00,6500.00
  EMP-00002,"López Martínez María",98765432109,LOMM900515MDFPRD08,15,0,450.00,6750.00
  ```
- Acentos preservados correctamente
- Comillas en nombres con comas

### TC-PAY-004: Integración API REST ✅

**Precondiciones:**
- Configuración API:
  - URL: `https://api.nomina.test.com/v1/attendance`
  - API Key: válida
- Mock server respondiendo 200 OK

**Pasos:**
1. Exportar usando API

**Resultado esperado:**
- Request enviado a API con payload JSON correcto
- Response 200 OK recibida
- `batchId` guardado: `BATCH-2025-11-15-001`
- Toast: "✓ Datos enviados correctamente"
- Log de integración registrado:
  - Timestamp: 2025-11-15 18:05:32
  - Status: 200
  - Response time: 1.2s
  - Records: 52

### TC-PAY-005: Exportación Automática Quincenal ⏰

**Precondiciones:**
- Fecha: 15 de noviembre a las 6 PM
- Configuración automática activa
- 52 empleados con datos completos

**Pasos:**
1. Cron job se ejecuta automáticamente

**Resultado esperado:**
- Exportación ejecutada
- Archivo generado y guardado en:
  `/storage/payroll-exports/2025/11/nomina_20251115.xlsx`
- Email enviado a RRHH:
  - Asunto: "✓ Exportación automática completada"
  - Archivo adjunto
  - Resumen de 52 empleados, 742 días, $371,000
- Log registrado

### TC-PAY-006: Fallo en Exportación Automática ❌

**Precondiciones:**
- Fecha: 15 de noviembre
- 3 empleados sin datos completos

**Pasos:**
1. Cron job se ejecuta

**Resultado esperado:**
- Validación detecta problemas
- Exportación NO se ejecuta
- Email de alerta enviado:
  - Asunto: "❌ Error en exportación automática"
  - Lista de problemas
  - Instrucciones para corrección manual
- Reintento programado para mañana

### TC-PAY-007: Incluir Incidencias ✅

**Precondiciones:**
- Empleado trabajó 13 días
- 2 faltas registradas
- 0 incapacidades

**Pasos:**
1. Exportar nómina

**Resultado esperado:**
- Fila del empleado muestra:
  - DIAS_TRABAJADOS: 13
  - FALTAS: 2
  - INCAPACIDADES: 0
- Suma: 13 + 2 = 15 (total de días del periodo) ✓

---

## 📦 Dependencias

### Dependencias de Otros US

- ✅ **US-HR-001:** Empleados con datos completos (NSS, CURP, RFC)
- ⏳ **US-HR-002:** Asistencias registradas
- ⏳ **US-HR-003:** Cálculo de días trabajados

### Librerías Backend

```json
{
  "exceljs": "^4.4.0",
  "csv-writer": "^1.6.0",
  "@nestjs/schedule": "^4.0.0",
  "axios": "^1.6.2"
}
```

---

## ⚠️ Riesgos

### R-1: Cambios de Formato del Sistema Externo

**Descripción:** Sistema de nómina cambia estructura sin aviso
**Impacto:** Alto
**Probabilidad:** Media
**Mitigación:**
- Versionado de templates
- Alertas automáticas si validación falla
- Documentar formato esperado

---

## 📊 Métricas de Éxito

**Métricas de Negocio:**
- ✅ 95% de exportaciones exitosas en primer intento
- ✅ Reducción de 80% en tiempo de captura manual
- ✅ 0 errores de captura vs método manual

**Métricas Técnicas:**
- ✅ Exportación de 100 empleados en < 10 segundos
- ✅ 100% de exportaciones automáticas ejecutadas a tiempo
- ✅ API response time < 5 segundos

---

## 📋 Checklist de Implementación

### Backend
- [ ] Crear PayrollExportService con métodos de exportación
- [ ] Implementar generación de Excel con ExcelJS
- [ ] Implementar generación de CSV
- [ ] Implementar integración API REST
- [ ] Crear PayrollExportCron para ejecución automática
- [ ] Crear endpoints de configuración
- [ ] Implementar validaciones pre-exportación
- [ ] Implementar logs de integración
- [ ] Crear EmailService para notificaciones

### Frontend
- [ ] Crear página PayrollExportConfig
- [ ] Crear componente ExportWizard
- [ ] Crear tabla de preview de datos
- [ ] Implementar validaciones visuales
- [ ] Crear historial de exportaciones
- [ ] Implementar descargas de archivos

### Testing
- [ ] Tests de generación Excel
- [ ] Tests de generación CSV
- [ ] Tests de API integration
- [ ] Tests de cron job
- [ ] Tests de validaciones

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
