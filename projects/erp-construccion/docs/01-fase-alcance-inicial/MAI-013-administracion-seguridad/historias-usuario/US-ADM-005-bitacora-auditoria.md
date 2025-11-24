# US-ADM-005: Consultar Bitácora de Auditoría

**ID:** US-ADM-005  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-004, ET-ADM-003  
**Prioridad:** Alta  
**Story Points:** 5

---

## 📖 Historia de Usuario

**Como** Director General o Auditor  
**Quiero** consultar la bitácora completa de auditoría con filtros avanzados  
**Para** rastrear cambios, detectar anomalías y cumplir con requerimientos de compliance

---

## ✅ Criterios de Aceptación

### 1. Vista Timeline de Auditoría

```gherkin
Given que soy Director o tengo permisos de auditoría
When accedo a "Administración > Bitácora de Auditoría"
Then debo ver una timeline cronológica inversa con:
  - Timestamp exacto (fecha y hora con segundos)
  - Usuario que ejecutó la acción
  - Acción realizada (crear, actualizar, eliminar, aprobar, login, etc.)
  - Módulo afectado
  - Entidad y ID (proyecto, presupuesto, usuario, etc.)
  - Severidad (baja, media, alta, crítica)
  - IP de origen
  - Éxito o fallo
  - Cambios detallados (antes/después)
```

### 2. Filtros Avanzados

```gherkin
Given que estoy en la bitácora
When aplico filtros:
  - Rango de fechas: "01 Nov 2025 - 20 Nov 2025"
  - Usuario: "Juan Pérez"
  - Acción: "delete"
  - Módulo: "budgets"
  - Severidad: "high"
  - Solo fallidos: ☑️
Then el sistema debe:
  - Aplicar todos los filtros simultáneamente
  - Mostrar solo registros que cumplan TODOS los criterios
  - Mostrar contador: "15 registros encontrados"
  - Permitir exportar resultados filtrados
```

### 3. Búsqueda por Texto Libre

```gherkin
Given que quiero buscar algo específico
When escribo "presupuesto 12345" en el buscador
Then el sistema debe buscar en:
  - Nombres de usuario
  - Descripciones de acción
  - IDs de entidades
  - Campos de cambios (JSONB)
And mostrar coincidencias resaltadas
```

### 4. Ver Detalles de Cambios

```gherkin
Given que veo un registro "update" en presupuestos
When hago clic en "Ver Cambios"
Then debo ver un modal con:
  - Lista de campos modificados
  - Valor anterior (en rojo)
  - Valor nuevo (en verde)
  - Formato: "monto: $50,000 → $75,000"
  - Timestamp del cambio
  - Usuario responsable
```

### 5. Eventos de Seguridad Críticos

```gherkin
Given que ocurrieron eventos críticos de seguridad
When filtro por Severidad: "Crítica"
Then debo ver eventos como:
  - "Failed login attempts exceeded (account locked)"
  - "Permission escalation detected"
  - "Suspicious IP access"
  - "Backup restoration failed"
  - "Data export > 1000 records"
And cada uno debe tener badge rojo "🚨 CRÍTICO"
```

### 6. Auditoría por Entidad

```gherkin
Given que estoy viendo un presupuesto específico
When hago clic en "Ver Historia de Cambios"
Then debo ver:
  - Solo registros de auditoría de ese presupuesto
  - Timeline completa desde creación hasta ahora
  - Todos los usuarios que lo modificaron
  - Comparación entre versiones
```

### 7. Alertas Automáticas Configurables

```gherkin
Given que quiero recibir alertas de ciertos eventos
When configuro una regla:
  - Evento: "Eliminación de presupuesto"
  - Condición: "Monto > $100,000"
  - Notificar a: "director@constructora.com"
  - Método: Email + SMS
Then el sistema debe:
  - Guardar la regla
  - Evaluar cada evento de auditoría
  - Enviar notificación si cumple condición
  - Registrar la alerta enviada
```

### 8. Exportar Auditoría

```gherkin
Given que apliqué filtros
When hago clic en "Exportar"
And selecciono formato: "Excel"
Then el sistema debe:
  - Generar archivo con todos los registros filtrados
  - Incluir columnas: timestamp, usuario, acción, módulo, detalles
  - Descargar archivo inmediatamente
  - Registrar la exportación en audit log
```

