# ET-PURCH-003: Implementación de Almacenes e Inventarios

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
CREATE SCHEMA IF NOT EXISTS inventory;

-- Tabla: warehouses
CREATE TABLE inventory.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),

  name VARCHAR(255) NOT NULL,
  warehouse_type VARCHAR(20) DEFAULT 'general' CHECK (warehouse_type IN ('general', 'project', 'temporary')),

  project_id UUID REFERENCES projects.projects(id),

  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),

  managed_by UUID REFERENCES auth.users(id),

  total_area DECIMAL(10,2),
  covered_area DECIMAL(10,2),

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT warehouse_project_check CHECK (
    (warehouse_type = 'project' AND project_id IS NOT NULL) OR
    (warehouse_type != 'project' AND project_id IS NULL)
  )
);

CREATE INDEX idx_warehouses_constructora ON inventory.warehouses(constructora_id);
CREATE INDEX idx_warehouses_type ON inventory.warehouses(warehouse_type);
CREATE INDEX idx_warehouses_project ON inventory.warehouses(project_id);


-- Tabla: warehouse_locations
CREATE TABLE inventory.warehouse_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE CASCADE,

  zone VARCHAR(10) NOT NULL, -- A, B, C
  position VARCHAR(10) NOT NULL, -- 01, 02, 03
  code VARCHAR(20) NOT NULL, -- A-01, B-03

  description VARCHAR(255),
  capacity_m3 DECIMAL(10,2),

  is_active BOOLEAN DEFAULT true,

  CONSTRAINT unique_warehouse_location UNIQUE (warehouse_id, code)
);

CREATE INDEX idx_locations_warehouse ON inventory.warehouse_locations(warehouse_id);


-- Tabla: inventory_movements
CREATE TABLE inventory.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),

  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entry', 'exit', 'transfer_out', 'transfer_in', 'adjustment')),
  movement_date DATE DEFAULT CURRENT_DATE,

  -- Origen del movimiento
  source_type VARCHAR(30) CHECK (source_type IN ('purchase_order', 'transfer', 'return', 'adjustment', 'production')),
  source_id UUID,

  -- Para salidas
  project_id UUID REFERENCES projects.projects(id),
  budget_item_id UUID,

  -- Para traspasos
  transfer_to_warehouse_id UUID REFERENCES inventory.warehouses(id),
  transfer_from_warehouse_id UUID REFERENCES inventory.warehouses(id),

  items JSONB NOT NULL,
  /* Estructura items:
  [{
    materialId: UUID,
    quantity: number,
    unit: string,
    unitCost: number,
    totalCost: number,
    lotId: UUID,
    locationId: UUID
  }]
  */

  total_value DECIMAL(15,2) NOT NULL,

  notes TEXT,
  authorized_by UUID REFERENCES auth.users(id),
  recorded_by UUID NOT NULL REFERENCES auth.users(id),

  -- Para traspasos
  transfer_status VARCHAR(20) CHECK (transfer_status IN ('pending', 'in_transit', 'received', 'cancelled')),
  received_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movements_warehouse ON inventory.inventory_movements(warehouse_id);
CREATE INDEX idx_movements_type ON inventory.inventory_movements(movement_type);
CREATE INDEX idx_movements_date ON inventory.inventory_movements(movement_date);
CREATE INDEX idx_movements_project ON inventory.inventory_movements(project_id);
CREATE INDEX idx_movements_source ON inventory.inventory_movements(source_type, source_id);


-- Tabla: inventory_stock
CREATE TABLE inventory.inventory_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  material_id UUID NOT NULL,
  location_id UUID REFERENCES inventory.warehouse_locations(id),

  quantity DECIMAL(12,4) NOT NULL DEFAULT 0,
  reserved_quantity DECIMAL(12,4) DEFAULT 0,
  available_quantity DECIMAL(12,4) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,

  average_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_value DECIMAL(15,2) GENERATED ALWAYS AS (quantity * average_cost) STORED,

  last_movement_date DATE,
  last_entry_date DATE,
  last_exit_date DATE,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_warehouse_material UNIQUE (warehouse_id, material_id),
  CONSTRAINT check_quantity_positive CHECK (quantity >= 0),
  CONSTRAINT check_reserved_valid CHECK (reserved_quantity >= 0 AND reserved_quantity <= quantity)
);

