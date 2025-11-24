# MAI-013: Administración & Seguridad

**Épica:** MAI-013
**Nombre:** Administración & Seguridad
**Fase:** 1 - Alcance Inicial
**Presupuesto:** $25,000 MXN
**Story Points:** 40 SP
**Estado:** 📝 En documentación
**Sprint:** Sprint 3-4 (Semanas 5-8)
**Prioridad:** P0 (Crítica)
**Fecha de creación:** 2025-11-20

---

## 📋 Descripción General

El módulo de **Administración & Seguridad** constituye la **base transversal** del sistema ERP de construcción, proporcionando los mecanismos fundamentales para:

- Gestión completa de usuarios, roles y permisos específicos de construcción
- Sistema de permisos granulares (RBAC + ABAC) multi-tenancy
- Estructura organizacional con centros de costo por obra y empresa
- Auditoría completa y trazabilidad de todas las operaciones críticas
- Backups automáticos, restauración y disaster recovery
- Seguridad de datos y cumplimiento normativo (LFPDPPP/GDPR)

**Diferenciador clave:** Reutiliza el 90% de la infraestructura probada de GAMILIT, adaptando los 7 roles específicos del sector construcción.

---

## 🎯 Objetivos

### Objetivos de Negocio

1. **Control total de acceso:** Cada usuario solo ve y opera lo que le corresponde según su rol
2. **Trazabilidad completa:** Auditoría de todas las operaciones críticas (aprobaciones, cambios, eliminaciones)
3. **Seguridad empresarial:** Aislamiento total entre empresas (multi-tenancy estricto)
4. **Continuidad del negocio:** Backups automáticos y recuperación rápida ante desastres
5. **Cumplimiento normativo:** LFPDPPP (México), GDPR (si aplica), ISO 27001 compatible

### Objetivos Técnicos

1. **RBAC multi-nivel:** Permisos por rol + permisos granulares por módulo + RLS en base de datos
2. **Defense in Depth:** Validación en 3 capas (Frontend, Backend, Database)
3. **Audit logging:** Registro automático de eventos críticos con contexto completo
4. **RTO < 4 horas:** Recuperación de sistema en menos de 4 horas
5. **RPO < 1 hora:** Pérdida máxima de datos de 1 hora

---

## 👥 Roles del Sistema

### 7 Roles Especializados en Construcción

| Rol | Código | Descripción | Acceso Principal |
|-----|--------|-------------|------------------|
| **Director General** | `director` | Máxima autoridad, visión estratégica | Todos los módulos (CRUD+Approve) |
| **Ingeniero/Planeación** | `engineer` | Planeación técnica, presupuestos, control | Proyectos, Presupuestos, Control Obra |
| **Residente de Obra** | `resident` | Ejecución en campo, supervisión diaria | Control Obra, Compras, Avances |
| **Compras/Almacén** | `purchases` | Gestión de compras, inventarios, proveedores | Compras, Inventarios, Proveedores |
| **Administración/Finanzas** | `finance` | Control financiero, estimaciones, pagos | Estimaciones, Finanzas, Reportes |
| **RRHH/Nómina** | `hr` | Recursos humanos, asistencias, nómina | RRHH, Asistencias, Nómina |
| **Postventa** | `post_sales` | Atención cliente, garantías, calidad | Postventa, Garantías, CRM |

**Diferencia vs GAMILIT:** GAMILIT tiene 3 roles académicos (student, admin_teacher, super_admin); aquí se expanden a 7 roles especializados en construcción.

---

## 🔒 Matriz de Permisos por Módulo

