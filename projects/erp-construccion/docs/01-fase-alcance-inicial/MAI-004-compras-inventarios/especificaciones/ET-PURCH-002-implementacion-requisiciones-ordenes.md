# ET-PURCH-002: Implementación de Requisiciones y Órdenes de Compra

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
CREATE SCHEMA IF NOT EXISTS purchases;

-- Tabla: requisitions
CREATE TABLE purchases.requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),
  project_id UUID NOT NULL REFERENCES projects.projects(id),

  requested_by UUID NOT NULL REFERENCES auth.users(id),
  required_date DATE NOT NULL,
  urgency VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),

  items JSONB NOT NULL,
  /* Estructura items:
  [{
    materialId: UUID,
    description: string,
    quantity: number,
    unit: string,
    budgetedPrice: number,
    budgetItemId: UUID,
    notes: string
  }]
  */

  justification TEXT,
  estimated_total DECIMAL(15,2),

  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'quoted', 'ordered')),
  approval_flow JSONB,
  /* Estructura approval_flow:
  [{
    level: 1,
    approverRole: 'residente',
    approverId: UUID,
    status: 'approved',
    comments: string,
    approvedAt: timestamp
  }]
  */

  rejected_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requisitions_project ON purchases.requisitions(project_id);
CREATE INDEX idx_requisitions_status ON purchases.requisitions(status);
CREATE INDEX idx_requisitions_requested_by ON purchases.requisitions(requested_by);


-- Tabla: purchase_orders
CREATE TABLE purchases.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),

  supplier_id UUID NOT NULL REFERENCES purchases.suppliers(id),
  project_id UUID NOT NULL REFERENCES projects.projects(id),
  requisition_id UUID REFERENCES purchases.requisitions(id),
  rfq_id UUID REFERENCES purchases.rfqs(id),
  quote_id UUID REFERENCES purchases.quotes(id),

  order_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE NOT NULL,
  delivery_address TEXT NOT NULL,

  items JSONB NOT NULL,
  /* Estructura items:
  [{
    materialId: UUID,
    description: string,
    quantity: number,
    unit: string,
    unitPrice: number,
    subtotal: number,
    budgetItemId: UUID
  }]
  */

  subtotal DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,

  payment_terms VARCHAR(50),
  payment_terms_days INTEGER DEFAULT 30,
  early_payment_discount DECIMAL(5,2) DEFAULT 0,
  requires_advance BOOLEAN DEFAULT false,
  advance_percentage DECIMAL(5,2),

  includes_unloading BOOLEAN DEFAULT true,
  warranty_days INTEGER DEFAULT 30,
  special_conditions TEXT,

  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sent', 'partially_received', 'received', 'cancelled')),

  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,
  sent_to_supplier_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_purchase_orders_supplier ON purchases.purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_project ON purchases.purchase_orders(project_id);
CREATE INDEX idx_purchase_orders_status ON purchases.purchase_orders(status);
CREATE INDEX idx_purchase_orders_delivery ON purchases.purchase_orders(delivery_date);


-- Tabla: purchase_order_receipts
CREATE TABLE purchases.purchase_order_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  purchase_order_id UUID NOT NULL REFERENCES purchases.purchase_orders(id),
  warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),

  receipt_date DATE DEFAULT CURRENT_DATE,
  received_by UUID NOT NULL REFERENCES auth.users(id),

  items JSONB NOT NULL,
  /* Estructura items:
  [{
    poItemId: string,
    materialId: UUID,
    orderedQuantity: number,
    receivedQuantity: number,
    acceptedQuantity: number,
    rejectedQuantity: number,
    rejectionReason: string
  }]
  */

  delivery_note VARCHAR(50),
  transport_company VARCHAR(100),

  notes TEXT,
  attachments VARCHAR[],

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receipts_purchase_order ON purchases.purchase_order_receipts(purchase_order_id);
CREATE INDEX idx_receipts_warehouse ON purchases.purchase_order_receipts(warehouse_id);


