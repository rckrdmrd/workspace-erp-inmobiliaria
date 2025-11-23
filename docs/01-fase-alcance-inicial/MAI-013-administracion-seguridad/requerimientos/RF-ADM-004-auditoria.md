# RF-ADM-004: Auditoría Completa y Trazabilidad de Cambios

**ID:** RF-ADM-004
**Módulo:** MAI-013 - Administración & Seguridad
**Tipo:** Requerimiento Funcional
**Prioridad:** P0 (Crítica)
**Fecha de creación:** 2025-11-20
**Versión:** 1.0

---

## 📋 Descripción

El sistema debe proporcionar **auditoría completa y automática** de todas las operaciones críticas, permitiendo:

- **Registro automático** de eventos de seguridad, cambios de datos y operaciones financieras
- **Trazabilidad completa:** Quién, qué, cuándo, dónde, por qué, cómo
- **Consultas avanzadas** con filtros múltiples (usuario, módulo, fecha, acción)
- **Retención diferenciada:** Logs operativos (90 días) vs críticos (5 años)
- **Reportes de cumplimiento** para auditorías internas/externas
- **Alertas automáticas** ante eventos sospechosos o críticos

La auditoría es fundamental para **cumplimiento normativo** (ISO 27001, SOC 2, LFPDPPP) y para investigación de incidentes de seguridad o errores operativos.

---

## 🎯 Objetivos

### Objetivos de Negocio

1. **Cumplimiento normativo:** ISO 27001, SOC 2, LFPDPPP, auditorías fiscales
2. **Investigación de incidentes:** Rastrear errores, fraudes o accesos no autorizados
3. **Análisis forense:** Reconstruir secuencia de eventos ante problemas
4. **Responsabilidad:** Identificar quién realizó cada acción crítica
5. **Mejora de procesos:** Analizar patrones de uso del sistema

### Objetivos Técnicos

1. **Performance:** Logging asíncrono (no bloquea operaciones)
2. **Integridad:** Logs inmutables (append-only, no se pueden editar/borrar)
3. **Búsqueda rápida:** Índices optimizados, queries < 500ms
4. **Almacenamiento eficiente:** Compresión de logs antiguos, particionamiento
5. **Disponibilidad:** Logs disponibles 24/7 para consulta

---

## 🔍 Categorías de Eventos Auditables

### 1. Autenticación y Autorización (Security Events)

| Evento | Severidad | Retención | Ejemplo |
|--------|-----------|-----------|---------|
| Login exitoso | Low | 1 año | Usuario `juan@empresa.com` login exitoso desde IP 192.168.1.10 |
| Login fallido | Medium | 1 año | Intento fallido para `admin@empresa.com` desde IP 203.0.113.5 |
| Bloqueo de cuenta | High | 5 años | Cuenta `pedro@empresa.com` bloqueada por 5 intentos fallidos |
| Cambio de contraseña | Medium | 5 años | Usuario `maria@empresa.com` cambió su contraseña |
| Cambio de rol | High | 5 años | Usuario `carlos@empresa.com` cambió de `engineer` a `director` |
| Acceso denegado | Medium | 90 días | Usuario `jorge@empresa.com` intentó acceder a `/admin` (403) |
| Logout | Low | 90 días | Usuario `ana@empresa.com` cerró sesión |
| Cambio de empresa | Low | 90 días | Usuario `luis@empresa.com` cambió de Empresa A a Empresa B |

### 2. Gestión de Usuarios (User Management Events)

| Evento | Severidad | Retención | Ejemplo |
|--------|-----------|-----------|---------|
| Creación de usuario | Medium | 5 años | Director creó usuario `nuevo@empresa.com` con rol `engineer` |
| Invitación enviada | Low | 1 año | Invitación enviada a `invitado@empresa.com` |
| Suspensión de usuario | High | 5 años | Director suspendió a `empleado@empresa.com` por 30 días |
| Reactivación | Medium | 5 años | Usuario `empleado@empresa.com` reactivado |
| Eliminación de usuario | Critical | 10 años | Super admin eliminó usuario `antiguo@empresa.com` |
| Modificación de permisos | High | 5 años | Director otorgó permiso `budgets:approve` a `ingeniero@empresa.com` |

