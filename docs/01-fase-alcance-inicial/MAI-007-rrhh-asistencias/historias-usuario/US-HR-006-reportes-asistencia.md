# US-HR-006: Reportes de Asistencia

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** No aplica (funcionalidad de reportes)
**ET:** No aplica
**Tipo:** Historia de Usuario
**Prioridad:** Media
**Story Points:** 5
**Sprint:** 11
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📖 Historia de Usuario

**Como** Gerente de RRHH, Residente de Obra o Director
**Quiero** generar reportes detallados de asistencia con filtros y exportación
**Para** analizar patrones de ausentismo, detectar problemas de puntualidad, tomar decisiones informadas sobre el personal y generar reportes para auditorías

---

## 🎯 Criterios de Aceptación

### CA-1: Reporte Diario de Asistencia 📅

**Dado que** soy Residente de Obra o Gerente de RRHH
**Cuando** accedo a "Reportes" > "Asistencia Diaria"
**Entonces** puedo:

1. **Seleccionar Filtros:**
   - **Fecha:** 2025-11-17 (default: hoy)
   - **Obra:** "Casa Modelo Norte" o "Todas las obras"
   - **Cuadrilla:** "Albañilería A" o "Todas las cuadrillas"

2. **Ver Resumen del Día:**
   ```
   ┌─────────────────────────────────────┐
   │ Resumen de Asistencia - 17/11/2025  │
   ├─────────────────────────────────────┤
   │ ✅ Presentes: 45 (86%)              │
   │ ❌ Ausentes: 7 (14%)                │
   │ ⏰ Retardos: 5 (11% de presentes)   │
   │ 🏥 Incapacidades: 0                 │
   │ 📝 Permisos: 0                      │
   │ Total empleados: 52                 │
   └─────────────────────────────────────┘
   ```

3. **Ver Tabla Detallada:**

   | Empleado | Cuadrilla | Check-In | Check-Out | Horas | Estado | GPS |
   |----------|-----------|----------|-----------|-------|--------|-----|
   | Juan Pérez | Albañilería A | 07:15 | 17:30 | 10:15 | ✅ Presente | ✓ |
   | María López | Albañilería A | 07:45 | 17:35 | 09:50 | ⏰ Retardo | ✓ |
   | Carlos Ruiz | Electricidad | - | - | 0:00 | ❌ Ausente | - |

4. **Indicadores Visuales:**
   - **Verde ✅:** Presente y puntual (check-in antes de 7:30 AM)
   - **Amarillo ⏰:** Retardo (check-in después de 7:30 AM)
   - **Rojo ❌:** Ausente (sin check-in)
   - **Azul 🏥:** Incapacidad médica
   - **Morado 📝:** Permiso autorizado

5. **Acciones:**
   - Exportar a PDF: "Asistencia_17Nov2025.pdf"
   - Exportar a Excel: "Asistencia_17Nov2025.xlsx"
   - Enviar por email
   - Imprimir

**Y** el reporte debe actualizarse en tiempo real conforme se registran asistencias

### CA-2: Reporte Semanal de Asistencia 📊

**Dado que** necesito analizar una semana completa
**Cuando** selecciono "Reporte Semanal"
**Entonces** veo:

1. **Seleccionar Semana:**
   - Semana del: 13/11/2025 al 17/11/2025 (L-V)
   - Selector de semana con navegación ← →

2. **Vista de Tabla Resumen:**

   | Empleado | Lun | Mar | Mié | Jue | Vie | Total | % Asist. |
   |----------|-----|-----|-----|-----|-----|-------|----------|
   | Juan Pérez | ✅ | ✅ | ✅ | ✅ | ✅ | 5/5 | 100% |
   | María López | ✅ | ⏰ | ✅ | ✅ | ❌ | 4/5 | 80% |
   | Carlos Ruiz | ✅ | ✅ | 🏥 | 🏥 | 🏥 | 2/5 | 40% |

3. **Gráfica de Asistencia Semanal:**
   - Gráfica de barras por día:
     ```
     50 ┤     ██
     40 ┤     ██  ██
     30 ┤  ██ ██  ██  ██
     20 ┤  ██ ██  ██  ██  ██
     10 ┤  ██ ██  ██  ██  ██
      0 ┴──────────────────────
         Lun Mar Mié Jue Vie
     ```
   - Leyenda: Verde (presentes), Amarillo (retardos), Rojo (ausencias)

4. **Top 5 Ausencias:**
   - Lista de empleados con más ausencias en la semana
   - Sugerencia de seguimiento

### CA-3: Reporte Mensual de Asistencia 📆

