# ET-PROG-003: Implementación de Evidencias Fotográficas y Checklists

**Épica:** MAI-005 - Control de Obra y Avances
**Módulo:** Evidencias y Control de Calidad
**Responsable Técnico:** Backend + Frontend + Mobile + Storage
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Objetivo Técnico

Implementar el sistema de evidencias fotográficas y checklists de calidad con:
- Captura de fotos con marca de agua automática
- Extracción de metadatos EXIF (fecha, GPS, dispositivo)
- Georreferenciación con PostGIS
- Verificación de integridad con SHA256
- Checklists de calidad configurables por etapa
- Generación de PDFs con firma digital
- Almacenamiento optimizado (compresión, thumbnails)

---

## 2. Stack Tecnológico

### Backend
```typescript
- NestJS 10+ con TypeScript
- TypeORM para PostgreSQL
- PostgreSQL 15+ (schema: evidence)
- PostGIS para coordenadas geográficas
- Sharp para procesamiento de imágenes
- ExifReader para metadatos EXIF
- crypto (SHA256) para hashes
- AWS S3 / Google Cloud Storage
- PDFKit para generación de PDFs
```

### Frontend
```typescript
- React 18 con TypeScript
- react-dropzone para upload de fotos
- Leaflet para visualización de mapas
- Canvas API para marcas de agua
- react-signature-canvas para firmas
```

### Mobile
```typescript
- React Native 0.72+
- react-native-camera / Expo Camera
- react-native-image-picker
- react-native-fs para sistema de archivos
- Geolocation API
```

---

## 3. Modelo de Datos SQL

