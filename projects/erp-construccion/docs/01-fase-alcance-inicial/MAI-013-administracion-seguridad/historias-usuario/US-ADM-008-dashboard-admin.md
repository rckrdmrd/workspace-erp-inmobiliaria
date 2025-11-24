# US-ADM-008: Dashboard de Administración General

**ID:** US-ADM-008  
**Módulo:** MAI-013  
**Relacionado con:** Todos los RFs de MAI-013  
**Prioridad:** Media  
**Story Points:** 5

---

## 📖 Historia de Usuario

**Como** Director General o Administrador  
**Quiero** visualizar un dashboard consolidado con métricas clave de administración y seguridad  
**Para** monitorear la salud del sistema y tomar decisiones informadas rápidamente

---

## ✅ Criterios de Aceptación

### 1. Vista General del Dashboard

```gherkin
Given que soy Director o Admin
When accedo a "Dashboard de Administración"
Then debo ver widgets con información en tiempo real:
  - Resumen de usuarios y roles
  - Estado de seguridad del sistema
  - Actividad reciente (últimas 24 horas)
  - Estado de backups
  - Centros de costo (top 5 por costo)
  - Alertas pendientes
  - Métricas de sistema
And todos los datos deben actualizarse automáticamente cada 30 segundos
```

### 2. Widget: Resumen de Usuarios

```gherkin
Given que estoy en el dashboard
Then el widget de usuarios debe mostrar:
  - Total de usuarios activos
  - Usuarios conectados ahora (🟢 en vivo)
  - Nuevos usuarios (últimos 7 días)
  - Invitaciones pendientes
  - Usuarios bloqueados
  - Gráfico de distribución por rol (pie chart)
  - Link rápido a "Gestionar Usuarios"
```

### 3. Widget: Estado de Seguridad

```gherkin
Given que estoy monitoreando seguridad
Then el widget debe mostrar:
  - Score de seguridad global (0-100)
  - Passwords expirados (contador con alerta)
  - Usuarios sin 2FA (contador con alerta)
  - Intentos de login fallidos (últimas 24h)
  - Sesiones sospechosas
  - Última vulnerabilidad detectada
  - Indicador visual: 🟢 Seguro / 🟡 Advertencia / 🔴 Crítico
```

### 4. Widget: Actividad Reciente

```gherkin
Given que quiero ver actividad del sistema
Then el widget debe mostrar:
  - Timeline de últimas 10 acciones críticas
  - Con formato: "Usuario realizó Acción en Módulo hace Tiempo"
  - Ejemplo: "María L. eliminó presupuesto en Presupuestos hace 5 min"
  - Iconos según tipo de acción
  - Filtro rápido por severidad
  - Link a "Ver Bitácora Completa"
```

### 5. Widget: Estado de Backups

```gherkin
Given que monitoreo backups
Then el widget debe mostrar:
  - Último backup: Fecha/hora, tipo, estado (✅/❌)
  - Próximo backup programado: Countdown
  - Tasa de éxito (últimos 30 días) con gráfico
  - Espacio usado: Local / S3
  - Backups sin verificar (alerta si >3)
  - RTO/RPO actuales
  - Link a "Gestionar Backups"
```

### 6. Widget: Centros de Costo

```gherkin
Given que quiero ver resumen de costos
Then el widget debe mostrar:
  - Top 5 centros con mayor costo (mes actual)
  - Con barra de progreso indicando % del total
  - Total acumulado del mes
  - Comparación vs. mes anterior (% cambio)
  - Gráfico de tendencia (últimos 6 meses)
  - Link a "Ver Todos los Centros de Costo"
```

### 7. Widget: Alertas Pendientes

```gherkin
Given que hay alertas sin atender
Then el widget debe mostrar:
  - Contador de alertas por severidad:
    - 🚨 Críticas
    - ⚠️ Altas
    - ℹ️ Medias
  - Lista de alertas recientes (últimas 5)
  - Tiempo sin atender
  - Botón "Marcar como atendida"
  - Notificación badge en icono si hay críticas
```

