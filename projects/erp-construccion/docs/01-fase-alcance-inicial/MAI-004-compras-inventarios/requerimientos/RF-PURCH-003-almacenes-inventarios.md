# RF-PURCH-003: Almacenes y Control de Inventarios

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Sistema multi-almacén con control de entradas, salidas, traspasos, devoluciones y ajustes de inventario. Incluye trazabilidad completa, valorización por método PEPS y control por ubicaciones.

---

## 2. Objetivos de Negocio

- **Control:** Inventario exacto en tiempo real
- **Reducción de pérdidas:** Mermas <2% del valor total
- **Optimización:** Stock justo (ni exceso ni faltantes)
- **Trazabilidad:** Cada movimiento rastreado a proyecto/partida

---

## 3. Alcance Funcional

### 3.1 Estructura de Almacenes

**Tipos de Almacén:**
```
1. Almacén General (Oficina Central)
   - Materiales comunes
   - Stock para múltiples obras
   - Control estricto

2. Almacenes de Obra (1 por proyecto)
   - Materiales específicos del proyecto
   - Control por residente
   - Semiautomático

3. Almacenes Temporales
   - Áreas de obra temporales
   - Sin control estricto (registro manual)
```

**Ejemplo:**
```
┌──────────────────────────────────────┐
│ ALMACENES ACTIVOS (5)                │
├──────────────────────────────────────┤
│ 📦 Almacén General                   │
│    Ubicación: Oficina Central        │
│    Items: 1,247                      │
│    Valor: $8,450,000                 │
│                                      │
│ 🏗️ Fracc. Los Pinos - Almacén Obra  │
│    Proyecto: Los Pinos               │
│    Items: 342                        │
│    Valor: $1,850,000                 │
│                                      │
│ 🏗️ Torre Central - Almacén Obra     │
│    Proyecto: Torre Central           │
│    Items: 198                        │
│    Valor: $980,000                   │
└──────────────────────────────────────┘
```

### 3.2 Tipos de Movimientos

#### A. Entradas de Almacén
**Fuentes:**
1. **Recepción de OC:** Entrada desde proveedor
2. **Traspaso de otro almacén**
3. **Devolución de obra** (material no usado)
4. **Ajuste positivo** (corrección de inventario)

**Ejemplo Entrada desde OC:**
```
ENTRADA #ENT-2025-00234
Fecha: 20/Nov/2025
Almacén: Fracc. Los Pinos
Origen: OC-2025-00145 (Cemex)

┌──────────────────┬────────┬────────┬──────────┐
│ Material         │ Cant.  │ PU     │ Total    │
├──────────────────┼────────┼────────┼──────────┤
│ Cemento CPC 30R  │ 80 ton │ $4,350 │ $348,000 │
│ Grava 3/4"       │ 85 m³  │ $380   │ $32,300  │
└──────────────────┴────────┴────────┴──────────┘

Recibió: Almacenista José García
Documentos: Remisión R-12345, Factura A-12345
```

#### B. Salidas de Almacén
**Destinos:**
1. **Consumo en obra:** Asignado a partida presupuestal
2. **Traspaso a otro almacén**
3. **Devolución a proveedor** (material defectuoso)
4. **Baja por merma/robo**

**Ejemplo Salida para Obra:**
```
SALIDA #SAL-2025-00456
Fecha: 21/Nov/2025
Almacén: Fracc. Los Pinos
Destino: Cimentación Etapa 2

┌──────────────────┬────────┬──────────────────┐
│ Material         │ Cant.  │ Partida Presup.  │
├──────────────────┼────────┼──────────────────┤
│ Cemento CPC 30R  │ 15 ton │ 02-Cimentación   │
│ Grava 3/4"       │ 20 m³  │ 02-Cimentación   │
│ Arena            │ 25 m³  │ 02-Cimentación   │
└──────────────────┴────────┴──────────────────┘

Autorizó: Ing. Pedro Ramírez (Residente)
Vale: VALE-2025-789
```

#### C. Traspasos
```
TRASPASO #TRA-2025-00078
Fecha: 22/Nov/2025
Origen: Almacén General
Destino: Fracc. Los Pinos

Material: Varilla 3/8" fy=4200
Cantidad: 500 kg
Motivo: Faltante en obra

Status:
  ✓ Salida de Almacén General
  ⏳ En tránsito
  ⬜ Recibido en Los Pinos
```

### 3.3 Valorización de Inventario

**Método PEPS (Primeras Entradas, Primeras Salidas):**
```
Ejemplo Cemento CPC 30R:

Entradas:
  01/Nov: 100 ton @ $4,200 = $420,000
  15/Nov: 120 ton @ $4,350 = $522,000
  ──────────────────────────────────
  Total: 220 ton, Valor: $942,000

Salida 21/Nov: 150 ton
  Consume primero: 100 ton @ $4,200 = $420,000
  Consume después:  50 ton @ $4,350 = $217,500
  ──────────────────────────────────
  Costo salida: $637,500

Inventario Restante:
  70 ton @ $4,350 = $304,500
```

### 3.4 Ubicaciones y Zonas

**Almacén con Ubicaciones:**
```
Almacén General:
├─ Zona A (Cementantes)
│  ├─ A-01: Cemento CPC 30R
│  ├─ A-02: Cemento blanco
│  └─ A-03: Cal hidratada
├─ Zona B (Agregados)
│  ├─ B-01: Grava 3/4"
│  ├─ B-02: Arena
│  └─ B-03: Tezontle
└─ Zona C (Acero)
   ├─ C-01: Varilla 3/8"
   ├─ C-02: Varilla 1/2"
   └─ C-03: Varilla 5/8"
```

