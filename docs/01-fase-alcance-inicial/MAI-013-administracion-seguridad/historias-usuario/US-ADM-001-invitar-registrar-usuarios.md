# US-ADM-001: Invitar y Registrar Usuarios

**ID:** US-ADM-001  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-001, ET-ADM-001  
**Prioridad:** Alta  
**Story Points:** 8

---

## 📖 Historia de Usuario

**Como** Director General o RH de una constructora  
**Quiero** invitar nuevos usuarios por email y que puedan registrarse con un rol específico  
**Para** incorporar al equipo sin permitir registros públicos y mantener control sobre quién accede al sistema

---

## ✅ Criterios de Aceptación

### 1. Enviar Invitación

```gherkin
Given que soy Director General o RH con permisos de gestión de usuarios
When accedo a la sección "Usuarios" y hago clic en "Invitar Usuario"
And completo el formulario con:
  - Email del invitado
  - Rol a asignar (director, engineer, resident, etc.)
  - Mensaje personalizado (opcional)
And hago clic en "Enviar Invitación"
Then el sistema debe:
  - Generar un token único con expiración de 7 días
  - Enviar email con el link de registro
  - Mostrar el usuario como "Invitado (Pendiente)" en la lista
  - Registrar la acción en el audit log
```

### 2. Registro desde Invitación

```gherkin
Given que recibí un email de invitación válido
When hago clic en el link de registro
Then debo ser redirigido a un formulario pre-llenado con:
  - Email (no editable)
  - Nombre completo
  - Password (con validación de política)
  - Confirmar password
  - Aceptar términos y condiciones
When completo el formulario y hago clic en "Crear Cuenta"
Then el sistema debe:
  - Validar que el token no haya expirado
  - Validar que el password cumpla la política
  - Crear la cuenta con status "active"
  - Invalidar el token de invitación
  - Enviar email de bienvenida
  - Permitir login inmediato
```

### 3. Token Expirado

```gherkin
Given que recibí una invitación hace más de 7 días
When intento acceder al link de registro
Then debo ver un mensaje: "Esta invitación ha expirado"
And un botón "Solicitar Nueva Invitación"
When hago clic en "Solicitar Nueva Invitación"
Then se debe enviar un email al administrador notificando la solicitud
```

### 4. Validaciones de Email

```gherkin
Given que estoy enviando una invitación
When ingreso un email que ya está registrado
Then debo ver un error: "Este email ya tiene una cuenta activa"
And no se debe enviar la invitación

Given que un email ya tiene una invitación pendiente
When intento invitar al mismo email nuevamente
Then debo ver un mensaje: "Este usuario ya tiene una invitación pendiente"
And opciones para:
  - "Reenviar invitación"
  - "Cancelar invitación anterior y crear nueva"
```

### 5. Lista de Invitaciones

```gherkin
Given que soy administrador
When accedo a "Usuarios > Invitaciones Pendientes"
Then debo ver una tabla con:
  - Email invitado
  - Rol asignado
  - Enviado por
  - Fecha de envío
  - Expira en (countdown)
  - Estado (Pendiente, Expirado, Aceptado)
  - Acciones: Reenviar, Cancelar
```

---

## 🎨 Mockup / Wireframe

### Formulario de Invitación

```
┌─────────────────────────────────────────────┐
│ Invitar Nuevo Usuario                    [X]│
├─────────────────────────────────────────────┤
│                                             │
│ Email *                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ usuario@ejemplo.com                     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Rol *                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ [v] Ingeniero                           │ │
│ └─────────────────────────────────────────┘ │
│   ▼ Director General                        │
│     Ingeniero                               │
│     Residente de Obra                       │
│     Compras                                 │
│     Finanzas                                │
│     RH                                      │
│     Post-venta                              │
│                                             │
│ Mensaje Personalizado (opcional)            │
│ ┌─────────────────────────────────────────┐ │
│ │ Te invitamos a unirte a nuestro equipo  │ │
│ │ en el sistema...                        │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│        [Cancelar]  [Enviar Invitación]      │
└─────────────────────────────────────────────┘
```

### Página de Registro (desde invitación)

