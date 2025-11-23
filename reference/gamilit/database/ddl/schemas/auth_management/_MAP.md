# Schema: auth_management

Gestión de autenticación y autorización: usuarios, roles, perfiles, sesiones

## Estructura

- **tables/**: 15 archivos
- **functions/**: 6 archivos
- **triggers/**: 6 archivos
- **indexes/**: 11 archivos
- **rls-policies/**: 1 archivos

**Total:** 39 objetos

## Contenido Detallado

### tables/ (15 archivos)

```
01-tenants.sql
02-auth_attempts.sql
03-profiles.sql
04-roles.sql
05-auth_providers.sql
06-email_verification_tokens.sql
07-password_reset_tokens.sql
08-security_events.sql
09-user_preferences.sql
10-memberships.sql
11-user_sessions.sql
12-user_suspensions.sql
14-parent_accounts.sql
15-parent_student_links.sql
16-parent_notifications.sql
```

### functions/ (6 archivos)

```
01-assign_role_to_user.sql
02-get_user_role.sql
03-verify_user_permission.sql
04-remove_role_from_user.sql
05-hash_token.sql
06-update_user_preferences.sql
```

### triggers/ (6 archivos)

```
02-trg_memberships_updated_at.sql
03-trg_audit_profile_changes.sql
04-trg_initialize_user_stats.sql
05-trg_profiles_updated_at.sql
06-trg_tenants_updated_at.sql
07-trg_user_roles_updated_at.sql
```

### indexes/ (11 archivos)

```
01-idx_user_preferences_theme.sql
02-idx_user_roles_permissions_gin.sql
idx_user_roles_role.sql
idx_user_roles_tenant_id.sql
idx_user_roles_user_id.sql
idx_user_sessions_active.sql
idx_user_sessions_expires.sql
idx_user_sessions_refresh_token_hash.sql
idx_user_sessions_session_token_hash.sql
idx_user_sessions_token.sql
idx_user_sessions_user_id.sql
```

### rls-policies/ (1 archivos)

```
01-policies.sql
```

---

**Última actualización:** 2025-11-09
**Reorganización:** 2025-11-09
