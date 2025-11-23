# ET-PROJ-003: Implementación de Prototipos de Vivienda

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Requerimiento base:** RF-PROJ-003
**Prioridad:** P0 (Crítica)
**Estimación:** 5 SP
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Resumen Ejecutivo

Esta especificación técnica implementa el **Catálogo de Prototipos de Vivienda** que permite:
- Definir modelos estándar de viviendas con características técnicas y costos
- Versionado de prototipos (v1, v2, v3, etc.)
- Catálogo reutilizable por constructora
- Asignación a lotes en masa
- Herencia de características a viviendas individuales
- Depreciación de versiones antiguas

Los prototipos son **plantillas** que se clonan al crear viviendas, permitiendo modificaciones posteriores sin afectar el catálogo maestro.

---

## 2. Arquitectura de Base de Datos

### 2.1 Schema SQL

```sql
-- Schema: projects
CREATE SCHEMA IF NOT EXISTS projects;

-- =====================================================
-- TABLA: projects.housing_prototypes
-- =====================================================
CREATE TABLE projects.housing_prototypes (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenant discriminator (tenant = constructora)
  -- Each constructora has its own catalog of prototypes (see GLOSARIO.md)
  constructora_id UUID NOT NULL,

  -- Información básica
  code VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Categoría y segmento
  category VARCHAR(50) NOT NULL,
  -- Valores: casa_unifamiliar | departamento | duplex | triplex

  segment VARCHAR(50) NOT NULL,
  -- Valores: interes_social | interes_medio | residencial_medio | residencial_alto | premium

  -- Versionado
  version INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  -- Valores: active | deprecated

  previous_version_id UUID REFERENCES projects.housing_prototypes(id),
  changes_from_previous TEXT,

  -- Características estructurales
  levels INTEGER NOT NULL DEFAULT 1,
  bedrooms INTEGER NOT NULL,
  bathrooms DECIMAL(3, 1) NOT NULL,
  half_bathrooms INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 1,

  -- Áreas (m²)
  land_area_required DECIMAL(10, 2) NOT NULL,
  built_area_level_1 DECIMAL(10, 2) NOT NULL,
  built_area_level_2 DECIMAL(10, 2) DEFAULT 0,
  total_built_area DECIMAL(10, 2) NOT NULL,

  -- Distribución espacial
  living_room BOOLEAN DEFAULT true,
  dining_room BOOLEAN DEFAULT true,
  kitchen_type VARCHAR(50),
  -- Valores: integral | semi_integral | independiente

  laundry_room BOOLEAN DEFAULT false,
  service_room BOOLEAN DEFAULT false,
  study_room BOOLEAN DEFAULT false,

  -- Exteriores
  front_yard BOOLEAN DEFAULT false,
  backyard BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  terrace BOOLEAN DEFAULT false,
  roof_garden BOOLEAN DEFAULT false,

  -- Acabados
  floor_finish VARCHAR(100),
  -- Ej: "Piso cerámico 40x40", "Porcelanato", "Piso laminado"

  wall_finish VARCHAR(100),
  -- Ej: "Pintura vinílica", "Pasta texturizada", "Tirol planchado"

  kitchen_finish VARCHAR(100),
  -- Ej: "Muebles melamina", "Cubierta granito", "Tarja acero inoxidable"

  bathroom_finish VARCHAR(100),
  -- Ej: "Azulejo 20x30", "Mueble con espejo", "Sanitario ahorrador"

  doors_finish VARCHAR(100),
  windows_finish VARCHAR(100),

  -- Instalaciones
  electrical_installation VARCHAR(100),
  -- Ej: "Cableado calibre 12 y 14, contactos tipo NEMA"

  plumbing_installation VARCHAR(100),
  -- Ej: "Tubería PVC hidráulico, cobre para gas"

  has_gas BOOLEAN DEFAULT true,
  has_water_heater BOOLEAN DEFAULT false,
  has_air_conditioning_prep BOOLEAN DEFAULT false,

  -- Características constructivas
  foundation_type VARCHAR(100),
  -- Ej: "Zapatas corridas", "Losa de cimentación"

  structure_type VARCHAR(100),
  -- Ej: "Concreto armado", "Estructura metálica", "Muros de carga"

  wall_type VARCHAR(100),
  -- Ej: "Block de concreto 15cm", "Tabique rojo recocido 14cm"

  roof_type VARCHAR(100),
  -- Ej: "Losa maciza 10cm", "Vigueta y bovedilla"

  -- Costos (MXN)
  cost_per_sqm DECIMAL(10, 2) NOT NULL,
  total_construction_cost DECIMAL(15, 2) NOT NULL,
  urbanization_cost DECIMAL(15, 2) DEFAULT 0,
  total_turnkey_cost DECIMAL(15, 2) NOT NULL,

  -- Imágenes y documentos
  thumbnail_url VARCHAR(500),
  floor_plan_url VARCHAR(500),
  facade_image_url VARCHAR(500),
  render_images JSONB,
  -- Array de URLs: ["url1.jpg", "url2.jpg", ...]

  technical_specs_pdf_url VARCHAR(500),

  -- Metadata
  is_template BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  -- Contador de veces que se ha usado este prototipo

  tags TEXT[],
  -- Ej: ["economico", "familiar", "2_recamaras", "infonavit"]

  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_constructora_code UNIQUE (constructora_id, code),
  CONSTRAINT unique_constructora_name_version UNIQUE (constructora_id, name, version),
  CONSTRAINT check_positive_areas CHECK (
    land_area_required > 0 AND
    built_area_level_1 > 0 AND
    total_built_area > 0
  ),
  CONSTRAINT check_positive_costs CHECK (
    cost_per_sqm > 0 AND
    total_construction_cost > 0 AND
    total_turnkey_cost > 0
  ),
  CONSTRAINT check_total_area CHECK (
    total_built_area = built_area_level_1 + COALESCE(built_area_level_2, 0)
  )
);

CREATE INDEX idx_prototypes_constructora ON projects.housing_prototypes(constructora_id);
CREATE INDEX idx_prototypes_category ON projects.housing_prototypes(category);
CREATE INDEX idx_prototypes_segment ON projects.housing_prototypes(segment);
CREATE INDEX idx_prototypes_status ON projects.housing_prototypes(status);
CREATE INDEX idx_prototypes_version ON projects.housing_prototypes(version);
CREATE INDEX idx_prototypes_tags ON projects.housing_prototypes USING GIN(tags);

-- =====================================================
-- TRIGGER: Actualizar total_built_area automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_prototype_total_area()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_built_area := NEW.built_area_level_1 + COALESCE(NEW.built_area_level_2, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prototype_total_area
BEFORE INSERT OR UPDATE ON projects.housing_prototypes
FOR EACH ROW EXECUTE FUNCTION update_prototype_total_area();

-- =====================================================
-- TRIGGER: Calcular total_turnkey_cost automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_prototype_turnkey_cost()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_turnkey_cost := NEW.total_construction_cost + COALESCE(NEW.urbanization_cost, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_prototype_turnkey_cost
BEFORE INSERT OR UPDATE ON projects.housing_prototypes
FOR EACH ROW EXECUTE FUNCTION calculate_prototype_turnkey_cost();

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
ALTER TABLE projects.housing_prototypes ENABLE ROW LEVEL SECURITY;

CREATE POLICY prototypes_isolation ON projects.housing_prototypes
  USING (constructora_id = current_setting('app.current_constructora_id')::UUID);
```

