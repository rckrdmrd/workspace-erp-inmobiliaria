# _MAP: MAA-017 - Seguridad, Riesgos y HSE

**Épica:** MAA-017
**Nombre:** Seguridad, Riesgos y HSE (con IA predictiva)
**Fase:** 3 - Avanzada
**Presupuesto:** $60,000 MXN
**Story Points:** 90 SP
**Estado:** 📝 A crear
**Sprint:** Sprint 11-13 (Semanas 21-26)
**Última actualización:** 2025-11-17
**Prioridad:** P0

---

## 📋 Propósito

Health, Safety & Environment - Gestión avanzada de seguridad en obra con IA predictiva:
- Registro de incidentes y accidentes con investigación de causas
- Matriz de riesgos y plan de mitigación
- Checklists de seguridad por actividad/área
- Cumplimiento normativo (NOM-031-STPS, OSHA)
- **Analytics e IA para detección de patrones y predicción de riesgos**
- Dashboard de KPIs de seguridad

**Diferenciador:** IA predictiva de riesgos vs sistemas reactivos tradicionales.

**Integración clave:** Se vincula con Proyectos (MAI-002), Control de Obra (MAI-005), RRHH (MAI-007) y Calidad (MAI-009).

---

## 📁 Contenido

### Requerimientos Funcionales (Estimados: 7)

| ID | Título | Estado |
|----|--------|--------|
| RF-HSE-001 | Registro de incidentes y accidentes | 📝 A crear |
| RF-HSE-002 | Matriz de riesgos y evaluación | 📝 A crear |
| RF-HSE-003 | Checklists de seguridad por actividad | 📝 A crear |
| RF-HSE-004 | Cumplimiento normativo y auditorías | 📝 A crear |
| RF-HSE-005 | Capacitaciones y certificaciones de seguridad | 📝 A crear |
| RF-HSE-006 | Analytics de patrones de riesgo (IA) | 📝 A crear |
| RF-HSE-007 | Predicción de probabilidad de incidentes (IA) | 📝 A crear |

### Especificaciones Técnicas (Estimadas: 7)

| ID | Título | RF | Estado |
|----|--------|----|--------|
| ET-HSE-001 | Modelo de datos de incidentes y CAPA | RF-HSE-001 | 📝 A crear |
| ET-HSE-002 | Sistema de evaluación de riesgos (probabilidad × impacto) | RF-HSE-002 | 📝 A crear |
| ET-HSE-003 | Motor de checklists dinámicos por actividad | RF-HSE-003 | 📝 A crear |
| ET-HSE-004 | Sistema de seguimiento normativo | RF-HSE-004 | 📝 A crear |
| ET-HSE-005 | Gestión de capacitaciones y vencimientos | RF-HSE-005 | 📝 A crear |
| ET-HSE-006 | Motor de IA para detección de patrones | RF-HSE-006 | 📝 A crear |
| ET-HSE-007 | Modelo predictivo de riesgos (ML) | RF-HSE-007 | 📝 A crear |

### Historias de Usuario (Estimadas: 18)

| ID | Título | SP | Estado |
|----|--------|----|--------|
| US-HSE-001 | Reportar incidente desde app móvil | 5 | 📝 A crear |
| US-HSE-002 | Investigar causa raíz de incidente | 5 | 📝 A crear |
| US-HSE-003 | Registrar acción correctiva/preventiva | 5 | 📝 A crear |
| US-HSE-004 | Crear matriz de riesgos de proyecto | 5 | 📝 A crear |
| US-HSE-005 | Evaluar riesgo (probabilidad × impacto) | 5 | 📝 A crear |
| US-HSE-006 | Ejecutar checklist de seguridad | 5 | 📝 A crear |
| US-HSE-007 | Verificar uso de EPP en cuadrilla | 5 | 📝 A crear |
| US-HSE-008 | Registrar charla de seguridad (toolbox talk) | 5 | 📝 A crear |
| US-HSE-009 | Configurar requisitos normativos | 5 | 📝 A crear |
| US-HSE-010 | Programar capacitación de seguridad | 5 | 📝 A crear |
| US-HSE-011 | Registrar certificación de trabajador | 5 | 📝 A crear |
| US-HSE-012 | Consultar patrones de riesgo detectados por IA | 5 | 📝 A crear |
| US-HSE-013 | Ver predicción de probabilidad de incidente | 5 | 📝 A crear |
| US-HSE-014 | Recibir recomendación proactiva de IA | 5 | 📝 A crear |
| US-HSE-015 | Dashboard de KPIs de seguridad | 5 | 📝 A crear |
| US-HSE-016 | Reporte de incidentes por tipo/severidad | 5 | 📝 A crear |
| US-HSE-017 | Simular escenario de emergencia | 5 | 📝 A crear |
| US-HSE-018 | Auditoría de seguridad programada | 5 | 📝 A crear |

