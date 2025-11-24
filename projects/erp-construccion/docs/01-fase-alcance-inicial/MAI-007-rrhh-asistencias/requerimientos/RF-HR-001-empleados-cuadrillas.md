# RF-HR-001: Gestión de Empleados y Cuadrillas

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**Tipo:** Requerimiento Funcional
**Prioridad:** Alta
**Estado:** 🚧 En Definición
**Última actualización:** 2025-11-17

---

## 📋 Descripción

El sistema debe permitir la gestión completa del catálogo de empleados de obra, organizados en cuadrillas y clasificados por oficios, con toda la información necesaria para cumplimiento legal (IMSS, INFONAVIT, nómina) y operativo (asistencias, costeo).

---

## 🎯 Objetivo de Negocio

1. **Organización Operativa:**
   - Tener visibilidad clara de la estructura de personal en cada obra
   - Facilitar asignación de cuadrillas a diferentes frentes de trabajo
   - Conocer capacidades y especialidades disponibles

2. **Cumplimiento Legal:**
   - Mantener datos actualizados para IMSS e INFONAVIT
   - Facilitar alta/baja de trabajadores ante instituciones
   - Cumplir con requisitos de documentación laboral

3. **Control de Costos:**
   - Base para cálculo de costeo de mano de obra
   - Asociar empleados a partidas específicas
   - Proyección de nómina por obra

---

## 👥 Actores

- **Director:** Aprueba contrataciones, define sueldos
- **HR (Recursos Humanos):** Gestiona empleados, cuadrillas, documentación
- **Residente de Obra:** Asigna cuadrillas a frentes de trabajo
- **Finance:** Consulta para cálculo de nómina y costos

---

## ✅ Casos de Uso

### UC-HR-001: Registrar Nuevo Empleado

**Actor:** HR
**Flujo principal:**

1. HR accede a "Empleados" → "Nuevo Empleado"
2. Ingresa **datos personales:**
   - Nombre completo
   - Fecha de nacimiento
   - CURP (validación de 18 caracteres)
   - RFC (validación de 13 caracteres)
   - NSS (Número de Seguro Social, validación de 11 dígitos)
   - Género
   - Estado civil
3. Ingresa **datos de contacto:**
   - Teléfono celular
   - Email (opcional)
   - Dirección completa
4. Ingresa **datos laborales:**
   - Oficio principal (de catálogo)
   - Fecha de ingreso
   - Tipo de contrato (por obra, planta, eventual)
   - Salario diario integrado (SDI)
   - Jornada (diurna, mixta, nocturna)
5. Asigna **constructora** (multi-tenant)
6. Carga **documentos:**
   - INE/IFE (PDF)
   - Comprobante de domicilio (PDF)
   - Acta de nacimiento (PDF)
   - CURP (PDF)
   - Carta de antecedentes no penales (PDF, opcional)
   - Constancia de estudios (PDF, opcional)
7. Opcionalmente asigna a **cuadrilla**
8. Sistema valida datos (duplicados, formato)
9. Sistema genera **código de empleado** (autoincrementable)
10. Sistema crea **QR code** para asistencia
11. Sistema guarda empleado con estado "activo"

**Resultado:** Empleado registrado y listo para asignación a obra

**Excepciones:**
- E1: NSS duplicado → Mostrar error, empleado ya existe
- E2: CURP inválido → Mostrar error, validar formato
- E3: RFC no coincide con CURP → Advertencia, permitir continuar
- E4: Empleado menor de 18 años → Bloquear, no permitir registro

---

### UC-HR-002: Crear Cuadrilla

**Actor:** HR o Residente
**Flujo principal:**

1. Usuario accede a "Cuadrillas" → "Nueva Cuadrilla"
2. Ingresa **datos de cuadrilla:**
   - Nombre (ej: "Cuadrilla A - Albañilería")
   - Tipo de trabajo (albañilería, electricidad, plomería, acabados, etc.)
   - Obra asignada (obligatorio)
   - Responsable/Jefe de cuadrilla (seleccionar de empleados)
