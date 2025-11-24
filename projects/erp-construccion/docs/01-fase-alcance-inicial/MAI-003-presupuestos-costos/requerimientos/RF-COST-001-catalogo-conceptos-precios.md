# RF-COST-001: Catálogo de Conceptos y Precios Unitarios

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17
**Responsable:** Equipo de Producto

---

## 1. Descripción General

Sistema de catálogo maestro de conceptos de obra y precios unitarios que permite definir, organizar y mantener actualizados todos los insumos, materiales, mano de obra, maquinaria y conceptos compuestos necesarios para la elaboración de presupuestos de construcción.

Este catálogo funciona como la **base de conocimiento técnico-económico** de la constructora, permitiendo:
- Reutilización de conceptos entre proyectos
- Actualización centralizada de precios
- Análisis de precios unitarios con rendimientos
- Integración con sistema de compras e inventarios

---

## 2. Objetivos de Negocio

### 2.1 Estandarización
- Catálogo único por constructora (multi-tenant)
- Nomenclatura consistente (códigos normalizados)
- Rendimientos estandarizados por región/clima

### 2.2 Eficiencia
- Eliminar duplicación de conceptos
- Reducir 80% el tiempo de elaboración de presupuestos
- Actualización masiva de precios en minutos vs días

### 2.3 Control de Costos
- Trazabilidad de cambios en precios (historial)
- Precios regionalizados (por plaza)
- Comparación con índices INPC/CMIC

### 2.4 Integración
- Vinculación con catálogo de proveedores
- Sincronización con inventarios (últimos costos)
- Exportación a formatos estándar (OPUS, Neodata)

---

## 3. Alcance Funcional

### 3.1 Tipos de Conceptos

#### A. Insumos Básicos
**Materiales:**
- Código: `MAT-{categoría}-{consecutivo}` (ej: MAT-CEM-001)
- Unidad de medida: ton, m³, m², pza, kg, lt
- Precio base (sin IVA)
- Precio con IVA
- Moneda (MXN, USD)
- Proveedor preferido
- Rendimiento/desperdicio estándar
- Marca/especificación técnica

**Mano de Obra:**
- Código: `MO-{especialidad}-{nivel}` (ej: MO-ALB-OFI)
- Categoría: Oficial, Ayudante, Peón, Especialista
- Salario base diario
- Factor de salario real (FSR): 1.35-1.55
- Prestaciones incluidas (IMSS, Infonavit, etc.)
- Rendimiento por jornada (8h)

**Maquinaria y Equipo:**
- Código: `MAQ-{tipo}-{modelo}` (ej: MAQ-REV-350L)
- Tipo: Propia, Rentada
- Costo por hora (operación + depreciación)
- Combustible/energía
- Operador incluido (sí/no)
- Rendimiento (m³/h, m²/h)

**Herramienta Menor:**
- % del costo de mano de obra (típicamente 3-5%)
- Por especialidad

#### B. Conceptos Compuestos
**Definición:**
- Código único
- Nombre descriptivo
- Unidad de medida final
- Fórmula de integración (materiales + MO + maquinaria)
- Rendimiento por unidad
- Cuadrilla tipo

**Ejemplo: Cimentación de concreto armado**
```
Código: CC-CIM-001
Nombre: Cimentación corrida concreto f'c=200 kg/cm² armado
Unidad: m³

Integración:
┌─────────────────────────────────────────────────────────┐
│ MATERIALES                      Cantidad   Precio    $  │
├─────────────────────────────────────────────────────────┤
│ Concreto premezclado f'c=200    1.05 m³   $2,450  $2,572│
│ Acero de refuerzo fy=4200       80 kg     $18      $1,440│
│ Cimbra de madera                4 m²      $125     $500  │
│ Alambre recocido #18            1.5 kg    $24      $36   │
│                                           Subtotal: $4,548│
├─────────────────────────────────────────────────────────┤
│ MANO DE OBRA                    Jornal    FSR      $    │
├─────────────────────────────────────────────────────────┤
│ Oficial albañil                 0.25 jor  $450     $675  │
│ Ayudante general                0.50 jor  $300     $450  │
│                                           Subtotal: $1,125│
├─────────────────────────────────────────────────────────┤
│ MAQUINARIA Y EQUIPO             Horas     $/h      $    │
├─────────────────────────────────────────────────────────┤
│ Vibrador de concreto            2 h       $85      $170  │
│ Herramienta menor (5% MO)       -         -        $56   │
│                                           Subtotal: $226  │
├─────────────────────────────────────────────────────────┤
│ COSTO DIRECTO                                     $5,899 │
│ Indirectos (12%)                                  $708   │
│ Financiamiento (3%)                               $177   │
│ Utilidad (10%)                                    $590   │
│ Cargo adicional (2%)                              $118   │
├─────────────────────────────────────────────────────────┤
│ PRECIO UNITARIO                                   $7,492 │
│ IVA (16%)                                         $1,199 │
│ PRECIO TOTAL                                      $8,691 │
└─────────────────────────────────────────────────────────┘

Rendimiento: 4 m³/día con cuadrilla de 1 oficial + 2 ayudantes
```

