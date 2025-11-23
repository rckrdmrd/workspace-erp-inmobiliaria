# US-HR-001: Catálogo de Empleados y Cuadrillas

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-001
**ET:** ET-HR-001
**Tipo:** Historia de Usuario
**Prioridad:** Alta
**Story Points:** 8
**Sprint:** 9
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📖 Historia de Usuario

**Como** Director de Constructora o Gerente de RRHH
**Quiero** gestionar el catálogo de empleados con sus datos fiscales y asignarlos a cuadrillas
**Para** mantener un registro completo de mi personal, cumplir con obligaciones fiscales y organizar el trabajo en obra

---

## 🎯 Criterios de Aceptación

### CA-1: Registro de Empleado Completo ✅

**Dado que** soy Director o Gerente de RRHH
**Cuando** registro un nuevo empleado en el sistema
**Entonces** el sistema debe:

- Solicitar datos personales (nombre, apellidos, fecha de nacimiento, género)
- Solicitar datos fiscales (CURP, RFC, NSS)
- Validar formato de CURP (18 caracteres: 4 letras + 6 dígitos + sexo + 5 letras + 2 dígitos)
- Validar formato de NSS (11 dígitos)
- Validar unicidad de CURP y NSS
- Generar automáticamente código de empleado (EMP-00001, EMP-00002, etc.)
- Generar QR code único para asistencia
- Registrar fecha de contratación y tipo de contrato
- Registrar salario diario base
- Permitir cargar fotografía del empleado
- Guardar información de contacto (teléfono, email, dirección)
- Asignar estado inicial "active"

**Y** mostrar mensaje de confirmación con código generado

### CA-2: Validaciones Fiscales ✅

**Dado que** estoy registrando un empleado
**Cuando** ingreso los datos fiscales
**Entonces** el sistema debe validar:

**CURP:**
- Longitud exacta: 18 caracteres
- Formato: `^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$`
- Ejemplo válido: `BADD110313HCMLNS09`
- Mostrar error si no cumple el formato

**NSS:**
- Longitud exacta: 11 dígitos numéricos
- Unicidad en el sistema
- Ejemplo válido: `12345678901`

**RFC:**
- Longitud: 13 caracteres
- Formato: `^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$`
- Ejemplo válido: `BADD110313AB1`

**Y** bloquear el guardado si alguna validación falla

### CA-3: Creación de Cuadrilla ✅

**Dado que** soy Director o Residente de Obra
**Cuando** creo una nueva cuadrilla
**Entonces** el sistema debe:

- Solicitar nombre de la cuadrilla (ej: "Cuadrilla de Albañilería A")
- Solicitar descripción opcional
- Permitir seleccionar tipo de cuadrilla: albañilería, herrería, plomería, electricidad, acabados, general
- Generar código automático (CREW-00001)
- Permitir asignar supervisor (debe ser un empleado activo)
- Asignar estado inicial "active"

**Y** guardar la cuadrilla como disponible para asignación

### CA-4: Asignación de Empleados a Cuadrilla ✅

**Dado que** tengo una cuadrilla creada
**Cuando** asigno empleados a la cuadrilla
**Entonces** el sistema debe:

- Mostrar lista de empleados activos disponibles
- Permitir búsqueda por nombre, código o NSS
- Permitir selección múltiple de empleados
- Registrar fecha de asignación automáticamente
- Validar que el empleado no esté ya en otra cuadrilla activa del mismo tipo
- Marcar al supervisor como tal en la cuadrilla

**Y** actualizar el conteo de miembros de la cuadrilla

### CA-5: Consulta y Filtrado ✅

**Dado que** necesito consultar empleados
**Cuando** accedo al catálogo de empleados
**Entonces** puedo:

- Ver tabla paginada con: foto, código, nombre completo, NSS, puesto, salario, cuadrilla actual, estado
- Filtrar por estado: activo, suspendido, dado de baja
- Filtrar por cuadrilla asignada
- Buscar por nombre, código, CURP o NSS
- Ordenar por cualquier columna
- Ver 20 empleados por página con paginación