| Módulo | Director | Engineer | Resident | Purchases | Finance | HR | Post Sales |
|--------|----------|----------|----------|-----------|---------|----|-----------  |
| **Fundamentos** | CRUD+A | R | R | R | R | R | R |
| **Proyectos** | CRUD+A | CRUD | R | R | R | R | R |
| **Presupuestos** | CRUD+A | CRUD | R | R | R | - | - |
| **Compras** | CRUD+A | R | CRUD | CRUD+A | R | - | - |
| **Inventarios** | CRUD+A | R | CRUD | CRUD | R | - | - |
| **Contratos** | CRUD+A | CRUD | R | R | R | - | - |
| **Control Obra** | CRUD+A | CRUD | CRUD | R | R | - | R |
| **Estimaciones** | CRUD+A | CRUD | R | - | CRUD+A | - | - |
| **RRHH** | CRUD+A | R | R | - | R | CRUD+A | - |
| **Calidad** | CRUD+A | CRUD | CRUD | - | - | - | CRUD |
| **CRM** | CRUD+A | R | - | - | R | - | CRUD+A |
| **INFONAVIT** | CRUD+A | R | - | - | CRUD | CRUD | R |
| **Reportes** | CRUD+A | R | R | R | CRUD | R | R |
| **Administración** | CRUD+A | - | - | - | R | R | - |

**Leyenda:**
- **C**reate (Crear), **R**ead (Leer), **U**pdate (Actualizar), **D**elete (Eliminar), **A**pprove (Aprobar)
- `-` Sin acceso

---

## 🏢 Centros de Costo

### Estructura Jerárquica

Los centros de costo permiten la imputación precisa de gastos y el análisis de rentabilidad por:

```
Empresa Constructora ABC
├── 000 - Dirección General
│   ├── 001 - Finanzas
│   ├── 002 - RRHH
│   ├── 003 - Sistemas
│   └── 004 - Legal
├── 100 - Obra: Fraccionamiento Los Pinos
│   ├── 101 - Etapa 1
│   │   ├── 101.1 - Urbanización
│   │   ├── 101.2 - Edificación
│   │   └── 101.3 - Acabados
│   └── 102 - Etapa 2
│       ├── 102.1 - Urbanización
│       └── 102.2 - Edificación
└── 200 - Obra: Torre Residencial Aura
    ├── 201 - Cimentación
    ├── 202 - Estructura
    ├── 203 - Instalaciones
    └── 204 - Acabados
```

### Tipos de Centros de Costo

1. **Directos (Producción):** Vinculados a obras específicas
2. **Indirectos (Administración):** Gastos corporativos
3. **Servicios Compartidos:** TI, RRHH, Finanzas

### Imputación Automática

- **Compras:** Se imputan al centro de costo de la obra/etapa
- **RRHH:** Horas-hombre se distribuyen por frente de obra
- **Maquinaria:** Uso de activos se imputa por proyecto
- **Gastos indirectos:** Distribución proporcional por proyecto

---

## 🔍 Sistema de Auditoría

### Eventos Auditables

#### 1. Autenticación y Autorización
- Login exitoso/fallido (incluye IP, user agent, geolocalización)
- Logout (manual o por timeout)
- Cambio de contraseña
- Bloqueo/desbloqueo de cuenta
- Cambio de constructora (multi-tenancy)

#### 2. Gestión de Usuarios
- Creación de usuario (con rol asignado)
- Modificación de permisos/roles
- Activación/desactivación de usuarios
- Cambio de datos personales
- Invitaciones enviadas

#### 3. Operaciones Críticas
- ✅ **Aprobación de estimaciones** (>$50K)
- ✅ **Aprobación de órdenes de compra** (>$20K)
- ✅ **Modificación de presupuestos maestros** (cualquier cambio)
- ✅ **Cierre de etapas de obra** (irreversible)
- ✅ **Eliminación de registros importantes** (soft delete con log)
- ✅ **Cambio de estado de proyecto** (cualquier transición)
- ✅ **Pago de estimaciones** (>$10K)

#### 4. Administración del Sistema
- Cambios en configuración global
- Creación/restauración de backups
- Modificación de centros de costo
- Cambios en políticas de seguridad
- Activación/desactivación de módulos

### Estructura de Log de Auditoría

```typescript
interface AuditLog {
  id: string; // UUID
  timestamp: Date; // ISO 8601

  // Usuario
  userId: string;
  userName: string;
  userEmail: string;
  userRole: ConstructionRole;

  // Contexto empresarial
  constructoraId: string;
  constructoraName: string;

  // Acción
  action: AuditAction; // create, update, delete, approve, login, etc.
  module: string; // projects, budgets, estimations, etc.
  entityType: string; // project, budget, estimation, etc.
  entityId: string; // UUID del registro afectado

  // Cambios
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  // Contexto técnico
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };

  // Metadata
  severity: 'low' | 'medium' | 'high' | 'critical';
  success: boolean;
  errorMessage?: string;
}
```