-- Tabla: invoices
CREATE TABLE purchases.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),

  supplier_id UUID NOT NULL REFERENCES purchases.suppliers(id),
  purchase_order_id UUID REFERENCES purchases.purchase_orders(id),

  invoice_number VARCHAR(50) NOT NULL,
  fiscal_uuid VARCHAR(36) UNIQUE,
  invoice_date DATE NOT NULL,

  subtotal DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,

  due_date DATE NOT NULL,
  early_payment_date DATE,
  early_payment_discount DECIMAL(15,2),

  xml_file VARCHAR(255),
  pdf_file VARCHAR(255),

  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'scheduled', 'paid', 'rejected')),

  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP,

  payment_scheduled_date DATE,
  paid_date DATE,
  payment_reference VARCHAR(100),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_supplier ON purchases.invoices(supplier_id);
CREATE INDEX idx_invoices_po ON purchases.invoices(purchase_order_id);
CREATE INDEX idx_invoices_status ON purchases.invoices(status);
CREATE INDEX idx_invoices_due_date ON purchases.invoices(due_date);


-- Función: Actualizar status de OC al recibir
CREATE OR REPLACE FUNCTION purchases.update_po_status_on_receipt()
RETURNS TRIGGER AS $$
DECLARE
  v_total_ordered DECIMAL(15,4);
  v_total_received DECIMAL(15,4);
  v_item JSONB;
BEGIN
  -- Calcular total ordenado vs recibido
  SELECT
    SUM((item->>'quantity')::DECIMAL),
    SUM(
      (SELECT SUM((receipt_item->>'receivedQuantity')::DECIMAL)
       FROM purchases.purchase_order_receipts por,
       JSONB_ARRAY_ELEMENTS(por.items) AS receipt_item
       WHERE por.purchase_order_id = NEW.purchase_order_id
         AND receipt_item->>'materialId' = item->>'materialId')
    )
  INTO v_total_ordered, v_total_received
  FROM purchases.purchase_orders po,
  JSONB_ARRAY_ELEMENTS(po.items) AS item
  WHERE po.id = NEW.purchase_order_id;

  -- Actualizar status
  IF v_total_received >= v_total_ordered THEN
    UPDATE purchases.purchase_orders
    SET status = 'received', updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.purchase_order_id;
  ELSIF v_total_received > 0 THEN
    UPDATE purchases.purchase_orders
    SET status = 'partially_received', updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.purchase_order_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_po_status
AFTER INSERT ON purchases.purchase_order_receipts
FOR EACH ROW
EXECUTE FUNCTION purchases.update_po_status_on_receipt();


