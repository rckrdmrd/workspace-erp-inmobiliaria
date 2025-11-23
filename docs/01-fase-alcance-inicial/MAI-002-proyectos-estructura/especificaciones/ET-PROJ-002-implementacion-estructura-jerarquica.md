# ET-PROJ-002: Implementación de Estructura Jerárquica de Obra

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Requerimiento base:** RF-PROJ-002
**Prioridad:** P0 (Crítica)
**Estimación:** 8 SP
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Resumen Ejecutivo

Esta especificación técnica implementa la estructura jerárquica de obra de 5 niveles:
- **Proyecto** → **Etapa** → **Manzana** (opcional) → **Lote** → **Vivienda**

Soporta tres tipos de estructuras:
1. **Fraccionamiento Horizontal:** Usa todos los niveles (incluye manzanas)
2. **Conjunto Habitacional:** Sin manzanas (etapa → lotes directamente)
3. **Edificio Vertical:** Etapas representan torres/edificios, manzanas son niveles/pisos

---

## 2. Arquitectura de Base de Datos

### 2.1 Schema SQL

```sql
-- Schema: projects
CREATE SCHEMA IF NOT EXISTS projects;

-- =====================================================
-- TABLA: projects.stages (Etapas)
-- =====================================================
CREATE TABLE projects.stages (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Multi-tenant discriminator (inherited from project)
  -- tenant = constructora in this system (see GLOSARIO.md)
  constructora_id UUID NOT NULL,

  -- Información básica
  code VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  stage_number INTEGER NOT NULL,

  -- Métricas
  total_blocks INTEGER DEFAULT 0,
  total_lots INTEGER DEFAULT 0,
  total_housing_units INTEGER DEFAULT 0,
  total_area_sqm DECIMAL(12, 2),

  -- Fechas
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,

  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'planeada',
  -- Estados: planeada | en_proceso | pausada | terminada | entregada

  -- Ubicación (opcional para etapas físicamente separadas)
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  polygon_coordinates JSONB,

  -- Avance
  physical_progress DECIMAL(5, 2) DEFAULT 0.00,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_project_stage_code UNIQUE (project_id, code),
  CONSTRAINT unique_project_stage_number UNIQUE (project_id, stage_number)
);

CREATE INDEX idx_stages_project ON projects.stages(project_id);
CREATE INDEX idx_stages_constructora ON projects.stages(constructora_id);
CREATE INDEX idx_stages_status ON projects.stages(status);

-- =====================================================
-- TABLA: projects.blocks (Manzanas)
-- =====================================================
CREATE TABLE projects.blocks (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID NOT NULL REFERENCES projects.stages(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Multi-tenant discriminator (inherited from project)
  -- tenant = constructora in this system (see GLOSARIO.md)
  constructora_id UUID NOT NULL,

  -- Información básica
  code VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  block_number INTEGER NOT NULL,

  -- Métricas
  total_lots INTEGER DEFAULT 0,
  total_area_sqm DECIMAL(12, 2),
  buildable_area_sqm DECIMAL(12, 2),
  green_area_sqm DECIMAL(12, 2),

  -- Infraestructura
  has_water BOOLEAN DEFAULT false,
  has_drainage BOOLEAN DEFAULT false,
  has_electricity BOOLEAN DEFAULT false,
  has_public_lighting BOOLEAN DEFAULT false,
  has_paving BOOLEAN DEFAULT false,
  has_sidewalks BOOLEAN DEFAULT false,
  infrastructure_notes TEXT,

  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'planeada',
  -- Estados: planeada | urbanizacion | terminada | entregada

  -- Ubicación
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  polygon_coordinates JSONB,

  -- Avance
  infrastructure_progress DECIMAL(5, 2) DEFAULT 0.00,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_stage_block_code UNIQUE (stage_id, code),
  CONSTRAINT unique_stage_block_number UNIQUE (stage_id, block_number)
);

CREATE INDEX idx_blocks_stage ON projects.blocks(stage_id);
CREATE INDEX idx_blocks_project ON projects.blocks(project_id);
CREATE INDEX idx_blocks_constructora ON projects.blocks(constructora_id);
CREATE INDEX idx_blocks_status ON projects.blocks(status);

-- =====================================================
-- TABLA: projects.lots (Lotes)
-- =====================================================
CREATE TABLE projects.lots (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID REFERENCES projects.blocks(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES projects.stages(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Multi-tenant discriminator (inherited from project)
  -- tenant = constructora in this system (see GLOSARIO.md)
  constructora_id UUID NOT NULL,

  -- Información básica
  code VARCHAR(20) NOT NULL,
  lot_number INTEGER NOT NULL,

  -- Dimensiones
  area_sqm DECIMAL(10, 2) NOT NULL,
  front_meters DECIMAL(6, 2),
  depth_meters DECIMAL(6, 2),

  -- Forma y orientación
  shape VARCHAR(50),
  -- Valores: rectangular | irregular | esquina | cul_de_sac
  orientation VARCHAR(50),
  -- Valores: norte | sur | este | oeste | noreste | noroeste | sureste | suroeste

  -- Prototipo asignado
  prototype_id UUID REFERENCES projects.housing_prototypes(id),
  prototype_version INTEGER,

  -- Topografía
  is_flat BOOLEAN DEFAULT true,
  slope_percentage DECIMAL(5, 2),
  topography_notes TEXT,

  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'disponible',
  -- Estados: disponible | reservado | vendido | en_construccion | terminado | entregado

  -- Venta (opcional)
  sale_price DECIMAL(15, 2),
  sale_date DATE,
  buyer_name VARCHAR(200),

  -- Ubicación
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  polygon_coordinates JSONB,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_stage_lot_code UNIQUE (stage_id, code),
  CONSTRAINT check_block_or_stage CHECK (
    (block_id IS NOT NULL) OR (block_id IS NULL AND stage_id IS NOT NULL)
  )
);

CREATE INDEX idx_lots_block ON projects.lots(block_id);
CREATE INDEX idx_lots_stage ON projects.lots(stage_id);
CREATE INDEX idx_lots_project ON projects.lots(project_id);
CREATE INDEX idx_lots_constructora ON projects.lots(constructora_id);
CREATE INDEX idx_lots_status ON projects.lots(status);
CREATE INDEX idx_lots_prototype ON projects.lots(prototype_id);

-- =====================================================
-- TABLA: projects.housing_units (Viviendas)
-- =====================================================
CREATE TABLE projects.housing_units (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES projects.lots(id) ON DELETE CASCADE,
  block_id UUID REFERENCES projects.blocks(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES projects.stages(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Multi-tenant discriminator (inherited from project)
  -- tenant = constructora in this system (see GLOSARIO.md)
  constructora_id UUID NOT NULL,

  -- Información básica
  code VARCHAR(20) NOT NULL,
  unit_number INTEGER NOT NULL,

  -- Prototipo (heredado del lote al momento de creación)
  prototype_id UUID REFERENCES projects.housing_prototypes(id),
  prototype_name VARCHAR(200),
  prototype_version INTEGER,

  -- Características (heredadas del prototipo pero editables)
  housing_type VARCHAR(50),
  -- Valores: casa_unifamiliar | departamento | duplex | triplex

  levels INTEGER DEFAULT 1,
  bedrooms INTEGER,
  bathrooms DECIMAL(3, 1),
  parking_spaces INTEGER,

  -- Áreas
  land_area_sqm DECIMAL(10, 2),
  built_area_level_1 DECIMAL(10, 2),
  built_area_level_2 DECIMAL(10, 2),
  total_built_area DECIMAL(10, 2),

  -- Acabados
  floor_finish VARCHAR(100),
  wall_finish VARCHAR(100),
  kitchen_type VARCHAR(100),
  bathroom_finish VARCHAR(100),

  -- Estado de construcción
  construction_status VARCHAR(50) NOT NULL DEFAULT 'no_iniciada',
  -- Estados: no_iniciada | cimentacion | estructura | muros | instalaciones | acabados | terminada | entregada

  -- Avance por etapa constructiva
  foundation_progress DECIMAL(5, 2) DEFAULT 0.00,
  structure_progress DECIMAL(5, 2) DEFAULT 0.00,
  walls_progress DECIMAL(5, 2) DEFAULT 0.00,
  installations_progress DECIMAL(5, 2) DEFAULT 0.00,
  finishes_progress DECIMAL(5, 2) DEFAULT 0.00,

  -- Avance global
  physical_progress DECIMAL(5, 2) DEFAULT 0.00,

  -- Fechas de construcción
  construction_start_date DATE,
  planned_completion_date DATE,
  actual_completion_date DATE,
  delivery_date DATE,

  -- Costos
  estimated_cost DECIMAL(15, 2),
  actual_cost DECIMAL(15, 2),

  -- Observaciones
  notes TEXT,
  quality_issues TEXT,

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_project_unit_code UNIQUE (project_id, code)
);

CREATE INDEX idx_housing_units_lot ON projects.housing_units(lot_id);
CREATE INDEX idx_housing_units_block ON projects.housing_units(block_id);
CREATE INDEX idx_housing_units_stage ON projects.housing_units(stage_id);
CREATE INDEX idx_housing_units_project ON projects.housing_units(project_id);
CREATE INDEX idx_housing_units_constructora ON projects.housing_units(constructora_id);
CREATE INDEX idx_housing_units_status ON projects.housing_units(construction_status);
CREATE INDEX idx_housing_units_prototype ON projects.housing_units(prototype_id);

-- =====================================================
-- TRIGGERS para actualizar métricas automáticamente
-- =====================================================

-- Trigger: Actualizar total_lots en Stage cuando se crea/elimina un Lot
CREATE OR REPLACE FUNCTION update_stage_lot_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects.stages
    SET total_lots = total_lots + 1
    WHERE id = NEW.stage_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects.stages
    SET total_lots = total_lots - 1
    WHERE id = OLD.stage_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stage_lot_count
AFTER INSERT OR DELETE ON projects.lots
FOR EACH ROW EXECUTE FUNCTION update_stage_lot_count();

-- Trigger: Actualizar total_blocks en Stage
CREATE OR REPLACE FUNCTION update_stage_block_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects.stages
    SET total_blocks = total_blocks + 1
    WHERE id = NEW.stage_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects.stages
    SET total_blocks = total_blocks - 1
    WHERE id = OLD.stage_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stage_block_count
AFTER INSERT OR DELETE ON projects.blocks
FOR EACH ROW EXECUTE FUNCTION update_stage_block_count();

-- Trigger: Actualizar total_housing_units en Stage
CREATE OR REPLACE FUNCTION update_stage_housing_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects.stages
    SET total_housing_units = total_housing_units + 1
    WHERE id = NEW.stage_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects.stages
    SET total_housing_units = total_housing_units - 1
    WHERE id = OLD.stage_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stage_housing_count
AFTER INSERT OR DELETE ON projects.housing_units
FOR EACH ROW EXECUTE FUNCTION update_stage_housing_count();

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

ALTER TABLE projects.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects.housing_units ENABLE ROW LEVEL SECURITY;

-- Políticas para stages
CREATE POLICY stages_isolation ON projects.stages
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);

-- Políticas para blocks
CREATE POLICY blocks_isolation ON projects.blocks
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);

-- Políticas para lots
CREATE POLICY lots_isolation ON projects.lots
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);

-- Políticas para housing_units
CREATE POLICY housing_units_isolation ON projects.housing_units
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);
```

