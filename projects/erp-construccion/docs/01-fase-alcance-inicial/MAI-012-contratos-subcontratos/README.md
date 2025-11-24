# MAI-012: Contratos y Subcontratos

**Módulo:** Gestión de Contratos con Clientes y Subcontratistas  
**Story Points:** 45 | **Prioridad:** Alta | **Fase:** 1

## Descripción General

Sistema para gestión integral de contratos con clientes (desarrollo, llave en mano) y subcontratistas (por especialidad). Incluye generación automática de contratos a partir de plantillas, control de avance vs contratado, gestión de addendas/rescisiones, y flujo de aprobación multinivel.

## Alcance Funcional

### 1. Contratos con Clientes
- Generación automática desde plantillas legales
- Tipos: Desarrollo inmobiliario, Llave en mano, Por administración
- Anexos técnicos y financieros
- Control de avance vs alcance contratado
- Renovaciones y addendas

### 2. Contratos con Subcontratistas
- Catálogo de subcontratistas por especialidad
- Contratos por especialidad: Cimentación, Estructura, Instalaciones, Acabados
- Alcance técnico y especificaciones
- Bitácora de incidencias
- Evaluación de desempeño

### 3. Gestión Documental
- Plantillas dinámicas con merge fields
- Generación PDF con firma electrónica
- Versiones y trazabilidad
- Repositorio de evidencias
- Exportación para legal

### 4. Workflow de Aprobación
- Flujo multinivel: Legal → Dirección → Firma
- Notificaciones automáticas
- Alertas de vencimiento
- Dashboard de contratos activos

## Componentes Técnicos

### Backend (NestJS + TypeORM)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    Contract, ContractTemplate, Subcontractor,
    ContractAddendum, ContractIncident
  ])],
  providers: [ContractService, TemplateEngineService, ApprovalWorkflowService],
  controllers: [ContractController]
})
export class ContractModule {}
```

### Base de Datos (PostgreSQL)
```sql
-- Schema: contracts
CREATE SCHEMA IF NOT EXISTS contracts;

-- Tipos ENUM
CREATE TYPE contracts.contract_type AS ENUM ('client', 'subcontractor');
CREATE TYPE contracts.contract_status AS ENUM ('draft', 'review', 'approved', 'active', 'completed', 'terminated');
CREATE TYPE contracts.subcontractor_specialty AS ENUM ('cimentacion', 'estructura', 'instalaciones', 'acabados', 'urbanizacion');
```

### Frontend (React + TypeScript)
```typescript
interface ContractFormProps {
  type: 'client' | 'subcontractor';
  projectId: string;
  onSave: (contract: Contract) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ type, projectId, onSave }) => {
  // Formulario dinámico según tipo de contrato
  // Carga de plantillas y merge fields
  // Preview PDF en tiempo real
};
```

## Integraciones

- **MAI-001 (Proyectos):** Asociación de contratos a proyectos
- **MAI-002 (Presupuestos):** Validación de montos contratados vs presupuesto
- **MAI-008 (Estimaciones):** Control de avance vs alcance contratado
- **MAI-013 (Seguridad):** Firma electrónica y permisos

## Métricas Clave

- **Contratos activos:** Total por tipo y proyecto
- **Avance vs contratado:** % de alcance ejecutado
- **Alertas de vencimiento:** Contratos próximos a vencer (30/60/90 días)
- **Evaluación subcontratistas:** Score promedio por especialidad
- **Incidencias:** Número y tipo por subcontratista

## Equipo y Roles

- **Director de Proyecto:** Aprobación final de contratos
- **Gerente Legal:** Revisión de términos y condiciones
- **Coordinador de Construcción:** Seguimiento de subcontratistas
- **Administrador de Contratos:** Gestión documental y trazabilidad

---
**Generado:** 2025-11-20