**Dado que** necesito un análisis mensual
**Cuando** selecciono "Reporte Mensual"
**Entonces** veo:

1. **Seleccionar Mes:**
   - Mes: Noviembre 2025
   - Días laborales: 21 (excluyendo sábados y domingos)

2. **Resumen Mensual:**
   ```
   ┌──────────────────────────────────────┐
   │ Noviembre 2025 - Asistencia General  │
   ├──────────────────────────────────────┤
   │ Promedio de asistencia diaria: 89%   │
   │ Total días-hombre: 978               │
   │ Total ausencias: 124                 │
   │ Total retardos: 87                   │
   │ Día con más ausencias: 15/11 (12)    │
   │ Día con más retardos: 18/11 (9)      │
   └──────────────────────────────────────┘
   ```

3. **Tabla por Empleado:**

   | Empleado | Días Lab. | Presentes | Ausencias | Retardos | % Asist. | Estatus |
   |----------|-----------|-----------|-----------|----------|----------|---------|
   | Juan Pérez | 21 | 21 | 0 | 1 | 100% | 🟢 Excelente |
   | María López | 21 | 18 | 3 | 5 | 85.7% | 🟡 Regular |
   | Carlos Ruiz | 21 | 15 | 6 | 2 | 71.4% | 🔴 Atención |

4. **Clasificación de Estatus:**
   - 🟢 **Excelente:** ≥ 95% asistencia
   - 🟡 **Regular:** 80-94% asistencia
   - 🔴 **Atención requerida:** < 80% asistencia

5. **Gráfica de Tendencia:**
   - Línea de % de asistencia por día del mes
   - Identificar patrones (ej: lunes con más ausencias)

### CA-4: Reporte de Ausentismo 📉

**Dado que** necesito analizar patrones de ausentismo
**Cuando** accedo a "Reporte de Ausentismo"
**Entonces** puedo:

1. **Ver Estadísticas Generales:**
   - Tasa de ausentismo: 11.2%
   - Promedio de industria: 8-10% (benchmark)
   - Tendencia: ↑ +2.5% vs mes anterior

2. **Ausentismo por Tipo:**
   ```
   Faltas injustificadas: 45% (56 días)
   Incapacidades médicas: 35% (44 días)
   Permisos autorizados: 15% (19 días)
   Faltas justificadas: 5% (6 días)
   ```

3. **Ausentismo por Día de la Semana:**
   - Gráfica de pastel o barras:
     - Lunes: 35% (mayor ausentismo)
     - Viernes: 25%
     - Martes: 15%
     - Miércoles: 13%
     - Jueves: 12%

4. **Empleados con Mayor Ausentismo:**

   | Empleado | Total Ausencias | Último Mes | Tendencia |
   |----------|-----------------|------------|-----------|
   | Carlos Ruiz | 12 | 6 | ↑ Incrementando |
   | Pedro Gómez | 9 | 3 | → Estable |
   | Luis Martínez | 7 | 2 | ↓ Mejorando |

5. **Acciones Sugeridas:**
   - 🔴 **Alerta:** 3 empleados con > 10 ausencias en 30 días
   - Botón: "Generar plan de seguimiento"
   - Botón: "Agendar reunión con empleado"

### CA-5: Reporte de Puntualidad ⏰

**Dado que** necesito monitorear puntualidad
**Cuando** acceso a "Reporte de Puntualidad"
**Entonces** veo:

1. **Configuración de Horarios:**
   - Hora de entrada esperada: 7:30 AM (configurable)
   - Tolerancia: 15 minutos (configurable)
   - Retardo > 15 min: Se marca como retardo

2. **Resumen de Puntualidad:**
   ```
   ┌────────────────────────────────────┐
   │ Puntualidad - Noviembre 2025       │
   ├────────────────────────────────────┤
   │ ✅ Puntuales: 891 (91%)            │
   │ ⏰ Retardos: 87 (9%)               │
   │ Promedio de minutos de retardo: 22 │
   │ Mayor retardo: 1h 15min            │
   └────────────────────────────────────┘
   ```

3. **Tabla de Retardos:**

   | Fecha | Empleado | Esperado | Real | Minutos Retardo | Motivo |
   |-------|----------|----------|------|-----------------|--------|
   | 15/11 | María López | 07:30 | 07:45 | 15 | Tráfico |
   | 15/11 | Juan García | 07:30 | 08:45 | 75 | - |

4. **Empleados con Más Retardos:**

   | Empleado | Total Retardos | Promedio Min. | Estatus |
   |----------|----------------|---------------|---------|
   | María López | 12 | 18 min | 🟡 Advertencia |
   | Juan García | 8 | 45 min | 🔴 Crítico |