### 9. Retención Diferenciada

```gherkin
Given que los registros tienen diferentes severidades
Then el sistema debe mantener:
  - Severidad baja: 90 días
  - Severidad media: 365 días (1 año)
  - Severidad alta: 1825 días (5 años)
  - Severidad crítica: 3650 días (10 años)
And mostrar indicador de expiración
```

### 10. Dashboard de Actividad

```gherkin
Given que accedo al dashboard de auditoría
Then debo ver widgets con:
  - Eventos por día (gráfico de líneas, últimos 30 días)
  - Top 10 usuarios más activos
  - Distribución por módulo (pie chart)
  - Eventos críticos recientes (últimos 7 días)
  - Tasa de éxito vs fallos
```

---

## 🎨 Mockup / Wireframe

### Vista Principal de Auditoría

```
┌─────────────────────────────────────────────────────────────────┐
│ Bitácora de Auditoría                       [📊 Dashboard] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Filtros:                                                        │
│ ┌──────────┬──────────┬──────────┬──────────┬─────────┬──────┐ │
│ │[📅 Fechas]│[👤 Usuario]│[⚡ Acción]│[📦 Módulo]│[⚠️ Sev.]│[🔍] │ │
│ └──────────┴──────────┴──────────┴──────────┴─────────┴──────┘ │
│                                                                 │
│ 1,247 registros encontrados          [Exportar ▼] [Limpiar]   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ 20 Nov 2025, 14:35:22 ──────────────────────────────────┐   │
│ │ 🚨 CRÍTICO                                                │   │
│ │ María López (Director) intentó eliminar presupuesto       │   │
│ │ PRE-2025-089 ($250,000)                                   │   │
│ │ ❌ FALLIDO - Requiere aprobación adicional                │   │
│ │ IP: 192.168.1.105                                         │   │
│ │                                      [Ver Detalles]       │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌─ 20 Nov 2025, 12:18:45 ──────────────────────────────────┐   │
│ │ ⚠️ ALTA                                                   │   │
│ │ Juan Pérez (Ingeniero) actualizó presupuesto PRE-2025-088│   │
│ │ ✅ ÉXITO                                                  │   │
│ │ Cambios: monto: $50,000 → $75,000                         │   │
│ │ IP: 10.0.0.45                                             │   │
│ │                            [Ver Cambios] [Ver Entidad]    │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌─ 20 Nov 2025, 09:22:10 ──────────────────────────────────┐   │
│ │ ℹ️ BAJA                                                   │   │
│ │ Ana García (Residente) inició sesión                      │   │
│ │ ✅ ÉXITO                                                  │   │
│ │ IP: 192.168.1.89 - Chrome 120.0 / Windows 11             │   │
│ │                                                           │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│                      [Cargar más...]                            │
└─────────────────────────────────────────────────────────────────┘
```

### Modal Ver Cambios Detallados

```
┌─────────────────────────────────────────────┐
│ Cambios en Presupuesto PRE-2025-088       [X]│
├─────────────────────────────────────────────┤
│                                             │
│ 📅 20 Nov 2025, 12:18:45                    │
│ 👤 Juan Pérez (Ingeniero)                   │
│ 🌐 IP: 10.0.0.45                            │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Campo: monto                            │ │
│ │ ❌ Antes:  $50,000.00 MXN               │ │
│ │ ✅ Después: $75,000.00 MXN              │ │
│ │ Δ Cambio:  +$25,000.00 (+50%)           │ │
│ ├─────────────────────────────────────────┤ │
│ │ Campo: status                           │ │
│ │ ❌ Antes:  draft                        │ │
│ │ ✅ Después: pending_approval            │ │
│ ├─────────────────────────────────────────┤ │
│ │ Campo: updatedBy                        │ │
│ │ ❌ Antes:  María López                  │ │
│ │ ✅ Después: Juan Pérez                  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Razón del cambio (si fue proporcionada):    │
│ "Ajuste por incremento en costo de materia │
│  prima según cotización actualizada"        │
│                                             │
│              [Cerrar] [Ver Presupuesto]     │
└─────────────────────────────────────────────┘
```

