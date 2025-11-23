# _MAP: MAI-013 - Administración & Seguridad

**Épica:** MAI-013
**Nombre:** Administración & Seguridad
**Fase:** 1 - Alcance Inicial
**Presupuesto:** $25,000 MXN
**Story Points:** 40 SP
**Estado:** 📝 A crear
**Sprint:** Sprint 3-4 (Semanas 5-8)
**Última actualización:** 2025-11-17
**Prioridad:** P0

---

## 📋 Propósito

Administración completa del sistema, gestión de usuarios, permisos, auditoría y seguridad:
- Gestión de usuarios/roles/permisos específicos de construcción
- Centros de costo por obra y por empresa
- Bitácora de actividades y logs de cambios auditables
- Backups, restauración y mantenimiento del sistema
- Seguridad de datos y cumplimiento normativo

**Integración clave:** Base transversal para todos los módulos. Reutiliza infraestructura de GAMILIT.

---

## 📁 Contenido

### Requerimientos Funcionales (Estimados: 5)

| ID | Título | Estado |
|----|--------|--------|
| RF-ADM-001 | Gestión de usuarios y roles por empresa/obra | 📝 A crear |
| RF-ADM-002 | Sistema de permisos granulares (RBAC + ABAC) | 📝 A crear |
| RF-ADM-003 | Centros de costo y estructura organizacional | 📝 A crear |
| RF-ADM-004 | Auditoría completa y trazabilidad de cambios | 📝 A crear |
| RF-ADM-005 | Backups automáticos y restauración | 📝 A crear |

### Especificaciones Técnicas (Estimadas: 5)

| ID | Título | RF | Estado |
|----|--------|----|--------|
| ET-ADM-001 | Modelo de RBAC multi-tenancy | RF-ADM-001, RF-ADM-002 | 📝 A crear |
| ET-ADM-002 | Sistema de centros de costo jerárquicos | RF-ADM-003 | 📝 A crear |
| ET-ADM-003 | Audit logging y change tracking | RF-ADM-004 | 📝 A crear |
| ET-ADM-004 | Estrategia de backups y DR (Disaster Recovery) | RF-ADM-005 | 📝 A crear |
| ET-ADM-005 | Seguridad de datos (encriptación, GDPR/LFPDPPP) | RF-ADM-002 | 📝 A crear |

### Historias de Usuario (Estimadas: 8)

| ID | Título | SP | Estado |
|----|--------|----|--------|
| US-ADM-001 | Crear y gestionar usuarios de empresa | 5 | 📝 A crear |
| US-ADM-002 | Asignar roles y permisos por módulo | 5 | 📝 A crear |
| US-ADM-003 | Configurar centros de costo de obra | 5 | 📝 A crear |
| US-ADM-004 | Consultar bitácora de auditoría | 5 | 📝 A crear |
| US-ADM-005 | Configurar backups automáticos | 3 | 📝 A crear |
| US-ADM-006 | Restaurar sistema desde backup | 5 | 📝 A crear |
| US-ADM-007 | Dashboard de administración del sistema | 7 | 📝 A crear |
| US-ADM-008 | Configurar políticas de seguridad | 5 | 📝 A crear |

**Total Story Points:** 40 SP

### Implementación

📊 **Inventarios de trazabilidad:**
- [TRACEABILITY.yml](./implementacion/TRACEABILITY.yml) - Matriz completa de trazabilidad
- [DATABASE.yml](./implementacion/DATABASE.yml) - Objetos de base de datos
- [BACKEND.yml](./implementacion/BACKEND.yml) - Módulos backend
- [FRONTEND.yml](./implementacion/FRONTEND.yml) - Componentes frontend

### Pruebas

📋 Documentación de testing:
- [TEST-PLAN.md](./pruebas/TEST-PLAN.md) - Plan de pruebas
- [TEST-CASES.md](./pruebas/TEST-CASES.md) - Casos de prueba

---

## 🔗 Referencias