CREATE INDEX idx_stock_warehouse ON inventory.inventory_stock(warehouse_id);
CREATE INDEX idx_stock_material ON inventory.inventory_stock(material_id);
CREATE INDEX idx_stock_location ON inventory.inventory_stock(location_id);
CREATE INDEX idx_stock_last_movement ON inventory.inventory_stock(last_movement_date);


-- Tabla: inventory_lots (PEPS)
CREATE TABLE inventory.inventory_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  material_id UUID NOT NULL,

  lot_number VARCHAR(50),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,

  quantity DECIMAL(12,4) NOT NULL,
  remaining_quantity DECIMAL(12,4) NOT NULL,
  unit_cost DECIMAL(12,2) NOT NULL,

  source_type VARCHAR(30) NOT NULL,
  source_id UUID NOT NULL,

  is_depleted BOOLEAN GENERATED ALWAYS AS (remaining_quantity <= 0) STORED,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_remaining_valid CHECK (remaining_quantity >= 0 AND remaining_quantity <= quantity)
);

CREATE INDEX idx_lots_warehouse_material ON inventory.inventory_lots(warehouse_id, material_id, entry_date);
CREATE INDEX idx_lots_depleted ON inventory.inventory_lots(is_depleted) WHERE is_depleted = false;


-- Tabla: physical_inventories
CREATE TABLE inventory.physical_inventories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),

  inventory_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),

  counted_by UUID[] NOT NULL,
  supervised_by UUID REFERENCES auth.users(id),

  total_items INTEGER DEFAULT 0,
  items_counted INTEGER DEFAULT 0,
  items_with_variance INTEGER DEFAULT 0,

  total_variance_value DECIMAL(15,2) DEFAULT 0,

  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_physical_inv_warehouse ON inventory.physical_inventories(warehouse_id);
CREATE INDEX idx_physical_inv_date ON inventory.physical_inventories(inventory_date);


-- Tabla: physical_inventory_items
CREATE TABLE inventory.physical_inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  physical_inventory_id UUID NOT NULL REFERENCES inventory.physical_inventories(id) ON DELETE CASCADE,
  material_id UUID NOT NULL,

  system_quantity DECIMAL(12,4) NOT NULL,
  physical_quantity DECIMAL(12,4),
  variance DECIMAL(12,4) GENERATED ALWAYS AS (physical_quantity - system_quantity) STORED,
  variance_percentage DECIMAL(6,2),

  unit_cost DECIMAL(12,2) NOT NULL,
  variance_value DECIMAL(15,2) GENERATED ALWAYS AS (variance * unit_cost) STORED,

  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'counted', 'verified', 'adjusted')),

  counted_by UUID REFERENCES auth.users(id),
  counted_at TIMESTAMP,

  notes TEXT,

  CONSTRAINT unique_inventory_material UNIQUE (physical_inventory_id, material_id)
);

CREATE INDEX idx_physical_items_inventory ON inventory.physical_inventory_items(physical_inventory_id);
CREATE INDEX idx_physical_items_variance ON inventory.physical_inventory_items(variance) WHERE variance != 0;