**Y** ver contador total de empleados según filtros aplicados

### CA-6: Edición de Empleado ✅

**Dado que** necesito actualizar datos de un empleado
**Cuando** selecciono "Editar" en un empleado
**Entonces** puedo:

- Modificar datos personales (teléfono, dirección, foto)
- Modificar salario diario (se registra como cambio salarial)
- Cambiar tipo de contrato
- Cambiar puesto
- **NO** puedo modificar CURP, NSS, RFC (datos fiscales inmutables)

**Y** se registra log de cambios con usuario, fecha y campos modificados

### CA-7: Suspensión de Empleado ✅

**Dado que** un empleado tiene un problema disciplinario
**Cuando** selecciono "Suspender" en el empleado
**Entonces** el sistema debe:

- Solicitar motivo de suspensión (obligatorio)
- Solicitar fecha de inicio de suspensión
- Solicitar fecha estimada de fin (opcional)
- Cambiar estado a "suspended"
- Deshabilitar acceso del empleado a la app móvil
- Removerlo temporalmente de su cuadrilla (sin eliminar el historial)
- Enviar notificación al supervisor de la cuadrilla

**Y** el empleado no aparece en listas de asignación hasta reactivación

### CA-8: Baja de Empleado ✅

**Dado que** un empleado termina su relación laboral
**Cuando** selecciono "Dar de baja" en el empleado
**Entonces** el sistema debe:

- Solicitar fecha de baja (no puede ser anterior a fecha de contratación)
- Solicitar motivo: renuncia, despido, término de contrato, defunción, otro
- Solicitar comentarios adicionales (opcional)
- Cambiar estado a "terminated"
- Registrar fecha de baja en `terminationDate`
- Cerrar todas las asignaciones a cuadrillas
- Deshabilitar permanentemente acceso a la app móvil
- Emitir evento `employee.terminated` para integración con IMSS

**Y** el empleado queda disponible solo para consulta histórica

### CA-9: Gestión de Cuadrillas ✅

**Dado que** administro cuadrillas
**Cuando** accedo al módulo de cuadrillas
**Entonces** puedo:

- Ver lista de cuadrillas con: código, nombre, tipo, supervisor, # miembros, estado
- Filtrar por tipo de cuadrilla
- Filtrar por estado: activa, inactiva
- Ver detalle de cuadrilla mostrando:
  - Información básica
  - Lista de miembros actuales con foto, nombre, puesto, fecha de asignación
  - Historial de asignaciones pasadas
  - Obras en las que ha trabajado
- Editar información de la cuadrilla
- Desactivar cuadrilla (no se puede eliminar si tiene historial)

**Y** ver métricas: total de cuadrillas, promedio de miembros, cuadrillas sin supervisor

### CA-10: Permisos por Rol 🔐

**Roles y Permisos:**

| Acción | Director | Engineer | Resident | HR | Finance | Purchases |
|--------|----------|----------|----------|-----|---------|-----------|
| Ver empleados | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Crear empleado | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Editar empleado | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Suspender empleado | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Dar de baja | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Crear cuadrilla | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Asignar empleados a cuadrilla | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver salarios | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |

**Entonces** el sistema debe validar permisos antes de mostrar acciones

---

## 🔧 Detalles Técnicos

### Stack Tecnológico

**Backend:**
- NestJS 10+ con TypeScript
- TypeORM para ORM
- PostgreSQL 15+ con schemas
- class-validator para validaciones
- @nestjs/event-emitter para eventos

**Frontend:**
- React 18 con TypeScript
- Vite para bundling
- React Hook Form + Zod para formularios
- TanStack Query para data fetching
- shadcn/ui para componentes
- Zustand para estado global

### Entidades Principales