3. Asigna **empleados** a la cuadrilla:
   - Búsqueda por nombre, código o oficio
   - Selección múltiple
   - Definir rol en cuadrilla (jefe, oficial, ayudante)
4. Opcionalmente asigna **herramientas** o **equipos**
5. Sistema valida:
   - Mínimo 1 empleado
   - Todos los empleados deben estar activos
   - Empleados no pueden estar en 2 cuadrillas simultáneamente
6. Sistema guarda cuadrilla

**Resultado:** Cuadrilla creada y lista para asignación a frente de trabajo

**Excepciones:**
- E1: Empleado ya asignado a otra cuadrilla → Preguntar si desea reasignar
- E2: Obra no tiene empleados disponibles → Advertencia, sugerir asignar empleados a obra primero

---

### UC-HR-003: Asignar Empleado a Obra

**Actor:** HR o Director
**Flujo principal:**

1. Usuario accede a ficha del empleado
2. Selecciona "Asignar a Obra"
3. Selecciona **obra destino** (de obras activas de la constructora)
4. Define **fecha de inicio** en la obra
5. Define **fecha de fin estimada** (opcional)
6. Define **salario específico para esta obra** (puede variar del SDI base)
7. Opcionalmente asigna a **cuadrilla** de la obra
8. Sistema valida:
   - Empleado debe estar activo
   - Obra debe estar activa
   - No puede haber overlapping de fechas en diferentes obras
9. Sistema crea registro en `employee_work_assignments`
10. Sistema genera **QR code específico de obra** (opcional)

**Resultado:** Empleado asignado a obra y disponible para registro de asistencia

**Excepciones:**
- E1: Empleado ya asignado a otra obra en mismo período → Bloquear, resolver primero
- E2: Salario específico < 50% del SDI base → Advertencia, validar con Director

---

### UC-HR-004: Dar de Baja a Empleado

**Actor:** HR o Director
**Flujo principal:**

1. Usuario accede a ficha del empleado
2. Selecciona "Dar de Baja"
3. Ingresa **motivo de baja:**
   - Renuncia voluntaria
   - Término de contrato
   - Despido justificado
   - Despido injustificado
   - Abandono de trabajo
   - Defunción
4. Ingresa **fecha de baja**
5. Opcionalmente ingresa **comentarios** (justificación detallada)
6. Sistema valida:
   - No puede haber asistencias posteriores a la fecha de baja
   - No puede haber obras activas asignadas
7. Sistema cambia estado a "terminated"
8. Sistema marca `deleted_at` (soft delete)
9. Sistema genera **alerta** para Finance (liquidación pendiente)
10. Sistema genera **alerta** para IMSS/INFONAVIT (baja ante instituciones)

**Resultado:** Empleado dado de baja, no aparece en listados activos

**Excepciones:**
- E1: Empleado tiene asistencias pendientes de aprobar → Advertencia, resolver primero
- E2: Empleado tiene adeudos → Advertencia, liquidar antes de dar de baja
- E3: Empleado con crédito INFONAVIT activo → Advertencia especial, notificar a Finance

---

### UC-HR-005: Modificar Salario de Empleado

**Actor:** Director o HR (con permiso)
**Flujo principal:**

1. Usuario accede a ficha del empleado → "Modificar Salario"
2. Visualiza **historial salarial:**
   - Fecha de cada cambio
   - Salario anterior
   - Salario nuevo
   - Autorizado por
   - Motivo
3. Ingresa **nuevo salario diario integrado**
4. Ingresa **fecha efectiva** del cambio
5. Ingresa **motivo:**
   - Aumento por antigüedad
   - Aumento por mérito
   - Ajuste por inflación
   - Cambio de oficio/puesto
   - Corrección de error
   - Incremento de salario mínimo
6. Sistema valida:
   - Nuevo salario >= Salario Mínimo vigente (consultar API SAT o tabla)
   - Fecha efectiva >= hoy
   - Usuario tiene permisos (solo Director o HR autorizado)
7. Sistema guarda en tabla `salary_history`
8. Sistema actualiza `current_salary` en tabla `employees`
9. Sistema genera **alerta** para IMSS (modificación salarial)
10. Sistema recalcula **costeo de mano de obra** en obras afectadas

