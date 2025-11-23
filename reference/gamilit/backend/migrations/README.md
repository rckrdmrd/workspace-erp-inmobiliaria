# Migraciones de Base de Datos - Gamilit Backend

Este directorio contiene scripts de migración para correcciones críticas (P0) identificadas durante la migración del backend de Express a NestJS.

## Estructura de Archivos

```
migrations/
├── README.md                           # Este archivo
├── P0-000-pre-migration-backup.sh      # Script de backup pre-migración
├── P0-001-migrate-maya-rank-values.sql # Migración P0-1: MayaRank legacy → correcto
└── backups/                            # Directorio de backups (creado automáticamente)
```

---

## P0-001: Migración de MayaRank Legacy

### Problema Identificado

Durante la validación del código contra la documentación (2025-11-07), se identificó que la tabla `gamification_system.user_stats` contiene valores legacy incorrectos para el campo `current_rank`:

**Valores Legacy (INCORRECTOS)**:
- `NACOM`
- `BATAB`
- `HOLCATTE`
- `GUERRERO`
- `MERCENARIO`

**Valores Correctos (Jerarquía Maya Oficial)**:
1. `Ajaw` (Nivel 1: 0-999 XP) - Señor, líder supremo
2. `Nacom` (Nivel 2: 1,000-2,999 XP) - Capitán de guerra
3. `Ah K'in` (Nivel 3: 3,000-5,999 XP) - Sacerdote del sol
4. `Halach Uinic` (Nivel 4: 6,000-9,999 XP) - Hombre verdadero
5. `K'uk'ulkan` (Nivel 5: 10,000+ XP) - Serpiente emplumada

### Lógica de Migración

1. **Basada en XP**: Calcula el rango correcto según `total_xp` del usuario
2. **Preserva Progreso**: Recalcula `rank_progress` (0-100%) dentro del nuevo rango
3. **Idempotente**: Puede ejecutarse múltiples veces sin efectos adversos
4. **Safe**: Incluye validaciones y reportes antes/después

### Instrucciones de Ejecución

#### Paso 1: Crear Backup

```bash
# Configurar variables de entorno
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="gamilit_platform"
export DB_USER="gamilit_user"
export DB_PASSWORD="your_password_here"

# Ejecutar backup
chmod +x P0-000-pre-migration-backup.sh
./P0-000-pre-migration-backup.sh
```

Esto creará un backup en `backups/user_stats_backup_YYYYMMDD_HHMMSS.sql`.

#### Paso 2: Ejecutar Migración

```bash
# Opción A: Con psql directamente
psql -h localhost -p 5432 -U gamilit_user -d gamilit_platform -f P0-001-migrate-maya-rank-values.sql

# Opción B: Con PGPASSWORD
PGPASSWORD='your_password' psql -h localhost -p 5432 -U gamilit_user -d gamilit_platform -f P0-001-migrate-maya-rank-values.sql
```

#### Paso 3: Verificar Migración

La migración incluye validaciones automáticas que imprimirán:
- Cantidad de registros legacy antes de migración
- Cantidad de registros migrados
- Distribución de usuarios por rango
- Confirmación de éxito/errores

Verificaciones manuales adicionales:

```sql
-- 1. Verificar que no quedan valores legacy
SELECT COUNT(*)
FROM gamification_system.user_stats
WHERE current_rank IN ('NACOM', 'BATAB', 'HOLCATTE', 'GUERRERO', 'MERCENARIO');
-- Resultado esperado: 0

-- 2. Ver distribución de rangos
SELECT current_rank, COUNT(*) as usuarios
FROM gamification_system.user_stats
GROUP BY current_rank
ORDER BY
  CASE current_rank
    WHEN 'Ajaw' THEN 1
    WHEN 'Nacom' THEN 2
    WHEN 'Ah K''in' THEN 3
    WHEN 'Halach Uinic' THEN 4
    WHEN 'K''uk''ulkan' THEN 5
  END;

-- 3. Verificar que rank_progress está en rango 0-100
SELECT user_id, current_rank, rank_progress, total_xp
FROM gamification_system.user_stats
WHERE rank_progress < 0 OR rank_progress > 100;
-- Resultado esperado: 0 filas

-- 4. Verificar coherencia XP vs Rango
SELECT
  CASE
    WHEN total_xp < 1000 AND current_rank != 'Ajaw' THEN 'INCOHERENTE'
    WHEN total_xp >= 1000 AND total_xp < 3000 AND current_rank != 'Nacom' THEN 'INCOHERENTE'
    WHEN total_xp >= 3000 AND total_xp < 6000 AND current_rank != 'Ah K''in' THEN 'INCOHERENTE'
    WHEN total_xp >= 6000 AND total_xp < 10000 AND current_rank != 'Halach Uinic' THEN 'INCOHERENTE'
    WHEN total_xp >= 10000 AND current_rank != 'K''uk''ulkan' THEN 'INCOHERENTE'
    ELSE 'OK'
  END as validacion,
  COUNT(*) as cantidad
FROM gamification_system.user_stats
GROUP BY validacion;
-- Resultado esperado: Solo 'OK' con todas las filas
```

