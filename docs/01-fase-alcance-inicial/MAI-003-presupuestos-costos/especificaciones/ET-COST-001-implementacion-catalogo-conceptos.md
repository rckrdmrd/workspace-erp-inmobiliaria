# ET-COST-001: Implementación del Catálogo de Conceptos y Precios Unitarios

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17
**Stack:** NestJS + TypeScript + PostgreSQL 15+ (Backend), React 18 + Vite (Frontend)

---

## 1. Arquitectura de Base de Datos

### 1.1 Schema Principal

```sql
-- Schema para presupuestos y costos
CREATE SCHEMA IF NOT EXISTS budgets;

-- Tabla: concept_catalog (Catálogo de conceptos)
CREATE TABLE budgets.concept_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenant discriminator (tenant = constructora)
  -- Each constructora has its own concept catalog (see GLOSARIO.md)
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  -- Identificación
  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Tipo y clasificación
  concept_type VARCHAR(20) NOT NULL CHECK (concept_type IN ('material', 'labor', 'equipment', 'composite')),
  category VARCHAR(100), -- División CMIC (ej: "02-CIMENTACIÓN")
  subcategory VARCHAR(100), -- Grupo CMIC
  unit VARCHAR(20) NOT NULL, -- m³, m², kg, pza, jornal, hora

  -- Precio (para conceptos simples)
  base_price DECIMAL(12,2),
  includes_vat BOOLEAN DEFAULT false,
  currency VARCHAR(3) DEFAULT 'MXN' CHECK (currency IN ('MXN', 'USD')),

  -- Factores
  waste_factor DECIMAL(5,3) DEFAULT 1.000, -- 1.03 = 3% desperdicio

  -- Integración (conceptos compuestos)
  components JSONB, -- [{conceptId, quantity, unit}, ...]
  /*
  Ejemplo de components:
  [
    {"conceptId": "uuid-1", "quantity": 1.05, "unit": "m³", "name": "Concreto f'c=200"},
    {"conceptId": "uuid-2", "quantity": 80, "unit": "kg", "name": "Acero fy=4200"}
  ]
  */

  labor_crew JSONB, -- Cuadrilla tipo
  /*
  Ejemplo:
  [
    {"category": "oficial", "quantity": 0.25, "dailyWage": 450, "fsr": 1.50},
    {"category": "ayudante", "quantity": 0.50, "dailyWage": 300, "fsr": 1.50}
  ]
  */

  -- Factores de costo (conceptos compuestos)
  indirect_percentage DECIMAL(5,2) DEFAULT 12.00,
  financing_percentage DECIMAL(5,2) DEFAULT 3.00,
  profit_percentage DECIMAL(5,2) DEFAULT 10.00,
  additional_charges DECIMAL(5,2) DEFAULT 2.00,

  -- Costos calculados (conceptos compuestos)
  direct_cost DECIMAL(12,2),
  unit_price DECIMAL(12,2), -- Sin IVA
  unit_price_with_vat DECIMAL(12,2),

  -- Regionalización
  region_id UUID REFERENCES budgets.regions(id),

  -- Proveedor
  preferred_supplier_id UUID,

  -- Técnico
  technical_specs TEXT,
  performance VARCHAR(255), -- "4 m³/día con cuadrilla de 1 of + 2 ay"

  -- Versión y estado
  version INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deprecated')),

  -- Auditoría
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_concept_code UNIQUE (constructora_id, code),
  CONSTRAINT valid_base_price CHECK (base_price IS NULL OR base_price >= 0)
);

-- Índices para búsqueda rápida
CREATE INDEX idx_concept_catalog_constructora ON budgets.concept_catalog(constructora_id);
CREATE INDEX idx_concept_catalog_type ON budgets.concept_catalog(concept_type);
CREATE INDEX idx_concept_catalog_category ON budgets.concept_catalog(category);
CREATE INDEX idx_concept_catalog_status ON budgets.concept_catalog(status);
CREATE INDEX idx_concept_catalog_code ON budgets.concept_catalog(code);

-- Índice full-text para búsqueda por nombre/descripción
CREATE INDEX idx_concept_catalog_search ON budgets.concept_catalog
  USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description, '')));


-- Tabla: concept_price_history (Historial de precios)
CREATE TABLE budgets.concept_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES budgets.concept_catalog(id) ON DELETE CASCADE,

  price DECIMAL(12,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE,
  variation_percentage DECIMAL(6,2),

  reason VARCHAR(255), -- "Ajuste INPC Nov 2025"
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_price_history_concept ON budgets.concept_price_history(concept_id);
CREATE INDEX idx_price_history_valid_from ON budgets.concept_price_history(valid_from DESC);


-- Tabla: regions (Regiones para precios regionalizados)
CREATE TABLE budgets.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenant discriminator (tenant = constructora)
  -- Each constructora defines its own regions (see GLOSARIO.md)
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,

  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL, -- "Región Centro"
  description TEXT,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_region_code UNIQUE (constructora_id, code)
);
```

