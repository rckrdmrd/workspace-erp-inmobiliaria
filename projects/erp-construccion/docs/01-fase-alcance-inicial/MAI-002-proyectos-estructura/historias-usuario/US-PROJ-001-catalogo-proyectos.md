# US-PROJ-001: Catálogo de Proyectos

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 3
**Story Points:** 8 SP
**Prioridad:** P0 (Crítica)
**Estimación:** 3-4 días
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## Historia de Usuario

**Como** Director de Proyectos o Administrador de Constructora
**Quiero** gestionar un catálogo completo de proyectos con toda su información técnica, contractual y operativa
**Para** tener visibilidad y control centralizado de todos los proyectos en ejecución, planificación y cerrados

---

## Contexto de Negocio

Una constructora gestiona múltiples proyectos simultáneamente (fraccionamientos, conjuntos habitacionales, edificios verticales). Es crítico tener un sistema centralizado que permita:

- Visualizar el estado de todos los proyectos en tiempo real
- Crear nuevos proyectos con información completa
- Actualizar datos contractuales, fechas y métricas
- Filtrar y buscar proyectos por múltiples criterios
- Controlar transiciones de estado según reglas de negocio
- Generar códigos únicos automáticamente por año

---

## Criterios de Aceptación

### ✅ AC1: Visualización de Catálogo de Proyectos

**Dado** que soy un usuario autenticado con rol de Director, Residente, Ingeniero, o Admin
**Cuando** accedo a la sección "Proyectos"
**Entonces** debo ver:

- Lista paginada de proyectos (20 por página)
- Cada proyecto mostrado como tarjeta (card) con:
  - Código del proyecto (ej: PROJ-2025-001)
  - Nombre del proyecto
  - Tipo de proyecto (badge con color)
  - Estado actual (badge con color)
  - Cliente
  - Fechas clave: inicio contractual, fin programado
  - Avance físico global (barra de progreso)
  - Monto del contrato
- Ordenamiento por: código, nombre, fecha de inicio, estado
- Total de proyectos en cada estado (resumen en header)

**Criterios visuales:**
- Estados con colores distintivos:
  - Licitación: Gris
  - Adjudicado: Azul
  - Ejecución: Verde
  - Entregado: Púrpura
  - Cerrado: Gris oscuro
- Iconos por tipo de proyecto:
  - Fraccionamiento: 🏘️
  - Conjunto: 🏗️
  - Edificio Vertical: 🏢
  - Mixto: 🌆

---

### ✅ AC2: Filtros y Búsqueda de Proyectos

**Dado** que estoy viendo el catálogo de proyectos
**Cuando** aplico filtros
**Entonces** debo poder filtrar por:

- **Tipo de proyecto:** Fraccionamiento / Conjunto / Edificio / Mixto
- **Estado:** Licitación / Adjudicado / Ejecución / Entregado / Cerrado
- **Tipo de cliente:** Público / Privado / Mixto
- **Año de inicio:** 2024, 2025, 2026, etc.
- **Búsqueda de texto libre:** Por nombre, código, cliente (búsqueda insensible a mayúsculas)

**Y** los filtros deben ser combinables (aplicar múltiples a la vez)
**Y** debe mostrarse el contador de resultados filtrados
**Y** debe existir botón "Limpiar filtros" para resetear

**Ejemplo:**
```
Filtros aplicados:
- Tipo: Fraccionamiento Horizontal
- Estado: En Ejecución
- Año: 2025

Resultados: 12 proyectos encontrados
```

---

### ✅ AC3: Creación de Nuevo Proyecto

**Dado** que soy Director o Admin
**Cuando** hago clic en "Nuevo Proyecto"
**Entonces** debo ver un formulario con los siguientes campos:

**Sección 1: Información Básica**
- **Nombre del proyecto** (obligatorio, texto, max 200 caracteres)
- **Tipo de proyecto** (obligatorio, select: Fraccionamiento / Conjunto / Edificio / Mixto)
- **Descripción** (opcional, textarea, max 500 caracteres)

**Sección 2: Cliente y Contrato**
- **Tipo de cliente** (obligatorio, select: Público / Privado / Mixto)
- **Nombre del cliente** (obligatorio, texto, max 200 caracteres)
- **RFC del cliente** (obligatorio, 12 o 13 caracteres, validación de formato)
- **Contacto del cliente** (opcional, texto, max 200 caracteres)
- **Tipo de contrato** (obligatorio, select: Precio Alzado / Precios Unitarios / Administración / Mixto)
- **Monto del contrato** (obligatorio, número decimal, > 0)
- **Fecha de firma** (obligatorio, date picker)

