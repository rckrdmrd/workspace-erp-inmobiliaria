# _MAP: Fase 2 - Enterprise Básico

**Fase:** 2
**Nombre:** Enterprise Básico
**Periodo:** Semanas 13-20 (Sprint 7-10)
**Presupuesto:** $120,000 MXN
**Story Points:** 210 SP
**Épicas:** 3
**Estado:** 📝 Planificado
**Última actualización:** 2025-11-17
**Dependencias:** Requiere Fase 1 completada (MAI-001 a MAI-013 + MAI-018)

---

## 📋 Propósito

Añadir capacidades enterprise al MVP, elevando el sistema a competidor directo de ERPs como SAP S/4HANA, Procore y Autodesk. Incluye módulos financieros, gestión de activos y sistema documental que son requisitos para constructoras medianas-grandes.

**Ventaja competitiva:** Sistema financiero nativo (vs integraciones de terceros), asset management completo, y DMS enterprise integrado.

---

## 🌐 Configuración SaaS Multi-tenant

### Activación por Plan

Estos módulos están disponibles según el plan de suscripción de la constructora:

| Módulo | Plan Básico | Plan Profesional | Plan Enterprise | Add-on Precio/mes |
|--------|-------------|------------------|-----------------|-------------------|
| **MAE-014 Finanzas** | ❌ | ⚠️ Add-on | ✅ Incluido | $200/mes |
| **MAE-015 Activos** | ❌ | ⚠️ Add-on | ✅ Incluido | $150/mes |
| **MAE-016 DMS** | ❌ | ⚠️ Add-on | ✅ Incluido | $100/mes |

**Activación dinámica:**
- Los módulos se activan/desactivan instantáneamente desde el portal de administración
- Cambios efectivos en <5 minutos (migrations automáticas)
- Sin downtime para la constructora
- Facturación prorrateada si se activa/desactiva en medio del ciclo

### Personalización por Constructora

**MAE-014 Finanzas:**
- Catálogo de cuentas contables personalizable (PCGA México, IFRS, US GAAP)
- Centros de costo por estructura organizacional de la constructora
- Reglas de integración con ERP externo (SAP, CONTPAQi, QuickBooks)
- Plantillas de reportes financieros con branding de la constructora
- Políticas de cierre contable (mensual, trimestral, anual)

**MAE-015 Activos:**
- Clasificación de activos según tipo de constructora (residencial, industrial, civil)
- Calendarios de mantenimiento personalizados
- Integración con proveedores de GPS/IoT específicos
- Tasas de depreciación por región/normativa
- Alertas de mantenimiento por canales preferidos (email, SMS, WhatsApp)

**MAE-016 DMS:**
- Estructura de carpetas documentales por tipo de proyecto
- Niveles de aprobación personalizados (2, 3, 4, 5 niveles)
- Watermarks y sellos digitales con logo de la constructora
- Integración con AutoCAD/Revit/BIM360 según herramientas de la constructora
- Políticas de retención documental (90 días, 1 año, 5 años, permanente)

### Feature Flags por Módulo

**Gradual Rollout:**
```yaml
MAE-014-finanzas:
  features:
    - basic_accounting: enabled_all_tenants
    - cash_flow_projection: enabled_enterprise_only
    - sap_integration: enabled_on_demand
    - multi_currency: beta_tenants_only
    - advanced_analytics: gradual_rollout_20%

MAE-015-activos:
  features:
    - asset_catalog: enabled_all_tenants
    - gps_tracking: enabled_on_demand
    - iot_sensors: beta_tenants_only
    - predictive_maintenance: enterprise_only

MAE-016-dms:
  features:
    - document_repository: enabled_all_tenants
    - version_control: enabled_all_tenants
    - plan_viewer: enabled_all_tenants
    - ocr_search: enabled_enterprise_only
    - bim360_integration: enabled_on_demand
```

### Extensibilidad

**SDK para Extensiones:**

Cada módulo expone hooks para que constructoras/partners desarrollen extensiones:

**MAE-014 Finanzas:**
- Hook: `onAccountingEntryCreated` - Ejecutar lógica custom al crear póliza
- Hook: `beforeCashFlowProjection` - Ajustar proyección con algoritmos propios
- Hook: `onBankReconciliation` - Validaciones adicionales
- API: `POST /api/v1/finance/custom-reports` - Reportes financieros custom

