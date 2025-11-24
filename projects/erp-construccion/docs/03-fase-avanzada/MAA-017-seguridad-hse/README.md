# MAA-017: Seguridad HSE (Health, Safety & Environment)

**Módulo:** Gestión de Seguridad, Salud y Medio Ambiente  
**Story Points:** 50 | **Prioridad:** P0 (Crítica) | **Fase:** 3 (Avanzada)

## Descripción General

Sistema integral para gestión de seguridad e higiene en obra, cumplimiento de normativa NOM-STPS, capacitaciones, equipos de protección personal (EPP), incidentes, y análisis de riesgos.

## Alcance Funcional

### 1. Análisis de Riesgos
- APR (Análisis Preliminar de Riesgos)
- Matriz de riesgos por actividad
- Medidas preventivas y correctivas
- Actualización continua

### 2. Equipos de Protección Personal (EPP)
- Catálogo de EPP requerido por actividad
- Asignación nominal a trabajadores
- Control de entrega y vales
- Fechas de vencimiento
- Inventario de EPP

### 3. Capacitaciones y Certificaciones
- Programa anual de capacitaciones
- Registro de asistencia
- Certificaciones obligatorias (NOM)
- Evaluaciones y constancias
- Alertas de vencimiento

### 4. Inspecciones de Seguridad
- Checklist de inspecciones diarias
- Hallazgos y observaciones
- Acciones correctivas con responsable
- Seguimiento de cierre
- Reportes fotográficos

### 5. Incidentes y Accidentes
- Registro de incidentes/accidentes
- Clasificación de gravedad
- Investigación de causas
- Plan de acción correctiva
- Indicadores HSE (TRIFR, LTIFR)

## Componentes Técnicos

### Backend (NestJS + TypeORM)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    RiskAnalysis, EPP, EPPAssignment, Training,
    SafetyInspection, Incident, CorrectiveAction
  ])],
  providers: [
    RiskService, EPPService, TrainingService,
    InspectionService, IncidentService, HSEMetricsService
  ],
  controllers: [HSEController, IncidentController]
})
export class HSEModule {}
```

### Base de Datos (PostgreSQL)
```sql
CREATE SCHEMA hse;

CREATE TYPE hse.risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE hse.incident_type AS ENUM ('near_miss', 'first_aid', 'medical_treatment', 'lost_time', 'fatality');
CREATE TYPE hse.severity AS ENUM ('minor', 'moderate', 'serious', 'catastrophic');
```

## Integraciones

- **MAI-007 (RRHH):** Trabajadores y capacitaciones
- **MAI-005 (Control Obra):** Actividades y riesgos
- **MAI-013 (Seguridad):** Roles y permisos HSE

## Métricas Clave (KPIs)

- **TRIFR:** Total Recordable Injury Frequency Rate
- **LTIFR:** Lost Time Injury Frequency Rate  
- **Días sin accidentes:** Contador continuo
- **% Cumplimiento capacitaciones:** Meta 100%
- **Hallazgos cerrados:** % de acciones correctivas completadas

---
**Generado:** 2025-11-21
