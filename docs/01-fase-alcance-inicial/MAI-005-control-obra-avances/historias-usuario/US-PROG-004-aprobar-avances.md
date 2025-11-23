# US-PROG-004: Aprobar Avances con Flujo de Validación

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 16
**Story Points:** 5
**Prioridad:** Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Jefe de Proyecto
**Quiero** revisar y aprobar los avances reportados por los residentes de obra
**Para** asegurar que los datos reflejen el estado real del proyecto antes de actualizar la Curva S

---

## Criterios de Aceptación

### 1. Panel de Aprobaciones Pendientes ✅
- [ ] Puedo ver lista de registros de avance pendientes de aprobación
- [ ] Para cada registro veo:
  - Código: AVN-2025-00123
  - Fecha de registro
  - Actividad: ACT-025 - Cimentación
  - Registrado por: Juan Pérez (Residente)
  - % Anterior → % Actual: 45% → 70% (+25%)
  - Cantidad: 225 m³ → 350 m³ (+125 m³)
  - Cuadrilla: Cimiento 1
  - Horas-hombre: 16 hrs
  - Fotos: 3
  - Ubicación: 📍 Dentro del sitio
- [ ] Puedo filtrar por:
  - Proyecto
  - Fecha (rango)
  - Actividad
  - Residente que registró
- [ ] Puedo ordenar por fecha, actividad, % de avance

### 2. Revisar Detalle del Registro ✅
- [ ] Puedo hacer clic en un registro para ver detalle completo
- [ ] Veo información ampliada:
  - Comparativo visual: antes vs después
  - Gráfica de barras mostrando incremento
  - Mapa con ubicación GPS del registro
  - Galería de fotos con zoom
  - Metadatos EXIF de cada foto
  - Notas y observaciones del residente
- [ ] Puedo ver historial de avances anteriores de la misma actividad

### 3. Validaciones Automáticas ✅
- [ ] El sistema muestra alertas automáticas si detecta:
  - ⚠️ Incremento > 20% en un día (inusual)
  - ⚠️ Avance reportado fuera del horario laboral
  - ⚠️ Geolocalización fuera del radio del proyecto
  - ⚠️ No hay fotos adjuntas (si son requeridas)
  - ⚠️ Cantidad excede lo presupuestado
- [ ] Las alertas son advertencias, no bloqueos (puedo aprobar de todas formas)

### 4. Aprobar Registro ✅
- [ ] Puedo hacer clic en botón "Aprobar"
- [ ] Puedo agregar notas de aprobación (opcional)
- [ ] Al aprobar:
  - El registro cambia de estado: submitted → approved
  - Se actualiza el % de la actividad en el programa de obra
  - Se actualiza el avance de la unidad (si aplica)
  - Se recalcula la Curva S automáticamente
  - Se genera snapshot nuevo si es necesario
  - El residente recibe notificación de aprobación
- [ ] Veo confirmación: "Avance aprobado correctamente"

### 5. Rechazar Registro ✅
- [ ] Puedo hacer clic en botón "Rechazar"
- [ ] DEBO especificar motivo de rechazo (obligatorio)
  ```
  Motivos predefinidos:
  - Cantidad inconsistente con fotos
  - Ubicación incorrecta
  - Falta evidencia fotográfica
  - Incremento poco realista
  - Otro (especificar)
  ```
- [ ] Puedo agregar notas adicionales
- [ ] Al rechazar:
  - El registro cambia de estado: submitted → rejected
  - El residente recibe notificación con el motivo
  - El registro NO actualiza la actividad ni la Curva S
  - El residente puede corregir y reenviar

### 6. Aprobación Masiva ✅
- [ ] Puedo seleccionar múltiples registros (checkboxes)
- [ ] Puedo hacer clic en "Aprobar Seleccionados"
- [ ] Veo confirmación: "¿Aprobar 5 registros seleccionados?"
- [ ] Al confirmar, todos se aprueban en batch
- [ ] Veo resultado: "5 de 5 registros aprobados exitosamente"
- [ ] Si alguno falla, veo detalle del error

### 7. Flujo de Aprobación Multi-nivel ✅
- [ ] Si el monto del avance excede umbral ($50,000), requiere 2 aprobaciones:
  - Nivel 1: Residente → Aprueba
  - Nivel 2: Jefe de Proyecto → Aprueba final
- [ ] Puedo ver en qué nivel de aprobación está cada registro
- [ ] Recibo notificaciones cuando me toca aprobar un nivel

---

## Mockup / Wireframe

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ✓ Aprobación de Avances - Fracc. Los Pinos                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ Pendientes de Aprobación: 8                                              │
│                                                                           │
│ Filtros: [Todos ▼] [Última semana ▼] [Buscar actividad...]              │
│                                                                           │
│ [□] Seleccionar todos   [Aprobar Seleccionados]                          │
│                                                                           │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │[□] AVN-2025-00123  │  15/Ene/25 14:30  │  Juan Pérez (Residente)  │   │
│ │    ACT-025: Cimentación Tipo 1                                     │   │
│ │    45% → 70% (+25%)  |  225 m³ → 350 m³  |  📷 3 fotos  |  📍 OK   │   │
│ │    Cuadrilla: Cimiento 1  |  16 hrs-hombre                         │   │
│ │    ⚠️ Incremento alto (+25% en 1 día)                              │   │
│ │                                                                     │   │
│ │    [Ver Detalle]  [✓ Aprobar]  [✗ Rechazar]                        │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │[□] AVN-2025-00124  │  15/Ene/25 16:45  │  María González          │   │
│ │    ACT-027: Estructura Tipo 2                                      │   │
│ │    30% → 55% (+25%)  |  150 m³ → 275 m³  |  📷 5 fotos  |  📍 OK   │   │
│ │    Cuadrilla: Estructura 2  |  24 hrs-hombre                       │   │
│ │                                                                     │   │
│ │    [Ver Detalle]  [✓ Aprobar]  [✗ Rechazar]                        │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│ ...más registros...                                                       │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