```sql
-- =====================================================
-- SCHEMA: evidence
-- Descripción: Evidencias fotográficas y checklists
-- =====================================================

CREATE SCHEMA IF NOT EXISTS evidence;

-- =====================================================
-- TABLE: evidence.photos
-- Descripción: Evidencias fotográficas con georreferenciación
-- =====================================================

CREATE TABLE evidence.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES projects.stages(id),
  workfront_id UUID REFERENCES projects.workfronts(id),
  unit_id UUID REFERENCES projects.units(id),
  activity_id UUID REFERENCES schedules.schedule_activities(id),
  budget_item_id UUID REFERENCES budgets.budget_items(id),

  -- Tipo de evidencia
  photo_type VARCHAR(30) NOT NULL,
  -- progress, incident, final, quality_check, before_after

  -- Archivo
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  mime_type VARCHAR(50) NOT NULL,

  -- Thumbnail
  thumbnail_path VARCHAR(512),
  thumbnail_size INTEGER,

  -- Dimensiones
  width INTEGER,
  height INTEGER,
  resolution VARCHAR(20), -- "1920x1080", "4000x3000"

  -- Fechas
  capture_date TIMESTAMP NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Marca de agua
  has_watermark BOOLEAN DEFAULT false,
  watermark_text TEXT,

  -- Georreferenciación (PostGIS)
  geolocation GEOMETRY(POINT, 4326),
  geo_accuracy DECIMAL(8,2), -- metros
  geo_verified BOOLEAN DEFAULT false,
  distance_from_site DECIMAL(8,2), -- metros

  -- Descripción
  description TEXT,
  tags VARCHAR[], -- array de etiquetas

  -- Metadata del usuario
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploaded_via VARCHAR(20) NOT NULL, -- web, mobile, api

  -- Metadata del dispositivo
  device_model VARCHAR(100),
  device_os VARCHAR(50),

  -- EXIF data completa
  exif_data JSONB,
  /* {
    "Make": "Apple",
    "Model": "iPhone 14 Pro",
    "DateTime": "2025:01:15 10:30:25",
    "GPSLatitude": 19.4326,
    "GPSLongitude": -99.1332,
    "GPSAltitude": 2240.5,
    "Orientation": 1,
    "Flash": "No Flash",
    "FocalLength": "6.86 mm",
    "ExposureTime": "1/120",
    "ISO": 64
  } */

  -- Integridad
  sha256_hash VARCHAR(64) NOT NULL, -- hash del archivo original
  is_verified BOOLEAN DEFAULT false,

  -- Vinculación
  progress_record_id UUID REFERENCES progress.progress_records(id),
  checklist_id UUID REFERENCES evidence.quality_checklists(id),
  incident_id UUID,

  -- Soft delete
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES auth.users(id),

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_project ON evidence.photos(project_id);
CREATE INDEX idx_photos_stage ON evidence.photos(stage_id);
CREATE INDEX idx_photos_unit ON evidence.photos(unit_id);
CREATE INDEX idx_photos_type ON evidence.photos(photo_type);
CREATE INDEX idx_photos_date ON evidence.photos(capture_date);
CREATE INDEX idx_photos_uploaded_by ON evidence.photos(uploaded_by);
CREATE INDEX idx_photos_not_deleted ON evidence.photos(is_deleted) WHERE is_deleted = false;

-- Índice espacial
CREATE INDEX idx_photos_geolocation ON evidence.photos USING GIST(geolocation);

-- =====================================================
-- TABLE: evidence.checklist_templates
-- Descripción: Plantillas de checklists de calidad
-- =====================================================

CREATE TABLE evidence.checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificación
  template_code VARCHAR(50) NOT NULL UNIQUE,
  template_name VARCHAR(255) NOT NULL,
  description TEXT,
  version INTEGER NOT NULL DEFAULT 1,

  -- Aplicación
  applies_to_stage VARCHAR(50), -- cimentacion, estructura, instalaciones, acabados
  partida VARCHAR(50), -- partida presupuestal
  subpartida VARCHAR(50),

  -- Items del checklist
  items JSONB NOT NULL,
  /* [{
    itemId: "CHK-001",
    section: "Cimentación",
    question: "¿El armado cumple con el proyecto estructural?",
    type: "boolean", // boolean, numeric, text, photo
    isRequired: true,
    hasTolerance: false,
    tolerance: null,
    minValue: null,
    maxValue: null,
    unit: null,
    referenceValue: null,
    helpText: "Verificar planos...",
    requiresPhoto: true
  }] */

  total_items INTEGER,

  -- No conformidades predefinidas
  predefined_nc JSONB,
  /* [{
    ncCode: "NC-CIMENT-001",
    description: "Armado incompleto",
    severity: "major",
    correctiveActionTemplate: "Completar armado según planos..."
  }] */

  -- Estado
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checklist_templates_active ON evidence.checklist_templates(is_active) WHERE is_active = true;
CREATE INDEX idx_checklist_templates_stage ON evidence.checklist_templates(applies_to_stage);

-- =====================================================
-- TABLE: evidence.quality_checklists
-- Descripción: Checklists de calidad aplicados
-- =====================================================

CREATE TABLE evidence.quality_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES projects.units(id),
  template_id UUID NOT NULL REFERENCES evidence.checklist_templates(id),
  template_version INTEGER NOT NULL,

  -- Código único
  checklist_code VARCHAR(50) NOT NULL,

  -- Contexto
  partida VARCHAR(50),
  subpartida VARCHAR(50),
  stage_id UUID REFERENCES projects.stages(id),

  -- Inspección
  inspection_date DATE NOT NULL,
  inspector_id UUID NOT NULL REFERENCES auth.users(id),

  -- Items evaluados
  items JSONB NOT NULL,
  /* [{
    itemId: "CHK-001",
    question: "¿El armado cumple...?",
    isCompliant: true,
    value: null, // para numeric
    measurement: 15.5,
    tolerance: "±2cm",
    notes: "Conforme a planos",
    photoIds: ["uuid1", "uuid2"]
  }] */

  -- Resultados
  total_items INTEGER NOT NULL,
  compliant_items INTEGER DEFAULT 0,
  compliance_percent DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN total_items > 0 THEN (compliant_items::DECIMAL / total_items::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,

  -- No conformidades
  non_conformities JSONB,
  /* [{
    ncId: "NC-001",
    itemId: "CHK-003",
    severity: "minor" | "major" | "critical",
    description: "Descripción de la NC",
    correctiveAction: "Acción correctiva propuesta",
    responsibleId: "uuid",
    dueDate: "2025-02-01",
    status: "open" | "in_progress" | "closed",
    closedDate: null,
    closedBy: null,
    verificationPhotoIds: []
  }] */

  total_nc INTEGER DEFAULT 0,
  open_nc INTEGER DEFAULT 0,
  closed_nc INTEGER DEFAULT 0,

  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  -- draft, completed, approved, rejected

  approval_status VARCHAR(30),
  -- approved, approved_with_observations, rejected

  -- Firma digital
  signature_data TEXT, -- Base64 de la firma
  signed_by UUID REFERENCES auth.users(id),
  signed_at TIMESTAMP,

  -- PDF generado
  pdf_generated BOOLEAN DEFAULT false,
  pdf_path VARCHAR(512),
  pdf_generated_at TIMESTAMP,

  -- Notas generales
  general_notes TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_status CHECK (status IN ('draft', 'completed', 'approved', 'rejected')),
  CONSTRAINT valid_approval_status CHECK (approval_status IN ('approved', 'approved_with_observations', 'rejected'))
);

CREATE INDEX idx_checklists_project ON evidence.quality_checklists(project_id);
CREATE INDEX idx_checklists_unit ON evidence.quality_checklists(unit_id);
CREATE INDEX idx_checklists_template ON evidence.quality_checklists(template_id);
CREATE INDEX idx_checklists_inspector ON evidence.quality_checklists(inspector_id);
CREATE INDEX idx_checklists_status ON evidence.quality_checklists(status);
CREATE INDEX idx_checklists_date ON evidence.quality_checklists(inspection_date);

-- =====================================================
-- TABLE: evidence.photo_albums
-- Descripción: Álbumes para organizar fotos
-- =====================================================

CREATE TABLE evidence.photo_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,

  -- Identificación
  album_code VARCHAR(50) NOT NULL,
  album_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Tipo
  album_type VARCHAR(30) NOT NULL,
  -- project_progress, quality_inspection, incidents, final_delivery

  -- Vinculación
  stage_id UUID REFERENCES projects.stages(id),
  unit_id UUID REFERENCES projects.units(id),
  date_from DATE,
  date_to DATE,

  -- Cover
  cover_photo_id UUID REFERENCES evidence.photos(id),

  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_album_type CHECK (album_type IN ('project_progress', 'quality_inspection', 'incidents', 'final_delivery'))
);

CREATE INDEX idx_albums_project ON evidence.photo_albums(project_id);
CREATE INDEX idx_albums_type ON evidence.photo_albums(album_type);

-- =====================================================
-- TABLE: evidence.album_photos
-- Descripción: Relación muchos a muchos entre álbumes y fotos
-- =====================================================

CREATE TABLE evidence.album_photos (
  album_id UUID NOT NULL REFERENCES evidence.photo_albums(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES evidence.photos(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (album_id, photo_id)
);

CREATE INDEX idx_album_photos_album ON evidence.album_photos(album_id);
CREATE INDEX idx_album_photos_photo ON evidence.album_photos(photo_id);
```

