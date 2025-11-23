# US-ADM-002: Cambiar de Constructora (Multi-tenancy)

**ID:** US-ADM-002  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-001, ET-ADM-001  
**Prioridad:** Alta  
**Story Points:** 5

---

## 📖 Historia de Usuario

**Como** usuario que pertenece a múltiples constructoras  
**Quiero** poder cambiar entre ellas fácilmente desde la interfaz  
**Para** gestionar mis tareas en diferentes empresas sin tener que cerrar sesión y volver a iniciar

---

## ✅ Criterios de Aceptación

### 1. Selector de Constructora Visible

```gherkin
Given que estoy autenticado y pertenezco a 2 o más constructoras
When accedo a cualquier página del sistema
Then debo ver en el header un selector con:
  - Logo de la constructora actual
  - Nombre de la constructora actual
  - Indicador visual de que puedo cambiar (dropdown icon)
```

### 2. Cambio de Constructora

```gherkin
Given que tengo acceso a 3 constructoras: "Constructora A", "Constructora B", "Constructora C"
And estoy actualmente en "Constructora A"
When hago clic en el selector de constructora
Then debo ver un dropdown con:
  - ✓ Constructora A (actual, con checkmark)
  - Constructora B
  - Constructora C
  - Mi rol en cada una (debajo del nombre)
When selecciono "Constructora B"
Then el sistema debe:
  - Cambiar el contexto global a "Constructora B"
  - Recargar los datos según el nuevo contexto
  - Actualizar el selector mostrando "Constructora B" como actual
  - Mantener la misma página si tengo acceso con ese rol
  - Redirigir al dashboard si no tengo acceso a la página actual
  - Registrar el cambio en audit log
```

### 3. Persistencia de Selección

```gherkin
Given que cambié a "Constructora B"
When cierro el navegador
And vuelvo a abrir la aplicación
Then el sistema debe recordar mi última selección
And abrir directamente en "Constructora B"
```

### 4. Diferentes Roles por Constructora

```gherkin
Given que tengo estos accesos:
  - Constructora A: rol "director"
  - Constructora B: rol "engineer"
  - Constructora C: rol "resident"
When estoy en Constructora A
Then debo ver menús y acciones de "director" (todos los permisos)
When cambio a Constructora B
Then debo ver menús y acciones de "engineer" (limitados)
And no debo ver opciones administrativas
```

### 5. Usuario con Una Sola Constructora

```gherkin
Given que solo pertenezco a 1 constructora
When accedo al sistema
Then NO debo ver el selector de constructora
And el sistema debe cargar automáticamente esa constructora
```

### 6. Datos Aislados por Constructora

```gherkin
Given que estoy en "Constructora A"
When veo la lista de proyectos
Then solo debo ver proyectos de "Constructora A"
When cambio a "Constructora B"
Then solo debo ver proyectos de "Constructora B"
And no debo poder acceder a datos de otras constructoras
```

---

## 🎨 Mockup / Wireframe

### Header con Selector de Constructora

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡]  🏢 Constructora A [▼]    Proyectos  Presupuestos  Obra    │
│                                                      👤 Juan P. │
└─────────────────────────────────────────────────────────────────┘
```

### Dropdown Expandido

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡]  🏢 Constructora A [▲]    Proyectos  Presupuestos  Obra    │
│      ┌────────────────────────────────────┐                     │
│      │ ✓ 🏢 Constructora A                │                     │
│      │      Director General              │                     │
│      ├────────────────────────────────────┤                     │
│      │   🏢 Constructora B                │                     │
│      │      Ingeniero                     │                     │
│      ├────────────────────────────────────┤                     │
│      │   🏢 Constructora C                │                     │
│      │      Residente de Obra             │                     │
│      └────────────────────────────────────┘                     │
│                                                      👤 Juan P. │
└─────────────────────────────────────────────────────────────────┘
```

### Transición al Cambiar

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     [⏳ Loading spinner]                        │
│                                                                 │
│              Cambiando a Constructora B...                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Header Después del Cambio

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡]  🏢 Constructora B [▼]    Proyectos  Presupuestos          │
│                              [Obra NO visible - sin permiso]    │
│                                                      👤 Juan P. │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Cambio Exitoso Entre Constructoras

