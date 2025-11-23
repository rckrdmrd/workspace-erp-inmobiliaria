# RF-PROJ-003: Prototipos de Vivienda

**Epic:** MAI-002 - Proyectos y Estructura de Obra
**Tipo:** Requerimiento Funcional
**Prioridad:** Alta (P1)
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📋 Descripción

El sistema debe permitir la creación y gestión de prototipos de vivienda estandarizados (casas, departamentos, dúplex) que sirvan como plantillas para la asignación a lotes. Los prototipos definen características arquitectónicas, áreas, distribución, acabados estándar y costos estimados.

---

## 🎯 Objetivos

1. **Estandarización:** Definir tipos de vivienda reutilizables en múltiples proyectos
2. **Estimación rápida:** Calcular costos y materiales basados en prototipos
3. **Catálogo comercial:** Ofrecer opciones a clientes (INFONAVIT, compradores privados)
4. **Trazabilidad:** Vincular cada vivienda construida a un prototipo base
5. **Escalabilidad:** Gestionar bibliotecas de prototipos por constructora

---

## 📐 Tipos de Prototipos

### 1. Casa Unifamiliar (Horizontal)

**Descripción:** Vivienda independiente de 1 o 2 niveles

#### Ejemplo: Casa Tipo A - Interés Social
```yaml
Nombre: "Casa Tipo A - Modelo Compacto"
Categoría: casa_unifamiliar
Segmento: interes_social
Niveles: 1

# Áreas
Área de terreno requerida: 120 m²
Área de construcción nivel 1: 45 m²
Área de construcción nivel 2: 0 m²
Área total construida: 45 m²
Área de patio: 75 m²

# Distribución
Recámaras: 2
Baños completos: 1
Medios baños: 0
Cocina: Integral abierta a sala
Sala: Sala-comedor abierto
Comedor: Integrado a sala
Estudio/cuarto adicional: No
Patio trasero: 30 m²
Patio frontal (jardín): 20 m²
Cochera techada: 1 cajón (15 m²)

# Características constructivas
Cimentación: Zapatas corridas de concreto armado
Estructura: Muros de carga de block de 15 cm
Losa de entretecho: Vigueta y bovedilla
Muros: Block hueco de 15 cm aplanado
Techos: Losa inclinada con impermeabilizante
Pisos: Cerámica económica 33×33 cm
Ventanas: Aluminio natural con vidrio claro 4 mm
Puertas: Madera contrachapada
Instalaciones eléctricas: Ocultas con apagadores básicos
Instalaciones hidráulicas: PVC cédula 40
Instalaciones sanitarias: PVC sanitario
Pintura exterior: Vinílica color pastel
Pintura interior: Vinílica blanca

# Acabados especiales
Cocina integral: Melamina estándar 2.40 m lineales
Tarja: Acero inoxidable 1 tarja
Azulejo cocina: 1.20 m de altura
Azulejo baño: 2.10 m de altura
Mueble de baño: Gabinete con lavabo
WC: Estándar blanco
Regadera: Mezcladora económica

# Costos estimados (2025)
Costo por m²: $8,500 MXN
Costo total estimado: $382,500 MXN (45 m² × $8,500)
Costo de urbanización (prorrateo): $50,000 MXN
Costo total llave en mano: $432,500 MXN
```

#### Ejemplo: Casa Tipo B - Residencial
```yaml
Nombre: "Casa Tipo B - Modelo Residencial"
Categoría: casa_unifamiliar
Segmento: residencial_medio
Niveles: 2

# Áreas
Área de terreno requerida: 150 m²
Área de construcción nivel 1: 75 m²
Área de construcción nivel 2: 50 m²
Área total construida: 125 m²
Área de patio: 25 m²

# Distribución
Recámaras: 3 (1 PB + 2 PA)
Baños completos: 2 (1 por nivel)
Medios baños: 1 (PB visitas)
Cocina: Integral con barra desayunadora
Sala: Independiente
Comedor: Independiente
Estudio: Opcional (PB)
Patio trasero: 15 m²
Jardín frontal: 10 m²
Cochera techada: 2 cajones (30 m²)
Cuarto de servicio: 6 m² (PA)

# Costo estimado
Costo por m²: $12,500 MXN
Costo total estimado: $1,562,500 MXN (125 m² × $12,500)
```