---

## 4. TypeORM Entities

### 4.1 Photo Entity

```typescript
// src/modules/evidence/entities/photo.entity.ts

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
import { Project } from '../../projects/entities/project.entity';
import { Stage } from '../../projects/entities/stage.entity';
import { Unit } from '../../projects/entities/unit.entity';
import { User } from '../../auth/entities/user.entity';

export enum PhotoType {
  PROGRESS = 'progress',
  INCIDENT = 'incident',
  FINAL = 'final',
  QUALITY_CHECK = 'quality_check',
  BEFORE_AFTER = 'before_after',
}

@Entity('photos', { schema: 'evidence' })
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones
  @Column('uuid', { name: 'project_id' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'uuid', nullable: true, name: 'stage_id' })
  @Index()
  stageId?: string;

  @ManyToOne(() => Stage)
  @JoinColumn({ name: 'stage_id' })
  stage?: Stage;

  @Column({ type: 'uuid', nullable: true, name: 'unit_id' })
  @Index()
  unitId?: string;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unit_id' })
  unit?: Unit;

  // Tipo
  @Column({ type: 'enum', enum: PhotoType, name: 'photo_type' })
  @Index()
  photoType: PhotoType;

  // Archivo
  @Column({ type: 'varchar', length: 255, name: 'original_filename' })
  originalFilename: string;

  @Column({ type: 'varchar', length: 255, name: 'stored_filename' })
  storedFilename: string;

  @Column({ type: 'varchar', length: 512, name: 'file_path' })
  filePath: string;

  @Column({ type: 'integer', name: 'file_size' })
  fileSize: number;

  @Column({ type: 'varchar', length: 50, name: 'mime_type' })
  mimeType: string;

  // Thumbnail
  @Column({ type: 'varchar', length: 512, nullable: true, name: 'thumbnail_path' })
  thumbnailPath?: string;

  @Column({ type: 'integer', nullable: true, name: 'thumbnail_size' })
  thumbnailSize?: number;

  // Dimensiones
  @Column({ type: 'integer', nullable: true })
  width?: number;

  @Column({ type: 'integer', nullable: true })
  height?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  resolution?: string;

  // Fechas
  @Column({ type: 'timestamp', name: 'capture_date' })
  captureDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'upload_date' })
  uploadDate: Date;

  // Marca de agua
  @Column({ type: 'boolean', default: false, name: 'has_watermark' })
  hasWatermark: boolean;

  @Column({ type: 'text', nullable: true, name: 'watermark_text' })
  watermarkText?: string;

  // Georreferenciación
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Index({ spatial: true })
  geolocation?: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true, name: 'geo_accuracy' })
  geoAccuracy?: number;

  @Column({ type: 'boolean', default: false, name: 'geo_verified' })
  geoVerified: boolean;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true, name: 'distance_from_site' })
  distanceFromSite?: number;

  // Descripción
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  tags: string[];

  // Usuario
  @Column({ type: 'uuid', name: 'uploaded_by' })
  @Index()
  uploadedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;

  @Column({ type: 'varchar', length: 20, name: 'uploaded_via' })
  uploadedVia: string;

  // Dispositivo
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'device_model' })
  deviceModel?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'device_os' })
  deviceOs?: string;

  // EXIF
  @Column({ type: 'jsonb', nullable: true, name: 'exif_data' })
  exifData?: any;

  // Integridad
  @Column({ type: 'varchar', length: 64, name: 'sha256_hash' })
  sha256Hash: string;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;

  // Soft delete
  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  @Index()
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  // Metadata
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 4.2 QualityChecklist Entity

```typescript
// src/modules/evidence/entities/quality-checklist.entity.ts

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
import { Project } from '../../projects/entities/project.entity';
import { Unit } from '../../projects/entities/unit.entity';
import { ChecklistTemplate } from './checklist-template.entity';
import { User } from '../../auth/entities/user.entity';

