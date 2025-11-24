# Seeds Deprecados - educational_content

Este directorio contiene seeds que fueron retirados por problemas de compatibilidad con DDL o porque no aplican a los tipos de ejercicios actuales.

---

## 04-exercise-mechanics.sql.deprecated

**Fecha de deprecación:** 2025-11-11
**Razón:** Tabla `exercise_mechanics` NO EXISTE en DDL

### Problema

Este seed intentaba insertar datos en una tabla `educational_content.exercise_mechanics` que nunca fue creada en el DDL.

### Causa Raíz

La configuración de mecánicas ya está integrada en la tabla `exercises`:
- Campo `exercise_type`: Tipo de ejercicio (ENUM)
- Campo `config`: Configuración JSONB específica para cada tipo

### Solución Aplicada

La configuración de mecánicas fue consolidada en el seed `03-exercises-complete.sql` usando el campo `config` JSONB.

Ejemplo:
```sql
config := jsonb_build_object(
    'blanks_count', 3,
    'case_sensitive', false,
    'accept_synonyms', true
)
```

### Referencias

- **Validación:** `orchestration/database/DB-090/06-VALIDACION-PROFUNDA-CRITICA.md`
- **Corrección:** `orchestration/database/DB-090/07-REPORTE-CORRECCIONES-APLICADAS.md`

---

## 05-exercise-options.sql.deprecated

**Fecha de deprecación:** 2025-11-11
**Razón:** Tipos de ejercicios actuales NO USAN `exercise_options`

### Problema

Este seed creaba opciones para ejercicios tipo `multiple_choice`, pero los ejercicios actuales usan tipos diferentes:
- `verdadero_falso`: Usa solo True/False (no necesita options)
- `completar_espacios`: Usa texto libre (no necesita options)
- `crucigrama`: Usa palabras específicas (no necesita options)
- `emparejamiento`: Usa pares en campo `content` JSONB
- `comprension_auditiva`: Usa respuestas en `exercise_answers`

### Causa Raíz

El seed original asumía que habría ejercicios tipo `multiple_choice` (de exercise_mechanic ENUM), pero los ejercicios actuales usan tipos específicos del ENUM `exercise_type` que tienen estructuras diferentes.

### Solución Aplicada

Las opciones/respuestas se manejan según el tipo:
- Para tipos con opciones: usar campo `content` JSONB
- Para respuestas abiertas: usar tabla `exercise_answers`

### Referencias

- **Validación:** `orchestration/database/DB-090/06-VALIDACION-PROFUNDA-CRITICA.md`
- **Corrección:** `orchestration/database/DB-090/07-REPORTE-CORRECCIONES-APLICADAS.md`

### Nota Futura

Si se agregan ejercicios con opciones múltiples (ej: `quiz_tiktok` con opciones), este seed puede ser adaptado reemplazando el filtro:
```sql
WHERE exercise_type IN ('quiz_tiktok', 'otro_con_opciones')
```

---

**Nota:** Estos archivos se mantienen con fines de auditoría. NO ejecutar.