### 2. Departamento (Vertical)

#### Ejemplo: Departamento 2R - Torre
```yaml
Nombre: "Departamento Tipo 2R - Modelo Compacto"
Categoría: departamento
Segmento: interes_medio
Niveles: 1 (unidad plana)

# Áreas
Área privativa: 65 m²
Área común (% del edificio): 15 m² (pasillos, escaleras, elevador)
Área total vendible: 80 m²

# Distribución
Recámaras: 2 (1 principal con baño, 1 secundaria)
Baños completos: 1
Baños en recámara principal: 1
Cocina: Integral con barra
Sala-comedor: Abierto (20 m²)
Balcón: 4 m²
Closets: 2 (uno por recámara)
Área de lavado: Integrada a cocina

# Ubicación en torre
Niveles aplicables: 2 al 15
Departamentos por nivel: 8
Orientación: Norte, Sur, Este, Oeste

# Características
Pisos: Porcelanato 60×60 cm
Muros: Tablaroca con aislamiento acústico
Ventanas: Aluminio línea europea con doble vidrio
Cocina integral: Cubierta de granito, muebles MDF
Baños: Azulejo 2.40 m de altura, muebles suspendidos
Aire acondicionado: Preinstalación (minisplit)
Calefacción: No
Sistema contra incendios: Sprinklers en áreas comunes

# Amenidades (del edificio)
Gimnasio: Sí
Alberca: Sí (en azotea)
Salón de usos múltiples: Sí
Área de juegos infantiles: Sí
Roof garden: Sí
Elevadores: 2
Escaleras de emergencia: 2
Estacionamiento: 1 cajón asignado (subterráneo)
Bodega: 3 m² (nivel subterráneo)

# Costo estimado
Costo por m² privativo: $28,000 MXN
Costo total: $1,820,000 MXN (65 m² × $28,000)
Costo de estacionamiento: $250,000 MXN
Costo total con cajón: $2,070,000 MXN
```

### 3. Dúplex / Tríplex (Adosado)

#### Ejemplo: Dúplex Tipo D
```yaml
Nombre: "Dúplex Tipo D - Modelo Premium"
Categoría: duplex_adosado
Segmento: residencial_alto
Niveles: 2

# Áreas
Área de terreno individual: 100 m²
Área de construcción PB: 60 m²
Área de construcción PA: 55 m²
Área total construida: 115 m²
Patio privado trasero: 15 m²
Terraza en PA: 10 m²

# Distribución
Recámaras: 3 (todas en PA)
Baños completos: 2.5 (1 visitas PB, 1 PA, 1 en master)
Cocina: Integral con isla central (PB)
Sala: Doble altura (PB)
Comedor: Independiente (PB)
Family room: PA
Estacionamiento: 2 cajones cubiertos

# Acabados premium
Pisos PB: Mármol travertino
Pisos PA: Madera laminada
Cocina: Granito negro, electrodomésticos incluidos
Baños: Jacuzzi en master, accesorios Helvex
Domótica: Iluminación inteligente, seguridad

# Costo estimado
Costo por m²: $18,500 MXN
Costo total: $2,127,500 MXN (115 m² × $18,500)
```

---

## 💾 Datos del Prototipo

### Información General

