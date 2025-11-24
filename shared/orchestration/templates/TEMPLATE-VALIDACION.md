# VALIDACIÓN: {TAREA-ID} - {Nombre de la Tarea}

**Agente:** {Database-Agent | Backend-Agent | Frontend-Agent | etc}
**Fecha validación:** {YYYY-MM-DD HH:MM}
**Relacionado con:** [{REQ-XXX}], [{DB-XXX}], [{BE-XXX}]

---

## 📋 CHECKLIST DE VALIDACIÓN

### Base de Datos (si aplica)

**DDL - Ejecución:**
- [ ] Script `create-database.sh` ejecuta sin errores
- [ ] Todas las tablas creadas correctamente
- [ ] Índices creados según plan
- [ ] Constraints aplicados (PK, FK, CHECK)
- [ ] Funciones funcionan correctamente
- [ ] Triggers activados correctamente

**Estructura:**
```bash
$ ./apps/database/create-database.sh
{Pegar output completo o resumen}

✅ Resultado: EXITOSO | ❌ ERROR
```

**Validación de Tablas:**
```sql
-- Verificar tabla
\d {schema}.{tabla}

{Pegar output}

✅ Columnas: {N}/{N esperadas}
✅ Índices: {M}/{M esperados}
```

**Seeds:**
- [ ] Seeds de desarrollo cargados
- [ ] Datos de prueba insertados correctamente
- [ ] Sin errores de FK

```bash
$ psql $DATABASE_URL -c "SELECT COUNT(*) FROM {schema}.{tabla};"

✅ Registros cargados: {N}
```

---

### Backend (si aplica)

**Compilación:**
- [ ] TypeScript compila sin errores
- [ ] No hay warnings críticos

```bash
$ cd apps/backend && npm run build

{Pegar output}

✅ Compilación: EXITOSA | ❌ ERROR
⚠️ Warnings: {N} (listar si son críticos)
```

**Entities:**
- [ ] Entities mapeadas correctamente a tablas
- [ ] Relaciones configuradas (OneToMany, ManyToOne, etc.)
- [ ] Decoradores correctos (@Entity, @Column, @PrimaryGeneratedColumn)

**Validación de Entity:**
```typescript
// Verificar entity cargada
import { ProjectEntity } from './modules/projects/entities/project.entity';

✅ Entity importa sin errores
✅ Decoradores correctos
✅ Relaciones definidas: {N}
```

**Services:**
- [ ] Servicios implementan lógica de negocio
- [ ] Métodos CRUD funcionan
- [ ] Manejo de errores implementado
- [ ] Validaciones de negocio aplicadas

**Controllers:**
- [ ] Controllers exponen endpoints correctamente
- [ ] Swagger completo y correcto
- [ ] DTOs con validaciones
- [ ] Response types correctos

**Swagger:**
```bash
# Iniciar backend
$ npm run dev

# Abrir http://localhost:3000/api/docs
✅ Swagger carga correctamente
✅ Endpoints documentados: {N}
✅ DTOs con @ApiProperty: {M}
```

**Tests Unitarios (si aplica):**
```bash
$ npm test

{Pegar output}

✅ Tests: {N} passed, {M} failed
✅ Coverage: {X}%
```

---

### Frontend (si aplica)

**Compilación:**
- [ ] TypeScript compila sin errores
- [ ] Vite build exitoso
- [ ] No hay errores de linter críticos

```bash
$ cd apps/frontend/web && npm run build

{Pegar output}

✅ Build: EXITOSO | ❌ ERROR
```

**Stores (Zustand):**
- [ ] Store inicializa correctamente
- [ ] State definido con tipos correctos
- [ ] Actions funcionan
- [ ] No hay memory leaks

**Validación de Store:**
```typescript
import { useProjectStore } from '@/stores/projectStore';

✅ Store importa sin errores
✅ State initial correcto
✅ Actions implementadas: {N}
```