**Sección 3: Ubicación**
- **Dirección completa** (obligatorio, textarea, max 300 caracteres)
- **Ciudad** (obligatorio, texto)
- **Estado** (obligatorio, select con 32 estados de México)
- **Código Postal** (obligatorio, 5 dígitos)
- **Coordenadas GPS** (opcional, lat/lng, validación de formato)

**Sección 4: Fechas y Plazos**
- **Fecha de inicio contractual** (obligatorio, date picker)
- **Duración en meses** (obligatorio, número entero, 1-120)
- **Fecha de fin programada** (calculada automáticamente: inicio + duración)

**Sección 5: Permisos y Licencias**
- **Licencia de construcción** (opcional, texto)
- **Fecha de licencia** (opcional, date picker)
- **Manifestación de impacto ambiental** (opcional, checkbox)
- **Licencia de uso de suelo** (opcional, texto)

**Validaciones:**
- Todos los campos obligatorios deben estar completos
- RFC debe tener formato válido (validación con regex)
- Monto del contrato debe ser > 0
- Duración debe estar entre 1 y 120 meses
- Código postal debe ser 5 dígitos
- Coordenadas GPS deben tener formato válido (si se proporcionan)

**Cuando** envío el formulario válido
**Entonces**:
- Sistema genera código automático: `PROJ-YYYY-XXX` (ej: PROJ-2025-001)
- Sistema calcula `scheduledEndDate` = `contractStartDate + contractDuration meses`
- Sistema asigna estado inicial: `adjudicado`
- Sistema asocia proyecto a mi constructora (`constructoraId`)
- Sistema guarda `createdBy` con mi usuario
- Sistema muestra notificación: "Proyecto PROJ-2025-001 creado exitosamente"
- Sistema redirige a vista de detalle del proyecto

**Y** el código debe ser secuencial por año y por constructora
**Y** si ya existe PROJ-2025-001, el siguiente debe ser PROJ-2025-002

---

### ✅ AC4: Edición de Proyecto Existente

**Dado** que soy Director o Admin
**Y** estoy viendo el detalle de un proyecto
**Cuando** hago clic en "Editar Proyecto"
**Entonces**:
- Debo ver el mismo formulario de creación, pre-llenado con datos actuales
- Debo poder modificar cualquier campo EXCEPTO:
  - Código del proyecto (read-only)
  - Estado (se cambia por flujo separado, ver US-PROJ-002)
  - Constructora ID (read-only)
- Al guardar cambios, sistema debe actualizar `updatedBy` y `updatedAt`
- Sistema debe mostrar notificación: "Proyecto actualizado exitosamente"

**Restricciones:**
- No se puede editar el código del proyecto
- No se puede cambiar la constructora asociada
- Solo Director y Admin pueden editar

---

### ✅ AC5: Vista de Detalle de Proyecto

**Dado** que estoy viendo el catálogo de proyectos
**Cuando** hago clic en cualquier tarjeta de proyecto
**Entonces** debo ver una vista de detalle con:

**Tab 1: Información General**
- Código, nombre, tipo, estado
- Cliente: tipo, nombre, RFC, contacto
- Contrato: tipo, monto, fecha de firma
- Ubicación: dirección completa, mapa (si hay coordenadas GPS)
- Fechas: inicio contractual, fin programado, inicio real, entrega real
- Permisos: licencias, MIA, uso de suelo

**Tab 2: Métricas del Proyecto**
- **Métricas Físicas:**
  - Total de viviendas planificadas
  - Total de viviendas en construcción
  - Total de viviendas terminadas
  - Avance físico global (%)
- **Métricas Financieras:**
  - Monto del contrato
  - Costo ejercido
  - Desviación presupuestal (%)
- **Métricas Temporales:**
  - Días transcurridos
  - Días restantes (si está en ejecución)
  - Desviación de calendario (días de atraso/adelanto)

**Tab 3: Estructura del Proyecto**
- Vista de árbol jerárquico (etapas, manzanas, lotes, viviendas)
- Acceso a gestión de estructura (ver US-PROJ-003)

