# ET-PURCH-001: Implementación de Proveedores y Cotizaciones

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Schemas SQL

```sql
CREATE SCHEMA IF NOT EXISTS purchases;

-- Tabla: suppliers
CREATE TABLE purchases.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id),
  
  tax_id VARCHAR(13) NOT NULL UNIQUE, -- RFC
  legal_name VARCHAR(255) NOT NULL,
  commercial_name VARCHAR(255),
  business_type VARCHAR(100),
  
  categories VARCHAR[] DEFAULT '{}',
  
  contact_name VARCHAR(255),
  contact_position VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  
  payment_terms_days INTEGER DEFAULT 30,
  early_payment_discount DECIMAL(5,2) DEFAULT 0,
  requires_advance BOOLEAN DEFAULT false,
  
  bank_name VARCHAR(100),
  account_number VARCHAR(20),
  clabe VARCHAR(18),
  
  rating DECIMAL(5,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 100),
  certification_status VARCHAR(20) DEFAULT 'none' CHECK (certification_status IN ('none', 'in_evaluation', 'certified')),
  
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_constructora ON purchases.suppliers(constructora_id);
CREATE INDEX idx_suppliers_status ON purchases.suppliers(status);
CREATE INDEX idx_suppliers_rating ON purchases.suppliers(rating DESC);


-- Tabla: rfqs (Solicitudes de cotización)
CREATE TABLE purchases.rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  constructora_id UUID NOT NULL,
  project_id UUID REFERENCES projects.projects(id),
  requested_by UUID NOT NULL,
  
  request_date DATE DEFAULT CURRENT_DATE,
  quote_due_date TIMESTAMP NOT NULL,
  delivery_date DATE,
  
  items JSONB NOT NULL,
  delivery_address TEXT,
  payment_terms VARCHAR(50),
  includes_unloading BOOLEAN DEFAULT true,
  
  invited_suppliers UUID[],
  
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'closed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla: quotes
CREATE TABLE purchases.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES purchases.rfqs(id),
  supplier_id UUID NOT NULL REFERENCES purchases.suppliers(id),
  
  items JSONB NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2),
  total DECIMAL(15,2) NOT NULL,
  
  delivery_date DATE,
  payment_terms VARCHAR(50),
  valid_until DATE,
  
  notes TEXT,
  attachments VARCHAR[],
  
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'accepted', 'rejected')),
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla: supplier_ratings (evaluaciones)
CREATE TABLE purchases.supplier_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES purchases.suppliers(id),
  evaluation_period VARCHAR(7) NOT NULL, -- 2025-11
  
  price_score DECIMAL(5,2) DEFAULT 0,
  quality_score DECIMAL(5,2) DEFAULT 0,
  delivery_score DECIMAL(5,2) DEFAULT 0,
  service_score DECIMAL(5,2) DEFAULT 0,
  payment_score DECIMAL(5,2) DEFAULT 0,
  
  overall_rating DECIMAL(5,2) DEFAULT 0,
  
  total_orders INTEGER DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  on_time_deliveries INTEGER DEFAULT 0,
  late_deliveries INTEGER DEFAULT 0,
  returns INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_supplier_period UNIQUE (supplier_id, evaluation_period)
);
```

## 2. TypeORM Entities

```typescript
@Entity('suppliers', { schema: 'purchases' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tax_id', length: 13, unique: true })
  taxId: string;

  @Column({ name: 'legal_name', length: 255 })
  legalName: string;

  @Column({ name: 'commercial_name', length: 255, nullable: true })
  commercialName: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  categories: string[];

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ name: 'payment_terms_days', default: 30 })
  paymentTermsDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'certification_status', default: 'none' })
  certificationStatus: 'none' | 'in_evaluation' | 'certified';

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'blocked';
}

@Entity('rfqs', { schema: 'purchases' })
export class RFQ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ type: 'jsonb' })
  items: any[];

  @Column({ name: 'quote_due_date', type: 'timestamp' })
  quoteDueDate: Date;

  @Column({ name: 'invited_suppliers', type: 'uuid', array: true })
  invitedSuppliers: string[];

  @Column({ default: 'draft' })
  status: 'draft' | 'sent' | 'closed' | 'cancelled';
}
```

## 3. Service (Métodos Clave)

```typescript
@Injectable()
export class SupplierService {
  async evaluateSupplier(supplierId: string, period: string): Promise<void> {
    // Obtener OCs del período
    const orders = await this.purchaseOrderRepo.find({
      where: { supplierId, status: In(['received', 'partially_received']) },
      // filtrar por período
    });

    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + o.total, 0);
    const onTime = orders.filter(o => o.deliveryDate <= o.promisedDate).length;
    const late = totalOrders - onTime;

    // Calcular scores
    const priceScore = this.calculatePriceScore(orders);
    const deliveryScore = (onTime / totalOrders) * 100;
    const qualityScore = this.calculateQualityScore(supplierId);

    const overallRating = (
      priceScore * 0.30 +
      deliveryScore * 0.25 +
      qualityScore * 0.25 +
      80 * 0.10 + // serviceScore
      85 * 0.10   // paymentScore
    );

    await this.ratingRepo.upsert({
      supplierId,
      evaluationPeriod: period,
      priceScore,
      deliveryScore,
      qualityScore,
      overallRating,
      totalOrders,
      totalAmount,
      onTimeDeliveries: onTime,
      lateDeliveries: late,
    }, ['supplierId', 'evaluationPeriod']);

    // Actualizar rating del proveedor
    await this.supplierRepo.update(supplierId, { rating: overallRating });
  }

  async compareQuotes(rfqId: string): Promise<any> {
    const quotes = await this.quoteRepo.find({
      where: { rfqId, status: 'submitted' },
      relations: ['supplier'],
    });

    const comparison = quotes.map(q => ({
      quote: q,
      supplier: q.supplier,
      score: this.calculateQuoteScore(q),
    }));

    comparison.sort((a, b) => b.score - a.score);

    return {
      quotes: comparison,
      recommended: comparison[0],
    };
  }

  private calculateQuoteScore(quote: any): number {
    const priceScore = 100 - ((quote.total - minTotal) / minTotal * 100);
    const supplierScore = quote.supplier.rating;
    const deliveryScore = quote.deliveryDate <= requiredDate ? 100 : 50;

    return priceScore * 0.40 + supplierScore * 0.35 + deliveryScore * 0.25;
  }
}
```

---

**Estado:** ✅ Ready for Implementation