```yaml
# Identificación
id: UUID generado
code: "PROTO-CA-001" (generado automáticamente)
name: "Casa Tipo A - Modelo Compacto"
description: "Casa de interés social de 45 m² con 2 recámaras y 1 baño"

# Clasificación
category: casa_unifamiliar | departamento | duplex_adosado | triplex
segment: interes_social | interes_medio | residencial_medio | residencial_alto | premium
levels: 1 | 2 | 3

# Constructora
constructora_id: UUID de la constructora propietaria
is_public: false (privado de constructora) | true (compartido en catálogo)
is_active: true | false

# Metadata
created_by: UUID del usuario creador
created_at: timestamp
updated_at: timestamp
version: 1 (para versionado de prototipos)
```

### Áreas y Distribución

```yaml
# Áreas generales
land_area_required: 120.00 m²
built_area_level_1: 45.00 m²
built_area_level_2: 0.00 m²
built_area_level_3: 0.00 m²
total_built_area: 45.00 m²
yard_area: 75.00 m²
terrace_area: 0.00 m²
balcony_area: 0.00 m²

# Distribución de espacios
bedrooms: 2
full_bathrooms: 1
half_bathrooms: 0
kitchen_type: "integral_open" | "independent" | "with_island"
living_room: true
dining_room: true
study_room: false
service_room: false
parking_spaces: 1
covered_parking: true
storage_room: false
```

### Características Constructivas

```yaml
# Sistema constructivo
foundation_type: "zapatas_corridas" | "losa_cimentacion" | "pilotes"
structure_type: "muros_carga" | "concreto_armado" | "acero"
roof_type: "losa_plana" | "losa_inclinada" | "teja"
wall_material: "block_15cm" | "tabique_rojo" | "tablaroca"
floor_material: "ceramica_33x33" | "porcelanato_60x60" | "marmol"

# Instalaciones
electrical_type: "oculta" | "visible"
plumbing_type: "pvc_cedula40" | "cobre"
drainage_type: "pvc_sanitario"
gas_installation: "natural" | "lp" | "ninguno"

# Acabados estándar
exterior_paint: "vinilica_pastel"
interior_paint: "vinilica_blanca"
windows_type: "aluminio_natural" | "aluminio_europeo" | "pvc"
doors_type: "madera_contrachapada" | "madera_solida" | "pvc"
```

### Costos Estimados

```yaml
# Costos de construcción
cost_per_sqm: 8500.00 MXN
total_construction_cost: 382500.00 MXN (45 m² × $8,500)

# Costos adicionales
urbanization_cost: 50000.00 MXN (prorrateo)
land_cost: 0.00 MXN (si se incluye)
equipment_cost: 35000.00 MXN (cocina integral, boiler, etc.)
indirect_costs: 15000.00 MXN (5% overhead)

# Costo total
total_turnkey_cost: 482500.00 MXN
profit_margin_percentage: 15.0
sale_price: 554875.00 MXN
```

### Planos y Documentación

```yaml
# Archivos adjuntos
architectural_plans: ["planta_baja.pdf", "planta_alta.pdf", "fachadas.pdf"]
structural_plans: ["cimentacion.pdf", "estructura.pdf"]
installation_plans: ["electrica.pdf", "hidraulica.pdf", "sanitaria.pdf"]
renders_3d: ["render_frontal.jpg", "render_posterior.jpg", "render_interior.jpg"]
virtual_tour_url: "https://tour.example.com/casa-tipo-a"

# Catálogo de conceptos (presupuesto base)
budget_template_id: UUID del presupuesto plantilla
estimated_concepts: 85 (número de conceptos de obra)
```

---

## 🔄 Versionado de Prototipos

Los prototipos pueden evolucionar. El sistema debe mantener versiones:

### Versión 1.0 (Original)
```yaml
code: "PROTO-CA-001"
version: 1
name: "Casa Tipo A v1"
built_area: 45 m²
cost_per_sqm: 8500 MXN
status: deprecated
```