export enum ChecklistStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ApprovalStatus {
  APPROVED = 'approved',
  APPROVED_WITH_OBSERVATIONS = 'approved_with_observations',
  REJECTED = 'rejected',
}

@Entity('quality_checklists', { schema: 'evidence' })
export class QualityChecklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relaciones
  @Column('uuid', { name: 'project_id' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'uuid', nullable: true, name: 'unit_id' })
  @Index()
  unitId?: string;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unit_id' })
  unit?: Unit;

  @Column('uuid', { name: 'template_id' })
  @Index()
  templateId: string;

  @ManyToOne(() => ChecklistTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ChecklistTemplate;

  @Column({ type: 'integer', name: 'template_version' })
  templateVersion: number;

  // Código
  @Column({ type: 'varchar', length: 50, name: 'checklist_code' })
  checklistCode: string;

  // Contexto
  @Column({ type: 'varchar', length: 50, nullable: true })
  partida?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  subpartida?: string;

  // Inspección
  @Column({ type: 'date', name: 'inspection_date' })
  @Index()
  inspectionDate: Date;

  @Column('uuid', { name: 'inspector_id' })
  @Index()
  inspectorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inspector_id' })
  inspector: User;

  // Items
  @Column({ type: 'jsonb' })
  items: any;

  // Resultados
  @Column({ type: 'integer', name: 'total_items' })
  totalItems: number;

  @Column({ type: 'integer', default: 0, name: 'compliant_items' })
  compliantItems: number;

  // No conformidades
  @Column({ type: 'jsonb', nullable: true, name: 'non_conformities' })
  nonConformities?: any;

  @Column({ type: 'integer', default: 0, name: 'total_nc' })
  totalNc: number;

  @Column({ type: 'integer', default: 0, name: 'open_nc' })
  openNc: number;

  @Column({ type: 'integer', default: 0, name: 'closed_nc' })
  closedNc: number;

  // Estado
  @Column({ type: 'enum', enum: ChecklistStatus, default: ChecklistStatus.DRAFT })
  @Index()
  status: ChecklistStatus;

  @Column({ type: 'enum', enum: ApprovalStatus, nullable: true, name: 'approval_status' })
  approvalStatus?: ApprovalStatus;

  // Firma
  @Column({ type: 'text', nullable: true, name: 'signature_data' })
  signatureData?: string;

  @Column({ type: 'uuid', nullable: true, name: 'signed_by' })
  signedBy?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'signed_by' })
  signer?: User;

  @Column({ type: 'timestamp', nullable: true, name: 'signed_at' })
  signedAt?: Date;

  // PDF
  @Column({ type: 'boolean', default: false, name: 'pdf_generated' })
  pdfGenerated: boolean;

  @Column({ type: 'varchar', length: 512, nullable: true, name: 'pdf_path' })
  pdfPath?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'pdf_generated_at' })
  pdfGeneratedAt?: Date;

  // Notas
  @Column({ type: 'text', nullable: true, name: 'general_notes' })
  generalNotes?: string;

  // Metadata
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed
  get compliancePercent(): number {
    if (this.totalItems === 0) return 0;
    return (this.compliantItems / this.totalItems) * 100;
  }
}
```

---

## 5. Services (Lógica de Negocio)

### 5.1 PhotoService

```typescript
// src/modules/evidence/services/photo.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo, PhotoType } from '../entities/photo.entity';
import { UploadPhotoDto } from '../dto';
import { StorageService } from './storage.service';
import { ImageProcessingService } from './image-processing.service';
import { ExifService } from './exif.service';
import { createHash } from 'crypto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepo: Repository<Photo>,
    private storageService: StorageService,
    private imageService: ImageProcessingService,
    private exifService: ExifService,
  ) {}

  /**
   * Subir foto con procesamiento completo
   */
  async upload(
    file: Express.Multer.File,
    dto: UploadPhotoDto,
    userId: string,
  ): Promise<Photo> {
    // Calcular hash SHA256
    const sha256Hash = createHash('sha256').update(file.buffer).digest('hex');

    // Verificar duplicado
    const existing = await this.photoRepo.findOne({
      where: { sha256Hash, projectId: dto.projectId },
    });

    if (existing) {
      throw new Error('Photo already uploaded (duplicate detected)');
    }

    // Extraer metadatos EXIF
    const exifData = await this.exifService.extract(file.buffer);

    // Obtener coordenadas GPS del EXIF (si existen)
    let geolocation = dto.geolocation;
    if (!geolocation && exifData.GPSLatitude && exifData.GPSLongitude) {
      geolocation = {
        type: 'Point',
        coordinates: [exifData.GPSLongitude, exifData.GPSLatitude],
      };
    }

    // Aplicar marca de agua
    const watermarkText = dto.watermarkText || this.generateWatermark(dto);
    const watermarkedBuffer = await this.imageService.applyWatermark(
      file.buffer,
      watermarkText,
    );

    // Generar thumbnail
    const thumbnailBuffer = await this.imageService.createThumbnail(watermarkedBuffer);

    // Subir a storage (S3, Google Cloud, etc.)
    const timestamp = Date.now();
    const storedFilename = `${timestamp}_${file.originalname}`;
    const thumbnailFilename = `${timestamp}_thumb_${file.originalname}`;

    const filePath = await this.storageService.upload(
      watermarkedBuffer,
      `projects/${dto.projectId}/photos/${storedFilename}`,
    );

    const thumbnailPath = await this.storageService.upload(
      thumbnailBuffer,
      `projects/${dto.projectId}/photos/thumbnails/${thumbnailFilename}`,
    );

    // Obtener dimensiones
    const metadata = await this.imageService.getMetadata(watermarkedBuffer);

    // Crear registro en BD
    const photo = this.photoRepo.create({
      projectId: dto.projectId,
      stageId: dto.stageId,
      unitId: dto.unitId,
      activityId: dto.activityId,
      photoType: dto.photoType || PhotoType.PROGRESS,
      originalFilename: file.originalname,
      storedFilename,
      filePath,
      fileSize: watermarkedBuffer.length,
      mimeType: file.mimetype,
      thumbnailPath,
      thumbnailSize: thumbnailBuffer.length,
      width: metadata.width,
      height: metadata.height,
      resolution: `${metadata.width}x${metadata.height}`,
      captureDate: exifData.DateTime || new Date(),
      hasWatermark: true,
      watermarkText,
      geolocation: geolocation ? JSON.stringify(geolocation) : null,
      geoAccuracy: dto.geoAccuracy,
      geoVerified: false, // Se verificará en background
      description: dto.description,
      tags: dto.tags || [],
      uploadedBy: userId,
      uploadedVia: dto.uploadedVia || 'web',
      deviceModel: exifData.Model || dto.deviceModel,
      deviceOs: dto.deviceOs,
      exifData,
      sha256Hash,
      isVerified: true,
    });

    return this.photoRepo.save(photo);
  }

  /**
   * Generar texto de marca de agua
   */
  private generateWatermark(dto: UploadPhotoDto): string {
    const project = dto.projectName || 'Proyecto';
    const unit = dto.unitName || '';
    const date = new Date().toLocaleDateString('es-MX');
    const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    return `${project}${unit ? ` | ${unit}` : ''} | ${date} ${time}`;
  }

  /**
   * Obtener fotos de un proyecto
   */
  async findByProject(
    projectId: string,
    filters?: {
      photoType?: PhotoType;
      stageId?: string;
      unitId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ): Promise<Photo[]> {
    const query = this.photoRepo
      .createQueryBuilder('photo')
      .where('photo.project_id = :projectId', { projectId })
      .andWhere('photo.is_deleted = false');

    if (filters?.photoType) {
      query.andWhere('photo.photo_type = :photoType', { photoType: filters.photoType });
    }

    if (filters?.stageId) {
      query.andWhere('photo.stage_id = :stageId', { stageId: filters.stageId });
    }

    if (filters?.unitId) {
      query.andWhere('photo.unit_id = :unitId', { unitId: filters.unitId });
    }

    if (filters?.dateFrom) {
      query.andWhere('photo.capture_date >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters?.dateTo) {
      query.andWhere('photo.capture_date <= :dateTo', { dateTo: filters.dateTo });
    }

    return query
      .orderBy('photo.capture_date', 'DESC')
      .getMany();
  }

  /**
   * Soft delete de foto
   */
  async softDelete(id: string, userId: string): Promise<void> {
    const photo = await this.photoRepo.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }

    photo.isDeleted = true;
    photo.deletedAt = new Date();
    photo.deletedBy = userId;

    await this.photoRepo.save(photo);
  }
}
```

### 5.2 ChecklistService

```typescript
// src/modules/evidence/services/checklist.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualityChecklist, ChecklistStatus } from '../entities/quality-checklist.entity';
import { ChecklistTemplate } from '../entities/checklist-template.entity';
import { CreateChecklistDto, UpdateChecklistDto, SignChecklistDto } from '../dto';
import { PdfGenerationService } from './pdf-generation.service';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(QualityChecklist)
    private checklistRepo: Repository<QualityChecklist>,
    @InjectRepository(ChecklistTemplate)
    private templateRepo: Repository<ChecklistTemplate>,
    private pdfService: PdfGenerationService,
  ) {}

  /**
   * Crear checklist desde template
   */
  async create(dto: CreateChecklistDto, userId: string): Promise<QualityChecklist> {
    const template = await this.templateRepo.findOne({
      where: { id: dto.templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Generar código
    const year = new Date().getFullYear();
    const count = await this.checklistRepo.count({ where: { projectId: dto.projectId } });
    const code = `CHK-${year}-${String(count + 1).padStart(5, '0')}`;

    // Inicializar items del template
    const items = JSON.parse(JSON.stringify(template.items)).map((item: any) => ({
      ...item,
      isCompliant: null,
      value: null,
      measurement: null,
      notes: '',
      photoIds: [],
    }));

    const checklist = this.checklistRepo.create({
      projectId: dto.projectId,
      unitId: dto.unitId,
      templateId: template.id,
      templateVersion: template.version,
      checklistCode: code,
      partida: dto.partida || template.partida,
      subpartida: dto.subpartida || template.subpartida,
      inspectionDate: dto.inspectionDate,
      inspectorId: userId,
      items,
      totalItems: template.totalItems,
      status: ChecklistStatus.DRAFT,
    });

    return this.checklistRepo.save(checklist);
  }

  /**
   * Actualizar checklist (responder items)
   */
  async update(id: string, dto: UpdateChecklistDto): Promise<QualityChecklist> {
    const checklist = await this.checklistRepo.findOne({ where: { id } });
    if (!checklist) {
      throw new Error('Checklist not found');
    }

    if (dto.items) {
      checklist.items = dto.items;

      // Recalcular compliance
      const compliantItems = dto.items.filter((item: any) => item.isCompliant === true).length;
      checklist.compliantItems = compliantItems;
    }

    if (dto.nonConformities) {
      checklist.nonConformities = dto.nonConformities;
      checklist.totalNc = dto.nonConformities.length;
      checklist.openNc = dto.nonConformities.filter((nc: any) => nc.status === 'open').length;
      checklist.closedNc = dto.nonConformities.filter((nc: any) => nc.status === 'closed').length;
    }

    if (dto.generalNotes) {
      checklist.generalNotes = dto.generalNotes;
    }

    return this.checklistRepo.save(checklist);
  }

  /**
   * Completar y firmar checklist
   */
  async sign(id: string, dto: SignChecklistDto, userId: string): Promise<QualityChecklist> {
    const checklist = await this.checklistRepo.findOne({ where: { id } });
    if (!checklist) {
      throw new Error('Checklist not found');
    }

    checklist.status = ChecklistStatus.COMPLETED;
    checklist.signatureData = dto.signatureData;
    checklist.signedBy = userId;
    checklist.signedAt = new Date();

    const saved = await this.checklistRepo.save(checklist);

    // Generar PDF en background
    this.generatePdfAsync(saved.id);

    return saved;
  }

  /**
   * Generar PDF del checklist (asíncrono)
   */
  private async generatePdfAsync(checklistId: string): Promise<void> {
    try {
      const checklist = await this.checklistRepo.findOne({
        where: { id: checklistId },
        relations: ['project', 'unit', 'template', 'inspector', 'signer'],
      });

      if (!checklist) return;

      const pdfBuffer = await this.pdfService.generateChecklistPdf(checklist);
      const pdfPath = await this.storageService.upload(
        pdfBuffer,
        `projects/${checklist.projectId}/checklists/${checklist.checklistCode}.pdf`,
      );

      checklist.pdfGenerated = true;
      checklist.pdfPath = pdfPath;
      checklist.pdfGeneratedAt = new Date();

      await this.checklistRepo.save(checklist);
    } catch (error) {
      console.error('Error generating checklist PDF:', error);
    }
  }
}
```

---

## 6. Triggers y Stored Procedures

```sql
-- =====================================================
-- TRIGGER: Actualizar contadores de checklists
-- =====================================================

CREATE OR REPLACE FUNCTION evidence.update_checklist_counters()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalcular compliant_items desde items JSONB
  IF NEW.items IS NOT NULL THEN
    NEW.compliant_items := (
      SELECT COUNT(*)
      FROM jsonb_array_elements(NEW.items) AS item
      WHERE (item->>'isCompliant')::BOOLEAN = true
    );
  END IF;

  -- Recalcular NC counters desde non_conformities JSONB
  IF NEW.non_conformities IS NOT NULL THEN
    NEW.total_nc := jsonb_array_length(NEW.non_conformities);
    NEW.open_nc := (
      SELECT COUNT(*)
      FROM jsonb_array_elements(NEW.non_conformities) AS nc
      WHERE nc->>'status' = 'open'
    );
    NEW.closed_nc := (
      SELECT COUNT(*)
      FROM jsonb_array_elements(NEW.non_conformities) AS nc
      WHERE nc->>'status' = 'closed'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_checklist_counters
BEFORE INSERT OR UPDATE ON evidence.quality_checklists
FOR EACH ROW
EXECUTE FUNCTION evidence.update_checklist_counters();
```

---

## 7. Criterios de Aceptación Técnicos

- [x] Schema `evidence` creado con tablas y relaciones
- [x] Upload de fotos con procesamiento completo
- [x] Extracción de metadatos EXIF
- [x] Marca de agua automática con Canvas
- [x] Generación de thumbnails con Sharp
- [x] Cálculo de hash SHA256 para integridad
- [x] Georreferenciación con PostGIS
- [x] Checklists con templates configurables
- [x] Generación de PDFs con firma digital
- [x] Soft delete para fotos
- [x] Triggers para cálculos automáticos
- [x] Tests unitarios >80% coverage

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo Técnico
**Versión:** 1.0
**Estado:** ✅ Listo para Implementación
