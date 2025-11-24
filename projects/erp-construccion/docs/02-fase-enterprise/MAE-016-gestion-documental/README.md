# MAE-016: Gestión Documental

**Módulo:** Sistema de Gestión Documental Corporativa  
**Story Points:** 35 | **Prioridad:** Media | **Fase:** 2 (Enterprise)

## Descripción General

Sistema centralizado para gestión, almacenamiento y control de documentos de proyectos de construcción. Incluye versionamiento, control de acceso, firma electrónica, y repositorio con clasificación por tipo y proyecto.

## Alcance Funcional

### 1. Repositorio Documental
- Almacenamiento en la nube (AWS S3)
- Clasificación por proyecto y tipo
- Metadata y etiquetado
- Búsqueda avanzada
- Versionamiento automático

### 2. Control de Versiones
- Historial completo de versiones
- Comparación entre versiones
- Restauración de versiones anteriores
- Trazabilidad de cambios

### 3. Firma Electrónica
- Firma simple y avanzada
- Validación de identidad
- Certificado digital
- Trazabilidad de firmas

### 4. Control de Acceso
- Permisos por rol y proyecto
- Documentos confidenciales
- Registro de accesos
- Compartir temporal

### 5. Workflow de Aprobación
- Flujo de revisión de documentos
- Aprobación multinivel
- Comentarios y observaciones
- Notificaciones automáticas

## Componentes Técnicos

### Backend (NestJS + TypeORM)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    Document, DocumentVersion, DocumentSignature,
    DocumentAccess, DocumentApproval
  ])],
  providers: [
    DocumentService, VersionService, SignatureService,
    StorageService, ApprovalWorkflowService
  ],
  controllers: [DocumentController, SignatureController]
})
export class DocumentModule {}
```

### Base de Datos (PostgreSQL)
```sql
CREATE SCHEMA documents;

CREATE TYPE documents.document_type AS ENUM ('contract', 'blueprint', 'permit', 'invoice', 'report', 'other');
CREATE TYPE documents.signature_type AS ENUM ('simple', 'advanced');
CREATE TYPE documents.approval_status AS ENUM ('pending', 'approved', 'rejected', 'revision');
```

### Storage (AWS S3)
- Bucket: documents-inmobiliaria
- Estructura: {constructoraId}/{projectId}/{type}/{year}/{month}
- Encriptación: AES-256
- Lifecycle: Archive después de 2 años

## Integraciones

- **MAI-001 (Proyectos):** Documentos por proyecto
- **MAI-012 (Contratos):** Firma de contratos
- **MAI-013 (Seguridad):** Control de acceso por rol

## Métricas Clave

- **Volumen:** GB almacenados por proyecto
- **Accesos:** Documentos más consultados
- **Tiempo de aprobación:** Días promedio
- **Firmas:** Documentos firmados vs pendientes

---
**Generado:** 2025-11-21