5. **Gráfica de Distribución:**
   - Histograma de minutos de retardo:
     ```
     40 ┤ ██
     30 ┤ ██  ██
     20 ┤ ██  ██  ██
     10 ┤ ██  ██  ██  ██
      0 ┴────────────────────
        0-15 15-30 30-60 >60
        min  min   min  min
     ```

### CA-6: Reporte por Obra 🏗️

**Dado que** soy Residente de Obra
**Cuando** genero reporte de mi obra específica
**Entonces** veo:

1. **Selección:**
   - Obra: Casa Modelo Residencial Norte
   - Periodo: Última semana / Último mes / Personalizado

2. **Dashboard de la Obra:**
   ```
   ┌────────────────────────────────────┐
   │ Casa Modelo Residencial Norte      │
   ├────────────────────────────────────┤
   │ Empleados asignados: 24            │
   │ Promedio asistencia: 92%           │
   │ Cuadrillas activas: 3              │
   │ Total días-hombre (mes): 504       │
   └────────────────────────────────────┘
   ```

3. **Asistencia por Cuadrilla:**

   | Cuadrilla | Empleados | Presentes Hoy | % Asist. Mes |
   |-----------|-----------|---------------|--------------|
   | Albañilería A | 10 | 9 | 95% |
   | Electricidad | 8 | 8 | 88% |
   | Plomería | 6 | 5 | 90% |

4. **Comparación con Otras Obras:**
   - Gráfica de barras comparando % de asistencia
   - Posición: 2° de 5 obras activas

### CA-7: Reporte de Incidencias 📝

**Dado que** necesito rastrear incidencias
**Cuando** accedo a "Reporte de Incidencias"
**Entonces** veo:

1. **Tipos de Incidencias:**
   - Incapacidades médicas: 44 (IMSS)
   - Permisos personales: 19
   - Faltas justificadas: 6
   - Accidentes de trabajo: 2

2. **Tabla de Incidencias:**

   | Fecha | Empleado | Tipo | Días | Documentado | Aprobado |
   |-------|----------|------|------|-------------|----------|
   | 10/11 | Juan Pérez | Incapacidad | 3 | ✅ | ✅ |
   | 12/11 | María López | Permiso | 1 | ✅ | ✅ |
   | 15/11 | Carlos Ruiz | Falta Just. | 1 | ❌ | ⏳ |

3. **Filtros:**
   - Por tipo de incidencia
   - Por estado: Pendiente, Aprobado, Rechazado
   - Por fecha

4. **Documentos Adjuntos:**
   - Ver/descargar documentos de respaldo (recetas médicas, etc.)

### CA-8: Exportación de Reportes 📤

**Dado que** genero cualquier reporte
**Cuando** hago clic en "Exportar"
**Entonces** puedo:

1. **Seleccionar Formato:**
   - 📄 **PDF:** Para impresión o firma
   - 📊 **Excel (.xlsx):** Para análisis adicional
   - 📋 **CSV:** Para importar a otros sistemas

2. **Exportación PDF:**
   - Header con logo de la empresa
   - Título del reporte y periodo
   - Tablas con formato profesional
   - Footer con:
     - Fecha de generación
     - Usuario que generó
     - Página X de Y
   - Tamaño: Carta (8.5" × 11")

3. **Exportación Excel:**
   - Hoja "Resumen" con métricas
   - Hoja "Detalle" con datos completos
   - Formato de celdas (moneda, porcentajes, fechas)
   - Fórmulas incluidas
   - Filtros automáticos en headers

4. **Envío por Email:**
   - Modal: "Enviar Reporte por Email"
   - Destinatarios: rrhh@constructora.com (editable)
   - Asunto: "Reporte de Asistencia - Noviembre 2025"
   - Mensaje personalizable
   - Adjuntar archivo en formato seleccionado

### CA-9: Dashboard Ejecutivo 📈

**Dado que** soy Director
**Cuando** accedo a "Dashboard Ejecutivo de RRHH"
**Entonces** veo:

1. **KPIs Principales:**
   ```
   ┌───────────────┬───────────────┬───────────────┐
   │ Tasa Asist.   │ Ausentismo    │ Puntualidad   │
   │ 89%           │ 11%           │ 91%           │
   │ ↑ +2% vs ant. │ ↓ -1.5%       │ ↑ +3%         │
   └───────────────┴───────────────┴───────────────┘
   ```

2. **Gráficas de Tendencia:**
   - Línea de asistencia últimos 6 meses
   - Comparación año actual vs año anterior