### 3.2 Catálogo Jerárquico

#### Organización por Niveles
```
División (2 dígitos)
  └── Grupo (4 dígitos)
      └── Subgrupo (6 dígitos)
          └── Concepto (completo)

Ejemplo:
01 - PRELIMINARES
  └── 01.01 - Limpieza y trazo
      └── 01.01.01 - Limpieza del terreno
          └── 01.01.01.001 - Limpieza manual con herramienta menor
```

#### Catálogo Base Recomendado (basado en CMIC)
```
01 - PRELIMINARES
02 - CIMENTACIÓN
03 - ESTRUCTURA
04 - ALBAÑILERÍA
05 - INSTALACIONES HIDRÁULICAS
06 - INSTALACIONES SANITARIAS
07 - INSTALACIONES ELÉCTRICAS
08 - INSTALACIONES ESPECIALES
09 - ACABADOS
10 - HERRERÍA Y CANCELERÍA
11 - CARPINTERÍA
12 - VIDRIERÍA
13 - PINTURA
14 - IMPERMEABILIZACIÓN
15 - URBANIZACIÓN
16 - JARDINERÍA
```

### 3.3 Precios Unitarios - Componentes

#### Costo Directo
```
CD = Materiales + Mano de Obra + Maquinaria + Herramienta

donde:
- Materiales: Incluyen desperdicios (factor 1.03-1.10)
- Mano de Obra: Salario Real (base × FSR)
- Maquinaria: Horas × costo horario
- Herramienta: 3-5% de MO
```

#### Costos Indirectos
```
CI = CD × %Indirectos

Indirectos típicos:
- Administración central: 4-6%
- Administración de campo: 3-5%
- Fianzas y seguros: 1-2%
- Imprevistos: 1-2%
Total: 10-15%
```

#### Financiamiento
```
CF = (CD + CI) × %Financiamiento

Típicamente: 2-4%
Basado en:
- Tasa de interés
- Plazo de recuperación
- Anticipo
```

#### Utilidad
```
U = (CD + CI + CF) × %Utilidad

Rangos por segmento:
- Interés social: 8-12%
- Medio: 12-18%
- Residencial: 15-25%
```

#### Cargos Adicionales
```
CA = Suma anterior × %Cargos

Incluye:
- Impuestos locales
- Gastos notariales
- Otros
Típicamente: 1-3%
```

#### Precio Unitario Final
```
PU = CD + CI + CF + U + CA
PU_IVA = PU × 1.16
```

### 3.4 Gestión de Versiones y Histórico

**Versionado de Conceptos:**
- Cada concepto tiene `version` (1, 2, 3...)
- Cambios significativos generan nueva versión
- Versión anterior queda "deprecated"
- Presupuestos mantienen snapshot de versión usada

**Historial de Precios:**
```sql
Concepto: Cemento CPC 30R gris 50kg
┌────────────┬────────┬────────────┬─────────────────┐
│ Vigencia   │ Precio │ Variación  │ Observaciones   │
├────────────┼────────┼────────────┼─────────────────┤
│ 2025-01-01 │ $215   │ -          │ Precio inicial  │
│ 2025-03-15 │ $228   │ +6.0%      │ Ajuste INPC     │
│ 2025-06-01 │ $235   │ +3.1%      │ Incremento CMIC │
│ 2025-09-10 │ $242   │ +3.0%      │ Actual          │
└────────────┴────────┴────────────┴─────────────────┘
```

**Triggers:**
- Al actualizar precio: crear registro en historial
- Calcular % variación automática
- Notificar si variación > 10%
- Sugerir revisión de presupuestos activos

### 3.5 Regionalización de Precios

**Concepto:**
Mismo concepto, precios diferentes por plaza/región.