Detalle del Registro:
┌──────────────────────────────────────────────────────────────────────────┐
│ ◀ Volver              Detalle de Avance AVN-2025-00123                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ ┌─ Información General ─────────────────────────────────────────────┐    │
│ │ Actividad: ACT-025 - Cimentación Tipo 1                           │    │
│ │ Partida: 02.01.03 - Cimentación con concreto f'c=250              │    │
│ │ Registrado por: Juan Pérez (Residente)                            │    │
│ │ Fecha: 15/Ene/2025 14:30                                           │    │
│ │ Vía: App Móvil (iPhone 14 Pro)                                    │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│ ┌─ Avance Reportado ────────────────────────────────────────────────┐    │
│ │                                                                    │    │
│ │ Anterior:  45%  (225 m³)    ░░░░░░░░░░                            │    │
│ │ Actual:    70%  (350 m³)    ████████████████                      │    │
│ │ Incremento: +25% (+125 m³)  ████████                              │    │
│ │                                                                    │    │
│ │ Presupuestado: 500 m³       Ejecutado: 70%                        │    │
│ │                                                                    │    │
│ │ ⚠️ Incremento de 25% en un solo día es inusualmente alto          │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│ ┌─ Recursos ────────────────────────────────────────────────────────┐    │
│ │ Cuadrilla: Cimiento 1 (8 trabajadores)                            │    │
│ │ Horas-Hombre: 16 hrs                                               │    │
│ │ Productividad: 7.8 m³/hr (vs 6.5 m³/hr planificado) ✓             │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│ ┌─ Evidencias Fotográficas (3) ─────────────────────────────────────┐    │
│ │ [🖼️ Foto 1]  [🖼️ Foto 2]  [🖼️ Foto 3]                             │    │
│ │ 14:30        14:35        14:42                                    │    │
│ │ GPS ✓        GPS ✓        GPS ✓                                    │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│ ┌─ Geolocalización ─────────────────────────────────────────────────┐    │
│ │ 📍 19.4326, -99.1332                                               │    │
│ │ Precisión: 5 metros                                                │    │
│ │ Distancia del sitio: 125 metros ✓ Dentro del radio                │    │
│ │                                                                    │    │
│ │ [Ver en Mapa]                                                      │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│ ┌─ Notas del Residente ─────────────────────────────────────────────┐    │
│ │ Se completó cimentación de lotes 23-25. Buen rendimiento de la    │    │
│ │ cuadrilla. Clima favorable.                                        │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│ Notas de Aprobación (opcional):                                          │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │ _____________________________________________________________      │   │
│ │                                                                    │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│                                       [✗ Rechazar]  [✓ Aprobar]          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Aprobación

```
1. RESIDENTE REGISTRA AVANCE
   ↓
   Estado: submitted
   ↓
   Notificación al Jefe de Proyecto

2. JEFE DE PROYECTO REVISA
   ↓
   Abre panel de aprobaciones
   ↓
   Ve lista de pendientes

3. ABRE DETALLE
   ↓
   Revisa:
   - % y cantidades
   - Fotos
   - Geolocalización
   - Alertas del sistema

4. DECISIÓN
   ↓
   ┌─────────────┬─────────────┐
   │   APROBAR   │  RECHAZAR   │
   └─────────────┴─────────────┘
        │              │
        ↓              ↓
   Estado:        Estado:
   approved       rejected
        │              │
        ↓              ↓
   Actualiza:     Notifica:
   - Actividad    - Residente
   - Curva S      - Con motivo
   - Unit Progress
        │              │
        ↓              ↓
   Notifica:      Residente puede
   - Residente    corregir y
   - Equipo       reenviar
```

---

## Endpoints Necesarios

```typescript
GET    /api/progress/projects/:projectId/pending-approvals
GET    /api/progress/records/:id
POST   /api/progress/records/:id/approve
POST   /api/progress/records/:id/reject
POST   /api/progress/records/batch-approve
GET    /api/progress/records/:id/history
```

---

## Definición de "Done"

- [x] Panel de aprobaciones pendientes funcional
- [x] Vista de detalle con toda la información
- [x] Validaciones automáticas implementadas
- [x] Flujo de aprobación y rechazo completo
- [x] Aprobación masiva funcional
- [x] Notificaciones enviadas correctamente
- [x] Actualización de Curva S tras aprobación
- [x] Tests unitarios >80%
- [x] Aprobado por Product Owner

---

**Estimación:** 5 Story Points
**Dependencias:** US-PROG-003
**Fecha:** 2025-11-17