**Total Story Points:** 90 SP

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
- **Fase 3:** [../README.md](../README.md) - Información de la fase completa
- **Módulo relacionado MVP:** Módulo 17 - Seguridad, Riesgos y HSE (MVP-APP.md)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $60,000 MXN |
| **Story Points estimados** | 90 SP |
| **Duración estimada** | 18 días |
| **Reutilización GAMILIT** | 15% (analytics básico) |
| **RF a implementar** | 7/7 |
| **ET a implementar** | 7/7 |
| **US a completar** | 18/18 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schema:** `hse`
- **Tablas principales:**
  * `incidents` - Incidentes y accidentes
  * `incident_investigations` - Investigaciones de causa raíz
  * `corrective_actions` - Acciones correctivas/preventivas
  * `risk_matrix` - Matriz de riesgos
  * `risk_assessments` - Evaluaciones de riesgo
  * `safety_checklists` - Checklists de seguridad
  * `safety_inspections` - Inspecciones realizadas
  * `safety_trainings` - Capacitaciones de seguridad
  * `worker_certifications` - Certificaciones de trabajadores
  * `toolbox_talks` - Charlas de seguridad
  * `ai_risk_predictions` - Predicciones de IA
  * `ai_pattern_detections` - Patrones detectados
- **ENUMs:**
  * `incident_type` (near_miss, minor_injury, major_injury, fatality, property_damage)
  * `incident_severity` (low, medium, high, critical)
  * `risk_level` (low, medium, high, very_high)
  * `risk_status` (identified, assessed, mitigated, controlled, closed)

### Backend
- **Módulo:** `hse`, `ai-analytics`
- **Path:** `apps/backend/src/modules/hse/`
- **Services:**
  * IncidentService
  * RiskAssessmentService
  * SafetyChecklistService
  * TrainingService
  * ComplianceService
  * AIPatternDetectionService (ML)
  * RiskPredictionService (ML)
- **Controllers:** HSEController, IncidentController, RiskController, AIAnalyticsController
- **Middlewares:** HSEAccessGuard, AIModelRefreshJob

### Frontend
- **Features:** `hse`, `safety`, `risk-management`, `ai-insights`
- **Path:** `apps/frontend/src/features/hse/`
- **Componentes:**
  * IncidentReportForm
  * IncidentInvestigationViewer
  * CAPAManager
  * RiskMatrixEditor
  * RiskHeatmap
  * SafetyChecklistExecutor
  * TrainingScheduler
  * CertificationTracker
  * AIInsightsDashboard
  * RiskPredictionViewer
  * PatternDetectionReport
  * HSEMetricsDashboard
- **Stores:** hseStore, incidentStore, riskStore, aiInsightsStore

### App Móvil
- **Features:** `incident-reporting`, `safety-checklists`
- **Componentes:**
  * QuickIncidentReport (voice + photo)
  * SafetyChecklistMobile
  * EPPVerification (computer vision)

---

## 🚨 Tipos de Incidentes

### Clasificación

| Tipo | Severidad | Descripción | Ejemplo |
|------|-----------|-------------|---------|
| **Cuasi-accidente** | Baja | Evento que pudo causar daño pero no lo hizo | Caída de herramienta que no golpeó a nadie |
| **Lesión menor** | Media | Requiere primeros auxilios | Cortadura superficial |
| **Lesión mayor** | Alta | Requiere atención médica | Fractura |
| **Fatalidad** | Crítica | Muerte de trabajador | Caída de altura fatal |
| **Daño material** | Variable | Daño a equipo/instalaciones | Colisión de vehículo |

---

### Reporte de Incidente