**Estructura:**
```
Concepto: Concreto f'c=200 kg/cm²
├── Región Centro (CDMX, Edo. Méx.)    → $2,450/m³
├── Región Norte (Monterrey, Saltillo) → $2,380/m³
├── Región Bajío (Querétaro, León)     → $2,420/m³
└── Región Sureste (Mérida, Cancún)    → $2,550/m³
```

**Beneficio:**
- Presupuestos más precisos por ubicación
- Comparación de costos entre regiones
- Optimización de compras centralizadas

### 3.6 Integración con Proveedores

**Vinculación:**
- Material → Proveedor preferido
- Últimos 3 precios de compra
- Plazo de entrega
- Mínimo de compra

**Actualización Automática:**
```
Trigger al crear OC:
- Si precio OC > precio catálogo + 5%
  → Sugerir actualización de catálogo
  → Requerir aprobación gerencia
```

---

## 4. Requerimientos No Funcionales

### 4.1 Performance
- Búsqueda de conceptos: <200ms (índices full-text)
- Carga de catálogo completo (5,000 conceptos): <2 seg
- Cálculo de precio unitario compuesto: <100ms
- Actualización masiva de precios (500 conceptos): <5 seg

### 4.2 Escalabilidad
- Catálogo: hasta 10,000 conceptos por constructora
- Historial de precios: 10 años de retención
- Versionado: hasta 20 versiones por concepto

### 4.3 Usabilidad
- Importación desde Excel/CSV (plantilla estándar)
- Exportación a OPUS, Neodata, Precio3
- Búsqueda por código, nombre, categoría
- Autocompletado inteligente

### 4.4 Seguridad
- Permisos por rol:
  - Admin: CRUD completo
  - Director/Ingeniero: Crear/Editar (aprobación requerida)
  - Residente: Solo lectura
- Auditoría de cambios (quién, cuándo, qué cambió)
- Aprobación obligatoria para cambios en conceptos usados en presupuestos activos

---

## 5. Casos de Uso Principales

### CU-001: Crear Concepto Simple (Material)
**Actor:** Ingeniero de Costos
**Flujo:**
1. Accede a "Catálogo de Conceptos"
2. Clic "Nuevo Material"
3. Completa formulario:
   - Código: MAT-CEM-001
   - Nombre: Cemento CPC 30R gris 50kg
   - Categoría: Cementantes
   - Unidad: ton
   - Precio base: $4,300
   - Proveedor: Cemex
   - Rendimiento: 1.03 (3% desperdicio)
4. Guarda
5. Sistema valida código único
6. Concepto disponible para presupuestos

### CU-002: Crear Concepto Compuesto
**Actor:** Ingeniero de Costos
**Flujo:**
1. Clic "Nuevo Concepto Compuesto"
2. Información básica:
   - Código: CC-CIM-001
   - Nombre: Cimentación corrida
   - Unidad: m³
3. Agrega insumos:
   - Busca "Concreto f'c=200" → Cantidad: 1.05 m³
   - Busca "Acero fy=4200" → Cantidad: 80 kg
   - Busca "Cimbra" → Cantidad: 4 m²
4. Agrega mano de obra:
   - Oficial albañil: 0.25 jornales
   - Ayudante: 0.50 jornales
5. Agrega maquinaria:
   - Vibrador: 2 horas
6. Define factores:
   - Indirectos: 12%
   - Financiamiento: 3%
   - Utilidad: 10%
   - Cargos: 2%
7. Sistema calcula PU automáticamente
8. Guarda concepto
9. Disponible para presupuestos

### CU-003: Actualizar Precios Masivamente
**Actor:** Gerente Administrativo
**Flujo:**
1. Accede a "Actualización Masiva"
2. Selecciona categoría: "Cementantes"
3. Define:
   - Tipo de ajuste: Porcentual
   - Factor: +4.5%
   - Vigencia: 2025-12-01
   - Motivo: "Ajuste INPC Nov 2025"
4. Sistema muestra preview:
   - 12 conceptos afectados
   - Comparativo precio actual vs nuevo
5. Confirma actualización
6. Sistema:
   - Crea registros en historial
   - Actualiza precios con vigencia futura
   - Notifica a equipo de ingeniería
   - Genera reporte de cambios

### CU-004: Importar Catálogo desde Excel
**Actor:** Administrador
**Flujo:**
1. Descarga plantilla estándar
2. Completa en Excel (500 conceptos)
3. Carga archivo
4. Sistema valida:
   - Códigos únicos
   - Unidades válidas
   - Precios numéricos positivos
   - Referencias a insumos existen
