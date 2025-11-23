# RF-RRHH-001: Catálogo de Personal y Cuadrillas

**Módulo:** MAI-007 - RRHH y Asistencias
**Épica:** Gestión de Recursos Humanos de Obra
**Prioridad:** Alta
**Complejidad:** Media
**Autor:** Strategos AI
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Descripción General

Este requerimiento establece la necesidad de un **sistema de gestión centralizado de personal** que permita administrar empleados directos, cuadrillas subcontratadas, oficios, certificaciones, y el historial laboral completo de todo el personal que participa en los proyectos de construcción.

El sistema debe soportar:
- **Empleados directos** de la constructora
- **Cuadrillas subcontratadas** con estructura jerárquica
- **Clasificación por oficios** especializados de construcción
- **Gestión de certificaciones** y capacitaciones obligatorias
- **Historial laboral** con asignaciones a proyectos
- **Datos legales** (IMSS, INFONAVIT, RFC, CURP)
- **Documentación digital** (identificaciones, contratos, certificados)

### Beneficios Clave

✅ **Trazabilidad completa** del personal en cada proyecto y frente de obra
✅ **Cumplimiento legal** con requisitos IMSS, INFONAVIT, STPS
✅ **Control de certificaciones** y capacitaciones obligatorias
✅ **Base para costeo** de mano de obra y productividad
✅ **Gestión ágil** de rotación y asignaciones multi-sitio

---

## 2. Actores Principales

| Actor | Rol | Responsabilidades |
|-------|-----|-------------------|
| **Director de RRHH** | Administrador | Gestión completa del catálogo de personal |
| **Coordinador de Obra** | Usuario avanzado | Asignar personal a obras y frentes |
| **Residente de Obra** | Usuario básico | Consultar personal asignado a su obra |
| **Auditor IMSS/STPS** | Externo | Verificar cumplimiento normativo |
| **Sistema de Nómina** | Sistema | Consumir datos para procesamiento de nómina |

---

## 3. Casos de Uso Principales

### CU-RRHH-001: Alta de Empleado Directo

**Descripción:** El Director de RRHH registra un nuevo empleado directo con todos sus datos personales, laborales y legales.

**Flujo Principal:**

1. Usuario accede a "Catálogo de Personal" → "Nuevo Empleado Directo"
2. Completa **Datos Personales**:
   - Nombre completo
   - Fecha de nacimiento
   - RFC, CURP, NSS (Número de Seguridad Social)
   - Dirección, teléfono, email
   - Contacto de emergencia
3. Completa **Datos Laborales**:
   - Fecha de ingreso
   - Tipo de contrato: Planta / Eventual / Por Obra
   - Oficio principal: [Selección de catálogo]
   - Nivel de experiencia: Junior / Semi-senior / Senior / Maestro
   - Salario base diario
   - Jornada: Diurna / Nocturna / Mixta
4. Completa **Datos IMSS/INFONAVIT**:
   - Número de Seguridad Social (NSS)
   - UMF (Unidad Médica Familiar) asignada
   - Crédito INFONAVIT: Sí/No
   - Descuento INFONAVIT mensual (si aplica)
5. Adjunta **Documentos Digitales**:
   - INE/IFE (frente y reverso)
   - Comprobante de domicilio
   - CURP
   - RFC
   - Alta IMSS (formato firmado)
   - Contrato laboral
   - Certificados de capacitación (opcionales)
6. Sistema **valida datos**:
   - RFC válido (algoritmo)
   - CURP válido (algoritmo)
   - NSS válido (11 dígitos)
   - Fecha de nacimiento vs edad mínima legal (18 años)
7. Sistema **genera código único**: EMP-2025-00001
8. Guarda registro con status: **Activo**

**Postcondiciones:**
- Empleado queda disponible para asignación a obras
- Se puede registrar su asistencia desde app móvil
- Aparece en reportes de RRHH

**Validaciones:**
- ❌ No permitir duplicados por NSS o RFC
- ❌ No permitir fecha de ingreso futura
- ❌ No permitir salario diario < salario mínimo vigente
- ✅ Permitir guardar como "borrador" si faltan documentos

---

### CU-RRHH-002: Registro de Cuadrilla Subcontratada

**Descripción:** El Coordinador de Obra registra una cuadrilla completa de un subcontratista, con estructura de jefe de cuadrilla + ayudantes.

**Flujo Principal:**

1. Usuario accede a "Catálogo de Personal" → "Nueva Cuadrilla Subcontratada"
2. Completa **Datos de la Cuadrilla**:
   - Nombre: "Cuadrilla Herrería - Juan Pérez"
   - Subcontratista: [Selección de catálogo de proveedores]
   - Oficio especializado: Herrería
   - Tipo de contrato: Por obra / Por precio alzado / Precio unitario
   - Vigencia del contrato: Fecha inicio - Fecha fin
3. Registra **Jefe de Cuadrilla**:
   - Nombre completo
   - Teléfono de contacto
   - NSS (opcional para subcontratados)
   - Experiencia en años
4. Registra **Integrantes de la Cuadrilla** (uno por uno):
   ```
   Integrante #1:
   - Nombre: Pedro González
   - Oficio: Oficial Herrero
   - NSS: 12345678901 (opcional)
   - Teléfono: 55-1234-5678

   Integrante #2:
   - Nombre: Luis Martínez
   - Oficio: Ayudante de Herrería
   - NSS: —
   - Teléfono: 55-9876-5432
   ```
5. Define **Tarifa de la Cuadrilla**:
   - Costo por día: $3,500 MXN (cuadrilla completa)
   - Costo por m² de trabajo: $45 MXN (si es precio unitario)
6. Sistema genera código: **CUAD-2025-00001**
7. Guarda cuadrilla con status: **Activa**

**Postcondiciones:**
- Cuadrilla disponible para asignar a proyectos
- Cada integrante puede registrar asistencia individual
- Costeo se calcula por cuadrilla completa o por producción

**Reglas de Negocio:**
- Una cuadrilla debe tener mínimo 1 jefe + 1 integrante
- Máximo 15 integrantes por cuadrilla
- El jefe de cuadrilla puede pertenecer a solo 1 cuadrilla activa

---

### CU-RRHH-003: Gestión de Certificaciones y Capacitaciones

**Descripción:** El Director de RRHH registra y da seguimiento a certificaciones obligatorias y capacitaciones de seguridad del personal.

**Flujo Principal:**

