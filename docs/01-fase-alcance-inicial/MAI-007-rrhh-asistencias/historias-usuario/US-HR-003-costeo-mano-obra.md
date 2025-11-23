# US-HR-003: Costeo de Mano de Obra por Obra

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-003
**ET:** ET-HR-003
**Tipo:** Historia de Usuario
**Prioridad:** Alta
**Story Points:** 10
**Sprint:** 10
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📖 Historia de Usuario

**Como** Director de Constructora o Ingeniero Residente
**Quiero** un sistema automático que calcule y registre el costo real de mano de obra por obra usando el FSR
**Para** comparar presupuesto vs real, detectar desviaciones temprano y proyectar el costo final al 100% de avance

---

## 🎯 Criterios de Aceptación

### CA-1: Configuración del FSR (Factor de Salario Real) ⚙️

**Dado que** soy Director de Constructora
**Cuando** accedo a "Configuración" > "RRHH" > "Factor de Salario Real"
**Entonces** puedo:

1. **Ver FSR Actual:**
   - Ver tarjeta con FSR total: **1.58**
   - Ver desglose de componentes:
     - IMSS: 23.00%
     - INFONAVIT: 5.00%
     - Aguinaldo: 4.17%
     - Vacaciones: 1.67%
     - Prima Vacacional: 0.42%
     - Domingos: 14.28%
     - Días Festivos: 2.19%
     - Ausentismo: 5.00%
     - Otros: 3.00%
   - **Total: 58%** → FSR = 1 + 0.58 = **1.58**

2. **Editar Componentes:**
   - Poder modificar cada porcentaje individualmente
   - Ver actualización automática del FSR total
   - Ejemplo: Si cambio IMSS a 25%, FSR se recalcula a 1.60
   - Validación: Cada componente debe ser ≥ 0% y ≤ 50%
   - Validación: FSR total debe ser entre 1.0 y 3.0

3. **Guardar Configuración:**
   - Al guardar, se registra fecha de cambio
   - FSR aplica a **nuevos** cálculos (no retroactivo)
   - Mensaje: "FSR actualizado a 1.60. Aplicará a registros posteriores al 2025-11-17"
   - Log de auditoría: quién cambió, cuándo y valores anteriores vs nuevos

**Y** solo el rol Director puede modificar el FSR

### CA-2: Cálculo Automático de Costo al Aprobar Asistencia 🤖

**Dado que** se aprueba un registro de asistencia
**Cuando** el evento `attendance.approved` se dispara
**Entonces** el sistema debe automáticamente:

1. **Obtener Datos del Empleado:**
   - Empleado: Juan Pérez García
   - Salario diario base: $450.00
   - Obra asignada: Casa Modelo Norte
   - Salario específico de obra (si existe): $500.00
   - **Usar:** $500.00 (prioridad a salario específico)

2. **Obtener FSR de la Constructora:**
   - Buscar FSR configurado: 1.58
   - Fecha efectiva: 2025-11-15

3. **Calcular Días Trabajados:**
   - Basado en check-in y check-out:
     - Check-in: 07:15 AM
     - Check-out: 05:30 PM
     - Horas trabajadas: 10h 15min
   - **Si ≥ 8 horas:** 1.0 día
   - **Si 4-8 horas:** 0.5 días
   - **Si < 4 horas:** 0.25 días
   - En este caso: **1.0 día**

4. **Calcular Costo Real:**
   ```
   Costo Real = Salario Diario × Días Trabajados × FSR
   Costo Real = $500.00 × 1.0 × 1.58 = $790.00
   ```

5. **Determinar Partida Presupuestal:**
   - Buscar si el empleado pertenece a una cuadrilla
   - Buscar si la cuadrilla está asignada a una partida presupuestal en esa obra
   - Cuadrilla: Albañilería A
   - Partida asignada: "03.02 - Muro de Block"
   - Si no hay asignación: marcar como "Indirecto"

6. **Guardar Registro de Costo:**
   ```json
   {
     "attendanceId": "uuid-attendance",
     "employeeId": "uuid-employee",
     "workId": "uuid-work",
     "budgetItemId": "uuid-budget-item", // o null
     "workDate": "2025-11-17",
     "daysWorked": 1.0,
     "dailySalary": 500.00,
     "fsr": 1.58,
     "realCost": 790.00 // Calculado automáticamente por BD
   }
   ```

