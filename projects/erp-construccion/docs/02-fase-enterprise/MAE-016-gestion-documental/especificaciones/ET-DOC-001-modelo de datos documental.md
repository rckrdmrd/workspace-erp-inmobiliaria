# ET-DOC-001: Modelo de Datos Documental

**ID:** ET-DOC-001 | **Módulo:** MAE-016

## Schema
```sql
CREATE SCHEMA documents;

CREATE TYPE documents.document_type AS ENUM ('contract', 'blueprint', 'permit', 'invoice', 'report', 'other');
CREATE TYPE documents.signature_type AS ENUM ('simple', 'advanced');

CREATE TABLE documents.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects.projects(id),
  type documents.document_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_version INT DEFAULT 1,
  s3_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  is_confidential BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents.versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents.documents(id),
  version INT NOT NULL,
  s3_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  change_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, version)
);

CREATE TABLE documents.signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents.documents(id),
  signer_id UUID REFERENCES auth.users(id),
  type documents.signature_type NOT NULL,
  signature_data TEXT,
  certificate TEXT,
  signed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---
**Generado:** 2025-11-21