### 8. Widget: Métricas del Sistema

```gherkin
Given que monitoreo rendimiento
Then el widget debe mostrar:
  - Uso de CPU (%)
  - Uso de memoria (%)
  - Uso de disco (%)
  - Conexiones a BD activas
  - Requests por minuto
  - Tiempo de respuesta promedio (ms)
  - Gráficos de línea (últimas 2 horas)
  - Alertas si algún indicador >80%
```

### 9. Filtros de Periodo

```gherkin
Given que quiero ver datos de diferentes periodos
When selecciono filtro de periodo:
  - Hoy
  - Últimos 7 días
  - Últimos 30 días
  - Mes actual
  - Rango personalizado
Then todos los widgets deben:
  - Actualizar datos según periodo seleccionado
  - Mostrar comparación con periodo anterior
  - Mantener selección al navegar
```

### 10. Acciones Rápidas

```gherkin
Given que estoy en el dashboard
Then debo ver panel de acciones rápidas:
  - [+ Invitar Usuario]
  - [🔒 Crear Backup Manual]
  - [👁️ Ver Sesiones Activas]
  - [📊 Exportar Reporte]
  - [⚙️ Configurar Alertas]
And cada botón debe abrir modal o redirigir a sección correspondiente
```

### 11. Exportar Dashboard

```gherkin
Given que quiero compartir métricas
When hago clic en "Exportar Dashboard"
And selecciono formato: "PDF"
Then el sistema debe:
  - Generar PDF con snapshot de todos los widgets
  - Incluir fecha/hora de generación
  - Incluir gráficos y tablas
  - Descargar automáticamente
  - Registrar exportación en audit log
```

### 12. Personalizar Dashboard

```gherkin
Given que quiero personalizar mi vista
When hago clic en "⚙️ Personalizar"
Then debo poder:
  - Arrastrar y soltar widgets para reordenar
  - Ocultar/mostrar widgets específicos
  - Cambiar tamaño de widgets (pequeño, mediano, grande)
  - Guardar configuración personal
  - Restaurar a configuración por defecto
```

---

## 🎨 Mockup / Wireframe