**Y** este proceso debe ocurrir en segundo plano sin intervención del usuario

### CA-3: Dashboard de Costeo por Obra 📊

**Dado que** soy Director, Ingeniero o Residente
**Cuando** accedo a una obra > "Costeo de Mano de Obra"
**Entonces** veo un dashboard con:

1. **Resumen en Tarjetas:**
   ```
   ┌─────────────────────┐  ┌─────────────────────┐
   │ Presupuesto MO      │  │ Real Gastado        │
   │ $1,250,000          │  │ $875,342            │
   └─────────────────────┘  └─────────────────────┘

   ┌─────────────────────┐  ┌─────────────────────┐
   │ Proyección 100%     │  │ Desviación          │
   │ $1,312,500          │  │ +5.0%  [AMARILLO]   │
   └─────────────────────┘  └─────────────────────┘
   ```

2. **Indicadores de Color:**
   - **Verde:** Desviación < 10% (dentro de presupuesto)
   - **Amarillo:** Desviación 10-20% (advertencia)
   - **Rojo:** Desviación > 20% (crítico)

3. **Avance Físico:**
   - Porcentaje de avance de la obra: 66.7%
   - Integrado desde módulo de Control de Obra
   - Proyección calculada como: `Real Gastado / Avance Físico × 100`
   - Ejemplo: `$875,342 / 0.667 × 100 = $1,312,500`

4. **Fórmula de Desviación:**
   ```
   Desviación = (Proyección - Presupuesto) / Presupuesto × 100
   Desviación = ($1,312,500 - $1,250,000) / $1,250,000 × 100 = +5.0%
   ```

### CA-4: Detalle por Partida Presupuestal 📋

**Dado que** veo el dashboard de costeo
**Cuando** bajo a la sección "Costo por Partida"
**Entonces** veo una tabla con:

| Partida | Presupuestado | Real Gastado | Días-Hombre | Desviación | Estado |
|---------|---------------|--------------|-------------|------------|--------|
| 02.01 - Excavación | $85,000 | $82,500 | 165 | -2.9% | 🟢 |
| 03.02 - Muro de Block | $320,000 | $285,000 | 570 | -10.9% | 🟢 |
| 04.01 - Castillos | $180,000 | $195,000 | 390 | +8.3% | 🟡 |
| 05.03 - Losa | $425,000 | $312,842 | 625 | (proyección) | 🟢 |
| **Indirecto** | $240,000 | $0 | 0 | - | - |
| **TOTAL** | **$1,250,000** | **$875,342** | **1,750** | **+5.0%** | **🟡** |

**Características de la tabla:**
- Ordenable por cualquier columna
- Filtrable por estado (verde, amarillo, rojo)
- Exportable a Excel
- Clic en partida: ver detalle de empleados

**Y** la fila "Indirecto" agrupa costos sin partida asignada (supervisión, logística, etc.)

### CA-5: Detalle de Empleados por Partida 👷

**Dado que** hago clic en una partida (ej: "03.02 - Muro de Block")
**Cuando** se abre el modal de detalle
**Entonces** veo:

1. **Header:**
   - Partida: 03.02 - Muro de Block
   - Presupuestado: $320,000
   - Real gastado: $285,000
   - Días-hombre: 570

2. **Lista de Empleados:**
   | Empleado | Cuadrilla | Días Trabajados | Costo Total |
   |----------|-----------|-----------------|-------------|
   | Juan Pérez | Albañilería A | 45 | $35,550 |
   | María López | Albañilería A | 43 | $34,002 |
   | Carlos Ruiz | Albañilería B | 38 | $30,020 |
   | ... | ... | ... | ... |

3. **Gráfica de Tendencia:**
   - Gráfica de línea mostrando costo acumulado por semana
   - Comparación con curva de presupuesto
   - Detectar si hay aceleración o desaceleración de gasto

### CA-6: Asignación de Cuadrillas a Partidas 🔧

**Dado que** soy Ingeniero o Residente
**Cuando** accedo a "Cuadrillas" en una obra
**Entonces** puedo:

