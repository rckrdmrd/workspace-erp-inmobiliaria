# RF-ADM-005: Backups Automáticos y Disaster Recovery

**ID:** RF-ADM-005
**Módulo:** MAI-013 - Administración & Seguridad
**Tipo:** Requerimiento Funcional
**Prioridad:** P0 (Crítica)
**Fecha de creación:** 2025-11-20
**Versión:** 1.0

---

## 📋 Descripción

El sistema debe proporcionar **backups automáticos** y un plan de **Disaster Recovery (DR)** que garantice:

- **Backups automáticos** programados sin intervención manual
- **Estrategia 3-2-1:** 3 copias, 2 medios diferentes, 1 copia offsite
- **Restauración rápida:** RTO < 4 horas, RPO < 1 hora
- **Verificación de integridad:** Checksums MD5/SHA-256
- **Pruebas mensuales** de restauración
- **Alertas** de backups fallidos

La estrategia de backups es fundamental para garantizar **continuidad del negocio** ante desastres (fallas de hardware, ataques ransomware, errores humanos).

---

## 🎯 Objetivos

### Objetivos de Negocio

1. **Protección de datos:** Cero pérdida de datos críticos
2. **Continuidad del negocio:** Recuperación rápida ante desastres
3. **Cumplimiento normativo:** ISO 27001, SOC 2, GDPR
4. **Confianza del cliente:** Datos siempre disponibles y seguros
5. **Reducción de riesgos:** Mitigación de ransomware, fallas, errores

### Objetivos Técnicos

1. **RTO (Recovery Time Objective):** < 4 horas
2. **RPO (Recovery Point Objective):** < 1 hora
3. **Automatización:** 100% de backups sin intervención manual
4. **Retención:** Según criticidad (7 días, 30 días, 1 año)
5. **Performance:** Backups no afectan operación del sistema

---

## 📊 Estrategia 3-2-1 de Backups

### Regla 3-2-1

**3 copias** de los datos:
- 1 copia en producción (activa)
- 2 copias de respaldo (backups)

**2 medios diferentes:**
- Local: NAS/SAN en oficina
- Cloud: AWS S3 / Azure Blob Storage

**1 copia offsite:**
- Geográficamente separada (otra ciudad/país)
- Protección contra desastres físicos (incendio, inundación)

### Implementación

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTRATEGIA 3-2-1                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  COPIA 1: Producción (Activa)                              │
│  └─> Servidor DB Principal (PostgreSQL)                    │
│      Ubicación: Culiacán, Sinaloa                          │
│                                                             │
│  COPIA 2: Backup Local (Medio 1)                           │
│  └─> NAS/SAN en oficina                                    │
│      Ubicación: Culiacán, Sinaloa                          │
│      Retención: 7 días                                     │
│                                                             │
│  COPIA 3: Backup Cloud (Medio 2 + Offsite)                 │
│  └─> AWS S3 / Azure Blob                                   │
│      Ubicación: us-west-2 (Oregon, USA)                    │
│      Retención: 30 días (rolling)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Tipos de Backup

### 1. Full Backup (Completo)

**Frecuencia:** Diario (3:00 AM)
**Duración:** 2-4 horas (según tamaño)
**Retención:** 7 días

**Contenido:**
- Base de datos completa (PostgreSQL dump)
- Archivos subidos (documentos, evidencias, planos)
- Configuraciones del sistema
- Variables de entorno (secrets)
- Logs de aplicación (últimos 7 días)

**Comando (PostgreSQL):**
```bash
pg_dump -h localhost -U postgres -F c \
  -f /backups/full/backup-$(date +%Y-%m-%d).dump \
  erp_construccion
```

**Tamaño estimado:**
- DB pequeña (< 1 año): 5-10 GB
- DB mediana (1-3 años): 20-50 GB
- DB grande (> 3 años): 100-200 GB

**Ventajas:**
- ✅ Restauración más rápida (un solo archivo)
- ✅ Autónomo (no depende de backups anteriores)

**Desventajas:**
- ❌ Consume más espacio
- ❌ Más lento que incremental

---

### 2. Incremental Backup

**Frecuencia:** Cada 6 horas (00:00, 06:00, 12:00, 18:00)
**Duración:** 15-30 minutos
**Retención:** 48 horas

**Contenido:**
- Solo cambios desde el último backup (full o incremental)
- Archivos modificados/creados en últimas 6 horas
- Logs de aplicación nuevos