**Tab 4: Equipo Asignado**
- Lista de miembros del equipo con roles
- Acceso a gestión de equipo (ver US-PROJ-007)

**Tab 5: Calendario e Hitos**
- Línea de tiempo de hitos
- Fechas críticas
- Acceso a gestión de calendario (ver US-PROJ-008)

**Acciones disponibles en vista de detalle:**
- Botón "Editar Proyecto" (solo Director/Admin)
- Botón "Cambiar Estado" (ver US-PROJ-002)
- Botón "Eliminar Proyecto" (solo Admin, con confirmación)
- Botón "Exportar PDF" (genera reporte ejecutivo)

---

### ✅ AC6: Eliminación de Proyecto

**Dado** que soy Admin
**Y** estoy viendo el detalle de un proyecto
**Cuando** hago clic en "Eliminar Proyecto"
**Entonces**:
- Sistema muestra modal de confirmación:
  ```
  ⚠️ ¿Estás seguro de eliminar este proyecto?

  Proyecto: PROJ-2025-001 - Fraccionamiento Los Pinos

  Esta acción es IRREVERSIBLE y eliminará:
  - Toda la estructura jerárquica (etapas, manzanas, lotes, viviendas)
  - Asignaciones de equipo
  - Milestones y fechas críticas
  - Documentos asociados

  Escribe "ELIMINAR" para confirmar:
  [_______________]

  [Cancelar]  [Confirmar Eliminación]
  ```
- Usuario debe escribir exactamente "ELIMINAR" para habilitar botón de confirmación
- Al confirmar, sistema elimina proyecto y todas sus relaciones (CASCADE)
- Sistema muestra notificación: "Proyecto PROJ-2025-001 eliminado"
- Sistema redirige a catálogo de proyectos

**Restricción:** Solo Admin puede eliminar proyectos

---

### ✅ AC7: Permisos por Rol

**Dado** que soy un usuario autenticado
**Entonces** mis permisos deben ser:

| Acción | Director | Residente | Ingeniero | Supervisor | Admin |
|--------|----------|-----------|-----------|------------|-------|
| Ver catálogo de proyectos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crear proyecto | ✅ | ❌ | ❌ | ❌ | ✅ |
| Editar proyecto | ✅ | ❌ | ❌ | ❌ | ✅ |
| Eliminar proyecto | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ver detalle de proyecto | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exportar PDF | ✅ | ✅ | ❌ | ❌ | ✅ |

**Y** si intento realizar una acción sin permisos:
- Sistema muestra notificación de error: "No tienes permisos para realizar esta acción"
- Botones/opciones no permitidas deben estar ocultos o deshabilitados

---

### ✅ AC8: Responsividad y Experiencia de Usuario

**Dado** que accedo desde diferentes dispositivos
**Entonces**:
- En **Desktop** (>1024px): Vista de cards en grilla de 3 columnas
- En **Tablet** (768-1024px): Vista de cards en grilla de 2 columnas
- En **Mobile** (<768px): Vista de cards en 1 columna, stack vertical

**Y** el formulario de creación/edición debe ser responsive:
- Secciones colapsables en mobile
- Campos de formulario al 100% de ancho en mobile
- Date pickers nativos en mobile

**Y** debe haber indicadores de carga:
- Skeleton loaders al cargar catálogo
- Spinner al crear/editar proyecto
- Mensajes de confirmación con toasts/snackbars

---

## Escenarios de Prueba

### Escenario 1: Crear Fraccionamiento Horizontal

**Given** soy Director autenticado
**When** accedo a "Proyectos" y hago clic en "Nuevo Proyecto"
**And** completo el formulario con:
- Nombre: "Fraccionamiento Los Pinos"
- Tipo: Fraccionamiento Horizontal
- Cliente tipo: Público
- Cliente nombre: "INFONAVIT"
- RFC: "INF890523QT4"
- Monto contrato: $45,000,000 MXN
- Inicio: 2025-06-01
- Duración: 18 meses
**And** hago clic en "Crear Proyecto"
**Then** sistema genera código PROJ-2025-001
**And** calcula fecha fin: 2026-11-30
**And** muestra notificación "Proyecto creado exitosamente"
**And** me redirige a vista de detalle

---

### Escenario 2: Filtrar Proyectos en Ejecución

**Given** existen 30 proyectos en el sistema:
- 5 en Licitación
- 8 en Adjudicado
- 12 en Ejecución
- 3 Entregados
- 2 Cerrados
**When** aplico filtro "Estado: Ejecución"
**Then** sistema muestra solo 12 proyectos
**And** header muestra "12 proyectos encontrados"

