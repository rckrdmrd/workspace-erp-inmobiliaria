# US-ADM-006: Gestionar Backups y Restauración

**ID:** US-ADM-006  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-005, ET-ADM-004  
**Prioridad:** Crítica  
**Story Points:** 8

---

## 📖 Historia de Usuario

**Como** Director General o Administrador de Sistemas  
**Quiero** gestionar backups automáticos y poder restaurar el sistema cuando sea necesario  
**Para** garantizar la continuidad del negocio y cumplir con los RTO/RPO definidos

---

## ✅ Criterios de Aceptación

### 1. Ver Lista de Backups

```gherkin
Given que soy Director o SysAdmin
When accedo a "Administración > Backups"
Then debo ver una tabla con todos los backups con:
  - Fecha y hora de creación
  - Tipo (Full, Incremental, Files, Snapshot)
  - Tamaño (GB)
  - Estado (Completado, En Progreso, Fallido)
  - Verificado (✓/✗)
  - Ubicación (Local, S3)
  - Expira en (días restantes)
  - Acciones: Descargar, Restaurar, Verificar, Eliminar
And ordenados por fecha descendente
```

### 2. Crear Backup Manual

```gherkin
Given que necesito un backup inmediato antes de un cambio crítico
When hago clic en "Crear Backup Manual"
And selecciono tipo: "Full"
And confirmo la acción
Then el sistema debe:
  - Iniciar el proceso de backup inmediatamente
  - Mostrar progreso en tiempo real (%)
  - Ejecutar pg_dump de la base de datos
  - Calcular checksum SHA-256
  - Subir a S3 con encriptación AES-256
  - Actualizar estado a "Completado"
  - Enviar notificación de éxito
  - Estimar tiempo de finalización
```

### 3. Backups Automáticos Programados

```gherkin
Given que el sistema está en producción
Then deben ejecutarse automáticamente:
  - Backup Full: Diario a las 3:00 AM
  - Backup Incremental: Cada 6 horas
  - Snapshot de archivos: Cada 12 horas
And si alguno falla:
  - Reintentar automáticamente 3 veces
  - Enviar alerta crítica por email + SMS
  - Registrar en audit log con severidad "crítica"
```

### 4. Monitoreo de Progreso en Tiempo Real

```gherkin
Given que un backup está en progreso
When estoy en la página de Backups
Then debo ver:
  - Barra de progreso animada
  - Porcentaje completado (actualizado cada 5 segundos)
  - Tiempo transcurrido
  - Tiempo estimado restante
  - Etapa actual: "Exportando base de datos...", "Calculando checksum...", "Subiendo a S3..."
```

### 5. Restaurar desde Backup

```gherkin
Given que necesito restaurar el sistema a un punto anterior
When selecciono un backup verificado
And hago clic en "Restaurar"
Then el sistema debe mostrar:
  - ⚠️ Advertencia crítica: "Esta acción detendrá el sistema"
  - Confirmación con checkbox: "Entiendo que se perderán cambios posteriores"
  - Input para escribir: "RESTAURAR" (para confirmar)
When confirmo
Then el sistema debe:
  - Validar checksum del backup antes de restaurar
  - Detener la aplicación (modo mantenimiento)
  - Crear un backup de seguridad pre-restauración
  - Ejecutar pg_restore
  - Reiniciar aplicación
  - Enviar notificación de restauración exitosa
  - Registrar en audit log
```

### 6. Verificación de Integridad

```gherkin
Given que un backup fue creado hace 3 días
When hago clic en "Verificar Integridad"
Then el sistema debe:
  - Descargar backup desde S3 (si no está local)
  - Recalcular checksum
  - Comparar con checksum original
  - Crear base de datos temporal: "backup_test_[uuid]"
  - Ejecutar pg_restore en DB temporal
  - Ejecutar queries de validación básica
  - Eliminar DB temporal
  - Marcar backup como "Verificado" con timestamp
  - Mostrar resultado: ✅ "Backup íntegro y restaurable"
```

### 7. Prueba de Restauración Automática