---

## 3. Implementación Backend (NestJS)

### 3.1 Entity

```typescript
// apps/backend/src/modules/projects/entities/housing-prototype.entity.ts

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

export enum PrototypeCategory {
  CASA_UNIFAMILIAR = 'casa_unifamiliar',
  DEPARTAMENTO = 'departamento',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
}

export enum PrototypeSegment {
  INTERES_SOCIAL = 'interes_social',
  INTERES_MEDIO = 'interes_medio',
  RESIDENCIAL_MEDIO = 'residencial_medio',
  RESIDENCIAL_ALTO = 'residencial_alto',
  PREMIUM = 'premium',
}

export enum PrototypeStatus {
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
}

export enum KitchenType {
  INTEGRAL = 'integral',
  SEMI_INTEGRAL = 'semi_integral',
  INDEPENDIENTE = 'independiente',
}

@Entity('housing_prototypes', { schema: 'projects' })
@Index(['constructoraId', 'code'], { unique: true })
@Index(['constructoraId', 'name', 'version'], { unique: true })
@Index(['constructoraId'])
@Index(['category'])
@Index(['segment'])
@Index(['status'])
export class HousingPrototype {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Multi-tenant discriminator (tenant = constructora)
  // Each constructora has its own catalog of prototypes (see GLOSARIO.md)
  @Column({ type: 'uuid' })
  constructoraId: string;

  // Información básica
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Categoría y segmento
  @Column({ type: 'enum', enum: PrototypeCategory })
  category: PrototypeCategory;

  @Column({ type: 'enum', enum: PrototypeSegment })
  segment: PrototypeSegment;

  // Versionado
  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ type: 'enum', enum: PrototypeStatus, default: PrototypeStatus.ACTIVE })
  status: PrototypeStatus;

  @Column({ type: 'uuid', nullable: true })
  previousVersionId: string;

  @Column({ type: 'text', nullable: true })
  changesFromPrevious: string;

  // Características estructurales
  @Column({ type: 'integer', default: 1 })
  levels: number;

  @Column({ type: 'integer' })
  bedrooms: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  bathrooms: number;

  @Column({ type: 'integer', default: 0 })
  halfBathrooms: number;

  @Column({ type: 'integer', default: 1 })
  parkingSpaces: number;

  // Áreas
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  landAreaRequired: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  builtAreaLevel1: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  builtAreaLevel2: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalBuiltArea: number;

  // Distribución espacial
  @Column({ type: 'boolean', default: true })
  livingRoom: boolean;

  @Column({ type: 'boolean', default: true })
  diningRoom: boolean;

  @Column({ type: 'enum', enum: KitchenType, nullable: true })
  kitchenType: KitchenType;

  @Column({ type: 'boolean', default: false })
  laundryRoom: boolean;

  @Column({ type: 'boolean', default: false })
  serviceRoom: boolean;

  @Column({ type: 'boolean', default: false })
  studyRoom: boolean;

  // Exteriores
  @Column({ type: 'boolean', default: false })
  frontYard: boolean;

  @Column({ type: 'boolean', default: false })
  backyard: boolean;

  @Column({ type: 'boolean', default: false })
  balcony: boolean;

  @Column({ type: 'boolean', default: false })
  terrace: boolean;

  @Column({ type: 'boolean', default: false })
  roofGarden: boolean;

  // Acabados
  @Column({ type: 'varchar', length: 100, nullable: true })
  floorFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  wallFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  kitchenFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bathroomFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  doorsFinish: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  windowsFinish: string;

  // Instalaciones
  @Column({ type: 'varchar', length: 100, nullable: true })
  electricalInstallation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  plumbingInstallation: string;

  @Column({ type: 'boolean', default: true })
  hasGas: boolean;

  @Column({ type: 'boolean', default: false })
  hasWaterHeater: boolean;

  @Column({ type: 'boolean', default: false })
  hasAirConditioningPrep: boolean;

  // Características constructivas
  @Column({ type: 'varchar', length: 100, nullable: true })
  foundationType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  structureType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  wallType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  roofType: string;

  // Costos
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPerSqm: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalConstructionCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  urbanizationCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalTurnkeyCost: number;

  // Imágenes y documentos
  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  floorPlanUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  facadeImageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  renderImages: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  technicalSpecsPdfUrl: string;

  // Metadata
  @Column({ type: 'boolean', default: true })
  isTemplate: boolean;

  @Column({ type: 'integer', default: 0 })
  usageCount: number;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

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
  @ManyToOne(() => HousingPrototype, { nullable: true })
  @JoinColumn({ name: 'previous_version_id' })
  previousVersion: HousingPrototype;
}
```

