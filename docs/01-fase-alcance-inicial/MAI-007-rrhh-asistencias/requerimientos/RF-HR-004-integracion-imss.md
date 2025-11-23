# RF-HR-004: Integración con IMSS

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**Tipo:** Requerimiento Funcional
**Prioridad:** Crítica (Cumplimiento Legal)
**Estado:** 🚧 En Definición
**Última actualización:** 2025-11-17

---

## 📋 Descripción

El sistema debe integrarse con el Instituto Mexicano del Seguro Social (IMSS) para dar cumplimiento a obligaciones patronales: alta/baja de trabajadores, modificaciones salariales, cálculo de cuotas obrero-patronales, y generación de archivos SUA para pago de cuotas.

---

## 🎯 Objetivo Legal

**Obligación Legal:** Ley del Seguro Social (LSS)
- Art. 15: Obligación de inscribir a trabajadores
- Art. 34: Plazo de 5 días hábiles para alta
- Art. 37: Plazo de 5 días hábiles para baja
- Art. 39: Modificación salarial en 5 días hábiles

**Sanciones por incumplimiento:**
- Multas de 20 a 350 veces la UMA (~$2,100 a $36,000 MXN)
- Actualización de adeudos con recargos
- Posibles auditorías

---

## ✅ Casos de Uso Principales

### UC-IMSS-001: Alta de Trabajador ante IMSS

**Trigger:** Nuevo empleado registrado en sistema

1. Sistema valida datos requeridos (NSS, CURP, RFC, salario)
2. Genera payload para API IMSS:
   ```json
   {
     "registro_patronal": "A1234567890",
     "nss": "12345678901",
     "curp": "ABCD123456HDFRNN09",
     "nombre": "Juan Pérez López",
     "fecha_nacimiento": "1990-01-15",
     "sexo": "H",
     "salario_base_cotizacion": 350.00,
     "fecha_alta": "2025-01-20",
     "tipo_trabajador": "1", // Permanente
     "tipo_salario": "0" // Fijo
   }
   ```
3. Envía request a API IMSS
4. Recibe folio de confirmación
5. Guarda log en `imss_integration_log`
6. Actualiza estado en empleado: `imss_status = 'registered'`

**Excepciones:**
- NSS ya registrado con otro patrón
- NSS inválido (dígito verificador)
- Certificado digital expirado

---

### UC-IMSS-002: Baja de Trabajador ante IMSS

**Trigger:** Empleado dado de baja en sistema

1. Obtiene datos de baja (fecha, motivo)
2. Genera payload:
   ```json
   {
     "registro_patronal": "A1234567890",
     "nss": "12345678901",
     "fecha_baja": "2025-06-15",
     "tipo_baja": "1", // Término de relación laboral
     "causa_baja": "Renuncia voluntaria"
   }
   ```
3. Envía a API IMSS
4. Guarda confirmación
5. Actualiza `imss_status = 'unregistered'`

**Motivos de baja IMSS:**
- 1: Término de relación laboral
- 2: Despido
- 3: Defunción
- 4: Ausentismo

---

### UC-IMSS-003: Modificación Salarial

**Trigger:** Cambio de salario en sistema

1. Detecta cambio en `salary_history`
2. Si incremento > 5%, genera modificación ante IMSS
3. Payload:
   ```json
   {
     "registro_patronal": "A1234567890",
     "nss": "12345678901",
     "nuevo_sbc": 400.00,
     "fecha_efectiva": "2025-02-01",
     "tipo_modificacion": "Aumento salarial"
   }
   ```
4. Envía a IMSS
5. Guarda confirmación

**Regla:** Solo modificaciones significativas (>5% o >1 UMA)

---

### UC-IMSS-004: Generación de Archivo SUA

**Periodo:** Mensual (generado entre día 1 y 17 del mes siguiente)

**Proceso:**

