# Tablas Deprecadas - educational_content

Este directorio contiene tablas que han sido deprecadas y removidas del esquema activo de `educational_content`.

---

## exercise_answers.sql

**Fecha de deprecación:** 2025-11-09
**Razón:** Migración a modelo JSONB puro

### Detalles

La tabla `exercise_answers` fue diseñada para almacenar respuestas correctas de ejercicios de texto libre (fill-in-blank, short answer), pero:

1. **Modelo dual eliminado**: Se migró a un modelo JSONB puro en la tabla `exercises`
2. **Complejidad reducida**: Las respuestas ahora se almacenan en `exercises.content_data` (JSONB)
3. **Mayor flexibilidad**: JSONB permite estructuras personalizadas por tipo de ejercicio
4. **Sin pérdida de funcionalidad**: Toda la información se preserva en el nuevo modelo

### Estructura original

- `answer_text`: Texto de la respuesta correcta
- `is_case_sensitive`: Si la respuesta es sensible a mayúsculas/minúsculas
- `is_exact_match`: Si requiere coincidencia exacta o fuzzy matching
- `alternate_answers`: Array de respuestas alternativas aceptables
- `points_value`: Puntos otorgados por esta respuesta

### Migración a JSONB

**Antes (tabla separada):**
```sql
INSERT INTO exercise_answers (exercise_id, answer_text, is_case_sensitive, alternate_answers)
VALUES ('uuid', 'París', true, ARRAY['Paris', 'paris']);
```

**Después (JSONB):**
```json
{
  "exercise_id": "uuid",
  "content_data": {
    "correct_answer": "París",
    "case_sensitive": true,
    "alternate_answers": ["Paris", "paris"],
    "points": 1
  }
}
```

---

## exercise_options.sql

**Fecha de deprecación:** 2025-11-09
**Razón:** Migración a modelo JSONB puro

### Detalles

La tabla `exercise_options` fue diseñada para almacenar opciones de respuesta de ejercicios de opción múltiple, pero:

1. **Modelo dual eliminado**: Se migró a un modelo JSONB puro en la tabla `exercises`
2. **Reducción de JOINs**: Elimina necesidad de JOIN para obtener opciones
3. **Mayor flexibilidad**: JSONB permite estructuras personalizadas por tipo de ejercicio
4. **Sin pérdida de funcionalidad**: Toda la información se preserva en el nuevo modelo

### Estructura original

- `option_text`: Texto de la opción
- `option_index`: Índice de orden de la opción (0-based)
- `is_correct`: Si la opción es correcta
- `explanation`: Explicación mostrada al seleccionar esta opción

### Migración a JSONB

**Antes (tabla separada):**
```sql
INSERT INTO exercise_options (exercise_id, option_text, option_index, is_correct)
VALUES
  ('uuid', 'París', 0, true),
  ('uuid', 'Londres', 1, false),
  ('uuid', 'Madrid', 2, false);
```

**Después (JSONB):**
```json
{
  "exercise_id": "uuid",
  "content_data": {
    "options": [
      {"text": "París", "is_correct": true, "explanation": "Correcto!"},
      {"text": "Londres", "is_correct": false, "explanation": "No, esa es la capital del Reino Unido"},
      {"text": "Madrid", "is_correct": false, "explanation": "No, esa es la capital de España"}
    ]
  }
}
```

---

## Decisión Arquitectural

**Decisión:** Migración a modelo JSONB puro (DB-096)

**Razones:**
1. ✅ Simplifica estructura (1 tabla vs 3 tablas)
2. ✅ Reduce complejidad de queries (sin JOINs)
3. ✅ Mayor flexibilidad para tipos de ejercicios personalizados
4. ✅ Mejor rendimiento (menos queries)
5. ✅ Más fácil de mantener
6. ✅ JSON es estándar para contenido dinámico

**Trade-offs aceptados:**
- ⚠️ Validación de estructura JSONB en application layer (Backend)
- ⚠️ Índices JSONB para búsquedas específicas

### Migración de datos existentes

Si se necesita migrar datos de las tablas antiguas al nuevo modelo JSONB:

```sql
-- Migrar exercise_answers a exercises.content_data
UPDATE educational_content.exercises e
SET content_data = jsonb_set(
  content_data,
  '{correct_answer}',
  to_jsonb(a.answer_text)
)
FROM educational_content.exercise_answers a
WHERE e.id = a.exercise_id;

-- Migrar exercise_options a exercises.content_data
UPDATE educational_content.exercises e
SET content_data = jsonb_set(
  content_data,
  '{options}',
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'text', o.option_text,
        'is_correct', o.is_correct,
        'explanation', o.explanation
      )
      ORDER BY o.option_index
    )
    FROM educational_content.exercise_options o
    WHERE o.exercise_id = e.id
  )
)
WHERE e.exercise_type = 'multiple_choice';
```

---

## Archivos relacionados

- **Documentación**: `apps/database/README.md` (v2.3.2 - Seeds Production-Ready)
- **Tracking**: `orchestration/TRAZA-CORRECCIONES.md` (CORR-004)
- **Reporte**: Sprint-1 DÍA-8, DÍA-9 (Migración JSONB completa)

---

**Última actualización:** 2025-11-11
**Autor:** Database Agent (DB-108)
**Estado:** Documentado - Archivos mantenidos como referencia histórica
