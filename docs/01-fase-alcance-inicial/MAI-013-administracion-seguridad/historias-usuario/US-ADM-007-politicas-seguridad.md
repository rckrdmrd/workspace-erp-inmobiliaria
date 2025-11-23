# US-ADM-007: Configurar Políticas de Seguridad

**ID:** US-ADM-007  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-001, RF-ADM-002, ET-ADM-005  
**Prioridad:** Alta  
**Story Points:** 5

---

## 📖 Historia de Usuario

**Como** Director General  
**Quiero** configurar políticas de seguridad de la organización (passwords, sesiones, intentos de login)  
**Para** cumplir con estándares de seguridad y proteger el sistema contra accesos no autorizados

---

## ✅ Criterios de Aceptación

### 1. Configurar Política de Passwords

```gherkin
Given que soy Director General
When accedo a "Administración > Seguridad > Políticas de Password"
Then debo ver opciones configurables:
  - Longitud mínima (slider: 8-20 caracteres, default: 12)
  - Requerir mayúscula (toggle)
  - Requerir minúscula (toggle)
  - Requerir número (toggle)
  - Requerir carácter especial (toggle)
  - Expiración (días): 30, 60, 90, 180, nunca
  - Prevenir reutilización (últimas N passwords): 0-10
  - Bloquear passwords comunes (toggle)
When modifico la configuración
And hago clic en "Guardar"
Then el sistema debe:
  - Aplicar la política a nuevos passwords inmediatamente
  - Solicitar cambio de password en próximo login a usuarios existentes (si es más restrictiva)
  - Enviar notificación a todos los usuarios sobre cambio de política
  - Registrar en audit log
```

### 2. Configurar Política de Sesiones

```gherkin
Given que estoy configurando políticas de sesión
When accedo a "Seguridad > Sesiones"
Then debo ver opciones:
  - Duración de sesión activa: 15min, 30min, 1h, 4h, 8h, 24h
  - Timeout por inactividad: 5min, 15min, 30min, 1h
  - Sesiones concurrentes máximas por usuario: 1-10
  - Requerir re-autenticación para acciones críticas (toggle)
  - IP whitelist (lista de IPs permitidas)
When configuro:
  - Duración: 4 horas
  - Timeout: 30 minutos
  - Máximo 3 sesiones concurrentes
And guardo
Then el sistema debe:
  - Aplicar límites inmediatamente a nuevas sesiones
  - Cerrar sesiones existentes que excedan los nuevos límites
  - Notificar a usuarios afectados
```

### 3. Configurar Política de Intentos de Login

```gherkin
Given que quiero proteger contra brute force attacks
When configuro políticas de login:
  - Máximo intentos fallidos: 3, 5, 10
  - Tiempo de bloqueo: 15min, 30min, 1h, 24h, permanente
  - Bloqueo por IP: toggle
  - Bloqueo por usuario: toggle
  - Captcha después de N intentos: 0-5
And establezco:
  - 5 intentos máximos
  - Bloqueo de 30 minutos
  - Captcha después de 3 intentos
Then el sistema debe:
  - Aplicar reglas inmediatamente
  - Mostrar captcha en login después de 3 fallos
  - Bloquear cuenta por 30 min después de 5 fallos
  - Enviar alerta de seguridad al administrador
```

### 4. Configurar Autenticación de Dos Factores (2FA)

```gherkin
Given que quiero habilitar 2FA
When accedo a "Seguridad > Autenticación"
Then debo ver opciones:
  - Requerir 2FA para todos los usuarios (toggle)
  - Requerir 2FA solo para roles críticos (director, finance)
  - Métodos permitidos:
    ☑️ Aplicación Authenticator (Google, Microsoft)
    ☑️ SMS
    ☑️ Email
  - Periodo de recordar dispositivo: 0, 7, 30, 90 días
When habilito 2FA obligatorio para directores
Then el sistema debe:
  - Solicitar configuración de 2FA en próximo login de directores
  - No permitir acceso hasta configurar 2FA
  - Generar códigos de recuperación
```

