# ET-PURCH-004: Implementación de Kárdex y Alertas

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
-- Tabla: material_stock_config
CREATE TABLE inventory.material_stock_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  material_id UUID NOT NULL,

  minimum_stock DECIMAL(12,4) NOT NULL,
  maximum_stock DECIMAL(12,4),
  reorder_point DECIMAL(12,4) NOT NULL,
  lead_time_days INTEGER DEFAULT 7,

  alert_on_minimum BOOLEAN DEFAULT true,
  alert_on_reorder BOOLEAN DEFAULT true,
  alert_on_overconsumption BOOLEAN DEFAULT true,
  alert_on_no_movement BOOLEAN DEFAULT false,
  no_movement_days INTEGER DEFAULT 90,

  notify_users UUID[] DEFAULT '{}',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_warehouse_material_config UNIQUE (warehouse_id, material_id),
  CONSTRAINT check_stock_levels CHECK (
    minimum_stock < reorder_point AND
    reorder_point < maximum_stock
  )
);

CREATE INDEX idx_stock_config_warehouse ON inventory.material_stock_config(warehouse_id);
CREATE INDEX idx_stock_config_material ON inventory.material_stock_config(material_id);


-- Tabla: consumption_analysis
CREATE TABLE inventory.consumption_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects.projects(id),
  material_id UUID NOT NULL,

  analysis_period VARCHAR(7) NOT NULL, -- 2025-11

  budgeted_quantity DECIMAL(12,4) NOT NULL,
  actual_quantity DECIMAL(12,4) NOT NULL,
  variance DECIMAL(12,4) GENERATED ALWAYS AS (actual_quantity - budgeted_quantity) STORED,
  variance_percentage DECIMAL(6,2) GENERATED ALWAYS AS (
    CASE
      WHEN budgeted_quantity = 0 THEN 0
      ELSE ((actual_quantity - budgeted_quantity) / budgeted_quantity) * 100
    END
  ) STORED,

  budgeted_cost DECIMAL(15,2) NOT NULL,
  actual_cost DECIMAL(15,2) NOT NULL,
  cost_variance DECIMAL(15,2) GENERATED ALWAYS AS (actual_cost - budgeted_cost) STORED,

  average_weekly_consumption DECIMAL(12,4),
  projected_total DECIMAL(12,4),
  projected_cost DECIMAL(15,2),

  status VARCHAR(20) DEFAULT 'ok' CHECK (status IN ('ok', 'warning', 'critical')),
  analysis_date DATE DEFAULT CURRENT_DATE,

  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_project_material_period UNIQUE (project_id, material_id, analysis_period)
);

CREATE INDEX idx_consumption_project ON inventory.consumption_analysis(project_id);
CREATE INDEX idx_consumption_period ON inventory.consumption_analysis(analysis_period);
CREATE INDEX idx_consumption_status ON inventory.consumption_analysis(status);


-- Tabla: stock_alerts
CREATE TABLE inventory.stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('minimum_stock', 'reorder_point', 'overconsumption', 'no_movement', 'maximum_stock')),
  severity VARCHAR(20) DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),

  warehouse_id UUID REFERENCES inventory.warehouses(id),
  material_id UUID NOT NULL,
  project_id UUID REFERENCES projects.projects(id),

  message TEXT NOT NULL,
  current_value DECIMAL(12,4),
  threshold_value DECIMAL(12,4),

  metadata JSONB,
  /* Estructura metadata:
  {
    averageConsumption: number,
    daysRemaining: number,
    suggestedOrderQuantity: number,
    recommendedSuppliers: UUID[]
  }
  */

  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  notified_users UUID[] DEFAULT '{}',

  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP,

  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_type ON inventory.stock_alerts(alert_type);
CREATE INDEX idx_alerts_severity ON inventory.stock_alerts(severity);
CREATE INDEX idx_alerts_status ON inventory.stock_alerts(status);
CREATE INDEX idx_alerts_warehouse ON inventory.stock_alerts(warehouse_id);
CREATE INDEX idx_alerts_material ON inventory.stock_alerts(material_id);
CREATE INDEX idx_alerts_created ON inventory.stock_alerts(created_at DESC);


