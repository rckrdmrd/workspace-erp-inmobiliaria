# ET-HSE-001: Modelo de Datos HSE

**ID:** ET-HSE-001 | **Módulo:** MAA-017

## Schema
```sql
CREATE SCHEMA hse;

CREATE TYPE hse.risk_level AS ENUM ('trivial', 'tolerable', 'moderate', 'important', 'intolerable');
CREATE TYPE hse.incident_type AS ENUM ('near_miss', 'first_aid', 'medical_treatment', 'lost_time', 'fatality');

CREATE TABLE hse.risk_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  activity VARCHAR(255) NOT NULL,
  hazard TEXT NOT NULL,
  probability INT CHECK (probability BETWEEN 1 AND 5),
  severity INT CHECK (severity BETWEEN 1 AND 5),
  risk_level hse.risk_level GENERATED ALWAYS AS (
    CASE 
      WHEN probability * severity BETWEEN 1 AND 4 THEN 'trivial'
      WHEN probability * severity BETWEEN 5 AND 8 THEN 'tolerable'
      WHEN probability * severity BETWEEN 9 AND 12 THEN 'moderate'
      WHEN probability * severity BETWEEN 13 AND 16 THEN 'important'
      ELSE 'intolerable'
    END
  ) STORED,
  preventive_measures TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hse.epp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  useful_life_days INT,
  stock INT DEFAULT 0,
  min_stock INT DEFAULT 10
);

CREATE TABLE hse.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  employee_id UUID REFERENCES hr.employees(id),
  type hse.incident_type NOT NULL,
  description TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  reported_at TIMESTAMPTZ DEFAULT NOW()
);
```

---
**Generado:** 2025-11-21