5. Muestra errores (si hay)
6. Usuario corrige y recarga
7. Importación exitosa
8. 500 conceptos disponibles

### CU-005: Consultar Historial de Precios
**Actor:** Director de Proyectos
**Flujo:**
1. Busca concepto: "Cemento CPC 30R"
2. Clic "Ver Historial"
3. Ve tabla con 24 meses:
   - Precios mensuales
   - Variación porcentual
   - Gráfica de tendencia
4. Exporta a Excel para análisis
5. Compara con índices INPC/CMIC

---

## 6. Modelo de Datos Simplificado

```typescript
// Tabla: concept_catalog
{
  id: UUID,
  constructoraId: UUID,
  code: VARCHAR(20) UNIQUE,
  name: VARCHAR(255),
  type: ENUM('material', 'labor', 'equipment', 'composite'),
  category: VARCHAR(100), // División CMIC
  subcategory: VARCHAR(100), // Grupo CMIC
  unit: VARCHAR(20), // m³, m², kg, pza, etc.

  // Precio simple (materiales, MO, maquinaria)
  basePrice: DECIMAL(12,2),
  includesVAT: BOOLEAN,
  currency: ENUM('MXN', 'USD'),

  // Factores
  wasteFacto: DECIMAL(5,3) DEFAULT 1.00, // 1.03 = 3% desperdicio

  // Integración (conceptos compuestos)
  components: JSONB, // [{conceptId, quantity, unit}, ...]
  laborCrew: JSONB, // Cuadrilla tipo

  // Factores de costo
  indirectPercentage: DECIMAL(5,2) DEFAULT 12.00,
  financingPercentage: DECIMAL(5,2) DEFAULT 3.00,
  profitPercentage: DECIMAL(5,2) DEFAULT 10.00,
  additionalCharges: DECIMAL(5,2) DEFAULT 2.00,

  // Calculados
  directCost: DECIMAL(12,2),
  unitPrice: DECIMAL(12,2), // Sin IVA
  unitPriceWithVAT: DECIMAL(12,2),

  // Versión y estado
  version: INTEGER DEFAULT 1,
  status: ENUM('active', 'deprecated'),

  // Regionalización
  regionId: UUID NULLABLE,

  // Proveedor
  preferredSupplierId: UUID NULLABLE,

  // Técnico
  technicalSpecs: TEXT,
  performance: VARCHAR(255), // "4 m³/día"

  // Auditoría
  createdBy: UUID,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}

// Tabla: concept_price_history
{
  id: UUID,
  conceptId: UUID,
  price: DECIMAL(12,2),
  validFrom: DATE,
  validUntil: DATE NULLABLE,
  variationPercentage: DECIMAL(6,2),
  reason: VARCHAR(255),
  createdBy: UUID,
  createdAt: TIMESTAMP
}

// Tabla: regions
{
  id: UUID,
  constructoraId: UUID,
  code: VARCHAR(10),
  name: VARCHAR(100), // "Región Centro"
  description: TEXT,
  isActive: BOOLEAN
}
```

---

## 7. Interfaces de Usuario (Mockups)

### Vista: Catálogo de Conceptos
```
┌──────────────────────────────────────────────────────────────┐
│ Catálogo de Conceptos                          [+ Nuevo] [⚙]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 🔍 Buscar: [____________________________] [🔎]              │
│                                                              │
│ Filtros:                                                     │
│ Tipo: [Todos ▼] Categoría: [Todos ▼] Estado: [Activos ▼]   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Código      │ Nombre               │ Tipo      │ PU     │ # │
├─────────────┼──────────────────────┼───────────┼────────┼───┤
│ MAT-CEM-001 │ Cemento CPC 30R      │ Material  │ $215   │ ⋮ │
│ MAT-VAR-015 │ Varilla 3/8" fy=4200 │ Material  │ $18/kg │ ⋮ │
│ MO-ALB-OFI  │ Oficial albañil      │ MO        │ $675   │ ⋮ │
│ MAQ-REV-350 │ Revolvedora 350L     │ Maquinaria│ $120/h │ ⋮ │
│ CC-CIM-001  │ Cimentación corrida  │ Compuesto │ $7,492 │ ⋮ │
│ CC-MUR-001  │ Muro block 15cm      │ Compuesto │ $385   │ ⋮ │
│             │                      │           │        │   │
├──────────────────────────────────────────────────────────────┤
│ Mostrando 6 de 1,247 conceptos            [< 1 2 3 ... 125 >]│
└──────────────────────────────────────────────────────────────┘
```