### 3. Operaciones Críticas (Business Critical Events)

| Evento | Severidad | Retención | Condición | Ejemplo |
|--------|-----------|-----------|-----------|---------|
| Aprobación de estimación | Critical | 10 años | Monto > $50K | Director aprobó Estimación #125 por $2.5M |
| Aprobación de orden de compra | High | 5 años | Monto > $20K | Finanzas aprobó OC #452 por $150K |
| Modificación de presupuesto | Critical | 10 años | Cualquier cambio | Ingeniero modificó Presupuesto Obra A: $10M → $10.5M |
| Cierre de etapa | Critical | 10 años | Irreversible | Ingeniero cerró Etapa 1 de Obra Los Pinos |
| Eliminación de registro | High | 5 años | Soft delete | Admin eliminó Proyecto #45 |
| Cambio de estado de proyecto | Medium | 5 años | - | Director cambió Proyecto A de "Ejecución" a "Entregado" |
| Pago de estimación | Critical | 10 años | Monto > $10K | Finanzas registró pago de $1.2M para Estimación #130 |
| Modificación de contrato | High | 10 años | - | Ingeniero modificó monto de Contrato #22: $5M → $5.2M |

### 4. Administración del Sistema (System Administration Events)

| Evento | Severidad | Retención | Ejemplo |
|--------|-----------|-----------|---------|
| Cambio de configuración | High | 5 años | Admin cambió `maxLoginAttempts` de 5 a 3 |
| Creación de backup | Medium | 1 año | Sistema creó backup full `backup-2025-11-20.tar.gz` |
| Restauración de backup | Critical | 10 años | Admin restauró sistema desde backup del 2025-11-15 |
| Modificación de centro de costo | High | 5 años | Director creó centro `301 - Etapa 3` |
| Activación/desactivación de módulo | High | 5 años | Admin activó módulo INFONAVIT para Empresa A |
| Cambio de política de seguridad | Critical | 10 años | Admin cambió expiración de contraseñas: 90 → 60 días |
| Actualización de sistema | High | 5 años | Admin desplegó versión v2.1.5 → v2.2.0 |

---

## 📝 Modelo de Datos de Auditoría

### Estructura Completa de AuditLog

```typescript
interface AuditLog {
  // Identificación
  id: string; // UUID
  timestamp: Date; // ISO 8601 con timezone

  // Usuario (quien hizo la acción)
  userId: string; // UUID
  userName: string; // "Juan Pérez"
  userEmail: string; // "juan@empresa.com"
  userRole: ConstructionRole; // director, engineer, etc.

  // Contexto empresarial
  constructoraId: string; // UUID (multi-tenancy)
  constructoraName: string; // "Constructora ABC"
  projectId?: string; // Si la acción es sobre un proyecto específico
  projectName?: string;

  // Acción
  action: AuditAction; // create, update, delete, approve, login, etc.
  actionDescription: string; // "Aprobó estimación #125 por $2.5M"
  module: string; // projects, budgets, estimations, auth, etc.

  // Entidad afectada
  entityType: string; // project, budget, estimation, user, etc.
  entityId?: string; // UUID del registro afectado
  entityName?: string; // "Proyecto Los Pinos"

  // Cambios detallados (para updates)
  changes?: AuditChange[];

  // Contexto técnico
  ipAddress: string; // "192.168.1.100"
  userAgent: string; // "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
  sessionId: string; // UUID
  requestId: string; // Para correlacionar requests relacionados

  // Geolocalización (si disponible)
  geolocation?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };

  // Metadata adicional
  severity: AuditSeverity; // low, medium, high, critical
  category: AuditCategory; // authentication, user_management, business_critical, system_admin
  success: boolean; // true = exitoso, false = fallido
  errorMessage?: string; // Si success = false
  duration?: number; // Milisegundos (para operaciones largas)

  // Datos adicionales (JSON flexible)
  metadata?: Record<string, any>;

  // Control de retención
  retentionPeriod: number; // Días (90, 365, 1825, 3650)
  expiresAt: Date; // Fecha de eliminación automática
}
```