**Herramienta:** `rsync` o `pg_basebackup` con WAL archiving

**Comando (rsync):**
```bash
rsync -av --delete --link-dest=/backups/previous \
  /var/lib/postgresql/data \
  /backups/incremental/backup-$(date +%Y-%m-%d_%H-%M)
```

**Ventajas:**
- ✅ Rápido (solo cambios)
- ✅ Consume menos espacio

**Desventajas:**
- ❌ Restauración más lenta (requiere full + todos los incrementales)

---

### 3. Backup de Archivos Críticos

**Frecuencia:** Cada hora (top of the hour)
**Duración:** 5-10 minutos
**Retención:** 24 horas

**Contenido:**
- Documentos subidos (contratos, minutas)
- Evidencias fotográficas de obra
- Planos y documentación técnica
- Archivos CFDI (facturas electrónicas)

**Ubicaciones:**
```
/storage/documents/
/storage/photos/
/storage/plans/
/storage/invoices/
```

**Método:**
- Sincronización en tiempo real a AWS S3
- Versionado activado (conservar versiones anteriores)

**Ventajas:**
- ✅ RPO < 1 hora (baja pérdida de datos)
- ✅ Archivos versionados (recuperar versiones antiguas)

---

### 4. Snapshots de Base de Datos (PITR)

**Frecuencia:** Cada 30 minutos
**Duración:** Instantáneo
**Retención:** 6 horas

**Contenido:**
- Snapshot del filesystem de PostgreSQL
- WAL (Write-Ahead Logging) archiving
- Permite Point-In-Time Recovery

**Configuración PostgreSQL:**
```ini
# postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'rsync %p /backups/wal/%f'
```

**Ventajas:**
- ✅ RPO mínimo (< 1 hora)
- ✅ Recuperación a cualquier punto en el tiempo

**Desventajas:**
- ❌ Requiere configuración avanzada

---

## 📅 Calendario de Backups

### Calendario Semanal

```
┌──────────┬────────┬────────────┬──────────┬──────────┐
│ Hora     │ Lun-Dom│ Tipo       │ Ubicación│ Retención│
├──────────┼────────┼────────────┼──────────┼──────────┤
│ 03:00 AM │ Diario │ Full       │ Local+S3 │ 7 días   │
│ 00:00    │ Diario │ Incremental│ Local    │ 48 hrs   │
│ 06:00    │ Diario │ Incremental│ Local    │ 48 hrs   │
│ 12:00    │ Diario │ Incremental│ Local    │ 48 hrs   │
│ 18:00    │ Diario │ Incremental│ Local    │ 48 hrs   │
│ Hourly   │ Diario │ Archivos   │ S3       │ 24 hrs   │
│ :00/:30  │ Diario │ Snapshot   │ Local    │ 6 hrs    │
└──────────┴────────┴────────────┴──────────┴──────────┘
```

### Calendario Mensual

**Primer domingo de cada mes:**
- Backup full completo con retención de **1 año**
- Prueba de restauración completa
- Reporte de integridad de backups

**Ejemplo:**
- Backup del 2025-12-01 se conserva hasta 2026-12-01
- Total: 12 backups mensuales por año

---

## 🔄 Proceso de Restauración

### Escenarios de Recuperación

#### Escenario 1: Recuperación de Archivo Individual

**Caso:** Usuario borró por error un contrato PDF

**RTO:** 15 minutos
**RPO:** < 1 hora

**Procedimiento:**
1. Usuario reporta: "Borré contrato-123.pdf por error"
2. Admin accede a AWS S3 console
3. Busca archivo en versiones anteriores
4. Descarga versión más reciente
5. Sube archivo nuevamente al sistema
6. Valida con usuario

**Herramienta:** AWS S3 Versioning

---

#### Escenario 2: Recuperación de Base de Datos a Punto Específico

**Caso:** Error en script SQL borró 500 registros a las 14:30

**RTO:** 1-2 horas
**RPO:** < 30 minutos

**Procedimiento:**
1. Identificar timestamp exacto del error: 2025-11-20 14:30
2. Detener aplicación (modo mantenimiento)
3. Crear backup de estado actual (por si acaso)
4. Restaurar base de datos a 2025-11-20 14:25 (5 min antes):
   ```bash
   pg_restore -h localhost -U postgres \
     --clean --if-exists \
     /backups/full/backup-2025-11-20.dump
   ```
5. Aplicar WAL logs hasta 14:25:
   ```bash
   pg_wal_replay --target-time='2025-11-20 14:25:00'
   ```
