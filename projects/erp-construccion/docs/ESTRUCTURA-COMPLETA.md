# Estructura Completa de Documentación - Sistema de Administración de Obra e INFONAVIT

**Generado:** 2025-11-17
**Versión:** 1.1
**Total de módulos:** 18 (13 Fase 1 + 3 Fase 2 + 1 Fase 3 + 1 módulo transversal)

---

## 📊 Resumen Ejecutivo

Esta estructura documenta los **18 módulos funcionales** del sistema ERP de construcción, organizados en **3 fases** de desarrollo más documentación transversal en `00-overview`.

### Distribución por Fase

| Fase | Nombre | Módulos | Presupuesto | Duración | Story Points |
|------|--------|---------|-------------|----------|--------------|
| **00** | Overview | - | - | - | - |
| **01** | Alcance Inicial (MVP) | 13 | $325,000 | 6 semanas | 540 SP |
| **02** | Enterprise Básico | 3 | $120,000 | 6 semanas | 210 SP |
| **03** | Avanzada (IA + HSE) | 1 | $60,000 | 6 semanas | 90 SP |
| **Total** | - | **17** | **$505,000** | **18 semanas** | **840 SP** |

---

## 📁 Estructura de Directorios

```
/home/isem/workspace/worskpace-inmobiliaria/docs/
│
├── 00-overview/                                    # Documentación General
│   └── MVP-APP.md                                  # Definición completa del MVP
│
├── 01-fase-alcance-inicial/                        # FASE 1: MVP Core (6 semanas)
│   ├── README.md                                   # Descripción de la fase
│   ├── _MAP.md                                     # Índice maestro de la fase
│   ├── ROADMAP-DETALLADO.md                        # Roadmap detallado
│   ├── ANALISIS-REUTILIZACION-GAMILIT.md          # Análisis de reutilización
│   │
│   ├── MAI-001-fundamentos/                        # Módulo 1: Autenticación, RBAC, Multi-tenancy
│   ├── MAI-002-proyectos-estructura/               # Módulo 2: Proyectos, Etapas, Manzanas, Lotes
│   ├── MAI-003-presupuestos-costos/                # Módulo 3: Presupuestos, Control de Costos
│   ├── MAI-004-compras-inventarios/                # Módulo 4: Compras e Inventarios
│   ├── MAI-005-control-obra-avances/               # Módulo 6: Control de Obra y Avances
│   ├── MAI-006-reportes-analytics/                 # Módulo 12: Reportes & BI
│   ├── MAI-007-rrhh-asistencias/                   # Módulo 8: RRHH con GPS + Biométrico
│   ├── MAI-008-estimaciones-facturacion/           # Módulo 7: Estimaciones y Facturación ⭐ NUEVO
│   ├── MAI-009-calidad-postventa/                  # Módulo 9: Calidad, Postventa y Garantías ⭐ NUEVO
│   ├── MAI-010-crm-derechohabientes/               # Módulo 10: CRM de Derechohabientes ⭐ NUEVO
│   ├── MAI-011-infonavit-cumplimiento/             # Módulo 11: INFONAVIT & Cumplimiento ⭐ NUEVO
│   ├── MAI-012-contratos-subcontratos/             # Módulo 5: Contratos y Subcontratos ⭐ NUEVO
│   ├── MAI-013-administracion-seguridad/           # Módulo 13: Administración & Seguridad ⭐ NUEVO
│   └── MAI-018-preconstruccion-licitaciones/       # Módulo 18: Preconstrucción y Licitaciones ⭐ NUEVO
│
├── 02-fase-enterprise/                             # FASE 2: Enterprise Básico (6 semanas)
│   ├── README.md                                   # Descripción de la fase
│   ├── _MAP.md                                     # Índice maestro de la fase
│   │
│   ├── MAE-014-finanzas-controlling/               # Módulo 14: Finanzas y Controlling ⭐ NUEVO
│   ├── MAE-015-activos-maquinaria/                 # Módulo 15: Activos y Maquinaria ⭐ NUEVO
│   └── MAE-016-gestion-documental/                 # Módulo 16: DMS y Planos ⭐ NUEVO
│
└── 03-fase-avanzada/                               # FASE 3: Avanzada (6 semanas)
    ├── README.md                                   # Descripción de la fase
    ├── _MAP.md                                     # Índice maestro de la fase
    │
    └── MAA-017-seguridad-hse/                      # Módulo 17: Seguridad, Riesgos y HSE ⭐ NUEVO
```

---

## 📋 Detalle de Módulos por Fase

### Fase 1: Alcance Inicial (MVP Core) - 13 Módulos