```typescript
// Employee Entity
@Entity('employees', { schema: 'hr' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  employeeCode: string; // EMP-00001

  @Column({ type: 'uuid' })
  constructoraId: string;

  @Column({ type: 'varchar', length: 18, unique: true })
  curp: string;

  @Column({ type: 'varchar', length: 13 })
  rfc: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  nss: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: string;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'enum', enum: ['permanent', 'temporary', 'project_based'] })
  contractType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentSalary: number;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ type: 'text', nullable: true })
  qrCode: string; // Base64 encoded QR

  @Column({ type: 'enum', enum: ['active', 'suspended', 'terminated'] })
  status: string;

  @Column({ type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ type: 'text', nullable: true })
  terminationReason: string;

  @OneToMany(() => CrewMember, member => member.employee)
  crewMemberships: CrewMember[];
}

// Crew Entity
@Entity('crews', { schema: 'hr' })
export class Crew {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  crewCode: string; // CREW-00001

  @Column({ type: 'uuid' })
  constructoraId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['masonry', 'ironwork', 'plumbing', 'electrical', 'finishing', 'general'] })
  crewType: string;

  @Column({ type: 'uuid', nullable: true })
  supervisorId: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  status: string;

  @OneToMany(() => CrewMember, member => member.crew)
  members: CrewMember[];
}

// CrewMember Entity
@Entity('crew_members', { schema: 'hr' })
export class CrewMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  crewId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  assignedDate: Date;

  @Column({ type: 'date', nullable: true })
  removedDate: Date;

  @Column({ type: 'boolean', default: false })
  isSupervisor: boolean;

  @ManyToOne(() => Crew, crew => crew.members)
  @JoinColumn({ name: 'crewId' })
  crew: Crew;

  @ManyToOne(() => Employee, emp => emp.crewMemberships)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
```

### Endpoints API

```typescript
// Employee Endpoints
GET    /api/hr/employees                    // Listar con filtros
POST   /api/hr/employees                    // Crear empleado
GET    /api/hr/employees/:id                // Detalle
PATCH  /api/hr/employees/:id                // Actualizar
POST   /api/hr/employees/:id/suspend        // Suspender
POST   /api/hr/employees/:id/reactivate     // Reactivar
POST   /api/hr/employees/:id/terminate      // Dar de baja
GET    /api/hr/employees/:id/history        // Historial de cambios

// Crew Endpoints
GET    /api/hr/crews                        // Listar cuadrillas
POST   /api/hr/crews                        // Crear cuadrilla
GET    /api/hr/crews/:id                    // Detalle
PATCH  /api/hr/crews/:id                    // Actualizar
POST   /api/hr/crews/:id/members            // Asignar empleados
DELETE /api/hr/crews/:id/members/:memberId  // Remover empleado
GET    /api/hr/crews/:id/history            // Historial
```

### Validaciones Backend

```typescript
// CreateEmployeeDto
export class CreateEmployeeDto {
  @IsNotEmpty()
  @Length(18, 18)
  @Matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, {
    message: 'CURP inválido'
  })
  curp: string;

  @IsNotEmpty()
  @Length(13, 13)
  @Matches(/^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$/)
  rfc: string;

  @IsNotEmpty()
  @Length(11, 11)
  @IsNumberString()
  nss: string;

  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(['male', 'female'])
  gender: string;

  @IsDateString()
  hireDate: string;

  @IsEnum(['permanent', 'temporary', 'project_based'])
  contractType: string;

  @IsNumber()
  @Min(248.93) // Salario mínimo 2025
  currentSalary: number;

  @IsNotEmpty()
  @MaxLength(100)
  position: string;
}
```

### Componentes Frontend

```typescript
// EmployeeForm Component
interface EmployeeFormProps {
  employeeId?: string; // Para edición
  onSuccess: () => void;
}

export function EmployeeForm({ employeeId, onSuccess }: EmployeeFormProps) {
  const formSchema = z.object({
    curp: z.string()
      .length(18, 'CURP debe tener 18 caracteres')
      .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, 'Formato CURP inválido'),
    rfc: z.string()
      .length(13, 'RFC debe tener 13 caracteres')
      .regex(/^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$/),
    nss: z.string()
      .length(11, 'NSS debe tener 11 dígitos')
      .regex(/^[0-9]{11}$/),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    dateOfBirth: z.string(),
    gender: z.enum(['male', 'female']),
    hireDate: z.string(),
    contractType: z.enum(['permanent', 'temporary', 'project_based']),
    currentSalary: z.number().min(248.93),
    position: z.string().min(2).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // ... render form with shadcn/ui components
}
```

