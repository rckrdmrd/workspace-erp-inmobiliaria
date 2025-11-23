# RF-HR-005: Integración con INFONAVIT

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**Tipo:** Requerimiento Funcional
**Prioridad:** Crítica (Cumplimiento Legal)
**Estado:** 🚧 En Definición
**Última actualización:** 2025-11-17

---

## 📋 Descripción

El sistema debe integrarse con el Instituto del Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT) para cumplir con obligaciones patronales: registro patronal, cálculo y pago de aportaciones (5% del SBC), consulta de trabajadores con crédito, y aplicación de descuentos por crédito INFONAVIT.

---

## 🎯 Objetivo Legal

**Obligación Legal:** Ley del INFONAVIT
- Art. 29: Obligación de aportación del 5% del SBC
- Art. 29 Bis: Pago bimestral de aportaciones
- Art. 30: Descuento de mensualidades de crédito

**Sanciones por incumplimiento:**
- Multas de 250 a 5,000 veces la UMA (~$26K a $520K MXN)
- Actualización de adeudos con recargos del 2% mensual
- Embargo de cuentas bancarias

---

## ✅ Casos de Uso Principales

### UC-INF-001: Registro Patronal en INFONAVIT

**Pre-requisito:** Primera vez que constructora usa el sistema

**Proceso:**

1. HR accede a "Configuración" → "INFONAVIT" → "Registrar Patrón"
2. Ingresa datos:
   - RFC de la constructora
   - Razón social
   - Domicilio fiscal
   - Actividad económica (construcción)
   - Número de trabajadores
3. Sistema genera solicitud de registro
4. Envía a API INFONAVIT
5. Obtiene **Número de Registro Patronal INFONAVIT**
6. Guarda en `constructoras.infonavit_reg_number`

**Resultado:** Constructora registrada ante INFONAVIT

---

### UC-INF-002: Cálculo de Aportaciones Bimestrales

**Periodo:** Bimestral (Ene-Feb, Mar-Abr, May-Jun, Jul-Ago, Sep-Oct, Nov-Dic)
**Fecha límite:** Día 17 del mes siguiente al bimestre

**Proceso:**

1. Sistema determina período bimestral actual
2. Para cada empleado activo en el período:
   - Obtiene Salario Base de Cotización (SBC)
   - Calcula días cotizados en el bimestre
   - Calcula aportación:
     ```
     Aportación INFONAVIT = SBC × Días Cotizados × 0.05
     ```
3. Suma aportaciones de todos los empleados
4. Genera archivo de pago (.txt o XML según formato INFONAVIT)
5. Muestra total a pagar

**Ejemplo:**
```
Empleado: Juan Pérez
SBC: $350/día
Días cotizados: 60 días (bimestre completo)
Aportación = $350 × 60 × 0.05 = $1,050 MXN
```

---

### UC-INF-003: Consulta de Trabajadores con Crédito

**Trigger:** Mensual (antes de calcular nómina)

**Proceso:**

1. Sistema consulta API INFONAVIT
2. Request:
   ```json
   {
     "registro_patronal": "1234567890",
     "rfc_patron": "CON123456ABC"
   }
   ```
3. Obtiene lista de empleados con crédito:
   ```json
   {
     "acreditados": [
       {
         "nss": "12345678901",
         "numero_credito": "9876543210",
         "descuento_mensual": 1500.00,
         "saldo_pendiente": 150000.00,
         "tipo_descuento": "VSM" // Veces Salario Mínimo
       }
     ]
   }
   ```
4. Actualiza tabla `infonavit_credits` con descuentos vigentes
5. Marca empleados con crédito activo

---

### UC-INF-004: Aplicar Descuento por Crédito en Nómina

**Trigger:** Cálculo de nómina

**Proceso:**

1. Al calcular nómina del empleado
2. Verifica si tiene crédito INFONAVIT activo
3. Calcula descuento:
   - **VSM (Veces Salario Mínimo):** Descuento = X veces el salario mínimo
   - **Porcentaje:** Descuento = X% del salario bruto
   - **Cuota fija:** Descuento = $X MXN
4. Aplica descuento en nómina
5. Registra en tabla `payroll_deductions`
6. Al pagar INFONAVIT, incluye estos descuentos en archivo de pago

**Ejemplo VSM:**
```
Empleado: María López
Salario Mínimo General: $248.93/día (2025)
Descuento: 2.5 VSM
Descuento mensual = $248.93 × 2.5 × 30 = $18,669.75 MXN
```

---

### UC-INF-005: Generación de Archivo de Pago

**Trigger:** Cierre de bimestre (antes del día 17)

**Proceso:**

1. HR accede a "INFONAVIT" → "Generar Archivo de Pago"
2. Selecciona bimestre
3. Sistema genera archivo con:
   - Aportaciones patronales (5% del SBC)
   - Descuentos de créditos de empleados
4. Formato del archivo:
   ```
   HEADER|1234567890|CON123456ABC|BIMESTRE 01-2025
   APORTACION|12345678901|1050.00|60
   DESCUENTO|12345678901|9876543210|1500.00
   TOTAL|250|350000.00|185000.00
   ```
   - `250`: Total de empleados
   - `350000.00`: Total aportaciones
   - `185000.00`: Total descuentos