- **README:** [README.md](./README.md) - Descripción detallada de la épica
- **Fase 1:** [../README.md](../README.md) - Información de la fase completa
- **Módulo relacionado MVP:** Módulo 13 - Administración & Seguridad (MVP-APP.md)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $25,000 MXN |
| **Story Points estimados** | 40 SP |
| **Duración estimada** | 8 días |
| **Reutilización GAMILIT** | 90% (infraestructura base ya existe) |
| **RF a implementar** | 5/5 |
| **ET a implementar** | 5/5 |
| **US a completar** | 8/8 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schema:** `auth_management`, `admin`, `audit_logging`
- **Tablas principales:**
  * `users` - Usuarios del sistema
  * `roles` - Roles y permisos
  * `role_permissions` - Matriz de permisos
  * `companies` - Empresas (multi-tenancy)
  * `cost_centers` - Centros de costo
  * `audit_logs` - Logs de auditoría
  * `system_settings` - Configuraciones del sistema
  * `backups` - Registro de backups
- **ENUMs:**
  * `user_status` (active, inactive, suspended, locked)
  * `permission_type` (read, write, delete, approve, admin)
  * `audit_action` (create, update, delete, login, logout, etc.)

### Backend
- **Módulo:** `admin`, `auth-management`, `audit`
- **Path:** `apps/backend/src/modules/admin/`
- **Services:** UserService, RoleService, AuditService, BackupService, CostCenterService
- **Controllers:** UserController, RoleController, AuditController, BackupController
- **Middlewares:** PermissionGuard, AuditMiddleware, RateLimitGuard

### Frontend
- **Features:** `admin`, `user-management`, `audit-logs`, `system-settings`
- **Path:** `apps/frontend/src/features/admin/`
- **Componentes:**
  * UserList
  * UserForm (create/edit)
  * RoleManager
  * PermissionMatrix
  * CostCenterTree
  * AuditLogViewer
  * BackupManager
  * SystemSettingsDashboard
- **Stores:** adminStore, userStore, auditStore, settingsStore

---

## 🔐 Roles del Sistema

### Roles Predefinidos

| Rol | Código | Descripción | Módulos de acceso principal |
|-----|--------|-------------|------------------------------|
| **Director General** | `director` | Acceso total al sistema | Todos |
| **Ingeniero/Planeación** | `engineer` | Gestión técnica y planeación | Proyectos, Presupuestos, Control de Obra |
| **Residente de Obra** | `resident` | Control operativo en campo | Control de Obra, Compras, Inventarios |
| **Compras/Almacén** | `purchases` | Gestión de compras e inventarios | Compras, Inventarios, Proveedores |
| **Administración/Finanzas** | `finance` | Gestión financiera | Estimaciones, Finanzas, Reportes |
| **RRHH/Nómina** | `hr` | Recursos humanos | RRHH, Asistencias, Nómina |
| **Postventa** | `post_sales` | Atención al cliente | Calidad, Postventa, CRM |

---

## 🔒 Matriz de Permisos (Ejemplo)

### Permisos por Módulo

| Módulo | Director | Engineer | Resident | Purchases | Finance | HR | Post Sales |
|--------|----------|----------|----------|-----------|---------|----|-----------  |
| **Proyectos** | CRUD+A | CRUD | R | R | R | R | R |
| **Presupuestos** | CRUD+A | CRUD | R | R | R | - | - |
| **Compras** | CRUD+A | R | CRUD | CRUD+A | R | - | - |
| **Inventarios** | CRUD+A | R | CRUD | CRUD | R | - | - |
| **Control Obra** | CRUD+A | CRUD | CRUD | R | R | - | R |
| **Estimaciones** | CRUD+A | CRUD | R | - | CRUD+A | - | - |
| **RRHH** | CRUD+A | R | R | - | R | CRUD+A | - |
| **Postventa** | CRUD+A | R | R | - | - | - | CRUD |

