# _MAP: MAI-018 - Preconstrucción y Licitaciones

**Épica:** MAI-018
**Nombre:** Preconstrucción y Licitaciones
**Fase:** 1 - Alcance Inicial
**Presupuesto:** $25,000 MXN
**Story Points:** 45 SP
**Estado:** 📝 A crear
**Sprint:** Sprint 1-2 (Semanas 1-4)
**Última actualización:** 2025-11-17
**Prioridad:** P0

---

## 📋 Propósito

Gestión completa del ciclo de oportunidades, licitaciones y conversión a proyectos adjudicados:
- Pipeline de oportunidades de licitaciones públicas y privadas
- Gestión de propuestas técnicas y económicas
- Conversión de licitaciones ganadas a proyectos en ejecución
- Análisis de tasa de éxito y competidores
- Transición suave de preventa a ejecución

**Integración clave:** Base del flujo de negocio. Se vincula con Proyectos (MAI-002), Presupuestos (MAI-003) y Contratos (MAI-012).

---

## 📁 Contenido

### Requerimientos Funcionales (Estimados: 5)

| ID | Título | Estado |
|----|--------|--------|
| RF-LIC-001 | Pipeline de oportunidades y licitaciones | 📝 A crear |
| RF-LIC-002 | Gestión de propuestas técnicas y económicas | 📝 A crear |
| RF-LIC-003 | Conversión de licitación ganada a proyecto | 📝 A crear |
| RF-LIC-004 | Calendario de fechas clave y alertas | 📝 A crear |
| RF-LIC-005 | Analytics de licitaciones (win rate, competidores) | 📝 A crear |

### Especificaciones Técnicas (Estimadas: 5)

| ID | Título | RF | Estado |
|----|--------|----|--------|
| ET-LIC-001 | Modelo de datos de licitaciones y oportunidades | RF-LIC-001 | 📝 A crear |
| ET-LIC-002 | Sistema de versionado de propuestas | RF-LIC-002 | 📝 A crear |
| ET-LIC-003 | Flujo de conversión licitación → proyecto | RF-LIC-003 | 📝 A crear |
| ET-LIC-004 | Sistema de notificaciones y alertas | RF-LIC-004 | 📝 A crear |
| ET-LIC-005 | Motor de analytics y reportes | RF-LIC-005 | 📝 A crear |

### Historias de Usuario (Estimadas: 9)

| ID | Título | SP | Estado |
|----|--------|----|--------|
| US-LIC-001 | Registrar oportunidad de licitación | 5 | 📝 A crear |
| US-LIC-002 | Evaluar viabilidad (go/no-go) de licitación | 5 | 📝 A crear |
| US-LIC-003 | Crear propuesta técnica y económica | 5 | 📝 A crear |
| US-LIC-004 | Gestionar calendario de fechas clave | 3 | 📝 A crear |
| US-LIC-005 | Convertir licitación ganada a proyecto | 7 | 📝 A crear |
| US-LIC-006 | Ajustar presupuesto ofertado vs contratado | 5 | 📝 A crear |
| US-LIC-007 | Analizar tasa de éxito y competidores | 5 | 📝 A crear |
| US-LIC-008 | Dashboard de pipeline y valor potencial | 5 | 📝 A crear |
| US-LIC-009 | Exportar documentos licitatorios | 5 | 📝 A crear |

**Total Story Points:** 45 SP

### Implementación

📊 **Inventarios de trazabilidad:**
- [TRACEABILITY.yml](./implementacion/TRACEABILITY.yml) - Matriz completa de trazabilidad
- [DATABASE.yml](./implementacion/DATABASE.yml) - Objetos de base de datos
- [BACKEND.yml](./implementacion/BACKEND.yml) - Módulos backend
- [FRONTEND.yml](./implementacion/FRONTEND.yml) - Componentes frontend

### Pruebas

📋 Documentación de testing:
- [TEST-PLAN.md](./pruebas/TEST-PLAN.md) - Plan de pruebas
- [TEST-CASES.md](./pruebas/TEST-CASES.md) - Casos de prueba

---

## 🔗 Referencias

- **README:** [README.md](./README.md) - Descripción detallada de la épica
- **Fase 1:** [../README.md](../README.md) - Información de la fase completa
- **Módulo relacionado MVP:** Módulo 18 - Preconstrucción y Licitaciones (MVP-APP.md)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $25,000 MXN |
| **Story Points estimados** | 45 SP |
| **Duración estimada** | 9 días |
| **Reutilización GAMILIT** | 15% (funcionalidad nueva específica de construcción) |
| **RF a implementar** | 5/5 |
| **ET a implementar** | 5/5 |
| **US a completar** | 9/9 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schema:** `bidding`
- **Tablas principales:**
  * `opportunities` - Oportunidades de licitaciones
  * `bids` - Licitaciones/propuestas
  * `bid_documents` - Documentos de licitación
  * `bid_calendar` - Fechas clave
  * `bid_budget` - Presupuesto ofertado
  * `bid_competitors` - Competidores identificados
  * `bid_team` - Equipo asignado a propuesta