### 1.2 Triggers Automáticos

```sql
-- Trigger: Actualizar updated_at
CREATE OR REPLACE FUNCTION budgets.update_concept_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_concept_updated_at
  BEFORE UPDATE ON budgets.concept_catalog
  FOR EACH ROW
  EXECUTE FUNCTION budgets.update_concept_timestamp();


-- Trigger: Crear historial al actualizar precio
CREATE OR REPLACE FUNCTION budgets.create_price_history()
RETURNS TRIGGER AS $$
DECLARE
  v_variation DECIMAL(6,2);
BEGIN
  -- Solo si cambió el precio base
  IF (NEW.base_price IS DISTINCT FROM OLD.base_price) THEN

    -- Calcular variación porcentual
    IF OLD.base_price IS NOT NULL AND OLD.base_price > 0 THEN
      v_variation := ((NEW.base_price - OLD.base_price) / OLD.base_price) * 100;
    ELSE
      v_variation := NULL;
    END IF;

    -- Cerrar registro anterior
    UPDATE budgets.concept_price_history
    SET valid_until = CURRENT_DATE - INTERVAL '1 day'
    WHERE concept_id = NEW.id
      AND valid_until IS NULL;

    -- Crear nuevo registro
    INSERT INTO budgets.concept_price_history (
      concept_id,
      price,
      valid_from,
      variation_percentage,
      created_by
    ) VALUES (
      NEW.id,
      NEW.base_price,
      CURRENT_DATE,
      v_variation,
      NEW.updated_by
    );

    -- Generar notificación si variación > 10%
    IF ABS(v_variation) > 10 THEN
      -- Aquí se puede insertar en tabla de notificaciones
      RAISE NOTICE 'Alerta: Precio de % varió %% (anterior: %, nuevo: %)',
        NEW.name, v_variation, OLD.base_price, NEW.base_price;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_price_history
  AFTER UPDATE ON budgets.concept_catalog
  FOR EACH ROW
  EXECUTE FUNCTION budgets.create_price_history();


-- Función: Calcular precio unitario de concepto compuesto
CREATE OR REPLACE FUNCTION budgets.calculate_composite_price(
  p_concept_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_concept RECORD;
  v_component RECORD;
  v_direct_cost DECIMAL := 0;
  v_labor_cost DECIMAL := 0;
  v_total_cost DECIMAL;
  v_unit_price DECIMAL;
BEGIN
  -- Obtener concepto
  SELECT * INTO v_concept
  FROM budgets.concept_catalog
  WHERE id = p_concept_id;

  -- Si no es compuesto, retornar precio base
  IF v_concept.concept_type != 'composite' THEN
    RETURN v_concept.base_price;
  END IF;

  -- Calcular costo de materiales/insumos
  IF v_concept.components IS NOT NULL THEN
    FOR v_component IN
      SELECT * FROM jsonb_array_elements(v_concept.components)
    LOOP
      SELECT v_direct_cost + (
        (v_component.value->>'quantity')::DECIMAL *
        COALESCE(c.base_price, c.unit_price, 0)
      ) INTO v_direct_cost
      FROM budgets.concept_catalog c
      WHERE c.id = (v_component.value->>'conceptId')::UUID;
    END LOOP;
  END IF;

  -- Calcular costo de mano de obra
  IF v_concept.labor_crew IS NOT NULL THEN
    SELECT SUM(
      (value->>'quantity')::DECIMAL *
      (value->>'dailyWage')::DECIMAL *
      (value->>'fsr')::DECIMAL
    ) INTO v_labor_cost
    FROM jsonb_array_elements(v_concept.labor_crew);
  END IF;

  v_direct_cost := v_direct_cost + v_labor_cost;

  -- Aplicar factores
  v_total_cost := v_direct_cost * (1 + v_concept.indirect_percentage / 100);
  v_total_cost := v_total_cost * (1 + v_concept.financing_percentage / 100);
  v_total_cost := v_total_cost * (1 + v_concept.profit_percentage / 100);
  v_total_cost := v_total_cost * (1 + v_concept.additional_charges / 100);

  v_unit_price := v_total_cost;

  -- Actualizar en la tabla
  UPDATE budgets.concept_catalog
  SET
    direct_cost = v_direct_cost,
    unit_price = v_unit_price,
    unit_price_with_vat = v_unit_price * 1.16
  WHERE id = p_concept_id;

  RETURN v_unit_price;
END;
$$ LANGUAGE plpgsql;
```