-- Función: Actualizar stock al crear movimiento
CREATE OR REPLACE FUNCTION inventory.update_stock_on_movement()
RETURNS TRIGGER AS $$
DECLARE
  v_item JSONB;
  v_material_id UUID;
  v_quantity DECIMAL(12,4);
  v_unit_cost DECIMAL(12,2);
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    v_material_id := (v_item->>'materialId')::UUID;
    v_quantity := (v_item->>'quantity')::DECIMAL(12,4);
    v_unit_cost := (v_item->>'unitCost')::DECIMAL(12,2);

    IF NEW.movement_type IN ('entry', 'transfer_in') THEN
      -- Entrada: Incrementar stock
      INSERT INTO inventory.inventory_stock (
        warehouse_id, material_id, quantity, average_cost, last_movement_date, last_entry_date
      )
      VALUES (
        NEW.warehouse_id, v_material_id, v_quantity, v_unit_cost, NEW.movement_date, NEW.movement_date
      )
      ON CONFLICT (warehouse_id, material_id)
      DO UPDATE SET
        quantity = inventory_stock.quantity + v_quantity,
        average_cost = ((inventory_stock.quantity * inventory_stock.average_cost) + (v_quantity * v_unit_cost)) /
                       (inventory_stock.quantity + v_quantity),
        last_movement_date = NEW.movement_date,
        last_entry_date = NEW.movement_date,
        updated_at = CURRENT_TIMESTAMP;

      -- Crear lote PEPS
      INSERT INTO inventory.inventory_lots (
        warehouse_id, material_id, lot_number, entry_date,
        quantity, remaining_quantity, unit_cost, source_type, source_id
      ) VALUES (
        NEW.warehouse_id, v_material_id, NEW.code, NEW.movement_date,
        v_quantity, v_quantity, v_unit_cost, NEW.source_type, NEW.source_id
      );

    ELSIF NEW.movement_type IN ('exit', 'transfer_out') THEN
      -- Salida: Decrementar stock usando PEPS
      PERFORM inventory.process_exit_peps(NEW.warehouse_id, v_material_id, v_quantity);

      UPDATE inventory.inventory_stock
      SET
        quantity = quantity - v_quantity,
        last_movement_date = NEW.movement_date,
        last_exit_date = NEW.movement_date,
        updated_at = CURRENT_TIMESTAMP
      WHERE warehouse_id = NEW.warehouse_id AND material_id = v_material_id;

    ELSIF NEW.movement_type = 'adjustment' THEN
      -- Ajuste: Modificar directamente
      UPDATE inventory.inventory_stock
      SET
        quantity = quantity + v_quantity, -- puede ser negativo
        last_movement_date = NEW.movement_date,
        updated_at = CURRENT_TIMESTAMP
      WHERE warehouse_id = NEW.warehouse_id AND material_id = v_material_id;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock
AFTER INSERT ON inventory.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION inventory.update_stock_on_movement();


-- Función: Procesar salida PEPS
CREATE OR REPLACE FUNCTION inventory.process_exit_peps(
  p_warehouse_id UUID,
  p_material_id UUID,
  p_quantity DECIMAL(12,4)
)
RETURNS VOID AS $$
DECLARE
  v_lot RECORD;
  v_remaining DECIMAL(12,4);
  v_to_consume DECIMAL(12,4);
BEGIN
  v_remaining := p_quantity;

  FOR v_lot IN
    SELECT * FROM inventory.inventory_lots
    WHERE warehouse_id = p_warehouse_id
      AND material_id = p_material_id
      AND remaining_quantity > 0
    ORDER BY entry_date ASC, created_at ASC
  LOOP
    EXIT WHEN v_remaining <= 0;

    v_to_consume := LEAST(v_lot.remaining_quantity, v_remaining);

    UPDATE inventory.inventory_lots
    SET remaining_quantity = remaining_quantity - v_to_consume
    WHERE id = v_lot.id;

    v_remaining := v_remaining - v_to_consume;
  END LOOP;

  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para material % en almacén %', p_material_id, p_warehouse_id;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- Función: Generar código de movimiento
CREATE OR REPLACE FUNCTION inventory.generate_movement_code()
RETURNS TRIGGER AS $$
DECLARE
  v_prefix VARCHAR(5);
  v_year VARCHAR(4);
  v_sequence INTEGER;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  v_prefix := CASE NEW.movement_type
    WHEN 'entry' THEN 'ENT'
    WHEN 'exit' THEN 'SAL'
    WHEN 'transfer_out' THEN 'TRA'
    WHEN 'transfer_in' THEN 'TRA'
    WHEN 'adjustment' THEN 'AJU'
  END;

  SELECT COALESCE(MAX(SUBSTRING(code FROM LENGTH(v_prefix) + 6)::INTEGER), 0) + 1
  INTO v_sequence
  FROM inventory.inventory_movements
  WHERE code LIKE v_prefix || '-' || v_year || '-%';

  NEW.code := v_prefix || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 5, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_movement_code
