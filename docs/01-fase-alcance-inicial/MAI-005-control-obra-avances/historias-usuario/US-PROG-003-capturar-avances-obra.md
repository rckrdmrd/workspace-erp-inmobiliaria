# US-PROG-003: Capturar Avances desde Obra

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 16
**Story Points:** 8
**Prioridad:** Alta
**Asignado a:** Backend + Mobile

---

## Historia de Usuario

**Como** Residente de Obra
**Quiero** capturar avances físicos desde la app móvil con geolocalización automática
**Para** registrar el progreso diario de las actividades de forma rápida y precisa

---

## Criterios de Aceptación

### 1. Captura desde App Móvil ✅
- [ ] Puedo abrir la app en mi teléfono y ver lista de actividades activas del proyecto
- [ ] Puedo filtrar actividades por:
  - Frente de trabajo
  - Etapa (cimentación, estructura, instalaciones, acabados)
  - Vivienda/lote específico
- [ ] Puedo buscar actividades por código o nombre

### 2. Registrar Avance por Porcentaje ✅
- [ ] Puedo seleccionar una actividad y ver:
  - % anterior: 45%
  - Presupuestado: 500 m³
  - Cantidad ejecutada anterior: 225 m³
- [ ] Puedo capturar:
  - % actual: [70%] (slider o teclado numérico)
  - El sistema calcula automáticamente:
    - Incremento: 25%
    - Cantidad nueva: 350 m³
    - Cantidad incrementada: 125 m³
- [ ] No puedo ingresar un % menor al anterior (no retrocesos)
- [ ] No puedo ingresar más de 100%

### 3. Registrar Avance por Cantidad ✅
- [ ] Puedo registrar cantidad directa: [350] m³
- [ ] El sistema calcula % automáticamente: (350/500) × 100 = 70%
- [ ] Puedo ver histórico de cantidades anteriores

### 4. Registrar Avance por Unidad (Viviendas) ✅
- [ ] Si la actividad aplica a viviendas, veo lista de unidades:
  ```
  Lote 23 - Manzana A  [X] 100%
  Lote 24 - Manzana A  [X] 100%
  Lote 25 - Manzana A  [ ] 50%  ← Selecciono
  ```
- [ ] Puedo actualizar el % de avance de cada unidad individualmente
- [ ] Puedo hacer actualizaciones masivas (seleccionar múltiples unidades)

### 5. Geolocalización Automática ✅
- [ ] Al crear un registro, la app captura automáticamente:
  - Coordenadas GPS (latitud, longitud)
  - Precisión del GPS en metros
  - Timestamp exacto
- [ ] El sistema valida que la ubicación esté dentro del radio del proyecto (ej: 500m)
- [ ] Si estoy fuera del radio, recibo alerta pero puedo continuar con justificación
- [ ] Las coordenadas se guardan en formato PostGIS POINT

### 6. Adjuntar Fotos ✅
- [ ] Puedo tomar hasta 10 fotos con la cámara del dispositivo
- [ ] Cada foto se captura con:
  - Timestamp automático
  - Coordenadas GPS del lugar
  - Metadatos EXIF del dispositivo
- [ ] Puedo ver thumbnails de las fotos antes de enviar
- [ ] Puedo eliminar fotos antes de enviar

### 7. Información de Cuadrilla y Recursos ✅
- [ ] Puedo seleccionar la cuadrilla que ejecutó el trabajo
- [ ] Puedo registrar horas-hombre trabajadas: [16] horas
- [ ] Puedo agregar notas y observaciones

### 8. Modo Offline ✅
- [ ] Si no tengo conexión, puedo seguir capturando avances
- [ ] Los registros se guardan localmente en SQLite
- [ ] Veo badge indicando "3 registros pendientes de sincronizar"
- [ ] Cuando recupero conexión, los registros se sincronizan automáticamente
- [ ] Si hay error en sincronización, veo detalle del error y puedo reintentar

### 9. Envío y Estados ✅
- [ ] Puedo guardar el registro como "Borrador" para terminar después
- [ ] Puedo enviar el registro para aprobación
- [ ] Veo confirmación: "Avance registrado y enviado para aprobación"
- [ ] Recibo notificación cuando mi registro es aprobado o rechazado
- [ ] Si es rechazado, veo motivo y puedo corregir

---

## Mockup / Wireframe (App Móvil)

