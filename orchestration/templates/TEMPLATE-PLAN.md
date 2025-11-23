# PLAN DE EJECUCIÓN: {TAREA-ID} - {Nombre de la Tarea}

**Agente:** {Database-Agent | Backend-Agent | Frontend-Agent | etc}
**Tipo de tarea:** {Requerimiento | Bug | Feature | Corrección | Validación}
**Prioridad:** {P0 | P1 | P2 | P3}
**Fecha creación:** {YYYY-MM-DD}
**Relacionado con:** [{REQ-XXX}], [{DB-XXX}], [{BE-XXX}]

---

## 🎯 OBJETIVO

Descripción clara y concisa del objetivo de esta tarea.

**Criterios de Aceptación:**
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

---

## 📋 ANÁLISIS PREVIO

### Contexto
- ¿Por qué es necesario?
- ¿Qué problema resuelve?
- ¿Qué valor aporta?

### Estado Actual
- Objetos existentes relacionados
- Dependencias identificadas
- Restricciones conocidas

### Anti-Duplicación
```bash
# Comandos ejecutados para verificar no-duplicación
grep -rn "{objeto}" orchestration/inventarios/
find apps/ -name "*{objeto}*"

# Resultado: ✅ No existe | ❌ Ya existe en {ubicación}
```

---

## 📐 DISEÑO DE SOLUCIÓN

### Approach Seleccionado
Descripción del enfoque elegido.

**Alternativas consideradas:**
1. Alternativa 1 - Razón de descarte
2. Alternativa 2 - Razón de descarte

### Componentes a Crear/Modificar

**Database:**
- [ ] Schema: {nombre}
- [ ] Tablas: {lista}
- [ ] Funciones: {lista}
- [ ] Triggers: {lista}
- [ ] Seeds: {lista}

**Backend:**
- [ ] Entities: {lista}
- [ ] Services: {lista}
- [ ] Controllers: {lista}
- [ ] DTOs: {lista}

**Frontend:**
- [ ] Páginas: {lista}
- [ ] Componentes: {lista}
- [ ] Stores: {lista}
- [ ] Services: {lista}

---

## 🔄 CICLOS DE EJECUCIÓN

### Ciclo 1: {Nombre del Ciclo}
**Duración estimada:** {X} horas
**Objetivo:** {descripción breve}

**Tareas:**
1. Tarea 1
2. Tarea 2
3. Tarea 3

**Artefactos generados:**
- Archivo 1: {ruta}
- Archivo 2: {ruta}

**Validación:**
```bash
# Comandos de validación
{comandos}
```

**Criterios de éxito:**
- [ ] Criterio 1
- [ ] Criterio 2

---

### Ciclo 2: {Nombre del Ciclo}
**Duración estimada:** {X} horas
**Objetivo:** {descripción breve}

[...repetir estructura del Ciclo 1]

---

### Ciclo N: Validación Final
**Duración estimada:** {X} horas
**Objetivo:** Validar integración completa

**Validaciones:**
```bash
# Database
./apps/database/create-database.sh
# Debe ejecutar sin errores

# Backend
cd apps/backend && npm run build
# Debe compilar sin errores

# Frontend
cd apps/frontend && npm run build
# Debe compilar sin errores

# Tests (si aplica)
npm test
# Todos los tests deben pasar
```

**Checklist de Validación:**
- [ ] DB ejecuta sin errores
- [ ] Backend compila sin errores
- [ ] Frontend compila sin errores
- [ ] Tests pasan (si aplica)
- [ ] Documentación actualizada
- [ ] Inventarios actualizados
- [ ] Trazas actualizadas

---

## 🔗 DEPENDENCIAS

### Depende de:
- [{TAREA-XXX}]: {descripción}
- [{TAREA-YYY}]: {descripción}

### Bloquea:
- [{TAREA-ZZZ}]: {descripción}

### Requerimientos externos:
- Ninguno | {lista de requerimientos}

---

## ⚠️ RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Riesgo 1 | Alta/Media/Baja | Alto/Medio/Bajo | Estrategia de mitigación |
| Riesgo 2 | Alta/Media/Baja | Alto/Medio/Bajo | Estrategia de mitigación |

---

## 📊 ESTIMACIONES

**Tiempo total estimado:** {X} horas / {Y} días

**Desglose:**
- Análisis: {X}h
- Desarrollo: {Y}h
- Testing: {Z}h
- Documentación: {W}h
- Buffer (15%): {B}h

**Recursos necesarios:**
- Agentes: {lista}
- Subagentes: {lista}
- Herramientas: {lista}

---

## 📝 DOCUMENTACIÓN A GENERAR

**Durante ejecución:**
- [ ] 03-EJECUCION.md (ir documentando por ciclo)
- [ ] Comentarios inline en código
- [ ] Actualización de inventarios en tiempo real

**Post-ejecución:**
- [ ] 04-VALIDACION.md
- [ ] 05-DOCUMENTACION.md
- [ ] Actualización de TRAZA-{TIPO}.md
- [ ] README actualizado (si cambió estructura)
- [ ] ADR (si decisión arquitectónica importante)

---

## 🎯 CRITERIOS DE ÉXITO

La tarea se considera **COMPLETADA** cuando:

- [x] Todos los ciclos ejecutados exitosamente
- [x] Todas las validaciones pasan
- [x] Documentación completa (5 archivos)
- [x] Inventarios actualizados
- [x] Trazas actualizadas
- [x] Sin errores de compilación
- [x] Tests pasan (si aplica)
- [x] Code review aprobado (si aplica)
- [x] Sin duplicaciones creadas
- [x] Cumple estándares de código

---

## 📚 REFERENCIAS

**Documentación del proyecto:**
- MVP Plan: docs/00-overview/MVP-APP.md
- ADRs relacionados: docs/adr/ADR-XXX.md
- README del módulo: apps/{stack}/README.md

**Archivos de referencia:**
- Template: {ruta}
- Similar existente: {ruta}

**Prompts y directivas:**
- [PROMPT-AGENTES-PRINCIPALES.md](../../prompts/PROMPT-AGENTES-PRINCIPALES.md)
- [POLITICAS-USO-AGENTES.md](../../directivas/POLITICAS-USO-AGENTES.md)

---

**Versión:** 1.0
**Última actualización:** {YYYY-MM-DD}
**Aprobado para ejecución:** {Sí | No | Pendiente}