### 3.2 DTOs

```typescript
// apps/backend/src/modules/projects/dto/create-housing-prototype.dto.ts

import {
  IsString,
  IsEnum,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import {
  PrototypeCategory,
  PrototypeSegment,
  KitchenType,
} from '../entities/housing-prototype.entity';

export class CreateHousingPrototypeDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PrototypeCategory)
  category: PrototypeCategory;

  @IsEnum(PrototypeSegment)
  segment: PrototypeSegment;

  // Características
  @IsInt()
  @Min(1)
  @Max(3)
  levels: number;

  @IsInt()
  @Min(1)
  @Max(10)
  bedrooms: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  bathrooms: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  halfBathrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  parkingSpaces?: number;

  // Áreas
  @IsNumber()
  @Min(0)
  landAreaRequired: number;

  @IsNumber()
  @Min(0)
  builtAreaLevel1: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  builtAreaLevel2?: number;

  // Distribución
  @IsOptional()
  @IsBoolean()
  livingRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  diningRoom?: boolean;

  @IsOptional()
  @IsEnum(KitchenType)
  kitchenType?: KitchenType;

  @IsOptional()
  @IsBoolean()
  laundryRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  serviceRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  studyRoom?: boolean;

  // Exteriores
  @IsOptional()
  @IsBoolean()
  frontYard?: boolean;

  @IsOptional()
  @IsBoolean()
  backyard?: boolean;

  @IsOptional()
  @IsBoolean()
  balcony?: boolean;

  @IsOptional()
  @IsBoolean()
  terrace?: boolean;

  @IsOptional()
  @IsBoolean()
  roofGarden?: boolean;

  // Acabados
  @IsOptional()
  @IsString()
  floorFinish?: string;

  @IsOptional()
  @IsString()
  wallFinish?: string;

  @IsOptional()
  @IsString()
  kitchenFinish?: string;

  @IsOptional()
  @IsString()
  bathroomFinish?: string;

  @IsOptional()
  @IsString()
  doorsFinish?: string;

  @IsOptional()
  @IsString()
  windowsFinish?: string;

  // Instalaciones
  @IsOptional()
  @IsString()
  electricalInstallation?: string;

  @IsOptional()
  @IsString()
  plumbingInstallation?: string;

  @IsOptional()
  @IsBoolean()
  hasGas?: boolean;

  @IsOptional()
  @IsBoolean()
  hasWaterHeater?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAirConditioningPrep?: boolean;

  // Características constructivas
  @IsOptional()
  @IsString()
  foundationType?: string;

  @IsOptional()
  @IsString()
  structureType?: string;

  @IsOptional()
  @IsString()
  wallType?: string;

  @IsOptional()
  @IsString()
  roofType?: string;

  // Costos
  @IsNumber()
  @Min(0)
  costPerSqm: number;

  @IsNumber()
  @Min(0)
  totalConstructionCost: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  urbanizationCost?: number;

  // Imágenes
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsUrl()
  floorPlanUrl?: string;

  @IsOptional()
  @IsUrl()
  facadeImageUrl?: string;

  @IsOptional()
  @IsArray()
  renderImages?: string[];

  @IsOptional()
  @IsUrl()
  technicalSpecsPdfUrl?: string;

  // Metadata
  @IsOptional()
  @IsArray()
  tags?: string[];
}

// apps/backend/src/modules/projects/dto/create-prototype-version.dto.ts

import { IsUUID, IsString } from 'class-validator';
import { CreateHousingPrototypeDto } from './create-housing-prototype.dto';

export class CreatePrototypeVersionDto extends CreateHousingPrototypeDto {
  @IsUUID()
  basePrototypeId: string;

  @IsString()
  changesFromPrevious: string;
}
```

### 3.3 Service