**MAE-015 Activos:**
- Hook: `onMaintenanceScheduled` - Notificaciones custom
- Hook: `beforeAssetTransfer` - Validaciones de autorización
- API: `POST /api/v1/assets/custom-analytics` - Dashboards de utilización custom

**MAE-016 DMS:**
- Hook: `onDocumentUploaded` - OCR custom, clasificación automática
- Hook: `onPlanVersionCreated` - Comparación visual custom
- API: `POST /api/v1/documents/custom-workflows` - Flujos de aprobación custom

### Límites por Plan

| Recurso | Básico | Profesional | Enterprise |
|---------|--------|-------------|------------|
| **Pólizas contables/mes** | N/A | 1,000 | Ilimitado |
| **Activos registrados** | N/A | 100 | Ilimitado |
| **Almacenamiento DMS** | N/A | 50 GB | 200 GB |
| **Versiones por plano** | N/A | 10 | Ilimitado |
| **Usuarios con acceso financiero** | N/A | 5 | Ilimitado |

### Compliance y Seguridad

**Aislamiento de datos:**
- Row-Level Security (RLS) mediante columna `constructora_id` en todas las tablas
- Políticas RLS específicas para tablas financieras sensibles (márgenes, costos)
- Contexto de sesión: `app.current_constructora_id` establece el filtro automático
- Encriptación en reposo para documentos financieros y planos
- Audit trail completo con `constructora_id`, usuario, timestamp y acción

**Normativas:**
- **Financiero**: Cumplimiento SOX (constructoras US), NIF (México), IFRS (internacional)
- **DMS**: Cumplimiento ISO 19650 (gestión de información BIM)
- **General**: GDPR (datos personales), LFPDPPP (México)

---

## 📁 Contenido

### Épicas (3)

| Épica | Nombre | Presupuesto | SP | Estado | Archivos | Prioridad |
|-------|--------|-------------|----|--------|----------|-----------  |
| **[MAE-014](./MAE-014-finanzas-controlling/)** | Finanzas y Controlling de Obra | $45,000 | 80 | 📝 A crear | 28+ | P1 |
| **[MAE-015](./MAE-015-activos-maquinaria/)** | Activos, Maquinaria y Mantenimiento | $40,000 | 70 | 📝 A crear | 26+ | P1 |
| **[MAE-016](./MAE-016-gestion-documental/)** | Gestión Documental y Planos (DMS) | $35,000 | 60 | 📝 A crear | 24+ | P2 |

**Total:** 3 épicas, 210 SP, ~78 archivos estimados

---

## 📁 Archivos de Fase

| Archivo | Descripción |
|---------|-------------|
| [README.md](./README.md) | Descripción completa de la fase |
| [_MAP.md](./MAP.md) | Este archivo - Índice maestro |

---

## 🎯 Desglose por Épica

### [MAE-014: Finanzas y Controlling de Obra](./MAE-014-finanzas-controlling/)

**Objetivo:** Sistema financiero enterprise integrado con proyectos

**Entregables:**
- Libro mayor y catálogo de cuentas por proyecto/centro de costo
- Cuentas por pagar ligadas a compras y subcontratos
- Cuentas por cobrar ligadas a estimaciones
- Flujo de efectivo proyectado vs real por obra
- Conciliación bancaria por proyecto
- Integración con SAP/CONTPAQi (export de pólizas)
- Reportes financieros: Balance, PyG, Cash Flow