### Dashboard Principal

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard de Administración          [Hoy ▼]  [Exportar] [⚙️]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│ │ 👥 Usuarios      │  │ 🔒 Seguridad     │  │ ⚠️ Alertas     ││
│ │                  │  │                  │  │                ││
│ │ 45 Activos       │  │ Score: 85/100 🟢 │  │ 🚨 2 Críticas  ││
│ │ 🟢 12 Conectados │  │                  │  │ ⚠️ 5 Altas     ││
│ │ +3 Esta semana   │  │ ⚠️ 3 Pass. exp. │  │ ℹ️ 12 Medias   ││
│ │                  │  │ ⚠️ 7 Sin 2FA     │  │                ││
│ │ 📊 Por rol:      │  │ 8 Intentos fall. │  │ [Ver Todo]     ││
│ │ Director:    8   │  │                  │  │                ││
│ │ Ingeniero:   15  │  │ [Configurar]     │  │                ││
│ │ Residente:   12  │  │                  │  │                ││
│ │ Otros:       10  │  │                  │  │                ││
│ │                  │  │                  │  │                ││
│ │ [Gestionar]      │  │                  │  │                ││
│ └──────────────────┘  └──────────────────┘  └────────────────┘│
│                                                                 │
│ ┌────────────────────────────────────┐  ┌───────────────────┐ │
│ │ 📋 Actividad Reciente              │  │ 💾 Backups        │ │
│ │                                    │  │                   │ │
│ │ 🔴 María L. intentó eliminar       │  │ Último:           │ │
│ │    presupuesto $250K               │  │ ✅ Full           │ │
│ │    Hace 5 min                      │  │ 20 Nov, 03:00 AM  │ │
│ │                                    │  │                   │ │
│ │ 🟡 Juan P. actualizó monto         │  │ Próximo en:       │ │
│ │    en Presupuesto PRE-089          │  │ ⏱️ 2h 15min       │ │
│ │    Hace 12 min                     │  │                   │ │
│ │                                    │  │ Tasa éxito:       │ │
│ │ 🟢 Ana G. creó nuevo proyecto      │  │ ████████░ 98.5%   │ │
│ │    "Residencial Vista"             │  │                   │ │
│ │    Hace 23 min                     │  │ Espacio:          │ │
│ │                                    │  │ Local: 450 GB     │ │
│ │ 🟢 Pedro M. aprobó compra          │  │ S3: 1.2 TB        │ │
│ │    Materiales - $45K               │  │                   │ │
│ │    Hace 35 min                     │  │ [Gestionar]       │ │
│ │                                    │  │                   │ │
│ │ [Ver Bitácora Completa]            │  │                   │ │
│ └────────────────────────────────────┘  └───────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 💰 Top Centros de Costo (Mes Actual)                       │ │
│ │                                                             │ │
│ │ 101 - Proyecto Res. A     ████████████████░░░░  $180,000   │ │
│ │ 102 - Proyecto Com. B     ██████████░░░░░░░░░░  $ 70,000   │ │
│ │ 200 - Administración      ████░░░░░░░░░░░░░░░░  $ 50,000   │ │
│ │ 300 - Marketing           ███░░░░░░░░░░░░░░░░░  $ 30,000   │ │
│ │ 103 - Servicios Comp.     ██░░░░░░░░░░░░░░░░░░  $ 20,000   │ │
│ │                                                             │ │
│ │ Total mes: $350,000    📈 +15% vs mes anterior             │ │
│ │                                          [Ver Todos]        │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 📊 Métricas del Sistema (Últimas 2h)                       │ │
│ │                                                             │ │
│ │ CPU:      ████████░░░░░░░░░░ 45%    Memoria:  ██████░░░░ 62%│ │
│ │ Disco:    ████░░░░░░░░░░░░░░ 35%    Conexiones BD:   24   │ │
│ │                                                             │ │
│ │ [Gráficos de línea mostrando tendencias]                   │ │
│ │                                                             │ │
│ │ Requests/min: 1,250    Tiempo respuesta: 125ms             │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ⚡ Acciones Rápidas:                                            │
│ [+ Invitar Usuario] [🔒 Backup Manual] [👁️ Sesiones] [📊 Reporte]│
└─────────────────────────────────────────────────────────────────┘
```

### Modal de Exportar Dashboard

```
┌─────────────────────────────────────────────┐
│ Exportar Dashboard                        [X]│
├─────────────────────────────────────────────┤
│                                             │
│ Formato *                                   │
│ ◉ PDF (recomendado para reportes)          │
│ ○ Excel (incluye datos tabulares)          │
│ ○ CSV (solo datos, sin gráficos)           │
│                                             │
│ Incluir                                     │
│ ☑️ Todos los widgets                        │
│ ☑️ Gráficos y tablas                        │
│ ☑️ Metadata (fecha, usuario)                │
│ ☐ Anexar bitácora de auditoría             │
│                                             │
│ Periodo                                     │
│ ◉ Datos actuales (snapshot)                │
│ ○ Rango personalizado                      │
│                                             │
│ ℹ️ El archivo contendrá datos sensibles.   │
│    Será registrado en la bitácora.         │
│                                             │
│        [Cancelar]  [Exportar]               │
└─────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Dashboard Carga Correctamente

**Precondiciones:**
- Usuario con rol "director"

**Pasos:**
1. Login al sistema
2. Navegar a "Dashboard de Administración"

**Resultado Esperado:**
- ✅ Todos los widgets cargan en <2 segundos
- ✅ Datos son actuales (timestamp correcto)
- ✅ No hay errores en consola
- ✅ Gráficos se renderizan correctamente