```typescript
// apps/backend/src/modules/projects/services/housing-prototypes.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HousingPrototype, PrototypeStatus } from '../entities/housing-prototype.entity';
import { CreateHousingPrototypeDto } from '../dto/create-housing-prototype.dto';
import { CreatePrototypeVersionDto } from '../dto/create-prototype-version.dto';
import { UpdateHousingPrototypeDto } from '../dto/update-housing-prototype.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HousingPrototypesService {
  constructor(
    @InjectRepository(HousingPrototype)
    private prototypeRepo: Repository<HousingPrototype>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateHousingPrototypeDto,
    constructoraId: string,
    userId: string,
  ): Promise<HousingPrototype> {
    // Generate code if not provided
    const code = dto.code || (await this.generatePrototypeCode(constructoraId, dto.category));

    const prototype = this.prototypeRepo.create({
      ...dto,
      code,
      constructoraId,
      version: 1,
      status: PrototypeStatus.ACTIVE,
      createdBy: userId,
    });

    const saved = await this.prototypeRepo.save(prototype);
    this.eventEmitter.emit('prototype.created', saved);
    return saved;
  }

  async createVersion(
    dto: CreatePrototypeVersionDto,
    constructoraId: string,
    userId: string,
  ): Promise<HousingPrototype> {
    // Get base prototype
    const basePrototype = await this.findOne(dto.basePrototypeId, constructoraId);

    // Deprecate the old version
    basePrototype.status = PrototypeStatus.DEPRECATED;
    await this.prototypeRepo.save(basePrototype);

    // Create new version
    const newVersion = basePrototype.version + 1;

    const prototype = this.prototypeRepo.create({
      ...dto,
      code: basePrototype.code,
      name: basePrototype.name,
      constructoraId,
      version: newVersion,
      previousVersionId: basePrototype.id,
      status: PrototypeStatus.ACTIVE,
      createdBy: userId,
    });

    const saved = await this.prototypeRepo.save(prototype);
    this.eventEmitter.emit('prototype.version_created', {
      newVersion: saved,
      oldVersion: basePrototype,
    });

    return saved;
  }

  async findAll(
    constructoraId: string,
    filters?: {
      category?: string;
      segment?: string;
      status?: PrototypeStatus;
      onlyActive?: boolean;
    },
  ): Promise<HousingPrototype[]> {
    const query = this.prototypeRepo
      .createQueryBuilder('prototype')
      .where('prototype.constructoraId = :constructoraId', { constructoraId })
      .orderBy('prototype.name', 'ASC')
      .addOrderBy('prototype.version', 'DESC');

    if (filters?.category) {
      query.andWhere('prototype.category = :category', { category: filters.category });
    }

    if (filters?.segment) {
      query.andWhere('prototype.segment = :segment', { segment: filters.segment });
    }

    if (filters?.status) {
      query.andWhere('prototype.status = :status', { status: filters.status });
    }

    if (filters?.onlyActive) {
      query.andWhere('prototype.status = :activeStatus', {
        activeStatus: PrototypeStatus.ACTIVE,
      });
    }

    return query.getMany();
  }

  async findOne(id: string, constructoraId: string): Promise<HousingPrototype> {
    const prototype = await this.prototypeRepo.findOne({
      where: { id, constructoraId },
      relations: ['previousVersion'],
    });

    if (!prototype) {
      throw new NotFoundException(`Prototipo con ID ${id} no encontrado`);
    }

    return prototype;
  }

  async update(
    id: string,
    dto: UpdateHousingPrototypeDto,
    constructoraId: string,
    userId: string,
  ): Promise<HousingPrototype> {
    const prototype = await this.findOne(id, constructoraId);

    Object.assign(prototype, dto);
    prototype.updatedBy = userId;

    return this.prototypeRepo.save(prototype);
  }

  async deprecate(id: string, constructoraId: string, userId: string): Promise<HousingPrototype> {
    const prototype = await this.findOne(id, constructoraId);

    if (prototype.status === PrototypeStatus.DEPRECATED) {
      throw new BadRequestException('El prototipo ya está depreciado');
    }

    prototype.status = PrototypeStatus.DEPRECATED;
    prototype.updatedBy = userId;

    const updated = await this.prototypeRepo.save(prototype);
    this.eventEmitter.emit('prototype.deprecated', updated);

    return updated;
  }

  async incrementUsageCount(id: string, constructoraId: string): Promise<void> {
    await this.prototypeRepo.increment({ id, constructoraId }, 'usageCount', 1);
  }

  async getVersionHistory(
    prototypeId: string,
    constructoraId: string,
  ): Promise<HousingPrototype[]> {
    const prototype = await this.findOne(prototypeId, constructoraId);

    // Get all versions with same code
    return this.prototypeRepo.find({
      where: { code: prototype.code, constructoraId },
      order: { version: 'DESC' },
    });
  }

  async getCatalog(
    constructoraId: string,
    groupBy: 'category' | 'segment' = 'category',
  ): Promise<any> {
    const prototypes = await this.findAll(constructoraId, { onlyActive: true });

    if (groupBy === 'category') {
      return this.groupByCategory(prototypes);
    } else {
      return this.groupBySegment(prototypes);
    }
  }

  private groupByCategory(prototypes: HousingPrototype[]): any {
    const grouped: Record<string, HousingPrototype[]> = {};

    prototypes.forEach((p) => {
      if (!grouped[p.category]) {
        grouped[p.category] = [];
      }
      grouped[p.category].push(p);
    });

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      count: items.length,
      prototypes: items,
    }));
  }

  private groupBySegment(prototypes: HousingPrototype[]): any {
    const grouped: Record<string, HousingPrototype[]> = {};

    prototypes.forEach((p) => {
      if (!grouped[p.segment]) {
        grouped[p.segment] = [];
      }
      grouped[p.segment].push(p);
    });

    return Object.entries(grouped).map(([segment, items]) => ({
      segment,
      count: items.length,
      prototypes: items,
    }));
  }

  async remove(id: string, constructoraId: string): Promise<void> {
    const prototype = await this.findOne(id, constructoraId);

    if (prototype.usageCount > 0) {
      throw new BadRequestException(
        `No se puede eliminar un prototipo que ha sido usado ${prototype.usageCount} veces. Considere depreciarlo en su lugar.`,
      );
    }

    await this.prototypeRepo.remove(prototype);
    this.eventEmitter.emit('prototype.deleted', { id });
  }

  async cloneForHousingUnit(id: string, constructoraId: string): Promise<any> {
    const prototype = await this.findOne(id, constructoraId);

    // Increment usage count
    await this.incrementUsageCount(id, constructoraId);

    // Return object with inherited properties (not full entity)
    return {
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

  private async generatePrototypeCode(
    constructoraId: string,
    category: string,
  ): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    const year = new Date().getFullYear();

    const lastPrototype = await this.prototypeRepo
      .createQueryBuilder('prototype')
      .where('prototype.constructoraId = :constructoraId', { constructoraId })
      .andWhere('prototype.code LIKE :prefix', { prefix: `${prefix}-${year}-%` })
      .orderBy('prototype.code', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastPrototype) {
      const lastSequence = parseInt(lastPrototype.code.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${year}-${sequence.toString().padStart(3, '0')}`;
  }

  private getCategoryPrefix(category: string): string {
    const prefixes: Record<string, string> = {
      casa_unifamiliar: 'CASA',
      departamento: 'DEPTO',
      duplex: 'DUPLEX',
      triplex: 'TRIPLEX',
    };
    return prefixes[category] || 'PROTO';
  }
}
```

### 3.4 Controller

```typescript
// apps/backend/src/modules/projects/controllers/housing-prototypes.controller.ts

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
import { HousingPrototypesService } from '../services/housing-prototypes.service';
import { CreateHousingPrototypeDto } from '../dto/create-housing-prototype.dto';
import { CreatePrototypeVersionDto } from '../dto/create-prototype-version.dto';
import { UpdateHousingPrototypeDto } from '../dto/update-housing-prototype.dto';
import { PrototypeStatus } from '../entities/housing-prototype.entity';