3. **Top Performers:**
   - Obras con mejor asistencia
   - Cuadrillas con mejor puntualidad
   - Empleados destacados (100% asistencia)

4. **Alertas Críticas:**
   - 3 empleados con riesgo de deserción (> 15 ausencias)
   - 2 obras con asistencia < 80%
   - 1 cuadrilla con 40% de retardos

### CA-10: Permisos por Rol 🔐

**Roles y Permisos:**

| Reporte | Director | Engineer | Resident | HR | Finance |
|---------|----------|----------|----------|-----|---------|
| Reporte Diario | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reporte Semanal/Mensual | ✅ | ✅ | ✅ (solo su obra) | ✅ | ❌ |
| Reporte de Ausentismo | ✅ | ❌ | ❌ | ✅ | ❌ |
| Reporte de Puntualidad | ✅ | ✅ | ✅ (solo su obra) | ✅ | ❌ |
| Dashboard Ejecutivo | ✅ | ❌ | ❌ | ✅ | ❌ |
| Exportar a PDF/Excel | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔧 Detalles Técnicos

### Servicio de Reportes

```typescript
// attendance-reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

@Injectable()
export class AttendanceReportsService {
  /**
   * Generar reporte diario de asistencia
   */
  async getDailyReport(
    constructoraId: string,
    date: Date,
    filters?: { workId?: string; crewId?: string }
  ) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Query de asistencias del día
    const query = this.attendanceRepo
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.employee', 'emp')
      .leftJoinAndSelect('emp.crewMemberships', 'crew')
      .where('att.workDate = :date', { date: startOfDay })
      .andWhere('emp.constructoraId = :constructoraId', { constructoraId });

    if (filters?.workId) {
      query.andWhere('att.workId = :workId', { workId: filters.workId });
    }

    if (filters?.crewId) {
      query.andWhere('crew.crewId = :crewId', { crewId: filters.crewId });
    }

    const attendances = await query.getMany();

    // Calcular estadísticas
    const total = attendances.length;
    const present = attendances.filter(a => a.type === 'check_in').length;
    const late = attendances.filter(a => {
      if (a.type !== 'check_in') return false;
      const checkInTime = new Date(a.timestamp).getHours() * 60 +
                         new Date(a.timestamp).getMinutes();
      const expectedTime = 7 * 60 + 30; // 7:30 AM
      return checkInTime > expectedTime + 15; // Más de 15 min tarde
    }).length;

    return {
      date: startOfDay,
      summary: {
        total,
        present,
        absent: total - present,
        late,
        presentPercentage: (present / total) * 100,
      },
      details: attendances.map(att => ({
        employeeId: att.employeeId,
        employeeName: att.employee.fullName,
        crewName: att.employee.crewMemberships[0]?.crew?.name,
        checkIn: att.type === 'check_in' ? att.timestamp : null,
        checkOut: att.type === 'check_out' ? att.timestamp : null,
        hoursWorked: this.calculateHours(att),
        status: this.getAttendanceStatus(att),
        gpsValidated: !att.locationWarning,
      })),
    };
  }

  /**
   * Generar reporte mensual
   */
  async getMonthlyReport(
    constructoraId: string,
    month: number,
    year: number
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Query complejo con agregaciones
    const result = await this.db.query(`
      SELECT
        e.id,
        e.employee_code,
        CONCAT(e.first_name, ' ', e.last_name) as full_name,
        COUNT(DISTINCT att.work_date) FILTER (WHERE att.type = 'check_in') as days_present,
        $1 - COUNT(DISTINCT att.work_date) FILTER (WHERE att.type = 'check_in') as days_absent,
        COUNT(*) FILTER (
          WHERE att.type = 'check_in'
          AND EXTRACT(HOUR FROM att.timestamp) * 60 + EXTRACT(MINUTE FROM att.timestamp) > 450
        ) as late_count,
        ROUND(
          COUNT(DISTINCT att.work_date) FILTER (WHERE att.type = 'check_in')::numeric / $1 * 100,
          1
        ) as attendance_percentage
      FROM hr.employees e
      LEFT JOIN hr.attendance_records att ON att.employee_id = e.id
        AND att.work_date >= $2
        AND att.work_date <= $3
      WHERE e.constructora_id = $4
      GROUP BY e.id
      ORDER BY attendance_percentage DESC
    `, [this.getWorkDays(month, year), startDate, endDate, constructoraId]);

    return {
      month,
      year,
      workDays: this.getWorkDays(month, year),
      employees: result.rows,
      summary: {
        averageAttendance: result.rows.reduce((sum, emp) =>
          sum + parseFloat(emp.attendance_percentage), 0) / result.rows.length,
        totalAbsences: result.rows.reduce((sum, emp) =>
          sum + parseInt(emp.days_absent), 0),
        totalLate: result.rows.reduce((sum, emp) =>
          sum + parseInt(emp.late_count), 0),
      },
    };
  }

  private getAttendanceStatus(attendance: AttendanceRecord): string {
    if (!attendance) return 'absent';

    const checkInTime = new Date(attendance.timestamp).getHours() * 60 +
                       new Date(attendance.timestamp).getMinutes();
    const expectedTime = 7 * 60 + 30;

    if (checkInTime <= expectedTime + 15) return 'present';
    return 'late';
  }
}
```