1. Usuario accede a "Personal" → [Selecciona empleado] → "Certificaciones"
2. Ve listado de **Certificaciones Actuales**:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Certificación              │ Vigencia  │ Status     │
   ├────────────────────────────┼───────────┼────────────┤
   │ NOM-009-STPS-2011         │ 01/03/2026│ ✅ Vigente │
   │ Trabajos en Altura         │ 15/01/2025│ ⚠️ Por     │
   │ (Curso 40 hrs)             │           │   vencer   │
   │ Manejo de Herramienta      │ 10/12/2024│ ❌ Vencida │
   │ Eléctrica                  │           │            │
   └────────────────────────────┴───────────┴───────────┘
   ```
3. Hace clic en "Agregar Certificación"
4. Completa datos:
   - Tipo de certificación: [Catálogo configurable]
     - NOM-009-STPS-2011 (Trabajos en Altura)
     - NOM-031-STPS-2011 (Construcción)
     - Curso de Primeros Auxilios
     - Operación de Maquinaria Pesada
     - Soldadura certificada AWS
     - Electricidad residencial
     - Instalaciones hidrosanitarias
     - Andamios tipo
   - Institución emisora: "STPS" / "Instituto XYZ"
   - Número de certificado: CERT-12345
   - Fecha de emisión: 15/01/2024
   - Vigencia: 1 año / 2 años / Permanente
   - Fecha de vencimiento: 15/01/2025 (auto-calculada)
5. Adjunta **Documento PDF** del certificado
6. Sistema guarda y **programa recordatorio**:
   - 30 días antes del vencimiento → Email + Notificación
   - Al vencer → Marcar empleado como "Certificación vencida"
7. Si certificación vence:
   - Sistema **alerta** al asignar a obra que requiere esa certificación
   - Dashboard de RRHH muestra empleados con certificaciones vencidas

**Postcondiciones:**
- Certificación queda trazada en el historial del empleado
- Se pueden generar reportes de cumplimiento para auditorías
- Sistema previene asignaciones a obras si falta certificación obligatoria

**Validaciones:**
- ❌ No permitir fecha de emisión futura
- ❌ No permitir vencimiento anterior a fecha de emisión
- ✅ Alertar si se sube certificado duplicado para el mismo empleado

---

### CU-RRHH-004: Consultar Historial Laboral

**Descripción:** El Director de RRHH consulta el historial completo de asignaciones, proyectos y desempeño de un empleado.

**Flujo Principal:**

1. Usuario accede a "Personal" → [Selecciona empleado: Juan Pérez EMP-2025-00001]
2. Ve **Resumen del Empleado**:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Juan Pérez Gómez          EMP-2025-00001            │
   │ Oficial Albañil Senior    NSS: 12345678901          │
   ├─────────────────────────────────────────────────────┤
   │ Antigüedad: 8 años 3 meses                          │
   │ Proyectos completados: 12                           │
   │ Obras activas: 1 (Fracc. Los Pinos - Etapa 2)       │
   │ Asistencia promedio: 94% (últimos 12 meses)         │
   │ Incidencias: 2 retardos, 3 faltas injustificadas    │
   └─────────────────────────────────────────────────────┘
   ```
3. Ve pestaña **"Historial de Proyectos"**:
   ```
   ┌────────────────────────────────────────────────────────────┐
   │ Proyecto              │ Periodo       │ Rol         │ Eval. │
   ├───────────────────────┼───────────────┼─────────────┼───────┤
   │ Fracc. Los Pinos E2   │ Ene-25 → Hoy  │ Of. Albañil │ —     │
   │ Privada Las Flores    │ Jul-24 → Dic24│ Of. Albañil │ ⭐⭐⭐⭐⭐│
   │ Conjunto Haciendas    │ Ene-24 → Jun24│ Ayudante    │ ⭐⭐⭐⭐ │
   │ Fracc. Valle Real     │ Jun-23 → Dic23│ Ayudante    │ ⭐⭐⭐  │
   │ ...12 proyectos más                                         │
   └────────────────────────────────────────────────────────────┘
   ```
4. Ve pestaña **"Asistencias"**:
   - Gráfico de asistencia mensual (últimos 12 meses)
   - Desglose: Asistencias / Faltas / Retardos / Permisos
   - Total de horas trabajadas por mes
5. Ve pestaña **"Capacitaciones"**:
   - Lista cronológica de cursos y certificaciones
   - Horas de capacitación acumuladas
6. Ve pestaña **"Incidencias Disciplinarias"** (si aplica):
   ```
   Fecha      │ Tipo           │ Descripción               │ Acción
   ───────────┼────────────────┼───────────────────────────┼─────────
   10/Feb/25  │ Retardo        │ Llegó 35 min tarde        │ Llamada
              │                │                           │ atención
   05/Ene/25  │ Falta injust.  │ No presentó justificante  │ Descuento
   ```

**Postcondiciones:**
- Director de RRHH tiene visibilidad completa del empleado
- Puede tomar decisiones informadas sobre ascensos, bonos, re-asignaciones

---

### CU-RRHH-005: Catálogo de Oficios

**Descripción:** El administrador del sistema configura el catálogo maestro de oficios de construcción con costos estándar.

**Flujo Principal:**

1. Usuario (Admin RRHH) accede a "Configuración" → "Catálogo de Oficios"
2. Ve listado actual:
   ```
   ┌──────────────────────────────────────────────────────────┐
   │ Oficio                    │ Categoría       │ Costo/día  │
   ├───────────────────────────┼─────────────────┼────────────┤
   │ Albañil                   │ Obra Civil      │ $550       │
   │ Fierrero (Armador)        │ Obra Civil      │ $600       │
   │ Carpintero                │ Acabados        │ $580       │
   │ Plomero                   │ Instalaciones   │ $620       │
   │ Electricista              │ Instalaciones   │ $650       │
   │ Pintor                    │ Acabados        │ $520       │
   │ Yesero                    │ Acabados        │ $530       │
   │ Operador de Maquinaria    │ Maquinaria      │ $800       │
   │ Maestro de Obra           │ Supervisión     │ $900       │
   │ Ayudante General          │ Apoyo           │ $400       │
   │ ...más oficios...                                        │
   └──────────────────────────────────────────────────────────┘
   ```
3. Hace clic en "Nuevo Oficio"
4. Completa:
   - Nombre del oficio: "Instalador de Cancelería"
   - Categoría: [Selección] → Acabados
   - Costo estándar día: $560 MXN
   - Requiere certificación: ☑ Sí
   - Certificaciones requeridas: [Selección múltiple]
     - ☑ Curso de Instalación de Aluminio y Vidrio
     - ☑ NOM-031-STPS (Construcción)
   - Descripción: "Instalación de puertas, ventanas y cancelería de aluminio"
5. Sistema valida y guarda
6. Oficio queda disponible para asignar a empleados

**Reglas de Negocio:**
- No se pueden eliminar oficios que tengan empleados asignados
- Cambiar costo estándar NO afecta contratos ya firmados
- Se puede marcar un oficio como "Obsoleto" para que no aparezca en nuevos registros

---

## 4. Wireframes / Mockups

### Pantalla: Catálogo de Personal