**Precondiciones:**
- Usuario pertenece a "Constructora A" (director) y "Constructora B" (engineer)
- Actualmente en "Constructora A"

**Pasos:**
1. Clic en selector de constructora en header
2. Seleccionar "Constructora B" del dropdown

**Resultado Esperado:**
- ✅ Loader muestra "Cambiando a Constructora B..."
- ✅ URL actualiza parámetro: `?constructora=uuid-b`
- ✅ Header muestra "Constructora B"
- ✅ Datos recargan para contexto B
- ✅ Menús reflejan permisos de "engineer"
- ✅ Audit log registra: "switched_constructora"

### CP-002: Persistencia de Selección

**Precondiciones:**
- Usuario cambió a "Constructora B"

**Pasos:**
1. Cerrar navegador completamente
2. Abrir nueva ventana
3. Navegar a la aplicación

**Resultado Esperado:**
- ✅ Abre directamente en "Constructora B"
- ✅ No muestra selector de "Constructora A"

### CP-003: Redirección por Falta de Permisos

**Precondiciones:**
- Usuario en página "/admin/usuarios" (requiere rol director)
- En "Constructora A" con rol "director"

**Pasos:**
1. Cambiar a "Constructora B" donde tiene rol "engineer"

**Resultado Esperado:**
- ✅ Redirecciona automáticamente a "/dashboard"
- ✅ Muestra toast: "No tienes acceso a esta sección con tu rol actual"

### CP-004: Aislamiento de Datos

**Precondiciones:**
- Constructora A tiene 5 proyectos
- Constructora B tiene 3 proyectos

**Pasos:**
1. En Constructora A, navegar a "/proyectos"
2. Verificar que se muestran 5 proyectos
3. Cambiar a Constructora B
4. Verificar proyectos mostrados

**Resultado Esperado:**
- ✅ En Constructora A: muestra 5 proyectos
- ✅ En Constructora B: muestra 3 proyectos
- ✅ Ningún proyecto se filtra entre constructoras

### CP-005: Usuario con Una Sola Constructora

**Precondiciones:**
- Usuario solo pertenece a "Constructora A"

**Pasos:**
1. Iniciar sesión

**Resultado Esperado:**
- ✅ No muestra selector de constructora en header
- ✅ Carga automáticamente "Constructora A"
- ✅ No hay dropdown visible

### CP-006: API Token Incluye Constructora

**Precondiciones:**
- Usuario autenticado en "Constructora B"

**Pasos:**
1. Hacer request a `/api/proyectos`
2. Inspeccionar headers de la petición

**Resultado Esperado:**
- ✅ Header incluye: `X-Constructora-Id: uuid-b`
- ✅ JWT token incluye claim: `constructoraId: uuid-b`
- ✅ Backend aplica RLS automáticamente

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-001: Tabla `user_constructoras` implementada
- ET-ADM-001: Row Level Security configurado
- Context API o Zustand para estado global

**APIs Necesarias:**
- `GET /api/users/me/constructoras` - Lista de constructoras del usuario
- `POST /api/users/me/switch-constructora` - Cambiar contexto
- Todos los endpoints deben respetar `X-Constructora-Id` header

**Componentes Frontend:**
- ConstructoraSelector (dropdown component)
- useConstructora (custom hook)
- ConstructoraContext (React Context)

---

## 📊 Métricas de Éxito

- **Tiempo de cambio:** <500ms para cambiar de constructora
- **Persistencia:** 100% de casos recuerdan última selección
- **Aislamiento de datos:** 0 casos de filtración entre constructoras
- **Redirecciones correctas:** 100% redirige cuando pierde permisos

---

## 🔒 Consideraciones de Seguridad

1. **Validación Backend:** Siempre validar que el usuario tiene acceso a la constructora solicitada
2. **RLS Automático:** PostgreSQL Row Level Security filtra automáticamente por `constructora_id`
3. **JWT Claims:** Token debe incluir `constructoraId` actual
4. **No Confiar en Frontend:** Validar permisos en cada request, no solo en UI

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
