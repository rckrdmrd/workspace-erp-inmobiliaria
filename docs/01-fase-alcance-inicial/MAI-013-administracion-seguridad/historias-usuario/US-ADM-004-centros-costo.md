# US-ADM-004: Gestionar Centros de Costo Jerárquicos

**ID:** US-ADM-004  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-003, ET-ADM-002  
**Prioridad:** Alta  
**Story Points:** 8

---

## 📖 Historia de Usuario

**Como** Director General o Finanzas  
**Quiero** crear y organizar centros de costo en estructura jerárquica ilimitada  
**Para** rastrear costos a nivel granular y obtener reportes consolidados por nivel

---

## ✅ Criterios de Aceptación

### 1. Visualizar Árbol de Centros de Costo

```gherkin
Given que soy Director o Finanzas
When accedo a "Administración > Centros de Costo"
Then debo ver un árbol expandible con:
  - Todos los centros de costo organizados jerárquicamente
  - Iconos según tipo (Directo, Indirecto, Servicio Compartido)
  - Código y nombre de cada centro
  - Costos acumulados del mes actual
  - Estados: Activo / Inactivo
  - Acciones: Crear hijo, Editar, Desactivar
```

### 2. Crear Centro de Costo Raíz

```gherkin
Given que no existen centros de costo o quiero crear uno nuevo en raíz
When hago clic en "+ Nuevo Centro de Costo"
And completo el formulario:
  - Código: "100" (único)
  - Nombre: "Operaciones"
  - Tipo: "Indirecto"
  - Descripción: (opcional)
And hago clic en "Guardar"
Then el sistema debe:
  - Crear el centro con level = 0
  - path = "100"
  - parentId = null
  - Mostrar en árbol como raíz
  - Registrar en audit log
```

### 3. Crear Centro de Costo Hijo

```gherkin
Given que existe un centro "100 - Operaciones"
When hago clic derecho en "100" y selecciono "Crear Centro Hijo"
And completo el formulario:
  - Código: "101"
  - Nombre: "Proyecto Residencial"
  - Tipo: "Directo"
And guardo
Then el sistema debe:
  - Crear centro con parentId = "100"
  - path = "100/101"
  - level = 1
  - Mostrarlo indentado bajo "100" en el árbol
  - Permitir expandir/colapsar
```

### 4. Jerarquía Ilimitada

```gherkin
Given esta estructura:
  100 Operaciones (raíz, level 0)
    └─ 101 Proyecto Res (level 1)
        └─ 101.1 Torre A (level 2)
            └─ 101.1.1 Pisos 1-5 (level 3)
                └─ 101.1.1.1 Acabados (level 4)

When consulto el árbol
Then debo poder navegar todos los niveles sin límite
And cada nivel debe mostrar su path completo
```

### 5. Tipos de Centro de Costo

```gherkin
Given que estoy creando un centro de costo
When selecciono el tipo:
  - "Directo": Costos imputables directamente a proyectos
  - "Indirecto": Gastos generales (admin, marketing)
  - "Servicio Compartido": Servicios internos (IT, RH)
Then el sistema debe:
  - Aplicar reglas de imputación según el tipo
  - Mostrar ícono diferenciado en el árbol
  - Permitir configurar método de asignación (solo Indirecto y Compartido)
```

### 6. Imputación de Costos

```gherkin
Given que tengo esta estructura:
  100 Operaciones
    └─ 101 Proyecto A
        └─ 101.1 Materiales

When imputo un costo de $10,000 a "101.1 Materiales"
Then el sistema debe:
  - Crear registro en cost_imputations
  - Incrementar costo acumulado de:
    - 101.1 Materiales: +$10,000
    - 101 Proyecto A: +$10,000 (consolidado)
    - 100 Operaciones: +$10,000 (consolidado)
  - Actualizar en tiempo real el árbol
```

### 7. Distribución de Overhead

```gherkin
Given que tengo:
  - Centro "200 - Administración" (Indirecto) con $50,000 en gastos
  - 3 proyectos directos activos
When ejecuto "Distribuir Overhead" para el periodo "Nov 2025"
And selecciono método: "Proporcional por Ingresos"
Then el sistema debe:
  - Calcular proporción de cada proyecto
  - Crear imputaciones de overhead en cada proyecto
  - Mostrar desglose en reporte
  - Registrar en audit log
```

### 8. Reporte Consolidado

```gherkin
Given que tengo múltiples niveles de centros de costo
When genero "Reporte Consolidado" para "Q4 2025"
Then debo ver:
  - Árbol completo con costos por nivel
  - Costos propios vs. consolidados (incluye hijos)
  - Gráfico de distribución por tipo
  - Opciones de exportar: PDF, Excel, CSV
```

