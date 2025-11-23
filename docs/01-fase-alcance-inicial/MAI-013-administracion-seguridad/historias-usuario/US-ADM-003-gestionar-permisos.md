# US-ADM-003: Gestionar Permisos Personalizados

**ID:** US-ADM-003  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-002, ET-ADM-001  
**Prioridad:** Media  
**Story Points:** 5

---

## 📖 Historia de Usuario

**Como** Director General  
**Quiero** asignar permisos personalizados a usuarios específicos que excedan o limiten su rol base  
**Para** adaptar el acceso según necesidades especiales sin crear nuevos roles

---

## ✅ Criterios de Aceptación

### 1. Ver Permisos de Usuario

```gherkin
Given que soy Director General
When accedo a "Usuarios" y selecciono un usuario
And hago clic en "Permisos"
Then debo ver dos secciones:
  - "Permisos Base del Rol" (no editables, solo lectura)
  - "Permisos Personalizados" (editables)
And cada permiso debe mostrar:
  - Módulo
  - Acciones permitidas (Create, Read, Update, Delete, Approve)
  - Origen (Rol / Personalizado)
```

### 2. Agregar Permiso Personalizado

```gherkin
Given que estoy viendo permisos de un usuario con rol "engineer"
And su rol NO incluye permiso "approve" en módulo "budgets"
When hago clic en "+ Agregar Permiso Personalizado"
And selecciono:
  - Módulo: "Presupuestos"
  - Acción: "Aprobar"
  - Condición: "Montos < $50,000 MXN" (opcional)
And hago clic en "Guardar"
Then el sistema debe:
  - Agregar el permiso a la sección "Personalizados"
  - Marcar visualmente que es un permiso adicional (badge "Extra")
  - Registrar en audit log: "custom_permission_granted"
  - Notificar al usuario por email
```

### 3. Revocar Permiso Base

```gherkin
Given que un usuario con rol "resident" tiene permiso "update" en "purchases"
When quiero restringir este permiso específicamente
And hago clic en "Revocar" junto al permiso
And confirmo la acción
Then el sistema debe:
  - Crear una excepción negativa en permisos personalizados
  - Marcar el permiso con badge "Revocado"
  - El usuario pierde acceso a esa acción
  - Registrar en audit log: "permission_revoked"
```

### 4. Permisos Temporales

```gherkin
Given que quiero dar acceso temporal a un usuario
When agrego un permiso personalizado
And marco la opción "Temporal"
And selecciono fecha de expiración: "2025-12-31"
Then el sistema debe:
  - Guardar el permiso con fecha de expiración
  - Mostrar countdown: "Expira en 45 días"
  - Revocar automáticamente el permiso al llegar la fecha
  - Enviar notificación 3 días antes de expirar
```

### 5. Permisos Condicionales

```gherkin
Given que agrego un permiso personalizado
When selecciono "Con Condiciones"
And configuro reglas:
  - Campo: "monto"
  - Operador: "<="
  - Valor: "50000"
Then el sistema debe:
  - Guardar la condición en JSON
  - Validar en backend si se cumple la condición
  - Mostrar en UI: "Aprobar presupuestos ≤ $50,000"
```

### 6. Previsualización de Acceso

```gherkin
Given que estoy editando permisos de un usuario
When hago clic en "Previsualizar Acceso"
Then debo ver una matriz completa con:
  - Filas: Todos los módulos
  - Columnas: CREATE, READ, UPDATE, DELETE, APPROVE
  - Celdas con color:
    - Verde: Permitido por rol
    - Azul: Permitido por permiso personalizado
    - Rojo: Denegado por excepción
    - Gris: No permitido
```

---

## 🎨 Mockup / Wireframe

### Panel de Permisos de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Usuarios / Juan Pérez                                         │
├─────────────────────────────────────────────────────────────────┤
│ [Info] [Permisos] [Actividad] [Sesiones]                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📋 Permisos Base del Rol: Ingeniero                    [👁️ Preview]│
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Módulo          CREATE  READ  UPDATE  DELETE  APPROVE      │ │
│ │ ──────────────────────────────────────────────────────────  │ │
│ │ Proyectos        ✓      ✓      ✓       ✗       ✗  [ROL]   │ │
│ │ Presupuestos     ✓      ✓      ✓       ✗       ✗  [ROL]   │ │
│ │ Obra             ✓      ✓      ✓       ✗       ✗  [ROL]   │ │
│ │ Compras          ✗      ✓      ✗       ✗       ✗  [ROL]   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 🎯 Permisos Personalizados                 [+ Agregar Permiso] │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✨ Presupuestos > Aprobar                           [Extra]  │ │
│ │    Condición: Monto ≤ $50,000 MXN                           │ │
│ │    Expira: 31 Dic 2025 (45 días restantes)                  │ │
│ │    Otorgado por: María López el 15 Nov 2025                 │ │
│ │                                    [Editar] [Revocar]        │ │
│ │                                                              │ │
│ │ 🚫 Compras > Eliminar                                [Revocado]│
│ │    Razón: Prevención de errores críticos                    │ │
│ │    Revocado por: María López el 18 Nov 2025                 │ │
│ │                                    [Restaurar]               │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Modal Agregar Permiso Personalizado