---

## 2. Backend (NestJS + TypeScript)

### 2.1 Entity (TypeORM)

```typescript
// src/budgets/entities/concept-catalog.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Constructora } from '../../constructoras/entities/constructora.entity';
import { Region } from './region.entity';

export enum ConceptType {
  MATERIAL = 'material',
  LABOR = 'labor',
  EQUIPMENT = 'equipment',
  COMPOSITE = 'composite',
}

export enum ConceptStatus {
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
}

@Entity('concept_catalog', { schema: 'budgets' })
@Index(['constructoraId', 'code'], { unique: true })
export class ConceptCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'constructora_id', type: 'uuid' })
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  // Identificación
  @Column({ type: 'varchar', length: 20 })
  @Index()
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Tipo y clasificación
  @Column({ name: 'concept_type', type: 'enum', enum: ConceptType })
  @Index()
  conceptType: ConceptType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcategory: string;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  // Precio (conceptos simples)
  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  basePrice: number;

  @Column({ name: 'includes_vat', type: 'boolean', default: false })
  includesVAT: boolean;

  @Column({ type: 'varchar', length: 3, default: 'MXN' })
  currency: string;

  // Factores
  @Column({ name: 'waste_factor', type: 'decimal', precision: 5, scale: 3, default: 1.000 })
  wasteFactor: number;

  // Integración (conceptos compuestos)
  @Column({ type: 'jsonb', nullable: true })
  components: ComponentItem[];

  @Column({ name: 'labor_crew', type: 'jsonb', nullable: true })
  laborCrew: LaborCrewItem[];

  // Factores de costo
  @Column({ name: 'indirect_percentage', type: 'decimal', precision: 5, scale: 2, default: 12.00 })
  indirectPercentage: number;

  @Column({ name: 'financing_percentage', type: 'decimal', precision: 5, scale: 2, default: 3.00 })
  financingPercentage: number;

  @Column({ name: 'profit_percentage', type: 'decimal', precision: 5, scale: 2, default: 10.00 })
  profitPercentage: number;

  @Column({ name: 'additional_charges', type: 'decimal', precision: 5, scale: 2, default: 2.00 })
  additionalCharges: number;

  // Costos calculados
  @Column({ name: 'direct_cost', type: 'decimal', precision: 12, scale: 2, nullable: true })
  directCost: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ name: 'unit_price_with_vat', type: 'decimal', precision: 12, scale: 2, nullable: true })
  unitPriceWithVAT: number;

  // Regionalización
  @Column({ name: 'region_id', type: 'uuid', nullable: true })
  regionId: string;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  // Proveedor
  @Column({ name: 'preferred_supplier_id', type: 'uuid', nullable: true })
  preferredSupplierId: string;

  // Técnico
  @Column({ name: 'technical_specs', type: 'text', nullable: true })
  technicalSpecs: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  performance: string;

  // Versión y estado
  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ type: 'enum', enum: ConceptStatus, default: ConceptStatus.ACTIVE })
  @Index()
  status: ConceptStatus;

  // Auditoría
  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export interface ComponentItem {
  conceptId: string;
  quantity: number;
  unit: string;
  name?: string;
}

export interface LaborCrewItem {
  category: string;
  quantity: number;
  dailyWage: number;
  fsr: number; // Factor de Salario Real
}
```