BEFORE INSERT ON inventory.inventory_movements
FOR EACH ROW
WHEN (NEW.code IS NULL)
EXECUTE FUNCTION inventory.generate_movement_code();
```

## 2. TypeORM Entities

```typescript
@Entity('warehouses', { schema: 'inventory' })
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'warehouse_type', default: 'general' })
  warehouseType: 'general' | 'project' | 'temporary';

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ name: 'managed_by', nullable: true })
  managedBy: string;

  @Column({ name: 'total_area', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalArea: number;

  @Column({ name: 'covered_area', type: 'decimal', precision: 10, scale: 2, nullable: true })
  coveredArea: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WarehouseLocation, location => location.warehouse)
  locations: WarehouseLocation[];

  @OneToMany(() => InventoryStock, stock => stock.warehouse)
  stock: InventoryStock[];
}


@Entity('warehouse_locations', { schema: 'inventory' })
export class WarehouseLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ length: 10 })
  zone: string;

  @Column({ length: 10 })
  position: string;

  @Column({ length: 20 })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'capacity_m3', type: 'decimal', precision: 10, scale: 2, nullable: true })
  capacityM3: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Warehouse, warehouse => warehouse.locations)
  warehouse: Warehouse;
}


@Entity('inventory_movements', { schema: 'inventory' })
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'movement_type' })
  movementType: 'entry' | 'exit' | 'transfer_out' | 'transfer_in' | 'adjustment';

  @Column({ name: 'movement_date', type: 'date', default: () => 'CURRENT_DATE' })
  movementDate: Date;

  @Column({ name: 'source_type', nullable: true })
  sourceType: 'purchase_order' | 'transfer' | 'return' | 'adjustment' | 'production';

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ name: 'budget_item_id', nullable: true })
  budgetItemId: string;

  @Column({ name: 'transfer_to_warehouse_id', nullable: true })
  transferToWarehouseId: string;

  @Column({ name: 'transfer_from_warehouse_id', nullable: true })
  transferFromWarehouseId: string;

  @Column({ type: 'jsonb' })
  items: InventoryMovementItem[];

  @Column({ name: 'total_value', type: 'decimal', precision: 15, scale: 2 })
  totalValue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'authorized_by', nullable: true })
  authorizedBy: string;

  @Column({ name: 'recorded_by' })
  recordedBy: string;

  @Column({ name: 'transfer_status', nullable: true })
  transferStatus: 'pending' | 'in_transit' | 'received' | 'cancelled';

  @Column({ name: 'received_at', nullable: true })
  receivedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

interface InventoryMovementItem {
  materialId: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  lotId?: string;
  locationId?: string;
}


@Entity('inventory_stock', { schema: 'inventory' })
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  quantity: number;

  @Column({ name: 'reserved_quantity', type: 'decimal', precision: 12, scale: 4, default: 0 })
  reservedQuantity: number;

  @Column({ name: 'available_quantity', type: 'decimal', precision: 12, scale: 4 })
  availableQuantity: number; // GENERATED column

  @Column({ name: 'average_cost', type: 'decimal', precision: 12, scale: 2, default: 0 })
  averageCost: number;

  @Column({ name: 'total_value', type: 'decimal', precision: 15, scale: 2 })
  totalValue: number; // GENERATED column

  @Column({ name: 'last_movement_date', type: 'date', nullable: true })
  lastMovementDate: Date;

  @Column({ name: 'last_entry_date', type: 'date', nullable: true })
  lastEntryDate: Date;

  @Column({ name: 'last_exit_date', type: 'date', nullable: true })
  lastExitDate: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Warehouse, warehouse => warehouse.stock)
  warehouse: Warehouse;
}


