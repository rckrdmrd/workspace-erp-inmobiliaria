# ET-EST-001: Modelo de Datos de Estimaciones

**ID:** ET-EST-001  
**Módulo:** MAI-008  
**Relacionado con:** RF-EST-001, RF-EST-002

---

## 📋 Schema de Base de Datos: `estimations`

### Tabla: estimations

```sql
CREATE TYPE estimations.estimation_type AS ENUM ('to_client', 'to_subcontractor');
CREATE TYPE estimations.estimation_status AS ENUM (
  'draft', 'submitted', 'reviewed', 'authorized', 'paid', 'rejected', 'cancelled'
);

CREATE TABLE estimations.estimations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,  -- EST-PRJ001-CLI-2025-001
  
  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id),
  contract_id UUID NOT NULL REFERENCES contracts.contracts(id),
  client_id UUID REFERENCES clients.clients(id),  -- Si es to_client
  subcontractor_id UUID REFERENCES subcontractors.subcontractors(id),  -- Si es to_subcontractor
  
  -- Tipo y periodo
  estimation_type estimations.estimation_type NOT NULL,
  numero_estimacion INT NOT NULL,  -- 1, 2, 3...
  periodo_inicio DATE NOT NULL,
  periodo_fin DATE NOT NULL,
  
  -- Montos (en centavos para precision)
  monto_bruto BIGINT NOT NULL,
  amortizacion_anticipo BIGINT DEFAULT 0,
  total_retenciones BIGINT DEFAULT 0,
  monto_neto BIGINT NOT NULL,
  
  -- Desglose retenciones
  retencion_fondo_garantia BIGINT DEFAULT 0,
  retencion_isr BIGINT DEFAULT 0,
  retencion_iva BIGINT DEFAULT 0,
  otras_retenciones BIGINT DEFAULT 0,
  
  -- Estado
  status estimations.estimation_status DEFAULT 'draft',
  
  -- Fechas workflow
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  authorized_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  fecha_pago_estimada DATE,
  fecha_pago_programada DATE,  -- Para subcontratistas
  
  -- Usuarios workflow
  created_by UUID NOT NULL REFERENCES auth_management.users(id),
  submitted_by UUID REFERENCES auth_management.users(id),
  reviewed_by UUID REFERENCES auth_management.users(id),
  authorized_by UUID REFERENCES auth_management.users(id),
  
  -- Pagos
  referencia_pago VARCHAR(100),
  comprobante_pago TEXT,
  
  -- Metadata
  observaciones TEXT,
  razon_rechazo TEXT,
  documentos_pdf TEXT[],
  documentos_excel TEXT[],
  
  -- Audit
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_estimations_project ON estimations.estimations(project_id);
CREATE INDEX idx_estimations_contract ON estimations.estimations(contract_id);
CREATE INDEX idx_estimations_status ON estimations.estimations(status);
CREATE INDEX idx_estimations_type ON estimations.estimations(estimation_type);
CREATE INDEX idx_estimations_periodo ON estimations.estimations(periodo_inicio, periodo_fin);
CREATE INDEX idx_estimations_numero ON estimations.estimations(numero);
```

### Tabla: estimation_items

```sql
CREATE TABLE estimations.estimation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations.estimations(id) ON DELETE CASCADE,
  
  -- Concepto
  concept_catalog_id UUID NOT NULL,  -- Link a catalog de conceptos
  descripcion VARCHAR(500) NOT NULL,
  unidad VARCHAR(50) NOT NULL,
  precio_unitario BIGINT NOT NULL,  -- En centavos
  
  -- Cantidades
  cantidad_contratada DECIMAL(15,4),
  cantidad_estimada_anterior DECIMAL(15,4) DEFAULT 0,
  cantidad_estimada_actual DECIMAL(15,4) NOT NULL,
  cantidad_acumulada DECIMAL(15,4),
  porcentaje_avance DECIMAL(5,2),
  
  -- Importes
  importe_actual BIGINT NOT NULL,
  importe_acumulado BIGINT,
  
  -- Trazabilidad
  avance_obra_id UUID,  -- Link a MAI-005
  verificado_por UUID REFERENCES auth_management.users(id),
  fecha_verificacion TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_estimation_items_estimation ON estimations.estimation_items(estimation_id);
CREATE INDEX idx_estimation_items_concept ON estimations.estimation_items(concept_catalog_id);
```

### Tabla: estimation_workflow_history

```sql
CREATE TABLE estimations.estimation_workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimation_id UUID NOT NULL REFERENCES estimations.estimations(id),
  
  from_status estimations.estimation_status,
  to_status estimations.estimation_status NOT NULL,
  
  user_id UUID NOT NULL REFERENCES auth_management.users(id),
  user_role VARCHAR(50) NOT NULL,
  
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  comentario TEXT,
  razon_rechazo TEXT,
  
  tiempo_respuesta INT  -- Minutos desde transición anterior
);

CREATE INDEX idx_workflow_history_estimation ON estimations.estimation_workflow_history(estimation_id);
CREATE INDEX idx_workflow_history_timestamp ON estimations.estimation_workflow_history(timestamp DESC);
```