```
┌────────────────────────────────────────────────────────────────────────────┐
│  RRHH > Catálogo de Personal                           [+ Nuevo Empleado]  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Filtros: [Todos ▼] [Activos ▼] [Oficio ▼] [Proyecto ▼]     🔍 Buscar...  │
│                                                                             │
│  ┌─ Resumen ──────────────────────────────────────────────────────────┐    │
│  │ Total empleados: 245  |  Directos: 78  |  Subcontratados: 167      │    │
│  │ Cuadrillas activas: 12  |  Certificaciones por vencer: 8           │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Código      │ Nombre              │ Oficio        │ Proyecto   │ Acción│
│  ├─────────────┼─────────────────────┼───────────────┼────────────┼──────┤
│  │ EMP-001     │ Juan Pérez Gómez    │ Of. Albañil   │ Los Pinos  │[Ver] │
│  │ 📷 ✅ 94%  │ NSS: 123***901      │ Senior        │ Etapa 2    │[Edi] │
│  │             │ ⚠️ Cert. por vencer │               │            │      │
│  ├─────────────┼─────────────────────┼───────────────┼────────────┼──────┤
│  │ CUAD-005    │ Cuadrilla Herrería  │ Fierreros     │ Las Flores │[Ver] │
│  │ 👥 5 pers   │ Jefe: Pedro López   │ (5 integ.)    │            │[Edi] │
│  │ ✅ 98%     │ Subcon: ACEROS SA   │               │            │      │
│  ├─────────────┼─────────────────────┼───────────────┼────────────┼──────┤
│  │ EMP-142     │ María González V.   │ Arquitecto    │ Oficina    │[Ver] │
│  │ 📷 ✅ 100% │ NSS: 987***456      │ Residente     │ Central    │[Edi] │
│  │             │                     │               │            │      │
│  ├─────────────┼─────────────────────┼───────────────┼────────────┼──────┤
│  │ EMP-078     │ Carlos Ramírez      │ Electricista  │ Sin        │[Ver] │
│  │ ❌ Inactivo│ NSS: 456***789      │ Certificado   │ asignar    │[Edi] │
│  │             │ ❌ Baja: 10/Ene/25  │               │            │      │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [< Anterior]  Página 1 de 5  [Siguiente >]                                │
└────────────────────────────────────────────────────────────────────────────┘

Leyenda:
📷 = Tiene foto de perfil
✅ = Asistencia > 90% (últimos 30 días)
⚠️ = Alertas (certificación próxima a vencer, etc.)
❌ = Inactivo o dado de baja
👥 = Cuadrilla (múltiples personas)
```

---

### Pantalla: Detalle de Empleado

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ◀ Volver    RRHH > Personal > Juan Pérez Gómez (EMP-2025-00001)  [Editar]│
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  📷                Juan Pérez Gómez                                  │   │
│  │  [Foto]            EMP-2025-00001                                    │   │
│  │                    Oficial Albañil Senior                            │   │
│  │                    ✅ Activo  |  Ingreso: 01/Mar/2017                │   │
│  │                                                                       │   │
│  │  Datos Personales                                                    │   │
│  │  ──────────────────────────────────────────────────────────────────  │   │
│  │  RFC: PEJG850315HDF001                                               │   │
│  │  CURP: PEJG850315HDFRMN02                                            │   │
│  │  NSS: 12345678901                                                    │   │
│  │  Fecha de nacimiento: 15/Mar/1985 (39 años)                          │   │
│  │  Teléfono: 55-1234-5678                                              │   │
│  │  Email: juan.perez@email.com                                         │   │
│  │  Emergencia: María Pérez (Esposa) - 55-9876-5432                    │   │
│  │                                                                       │   │
│  │  Datos Laborales                                                     │   │
│  │  ──────────────────────────────────────────────────────────────────  │   │
│  │  Antigüedad: 8 años 3 meses                                          │   │
│  │  Tipo de contrato: Planta                                            │   │
│  │  Oficio: Oficial Albañil (Senior)                                    │   │
│  │  Salario base: $550/día                                              │   │
│  │  Jornada: Diurna (07:00 - 17:00)                                     │   │
│  │  UMF: Clínica 47 IMSS                                                │   │
│  │  Crédito INFONAVIT: Sí (Descuento: $450/mes)                         │   │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  [Datos Personales] [Asignaciones] [Certificaciones] [Asistencia]          │
│                     [Historial] [Documentos]                                │
│                                                                             │
│  ┌─ Asignación Actual ─────────────────────────────────────────────────┐   │
│  │ Proyecto: Fraccionamiento Los Pinos - Etapa 2                        │   │
│  │ Desde: 10/Ene/2025                                                   │   │
│  │ Frente de trabajo: Albañilería - Manzana C                           │   │
│  │ Supervisor: Ing. Carlos Mendoza                                      │   │
│  │ Asistencia (últ. 30 días): ████████████████░░ 94% (28/30 días)       │   │
│  │                                                                       │   │
│  │ [Cambiar de Obra]  [Dar de Baja]                                     │   │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ Certificaciones ───────────────────────────────────────────────────┐   │
│  │ Certificación              │ Vigencia    │ Status       │ Acciones   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ NOM-031-STPS-2011         │ 01/Mar/2026 │ ✅ Vigente   │ [Ver PDF]  │   │
│  │ Trabajos en Altura         │ 15/Ene/2025 │ ⚠️ Por       │ [Renovar]  │   │
│  │                            │             │   vencer     │            │   │
│  │ Primeros Auxilios          │ Permanente  │ ✅ Vigente   │ [Ver PDF]  │   │
│  │                                                                       │   │
│  │ [+ Agregar Certificación]                                            │   │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ Documentos Adjuntos ───────────────────────────────────────────────┐   │
│  │ 📄 INE - Frente y reverso.pdf           (Subido: 01/Mar/2017)        │   │
│  │ 📄 Comprobante domicilio.pdf            (Subido: 01/Mar/2017)        │   │
│  │ 📄 Alta IMSS.pdf                        (Subido: 01/Mar/2017)        │   │
│  │ 📄 Contrato laboral firmado.pdf         (Subido: 01/Mar/2017)        │   │
│  │                                                                       │   │
│  │ [+ Subir Documento]                                                  │   │
│  └───────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### Pantalla: Registro de Cuadrilla

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ◀ Volver    RRHH > Nuevo > Cuadrilla Subcontratada                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Paso 1 de 3: Datos de la Cuadrilla                                        │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  Nombre de la cuadrilla: *                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │ Cuadrilla Herrería - Pedro López                                  │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Subcontratista: *                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │ [Seleccionar proveedor ▼]   → ACEROS Y ESTRUCTURAS SA             │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Oficio especializado: *                                                   │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │ [Seleccionar oficio ▼]      → Fierrero (Armador de Acero)         │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Tipo de contrato:                                                         │
│  ◉ Por obra determinada                                                    │
│  ○ Precio alzado                                                           │
│  ○ Precio unitario (m², m³, ton, etc.)                                     │
│                                                                             │
│  Vigencia del contrato:                                                    │
│  Inicio: [15/Ene/2025]    Fin: [30/Jun/2025]                               │
│                                                                             │
│                                                 [Cancelar]  [Siguiente >]  │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  ◀ Volver    RRHH > Nuevo > Cuadrilla Subcontratada                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Paso 2 de 3: Jefe e Integrantes de la Cuadrilla                           │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  ┌─ Jefe de Cuadrilla ─────────────────────────────────────────────────┐  │
│  │ Nombre completo: *                                                   │  │
│  │ ┌────────────────────────────────────────────────────────────────┐  │  │
│  │ │ Pedro López Ramírez                                            │  │  │
│  │ └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │ Teléfono: *            NSS (opcional):         Años experiencia:    │  │
│  │ ┌──────────────┐      ┌──────────────┐        ┌──────────────┐     │  │
│  │ │ 55-1111-2222 │      │ 98765432109  │        │ 15 años      │     │  │
│  │ └──────────────┘      └──────────────┘        └──────────────┘     │  │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ Integrantes de la Cuadrilla (0/15) ────────────────────────────────┐  │
│  │                                                                       │  │
│  │  [+ Agregar Integrante]                                              │  │
│  │                                                                       │  │
│  │  (Vacío - agregue al menos 1 integrante)                             │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  [Después de agregar integrantes:]                                         │
│                                                                             │
│  ┌─ Integrantes de la Cuadrilla (4/15) ────────────────────────────────┐  │
│  │ #  │ Nombre              │ Oficio          │ NSS         │ Teléfono  │  │
│  │ ───┼─────────────────────┼─────────────────┼─────────────┼─────────── │ │
│  │ 1  │ Juan Méndez García  │ Oficial Fierro  │ 11122233344 │ 55-222... │  │
│  │ 2  │ Luis Torres Sánchez │ Oficial Fierro  │ 22233344455 │ 55-333... │  │
│  │ 3  │ Carlos Ruiz Pérez   │ Ayudante        │ —           │ 55-444... │  │
│  │ 4  │ Miguel Ángel Díaz   │ Ayudante        │ —           │ 55-555... │  │
│  │                                                                       │  │
│  │  [+ Agregar Integrante]                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                        [< Anterior]  [Cancelar]  [Siguiente>]│
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  ◀ Volver    RRHH > Nuevo > Cuadrilla Subcontratada                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Paso 3 de 3: Tarifas y Costos                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  Esquema de pago:                                                          │
│  ◉ Costo por día (cuadrilla completa)                                      │
│  ○ Costo por unidad de producción (m², ton, etc.)                          │
│  ○ Precio alzado por obra                                                  │
│                                                                             │
│  [SI SELECCIONA: Costo por día]                                            │
│                                                                             │
│  Tarifa diaria de la cuadrilla completa: *                                 │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │ $ 4,500.00 MXN/día                                                │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Notas / Condiciones adicionales:                                          │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │ Incluye herramienta menor. No incluye equipo pesado.              │    │
│  │ Jornada: 08:00 - 18:00 hrs, Lunes a Sábado.                       │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─ Resumen de la Cuadrilla ────────────────────────────────────────────┐ │
│  │ Nombre: Cuadrilla Herrería - Pedro López                             │ │
│  │ Subcontratista: ACEROS Y ESTRUCTURAS SA                              │ │
│  │ Jefe: Pedro López Ramírez (55-1111-2222)                             │ │
│  │ Integrantes: 4 personas                                              │ │
│  │ Tarifa: $4,500/día                                                   │ │
│  │ Vigencia: 15/Ene/2025 - 30/Jun/2025                                  │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                        [< Anterior]  [Cancelar]  [Guardar] │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Reglas de Negocio