---

## 3. Implementación Backend (NestJS)

### 3.1 Entities

#### Stage Entity

```typescript
// apps/backend/src/modules/projects/entities/stage.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';
import { Block } from './block.entity';
import { Lot } from './lot.entity';
import { HousingUnit } from './housing-unit.entity';

export enum StageStatus {
  PLANEADA = 'planeada',
  EN_PROCESO = 'en_proceso',
  PAUSADA = 'pausada',
  TERMINADA = 'terminada',
  ENTREGADA = 'entregada',
}

@Entity('stages', { schema: 'projects' })
@Index(['projectId', 'code'], { unique: true })
@Index(['projectId', 'stageNumber'], { unique: true })
@Index(['constructoraId'])
@Index(['status'])
export class Stage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  stageNumber: number;

  // Métricas
  @Column({ type: 'integer', default: 0 })
  totalBlocks: number;

  @Column({ type: 'integer', default: 0 })
  totalLots: number;

  @Column({ type: 'integer', default: 0 })
  totalHousingUnits: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalAreaSqm: number;

  // Fechas
  @Column({ type: 'date', nullable: true })
  plannedStartDate: Date;

  @Column({ type: 'date', nullable: true })
  plannedEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  // Estado
  @Column({ type: 'enum', enum: StageStatus, default: StageStatus.PLANEADA })
  status: StageStatus;

  // Ubicación
  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  polygonCoordinates: object;

  // Avance
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  physicalProgress: number;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Project, (project) => project.stages)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Block, (block) => block.stage, { cascade: true })
  blocks: Block[];

  @OneToMany(() => Lot, (lot) => lot.stage, { cascade: true })
  lots: Lot[];

  @OneToMany(() => HousingUnit, (unit) => unit.stage, { cascade: true })
  housingUnits: HousingUnit[];
}
```

#### Block Entity

```typescript
// apps/backend/src/modules/projects/entities/block.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Stage } from './stage.entity';
import { Project } from './project.entity';
import { Lot } from './lot.entity';
import { HousingUnit } from './housing-unit.entity';

export enum BlockStatus {
  PLANEADA = 'planeada',
  URBANIZACION = 'urbanizacion',
  TERMINADA = 'terminada',
  ENTREGADA = 'entregada',
}

@Entity('blocks', { schema: 'projects' })
@Index(['stageId', 'code'], { unique: true })
@Index(['stageId', 'blockNumber'], { unique: true })
@Index(['constructoraId'])
@Index(['status'])
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  stageId: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  blockNumber: number;

  // Métricas
  @Column({ type: 'integer', default: 0 })
  totalLots: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalAreaSqm: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  buildableAreaSqm: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  greenAreaSqm: number;

  // Infraestructura
  @Column({ type: 'boolean', default: false })
  hasWater: boolean;

  @Column({ type: 'boolean', default: false })
  hasDrainage: boolean;

  @Column({ type: 'boolean', default: false })
  hasElectricity: boolean;

  @Column({ type: 'boolean', default: false })
  hasPublicLighting: boolean;

  @Column({ type: 'boolean', default: false })
  hasPaving: boolean;

  @Column({ type: 'boolean', default: false })
  hasSidewalks: boolean;

  @Column({ type: 'text', nullable: true })
  infrastructureNotes: string;

  // Estado
  @Column({ type: 'enum', enum: BlockStatus, default: BlockStatus.PLANEADA })
  status: BlockStatus;

  // Ubicación
  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  polygonCoordinates: object;

  // Avance
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  infrastructureProgress: number;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Stage, (stage) => stage.blocks)
  @JoinColumn({ name: 'stage_id' })
  stage: Stage;

  @ManyToOne(() => Project, (project) => project.stages)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Lot, (lot) => lot.block, { cascade: true })
  lots: Lot[];

  @OneToMany(() => HousingUnit, (unit) => unit.block)
  housingUnits: HousingUnit[];
}
```

#### Lot Entity

```typescript
// apps/backend/src/modules/projects/entities/lot.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Stage } from './stage.entity';
import { Block } from './block.entity';
import { Project } from './project.entity';
import { HousingUnit } from './housing-unit.entity';
import { HousingPrototype } from './housing-prototype.entity';

export enum LotStatus {
  DISPONIBLE = 'disponible',
  RESERVADO = 'reservado',
  VENDIDO = 'vendido',
  EN_CONSTRUCCION = 'en_construccion',
  TERMINADO = 'terminado',
  ENTREGADO = 'entregado',
}

export enum LotShape {
  RECTANGULAR = 'rectangular',
  IRREGULAR = 'irregular',
  ESQUINA = 'esquina',
  CUL_DE_SAC = 'cul_de_sac',
}

export enum LotOrientation {
  NORTE = 'norte',
  SUR = 'sur',
  ESTE = 'este',
  OESTE = 'oeste',
  NORESTE = 'noreste',
  NOROESTE = 'noroeste',
  SURESTE = 'sureste',
  SUROESTE = 'suroeste',
}

@Entity('lots', { schema: 'projects' })
@Index(['stageId', 'code'], { unique: true })
@Index(['constructoraId'])
@Index(['status'])
@Index(['prototypeId'])
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  blockId: string;

  @Column({ type: 'uuid' })
  stageId: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'integer' })
  lotNumber: number;

  // Dimensiones
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  areaSqm: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  frontMeters: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  depthMeters: number;

  // Forma y orientación
  @Column({ type: 'enum', enum: LotShape, nullable: true })
  shape: LotShape;

  @Column({ type: 'enum', enum: LotOrientation, nullable: true })
  orientation: LotOrientation;

  // Prototipo asignado
  @Column({ type: 'uuid', nullable: true })
  prototypeId: string;

  @Column({ type: 'integer', nullable: true })
  prototypeVersion: number;

  // Topografía
  @Column({ type: 'boolean', default: true })
  isFlat: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  slopePercentage: number;

  @Column({ type: 'text', nullable: true })
  topographyNotes: string;

  // Estado
  @Column({ type: 'enum', enum: LotStatus, default: LotStatus.DISPONIBLE })
  status: LotStatus;

  // Venta
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  salePrice: number;

  @Column({ type: 'date', nullable: true })
  saleDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  buyerName: string;

  // Ubicación
  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  polygonCoordinates: object;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Block, (block) => block.lots, { nullable: true })
  @JoinColumn({ name: 'block_id' })
  block: Block;

  @ManyToOne(() => Stage, (stage) => stage.lots)
  @JoinColumn({ name: 'stage_id' })
  stage: Stage;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => HousingPrototype, { nullable: true })
  @JoinColumn({ name: 'prototype_id' })
  prototype: HousingPrototype;

  @OneToMany(() => HousingUnit, (unit) => unit.lot)
  housingUnits: HousingUnit[];
}
```

#### HousingUnit Entity