-- Tabla: inventory_rotation_analysis
CREATE TABLE inventory.inventory_rotation_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
  analysis_period VARCHAR(7) NOT NULL, -- 2025-11

  total_materials INTEGER,
  total_inventory_value DECIMAL(15,2),

  rotation_index DECIMAL(6,2), -- veces por año
  average_days_in_stock INTEGER,

  class_a_materials INTEGER, -- 80% del valor
  class_b_materials INTEGER, -- 15% del valor
  class_c_materials INTEGER, -- 5% del valor

  slow_moving_materials INTEGER,
  obsolete_materials INTEGER,

  analysis_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_warehouse_period UNIQUE (warehouse_id, analysis_period)
);

CREATE INDEX idx_rotation_warehouse ON inventory.inventory_rotation_analysis(warehouse_id);
CREATE INDEX idx_rotation_period ON inventory.inventory_rotation_analysis(analysis_period);


-- Función: Generar alerta de stock mínimo
CREATE OR REPLACE FUNCTION inventory.check_minimum_stock_alert()
RETURNS TRIGGER AS $$
DECLARE
  v_config RECORD;
  v_alert_exists BOOLEAN;
BEGIN
  -- Obtener configuración del material
  SELECT * INTO v_config
  FROM inventory.material_stock_config
  WHERE warehouse_id = NEW.warehouse_id
    AND material_id = NEW.material_id
    AND alert_on_minimum = true;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Si está por debajo del stock mínimo
  IF NEW.quantity < v_config.minimum_stock THEN
    -- Verificar si ya existe una alerta activa
    SELECT EXISTS (
      SELECT 1 FROM inventory.stock_alerts
      WHERE warehouse_id = NEW.warehouse_id
        AND material_id = NEW.material_id
        AND alert_type = 'minimum_stock'
        AND status = 'active'
    ) INTO v_alert_exists;

    IF NOT v_alert_exists THEN
      INSERT INTO inventory.stock_alerts (
        alert_type,
        severity,
        warehouse_id,
        material_id,
        message,
        current_value,
        threshold_value,
        notified_users
      ) VALUES (
        'minimum_stock',
        'critical',
        NEW.warehouse_id,
        NEW.material_id,
        'Stock por debajo del mínimo configurado',
        NEW.quantity,
        v_config.minimum_stock,
        v_config.notify_users
      );
    END IF;
  ELSE
    -- Si el stock vuelve a niveles normales, resolver la alerta
    UPDATE inventory.stock_alerts
    SET status = 'resolved',
        resolved_at = CURRENT_TIMESTAMP
    WHERE warehouse_id = NEW.warehouse_id
      AND material_id = NEW.material_id
      AND alert_type = 'minimum_stock'
      AND status = 'active';
  END IF;

  -- Verificar punto de reorden
  IF NEW.quantity <= v_config.reorder_point AND v_config.alert_on_reorder THEN
    SELECT EXISTS (
      SELECT 1 FROM inventory.stock_alerts
      WHERE warehouse_id = NEW.warehouse_id
        AND material_id = NEW.material_id
        AND alert_type = 'reorder_point'
        AND status = 'active'
    ) INTO v_alert_exists;

    IF NOT v_alert_exists THEN
      INSERT INTO inventory.stock_alerts (
        alert_type,
        severity,
        warehouse_id,
        material_id,
        message,
        current_value,
        threshold_value,
        notified_users
      ) VALUES (
        'reorder_point',
        'warning',
        NEW.warehouse_id,
        NEW.material_id,
        'Punto de reorden alcanzado',
        NEW.quantity,
        v_config.reorder_point,
        v_config.notify_users
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_stock_alerts
AFTER UPDATE OF quantity ON inventory.inventory_stock
FOR EACH ROW
WHEN (NEW.quantity IS DISTINCT FROM OLD.quantity)
EXECUTE FUNCTION inventory.check_minimum_stock_alert();


-- Función: Analizar consumo vs presupuesto
CREATE OR REPLACE FUNCTION inventory.analyze_consumption(
  p_project_id UUID,
  p_period VARCHAR(7)
)
RETURNS VOID AS $$
DECLARE
  v_material RECORD;
  v_budgeted DECIMAL(12,4);
  v_consumed DECIMAL(12,4);
  v_variance_pct DECIMAL(6,2);
  v_status VARCHAR(20);
BEGIN
  FOR v_material IN
    SELECT DISTINCT m.material_id
    FROM inventory.inventory_movements m
    WHERE m.project_id = p_project_id
      AND TO_CHAR(m.movement_date, 'YYYY-MM') = p_period
      AND m.movement_type = 'exit'
  LOOP
    -- Obtener cantidad presupuestada
    SELECT budgeted_quantity INTO v_budgeted
    FROM budgets.budget_items
    WHERE project_id = p_project_id
      AND material_id = v_material.material_id;

    -- Calcular cantidad consumida en el período
    SELECT COALESCE(SUM((item->>'quantity')::DECIMAL), 0)
    INTO v_consumed
    FROM inventory.inventory_movements m,
         JSONB_ARRAY_ELEMENTS(m.items) AS item
    WHERE m.project_id = p_project_id
      AND TO_CHAR(m.movement_date, 'YYYY-MM') = p_period
      AND m.movement_type = 'exit'
      AND (item->>'materialId')::UUID = v_material.material_id;

    -- Calcular varianza
    IF v_budgeted > 0 THEN
      v_variance_pct := ((v_consumed - v_budgeted) / v_budgeted) * 100;
    ELSE
      v_variance_pct := 0;
    END IF;

    -- Determinar status
    v_status := CASE
      WHEN v_variance_pct < -5 THEN 'ok'
      WHEN v_variance_pct BETWEEN -5 AND 5 THEN 'ok'
      WHEN v_variance_pct BETWEEN 5 AND 10 THEN 'warning'
      ELSE 'critical'
    END;

    -- Insertar análisis
    INSERT INTO inventory.consumption_analysis (
      project_id,
      material_id,
      analysis_period,
      budgeted_quantity,
      actual_quantity,
      budgeted_cost,
      actual_cost,
      status
    ) VALUES (
      p_project_id,
      v_material.material_id,
      p_period,
      v_budgeted,
      v_consumed,
      0, -- calcular desde presupuesto
      0, -- calcular desde movimientos
      v_status
    )
    ON CONFLICT (project_id, material_id, analysis_period)
    DO UPDATE SET
      actual_quantity = v_consumed,
      status = v_status,
      analysis_date = CURRENT_DATE;

    -- Crear alerta si hay sobreconsumo crítico
    IF v_status = 'critical' THEN
      INSERT INTO inventory.stock_alerts (
        alert_type,
        severity,
        project_id,
        material_id,
        message,
        current_value,
        threshold_value
      ) VALUES (
        'overconsumption',
        'critical',
        p_project_id,
        v_material.material_id,
        'Sobreconsumo crítico vs presupuesto',
        v_consumed,
        v_budgeted
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## 2. TypeORM Entities

```typescript
@Entity('material_stock_config', { schema: 'inventory' })
export class MaterialStockConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'minimum_stock', type: 'decimal', precision: 12, scale: 4 })
  minimumStock: number;

  @Column({ name: 'maximum_stock', type: 'decimal', precision: 12, scale: 4, nullable: true })
  maximumStock: number;

  @Column({ name: 'reorder_point', type: 'decimal', precision: 12, scale: 4 })
  reorderPoint: number;

  @Column({ name: 'lead_time_days', default: 7 })
  leadTimeDays: number;

  @Column({ name: 'alert_on_minimum', default: true })
  alertOnMinimum: boolean;

  @Column({ name: 'alert_on_reorder', default: true })
  alertOnReorder: boolean;

  @Column({ name: 'alert_on_overconsumption', default: true })
  alertOnOverconsumption: boolean;

  @Column({ name: 'alert_on_no_movement', default: false })
  alertOnNoMovement: boolean;

  @Column({ name: 'no_movement_days', default: 90 })
  noMovementDays: number;

  @Column({ name: 'notify_users', type: 'uuid', array: true, default: '{}' })
  notifyUsers: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


@Entity('consumption_analysis', { schema: 'inventory' })
export class ConsumptionAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'analysis_period', length: 7 })
  analysisPeriod: string;

  @Column({ name: 'budgeted_quantity', type: 'decimal', precision: 12, scale: 4 })
  budgetedQuantity: number;

  @Column({ name: 'actual_quantity', type: 'decimal', precision: 12, scale: 4 })
  actualQuantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  variance: number; // GENERATED column

  @Column({ name: 'variance_percentage', type: 'decimal', precision: 6, scale: 2 })
  variancePercentage: number; // GENERATED column

  @Column({ name: 'budgeted_cost', type: 'decimal', precision: 15, scale: 2 })
  budgetedCost: number;

  @Column({ name: 'actual_cost', type: 'decimal', precision: 15, scale: 2 })
  actualCost: number;

  @Column({ name: 'cost_variance', type: 'decimal', precision: 15, scale: 2 })
  costVariance: number; // GENERATED column

  @Column({ name: 'average_weekly_consumption', type: 'decimal', precision: 12, scale: 4, nullable: true })
  averageWeeklyConsumption: number;

  @Column({ name: 'projected_total', type: 'decimal', precision: 12, scale: 4, nullable: true })
  projectedTotal: number;

  @Column({ name: 'projected_cost', type: 'decimal', precision: 15, scale: 2, nullable: true })
  projectedCost: number;

  @Column({ default: 'ok' })
  status: 'ok' | 'warning' | 'critical';

  @Column({ name: 'analysis_date', type: 'date', default: () => 'CURRENT_DATE' })
  analysisDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


@Entity('stock_alerts', { schema: 'inventory' })
export class StockAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alert_type' })
  alertType: 'minimum_stock' | 'reorder_point' | 'overconsumption' | 'no_movement' | 'maximum_stock';

  @Column({ default: 'warning' })
  severity: 'info' | 'warning' | 'critical';

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @Column({ name: 'material_id' })
  materialId: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'current_value', type: 'decimal', precision: 12, scale: 4, nullable: true })
  currentValue: number;

  @Column({ name: 'threshold_value', type: 'decimal', precision: 12, scale: 4, nullable: true })
  thresholdValue: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ default: 'active' })
  status: 'active' | 'acknowledged' | 'resolved';

  @Column({ name: 'notified_users', type: 'uuid', array: true, default: '{}' })
  notifiedUsers: string[];

  @Column({ name: 'acknowledged_by', nullable: true })
  acknowledgedBy: string;

  @Column({ name: 'acknowledged_at', nullable: true })
  acknowledgedAt: Date;

  @Column({ name: 'resolved_by', nullable: true })
  resolvedBy: string;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

## 3. Services (Métodos Clave)

```typescript
@Injectable()
export class KardexService {
  constructor(
    @InjectRepository(InventoryMovement)
    private movementRepo: Repository<InventoryMovement>,
  ) {}

  async getKardex(
    warehouseId: string,
    materialId: string,
    startDate: Date,
    endDate: Date
  ): Promise<KardexEntry[]> {
    const movements = await this.movementRepo.find({
      where: {
        warehouseId,
        movementDate: Between(startDate, endDate),
      },
      order: { movementDate: 'ASC', createdAt: 'ASC' },
    });

    const kardex: KardexEntry[] = [];
    let runningBalance = await this.getBalanceAt(warehouseId, materialId, startDate);

    for (const movement of movements) {
      const item = movement.items.find(i => i.materialId === materialId);
      if (!item) continue;

      const entry: KardexEntry = {
        date: movement.movementDate,
        movementCode: movement.code,
        movementType: movement.movementType,
        detail: this.getMovementDetail(movement),
        entry: movement.movementType.includes('entry') ? item.quantity : 0,
        exit: movement.movementType.includes('exit') ? item.quantity : 0,
        balance: 0,
        unitCost: item.unitCost,
      };

      runningBalance += entry.entry - entry.exit;
      entry.balance = runningBalance;

      kardex.push(entry);
    }

    return kardex;
  }

  private async getBalanceAt(warehouseId: string, materialId: string, date: Date): Promise<number> {
    const result = await this.movementRepo
      .createQueryBuilder('m')
      .select('SUM(CASE WHEN m.movement_type IN (\'entry\', \'transfer_in\') THEN (item->>\'quantity\')::DECIMAL ELSE 0 END) - SUM(CASE WHEN m.movement_type IN (\'exit\', \'transfer_out\') THEN (item->>\'quantity\')::DECIMAL ELSE 0 END)', 'balance')
      .crossJoin('jsonb_array_elements(m.items)', 'item')
      .where('m.warehouse_id = :warehouseId', { warehouseId })
      .andWhere('(item->>\'materialId\')::UUID = :materialId', { materialId })
      .andWhere('m.movement_date < :date', { date })
      .getRawOne();

    return Number(result.balance) || 0;
  }

  private getMovementDetail(movement: InventoryMovement): string {
    switch (movement.sourceType) {
      case 'purchase_order':
        return `OC-${movement.sourceId.substring(0, 8)}`;
      case 'transfer':
        return `Traspaso`;
      case 'adjustment':
        return `Ajuste de inventario`;
      default:
        return movement.notes || 'Movimiento';
    }
  }
}

interface KardexEntry {
  date: Date;
  movementCode: string;
  movementType: string;
  detail: string;
  entry: number;
  exit: number;
  balance: number;
  unitCost: number;
}


@Injectable()
export class ConsumptionAnalysisService {
  constructor(
    @InjectRepository(ConsumptionAnalysis)
    private analysisRepo: Repository<ConsumptionAnalysis>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async runDailyAnalysis() {
    const activeProjects = await this.projectRepo.find({
      where: { status: 'execution' },
    });

    const currentPeriod = format(new Date(), 'yyyy-MM');

    for (const project of activeProjects) {
      await this.dataSource.query(
        'SELECT inventory.analyze_consumption($1, $2)',
        [project.id, currentPeriod]
      );
    }
  }

  async getProjectAnalysis(projectId: string, period: string): Promise<ConsumptionAnalysis[]> {
    return await this.analysisRepo.find({
      where: { projectId, analysisPeriod: period },
      order: { variancePercentage: 'DESC' },
    });
  }

  async getOverconsumptionItems(projectId: string): Promise<ConsumptionAnalysis[]> {
    return await this.analysisRepo.find({
      where: {
        projectId,
        status: In(['warning', 'critical']),
      },
      order: { variancePercentage: 'DESC' },
    });
  }
}


@Injectable()
export class StockAlertService {
  constructor(
    @InjectRepository(StockAlert)
    private alertRepo: Repository<StockAlert>,
    @InjectRepository(MaterialStockConfig)
    private configRepo: Repository<MaterialStockConfig>,
    private notificationService: NotificationService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async checkNoMovementAlerts() {
    const configs = await this.configRepo.find({
      where: { alertOnNoMovement: true },
    });

    for (const config of configs) {
      const stock = await this.stockRepo.findOne({
        where: {
          warehouseId: config.warehouseId,
          materialId: config.materialId,
        },
      });

      if (!stock || !stock.lastMovementDate) continue;

      const daysSinceMovement = differenceInDays(new Date(), stock.lastMovementDate);

      if (daysSinceMovement >= config.noMovementDays) {
        const existingAlert = await this.alertRepo.findOne({
          where: {
            warehouseId: config.warehouseId,
            materialId: config.materialId,
            alertType: 'no_movement',
            status: 'active',
          },
        });

        if (!existingAlert) {
          const alert = await this.alertRepo.save({
            alertType: 'no_movement',
            severity: 'warning',
            warehouseId: config.warehouseId,
            materialId: config.materialId,
            message: `Material sin movimiento por ${daysSinceMovement} días`,
            currentValue: daysSinceMovement,
            thresholdValue: config.noMovementDays,
            notifiedUsers: config.notifyUsers,
            metadata: {
              lastMovementDate: stock.lastMovementDate,
              stockValue: stock.totalValue,
            },
          });

          this.eventEmitter.emit('alert.created', alert);
        }
      }
    }
  }

  async getActiveAlerts(filters?: {
    warehouseId?: string;
    severity?: string;
    alertType?: string;
  }): Promise<StockAlert[]> {
    const where: any = { status: 'active' };

    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.alertType) where.alertType = filters.alertType;

    return await this.alertRepo.find({
      where,
      order: { severity: 'ASC', createdAt: 'DESC' },
    });
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<StockAlert> {
    const alert = await this.alertRepo.findOneOrFail({ where: { id: alertId } });

    alert.status = 'acknowledged';
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();

    return await this.alertRepo.save(alert);
  }

  async resolveAlert(alertId: string, userId: string): Promise<StockAlert> {
    const alert = await this.alertRepo.findOneOrFail({ where: { id: alertId } });

    alert.status = 'resolved';
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();

    return await this.alertRepo.save(alert);
  }

  @OnEvent('alert.created')
  async handleAlertCreated(alert: StockAlert) {
    for (const userId of alert.notifiedUsers) {
      await this.notificationService.create({
        userId,
        type: 'stock_alert',
        title: this.getAlertTitle(alert.alertType),
        message: alert.message,
        data: {
          alertId: alert.id,
          severity: alert.severity,
        },
      });
    }
  }

  private getAlertTitle(alertType: string): string {
    const titles = {
      minimum_stock: 'Stock Crítico',
      reorder_point: 'Punto de Reorden',
      overconsumption: 'Sobreconsumo Detectado',
      no_movement: 'Material Sin Movimiento',
      maximum_stock: 'Stock Excedido',
    };
    return titles[alertType] || 'Alerta de Inventario';
  }
}


@Injectable()
export class InventoryDashboardService {
  async getDashboard(constructoraId: string): Promise<InventoryDashboardDto> {
    // Almacenes activos
    const warehouses = await this.warehouseRepo.count({
      where: { constructoraId, isActive: true },
    });

    // Materiales en stock
    const materials = await this.stockRepo.count({
      where: { quantity: MoreThan(0) },
    });

    // Valor total
    const totalValue = await this.stockRepo
      .createQueryBuilder('s')
      .select('SUM(s.total_value)', 'total')
      .where('s.warehouse_id IN (SELECT id FROM inventory.warehouses WHERE constructora_id = :constructoraId)', { constructoraId })
      .getRawOne();

    // Alertas activas
    const alerts = await this.alertRepo
      .createQueryBuilder('a')
      .select('a.alert_type, a.severity, COUNT(*) as count')
      .where('a.status = :status', { status: 'active' })
      .groupBy('a.alert_type, a.severity')
      .getRawMany();

    // Top 5 materiales por valor
    const topMaterials = await this.stockRepo.find({
      order: { totalValue: 'DESC' },
      take: 5,
    });

    return {
      summary: {
        activeWarehouses: warehouses,
        materialsInStock: materials,
        totalInventoryValue: totalValue.total,
      },
      alerts: this.groupAlertsByType(alerts),
      topMaterials,
    };
  }

  private groupAlertsByType(alerts: any[]) {
    return {
      critical: alerts.filter(a => a.severity === 'critical').reduce((sum, a) => sum + Number(a.count), 0),
      reorder: alerts.filter(a => a.alert_type === 'reorder_point').reduce((sum, a) => sum + Number(a.count), 0),
      overconsumption: alerts.filter(a => a.alert_type === 'overconsumption').reduce((sum, a) => sum + Number(a.count), 0),
      noMovement: alerts.filter(a => a.alert_type === 'no_movement').reduce((sum, a) => sum + Number(a.count), 0),
    };
  }
}
```

## 4. React Components (Dashboard)

```typescript
export const InventoryDashboard: React.FC = () => {
  const { data: dashboard } = useQuery(['inventory-dashboard'], () =>
    api.get('/inventory/dashboard').then(r => r.data)
  );

  return (
    <div className="dashboard-grid">
      <Card title="Resumen General">
        <div className="metrics">
          <Metric
            label="Almacenes activos"
            value={dashboard?.summary.activeWarehouses}
          />
          <Metric
            label="Materiales en stock"
            value={dashboard?.summary.materialsInStock}
          />
          <Metric
            label="Valor total inventario"
            value={formatCurrency(dashboard?.summary.totalInventoryValue)}
          />
        </div>
      </Card>

      <Card title="Alertas Activas">
        <div className="alerts-summary">
          <AlertBadge
            type="critical"
            count={dashboard?.alerts.critical}
            label="Stock crítico"
          />
          <AlertBadge
            type="warning"
            count={dashboard?.alerts.reorder}
            label="Punto reorden"
          />
          <AlertBadge
            type="warning"
            count={dashboard?.alerts.overconsumption}
            label="Sobreconsumo"
          />
          <AlertBadge
            type="info"
            count={dashboard?.alerts.noMovement}
            label="Sin movimiento 90d"
          />
        </div>
      </Card>

      <Card title="Top 5 Materiales por Valor">
        <MaterialValueChart data={dashboard?.topMaterials} />
      </Card>
    </div>
  );
};


export const KardexView: React.FC<{ warehouseId: string; materialId: string }> = ({
  warehouseId,
  materialId,
}) => {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const { data: kardex } = useQuery(
    ['kardex', warehouseId, materialId, dateRange],
    () => api.get('/inventory/kardex', {
      params: { warehouseId, materialId, ...dateRange }
    }).then(r => r.data)
  );

  return (
    <div className="kardex-view">
      <div className="header">
        <h2>Kárdex - {kardex?.materialName}</h2>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <table className="kardex-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Movimiento</th>
            <th>Detalle</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Saldo</th>
            <th>Costo U.</th>
          </tr>
        </thead>
        <tbody>
          {kardex?.entries.map((entry, i) => (
            <tr key={i}>
              <td>{format(entry.date, 'dd/MM/yyyy')}</td>
              <td>{entry.movementCode}</td>
              <td>{entry.detail}</td>
              <td className="entry">{entry.entry > 0 && formatNumber(entry.entry)}</td>
              <td className="exit">{entry.exit > 0 && formatNumber(entry.exit)}</td>
              <td className="balance">{formatNumber(entry.balance)}</td>
              <td>{formatCurrency(entry.unitCost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

**Estado:** ✅ Ready for Implementation
