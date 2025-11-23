# Fase 2: Enterprise Básico

**Periodo:** Semanas 7-12
**Presupuesto:** $120,000 MXN
**Story Points:** 210 SP
**Módulos:** 3 (MAE-014, MAE-015, MAE-016)
**Estado:** 📝 Planificado
**Última actualización:** 2025-11-17

---

## 📋 Resumen

La Fase 2 añade capacidades enterprise al MVP, elevando el sistema a competidor directo de ERPs como SAP S/4HANA, Procore y Autodesk. Incluye módulos financieros, gestión de activos y sistema documental que son requisitos para constructoras medianas-grandes.

**Dependencias:** Requiere Fase 1 completada (MAI-001 a MAI-013 + MAI-018)

### Contexto SaaS Multi-tenant

Estos módulos están disponibles en el **Plan Enterprise** o como **add-ons** para planes menores:

| Módulo | Incluido en | Add-on precio/mes | Disponible desde |
|--------|-------------|-------------------|------------------|
| **MAE-014 Finanzas** | Enterprise | $200/mes | Plan Profesional |
| **MAE-015 Activos** | Enterprise | $150/mes | Plan Profesional |
| **MAE-016 DMS** | Enterprise | $100/mes | Plan Profesional |

**Activación dinámica:** Los módulos se activan/desactivan instantáneamente desde el portal de administración SaaS según el plan del tenant o add-ons contratados.

**Configuración por tenant:**
- Catálogo de cuentas contables personalizable (MAE-014)
- Clasificación de activos por tipo de constructora (MAE-015)
- Estructura de carpetas documentales por proyecto (MAE-016)

> Ver arquitectura SaaS completa en [ARQUITECTURA-SAAS.md](../00-overview/ARQUITECTURA-SAAS.md)

---

## 🎯 Módulos Enterprise

| Código | Nombre | Presupuesto | SP | Prioridad | Estado |
|--------|--------|-------------|----|-----------|--------|
| **[MAE-014](./MAE-014-finanzas-controlling/)** | Finanzas y Controlling de Obra | $45,000 | 80 | P1 | 📝 A crear |
| **[MAE-015](./MAE-015-activos-maquinaria/)** | Activos, Maquinaria y Mantenimiento | $40,000 | 70 | P1 | 📝 A crear |
| **[MAE-016](./MAE-016-gestion-documental/)** | Gestión Documental y Planos (DMS) | $35,000 | 60 | P2 | 📝 A crear |

**Totales:**
- Presupuesto: $120,000 MXN
- Story Points: 210 SP
- Duración: 6 semanas
- Archivos documentación: ~90 archivos estimados

---

## 🏗️ Arquitectura Implementada

### Base de Datos (Nuevos Schemas)
- **`finance`**: Libro mayor, cuentas por pagar/cobrar, flujo de efectivo
- **`assets`**: Catálogo de activos, maquinaria, mantenimientos
- **`documents`**: Repositorio documental, versionado, permisos

**Total tablas nuevas:** ~35 tablas

### Backend (Nuevos Módulos)
- **`finance`**: Módulo financiero completo
- **`assets`**: Gestión de activos y mantenimiento
- **`documents`**: DMS con versionado y flujos de aprobación

**Total endpoints nuevos:** ~45 APIs RESTful

### Frontend (Nuevas Features)
- **`finance`**: Dashboard financiero, cuentas, cash flow
- **`assets`**: Catálogo de activos, programación de mantenimientos
- **`documents`**: Repositorio, visor de planos con anotaciones

**Total componentes nuevos:** ~40 componentes

---

## 📊 Objetivos a Alcanzar

### MAE-014: Finanzas y Controlling

✅ Libro mayor integrado con proyectos
✅ Cuentas por pagar/cobrar ligadas a compras y estimaciones
✅ Flujo de efectivo proyectado vs real por obra
✅ Integración con sistemas contables externos (SAP, CONTPAQi)
✅ Conciliación bancaria por proyecto
✅ Reportes financieros (balance, PyG, cash flow)

**Beneficio:** Sistema completo vs. SAP S/4HANA Construction

### MAE-015: Activos y Maquinaria

✅ Catálogo de activos (maquinaria pesada, equipo, vehículos)
✅ Control de ubicación y asignación por obra
✅ Mantenimiento preventivo/correctivo programado
✅ Órdenes de trabajo de mantenimiento
✅ Costeo TCO (Total Cost of Ownership)
✅ Localización GPS en tiempo real (IoT opcional)