```typescript
// apps/backend/src/modules/projects/entities/housing-unit.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Lot } from './lot.entity';
import { Block } from './block.entity';
import { Stage } from './stage.entity';
import { Project } from './project.entity';
import { HousingPrototype } from './housing-prototype.entity';

export enum ConstructionStatus {
  NO_INICIADA = 'no_iniciada',
  CIMENTACION = 'cimentacion',
  ESTRUCTURA = 'estructura',
  MUROS = 'muros',
  INSTALACIONES = 'instalaciones',
  ACABADOS = 'acabados',
  TERMINADA = 'terminada',
  ENTREGADA = 'entregada',
}

export enum HousingType {
  CASA_UNIFAMILIAR = 'casa_unifamiliar',
  DEPARTAMENTO = 'departamento',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
}

@Entity('housing_units', { schema: 'projects' })
@Index(['projectId', 'code'], { unique: true })
@Index(['constructoraId'])
@Index(['constructionStatus'])
@Index(['prototypeId'])
export class HousingUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lotId: string;

  @Column({ type: 'uuid', nullable: true })
  blockId: string;

  @Column({ type: 'uuid' })
  stageId: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'integer' })
  unitNumber: number;

  // Prototipo (snapshot al momento de creación)
  @Column({ type: 'uuid', nullable: true })
  prototypeId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  prototypeName: string;

  @Column({ type: 'integer', nullable: true })
  prototypeVersion: number;

  // Características
  @Column({ type: 'enum', enum: HousingType, nullable: true })
  housingType: HousingType;

  @Column({ type: 'integer', default: 1 })
  levels: number;

  @Column({ type: 'integer', nullable: true })
  bedrooms: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  bathrooms: number;

  @Column({ type: 'integer', nullable: true })
  parkingSpaces: number;

  // Áreas
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  landAreaSqm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  builtAreaLevel1: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  builtAreaLevel2: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalBuiltArea: number;

  // Acabados
  @Column({ type: 'varchar', length: 100, nullable: true })
  floorFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  wallFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  kitchenType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bathroomFinish: string;

  // Estado de construcción
  @Column({ type: 'enum', enum: ConstructionStatus, default: ConstructionStatus.NO_INICIADA })
  constructionStatus: ConstructionStatus;

  // Avance por etapa constructiva
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  foundationProgress: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  structureProgress: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  wallsProgress: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  installationsProgress: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  finishesProgress: number;

  // Avance global (calculado)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  physicalProgress: number;

  // Fechas de construcción
  @Column({ type: 'date', nullable: true })
  constructionStartDate: Date;

  @Column({ type: 'date', nullable: true })
  plannedCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  // Costos
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualCost: number;

  // Observaciones
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  qualityIssues: string;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  // Relaciones
  @ManyToOne(() => Lot, (lot) => lot.housingUnits)
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;

  @ManyToOne(() => Block, (block) => block.housingUnits, { nullable: true })
  @JoinColumn({ name: 'block_id' })
  block: Block;

  @ManyToOne(() => Stage, (stage) => stage.housingUnits)
  @JoinColumn({ name: 'stage_id' })
  stage: Stage;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => HousingPrototype, { nullable: true })
  @JoinColumn({ name: 'prototype_id' })
  prototype: HousingPrototype;
}
```

### 3.2 DTOs

