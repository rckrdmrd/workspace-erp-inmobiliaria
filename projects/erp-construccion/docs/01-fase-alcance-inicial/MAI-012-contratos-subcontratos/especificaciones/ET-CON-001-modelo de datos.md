# ET-CON-001: Modelo de Datos

**ID:** ET-CON-001 | **Módulo:** MAI-012

## Schema
```sql
CREATE SCHEMA contracts;

CREATE TYPE contracts.contract_type AS ENUM ('client', 'subcontractor');
CREATE TYPE contracts.contract_status AS ENUM ('draft', 'review', 'approved', 'active', 'completed', 'terminated');
CREATE TYPE contracts.subcontractor_specialty AS ENUM ('cimentacion', 'estructura', 'instalaciones', 'acabados');

CREATE TABLE contracts.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  type contracts.contract_type NOT NULL,
  project_id UUID REFERENCES projects.projects(id),
  client_id UUID REFERENCES clients.clients(id),
  subcontractor_id UUID REFERENCES contracts.subcontractors(id),
  template_id UUID REFERENCES contracts.templates(id),
  monto_contratado BIGINT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  alcance_tecnico TEXT,
  status contracts.contract_status DEFAULT 'draft',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contracts.subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
  rfc VARCHAR(13) UNIQUE NOT NULL,
  specialty contracts.subcontractor_specialty NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  active BOOLEAN DEFAULT true
);

CREATE TABLE contracts.addendums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts.contracts(id),
  numero INT NOT NULL,
  descripcion TEXT NOT NULL,
  monto_cambio BIGINT,
  fecha_nueva_fin DATE,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---
**Generado:** 2025-11-20