```
┌─────────────────────────────────────────────┐
│ Agregar Permiso Personalizado            [X]│
├─────────────────────────────────────────────┤
│                                             │
│ Tipo *                                      │
│ ◉ Otorgar permiso adicional                 │
│ ○ Revocar permiso del rol                   │
│                                             │
│ Módulo *                                    │
│ [v] Presupuestos                            │
│                                             │
│ Acción *                                    │
│ [v] Aprobar                                 │
│                                             │
│ ☑️ Aplicar Condiciones                      │
│ ┌─────────────────────────────────────────┐ │
│ │ Campo    Operador     Valor             │ │
│ │ [monto] [<=]      [50000]        [+ And]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ☑️ Permiso Temporal                         │
│ Expira el: [31/12/2025]  📅                │
│                                             │
│ Razón *                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Necesita aprobar presupuestos pequeños  │ │
│ │ durante ausencia del director           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ☑️ Notificar al usuario                     │
│                                             │
│        [Cancelar]  [Agregar Permiso]        │
└─────────────────────────────────────────────┘
```

### Previsualización de Matriz de Permisos

```
┌─────────────────────────────────────────────────────────────────┐
│ Previsualización de Acceso: Juan Pérez (Ingeniero)          [X]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Módulo             CREATE   READ   UPDATE  DELETE  APPROVE     │
│ ──────────────────────────────────────────────────────────────  │
│ Proyectos           🟢      🟢      🟢      ⚫      ⚫         │
│ Presupuestos        🟢      🟢      🟢      ⚫      🔵<$50K    │
│ Obra                🟢      🟢      🟢      ⚫      ⚫         │
│ Compras             ⚫      🟢      ⚫      🔴      ⚫         │
│ Contratos           ⚫      🟢      ⚫      ⚫      ⚫         │
│ RH                  ⚫      ⚫      ⚫      ⚫      ⚫         │
│                                                                 │
│ Leyenda:                                                        │
│ 🟢 Permitido por rol    🔵 Permiso personalizado               │
│ 🔴 Revocado            ⚫ No permitido                          │
│                                                                 │
│                              [Cerrar]                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Agregar Permiso Adicional

**Precondiciones:**
- Usuario "Juan" con rol "engineer"
- Director autenticado

**Pasos:**
1. Ir a perfil de Juan > Permisos
2. Clic en "+ Agregar Permiso Personalizado"
3. Seleccionar: Presupuestos > Aprobar
4. Agregar condición: monto <= 50000
5. Guardar

**Resultado Esperado:**
- ✅ Permiso aparece en "Permisos Personalizados"
- ✅ Badge "Extra" visible
- ✅ Juan puede aprobar presupuestos ≤$50K
- ✅ Juan NO puede aprobar presupuestos >$50K
- ✅ Email enviado a Juan notificando cambio

### CP-002: Revocar Permiso Base

**Precondiciones:**
- Usuario "Ana" con rol "resident"
- Rol incluye UPDATE en "purchases"

**Pasos:**
1. Ir a perfil de Ana > Permisos
2. En "Permisos Base", clic en "Revocar" junto a Compras > Update
3. Confirmar revocación

**Resultado Esperado:**
- ✅ Permiso marcado como "Revocado" con badge rojo
- ✅ Ana pierde acceso a editar compras
- ✅ GET /api/users/me/permissions excluye ese permiso
- ✅ Audit log registra revocación

### CP-003: Permiso Temporal Expira

**Precondiciones:**
- Usuario tiene permiso temporal que expira hoy a las 23:59

**Pasos:**
1. Esperar a que llegue la fecha de expiración
2. Verificar permisos del usuario

**Resultado Esperado:**
- ✅ Cron job revoca el permiso automáticamente
- ✅ Permiso removido de lista de personalizados
- ✅ Usuario recibe email: "Tu permiso temporal ha expirado"
- ✅ Audit log: "temporary_permission_expired"

### CP-004: Validación de Condición

**Precondiciones:**
- Juan tiene permiso "approve budgets" con condición "monto <= 50000"

**Pasos:**
1. Juan intenta aprobar presupuesto de $30,000
2. Juan intenta aprobar presupuesto de $80,000

**Resultado Esperado:**
- ✅ Presupuesto $30K: Aprobación exitosa
- ✅ Presupuesto $80K: Error 403 "No tienes permiso para aprobar montos superiores a $50,000"

### CP-005: Previsualización Correcta

**Precondiciones:**
- Usuario con permisos base + 2 personalizados + 1 revocado

**Pasos:**
1. Abrir "Previsualizar Acceso"

**Resultado Esperado:**
- ✅ Matriz muestra todos los módulos y acciones
- ✅ Colores correctos según origen del permiso
- ✅ Tooltips explican condiciones

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-001: Tabla `custom_permissions` implementada
- ET-ADM-002: Sistema RBAC base funcional
- Backend: Guard que evalúa permisos personalizados

**APIs Necesarias:**
- `GET /api/users/:id/permissions` - Permisos completos del usuario
- `POST /api/users/:id/permissions/custom` - Agregar permiso personalizado
- `DELETE /api/users/:id/permissions/custom/:permissionId` - Revocar
- `PUT /api/users/:id/permissions/custom/:permissionId` - Editar
- `POST /api/users/:id/permissions/preview` - Previsualizar matriz

---

## 📊 Métricas de Éxito

- **Permisos personalizados activos:** <10% del total de usuarios
- **Tiempo de configuración:** <2 minutos por permiso
- **Precisión de condiciones:** 100% (0 falsos positivos/negativos)
- **Revocaciones automáticas:** 100% al expirar

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