```
┌─────────────────────────────┐
│ ◀ Registrar Avance      ☰   │
├─────────────────────────────┤
│                             │
│ Actividad                   │
│ ACT-025: Cimentación Tipo 1 │
│ Partida: 02.01.03           │
│                             │
│ ┌─────────────────────────┐ │
│ │ Avance Anterior         │ │
│ │ 45.0%  (225/500 m³)     │ │
│ └─────────────────────────┘ │
│                             │
│ Tipo de Registro            │
│ ⦿ Por Porcentaje            │
│ ○ Por Cantidad              │
│ ○ Por Unidad                │
│                             │
│ ┌─────────────────────────┐ │
│ │ Avance Actual           │ │
│ │                         │ │
│ │   [━━━━━━━●━━━] 70%     │ │
│ │                         │ │
│ │ Incremento: +25%        │ │
│ │ Cantidad: 350 m³        │ │
│ └─────────────────────────┘ │
│                             │
│ Recursos                    │
│ Cuadrilla: [Cimiento 1 ▼]   │
│ Horas-Hombre: [16_____]     │
│                             │
│ Fotos (3/10)                │
│ [📷][📷][📷][+ Agregar]     │
│                             │
│ Ubicación                   │
│ 📍 19.4326, -99.1332        │
│ ✓ Dentro del sitio (125m)   │
│                             │
│ Notas                       │
│ ┌───────────────────────────┐ │
│ │Se completó cimentación   │ │
│ │de lotes 23-25...         │ │
│ └───────────────────────────┘ │
│                             │
│ [Guardar Borrador]          │
│                             │
│ [Enviar para Aprobación]    │
│                             │
└─────────────────────────────┘

Modo Offline:
┌─────────────────────────────┐
│ 📡 Sin conexión             │
│ 3 registros pendientes sync │
│ [Reintentar]                │
└─────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. ABRIR APP MÓVIL
   ↓
   Ver lista de actividades activas

2. SELECCIONAR ACTIVIDAD
   ↓
   Ver % anterior y cantidad anterior

3. CAPTURAR AVANCE
   ↓
   Opciones:
   - Ingresar % actual (slider o teclado)
   - Ingresar cantidad actual
   - Seleccionar unidades (si aplica)

4. ADJUNTAR EVIDENCIAS
   ↓
   Tomar fotos con cámara
   ↓
   Geolocalización automática

5. REGISTRAR RECURSOS
   ↓
   Seleccionar cuadrilla
   Ingresar horas-hombre
   Agregar notas

6. VALIDAR Y ENVIAR
   ↓
   Si hay conexión:
     → Enviar directamente
   Si NO hay conexión:
     → Guardar en SQLite local
     → Marcar como "pendiente sync"

7. SINCRONIZACIÓN (cuando hay conexión)
   ↓
   Enviar registros pendientes al servidor
   ↓
   Marcar como sincronizado
   ↓
   Cambiar estado a "submitted"

8. NOTIFICACIÓN DE RESULTADO
   ↓
   Aprobado: ✓ Registro aprobado
   Rechazado: ✗ Ver motivo y corregir
```

---

## Endpoints Necesarios

```typescript
// Mobile App Endpoints
POST   /api/progress/records               // Crear registro de avance
GET    /api/progress/projects/:id/activities-active  // Actividades activas
POST   /api/progress/records/batch         // Batch de registros offline
GET    /api/progress/records/:id/status    // Estado de un registro
POST   /api/progress/photos/upload         // Subir fotos

// Sync Endpoints
POST   /api/progress/offline-sync          // Sincronizar registros offline
GET    /api/progress/offline-sync/status   // Estado de sincronización
```

---

## Validaciones Importantes

```typescript
// No retrocesos
if (currentPercent < previousPercent) {
  throw new Error('El avance no puede ser menor al anterior');
}

// Límite 100%
if (currentPercent > 100) {
  throw new Error('El avance no puede exceder 100%');
}

// Geolocalización
const distance = calculateDistance(gps, projectLocation);
if (distance > 500) { // metros
  showWarning('Estás fuera del radio del proyecto');
  requireJustification();
}

// Offline sync
if (!hasConnection) {
  saveToLocalDB(record);
  showBadge('Pendiente sincronización');
}
```

---

## Definición de "Done"

- [x] App móvil con React Native funcional
- [x] Captura de avances por %, cantidad y unidad
- [x] Geolocalización con PostGIS
- [x] Upload de fotos con EXIF
- [x] Modo offline con SQLite
- [x] Sincronización automática
- [x] Validaciones en frontend y backend
- [x] Tests unitarios >80%
- [x] Tested en iOS y Android
- [x] Aprobado por Product Owner

---

**Estimación:** 8 Story Points
**Dependencias:** US-PROG-001
**Fecha:** 2025-11-17
