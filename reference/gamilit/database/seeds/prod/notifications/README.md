# Notification Templates Seeds - Documentación

**Fecha:** 2025-11-13
**Relacionado:** DB-115 (Validación de alineación Database)
**Schema:** notifications
**Feature:** EXT-003 (Sistema Multi-Canal de Notificaciones)

---

## 📋 Descripción General

Este directorio contiene los seeds de producción para la tabla `notifications.notification_templates`, que almacena plantillas reutilizables para el sistema multi-canal de notificaciones de Gamilit.

**Archivo principal:** `01-notification_templates.sql`

**Templates incluidos:** 8 plantillas de producción

---

## 🎯 Propósito

Las plantillas de notificación permiten:

1. **Consistencia**: Mensajes uniformes en toda la plataforma
2. **Mantenibilidad**: Actualizar mensajes sin modificar código
3. **Multi-idioma**: Preparado para internacionalización futura
4. **Multi-canal**: Soporte para email, push, in-app simultáneamente
5. **Variables dinámicas**: Interpolación de datos personalizados

---

## 📬 Templates Disponibles

### 1. `welcome_email` - Bienvenida al Usuario

**Propósito:** Mensaje de bienvenida para usuarios nuevos

**Canales:** Email únicamente

**Variables:**
- `user_name`: Nombre completo del usuario
- `user_email`: Correo electrónico del usuario

**Uso recomendado:** Enviar tras registro exitoso o activación de cuenta

**Ejemplo de uso:**
```typescript
await notificationService.send({
  templateKey: 'welcome_email',
  userId: newUser.id,
  variables: {
    user_name: 'María García',
    user_email: 'maria@example.com'
  }
});
```

---

### 2. `new_assignment` - Nueva Asignación

**Propósito:** Notificar asignación creada por profesor

**Canales:** Email, Push, In-app (multi-canal)

**Variables:**
- `student_name`: Nombre del estudiante
- `teacher_name`: Nombre del profesor
- `assignment_title`: Título de la asignación
- `assignment_description`: Descripción breve
- `due_date`: Fecha de entrega (formato ISO o localizado)
- `module_name`: Nombre del módulo educativo
- `assignment_url`: URL directa a la asignación

**Uso recomendado:** Enviar inmediatamente después de que profesor crea asignación

**Ejemplo de uso:**
```typescript
await notificationService.sendToMultipleUsers({
  templateKey: 'new_assignment',
  userIds: assignedStudentIds,
  variables: {
    student_name: '{{user.name}}', // interpolado por usuario
    teacher_name: 'Prof. Juan Pérez',
    assignment_title: 'Módulo 3: Análisis de Sesgos',
    assignment_description: 'Completar ejercicios 1-5 sobre identificación de sesgos cognitivos',
    due_date: '2025-11-20',
    module_name: 'Pensamiento Crítico',
    assignment_url: 'https://gamilit.com/student/assignments/abc123'
  }
});
```

---

### 3. `assignment_reminder` - Recordatorio de Asignación

**Propósito:** Recordar asignación próxima a vencer

**Canales:** Email, Push (alto impacto)

**Variables:**
- `student_name`: Nombre del estudiante
- `assignment_title`: Título de la asignación
- `hours_remaining`: Horas restantes (ej: "24", "12", "3")
- `due_date`: Fecha de entrega
- `completion_status`: Estado (ej: "0/5 ejercicios", "50% completado")
- `assignment_url`: URL directa

**Uso recomendado:** Sistema de cron jobs que verifica asignaciones a 24h, 12h, 3h de vencimiento

**Ejemplo de uso:**
```typescript
await notificationService.send({
  templateKey: 'assignment_reminder',
  userId: student.id,
  variables: {
    student_name: 'Carlos Ruiz',
    assignment_title: 'Módulo 3: Análisis de Sesgos',
    hours_remaining: '12',
    due_date: '2025-11-20 23:59',
    completion_status: '3/5 ejercicios completados',
    assignment_url: 'https://gamilit.com/student/assignments/abc123'
  }
});
```

---

### 4. `achievement_unlocked` - Logro Desbloqueado

**Propósito:** Celebrar logro conseguido por estudiante

**Canales:** In-app, Push (gamificación)

