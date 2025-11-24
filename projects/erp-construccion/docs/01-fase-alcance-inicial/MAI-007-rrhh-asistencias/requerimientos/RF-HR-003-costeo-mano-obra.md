# RF-HR-003: Costeo de Mano de Obra

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**Tipo:** Requerimiento Funcional
**Prioridad:** Alta
**Estado:** 🚧 En Definición
**Última actualización:** 2025-11-17

---

## 📋 Descripción

El sistema debe calcular el costo real de mano de obra por obra y por partida presupuestal, considerando salarios, prestaciones legales, cargas sociales (IMSS, INFONAVIT), y factor de salario real. Debe permitir comparar costo real vs presupuestado y generar alertas de desviación.

---

## 🎯 Objetivo de Negocio

1. **Control de Costos:**
   - Conocer costo real de mano de obra en tiempo real
   - Detectar desviaciones presupuestales tempranamente
   - Optimizar asignación de cuadrillas

2. **Toma de Decisiones:**
   - Proyectar costo al finalizar la obra
   - Comparar productividad entre cuadrillas
   - Identificar partidas con sobrecosto

3. **Rentabilidad:**
   - Calcular margen real por obra
   - Proyectar flujo de caja
   - Mejorar cotizaciones futuras

---

## 👥 Actores

- **Director:** Consulta costeo general de obras
- **Finance:** Analiza costos, genera reportes financieros
- **Residente:** Consulta costeo de su obra
- **HR:** Valida datos de nómina

---

## 🧮 Conceptos Clave

### Factor de Salario Real (FSR)

El FSR es el multiplicador que convierte el salario nominal en costo real, considerando todas las prestaciones y cargas sociales.

**Fórmula:**
```
FSR = 1 + (Prestaciones + Cargas Sociales + Imprevistos)
```

**Componentes típicos en México (2025):**

| Concepto | % sobre Salario | Comentario |
|----------|-----------------|------------|
| **Cargas Sociales** | | |
| IMSS (cuota patronal) | 20.4% - 25.9% | Varía según riesgo de trabajo |
| INFONAVIT | 5% | Fijo |
| FONACOT | 0% - 3% | Solo si hay crédito |
| **Prestaciones de Ley** | | |
| Aguinaldo | 4.17% | 15 días/año (15/360) |
| Vacaciones | 1.67% | 6 días/año (6/360) |
| Prima vacacional | 0.42% | 25% de vacaciones |
| **Días no laborados** | | |
| Domingos | 14.28% | (52/365) |
| Días festivos | 2.19% | (8/365) |
| **Imprevistos** | | |
| Ausentismo | 5% | Estimado |
| Rotación y capacitación | 3% | Estimado |
| **TOTAL FSR** | **1.56 - 1.60** | Promedio industria construcción |

**Ejemplo de Cálculo:**
```
Salario nominal (SDI): $350/día
FSR: 1.58
Costo real = $350 × 1.58 = $553/día
```

---

## ✅ Casos de Uso

### UC-HR-008: Calcular Costo Real de Empleado

**Actor:** Sistema (automático)
**Trigger:** Registro de asistencia aprobado

**Flujo principal:**

1. Sistema obtiene asistencia aprobada
2. Obtiene salario diario del empleado (específico de obra o base)
3. Calcula días trabajados (día completo = 1.0, medio día = 0.5)
4. Aplica FSR configurado para la constructora
5. Calcula costo real:
   ```
   Costo Real = Salario Diario × Días Trabajados × FSR
   ```
6. Obtiene partida presupuestal asignada (si aplica)
7. Guarda registro en `labor_costs`
8. Actualiza acumulados de obra y partida

**Resultado:** Costo de mano de obra registrado y acumulado

---

### UC-HR-009: Asignar Cuadrilla a Partida Presupuestal

**Actor:** Residente o Engineer
**Flujo principal:**

1. Usuario accede a obra → Presupuesto → Partida específica
2. Selecciona "Asignar Cuadrilla"
3. Selecciona cuadrilla de las disponibles en la obra
4. Define período de asignación (fecha inicio - fecha fin)
5. Define % de tiempo dedicado (100% = tiempo completo, 50% = medio tiempo)
6. Sistema valida:
   - Cuadrilla debe estar asignada a la obra
   - No sobrepasar 100% de tiempo del empleado
7. Sistema crea registro en `crew_budget_assignments`
8. A partir de ahora, asistencias de empleados de la cuadrilla se contabilizan en esta partida

**Resultado:** Cuadrilla asignada, costos se imputan a partida

**Excepciones:**
- E1: Cuadrilla ya asignada 100% a otra partida → Bloquear o permitir split

---

### UC-HR-010: Comparar Costo Real vs Presupuestado

**Actor:** Director, Finance, Residente
**Flujo principal:**

1. Usuario accede a Obra → Análisis de Costos
2. Visualiza dashboard con:
   - **Presupuesto total de MO:** $X MXN
   - **Gastado a la fecha:** $Y MXN
   - **% de avance presupuestal:** Y/X × 100
   - **% de avance físico:** (de control de obra)
   - **Proyección al 100%:** Y / (% avance físico) × 100
   - **Desviación:** Proyección - Presupuesto