### 9. Buscar en Árbol

```gherkin
Given que tengo 50+ centros de costo
When escribo "Torre" en el buscador
Then el sistema debe:
  - Filtrar árbol mostrando solo coincidencias
  - Expandir automáticamente la ruta de cada coincidencia
  - Resaltar el texto coincidente
```

### 10. Desactivar Centro de Costo

```gherkin
Given que un centro ya no se usa
When hago clic en "Desactivar"
Then el sistema debe:
  - Marcar isActive = false
  - Mantener histórico de costos
  - Ocultarlo del árbol (con opción "Mostrar Inactivos")
  - NO permitir nuevas imputaciones
  - NO permitir desactivar si tiene hijos activos
```

---

## 🎨 Mockup / Wireframe

### Árbol de Centros de Costo

```
┌─────────────────────────────────────────────────────────────────┐
│ Centros de Costo                  [+ Nuevo]  [📊 Reportes]  [⚙️]│
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Buscar...                              ☐ Mostrar inactivos   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ▼ 📦 100 - Operaciones                         $250,000.00     │
│   │                                            [+][✏️][❌]       │
│   │                                                             │
│   ├─▼ 🎯 101 - Proyecto Residencial A          $180,000.00     │
│   │   │                                        [+][✏️][❌]       │
│   │   │                                                         │
│   │   ├─▶ 🏗️ 101.1 - Torre A                   $120,000.00     │
│   │   │                                        [+][✏️][❌]       │
│   │   │                                                         │
│   │   ├─▶ 🏗️ 101.2 - Torre B                    $60,000.00     │
│   │   │                                        [+][✏️][❌]       │
│   │   │                                                         │
│   │   └─▶ 📋 101.3 - Administración Obra        $0.00          │
│   │                                            [+][✏️][❌]       │
│   │                                                             │
│   ├─▶ 🎯 102 - Proyecto Comercial B             $70,000.00     │
│   │                                            [+][✏️][❌]       │
│   │                                                             │
│   └─▶ 💼 103 - Servicios Compartidos            $0.00          │
│                                                [+][✏️][❌]       │
│                                                                 │
│ ▼ 📦 200 - Administración                       $50,000.00     │
│   │                                            [+][✏️][❌]       │
│   │                                                             │
│   ├─▶ 💼 201 - Dirección General                $20,000.00     │
│   ├─▶ 💼 202 - Finanzas                         $15,000.00     │
│   └─▶ 💼 203 - RH                               $15,000.00     │
│                                                                 │
│ ▶ 📦 300 - Marketing                            $30,000.00     │
│                                                [+][✏️][❌]       │
└─────────────────────────────────────────────────────────────────┘

Leyenda:
🎯 Directo    💼 Indirecto    🏗️ Servicio Compartido
▶ Colapsado   ▼ Expandido
```

### Modal Crear Centro de Costo

```
┌─────────────────────────────────────────────┐
│ Nuevo Centro de Costo                    [X]│
├─────────────────────────────────────────────┤
│                                             │
│ Centro Padre (opcional)                     │
│ [v] 101 - Proyecto Residencial A            │
│                                             │
│ Código *                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ 101.1                                   │ │
│ └─────────────────────────────────────────┘ │
│ ℹ️ Path completo: 100/101/101.1            │
│                                             │
│ Nombre *                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ Torre A                                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Tipo *                                      │
│ ◉ Directo                                   │
│ ○ Indirecto                                 │
│ ○ Servicio Compartido                       │
│                                             │
│ Descripción                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ Primera torre del proyecto, pisos 1-15  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Responsable                                 │
│ [v] Juan Pérez (Ingeniero)                  │
│                                             │
│        [Cancelar]  [Crear Centro]           │
└─────────────────────────────────────────────┘
```

### Modal Distribuir Overhead

