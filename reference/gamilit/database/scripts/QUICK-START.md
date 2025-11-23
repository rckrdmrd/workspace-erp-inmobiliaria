# 🚀 GUÍA RÁPIDA - Scripts de Base de Datos GAMILIT

**Actualizado:** 2025-11-08
**Versión:** 3.0

---

## ⚡ Inicio Rápido

### Para Desarrollo (Primera Vez)

```bash
cd /home/isem/workspace/workspace-gamilit/gamilit/projects/gamilit/apps/database/scripts

# Inicializar BD completa (crea usuario + BD + DDL + seeds)
./init-database.sh --env dev --force
```

### Para Producción (Primera Vez)

```bash
# Con dotenv-vault (RECOMENDADO)
./manage-secrets.sh generate --env prod
./manage-secrets.sh sync --env prod
./init-database.sh --env prod

# O con password manual
./init-database.sh --env prod --password "tu_password_seguro_32chars"
```

---

## 📋 Scripts Disponibles (3 principales)

### 1. `init-database.sh` - Inicialización Completa ⭐

**¿Cuándo usar?** Primera vez, o cuando el usuario NO existe

```bash
./init-database.sh --env dev              # Desarrollo
./init-database.sh --env prod             # Producción
./init-database.sh --env dev --force      # Sin confirmación
```

**¿Qué hace?**
- ✅ Crea usuario `gamilit_user` (si no existe)
- ✅ Genera password seguro de 32 caracteres
- ✅ Crea base de datos `gamilit_platform`
- ✅ Ejecuta DDL (13 schemas, 61 tablas, 61 funciones, 288 índices, 114 RLS policies)
- ✅ Carga seeds del ambiente
- ✅ Actualiza archivos .env automáticamente

---

### 2. `reset-database.sh` - Reset Rápido (Mantiene Usuario)

**¿Cuándo usar?** Usuario ya existe, solo quieres resetear datos

```bash
./reset-database.sh --env dev --password "password_existente"
./reset-database.sh --env prod --password "prod_pass"
```

**¿Qué hace?**
- ⚠️ Elimina la BD `gamilit_platform`
- ✅ Mantiene el usuario `gamilit_user` (NO cambia password)
- ✅ Recrea BD con DDL y seeds
- ℹ️ NO actualiza .env (credenciales no cambian)

---

### 3. `recreate-database.sh` - Recreación Completa (DESTRUYE TODO)

**¿Cuándo usar?** Cuando quieres empezar desde cero COMPLETAMENTE

⚠️ **ADVERTENCIA: ELIMINA USUARIO Y TODOS LOS DATOS**

```bash
./recreate-database.sh --env dev
./recreate-database.sh --env prod        # Requiere confirmación adicional
```

**¿Qué hace?**
- ⚠️ Termina todas las conexiones
- ⚠️ Elimina completamente la BD
- ⚠️ Elimina el usuario
- ✅ Ejecuta `init-database.sh` para recrear todo
- ✅ Actualiza archivos .env automáticamente

---

## 🎯 Casos de Uso Comunes

### Caso 1: Primera vez en proyecto (Setup inicial)

```bash
./init-database.sh --env dev --force
```

### Caso 2: Resetear datos pero mantener usuario

```bash
# Si conoces el password
./reset-database.sh --env dev --password "mi_password"

# Si no conoces el password, usa recreate
./recreate-database.sh --env dev
```

### Caso 3: Actualizar estructura de BD (nueva migración)

```bash
# Opción A: Reset rápido (si tienes password)
./reset-database.sh --env dev --password "password"

# Opción B: Recrear completo (genera nuevo password)
./recreate-database.sh --env dev
```

### Caso 4: Aplicar cambios de DDL

```bash
# Si solo cambiaron DDL/seeds (sin cambios de usuario)
./reset-database.sh --env dev --password "password_actual"
```

### Caso 5: Olvidé el password del usuario

```bash
# Única opción: recrear todo
./recreate-database.sh --env dev
```

---

## 📊 Comparación Rápida

| Acción | init-database.sh | reset-database.sh | recreate-database.sh |
|--------|------------------|-------------------|----------------------|
| **Elimina usuario** | ❌ | ❌ | ✅ |
| **Elimina BD** | ⚠️ Si existe | ✅ | ✅ |
| **Crea usuario** | ✅ Si no existe | ❌ | ✅ |
| **Genera password** | ✅ | ❌ | ✅ |
| **Requiere password** | ❌ | ✅ | ❌ |
| **Actualiza .env** | ✅ | ❌ | ✅ |
| **Tiempo aprox** | 30-60s | 20-30s | 40-70s |