### Generación de PDF

```typescript
// pdf-generator.service.ts
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PDFGeneratorService {
  async generateAttendanceReport(data: any): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // Header
    doc
      .fontSize(20)
      .text('Reporte de Asistencia', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Periodo: ${this.formatDate(data.startDate)} - ${this.formatDate(data.endDate)}`)
      .text(`Generado: ${new Date().toLocaleString('es-MX')}`)
      .moveDown();

    // Summary
    doc
      .fontSize(14)
      .text('Resumen', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Total empleados: ${data.summary.total}`)
      .text(`Presentes: ${data.summary.present} (${data.summary.presentPercentage.toFixed(1)}%)`)
      .text(`Ausentes: ${data.summary.absent}`)
      .text(`Retardos: ${data.summary.late}`)
      .moveDown();

    // Table
    this.generateTable(doc, data.details);

    // Footer
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .text(
          `Página ${i + 1} de ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
    }

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }

  private generateTable(doc: any, data: any[]) {
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 150;
    const col3 = 250;
    const col4 = 350;
    const col5 = 450;

    // Headers
    doc
      .fontSize(9)
      .text('Empleado', col1, tableTop, { bold: true })
      .text('Check-In', col2, tableTop)
      .text('Check-Out', col3, tableTop)
      .text('Horas', col4, tableTop)
      .text('Estado', col5, tableTop);

    doc.moveDown();

    // Rows
    data.forEach((row) => {
      const y = doc.y;
      doc
        .fontSize(8)
        .text(row.employeeName, col1, y, { width: 90 })
        .text(row.checkIn ? this.formatTime(row.checkIn) : '-', col2, y)
        .text(row.checkOut ? this.formatTime(row.checkOut) : '-', col3, y)
        .text(row.hoursWorked || '0:00', col4, y)
        .text(this.translateStatus(row.status), col5, y);

      doc.moveDown(0.5);
    });
  }
}
```

---

## 🧪 Casos de Prueba

### TC-REP-001: Reporte Diario ✅

**Precondiciones:**
- Fecha: 17/11/2025
- 45 empleados presentes, 7 ausentes

**Pasos:**
1. Ir a "Reportes" > "Asistencia Diaria"
2. Seleccionar fecha 17/11/2025

**Resultado esperado:**
- Resumen muestra:
  - Presentes: 45 (86%)
  - Ausentes: 7 (14%)
- Tabla con 52 empleados
- Exportar a PDF funcional

### TC-REP-002: Reporte Mensual ✅

**Precondiciones:**
- Noviembre 2025, 21 días laborales

**Pasos:**
1. Generar reporte mensual

**Resultado esperado:**
- Promedio asistencia calculado correctamente
- Tabla ordenada por % asistencia DESC
- Clasificación de estatus visible

---

## 📦 Dependencias

- ✅ **US-HR-002:** Asistencias registradas
- ✅ **US-HR-001:** Empleados y cuadrillas

### Librerías

```json
{
  "pdfkit": "^0.14.0",
  "exceljs": "^4.4.0",
  "recharts": "^2.10.3"
}
```

---

## ⚠️ Riesgos

### R-1: Rendimiento con Datos Históricos

**Descripción:** Reportes anuales pueden ser lentos
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- Paginación en reportes
- Índices en tablas
- Cache de reportes frecuentes

---

## 📊 Métricas de Éxito

- ✅ Reportes generan en < 5 segundos
- ✅ 100% de exportaciones exitosas
- ✅ 80% de gerentes usan reportes semanalmente

---

## 📋 Checklist de Implementación

### Backend
- [ ] Implementar AttendanceReportsService
- [ ] Crear queries de agregación
- [ ] Implementar PDFGeneratorService
- [ ] Implementar ExcelGeneratorService
- [ ] Crear endpoints de reportes

### Frontend
- [ ] Crear páginas de reportes
- [ ] Implementar gráficas con Recharts
- [ ] Crear componente de filtros
- [ ] Implementar exportación

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