```typescript
// apps/backend/src/modules/projects/dto/create-stage.dto.ts

import { IsString, IsUUID, IsInt, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { StageStatus } from '../entities/stage.entity';

export class CreateStageDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  stageNumber: number;

  @IsOptional()
  @IsNumber()
  totalAreaSqm?: number;

  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @IsOptional()
  @IsEnum(StageStatus)
  status?: StageStatus;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  polygonCoordinates?: object;
}

// apps/backend/src/modules/projects/dto/create-block.dto.ts

import { IsString, IsInt, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { BlockStatus } from '../entities/block.entity';

export class CreateBlockDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  blockNumber: number;

  @IsOptional()
  @IsNumber()
  totalAreaSqm?: number;

  @IsOptional()
  @IsNumber()
  buildableAreaSqm?: number;

  @IsOptional()
  @IsNumber()
  greenAreaSqm?: number;

  @IsOptional()
  @IsBoolean()
  hasWater?: boolean;

  @IsOptional()
  @IsBoolean()
  hasDrainage?: boolean;

  @IsOptional()
  @IsBoolean()
  hasElectricity?: boolean;

  @IsOptional()
  @IsBoolean()
  hasPublicLighting?: boolean;

  @IsOptional()
  @IsBoolean()
  hasPaving?: boolean;

  @IsOptional()
  @IsBoolean()
  hasSidewalks?: boolean;

  @IsOptional()
  @IsString()
  infrastructureNotes?: string;

  @IsOptional()
  @IsEnum(BlockStatus)
  status?: BlockStatus;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  polygonCoordinates?: object;
}

// apps/backend/src/modules/projects/dto/create-lot.dto.ts

import { IsString, IsInt, IsUUID, IsOptional, IsEnum, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { LotStatus, LotShape, LotOrientation } from '../entities/lot.entity';

export class CreateLotDto {
  @IsOptional()
  @IsUUID()
  blockId?: string;

  @IsString()
  code: string;

  @IsInt()
  lotNumber: number;

  @IsNumber()
  areaSqm: number;

  @IsOptional()
  @IsNumber()
  frontMeters?: number;

  @IsOptional()
  @IsNumber()
  depthMeters?: number;

  @IsOptional()
  @IsEnum(LotShape)
  shape?: LotShape;

  @IsOptional()
  @IsEnum(LotOrientation)
  orientation?: LotOrientation;

  @IsOptional()
  @IsUUID()
  prototypeId?: string;

  @IsOptional()
  @IsInt()
  prototypeVersion?: number;

  @IsOptional()
  @IsBoolean()
  isFlat?: boolean;

  @IsOptional()
  @IsNumber()
  slopePercentage?: number;

  @IsOptional()
  @IsString()
  topographyNotes?: string;

  @IsOptional()
  @IsEnum(LotStatus)
  status?: LotStatus;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsDateString()
  saleDate?: string;

  @IsOptional()
  @IsString()
  buyerName?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  polygonCoordinates?: object;
}

// apps/backend/src/modules/projects/dto/bulk-create-lots.dto.ts

import { IsInt, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { LotShape, LotOrientation } from '../entities/lot.entity';

export class BulkCreateLotsDto {
  @IsOptional()
  @IsUUID()
  blockId?: string;

  @IsInt()
  quantity: number;

  @IsString()
  codePrefix: string; // ej: "LOTE-"

  @IsInt()
  startNumber: number; // ej: 1

  @IsNumber()
  areaSqm: number;

  @IsOptional()
  @IsNumber()
  frontMeters?: number;

  @IsOptional()
  @IsNumber()
  depthMeters?: number;

  @IsOptional()
  @IsEnum(LotShape)
  shape?: LotShape;

  @IsOptional()
  @IsEnum(LotOrientation)
  orientation?: LotOrientation;

  @IsOptional()
  @IsUUID()
  prototypeId?: string;

  @IsOptional()
  @IsInt()
  prototypeVersion?: number;
}

// apps/backend/src/modules/projects/dto/create-housing-unit.dto.ts

import { IsString, IsInt, IsUUID, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ConstructionStatus, HousingType } from '../entities/housing-unit.entity';

export class CreateHousingUnitDto {
  @IsUUID()
  lotId: string;

  @IsString()
  code: string;

  @IsInt()
  unitNumber: number;

  @IsOptional()
  @IsUUID()
  prototypeId?: string;

  @IsOptional()
  @IsString()
  prototypeName?: string;

  @IsOptional()
  @IsInt()
  prototypeVersion?: number;

  @IsOptional()
  @IsEnum(HousingType)
  housingType?: HousingType;

  @IsOptional()
  @IsInt()
  levels?: number;

  @IsOptional()
  @IsInt()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsInt()
  parkingSpaces?: number;

  @IsOptional()
  @IsNumber()
  landAreaSqm?: number;

  @IsOptional()
  @IsNumber()
  builtAreaLevel1?: number;

  @IsOptional()
  @IsNumber()
  builtAreaLevel2?: number;

  @IsOptional()
  @IsNumber()
  totalBuiltArea?: number;

  @IsOptional()
  @IsString()
  floorFinish?: string;

  @IsOptional()
  @IsString()
  wallFinish?: string;

  @IsOptional()
  @IsString()
  kitchenType?: string;

  @IsOptional()
  @IsString()
  bathroomFinish?: string;

  @IsOptional()
  @IsEnum(ConstructionStatus)
  constructionStatus?: ConstructionStatus;

  @IsOptional()
  @IsDateString()
  constructionStartDate?: string;

  @IsOptional()
  @IsDateString()
  plannedCompletionDate?: string;

  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

### 3.3 Services

#### StagesService

```typescript
// apps/backend/src/modules/projects/services/stages.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stage, StageStatus } from '../entities/stage.entity';
import { CreateStageDto } from '../dto/create-stage.dto';
import { UpdateStageDto } from '../dto/update-stage.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(Stage)
    private stageRepo: Repository<Stage>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    projectId: string,
    dto: CreateStageDto,
    constructoraId: string,
    userId: string,
  ): Promise<Stage> {
    const stage = this.stageRepo.create({
      ...dto,
      projectId,
      constructoraId,
      createdBy: userId,
    });

    const saved = await this.stageRepo.save(stage);
    this.eventEmitter.emit('stage.created', saved);
    return saved;
  }

  async findAll(projectId: string, constructoraId: string): Promise<Stage[]> {
    return this.stageRepo.find({
      where: { projectId, constructoraId },
      relations: ['blocks', 'lots'],
      order: { stageNumber: 'ASC' },
    });
  }

  async findOne(id: string, constructoraId: string): Promise<Stage> {
    const stage = await this.stageRepo.findOne({
      where: { id, constructoraId },
      relations: ['blocks', 'lots', 'housingUnits'],
    });

    if (!stage) {
      throw new NotFoundException(`Stage con ID ${id} no encontrada`);
    }

    return stage;
  }

  async update(
    id: string,
    dto: UpdateStageDto,
    constructoraId: string,
    userId: string,
  ): Promise<Stage> {
    const stage = await this.findOne(id, constructoraId);

    Object.assign(stage, dto);
    stage.updatedBy = userId;

    return this.stageRepo.save(stage);
  }

  async changeStatus(
    id: string,
    newStatus: StageStatus,
    constructoraId: string,
    userId: string,
  ): Promise<Stage> {
    const stage = await this.findOne(id, constructoraId);

    const oldStatus = stage.status;
    stage.status = newStatus;
    stage.updatedBy = userId;

    // Auto-update dates based on status
    if (newStatus === StageStatus.EN_PROCESO && !stage.actualStartDate) {
      stage.actualStartDate = new Date();
    }

    if (newStatus === StageStatus.TERMINADA && !stage.actualEndDate) {
      stage.actualEndDate = new Date();
    }

    const updated = await this.stageRepo.save(stage);
    this.eventEmitter.emit('stage.status_changed', { stage: updated, oldStatus, newStatus });

    return updated;
  }

  async getTreeStructure(projectId: string, constructoraId: string): Promise<any> {
    const stages = await this.stageRepo.find({
      where: { projectId, constructoraId },
      relations: ['blocks', 'blocks.lots', 'blocks.lots.housingUnits', 'lots', 'lots.housingUnits'],
      order: { stageNumber: 'ASC' },
    });

    return stages.map((stage) => ({
      id: stage.id,
      code: stage.code,
      name: stage.name,
      stageNumber: stage.stageNumber,
      status: stage.status,
      totalBlocks: stage.totalBlocks,
      totalLots: stage.totalLots,
      totalHousingUnits: stage.totalHousingUnits,
      physicalProgress: stage.physicalProgress,
      blocks: stage.blocks.map((block) => ({
        id: block.id,
        code: block.code,
        name: block.name,
        blockNumber: block.blockNumber,
        status: block.status,
        totalLots: block.totalLots,
        infrastructureProgress: block.infrastructureProgress,
        lots: block.lots.map((lot) => ({
          id: lot.id,
          code: lot.code,
          lotNumber: lot.lotNumber,
          areaSqm: lot.areaSqm,
          status: lot.status,
          prototypeId: lot.prototypeId,
          housingUnits: lot.housingUnits.map((unit) => ({
            id: unit.id,
            code: unit.code,
            constructionStatus: unit.constructionStatus,
            physicalProgress: unit.physicalProgress,
          })),
        })),
      })),
      // Lots directly under stage (for projects without blocks)
      lots: stage.lots
        .filter((lot) => !lot.blockId)
        .map((lot) => ({
          id: lot.id,
          code: lot.code,
          lotNumber: lot.lotNumber,
          areaSqm: lot.areaSqm,
          status: lot.status,
          prototypeId: lot.prototypeId,
          housingUnits: lot.housingUnits.map((unit) => ({
            id: unit.id,
            code: unit.code,
            constructionStatus: unit.constructionStatus,
            physicalProgress: unit.physicalProgress,
          })),
        })),
    }));
  }

  async remove(id: string, constructoraId: string): Promise<void> {
    const stage = await this.findOne(id, constructoraId);
    await this.stageRepo.remove(stage);
    this.eventEmitter.emit('stage.deleted', { id });
  }
}
```

#### LotsService (with bulk creation)

```typescript
// apps/backend/src/modules/projects/services/lots.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot, LotStatus } from '../entities/lot.entity';
import { CreateLotDto } from '../dto/create-lot.dto';
import { BulkCreateLotsDto } from '../dto/bulk-create-lots.dto';
import { UpdateLotDto } from '../dto/update-lot.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotRepo: Repository<Lot>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    stageId: string,
    dto: CreateLotDto,
    projectId: string,
    constructoraId: string,
    userId: string,
  ): Promise<Lot> {
    const lot = this.lotRepo.create({
      ...dto,
      stageId,
      projectId,
      constructoraId,
      createdBy: userId,
    });

    const saved = await this.lotRepo.save(lot);
    this.eventEmitter.emit('lot.created', saved);
    return saved;
  }

  async bulkCreate(
    stageId: string,
    dto: BulkCreateLotsDto,
    projectId: string,
    constructoraId: string,
    userId: string,
  ): Promise<Lot[]> {
    const lots: Lot[] = [];

    for (let i = 0; i < dto.quantity; i++) {
      const lotNumber = dto.startNumber + i;
      const code = `${dto.codePrefix}${lotNumber.toString().padStart(3, '0')}`;

      const lot = this.lotRepo.create({
        stageId,
        projectId,
        constructoraId,
        blockId: dto.blockId || null,
        code,
        lotNumber,
        areaSqm: dto.areaSqm,
        frontMeters: dto.frontMeters,
        depthMeters: dto.depthMeters,
        shape: dto.shape,
        orientation: dto.orientation,
        prototypeId: dto.prototypeId,
        prototypeVersion: dto.prototypeVersion,
        status: LotStatus.DISPONIBLE,
        createdBy: userId,
      });

      lots.push(lot);
    }

    const saved = await this.lotRepo.save(lots);
    this.eventEmitter.emit('lots.bulk_created', { stageId, quantity: saved.length });
    return saved;
  }

  async findAll(
    stageId: string,
    constructoraId: string,
    filters?: { status?: LotStatus; blockId?: string },
  ): Promise<Lot[]> {
    const query = this.lotRepo
      .createQueryBuilder('lot')
      .where('lot.stageId = :stageId', { stageId })
      .andWhere('lot.constructoraId = :constructoraId', { constructoraId })
      .leftJoinAndSelect('lot.prototype', 'prototype')
      .leftJoinAndSelect('lot.housingUnits', 'housingUnits')
      .orderBy('lot.lotNumber', 'ASC');

    if (filters?.status) {
      query.andWhere('lot.status = :status', { status: filters.status });
    }

    if (filters?.blockId) {
      query.andWhere('lot.blockId = :blockId', { blockId: filters.blockId });
    }

    return query.getMany();
  }

  async findOne(id: string, constructoraId: string): Promise<Lot> {
    const lot = await this.lotRepo.findOne({
      where: { id, constructoraId },
      relations: ['prototype', 'housingUnits', 'stage', 'block'],
    });

    if (!lot) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    }

    return lot;
  }

  async update(
    id: string,
    dto: UpdateLotDto,
    constructoraId: string,
    userId: string,
  ): Promise<Lot> {
    const lot = await this.findOne(id, constructoraId);

    Object.assign(lot, dto);
    lot.updatedBy = userId;

    return this.lotRepo.save(lot);
  }

  async assignPrototype(
    id: string,
    prototypeId: string,
    prototypeVersion: number,
    constructoraId: string,
    userId: string,
  ): Promise<Lot> {
    const lot = await this.findOne(id, constructoraId);

    lot.prototypeId = prototypeId;
    lot.prototypeVersion = prototypeVersion;
    lot.updatedBy = userId;

    const updated = await this.lotRepo.save(lot);
    this.eventEmitter.emit('lot.prototype_assigned', { lot: updated, prototypeId });

    return updated;
  }

  async bulkAssignPrototype(
    lotIds: string[],
    prototypeId: string,
    prototypeVersion: number,
    constructoraId: string,
    userId: string,
  ): Promise<Lot[]> {
    const lots = await this.lotRepo.find({
      where: { constructoraId },
    });

    const lotsToUpdate = lots.filter((lot) => lotIds.includes(lot.id));

    if (lotsToUpdate.length === 0) {
      throw new BadRequestException('No se encontraron lotes para actualizar');
    }

    lotsToUpdate.forEach((lot) => {
      lot.prototypeId = prototypeId;
      lot.prototypeVersion = prototypeVersion;
      lot.updatedBy = userId;
    });

    const updated = await this.lotRepo.save(lotsToUpdate);
    this.eventEmitter.emit('lots.prototype_bulk_assigned', {
      count: updated.length,
      prototypeId,
    });

    return updated;
  }

  async changeStatus(
    id: string,
    newStatus: LotStatus,
    constructoraId: string,
    userId: string,
  ): Promise<Lot> {
    const lot = await this.findOne(id, constructoraId);

    const oldStatus = lot.status;
    lot.status = newStatus;
    lot.updatedBy = userId;

    // Auto-update sale date if transitioning to sold
    if (newStatus === LotStatus.VENDIDO && !lot.saleDate) {
      lot.saleDate = new Date();
    }

    const updated = await this.lotRepo.save(lot);
    this.eventEmitter.emit('lot.status_changed', { lot: updated, oldStatus, newStatus });

    return updated;
  }

  async remove(id: string, constructoraId: string): Promise<void> {
    const lot = await this.findOne(id, constructoraId);

    if (lot.housingUnits && lot.housingUnits.length > 0) {
      throw new BadRequestException('No se puede eliminar un lote con viviendas asignadas');
    }

    await this.lotRepo.remove(lot);
    this.eventEmitter.emit('lot.deleted', { id });
  }
}
```

#### HousingUnitsService

```typescript
// apps/backend/src/modules/projects/services/housing-units.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HousingUnit, ConstructionStatus } from '../entities/housing-unit.entity';
import { CreateHousingUnitDto } from '../dto/create-housing-unit.dto';
import { UpdateHousingUnitProgressDto } from '../dto/update-housing-unit-progress.dto';
import { Lot } from '../entities/lot.entity';
import { HousingPrototype } from '../entities/housing-prototype.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HousingUnitsService {
  constructor(
    @InjectRepository(HousingUnit)
    private housingUnitRepo: Repository<HousingUnit>,
    @InjectRepository(Lot)
    private lotRepo: Repository<Lot>,
    @InjectRepository(HousingPrototype)
    private prototypeRepo: Repository<HousingPrototype>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateHousingUnitDto,
    constructoraId: string,
    userId: string,
  ): Promise<HousingUnit> {
    // Get lot to inherit project, stage, block info
    const lot = await this.lotRepo.findOne({
      where: { id: dto.lotId, constructoraId },
      relations: ['prototype'],
    });

    if (!lot) {
      throw new NotFoundException(`Lote con ID ${dto.lotId} no encontrado`);
    }

    // If no prototype specified in DTO, use lot's prototype
    let prototypeData = {};
    if (dto.prototypeId || lot.prototypeId) {
      const prototypeId = dto.prototypeId || lot.prototypeId;
      const prototype = await this.prototypeRepo.findOne({
        where: { id: prototypeId, constructoraId },
      });

      if (prototype) {
        prototypeData = {
          prototypeId: prototype.id,
          prototypeName: prototype.name,
          prototypeVersion: prototype.version,
          housingType: prototype.category,
          levels: prototype.levels,
          bedrooms: prototype.bedrooms,
          bathrooms: prototype.bathrooms,
          parkingSpaces: prototype.parkingSpaces,
          landAreaSqm: prototype.landAreaRequired,
          builtAreaLevel1: prototype.builtAreaLevel1,
          builtAreaLevel2: prototype.builtAreaLevel2,
          totalBuiltArea: prototype.totalBuiltArea,
          floorFinish: prototype.floorFinish,
          wallFinish: prototype.wallFinish,
          kitchenType: prototype.kitchenType,
          bathroomFinish: prototype.bathroomFinish,
          estimatedCost: prototype.totalConstructionCost,
        };
      }
    }

    const housingUnit = this.housingUnitRepo.create({
      ...prototypeData,
      ...dto, // DTO overrides prototype defaults
      lotId: lot.id,
      blockId: lot.blockId,
      stageId: lot.stageId,
      projectId: lot.projectId,
      constructoraId,
      createdBy: userId,
    });

    const saved = await this.housingUnitRepo.save(housingUnit);
    this.eventEmitter.emit('housing_unit.created', saved);
    return saved;
  }

  async findAll(
    projectId: string,
    constructoraId: string,
    filters?: { stageId?: string; constructionStatus?: ConstructionStatus },
  ): Promise<HousingUnit[]> {
    const query = this.housingUnitRepo
      .createQueryBuilder('unit')
      .where('unit.projectId = :projectId', { projectId })
      .andWhere('unit.constructoraId = :constructoraId', { constructoraId })
      .leftJoinAndSelect('unit.lot', 'lot')
      .leftJoinAndSelect('unit.stage', 'stage')
      .orderBy('unit.code', 'ASC');

    if (filters?.stageId) {
      query.andWhere('unit.stageId = :stageId', { stageId: filters.stageId });
    }

    if (filters?.constructionStatus) {
      query.andWhere('unit.constructionStatus = :constructionStatus', {
        constructionStatus: filters.constructionStatus,
      });
    }

    return query.getMany();
  }

  async findOne(id: string, constructoraId: string): Promise<HousingUnit> {
    const unit = await this.housingUnitRepo.findOne({
      where: { id, constructoraId },
      relations: ['lot', 'stage', 'block', 'project', 'prototype'],
    });

    if (!unit) {
      throw new NotFoundException(`Vivienda con ID ${id} no encontrada`);
    }

    return unit;
  }

  async updateProgress(
    id: string,
    dto: UpdateHousingUnitProgressDto,
    constructoraId: string,
    userId: string,
  ): Promise<HousingUnit> {
    const unit = await this.findOne(id, constructoraId);

    // Update individual progress values
    if (dto.foundationProgress !== undefined) unit.foundationProgress = dto.foundationProgress;
    if (dto.structureProgress !== undefined) unit.structureProgress = dto.structureProgress;
    if (dto.wallsProgress !== undefined) unit.wallsProgress = dto.wallsProgress;
    if (dto.installationsProgress !== undefined)
      unit.installationsProgress = dto.installationsProgress;
    if (dto.finishesProgress !== undefined) unit.finishesProgress = dto.finishesProgress;

    // Calculate overall physical progress (weighted average)
    unit.physicalProgress =
      (unit.foundationProgress * 0.2 +
        unit.structureProgress * 0.25 +
        unit.wallsProgress * 0.2 +
        unit.installationsProgress * 0.2 +
        unit.finishesProgress * 0.15) /
      1.0;

    // Auto-update construction status based on progress
    if (unit.physicalProgress === 0) {
      unit.constructionStatus = ConstructionStatus.NO_INICIADA;
    } else if (unit.foundationProgress < 100) {
      unit.constructionStatus = ConstructionStatus.CIMENTACION;
    } else if (unit.structureProgress < 100) {
      unit.constructionStatus = ConstructionStatus.ESTRUCTURA;
    } else if (unit.wallsProgress < 100) {
      unit.constructionStatus = ConstructionStatus.MUROS;
    } else if (unit.installationsProgress < 100) {
      unit.constructionStatus = ConstructionStatus.INSTALACIONES;
    } else if (unit.finishesProgress < 100) {
      unit.constructionStatus = ConstructionStatus.ACABADOS;
    } else {
      unit.constructionStatus = ConstructionStatus.TERMINADA;
      if (!unit.actualCompletionDate) {
        unit.actualCompletionDate = new Date();
      }
    }

    // Auto-set construction start date
    if (unit.physicalProgress > 0 && !unit.constructionStartDate) {
      unit.constructionStartDate = new Date();
    }

    unit.updatedBy = userId;

    const updated = await this.housingUnitRepo.save(unit);
    this.eventEmitter.emit('housing_unit.progress_updated', updated);

    return updated;
  }

  async changeStatus(
    id: string,
    newStatus: ConstructionStatus,
    constructoraId: string,
    userId: string,
  ): Promise<HousingUnit> {
    const unit = await this.findOne(id, constructoraId);

    const oldStatus = unit.constructionStatus;
    unit.constructionStatus = newStatus;
    unit.updatedBy = userId;

    // Auto-update dates
    if (newStatus === ConstructionStatus.TERMINADA && !unit.actualCompletionDate) {
      unit.actualCompletionDate = new Date();
    }

    if (newStatus === ConstructionStatus.ENTREGADA && !unit.deliveryDate) {
      unit.deliveryDate = new Date();
    }

    const updated = await this.housingUnitRepo.save(unit);
    this.eventEmitter.emit('housing_unit.status_changed', {
      unit: updated,
      oldStatus,
      newStatus,
    });

    return updated;
  }

  async remove(id: string, constructoraId: string): Promise<void> {
    const unit = await this.findOne(id, constructoraId);
    await this.housingUnitRepo.remove(unit);
    this.eventEmitter.emit('housing_unit.deleted', { id });
  }
}
```

### 3.4 Controllers

```typescript
// apps/backend/src/modules/projects/controllers/stages.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { StagesService } from '../services/stages.service';
import { CreateStageDto } from '../dto/create-stage.dto';
import { UpdateStageDto } from '../dto/update-stage.dto';
import { StageStatus } from '../entities/stage.entity';