```yaml
incident:
  id: "INC-2025-045"
  date: "2025-11-17T14:30:00Z"
  project_id: "PROJ-001"
  location: "Etapa 1, Manzana A, Lote 12"
  reported_by: "Residente Pedro Martínez"
  reported_date: "2025-11-17T14:35:00Z"

  classification:
    type: "minor_injury"
    severity: "medium"
    category: "fall_from_height"
    immediate_cause: "Falta de arnés de seguridad"

  description:
    title: "Caída de trabajador desde andamio"
    details: "Trabajador resbaló de andamio a 2m de altura. Golpe en rodilla derecha."
    witnesses: ["Juan García", "Carlos López"]

  injured_person:
    worker_id: "WORK-123"
    name: "José Ramírez"
    position: "Albañil"
    contractor: "Construcciones XYZ"
    experience_months: 18

  medical_attention:
    first_aid_provided: true
    first_aid_by: "Paramédico de obra"
    hospitalization_required: false
    diagnosis: "Contusión en rodilla derecha, sin fractura"
    days_off_work: 3

  evidence:
    photos: ["INC-045-PHOTO-1.jpg", "INC-045-PHOTO-2.jpg"]
    videos: []
    witness_statements: ["STMT-045-1.pdf"]

  investigation:
    investigator: "Ing. María López (Coordinadora HSE)"
    investigation_date: "2025-11-18"
    root_cause_analysis:
      immediate_cause: "Trabajador no utilizaba arnés de seguridad"
      basic_cause: "Falta de supervisión en uso de EPP"
      root_cause: "Sistema de verificación de EPP no implementado"
    contributing_factors:
      - "Andamio sin barandal de seguridad"
      - "Superficie húmeda por lluvia"
      - "Trabajador no capacitado en trabajo en altura"

  corrective_actions:
    - action: "Implementar checklist diario de verificación de EPP"
      responsible: "Residente de obra"
      deadline: "2025-11-20"
      status: "completed"

    - action: "Capacitar a toda la cuadrilla en trabajo en altura"
      responsible: "Coordinadora HSE"
      deadline: "2025-11-25"
      status: "in_progress"

    - action: "Instalar barandales en todos los andamios"
      responsible: "Subcontratista"
      deadline: "2025-11-19"
      status: "completed"

  preventive_actions:
    - "Reforzar charlas de seguridad semanales"
    - "Implementar sistema de tarjetas de observación de seguridad"
    - "Auditorías sorpresa de uso de EPP"

  cost_impact:
    medical_costs: 2500.00  # MXN
    lost_time_cost: 4500.00  # 3 días × $1,500/día
    total_cost: 7000.00

  status: "closed"
  closed_date: "2025-11-25"
```

---

## 📊 Matriz de Riesgos

### Metodología de Evaluación

**Probabilidad:**
- 1 - Raro (ocurre menos de 1 vez al año)
- 2 - Improbable (1-2 veces al año)
- 3 - Moderado (3-6 veces al año)
- 4 - Probable (7-12 veces al año)
- 5 - Casi seguro (mensual o más frecuente)

**Impacto:**
- 1 - Insignificante (primeros auxilios)
- 2 - Menor (atención médica, sin días perdidos)
- 3 - Moderado (lesión con días perdidos)
- 4 - Mayor (lesión grave, hospitalización)
- 5 - Catastrófico (fatalidad o incapacidad permanente)

**Nivel de Riesgo = Probabilidad × Impacto**

| Nivel | Rango | Color | Acción |
|-------|-------|-------|--------|
| **Bajo** | 1-4 | 🟢 Verde | Monitorear |
| **Medio** | 5-9 | 🟡 Amarillo | Reducir riesgo |
| **Alto** | 10-15 | 🟠 Naranja | Acción inmediata |
| **Muy Alto** | 16-25 | 🔴 Rojo | Detener actividad |

---

### Matriz de Riesgos Visual

```
IMPACTO
  5 │  5   10   15   20   25
  4 │  4    8   12   16   20
  3 │  3    6    9   12   15
  2 │  2    4    6    8   10
  1 │  1    2    3    4    5
    └─────────────────────────
      1    2    3    4    5
           PROBABILIDAD

🟢 1-4: Bajo
🟡 5-9: Medio
🟠 10-15: Alto
🔴 16-25: Muy Alto
```

---

### Ejemplo de Riesgo Evaluado

```yaml
risk:
  id: "RISK-001"
  project_id: "PROJ-001"
  activity: "Excavación de cimientos"
  hazard: "Derrumbe de zanja"

  initial_assessment:
    probability: 3  # Moderado
    impact: 4  # Mayor (lesión grave)
    risk_level: 12  # Alto (3×4)
    status: "🟠 Alto"

  mitigation_plan:
    - measure: "Instalación de ademado metálico en zanjas >1.5m"
      type: "engineering_control"
      responsible: "Residente"
      implemented: true

    - measure: "Inspección diaria de estabilidad de taludes"
      type: "administrative_control"
      responsible: "Supervisor HSE"
      implemented: true

    - measure: "Capacitación en riesgos de excavación"
      type: "training"
      responsible: "Coordinador HSE"
      implemented: true

    - measure: "Prohibición de entrada a zanja sin autorización"
      type: "administrative_control"
      responsible: "Residente"
      implemented: true

  residual_assessment:
    probability: 1  # Raro
    impact: 4  # Mayor (sigue siendo grave si ocurre)
    risk_level: 4  # Bajo (1×4)
    status: "🟢 Bajo"
    reduction: "67% reducción (de 12 a 4)"

  status: "controlled"
  review_frequency: "monthly"
  last_review: "2025-11-01"
  next_review: "2025-12-01"
```