### ENUMs

```typescript
enum AuditAction {
  // Autenticación
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGED = 'password_changed',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',

  // CRUD
  CREATE = 'create',
  READ = 'read', // Solo para lecturas de datos sensibles
  UPDATE = 'update',
  DELETE = 'delete',
  RESTORE = 'restore', // Restaurar soft delete

  // Aprobaciones
  APPROVE = 'approve',
  REJECT = 'reject',

  // Cambios de estado
  STATUS_CHANGE = 'status_change',

  // Administración
  ROLE_CHANGE = 'role_change',
  PERMISSION_GRANT = 'permission_grant',
  PERMISSION_REVOKE = 'permission_revoke',
  CONFIG_CHANGE = 'config_change',
  BACKUP_CREATED = 'backup_created',
  BACKUP_RESTORED = 'backup_restored',

  // Accesos denegados
  ACCESS_DENIED = 'access_denied',
}

enum AuditSeverity {
  LOW = 'low',         // Informativo (login exitoso, logout)
  MEDIUM = 'medium',   // Operaciones normales (crear proyecto, actualizar datos)
  HIGH = 'high',       // Operaciones críticas (aprobaciones >$20K, cambios de rol)
  CRITICAL = 'critical' // Máxima criticidad (aprobaciones >$100K, eliminaciones, backups)
}

enum AuditCategory {
  AUTHENTICATION = 'authentication',
  USER_MANAGEMENT = 'user_management',
  BUSINESS_CRITICAL = 'business_critical',
  SYSTEM_ADMIN = 'system_admin'
}
```

### Cambios Detallados

```typescript
interface AuditChange {
  field: string; // "totalAmount", "status", "role"
  oldValue: any; // Valor anterior
  newValue: any; // Valor nuevo
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
}
```

**Ejemplo:**

```json
{
  "id": "uuid-audit-123",
  "timestamp": "2025-11-20T14:30:25.123Z",
  "userId": "uuid-user-456",
  "userName": "Juan Pérez",
  "userEmail": "juan@empresa.com",
  "userRole": "engineer",
  "constructoraId": "uuid-empresa-a",
  "constructoraName": "Constructora ABC",
  "projectId": "uuid-proyecto-1",
  "projectName": "Fraccionamiento Los Pinos",
  "action": "update",
  "actionDescription": "Modificó presupuesto maestro de Etapa 1",
  "module": "budgets",
  "entityType": "budget",
  "entityId": "uuid-budget-789",
  "entityName": "Presupuesto Etapa 1",
  "changes": [
    {
      "field": "totalAmount",
      "oldValue": 10000000,
      "newValue": 10500000,
      "dataType": "number"
    },
    {
      "field": "notes",
      "oldValue": "Presupuesto inicial",
      "newValue": "Presupuesto ajustado por cambio de alcance",
      "dataType": "string"
    }
  ],
  "ipAddress": "192.168.1.50",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "sessionId": "uuid-session-abc",
  "requestId": "uuid-request-xyz",
  "severity": "critical",
  "category": "business_critical",
  "success": true,
  "retentionPeriod": 3650,
  "expiresAt": "2035-11-20T14:30:25.123Z"
}
```

---

## 🔍 Consultas y Filtros de Auditoría

### Filtros Disponibles

