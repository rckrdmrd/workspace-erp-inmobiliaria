# ET-PRE-001: Modelo de Datos

**ID:** ET-PRE-001 | **Módulo:** MAI-018

## Schema
```sql
CREATE SCHEMA preconstruction;

CREATE TYPE preconstruction.tender_type AS ENUM ('public', 'private', 'direct');
CREATE TYPE preconstruction.tender_status AS ENUM ('draft', 'published', 'receiving', 'evaluating', 'awarded', 'cancelled');
CREATE TYPE preconstruction.proposal_status AS ENUM ('received', 'evaluating', 'qualified', 'disqualified', 'winner');

CREATE TABLE preconstruction.feasibility_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  market_analysis JSONB,
  technical_analysis JSONB,
  financial_analysis JSONB,
  tir DECIMAL(5,2),
  vpn BIGINT,
  roi DECIMAL(5,2),
  risk_score INT CHECK (risk_score BETWEEN 1 AND 10),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE preconstruction.tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  project_id UUID REFERENCES projects.projects(id),
  type preconstruction.tender_type NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  presupuesto_referencia BIGINT,
  fecha_publicacion DATE,
  fecha_junta_aclaraciones DATE,
  fecha_limite_propuestas TIMESTAMPTZ,
  fecha_fallo DATE,
  status preconstruction.tender_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE preconstruction.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES preconstruction.tenders(id),
  vendor_id UUID REFERENCES preconstruction.vendors(id),
  monto_propuesto BIGINT NOT NULL,
  plazo_dias INT NOT NULL,
  propuesta_tecnica_url VARCHAR(500),
  propuesta_economica_url VARCHAR(500),
  score_tecnico DECIMAL(5,2),
  score_economico DECIMAL(5,2),
  score_total DECIMAL(5,2),
  status preconstruction.proposal_status DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE preconstruction.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
  rfc VARCHAR(13) UNIQUE NOT NULL,
  especialidades TEXT[],
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  documentacion_vigente BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true
);
```

---
**Generado:** 2025-11-20