**Resultado:** Salario actualizado, cambio registrado en historial

**Excepciones:**
- E1: Nuevo salario < Salario Mínimo → Bloquear, mostrar error
- E2: Reducción salarial > 20% → Advertencia, requiere justificación adicional
- E3: Empleado con crédito INFONAVIT → Advertencia, informar cambio a INFONAVIT

---

### UC-HR-006: Suspender Empleado Temporalmente

**Actor:** Director o Residente
**Flujo principal:**

1. Usuario accede a ficha del empleado → "Suspender"
2. Ingresa **motivo de suspensión:**
   - Falta injustificada
   - Incapacidad médica
   - Licencia sin goce de sueldo
   - Sanción disciplinaria
   - Suspensión preventiva (investigación)
3. Ingresa **fecha de inicio** de suspensión
4. Ingresa **fecha estimada de reactivación** (puede ser "indefinido")
5. Opcionalmente adjunta **documentos** (incapacidad médica, acta administrativa)
6. Sistema cambia estado a "suspended"
7. Sistema **bloquea** registro de asistencia
8. Sistema genera **alerta** en dashboard del Residente
9. Si suspensión > 7 días, genera **alerta** para IMSS (incapacidad)

**Resultado:** Empleado suspendido, no puede registrar asistencia

**Excepciones:**
- E1: Empleado ya suspendido → Mostrar suspensión activa, preguntar si desea modificar

---

### UC-HR-007: Reactivar Empleado Suspendido

**Actor:** HR o Director
**Flujo principal:**

1. Usuario accede a ficha del empleado suspendido
2. Selecciona "Reactivar"
3. Visualiza **motivo de suspensión** original
4. Confirma reactivación
5. Opcionalmente ingresa **comentarios** (ej: "Presentó justificante médico")
6. Sistema cambia estado a "active"
7. Sistema **habilita** registro de asistencia
8. Sistema actualiza `suspended_until = NULL`
9. Sistema notifica al Residente de la obra

**Resultado:** Empleado reactivado, puede registrar asistencia normalmente

---

## 📊 Modelo de Datos

### Empleados (employees)