```typescript
interface AuditLogFilters {
  // Rango de fechas
  startDate?: Date;
  endDate?: Date;

  // Usuario
  userId?: string;
  userEmail?: string;
  userRole?: ConstructionRole;

  // Acción
  action?: AuditAction | AuditAction[];
  module?: string | string[];
  entityType?: string;
  entityId?: string;

  // Severidad y categoría
  severity?: AuditSeverity | AuditSeverity[];
  category?: AuditCategory | AuditCategory[];

  // Éxito
  success?: boolean; // true = solo exitosos, false = solo fallidos

  // Búsqueda de texto libre
  search?: string; // Busca en actionDescription, entityName, userName

  // Proyecto/Empresa
  constructoraId?: string;
  projectId?: string;

  // IP Address
  ipAddress?: string;

  // Paginación
  page?: number;
  limit?: number; // Max 100
  sortBy?: 'timestamp' | 'severity';
  sortOrder?: 'asc' | 'desc';
}
```

### Queries Comunes

#### 1. Todos los cambios a un proyecto específico

```typescript
const logs = await getAuditLogs({
  projectId: 'uuid-proyecto-1',
  startDate: new Date('2025-11-01'),
  endDate: new Date('2025-11-30'),
  sortBy: 'timestamp',
  sortOrder: 'desc'
});
```

#### 2. Todas las aprobaciones financieras >$100K

```typescript
const logs = await getAuditLogs({
  action: 'approve',
  module: ['estimations', 'purchases'],
  severity: 'critical',
  success: true
});
```

#### 3. Intentos de login fallidos (últimas 24 horas)

```typescript
const logs = await getAuditLogs({
  action: 'login_failed',
  startDate: subHours(new Date(), 24),
  sortBy: 'timestamp',
  sortOrder: 'desc'
});
```

#### 4. Todas las acciones de un usuario específico

```typescript
const logs = await getAuditLogs({
  userEmail: 'juan@empresa.com',
  startDate: new Date('2025-11-01'),
  endDate: new Date('2025-11-30')
});
```

#### 5. Eventos críticos (alertas de seguridad)

```typescript
const logs = await getAuditLogs({
  severity: 'critical',
  category: ['authentication', 'user_management'],
  success: false // Solo eventos fallidos
});
```

---

## 🔔 Alertas Automáticas

### Reglas de Alertas

| Evento | Condición | Destinatarios | Canal |
|--------|-----------|---------------|-------|
| **5 logins fallidos en 10 min** | Mismo usuario o IP | Admin de TI | Email + SMS |
| **Acceso denegado repetido** | >10 intentos en 1 hora | Admin de TI | Email |
| **Aprobación >$100K** | Cualquier estimación/OC | Director + CFO | Email |
| **Cambio de rol a Director** | Cualquier cambio | Super Admin | Email |
| **Eliminación de registro** | Cualquier entidad crítica | Admin | Email |
| **Cambio de configuración** | Sistema o seguridad | Admin de TI | Email |
| **Backup fallido** | Cualquier fallo | Admin de TI + Director | Email + SMS |
| **Acceso fuera de horario** | Login 22:00-06:00 | Admin de TI | Email (diario consolidado) |

### Ejemplo de Alerta

**Asunto:** 🚨 Alerta de Seguridad: 5 Intentos de Login Fallidos

```
Estimado Administrador,

Se han detectado 5 intentos fallidos de login en los últimos 10 minutos:

Usuario: admin@empresa.com
IP: 203.0.113.45
Última intento: 2025-11-20 14:35:12
Ubicación: Culiacán, Sinaloa, México

Acciones tomadas:
- Cuenta bloqueada temporalmente (30 minutos)
- IP agregada a lista de vigilancia

Detalles completos:
https://app.ejemplo.com/admin/audit-logs?userId=uuid-123&action=login_failed

---
Sistema de Auditoría Automática
Constructora ABC
```

---

## 📊 Reportes de Auditoría

### 1. Reporte de Actividad de Usuario