-- Función: Generar código de requisición
CREATE OR REPLACE FUNCTION purchases.generate_requisition_code()
RETURNS TRIGGER AS $$
DECLARE
  v_year VARCHAR(4);
  v_sequence INTEGER;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(SUBSTRING(code FROM 9)::INTEGER), 0) + 1
  INTO v_sequence
  FROM purchases.requisitions
  WHERE code LIKE 'REQ-' || v_year || '-%';

  NEW.code := 'REQ-' || v_year || '-' || LPAD(v_sequence::TEXT, 5, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_requisition_code
BEFORE INSERT ON purchases.requisitions
FOR EACH ROW
WHEN (NEW.code IS NULL)
EXECUTE FUNCTION purchases.generate_requisition_code();


-- Función similar para OCs
CREATE OR REPLACE FUNCTION purchases.generate_po_code()
RETURNS TRIGGER AS $$
DECLARE
  v_year VARCHAR(4);
  v_sequence INTEGER;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(SUBSTRING(code FROM 8)::INTEGER), 0) + 1
  INTO v_sequence
  FROM purchases.purchase_orders
  WHERE code LIKE 'OC-' || v_year || '-%';

  NEW.code := 'OC-' || v_year || '-' || LPAD(v_sequence::TEXT, 5, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_po_code
BEFORE INSERT ON purchases.purchase_orders
FOR EACH ROW
WHEN (NEW.code IS NULL)
EXECUTE FUNCTION purchases.generate_po_code();
```

## 2. TypeORM Entities

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('requisitions', { schema: 'purchases' })
export class Requisition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'requested_by' })
  requestedBy: string;

  @Column({ name: 'required_date', type: 'date' })
  requiredDate: Date;

  @Column({ default: 'normal' })
  urgency: 'normal' | 'urgent';

  @Column({ type: 'jsonb' })
  items: RequisitionItem[];

  @Column({ type: 'text', nullable: true })
  justification: string;

  @Column({ name: 'estimated_total', type: 'decimal', precision: 15, scale: 2 })
  estimatedTotal: number;

  @Column({ default: 'draft' })
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'quoted' | 'ordered';

  @Column({ name: 'approval_flow', type: 'jsonb', nullable: true })
  approvalFlow: ApprovalStep[];

  @Column({ name: 'rejected_reason', type: 'text', nullable: true })
  rejectedReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PurchaseOrder, po => po.requisition)
  purchaseOrders: PurchaseOrder[];
}

interface RequisitionItem {
  materialId: string;
  description: string;
  quantity: number;
  unit: string;
  budgetedPrice: number;
  budgetItemId: string;
  notes?: string;
}

interface ApprovalStep {
  level: number;
  approverRole: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: Date;
}


@Entity('purchase_orders', { schema: 'purchases' })
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'requisition_id', nullable: true })
  requisitionId: string;

  @Column({ name: 'rfq_id', nullable: true })
  rfqId: string;

  @Column({ name: 'quote_id', nullable: true })
  quoteId: string;

  @Column({ name: 'order_date', type: 'date', default: () => 'CURRENT_DATE' })
  orderDate: Date;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate: Date;

  @Column({ name: 'delivery_address', type: 'text' })
  deliveryAddress: string;

  @Column({ type: 'jsonb' })
  items: PurchaseOrderItem[];

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column({ name: 'payment_terms', nullable: true })
  paymentTerms: string;

  @Column({ name: 'payment_terms_days', default: 30 })
  paymentTermsDays: number;

  @Column({ name: 'early_payment_discount', type: 'decimal', precision: 5, scale: 2, default: 0 })
  earlyPaymentDiscount: number;

  @Column({ name: 'includes_unloading', default: true })
  includesUnloading: boolean;

  @Column({ name: 'warranty_days', default: 30 })
  warrantyDays: number;

  @Column({ name: 'special_conditions', type: 'text', nullable: true })
  specialConditions: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'sent' | 'partially_received' | 'received' | 'cancelled';

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ name: 'sent_to_supplier_at', nullable: true })
  sentToSupplierAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Requisition, req => req.purchaseOrders)
  requisition: Requisition;

  @OneToMany(() => PurchaseOrderReceipt, receipt => receipt.purchaseOrder)
  receipts: PurchaseOrderReceipt[];

  @OneToMany(() => Invoice, invoice => invoice.purchaseOrder)
  invoices: Invoice[];
}

interface PurchaseOrderItem {
  materialId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  budgetItemId?: string;
}


@Entity('purchase_order_receipts', { schema: 'purchases' })
export class PurchaseOrderReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'purchase_order_id' })
  purchaseOrderId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'receipt_date', type: 'date', default: () => 'CURRENT_DATE' })
  receiptDate: Date;

  @Column({ name: 'received_by' })
  receivedBy: string;

  @Column({ type: 'jsonb' })
  items: ReceiptItem[];

  @Column({ name: 'delivery_note', nullable: true })
  deliveryNote: string;

  @Column({ name: 'transport_company', nullable: true })
  transportCompany: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  attachments: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => PurchaseOrder, po => po.receipts)
  purchaseOrder: PurchaseOrder;
}

interface ReceiptItem {
  poItemId: string;
  materialId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  rejectionReason?: string;
}


@Entity('invoices', { schema: 'purchases' })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'constructora_id' })
  constructoraId: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'purchase_order_id', nullable: true })
  purchaseOrderId: string;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ name: 'fiscal_uuid', unique: true, nullable: true })
  fiscalUuid: string;

  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'early_payment_date', type: 'date', nullable: true })
  earlyPaymentDate: Date;

  @Column({ name: 'early_payment_discount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  earlyPaymentDiscount: number;

  @Column({ name: 'xml_file', nullable: true })
  xmlFile: string;

  @Column({ name: 'pdf_file', nullable: true })
  pdfFile: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'scheduled' | 'paid' | 'rejected';

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ name: 'payment_scheduled_date', type: 'date', nullable: true })
  paymentScheduledDate: Date;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date;

  @Column({ name: 'payment_reference', nullable: true })
  paymentReference: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PurchaseOrder, po => po.invoices)
  purchaseOrder: PurchaseOrder;
}
```

## 3. Services (Métodos Clave)

```typescript
@Injectable()
export class RequisitionService {
  constructor(
    @InjectRepository(Requisition)
    private requisitionRepo: Repository<Requisition>,
    private budgetService: BudgetService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createRequisition(dto: CreateRequisitionDto, userId: string): Promise<Requisition> {
    // Validar contra presupuesto
    const validationResults = await Promise.all(
      dto.items.map(item => this.validateAgainstBudget(dto.projectId, item))
    );

    const hasErrors = validationResults.some(r => !r.valid);
    if (hasErrors) {
      throw new BadRequestException('Algunos items exceden el presupuesto disponible');
    }

    const estimatedTotal = dto.items.reduce(
      (sum, item) => sum + (item.quantity * item.budgetedPrice),
      0
    );

    const requisition = this.requisitionRepo.create({
      ...dto,
      requestedBy: userId,
      estimatedTotal,
      status: 'draft',
    });

    return await this.requisitionRepo.save(requisition);
  }

  async submitForApproval(requisitionId: string): Promise<Requisition> {
    const requisition = await this.requisitionRepo.findOneOrFail({
      where: { id: requisitionId },
    });

    // Determinar flujo de aprobación según monto
    const approvalFlow = this.determineApprovalFlow(requisition.estimatedTotal);

    requisition.status = 'pending';
    requisition.approvalFlow = approvalFlow;

    await this.requisitionRepo.save(requisition);

    // Notificar al primer aprobador
    this.eventEmitter.emit('requisition.pending_approval', {
      requisitionId,
      approverId: approvalFlow[0].approverId,
    });

    return requisition;
  }

  private determineApprovalFlow(amount: number): ApprovalStep[] {
    const flow: ApprovalStep[] = [];

    // Nivel 1: Residente (siempre)
    flow.push({
      level: 1,
      approverRole: 'residente',
      approverId: null, // Se asigna dinámicamente
      status: 'pending',
    });

    // Nivel 2: Gerente Compras (>= $50K)
    if (amount >= 50000) {
      flow.push({
        level: 2,
        approverRole: 'gerente_compras',
        approverId: null,
        status: 'pending',
      });
    }

    // Nivel 3: Director Proyectos (>= $200K)
    if (amount >= 200000) {
      flow.push({
        level: 3,
        approverRole: 'director_proyectos',
        approverId: null,
        status: 'pending',
      });
    }

    // Nivel 4: Dirección General (>= $500K)
    if (amount >= 500000) {
      flow.push({
        level: 4,
        approverRole: 'direccion_general',
        approverId: null,
        status: 'pending',
      });
    }

    return flow;
  }

  async approveStep(requisitionId: string, userId: string, level: number, comments?: string): Promise<Requisition> {
    const requisition = await this.requisitionRepo.findOneOrFail({
      where: { id: requisitionId },
    });

    const step = requisition.approvalFlow.find(s => s.level === level);
    if (!step) {
      throw new BadRequestException('Nivel de aprobación no válido');
    }

    step.status = 'approved';
    step.approverId = userId;
    step.approvedAt = new Date();
    step.comments = comments;

    // Si es el último nivel, marcar como aprobado
    const allApproved = requisition.approvalFlow.every(s => s.status === 'approved');
    if (allApproved) {
      requisition.status = 'approved';

      this.eventEmitter.emit('requisition.approved', { requisitionId });
    } else {
      // Notificar al siguiente aprobador
      const nextStep = requisition.approvalFlow.find(s => s.status === 'pending');
      if (nextStep) {
        this.eventEmitter.emit('requisition.pending_approval', {
          requisitionId,
          approverId: nextStep.approverId,
        });
      }
    }

    return await this.requisitionRepo.save(requisition);
  }

  private async validateAgainstBudget(projectId: string, item: RequisitionItem) {
    const budgetItem = await this.budgetService.getBudgetItem(item.budgetItemId);

    const exercised = await this.budgetService.getExercisedAmount(item.budgetItemId);
    const available = budgetItem.budgetedAmount - exercised;

    const requestedAmount = item.quantity * item.budgetedPrice;

    return {
      valid: requestedAmount <= available,
      available,
      requested: requestedAmount,
    };
  }
}


@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
    private pdfService: PdfService,
    private emailService: EmailService,
  ) {}

  async createFromQuote(quoteId: string, userId: string): Promise<PurchaseOrder> {
    const quote = await this.quoteService.findOne(quoteId, ['rfq', 'supplier']);

    const po = this.poRepo.create({
      supplierId: quote.supplierId,
      projectId: quote.rfq.projectId,
      requisitionId: quote.rfq.requisitionId,
      rfqId: quote.rfqId,
      quoteId: quote.id,
      deliveryDate: quote.deliveryDate,
      deliveryAddress: quote.rfq.deliveryAddress,
      items: quote.items,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      paymentTerms: quote.paymentTerms,
      status: 'pending',
    });

    return await this.poRepo.save(po);
  }

  async approve(poId: string, userId: string): Promise<PurchaseOrder> {
    const po = await this.poRepo.findOneOrFail({ where: { id: poId } });

    po.status = 'approved';
    po.approvedBy = userId;
    po.approvedAt = new Date();

    return await this.poRepo.save(po);
  }

  async sendToSupplier(poId: string): Promise<void> {
    const po = await this.poRepo.findOneOrFail({
      where: { id: poId },
      relations: ['supplier'],
    });

    // Generar PDF
    const pdfBuffer = await this.pdfService.generatePO(po);

    // Enviar email
    await this.emailService.send({
      to: po.supplier.contactEmail,
      subject: `Orden de Compra ${po.code}`,
      body: `Estimado proveedor,\n\nAdjuntamos orden de compra ${po.code}...`,
      attachments: [{
        filename: `${po.code}.pdf`,
        content: pdfBuffer,
      }],
    });

    po.sentToSupplierAt = new Date();
    po.status = 'sent';
    await this.poRepo.save(po);
  }

  async registerReceipt(dto: CreateReceiptDto, userId: string): Promise<PurchaseOrderReceipt> {
    const receipt = this.receiptRepo.create({
      ...dto,
      receivedBy: userId,
    });

    await this.receiptRepo.save(receipt);

    // El trigger actualiza automáticamente el status de la OC

    // Crear movimiento de inventario
    this.eventEmitter.emit('inventory.entry', {
      warehouseId: dto.warehouseId,
      sourceType: 'purchase_order',
      sourceId: dto.purchaseOrderId,
      items: dto.items.map(item => ({
        materialId: item.materialId,
        quantity: item.acceptedQuantity,
        unitCost: this.getUnitCostFromPO(dto.purchaseOrderId, item.materialId),
      })),
    });

    return receipt;
  }
}


@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const po = await this.poRepo.findOneOrFail({
      where: { id: dto.purchaseOrderId }
    });

    const dueDate = new Date(dto.invoiceDate);
    dueDate.setDate(dueDate.getDate() + po.paymentTermsDays);

    let earlyPaymentDate = null;
    let earlyPaymentDiscount = null;

    if (po.earlyPaymentDiscount > 0) {
      earlyPaymentDate = new Date(dto.invoiceDate);
      earlyPaymentDate.setDate(earlyPaymentDate.getDate() + 10);
      earlyPaymentDiscount = dto.total * (po.earlyPaymentDiscount / 100);
    }

    const invoice = this.invoiceRepo.create({
      ...dto,
      dueDate,
      earlyPaymentDate,
      earlyPaymentDiscount,
      status: 'pending',
    });

    return await this.invoiceRepo.save(invoice);
  }

  async getUpcomingPayments(days: number = 7): Promise<Invoice[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return await this.invoiceRepo.find({
      where: {
        status: In(['approved', 'scheduled']),
        dueDate: LessThanOrEqual(targetDate),
      },
      order: { dueDate: 'ASC' },
    });
  }
}
```

## 4. React Components (Ejemplos Clave)

```typescript
// RequisitionForm.tsx
export const RequisitionForm: React.FC = () => {
  const [items, setItems] = useState<RequisitionItem[]>([]);

  const handleAddItem = () => {
    setItems([...items, {
      materialId: '',
      description: '',
      quantity: 0,
      unit: '',
      budgetedPrice: 0,
      budgetItemId: '',
    }]);
  };

  const validateItem = async (item: RequisitionItem) => {
    const response = await api.post('/requisitions/validate-budget', item);
    return response.data;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select label="Proyecto" {...projectField} />
      <DatePicker label="Fecha Requerida" {...requiredDateField} />

      <div className="items-section">
        {items.map((item, index) => (
          <RequisitionItemRow
            key={index}
            item={item}
            onChange={(updated) => updateItem(index, updated)}
            onValidate={() => validateItem(item)}
          />
        ))}
        <Button onClick={handleAddItem}>+ Agregar Material</Button>
      </div>

      <Textarea label="Justificación" {...justificationField} />

      <div className="actions">
        <Button variant="secondary" onClick={saveDraft}>
          Guardar Borrador
        </Button>
        <Button type="submit">Enviar a Aprobación</Button>
      </div>
    </form>
  );
};


// PurchaseOrderPDF.tsx
export const generatePOPdf = (po: PurchaseOrder) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text('ORDEN DE COMPRA', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Folio: ${po.code}`, 105, 28, { align: 'center' });

  // Supplier info
  doc.setFontSize(10);
  doc.text(`Proveedor: ${po.supplier.legalName}`, 20, 45);
  doc.text(`RFC: ${po.supplier.taxId}`, 20, 52);
  doc.text(`Contacto: ${po.supplier.contactName}`, 20, 59);

  // Delivery info
  doc.text(`Entregar en: ${po.deliveryAddress}`, 20, 70);
  doc.text(`Fecha entrega: ${format(po.deliveryDate, 'dd/MM/yyyy')}`, 20, 77);

  // Items table
  autoTable(doc, {
    startY: 90,
    head: [['#', 'Descripción', 'Cant', 'U', 'P.U.', 'Total']],
    body: po.items.map((item, i) => [
      i + 1,
      item.description,
      formatNumber(item.quantity),
      item.unit,
      formatCurrency(item.unitPrice),
      formatCurrency(item.subtotal),
    ]),
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.text(`Subtotal: ${formatCurrency(po.subtotal)}`, 150, finalY + 10);
  doc.text(`IVA 16%: ${formatCurrency(po.tax)}`, 150, finalY + 17);
  doc.setFontSize(12);
  doc.text(`TOTAL: ${formatCurrency(po.total)}`, 150, finalY + 24);

  return doc;
};
```

---

**Estado:** ✅ Ready for Implementation