**Leyenda:**
- **C**reate, **R**ead, **U**pdate, **D**elete, **A**pprove
- `-` Sin acceso

---

## 🔍 Sistema de Auditoría

### Eventos Auditables

1. **Autenticación:**
   - Login exitoso/fallido
   - Logout
   - Cambio de contraseña
   - Bloqueo de cuenta

2. **Gestión de usuarios:**
   - Creación de usuario
   - Modificación de permisos
   - Desactivación/reactivación
   - Cambio de roles

3. **Operaciones críticas:**
   - Aprobación de estimaciones
   - Aprobación de órdenes de compra
   - Modificación de presupuestos
   - Cierre de etapas de obra
   - Eliminación de registros importantes

4. **Administración:**
   - Cambios en configuración del sistema
   - Creación de backups
   - Restauración de datos
   - Modificación de centros de costo

### Información Registrada

```yaml
audit_log:
  timestamp: "2025-11-17T10:30:00Z"
  user_id: "UUID"
  user_name: "Juan Pérez"
  company_id: "UUID"
  action: "update"
  module: "budgets"
  entity_type: "budget"
  entity_id: "UUID"
  changes:
    field: "total_amount"
    old_value: "1000000.00"
    new_value: "1050000.00"
  ip_address: "192.168.1.100"
  user_agent: "Mozilla/5.0..."
  session_id: "UUID"
```

---

## 💾 Estrategia de Backups

### Tipos de Backup

1. **Full Backup** (Completo)
   - Frecuencia: Diario (3:00 AM)
   - Retención: 7 días
   - Incluye: Base de datos completa, archivos, configuraciones

2. **Incremental Backup**
   - Frecuencia: Cada 6 horas
   - Retención: 48 horas
   - Incluye: Solo cambios desde último backup

3. **Archivos críticos**
   - Frecuencia: Cada hora
   - Retención: 24 horas
   - Incluye: Documentos subidos, evidencias fotográficas

### Ubicación

- **Primaria:** Servidor local (storage NAS)
- **Secundaria:** Cloud storage (AWS S3 / Azure Blob)
- **Terciaria:** Backup offsite (opcional)

### Proceso de Restauración

1. Identificar punto de restauración deseado
2. Detener servicios afectados
3. Restaurar desde backup seleccionado
4. Verificar integridad de datos
5. Reiniciar servicios
6. Validar con usuarios clave

**RTO (Recovery Time Objective):** 4 horas
**RPO (Recovery Point Objective):** 1 hora

---

## 🏢 Centros de Costo

### Estructura Jerárquica

```
Empresa Constructora XYZ
├── Dirección General
│   ├── Finanzas
│   ├── RRHH
│   └── TI
├── Obra A - Fraccionamiento Los Pinos
│   ├── Etapa 1
│   │   ├── Urbanización
│   │   ├── Edificación
│   │   └── Acabados
│   └── Etapa 2
│       └── ...
└── Obra B - Torre Residencial
    ├── Cimentación
    ├── Estructura
    └── Instalaciones
```

### Imputación de Costos

- **Compras:** Se imputan al centro de costo de la obra/etapa
- **RRHH:** Horas-hombre se imputan por frente de obra
- **Maquinaria:** Uso de activos se imputa por proyecto
- **Gastos indirectos:** Se distribuyen proporcionalmente

---

## 🚨 Puntos Críticos

1. **Multi-tenancy estricto:** Aislamiento total entre empresas
2. **Permisos granulares:** Control fino por módulo y acción
3. **Auditoría completa:** Trazabilidad de todas las operaciones críticas
4. **Backups automáticos:** No depender de operadores manuales
5. **Seguridad de datos:** Encriptación en reposo y en tránsito
6. **Cumplimiento normativo:** LFPDPPP (México), GDPR (si aplica)

---

## 🎯 Siguiente Paso

Crear documentación de requerimientos y especificaciones técnicas del módulo.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @security-team
**Estado:** 📝 A crear