```
Reporte de Actividad: juan@empresa.com
Periodo: 01-30 Noviembre 2025

┌─────────────────────────┬───────┬────────────────────────────┐
│ Acción                  │ Count │ Último evento              │
├─────────────────────────┼───────┼────────────────────────────┤
│ Login                   │   42  │ 2025-11-30 17:45           │
│ Logout                  │   40  │ 2025-11-30 18:30           │
│ Crear proyecto          │    3  │ 2025-11-25 10:15           │
│ Actualizar presupuesto  │   18  │ 2025-11-29 14:20           │
│ Aprobar estimación      │    5  │ 2025-11-28 16:00           │
│ Modificar contrato      │    2  │ 2025-11-22 11:30           │
└─────────────────────────┴───────┴────────────────────────────┘

Eventos críticos: 5 aprobaciones de estimaciones (total $8.5M)
Eventos fallidos: 2 (acceso denegado a módulo Finanzas)

Proyectos modificados:
- Fraccionamiento Los Pinos (15 acciones)
- Torre Residencial Aura (8 acciones)
```

### 2. Reporte de Cumplimiento (Compliance)

```
Reporte de Auditoría para Cumplimiento ISO 27001
Constructora ABC S.A. de C.V.
Periodo: Q4 2025 (Oct-Nov-Dic)

1. AUTENTICACIÓN Y CONTROL DE ACCESO
   - Total logins: 2,450 ✅
   - Logins fallidos: 45 (1.8%) ✅
   - Cuentas bloqueadas: 3 ✅
   - Cambios de contraseña: 120 ✅
   - Sesiones concurrentes promedio: 35 ✅

2. GESTIÓN DE USUARIOS
   - Usuarios creados: 12 ✅
   - Usuarios suspendidos: 2 ✅
   - Usuarios eliminados: 0 ✅
   - Cambios de rol: 5 (todos auditados) ✅
   - Permisos modificados: 8 (todos auditados) ✅

3. OPERACIONES CRÍTICAS
   - Aprobaciones financieras >$100K: 25 (todas auditadas) ✅
   - Modificaciones de presupuestos: 45 (todas auditadas) ✅
   - Eliminaciones de registros: 3 (todas auditadas) ✅
   - Cambios de configuración: 2 (ambos auditados) ✅

4. RESPALDO Y RECUPERACIÓN
   - Backups exitosos: 90/90 (100%) ✅
   - Backups fallidos: 0 ✅
   - Restauraciones: 0 ✅

5. INCIDENTES DE SEGURIDAD
   - Accesos no autorizados: 0 ✅
   - Brechas de datos: 0 ✅
   - Alertas de seguridad: 15 (todas investigadas) ✅

CONCLUSIÓN: Sistema cumple 100% con requisitos ISO 27001
```

### 3. Timeline de Proyecto (Forense)

```
Timeline: Proyecto Fraccionamiento Los Pinos
Periodo: 01-30 Noviembre 2025

2025-11-01 09:00 | Director        | Creó proyecto "Fraccionamiento Los Pinos"
2025-11-01 09:15 | Director        | Asignó Ingeniero: Juan Pérez
2025-11-02 10:30 | Ingeniero       | Creó presupuesto maestro: $50M
2025-11-05 14:20 | Ingeniero       | Modificó presupuesto: $50M → $52M
2025-11-08 16:45 | Finanzas        | Aprobó presupuesto ajustado
2025-11-10 11:00 | Compras         | Creó orden de compra #1: $1.2M
2025-11-10 15:30 | Finanzas        | Aprobó OC #1
2025-11-15 09:45 | Residente       | Capturó avance Etapa 1: 15%
2025-11-20 10:00 | Ingeniero       | Aprobó avance 15%
2025-11-25 14:00 | Finanzas        | Creó estimación #1: $7.5M
2025-11-26 16:30 | Director        | Aprobó estimación #1
2025-11-28 11:00 | Finanzas        | Registró pago: $7.5M
2025-11-30 17:00 | Ingeniero       | Cambió estado: "Ejecución" → "Entregado"

Total eventos: 145
Usuarios involucrados: 5 (Director, Ingeniero, Finanzas, Compras, Residente)
```

---

## 📋 Casos de Uso

### Caso 1: Investigación de Error en Presupuesto

**Contexto:** Director detecta que presupuesto de Obra A cambió de $10M a $15M sin autorización.