### 2.2 DTOs

```typescript
// src/budgets/dto/create-concept.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ConceptType } from '../entities/concept-catalog.entity';

export class CreateConceptDto {
  @IsString()
  @IsOptional()
  code?: string; // Auto-generado si no se provee

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ConceptType)
  conceptType: ConceptType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsString()
  unit: string;

  // Para conceptos simples
  @IsNumber()
  @IsOptional()
  @Min(0)
  basePrice?: number;

  @IsBoolean()
  @IsOptional()
  includesVAT?: boolean;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(2)
  wasteFactor?: number;

  // Para conceptos compuestos
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ComponentItemDto)
  components?: ComponentItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LaborCrewItemDto)
  laborCrew?: LaborCrewItemDto[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(50)
  indirectPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(20)
  financingPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(50)
  profitPercentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  additionalCharges?: number;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsString()
  @IsOptional()
  preferredSupplierId?: string;

  @IsString()
  @IsOptional()
  technicalSpecs?: string;

  @IsString()
  @IsOptional()
  performance?: string;
}

export class ComponentItemDto {
  @IsString()
  conceptId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class LaborCrewItemDto {
  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  dailyWage: number;

  @IsNumber()
  @Min(1)
  @Max(2)
  fsr: number;
}

// src/budgets/dto/bulk-update-prices.dto.ts
export class BulkUpdatePricesDto {
  @IsArray()
  conceptIds: string[];

  @IsEnum(['percentage', 'fixed'])
  adjustmentType: 'percentage' | 'fixed';

  @IsNumber()
  adjustmentValue: number; // +4.5 para +4.5%, o nuevo precio fijo

  @IsString()
  reason: string; // "Ajuste INPC Nov 2025"

  @IsString()
  @IsOptional()
  validFrom?: string; // Fecha ISO
}
```

### 2.3 Service