**Variables:**
- `student_name`: Nombre del estudiante
- `achievement_name`: Nombre del logro (ej: "Primera Racha de 7 Días")
- `achievement_description`: Descripción del logro
- `achievement_icon`: Emoji o código de ícono
- `ml_coins_earned`: Cantidad de ML Coins ganados

**Uso recomendado:** Enviar inmediatamente cuando trigger de achievement se dispara

**Ejemplo de uso:**
```typescript
await notificationService.send({
  templateKey: 'achievement_unlocked',
  userId: student.id,
  variables: {
    student_name: 'Ana Torres',
    achievement_name: 'Maestro del Pensamiento Crítico',
    achievement_description: 'Completaste todos los ejercicios del Módulo 3 con puntaje perfecto',
    achievement_icon: '🏆',
    ml_coins_earned: '500'
  }
});
```

---

### 5. `teacher_message` - Mensaje del Profesor

**Propósito:** Mensaje directo de profesor a estudiante

**Canales:** Email, In-app

**Variables:**
- `student_name`: Nombre del estudiante
- `teacher_name`: Nombre del profesor
- `message_subject`: Asunto del mensaje
- `message_body`: Cuerpo del mensaje (puede incluir HTML simple)
- `reply_url`: URL para responder

**Uso recomendado:** Cuando profesor envía mensaje directo desde plataforma

---

### 6. `team_invitation` - Invitación a Equipo

**Propósito:** Invitar estudiante a unirse a equipo/grupo

**Canales:** Email, In-app, Push

**Variables:**
- `student_name`: Nombre del estudiante invitado
- `team_name`: Nombre del equipo
- `inviter_name`: Nombre de quien invita
- `team_description`: Descripción del equipo
- `invitation_url`: URL para aceptar/rechazar

**Uso recomendado:** Cuando estudiante es invitado a equipo colaborativo

---

### 7. `exercise_feedback` - Retroalimentación de Ejercicio

**Propósito:** Notificar que profesor calificó ejercicio

**Canales:** Email, In-app

**Variables:**
- `student_name`: Nombre del estudiante
- `exercise_title`: Título del ejercicio
- `teacher_name`: Nombre del profesor
- `score`: Puntaje obtenido (ej: "85/100")
- `feedback_text`: Comentarios del profesor
- `submission_url`: URL para ver detalles

**Uso recomendado:** Enviar cuando profesor termina de calificar

---

### 8. `streak_milestone` - Hito de Racha

**Propósito:** Celebrar racha de días consecutivos

**Canales:** In-app, Push (gamificación)

**Variables:**
- `student_name`: Nombre del estudiante
- `streak_days`: Número de días consecutivos (ej: "7", "30", "100")
- `streak_emoji`: Emoji representativo
- `bonus_coins`: ML Coins de bonificación
- `next_milestone`: Próximo hito (ej: "30 días")

**Uso recomendado:** Sistema diario que verifica rachas y celebra hitos (7, 14, 30, 60, 100 días)

---

## 🔧 Estructura de Template

Cada template contiene los siguientes campos:

```sql
INSERT INTO notifications.notification_templates (
    template_key,           -- Identificador único (NO modificar)
    name,                   -- Nombre descriptivo
    description,            -- Propósito del template
    subject_template,       -- Asunto (para email/in-app)
    body_template,          -- Versión texto plano
    html_template,          -- Versión HTML (para email)
    variables,              -- Array JSONB de variables requeridas
    default_channels,       -- Canales predeterminados: ['in_app', 'email', 'push']
    is_active               -- true/false (permite deshabilitar sin borrar)
) VALUES (...);
```

---

## 📐 Sistema de Variables

### Sintaxis de Interpolación

Las variables se definen con doble llave: `{{variable_name}}`

**Ejemplo:**
```
Hola {{student_name}}, tu asignación "{{assignment_title}}" vence el {{due_date}}.
```

### Variables Obligatorias vs Opcionales

- **Obligatorias**: Listadas en campo `variables` de cada template
- **Opcionales**: Pueden incluirse en texto pero no son requeridas
- **Validación**: Backend debe validar que todas las variables obligatorias están presentes

### Variables del Sistema (Auto-inyectadas)

El sistema automáticamente agrega:
- `{{system.date}}`: Fecha actual
- `{{system.time}}`: Hora actual
- `{{system.platform_url}}`: URL base de la plataforma
- `{{user.id}}`: ID del usuario receptor (automático)

---

## 🎨 Personalización de Templates