6. Verificar integridad de datos
7. Reiniciar aplicación
8. Validar con usuarios clave

**Resultado:** Recuperados 500 registros, pérdida de datos: 5 minutos.

---

#### Escenario 3: Disaster Recovery (Servidor Completo)

**Caso:** Servidor físico destruido por incendio

**RTO:** 4-8 horas
**RPO:** < 1 hora

**Procedimiento:**

**Fase 1: Provisionamiento (2 horas)**
1. Provisionar nueva infraestructura:
   - Servidor cloud (AWS EC2 / Azure VM)
   - Disco de 500 GB SSD
   - Configuración de red (VPC, Security Groups)
2. Instalar sistema operativo (Ubuntu 22.04 LTS)
3. Instalar PostgreSQL 15
4. Instalar Node.js 20, npm, pm2

**Fase 2: Restauración de Datos (2 horas)**
5. Descargar último full backup desde AWS S3:
   ```bash
   aws s3 cp s3://backups-empresa/backup-2025-11-20.dump .
   ```
6. Restaurar base de datos:
   ```bash
   pg_restore -h localhost -U postgres \
     --clean --create \
     backup-2025-11-20.dump
   ```
7. Sincronizar archivos desde S3:
   ```bash
   aws s3 sync s3://storage-empresa/documents /storage/documents
   aws s3 sync s3://storage-empresa/photos /storage/photos
   ```
8. Restaurar configuraciones:
   ```bash
   aws s3 cp s3://backups-empresa/configs/env .env
   ```

**Fase 3: Validación y Reinicio (1 hora)**
9. Validar integridad de datos:
   ```sql
   SELECT COUNT(*) FROM projects; -- Debe coincidir con último reporte
   SELECT COUNT(*) FROM users;
   ```
10. Ejecutar smoke tests:
    - Login funciona
    - Proyectos se listan correctamente
    - Crear registro de prueba
11. Reconfigurar DNS:
    ```
    app.ejemplo.com → Nueva IP: 54.123.45.67
    ```
12. Reiniciar aplicación:
    ```bash
    pm2 start ecosystem.config.js
    pm2 logs --lines 100
    ```
13. Notificar a usuarios: "Sistema restaurado, funcionando normalmente"

**Fase 4: Post-Mortem (1 hora)**
14. Reunión de equipo para analizar incidente
15. Documentar lecciones aprendidas
16. Actualizar plan de DR si es necesario

**Resultado:** Sistema en línea en 4-8 horas, pérdida de datos < 1 hora.

---

## 🔒 Seguridad de Backups

### Encriptación

**En tránsito (upload a S3):**
```bash
aws s3 cp backup.dump s3://backups/ \
  --sse AES256 \
  --storage-class STANDARD_IA
```

**En reposo (S3):**
- Server-Side Encryption (SSE-S3 o SSE-KMS)
- Archivos cifrados con AES-256

**Backups locales:**
```bash
# Cifrar backup antes de almacenar
gpg --symmetric --cipher-algo AES256 backup.dump
```

### Control de Acceso

