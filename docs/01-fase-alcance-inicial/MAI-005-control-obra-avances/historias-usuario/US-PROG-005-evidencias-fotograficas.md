# US-PROG-005: Gestión de Evidencias Fotográficas

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 17
**Story Points:** 8
**Prioridad:** Alta
**Asignado a:** Backend + Mobile + Storage

---

## Historia de Usuario

**Como** Residente de Obra
**Quiero** capturar fotos con marca de agua automática y georreferenciación
**Para** documentar el avance del proyecto con evidencia verificable e inmutable

---

## Criterios de Aceptación

### 1. Captura de Fotos con App Móvil ✅
- [ ] Puedo abrir la cámara desde la app
- [ ] Puedo tomar hasta 10 fotos por registro de avance
- [ ] Al capturar cada foto, se extraen automáticamente:
  - Metadatos EXIF: fecha, hora, modelo de dispositivo
  - Coordenadas GPS: latitud, longitud, altitud
  - Precisión del GPS en metros
  - Orientación de la cámara
- [ ] Puedo ver preview de la foto antes de confirmar
- [ ] Puedo retomar si no me gusta
- [ ] Puedo seleccionar fotos existentes de la galería del teléfono

### 2. Marca de Agua Automática ✅
- [ ] Al confirmar la foto, el sistema aplica marca de agua automáticamente con:
  ```
  Fracc. Los Pinos | Lote 23 | 15/Ene/2025 14:32
  ```
- [ ] La marca de agua incluye:
  - Nombre del proyecto
  - Unidad/lote (si aplica)
  - Fecha y hora exacta (timestamp)
  - Opcionalmente: coordenadas GPS
- [ ] La marca aparece en la esquina inferior izquierda
- [ ] El texto es semitransparente pero legible
- [ ] No se puede quitar la marca de agua
- [ ] Se guarda tanto la foto original como la versión con marca

### 3. Procesamiento de Imagen ✅
- [ ] El sistema genera automáticamente:
  - **Original con marca:** Resolución completa (ej: 4000x3000 px)
  - **Thumbnail:** 300x225 px para previsualización rápida
- [ ] Se comprime la imagen para optimizar almacenamiento:
  - Calidad JPEG: 85%
  - Tamaño máximo: 5 MB por foto
- [ ] Se calcula hash SHA256 de la foto original para verificar integridad
- [ ] No se aceptan duplicados (mismo hash)

### 4. Georreferenciación con PostGIS ✅
- [ ] Las coordenadas GPS se guardan en formato PostGIS POINT
- [ ] Puedo ver las fotos en un mapa del proyecto
- [ ] El mapa muestra:
  - Pin en cada ubicación donde se tomó una foto
  - Cluster de pins si hay muchas fotos en el mismo lugar
  - Color del pin según tipo de foto (avance, incidente, final)
- [ ] Puedo hacer clic en un pin para ver la foto
- [ ] El sistema valida que la foto esté dentro del radio del proyecto:
  - Dentro de 500m → ✓ Verde (validado)
  - Entre 500m-1km → ⚠️ Amarillo (advertencia)
  - Más de 1km → ✗ Rojo (requiere justificación)

### 5. Verificación de Integridad ✅
- [ ] Cada foto tiene un hash SHA256 único
- [ ] El sistema puede verificar que la foto no ha sido modificada
- [ ] Si detecto un hash diferente, se marca como "adulterada"
- [ ] Puedo ver en la interfaz si una foto está verificada:
  - ✓ Verificada: Hash coincide
  - ✗ Adulterada: Hash NO coincide

### 6. Galería y Organización ✅
- [ ] Puedo ver todas las fotos del proyecto en una galería
- [ ] Puedo filtrar por:
  - Tipo: Avance, Incidente, Final, Checklist de Calidad
  - Fecha (rango)
  - Unidad/lote
  - Etapa (cimentación, estructura, instalaciones, acabados)
  - Usuario que subió
- [ ] Puedo buscar por tags o descripción
- [ ] Puedo ordenar por fecha (más reciente primero)
- [ ] Veo thumbnails para carga rápida
- [ ] Puedo hacer clic para ver en tamaño completo con zoom

