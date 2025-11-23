# Schema: public

**Estado:** DESHABILITADO (vacío intencionalmente)

## Propósito

El schema `public` está reservado para objetos del core de PostgreSQL y extensiones.
**NO debe contener objetos propios de la aplicación Gamilit.**

## Historia

- **2025-11-02**: Se crearon 3 vistas en public (assignment_submission_stats, classroom_overview, number_series)
- **2025-11-11**: Vistas migradas a schemas correctos siguiendo arquitectura de responsabilidades:
  - `assignment_submission_stats` → `admin_dashboard` (vista analítica)
  - `classroom_overview` → `admin_dashboard` (vista analítica)
  - `number_series` → `gamilit` (vista utilitaria)

## Política de Arquitectura

Todos los objetos propios de Gamilit deben ubicarse en schemas específicos según su responsabilidad:

- **Supabase Core**: `auth`, `storage`
- **Application**: `auth_management`, `system_configuration`
- **Domain**: `educational_content`, `gamification_system`, `progress_tracking`, `social_features`, `content_management`
- **Integration/Admin**: `audit_logging`, `admin_dashboard`, `lti_integration`
- **Shared Utilities**: `gamilit`

## Referencia

Ver `create-database.sh` Fase 15 - public schema comentado intencionalmente.

---

**Última actualización:** 2025-11-11
**Razón:** Migración completa de objetos a schemas correctos