**Flujo:**
1. Director va a "Auditoría" → "Consultar Logs"
2. Filtra:
   - Entidad: Presupuesto Obra A
   - Acción: Update
   - Fecha: Últimos 30 días
3. Sistema muestra:
   ```
   2025-11-15 14:30 | Ingeniero Juan | UPDATE budget
   Campo: totalAmount
   Cambio: $10,000,000 → $15,000,000
   IP: 192.168.1.50
   Sesión: uuid-session-abc
   ```
4. Director click en evento → Ve detalles completos:
   - Usuario: juan@empresa.com
   - Razón: "Ajuste por cambio de alcance aprobado en minuta 25/10/2025"
   - Archivos adjuntos: minuta-2025-10-25.pdf
5. Director valida que cambio es legítimo (hay minuta)
6. Cierra investigación

**Resultado:** Trazabilidad completa del cambio, investigación en 5 minutos.

### Caso 2: Detección de Fraude (Intento)

**Contexto:** Alerta automática: "Usuario `compras@empresa.com` aprobó OC #455 de $500K fuera de horario (23:45)"

**Flujo:**
1. Admin de TI recibe alerta por email a las 23:46
2. Admin accede a sistema → "Auditoría" → Busca evento
3. Ve detalles:
   ```
   2025-11-20 23:45 | Comprador Pedro | APPROVE purchase_order
   OC #455: $500,000 (Proveedor: ABC Materiales S.A.)
   IP: 203.0.113.99 (externa, no es IP de oficina)
   Ubicación: Guadalajara, Jalisco (oficina está en Culiacán)
   ```
4. Admin llama a Pedro (Comprador):
   - Pedro: "No estoy trabajando, estoy en casa"
   - Admin: "¿Aprobaste OC #455?"
   - Pedro: "No, yo no aprobé nada"
5. **Admin identifica:** Sesión comprometida
6. Acciones inmediatas:
   - Bloquea cuenta de Pedro
   - Revierte aprobación de OC #455
   - Fuerza logout de todas las sesiones activas
   - Cambia contraseña de Pedro
   - Bloquea IP 203.0.113.99
7. Contacta a Pedro para reactivar cuenta con nueva contraseña

**Resultado:** Fraude detectado y bloqueado en 15 minutos. Pérdida evitada: $500K.

### Caso 3: Auditoría Externa (ISO 27001)

**Contexto:** Auditor externo solicita evidencia de controles de acceso.

**Flujo:**
1. Auditor solicita: "Todos los cambios de rol en 2025"
2. Admin va a "Reportes" → "Reporte de Auditoría de Cumplimiento"
3. Selecciona:
   - Tipo: Cambios de Rol
   - Periodo: 2025-01-01 a 2025-12-31
4. Sistema genera reporte PDF:
   ```
   Reporte de Cambios de Rol - 2025
   Constructora ABC S.A. de C.V.

   Total cambios: 12

   #  Fecha         Usuario           Rol Anterior  Rol Nuevo    Autorizado Por
   1  2025-02-15    juan@empresa.com  engineer      director     Super Admin
   2  2025-03-20    maria@empresa.com resident      engineer     Director
   ...

   Conclusión: Todos los cambios fueron autorizados por Director o Super Admin.
   Cumplimiento: 100%
   ```
5. Admin exporta reporte y entrega a auditor
6. Auditor valida que todos los cambios tienen autorización

**Resultado:** Auditoría externa aprobada en 1 día (vs 1 semana manual).

---

## ✅ Criterios de Aceptación

### AC1: Registro Automático de Eventos

**DADO** un usuario que aprueba una estimación de $100K
**CUANDO** completa la aprobación
**ENTONCES**
- ✅ Sistema registra evento automáticamente (sin intervención del usuario)
- ✅ Log contiene: usuario, timestamp, acción, entidad, monto, IP, sesión
- ✅ Severidad = `critical` (por monto >$100K)
- ✅ Retención = 10 años
- ✅ Log es inmutable (no se puede editar ni borrar)

### AC2: Consulta con Filtros Múltiples