@Controller('housing-prototypes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HousingPrototypesController {
  constructor(private prototypesService: HousingPrototypesService) {}

  @Post()
  @Roles('director', 'admin')
  async create(@Body() dto: CreateHousingPrototypeDto, @Request() req) {
    return this.prototypesService.create(dto, req.user.constructoraId, req.user.sub);
  }

  @Post('version')
  @Roles('director', 'admin')
  async createVersion(@Body() dto: CreatePrototypeVersionDto, @Request() req) {
    return this.prototypesService.createVersion(dto, req.user.constructoraId, req.user.sub);
  }

  @Get()
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findAll(
    @Query('category') category: string,
    @Query('segment') segment: string,
    @Query('status') status: PrototypeStatus,
    @Query('onlyActive') onlyActive: boolean,
    @Request() req,
  ) {
    return this.prototypesService.findAll(req.user.constructoraId, {
      category,
      segment,
      status,
      onlyActive,
    });
  }

  @Get('catalog')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async getCatalog(@Query('groupBy') groupBy: 'category' | 'segment', @Request() req) {
    return this.prototypesService.getCatalog(req.user.constructoraId, groupBy);
  }

  @Get(':id')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.prototypesService.findOne(id, req.user.constructoraId);
  }

  @Get(':id/versions')
  @Roles('director', 'resident', 'engineer', 'supervisor', 'admin')
  async getVersionHistory(@Param('id') id: string, @Request() req) {
    return this.prototypesService.getVersionHistory(id, req.user.constructoraId);
  }

  @Put(':id')
  @Roles('director', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHousingPrototypeDto,
    @Request() req,
  ) {
    return this.prototypesService.update(id, dto, req.user.constructoraId, req.user.sub);
  }

  @Put(':id/deprecate')
  @Roles('director', 'admin')
  async deprecate(@Param('id') id: string, @Request() req) {
    return this.prototypesService.deprecate(id, req.user.constructoraId, req.user.sub);
  }

  @Delete(':id')
  @Roles('director', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    await this.prototypesService.remove(id, req.user.constructoraId);
    return { message: 'Prototipo eliminado exitosamente' };
  }
}
```

---

## 4. Implementación Frontend (React + TypeScript)

### 4.1 API Service

```typescript
// apps/frontend/src/services/prototypes.api.ts

import { apiClient } from './api-client';
import type {
  HousingPrototype,
  CreateHousingPrototypeDto,
  CreatePrototypeVersionDto,
  UpdateHousingPrototypeDto,
} from '../types/prototypes.types';