### Para Modificar un Template Existente

1. **NO modificar `template_key`** (es el identificador único)
2. Actualizar `body_template` y/o `html_template` según necesidad
3. Si agregas variables nuevas, actualizar campo `variables`
4. Ejecutar ALTER UPDATE en base de datos

**Ejemplo:**
```sql
UPDATE notifications.notification_templates
SET body_template = 'Nuevo texto con {{new_variable}}',
    variables = variables || '["new_variable"]'::jsonb
WHERE template_key = 'welcome_email';
```

### Para Agregar Nuevo Template

1. Agregar INSERT en `01-notification_templates.sql`
2. Documentar en este README
3. Actualizar contador en comentario final del archivo SQL
4. Re-ejecutar seeds en desarrollo para validar

---

## 🧪 Templates de Testing (DEV)

En ambiente de desarrollo, además de los 8 templates de producción, existen 3 templates adicionales para testing:

1. **`test_notification`**: Template simple para pruebas básicas
2. **`test_all_variables`**: Template con máxima cantidad de variables (validación de interpolación)
3. **`test_multichannel`**: Template para probar envío simultáneo por múltiples canales

Estos templates están definidos en `apps/database/seeds/dev/notifications/01-notification_templates.sql`

---

## 🔗 Integración con Backend

### Uso desde NestJS

```typescript
// apps/backend/src/modules/notifications/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';

@Injectable()
export class NotificationService {
  async sendFromTemplate(
    templateKey: string,
    userId: string,
    variables: Record<string, string>,
    channels?: string[]
  ) {
    // 1. Obtener template de BD
    const template = await this.templatesRepo.findOne({
      where: { templateKey, isActive: true }
    });

    // 2. Validar variables requeridas
    this.validateVariables(template.variables, variables);

    // 3. Interpolar variables en templates
    const subject = this.interpolate(template.subjectTemplate, variables);
    const body = this.interpolate(template.bodyTemplate, variables);
    const html = this.interpolate(template.htmlTemplate, variables);

    // 4. Usar canales del template o sobreescribir
    const finalChannels = channels || template.defaultChannels;

    // 5. Llamar a SQL function send_notification()
    await this.db.query(`
      SELECT notifications.send_notification(
        $1::uuid,  -- user_id
        $2::text,  -- title
        $3::text,  -- content
        $4::text,  -- notification_type
        $5::text[]  -- channels
      )
    `, [userId, subject, body, templateKey, finalChannels]);
  }
}
```

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Templates de producción | 8 |
| Templates de desarrollo | 3 |
| Total templates | 11 |
| Variables únicas | 28+ |
| Canales soportados | 3 (in_app, email, push) |
| Templates multi-canal | 3 |
| Templates solo email | 1 |
| Templates gamificación | 3 |

---

## 🔍 Relación con Otras Tablas

```
notification_templates (esta tabla)
    ↓ (es utilizada por)
notifications.notifications
    → Crea notificaciones usando template_key como referencia
    → Aplica variables específicas del contexto
    → Respeta default_channels del template (o sobreescribe)
```

---

## 📚 Referencias

- **Schema completo:** `apps/database/ddl/schemas/notifications/`
- **Funciones SQL:** `send_notification()`, `get_user_preferences()`, `queue_batch_notifications()`
- **Documentación EXT-003:** Ver `orchestration/features/EXT-003/` (si existe)
- **Backend entities:** `apps/backend/src/modules/notifications/entities/` (pendiente implementación)

---

## ⚠️ Estado Actual (2025-11-13)

**Status de Implementación:**

- ✅ **Database (DDL):** 100% implementado (6 tablas, 3 funciones)
- ✅ **Seeds:** 100% implementado (8 templates prod + 3 test)
- ⚠️ **Backend:** 0% implementado (GAP crítico - P0)
- ⚠️ **Frontend:** 0% implementado (depende de Backend)

**Próximos pasos:**
1. Backend Agent debe implementar módulo completo (entities, services, controllers)
2. Frontend Agent debe integrar consumo de API multi-canal
3. Configurar proveedores externos (SendGrid para email, Firebase para push)

Ver: `orchestration/database/DB-115/REPORTE-FINAL-ALINEACION.md` para más detalles

---

**Última actualización:** 2025-11-13
**Responsable:** Database Agent
**Relacionado:** DB-115 (Validación de alineación)