5. Permite descargar archivo .txt
6. Genera línea de captura para pago en banco

---

## 📊 Modelo de Datos

```sql
-- Créditos INFONAVIT de empleados
CREATE TABLE hr.infonavit_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),

  credit_number VARCHAR(20) UNIQUE NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('VSM', 'percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL, -- VSM: número de veces, Percentage: %, Fixed: monto

  outstanding_balance DECIMAL(12, 2),
  start_date DATE NOT NULL,
  estimated_end_date DATE,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_infonavit_credits_employee ON hr.infonavit_credits(employee_id);
CREATE INDEX idx_infonavit_credits_active ON hr.infonavit_credits(is_active) WHERE is_active = true;

-- Log de integración INFONAVIT
CREATE TABLE hr.infonavit_integration_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id),
  operation_type VARCHAR(50) NOT NULL, -- registro, aportaciones, consulta_creditos, pago

  request_payload JSONB NOT NULL,
  response_payload JSONB,

  status VARCHAR(20), -- pending, success, failed
  infonavit_folio VARCHAR(50),
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Archivos de pago generados
CREATE TABLE hr.infonavit_payment_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id),

  period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 6), -- Bimestre
  period_year INTEGER NOT NULL CHECK (period_year >= 2025),

  file_content TEXT NOT NULL,
  file_hash VARCHAR(64) NOT NULL,

  total_employees INTEGER NOT NULL,
  total_contributions DECIMAL(12, 2) NOT NULL, -- Aportaciones 5%
  total_discounts DECIMAL(12, 2) NOT NULL, -- Descuentos por crédito
  total_payment DECIMAL(12, 2) GENERATED ALWAYS AS (total_contributions + total_discounts) STORED,

  payment_reference VARCHAR(50), -- Línea de captura bancaria
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid

  generated_by UUID REFERENCES auth_management.profiles(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(constructora_id, period_number, period_year)
);

-- Agregar campo a constructoras
ALTER TABLE auth_management.constructoras
ADD COLUMN IF NOT EXISTS infonavit_reg_number VARCHAR(20) UNIQUE;
```

---

## 🔐 Reglas de Negocio

### RN-INF-001: Aportación Obligatoria
- 5% del Salario Base de Cotización (SBC)
- Mismo SBC que se usa para IMSS
- Pago bimestral obligatorio

### RN-INF-002: Descuento por Crédito
- Descuento máximo: 30% del salario bruto
- Se descuenta en nómina quincenal/semanal
- Se paga bimestralmente a INFONAVIT junto con aportaciones

### RN-INF-003: Trabajadores Acreditados
- Empleados con crédito INFONAVIT vigente
- Descuento obligatorio (ley protege al trabajador)
- Patrón no puede no descontar

### RN-INF-004: Plazos de Pago
- Bimestre 1 (Ene-Feb): Pago antes del 17 de marzo
- Bimestre 2 (Mar-Abr): Pago antes del 17 de mayo
- Bimestre 3 (May-Jun): Pago antes del 17 de julio
- Bimestre 4 (Jul-Ago): Pago antes del 17 de septiembre
- Bimestre 5 (Sep-Oct): Pago antes del 17 de noviembre
- Bimestre 6 (Nov-Dic): Pago antes del 17 de enero (año siguiente)

### RN-INF-005: Actualización
- Recargos del 2% mensual sobre saldo vencido
- Actualización con INPC (inflación)

---

## 🧪 Criterios de Aceptación

- ✅ Permite registrar número patronal INFONAVIT de constructora
- ✅ Calcula aportaciones del 5% correctamente
- ✅ Consulta trabajadores con crédito mensualmente
- ✅ Aplica descuentos por crédito en nómina
- ✅ Descuento no excede 30% del salario bruto
- ✅ Genera archivo de pago con formato correcto
- ✅ Archivo incluye aportaciones + descuentos
- ✅ Genera línea de captura para pago en banco
- ✅ Logs de integración registran operaciones
- ✅ Alertas si pago no se realiza antes del día 17

---

## 📐 Dependencias

- ✅ RF-HR-001: Empleados (requiere NSS, SBC)
- ✅ RF-HR-004: IMSS (usa mismo SBC)
- 🔜 RF-HR-004: Nómina (aplica descuentos)

---

## 📝 Notas Adicionales

### Tipos de Descuento VSM
- **VSM (Veces Salario Mínimo):** Más común
  - Ejemplo: 2.5 VSM = $248.93 × 2.5 × 30 = $18,669.75/mes
- **Porcentaje:** Poco común
  - Ejemplo: 15% del salario bruto
- **Cuota Fija:** Raro
  - Ejemplo: $2,000 MXN/mes

### API INFONAVIT
- Entorno de pruebas (sandbox) disponible
- Producción requiere certificado digital
- OAuth 2.0 para autenticación
- Rate limiting: 100 requests/minuto

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