@Controller('projects/:projectId/stages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StagesController {
  constructor(private stagesService: StagesService) {}

  @Post()
  @Roles('director', 'admin')
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateStageDto,
    @Request() req,
  ) {
    return this.stagesService.create(projectId, dto, req.user.constructoraId, req.user.sub);
  }

  @Get()
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findAll(@Param('projectId') projectId: string, @Request() req) {
    return this.stagesService.findAll(projectId, req.user.constructoraId);
  }

  @Get('tree')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async getTree(@Param('projectId') projectId: string, @Request() req) {
    return this.stagesService.getTreeStructure(projectId, req.user.constructoraId);
  }

  @Get(':id')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.stagesService.findOne(id, req.user.constructoraId);
  }

  @Put(':id')
  @Roles('director', 'resident', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStageDto,
    @Request() req,
  ) {
    return this.stagesService.update(id, dto, req.user.constructoraId, req.user.sub);
  }

  @Put(':id/status')
  @Roles('director', 'resident', 'admin')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: StageStatus,
    @Request() req,
  ) {
    return this.stagesService.changeStatus(id, status, req.user.constructoraId, req.user.sub);
  }

  @Delete(':id')
  @Roles('director', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    await this.stagesService.remove(id, req.user.constructoraId);
    return { message: 'Etapa eliminada exitosamente' };
  }
}

// apps/backend/src/modules/projects/controllers/lots.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { LotsService } from '../services/lots.service';
import { CreateLotDto } from '../dto/create-lot.dto';
import { BulkCreateLotsDto } from '../dto/bulk-create-lots.dto';
import { UpdateLotDto } from '../dto/update-lot.dto';
import { LotStatus } from '../entities/lot.entity';