**Páginas:**
- [ ] Páginas renderizan sin errores
- [ ] Routing funciona correctamente
- [ ] No hay errores en consola
- [ ] Responsive design validado

**Componentes:**
- [ ] Componentes renderizan correctamente
- [ ] Props tipadas correctamente
- [ ] No hay warnings de React
- [ ] Estilos aplicados correctamente

**Integración con API:**
- [ ] Llamadas a API funcionan
- [ ] Manejo de errores implementado
- [ ] Loading states funcionan
- [ ] Datos se muestran correctamente

**Validación de Integración:**
```bash
# Backend corriendo en :3000
# Frontend corriendo en :5173

# Test manual:
1. Abrir http://localhost:5173/admin/projects
2. Verificar que carga lista de proyectos
3. Crear nuevo proyecto
4. Editar proyecto
5. Eliminar proyecto

✅ CRUD completo funciona
```

---

### Integración Cross-Stack

**Alineación DB ↔ Backend:**
- [ ] Nombres de tablas coinciden con entities
- [ ] Columnas DB coinciden con properties de entity
- [ ] Tipos de datos compatibles
- [ ] Relaciones consistentes

**Validación:**
```typescript
// Entity
@Entity({ schema: 'project_management', name: 'projects' })
export class ProjectEntity {
    @Column({ type: 'varchar', length: 50 })
    code: string; // ✅ Coincide con DB: code VARCHAR(50)
}
```

**Alineación Backend ↔ Frontend:**
- [ ] Tipos TypeScript sincronizados
- [ ] Endpoints coinciden entre API y cliente
- [ ] Response types coinciden
- [ ] ENUMs sincronizados

**Validación:**
```typescript
// Backend Controller
@Get()
@ApiResponse({ type: [ProjectEntity] })
async findAll(): Promise<ProjectEntity[]> { }

// Frontend Service
async getAll(): Promise<Project[]> { } // ✅ Tipos coinciden
```

**Constantes Sincronizadas:**
- [ ] Constantes DB en backend actualizadas
- [ ] ENUMs en frontend sincronizados
- [ ] API endpoints coinciden

```typescript
// Verificar sincronización
// apps/backend/src/shared/constants/database.constants.ts
export const DB_SCHEMAS = {
    PROJECT_MANAGEMENT: 'project_management', // ✅
};

// apps/frontend/web/src/shared/constants/api-endpoints.ts
export const API_ENDPOINTS = {
    PROJECTS: '/api/projects', // ✅ Coincide con backend
};
```

---

## 🧪 PRUEBAS FUNCIONALES

### Pruebas de Backend

**Test 1: Crear proyecto**
```bash
$ curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PROJ-2025-001",
    "name": "Fraccionamiento Las Palmas",
    "state": "Jalisco",
    "city": "Guadalajara"
  }'

✅ Respuesta: 201 Created
✅ Objeto creado correctamente
```

**Test 2: Obtener proyectos**
```bash
$ curl -X GET http://localhost:3000/api/projects

✅ Respuesta: 200 OK
✅ Array de proyectos retornado
```

**Test 3: Actualizar proyecto**
```bash
$ curl -X PUT http://localhost:3000/api/projects/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Fraccionamiento Las Palmas II"}'

✅ Respuesta: 200 OK
✅ Objeto actualizado
```

**Test 4: Eliminar proyecto**
```bash
$ curl -X DELETE http://localhost:3000/api/projects/{id}

✅ Respuesta: 200 OK | 204 No Content
✅ Objeto eliminado
```

### Pruebas de Frontend

**Test Manual:**
1. ✅ Página carga sin errores
2. ✅ Lista de proyectos se muestra
3. ✅ Botón "Nuevo Proyecto" funciona
4. ✅ Formulario de creación valida correctamente
5. ✅ Proyecto se crea y aparece en lista
6. ✅ Edición funciona
7. ✅ Eliminación funciona con confirmación

**Errores de Consola:**
```
{Listar errores encontrados o "Ninguno"}
```