- **ENUMs:**
  * `opportunity_source` (government_portal, private_client, referral, other)
  * `bid_status` (evaluating, go_decision, no_go, preparing, submitted, awarded, lost, withdrawn)
  * `bid_type` (public, private, invitation_only)
  * `calendar_event_type` (site_visit, clarification_meeting, submission_deadline, award_date)

### Backend
- **Módulo:** `bidding`, `opportunities`
- **Path:** `apps/backend/src/modules/bidding/`
- **Services:** OpportunityService, BidService, BidBudgetService, BidAnalyticsService
- **Controllers:** OpportunityController, BidController, BidConversionController
- **Middlewares:** BidAccessGuard, DocumentUploadGuard

### Frontend
- **Features:** `bidding`, `opportunities`, `bid-management`
- **Path:** `apps/frontend/src/features/bidding/`
- **Componentes:**
  * OpportunityPipeline
  * OpportunityForm (create/edit)
  * BidEvaluationForm (go/no-go)
  * BidProposalBuilder
  * BidCalendar
  * BidConversionWizard
  * BidAnalyticsDashboard
  * CompetitorTracker
  * BidDocumentManager
- **Stores:** opportunityStore, bidStore, bidAnalyticsStore

---

## 🔄 Flujo de Trabajo de Licitaciones

### 1. Identificación de Oportunidad

**Fuentes:**
- Portales gubernamentales (CompraNet, estatales, municipales)
- Clientes privados (INFONAVIT, desarrolladores)
- Referencias y contactos directos
- Suscripciones a alertas

**Información capturada:**
- Nombre de la licitación
- Cliente/convocante
- Tipo de proyecto (vivienda vertical/horizontal, urbanización)
- Ubicación (estado, municipio)
- Número estimado de viviendas
- Monto estimado
- Fechas clave iniciales

**Clasificación:**
- Tipo: Pública/Privada/Invitación
- Región: Norte, Centro, Sur, etc.
- Línea de negocio: Vivienda social, media, residencial
- Prioridad: Alta, Media, Baja

---

### 2. Evaluación Go/No-Go

**Criterios de evaluación:**

| Criterio | Peso | Evaluación |
|----------|------|------------|
| **Alineación estratégica** | 20% | ¿Está en nuestra zona geográfica? ¿Línea de negocio? |
| **Capacidad técnica** | 25% | ¿Tenemos experiencia en este tipo de proyecto? |
| **Capacidad financiera** | 20% | ¿Podemos financiar el anticipo y capital de trabajo? |
| **Relación con cliente** | 15% | ¿Conocemos al cliente? ¿Relación previa? |
| **Competencia esperada** | 10% | ¿Cuántos competidores? ¿Quiénes? |
| **Margen potencial** | 10% | ¿El margen esperado justifica el esfuerzo? |

**Decisión:**
- **GO:** Se procede a preparar propuesta
- **NO-GO:** Se archiva con razón documentada
- **EN EVALUACIÓN:** Se requiere más información

---

### 3. Preparación de Propuesta

**Actividades:**

1. **Revisión de bases:**
   - Carga de bases de licitación
   - Identificación de requisitos técnicos
   - Identificación de requisitos legales/administrativos
   - Checklist de cumplimiento

2. **Análisis técnico:**
   - Visita al sitio (si aplica)
   - Análisis de planos y especificaciones
   - Definición de prototipos de vivienda
   - Identificación de alcances especiales

3. **Presupuesto ofertado:**
   - Creación de presupuesto base
   - Cotización con proveedores clave
   - Cálculo de indirectos y margen
   - Análisis de sensibilidad
   - Versión "ofertada" del presupuesto

4. **Propuesta técnica:**
   - Metodología constructiva
   - Programa de obra
   - Personal clave
   - Experiencia y referencias
   - Cumplimiento de especificaciones

5. **Colaboración en equipo:**
   - Asignación de responsables
   - Tablero de tareas
   - Versionado de documentos
   - Checklist de entregables

---

### 4. Calendario de Fechas Clave

**Eventos típicos:**

| Evento | Descripción | Alerta |
|--------|-------------|--------|
| **Visita a sitio** | Recorrido por terreno/proyecto | 3 días antes |
| **Junta de aclaraciones** | Preguntas y respuestas | 2 días antes |
| **Entrega de propuesta** | Fecha límite de presentación | 5 días antes + 1 día antes |
| **Apertura técnica** | Revisión de propuestas técnicas | 1 día antes |
| **Apertura económica** | Revisión de propuestas económicas | 1 día antes |
| **Fallo** | Adjudicación del contrato | - |

**Sistema de alertas:**
- Email automático a equipo asignado
- Notificaciones push en app móvil
- Dashboard con semáforo de fechas