1. **Ver Cuadrillas de la Obra:**
   - Lista de cuadrillas activas
   - Por cada cuadrilla: nombre, tipo, supervisor, # miembros

2. **Asignar a Partida:**
   - Hacer clic en "Asignar a Partida"
   - Seleccionar partida del presupuesto (dropdown)
   - Seleccionar fecha de inicio: 2025-11-10
   - Fecha de fin: opcional (abierta si es indefinido)
   - Guardar asignación

3. **Registro de Asignación:**
   ```json
   {
     "crewId": "uuid-crew",
     "workId": "uuid-work",
     "budgetItemId": "uuid-budget-item",
     "startDate": "2025-11-10",
     "endDate": null, // Abierta
     "isActive": true
   }
   ```

4. **Validación:**
   - Una cuadrilla puede estar asignada a múltiples partidas en diferentes periodos
   - No puede estar en dos partidas **simultáneamente** (fechas traslapadas)
   - Si se intenta: error "La cuadrilla ya está asignada a '04.01 - Castillos' desde el 2025-11-08"

5. **Historial de Asignaciones:**
   - Ver tabla con todas las asignaciones pasadas y presentes
   - Filtrar por cuadrilla, partida, fecha

**Y** a partir de la fecha de asignación, todos los costos de esa cuadrilla se imputan a la partida correspondiente

### CA-7: Alertas de Desviación 🚨

**Dado que** el sistema calcula costos diariamente
**Cuando** detecta una desviación significativa
**Entonces** debe:

1. **Generar Alerta Automática:**
   - **Condición:** Desviación de una partida > 15%
   - Crear notificación para:
     - Ingeniero Residente de la obra
     - Director de Constructora
   - Contenido de notificación:
     ```
     ⚠️ Alerta de Desviación de Costo
     Obra: Casa Modelo Norte
     Partida: 04.01 - Castillos
     Desviación: +18.5%
     Real: $195,000 vs Presupuesto: $164,620 (a la fecha)
     Acción recomendada: Revisar rendimientos y asignación de personal
     ```

2. **Dashboard de Alertas:**
   - Sección en home del usuario
   - Lista de alertas activas
   - Filtros: por obra, por criticidad (amarillo, rojo)
   - Acción: "Marcar como revisado"

3. **Email Semanal:**
   - Cada lunes a las 8 AM
   - Resumen de alertas de la semana anterior
   - Top 3 partidas con mayor desviación
   - Solo si hay alertas activas

### CA-8: Comparación Histórica de Obras 📈

**Dado que** soy Director
**Cuando** accedo a "Reportes" > "Análisis Comparativo de Obras"
**Entonces** puedo:

1. **Seleccionar Obras:**
   - Seleccionar hasta 5 obras para comparar
   - Filtrar por: estado (activa, terminada), año, tipo de obra

2. **Ver Tabla Comparativa:**
   | Obra | Presup. MO | Real MO | Desv. | m² | Costo/m² | Eficiencia |
   |------|------------|---------|-------|-----|----------|------------|
   | Casa Norte | $1.25M | $1.31M | +5% | 250 | $5,240 | 95% |
   | Casa Sur | $980K | $920K | -6% | 200 | $4,600 | 106% |
   | Edificio A | $3.5M | $3.8M | +8% | 800 | $4,750 | 92% |

3. **Fórmulas:**
   - Costo/m² = Real MO / Metros cuadrados
   - Eficiencia = (Presupuesto / Real) × 100
   - Benchmark: Identificar obra con mejor costo/m²

4. **Gráfica de Dispersión:**
   - Eje X: Metros cuadrados
   - Eje Y: Costo/m²
   - Cada punto: una obra
   - Detectar outliers

**Y** poder exportar el análisis a PDF para presentaciones

### CA-9: Proyección y Escenarios 🔮

**Dado que** veo el dashboard de una obra en progreso
**Cuando** accedo a "Proyecciones"
**Entonces** puedo:

1. **Ver Proyección Base:**
   - Basada en % de avance físico actual
   - Costo final proyectado: $1,312,500
   - Desviación proyectada: +5.0%