---

## 📊 MÉTRICAS DE CALIDAD

### Cobertura de Tests
- **Unit tests:** {N} tests, {X}% coverage
- **Integration tests:** {M} tests
- **E2E tests:** {P} tests

**Objetivo:** >80% coverage ✅ Alcanzado | ⚠️ Por debajo

### Complejidad de Código
- **Complejidad ciclomática promedio:** {valor}
- **Funciones complejas (>10):** {N}

**Objetivo:** <10 ✅ Alcanzado | ⚠️ Revisar

### Performance
- **Tiempo de respuesta API (promedio):** {ms}
- **Tiempo de carga página (FCP):** {ms}

**Objetivo:** API <200ms, FCP <2s ✅ Alcanzado | ⚠️ Optimizar

---

## 🔒 SEGURIDAD

### Validaciones
- [ ] Validación de inputs (class-validator en DTOs)
- [ ] Sanitización de datos
- [ ] Protection contra SQL Injection (TypeORM parametrizado)
- [ ] Protection contra XSS (React sanitiza por defecto)

### Autenticación/Autorización
- [ ] Endpoints protegidos con guards
- [ ] RLS policies aplicadas (si aplica)
- [ ] Roles validados

---

## ⚠️ PROBLEMAS ENCONTRADOS

### Errores Críticos
{Listar errores críticos encontrados durante validación}

**Ninguno** |

**Error 1:**
- **Descripción:** {descripción}
- **Severidad:** Alta | Media | Baja
- **Solución aplicada:** {descripción}
- **Estado:** ✅ Resuelto | ⏳ En progreso

### Warnings
{Listar warnings no críticos}

**Ninguno** |

**Warning 1:**
- **Descripción:** {descripción}
- **Impacto:** {descripción}
- **Acción:** {ignorar | corregir | mejorar después}

---

## 📝 DEUDA TÉCNICA IDENTIFICADA

### Items de Deuda Técnica
{Listar items que quedaron pendientes o requieren mejora}

**Ninguno** |

**Item 1:**
- **Descripción:** {qué falta o qué se puede mejorar}
- **Prioridad:** P1 | P2 | P3
- **Estimación:** {tiempo}
- **Cuándo abordar:** {este sprint | próximo sprint | backlog}

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Del Plan Original
{Copiar criterios de aceptación del 02-PLAN.md}

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

**Estado:** ✅ Todos cumplidos | ⚠️ Pendientes: {lista}

---

## 🎯 RESULTADO FINAL

### Resumen
{Párrafo resumiendo la validación completa}

### Métricas Finales
- **Tests:** {N} passed / {M} total ({X}% pass rate)
- **Coverage:** {Y}%
- **Errores críticos:** {N}
- **Warnings:** {M}
- **Deuda técnica:** {P} items ({Alta|Media|Baja})

### Estado de Tarea
- [ ] ✅ **VALIDACIÓN EXITOSA** - Tarea completada satisfactoriamente
- [ ] ⚠️ **VALIDACIÓN CON OBSERVACIONES** - Funciona pero requiere mejoras
- [ ] ❌ **VALIDACIÓN FALLIDA** - Requiere correcciones antes de completar

### Aprobación
- [ ] Código funciona correctamente
- [ ] Tests pasan
- [ ] Documentación completa
- [ ] Inventarios actualizados
- [ ] Sin errores críticos
- [ ] **APROBADO PARA DOCUMENTACIÓN FINAL**

---

## 🚀 PRÓXIMOS PASOS

**Acción inmediata:**
- Crear documento de documentación final (05-DOCUMENTACION.md)
- Actualizar inventarios
- Actualizar trazas

**Seguimiento:**
- {Lista de acciones de seguimiento si las hay}

---

**Validado por:** {nombre-agente}
**Fecha:** {YYYY-MM-DD HH:MM}
**Versión:** 1.0
**Estado:** {Aprobado | Aprobado con observaciones | Rechazado}