**AWS S3 Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::backups-empresa/*"
    }
  ]
}
```

**Resultado:** Backups no se pueden eliminar, solo agregar nuevos.

**Acceso:**
- Solo Admin de TI tiene credenciales de S3
- MFA requerido para acceder a S3 console
- Logs de acceso activados (CloudTrail)

---

## ✅ Verificación de Integridad

### Checksums MD5/SHA-256

**Al crear backup:**
```bash
# Crear backup
pg_dump -F c -f backup.dump erp_construccion

# Calcular checksum
sha256sum backup.dump > backup.dump.sha256
```

**Al restaurar:**
```bash
# Verificar checksum antes de restaurar
sha256sum -c backup.dump.sha256

# Si OK, proceder con restauración
```

### Validación de Contenido

**Tests automáticos post-backup:**
```bash
#!/bin/bash
# validate-backup.sh

# Restaurar en DB temporal
createdb backup_test
pg_restore -d backup_test backup.dump

# Ejecutar queries de validación
psql -d backup_test -c "SELECT COUNT(*) FROM users;" > users_count.txt
psql -d backup_test -c "SELECT COUNT(*) FROM projects;" > projects_count.txt

# Comparar con producción
diff users_count.txt /backups/validation/users_count_prod.txt

# Si diff vacío, backup OK
if [ $? -eq 0 ]; then
  echo "✅ Backup válido"
else
  echo "❌ Backup corrupto, enviar alerta"
fi

# Limpiar
dropdb backup_test
```

---

## 📋 Modelo de Datos de Backup

```typescript
interface BackupRecord {
  // Identificación
  id: string; // UUID
  timestamp: Date;
  backupType: BackupType; // full | incremental | files | snapshot

  // Ubicación
  storagePath: string; // "/backups/full/backup-2025-11-20.dump"
  s3Url?: string; // "s3://backups-empresa/backup-2025-11-20.dump"
  storageTier: 'local' | 's3_standard' | 's3_glacier';

  // Tamaño y compresión
  sizeBytes: number;
  sizeCompressed?: number;
  compressionRatio?: number; // %

  // Integridad
  checksum: string; // SHA-256
  checksumAlgorithm: 'md5' | 'sha256';
  isVerified: boolean;
  verifiedAt?: Date;

  // Metadata
  databaseVersion: string; // "PostgreSQL 15.3"
  schemaVersion: string; // "v2.5.0"
  recordCount?: {
    users: number;
    projects: number;
    budgets: number;
    // ...
  };

  // Estado
  status: BackupStatus; // pending | in_progress | completed | failed | verified
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // Segundos

  // Retención
  retentionDays: number; // 7, 30, 365
  expiresAt: Date;
  isDeleted: boolean;

  // Errores
  errorMessage?: string;
  errorDetails?: string;

  // Restauración
  lastRestoreTest?: Date;
  restoreTestSuccess?: boolean;
}

enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  FILES = 'files',
  SNAPSHOT = 'snapshot'
}

enum BackupStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  VERIFIED = 'verified'
}
```

---

## 🚨 Alertas de Backups

### Configuración de Alertas

| Condición | Severidad | Destinatarios | Canal |
|-----------|-----------|---------------|-------|
| **Backup fallido** | Critical | Admin TI + Director | Email + SMS |
| **Backup > 2 horas** | High | Admin TI | Email |
| **Checksum inválido** | Critical | Admin TI | Email + SMS |
| **Disco > 80% lleno** | High | Admin TI | Email |
| **Prueba restauración fallida** | Critical | Admin TI + Director | Email + SMS |
| **Backup no ejecutado** | Critical | Admin TI | Email + SMS |

### Ejemplo de Alerta

**Asunto:** 🚨 CRÍTICO: Backup Full Fallido

```
Estimado Administrador,

El backup full programado para hoy falló:

Tipo: Full Backup
Fecha/Hora: 2025-11-20 03:00 AM
Duración: 35 minutos (abortado)
Error: "Disk quota exceeded"

Detalles del error:
- Disco /backups al 98% de capacidad
- Backup abortado tras escribir 45 GB de 50 GB

Acciones recomendadas:
1. Liberar espacio en disco /backups
2. Ejecutar backup manualmente
3. Verificar integridad del último backup exitoso (2025-11-19)

Último backup exitoso: 2025-11-19 03:00 AM (24 horas atrás)

⚠️ Acción inmediata requerida

---
Sistema de Backups Automáticos
Constructora ABC
```

---

## 📋 Casos de Uso

### Caso 1: Prueba Mensual de Restauración

**Actor:** Admin de TI (automatizado)

**Flujo:**
1. Primer domingo del mes a las 02:00 AM
2. Cron job ejecuta script: `monthly-restore-test.sh`
3. Script:
   - Descarga último full backup desde S3
   - Verifica checksum
   - Crea base de datos temporal `erp_restore_test`
   - Restaura backup completo
   - Ejecuta 20 queries de validación
   - Compara resultados con producción
   - Genera reporte HTML
4. Si exitoso:
   - Marca backup como `verified`
   - Envía reporte a Admin TI y Director
5. Si falla:
   - Alerta crítica por email + SMS
   - Reporte de error detallado

**Resultado:** Confianza mensual de que backups funcionan.

---

### Caso 2: Ataque Ransomware

**Contexto:** Ransomware cifra toda la base de datos de producción

**Flujo:**
1. 08:30 AM - Usuarios reportan: "Sistema no funciona, pide pago de $50K BTC"
2. Admin identifica ransomware
3. **Decisión: No pagar, restaurar desde backup**
4. Admin:
   - Aísla servidor infectado (desconecta red)
   - Provisiona nuevo servidor limpio
   - Descarga último backup (ayer 03:00 AM)
   - Restaura base de datos
   - Restaura archivos desde S3
5. 12:00 PM - Sistema en línea
6. Pérdida de datos: 5.5 horas (desde 03:00 AM backup hasta 08:30 AM ataque)
7. Post-mortem:
   - Identificar vector de ataque
   - Actualizar firewall rules
   - Capacitar usuarios en phishing

**Resultado:** Ataque mitigado sin pagar rescate, pérdida < 6 horas.

---

## ✅ Criterios de Aceptación

### AC1: Backups Automáticos sin Falla

**DADO** el sistema configurado correctamente
**CUANDO** se ejecuta cron job de backup full a las 03:00 AM
**ENTONCES**
- ✅ Backup se ejecuta automáticamente (sin intervención)
- ✅ Backup se completa exitosamente en < 4 horas
- ✅ Archivo generado con checksum SHA-256
- ✅ Backup subido a S3 con encriptación
- ✅ Backup local guardado en NAS
- ✅ Registro creado en tabla `backup_records`
- ✅ Si falla, alerta enviada inmediatamente

### AC2: Estrategia 3-2-1 Implementada

**DADO** un backup full exitoso
**CUANDO** se valida la estrategia
**ENTONCES**
- ✅ 3 copias existen:
  - Producción (activa)
  - Backup local (NAS)
  - Backup cloud (S3)
- ✅ 2 medios diferentes:
  - Local (NAS)
  - Cloud (S3)
- ✅ 1 copia offsite:
  - S3 en región diferente (us-west-2)

### AC3: Restauración < RTO

**DADO** un desastre que requiere restauración completa
**CUANDO** se ejecuta plan de DR
**ENTONCES**
- ✅ Sistema completamente restaurado en < 4 horas (RTO)
- ✅ Pérdida de datos < 1 hora (RPO)
- ✅ Integridad de datos validada (checksums OK)
- ✅ Aplicación funcional y accesible

### AC4: Pruebas Mensuales Exitosas

**DADO** el primer domingo del mes
**CUANDO** se ejecuta prueba de restauración
**ENTONCES**
- ✅ Backup se restaura en DB temporal exitosamente
- ✅ Queries de validación retornan resultados esperados
- ✅ Reporte HTML generado automáticamente
- ✅ Email enviado a Admin y Director
- ✅ Si falla, alerta crítica enviada

### AC5: Retención Automática

**DADO** backups con diferentes retenciones
**CUANDO** pasa el periodo de retención
**ENTONCES**
- ✅ Backups diarios eliminados tras 7 días
- ✅ Backups incrementales eliminados tras 48 horas
- ✅ Backups mensuales conservados 1 año
- ✅ Proceso de limpieza ejecuta automáticamente

---

## 🧪 Escenarios de Prueba

### Test 1: Backup Full Exitoso

```typescript
describe('RF-ADM-005: Full Backup', () => {
  it('should create full backup successfully', async () => {
    const backupService = new BackupService();

    const result = await backupService.createFullBackup();

    expect(result.status).toBe('completed');
    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(result.checksum).toBeDefined();
    expect(result.isVerified).toBe(true);
    expect(result.s3Url).toContain('s3://backups-empresa');

    // Verificar archivo existe
    const fileExists = await fs.pathExists(result.storagePath);
    expect(fileExists).toBe(true);
  });
});
```

### Test 2: Restauración Point-in-Time

```typescript
describe('RF-ADM-005: Point-in-Time Recovery', () => {
  it('should restore database to specific timestamp', async () => {
    // Crear datos iniciales
    await createProject({ name: 'Proyecto 1' });

    const snapshot1 = new Date();
    await sleep(1000);

    // Crear más datos
    await createProject({ name: 'Proyecto 2' });

    // Restaurar a snapshot1 (antes de Proyecto 2)
    await restoreToPointInTime(snapshot1);

    // Validar
    const projects = await db.query('SELECT * FROM projects');
    expect(projects.rows).toHaveLength(1);
    expect(projects.rows[0].name).toBe('Proyecto 1');
  });
});
```

---

## 🔗 Referencias

- **Especificación técnica:** [ET-ADM-004](../especificaciones/ET-ADM-004-backups-dr.md)
- **Historia de usuario:** [US-ADM-005](../historias-usuario/US-ADM-005-backups-automaticos.md), [US-ADM-006](../historias-usuario/US-ADM-006-restaurar-backup.md)
- **RF relacionado:** [RF-ADM-004](./RF-ADM-004-auditoria.md)
- **Módulo:** [README.md](../README.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Estado:** ✅ Completo