@Entity('physical_inventories', { schema: 'inventory' })
export class PhysicalInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'inventory_date', type: 'date' })
  inventoryDate: Date;

  @Column({ default: 'in_progress' })
  status: 'in_progress' | 'completed' | 'cancelled';

  @Column({ name: 'counted_by', type: 'uuid', array: true })
  countedBy: string[];

  @Column({ name: 'supervised_by', nullable: true })
  supervisedBy: string;

  @Column({ name: 'total_items', default: 0 })
  totalItems: number;

  @Column({ name: 'items_counted', default: 0 })
  itemsCounted: number;

  @Column({ name: 'items_with_variance', default: 0 })
  itemsWithVariance: number;

  @Column({ name: 'total_variance_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalVarianceValue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @OneToMany(() => PhysicalInventoryItem, item => item.physicalInventory)
  items: PhysicalInventoryItem[];
}


@Entity('physical_inventory_items', { schema: 'inventory' })
export class PhysicalInventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'physical_inventory_id' })
  physicalInventoryId: string;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'system_quantity', type: 'decimal', precision: 12, scale: 4 })
  systemQuantity: number;

  @Column({ name: 'physical_quantity', type: 'decimal', precision: 12, scale: 4, nullable: true })
  physicalQuantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  variance: number; // GENERATED column

  @Column({ name: 'variance_percentage', type: 'decimal', precision: 6, scale: 2, nullable: true })
  variancePercentage: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 12, scale: 2 })
  unitCost: number;

  @Column({ name: 'variance_value', type: 'decimal', precision: 15, scale: 2 })
  varianceValue: number; // GENERATED column

  @Column({ default: 'pending' })
  status: 'pending' | 'counted' | 'verified' | 'adjusted';

  @Column({ name: 'counted_by', nullable: true })
  countedBy: string;

  @Column({ name: 'counted_at', nullable: true })
  countedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => PhysicalInventory, inventory => inventory.items)
  physicalInventory: PhysicalInventory;
}
```

## 3. Services (Métodos Clave)

```typescript
@Injectable()
export class InventoryMovementService {
  constructor(
    @InjectRepository(InventoryMovement)
    private movementRepo: Repository<InventoryMovement>,
    @InjectRepository(InventoryStock)
    private stockRepo: Repository<InventoryStock>,
    private eventEmitter: EventEmitter2,
  ) {}

  async registerEntry(dto: CreateEntryDto, userId: string): Promise<InventoryMovement> {
    const totalValue = dto.items.reduce((sum, item) => sum + item.totalCost, 0);

    const movement = this.movementRepo.create({
      ...dto,
      movementType: 'entry',
      recordedBy: userId,
      totalValue,
    });

    await this.movementRepo.save(movement);
    // El trigger actualiza automáticamente el stock

    this.eventEmitter.emit('inventory.entry_registered', {
      warehouseId: dto.warehouseId,
      items: dto.items,
    });

    return movement;
  }

