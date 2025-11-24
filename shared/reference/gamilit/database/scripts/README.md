# Scripts de Base de Datos GAMILIT

**Ubicación:** `/gamilit/projects/gamilit/apps/database/scripts/`
**Versión:** 2.0
**Última actualización:** 2025-11-02

---

## 🎯 Visión General

Este directorio contiene scripts para gestionar la base de datos PostgreSQL de GAMILIT en ambientes **dev** y **prod**. Los scripts son:

- **Idempotentes**: Se pueden ejecutar múltiples veces de forma segura
- **Multi-ambiente**: Soportan dev y prod con flags claros
- **Seguros**: Generan credenciales automáticas y las sincronizan
- **Auto-documentados**: Incluyen --help y mensajes claros

---

## 📦 Scripts Disponibles

### 1. `init-database.sh` - Inicialización Completa

**Crea usuario + BD + DDL + seeds + actualiza .env**

```bash
# Modo interactivo (preguntará ambiente)
./init-database.sh

# Desarrollo
./init-database.sh --env dev

# Producción
./init-database.sh --env prod

# Con password personalizado
./init-database.sh --env dev --password "mi_password_seguro"

# Sin confirmación (automatizado)
./init-database.sh --env dev --force
```

**¿Qué hace?**
1. ✅ Crea usuario `gamilit_user` (si no existe)
2. ✅ Genera password seguro de 32 caracteres
3. ✅ Crea base de datos `gamilit_platform`
4. ✅ Ejecuta todos los DDL (9 schemas, 49 tablas actuales)
5. ✅ Carga seeds del ambiente (dev/staging/production)
6. ✅ Valida instalación
7. ✅ Guarda credenciales en `database-credentials-{env}.txt`
8. ✅ **NUEVO:** Actualiza automáticamente archivos .env (ver sección [Gestión de Credenciales](#-gestión-de-credenciales))

**Resultado:** Base de datos funcional al 100% + archivos .env sincronizados

---

### 2. `recreate-database.sh` - Recreación Completa

**Elimina usuario + BD, luego recrea todo**

⚠️ **DESTRUYE TODOS LOS DATOS Y ELIMINA USUARIO**

```bash
# Modo interactivo
./recreate-database.sh

# Desarrollo
./recreate-database.sh --env dev

# Producción (requiere confirmación adicional)
./recreate-database.sh --env prod

# Sin confirmación (peligroso, solo para CI/CD)
./recreate-database.sh --env dev --force
```

**¿Qué hace?**
1. ⚠️ Termina conexiones activas
2. ⚠️ Elimina completamente la BD `gamilit_platform`
3. ⚠️ Elimina el usuario `gamilit_user`
4. ✅ Ejecuta `init-database.sh` para recrear todo
5. ✅ Actualiza archivos .env automáticamente

**Cuándo usar:**
- Desarrollo y testing local
- Resolver conflictos graves de migración
- Resetear COMPLETAMENTE el ambiente
- **NO usar en producción con datos reales** sin backup

---

### 3. `reset-database.sh` - Reset de BD (Mantiene Usuario)

**Elimina solo la BD, mantiene el usuario**

⚠️ **Elimina datos pero NO el usuario**

```bash
# Modo interactivo (pedirá password)
./reset-database.sh

# Desarrollo con password
./reset-database.sh --env dev --password "mi_password"

# Producción
./reset-database.sh --env prod --password "prod_pass"

# Sin confirmación
./reset-database.sh --env dev --password "pass" --force
```

**¿Qué hace?**
1. ⚠️ Elimina la BD `gamilit_platform`
2. ✅ Mantiene el usuario `gamilit_user` (sin cambiar password)
3. ✅ Recrea BD con DDL y seeds
4. ℹ️ **NO** actualiza archivos .env (porque credenciales no cambian)

**Cuándo usar:**
- Usuario ya existe con password conocido
- Resetear datos sin tocar configuración de usuario
- Ambientes donde el usuario tiene permisos específicos
- Cuando NO quieres regenerar password ni JWT secrets

---

### 4. `update-env-files.sh` - Sincronización de .env

**Actualiza archivos .env en múltiples ubicaciones**

```bash
# Sincronizar credenciales automáticamente
./update-env-files.sh --env dev

# Desde archivo de credenciales personalizado
./update-env-files.sh --env prod --credentials-file /path/to/creds.txt
```

**¿Qué hace?**
1. ✅ Lee credenciales de BD desde `database-credentials-{env}.txt`
2. ✅ Genera JWT secrets seguros (si no existen)
3. ✅ Actualiza múltiples archivos .env:
   - `apps/backend/.env.{env}`
   - `apps/database/.env.{env}`
   - `../../gamilit-deployment-scripts/.env.{env}`
4. ✅ Crea backups antes de actualizar
5. ✅ Establece permisos seguros (600)

**Cuándo usar:**
- Automático: Llamado por `init-database.sh` y `recreate-database.sh`
- Manual: Cuando necesites regenerar JWT secrets
- Manual: Cuando necesites sincronizar credenciales manualmente

---

## 📊 Comparación Rápida

| Script | Elimina Usuario | Elimina BD | Crea Usuario | Crea BD | Actualiza .env | Requiere Password |
|--------|----------------|------------|--------------|---------|----------------|-------------------|
| `init-database.sh` | ❌ | ⚠️ Si existe | ✅ Si no existe | ✅ | ✅ | ❌ (genera automático) |
| `recreate-database.sh` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ (genera automático) |
| `reset-database.sh` | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ (requerido) |
| `update-env-files.sh` | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ (lee de archivo) |

---

## 🔑 Gestión de Credenciales

### Flujo Automático de Credenciales

Cuando ejecutas `init-database.sh` o `recreate-database.sh`:

```
┌─────────────────────────┐
│ init-database.sh        │
│ --env dev               │
└───────────┬─────────────┘
            │
            ├─> Genera password de 32 caracteres
            ├─> Crea usuario PostgreSQL
            ├─> Crea base de datos
            ├─> Ejecuta DDL y seeds
            │
            ├─> Guarda en: database-credentials-dev.txt
            │   ├─> Host, Port, Database
            │   ├─> User, Password
            │   └─> Connection String
            │
            └─> Llama a update-env-files.sh
                │
                ├─> Genera JWT secrets
                │
                └─> Actualiza archivos .env:
                    ├─> apps/backend/.env.dev
                    ├─> apps/database/.env.dev
                    └─> ../../gamilit-deployment-scripts/.env.dev
```

### Ubicaciones de Archivos .env

Después de ejecutar `init-database.sh --env dev`:

```
workspace-gamilit/
├── gamilit/projects/gamilit/
│   ├── apps/
│   │   ├── backend/
│   │   │   └── .env.dev              ← Backend config
│   │   └── database/
│   │       ├── .env.dev              ← Database config
│   │       └── database-credentials-dev.txt
│   │
└── projects/
    └── gamilit-deployment-scripts/
        └── .env.dev                   ← Deployment config
```

### Contenido de archivos .env

Cada archivo `.env.{env}` contiene:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamilit_platform
DB_USER=gamilit_user
DB_PASSWORD=<generado automáticamente>
DATABASE_URL=postgresql://...

# Pool Configuration
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_SSL=false

# JWT Authentication
JWT_SECRET=<generado automáticamente>
JWT_REFRESH_SECRET=<generado automáticamente>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# VITE Frontend
VITE_JWT_SECRET=<igual que JWT_SECRET>

# Environment
NODE_ENV=dev|prod
APP_ENV=dev|prod
```

---

## 🚀 Guía de Uso por Escenario

### Escenario 1: Primera Instalación (Dev)

```bash
cd /path/to/gamilit/projects/gamilit/apps/database/scripts

# Crear todo desde cero
./init-database.sh --env dev

# Verificar credenciales generadas
cat ../database-credentials-dev.txt

# Verificar que backend tiene las credenciales
cat ../../backend/.env.dev
```

✅ **Resultado:** BD funcional + archivos .env sincronizados + JWT secrets

---

### Escenario 2: Primera Instalación (Prod)

```bash
cd /path/to/gamilit/projects/gamilit/apps/database/scripts

# Crear todo en producción
./init-database.sh --env prod

# Guardar credenciales de forma segura
cp ../database-credentials-prod.txt /secure/location/
chmod 400 /secure/location/database-credentials-prod.txt

# Verificar deployment scripts
cat /path/to/gamilit-deployment-scripts/.env.prod
```

⚠️ **Importante:** Haz backup de `database-credentials-prod.txt` en ubicación segura

---

### Escenario 3: Resetear Durante Desarrollo

```bash
# Opción 1: Recrear TODO (incluyendo usuario y regenerar password)
./recreate-database.sh --env dev --force

# Opción 2: Solo resetear BD (mantener usuario y password)
# (Primero, recupera el password de database-credentials-dev.txt)
./reset-database.sh --env dev --password "$(grep Password ../database-credentials-dev.txt | awk '{print $2}')"
```

---

### Escenario 4: Actualizar solo JWT Secrets

```bash
# Si solo necesitas regenerar JWT secrets sin tocar la BD
./update-env-files.sh --env dev

# Los nuevos secrets se aplicarán a:
# - apps/backend/.env.dev
# - apps/deployment-scripts/.env.dev
```

---

### Escenario 5: Migración de Legacy a Nueva Estructura

Si tienes scripts viejos en `gamilit-deployment-scripts`:

```bash
# Los wrappers redirigen automáticamente a nueva ubicación
cd /path/to/gamilit-deployment-scripts/scripts/database

# Estos funcionan pero muestran advertencia de deprecación:
./init-database-wrapper.sh --env dev
./recreate-database-wrapper.sh --env dev
./reset-database-wrapper.sh --env dev --password "pass"

# Recomendado: Usar ubicación nueva directamente
cd /path/to/gamilit/projects/gamilit/apps/database/scripts
./init-database.sh --env dev
```

---

## 🛡️ Seguridad

### Passwords y Secrets

1. **Passwords de BD**: 32 caracteres, base64, sin caracteres especiales problemáticos
2. **JWT Secrets**: 32 caracteres, base64, generados con OpenSSL
3. **Archivos .env**: Permisos 600 (solo owner puede leer/escribir)
4. **Archivos credentials**: Permisos 600 + almacenamiento seguro en prod

### Backups Automáticos

Cuando `update-env-files.sh` actualiza un archivo existente:

```bash
# Crea backup automático antes de modificar
.env.dev → .env.dev.backup.20251102_143025
```

---

## 🗂️ Estructura de Archivos

```
apps/database/
├── scripts/
│   ├── init-database.sh              # Inicialización completa
│   ├── recreate-database.sh          # Destruir y recrear
│   ├── reset-database.sh             # Reset sin tocar usuario
│   ├── update-env-files.sh           # Sincronizar .env
│   ├── README.md                     # Este archivo
│   └── README-SETUP.md               # Documentación anterior (referencia)
│
├── ddl/                              # Definiciones SQL
│   ├── 00-prerequisites.sql          # ENUMs y funciones globales
│   └── schemas/                      # 9 schemas organizados
│       ├── auth/
│       ├── auth_management/
│       ├── system_configuration/
│       ├── gamification_system/
│       ├── educational_content/
│       ├── content_management/
│       ├── social_features/
│       ├── progress_tracking/
│       └── audit_logging/
│
├── seeds/                            # Datos iniciales
│   ├── dev/                          # Seeds para desarrollo
│   ├── staging/                      # Seeds para staging
│   └── production/                   # Seeds para producción
│
├── .env.dev                          # ← Generado por scripts
├── .env.prod                         # ← Generado por scripts
├── database-credentials-dev.txt      # ← Generado por scripts
└── database-credentials-prod.txt     # ← Generado por scripts
```

---

## ⚙️ Requisitos

### Software Necesario

- **PostgreSQL** 12+ instalado y corriendo
- **psql** cliente disponible en PATH
- **OpenSSL** para generar secrets
- **Bash** 4.0+
- **Acceso sudo** (o peer authentication) para usuario postgres

### Permisos Necesarios

```bash
# Verificar acceso a PostgreSQL como postgres
sudo -u postgres psql -c "SELECT version();"

# O con peer authentication
psql -U postgres -c "SELECT version();"
```

---

## 🔧 Troubleshooting

### Error: "psql: command not found"

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql
```

### Error: "No se puede conectar a PostgreSQL"

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Iniciar si no está corriendo
sudo systemctl start postgresql
```

### Error: "Permission denied para crear usuario"

```bash
# Verificar que tienes acceso como postgres
sudo -u postgres psql -c "SELECT current_user;"

# Debe mostrar: postgres
```

### Los archivos .env no se actualizaron

```bash
# Ejecutar manualmente el script de sincronización
./update-env-files.sh --env dev

# Verificar que existe el archivo de credenciales
ls -l ../database-credentials-dev.txt
```

### Quiero usar un password específico

```bash
# Para init-database.sh (primera vez)
./init-database.sh --env dev --password "mi_password_especifico"

# Para reset-database.sh (reset manteniendo usuario)
./reset-database.sh --env dev --password "mi_password_especifico"
```

---

## 📋 Checklist de Validación

Después de ejecutar los scripts, verifica:

```bash
# 1. Base de datos existe
psql -U gamilit_user -d gamilit_platform -c "SELECT current_database();"

# 2. Schemas creados (debe mostrar 9)
psql -U gamilit_user -d gamilit_platform -c "SELECT count(*) FROM information_schema.schemata WHERE schema_name NOT IN ('pg_catalog', 'information_schema');"

# 3. Tablas creadas (debe mostrar 49 actualmente)
psql -U gamilit_user -d gamilit_platform -c "SELECT count(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema');"

# 4. Seeds cargados
psql -U gamilit_user -d gamilit_platform -c "SELECT COUNT(*) FROM auth.users;"

# 5. Archivos .env existen
ls -l ../../backend/.env.dev
ls -l ../.env.dev
ls -l /path/to/deployment-scripts/.env.dev

# 6. JWT secrets están presentes
grep JWT_SECRET ../../backend/.env.dev
```

---

## 🔄 Integración con CI/CD

### GitHub Actions / GitLab CI

```yaml
# .github/workflows/setup-database.yml
name: Setup Database

on: [push]

jobs:
  setup-db:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Database
        run: |
          cd gamilit/projects/gamilit/apps/database/scripts
          ./init-database.sh --env dev --force

      - name: Verify Installation
        run: |
          psql -U gamilit_user -d gamilit_platform -c "SELECT version();"
```

---

## 📚 Referencias

- **RFC-0001**: Estructura del monorepo GAMILIT
- **STATUS.md**: Estado actual de la migración
- **Backend .env.example**: Template de configuración backend
- **Deployment Scripts**: Documentación de deployment

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección **Troubleshooting** arriba
2. Verifica logs en `stderr` de los scripts
3. Ejecuta scripts con `bash -x` para debug:
   ```bash
   bash -x ./init-database.sh --env dev
   ```
4. Revisa issues conocidos en documentación del proyecto

---

**Versión:** 2.0
**Creado:** 2025-11-02
**Autor:** ATLAS-DATABASE
**Estado:** ✅ Producción Ready