### Retención de Logs

- **Logs operativos:** 90 días en base de datos principal
- **Logs críticos:** 5 años en base de datos de auditoría (comprimidos)
- **Logs de autenticación:** 1 año (para análisis de seguridad)

---

## 💾 Estrategia de Backups

### Tipos de Backup

| Tipo | Frecuencia | Retención | Contenido |
|------|------------|-----------|-----------|
| **Full Backup** | Diario (3:00 AM) | 7 días | Base de datos completa + archivos + configuraciones |
| **Incremental** | Cada 6 horas | 48 horas | Solo cambios desde último backup |
| **Archivos críticos** | Cada hora | 24 horas | Documentos, evidencias fotográficas, planos |
| **Snapshots DB** | Cada 30 min | 6 horas | Snapshot de PostgreSQL (PITR) |

### Ubicaciones de Almacenamiento

**Estrategia 3-2-1:**
- **3 copias** de los datos
- **2 medios diferentes** (local + cloud)
- **1 copia offsite** (geográficamente separada)

#### Ubicaciones
1. **Primaria:** Servidor local (NAS/SAN)
2. **Secundaria:** Cloud storage (AWS S3 / Azure Blob Storage)
3. **Terciaria:** Backup offsite opcional (para clientes enterprise)

### Proceso de Restauración

**Escenarios de recuperación:**

#### 1. Recuperación de archivo individual
- **RTO:** 15 minutos
- **Procedimiento:** Buscar en backup incremental más reciente → Restaurar archivo

#### 2. Recuperación de base de datos completa
- **RTO:** 2-4 horas
- **Procedimiento:**
  1. Detener servicios backend
  2. Restaurar último full backup
  3. Aplicar incrementales
  4. Verificar integridad con checksums
  5. Reiniciar servicios
  6. Validar con usuarios clave

#### 3. Disaster Recovery (servidor completo)
- **RTO:** 4-8 horas
- **RPO:** 1 hora
- **Procedimiento:**
  1. Provisionar nueva infraestructura
  2. Restaurar desde cloud backup
  3. Reconfigurar DNS/networking
  4. Validar funcionalidad
  5. Comunicar a usuarios

### Pruebas de Restauración

- **Frecuencia:** Mensual (primer domingo de cada mes)
- **Alcance:** Restauración completa en ambiente de QA
- **Validación:** Checklist de 20 puntos críticos
- **Documentación:** Reporte de prueba con tiempos y hallazgos

---

## 🔐 Seguridad de Datos

### Encriptación

#### En Reposo (At Rest)
- **Base de datos:** PostgreSQL con `pgcrypto` extension
- **Archivos:** AES-256 para documentos sensibles
- **Backups:** Cifrado completo con GPG
- **Datos biométricos:** Hash SHA-256 irreversible

#### En Tránsito (In Transit)
- **HTTPS/TLS 1.3:** Todo el tráfico web
- **WSS (WebSocket Secure):** Notificaciones en tiempo real
- **VPN:** Conexiones entre servidores
- **SSH:** Acceso administrativo

### Cumplimiento Normativo

#### LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de Particulares - México)

**Datos sensibles protegidos:**
- Datos biométricos (huellas dactilares, reconocimiento facial)
- Datos financieros (salarios, cuentas bancarias)
- Datos de salud (incapacidades, accidentes laborales)

**Derechos ARCO implementados:**
- **A**cceso: Consultar datos personales
- **R**ectificación: Corregir datos incorrectos
- **C**ancelación: Eliminar datos (soft delete)
- **O**posición: Oponerse al tratamiento

**Consentimiento explícito:**
- Registro de consentimiento para captura de biométricos
- Aviso de privacidad aceptado al crear cuenta
- Log de aceptación con timestamp e IP

#### GDPR (si aplica - clientes europeos)

- Right to be forgotten (eliminación completa)
- Data portability (exportación de datos en JSON/CSV)
- Privacy by design (desde arquitectura)

### Políticas de Seguridad