### 7. Detalles de la Foto ✅
- [ ] Al abrir una foto, puedo ver:
  - Imagen en alta resolución
  - Metadatos completos:
    - Fecha y hora de captura
    - Dispositivo: iPhone 14 Pro
    - Coordenadas: 19.4326, -99.1332
    - Altitud: 2,240 msnm
    - Precisión GPS: 5 metros
    - Distancia del sitio: 125 metros
    - Hash SHA256
  - Descripción y tags
  - Vinculación: Registro de avance AVN-2025-00123
  - Usuario: Juan Pérez
- [ ] Puedo editar:
  - Descripción
  - Tags
- [ ] NO puedo editar la imagen ni los metadatos automáticos

### 8. Álbumes ✅
- [ ] Puedo crear álbumes para organizar fotos:
  - "Avance Semanal 01-15 Enero"
  - "Inspección Final Lotes 1-10"
  - "Incidentes Q1 2025"
- [ ] Puedo agregar/quitar fotos de álbumes
- [ ] Puedo compartir álbum completo como PDF
- [ ] Puedo establecer una foto como portada del álbum

### 9. Exportación ✅
- [ ] Puedo exportar fotos seleccionadas como ZIP
- [ ] Puedo generar PDF con galería de fotos
- [ ] El PDF incluye:
  - Thumbnails de todas las fotos
  - Descripción debajo de cada foto
  - Fecha y ubicación
  - Marca de agua visible
  - Encabezado con nombre del proyecto

---

## Mockup / Wireframe

```
App Móvil - Captura de Foto:
┌─────────────────────────────┐
│ ◀ Tomar Foto            ☰   │
├─────────────────────────────┤
│                             │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │                       │   │
│ │      [VIEWFINDER]     │   │
│ │      Camera View      │   │
│ │                       │   │
│ │                       │   │
│ │  📍 GPS: 19.4326,...  │   │
│ │  ✓ Dentro del sitio   │   │
│ └───────────────────────┘   │
│                             │
│        [⚪ CAPTURAR]         │
│                             │
│ [Galería] Fotos: 3/10       │
└─────────────────────────────┘

Preview con Marca de Agua:
┌─────────────────────────────┐
│ ◀ Confirmar Foto            │
├─────────────────────────────┤
│                             │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │     [FOTO TOMADA]     │   │
│ │                       │   │
│ │                       │   │
│ │  Fracc. Los Pinos |   │   │
│ │  Lote 23 |          │   │
│ │  15/Ene/25 14:32    │   │
│ └───────────────────────┘   │
│                             │
│ Descripción (opcional):     │
│ ┌───────────────────────┐   │
│ │Avance de cimentación  │   │
│ └───────────────────────┘   │
│                             │
│ Tags: #cimentación #lote23  │
│                             │
│ [Retomar]  [✓ Confirmar]    │
└─────────────────────────────┘

Galería Web:
┌──────────────────────────────────────────────────────────────┐
│ 📷 Galería de Evidencias - Fracc. Los Pinos                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Filtros: [Tipo ▼] [Fecha ▼] [Unidad ▼] [Buscar...]          │
│                                                               │
│ Total: 245 fotos   [Ver Mapa] [Crear Álbum] [Exportar]      │
│                                                               │
│ ┌──────┬──────┬──────┬──────┬──────┐                         │
│ │ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │                         │
│ │15/Ene│15/Ene│14/Ene│14/Ene│13/Ene│                         │
│ │14:32 │16:20 │11:45 │09:15 │17:30 │                         │
│ │✓ GPS │✓ GPS │✓ GPS │✓ GPS │✓ GPS │                         │
│ ├──────┼──────┼──────┼──────┼──────┤                         │
│ │ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │                         │
│ │...   │...   │...   │...   │...   │                         │
│ └──────┴──────┴──────┴──────┴──────┘                         │
│                                                               │
│ [Cargar más...]                                               │
└──────────────────────────────────────────────────────────────┘

Detalle de Foto:
┌──────────────────────────────────────────────────────────────┐
│ ◀ Volver                  Foto IMG_2025_0123.jpg             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─────────────────────────┐ ┌─ Metadatos ─────────────────┐  │
│ │                         │ │                              │  │
│ │                         │ │ Capturada: 15/Ene/2025 14:32 │  │
│ │     [FOTO COMPLETA]     │ │ Dispositivo: iPhone 14 Pro   │  │
│ │     Click para zoom     │ │ Resolución: 4000x3000 px     │  │
│ │                         │ │                              │  │
│ │                         │ │ 📍 Geolocalización:          │  │
│ │  Fracc. Los Pinos |     │ │ Lat: 19.4326                 │  │
│ │  Lote 23 |              │ │ Lon: -99.1332                │  │
│ │  15/Ene/25 14:32        │ │ Precisión: 5m                │  │
│ │                         │ │ Distancia: 125m ✓            │  │
│ └─────────────────────────┘ │                              │  │
│                             │ SHA256:                      │  │
│ Descripción:                │ a3f5e8... ✓ Verificada       │  │
│ Avance de cimentación       │                              │  │
│ en lote 23                  │ Vinculado a:                 │  │
│                             │ AVN-2025-00123               │  │
│ Tags:                       │                              │  │
│ #cimentación #lote23        │ Subida por:                  │  │
│                             │ Juan Pérez                   │  │
│ [Editar] [Descargar]        │ (Residente de Obra)          │  │
│                             └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

Mapa de Fotos:
┌──────────────────────────────────────────────────────────────┐
│ 🗺️ Mapa de Evidencias                                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Tipo: [Todas ▼]  Fecha: [Último mes ▼]                      │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │                                                        │   │
│ │         📍(15)                                         │   │
│ │                  📍(8)                                 │   │
│ │                        📍(23)                          │   │
│ │  Project                                               │   │
│ │  Boundary          📍(5)                               │   │
│ │  (círculo)                                             │   │
│ │                          📍(12)                        │   │
│ │                 📍(7)                                  │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ Leyenda: 📍 Cluster (click para expandir)                    │
│          Clic en pin individual para ver foto                │
└──────────────────────────────────────────────────────────────┘
```