---

## 🔧 Backend: NestJS Entities

### estimation.entity.ts

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export enum EstimationType {
  TO_CLIENT = 'to_client',
  TO_SUBCONTRACTOR = 'to_subcontractor'
}

export enum EstimationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  AUTHORIZED = 'authorized',
  PAID = 'paid',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

@Entity({ schema: 'estimations', name: 'estimations' })
export class Estimation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'contract_id' })
  contractId: string;

  @Column({ name: 'client_id', nullable: true })
  clientId?: string;

  @Column({ name: 'subcontractor_id', nullable: true })
  subcontractorId?: string;

  @Column({ type: 'enum', enum: EstimationType })
  estimationType: EstimationType;

  @Column({ name: 'numero_estimacion' })
  numeroEstimacion: number;

  @Column({ type: 'date' })
  periodoInicio: Date;

  @Column({ type: 'date' })
  periodoFin: Date;

  @Column({ type: 'bigint' })
  montoBruto: number;

  @Column({ type: 'bigint', default: 0 })
  amortizacionAnticipo: number;

  @Column({ type: 'bigint', default: 0 })
  totalRetenciones: number;

  @Column({ type: 'bigint' })
  montoNeto: number;

  @Column({ type: 'bigint', default: 0 })
  retencionFondoGarantia: number;

  @Column({ type: 'enum', enum: EstimationStatus, default: EstimationStatus.DRAFT })
  status: EstimationStatus;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ name: 'submitted_at', nullable: true })
  submittedAt?: Date;

  @Column({ name: 'authorized_at', nullable: true })
  authorizedAt?: Date;

  @Column({ name: 'paid_at', nullable: true })
  paidAt?: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'authorized_by', nullable: true })
  authorizedBy?: string;

  @Column({ nullable: true, type: 'text' })
  observaciones?: string;

  @OneToMany(() => EstimationItem, item => item.estimation, { cascade: true })
  items: EstimationItem[];

  // Métodos de cálculo
  calculateMontoNeto(): number {
    return this.montoBruto - this.amortizacionAnticipo - this.totalRetenciones;
  }
}

@Entity({ schema: 'estimations', name: 'estimation_items' })
export class EstimationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'estimation_id' })
  estimationId: string;

  @ManyToOne(() => Estimation, estimation => estimation.items)
  estimation: Estimation;

  @Column({ name: 'concept_catalog_id' })
  conceptCatalogId: string;

  @Column({ length: 500 })
  descripcion: string;

  @Column({ length: 50 })
  unidad: string;

  @Column({ type: 'bigint' })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  cantidadEstimadaActual: number;

  @Column({ type: 'bigint' })
  importeActual: number;

  @Column({ name: 'avance_obra_id', nullable: true })
  avanceObraId?: string;
}
```

---

## 📊 Funciones SQL Útiles

### Función: get_next_estimation_number

```sql
CREATE OR REPLACE FUNCTION estimations.get_next_estimation_number(
  p_project_id UUID,
  p_estimation_type estimations.estimation_type,
  p_year INT
)
RETURNS VARCHAR AS $$
DECLARE
  next_number INT;
  project_code VARCHAR;
  type_code VARCHAR;
BEGIN
  -- Obtener siguiente consecutivo
  SELECT COALESCE(MAX(numero_estimacion), 0) + 1
  INTO next_number
  FROM estimations.estimations
  WHERE project_id = p_project_id
    AND estimation_type = p_estimation_type
    AND EXTRACT(YEAR FROM created_at) = p_year;
  
  -- Obtener código proyecto
  SELECT code INTO project_code
  FROM projects.projects
  WHERE id = p_project_id;
  
  -- Tipo
  type_code := CASE 
    WHEN p_estimation_type = 'to_client' THEN 'CLI'
    WHEN p_estimation_type = 'to_subcontractor' THEN 'SUB'
  END;
  
  RETURN FORMAT('EST-%s-%s-%s-%s',
    project_code,
    type_code,
    p_year,
    LPAD(next_number::TEXT, 3, '0')
  );
END;
$$ LANGUAGE plpgsql;
```

### Función: validate_estimation_totals

```sql
CREATE OR REPLACE FUNCTION estimations.validate_estimation_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que monto_neto = monto_bruto - amortizacion - retenciones
  IF NEW.monto_neto != (NEW.monto_bruto - NEW.amortizacion_anticipo - NEW.total_retenciones) THEN
    RAISE EXCEPTION 'Monto neto incorrecto. Debe ser: monto_bruto - amortizacion - retenciones';
  END IF;
  
  -- Validar que monto_neto >= 0
  IF NEW.monto_neto < 0 THEN
    RAISE EXCEPTION 'Monto neto no puede ser negativo';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_estimation_totals
  BEFORE INSERT OR UPDATE ON estimations.estimations
  FOR EACH ROW
  EXECUTE FUNCTION estimations.validate_estimation_totals();
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