---

## 🧪 Casos de Prueba

### TC-HR-001: Crear Empleado con Datos Válidos ✅

**Precondiciones:**
- Usuario autenticado como Director o HR
- Constructora seleccionada

**Pasos:**
1. Navegar a "RRHH" > "Empleados" > "Nuevo Empleado"
2. Llenar formulario:
   - CURP: `BADD110313HCMLNS09`
   - RFC: `BADD110313AB1`
   - NSS: `12345678901`
   - Nombre: `Juan`
   - Apellidos: `Pérez García`
   - Fecha de nacimiento: `1990-05-15`
   - Género: `male`
   - Fecha de contratación: `2025-01-15`
   - Tipo de contrato: `permanent`
   - Salario diario: `450.00`
   - Puesto: `Albañil`
3. Hacer clic en "Guardar"

**Resultado esperado:**
- Empleado creado exitosamente
- Código generado: `EMP-00001` (o siguiente secuencial)
- QR code generado automáticamente
- Estado: `active`
- Mensaje: "Empleado creado exitosamente con código EMP-00001"
- Redirección a lista de empleados

### TC-HR-002: Validación de CURP Inválido ❌

**Pasos:**
1. Intentar crear empleado con CURP: `INVALID123`

**Resultado esperado:**
- Error: "Formato CURP inválido"
- No se permite guardar
- Campo CURP marcado en rojo

### TC-HR-003: Validación de NSS Duplicado ❌

**Precondiciones:**
- Empleado existente con NSS `12345678901`

**Pasos:**
1. Intentar crear nuevo empleado con mismo NSS

**Resultado esperado:**
- Error: "NSS ya registrado en el sistema"
- No se permite guardar
- Sugerencia: "Verifique si el empleado ya existe"

### TC-HR-004: Crear Cuadrilla y Asignar Empleados ✅

**Precondiciones:**
- 3 empleados activos creados

**Pasos:**
1. Navegar a "RRHH" > "Cuadrillas" > "Nueva Cuadrilla"
2. Llenar:
   - Nombre: `Cuadrilla de Albañilería A`
   - Tipo: `masonry`
   - Supervisor: Seleccionar empleado 1
3. Guardar cuadrilla
4. Hacer clic en "Asignar empleados"
5. Seleccionar empleados 2 y 3
6. Confirmar asignación

**Resultado esperado:**
- Cuadrilla creada con código `CREW-00001`
- 3 miembros totales (1 supervisor + 2 empleados)
- Empleado 1 marcado como `isSupervisor: true`
- Fecha de asignación: fecha actual
- Vista de detalle muestra 3 empleados con fotos

### TC-HR-005: Suspender Empleado ⚠️

**Precondiciones:**
- Empleado activo con código `EMP-00001`
- Empleado asignado a cuadrilla `CREW-00001`

**Pasos:**
1. Ir a detalle del empleado
2. Clic en "Suspender"
3. Llenar formulario:
   - Motivo: `Falta injustificada grave`
   - Fecha inicio: `2025-11-20`
   - Fecha fin estimada: `2025-11-27` (7 días)
4. Confirmar suspensión

**Resultado esperado:**
- Estado cambia a `suspended`
- Empleado removido de cuadrilla (pero mantiene historial)
- Badge rojo "SUSPENDIDO" en la lista
- No aparece en selector de asignación de cuadrillas
- Log de cambio registrado con usuario y fecha

### TC-HR-006: Dar de Baja Empleado 🔴

**Precondiciones:**
- Empleado activo con código `EMP-00001`
- Fecha de contratación: `2025-01-15`

**Pasos:**
1. Ir a detalle del empleado
2. Clic en "Dar de baja"
3. Llenar:
   - Fecha de baja: `2025-11-15`
   - Motivo: `renuncia`
   - Comentarios: `Renuncia voluntaria para nuevo empleo`