---

## ✅ Checklists de Seguridad

### Checklist de Excavación

| Item | Verificación | Cumple | Observaciones |
|------|--------------|--------|---------------|
| **Señalización** | Perímetro acordonado con cinta | ✅ | OK |
| **Acceso** | Escalera o rampa de acceso segura | ✅ | OK |
| **Ademado** | Protección de paredes (si >1.5m) | ✅ | Ademado instalado |
| **Materiales** | Materiales alejados >60cm del borde | ⚠️ | Piedras a 40cm, reubicar |
| **EPP** | Casco, botas de seguridad, chaleco | ✅ | Toda cuadrilla equipada |
| **Atmosfera** | Ventilación adecuada, sin gases | ✅ | Medición OK |
| **Herramientas** | Herramientas en buen estado | ✅ | OK |
| **Servicios** | Servicios subterráneos identificados | ✅ | Planos verificados |
| **Supervisión** | Supervisor HSE presente | ✅ | Ing. López en sitio |

**Resultado:** ⚠️ Acción correctiva requerida (reubicar materiales)

---

## 🎓 Capacitaciones de Seguridad

### Capacitaciones Obligatorias

| Capacitación | Duración | Frecuencia | Válida | Obligatoria para |
|--------------|----------|------------|--------|------------------|
| **Inducción general** | 4 hrs | Una vez | Permanente | Todos los trabajadores nuevos |
| **Trabajo en altura** | 8 hrs | Anual | 1 año | Trabajos >1.8m |
| **Espacios confinados** | 8 hrs | Anual | 1 año | Trabajos en tanques, fosas |
| **Uso de EPP** | 2 hrs | Semestral | 6 meses | Todos los trabajadores |
| **Primeros auxilios** | 16 hrs | Bianual | 2 años | Brigadistas |
| **Manejo de extintores** | 4 hrs | Anual | 1 año | Todos los trabajadores |
| **Operación de maquinaria** | 24 hrs | Única + práctica | Permanente | Operadores |

---

### Control de Vencimientos

```yaml
worker:
  id: "WORK-123"
  name: "José Ramírez"
  position: "Albañil"

  certifications:
    - certification: "Inducción general"
      date: "2024-01-15"
      expiration: null  # Permanente
      status: "✅ Vigente"

    - certification: "Trabajo en altura"
      date: "2025-03-10"
      expiration: "2026-03-10"
      status: "✅ Vigente"
      days_to_expiration: 113

    - certification: "Uso de EPP"
      date: "2025-05-20"
      expiration: "2025-11-20"
      status: "🔴 Vencida"
      days_overdue: -3

  alerts:
    - "⚠️ Certificación de EPP vencida, reprogramar capacitación"
```

---

## 🤖 IA Predictiva de Riesgos

### Patrones Detectados por IA

**Algoritmo:** Análisis de series temporales + ML clustering

**Datos de entrada:**
- Historial de incidentes (tipo, hora, ubicación, cuadrilla, clima)
- Datos de RRHH (experiencia, capacitaciones, historial)
- Datos de obra (etapa constructiva, tipo de actividad)
- Datos ambientales (clima, temperatura, hora del día)

---

### Patrón 1: Horarios de Mayor Riesgo

```yaml
pattern:
  id: "PTN-001"
  type: "temporal"
  title: "Incremento de incidentes en horario 15:00-17:00"
  confidence: 87%

  findings:
    - "45% de incidentes ocurren entre 15:00-17:00"
    - "Vs 15% esperado (proporción del día)"
    - "Correlación con fatiga de trabajadores"
    - "Especialmente viernes (fin de semana)"

  hypothesis:
    - "Fatiga acumulada de jornada"
    - "Temperaturas máximas (calor)"
    - "Prisa por terminar jornada"

  recommendations:
    - priority: "high"
      action: "Reforzar supervisión 15:00-17:00"
      estimated_reduction: "25%"

    - priority: "high"
      action: "Pausas de hidratación 14:30 y 16:00"
      estimated_reduction: "15%"

    - priority: "medium"
      action: "Evitar tareas de alto riesgo después de 15:00"
      estimated_reduction: "20%"

  potential_impact: "Reducción estimada de 40% en incidentes de horario crítico"
```

---

### Patrón 2: Cuadrillas de Alto Riesgo