```sql
CREATE TABLE hr.employees (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code VARCHAR(20) UNIQUE NOT NULL, -- Auto-generado (ej: EMP-00001)
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id),

  -- Datos personales
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),

  -- Datos fiscales y legales (CRÍTICOS)
  curp VARCHAR(18) UNIQUE NOT NULL, -- Clave Única de Registro de Población
  rfc VARCHAR(13) NOT NULL, -- Registro Federal de Contribuyentes
  nss VARCHAR(11) UNIQUE NOT NULL, -- Número de Seguro Social (IMSS)
  infonavit_number VARCHAR(11), -- Número de crédito INFONAVIT (si aplica)

  -- Contacto
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(10),

  -- Datos laborales
  primary_trade_id UUID REFERENCES hr.trades(id), -- Oficio principal
  hire_date DATE NOT NULL, -- Fecha de ingreso a la constructora
  contract_type VARCHAR(50) CHECK (contract_type IN ('permanent', 'temporary', 'per_project')),
  base_daily_salary DECIMAL(10, 2) NOT NULL, -- Salario Diario Integrado (SDI) base
  current_salary DECIMAL(10, 2) NOT NULL, -- Salario actual (puede variar del base)
  work_shift VARCHAR(20) CHECK (work_shift IN ('day', 'night', 'mixed')),

  -- Estado
  status hr.employee_status DEFAULT 'active', -- ENUM: active, suspended, terminated
  termination_date DATE,
  termination_reason TEXT,
  suspended_until DATE,
  suspension_reason TEXT,

  -- QR para asistencia
  qr_code TEXT UNIQUE, -- QR code único para registro de asistencia

  -- Documentos (URLs a S3/storage)
  documents JSONB DEFAULT '[]'::jsonb,
  -- Ejemplo: [{"type": "ine", "url": "s3://...", "uploaded_at": "2025-01-15"}]

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete
  created_by UUID REFERENCES auth_management.profiles(id),

  -- Constraints
  CONSTRAINT valid_curp_format CHECK (curp ~ '^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$'),
  CONSTRAINT valid_rfc_format CHECK (rfc ~ '^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$'),
  CONSTRAINT valid_nss_format CHECK (nss ~ '^[0-9]{11}$'),
  CONSTRAINT valid_salary CHECK (current_salary >= 0),
  CONSTRAINT valid_hire_date CHECK (hire_date <= CURRENT_DATE),
  CONSTRAINT valid_termination CHECK (
    (status = 'terminated' AND termination_date IS NOT NULL) OR
    (status != 'terminated' AND termination_date IS NULL)
  )
);

-- Índices
CREATE INDEX idx_employees_constructora ON hr.employees(constructora_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_status ON hr.employees(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_nss ON hr.employees(nss);
CREATE INDEX idx_employees_curp ON hr.employees(curp);
CREATE INDEX idx_employees_code ON hr.employees(employee_code);
CREATE INDEX idx_employees_qr ON hr.employees(qr_code);

-- Trigger para actualizar updated_at
CREATE TRIGGER set_employees_updated_at
  BEFORE UPDATE ON hr.employees
  FOR EACH ROW
  EXECUTE FUNCTION hr.update_updated_at_column();

-- Trigger para generar employee_code automáticamente
CREATE OR REPLACE FUNCTION hr.generate_employee_code()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
  new_code VARCHAR(20);
BEGIN
  -- Obtener el siguiente número
  SELECT COALESCE(MAX(CAST(SUBSTRING(employee_code FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM hr.employees
  WHERE constructora_id = NEW.constructora_id;

  -- Generar código (ej: EMP-00001)
  new_code := 'EMP-' || LPAD(next_number::TEXT, 5, '0');

  NEW.employee_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_employee_code
  BEFORE INSERT ON hr.employees
  FOR EACH ROW
  WHEN (NEW.employee_code IS NULL)
  EXECUTE FUNCTION hr.generate_employee_code();

-- Trigger para generar QR code automáticamente
CREATE OR REPLACE FUNCTION hr.generate_employee_qr()
RETURNS TRIGGER AS $$
BEGIN
  -- QR code = BASE64(employee_id + timestamp)
  NEW.qr_code := encode(
    (NEW.id::TEXT || '-' || EXTRACT(EPOCH FROM NOW())::TEXT)::bytea,
    'base64'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_employee_qr
  BEFORE INSERT ON hr.employees
  FOR EACH ROW
  WHEN (NEW.qr_code IS NULL)
  EXECUTE FUNCTION hr.generate_employee_qr();
```

---

### Oficios (trades)

```sql
CREATE TABLE hr.trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL, -- ej: "Albañil", "Electricista", "Plomero"
  description TEXT,
  category VARCHAR(50), -- ej: "Estructura", "Instalaciones", "Acabados"
  requires_certification BOOLEAN DEFAULT false, -- Si requiere certificación oficial

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO hr.trades (name, description, category, requires_certification) VALUES
  ('Albañil', 'Construcción de muros, losas, cimentaciones', 'Estructura', false),
  ('Fierrero', 'Armado de acero de refuerzo', 'Estructura', false),
  ('Carpintero', 'Construcción de cimbra y acabados de madera', 'Estructura', false),
  ('Electricista', 'Instalaciones eléctricas', 'Instalaciones', true),
  ('Plomero', 'Instalaciones hidráulicas y sanitarias', 'Instalaciones', true),
  ('Yesero', 'Acabados de yeso', 'Acabados', false),
  ('Pintor', 'Acabados de pintura', 'Acabados', false),
  ('Herrero', 'Estructuras metálicas y herrería', 'Estructura', false),
  ('Impermeabilizador', 'Impermeabilización de losas y azoteas', 'Acabados', true),
  ('Vidriero', 'Instalación de cancelería y vidrios', 'Acabados', false),
  ('Ayudante General', 'Apoyo general en obra', 'General', false);
```

---

### Cuadrillas (crews)