4. Confirmar

**Resultado esperado:**
- Estado cambia a `terminated`
- Campo `terminationDate` = `2025-11-15`
- Todas las asignaciones a cuadrillas cerradas
- Evento `employee.terminated` emitido (para IMSS)
- Empleado visible solo en vista histórica
- Badge negro "DADO DE BAJA"

### TC-HR-007: Filtros y Búsqueda ✅

**Precondiciones:**
- 50 empleados en el sistema con diferentes estados

**Pasos:**
1. Ir a "RRHH" > "Empleados"
2. Filtrar por estado: `active`
3. Buscar: `Juan`
4. Ordenar por: `Salario DESC`

**Resultado esperado:**
- Solo empleados activos mostrados
- Solo empleados con nombre "Juan" visibles
- Ordenados de mayor a menor salario
- Paginación funcional (20 por página)
- Contador: "Mostrando X de Y empleados"

### TC-HR-008: Permisos - Rol Finance 🔐

**Precondiciones:**
- Usuario autenticado con rol `finance`

**Pasos:**
1. Navegar a "RRHH" > "Empleados"
2. Intentar hacer clic en "Nuevo Empleado"

**Resultado esperado:**
- Botón "Nuevo Empleado" NO visible
- Puede ver lista de empleados
- Puede ver salarios en la tabla
- NO puede editar, suspender o dar de baja

### TC-HR-009: Edición de Empleado con Cambio Salarial ✅

**Precondiciones:**
- Empleado con salario actual: `450.00`

**Pasos:**
1. Editar empleado
2. Cambiar salario a: `500.00`
3. Guardar

**Resultado esperado:**
- Salario actualizado a `500.00`
- Registro en `employee_changes` con:
  - `field: 'currentSalary'`
  - `oldValue: '450.00'`
  - `newValue: '500.00'`
  - `changedBy: userId`
  - `changedAt: timestamp`
- Visible en historial de empleado

### TC-HR-010: QR Code Generado Correctamente ✅

**Precondiciones:**
- Empleado recién creado

**Pasos:**
1. Ver detalle del empleado
2. Verificar sección "QR Code"
3. Hacer clic en "Descargar QR"

**Resultado esperado:**
- QR code visible en pantalla
- Formato: Base64 encoded PNG
- Contenido del QR: `employee:{employeeId}`
- Ejemplo: `employee:550e8400-e29b-41d4-a716-446655440000`
- Descarga como `EMP-00001-QR.png`
- Tamaño: 256x256 px

---

## 📦 Dependencias

### Dependencias de Otros US

- ✅ **US-FUND-001:** Sistema de autenticación (roles, permisos)
- ✅ **US-FUND-002:** Multi-tenancy (constructoraId en contexto)
- ✅ **US-FUND-004:** Infraestructura base (DB schemas, backend, frontend)
- ✅ **US-FUND-006:** API RESTful (paginación, filtros, ordenamiento)

### Dependencias Externas

**Backend:**
```json
{
  "qrcode": "^1.5.3",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1"
}
```

**Frontend:**
```json
{
  "react-hook-form": "^7.48.2",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.2",
  "@tanstack/react-query": "^5.8.4"
}
```

---

## ⚠️ Riesgos

### R-1: Validación de CURP/RFC No Exhaustiva

**Descripción:** La validación solo verifica formato, no autenticidad con SAT
**Impacto:** Medio
**Probabilidad:** Baja
**Mitigación:**
- Documentar que es solo validación de formato
- Fase 2: Integración con API del SAT para validación real
- Implementar doble verificación manual por RRHH

### R-2: Migración de Datos Históricos

**Descripción:** Clientes pueden tener empleados históricos de sistemas anteriores
**Impacto:** Alto
**Probabilidad:** Alta
**Mitigación:**
- Crear endpoint especial `/api/hr/employees/import`
- Archivo CSV con template descargable
- Validación de datos antes de importación masiva
- Rollback automático si falla cualquier registro

### R-3: Unicidad de NSS Entre Constructoras