3. Visualiza tabla por partida:
   | Partida | Presupuesto MO | Real | Avance | Desviación |
   |---------|----------------|------|--------|------------|
   | Cimientos | $100K | $85K | 90% | -$5.5K (5.5%) |
   | Estructura | $250K | $180K | 60% | +$50K (20%) ⚠️ |
4. Si desviación > 15%, muestra alerta roja

**Resultado:** Visibilidad de desviaciones presupuestales

---

### UC-HR-011: Generar Reporte de Productividad

**Actor:** Director, Engineer
**Flujo principal:**

1. Usuario accede a Reportes → Productividad de Cuadrillas
2. Selecciona período (última semana, último mes, personalizado)
3. Selecciona obra (o todas)
4. Sistema calcula métricas por cuadrilla:
   - **Días-hombre trabajados**
   - **Costo total**
   - **Costo promedio por día-hombre**
   - **Partidas asignadas**
   - **Rendimiento** (si se tiene datos de producción):
     - Ejemplo: m³ de concreto / día-hombre
5. Muestra tabla comparativa de cuadrillas
6. Permite exportar a Excel/PDF

**Resultado:** Reporte de productividad generado

---

## 📊 Modelo de Datos

### Costos de Mano de Obra (labor_costs)

```sql
CREATE TABLE hr.labor_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_id UUID UNIQUE NOT NULL REFERENCES attendance.attendance_records(id),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),
  work_id UUID NOT NULL REFERENCES projects.projects(id),
  budget_item_id UUID REFERENCES budgets.budget_items(id), -- Partida presupuestal

  -- Cálculo de costo
  work_date DATE NOT NULL,
  days_worked DECIMAL(3, 2) NOT NULL, -- 1.0 = día completo, 0.5 = medio día
  daily_salary DECIMAL(10, 2) NOT NULL, -- Salario del día (puede variar)
  fsr DECIMAL(4, 2) NOT NULL, -- Factor de Salario Real (ej: 1.58)
  real_cost DECIMAL(10, 2) GENERATED ALWAYS AS (
    daily_salary * days_worked * fsr
  ) STORED,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_days_worked CHECK (days_worked >= 0 AND days_worked <= 1)
);

CREATE INDEX idx_labor_costs_work ON hr.labor_costs(work_id, work_date);
CREATE INDEX idx_labor_costs_employee ON hr.labor_costs(employee_id);
CREATE INDEX idx_labor_costs_budget_item ON hr.labor_costs(budget_item_id);
```

---

### Asignación de Cuadrilla a Partida (crew_budget_assignments)

```sql
CREATE TABLE hr.crew_budget_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID NOT NULL REFERENCES hr.crews(id),
  budget_item_id UUID NOT NULL REFERENCES budgets.budget_items(id),
  work_id UUID NOT NULL REFERENCES projects.projects(id),

  start_date DATE NOT NULL,
  end_date DATE,
  time_percentage DECIMAL(5, 2) DEFAULT 100.00, -- % de tiempo dedicado (100% = tiempo completo)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_time_percentage CHECK (time_percentage > 0 AND time_percentage <= 100)
);

CREATE INDEX idx_crew_budget_work ON hr.crew_budget_assignments(work_id);
CREATE INDEX idx_crew_budget_crew ON hr.crew_budget_assignments(crew_id);
CREATE INDEX idx_crew_budget_item ON hr.crew_budget_assignments(budget_item_id);
```

---

### Configuración de FSR por Constructora

```sql
CREATE TABLE hr.fsr_configuration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constructora_id UUID UNIQUE NOT NULL REFERENCES auth_management.constructoras(id),

  -- Componentes del FSR
  imss_percentage DECIMAL(5, 2) DEFAULT 23.00, -- Cuota patronal IMSS
  infonavit_percentage DECIMAL(5, 2) DEFAULT 5.00, -- Aportación INFONAVIT
  aguinaldo_percentage DECIMAL(5, 2) DEFAULT 4.17, -- 15 días/año
  vacaciones_percentage DECIMAL(5, 2) DEFAULT 1.67, -- 6 días/año
  prima_vacacional_percentage DECIMAL(5, 2) DEFAULT 0.42, -- 25% de vacaciones
  domingos_percentage DECIMAL(5, 2) DEFAULT 14.28, -- 52/365
  festivos_percentage DECIMAL(5, 2) DEFAULT 2.19, -- 8/365
  ausentismo_percentage DECIMAL(5, 2) DEFAULT 5.00, -- Estimado
  otros_percentage DECIMAL(5, 2) DEFAULT 3.00, -- Rotación, capacitación

  -- FSR calculado
  total_fsr DECIMAL(4, 2) GENERATED ALWAYS AS (
    1 + (
      imss_percentage + infonavit_percentage + aguinaldo_percentage +
      vacaciones_percentage + prima_vacacional_percentage + domingos_percentage +
      festivos_percentage + ausentismo_percentage + otros_percentage
    ) / 100
  ) STORED,

  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para crear configuración por defecto al crear constructora
CREATE OR REPLACE FUNCTION hr.create_default_fsr_config()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO hr.fsr_configuration (constructora_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_fsr_config
  AFTER INSERT ON auth_management.constructoras
  FOR EACH ROW
  EXECUTE FUNCTION hr.create_default_fsr_config();
```