@Controller('stages/:stageId/lots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LotsController {
  constructor(private lotsService: LotsService) {}

  @Post()
  @Roles('director', 'admin')
  async create(
    @Param('stageId') stageId: string,
    @Query('projectId') projectId: string,
    @Body() dto: CreateLotDto,
    @Request() req,
  ) {
    return this.lotsService.create(
      stageId,
      dto,
      projectId,
      req.user.constructoraId,
      req.user.sub,
    );
  }

  @Post('bulk')
  @Roles('director', 'admin')
  async bulkCreate(
    @Param('stageId') stageId: string,
    @Query('projectId') projectId: string,
    @Body() dto: BulkCreateLotsDto,
    @Request() req,
  ) {
    return this.lotsService.bulkCreate(
      stageId,
      dto,
      projectId,
      req.user.constructoraId,
      req.user.sub,
    );
  }

  @Get()
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findAll(
    @Param('stageId') stageId: string,
    @Query('status') status: LotStatus,
    @Query('blockId') blockId: string,
    @Request() req,
  ) {
    return this.lotsService.findAll(stageId, req.user.constructoraId, { status, blockId });
  }

  @Get(':id')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.lotsService.findOne(id, req.user.constructoraId);
  }

  @Put(':id')
  @Roles('director', 'resident', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLotDto,
    @Request() req,
  ) {
    return this.lotsService.update(id, dto, req.user.constructoraId, req.user.sub);
  }

  @Put(':id/assign-prototype')
  @Roles('director', 'admin')
  async assignPrototype(
    @Param('id') id: string,
    @Body('prototypeId') prototypeId: string,
    @Body('prototypeVersion') prototypeVersion: number,
    @Request() req,
  ) {
    return this.lotsService.assignPrototype(
      id,
      prototypeId,
      prototypeVersion,
      req.user.constructoraId,
      req.user.sub,
    );
  }

  @Put('bulk-assign-prototype')
  @Roles('director', 'admin')
  async bulkAssignPrototype(
    @Body('lotIds') lotIds: string[],
    @Body('prototypeId') prototypeId: string,
    @Body('prototypeVersion') prototypeVersion: number,
    @Request() req,
  ) {
    return this.lotsService.bulkAssignPrototype(
      lotIds,
      prototypeId,
      prototypeVersion,
      req.user.constructoraId,
      req.user.sub,
    );
  }

  @Put(':id/status')
  @Roles('director', 'resident', 'admin')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: LotStatus,
    @Request() req,
  ) {
    return this.lotsService.changeStatus(id, status, req.user.constructoraId, req.user.sub);
  }

  @Delete(':id')
  @Roles('director', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    await this.lotsService.remove(id, req.user.constructoraId);
    return { message: 'Lote eliminado exitosamente' };
  }
}
```

---

## 4. Implementación Frontend (React + TypeScript)

### 4.1 API Service

```typescript
// apps/frontend/src/services/projects.api.ts

import { apiClient } from './api-client';
import type {
  Stage,
  Block,
  Lot,
  HousingUnit,
  CreateStageDto,
  CreateLotDto,
  BulkCreateLotsDto,
  CreateHousingUnitDto,
  UpdateHousingUnitProgressDto,
} from '../types/projects.types';

export const projectsApi = {
  // Stages
  async getStages(projectId: string): Promise<Stage[]> {
    const { data } = await apiClient.get(`/projects/${projectId}/stages`);
    return data;
  },

  async getStageTree(projectId: string): Promise<any> {
    const { data } = await apiClient.get(`/projects/${projectId}/stages/tree`);
    return data;
  },

  async createStage(projectId: string, dto: CreateStageDto): Promise<Stage> {
    const { data } = await apiClient.post(`/projects/${projectId}/stages`, dto);
    return data;
  },

  async updateStageStatus(stageId: string, projectId: string, status: string): Promise<Stage> {
    const { data } = await apiClient.put(`/projects/${projectId}/stages/${stageId}/status`, {
      status,
    });
    return data;
  },

  // Lots
  async getLots(stageId: string, projectId: string): Promise<Lot[]> {
    const { data } = await apiClient.get(`/stages/${stageId}/lots?projectId=${projectId}`);
    return data;
  },

  async createLot(stageId: string, projectId: string, dto: CreateLotDto): Promise<Lot> {
    const { data } = await apiClient.post(`/stages/${stageId}/lots?projectId=${projectId}`, dto);
    return data;
  },

  async bulkCreateLots(
    stageId: string,
    projectId: string,
    dto: BulkCreateLotsDto,
  ): Promise<Lot[]> {
    const { data } = await apiClient.post(
      `/stages/${stageId}/lots/bulk?projectId=${projectId}`,
      dto,
    );
    return data;
  },

  async assignPrototypeToLot(
    lotId: string,
    prototypeId: string,
    prototypeVersion: number,
  ): Promise<Lot> {
    const { data } = await apiClient.put(`/stages/x/lots/${lotId}/assign-prototype`, {
      prototypeId,
      prototypeVersion,
    });
    return data;
  },

  async bulkAssignPrototype(
    lotIds: string[],
    prototypeId: string,
    prototypeVersion: number,
  ): Promise<Lot[]> {
    const { data } = await apiClient.put(`/stages/x/lots/bulk-assign-prototype`, {
      lotIds,
      prototypeId,
      prototypeVersion,
    });
    return data;
  },

  // Housing Units
  async getHousingUnits(projectId: string): Promise<HousingUnit[]> {
    const { data} = await apiClient.get(`/housing-units?projectId=${projectId}`);
    return data;
  },

  async createHousingUnit(dto: CreateHousingUnitDto): Promise<HousingUnit> {
    const { data } = await apiClient.post(`/housing-units`, dto);
    return data;
  },

  async updateHousingUnitProgress(
    unitId: string,
    dto: UpdateHousingUnitProgressDto,
  ): Promise<HousingUnit> {
    const { data } = await apiClient.put(`/housing-units/${unitId}/progress`, dto);
    return data;
  },
};
```

### 4.2 Components

#### StructureTreeView Component

```typescript
// apps/frontend/src/features/projects/components/StructureTreeView.tsx

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Home, Building, Grid, Square } from 'lucide-react';
import type { Stage, Block, Lot, HousingUnit } from '../../../types/projects.types';

interface TreeNode {
  id: string;
  code: string;
  name: string;
  status: string;
  type: 'stage' | 'block' | 'lot' | 'housing_unit';
  progress?: number;
  children?: TreeNode[];
}

interface StructureTreeViewProps {
  data: Stage[];
  onNodeClick?: (node: TreeNode) => void;
}