1. HR accede a "IMSS" → "Generar SUA"
2. Selecciona período (ej: Enero 2025)
3. Sistema calcula para cada empleado:
   - Días cotizados en el mes
   - Salario Base de Cotización (SBC)
   - Ausentismos e incapacidades
   - Cuotas obrero-patronales por ramo:
     - Enfermedad y Maternidad: 20.4%
     - Invalidez y Vida: 1.75%
     - Retiro, Cesantía y Vejez: 6.15%
     - Guarderías y Prestaciones Sociales: 1%
     - Riesgos de Trabajo: Variable (1% - 15%)
4. Genera archivo .SUA (layout de 80 caracteres)
5. Permite descarga
6. Guarda hash del archivo generado

**Formato SUA (simplificado):**
```
*************0101202500120256  // Header
A1234567890CONSTRUCCIONES SA  // Registro patronal
12345678901PEREZ LOPEZ JUAN 0103500000000// Trabajador
99999999999TOTALES          99// Totales
```

---

### UC-IMSS-005: Consulta de Vigencia de Derechos

**Actor:** HR, Empleado

1. Ingresa NSS del empleado
2. Sistema consulta API IMSS
3. Obtiene:
   - Vigencia de derechos (activo/inactivo)
   - Semanas cotizadas
   - Última fecha de pago
   - Patrón actual
4. Muestra en pantalla

---

## 📊 Modelo de Datos

```sql
CREATE TABLE hr.imss_integration_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),
  operation_type VARCHAR(50) NOT NULL, -- alta, baja, modificacion, consulta

  request_payload JSONB NOT NULL,
  response_payload JSONB,

  status VARCHAR(20), -- pending, success, failed
  imss_folio VARCHAR(50), -- Folio de confirmación del IMSS
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_imss_log_employee ON hr.imss_integration_log(employee_id);
CREATE INDEX idx_imss_log_status ON hr.imss_integration_log(status);
CREATE INDEX idx_imss_log_created ON hr.imss_integration_log(created_at DESC);

-- Tabla para archivos SUA generados
CREATE TABLE hr.sua_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id),

  period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year INTEGER NOT NULL CHECK (period_year >= 2025),

  file_content TEXT NOT NULL, -- Contenido del archivo SUA
  file_hash VARCHAR(64) NOT NULL, -- SHA256 del archivo

  total_employees INTEGER NOT NULL,
  total_contributions DECIMAL(12, 2) NOT NULL,

  generated_by UUID REFERENCES auth_management.profiles(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(constructora_id, period_month, period_year)
);
```

---

## 🔐 Reglas de Negocio

### RN-IMSS-001: Plazos Legales
- Alta: Máximo 5 días hábiles desde fecha de ingreso
- Baja: Máximo 5 días hábiles desde fecha de baja
- Modificación: Máximo 5 días hábiles desde cambio

### RN-IMSS-002: Salario Base de Cotización (SBC)
- SBC = Salario Diario + Prestaciones
- Tope máximo: 25 veces la UMA (~$2,500 MXN/día en 2025)
- SBC mínimo: 1 UMA (~$103.74 MXN/día en 2025)

### RN-IMSS-003: Cuotas Obrero-Patronales
- Total aproximado: 27-34% del SBC
- Distribución: 70% patrón, 30% trabajador
- Calculado sobre días cotizados (no trabajados)

### RN-IMSS-004: Certificado Digital
- Requiere certificado .cer + llave privada .key del SAT
- Vigencia: 4 años
- Renovación: 30 días antes de vencimiento

---

## 🧪 Criterios de Aceptación

- ✅ Alta de empleado se envía automáticamente a IMSS en < 5 días
- ✅ Baja se procesa correctamente con motivo
- ✅ Modificación salarial se notifica si cambio > 5%
- ✅ Archivo SUA se genera correctamente con layout válido
- ✅ SUA incluye todos los empleados activos del período
- ✅ Cálculo de cuotas es correcto (validado vs calculadora IMSS)
- ✅ Logs de integración registran request, response, errores
- ✅ Alertas si certificado digital vence en < 30 días
- ✅ Retry automático si API IMSS falla (max 3 intentos)

---

## 📐 Dependencias

- ✅ RF-HR-001: Empleados (requiere NSS, CURP, salarios)
- ✅ RF-HR-003: Costeo (usa cálculo de cuotas)

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