### CP-002: Actualización Automática

**Precondiciones:**
- Dashboard abierto

**Pasos:**
1. Esperar 30 segundos
2. Observar actualización de datos

**Resultado Esperado:**
- ✅ Widgets se actualizan automáticamente
- ✅ Sin recargar página completa
- ✅ Indicador visual de actualización
- ✅ No interrumpe interacción del usuario

### CP-003: Filtro por Periodo

**Precondiciones:**
- Dashboard muestra "Hoy"

**Pasos:**
1. Cambiar filtro a "Últimos 30 días"
2. Verificar cambios

**Resultado Esperado:**
- ✅ Todos los widgets actualizan datos
- ✅ Actividad reciente muestra últimos 30 días
- ✅ Métricas recalculadas correctamente
- ✅ Comparación con periodo anterior visible

### CP-004: Exportar Dashboard a PDF

**Precondiciones:**
- Dashboard con datos

**Pasos:**
1. Clic "Exportar"
2. Seleccionar "PDF"
3. Confirmar

**Resultado Esperado:**
- ✅ PDF genera en <5 segundos
- ✅ Incluye todos los widgets visibles
- ✅ Gráficos renderizados correctamente
- ✅ Descarga automáticamente
- ✅ Exportación registrada en audit log

### CP-005: Acciones Rápidas Funcionan

**Precondiciones:**
- Dashboard abierto

**Pasos:**
1. Clic en "[+ Invitar Usuario]"
2. Verificar modal

**Resultado Esperado:**
- ✅ Modal de invitación abre correctamente
- ✅ No requiere navegación a otra página
- ✅ Al cerrar modal, vuelve al dashboard

### CP-006: Personalizar Dashboard

**Precondiciones:**
- Dashboard en configuración por defecto

**Pasos:**
1. Clic "⚙️ Personalizar"
2. Arrastrar widget "Usuarios" al primer lugar
3. Ocultar widget "Métricas del Sistema"
4. Guardar

**Resultado Esperado:**
- ✅ Widgets reordenados correctamente
- ✅ Widget oculto no se muestra
- ✅ Configuración persiste al recargar
- ✅ Otros usuarios no ven cambios (configuración personal)

---

## 🔗 Dependencias

**Requisitos Previos:**
- Todos los módulos de MAI-013 implementados
- APIs de estadísticas disponibles
- WebSockets o polling para actualización en tiempo real

**APIs Necesarias:**
- `GET /api/admin/dashboard/summary` - Resumen general
- `GET /api/admin/dashboard/users` - Métricas de usuarios
- `GET /api/admin/dashboard/security` - Score de seguridad
- `GET /api/admin/dashboard/activity` - Actividad reciente
- `GET /api/admin/dashboard/backups` - Estado de backups
- `GET /api/admin/dashboard/cost-centers` - Top centros de costo
- `GET /api/admin/dashboard/alerts` - Alertas pendientes
- `GET /api/admin/dashboard/system-metrics` - Métricas de sistema
- `POST /api/admin/dashboard/export` - Exportar
- `PUT /api/admin/dashboard/layout` - Guardar configuración

**Componentes Frontend:**
- DashboardLayout (grid responsive)
- Widget components (UserWidget, SecurityWidget, etc.)
- Charts (recharts, chart.js)
- Drag & drop (react-beautiful-dnd)

---

## 📊 Métricas de Éxito

- **Tiempo de carga inicial:** <2 segundos
- **Actualización automática:** Cada 30 segundos sin errores
- **Precisión de datos:** 100% consistencia con datos reales
- **Tiempo de exportación:** <5 segundos para PDF

---

## 🎯 Valor de Negocio

Este dashboard permite a los administradores:
- Detectar problemas de seguridad rápidamente
- Monitorear salud del sistema proactivamente
- Tomar decisiones informadas con datos en tiempo real
- Ahorrar tiempo al tener todo consolidado en una vista
- Identificar tendencias y patrones de uso

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