---

## Notas Técnicas

### Procesamiento de Imagen con Sharp

```typescript
import sharp from 'sharp';

// Aplicar marca de agua
const watermarkedBuffer = await sharp(originalBuffer)
  .composite([
    {
      input: Buffer.from(`
        <svg width="600" height="80">
          <text x="10" y="60" font-size="24" fill="white" opacity="0.7">
            ${watermarkText}
          </text>
        </svg>
      `),
      gravity: 'southwest',
    },
  ])
  .jpeg({ quality: 85 })
  .toBuffer();

// Generar thumbnail
const thumbnailBuffer = await sharp(watermarkedBuffer)
  .resize(300, 225, { fit: 'cover' })
  .jpeg({ quality: 80 })
  .toBuffer();
```

### Hash SHA256

```typescript
import { createHash } from 'crypto';

const sha256Hash = createHash('sha256')
  .update(fileBuffer)
  .digest('hex');

// Ejemplo: a3f5e8b2d1c4f7e9a0b3c6d8e1f4a7b9...
```

### Geolocalización con PostGIS

```sql
-- Guardar coordenadas
UPDATE evidence.photos
SET geolocation = ST_SetSRID(ST_MakePoint(-99.1332, 19.4326), 4326)
WHERE id = 'uuid';

-- Calcular distancia del sitio (en metros)
SELECT
  id,
  ST_Distance(
    geolocation::geography,
    (SELECT location FROM projects.projects WHERE id = 'project-id')::geography
  ) AS distance_meters
FROM evidence.photos;
```

---

## Endpoints Necesarios

```typescript
POST   /api/evidence/photos/upload         // Subir foto con procesamiento
GET    /api/evidence/photos                // Listar fotos con filtros
GET    /api/evidence/photos/:id            // Detalle de foto
PUT    /api/evidence/photos/:id            // Editar descripción/tags
DELETE /api/evidence/photos/:id            // Soft delete
POST   /api/evidence/photos/verify/:id     // Verificar integridad
GET    /api/evidence/photos/map            // Datos para mapa
POST   /api/evidence/albums                // Crear álbum
POST   /api/evidence/export/pdf            // Exportar PDF
POST   /api/evidence/export/zip            // Exportar ZIP
```

---

## Definición de "Done"

- [x] Upload de fotos con Sharp
- [x] Marca de agua automática
- [x] Extracción de EXIF completa
- [x] Hash SHA256 calculado
- [x] Georreferenciación PostGIS
- [x] Galería responsive funcional
- [x] Mapa con Leaflet
- [x] Álbumes funcionales
- [x] Exportación PDF y ZIP
- [x] Tests unitarios >80%
- [x] Aprobado por Product Owner

---

**Estimación:** 8 Story Points
**Dependencias:** Ninguna (independiente)
**Fecha:** 2025-11-17
