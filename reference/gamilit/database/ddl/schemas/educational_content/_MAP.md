# Schema: educational_content

Contenido educativo: módulos, ejercicios, assignments, recursos multimedia

## Estructura

- **tables/**: 14 archivos (2 deprecated: exercise_answers, exercise_options)
- **enums/**: 3 archivos
- **functions/**: 3 archivos
- **triggers/**: 4 archivos
- **indexes/**: 16 archivos
- **rls-policies/**: 2 archivos

**Total:** 42 objetos activos

## Contenido Detallado

### tables/ (14 archivos activos)

```
01-modules.sql
02-exercises.sql
03-assessment_rubrics.sql
04-media_resources.sql
05-assignments.sql
06-assignment_exercises.sql
07-assignment_students.sql
08-assignment_submissions.sql
content_approvals.sql
content_metadata.sql
content_tags.sql
module_dependencies.sql
taxonomies.sql
20-difficulty_criteria.sql               # ✨ NUEVO 2025-11-11 (GAP-3)
```

**DEPRECATED (moved to _deprecated/):**
- exercise_answers.sql - Eliminado 2025-11-11 (modelo dual JSONB puro)
- exercise_options.sql - Eliminado 2025-11-11 (modelo dual JSONB puro)

### enums/ (3 archivos)

```
bloom_taxonomy.sql
difficulty_level.sql
exercise_mechanic.sql
```

### functions/ (3 archivos)

```
calculate_learning_path.sql
get_recommended_missions.sql
validate_exercise_structure.sql
```

### triggers/ (4 archivos)

```
11-trg_assessment_rubrics_updated_at.sql
12-trg_exercises_updated_at.sql
13-trg_media_resources_updated_at.sql
14-trg_modules_updated_at.sql
```

### indexes/ (16 archivos)

```
idx_assignment_classrooms_assignment_id.sql
idx_assignment_classrooms_classroom_id.sql
idx_assignment_exercises_assignment_id.sql
idx_assignment_exercises_exercise_id.sql
idx_assignment_exercises_order.sql
idx_assignment_students_assignment_id.sql
idx_assignment_students_student_id.sql
idx_assignment_submissions_assignment_id.sql
idx_assignment_submissions_graded_by.sql
idx_assignment_submissions_status.sql
idx_assignment_submissions_student_id.sql
idx_assignment_submissions_submitted_at.sql
idx_assignments_due_date.sql
idx_assignments_is_published.sql
idx_assignments_teacher_id.sql
idx_assignments_type.sql
```

### rls-policies/ (2 archivos)

```
01-enable-rls.sql
02-modules-exercises-policies.sql
```

---

## Seeds PROD (3 archivos + 2 deprecados)

### Activos

```
01-modules.sql                    # 5 módulos educativos
03-exercises-complete.sql         # 85 ejercicios con config JSONB (v3.0 corregida)
06-exercise-answers.sql           # Respuestas para completar, crucigrama, verdadero_falso (v2.0 corregida)
```

### Deprecados

```
_deprecated/04-exercise-mechanics.sql.deprecated     # Tabla no existe en DDL
_deprecated/05-exercise-options.sql.deprecated       # Tipos actuales no usan options
_deprecated/README.md                                # Documentación de deprecación
```

**Distribución de ejercicios:**
- Módulo 1-5: 17 ejercicios cada uno = 85 total
- Tipos: verdadero_falso (20%), completar_espacios (18%), crucigrama (18%), emparejamiento (24%), comprension_auditiva (18%)
- Dificultad CEFR: beginner (35%), intermediate (35%), advanced (30%)
- Cada ejercicio incluye config JSONB específico para su tipo

---

**Última actualización:** 2025-11-11 (Correcciones DB-090, seeds validados contra DDL)
**Reorganización:** 2025-11-09

## Changelog

### 2025-11-11 - DB-090 Correcciones de Seeds
- ✅ **Seeds corregidos**: 03-exercises-complete.sql (v3.0) y 06-exercise-answers.sql (v2.0)
  - Usar exercise_type (no mechanic_type)
  - Usar valores correctos del ENUM exercise_type
  - Agregar order_index y config JSONB
  - Estructura DDL correcta en exercise_answers
- 🗑️ **Seeds deprecados**: 04-exercise-mechanics.sql y 05-exercise-options.sql
  - Tabla exercise_mechanics no existe en DDL
  - Tipos actuales no requieren exercise_options
- 📝 **Documentación**: README.md en _deprecated/ explica razones
- **Validación**: 100% compatible con DDL actual

### 2025-11-11 - GAP-3 Migración CEFR
- ✨ **1 tabla nueva**: difficulty_criteria (configuración niveles CEFR A1-Nativo)
- 🔄 **ENUM difficulty_level actualizado**: Migrado de valores genéricos a estándar CEFR internacional
  - Antes: very_easy, easy, medium, hard, very_hard (+ otros)
  - Ahora: beginner (A1), elementary (A2), pre_intermediate (B1), intermediate (B2), upper_intermediate (C1), advanced (C2), proficient (C2+), native
  - **Breaking change**: No backward compatible
- Define criterios por nivel: vocab_range, sentence_length, time_multiplier, base_xp/coins, promotion_criteria
- **Total objetos**: 43 → 44

### 2025-11-09 - Reorganización DDL
- Reorganización completa de estructura de schemas