2. **Simular Escenarios:**
   - **Escenario Optimista:** Si mejoramos rendimiento 10%
     - Costo proyectado: $1,181,250 (-5.5%)
   - **Escenario Pesimista:** Si rendimiento empeora 10%
     - Costo proyectado: $1,443,750 (+15.5%)
   - **Escenario Realista:** Con tendencia actual
     - Mantiene proyección base

3. **Ajuste de Variables:**
   - Slider de % de mejora/empeoramiento: -20% a +20%
   - Cambio de FSR futuro (si se espera cambio legal)
   - Cambio de salario promedio (aumentos programados)
   - Ver impacto en tiempo real

4. **Exportar Escenario:**
   - Guardar escenario con nombre
   - Ejemplo: "Escenario Post-Aumento Salarial Diciembre"
   - Compartir con equipo vía link

### CA-10: Permisos por Rol 🔐

**Roles y Permisos:**

| Acción | Director | Engineer | Resident | HR | Finance |
|--------|----------|----------|----------|-----|---------|
| Ver dashboard costeo | ✅ | ✅ | ✅ | ❌ | ✅ |
| Configurar FSR | ✅ | ❌ | ❌ | ❌ | ❌ |
| Asignar cuadrillas a partidas | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver detalle de empleados | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver salarios individuales | ✅ | ❌ | ❌ | ✅ | ✅ |
| Exportar reportes | ✅ | ✅ | ✅ | ❌ | ✅ |
| Crear proyecciones | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🔧 Detalles Técnicos

### Arquitectura Event-Driven

```typescript
// labor-costs.service.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LaborCostsService {
  /**
   * Event listener que se ejecuta cuando se aprueba asistencia
   */
  @OnEvent('attendance.approved')
  async handleAttendanceApproved(attendance: AttendanceRecord) {
    // 1. Obtener empleado y salario
    const employee = await this.getEmployeeWithSalary(attendance.employeeId);

    // 2. Obtener FSR de la constructora
    const fsrConfig = await this.getFSRConfig(employee.constructoraId);

    // 3. Calcular días trabajados
    const daysWorked = await this.calculateDaysWorked(attendance);

    // 4. Determinar partida presupuestal
    const budgetItemId = await this.determineBudgetItem(
      attendance.employeeId,
      attendance.workId,
      attendance.workDate
    );

    // 5. Crear registro de costo
    const laborCost = this.laborCostRepo.create({
      attendanceId: attendance.id,
      employeeId: attendance.employeeId,
      workId: attendance.workId,
      budgetItemId,
      workDate: attendance.workDate,
      daysWorked,
      dailySalary: employee.workSpecificSalary || employee.currentSalary,
      fsr: fsrConfig.totalFsr,
      // realCost se calcula automáticamente en BD con GENERATED column
    });

    await this.laborCostRepo.save(laborCost);

    // 6. Verificar desviaciones y emitir alertas si es necesario
    await this.checkDeviations(attendance.workId);
  }
}
```

### Columna Calculada en PostgreSQL

```sql
-- labor_costs table
CREATE TABLE hr.labor_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID UNIQUE NOT NULL REFERENCES hr.attendance_records(id),
  employee_id UUID NOT NULL,
  work_id UUID NOT NULL,
  budget_item_id UUID REFERENCES budgets.budget_items(id),
  work_date DATE NOT NULL,
  days_worked DECIMAL(3,2) NOT NULL CHECK(days_worked > 0 AND days_worked <= 1),
  daily_salary DECIMAL(10,2) NOT NULL,
  fsr DECIMAL(4,2) NOT NULL,
  -- Columna generada automáticamente
  real_cost DECIMAL(10,2) GENERATED ALWAYS AS (daily_salary * days_worked * fsr) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_labor_costs_work ON hr.labor_costs(work_id, work_date);
CREATE INDEX idx_labor_costs_budget_item ON hr.labor_costs(budget_item_id);
```

### Query de Dashboard