```sql
CREATE TABLE hr.crews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id),
  work_id UUID REFERENCES projects.projects(id), -- Obra asignada (puede cambiar)

  name VARCHAR(255) NOT NULL, -- ej: "Cuadrilla A - Albañilería"
  trade_type_id UUID REFERENCES hr.trades(id), -- Tipo de trabajo principal
  foreman_employee_id UUID REFERENCES hr.employees(id), -- Jefe de cuadrilla

  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'disbanded')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(constructora_id, name)
);

CREATE INDEX idx_crews_work ON hr.crews(work_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crews_status ON hr.crews(status) WHERE deleted_at IS NULL;
```

---

### Miembros de Cuadrilla (crew_members)

```sql
CREATE TABLE hr.crew_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID NOT NULL REFERENCES hr.crews(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr.employees(id),

  role_in_crew VARCHAR(50) CHECK (role_in_crew IN ('foreman', 'skilled', 'helper')),
  -- foreman: jefe de cuadrilla
  -- skilled: oficial / trabajador calificado
  -- helper: ayudante

  joined_at DATE DEFAULT CURRENT_DATE,
  left_at DATE,

  UNIQUE(crew_id, employee_id, left_at), -- Un empleado no puede estar 2 veces activo en la misma cuadrilla
  CONSTRAINT no_overlapping_crew_membership CHECK (
    (left_at IS NULL) OR (left_at >= joined_at)
  )
);

CREATE INDEX idx_crew_members_employee ON hr.crew_members(employee_id) WHERE left_at IS NULL;
CREATE INDEX idx_crew_members_crew ON hr.crew_members(crew_id) WHERE left_at IS NULL;

-- Constraint: Empleado no puede estar en 2 cuadrillas simultáneamente
CREATE OR REPLACE FUNCTION hr.check_employee_single_crew()
RETURNS TRIGGER AS $$
DECLARE
  active_crews INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO active_crews
  FROM hr.crew_members
  WHERE employee_id = NEW.employee_id
    AND left_at IS NULL
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

  IF active_crews > 0 THEN
    RAISE EXCEPTION 'El empleado ya está asignado a otra cuadrilla activa';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_employee_single_crew
  BEFORE INSERT OR UPDATE ON hr.crew_members
  FOR EACH ROW
  WHEN (NEW.left_at IS NULL)
  EXECUTE FUNCTION hr.check_employee_single_crew();
```

---

### Asignaciones de Empleado a Obra (employee_work_assignments)

```sql
CREATE TABLE hr.employee_work_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),
  work_id UUID NOT NULL REFERENCES projects.projects(id),

  start_date DATE NOT NULL,
  end_date DATE, -- NULL = asignación activa

  work_specific_salary DECIMAL(10, 2), -- Salario específico para esta obra (puede diferir del base)
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT no_overlapping_assignments CHECK (
    (end_date IS NULL) OR (end_date >= start_date)
  )
);

CREATE INDEX idx_work_assignments_employee ON hr.employee_work_assignments(employee_id);
CREATE INDEX idx_work_assignments_work ON hr.employee_work_assignments(work_id);
CREATE INDEX idx_work_assignments_active ON hr.employee_work_assignments(employee_id, work_id)
  WHERE end_date IS NULL;

-- Constraint: Empleado no puede estar en 2 obras simultáneamente
CREATE OR REPLACE FUNCTION hr.check_employee_single_work()
RETURNS TRIGGER AS $$
DECLARE
  overlapping_assignments INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO overlapping_assignments
  FROM hr.employee_work_assignments
  WHERE employee_id = NEW.employee_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND (
      (end_date IS NULL AND NEW.end_date IS NULL) OR
      (end_date IS NULL AND NEW.start_date <= end_date) OR
      (NEW.end_date IS NULL AND start_date <= NEW.end_date) OR
      (start_date <= NEW.end_date AND end_date >= NEW.start_date)
    );

  IF overlapping_assignments > 0 THEN
    RAISE EXCEPTION 'El empleado ya está asignado a otra obra en el mismo período';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_employee_single_work
  BEFORE INSERT OR UPDATE ON hr.employee_work_assignments
  FOR EACH ROW
  EXECUTE FUNCTION hr.check_employee_single_work();
```

