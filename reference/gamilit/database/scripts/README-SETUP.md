# Scripts de Base de Datos GAMILIT

Scripts para gestionar la base de datos `gamilit_platform` en ambientes dev y prod.

---

## 📦 Scripts Disponibles

### 1. `init-database.sh` - Inicialización Completa

**Crea usuario + BD + DDL + seeds**

```bash
# Modo interactivo
./init-database.sh

# Desarrollo
./init-database.sh --env dev

# Producción
./init-database.sh --env prod

# Con password personalizado
./init-database.sh --env dev --password "mi_password_seguro"

# Sin confirmación
./init-database.sh --env dev --force
```

**¿Qué hace?**
- ✅ Crea usuario `gamilit_user` (si no existe)
- ✅ Crea base de datos `gamilit_platform`
- ✅ Ejecuta todos los DDL (9 schemas, ~48 tablas)
- ✅ Carga 32 archivos de seeds (10,525 líneas SQL)
- ✅ Valida instalación
- ✅ Guarda credenciales en archivo

**Resultado:** Base de datos funcional al 100%

---

### 2. `recreate-database.sh` - Recreación Completa

**Elimina usuario + BD, luego recrea todo**

⚠️ **DESTRUYE TODOS LOS DATOS Y ELIMINA USUARIO**

```bash
# Modo interactivo
./recreate-database.sh

# Desarrollo
./recreate-database.sh --env dev

# Sin confirmación (peligroso)
./recreate-database.sh --env dev --force
```

**¿Qué hace?**
- ⚠️ Termina conexiones activas
- ⚠️ Elimina completamente la BD `gamilit_platform`
- ⚠️ Elimina el usuario `gamilit_user`
- ✅ Ejecuta `init-database.sh` para recrear todo

**Cuándo usar:**
- Desarrollo y testing
- Resolver conflictos graves de migración
- Resetear COMPLETAMENTE el ambiente
- **NO usar en producción con datos reales**

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
- ⚠️ Elimina la BD `gamilit_platform`
- ✅ Mantiene el usuario `gamilit_user`
- ✅ Recrea BD con DDL y seeds

**Cuándo usar:**
- Usuario ya existe con password conocido
- Resetear datos sin tocar configuración de usuario
- Ambientes donde el usuario tiene permisos específicos
- Cuando NO quieres regenerar password

---

## 🚀 Guía Rápida

### Primera Instalación

```bash
cd /apps/database/scripts

# Crear todo desde cero
./init-database.sh --env dev

# Ver credenciales generadas
cat ../database-credentials-dev.txt
```

### Resetear Durante Desarrollo

```bash
# Opción 1: Recrear TODO (incluyendo usuario)
./recreate-database.sh --env dev --force

# Opción 2: Solo resetear BD (mantener usuario)
./reset-database.sh --env dev --password "tu_password" --force
```

### Producción

```bash
# Primera vez
./init-database.sh --env prod

# Reset (si es necesario, con precaución)
./reset-database.sh --env prod --password "prod_password"
```

---

## 📊 Comparación de Scripts

| Script | Elimina Usuario | Elimina BD | Crea Usuario | Crea BD | Requiere Password |
|--------|----------------|------------|--------------|---------|-------------------|
| `init-database.sh` | ❌ | ⚠️ Si existe | ✅ Si no existe | ✅ | ❌ (genera automático) |
| `recreate-database.sh` | ✅ | ✅ | ✅ | ✅ | ❌ (genera automático) |
| `reset-database.sh` | ❌ | ✅ | ❌ | ✅ | ✅ (requerido) |

---

## 🎯 Casos de Uso

### Caso 1: Primera Instalación en Servidor Nuevo

```bash
./init-database.sh --env prod
```

- No hay usuario ni BD
- Script crea todo desde cero
- Genera credenciales seguras

### Caso 2: Desarrollo - Resetear con Cambios en DDL

```bash
./recreate-database.sh --env dev --force
```

- Elimina todo y recrea
- Útil cuando hay cambios estructurales
- No importa perder el usuario/password

### Caso 3: Producción - Resetear Solo Datos

```bash
./reset-database.sh --env prod --password "password_conocido"
```

- Mantiene usuario con permisos configurados
- Solo resetea datos
- No regenera credenciales

### Caso 4: Testing - Datos Limpios Cada Test

```bash
# En script de CI/CD
./recreate-database.sh --env dev --force
# O
./reset-database.sh --env dev --password "$DB_PASSWORD" --force
```

---

## 📁 Archivos Generados

Después de ejecutar los scripts:

### `database-credentials-{env}.txt`

```
GAMILIT Platform - Database Credentials
Environment: dev
Generated: 2025-11-02
========================================

Host:     localhost:5432
Database: gamilit_platform
User:     gamilit_user
Password: AbCdEf123456...

Connection String:
postgresql://gamilit_user:AbCdEf123456...@localhost:5432/gamilit_platform
```

**Ubicación:** `/apps/database/database-credentials-{env}.txt`

---

## ⚙️ Variables de Entorno

Los scripts usan estas configuraciones:

```bash
DB_NAME="gamilit_platform"     # Nombre fijo de la BD
DB_USER="gamilit_user"         # Usuario fijo
DB_HOST="localhost"             # Host por defecto
DB_PORT="5432"                  # Puerto por defecto
POSTGRES_USER="postgres"        # Usuario admin de PostgreSQL
```

Para cambiar estos valores, edita los scripts.

---

## 🔧 Prerequisitos

### Software Requerido

```bash
# PostgreSQL 14+
postgres --version

# psql client
psql --version

# openssl (para generar passwords)
openssl version

# Permisos: sudo para postgres O password del usuario postgres
sudo -u postgres psql -c "SELECT 1"
```

### Estructura Requerida

Los scripts asumen esta estructura:

```
/apps/database/
├── ddl/
│   └── schemas/
│       ├── auth/tables/
│       ├── auth_management/tables/
│       ├── gamification_system/enums/
│       ├── gamification_system/tables/
│       └── ... (9 schemas total)
└── seeds/
    └── dev/
        ├── auth/
        ├── auth_management/
        ├── gamification_system/
        └── ... (9 schemas total, 32 archivos SQL)
```

---

## 🐛 Troubleshooting

### Error: "No se puede conectar a PostgreSQL"

```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql
sudo systemctl start postgresql

# Probar conexión
sudo -u postgres psql -c "SELECT 1"
```

### Error: "Usuario gamilit_user no existe" (en reset-database.sh)

```bash
# Usar init-database.sh primero para crear el usuario
./init-database.sh --env dev
```

### Error: "Password incorrecto" (en reset-database.sh)

```bash
# Ver password guardado
cat ../database-credentials-dev.txt

# O usar recreate-database.sh que no requiere password
./recreate-database.sh --env dev
```

### Error: "Directorio DDL no encontrado"

```bash
# Verificar estructura
ls -la /apps/database/ddl/schemas/
ls -la /apps/database/seeds/dev/

# Asegurarse de estar en el directorio correcto
cd /path/to/gamilit/apps/database/scripts
pwd  # Debe terminar en /apps/database/scripts
```

---

## 📊 Validación Post-Ejecución

Después de ejecutar cualquier script:

```bash
# Conectar a la BD (usa el password del archivo de credenciales)
PGPASSWORD='tu_password' psql -h localhost -U gamilit_user -d gamilit_platform

# Verificar schemas (debe mostrar 9)
\dn

# Contar tablas
SELECT schemaname, COUNT(*)
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
GROUP BY schemaname;

# Verificar datos
SELECT 'users', COUNT(*) FROM auth.users WHERE deleted_at IS NULL
UNION ALL SELECT 'modules', COUNT(*) FROM educational_content.modules
UNION ALL SELECT 'exercises', COUNT(*) FROM educational_content.exercises;

# Salir
\q
```

**Valores esperados:**
- Schemas: 9
- Tablas: ~48
- Usuarios: 5
- Módulos: 8
- Ejercicios: 27

---

## 🔒 Seguridad

### Passwords Generados

Los scripts `init-database.sh` y `recreate-database.sh` generan passwords automáticamente:

```bash
openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
```

- 32 caracteres alfanuméricos
- Sin caracteres especiales problemáticos
- Criptográficamente seguros

### Archivos de Credenciales

- Permisos: `600` (solo lectura por owner)
- **NO commitear a git**
- Guardar en gestor de contraseñas seguro

---

## 📚 Más Información

- **DDL Source:** `/apps/database/ddl/`
- **Seeds Source:** `/apps/database/seeds/dev/`
- **DB Docs:** `/docs/03-desarrollo/base-de-datos/README.md`

---

## 💡 Tips

### Desarrollo Rápido

```bash
# Alias útiles (agregar a ~/.bashrc)
alias db-init='cd /apps/database/scripts && ./init-database.sh --env dev --force'
alias db-reset='cd /apps/database/scripts && ./recreate-database.sh --env dev --force'
alias db-connect='PGPASSWORD=$(grep DB_PASSWORD ../database-credentials-dev.txt | cut -d" " -f2) psql -h localhost -U gamilit_user -d gamilit_platform'
```

### Automatización CI/CD

```bash
# En pipeline de CI/CD
cd /apps/database/scripts

# Setup limpio para cada test
./recreate-database.sh --env dev --force

# Ejecutar tests...

# Teardown (opcional)
sudo -u postgres psql -c "DROP DATABASE IF EXISTS gamilit_platform;"
```

### Backup Antes de Reset

```bash
# Hacer backup antes de recrear
PGPASSWORD='password' pg_dump -h localhost -U gamilit_user gamilit_platform > backup.sql

# Recrear
./recreate-database.sh --env dev

# Si algo falla, restaurar
PGPASSWORD='password' psql -h localhost -U gamilit_user -d gamilit_platform < backup.sql
```

---

**Versión:** 1.0.0
**Última actualización:** 2025-11-02
**Base de datos:** gamilit_platform
**Schemas:** 9
**Tablas:** ~48
**Seeds:** 32 archivos (10,525 líneas SQL)