```typescript
// Obtener resumen de costeo por obra
async getCostSummary(workId: string) {
  // 1. Total presupuestado de MO
  const budgetedLabor = await this.db.query(`
    SELECT SUM(labor_cost) as total
    FROM budgets.budget_items
    WHERE work_id = $1
  `, [workId]);

  // 2. Total real gastado
  const realLabor = await this.db.query(`
    SELECT
      SUM(real_cost) as total,
      COUNT(*) as total_records,
      SUM(days_worked) as total_days
    FROM hr.labor_costs
    WHERE work_id = $1
  `, [workId]);

  // 3. Avance físico (de control de obra)
  const physicalProgress = await this.getPhysicalProgress(workId);

  // 4. Proyección
  const projected = physicalProgress > 10
    ? (realLabor.total / physicalProgress) * 100
    : null;

  // 5. Desviación
  const deviation = projected
    ? ((projected - budgetedLabor.total) / budgetedLabor.total) * 100
    : null;

  return {
    budgeted: budgetedLabor.total,
    real: realLabor.total,
    totalDays: realLabor.total_days,
    physicalProgress,
    projected,
    deviation,
    status: this.getDeviationStatus(deviation),
  };
}
```

### Componente React del Dashboard

```typescript
// CostDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CostDashboard({ workId }: { workId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['labor-costs', 'summary', workId],
    queryFn: () => apiService.get(`/hr/labor-costs/summary/${workId}`),
    refetchInterval: 60000, // Actualizar cada minuto
  });

  if (isLoading) return <Skeleton />;

  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Presupuesto MO</p>
          <p className="text-3xl font-bold">
            ${data.budgeted.toLocaleString('es-MX')}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Real Gastado</p>
          <p className="text-3xl font-bold">
            ${data.real.toLocaleString('es-MX')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.totalDays} días-hombre
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Proyección 100%</p>
          <p className="text-3xl font-bold">
            ${data.projected?.toLocaleString('es-MX') || 'N/A'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Avance: {data.physicalProgress}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Desviación</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold">
              {data.deviation > 0 ? '+' : ''}
              {data.deviation?.toFixed(1)}%
            </p>
            <Badge className={statusColors[data.status]}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Tabla de partidas */}
      <BudgetItemsTable workId={workId} />

      {/* Gráfica de tendencia */}
      <CostTrendChart workId={workId} />
    </div>
  );
}
```

---

## 🧪 Casos de Prueba

### TC-COST-001: Cálculo Automático de Costo ✅

**Precondiciones:**
- Empleado: Juan Pérez, salario $500/día
- FSR configurado: 1.58
- Asistencia: 1.0 día trabajado

**Pasos:**
1. Aprobar asistencia del empleado
2. Event `attendance.approved` se dispara
3. Sistema calcula costo automáticamente

**Resultado esperado:**
- Registro en `hr.labor_costs` creado:
  - `dailySalary`: 500.00
  - `daysWorked`: 1.0
  - `fsr`: 1.58
  - `realCost`: 790.00 (calculado automáticamente)
- Cálculo: 500 × 1.0 × 1.58 = 790.00
- Proceso completado en < 500ms

### TC-COST-002: Asignación a Partida Presupuestal ✅

**Precondiciones:**
- Empleado pertenece a Cuadrilla "Albañilería A"
- Cuadrilla asignada a partida "03.02 - Muro de Block" desde 2025-11-10
- Fecha de trabajo: 2025-11-17

**Pasos:**
1. Registrar asistencia del empleado
2. Sistema determina partida automáticamente

**Resultado esperado:**
- `budgetItemId` = UUID de "03.02 - Muro de Block"
- Costo se imputa a esa partida
- Visible en dashboard bajo "Muro de Block"

### TC-COST-003: Empleado Sin Partida Asignada (Indirecto) ✅

**Precondiciones:**
- Empleado NO pertenece a ninguna cuadrilla
- O cuadrilla sin asignación a partida

**Pasos:**
1. Registrar asistencia

**Resultado esperado:**
- `budgetItemId` = null
- Costo clasificado como "Indirecto"
- Visible en fila "Indirecto" en dashboard

### TC-COST-004: Configuración de FSR ⚙️

**Precondiciones:**
- Usuario con rol Director
- FSR actual: 1.58

**Pasos:**
1. Ir a "Configuración" > "FSR"
2. Cambiar IMSS de 23% a 25%
3. Ver actualización automática: FSR = 1.60
4. Guardar cambios

**Resultado esperado:**
- FSR guardado como 1.60
- Fecha efectiva: 2025-11-17
- Log de auditoría registrado:
  - Usuario: Director
  - Cambio: IMSS 23% → 25%, FSR 1.58 → 1.60