**Beneficios:**
- Localización rápida
- Control de espacio
- Inventarios cíclicos por zona

### 3.5 Inventario Físico

**Proceso:**
1. **Programar conteo:** Mensual/trimestral
2. **Generar listas** por zona
3. **Conteo físico** (1 o 2 personas)
4. **Captura de cantidades**
5. **Comparación:** Físico vs Sistema
6. **Ajustes** (con autorización)

**Ejemplo:**
```
INVENTARIO FÍSICO #IF-2025-11
Almacén: Fracc. Los Pinos
Fecha: 30/Nov/2025
Responsable: José García

┌──────────────┬─────────┬──────────┬──────────┬────────┐
│ Material     │ Sistema │ Físico   │ Diferenc.│ Status │
├──────────────┼─────────┼──────────┼──────────┼────────┤
│ Cemento CPC  │ 70 ton  │ 68 ton   │ -2 ton   │ ⚠️ -2.9%│
│ Grava 3/4"   │ 65 m³   │ 65 m³    │ 0        │ ✓ OK   │
│ Varilla 3/8" │ 850 kg  │ 900 kg   │ +50 kg   │ ⚠️ +5.9%│
└──────────────┴─────────┴──────────┴──────────┴────────┘

Ajustes requeridos:
  • Cemento: Baja 2 ton (merma)
  • Varilla: Alta 50 kg (no registrada)

Autorización: Gerente Operaciones
```

---

## 4. Casos de Uso Principales

### CU-001: Registrar Entrada desde OC
**Actor:** Almacenista
**Flujo:**
1. Proveedor llega con material
2. Almacenista busca OC-2025-00145
3. Verifica material contra remisión
4. Registra entrada parcial: 80 ton (de 120 ordenadas)
5. Sistema:
   - Crea movimiento ENT-2025-00234
   - Actualiza inventario: +80 ton
   - Valoriza: $4,350/ton
   - Actualiza status OC: Parcialmente recibida
6. Imprime comprobante de entrada

### CU-002: Salida de Material para Obra
**Actor:** Residente
**Flujo:**
1. Solicita material para cimentación
2. Almacenista verifica existencia
3. Registra salida: 15 ton cemento
4. Vincula a partida: 02-Cimentación
5. Sistema:
   - Valora salida por PEPS
   - Reduce inventario
   - Afecta costo real del proyecto
   - Genera vale de salida
6. Residente firma vale

### CU-003: Traspaso entre Almacenes
**Actor:** Gerente de Almacén
**Flujo:**
1. Obra Los Pinos requiere varilla urgente
2. Verifica: Almacén General tiene stock
3. Crea traspaso: 500 kg
4. Almacenista General prepara material
5. Transporta a obra
6. Almacenista Obra recibe y confirma
7. Sistema completa traspaso

---

## 5. Modelo de Datos

```typescript
// warehouses
{
  id: UUID,
  code: VARCHAR(20),
  name: VARCHAR(255),
  type: ENUM('general', 'project', 'temporary'),
  projectId: UUID NULLABLE,
  address: TEXT,
  managedBy: UUID,
  isActive: BOOLEAN,
}

// warehouse_locations
{
  id: UUID,
  warehouseId: UUID,
  zone: VARCHAR(10), // A, B, C
  position: VARCHAR(10), // 01, 02, 03
  code: VARCHAR(20), // A-01
  description: VARCHAR(255),
}

// inventory_movements
{
  id: UUID,
  code: VARCHAR(20),
  warehouseId: UUID,
  movementType: ENUM('entry', 'exit', 'transfer_out', 'transfer_in', 'adjustment'),
  movementDate: DATE,
  
  sourceType: ENUM('purchase_order', 'transfer', 'return', 'adjustment'),
  sourceId: UUID,
  
  projectId: UUID NULLABLE,
  budgetItemId: UUID NULLABLE,
  
  items: JSONB, // [{materialId, quantity, unitCost, totalCost, lotId}]
  totalValue: DECIMAL(15,2),
  
  notes: TEXT,
  authorizedBy: UUID,
  recordedBy: UUID,
}

// inventory_stock
{
  id: UUID,
  warehouseId: UUID,
  materialId: UUID,
  locationId: UUID NULLABLE,
  
  quantity: DECIMAL(12,4),
  reservedQuantity: DECIMAL(12,4),
  availableQuantity: DECIMAL(12,4), // quantity - reserved
  
  averageCost: DECIMAL(12,2),
  totalValue: DECIMAL(15,2),
  
  lastMovementDate: DATE,
  updatedAt: TIMESTAMP,
}

// inventory_lots (para PEPS)
{
  id: UUID,
  warehouseId: UUID,
  materialId: UUID,
  
  lotNumber: VARCHAR(50),
  entryDate: DATE,
  quantity: DECIMAL(12,4),
  remainingQuantity: DECIMAL(12,4),
  unitCost: DECIMAL(12,2),
  
  sourceType: VARCHAR(20),
  sourceId: UUID,
}
```

---

## 6. Criterios de Aceptación

- [ ] Multi-almacén (general + por obra)
- [ ] 4 tipos de movimientos (entrada, salida, traspaso, ajuste)
- [ ] Valorización PEPS
- [ ] Ubicaciones por zona
- [ ] Inventario físico con ajustes
- [ ] Reservas de material
- [ ] Trazabilidad completa
- [ ] Dashboard de stock por almacén
- [ ] Reportes de movimientos

---

**Estado:** ✅ Ready for Development