### Versión 2.0 (Actualizada)
```yaml
code: "PROTO-CA-001"
version: 2
name: "Casa Tipo A v2"
built_area: 48 m² (ampliada)
cost_per_sqm: 9000 MXN (actualizado 2025)
status: active
changes_from_v1:
  - "Área incrementada de 45 a 48 m²"
  - "Recámara principal ampliada"
  - "Actualización de costos"
```

**Nota:** Las viviendas ya construidas mantienen referencia a la versión del prototipo utilizada.

---

## 💼 Casos de Uso

### CU-PROJ-008: Crear Prototipo de Casa

**Actor:** Ingeniero / Arquitecto

**Precondiciones:**
- Usuario autenticado con permisos de gestión de prototipos
- Planos arquitectónicos disponibles

**Flujo Principal:**

1. Usuario accede a "Prototipos" > "Nuevo Prototipo"
2. Selecciona categoría: "Casa Unifamiliar"
3. Ingresa datos generales:
   - Nombre: "Casa Tipo C - Modelo Tradicional"
   - Segmento: Interés Medio
   - Niveles: 1
4. Define áreas:
   - Terreno requerido: 140 m²
   - Construcción PB: 65 m²
   - Total construido: 65 m²
5. Define distribución:
   - 2 recámaras, 1.5 baños
   - Cocina integral, sala-comedor
   - Cochera para 1 auto
6. Especifica características constructivas:
   - Cimentación: Zapatas corridas
   - Muros: Block de 15 cm
   - Pisos: Cerámica 45×45 cm
7. Sube planos:
   - Planta arquitectónica (PDF, 2.5 MB)
   - Fachada principal (PDF, 1.8 MB)
   - Render 3D (JPG, 3.2 MB)
8. Ingresa costos:
   - Costo/m²: $9,200 MXN
   - Total construcción: $598,000 MXN
   - Urbanización: $55,000 MXN
   - **Total llave en mano: $653,000 MXN**
9. Guarda prototipo
10. Sistema genera código: **PROTO-CA-003**

**Resultado:** Prototipo creado, disponible para asignación a proyectos

### CU-PROJ-009: Asignar Prototipo a Lotes en Masa

**Actor:** Residente de Obra

**Precondiciones:**
- Proyecto con estructura jerárquica creada (80 lotes)
- 3 prototipos disponibles (Tipo A, B, C)

**Flujo Principal:**

1. Usuario accede a proyecto "Villas del Sol"
2. Selecciona Etapa 1, Manzana A (20 lotes)
3. Hace clic en "Asignar Prototipos en Masa"
4. Define regla de asignación:
   - **Lotes impares (1, 3, 5...):** Casa Tipo A (10 lotes)
   - **Lotes pares (2, 4, 6...):** Casa Tipo B (10 lotes)
5. Vista previa de asignación:
   ```
   Lote 1 → Casa Tipo A ($432,500)
   Lote 2 → Casa Tipo B ($1,562,500)
   Lote 3 → Casa Tipo A ($432,500)
   ...
   Total estimado: $9,975,000
   ```
6. Confirma asignación
7. Sistema crea 20 viviendas vinculadas a prototipos

**Resultado:** 20 viviendas creadas con características heredadas de prototipos

### CU-PROJ-010: Actualizar Prototipo (Nueva Versión)

**Actor:** Ingeniero

**Precondiciones:**
- Prototipo "Casa Tipo A v1" existente
- 50 viviendas ya construidas con v1

**Flujo Principal:**

1. Usuario accede a prototipo "PROTO-CA-001 v1"
2. Hace clic en "Crear Nueva Versión"
3. Sistema duplica datos de v1
4. Usuario modifica:
   - Área construida: 45 m² → 48 m²
   - Costo/m²: $8,500 → $9,000
   - Cambio: "Recámara principal ampliada de 9 a 12 m²"
5. Guarda como v2
6. Sistema:
   - Marca v1 como "deprecated"
   - Activa v2 como versión actual
   - Mantiene viviendas existentes vinculadas a v1
