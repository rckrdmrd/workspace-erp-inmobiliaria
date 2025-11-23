# MAI-018: Preconstrucción y Licitaciones

**Módulo:** Gestión de Preconstrucción y Proceso de Licitación  
**Story Points:** 45 | **Prioridad:** P0 (Crítica) | **Fase:** 1

## Descripción General

Sistema para gestión de la fase de preconstrucción incluyendo análisis de viabilidad, presupuestos preliminares, y proceso completo de licitación para selección de contratistas y proveedores. Soporte para licitaciones públicas y privadas.

## Alcance Funcional

### 1. Análisis de Viabilidad
- Estudios de mercado y factibilidad
- Análisis técnico del terreno
- Viabilidad financiera (TIR, VPN, ROI)
- Permisos y licencias requeridas
- Cronograma preliminar

### 2. Presupuesto Preliminar
- Estimación paramétrica ($/m²)
- Catálogo de precios de referencia
- Análisis de costos por etapa
- Comparativo histórico de proyectos similares
- Margen de contingencia

### 3. Proceso de Licitación
- Creación de convocatoria
- Bases de licitación y anexos técnicos
- Registro de participantes
- Recepción de propuestas (técnica y económica)
- Evaluación y comparativo
- Fallo y notificación

### 4. Evaluación de Propuestas
- Tabla comparativa automática
- Criterios ponderados (precio, calidad, experiencia)
- Validación de requisitos técnicos
- Análisis de precios unitarios
- Recomendación de adjudicación

### 5. Gestión de Proveedores/Contratistas
- Catálogo de proveedores certificados
- Historial de participaciones
- Calificación de desempeño
- Documentación legal vigente
- Especialidades y capacidades

## Componentes Técnicos

### Backend (NestJS + TypeORM)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    FeasibilityStudy, PreliminaryBudget, Tender,
    TenderProposal, Vendor, TenderEvaluation
  ])],
  providers: [
    PreconstrutionService, TenderService,
    ProposalEvaluationService, VendorService
  ],
  controllers: [PreconstrutionController, TenderController]
})
export class PreconstrutionModule {}
```

### Base de Datos (PostgreSQL)
```sql
-- Schema: preconstruction
CREATE SCHEMA IF NOT EXISTS preconstruction;

-- Tipos ENUM
CREATE TYPE preconstruction.tender_type AS ENUM ('public', 'private', 'direct');
CREATE TYPE preconstruction.tender_status AS ENUM ('draft', 'published', 'receiving', 'evaluating', 'awarded', 'cancelled');
CREATE TYPE preconstruction.proposal_status AS ENUM ('received', 'evaluating', 'qualified', 'disqualified', 'winner');
```

### Frontend (React + TypeScript)
```typescript
interface TenderDashboardProps {
  projectId: string;
  onSelectTender: (tender: Tender) => void;
}

const TenderDashboard: React.FC<TenderDashboardProps> = ({ projectId, onSelectTender }) => {
  // Listado de licitaciones por proyecto
  // Filtros por estado y tipo
  // Acciones rápidas: crear, publicar, evaluar
};
```

## Integraciones

- **MAI-001 (Proyectos):** Vinculación de licitaciones a proyectos
- **MAI-002 (Presupuestos):** Generación de presupuesto definitivo desde preliminar
- **MAI-012 (Contratos):** Generación automática de contrato al adjudicar
- **MAI-013 (Seguridad):** Control de acceso a información confidencial

## Métricas Clave

- **Licitaciones activas:** Por proyecto y estado
- **Ahorro vs presupuesto:** % de ahorro logrado en licitación
- **Tiempo de proceso:** Días desde publicación hasta fallo
- **Participación:** Número promedio de propuestas por licitación
- **Conversión:** % de licitaciones adjudicadas vs canceladas

## Equipo y Roles

- **Director de Proyecto:** Aprobación de viabilidad y adjudicación
- **Gerente de Preconstrucción:** Análisis técnico y coordinación
- **Área de Compras:** Gestión de licitaciones
- **Comité de Evaluación:** Evaluación de propuestas

---
**Generado:** 2025-11-20