### 5. Gestionar Sesiones Activas

```gherkin
Given que soy administrador
When accedo a "Seguridad > Sesiones Activas"
Then debo ver lista en tiempo real con:
  - Usuario
  - Dispositivo / Navegador
  - IP
  - Ubicación (geo-localización)
  - Inicio de sesión
  - Última actividad
  - Acciones: [Revocar]
When hago clic en "Revocar" en una sesión
Then el sistema debe:
  - Cerrar la sesión inmediatamente
  - Forzar re-login del usuario
  - Notificar al usuario por email
  - Registrar en audit log
```

### 6. Configurar Alertas de Seguridad

```gherkin
Given que quiero recibir alertas de eventos críticos
When configuro reglas de alerta:
  - Evento: "Login desde nueva IP"
  - Condición: "Usuario con rol director o finance"
  - Acción: "Enviar email + SMS"
  - Destinatarios: ["director@constructora.com"]
And guardo la regla
Then el sistema debe:
  - Evaluar cada evento de login
  - Enviar alerta si cumple condición
  - Incluir detalles: IP, ubicación, dispositivo
  - Permitir bloquear sesión desde el email
```

### 7. Restricciones por Horario

```gherkin
Given que quiero limitar acceso a horarios laborales
When configuro:
  - Horario permitido: Lun-Vie 8:00-18:00
  - Zona horaria: America/Mexico_City
  - Aplicar a rol: "resident"
Then el sistema debe:
  - Permitir login solo en horario configurado
  - Bloquear intentos fuera de horario con mensaje claro
  - Permitir excepciones temporales
```

### 8. Whitelist/Blacklist de IPs

```gherkin
Given que quiero restringir acceso por IP
When agrego a whitelist:
  - 192.168.1.0/24 (Oficina principal)
  - 10.0.0.0/16 (VPN corporativa)
And agrego a blacklist:
  - 203.0.113.0/24 (IP sospechosa)
Then el sistema debe:
  - Solo permitir login desde IPs en whitelist
  - Bloquear inmediatamente IPs en blacklist
  - Registrar intentos bloqueados en audit log
```

### 9. Revisión Periódica de Seguridad

```gherkin
Given que quiero auditorías de seguridad automáticas
When configuro:
  - Frecuencia: Semanal
  - Día: Lunes 9:00 AM
  - Enviar reporte a: ["director@constructora.com"]
Then el sistema debe generar reporte con:
  - Usuarios con passwords expirados
  - Usuarios sin 2FA habilitado
  - Sesiones sospechosas
  - Intentos de login fallidos (top 10)
  - Recomendaciones de seguridad
```

### 10. Modo de Mantenimiento

```gherkin
Given que necesito mantenimiento del sistema
When activo "Modo Mantenimiento"
And configuro:
  - Mensaje personalizado: "Sistema en mantenimiento..."
  - Tiempo estimado: 2 horas
  - Permitir acceso a IPs: [admin IPs]
Then el sistema debe:
  - Mostrar página de mantenimiento a todos los usuarios
  - Cerrar sesiones activas (excepto admins)
  - Permitir solo acceso desde IPs autorizadas
  - Registrar inicio/fin del mantenimiento
```

---

## 🎨 Mockup / Wireframe

### Panel de Políticas de Seguridad

