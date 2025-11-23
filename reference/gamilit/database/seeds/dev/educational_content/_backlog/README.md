# Seeds en Backlog - Módulos 4 y 5

**Fecha:** 2025-11-19  
**Tarea:** DB-126  
**Estado:** BACKLOG (Fase 4)

## ⚠️ ARCHIVOS EN BACKLOG

Esta carpeta contiene seeds de ejercicios que **NO se cargan** por defecto en `create-database.sh`.

### Archivos

1. **05-exercises-module4.sql** - Módulo 4: Lectura Digital (5 ejercicios)
   - verificador_fake_news
   - infografia_interactiva
   - quiz_tiktok
   - navegacion_hipertextual
   - analisis_memes

2. **06-exercises-module5.sql** - Módulo 5: Producción Lectora (3 ejercicios)
   - diario_multimedia
   - comic_digital
   - video_carta

### Razón del Backlog

Estos ejercicios requieren **evaluación manual o con IA** (no son auto-evaluables con SQL):
- Análisis de imágenes (infografías, memes)
- Verificación de fuentes (fake news)
- Evaluación de producción creativa (comics, videos, diarios)
- Rúbricas de calidad subjetiva

### Estado Actual

- ✅ **Tipos definidos** en `exercise_type` ENUM (compatibilidad futura)
- ✅ **Seeds disponibles** (este directorio)
- ❌ **Validadores SQL:** NO implementados (intencionado)
- ❌ **Auto-evaluable:** `auto_gradable = false`

### Roadmap de Implementación

Ver documentación completa en: `docs/04-fase-backlog/`

**Fases futuras:**
1. **P1:** Validadores parciales (estructura JSONB, completitud, formatos)
2. **P2:** Sistema de revisión manual para profesores
3. **P3:** Integración con IA multimodal (visión, NLP, generación)

### Cómo Usar (Solo Testing)

Si necesitas cargar estos seeds para testing:

```bash
# DEV environment
psql $DATABASE_URL -f seeds/dev/educational_content/_backlog/05-exercises-module4.sql
psql $DATABASE_URL -f seeds/dev/educational_content/_backlog/06-exercises-module5.sql
```

**IMPORTANTE:** Estos ejercicios NO tendrán validación automática.