export const prototypesApi = {
  async getAll(filters?: {
    category?: string;
    segment?: string;
    onlyActive?: boolean;
  }): Promise<HousingPrototype[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.segment) params.append('segment', filters.segment);
    if (filters?.onlyActive) params.append('onlyActive', 'true');

    const { data } = await apiClient.get(`/housing-prototypes?${params.toString()}`);
    return data;
  },

  async getOne(id: string): Promise<HousingPrototype> {
    const { data } = await apiClient.get(`/housing-prototypes/${id}`);
    return data;
  },

  async getCatalog(groupBy: 'category' | 'segment' = 'category'): Promise<any> {
    const { data } = await apiClient.get(`/housing-prototypes/catalog?groupBy=${groupBy}`);
    return data;
  },

  async getVersionHistory(id: string): Promise<HousingPrototype[]> {
    const { data } = await apiClient.get(`/housing-prototypes/${id}/versions`);
    return data;
  },

  async create(dto: CreateHousingPrototypeDto): Promise<HousingPrototype> {
    const { data } = await apiClient.post('/housing-prototypes', dto);
    return data;
  },

  async createVersion(dto: CreatePrototypeVersionDto): Promise<HousingPrototype> {
    const { data } = await apiClient.post('/housing-prototypes/version', dto);
    return data;
  },

  async update(id: string, dto: UpdateHousingPrototypeDto): Promise<HousingPrototype> {
    const { data } = await apiClient.put(`/housing-prototypes/${id}`, dto);
    return data;
  },

  async deprecate(id: string): Promise<HousingPrototype> {
    const { data } = await apiClient.put(`/housing-prototypes/${id}/deprecate`);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/housing-prototypes/${id}`);
  },
};
```

### 4.2 Components

#### PrototypeGallery Component

```typescript
// apps/frontend/src/features/prototypes/components/PrototypeGallery.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Home, Bed, Bath, Car, Maximize, Tag } from 'lucide-react';
import { prototypesApi } from '../../../services/prototypes.api';
import type { HousingPrototype } from '../../../types/prototypes.types';

interface PrototypeGalleryProps {
  onSelectPrototype?: (prototype: HousingPrototype) => void;
  selectable?: boolean;
}

export function PrototypeGallery({ onSelectPrototype, selectable = false }: PrototypeGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const { data: prototypes, isLoading } = useQuery({
    queryKey: ['prototypes', selectedCategory, selectedSegment],
    queryFn: () =>
      prototypesApi.getAll({
        category: selectedCategory || undefined,
        segment: selectedSegment || undefined,
        onlyActive: true,
      }),
  });

  const getSegmentColor = (segment: string): string => {
    const colors: Record<string, string> = {
      interes_social: 'bg-green-100 text-green-700',
      interes_medio: 'bg-blue-100 text-blue-700',
      residencial_medio: 'bg-purple-100 text-purple-700',
      residencial_alto: 'bg-orange-100 text-orange-700',
      premium: 'bg-red-100 text-red-700',
    };
    return colors[segment] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando prototipos...</div>;
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todas las categorías</option>
          <option value="casa_unifamiliar">Casa Unifamiliar</option>
          <option value="departamento">Departamento</option>
          <option value="duplex">Dúplex</option>
          <option value="triplex">Tríplex</option>
        </select>

        <select
          value={selectedSegment || ''}
          onChange={(e) => setSelectedSegment(e.target.value || null)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los segmentos</option>
          <option value="interes_social">Interés Social</option>
          <option value="interes_medio">Interés Medio</option>
          <option value="residencial_medio">Residencial Medio</option>
          <option value="residencial_alto">Residencial Alto</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prototypes?.map((prototype) => (
          <div
            key={prototype.id}
            className={`bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow ${
              selectable ? 'cursor-pointer' : ''
            }`}
            onClick={() => selectable && onSelectPrototype?.(prototype)}
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 relative">
              {prototype.facadeImageUrl ? (
                <img
                  src={prototype.facadeImageUrl}
                  alt={prototype.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(prototype.segment)}`}>
                  {prototype.segment.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{prototype.name}</h3>
                  <p className="text-sm text-gray-600">
                    {prototype.code} v{prototype.version}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1 text-gray-700">
                  <Bed className="h-4 w-4" />
                  <span>{prototype.bedrooms} rec.</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Bath className="h-4 w-4" />
                  <span>{prototype.bathrooms} baños</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Car className="h-4 w-4" />
                  <span>{prototype.parkingSpaces} autos</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Maximize className="h-4 w-4" />
                  <span>{prototype.totalBuiltArea} m²</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-3">
                <div className="text-sm text-gray-600">Costo construcción</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(prototype.totalConstructionCost)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(prototype.costPerSqm)}/m²
                </div>
              </div>

              {/* Tags */}
              {prototype.tags && prototype.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {prototype.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {prototypes?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron prototipos con los filtros seleccionados
        </div>
      )}
    </div>
  );
}
```

#### PrototypeForm Component

```typescript
// apps/frontend/src/features/prototypes/components/PrototypeForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { prototypesApi } from '../../../services/prototypes.api';

const prototypeSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  category: z.enum(['casa_unifamiliar', 'departamento', 'duplex', 'triplex']),
  segment: z.enum([
    'interes_social',
    'interes_medio',
    'residencial_medio',
    'residencial_alto',
    'premium',
  ]),
  levels: z.number().int().min(1).max(3),
  bedrooms: z.number().int().min(1).max(10),
  bathrooms: z.number().min(1).max(10),
  halfBathrooms: z.number().int().min(0).optional(),
  parkingSpaces: z.number().int().min(0).max(10).optional(),
  landAreaRequired: z.number().positive(),
  builtAreaLevel1: z.number().positive(),
  builtAreaLevel2: z.number().min(0).optional(),
  costPerSqm: z.number().positive(),
  totalConstructionCost: z.number().positive(),
  urbanizationCost: z.number().min(0).optional(),
  floorFinish: z.string().optional(),
  wallFinish: z.string().optional(),
  kitchenFinish: z.string().optional(),
  bathroomFinish: z.string().optional(),
});

type PrototypeFormData = z.infer<typeof prototypeSchema>;

interface PrototypeFormProps {
  prototypeId?: string;
  onSuccess: () => void;
}