---

## 🔑 Gestión de Credenciales

### ¿Dónde están las credenciales?

Después de ejecutar `init-database.sh` o `recreate-database.sh`:

```
apps/database/database-credentials-{env}.txt  ← Credenciales guardadas aquí
```

Ejemplo de contenido:
```
Database Host: localhost
Database Port: 5432
Database Name: gamilit_platform
Database User: gamilit_user
Database Password: xB9k2mN...Zp8Q
Connection String: postgresql://gamilit_user:xB9k2mN...@localhost:5432/gamilit_platform
```

### Archivos .env actualizados automáticamente

- `apps/backend/.env.{env}`
- `apps/database/.env.{env}`
- `../../gamilit-deployment-scripts/.env.{env}` (si existe)

---

## ⚠️ Advertencias de Seguridad

### Desarrollo

- ✅ OK usar `--force` para automatización
- ✅ OK regenerar passwords
- ✅ OK recrear BD frecuentemente

### Producción

- ⚠️ NUNCA usar `--force` sin validación
- ⚠️ SIEMPRE hacer backup antes de `recreate-database.sh`
- ⚠️ Confirmar que tienes backup antes de eliminar
- ✅ Usar dotenv-vault para gestión de secrets

---

## 🐛 Troubleshooting

### Error: "No se puede conectar a PostgreSQL"

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# O verificar proceso
ps aux | grep postgres

# Iniciar si está detenido
sudo systemctl start postgresql
```

### Error: "Usuario ya existe"

```bash
# Opción A: Usar reset (si conoces password)
./reset-database.sh --env dev --password "password_existente"

# Opción B: Recrear todo
./recreate-database.sh --env dev
```

### Error: "Base de datos no se puede eliminar (conexiones activas)"

```bash
# El script ya maneja esto, pero si falla:
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='gamilit_platform';"
```

### Error: "Permisos denegados"

```bash
# Dar permisos de ejecución
chmod +x *.sh

# Verificar permisos de PostgreSQL
sudo -u postgres psql -c "SELECT version();"
```

---

## 📁 Estructura de Archivos

```
scripts/
├── init-database.sh          ⭐ Script principal (v3.0)
├── reset-database.sh         🔄 Reset rápido
├── recreate-database.sh      ⚠️  Recreación completa
├── manage-secrets.sh         🔐 Gestión de secrets
├── update-env-files.sh       🔧 Sincronización .env
├── cleanup-duplicados.sh     🧹 Limpieza
├── QUICK-START.md            📖 Esta guía
├── README.md                 📚 Documentación completa
├── deprecated/               📦 Scripts antiguos
│   ├── init-database-v1.sh
│   ├── init-database-v2.sh
│   └── init-database.sh.backup-*
├── config/                   ⚙️  Configuraciones
│   ├── dev.conf
│   └── prod.conf
├── inventory/                📊 Scripts de inventario
└── utilities/                🛠️  Utilidades
```

---

## 🎓 Flujo Recomendado para Nuevos Desarrolladores

### Día 1 - Setup Inicial

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd gamilit/projects/gamilit/apps/database/scripts

# 2. Inicializar BD
./init-database.sh --env dev --force

# 3. Verificar credenciales
cat ../database-credentials-dev.txt

# 4. ¡Listo! Backend puede conectarse
```

### Día a Día - Desarrollo

```bash
# Aplicar cambios de DDL
./reset-database.sh --env dev --password "$(grep 'Database Password' ../database-credentials-dev.txt | cut -d: -f2 | xargs)"

# O más simple: recrear todo
./recreate-database.sh --env dev --force
```

---

## ✅ Checklist Pre-Deployment Producción

- [ ] Backup completo de BD actual
- [ ] Verificar que `manage-secrets.sh` tiene secrets generados
- [ ] Probar script en staging primero
- [ ] Tener plan de rollback
- [ ] Notificar al equipo del deployment
- [ ] Ejecutar con --env prod (SIN --force)
- [ ] Validar conexiones post-deployment
- [ ] Verificar que seeds de producción se cargaron

---

## 📞 Soporte

- **Documentación completa:** `README.md`
- **Scripts de inventario:** `inventory/`
- **Logs:** Revisa output del script (se muestra en consola)

---

**Última actualización:** 2025-11-08
**Versión de scripts:** 3.0
**Mantenido por:** Equipo de Base de Datos GAMILIT