```
┌─────────────────────────────────────────────────────────────────┐
│ Políticas de Seguridad                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🔐 Políticas de Password                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Longitud mínima                                             │ │
│ │ ●────────────────○───────── 12 caracteres                  │ │
│ │                                                             │ │
│ │ ☑️ Requerir mayúscula    ☑️ Requerir minúscula             │ │
│ │ ☑️ Requerir número       ☑️ Requerir carácter especial     │ │
│ │                                                             │ │
│ │ Expiración de password                                      │ │
│ │ [v] 90 días                                                 │ │
│ │                                                             │ │
│ │ Prevenir reutilización (últimas N passwords)                │ │
│ │ [v] 5 passwords                                             │ │
│ │                                                             │ │
│ │ ☑️ Bloquear passwords comunes (123456, password, etc.)     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 🔓 Políticas de Sesión                                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Duración máxima de sesión                                   │ │
│ │ ◉ 4 horas  ○ 8 horas  ○ 24 horas  ○ Sin límite            │ │
│ │                                                             │ │
│ │ Timeout por inactividad                                     │ │
│ │ ○ 15 min  ◉ 30 min  ○ 1 hora  ○ Sin timeout               │ │
│ │                                                             │ │
│ │ Sesiones concurrentes máximas por usuario                   │ │
│ │ [v] 3 dispositivos                                          │ │
│ │                                                             │ │
│ │ ☑️ Requerir re-autenticación para acciones críticas        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 🚫 Protección contra Brute Force                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Intentos de login fallidos antes de bloqueo                 │ │
│ │ [v] 5 intentos                                              │ │
│ │                                                             │ │
│ │ Tiempo de bloqueo                                           │ │
│ │ ◉ 30 minutos  ○ 1 hora  ○ 24 horas  ○ Permanente          │ │
│ │                                                             │ │
│ │ Mostrar captcha después de                                  │ │
│ │ [v] 3 intentos fallidos                                     │ │
│ │                                                             │ │
│ │ ☑️ Bloquear por IP    ☑️ Bloquear por usuario              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    [Cancelar]  [Guardar Cambios]                │
└─────────────────────────────────────────────────────────────────┘
```

### Sesiones Activas en Tiempo Real

```
┌─────────────────────────────────────────────────────────────────┐
│ Sesiones Activas (Tiempo Real)                     🔄 Actualizar│
├─────────────────────────────────────────────────────────────────┤
│ 🟢 15 usuarios conectados                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Usuario           Dispositivo         IP           Inicio      │
│ ──────────────────────────────────────────────────────────────  │
│ 🟢 María López    Chrome / Windows    10.0.1.45    09:15 AM    │
│    Director       📍 Ciudad de México               [Revocar]  │
│    Última actividad: Hace 2 minutos                            │
│                                                                 │
│ 🟢 Juan Pérez     Safari / macOS      192.168.1.89 08:45 AM    │
│    Ingeniero      📍 Monterrey                      [Revocar]  │
│    Última actividad: Hace 5 minutos                            │
│                                                                 │
│ 🟡 Ana García     Mobile / Android    200.57.5.12  07:30 AM    │
│    Residente      📍 Guadalajara                    [Revocar]  │
│    ⚠️ IP no reconocida - Nueva ubicación                       │
│                                                                 │
│ 🔴 Pedro Morales  Firefox / Linux     198.51.100.5 3 días      │
│    Compras        📍 Desconocido                    [Revocar]  │
│    ⚠️ Sesión inactiva por 3 días                               │
│                                                                 │
│                     [Revocar Todas las Sesiones]                │
└─────────────────────────────────────────────────────────────────┘
```

### Configuración de Alertas de Seguridad