---

### Escenario 3: Buscar Proyecto por Cliente

**Given** existen proyectos con clientes "INFONAVIT", "FOVISSSTE", "ABC Desarrollos"
**When** escribo "INFO" en búsqueda de texto libre
**Then** sistema muestra solo proyectos con cliente "INFONAVIT"
**And** búsqueda es case-insensitive (también encuentra "infonavit")

---

### Escenario 4: Intentar Eliminar sin Permisos

**Given** soy Residente autenticado
**When** accedo al detalle de un proyecto
**Then** NO debo ver botón "Eliminar Proyecto"
**And** si intento acceder a la URL de eliminación directamente
**Then** sistema retorna 403 Forbidden

---

### Escenario 5: Código Secuencial por Año

**Given** existen proyectos:
- PROJ-2024-001
- PROJ-2024-002
- PROJ-2025-001
**When** creo un nuevo proyecto en 2025
**Then** sistema genera código PROJ-2025-002
**When** creo un nuevo proyecto en 2026
**Then** sistema genera código PROJ-2026-001 (reinicia secuencia por año)

---

## Mockups / Wireframes

### Vista de Catálogo (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROYECTOS                                    [+ Nuevo Proyecto]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ Filtros:                                                             │
│ [Tipo ▼] [Estado ▼] [Año ▼]      [🔍 Buscar proyectos...]          │
│                                                                       │
│ 24 proyectos encontrados        [⚙️ Columnas] [↓ Exportar]          │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│ │ 🏘️       │  │ 🏗️       │  │ 🏢       │                           │
│ │ PROJ-    │  │ PROJ-    │  │ PROJ-    │                           │
│ │ 2025-001 │  │ 2025-002 │  │ 2025-003 │                           │
│ │          │  │          │  │          │                           │
│ │ Fracc.   │  │ Conjunto │  │ Edificio │                           │
│ │ Los Pinos│  │ Jardines │  │ Torre    │                           │
│ │          │  │          │  │ Central  │                           │
│ │ 🔵 Ejecuc│  │ 🟢 Ejecuc│  │ 🟣 Entreg│                           │
│ │          │  │          │  │          │                           │
│ │ INFONAVIT│  │ FOVISSSTE│  │ Privado  │                           │
│ │ $45M MXN │  │ $32M MXN │  │ $18M MXN │                           │
│ │          │  │          │  │          │                           │
│ │ ▓▓▓▓▓░░░ │  │ ▓▓▓▓▓▓░░ │  │ ▓▓▓▓▓▓▓▓ │                           │
│ │ 65%      │  │ 78%      │  │ 100%     │                           │
│ └──────────┘  └──────────┘  └──────────┘                           │
│                                                                       │
│ [1] 2 3 4 5 ... 8  →                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Formulario de Creación (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Nuevo Proyecto                                   [Guardar] [❌]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ▼ Información Básica                                                │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ Nombre del proyecto *                                       │  │
│   │ [__________________________________________]                │  │
│   │                                                             │  │
│   │ Tipo de proyecto *           Descripción                   │  │
│   │ [Fraccionamiento ▼]          [________________]            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ▼ Cliente y Contrato                                                │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ Tipo de cliente *            Nombre del cliente *          │  │
│   │ [Público ▼]                  [___________________]         │  │
│   │                                                             │  │
│   │ RFC *                        Contacto                      │  │
│   │ [_____________]              [___________________]         │  │
│   │                                                             │  │
│   │ Tipo de contrato *           Monto del contrato (MXN) *    │  │
│   │ [Precio Alzado ▼]            [$________________]           │  │
│   │                                                             │  │
│   │ Fecha de firma *                                           │  │
│   │ [📅 2025-01-15]                                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ▼ Ubicación                                                         │
│ ▼ Fechas y Plazos                                                   │
│ ▼ Permisos y Licencias                                              │
│                                                                       │
│                                            [Cancelar]  [💾 Guardar] │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Definición de Done (DoD)

- [ ] Código implementado según ET-PROJ-001
- [ ] Endpoints REST funcionando y probados
- [ ] Frontend responsive (Desktop, Tablet, Mobile)
- [ ] Validaciones de formulario completas (frontend y backend)
- [ ] Permisos por rol implementados y probados
- [ ] Tests unitarios escritos y pasando (>80% coverage)
  - Service: create, findAll, update, delete, generateCode
  - Controller: endpoints CRUD
  - Frontend: ProjectForm, ProjectCard
- [ ] Tests de integración para flujo completo de creación
- [ ] Documentación API actualizada (Swagger/OpenAPI)
- [ ] Código revisado y aprobado (Code Review)
- [ ] Sin issues críticos de seguridad (SonarQube/ESLint)
- [ ] Probado en navegadores: Chrome, Firefox, Safari, Edge
- [ ] Accesibilidad básica (ARIA labels, navegación por teclado)
- [ ] Notificaciones de éxito/error implementadas
- [ ] Deployed a ambiente de QA y probado end-to-end

---

## Notas Técnicas

### Backend

**Endpoints:**
```
GET    /api/projects              - Listar proyectos (con filtros)
GET    /api/projects/:id          - Obtener un proyecto
POST   /api/projects              - Crear proyecto
PUT    /api/projects/:id          - Actualizar proyecto
DELETE /api/projects/:id          - Eliminar proyecto
GET    /api/projects/:id/metrics  - Obtener métricas calculadas
```

**Filters Query Params:**
```
?projectType=fraccionamiento_horizontal
&status=ejecucion
&clientType=publico
&year=2025
&search=INFONAVIT
&page=1
&limit=20
&orderBy=code
&order=asc
```

### Frontend

**Components:**
- `ProjectsListPage.tsx` - Página principal con catálogo
- `ProjectDetailPage.tsx` - Vista de detalle
- `CreateProjectPage.tsx` - Formulario de creación
- `EditProjectPage.tsx` - Formulario de edición
- `ProjectCard.tsx` - Tarjeta de proyecto individual
- `ProjectForm.tsx` - Formulario reutilizable (create/edit)
- `ProjectFilters.tsx` - Barra de filtros
- `DeleteProjectModal.tsx` - Modal de confirmación de eliminación

**State Management (Zustand):**
```typescript
interface ProjectsStore {
  projects: Project[];
  filters: ProjectFilters;
  pagination: Pagination;
  setFilters: (filters: ProjectFilters) => void;
  fetchProjects: () => Promise<void>;
  createProject: (dto: CreateProjectDto) => Promise<Project>;
  updateProject: (id: string, dto: UpdateProjectDto) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}
```

### Validaciones Zod

```typescript
const createProjectSchema = z.object({
  name: z.string().min(3).max(200),
  projectType: z.enum(['fraccionamiento_horizontal', 'conjunto_habitacional', 'edificio_vertical', 'mixto']),
  clientType: z.enum(['publico', 'privado', 'mixto']),
  clientName: z.string().min(3).max(200),
  clientRFC: z.string().length(12).or(z.string().length(13)).regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/),
  contractAmount: z.number().positive(),
  contractStartDate: z.string().datetime(),
  contractDuration: z.number().int().min(1).max(120),
  // ... más campos
});
```

---

## Dependencias

**Depende de:**
- ✅ MAI-001: Fundamentos y Autenticación (para roles y permisos)
- ✅ ET-PROJ-001: Especificación técnica de catálogo de proyectos

**Bloquea a:**
- 📋 US-PROJ-002: Transiciones de Estado (necesita proyectos existentes)
- 📋 US-PROJ-003: Crear Estructura de Fraccionamiento (necesita proyecto padre)
- 📋 US-PROJ-007: Asignación de Equipo (necesita proyectos para asignar equipo)

---

## Criterios de Aceptación del Product Owner

- [ ] Puedo crear un proyecto nuevo en menos de 3 minutos
- [ ] El código generado es único y secuencial por año
- [ ] Los filtros responden en menos de 1 segundo
- [ ] La búsqueda de texto libre funciona correctamente
- [ ] Solo usuarios con permisos pueden crear/editar/eliminar
- [ ] La vista de detalle muestra toda la información relevante
- [ ] El formulario valida correctamente el RFC mexicano
- [ ] La calculadora de fechas funciona correctamente (inicio + duración)
- [ ] La eliminación requiere confirmación explícita
- [ ] La interfaz es responsive y funciona en móvil

---

**Fecha de generación:** 2025-11-17
**Autor:** Equipo de Producto
**Aprobado por:** Product Owner
**Estado:** ✅ Ready for Development