```
┌─────────────────────────────────────────────┐
│            🏢 Logo Constructora             │
│                                             │
│   Bienvenido a [Nombre Constructora]        │
│   Has sido invitado como: Ingeniero         │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Email                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ usuario@ejemplo.com          [bloqueado]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Nombre Completo *                           │
│ ┌─────────────────────────────────────────┐ │
│ │ Juan Pérez                              │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Crear Password *                            │
│ ┌─────────────────────────────────────────┐ │
│ │ ••••••••••••                     [👁️]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Fuerza: ████████░░ Buena                │ │
│ │ ✓ Al menos 12 caracteres                │ │
│ │ ✓ Contiene mayúscula                    │ │
│ │ ✓ Contiene minúscula                    │ │
│ │ ✓ Contiene número                       │ │
│ │ ✗ Contiene carácter especial            │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Confirmar Password *                        │
│ ┌─────────────────────────────────────────┐ │
│ │ ••••••••••••                     [👁️]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ☑️ Acepto los términos y condiciones       │
│ ☑️ Acepto el aviso de privacidad           │
│                                             │
│         [Crear Mi Cuenta]                   │
│                                             │
│   La invitación expira en: 5 días 3 horas  │
└─────────────────────────────────────────────┘
```

### Lista de Invitaciones Pendientes

```
┌───────────────────────────────────────────────────────────┐
│ Invitaciones Pendientes                [+ Invitar Usuario]│
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Email                Rol        Enviado por    Expira en │
│ ─────────────────────────────────────────────────────────│
│ juan@mail.com       Ingeniero   María López    2 días    │
│                                              [Reenviar][X]│
│                                                           │
│ ana@mail.com        Residente   María López    5 días    │
│                                              [Reenviar][X]│
│                                                           │
│ pedro@mail.com      Compras     María López    Expirado  │
│                                         [Nueva Invitación]│
└───────────────────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Invitación Exitosa

**Precondiciones:**
- Usuario autenticado con rol "director" o "hr"
- Email no existe en el sistema

**Pasos:**
1. Navegar a "Usuarios > Invitar Usuario"
2. Ingresar email: "nuevo@test.com"
3. Seleccionar rol: "engineer"
4. Ingresar mensaje: "Bienvenido al equipo"
5. Clic en "Enviar Invitación"

**Resultado Esperado:**
- ✅ Mensaje: "Invitación enviada exitosamente"
- ✅ Email recibido en "nuevo@test.com" con link válido
- ✅ Usuario aparece en lista de invitaciones pendientes
- ✅ Audit log registra: "invitation_sent"

### CP-002: Registro con Invitación Válida

**Precondiciones:**
- Invitación enviada y no expirada
- Token válido en URL

**Pasos:**
1. Abrir link de invitación desde email
2. Ingresar nombre: "Juan Pérez"
3. Ingresar password: "SecurePass123!@#"
4. Confirmar password: "SecurePass123!@#"
5. Aceptar términos
6. Clic en "Crear Mi Cuenta"

**Resultado Esperado:**
- ✅ Cuenta creada con status "active"
- ✅ Invitación marcada como "aceptada"
- ✅ Email de bienvenida enviado
- ✅ Redirige a login o dashboard
- ✅ Puede iniciar sesión inmediatamente

### CP-003: Token Expirado

**Precondiciones:**
- Invitación enviada hace más de 7 días

**Pasos:**
1. Abrir link de invitación expirada

**Resultado Esperado:**
- ✅ Muestra mensaje: "Esta invitación ha expirado"
- ✅ Botón para solicitar nueva invitación visible
- ✅ No permite completar registro

### CP-004: Email Duplicado

**Precondiciones:**
- Usuario con email "existente@test.com" ya registrado

**Pasos:**
1. Intentar invitar a "existente@test.com"

**Resultado Esperado:**
- ✅ Error: "Este email ya tiene una cuenta activa"
- ✅ No se envía email
- ✅ No se crea invitación

### CP-005: Password Débil

**Precondiciones:**
- En página de registro desde invitación

**Pasos:**
1. Ingresar password: "12345"
2. Intentar crear cuenta

**Resultado Esperado:**
- ✅ Errores de validación mostrados:
  - "Password debe tener al menos 12 caracteres"
  - "Debe contener mayúscula, minúscula, número y carácter especial"
- ✅ Botón "Crear Cuenta" deshabilitado
- ✅ No se crea la cuenta

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-001: Modelo de base de datos implementado
- ET-ADM-005: Políticas de password configuradas
- Servicio de email configurado (SendGrid/SES)

**APIs Necesarias:**
- `POST /api/admin/users/invite`
- `POST /api/auth/register-from-invitation`
- `GET /api/admin/invitations`
- `POST /api/admin/invitations/:id/resend`
- `DELETE /api/admin/invitations/:id`

**Componentes Frontend:**
- InviteUserModal
- RegisterFromInvitation
- InvitationsList
- PasswordStrengthMeter

---

## 📊 Métricas de Éxito

- **Tasa de conversión:** >80% de invitaciones aceptadas dentro de 7 días
- **Tiempo promedio de registro:** <3 minutos desde apertura del link
- **Tasa de error en registro:** <5%
- **Passwords que cumplen política:** 100%

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