**Beneficio:** Optimización de uso, reducción de tiempos muertos

### MAE-016: Gestión Documental (DMS)

✅ Repositorio centralizado de documentos y planos
✅ Versionado de planos (rev. A, B, C, etc.)
✅ Control de acceso granular por documento
✅ Flujos de aprobación (borrador → revisado → aprobado)
✅ Acceso desde app móvil con anotaciones
✅ Comparación visual entre versiones de planos
✅ Búsqueda avanzada con OCR

**Beneficio:** Elimina caos documental, auditoría completa

---

## 🔗 Hitos

- **Semana 7-8:** MAE-014 Finanzas (versión inicial: AP/AR, cash flow)
- **Semana 9-10:** MAE-015 Activos (catálogo, mantenimiento preventivo)
- **Semana 11-12:** MAE-016 DMS (repositorio, versionado básico)
- **Semana 12:** Fase 2 completada y desplegada a staging

---

## 📈 Métricas Objetivo

| Métrica | Estimado | Target |
|---------|----------|--------|
| **Presupuesto** | $120,000 | ±5% |
| **Story Points** | 210 | ±10% |
| **Duración** | 6 semanas | ±10% |
| **Cobertura Tests** | 80% | ≥80% |
| **Bugs Críticos** | 0 | 0 |

---

## 🚀 Navegación

**➡️ Siguiente:** [Fase 3: Avanzada (IA + HSE)](../03-fase-avanzada/)
**⬅️ Anterior:** [Fase 1: Alcance Inicial](../01-fase-alcance-inicial/)
**⬆️ Inicio:** [Documentación Principal](../ESTRUCTURA-COMPLETA.md)

---

## 💡 Comparación vs Competidores

### vs. SAP S/4HANA Construction

| Característica | MVP-APP (Fase 2) | SAP |
|----------------|------------------|-----|
| Finanzas integradas | ✅ Completo | ✅ Completo |
| Gestión de activos | ✅ Completo | ✅ Completo |
| DMS | ✅ Completo | ✅ Completo |
| Tiempo implementación | **6 semanas** | **12+ meses** |
| Costo implementación | **$120K** | **$500K-$2M** |
| Stack tecnológico | **Moderno (Node+React)** | Legacy |

### vs. Procore

| Característica | MVP-APP (Fase 2) | Procore |
|----------------|------------------|---------|
| Finanzas integradas | ✅ Nativo | ❌ Limitado (requiere integraciones) |
| Gestión de activos | ✅ Completo | ⚠️ Básico |
| DMS | ✅ Completo | ✅ Excelente |

**Diferenciador clave:** Finanzas nativas vs. integraciones de terceros

---

## 🎯 Criterios de Aceptación (Fase 2)

1. **MAE-014**: Generar estados financieros (Balance, PyG) por proyecto con datos reales
2. **MAE-014**: Integración funcional con CONTPAQi o SAP (export/import de pólizas)
3. **MAE-014**: Cash flow proyectado con ±5% de precisión vs real
4. **MAE-015**: Programar mantenimiento preventivo de 10+ activos con alertas automáticas
5. **MAE-015**: Calcular TCO de al menos 5 activos diferentes
6. **MAE-016**: Subir y versionar 20+ planos con control de acceso por rol
7. **MAE-016**: Workflow de aprobación funcional (3 niveles: borrador → revisado → aprobado)
8. **MAE-016**: Acceso desde app móvil con anotaciones sobre planos

---

## 📚 Estructura de Documentación

Cada módulo contiene la misma estructura estándar:

```
MAE-XXX-nombre-modulo/
├── _MAP.md                          # Índice maestro
├── README.md                        # Descripción completa
├── requerimientos/                  # RF-XXX-NNN
├── especificaciones/                # ET-XXX-NNN
├── historias-usuario/               # US-XXX-NNN
├── implementacion/                  # TRACEABILITY.yml, inventarios
└── pruebas/                         # TEST-PLAN.md, TEST-CASES.md
```

---

## 🎯 Siguiente Paso

Continuar con [Fase 3: Avanzada (IA + HSE)](../03-fase-avanzada/) para completar el sistema enterprise.

---

**Generado:** 2025-11-17
**Sistema:** ERP de Construcción Enterprise
**Método:** Arquitectura modular, reutilización GAMILIT
**Versión:** 1.0.0