- Nuevos cálculos usan 1.60
- Cálculos anteriores mantienen 1.58

### TC-COST-005: Dashboard de Costeo ✅

**Precondiciones:**
- Obra con presupuesto MO: $1,250,000
- Real gastado: $875,342
- Avance físico: 66.7%

**Pasos:**
1. Ir a obra > "Costeo de Mano de Obra"
2. Ver dashboard

**Resultado esperado:**
- Presupuesto: $1,250,000
- Real: $875,342
- Proyección: $1,312,500 (calculado: 875342 / 0.667)
- Desviación: +5.0% (calculado: (1312500-1250000)/1250000×100)
- Badge amarillo (10% < desv. < 20%)

### TC-COST-006: Alerta de Desviación 🚨

**Precondiciones:**
- Partida "04.01 - Castillos"
- Presupuesto: $180,000
- Real gastado: $195,000
- Desviación: +8.3% → cambia a +16.5%

**Pasos:**
1. Registrar más asistencias que aumentan el costo
2. Desviación supera 15%
3. Sistema detecta automáticamente

**Resultado esperado:**
- Notificación creada para Ingeniero Residente y Director
- Contenido:
  ```
  ⚠️ Alerta de Desviación
  Partida: 04.01 - Castillos
  Desviación: +16.5%
  Real: $209,700 vs Presupuesto: $180,000
  ```
- Email enviado si está configurado
- Dashboard de alertas muestra 1 nueva alerta

### TC-COST-007: Asignación de Cuadrilla a Partida ✅

**Precondiciones:**
- Cuadrilla "Albañilería A" creada
- Obra con presupuesto que incluye "03.02 - Muro de Block"

**Pasos:**
1. Ir a Cuadrillas de la obra
2. Seleccionar "Albañilería A"
3. Clic en "Asignar a Partida"
4. Seleccionar "03.02 - Muro de Block"
5. Fecha inicio: 2025-11-10
6. Guardar

**Resultado esperado:**
- Registro creado en `crew_budget_assignments`
- `startDate`: 2025-11-10
- `endDate`: null (abierta)
- `isActive`: true
- A partir del 2025-11-10, todos los costos de esa cuadrilla se imputan a esa partida

### TC-COST-008: Evitar Traslape de Asignaciones ❌

**Precondiciones:**
- Cuadrilla ya asignada a "03.02 - Muro" desde 2025-11-10 (sin fecha fin)

**Pasos:**
1. Intentar asignar la misma cuadrilla a "04.01 - Castillos"
2. Fecha inicio: 2025-11-15

**Resultado esperado:**
- Error: "La cuadrilla ya está asignada a '03.02 - Muro de Block' desde 2025-11-10"
- Sugerencia: "Cierra la asignación anterior o usa otra cuadrilla"
- No se permite guardar

### TC-COST-009: Proyección de Escenarios 🔮

**Precondiciones:**
- Obra con costo real $875,342
- Proyección base: $1,312,500

**Pasos:**
1. Ir a "Proyecciones"
2. Mover slider a "Mejora del 10%"

**Resultado esperado:**
- Proyección actualizada en tiempo real
- Nuevo valor: $1,181,250 (1312500 × 0.9)
- Desviación: -5.5%
- Badge verde
- Gráfica se actualiza mostrando nueva línea de proyección

### TC-COST-010: Comparación Histórica de Obras 📈

**Precondiciones:**
- 3 obras completadas con datos de costeo

**Pasos:**
1. Ir a "Reportes" > "Análisis Comparativo"
2. Seleccionar 3 obras
3. Ver tabla y gráfica

**Resultado esperado:**
- Tabla muestra:
  - Casa Norte: $5,240/m², Eficiencia 95%
  - Casa Sur: $4,600/m², Eficiencia 106% ⭐ Mejor
  - Edificio A: $4,750/m², Eficiencia 92%
- Gráfica de dispersión muestra 3 puntos
- Casa Sur identificada como benchmark
- Opción de exportar a PDF visible

---

## 📦 Dependencias

### Dependencias de Otros US