### RN-RRHH-001: Validación de Datos Legales

- **RFC**: Debe cumplir con el algoritmo de validación oficial (13 caracteres para personas físicas)
- **CURP**: Debe cumplir con el algoritmo de validación de RENAPO (18 caracteres)
- **NSS**: Debe ser de 11 dígitos numéricos
- **Edad mínima**: El empleado debe tener mínimo 18 años cumplidos al momento del alta
- **Salario mínimo**: El salario diario no puede ser menor al salario mínimo vigente en la zona geográfica

### RN-RRHH-002: Unicidad de Registros

- No se permite registrar 2 empleados con el mismo **NSS**
- No se permite registrar 2 empleados con el mismo **RFC**
- Se permite mismo nombre completo (personas homónimas)
- Si se detecta duplicado, el sistema debe mostrar alerta con datos del empleado existente

### RN-RRHH-003: Status de Empleados

Los empleados pueden tener los siguientes status:

| Status | Descripción | ¿Puede asistir? | ¿Aparece en reportes? |
|--------|-------------|-----------------|----------------------|
| **Activo** | Empleado activo y disponible | ✅ Sí | ✅ Sí |
| **Suspendido** | Suspensión temporal (15-30 días) | ❌ No | ⚠️ Reportes especiales |
| **Incapacitado** | Incapacidad médica temporal | ❌ No | ⚠️ Reportes de IMSS |
| **Baja** | Dado de baja (renuncia, despido) | ❌ No | ❌ Solo históricos |
| **Vacaciones** | En periodo vacacional | ❌ No | ⚠️ Sí (marcado) |

**Reglas:**
- Solo empleados **Activos** pueden registrar asistencia
- Solo empleados **Activos** pueden ser asignados a nuevas obras
- El cambio de status debe quedar registrado en bitácora con: usuario que lo cambió, fecha, motivo

### RN-RRHH-004: Certificaciones Obligatorias

Para ciertos oficios, es **obligatorio** tener certificaciones vigentes:

| Oficio | Certificación Obligatoria |
|--------|---------------------------|
| Operador de Maquinaria | Licencia de operador + Curso de seguridad |
| Electricista | Certificación de instalaciones eléctricas |
| Trabajos en Altura | NOM-009-STPS-2011 + Curso de 40 hrs |
| Soldador | Certificación AWS (American Welding Society) |

**Validación:**
- Al asignar un empleado a una obra, el sistema verifica si el frente de trabajo requiere certificación especial
- Si la certificación está vencida o falta, el sistema **alerta** pero **permite continuar** (con confirmación del Director de Obra)
- Se genera reporte semanal de empleados con certificaciones por vencer

### RN-RRHH-005: Límites de Cuadrillas

