# Database - MVP Sistema Administración de Obra

**Stack:** PostgreSQL 15+ con PostGIS
**Versión:** 1.0.0
**Fecha:** 2025-11-20

---

## 📋 DESCRIPCIÓN

Base de datos del sistema de administración de obra e INFONAVIT.

**Schemas principales:**
- `auth_management` - Autenticación y usuarios
- `project_management` - Proyectos y estructura de obra
- `financial_management` - Presupuestos y control financiero
- `purchasing_management` - Compras e inventarios
- `construction_management` - Control de obra y avances
- `quality_management` - Calidad y postventa
- `infonavit_management` - Integración INFONAVIT

---

## 🏗️ ESTRUCTURA

```
ddl/
├── 00-init.sql                    # Inicialización + extensiones
└── schemas/                       # Schemas por contexto
    ├── auth_management/
    │   ├── tables/               # Tablas (01-users.sql, 02-roles.sql, ...)
    │   ├── functions/            # Funciones SQL
    │   ├── triggers/             # Triggers
    │   └── views/                # Vistas
    ├── project_management/
    │   └── ...
    └── [otros schemas]/

seeds/
├── dev/                          # Datos de desarrollo
└── prod/                         # Datos de producción inicial

migrations/                       # Migraciones versionadas
scripts/                          # Scripts de utilidad
```

---

## 🚀 SETUP INICIAL

### 1. Crear Base de Datos

```bash
# Ejecutar script de creación
cd scripts
./create-database.sh
```

### 2. Ejecutar DDL

```bash
# Ejecutar inicialización
psql $DATABASE_URL -f ddl/00-init.sql

# Ejecutar schemas (en orden)
psql $DATABASE_URL -f ddl/schemas/auth_management/tables/01-users.sql
# ... etc
```

### 3. Cargar Seeds (desarrollo)

```bash
psql $DATABASE_URL -f seeds/dev/01-users.sql
psql $DATABASE_URL -f seeds/dev/02-projects.sql
```

---

## 🔧 SCRIPTS DISPONIBLES

| Script | Descripción |
|--------|-------------|
| `create-database.sh` | Crea la base de datos desde cero |
| `reset-database.sh` | Elimina y recrea la base de datos |
| `run-migrations.sh` | Ejecuta migraciones pendientes |
| `backup-database.sh` | Crea backup de la base de datos |

---

## 📊 CONVENCIONES

### Nomenclatura

Seguir **ESTANDARES-NOMENCLATURA.md**:
- Schemas: `snake_case` + sufijo `_management`
- Tablas: `snake_case` plural
- Columnas: `snake_case` singular
- Índices: `idx_{tabla}_{columnas}`
- Foreign Keys: `fk_{origen}_to_{destino}`
- Constraints: `chk_{tabla}_{columna}`

### Estructura de Archivo DDL

```sql
-- ============================================================================
-- Tabla: nombre_tabla
-- Schema: nombre_schema
-- Descripción: [descripción]
-- Autor: Database-Agent
-- Fecha: YYYY-MM-DD
-- ============================================================================

DROP TABLE IF EXISTS schema.tabla CASCADE;

CREATE TABLE schema.tabla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- columnas...
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE schema.tabla IS '[descripción]';
COMMENT ON COLUMN schema.tabla.columna IS '[descripción]';

CREATE INDEX idx_tabla_columna ON schema.tabla(columna);
```

---

## 🔍 VALIDACIÓN

### Verificar Schemas

```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name LIKE '%_management';
```

### Verificar Tablas

```sql
SELECT table_schema, table_name,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_schema = t.table_schema
        AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema LIKE '%_management'
ORDER BY table_schema, table_name;
```

### Verificar Índices

```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname LIKE '%_management'
ORDER BY tablename;
```

---

## 📚 REFERENCIAS

- [DIRECTIVA-DISENO-BASE-DATOS.md](../../orchestration/directivas/DIRECTIVA-DISENO-BASE-DATOS.md)
- [ESTANDARES-NOMENCLATURA.md](../../orchestration/directivas/ESTANDARES-NOMENCLATURA.md)
- [MVP-APP.md](../../docs/00-overview/MVP-APP.md)

---

## 📝 VARIABLES DE ENTORNO

```bash
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=construccion_mvp
DB_USER=postgres
DB_PASSWORD=password
```

---

**Mantenido por:** Database-Agent
**Última actualización:** 2025-11-20