- ✅ **US-FUND-004:** Infraestructura (event emitters, TypeORM)
- ✅ **US-HR-001:** Empleados y cuadrillas
- ⏳ **US-HR-002:** Asistencias (genera evento attendance.approved)
- ⏳ **US-BUD-001:** Presupuestos (partidas presupuestales)
- ⏳ **US-PROJ-003:** Control de Obra (% de avance físico)

### Librerías Backend

```json
{
  "@nestjs/event-emitter": "^2.0.3",
  "decimal.js": "^10.4.3"
}
```

### Librerías Frontend

```json
{
  "recharts": "^2.10.3",
  "date-fns": "^3.0.1",
  "jspdf": "^2.5.1"
}
```

---

## ⚠️ Riesgos

### R-1: Cambios Retroactivos de FSR

**Descripción:** Si se cambia el FSR, usuarios pueden esperar recálculo retroactivo
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- FSR NO es retroactivo por diseño
- Mensaje claro al guardar: "Aplicará solo a registros futuros"
- Opción de "Recálculo Masivo" solo para Director (con auditoría)

### R-2: Precisión de Proyección con Bajo Avance

**Descripción:** Proyección al 100% es imprecisa si avance < 10%
**Impacto:** Medio
**Probabilidad:** Alta
**Mitigación:**
- No mostrar proyección si avance < 10%
- Mensaje: "Proyección disponible cuando avance > 10%"
- Usar promedio de obras similares como referencia inicial

### R-3: Desvinculación de Empleado de Cuadrilla

**Descripción:** Si empleado sale de cuadrilla, costos pasados pueden quedar "huérfanos"
**Impacto:** Bajo
**Probabilidad:** Media
**Mitigación:**
- Los costos históricos NO se modifican
- Solo costos **futuros** usan la nueva asignación
- Historial de asignaciones mantiene trazabilidad

---

## 📊 Métricas de Éxito

**Métricas de Negocio:**
- ✅ 90% de obras con desviación < 15%
- ✅ Detección de desviaciones 2 semanas antes vs método manual
- ✅ Reducción de 50% en sobrecostos por mejor control

**Métricas Técnicas:**
- ✅ Cálculo de costo < 500ms después de aprobar asistencia
- ✅ Dashboard carga en < 2 segundos
- ✅ 100% de costos con partida asignada o clasificados como indirecto

**Métricas de Usuario:**
- ✅ 95% de Ingenieros revisan dashboard semanalmente
- ✅ 0 quejas de cálculos incorrectos en primer mes
- ✅ Satisfacción > 4.5/5

---

## 📋 Checklist de Implementación

### Backend
- [ ] Crear tabla `hr.labor_costs` con columna generada
- [ ] Crear tabla `hr.fsr_configuration`
- [ ] Crear tabla `hr.crew_budget_assignments`
- [ ] Implementar `LaborCostsService` con event listener
- [ ] Implementar `FSRConfigurationService`
- [ ] Implementar cálculo de días trabajados
- [ ] Implementar determinación de partida presupuestal
- [ ] Crear endpoints de dashboard
- [ ] Crear endpoint de configuración FSR
- [ ] Implementar sistema de alertas
- [ ] Crear queries de comparación histórica
- [ ] Crear seeds de FSR por defecto

### Frontend
- [ ] Crear página `CostDashboard`
- [ ] Crear componente `FSRConfiguration`
- [ ] Crear componente `BudgetItemsTable`
- [ ] Crear componente `CostTrendChart` con Recharts
- [ ] Crear componente `CrewBudgetAssignment`
- [ ] Crear componente `DeviationAlerts`
- [ ] Crear página `HistoricalComparison`
- [ ] Crear componente `ProjectionScenarios`
- [ ] Implementar exportación a PDF
- [ ] Implementar permisos por rol

### Testing
- [ ] Tests de cálculo de costo real
- [ ] Tests de event listener
- [ ] Tests de validación de FSR (1.0 - 3.0)
- [ ] Tests de detección de desviaciones
- [ ] Tests de asignación de cuadrillas
- [ ] Tests de traslape de fechas
- [ ] Tests de proyecciones
- [ ] Tests E2E de flujo completo

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
**Autor:** Equipo de Desarrollo
**Revisado por:** Product Owner