**Descripción:** NSS debe ser único en toda la BD, no solo por constructora
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- Constraint `UNIQUE` a nivel de BD en columna `nss`
- Error claro si se detecta duplicado
- Búsqueda global de NSS para identificar constructora donde ya existe

### R-4: Rendimiento con Miles de Empleados

**Descripción:** Constructoras grandes pueden tener 1000+ empleados
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- Paginación obligatoria (max 100 por página)
- Índices en: `employeeCode`, `curp`, `nss`, `status`, `constructoraId`
- Búsqueda full-text en PostgreSQL para nombre
- Cache de cuadrillas activas en Redis

---

## 📊 Métricas de Éxito

**Métricas Funcionales:**
- ✅ 100% de empleados tienen CURP, RFC y NSS válidos
- ✅ 95% de cuadrillas tienen supervisor asignado
- ✅ Tiempo promedio de registro de empleado: < 3 minutos
- ✅ Tiempo promedio de creación de cuadrilla: < 1 minuto

**Métricas Técnicas:**
- ✅ Endpoint de listado responde en < 500ms con 100 empleados
- ✅ Búsqueda por NSS responde en < 100ms
- ✅ QR code generado en < 200ms
- ✅ Importación masiva: 100 empleados en < 10 segundos

**Métricas de Calidad:**
- ✅ Cobertura de tests: > 80%
- ✅ 0 errores críticos en producción en primer mes
- ✅ 100% de validaciones de datos fiscales pasando

---

## 🔄 Estados de Empleado

```mermaid
stateDiagram-v2
    [*] --> active: Crear empleado
    active --> suspended: Suspender
    suspended --> active: Reactivar
    active --> terminated: Dar de baja
    suspended --> terminated: Dar de baja
    terminated --> [*]
```

---

## 📋 Checklist de Implementación

### Backend
- [ ] Crear schemas: `hr.employees`, `hr.crews`, `hr.crew_members`
- [ ] Implementar entities con TypeORM
- [ ] Crear triggers para auto-generación de códigos
- [ ] Implementar DTOs con validaciones
- [ ] Implementar EmployeeService con 8 métodos
- [ ] Implementar CrewService con 6 métodos
- [ ] Crear endpoints RESTful con Swagger docs
- [ ] Implementar guards de permisos por rol
- [ ] Generar QR codes con librería `qrcode`
- [ ] Crear event emitters para `employee.terminated`
- [ ] Implementar logs de cambios (audit trail)
- [ ] Crear seeds de prueba con 20 empleados y 5 cuadrillas

### Frontend
- [ ] Crear páginas: EmployeeList, EmployeeDetail, EmployeeForm
- [ ] Crear páginas: CrewList, CrewDetail, CrewForm
- [ ] Implementar EmployeeForm con React Hook Form + Zod
- [ ] Implementar CrewForm con asignación de empleados
- [ ] Crear componente EmployeeCard con foto y QR
- [ ] Implementar filtros y búsqueda en listas
- [ ] Implementar paginación con TanStack Query
- [ ] Crear modales: SuspendEmployee, TerminateEmployee
- [ ] Implementar visualización de QR code
- [ ] Crear vista de historial de cambios
- [ ] Implementar permisos por rol en UI
- [ ] Agregar toasts para confirmaciones y errores

### Testing
- [ ] Tests unitarios de validaciones (CURP, RFC, NSS)
- [ ] Tests de servicios (create, suspend, terminate)
- [ ] Tests de endpoints con supertest
- [ ] Tests de permisos por rol
- [ ] Tests de generación de códigos secuenciales
- [ ] Tests de generación de QR codes
- [ ] Tests de eventos (employee.terminated)
- [ ] Tests E2E de flujo completo
- [ ] Tests de rendimiento con 1000 empleados
- [ ] Tests de importación masiva

### Documentación
- [ ] Swagger docs completo
- [ ] README de módulo HR
- [ ] Ejemplos de validaciones
- [ ] Template CSV para importación
- [ ] Diagramas de flujo
- [ ] Manual de usuario

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
**Autor:** Equipo de Desarrollo
**Revisado por:** Product Owner