---

## 🔐 Reglas de Negocio

### RN-HR-011: Cálculo de FSR
- FSR debe estar entre 1.4 y 1.8 (rango típico en México)
- FSR se aplica sobre salario diario integrado (SDI)
- FSR puede variar por constructora pero no por empleado

### RN-HR-012: Asignación a Partida
- Suma de % de tiempo de todas las cuadrillas/empleados no puede exceder 100%
- Asignación sin partida → se imputa a "Indirecto" o "General de Obra"
- Cambio de asignación solo afecta asistencias futuras (no retroactivo)

### RN-HR-013: Cálculo de Días Trabajados
- Día completo (8+ horas) = 1.0 día
- Medio día (4-8 horas) = 0.5 días
- < 4 horas = 0.25 días (opcional, depende de política)
- Horas extras se calculan aparte (no incluidas en FSR base)

### RN-HR-014: Desviación Presupuestal
- Desviación < 10% = Verde (normal)
- Desviación 10-20% = Amarillo (advertencia)
- Desviación > 20% = Rojo (crítico, requiere acción)

### RN-HR-015: Proyección de Costo
- Proyección al 100% = Costo Real / (% Avance Físico) × 100
- Solo calcular si avance físico > 10% (evitar proyecciones erróneas)
- Proyección se actualiza diariamente

---

## 🧪 Criterios de Aceptación

### CA-HR-007: Cálculo de FSR
- ✅ Permite configurar componentes del FSR por constructora
- ✅ Calcula FSR total automáticamente
- ✅ FSR por defecto = 1.58 (valor estándar)
- ✅ Permite modificar FSR (requiere permiso de Director/Finance)
- ✅ Cambios de FSR no son retroactivos

### CA-HR-008: Registro de Costos
- ✅ Al aprobar asistencia, crea registro en labor_costs
- ✅ Aplica salario correcto (específico de obra o base)
- ✅ Aplica FSR vigente de la constructora
- ✅ Imputa a partida si cuadrilla/empleado está asignado
- ✅ Acumula correctamente por obra y partida

### CA-HR-009: Asignación a Partida
- ✅ Permite asignar cuadrilla completa a partida
- ✅ Permite asignar empleado individual a partida
- ✅ Valida que no se exceda 100% de tiempo
- ✅ Permite splits (50% en partida A, 50% en partida B)

### CA-HR-010: Comparación Real vs Presupuestado
- ✅ Dashboard muestra presupuesto, real, avance, desviación
- ✅ Cálculo de desviación es correcto
- ✅ Proyección al 100% es correcta
- ✅ Alertas visuales por nivel de desviación (verde, amarillo, rojo)
- ✅ Datos se actualizan diariamente

### CA-HR-011: Reportes de Productividad
- ✅ Genera reporte por cuadrilla
- ✅ Calcula días-hombre y costo total correctamente
- ✅ Permite comparar cuadrillas
- ✅ Permite exportar a Excel/PDF
- ✅ Datos pueden filtrarse por período y obra

---

## 📐 Dependencias

### Upstream (depende de):
- ✅ RF-HR-001: Empleados y Cuadrillas (requiere salarios)
- ✅ RF-HR-002: Asistencia Biométrica (requiere asistencias aprobadas)
- 🔜 RF-BUDGET-001: Presupuesto de Obra (requiere partidas presupuestales)

### Downstream (otros dependen de esto):
- 🔜 RF-FIN-001: Flujo de Caja (usa costos de MO)
- 🔜 RF-REP-001: Reportes Ejecutivos (usa datos de costeo)

---

## 🎯 KPIs

- **Desviación promedio de MO:** < 10%
- **Proyección de costo vs presupuesto:** ± 5%
- **Obras con desviación crítica (>20%):** 0 obras
- **Tiempo de cálculo de costos:** < 1 segundo (tiempo real)

---

## 📝 Notas Adicionales

### Cálculo de Horas Extras
No incluido en FSR base. Requiere módulo adicional:
- HE normales: +25% del salario por hora
- HE dobles: +100% del salario por hora
- HE domingos/festivos: +200% del salario por hora

### Actualización de FSR
- Revisar FSR anualmente (enero)
- Actualizar si cambian leyes laborales (IMSS, INFONAVIT)
- Considerar inflación y aumentos de salario mínimo

### Integración con Nómina
- Costos de MO NO incluyen ISR ni deducciones personales
- Son costos para la constructora, no salario neto del empleado
- Nómina debe calcularse aparte (RF-HR-004)

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