### Dashboard de Actividad

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard de Auditoría                              [Última 24h]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────┐  ┌────────────────────────────────┐│
│ │ Eventos por Día (30d)   │  │ Distribución por Módulo        ││
│ │                         │  │                                ││
│ │     📊 Gráfico de línea │  │  🥧 Pie Chart:                 ││
│ │     mostrando tendencia │  │  - Presupuestos: 45%           ││
│ │                         │  │  - Proyectos: 30%              ││
│ │                         │  │  - Usuarios: 15%               ││
│ └─────────────────────────┘  │  - Otros: 10%                  ││
│                              └────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────┐  ┌────────────────────────────────┐│
│ │ Top Usuarios Activos    │  │ Eventos Críticos (7d)          ││
│ │                         │  │                                ││
│ │ 1. Juan P.    523 acc.  │  │ 🚨 3 intentos de login fallidos││
│ │ 2. María L.   412 acc.  │  │ 🚨 2 eliminaciones bloqueadas  ││
│ │ 3. Ana G.     298 acc.  │  │ 🚨 1 exportación masiva        ││
│ │ 4. Pedro M.   187 acc.  │  │                                ││
│ └─────────────────────────┘  └────────────────────────────────┘│
│                                                                 │
│ Tasa de Éxito: 98.5% ████████████████████▌░                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Filtrar por Múltiples Criterios

**Precondiciones:**
- Base de datos con 1000+ registros de auditoría

**Pasos:**
1. Acceder a Bitácora
2. Filtrar: Fechas (01-20 Nov), Usuario (Juan), Acción (update), Módulo (budgets)

**Resultado Esperado:**
- ✅ Solo muestra registros que cumplen TODOS los criterios
- ✅ Contador correcto de resultados
- ✅ Query ejecuta en <1 segundo

### CP-002: Ver Cambios Detallados

**Precondiciones:**
- Existe un registro de "update" en presupuesto

**Pasos:**
1. Clic en registro
2. Clic "Ver Cambios"

**Resultado Esperado:**
- ✅ Modal muestra comparación campo por campo
- ✅ Valores anteriores en rojo, nuevos en verde
- ✅ Cálculo de delta correcto

### CP-003: Exportar con Filtros

**Precondiciones:**
- Filtros aplicados (50 registros)

**Pasos:**
1. Clic "Exportar > Excel"

**Resultado Esperado:**
- ✅ Archivo Excel descarga inmediatamente
- ✅ Contiene exactamente 50 registros
- ✅ Exportación registrada en audit log

### CP-004: Alerta Automática

**Precondiciones:**
- Regla configurada: "delete budget > $100K → email director"

**Pasos:**
1. Usuario intenta eliminar presupuesto de $150K
2. Verificar que se envió email

**Resultado Esperado:**
- ✅ Email enviado a director@constructora.com
- ✅ Audit log registra: "alert_triggered"
- ✅ Email contiene detalles del evento

### CP-005: Retención Diferenciada

**Precondiciones:**
- Registro de severidad "baja" con 91 días de antigüedad

**Pasos:**
1. Cron job ejecuta limpieza diaria
2. Verificar registros

**Resultado Esperado:**
- ✅ Registro eliminado automáticamente
- ✅ Registros de severidad alta/crítica permanecen

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-003: Tabla `audit_logs` implementada
- ET-ADM-003: AuditInterceptor capturando eventos
- Índices en timestamp, userId, module, severity

**APIs Necesarias:**
- `GET /api/audit-logs` - Lista paginada con filtros
- `GET /api/audit-logs/:id` - Detalle de registro
- `GET /api/audit-logs/entity/:type/:id` - Historia de entidad
- `POST /api/audit-logs/export` - Exportar
- `GET /api/audit-logs/dashboard` - Estadísticas
- `POST /api/audit-logs/alert-rules` - Configurar alertas

---

## 📊 Métricas de Éxito

- **Tiempo de consulta:** <1s para filtros complejos en 100K registros
- **Precisión de búsqueda:** 100% (sin falsos positivos)
- **Tiempo de exportación:** <5s para 10K registros
- **Alertas enviadas:** 100% de eventos críticos notificados

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