```typescript
// src/budgets/services/concept-catalog.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, In } from 'typeorm';
import { ConceptCatalog, ConceptType, ConceptStatus } from '../entities/concept-catalog.entity';
import { CreateConceptDto } from '../dto/create-concept.dto';
import { UpdateConceptDto } from '../dto/update-concept.dto';
import { BulkUpdatePricesDto } from '../dto/bulk-update-prices.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ConceptCatalogService {
  constructor(
    @InjectRepository(ConceptCatalog)
    private conceptRepo: Repository<ConceptCatalog>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateConceptDto, constructoraId: string, userId: string): Promise<ConceptCatalog> {
    // Auto-generar código si no se provee
    if (!dto.code) {
      dto.code = await this.generateCode(dto.conceptType, constructoraId);
    }

    // Validar código único
    const exists = await this.conceptRepo.findOne({
      where: { constructoraId, code: dto.code },
    });
    if (exists) {
      throw new BadRequestException(`El código ${dto.code} ya existe`);
    }

    // Crear concepto
    const concept = this.conceptRepo.create({
      ...dto,
      constructoraId,
      createdBy: userId,
    });

    await this.conceptRepo.save(concept);

    // Si es compuesto, calcular precio
    if (concept.conceptType === ConceptType.COMPOSITE) {
      await this.calculateCompositePrice(concept.id);
    }

    return concept;
  }

  async findAll(
    constructoraId: string,
    filters?: {
      type?: ConceptType;
      category?: string;
      status?: ConceptStatus;
      search?: string;
    },
  ): Promise<ConceptCatalog[]> {
    const where: any = { constructoraId };

    if (filters?.type) {
      where.conceptType = filters.type;
    }
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    let query = this.conceptRepo.createQueryBuilder('concept')
      .where(where);

    // Búsqueda full-text
    if (filters?.search) {
      query = query.andWhere(
        `to_tsvector('spanish', concept.name || ' ' || COALESCE(concept.description, '')) @@ plainto_tsquery('spanish', :search)`,
        { search: filters.search },
      );
    }

    return await query
      .orderBy('concept.category', 'ASC')
      .addOrderBy('concept.code', 'ASC')
      .getMany();
  }

  async findOne(id: string, constructoraId: string): Promise<ConceptCatalog> {
    const concept = await this.conceptRepo.findOne({
      where: { id, constructoraId },
    });

    if (!concept) {
      throw new NotFoundException('Concepto no encontrado');
    }

    return concept;
  }

  async update(id: string, dto: UpdateConceptDto, constructoraId: string, userId: string): Promise<ConceptCatalog> {
    const concept = await this.findOne(id, constructoraId);

    Object.assign(concept, dto);
    concept.updatedBy = userId;

    await this.conceptRepo.save(concept);

    // Recalcular precio si es compuesto y cambió algún componente
    if (concept.conceptType === ConceptType.COMPOSITE) {
      await this.calculateCompositePrice(concept.id);
    }

    return concept;
  }

  async bulkUpdatePrices(dto: BulkUpdatePricesDto, constructoraId: string, userId: string): Promise<void> {
    const concepts = await this.conceptRepo.find({
      where: {
        id: In(dto.conceptIds),
        constructoraId,
      },
    });

    for (const concept of concepts) {
      if (dto.adjustmentType === 'percentage') {
        concept.basePrice = concept.basePrice * (1 + dto.adjustmentValue / 100);
      } else {
        concept.basePrice = dto.adjustmentValue;
      }
      concept.updatedBy = userId;
    }

    await this.conceptRepo.save(concepts);

    // Emitir evento para actualización de presupuestos
    this.eventEmitter.emit('concepts.prices_updated', {
      conceptIds: dto.conceptIds,
      reason: dto.reason,
      adjustmentValue: dto.adjustmentValue,
    });
  }

  async calculateCompositePrice(conceptId: string): Promise<number> {
    // Llamar función SQL que calcula el precio
    const result = await this.conceptRepo.query(
      'SELECT budgets.calculate_composite_price($1) as unit_price',
      [conceptId],
    );

    return result[0].unit_price;
  }

  private async generateCode(type: ConceptType, constructoraId: string): Promise<string> {
    const prefix = {
      [ConceptType.MATERIAL]: 'MAT',
      [ConceptType.LABOR]: 'MO',
      [ConceptType.EQUIPMENT]: 'MAQ',
      [ConceptType.COMPOSITE]: 'CC',
    }[type];

    // Obtener último código del año actual
    const year = new Date().getFullYear();
    const lastConcept = await this.conceptRepo
      .createQueryBuilder('c')
      .where('c.constructora_id = :constructoraId', { constructoraId })
      .andWhere(`c.code LIKE :pattern`, { pattern: `${prefix}-${year}-%` })
      .orderBy(`c.code`, 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastConcept) {
      const parts = lastConcept.code.split('-');
      nextNumber = parseInt(parts[2]) + 1;
    }

    return `${prefix}-${year}-${nextNumber.toString().padStart(3, '0')}`;
  }
}
```

### 2.4 Controller