**Documentos clave:**
- 6 RF (RF-FIN-001 a RF-FIN-006)
- 6 ET (ET-FIN-001 a ET-FIN-006)
- 16 US (US-FIN-001 a US-FIN-016)
- [TRACEABILITY.yml](./MAE-014-finanzas-controlling/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `finance` schema (~15 tablas)
- Backend: `finance` module (~25 endpoints)
- Frontend: `finance`, `accounting`, `cash-flow` features (~20 componentes)

**Reutilización GAMILIT:** 5% (funcionalidad enterprise nueva)

**Diferenciador:** Sistema financiero nativo vs Procore (requiere integraciones), similar a SAP S/4HANA Construction

---

### [MAE-015: Activos, Maquinaria y Mantenimiento](./MAE-015-activos-maquinaria/)

**Objetivo:** Asset management completo con mantenimiento predictivo

**Entregables:**
- Catálogo de activos (maquinaria pesada, equipo, vehículos)
- Control de ubicación y asignación a obras
- Planes de mantenimiento preventivo automáticos
- Órdenes de trabajo de mantenimiento correctivo
- Costeo por hora de uso y TCO (Total Cost of Ownership)
- Rastreo GPS en tiempo real (IoT opcional)
- Analytics de utilización de activos

**Documentos clave:**
- 6 RF (RF-AST-001 a RF-AST-006)
- 6 ET (ET-AST-001 a ET-AST-006)
- 14 US (US-AST-001 a US-AST-014)
- [TRACEABILITY.yml](./MAE-015-activos-maquinaria/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `assets` schema (~10 tablas)
- Backend: `assets` module (~20 endpoints)
- Frontend: `assets`, `maintenance` features (~15 componentes)

**Reutilización GAMILIT:** 10% (funcionalidad nueva)

**Diferenciador:** Control total de activos costosos, optimización de uso, similar a Asset Management en ERPs modernos

---

### [MAE-016: Gestión Documental y Planos (DMS)](./MAE-016-gestion-documental/)

**Objetivo:** Document Management System enterprise con versionado

**Entregables:**
- Repositorio centralizado de documentos y planos
- Versionado de planos (Rev. A, B, C, etc.)
- Control de acceso granular por documento/carpeta/proyecto
- Flujos de aprobación (borrador → revisión → aprobado)
- Visualizador de planos con anotaciones
- Comparación visual entre versiones
- Acceso desde app móvil con anotaciones offline
- Búsqueda avanzada con OCR

**Documentos clave:**
- 6 RF (RF-DMS-001 a RF-DMS-006)
- 6 ET (ET-DMS-001 a ET-DMS-006)
- 12 US (US-DMS-001 a US-DMS-012)
- [TRACEABILITY.yml](./MAE-016-gestion-documental/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `documents` schema (~10 tablas)
- Backend: `documents` module (~18 endpoints)
- Frontend: `documents`, `document-viewer` features (~12 componentes)
- App: `document-viewer-mobile` (visor offline)

**Reutilización GAMILIT:** 20% (gestión de archivos básica)

**Diferenciador:** DMS completo similar a Procore Docs o Autodesk Docs, integrado nativamente

---

## 📊 Resumen Técnico

### Base de Datos
- **Schemas (dominios):** 3 (finance, assets, documents)
- **Tablas:** ~35 tablas nuevas
- **Funciones:** ~15 stored procedures
- **ENUMs:** account_type, asset_type, document_type, approval_action, etc.
- **RLS:** Implementado en todas las tablas (por proyecto/empresa)

### Backend (Node.js + Express + TypeScript)
- **Módulos:** 3 (finance, assets, documents)
- **Endpoints:** ~63 APIs RESTful nuevas
- **Services:** FinancialReportsService, TCOCalculator, VersionService, etc.
- **Integraciones:** SAP, CONTPAQi (export), GPS/IoT devices, Storage (S3/Azure)

### Frontend (React + Vite + TypeScript)
- **Features:** finance, assets, maintenance, documents, document-viewer
- **Componentes:** ~47 componentes nuevos
- **Stores:** financeStore, assetStore, maintenanceStore, documentStore, versionStore
- **Librerías especiales:** Chart.js (reportes), Canvas (visor de planos), DnD (drag & drop)

### App Móvil (React Native)
- **Features:** document-viewer-mobile
- **Offline:** Cache de documentos esenciales, anotaciones offline con sincronización

---

## 📈 Métricas de la Fase

| Métrica | Planificado | Target | Varianza Aceptable |
|---------|-------------|--------|-------------------|\n| **Presupuesto** | $120,000 | $120,000 | ±5% |
| **Story Points** | 210 | 210 | ±10% |
| **Duración** | 8 semanas | 8 semanas | ±10% |
| **Cobertura Tests** | 80% | ≥80% | N/A |
| **Bugs Críticos** | 0 | 0 | N/A |
| **Reutilización GAMILIT** | ~12% | ≥10% | N/A |

---

## 🚀 Hitos Planeados

- 🎯 **Semana 13:** Sprint 7 - MAE-014 Finanzas (inicio)
- 🎯 **Semana 14:** MAE-014 AP/AR y cash flow completado
- 🎯 **Semana 15:** Sprint 8 - MAE-014 Reportes financieros completado
- 🎯 **Semana 16:** MAE-015 Activos (inicio)
- 🎯 **Semana 17:** Sprint 9 - MAE-015 Mantenimiento completado
- 🎯 **Semana 18:** MAE-016 DMS (inicio)
- 🎯 **Semana 19:** Sprint 10 - MAE-016 Versionado completado
- 🎯 **Semana 20:** Fase 2 completada y desplegada a staging

---

## 🔗 Referencias

- **Descripción completa:** [README.md](./README.md)
- **Fase anterior:** [Fase 1: Alcance Inicial](../01-fase-alcance-inicial/)
- **Fase siguiente:** [Fase 3: Avanzada (IA + HSE)](../03-fase-avanzada/)
- **Estructura completa:** [ESTRUCTURA-COMPLETA.md](../ESTRUCTURA-COMPLETA.md)

---

## 💡 Principios de Desarrollo Fase 2

1. **Enterprise desde el inicio:** Diseño escalable para grandes constructoras
2. **Integración nativa:** Financiero/Assets/DMS integrados vs módulos separados
3. **APIs de integración:** Permitir conexión con SAP, CONTPAQi, AutoCAD
4. **Performance:** Optimizar consultas financieras (grandes volúmenes)
5. **Seguridad:** Control de acceso granular en documentos sensibles
6. **Audit trail:** Trazabilidad completa de cambios financieros
7. **Mobile-first para DMS:** Acceso a planos desde obra es crítico

---

## 🎯 Criterios de Aceptación (Fase 2)

### MAE-014: Finanzas y Controlling

1. ✅ Generar estados financieros (Balance, PyG) por proyecto con datos reales
2. ✅ Integración funcional con CONTPAQi o SAP (export/import de pólizas)
3. ✅ Cash flow proyectado con ±5% de precisión vs real
4. ✅ Conciliación bancaria mensual automatizada
5. ✅ Pólizas contables generadas automáticamente desde compras/estimaciones

### MAE-015: Activos y Maquinaria

1. ✅ Programar mantenimiento preventivo de 10+ activos con alertas automáticas
2. ✅ Calcular TCO de al menos 5 activos diferentes
3. ✅ Rastreo GPS de activos de alto valor (>$500K)
4. ✅ Órdenes de trabajo con checklist de mantenimiento
5. ✅ Costeo por hora integrado con presupuestos

### MAE-016: Gestión Documental

1. ✅ Subir y versionar 20+ planos con control de acceso por rol
2. ✅ Workflow de aprobación funcional (3 niveles: borrador → revisado → aprobado)
3. ✅ Acceso desde app móvil con anotaciones sobre planos
4. ✅ Comparación visual entre 2 versiones de plano
5. ✅ Búsqueda de texto dentro de documentos PDF (OCR)

---

## 💼 Comparación vs Competidores

### vs. SAP S/4HANA Construction

| Característica | MVP-APP (Fase 2) | SAP |
|----------------|------------------|-----|
| Finanzas integradas | ✅ Completo | ✅ Completo |
| Gestión de activos | ✅ Completo | ✅ Completo |
| DMS | ✅ Completo | ✅ Completo |
| Tiempo implementación | **8 semanas** | **12+ meses** |
| Costo implementación | **$120K** | **$500K-$2M** |
| Stack tecnológico | **Moderno (Node+React)** | Legacy |

### vs. Procore

| Característica | MVP-APP (Fase 2) | Procore |
|----------------|------------------|---------  |
| Finanzas integradas | ✅ Nativo | ❌ Limitado (requiere integraciones) |
| Gestión de activos | ✅ Completo | ⚠️ Básico |
| DMS | ✅ Completo | ✅ Excelente |
| Costo anual | Licencia perpetua | $10K-$50K/año |

**Diferenciador clave:** Finanzas nativas vs integraciones de terceros

---

## 🎯 Siguiente Paso

Iniciar Sprint 7 con desarrollo de módulo MAE-014 (Finanzas y Controlling).

---

**Generado:** 2025-11-17
**Sistema:** ERP de Construcción Enterprise
**Método:** Arquitectura modular, integración nativa
**Versión:** 2.0.0