- Una cuadrilla debe tener **mínimo 1 jefe + 1 integrante** (total: 2 personas)
- Una cuadrilla puede tener **máximo 15 integrantes** (sin contar al jefe)
- Un jefe de cuadrilla puede estar en **solo 1 cuadrilla activa** al mismo tiempo
- Un integrante puede estar en **máximo 2 cuadrillas** (si trabaja turnos diferentes)
- Si se da de baja una cuadrilla, todos los integrantes quedan liberados para ser asignados a otras cuadrillas

### RN-RRHH-006: Historial Laboral

- El historial de proyectos se genera automáticamente cuando:
  - Se asigna un empleado a un proyecto (registro de fecha de inicio)
  - Se completa el proyecto o se re-asigna el empleado (registro de fecha fin)
- El historial es **inmutable**: No se puede editar ni eliminar
- Se puede agregar una **evaluación de desempeño** al finalizar el proyecto (escala 1-5 estrellas)
- La evaluación solo puede ser capturada por: Director de Obra, Residente, o Director de RRHH

### RN-RRHH-007: Documentos Digitales

Los siguientes documentos son **obligatorios** para empleados directos:
- INE o IFE (identificación oficial vigente)
- CURP
- RFC
- Alta IMSS (formato firmado por empleado y empresa)
- Contrato laboral firmado

Los siguientes documentos son **opcionales**:
- Comprobante de domicilio
- Acta de nacimiento
- Comprobante de estudios
- Cartas de recomendación
- Certificados médicos

**Validación:**
- Los documentos deben estar en formato **PDF o imagen** (JPG, PNG)
- Tamaño máximo por archivo: **5 MB**
- Se permite subir múltiples versiones del mismo documento (versionado automático)
- Los documentos vencen según tipo:
  - INE: Vence según fecha impresa en credencial → Alerta 60 días antes
  - Certificado médico: Vence a 1 año → Alerta 30 días antes

### RN-RRHH-008: Privacidad y Acceso a Datos

El acceso a datos personales está restringido por rol:

| Rol | Acceso |
|-----|--------|
| **Director de RRHH** | ✅ Acceso total a todos los datos (personales, legales, salariales) |
| **Coordinador de Obra** | ✅ Datos básicos (nombre, oficio, teléfono, asistencia) <br> ❌ Datos salariales <br> ❌ Datos médicos |
| **Residente de Obra** | ✅ Datos básicos de personal asignado a su obra <br> ❌ Datos salariales <br> ❌ Datos de otras obras |
| **Auditor Externo** | ✅ Solo datos necesarios para auditoría (certificaciones, asistencias) <br> ❌ Datos personales sensibles |

**Cumplimiento legal:**
- Cumplir con **Ley Federal de Protección de Datos Personales (LFPDPPP - México)**
- Obtener **Aviso de Privacidad** firmado por cada empleado
- Permitir a empleados ejercer derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)
- Registrar en bitácora quién accedió a datos sensibles y cuándo

---

## 6. Modelo de Datos

### Tabla: `employees` (Empleados)

```sql
CREATE TABLE hr.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Identificación
  employee_code VARCHAR(50) UNIQUE NOT NULL, -- EMP-2025-00001
  employee_type VARCHAR(20) NOT NULL, -- 'direct' | 'crew_member'
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active' | 'suspended' | 'leave' | 'terminated'

  -- Datos Personales
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10), -- 'male' | 'female' | 'other'

  -- Datos Legales México
  rfc VARCHAR(13) UNIQUE NOT NULL,
  curp VARCHAR(18) UNIQUE NOT NULL,
  nss VARCHAR(11) UNIQUE, -- Número de Seguridad Social (IMSS)

  -- Contacto
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,

  -- Emergencia
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),

  -- Datos Laborales
  hire_date DATE NOT NULL,
  termination_date DATE,
  contract_type VARCHAR(30), -- 'permanent' | 'temporary' | 'per_project'
  primary_trade_id UUID REFERENCES hr.trades(id), -- Oficio principal
  experience_level VARCHAR(20), -- 'junior' | 'semi_senior' | 'senior' | 'master'
  daily_wage DECIMAL(10,2), -- Salario base diario
  shift_type VARCHAR(20), -- 'day' | 'night' | 'mixed'

  -- IMSS / INFONAVIT
  imss_clinic VARCHAR(100), -- UMF asignada
  has_infonavit_credit BOOLEAN DEFAULT FALSE,
  infonavit_discount DECIMAL(10,2), -- Descuento mensual

  -- Metadata
  photo_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_tenant ON hr.employees(tenant_id);
CREATE INDEX idx_employees_code ON hr.employees(employee_code);
CREATE INDEX idx_employees_status ON hr.employees(status);
CREATE INDEX idx_employees_trade ON hr.employees(primary_trade_id);
```

### Tabla: `crews` (Cuadrillas Subcontratadas)

```sql
CREATE TABLE hr.crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Identificación
  crew_code VARCHAR(50) UNIQUE NOT NULL, -- CUAD-2025-00001
  crew_name VARCHAR(200) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',

  -- Subcontratista
  subcontractor_id UUID REFERENCES suppliers(id),
  trade_id UUID REFERENCES hr.trades(id),

  -- Contrato
  contract_type VARCHAR(30), -- 'per_project' | 'fixed_price' | 'unit_price'
  contract_start_date DATE,
  contract_end_date DATE,

  -- Jefe de Cuadrilla
  foreman_name VARCHAR(100) NOT NULL,
  foreman_phone VARCHAR(20),
  foreman_nss VARCHAR(11),
  foreman_experience_years INTEGER,

  -- Costos
  daily_rate DECIMAL(10,2), -- Costo por día (cuadrilla completa)
  unit_rate DECIMAL(10,2), -- Costo por m², ton, etc.
  unit_type VARCHAR(20), -- 'm2' | 'm3' | 'ton' | 'pza'

  -- Metadata
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crews_tenant ON hr.crews(tenant_id);
CREATE INDEX idx_crews_code ON hr.crews(crew_code);
CREATE INDEX idx_crews_status ON hr.crews(status);
```

### Tabla: `crew_members` (Integrantes de Cuadrilla)

```sql
CREATE TABLE hr.crew_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  crew_id UUID NOT NULL REFERENCES hr.crews(id),

  -- Datos del Integrante
  full_name VARCHAR(200) NOT NULL,
  trade_id UUID REFERENCES hr.trades(id),
  nss VARCHAR(11),
  phone VARCHAR(20),

  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'left'
  joined_date DATE,
  left_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crew_members_crew ON hr.crew_members(crew_id);
```

### Tabla: `trades` (Catálogo de Oficios)