  async registerExit(dto: CreateExitDto, userId: string): Promise<InventoryMovement> {
    // Validar stock disponible
    for (const item of dto.items) {
      const stock = await this.stockRepo.findOne({
        where: {
          warehouseId: dto.warehouseId,
          materialId: item.materialId,
        },
      });

      if (!stock || stock.availableQuantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para material ${item.materialId}`
        );
      }
    }

    // Calcular costo usando PEPS (se hace en trigger)
    const totalValue = await this.calculateExitValue(dto.warehouseId, dto.items);

    const movement = this.movementRepo.create({
      ...dto,
      movementType: 'exit',
      recordedBy: userId,
      totalValue,
    });

    await this.movementRepo.save(movement);

    // Afectar presupuesto si es salida para obra
    if (dto.budgetItemId) {
      this.eventEmitter.emit('budget.material_consumed', {
        budgetItemId: dto.budgetItemId,
        amount: totalValue,
      });
    }

    return movement;
  }

  async createTransfer(dto: CreateTransferDto, userId: string): Promise<{out: InventoryMovement, in: InventoryMovement}> {
    // Crear salida del almacén origen
    const outMovement = await this.registerExit({
      warehouseId: dto.fromWarehouseId,
      items: dto.items,
      notes: `Traspaso a ${dto.toWarehouseName}`,
    }, userId);

    // Crear entrada al almacén destino (en tránsito)
    const inMovement = this.movementRepo.create({
      warehouseId: dto.toWarehouseId,
      movementType: 'transfer_in',
      sourceType: 'transfer',
      sourceId: outMovement.id,
      transferFromWarehouseId: dto.fromWarehouseId,
      items: dto.items,
      totalValue: outMovement.totalValue,
      recordedBy: userId,
      transferStatus: 'in_transit',
    });

    await this.movementRepo.save(inMovement);

    return { out: outMovement, in: inMovement };
  }

  async receiveTransfer(transferId: string, userId: string): Promise<InventoryMovement> {
    const transfer = await this.movementRepo.findOneOrFail({
      where: { id: transferId, movementType: 'transfer_in' },
    });

    transfer.transferStatus = 'received';
    transfer.receivedAt = new Date();

    await this.movementRepo.save(transfer);
    // El trigger actualiza el stock

    return transfer;
  }

  private async calculateExitValue(warehouseId: string, items: any[]): Promise<number> {
    let total = 0;

    for (const item of items) {
      const lots = await this.lotRepo.find({
        where: {
          warehouseId,
          materialId: item.materialId,
          remainingQuantity: MoreThan(0),
        },
        order: { entryDate: 'ASC', createdAt: 'ASC' },
      });

      let remaining = item.quantity;
      for (const lot of lots) {
        if (remaining <= 0) break;

        const consume = Math.min(lot.remainingQuantity, remaining);
        total += consume * lot.unitCost;
        remaining -= consume;
      }
    }

    return total;
  }
}


@Injectable()
export class PhysicalInventoryService {
  constructor(
    @InjectRepository(PhysicalInventory)
    private inventoryRepo: Repository<PhysicalInventory>,
    @InjectRepository(PhysicalInventoryItem)
    private itemRepo: Repository<PhysicalInventoryItem>,
    @InjectRepository(InventoryStock)
    private stockRepo: Repository<InventoryStock>,
  ) {}

  async create(dto: CreatePhysicalInventoryDto): Promise<PhysicalInventory> {
    // Obtener stock actual del almacén
    const currentStock = await this.stockRepo.find({
      where: { warehouseId: dto.warehouseId },
    });

    const inventory = this.inventoryRepo.create({
      warehouseId: dto.warehouseId,
      inventoryDate: dto.inventoryDate,
      countedBy: dto.countedBy,
      supervisedBy: dto.supervisedBy,
      totalItems: currentStock.length,
      status: 'in_progress',
    });

    await this.inventoryRepo.save(inventory);

    // Crear items para conteo
    const items = currentStock.map(stock =>
      this.itemRepo.create({
        physicalInventoryId: inventory.id,
        materialId: stock.materialId,
        systemQuantity: stock.quantity,
        unitCost: stock.averageCost,
        status: 'pending',
      })
    );

    await this.itemRepo.save(items);

    return inventory;
  }

  async recordCount(itemId: string, physicalQuantity: number, userId: string): Promise<PhysicalInventoryItem> {
    const item = await this.itemRepo.findOneOrFail({ where: { id: itemId } });

    item.physicalQuantity = physicalQuantity;
    item.variancePercentage = ((physicalQuantity - item.systemQuantity) / item.systemQuantity) * 100;
    item.status = 'counted';
    item.countedBy = userId;
    item.countedAt = new Date();

    await this.itemRepo.save(item);

    // Actualizar contadores del inventario
    await this.inventoryRepo.increment(
      { id: item.physicalInventoryId },
      'itemsCounted',
      1
    );

    if (item.variance !== 0) {
      await this.inventoryRepo.increment(
        { id: item.physicalInventoryId },
        'itemsWithVariance',
        1
      );
    }

    return item;
  }

  async complete(inventoryId: string): Promise<PhysicalInventory> {
    const inventory = await this.inventoryRepo.findOneOrFail({
      where: { id: inventoryId },
      relations: ['items'],
    });

    const totalVariance = inventory.items.reduce(
      (sum, item) => sum + (item.varianceValue || 0),
      0
    );

    inventory.status = 'completed';
    inventory.completedAt = new Date();
    inventory.totalVarianceValue = totalVariance;

    return await this.inventoryRepo.save(inventory);
  }

  async generateAdjustments(inventoryId: string, userId: string): Promise<InventoryMovement[]> {
    const inventory = await this.inventoryRepo.findOneOrFail({
      where: { id: inventoryId, status: 'completed' },
      relations: ['items'],
    });

    const adjustments: InventoryMovement[] = [];

    // Agrupar por tipo de ajuste
    const itemsToAdjust = inventory.items.filter(item => item.variance !== 0);

    for (const item of itemsToAdjust) {
      const movement = await this.movementService.registerAdjustment({
        warehouseId: inventory.warehouseId,
        items: [{
          materialId: item.materialId,
          quantity: item.variance, // puede ser negativo
          unitCost: item.unitCost,
          totalCost: item.varianceValue,
        }],
        notes: `Ajuste por inventario físico ${inventory.code}`,
      }, userId);

      adjustments.push(movement);
    }

    return adjustments;
  }
}
```

---

**Estado:** ✅ Ready for Implementation