### Modal: Crear Concepto Compuesto
```
┌────────────────────────────────────────────────────────────────┐
│ Nuevo Concepto Compuesto                            [X]        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ■ Información Básica                                          │
│   Código: [CC-____-___] (auto)  Categoría: [Cimentación ▼]   │
│   Nombre: [___________________________________]                │
│   Unidad: [m³ ▼]                                              │
│                                                                │
│ ■ Integración de Insumos                      [+ Agregar]     │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ Insumo              │ Cantidad │ Unidad │ PU    │ $  │   │
│   ├─────────────────────┼──────────┼────────┼───────┼────┤   │
│   │ Concreto f'c=200    │ 1.05     │ m³     │ $2,450│... │   │
│   │ Acero fy=4200       │ 80       │ kg     │ $18   │... │   │
│   │ Cimbra madera       │ 4        │ m²     │ $125  │... │   │
│   └──────────────────────────────────────────────────────┘   │
│                                          Materiales: $4,548   │
│                                                                │
│ ■ Mano de Obra                                 [+ Agregar]     │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ Categoría           │ Jornales │ $/jor │ FSR   │ $  │   │
│   ├─────────────────────┼──────────┼───────┼───────┼────┤   │
│   │ Oficial albañil     │ 0.25     │ $450  │ 1.50  │... │   │
│   │ Ayudante general    │ 0.50     │ $300  │ 1.50  │... │   │
│   └──────────────────────────────────────────────────────┘   │
│                                          Mano de Obra: $1,125 │
│                                                                │
│ ■ Factores de Costo                                           │
│   Indirectos: [12] %  Financiamiento: [3] %                   │
│   Utilidad: [10] %    Cargos: [2] %                           │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Costo Directo:                                   $5,899  │ │
│ │ + Indirectos (12%):                              $708    │ │
│ │ + Financiamiento (3%):                           $177    │ │
│ │ + Utilidad (10%):                                $590    │ │
│ │ + Cargos (2%):                                   $118    │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ = Precio Unitario:                               $7,492  │ │
│ │ + IVA (16%):                                     $1,199  │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ TOTAL:                                           $8,691  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                                │
│                                      [Cancelar]  [Crear Concepto]│
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Dependencias con Otros Módulos

### Entrada (consume de):
- **MAI-004 Compras**: Últimos precios de compra
- **MAI-001 Catálogo de Proveedores**: Proveedores preferidos
- **MAI-008 Configuración**: Regiones, índices INPC/CMIC

### Salida (provee a):
- **MAI-003 Presupuestos**: Conceptos y PU para elaborar presupuestos
- **MAI-005 Control de Obra**: Precios para calcular costo real
- **MAI-006 Reportes**: Análisis de variación de precios

---

## 9. Criterios de Aceptación

- [ ] Catálogo con 4 tipos de conceptos (material, MO, maquinaria, compuesto)
- [ ] Organización jerárquica (división → grupo → subgrupo)
- [ ] Cálculo automático de PU con 5 factores (indirectos, financiamiento, utilidad, cargos, IVA)
- [ ] Versionado de conceptos con historial
- [ ] Historial de precios con vigencias y variaciones
- [ ] Regionalización (múltiples precios por plaza)
- [ ] Importación desde Excel/CSV
- [ ] Exportación a OPUS/Neodata
- [ ] Búsqueda full-text (<200ms)
- [ ] Actualización masiva de precios
- [ ] Vinculación con proveedores
- [ ] Auditoría completa de cambios
- [ ] Permisos por rol

---

## 10. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Catálogo muy grande (>10K conceptos) afecta performance | Media | Alto | Paginación, índices, búsqueda incremental |
| Actualización de precio rompe presupuestos activos | Alta | Crítico | Snapshot de precios en presupuestos, aprobación obligatoria |
| Importación de Excel con datos incorrectos | Alta | Medio | Validación estricta, preview antes de confirmar |
| Duplicación de conceptos | Media | Medio | Búsqueda inteligente, sugerencias al crear |

---

## 11. Métricas de Éxito

- **Adopción**: 90% de presupuestos usan catálogo estándar
- **Eficiencia**: Reducción 80% tiempo de elaboración de presupuestos
- **Calidad**: <5% de conceptos duplicados
- **Actualización**: Precios actualizados mensualmente
- **Integración**: 100% de materiales vinculados a proveedores

---

**Estado:** ✅ Ready for Development