```sql
CREATE TABLE hr.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Identificación
  trade_code VARCHAR(50) UNIQUE NOT NULL, -- OFICIO-001
  trade_name VARCHAR(100) NOT NULL,
  category VARCHAR(50), -- 'civil_work' | 'finishes' | 'installations' | 'machinery'

  -- Costos
  standard_daily_cost DECIMAL(10,2), -- Costo estándar día

  -- Certificaciones
  requires_certification BOOLEAN DEFAULT FALSE,
  required_certifications JSONB, -- Array de IDs de certificaciones requeridas

  -- Metadata
  description TEXT,
  is_obsolete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trades_tenant ON hr.trades(tenant_id);
```

### Tabla: `certifications` (Certificaciones y Capacitaciones)

```sql
CREATE TABLE hr.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),

  -- Tipo de Certificación
  certification_type VARCHAR(100) NOT NULL, -- 'NOM-009-STPS', 'Trabajos en Altura', etc.
  issuing_institution VARCHAR(200),
  certificate_number VARCHAR(100),

  -- Vigencia
  issue_date DATE NOT NULL,
  expiration_date DATE, -- NULL = permanente
  is_permanent BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'valid', -- 'valid' | 'expiring_soon' | 'expired'

  -- Documento
  document_url TEXT, -- PDF del certificado

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certifications_employee ON hr.certifications(employee_id);
CREATE INDEX idx_certifications_status ON hr.certifications(status);
CREATE INDEX idx_certifications_expiration ON hr.certifications(expiration_date);
```

### Tabla: `employee_project_assignments` (Asignaciones a Proyectos)

```sql
CREATE TABLE hr.employee_project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID REFERENCES hr.employees(id),
  crew_id UUID REFERENCES hr.crews(id),
  project_id UUID NOT NULL REFERENCES projects(id),

  -- Asignación
  assigned_role VARCHAR(100), -- 'Official Mason', 'Foreman', etc.
  work_front VARCHAR(100), -- Frente de trabajo
  assigned_date DATE NOT NULL,
  release_date DATE,

  -- Evaluación (al finalizar)
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
  evaluation_notes TEXT,
  evaluated_by UUID REFERENCES users(id),
  evaluation_date DATE,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraint: o es employee_id o crew_id, no ambos
  CHECK (
    (employee_id IS NOT NULL AND crew_id IS NULL) OR
    (employee_id IS NULL AND crew_id IS NOT NULL)
  )
);

CREATE INDEX idx_assignments_employee ON hr.employee_project_assignments(employee_id);
CREATE INDEX idx_assignments_crew ON hr.employee_project_assignments(crew_id);
CREATE INDEX idx_assignments_project ON hr.employee_project_assignments(project_id);
```

### Tabla: `employee_documents` (Documentos Digitales)

```sql
CREATE TABLE hr.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  employee_id UUID NOT NULL REFERENCES hr.employees(id),

  -- Documento
  document_type VARCHAR(50) NOT NULL, -- 'INE', 'CURP', 'RFC', 'contract', 'medical_cert'
  document_name VARCHAR(200) NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER, -- En bytes

  -- Versionado
  version INTEGER DEFAULT 1,
  is_latest BOOLEAN DEFAULT TRUE,

  -- Vigencia (si aplica)
  issue_date DATE,
  expiration_date DATE,

  -- Metadata
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_employee ON hr.employee_documents(employee_id);
CREATE INDEX idx_documents_type ON hr.employee_documents(document_type);
```

---

## 7. Integraciones

### INT-RRHH-001: Integración con Módulo de Compras (Proveedores)

- Al crear una cuadrilla subcontratada, se selecciona el **Subcontratista** desde el catálogo de proveedores del módulo de compras
- Esto permite trazabilidad: Proveedores → Subcontratos → Cuadrillas → Personal

### INT-RRHH-002: Integración con Módulo de Proyectos

- Los empleados y cuadrillas se asignan a **Proyectos** específicos
- La tabla `employee_project_assignments` vincula personal con proyectos
- Al completar un proyecto, se puede registrar evaluación de desempeño

### INT-RRHH-003: Integración con Módulo de Asistencias (MAI-007 RF-002)

- El catálogo de personal es la base para el módulo de Time & Attendance
- Solo empleados con status **Activo** pueden registrar asistencia
- Las certificaciones vencidas generan alertas en el módulo de asistencias

### INT-RRHH-004: Integración con Módulo de Costos (MAI-007 RF-004)

- Los costos estándar por oficio se utilizan para presupuestos de mano de obra
- El salario real de cada empleado se usa para costeo de mano de obra real
- Las tarifas de cuadrillas se imputan a partidas de obra

### INT-RRHH-005: Exportación a Sistema de Nómina Externo

El sistema debe poder exportar datos en formato **CSV o Excel** para sistemas de nómina externos:

**Campos exportados:**
- Código de empleado
- Nombre completo
- RFC, CURP, NSS
- Salario base diario
- Días trabajados (del periodo)
- Horas extra (si aplica)
- Bonos por productividad
- Descuentos IMSS, INFONAVIT
- Incidencias (faltas, retardos, permisos)

**Formato ejemplo:**
```csv
employee_code,full_name,rfc,nss,daily_wage,days_worked,overtime_hours,bonus,imss_discount,infonavit_discount,absences,tardies
EMP-00001,Juan Pérez Gómez,PEJG850315HDF,12345678901,550.00,26,8,500.00,45.50,450.00,0,2
EMP-00002,María González,GOGM900520MDF,98765432109,620.00,30,0,0,52.30,0,0,0
```

---

## 8. Reportes y Consultas

### REP-RRHH-001: Listado Maestro de Personal

**Descripción:** Reporte consolidado de todo el personal (empleados directos + cuadrillas)

**Filtros:**
- Status: Activos / Suspendidos / Baja
- Tipo: Directos / Subcontratados
- Oficio
- Proyecto asignado
- Certificaciones vencidas: Sí/No

**Columnas:**
- Código
- Nombre completo
- Oficio
- Status
- Proyecto actual
- Asistencia (últimos 30 días)
- Certificaciones próximas a vencer

**Exportación:** Excel, PDF, CSV

---

### REP-RRHH-002: Certificaciones por Vencer

**Descripción:** Alerta de certificaciones que vencen en los próximos 30/60/90 días

**Filtros:**
- Días para vencimiento: 30 / 60 / 90
- Tipo de certificación
- Oficio

**Columnas:**
- Empleado
- Oficio
- Certificación
- Fecha de vencimiento
- Días restantes
- Status: 🟢 Vigente / 🟡 Por vencer / 🔴 Vencida

**Exportación:** Excel, PDF

---

### REP-RRHH-003: Historial Laboral por Empleado

**Descripción:** Historial completo de proyectos, evaluaciones y asistencia de un empleado

**Secciones:**
1. **Datos generales** (nombre, oficio, antigüedad)
2. **Proyectos**:
   - Listado de proyectos donde ha trabajado
   - Fechas de inicio y fin
   - Rol desempeñado
   - Evaluación de desempeño (1-5 estrellas)