---

### Historial Salarial (salary_history)

```sql
CREATE TABLE hr.salary_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),

  previous_salary DECIMAL(10, 2) NOT NULL,
  new_salary DECIMAL(10, 2) NOT NULL,
  effective_date DATE NOT NULL,

  reason VARCHAR(255) NOT NULL, -- Motivo del cambio
  notes TEXT,

  authorized_by UUID REFERENCES auth_management.profiles(id), -- Quién autorizó

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_salary_history_employee ON hr.salary_history(employee_id);
CREATE INDEX idx_salary_history_date ON hr.salary_history(effective_date DESC);

-- Trigger: Guardar en historial al cambiar salario en employees
CREATE OR REPLACE FUNCTION hr.track_salary_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.current_salary IS DISTINCT FROM NEW.current_salary THEN
    INSERT INTO hr.salary_history (
      employee_id,
      previous_salary,
      new_salary,
      effective_date,
      reason,
      authorized_by
    ) VALUES (
      NEW.id,
      OLD.current_salary,
      NEW.current_salary,
      CURRENT_DATE,
      'Modificación manual', -- Puede mejorarse pasando el motivo desde la app
      auth_management.get_current_user_id()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_salary_changes
  AFTER UPDATE ON hr.employees
  FOR EACH ROW
  EXECUTE FUNCTION hr.track_salary_changes();
```

---

## 🔐 Reglas de Negocio

### RN-HR-001: Validación de CURP
- CURP debe tener exactamente 18 caracteres
- Formato: 4 letras + 6 dígitos (fecha) + H/M (sexo) + 5 letras (lugar) + 2 dígitos (verificación)
- Debe ser único en el sistema por constructora
- Fecha en CURP debe coincidir con fecha de nacimiento del empleado

### RN-HR-002: Validación de RFC
- RFC debe tener 13 caracteres (personas físicas)
- Formato: 4 letras + 6 dígitos (fecha) + 3 caracteres (homoclave)
- Debe coincidir con CURP (primeros 10 caracteres)

### RN-HR-003: Validación de NSS
- NSS debe tener exactamente 11 dígitos
- Debe ser único a nivel nacional (no puede haber duplicados)
- Validar contra algoritmo de dígito verificador del IMSS

### RN-HR-004: Salario Mínimo
- Salario diario integrado debe ser >= Salario Mínimo vigente en México
- Salario mínimo varía por zona geográfica (consultar tabla)
- Al 2025: ~$248.93 MXN/día (zona general)

### RN-HR-005: Edad Mínima
- Empleado debe tener mínimo 18 años (mayoría de edad)
- Bloquear registro de menores de edad

### RN-HR-006: Fecha de Ingreso
- Fecha de ingreso no puede ser futura
- Fecha de ingreso debe ser >= fecha de creación de la constructora

### RN-HR-007: Baja de Empleado
- No pueden existir asistencias posteriores a la fecha de baja
- No pueden existir asignaciones a obras activas
- Fecha de baja debe ser >= fecha de ingreso

### RN-HR-008: Cuadrillas
- Una cuadrilla debe tener mínimo 1 empleado (el jefe)
- Un empleado solo puede estar en 1 cuadrilla activa a la vez
- Jefe de cuadrilla debe ser miembro de la misma cuadrilla

### RN-HR-009: Asignación a Obra
- Empleado solo puede estar asignado a 1 obra a la vez
- Empleado debe estar en estado "active" para ser asignado
- Obra debe estar en estado "active" o "planning"

### RN-HR-010: Suspensión
- Empleado suspendido no puede registrar asistencia
- Suspensión no afecta asignación a obra (sigue asignado)
- Suspensión > 7 días debe generar alerta para IMSS

---

## 🧪 Criterios de Aceptación