| Código | Nombre | Presupuesto | SP | Prioridad | Estado |
|--------|--------|-------------|----|-----------|--------|
| **MAI-001** | Fundamentos | $25,000 | 50 | P0 | 🚧 Planificado |
| **MAI-002** | Proyectos y Estructura de Obra | $25,000 | 45 | P0 | 🚧 Planificado |
| **MAI-003** | Presupuestos y Control de Costos | $25,000 | 50 | P1 | 🚧 Planificado |
| **MAI-004** | Compras e Inventarios | $25,000 | 50 | P1 | 🚧 Planificado |
| **MAI-005** | Control de Obra y Avances | $25,000 | 45 | P0 | 🚧 Planificado |
| **MAI-006** | Reportes y Analytics Base | $25,000 | 40 | P1 | 🚧 Planificado |
| **MAI-007** | RRHH, Asistencias y Nómina (GPS+Bio) | $25,000 | 50 | P0 | 🚧 Planificado |
| **MAI-008** | Estimaciones y Facturación | $25,000 | 45 | P1 | 📝 A crear |
| **MAI-009** | Calidad, Postventa y Garantías | $25,000 | 40 | P2 | 📝 A crear |
| **MAI-010** | CRM de Derechohabientes y Comercialización | $25,000 | 35 | P2 | 📝 A crear |
| **MAI-011** | INFONAVIT & Cumplimiento | $25,000 | 40 | P1 | 📝 A crear |
| **MAI-012** | Contratos y Subcontratos | $25,000 | 45 | P1 | 📝 A crear |
| **MAI-013** | Administración & Seguridad | $25,000 | 40 | P0 | 📝 A crear |
| **MAI-018** | Preconstrucción y Licitaciones | $25,000 | 45 | P0 | 📝 A crear |

**Totales Fase 1:** $325,000 MXN | 540 SP | 6 semanas

### Fase 2: Enterprise Básico - 3 Módulos

| Código | Nombre | Presupuesto | SP | Prioridad | Estado |
|--------|--------|-------------|----|-----------|--------|
| **MAE-014** | Finanzas y Controlling de Obra | $45,000 | 80 | P1 | 📝 A crear |
| **MAE-015** | Activos, Maquinaria y Mantenimiento | $40,000 | 70 | P1 | 📝 A crear |
| **MAE-016** | Gestión Documental y Planos (DMS) | $35,000 | 60 | P2 | 📝 A crear |

**Totales Fase 2:** $120,000 MXN | 210 SP | 6 semanas

### Fase 3: Avanzada (IA + HSE) - 1 Módulo

| Código | Nombre | Presupuesto | SP | Prioridad | Estado |
|--------|--------|-------------|----|-----------|--------|
| **MAA-017** | Seguridad, Riesgos y HSE (con IA predictiva) | $60,000 | 90 | P0 | 📝 A crear |

**Totales Fase 3:** $60,000 MXN | 90 SP | 6 semanas

---

## 📂 Estructura Estándar de Cada Módulo

Cada módulo (MAI-XXX, MAE-XXX, MAA-XXX) contiene la siguiente estructura:

```
MAI-XXX-nombre-modulo/
│
├── _MAP.md                          # Índice maestro del módulo
├── README.md                        # Descripción completa del módulo
│
├── requerimientos/                  # Requerimientos Funcionales
│   ├── RF-XXX-001-titulo.md
│   ├── RF-XXX-002-titulo.md
│   └── ...
│
├── especificaciones/                # Especificaciones Técnicas
│   ├── ET-XXX-001-titulo.md
│   ├── ET-XXX-002-titulo.md
│   └── ...
│
├── historias-usuario/               # Historias de Usuario
│   ├── US-XXX-001-titulo.md
│   ├── US-XXX-002-titulo.md
│   └── ...
│
├── implementacion/                  # Documentación de Implementación
│   ├── TRACEABILITY.yml             # Matriz de trazabilidad completa
│   ├── DATABASE.yml                 # Inventario de objetos de BD
│   ├── BACKEND.yml                  # Inventario de módulos backend
│   ├── FRONTEND.yml                 # Inventario de componentes frontend
│   └── APP.yml                      # Inventario de componentes móviles (si aplica)
│
└── pruebas/                         # Documentación de Testing
    ├── TEST-PLAN.md                 # Plan de pruebas del módulo
    ├── TEST-CASES.md                # Casos de prueba
    └── TEST-RESULTS.md              # Resultados de pruebas (generado)
```

---

## 🔑 Convenciones de Nomenclatura

### Prefijos por Fase

| Fase | Prefijo | Significado | Ejemplo |
|------|---------|-------------|---------|
| Fase 1 | **MAI-** | Módulo Alcance Inicial | MAI-001-fundamentos |
| Fase 2 | **MAE-** | Módulo Alcance Enterprise | MAE-014-finanzas-controlling |
| Fase 3 | **MAA-** | Módulo Alcance Avanzado | MAA-017-seguridad-hse |

### Prefijos de Documentos

| Tipo | Prefijo | Significado | Ejemplo |
|------|---------|-------------|---------|
| Requerimiento Funcional | **RF-** | Requerimiento Funcional | RF-AUTH-001 |
| Especificación Técnica | **ET-** | Especificación Técnica | ET-AUTH-001 |
| Historia de Usuario | **US-** | User Story | US-FUND-001 |

### Estados de Documentos