3. **Asistencia**:
   - Promedio de asistencia por año
   - Total de faltas, retardos, permisos
4. **Capacitaciones**:
   - Cursos tomados
   - Certificaciones obtenidas
   - Horas de capacitación

**Exportación:** PDF

---

### REP-RRHH-004: Análisis de Rotación de Personal

**Descripción:** Análisis de bajas, altas y rotación mensual

**Métricas:**
- Altas del mes
- Bajas del mes
- Tasa de rotación: (Bajas / Plantilla promedio) × 100
- Antigüedad promedio de empleados dados de baja
- Motivos de baja (renuncia voluntaria, despido, fin de contrato)

**Gráficos:**
- Línea de tiempo: Altas vs Bajas por mes
- Pie chart: Motivos de baja

**Exportación:** Excel, PDF

---

### REP-RRHH-005: Cumplimiento Normativo (Auditoría IMSS/STPS)

**Descripción:** Reporte para auditorías externas con datos de cumplimiento

**Datos incluidos:**
- Total de empleados registrados en IMSS
- Empleados con NSS válido: X / Total
- Empleados con certificaciones vigentes para trabajos de riesgo
- Empleados sin expediente completo (faltan documentos)
- Cuadrillas subcontratadas con contratos vigentes

**Cumplimiento:**
- 🟢 100% cumplimiento: Todos los datos completos
- 🟡 95-99% cumplimiento: Faltan documentos menores
- 🔴 <95% cumplimiento: Deficiencias importantes

**Exportación:** PDF (para auditor externo)

---

## 9. Requerimientos No Funcionales

### RNF-RRHH-001: Seguridad y Privacidad

- **Encriptación:** Los datos sensibles (NSS, RFC, CURP, salarios) deben estar encriptados en base de datos (AES-256)
- **Control de acceso:** Roles y permisos estrictos por tipo de usuario (ver RN-RRHH-008)
- **Bitácora de auditoría:** Registrar quién accedió a datos sensibles y cuándo
- **Cumplimiento LFPDPPP:** Aviso de privacidad firmado por cada empleado

### RNF-RRHH-002: Performance

- La búsqueda de empleados en catálogo debe responder en **< 500 ms** (hasta 10,000 registros)
- La carga de historial completo de empleado debe responder en **< 1 segundo**
- Los reportes de certificaciones deben generarse en **< 2 segundos**

### RNF-RRHH-003: Usabilidad

- La interfaz debe ser **responsive** (desktop, tablet, móvil)
- El formulario de alta de empleado debe tener **validación en tiempo real** (RFC, CURP, NSS)
- Los campos obligatorios deben estar **claramente marcados** con asterisco (*)
- Debe haber **ayudas contextuales** (tooltips) para campos complejos

### RNF-RRHH-004: Escalabilidad

- El sistema debe soportar **hasta 50,000 empleados** por tenant
- El sistema debe soportar **hasta 5,000 cuadrillas** por tenant
- El sistema debe soportar **hasta 1 millón de registros** en historial de asignaciones

### RNF-RRHH-005: Disponibilidad

- El catálogo de personal debe tener disponibilidad **99.5%** (downtime máximo: 3.65 horas/mes)
- En caso de falla, el sistema debe permitir **modo de solo lectura** para consultas críticas

---

## 10. Criterios de Aceptación

### CA-RRHH-001: Alta de Empleado Directo

- [ ] Puedo registrar un empleado directo con todos los datos personales, laborales y legales
- [ ] El sistema valida RFC, CURP y NSS con algoritmos correctos
- [ ] El sistema genera código único secuencial (EMP-2025-00001)
- [ ] Puedo adjuntar documentos PDF/imagen (máx 5MB cada uno)
- [ ] El sistema alerta si hay duplicado por NSS o RFC
- [ ] Puedo guardar como "borrador" si faltan datos opcionales
- [ ] El empleado queda disponible para asignar a proyectos

### CA-RRHH-002: Registro de Cuadrilla

- [ ] Puedo crear una cuadrilla con jefe + mínimo 1 integrante
- [ ] Puedo agregar hasta 15 integrantes por cuadrilla
- [ ] El sistema genera código único (CUAD-2025-00001)
- [ ] Puedo definir tarifa: por día, por m², o precio alzado
- [ ] El sistema vincula la cuadrilla con el proveedor subcontratista
- [ ] Puedo asignar la cuadrilla a un proyecto
- [ ] Cada integrante puede registrar asistencia individual

### CA-RRHH-003: Gestión de Certificaciones

- [ ] Puedo agregar certificaciones con vigencia (fecha inicio, fecha fin)
- [ ] Puedo subir PDF del certificado
- [ ] El sistema calcula automáticamente la fecha de vencimiento
- [ ] El sistema me envía recordatorio 30 días antes del vencimiento
- [ ] Puedo ver listado de certificaciones vencidas/por vencer
- [ ] El sistema alerta si asigno empleado a obra que requiere certificación vencida

### CA-RRHH-004: Historial Laboral

- [ ] Puedo ver historial completo de proyectos del empleado
- [ ] Puedo ver fechas de inicio y fin en cada proyecto
- [ ] Puedo registrar evaluación de desempeño (1-5 estrellas) al finalizar proyecto
- [ ] Puedo ver promedio de asistencia de los últimos 12 meses
- [ ] Puedo ver total de capacitaciones y certificaciones

### CA-RRHH-005: Catálogo de Oficios

- [ ] Puedo crear nuevos oficios con costo estándar
- [ ] Puedo marcar oficios que requieren certificación obligatoria
- [ ] Puedo asignar categoría al oficio (obra civil, instalaciones, acabados)
- [ ] Puedo marcar oficios como "obsoletos" sin eliminarlos
- [ ] El oficio queda disponible para asignar a empleados

### CA-RRHH-006: Reportes

- [ ] Puedo generar reporte de personal activo con filtros
- [ ] Puedo generar reporte de certificaciones por vencer
- [ ] Puedo exportar a Excel, PDF, CSV
- [ ] Los reportes se generan en menos de 3 segundos

---

## 11. Dependencias

### Dependencias de Otros Módulos

- **MAI-001 (Fundamentos):** Autenticación, roles y permisos, tenants
- **MAI-002 (Proyectos):** Catálogo de proyectos para asignar personal
- **MAI-004 (Compras):** Catálogo de proveedores para subcontratistas

### Módulos que Dependen de Este

- **MAI-007 RF-002 (Time & Attendance):** Requiere catálogo de personal completo
- **MAI-007 RF-003 (Nómina):** Requiere salarios, jornadas, incidencias
- **MAI-007 RF-004 (Costos):** Requiere tarifas de oficios y cuadrillas
- **MAI-003 (Presupuestos):** Requiere costos estándar de oficios

---