```gherkin
Given que es el primer domingo de cada mes a las 2:00 AM
When se ejecuta el cron de prueba de restauración
Then el sistema debe:
  - Seleccionar el backup más reciente
  - Crear DB temporal
  - Restaurar en DB temporal
  - Validar integridad de datos
  - Enviar reporte por email:
    - ✅ Backup restaurado exitosamente
    - Tiempo de restauración: 12 minutos
    - Registros validados: 150,000
    - Estado: APTO PARA PRODUCCIÓN
  - Eliminar DB temporal
```

### 8. Estrategia 3-2-1

```gherkin
Given que se completa un backup
Then el sistema debe mantener:
  - 3 copias:
    - 1 en disco local (/backups/)
    - 1 en S3 región primaria (us-east-1)
    - 1 en S3 región secundaria (us-west-2) via replicación
  - 2 tipos de medios:
    - Disco (local)
    - Cloud (S3)
  - 1 copia offsite:
    - S3 fuera del datacenter principal
And validar que las 3 copias existen
```

### 9. Retención Automática

```gherkin
Given que existen backups con diferentes antigüedades
Then el sistema debe mantener:
  - Backups diarios: Últimos 7 días
  - Backups semanales: Últimas 4 semanas
  - Backups mensuales: Últimos 12 meses
  - Backups anuales: Últimos 3 años
And eliminar automáticamente los que excedan retención
And enviar notificación antes de eliminar backups antiguos
```

### 10. Dashboard de Salud de Backups

```gherkin
Given que accedo al Dashboard de Backups
Then debo ver widgets con:
  - Estado del último backup (✅/❌)
  - Próximo backup programado (countdown)
  - Tasa de éxito (últimos 30 días)
  - Espacio usado (local + S3)
  - Gráfico de tamaño de backups (tendencia)
  - Backups sin verificar (alerta si >3)
  - RTO estimado (basado en última restauración)
  - RPO actual (<1 hora)
```

---

## 🎨 Mockup / Wireframe

### Lista de Backups

```
┌─────────────────────────────────────────────────────────────────┐
│ Gestión de Backups                  [Crear Backup] [⚙️ Config] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📊 Dashboard                                                    │
│ ┌────────────┬────────────┬────────────┬─────────────────────┐ │
│ │ Último     │ Próximo en │ Tasa Éxito │ Espacio Usado       │ │
│ │ ✅ Exitoso │ 2h 15m     │ 98.5%      │ 450 GB (Local)      │ │
│ │ Hace 4h    │            │ (30 días)  │ 1.2 TB (S3)         │ │
│ └────────────┴────────────┴────────────┴─────────────────────┘ │
│                                                                 │
│ Fecha/Hora          Tipo          Tamaño    Estado    Verificado│
│ ─────────────────────────────────────────────────────────────── │
│ 20 Nov 03:00        Full          12.5 GB   ✅        ✓         │
│                                             [↓][🔄][❌]          │
│                                                                 │
│ 19 Nov 21:00        Incremental    2.3 GB   ✅        ✓         │
│                                             [↓][🔄][❌]          │
│                                                                 │
│ 19 Nov 15:00        Incremental    1.8 GB   ✅        ✗         │
│                                     [Verificar] [↓][🔄][❌]      │
│                                                                 │
│ 19 Nov 03:00        Full          12.1 GB   ✅        ✓         │
│                                             [↓][🔄][❌]          │
│                                                                 │
│ 18 Nov 15:00        Incremental    ⏳ En progreso...           │
│                     ████████████░░░░░░░░░░ 60%                 │
│                     Subiendo a S3... 8 min restantes            │
│                                                                 │
│ 18 Nov 03:00        Full          ❌ FALLIDO                    │
│                     Error: Insufficient disk space              │
│                                             [🔄 Reintentar]     │
└─────────────────────────────────────────────────────────────────┘
```

### Modal Crear Backup Manual

