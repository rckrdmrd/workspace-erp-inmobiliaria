# Schema: social_features

Características sociales: aulas, equipos, miembros, interacciones

## Estructura

- **tables/**: 15 archivos
- **enums/**: 1 archivos
- **functions/**: 1 archivos
- **triggers/**: 5 archivos
- **rls-policies/**: 8 archivos

**Total:** 30 objetos

## Contenido Detallado

### tables/ (15 archivos)

```
01-friendships.sql
02-schools.sql
03-classrooms.sql
04-classroom_members.sql
05-teams.sql
06-team_members.sql
07-team_challenges.sql
11-peer_challenges.sql
12-challenge_participants.sql
13-challenge_results.sql
assignment_classrooms.sql
discussion_threads.sql
social_interactions.sql
teacher_classrooms.sql
user_follows.sql
```

### enums/ (1 archivos)

```
social_event_type.sql
```

### functions/ (1 archivos)

```
cleanup_old_notifications.sql
```

### triggers/ (5 archivos)

```
24-trg_classroom_members_updated_at.sql
25-trg_update_classroom_count.sql
26-trg_classrooms_updated_at.sql
27-trg_schools_updated_at.sql
28-trg_teams_updated_at.sql
```

### rls-policies/ (8 archivos)

```
01-enable-rls.sql
02-policies.sql
02-schools-policies.sql
03-classrooms-policies.sql
03-grants.sql
04-classroom-members-policies.sql
05-friendships-policies.sql
06-teams-policies.sql
```

---

**Última actualización:** 2025-11-09
**Reorganización:** 2025-11-09