```
┌─────────────────────────────────────────────┐
│ Distribuir Overhead                       [X]│
├─────────────────────────────────────────────┤
│                                             │
│ Centro de Costo Indirecto                   │
│ [v] 200 - Administración                    │
│     Costo acumulado: $50,000.00             │
│                                             │
│ Periodo                                     │
│ [Noviembre 2025]  📅                        │
│                                             │
│ Método de Distribución *                    │
│ ◉ Proporcional por Ingresos                 │
│ ○ Proporcional por Costos Directos          │
│ ○ Partes Iguales                            │
│ ○ Porcentaje Manual                         │
│                                             │
│ Centros de Costo Receptores:                │
│ ┌─────────────────────────────────────────┐ │
│ │ ☑️ 101 - Proyecto Res A    (60%)  $30K  │ │
│ │ ☑️ 102 - Proyecto Com B    (40%)  $20K  │ │
│ │ ☐ 103 - Servicios (inactivo)            │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│        [Cancelar]  [Distribuir]             │
└─────────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### CP-001: Crear Centro Raíz

**Precondiciones:**
- Usuario con rol "director" o "finance"

**Pasos:**
1. Ir a "Centros de Costo"
2. Clic "+ Nuevo"
3. Dejar "Centro Padre" vacío
4. Código: "100", Nombre: "Operaciones", Tipo: "Indirecto"
5. Guardar

**Resultado Esperado:**
- ✅ Centro creado con level=0, path="100", parentId=null
- ✅ Aparece en árbol como raíz
- ✅ Audit log: "cost_center_created"

### CP-002: Crear Jerarquía de 5 Niveles

**Pasos:**
1. Crear 100 (raíz)
2. Crear 101 hijo de 100
3. Crear 101.1 hijo de 101
4. Crear 101.1.1 hijo de 101.1
5. Crear 101.1.1.1 hijo de 101.1.1

**Resultado Esperado:**
- ✅ Todos los centros creados correctamente
- ✅ Paths: "100", "100/101", "100/101/101.1", etc.
- ✅ Levels: 0, 1, 2, 3, 4
- ✅ Árbol muestra correctamente la indentación

### CP-003: Imputar Costo y Consolidación

**Precondiciones:**
- Estructura: 100 > 101 > 101.1

**Pasos:**
1. Imputar $10,000 a "101.1"
2. Verificar montos

**Resultado Esperado:**
- ✅ 101.1: $10,000 (propio)
- ✅ 101: $10,000 (consolidado de hijos)
- ✅ 100: $10,000 (consolidado de hijos)
- ✅ Query recursiva funciona correctamente

### CP-004: Distribuir Overhead

**Precondiciones:**
- Centro "200 Administración" (Indirecto) con $50,000
- 2 proyectos directos: A ($100K ingresos), B ($50K ingresos)

**Pasos:**
1. Seleccionar "200 - Administración"
2. Método: "Proporcional por Ingresos"
3. Distribuir

**Resultado Esperado:**
- ✅ Proyecto A recibe: $33,333 (66.6%)
- ✅ Proyecto B recibe: $16,667 (33.3%)
- ✅ Imputaciones creadas con source_type="overhead"
- ✅ Audit log registra distribución

### CP-005: Buscar en Árbol

**Precondiciones:**
- 50 centros de costo

**Pasos:**
1. Escribir "Torre" en buscador

**Resultado Esperado:**
- ✅ Solo muestra centros con "Torre" en nombre/código
- ✅ Expande automáticamente la ruta completa
- ✅ Resalta texto coincidente

### CP-006: No Desactivar con Hijos Activos

**Precondiciones:**
- Centro "100" tiene hijo "101" activo

**Pasos:**
1. Intentar desactivar "100"

**Resultado Esperado:**
- ✅ Error: "No se puede desactivar. Tiene centros hijo activos."
- ✅ Sugerencia: "Desactiva primero: 101"
- ✅ Centro permanece activo

---

## 🔗 Dependencias

**Requisitos Previos:**
- ET-ADM-002: Tabla `cost_centers` con triggers de path
- ET-ADM-002: Función SQL `get_consolidated_costs()`
- Backend: Servicio de distribución de overhead

**APIs Necesarias:**
- `GET /api/cost-centers/tree` - Árbol completo
- `POST /api/cost-centers` - Crear
- `PUT /api/cost-centers/:id` - Actualizar
- `DELETE /api/cost-centers/:id` - Desactivar
- `POST /api/cost-centers/:id/impute` - Imputar costo
- `POST /api/cost-centers/:id/distribute-overhead` - Distribuir
- `GET /api/cost-centers/:id/report` - Reporte consolidado

**Componentes Frontend:**
- CostCenterTree (árbol recursivo)
- CostCenterForm (crear/editar)
- OverheadDistributionModal
- CostCenterReports

---

## 📊 Métricas de Éxito

- **Profundidad máxima soportada:** ≥10 niveles sin degradación
- **Tiempo de carga árbol:** <1s para 1000 centros
- **Precisión consolidación:** 100% (sin discrepancias)
- **Tiempo distribución overhead:** <5s para 100 proyectos

---

**Generado:** 2025-11-20  
**Estado:** ✅ Listo para desarrollo