```typescript
// src/budgets/controllers/concept-catalog.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ConceptCatalogService } from '../services/concept-catalog.service';
import { CreateConceptDto } from '../dto/create-concept.dto';
import { UpdateConceptDto } from '../dto/update-concept.dto';
import { BulkUpdatePricesDto } from '../dto/bulk-update-prices.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ConceptType, ConceptStatus } from '../entities/concept-catalog.entity';

@Controller('api/concept-catalog')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConceptCatalogController {
  constructor(private conceptCatalogService: ConceptCatalogService) {}

  @Post()
  @Roles('admin', 'director', 'engineer')
  async create(@Body() dto: CreateConceptDto, @CurrentUser() user: any) {
    return await this.conceptCatalogService.create(dto, user.constructoraId, user.sub);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('type') type?: ConceptType,
    @Query('category') category?: string,
    @Query('status') status?: ConceptStatus,
    @Query('search') search?: string,
  ) {
    return await this.conceptCatalogService.findAll(user.constructoraId, {
      type,
      category,
      status,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.conceptCatalogService.findOne(id, user.constructoraId);
  }

  @Put(':id')
  @Roles('admin', 'director', 'engineer')
  async update(@Param('id') id: string, @Body() dto: UpdateConceptDto, @CurrentUser() user: any) {
    return await this.conceptCatalogService.update(id, dto, user.constructoraId, user.sub);
  }

  @Post('bulk-update-prices')
  @Roles('admin', 'director')
  async bulkUpdatePrices(@Body() dto: BulkUpdatePricesDto, @CurrentUser() user: any) {
    await this.conceptCatalogService.bulkUpdatePrices(dto, user.constructoraId, user.sub);
    return { message: `Precios actualizados para ${dto.conceptIds.length} conceptos` };
  }

  @Post(':id/calculate-price')
  @Roles('admin', 'director', 'engineer')
  async calculatePrice(@Param('id') id: string, @CurrentUser() user: any) {
    const price = await this.conceptCatalogService.calculateCompositePrice(id);
    return { unitPrice: price };
  }
}
```

---

## 3. Frontend (React + TypeScript)

### 3.1 Store (Zustand)

```typescript
// src/stores/conceptCatalogStore.ts
import { create } from 'zustand';
import { conceptCatalogApi } from '../api/conceptCatalogApi';

interface ConceptCatalog {
  id: string;
  code: string;
  name: string;
  conceptType: 'material' | 'labor' | 'equipment' | 'composite';
  category: string;
  unit: string;
  basePrice?: number;
  unitPrice?: number;
  status: 'active' | 'deprecated';
}

interface ConceptCatalogState {
  concepts: ConceptCatalog[];
  loading: boolean;
  error: string | null;

  fetchConcepts: (filters?: any) => Promise<void>;
  createConcept: (data: any) => Promise<void>;
  updateConcept: (id: string, data: any) => Promise<void>;
  bulkUpdatePrices: (data: any) => Promise<void>;
}

export const useConceptCatalogStore = create<ConceptCatalogState>((set) => ({
  concepts: [],
  loading: false,
  error: null,

  fetchConcepts: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await conceptCatalogApi.getAll(filters);
      set({ concepts: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createConcept: async (data) => {
    set({ loading: true, error: null });
    try {
      await conceptCatalogApi.create(data);
      // Refrescar lista
      const concepts = await conceptCatalogApi.getAll();
      set({ concepts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateConcept: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await conceptCatalogApi.update(id, data);
      const concepts = await conceptCatalogApi.getAll();
      set({ concepts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  bulkUpdatePrices: async (data) => {
    set({ loading: true, error: null });
    try {
      await conceptCatalogApi.bulkUpdatePrices(data);
      const concepts = await conceptCatalogApi.getAll();
      set({ concepts, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

### 3.2 Componente Principal

```typescript
// src/pages/ConceptCatalog/ConceptCatalogList.tsx
import React, { useEffect, useState } from 'react';
import { useConceptCatalogStore } from '../../stores/conceptCatalogStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { CreateConceptModal } from './CreateConceptModal';
import { BulkUpdatePricesModal } from './BulkUpdatePricesModal';

