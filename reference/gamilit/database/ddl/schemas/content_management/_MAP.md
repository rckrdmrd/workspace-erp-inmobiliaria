# Schema: content_management

Gestión de contenido: plantillas, archivos media, metadatos

## Estructura

- **tables/**: 8 archivos
- **enums/**: 4 archivos
- **triggers/**: 3 archivos
- **indexes/**: 2 archivos
- **rls-policies/**: 1 archivos

**Total:** 18 objetos

## Contenido Detallado

### tables/ (8 archivos)

```
01-content_templates.sql
02-marie_curie_content.sql
03-media_files.sql
04-content_versions.sql
05-flagged_content.sql
content_authors.sql
content_categories.sql
media_metadata.sql
```

### enums/ (4 archivos)

```
content_status.sql
content_type.sql
media_type.sql
processing_status.sql
```

### triggers/ (3 archivos)

```
08-trg_content_templates_updated_at.sql
09-trg_marie_curie_content_updated_at.sql
10-trg_media_files_updated_at.sql
```

### indexes/ (2 archivos)

```
01-idx_marie_content_grade_levels_gin.sql
02-idx_marie_content_keywords_gin.sql
```

### rls-policies/ (1 archivos)

```
01-policies.sql
```

---

**Última actualización:** 2025-11-11
**Corrección:** Actualizado conteo de ENUMs (1→4) y total de objetos (15→18)