**DADO** un admin que busca "aprobaciones financieras de Juan en noviembre"
**CUANDO** aplica filtros:
```typescript
{
  userEmail: 'juan@empresa.com',
  action: 'approve',
  module: ['estimations', 'purchases'],
  startDate: '2025-11-01',
  endDate: '2025-11-30'
}
```
**ENTONCES**
- ✅ Sistema retorna solo registros que cumplen TODOS los filtros
- ✅ Resultados ordenados por timestamp desc (más reciente primero)
- ✅ Query ejecuta en < 500ms
- ✅ Paginación funciona correctamente

### AC3: Alertas Automáticas

**DADO** 5 intentos de login fallidos en 10 minutos
**CUANDO** ocurre el 5to intento
**ENTONCES**
- ✅ Sistema envía alerta por email a Admin de TI
- ✅ Cuenta se bloquea automáticamente por 30 minutos
- ✅ IP se agrega a lista de vigilancia
- ✅ Alerta contiene: usuario, IP, ubicación, timestamp

### AC4: Trazabilidad de Cambios

**DADO** un presupuesto que cambió de $10M a $15M
**CUANDO** se consulta auditoría
**ENTONCES**
- ✅ Log muestra cambio detallado:
  ```json
  {
    "field": "totalAmount",
    "oldValue": 10000000,
    "newValue": 15000000
  }
  ```
- ✅ Log muestra quién lo cambió, cuándo, desde dónde
- ✅ Si hay justificación, se incluye en `metadata`

### AC5: Retención Diferenciada

**DADO** logs de diferentes severidades
**CUANDO** se ejecuta proceso de limpieza automática
**ENTONCES**
- ✅ Logs `low` severity: eliminados tras 90 días
- ✅ Logs `medium` severity: eliminados tras 1 año
- ✅ Logs `high` severity: eliminados tras 5 años
- ✅ Logs `critical` severity: eliminados tras 10 años
- ✅ Proceso no elimina logs antes de `expiresAt`

---

## 🧪 Escenarios de Prueba

### Test 1: Logging Automático

```typescript
describe('RF-ADM-004: Audit Logging', () => {
  it('should automatically log critical operations', async () => {
    const engineer = await loginAs('engineer');

    // Aprobar estimación
    const response = await api.patch('/estimations/123/approve', {}, {
      headers: { Authorization: engineer.token }
    });

    expect(response.status).toBe(200);

    // Verificar log
    const logs = await getAuditLogs({
      action: 'approve',
      entityId: '123',
      userId: engineer.id
    });

    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      userId: engineer.id,
      action: 'approve',
      module: 'estimations',
      entityId: '123',
      severity: 'critical',
      success: true
    });
  });
});
```

### Test 2: Inmutabilidad de Logs

```typescript
describe('RF-ADM-004: Log Immutability', () => {
  it('should not allow editing or deleting logs', async () => {
    const log = await createAuditLog({
      action: 'login',
      userId: 'user-123'
    });

    // Intentar modificar
    const updateResponse = await api.patch(`/audit-logs/${log.id}`, {
      action: 'logout'
    });

    expect(updateResponse.status).toBe(403);
    expect(updateResponse.data.error).toBe('Audit logs are immutable');

    // Intentar eliminar
    const deleteResponse = await api.delete(`/audit-logs/${log.id}`);

    expect(deleteResponse.status).toBe(403);
    expect(deleteResponse.data.error).toBe('Audit logs cannot be deleted');
  });
});
```

---

## 🔗 Referencias

- **Especificación técnica:** [ET-ADM-003](../especificaciones/ET-ADM-003-audit-logging.md)
- **Historia de usuario:** [US-ADM-004](../historias-usuario/US-ADM-004-consultar-auditoria.md)
- **RF relacionados:** [RF-ADM-001](./RF-ADM-001-usuarios-roles.md), [RF-ADM-002](./RF-ADM-002-permisos-granulares.md)
- **Módulo:** [README.md](../README.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Estado:** ✅ Completo