```yaml
pattern:
  id: "PTN-002"
  type: "crew"
  title: "Cuadrilla #5 con incidencia 3× superior al promedio"
  confidence: 92%

  findings:
    - "12 incidentes en 6 meses (cuadrilla #5)"
    - "Vs 4 incidentes promedio en otras cuadrillas"
    - "7 de 12 incidentes relacionados con EPP"
    - "Supervisor con solo 6 meses de experiencia"

  root_cause_analysis:
    - "Supervisor inexperto (6 meses vs 24 meses promedio)"
    - "Alta rotación de personal (40% vs 10% promedio)"
    - "Falta de reforzamiento en uso de EPP"

  recommendations:
    - priority: "critical"
      action: "Asignar mentor experimentado a supervisor"
      estimated_reduction: "50%"

    - priority: "high"
      action: "Capacitación intensiva de EPP a toda la cuadrilla"
      estimated_reduction: "30%"

    - priority: "medium"
      action: "Auditorías diarias sorpresa de EPP"
      estimated_reduction: "20%"

  potential_impact: "Reducción de 65% en incidentes de cuadrilla #5"
```

---

### Predicción de Probabilidad de Incidente

**Modelo:** Random Forest con 1,000 árboles
**Variables:** 35 features (clima, actividad, cuadrilla, hora, día, experiencia, etc.)
**Accuracy:** 78%
**Recall:** 82% (detecta 82% de días con incidente real)

```yaml
prediction:
  date: "2025-11-18"
  project: "Fraccionamiento Los Pinos"
  shift: "morning"  # 07:00-15:00

  risk_score: 0.72  # 72% probabilidad de incidente

  contributing_factors:
    - factor: "Actividad de alto riesgo (excavación profunda)"
      weight: 0.35

    - factor: "Pronóstico de lluvia (60%)"
      weight: 0.25

    - factor: "Lunes (post-descanso)"
      weight: 0.15

    - factor: "Cuadrilla con supervisor nuevo"
      weight: 0.15

    - factor: "Temperatura baja (5°C)"
      weight: 0.10

  alert_level: "🟠 Alto riesgo"

  recommendations:
    - priority: "critical"
      action: "🛑 Suspender excavación si llueve intensamente"

    - priority: "high"
      action: "⚠️ Reforzar charla de seguridad matutina"

    - priority: "high"
      action: "👷 Asignar supervisor experimentado adicional"

    - priority: "medium"
      action: "🔍 Inspecciones cada 2 horas (vs 4 horas normal)"

  estimated_reduction: "Con acciones implementadas: 72% → 25% probabilidad"
```

---

## 📊 Dashboard de HSE

### KPIs Principales

| Métrica | Valor | Meta | Tendencia |
|---------|-------|------|-----------|
| **Días sin accidentes** | 127 | Máximo posible | 📈 ↑ |
| **Tasa de frecuencia** | 12.5 | <15 | ✅ Dentro de meta |
| **Tasa de severidad** | 250 | <300 | ✅ Dentro de meta |
| **Cuasi-accidentes reportados** | 45 | >30 | ✅ Cultura de reporte |
| **Cumplimiento de checklists** | 92% | >90% | ✅ OK |
| **Capacitaciones al día** | 88% | >95% | ⚠️ Mejorar |
| **EPP disponible** | 100% | 100% | ✅ OK |

---

### Fórmulas de Indicadores

**Tasa de Frecuencia:**
```
TF = (Número de accidentes / Horas trabajadas) × 1,000,000
```

**Tasa de Severidad:**
```
TS = (Días perdidos / Horas trabajadas) × 1,000,000
```

**Ejemplo:**
- Accidentes: 5
- Días perdidos: 100
- Horas trabajadas: 400,000
- **TF = (5 / 400,000) × 1,000,000 = 12.5**
- **TS = (100 / 400,000) × 1,000,000 = 250**

---

## 🚨 Puntos Críticos

1. **Cultura de reporte:** Fomentar reporte de cuasi-accidentes (no castigar)
2. **Investigación rigurosa:** Todo incidente debe tener causa raíz identificada
3. **Acciones preventivas:** No solo correctivas, prevenir recurrencia
4. **Capacitaciones vigentes:** Sistema de alertas de vencimientos
5. **IA como apoyo:** Predicciones son probabilísticas, no determinísticas
6. **Acción sobre recomendaciones IA:** No ignorar alertas de alto riesgo
7. **Métricas honestas:** No ocultar incidentes para mejorar KPIs

---

## 🎯 Siguiente Paso

Crear documentación de requerimientos y especificaciones técnicas del módulo.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @hse-team @data-science-team
**Estado:** 📝 A crear