| Emoji | Estado | Descripción |
|-------|--------|-------------|
| 📝 | A crear | Pendiente de creación |
| 🚧 | Planificado | Creado, pendiente de desarrollo |
| ⚙️ | En desarrollo | En implementación activa |
| ✅ | Completado | Implementado y probado |
| ⚠️ | Bloqueado | Bloqueado por dependencias |
| ❌ | Cancelado | No se implementará |

---

## 📊 Métricas Consolidadas

### Por Fase

| Métrica | Fase 1 | Fase 2 | Fase 3 | Total |
|---------|--------|--------|--------|-------|
| **Módulos** | 13 | 3 | 1 | 17 |
| **Presupuesto** | $325,000 | $120,000 | $60,000 | $505,000 |
| **Story Points** | 540 SP | 210 SP | 90 SP | 840 SP |
| **Duración estimada** | 6 sem | 6 sem | 6 sem | 18 sem |
| **RF estimados** | ~52 | ~18 | ~8 | ~78 |
| **ET estimados** | ~52 | ~18 | ~8 | ~78 |
| **US estimados** | ~104 | ~36 | ~16 | ~156 |
| **Archivos docs estimados** | ~260 | ~90 | ~40 | ~390 |

### Reutilización de GAMILIT

| Componente | % Reutilización | Ahorro Estimado |
|------------|-----------------|-----------------|
| **Infraestructura base** | 90% | 3 semanas |
| **Componentes UI** | 67% | 2 semanas |
| **Patrones arquitectónicos** | 100% | 1 semana |
| **Total ahorro estimado** | ~40% | **6-7 semanas** |

---

## 🚀 Próximos Pasos

### Creación de Documentación Pendiente

**Alta Prioridad (P0 - Módulos críticos):**
1. ✅ MAI-001: Fundamentos (ya existe)
2. ✅ MAI-002: Proyectos y Estructura (ya existe)
3. ✅ MAI-005: Control de Obra (ya existe)
4. ✅ MAI-007: RRHH (ya existe)
5. 📝 MAI-013: Administración & Seguridad
6. 📝 MAI-018: Preconstrucción y Licitaciones

**Media Prioridad (P1 - Módulos operativos):**
7. ✅ MAI-003: Presupuestos (ya existe)
8. ✅ MAI-004: Compras e Inventarios (ya existe)
9. 📝 MAI-008: Estimaciones y Facturación
10. 📝 MAI-011: INFONAVIT & Cumplimiento
11. 📝 MAI-012: Contratos y Subcontratos
12. 📝 MAE-014: Finanzas y Controlling

**Baja Prioridad (P2 - Módulos complementarios):**
13. ✅ MAI-006: Reportes (ya existe)
14. 📝 MAI-009: Calidad y Postventa
15. 📝 MAI-010: CRM de Derechohabientes
16. 📝 MAE-015: Activos y Maquinaria
17. 📝 MAE-016: Gestión Documental

**Fase Avanzada:**
18. 📝 MAA-017: Seguridad, Riesgos y HSE (con IA)

### Plantillas a Usar

Para crear documentación nueva, usar como referencia:
- **_MAP.md:** `MAI-001-fundamentos/_MAP.md`
- **README.md:** `01-fase-alcance-inicial/README.md`
- **RF-XXX:** Archivos en `MAI-001-fundamentos/requerimientos/`
- **ET-XXX:** Archivos en `MAI-001-fundamentos/especificaciones/`
- **US-XXX:** Archivos en `MAI-001-fundamentos/historias-usuario/`

---

## 📚 Referencias

- **Definición del MVP:** [00-overview/MVP-APP.md](./00-overview/MVP-APP.md)
- **Fase 1:** [01-fase-alcance-inicial/README.md](./01-fase-alcance-inicial/README.md)
- **Proyecto GAMILIT:** Referencia de arquitectura y componentes
- **Roadmap Detallado:** [01-fase-alcance-inicial/ROADMAP-DETALLADO.md](./01-fase-alcance-inicial/ROADMAP-DETALLADO.md)

---

## 🎯 Objetivos de Completitud

### Sprint 0-2 (Inmediato)
- ✅ Estructura de carpetas completa creada
- 🔄 Documentar módulos P0 (MAI-013, MAI-018)
- 📝 Crear _MAP.md para todos los módulos nuevos

### Sprint 3-6 (Fase 1)
- 📝 Completar documentación de módulos P1
- 📝 Crear README.md para Fases 2 y 3
- 📝 Actualizar archivos maestros (_MAP.md, README.md)

### Sprint 7-12 (Fase 2)
- 📝 Documentar módulos enterprise (MAE-014, MAE-015, MAE-016)

### Sprint 13-18 (Fase 3)
- 📝 Documentar módulo avanzado (MAA-017)

---

**Generado:** 2025-11-17
**Versión:** 1.1
**Total de carpetas creadas:** 21 (1 overview + 14 fase-1 + 4 fase-2 + 2 fase-3)
**Total de subcarpetas:** 85 (5 por módulo × 17 módulos)
**Estado:** ✅ Estructura completa creada