```
┌─────────────────────────────────────────────┐
│ Nueva Regla de Alerta                    [X]│
├─────────────────────────────────────────────┤
│                                             │
│ Evento *                                    │
│ [v] Login desde nueva IP                    │
│   ▼ Login desde nueva IP                   │
│     Login fallido                           │
│     Password cambiado                       │
│     Permiso modificado                      │
│     Backup fallido                          │
│     Eliminación masiva                      │
│                                             │
│ Condición (opcional)                        │
│ ┌─────────────────────────────────────────┐ │
│ │ user.role IN ['director', 'finance']    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Acciones                                    │
│ ☑️ Enviar email                             │
│ ☑️ Enviar SMS                               │
│ ☐ Crear ticket de soporte                  │
│ ☐ Bloquear usuario temporalmente            │
│                                             │
│ Destinatarios                               │
│ ┌─────────────────────────────────────────┐ │
│ │ director@constructora.com               │ │
│ │ seguridad@constructora.com        [+ ]  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Severidad                                   │
│ ◉ Alta  ○ Media  ○ Baja                    │
│                                             │
│        [Cancelar]  [Crear Regla]            │
└─────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Cambiar Política de Password

**Precondiciones:**
- Política actual: 8 caracteres mínimos

**Pasos:**
1. Ir a "Seguridad > Políticas de Password"
2. Cambiar a 12 caracteres mínimos
3. Habilitar requerir carácter especial
4. Guardar

**Resultado Esperado:**
- ✅ Política actualizada inmediatamente
- ✅ Nuevos usuarios deben cumplir nueva política
- ✅ Usuarios existentes reciben notificación
- ✅ Audit log registra cambio

### CP-002: Bloqueo por Intentos Fallidos

**Precondiciones:**
- Política: 5 intentos, bloqueo 30 min

**Pasos:**
1. Intentar login con password incorrecto 5 veces
2. Verificar estado de cuenta

**Resultado Esperado:**
- ✅ Después de 3 intentos: muestra captcha
- ✅ Después de 5 intentos: cuenta bloqueada por 30 min
- ✅ Mensaje: "Cuenta bloqueada por intentos fallidos"
- ✅ Email de alerta enviado al usuario
- ✅ Audit log registra bloqueo

### CP-003: Revocar Sesión Activa

**Precondiciones:**
- Usuario "Juan" tiene sesión activa

**Pasos:**
1. Ir a "Sesiones Activas"
2. Clic "Revocar" en sesión de Juan
3. Confirmar

**Resultado Esperado:**
- ✅ Sesión cerrada inmediatamente
- ✅ Juan desconectado del sistema
- ✅ Debe hacer login nuevamente
- ✅ Email enviado a Juan notificando
- ✅ Audit log registra revocación

### CP-004: Alerta de Login desde Nueva IP

**Precondiciones:**
- Regla: Alertar login desde nueva IP para directores

**Pasos:**
1. Director hace login desde IP nunca antes usada
2. Verificar alertas

**Resultado Esperado:**
- ✅ Email enviado a director
- ✅ Email incluye IP, ubicación, dispositivo
- ✅ Opción para "Bloquear esta sesión" en email
- ✅ Audit log registra alerta

### CP-005: IP Bloqueada en Blacklist

**Precondiciones:**
- IP 203.0.113.10 agregada a blacklist

**Pasos:**
1. Intentar login desde IP bloqueada

**Resultado Esperado:**
- ✅ Login bloqueado inmediatamente
- ✅ Mensaje: "Acceso denegado desde esta ubicación"
- ✅ No se registra intento de login (bloqueado en firewall)
- ✅ Audit log registra intento bloqueado

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-005: PasswordPolicyService implementado
- ET-ADM-005: SessionSecurityService implementado
- ET-ADM-005: RateLimitGuard implementado
- Redis para tracking de intentos de login

**APIs Necesarias:**
- `GET /api/admin/security/policies` - Obtener políticas
- `PUT /api/admin/security/policies` - Actualizar políticas
- `GET /api/admin/security/sessions` - Sesiones activas
- `DELETE /api/admin/security/sessions/:id` - Revocar sesión
- `POST /api/admin/security/alert-rules` - Crear regla de alerta
- `GET /api/admin/security/ip-whitelist` - Gestionar whitelist/blacklist

---

## 📊 Métricas de Éxito

- **Passwords que cumplen política:** 100%
- **Tiempo de bloqueo después de 5 intentos:** <1 segundo
- **Alertas enviadas:** 100% de eventos configurados
- **Sesiones revocadas:** <5 segundos

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