### CA-HR-001: Registro de Empleado
- ✅ Permite registrar empleado con todos los campos requeridos
- ✅ Valida formato de CURP (18 caracteres, patrón correcto)
- ✅ Valida formato de RFC (13 caracteres, coincide con CURP)
- ✅ Valida formato de NSS (11 dígitos, único)
- ✅ Bloquea registro de empleados < 18 años
- ✅ Genera código de empleado automáticamente (EMP-00001, EMP-00002, etc.)
- ✅ Genera QR code único para asistencia
- ✅ Permite cargar documentos (PDF)
- ✅ Guarda empleado en estado "active"

### CA-HR-002: Cuadrillas
- ✅ Permite crear cuadrilla con nombre, tipo de trabajo, jefe
- ✅ Permite asignar empleados a cuadrilla
- ✅ Bloquea asignación de empleado a 2 cuadrillas simultáneas
- ✅ Permite modificar miembros de cuadrilla
- ✅ Permite disolver cuadrilla (cambiar estado a "disbanded")
- ✅ Al disolver, libera a todos los empleados

### CA-HR-003: Asignación a Obra
- ✅ Permite asignar empleado a obra con fecha de inicio
- ✅ Bloquea asignación a 2 obras simultáneas
- ✅ Permite definir salario específico de obra
- ✅ Permite desasignar empleado (definir fecha de fin)
- ✅ Listado de empleados de una obra muestra solo asignados activos

### CA-HR-004: Cambio de Salario
- ✅ Permite modificar salario de empleado
- ✅ Requiere motivo obligatorio
- ✅ Guarda cambio en historial salarial
- ✅ Bloquea salario < Salario Mínimo vigente
- ✅ Advertencia si reducción > 20%
- ✅ Solo usuarios autorizados (Director, HR) pueden cambiar salario

### CA-HR-005: Baja de Empleado
- ✅ Permite dar de baja con motivo y fecha
- ✅ Valida que no haya asistencias posteriores a la fecha de baja
- ✅ Valida que no haya asignaciones activas a obras
- ✅ Cambia estado a "terminated"
- ✅ Soft delete (marca deleted_at)
- ✅ Genera alerta para Finance y para IMSS/INFONAVIT

### CA-HR-006: Suspensión
- ✅ Permite suspender empleado con motivo
- ✅ Cambia estado a "suspended"
- ✅ Bloquea registro de asistencia mientras esté suspendido
- ✅ Permite reactivar empleado
- ✅ Si suspensión > 7 días, genera alerta para IMSS

---

## 📐 Dependencias

### Upstream (depende de):
- ✅ RF-AUTH-003: Multi-tenancy (empleados por constructora)
- ✅ RF-AUTH-001: RBAC (permisos de HR, Director)

### Downstream (otros dependen de esto):
- 🔜 RF-HR-002: Asistencia Biométrica (requiere catálogo de empleados)
- 🔜 RF-HR-003: Costeo de Mano de Obra (requiere salarios)
- 🔜 RF-HR-004: Integración IMSS (requiere NSS, CURP, RFC)
- 🔜 RF-HR-005: Integración INFONAVIT (requiere NSS, RFC)

---

## 🎯 KPIs

- **Tiempo promedio de registro de empleado:** < 5 minutos
- **Tasa de error en validación de CURP/RFC/NSS:** < 2%
- **Empleados activos por constructora:** Métrica visible en dashboard
- **Empleados por obra:** Métrica visible por proyecto
- **Rotación de personal:** (Bajas del mes / Empleados promedio) × 100

---

## 📝 Notas Adicionales

### Datos Sensibles (GDPR / LFPDPPP)
- CURP, RFC, NSS son datos personales sensibles
- Requieren consentimiento explícito del empleado
- Acceso restringido (solo HR, Director, Finance)
- Logs de auditoría en accesos a datos sensibles
- Encriptación en base de datos (columnas sensibles)

### Cumplimiento Legal
- Mantener expediente digital por empleado (documentos PDF)
- Retención de datos: Mínimo 5 años después de baja
- Derecho al olvido: Eliminación de datos a solicitud (después del período legal)

### Escalabilidad
- Constructora pequeña: ~20-50 empleados
- Constructora mediana: ~100-300 empleados
- Constructora grande: ~500-2000 empleados
- Sistema debe soportar hasta 10,000 empleados por instancia

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