export function StructureTreeView({ data, onNodeClick }: StructureTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'stage':
        return <Building className="h-4 w-4" />;
      case 'block':
        return <Grid className="h-4 w-4" />;
      case 'lot':
        return <Square className="h-4 w-4" />;
      case 'housing_unit':
        return <Home className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      planeada: 'bg-gray-100 text-gray-700',
      en_proceso: 'bg-blue-100 text-blue-700',
      pausada: 'bg-yellow-100 text-yellow-700',
      terminada: 'bg-green-100 text-green-700',
      entregada: 'bg-purple-100 text-purple-700',
      disponible: 'bg-green-100 text-green-700',
      vendido: 'bg-blue-100 text-blue-700',
      en_construccion: 'bg-orange-100 text-orange-700',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700';
  };

  const renderTreeNode = (node: any, level: number = 0, type: string) => {
    const hasChildren =
      (type === 'stage' && (node.blocks?.length > 0 || node.lots?.length > 0)) ||
      (type === 'block' && node.lots?.length > 0) ||
      (type === 'lot' && node.housingUnits?.length > 0);

    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded-md transition-colors`}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
          onClick={() => {
            if (hasChildren) toggleNode(node.id);
            onNodeClick?.({ ...node, type });
          }}
        >
          {hasChildren && (
            <button className="p-0.5" onClick={(e) => {
              e.stopPropagation();
              toggleNode(node.id);
            }}>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-5" />}

          <div className="flex items-center gap-2 flex-1">
            {renderIcon(type)}
            <span className="font-medium text-sm">{node.code}</span>
            <span className="text-gray-600 text-sm">{node.name}</span>
            <span
              className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                node.status,
              )}`}
            >
              {node.status}
            </span>
            {node.physicalProgress !== undefined && (
              <span className="text-xs text-gray-500">{node.physicalProgress.toFixed(1)}%</span>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {type === 'stage' &&
              node.blocks?.map((block: any) => renderTreeNode(block, level + 1, 'block'))}
            {type === 'stage' &&
              node.lots
                ?.filter((lot: any) => !lot.blockId)
                .map((lot: any) => renderTreeNode(lot, level + 1, 'lot'))}
            {type === 'block' &&
              node.lots?.map((lot: any) => renderTreeNode(lot, level + 1, 'lot'))}
            {type === 'lot' &&
              node.housingUnits?.map((unit: any) =>
                renderTreeNode(unit, level + 1, 'housing_unit'),
              )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Estructura del Proyecto</h3>
      <div className="space-y-1">
        {data.map((stage) => renderTreeNode(stage, 0, 'stage'))}
      </div>
    </div>
  );
}
```

#### BulkLotCreationForm Component

```typescript
// apps/frontend/src/features/projects/components/BulkLotCreationForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '../../../services/projects.api';

const bulkLotSchema = z.object({
  quantity: z.number().int().min(1).max(500),
  codePrefix: z.string().min(1),
  startNumber: z.number().int().min(1),
  areaSqm: z.number().positive(),
  frontMeters: z.number().positive().optional(),
  depthMeters: z.number().positive().optional(),
  shape: z.enum(['rectangular', 'irregular', 'esquina', 'cul_de_sac']).optional(),
  orientation: z
    .enum(['norte', 'sur', 'este', 'oeste', 'noreste', 'noroeste', 'sureste', 'suroeste'])
    .optional(),
  prototypeId: z.string().uuid().optional(),
});

type BulkLotFormData = z.infer<typeof bulkLotSchema>;

interface BulkLotCreationFormProps {
  stageId: string;
  projectId: string;
  blockId?: string;
  onSuccess: () => void;
}

export function BulkLotCreationForm({
  stageId,
  projectId,
  blockId,
  onSuccess,
}: BulkLotCreationFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BulkLotFormData>({
    resolver: zodResolver(bulkLotSchema),
    defaultValues: {
      quantity: 10,
      codePrefix: 'LOTE-',
      startNumber: 1,
      areaSqm: 120,
      frontMeters: 6,
      depthMeters: 20,
      shape: 'rectangular',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BulkLotFormData) => {
      return projectsApi.bulkCreateLots(stageId, projectId, {
        ...data,
        blockId,
      });
    },
    onSuccess: (data) => {
      toast.success(`${data.length} lotes creados exitosamente`);
      queryClient.invalidateQueries({ queryKey: ['lots', stageId] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear lotes');
    },
  });

  const onSubmit = (data: BulkLotFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de Lotes
          </label>
          <input
            type="number"
            {...form.register('quantity', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {form.formState.errors.quantity && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prefijo de Código</label>
          <input
            type="text"
            {...form.register('codePrefix')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="LOTE-"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número Inicial</label>
          <input
            type="number"
            {...form.register('startNumber', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
          <input
            type="number"
            step="0.01"
            {...form.register('areaSqm', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frente (m)</label>
          <input
            type="number"
            step="0.01"
            {...form.register('frontMeters', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fondo (m)</label>
          <input
            type="number"
            step="0.01"
            {...form.register('depthMeters', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Forma</label>
          <select {...form.register('shape')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="rectangular">Rectangular</option>
            <option value="irregular">Irregular</option>
            <option value="esquina">Esquina</option>
            <option value="cul_de_sac">Cul de Sac</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orientación</label>
          <select
            {...form.register('orientation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sin especificar</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
            <option value="este">Este</option>
            <option value="oeste">Oeste</option>
            <option value="noreste">Noreste</option>
            <option value="noroeste">Noroeste</option>
            <option value="sureste">Sureste</option>
            <option value="suroeste">Suroeste</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creando...' : 'Crear Lotes'}
        </button>
      </div>
    </form>
  );
}
```

#### HousingUnitProgressCard Component

```typescript
// apps/frontend/src/features/projects/components/HousingUnitProgressCard.tsx

import React, { useState } from 'react';
import { Home, TrendingUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '../../../services/projects.api';
import type { HousingUnit } from '../../../types/projects.types';

interface HousingUnitProgressCardProps {
  unit: HousingUnit;
}

export function HousingUnitProgressCard({ unit }: HousingUnitProgressCardProps) {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const [progress, setProgress] = useState({
    foundationProgress: unit.foundationProgress || 0,
    structureProgress: unit.structureProgress || 0,
    wallsProgress: unit.wallsProgress || 0,
    installationsProgress: unit.installationsProgress || 0,
    finishesProgress: unit.finishesProgress || 0,
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof progress) => {
      return projectsApi.updateHousingUnitProgress(unit.id, data);
    },
    onSuccess: () => {
      toast.success('Avance actualizado');
      queryClient.invalidateQueries({ queryKey: ['housing-units'] });
      setEditMode(false);
    },
    onError: () => {
      toast.error('Error al actualizar avance');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(progress);
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      no_iniciada: 'bg-gray-100 text-gray-700',
      cimentacion: 'bg-yellow-100 text-yellow-700',
      estructura: 'bg-orange-100 text-orange-700',
      muros: 'bg-blue-100 text-blue-700',
      instalaciones: 'bg-indigo-100 text-indigo-700',
      acabados: 'bg-purple-100 text-purple-700',
      terminada: 'bg-green-100 text-green-700',
      entregada: 'bg-emerald-100 text-emerald-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-gray-600" />
          <div>
            <h4 className="font-semibold">{unit.code}</h4>
            <p className="text-sm text-gray-600">{unit.prototypeName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.constructionStatus)}`}>
          {unit.constructionStatus}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Avance Global</span>
          <span className="font-semibold">{unit.physicalProgress?.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${unit.physicalProgress}%` }}
          />
        </div>
      </div>

      {editMode ? (
        <div className="space-y-2">
          {[
            { key: 'foundationProgress', label: 'Cimentación' },
            { key: 'structureProgress', label: 'Estructura' },
            { key: 'wallsProgress', label: 'Muros' },
            { key: 'installationsProgress', label: 'Instalaciones' },
            { key: 'finishesProgress', label: 'Acabados' },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-xs mb-1">
                <span>{item.label}</span>
                <span>{progress[item.key as keyof typeof progress]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress[item.key as keyof typeof progress]}
                onChange={(e) =>
                  setProgress({ ...progress, [item.key]: Number(e.target.value) })
                }
                className="w-full h-1"
              />
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Cimentación:</span>
            <span className="ml-1 font-medium">{unit.foundationProgress}%</span>
          </div>
          <div>
            <span className="text-gray-600">Estructura:</span>
            <span className="ml-1 font-medium">{unit.structureProgress}%</span>
          </div>
          <div>
            <span className="text-gray-600">Muros:</span>
            <span className="ml-1 font-medium">{unit.wallsProgress}%</span>
          </div>
          <div>
            <span className="text-gray-600">Instalaciones:</span>
            <span className="ml-1 font-medium">{unit.installationsProgress}%</span>
          </div>
          <div>
            <span className="text-gray-600">Acabados:</span>
            <span className="ml-1 font-medium">{unit.finishesProgress}%</span>
          </div>

          <button
            onClick={() => setEditMode(true)}
            className="col-span-2 mt-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center justify-center gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            Actualizar Avance
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Casos de Uso

### CU-STR-001: Crear Estructura de Fraccionamiento Horizontal

**Actor:** Director de Proyecto
**Precondición:** Proyecto creado con tipo "fraccionamiento_horizontal"

**Flujo Principal:**

1. Director accede a "Crear Estructura" desde el proyecto
2. Sistema muestra wizard de 4 pasos
3. **Paso 1: Crear Etapas**
   - Director define 3 etapas: "Etapa 1", "Etapa 2", "Etapa 3"
   - Cada etapa con código, fechas, área total
4. **Paso 2: Crear Manzanas**
   - Para Etapa 1: 4 manzanas (MZA-A, MZA-B, MZA-C, MZA-D)
   - Define área, infraestructura por manzana
5. **Paso 3: Crear Lotes en Masa**
   - Selecciona MZA-A
   - Usa "Creación masiva": 20 lotes, prefijo "LOTE-", 120 m² cada uno
   - Repite para cada manzana
6. **Paso 4: Asignar Prototipos**
   - Selecciona lotes 1-10 de MZA-A
   - Asigna prototipo "Casa Tipo A v1"
   - Selecciona lotes 11-20
   - Asigna prototipo "Casa Tipo B v1"
7. Sistema crea toda la estructura en transacción
8. Sistema muestra vista de árbol jerárquico
9. Sistema actualiza métricas de proyecto (total de lotes, viviendas proyectadas)

**Resultado:** Estructura completa de fraccionamiento creada con 3 etapas, 12 manzanas, 240 lotes

---

### CU-STR-002: Crear Estructura de Torre Vertical

**Actor:** Director de Proyecto
**Precondición:** Proyecto creado con tipo "edificio_vertical"

**Flujo Principal:**

1. Director accede a "Crear Estructura de Torre"
2. Sistema muestra formulario adaptado:
   - Etapa = Torre/Edificio
   - Manzana = Nivel/Piso
   - Lote = Departamento
3. **Torre 1:**
   - Código: "TORRE-1"
   - 8 niveles (pisos)
4. **Nivel 1 (Planta Baja):**
   - Código: "NIVEL-PB"
   - 4 departamentos (ej: DEPTO-101, DEPTO-102, DEPTO-103, DEPTO-104)
5. **Niveles 2-8:**
   - Cada uno con 4 departamentos
   - Código: NIVEL-2, NIVEL-3, etc.
   - Total: 8 niveles × 4 deptos = 32 departamentos
6. Sistema adapta terminología en UI: "Nivel" en vez de "Manzana"
7. Sistema crea viviendas automáticamente para cada departamento
8. Sistema muestra vista de árbol jerárquico adaptada

**Resultado:** Torre de 8 niveles con 32 departamentos creada

---

### CU-STR-003: Actualizar Avance de Vivienda

**Actor:** Residente de Obra
**Precondición:** Vivienda creada y en construcción

**Flujo Principal:**

1. Residente accede a "Viviendas en Construcción"
2. Sistema muestra tarjetas de viviendas activas
3. Residente selecciona "VIV-A-012"
4. Residente hace clic en "Actualizar Avance"
5. Sistema muestra sliders por etapa constructiva:
   - Cimentación: 100% (ya completa)
   - Estructura: 100% (ya completa)
   - Muros: 60% → Residente ajusta a 80%
   - Instalaciones: 40% → Residente ajusta a 60%
   - Acabados: 10% → Residente ajusta a 20%
6. Residente hace clic en "Guardar"
7. Sistema calcula avance global ponderado:
   - `(100*0.2 + 100*0.25 + 80*0.2 + 60*0.2 + 20*0.15) = 72%`
8. Sistema actualiza `constructionStatus` a "instalaciones" (la etapa más baja < 100%)
9. Sistema emite evento `housing_unit.progress_updated`
10. Sistema actualiza métricas de lote, manzana, etapa, proyecto (cascada)
11. Sistema muestra notificación "Avance actualizado a 72%"

**Resultado:** Avance de vivienda actualizado y reflejado en todas las jerarquías superiores

---

## 6. Tests

```typescript
// apps/backend/src/modules/projects/services/stages.service.spec.ts

describe('StagesService', () => {
  let service: StagesService;
  let repo: Repository<Stage>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StagesService,
        {
          provide: getRepositoryToken(Stage),
          useClass: Repository,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StagesService>(StagesService);
    repo = module.get<Repository<Stage>>(getRepositoryToken(Stage));
  });

  it('should create a stage with sequential number', async () => {
    const projectId = 'uuid-project-1';
    const constructoraId = 'uuid-constructora-1';

    jest.spyOn(repo, 'create').mockReturnValue({
      id: 'uuid-stage-1',
      code: 'ETAPA-1',
      stageNumber: 1,
    } as Stage);

    jest.spyOn(repo, 'save').mockResolvedValue({} as Stage);

    const result = await service.create(
      projectId,
      {
        code: 'ETAPA-1',
        name: 'Etapa 1',
        stageNumber: 1,
      },
      constructoraId,
      'user-id',
    );

    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should build tree structure with nested relations', async () => {
    const mockStages = [
      {
        id: 'stage-1',
        code: 'ETAPA-1',
        blocks: [
          {
            id: 'block-1',
            code: 'MZA-A',
            lots: [
              {
                id: 'lot-1',
                code: 'LOTE-001',
                housingUnits: [{ id: 'unit-1', code: 'VIV-A-001' }],
              },
            ],
          },
        ],
        lots: [],
      },
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(mockStages as Stage[]);

    const tree = await service.getTreeStructure('project-id', 'constructora-id');

    expect(tree).toHaveLength(1);
    expect(tree[0].blocks).toHaveLength(1);
    expect(tree[0].blocks[0].lots).toHaveLength(1);
    expect(tree[0].blocks[0].lots[0].housingUnits).toHaveLength(1);
  });
});
```

---

## 7. Métricas y KPIs

### Métricas Calculadas Automáticamente

1. **Por Etapa:**
   - `totalBlocks`: Contador actualizado por trigger
   - `totalLots`: Contador actualizado por trigger
   - `totalHousingUnits`: Contador actualizado por trigger
   - `physicalProgress`: Promedio ponderado de avance de viviendas

2. **Por Manzana:**
   - `totalLots`: Contador actualizado por trigger
   - `infrastructureProgress`: Promedio de % de infraestructura completada

3. **Por Lote:**
   - Avance heredado de vivienda asignada

4. **Por Vivienda:**
   - `physicalProgress`: Calculado con fórmula ponderada:
     ```
     (foundation * 0.20 +
      structure * 0.25 +
      walls * 0.20 +
      installations * 0.20 +
      finishes * 0.15)
     ```

---

## 8. Permisos por Rol

| Acción | Director | Residente | Ingeniero | Supervisor |
|--------|----------|-----------|-----------|------------|
| Crear Etapa | ✅ | ❌ | ❌ | ❌ |
| Ver Etapas | ✅ | ✅ | ✅ | ✅ |
| Crear Manzanas | ✅ | ✅ | ❌ | ❌ |
| Crear Lotes (masa) | ✅ | ✅ | ❌ | ❌ |
| Asignar Prototipos | ✅ | ✅ | ❌ | ❌ |
| Crear Viviendas | ✅ | ✅ | ❌ | ❌ |
| Actualizar Avance de Vivienda | ✅ | ✅ | ✅ | ✅ |
| Ver Árbol Jerárquico | ✅ | ✅ | ✅ | ✅ |
| Eliminar Etapa | ✅ | ❌ | ❌ | ❌ |
| Exportar Estructura | ✅ | ✅ | ✅ | ❌ |

---

## 9. Validaciones de Negocio

1. **Etapa:**
   - Código único dentro del proyecto
   - `stageNumber` secuencial y único dentro del proyecto

2. **Manzana:**
   - Código único dentro de la etapa
   - No puede eliminarse si tiene lotes asignados

3. **Lote:**
   - Código único dentro de la etapa
   - `areaSqm` debe ser > 0
   - No puede cambiar a estado "vendido" sin `salePrice` y `buyerName`
   - No puede eliminarse si tiene viviendas asignadas

4. **Vivienda:**
   - Cada lote puede tener 1 o más viviendas (ej: dúplex = 2 viviendas en 1 lote)
   - Avances parciales deben estar entre 0 y 100
   - Al llegar a 100% en todas las etapas, `constructionStatus` = 'terminada' automáticamente
   - `actualCompletionDate` se auto-asigna al marcar como terminada

5. **Asignación de Prototipos:**
   - Prototipo debe pertenecer a la misma constructora
   - Prototipo debe estar activo (no deprecated)
   - Se puede asignar en masa a múltiples lotes

---

## 10. Eventos Emitidos

```typescript
// Eventos del sistema
'stage.created': { stage: Stage }
'stage.status_changed': { stage: Stage, oldStatus, newStatus }
'stage.deleted': { id: string }

'block.created': { block: Block }
'block.infrastructure_updated': { block: Block }
'block.deleted': { id: string }

'lot.created': { lot: Lot }
'lots.bulk_created': { stageId: string, quantity: number }
'lot.prototype_assigned': { lot: Lot, prototypeId: string }
'lots.prototype_bulk_assigned': { count: number, prototypeId: string }
'lot.status_changed': { lot: Lot, oldStatus, newStatus }
'lot.deleted': { id: string }

'housing_unit.created': { housingUnit: HousingUnit }
'housing_unit.progress_updated': { housingUnit: HousingUnit }
'housing_unit.status_changed': { housingUnit: HousingUnit, oldStatus, newStatus }
'housing_unit.deleted': { id: string }
```

---

## 11. Optimizaciones de Performance

1. **Índices en Base de Datos:**
   - Índice compuesto en `(project_id, stage_number)` para búsquedas rápidas
   - Índice en `constructora_id` para RLS
   - Índice en `status` para filtros

2. **Carga de Árbol Jerárquico:**
   - Query única con `leftJoinAndSelect` para cargar todas las relaciones
   - Alternativa: Query recursiva SQL para proyectos muy grandes (>10,000 lotes)

3. **Creación Masiva de Lotes:**
   - Inserción en batch (hasta 500 lotes por operación)
   - Transacción única para garantizar atomicidad

4. **Actualización de Métricas:**
   - Triggers de base de datos para contadores (`totalLots`, `totalBlocks`)
   - Cálculo diferido de `physicalProgress` (via job nocturno o on-demand)

---

## 12. Migraciones

```typescript
// apps/backend/src/migrations/1234567890-CreateProjectStructure.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectStructure1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE projects.stages (
        -- Schema definido en sección 2.1
      );
    `);

    await queryRunner.query(`
      CREATE TABLE projects.blocks (
        -- Schema definido en sección 2.1
      );
    `);

    await queryRunner.query(`
      CREATE TABLE projects.lots (
        -- Schema definido en sección 2.1
      );
    `);

    await queryRunner.query(`
      CREATE TABLE projects.housing_units (
        -- Schema definido en sección 2.1
      );
    `);

    // Triggers
    await queryRunner.query(`
      -- Triggers definidos en sección 2.1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS projects.housing_units CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS projects.lots CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS projects.blocks CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS projects.stages CASCADE;`);
  }
}
```

---

## 13. Notas de Implementación

1. **Flexibilidad de Estructura:**
   - `blockId` es nullable en `lots` para soportar proyectos sin manzanas
   - UI adapta terminología según `projectType` (Torre = Niveles, Fraccionamiento = Manzanas)

2. **Herencia de Datos:**
   - Viviendas heredan características del prototipo al momento de creación
   - Cambios posteriores en el prototipo NO afectan viviendas ya creadas
   - Se guarda `prototypeVersion` para trazabilidad

3. **Cascada de Eliminación:**
   - Eliminar etapa → elimina manzanas, lotes, viviendas (CASCADE)
   - Eliminar manzana → elimina lotes y viviendas
   - Validaciones previenen eliminación accidental

4. **Transacciones:**
   - Creación masiva de lotes en transacción única
   - Rollback completo si falla alguna inserción

5. **Auditoría:**
   - Todos los cambios registran `createdBy` y `updatedBy`
   - Timestamps automáticos con `@CreateDateColumn` y `@UpdateDateColumn`

---

**Fecha de generación:** 2025-11-17
**Autor:** Sistema de Documentación Técnica
**Versión:** 1.0
**Estado:** ✅ Completo
