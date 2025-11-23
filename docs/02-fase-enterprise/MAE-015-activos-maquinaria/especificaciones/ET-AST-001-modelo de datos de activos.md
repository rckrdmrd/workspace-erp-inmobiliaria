# ET-AST-001: Modelo de Datos de Activos

**ID:** ET-AST-001 | **Módulo:** MAE-015

## Schema
```sql
CREATE SCHEMA assets;

CREATE TYPE assets.asset_type AS ENUM ('machinery', 'vehicle', 'tool', 'equipment');
CREATE TYPE assets.asset_status AS ENUM ('available', 'in_use', 'maintenance', 'retired');

CREATE TABLE assets.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type assets.asset_type NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  year INT,
  acquisition_cost BIGINT NOT NULL,
  depreciation_method VARCHAR(20) DEFAULT 'straight_line',
  useful_life_years INT DEFAULT 10,
  current_book_value BIGINT,
  status assets.asset_status DEFAULT 'available',
  current_location UUID REFERENCES projects.projects(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assets.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets.assets(id),
  project_id UUID REFERENCES projects.projects(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  returned_at TIMESTAMPTZ,
  hourly_rate BIGINT,
  hours_used DECIMAL(10,2)
);
```

---
**Generado:** 2025-11-21