```
┌─────────────────────────────────────────────┐
│ Crear Backup Manual                       [X]│
├─────────────────────────────────────────────┤
│                                             │
│ ⚠️ Esta operación puede afectar el          │
│    rendimiento del sistema temporalmente    │
│                                             │
│ Tipo de Backup *                            │
│ ◉ Full (Base de datos completa)             │
│ ○ Incremental (Solo cambios)                │
│ ○ Files (Archivos y documentos)             │
│                                             │
│ Tamaño estimado: ~12 GB                     │
│ Tiempo estimado: ~15 minutos                │
│                                             │
│ ☑️ Subir a S3                               │
│ ☑️ Calcular checksum                        │
│ ☑️ Notificar al completar                   │
│                                             │
│ Etiqueta (opcional)                         │
│ ┌─────────────────────────────────────────┐ │
│ │ Pre-migration-v2.5                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│        [Cancelar]  [Iniciar Backup]         │
└─────────────────────────────────────────────┘
```

### Modal Restaurar Backup

```
┌─────────────────────────────────────────────┐
│ ⚠️ RESTAURAR BACKUP - ACCIÓN CRÍTICA      [X]│
├─────────────────────────────────────────────┤
│                                             │
│ 🚨 ADVERTENCIA IMPORTANTE:                  │
│                                             │
│ • Esta acción DETENDRÁ el sistema           │
│ • Se perderán todos los cambios posteriores │
│   al backup seleccionado                    │
│ • Usuarios serán desconectados              │
│ • Tiempo estimado de downtime: 15-30 min    │
│                                             │
│ ─────────────────────────────────────────── │
│                                             │
│ Backup Seleccionado:                        │
│ • Fecha: 19 Nov 2025, 03:00 AM              │
│ • Tipo: Full                                │
│ • Tamaño: 12.1 GB                           │
│ • Verificado: ✅ Sí (18 Nov)                │
│ • Checksum: ✅ Válido                       │
│                                             │
│ ☑️ Entiendo que se perderán cambios desde   │
│    el 19 Nov 03:00 hasta ahora              │
│                                             │
│ ☑️ He notificado al equipo del downtime     │
│                                             │
│ Para confirmar, escribe: RESTAURAR          │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│        [Cancelar]  [RESTAURAR AHORA]        │
│                      (deshabilitado)        │
└─────────────────────────────────────────────┘
```

### Modal Progreso de Restauración