1. **Contraseñas:**
   - Mínimo 8 caracteres (1 mayúscula, 1 número, 1 símbolo)
   - Expiración cada 90 días (configurable)
   - No reutilizar últimas 5 contraseñas
   - Bloqueo tras 5 intentos fallidos

2. **Sesiones:**
   - Timeout de inactividad: 30 minutos
   - Máximo 3 sesiones concurrentes por usuario
   - Logout forzado al cambiar contraseña

3. **Acceso a datos:**
   - Row Level Security (RLS) en PostgreSQL
   - Queries automáticamente filtradas por `constructoraId`
   - Logs de acceso a datos sensibles

---

## 📊 Componentes del Módulo

### Requerimientos Funcionales (5)

| ID | Título | Descripción | Complejidad |
|----|--------|-------------|-------------|
| [RF-ADM-001](./requerimientos/RF-ADM-001-usuarios-roles.md) | Gestión de usuarios y roles | CRUD usuarios, asignación de roles, multi-tenancy | Media |
| [RF-ADM-002](./requerimientos/RF-ADM-002-permisos-granulares.md) | Sistema de permisos granulares | RBAC + ABAC, matriz de permisos, RLS | Alta |
| [RF-ADM-003](./requerimientos/RF-ADM-003-centros-costo.md) | Centros de costo | Estructura jerárquica, imputación automática | Media |
| [RF-ADM-004](./requerimientos/RF-ADM-004-auditoria.md) | Auditoría y trazabilidad | Logging automático, consultas, reportes | Alta |
| [RF-ADM-005](./requerimientos/RF-ADM-005-backups.md) | Backups automáticos | Estrategia 3-2-1, restauración, DR | Alta |

### Especificaciones Técnicas (5)

| ID | Título | RF relacionado | Complejidad |
|----|--------|----------------|-------------|
| [ET-ADM-001](./especificaciones/ET-ADM-001-rbac-multi-tenancy.md) | Modelo de RBAC multi-tenancy | RF-ADM-001, RF-ADM-002 | Alta |
| [ET-ADM-002](./especificaciones/ET-ADM-002-centros-costo-jerarquicos.md) | Centros de costo jerárquicos | RF-ADM-003 | Media |
| [ET-ADM-003](./especificaciones/ET-ADM-003-audit-logging.md) | Audit logging y change tracking | RF-ADM-004 | Alta |
| [ET-ADM-004](./especificaciones/ET-ADM-004-backups-dr.md) | Backups y Disaster Recovery | RF-ADM-005 | Alta |
| [ET-ADM-005](./especificaciones/ET-ADM-005-seguridad-datos.md) | Seguridad de datos | RF-ADM-002 | Alta |

### Historias de Usuario (8) - 40 SP

| ID | Título | SP | Prioridad |
|----|--------|----|-----------|
| [US-ADM-001](./historias-usuario/US-ADM-001-crear-usuarios.md) | Crear y gestionar usuarios | 5 | P0 |
| [US-ADM-002](./historias-usuario/US-ADM-002-asignar-roles-permisos.md) | Asignar roles y permisos | 5 | P0 |
| [US-ADM-003](./historias-usuario/US-ADM-003-centros-costo.md) | Configurar centros de costo | 5 | P1 |
| [US-ADM-004](./historias-usuario/US-ADM-004-consultar-auditoria.md) | Consultar bitácora de auditoría | 5 | P0 |
| [US-ADM-005](./historias-usuario/US-ADM-005-backups-automaticos.md) | Configurar backups automáticos | 3 | P1 |
| [US-ADM-006](./historias-usuario/US-ADM-006-restaurar-backup.md) | Restaurar desde backup | 5 | P0 |
| [US-ADM-007](./historias-usuario/US-ADM-007-dashboard-admin.md) | Dashboard de administración | 7 | P1 |
| [US-ADM-008](./historias-usuario/US-ADM-008-politicas-seguridad.md) | Configurar políticas de seguridad | 5 | P0 |

**Total:** 40 SP

---

## 🔗 Integraciones con Otros Módulos

Este módulo es **transversal** y se integra con todos los demás:

| Módulo | Integración | Funcionalidad |
|--------|-------------|---------------|
| **MAI-001 (Fundamentos)** | Core | Reutiliza autenticación, extiende roles |
| **MAI-002 (Proyectos)** | RLS + Permisos | Filtrado por `constructoraId`, permisos CRUD |
| **MAI-003 (Presupuestos)** | Auditoría | Log de cambios en presupuestos maestros |
| **MAI-004 (Compras)** | Centros de Costo | Imputación automática de compras |
| **MAI-005 (Control Obra)** | Permisos | Residentes solo ven sus proyectos |
| **MAI-007 (RRHH)** | Centros de Costo | Distribución de horas-hombre |
| **MAI-008 (Estimaciones)** | Auditoría | Log de aprobaciones de estimaciones |
| **MAE-014 (Finanzas)** | Centros de Costo | Reporting financiero por centro |

---

## 📈 Métricas de Éxito

### KPIs Operacionales

| KPI | Target | Medición |
|-----|--------|----------|
| **Tiempo de creación de usuario** | < 2 minutos | Desde invitación hasta primer login |
| **Disponibilidad del sistema** | 99.5% | Uptime mensual |
| **RTO (Recovery Time Objective)** | < 4 horas | Tiempo de recuperación total |
| **RPO (Recovery Point Objective)** | < 1 hora | Pérdida máxima de datos |
| **Accesos no autorizados** | 0 | Intentos bloqueados por RLS |
| **Auditoría completa** | 100% | % de operaciones críticas logueadas |

### KPIs de Seguridad

| KPI | Target | Medición |
|-----|--------|----------|
| **Intentos de login fallidos** | < 0.5% | % del total de logins |
| **Cuentas bloqueadas** | < 1% | % de usuarios activos |
| **Tiempo de detección de anomalías** | < 5 minutos | Alertas de seguridad |
| **Backups exitosos** | 100% | % de backups completados sin errores |
| **Tiempo de restauración (prueba)** | < 2 horas | Pruebas mensuales |

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Filtración de datos por RLS mal configurado** | Media | Crítico | Tests automáticos de RLS en CI/CD, auditoría trimestral |
| **Pérdida de backups** | Baja | Crítico | Estrategia 3-2-1, pruebas mensuales de restauración |
| **Ataque de fuerza bruta** | Media | Alto | Rate limiting, bloqueo tras 5 intentos, CAPTCHA |
| **Insider threat (empleado malicioso)** | Baja | Alto | Auditoría completa, separación de funciones, alertas |
| **Downtime prolongado** | Baja | Crítico | Alta disponibilidad, DR plan, monitoreo 24/7 |

---

## 🎯 Próximos Pasos

### Fase de Documentación
1. ✅ README.md completado
2. ⏳ Crear 5 Requerimientos Funcionales
3. ⏳ Crear 5 Especificaciones Técnicas
4. ⏳ Crear 8 Historias de Usuario
5. ⏳ Crear TRACEABILITY.yml

### Fase de Implementación (Sprint 3-4)
1. **Sprint 3 - Semana 5-6:**
   - US-ADM-001: Gestión de usuarios (5 SP)
   - US-ADM-002: Roles y permisos (5 SP)
   - US-ADM-004: Auditoría (5 SP)
   - **Total:** 15 SP

2. **Sprint 4 - Semana 7-8:**
   - US-ADM-003: Centros de costo (5 SP)
   - US-ADM-006: Restauración (5 SP)
   - US-ADM-007: Dashboard admin (7 SP)
   - US-ADM-008: Políticas seguridad (5 SP)
   - US-ADM-005: Backups (3 SP)
   - **Total:** 25 SP

---

## 📚 Referencias

- **Índice del módulo:** [_MAP.md](./_MAP.md)
- **Fase 1 completa:** [../README.md](../README.md)
- **Definición del MVP:** [../../00-overview/MVP-APP.md](../../00-overview/MVP-APP.md)
- **Análisis de reutilización GAMILIT:** [../ANALISIS-REUTILIZACION-GAMILIT.md](../ANALISIS-REUTILIZACION-GAMILIT.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Estado:** ✅ Completo
**Reutilización GAMILIT:** 90% (infraestructura base)