## 12. Riesgos y Mitigaciones

### Riesgo 1: Datos Personales Sensibles (Alto)

**Descripción:** Manejo de datos personales (RFC, NSS, salarios) expone a riesgos legales si hay fuga de información.

**Impacto:** Alto - Multas legales, pérdida de confianza, demandas

**Mitigación:**
- ✅ Encriptación AES-256 en base de datos
- ✅ Control de acceso estricto por roles
- ✅ Bitácora de auditoría de accesos
- ✅ Aviso de privacidad firmado por empleados
- ✅ Cumplimiento LFPDPPP (Ley de Protección de Datos - México)

---

### Riesgo 2: Duplicados de Empleados (Medio)

**Descripción:** Registrar 2 veces al mismo empleado con datos ligeramente diferentes.

**Impacto:** Medio - Inconsistencias en reportes, problemas con IMSS, nómina duplicada

**Mitigación:**
- ✅ Validación estricta de unicidad por NSS y RFC
- ✅ Búsqueda fuzzy al capturar nombre (detectar nombres similares)
- ✅ Alerta al usuario si existe registro similar

---

### Riesgo 3: Certificaciones Vencidas (Medio)

**Descripción:** Empleados trabajando en actividades de riesgo con certificaciones vencidas.

**Impacto:** Medio - Multas STPS, riesgo de accidentes, responsabilidad legal

**Mitigación:**
- ✅ Sistema de recordatorios automáticos 30 días antes
- ✅ Alertas al asignar a obra si falta certificación
- ✅ Reporte semanal a Director de RRHH con certificaciones vencidas
- ✅ Bloqueo opcional de asistencia si certificación vencida (configurable)

---

### Riesgo 4: Escalabilidad (Bajo)

**Descripción:** Con miles de empleados, el catálogo puede volverse lento.

**Impacto:** Bajo - Experiencia de usuario degradada

**Mitigación:**
- ✅ Índices en base de datos (tenant_id, employee_code, status)
- ✅ Paginación en listados (máx 50 registros por página)
- ✅ Búsqueda con debounce (esperar 300ms antes de buscar)
- ✅ Cache de datos frecuentes (catálogo de oficios)

---

## 13. Estimación de Esfuerzo

| Componente | Esfuerzo (días) | Complejidad |
|------------|-----------------|-------------|
| **Base de datos** (6 tablas + índices) | 2 | Media |
| **Backend API** (CRUD empleados, cuadrillas, certificaciones) | 4 | Media |
| **Frontend Web** (catálogo, formularios, detalle) | 5 | Alta |
| **Validaciones** (RFC, CURP, NSS, duplicados) | 2 | Media |
| **Gestión de documentos** (upload, versionado) | 2 | Media |
| **Historial laboral** (asignaciones, evaluaciones) | 2 | Baja |
| **Reportes** (5 reportes + exportación) | 3 | Media |
| **Integraciones** (proyectos, proveedores) | 1 | Baja |
| **Testing** (unitario + integración) | 2 | Media |
| **Documentación** (API, usuario final) | 1 | Baja |
| **TOTAL** | **24 días** | **~5 Story Points** |

**Equipo recomendado:**
- 1 Backend Developer
- 1 Frontend Developer
- 1 QA Tester
- 1 Product Owner (revisiones)

**Tiempo estimado:** ~5 semanas (1 sprint)

---

## 14. Anexos

### Anexo A: Algoritmos de Validación

#### Validación de RFC (México)

```typescript
function validateRFC(rfc: string): boolean {
  // RFC Personas Físicas: 13 caracteres (PEJG850315HDF001)
  const rfcPattern = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/;

  if (!rfcPattern.test(rfc)) {
    return false;
  }

  // Validar checksum (homoclave)
  const diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ";
  let suma = 0;

  for (let i = 0; i < 12; i++) {
    suma += diccionario.indexOf(rfc.charAt(i)) * (13 - i);
  }

  const digitoVerificador = 11 - (suma % 11);
  const dvEsperado = digitoVerificador === 10 ? 'A' : digitoVerificador === 11 ? '0' : digitoVerificador.toString();

  return rfc.charAt(12) === dvEsperado;
}
```

#### Validación de CURP (México)

```typescript
function validateCURP(curp: string): boolean {
  // CURP: 18 caracteres (PEJG850315HDFRMN02)
  const curpPattern = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/;

  if (!curpPattern.test(curp)) {
    return false;
  }

  // Validar checksum (dígito verificador)
  const diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let suma = 0;

  for (let i = 0; i < 17; i++) {
    suma += diccionario.indexOf(curp.charAt(i)) * (18 - i);
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;

  return parseInt(curp.charAt(17)) === digitoVerificador;
}
```

#### Validación de NSS (México)

```typescript
function validateNSS(nss: string): boolean {
  // NSS: 11 dígitos numéricos
  const nssPattern = /^\d{11}$/;

  if (!nssPattern.test(nss)) {
    return false;
  }

  // Validar checksum (algoritmo Luhn)
  let suma = 0;
  for (let i = 0; i < 10; i++) {
    let digito = parseInt(nss.charAt(i));
    if (i % 2 === 0) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;

  return parseInt(nss.charAt(10)) === digitoVerificador;
}
```

---

### Anexo B: Catálogo de Oficios Estándar (México - Construcción)

| Código | Oficio | Categoría | Costo Estándar/Día | Cert. Requerida |
|--------|--------|-----------|-------------------|-----------------|
| OF-001 | Albañil | Obra Civil | $550 | NOM-031 |
| OF-002 | Fierrero (Armador) | Obra Civil | $600 | NOM-031 |
| OF-003 | Carpintero | Acabados | $580 | - |
| OF-004 | Plomero | Instalaciones | $620 | Certificación Plomería |
| OF-005 | Electricista | Instalaciones | $650 | Cert. Instalaciones Eléctricas |
| OF-006 | Pintor | Acabados | $520 | - |
| OF-007 | Yesero | Acabados | $530 | - |
| OF-008 | Operador Maquinaria | Maquinaria | $800 | Licencia + Curso Seguridad |
| OF-009 | Maestro de Obra | Supervisión | $900 | NOM-031 |
| OF-010 | Ayudante General | Apoyo | $400 | - |
| OF-011 | Soldador | Estructura Metálica | $700 | AWS Cert. |
| OF-012 | Instalador Cancelería | Acabados | $560 | Curso Aluminio/Vidrio |
| OF-013 | Impermeabilizador | Acabados | $600 | - |
| OF-014 | Instalador Drywall | Acabados | $550 | - |
| OF-015 | Colocador de Pisos | Acabados | $540 | - |

---

**Versión:** 1.0
**Fecha:** 2025-11-17
**Próxima revisión:** 2025-12-01
**Estado:** ✅ Aprobado para implementación