---

### 5. Conversión a Proyecto

**Proceso al ganar licitación:**

1. **Cambio de estatus:** `awarded` → `converting`

2. **Ajuste de presupuesto:**
   - Comparación ofertado vs contratado
   - Identificación de diferencias
   - Ajuste de cantidades/precios
   - Creación de presupuesto "contratado"

3. **Creación automática de proyecto:**
   - Generación de estructura de proyecto
   - Creación de etapas (según alcances)
   - Creación de manzanas y lotes (si aplica)
   - Asignación de prototipos de vivienda

4. **Transferencia de información:**
   - Documentos licitatorios → Módulo Documental
   - Presupuesto ofertado → Módulo Presupuestos
   - Fechas clave → Calendario de obra
   - Equipo propuesto → Asignación de personal

5. **Activación de módulos operativos:**
   - Habilitación de compras
   - Habilitación de control de obra
   - Habilitación de RRHH
   - Configuración de centros de costo

**Estado final:** `converted` → Proyecto activo en ejecución

---

## 📈 Analytics de Licitaciones

### KPIs Principales

| Métrica | Descripción | Cálculo |
|---------|-------------|---------|
| **Win Rate** | Tasa de éxito | Ganadas / (Ganadas + Perdidas) |
| **Pipeline Value** | Valor total en pipeline | Σ (Monto × Probabilidad) |
| **Avg. Bid Size** | Tamaño promedio de licitación | Σ Monto / # Licitaciones |
| **Time to Award** | Tiempo promedio hasta fallo | Avg(Fecha fallo - Fecha registro) |
| **Conversion Rate** | Tasa de conversión a proyecto | Convertidas / Ganadas |
| **Competitor Frequency** | Competidores más frecuentes | Top 10 competidores |

### Dashboards

1. **Pipeline Overview:**
   - Total de oportunidades activas
   - Valor potencial total
   - Desglose por estatus
   - Desglose por región
   - Probabilidad ponderada

2. **Performance Histórico:**
   - Win rate por año/trimestre
   - Licitaciones ganadas vs perdidas
   - Análisis de márgenes (ofertado vs real)
   - Razones de pérdida más comunes

3. **Competencia:**
   - Competidores recurrentes
   - Win rate vs cada competidor
   - Proyectos donde coincidimos
   - Estrategias detectadas

---

## 💡 Casos de Uso Clave

### Licitación Pública INFONAVIT

**Contexto:**
- Cliente: INFONAVIT
- Tipo: Licitación pública nacional
- Proyecto: 200 viviendas verticales
- Ubicación: Querétaro
- Monto estimado: $80M MXN

**Flujo:**

1. **Día 0:** Se detecta licitación en CompraNet
   - Registro de oportunidad
   - Asignación a Director de Zona Centro

2. **Día 3:** Evaluación Go/No-Go
   - Revisión de requisitos
   - Análisis de capacidad
   - **Decisión: GO**

3. **Día 5:** Inicio de preparación
   - Descarga de bases
   - Asignación de equipo (ingeniero, compras, finanzas)
   - Creación de presupuesto base

4. **Día 10:** Visita al sitio
   - Registro fotográfico
   - Análisis de accesos y servicios
   - Validación de cantidades

5. **Día 20:** Junta de aclaraciones
   - Registro de preguntas/respuestas
   - Ajuste de presupuesto

6. **Día 28:** Entrega de propuesta
   - Generación de documentos
   - Verificación de checklist
   - Presentación física/digital

7. **Día 40:** Fallo
   - **Resultado: GANADO**
   - Registro de competidores (5 empresas)

8. **Día 42:** Conversión a proyecto
   - Ajuste de presupuesto (ofertado: $78M, contratado: $80M)
   - Creación de estructura de proyecto
   - Activación de módulos operativos

---

### Licitación Privada Desarrollador

**Contexto:**
- Cliente: Desarrollador privado
- Tipo: Invitación directa
- Proyecto: 50 viviendas horizontales
- Ubicación: Mérida
- Monto estimado: $25M MXN

**Diferencias vs licitación pública:**
- Proceso más ágil (menos formalidades)
- Relación directa con cliente
- Negociación de alcances y precio
- Menos competidores (2-3 invitados)
- Mayor flexibilidad en propuesta

---

## 🚨 Puntos Críticos

1. **Alertas oportunas:** No perder fechas límite de entrega
2. **Versionado de presupuestos:** Diferenciar claramente ofertado vs contratado
3. **Trazabilidad:** Documentar razones de go/no-go y pérdidas
4. **Conversión limpia:** Evitar pérdida de información al convertir a proyecto
5. **Integración con módulos:** Activación automática de funcionalidades operativas
6. **Análisis competitivo:** Aprender de licitaciones perdidas

---

## 🎯 Siguiente Paso

Crear documentación de requerimientos y especificaciones técnicas del módulo.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @business-dev
**Estado:** 📝 A crear