### Rollback

Si necesitas revertir la migración:

```bash
# Restaurar desde backup
psql -h localhost -p 5432 -U gamilit_user -d gamilit_platform < backups/user_stats_backup_YYYYMMDD_HHMMSS.sql
```

**NOTA**: El rollback completo requiere:
1. Eliminar todos los registros actuales
2. Restaurar desde backup
3. No hay forma de "deshacer" solo la migración sin afectar cambios posteriores

---

## Funciones Helper Creadas

La migración crea dos funciones helper que se mantienen en la base de datos para uso futuro:

### `gamification_system.calculate_maya_rank_from_xp(xp INTEGER)`

Calcula el rango maya correcto basándose en XP total.

**Uso**:
```sql
SELECT gamification_system.calculate_maya_rank_from_xp(5000);
-- Resultado: 'Ah K'in'
```

### `gamification_system.calculate_rank_progress(xp INTEGER, rank TEXT)`

Calcula el progreso (0-100%) dentro de un rango específico.

**Uso**:
```sql
SELECT gamification_system.calculate_rank_progress(1500, 'Nacom');
-- Resultado: 25.00 (1500 XP = 25% de camino de Nacom a Ah K'in)
```

Estas funciones pueden usarse en:
- Triggers para auto-actualizar rangos al ganar XP
- Queries de leaderboard
- APIs de progreso de usuario

---

## Actualizaciones de Código Relacionadas

### Backend NestJS

**`src/shared/constants/enums.constants.ts`**:
```typescript
export enum MayaRank {
  AJAW = 'Ajaw',                    // Nivel 1
  NACOM = 'Nacom',                  // Nivel 2
  AH_KIN = 'Ah K\'in',              // Nivel 3
  HALACH_UINIC = 'Halach Uinic',    // Nivel 4
  KUKUKULKAN = 'K\'uk\'ulkan',      // Nivel 5
}
```

**Enum DEPRECATED (no usar)**:
```typescript
// @deprecated - Legacy values, will be removed in v2.0
export enum MayaRankEnum {
  NACOM = 'nacom',
  BATAB = 'batab',
  // ...
}
```

### DDL Actualizado (opcional)

Si la tabla usa un ENUM de PostgreSQL en lugar de TEXT:

```sql
DROP TYPE IF EXISTS maya_rank CASCADE;

CREATE TYPE maya_rank AS ENUM (
  'Ajaw',
  'Nacom',
  'Ah K''in',
  'Halach Uinic',
  'K''uk''ulkan'
);

-- Si la columna usa ENUM, alterar la tabla:
ALTER TABLE gamification_system.user_stats
  ALTER COLUMN current_rank TYPE maya_rank USING current_rank::maya_rank;
```

---

## Troubleshooting

### Error: "password authentication failed"
- Verificar que `DB_PASSWORD` esté configurado correctamente
- Verificar que el usuario tenga permisos en la base de datos

### Error: "relation does not exist"
- Verificar que el schema `gamification_system` existe
- Verificar que la tabla `user_stats` existe

### Error: "column rank_progress does not exist"
- La estructura de la tabla no coincide con la esperada
- Verificar DDL de `user_stats`

### Migración completada pero quedan valores legacy
- Revisar los mensajes de error en el output
- Verificar que la función `calculate_maya_rank_from_xp` se creó correctamente
- Ejecutar manualmente las queries de validación

---

## Referencias

- **Issue**: Discrepancia P0-3 - Reporte Final Fase 1
- **Documentación**: `/docs/02-especificaciones-tecnicas/apis/gamificacion-api/01-RANGOS-MAYA.md`
- **ADR**: (pendiente - ADR sobre sistema de rangos)
- **Fecha de Creación**: 2025-11-07
- **Autor**: Claude Code (Sonnet 4.5)