7. Nuevas asignaciones usan v2 automáticamente

**Resultado:** Prototipo actualizado sin afectar construcciones existentes

---

## 🧪 Casos de Prueba

### TC-PROJ-009: Crear Prototipo Válido ✅

**Entrada:**
```json
{
  "code": "PROTO-CA-005",
  "name": "Casa Tipo E - Económica",
  "category": "casa_unifamiliar",
  "segment": "interes_social",
  "levels": 1,
  "landArea": 100,
  "builtArea": 40,
  "bedrooms": 2,
  "bathrooms": 1,
  "costPerSqm": 8200
}
```

**Salida Esperada:**
```json
{
  "id": "uuid-generated",
  "code": "PROTO-CA-005",
  "totalCost": 328000,
  "status": "active",
  "message": "Prototipo creado exitosamente"
}
```

### TC-PROJ-010: Validar Código Único ❌

**Entrada:**
```json
{
  "code": "PROTO-CA-001",  // Ya existe
  "name": "Casa Nueva"
}
```

**Salida Esperada:**
```json
{
  "error": "El código PROTO-CA-001 ya existe en el catálogo",
  "code": "DUPLICATE_PROTOTYPE_CODE"
}
```

### TC-PROJ-011: Heredar Características a Vivienda ✅

**Precondiciones:**
- Prototipo "Casa Tipo A" con área = 45 m²

**Acción:**
- Asignar prototipo a Lote 15

**Resultado Esperado:**
```json
{
  "housing": {
    "code": "VIV-A-015",
    "prototype": "PROTO-CA-001",
    "builtArea": 45,
    "bedrooms": 2,
    "bathrooms": 1,
    "estimatedCost": 432500
  }
}
```

---

## 🔐 Seguridad y Permisos

### Permisos por Rol

| Acción | Director | Engineer | Resident | Purchases | Finance |
|--------|----------|----------|----------|-----------|---------|
| Crear prototipo | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar prototipo | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver prototipos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Versionar prototipo | ✅ | ✅ | ❌ | ❌ | ❌ |
| Eliminar prototipo | ✅ | ❌ | ❌ | ❌ | ❌ |
| Asignar a lotes | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 📊 Reportes Requeridos

### 1. Catálogo de Prototipos
```
Casa Tipo A - Compacto: 45 m², $8,500/m², $432,500 total
Casa Tipo B - Residencial: 125 m², $12,500/m², $1,562,500 total
Depto 2R - Torre: 65 m², $28,000/m², $1,820,000 total
```

### 2. Uso de Prototipos por Proyecto
| Prototipo | Proyecto | Viviendas | Total Invertido |
|-----------|----------|-----------|-----------------|
| Casa Tipo A | Villas del Sol | 120 | $51,900,000 |
| Casa Tipo B | Villas del Sol | 80 | $125,000,000 |
| **Total** | - | **200** | **$176,900,000** |

---

## 📋 Validaciones

1. **Nombre único:** No puede haber dos prototipos con el mismo código en la constructora
2. **Área > 0:** Área construida debe ser mayor a cero
3. **Costo > 0:** Costo por m² debe ser mayor a cero
4. **Archivos válidos:** Solo PDF, JPG, PNG, DWG permitidos
5. **Versiones secuenciales:** v2 requiere que exista v1

---

## 🔗 Dependencias

- **RF-PROJ-002:** Asignación a lotes (estructura jerárquica)
- **RF-BUD-003:** Catálogo de conceptos (presupuesto plantilla) - MAI-003

---

## 📈 Métricas de Éxito

- ✅ Catálogo de al menos 5 prototipos por constructora
- ✅ 90% de viviendas basadas en prototipos (vs personalizadas)
- ✅ Tiempo de creación de prototipo: < 15 minutos
- ✅ Precisión de estimación: ±5% vs costo real

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
**Autor:** Equipo de Producto
**Revisado por:** Arquitecto de Software
