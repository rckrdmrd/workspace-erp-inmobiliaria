# ET-FIN-001: Modelo de Datos Financiero

**ID:** ET-FIN-001 | **Módulo:** MAE-014

## Schema
```sql
CREATE SCHEMA finance;

CREATE TYPE finance.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE finance.payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue');

CREATE TABLE finance.cash_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  type finance.transaction_type NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount BIGINT NOT NULL,
  projected_date DATE NOT NULL,
  actual_date DATE,
  actual_amount BIGINT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finance.receivables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  client_id UUID REFERENCES clients.clients(id),
  invoice_number VARCHAR(50) UNIQUE,
  amount BIGINT NOT NULL,
  paid_amount BIGINT DEFAULT 0,
  due_date DATE NOT NULL,
  status finance.payment_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finance.payables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  vendor_id UUID REFERENCES preconstruction.vendors(id),
  invoice_number VARCHAR(50),
  amount BIGINT NOT NULL,
  paid_amount BIGINT DEFAULT 0,
  due_date DATE NOT NULL,
  status finance.payment_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---
**Generado:** 2025-11-21