export function ConceptCatalogList() {
  const { concepts, loading, fetchConcepts } = useConceptCatalogStore();
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: 'active',
    search: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  useEffect(() => {
    fetchConcepts(filters);
  }, [filters]);

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    {
      key: 'conceptType',
      label: 'Tipo',
      render: (row: any) => {
        const labels = {
          material: 'Material',
          labor: 'Mano de Obra',
          equipment: 'Maquinaria',
          composite: 'Compuesto',
        };
        return labels[row.conceptType] || row.conceptType;
      },
    },
    { key: 'category', label: 'Categoría' },
    { key: 'unit', label: 'Unidad' },
    {
      key: 'unitPrice',
      label: 'Precio Unitario',
      render: (row: any) => {
        const price = row.unitPrice || row.basePrice || 0;
        return `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row: any) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
          {row.status === 'active' ? 'Activo' : 'Deprecado'}
        </span>
      ),
    },
  ];

  return (
    <div className="concept-catalog-page">
      <div className="page-header">
        <h1>Catálogo de Conceptos</h1>
        <div className="actions">
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            + Nuevo Concepto
          </Button>
          {selectedConcepts.length > 0 && (
            <Button variant="secondary" onClick={() => setShowBulkUpdateModal(true)}>
              Actualizar Precios ({selectedConcepts.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="filters">
        <Input
          placeholder="Buscar por código o nombre..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          <option value="material">Material</option>
          <option value="labor">Mano de Obra</option>
          <option value="equipment">Maquinaria</option>
          <option value="composite">Compuesto</option>
        </Select>
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="deprecated">Deprecados</option>
        </Select>
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        data={concepts}
        loading={loading}
        selectable
        onSelectionChange={setSelectedConcepts}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateConceptModal onClose={() => setShowCreateModal(false)} />
      )}
      {showBulkUpdateModal && (
        <BulkUpdatePricesModal
          conceptIds={selectedConcepts}
          onClose={() => {
            setShowBulkUpdateModal(false);
            setSelectedConcepts([]);
          }}
        />
      )}
    </div>
  );
}
```

---

## 4. Testing

### 4.1 Unit Tests (Service)

```typescript
// src/budgets/services/concept-catalog.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConceptCatalogService } from './concept-catalog.service';
import { ConceptCatalog } from '../entities/concept-catalog.entity';

describe('ConceptCatalogService', () => {
  let service: ConceptCatalogService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConceptCatalogService,
        {
          provide: getRepositoryToken(ConceptCatalog),
          useValue: mockRepo,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ConceptCatalogService>(ConceptCatalogService);
  });

  describe('create', () => {
    it('debe crear un concepto simple exitosamente', async () => {
      const dto = {
        name: 'Cemento CPC 30R',
        conceptType: 'material',
        unit: 'ton',
        basePrice: 4300,
      };

      mockRepo.create.mockReturnValue({ ...dto, id: 'uuid-1' });
      mockRepo.save.mockResolvedValue({ ...dto, id: 'uuid-1' });

      const result = await service.create(dto, 'constructora-1', 'user-1');

      expect(mockRepo.create).toHaveBeenCalled();
      expect(result.name).toBe(dto.name);
    });
  });

  describe('bulkUpdatePrices', () => {
    it('debe actualizar precios masivamente', async () => {
      const dto = {
        conceptIds: ['uuid-1', 'uuid-2'],
        adjustmentType: 'percentage',
        adjustmentValue: 4.5,
        reason: 'Ajuste INPC',
      };

      const concepts = [
        { id: 'uuid-1', basePrice: 100 },
        { id: 'uuid-2', basePrice: 200 },
      ];

      mockRepo.find.mockResolvedValue(concepts);
      mockRepo.save.mockResolvedValue(concepts);

      await service.bulkUpdatePrices(dto, 'constructora-1', 'user-1');

      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
```

---

## 5. Performance

### 5.1 Optimizaciones
- **Índices**: Full-text search en nombre/descripción
- **Caching**: Cache de conceptos más usados (Redis)
- **Paginación**: Lazy loading en frontend para catálogos grandes
- **Query optimization**: Select solo campos necesarios

---

**Estado:** ✅ Ready for Implementation