```
┌─────────────────────────────────────────────┐
│ Restauración en Progreso...            [📊] │
├─────────────────────────────────────────────┤
│                                             │
│       🔄 SISTEMA EN MODO MANTENIMIENTO      │
│                                             │
│ Progreso Global:                            │
│ ████████████████░░░░░░░░░░░░░░░░ 65%       │
│                                             │
│ Etapa Actual:                               │
│ ✅ 1. Backup de seguridad creado            │
│ ✅ 2. Aplicación detenida                   │
│ ✅ 3. Validación de checksum                │
│ 🔄 4. Restaurando base de datos...          │
│    ████████████████░░░░░░░░░░ 80%          │
│ ⏳ 5. Reiniciar aplicación                  │
│ ⏳ 6. Validar integridad                    │
│                                             │
│ Tiempo transcurrido: 12 minutos             │
│ Tiempo estimado restante: 6 minutos         │
│                                             │
│ 📝 Log en tiempo real:                      │
│ [03:15:22] Extrayendo tablas...             │
│ [03:15:45] Restaurando índices...           │
│ [03:16:10] Aplicando constraints...         │
│                                             │
│                    [Cancelar Restauración]  │
│                  (solo primeros 2 minutos)  │
└─────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Crear Backup Manual Exitoso

**Precondiciones:**
- Sistema en estado normal
- Espacio suficiente en disco

**Pasos:**
1. Ir a "Backups"
2. Clic "Crear Backup Manual"
3. Seleccionar "Full"
4. Confirmar

**Resultado Esperado:**
- ✅ Backup inicia inmediatamente
- ✅ Progreso visible en tiempo real
- ✅ Estado cambia a "Completado" al finalizar
- ✅ Archivo .dump creado en /backups/
- ✅ Subido a S3 con encriptación
- ✅ Checksum calculado y almacenado
- ✅ Email de confirmación enviado

### CP-002: Backup Automático Diario

**Precondiciones:**
- Cron configurado para 3:00 AM

**Pasos:**
1. Esperar a las 3:00 AM
2. Verificar ejecución

**Resultado Esperado:**
- ✅ Backup ejecuta automáticamente
- ✅ Tipo "Full" creado
- ✅ Sin intervención manual
- ✅ Notificación enviada al completar

### CP-003: Restaurar desde Backup

**Precondiciones:**
- Backup verificado disponible

**Pasos:**
1. Seleccionar backup del 19 Nov
2. Clic "Restaurar"
3. Aceptar advertencias
4. Escribir "RESTAURAR"
5. Confirmar

**Resultado Esperado:**
- ✅ Sistema entra en modo mantenimiento
- ✅ Backup de seguridad creado antes de restaurar
- ✅ Checksum validado
- ✅ pg_restore ejecuta correctamente
- ✅ Aplicación reinicia
- ✅ Datos restaurados al 19 Nov
- ✅ Email de confirmación enviado
- ✅ Tiempo total <30 minutos

### CP-004: Verificar Integridad de Backup

**Precondiciones:**
- Backup de 3 días de antigüedad sin verificar

**Pasos:**
1. Clic "Verificar Integridad" en el backup
2. Esperar proceso

**Resultado Esperado:**
- ✅ Checksum recalculado y validado
- ✅ DB temporal creada
- ✅ Restore exitoso en DB temporal
- ✅ Queries de validación ejecutadas
- ✅ DB temporal eliminada
- ✅ Backup marcado con ✓ "Verificado"
- ✅ Timestamp de verificación actualizado

### CP-005: Backup Falla por Espacio Insuficiente

**Precondiciones:**
- Disco casi lleno

**Pasos:**
1. Intentar crear backup manual

**Resultado Esperado:**
- ✅ Backup falla con error claro
- ✅ Estado: "FALLIDO"
- ✅ Error message: "Insufficient disk space"
- ✅ Alerta crítica enviada por email + SMS
- ✅ Audit log registra fallo con severidad "crítica"
- ✅ No se crea archivo corrupto

### CP-006: Retención Automática

**Precondiciones:**
- Backup de hace 8 días (retención = 7 días)

**Pasos:**
1. Cron de limpieza ejecuta

**Resultado Esperado:**
- ✅ Backup eliminado automáticamente
- ✅ Archivo local eliminado
- ✅ Objeto S3 eliminado
- ✅ Registro en audit log
- ✅ Email de notificación enviado

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-004: Tabla `backup_records` implementada
- ET-ADM-004: BackupService con cron jobs
- pg_dump y pg_restore instalados
- AWS S3 bucket configurado con permisos
- Espacio en disco adecuado

**APIs Necesarias:**
- `GET /api/admin/backups` - Lista de backups
- `POST /api/admin/backups` - Crear backup manual
- `POST /api/admin/backups/:id/restore` - Restaurar
- `POST /api/admin/backups/:id/verify` - Verificar integridad
- `DELETE /api/admin/backups/:id` - Eliminar
- `GET /api/admin/backups/dashboard` - Estadísticas

---

## 📊 Métricas de Éxito

- **RTO (Recovery Time Objective):** <4 horas
- **RPO (Recovery Point Objective):** <1 hora
- **Tasa de éxito de backups:** >99%
- **Tiempo de backup full:** <30 minutos
- **Tiempo de restauración:** <30 minutos
- **Backups verificados:** 100% mensualmente

---

## 🔒 Consideraciones de Seguridad

1. **Encriptación:** Todos los backups en S3 con AES-256
2. **Acceso:** Solo usuarios con rol "director" pueden restaurar
3. **Validación:** Siempre validar checksum antes de restaurar
4. **Auditoría:** Todas las operaciones registradas
5. **Backup pre-restauración:** Siempre crear backup de seguridad antes de restaurar

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