export function PrototypeForm({ prototypeId, onSuccess }: PrototypeFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<PrototypeFormData>({
    resolver: zodResolver(prototypeSchema),
    defaultValues: {
      levels: 1,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      category: 'casa_unifamiliar',
      segment: 'interes_social',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PrototypeFormData) => prototypesApi.create(data),
    onSuccess: () => {
      toast.success('Prototipo creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['prototypes'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear prototipo');
    },
  });

  const onSubmit = (data: PrototypeFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            {...form.register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Casa Tipo A - Modelo Compacto"
          />
          {form.formState.errors.name && (
            <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select {...form.register('category')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="casa_unifamiliar">Casa Unifamiliar</option>
            <option value="departamento">Departamento</option>
            <option value="duplex">Dúplex</option>
            <option value="triplex">Tríplex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
          <select {...form.register('segment')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="interes_social">Interés Social</option>
            <option value="interes_medio">Interés Medio</option>
            <option value="residencial_medio">Residencial Medio</option>
            <option value="residencial_alto">Residencial Alto</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Characteristics */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Características</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveles</label>
            <input
              type="number"
              {...form.register('levels', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recámaras</label>
            <input
              type="number"
              {...form.register('bedrooms', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
            <input
              type="number"
              step="0.5"
              {...form.register('bathrooms', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autos</label>
            <input
              type="number"
              {...form.register('parkingSpaces', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Areas */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Áreas (m²)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terreno requerido</label>
            <input
              type="number"
              step="0.01"
              {...form.register('landAreaRequired', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Construida nivel 1</label>
            <input
              type="number"
              step="0.01"
              {...form.register('builtAreaLevel1', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Construida nivel 2</label>
            <input
              type="number"
              step="0.01"
              {...form.register('builtAreaLevel2', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Finishes */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Acabados</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
            <input
              type="text"
              {...form.register('floorFinish')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: Piso cerámico 40x40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Muros</label>
            <input
              type="text"
              {...form.register('wallFinish')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: Pintura vinílica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cocina</label>
            <input
              type="text"
              {...form.register('kitchenFinish')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: Muebles melamina"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
            <input
              type="text"
              {...form.register('bathroomFinish')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: Azulejo 20x30"
            />
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Costos (MXN)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo por m²</label>
            <input
              type="number"
              step="0.01"
              {...form.register('costPerSqm', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo construcción total</label>
            <input
              type="number"
              step="0.01"
              {...form.register('totalConstructionCost', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo urbanización</label>
            <input
              type="number"
              step="0.01"
              {...form.register('urbanizationCost', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
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
          {createMutation.isPending ? 'Creando...' : 'Crear Prototipo'}
        </button>
      </div>
    </form>
  );
}
```

---

## 5. Casos de Uso

### CU-PROTO-001: Crear Prototipo Inicial

**Actor:** Director de Proyecto
**Precondición:** Usuario autenticado con rol de Director

**Flujo Principal:**

1. Director accede a "Catálogo de Prototipos"
2. Director hace clic en "Nuevo Prototipo"
3. Sistema muestra formulario de creación
4. Director completa:
   - Nombre: "Casa Tipo A - Modelo Compacto"
   - Categoría: Casa Unifamiliar
   - Segmento: Interés Social
   - Recámaras: 2, Baños: 1, Autos: 1
   - Área terreno: 120 m², Construida: 45 m²
   - Acabados: Piso cerámico, Pintura vinílica, Muebles melamina
   - Costo: $8,500/m², Total: $382,500
5. Director hace clic en "Crear"
6. Sistema genera código automático: "CASA-2025-001"
7. Sistema asigna version: 1
8. Sistema guarda prototipo con status "active"
9. Sistema muestra notificación "Prototipo creado exitosamente"
10. Sistema redirige a vista de detalle del prototipo

**Resultado:** Prototipo "CASA-2025-001 v1" creado y disponible en catálogo

---

### CU-PROTO-002: Crear Nueva Versión de Prototipo

**Actor:** Director de Proyecto
**Precondición:** Existe prototipo "CASA-2025-001 v1" activo

**Flujo Principal:**

1. Director accede a detalle de "CASA-2025-001 v1"
2. Director hace clic en "Crear Nueva Versión"
3. Sistema clona datos del prototipo v1
4. Director modifica:
   - Área construida: 45 m² → 50 m²
   - Costo total: $382,500 → $425,000
   - Cambios: "Se incrementó área de cocina en 5 m²"
5. Director hace clic en "Crear Versión"
6. Sistema:
   - Deprecia v1 (status = 'deprecated')
   - Crea v2 con status 'active'
   - Enlaza v2.previousVersionId = v1.id
   - Guarda changesFromPrevious
7. Sistema muestra notificación "Versión 2 creada. La versión 1 ha sido depreciada"
8. Sistema muestra historial de versiones

**Resultado:**
- Prototipo "CASA-2025-001 v2" activo
- Prototipo "CASA-2025-001 v1" depreciado pero conservado

---

### CU-PROTO-003: Asignar Prototipo a Lotes en Masa

**Actor:** Director de Proyecto
**Precondición:**
- Existe prototipo activo
- Existen lotes sin prototipo asignado

**Flujo Principal:**

1. Director accede a "Lotes" de una etapa
2. Director selecciona 20 lotes (checkboxes)
3. Director hace clic en "Asignar Prototipo"
4. Sistema muestra modal con catálogo de prototipos activos
5. Director selecciona "CASA-2025-001 v2"
6. Director confirma asignación
7. Sistema:
   - Asigna prototypeId y prototypeVersion a los 20 lotes
   - Incrementa usageCount del prototipo en 20
   - Emite evento 'lots.prototype_bulk_assigned'
8. Sistema muestra notificación "Prototipo asignado a 20 lotes"

**Resultado:** 20 lotes ahora tienen prototipo "CASA-2025-001 v2" asignado

---

## 6. Tests

```typescript
// apps/backend/src/modules/projects/services/housing-prototypes.service.spec.ts

describe('HousingPrototypesService', () => {
  let service: HousingPrototypesService;
  let repo: Repository<HousingPrototype>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HousingPrototypesService,
        {
          provide: getRepositoryToken(HousingPrototype),
          useClass: Repository,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<HousingPrototypesService>(HousingPrototypesService);
    repo = module.get<Repository<HousingPrototype>>(getRepositoryToken(HousingPrototype));
  });

  it('should create a prototype with auto-generated code', async () => {
    const constructoraId = 'uuid-constructora-1';

    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    } as any);

    jest.spyOn(repo, 'create').mockReturnValue({} as HousingPrototype);
    jest.spyOn(repo, 'save').mockResolvedValue({
      code: 'CASA-2025-001',
      version: 1,
    } as HousingPrototype);

    const result = await service.create(
      {
        name: 'Casa Tipo A',
        category: PrototypeCategory.CASA_UNIFAMILIAR,
        segment: PrototypeSegment.INTERES_SOCIAL,
        bedrooms: 2,
        bathrooms: 1,
        landAreaRequired: 120,
        builtAreaLevel1: 45,
        totalBuiltArea: 45,
        costPerSqm: 8500,
        totalConstructionCost: 382500,
        levels: 1,
      },
      constructoraId,
      'user-id',
    );

    expect(result.code).toBe('CASA-2025-001');
    expect(result.version).toBe(1);
  });

  it('should create new version and deprecate old one', async () => {
    const basePrototype = {
      id: 'proto-1',
      code: 'CASA-2025-001',
      name: 'Casa Tipo A',
      version: 1,
      status: PrototypeStatus.ACTIVE,
    } as HousingPrototype;

    jest.spyOn(repo, 'findOne').mockResolvedValue(basePrototype);
    jest.spyOn(repo, 'create').mockReturnValue({} as HousingPrototype);
    jest.spyOn(repo, 'save').mockResolvedValue({
      id: 'proto-2',
      code: 'CASA-2025-001',
      version: 2,
      previousVersionId: 'proto-1',
      status: PrototypeStatus.ACTIVE,
    } as HousingPrototype);

    const result = await service.createVersion(
      {
        basePrototypeId: 'proto-1',
        changesFromPrevious: 'Increased area',
        // ... other fields
      } as any,
      'constructora-id',
      'user-id',
    );

    expect(result.version).toBe(2);
    expect(result.previousVersionId).toBe('proto-1');
    expect(basePrototype.status).toBe(PrototypeStatus.DEPRECATED);
  });
});
```

---

## 7. Validaciones de Negocio

1. **Código Único:**
   - Código debe ser único por constructora
   - Sistema genera automáticamente si no se proporciona

2. **Versionado:**
   - Versión inicia en 1 para nuevos prototipos
   - Al crear nueva versión, versión anterior se deprecia automáticamente
   - No se pueden eliminar prototipos con usageCount > 0

3. **Áreas:**
   - `totalBuiltArea` debe ser igual a `builtAreaLevel1 + builtAreaLevel2`
   - Trigger automático calcula totalBuiltArea antes de guardar
   - Todas las áreas deben ser > 0

4. **Costos:**
   - `totalTurnkeyCost` = `totalConstructionCost + urbanizationCost`
   - Trigger automático calcula totalTurnkeyCost
   - Costo por m² debe ser coherente con costo total

5. **Status:**
   - Solo prototipos con status "active" pueden asignarse a lotes
   - Prototipos "deprecated" se conservan para trazabilidad histórica

---

## 8. Eventos Emitidos

```typescript
'prototype.created': { prototype: HousingPrototype }
'prototype.version_created': { newVersion: HousingPrototype, oldVersion: HousingPrototype }
'prototype.deprecated': { prototype: HousingPrototype }
'prototype.deleted': { id: string }
```

---

## 9. Permisos por Rol

| Acción | Director | Residente | Ingeniero | Supervisor |
|--------|----------|-----------|-----------|------------|
| Crear Prototipo | ✅ | ❌ | ❌ | ❌ |
| Ver Catálogo | ✅ | ✅ | ✅ | ✅ |
| Crear Nueva Versión | ✅ | ❌ | ❌ | ❌ |
| Depreciar Prototipo | ✅ | ❌ | ❌ | ❌ |
| Eliminar Prototipo | ✅ | ❌ | ❌ | ❌ |
| Asignar a Lotes | ✅ | ✅ | ❌ | ❌ |
| Ver Historial Versiones | ✅ | ✅ | ✅ | ✅ |

---

## 10. Optimizaciones

1. **Índices:**
   - Índice compuesto en `(constructora_id, code)` para búsquedas por código
   - Índice en `tags` usando GIN para búsquedas de texto completo
   - Índice en `status` para filtrar activos/depreciados

2. **Caché:**
   - Catálogo de prototipos activos puede cachearse por 15 minutos
   - Invalidar caché al crear/depreciar prototipos

3. **Imágenes:**
   - Thumbnails optimizados (300x200px, WebP)
   - Renders en resolución completa almacenados en S3/CDN
   - Lazy loading en galería

---

**Fecha de generación:** 2025-11-17
**Autor:** Sistema de Documentación Técnica
**Versión:** 1.0
**Estado:** ✅ Completo
