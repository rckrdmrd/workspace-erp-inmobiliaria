# US-BI-008: Integracion con Power BI y Tableau

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 22
**Story Points:** 8
**Prioridad:** Media
**Asignado a:** Backend + Data Engineering

---

## Historia de Usuario

**Como** Data Analyst (Analista de Datos)
**Quiero** conectar herramientas de BI como Power BI y Tableau a los datos del sistema
**Para** crear analisis avanzados y dashboards personalizados con herramientas especializadas

---

## Criterios de Aceptacion

### 1. API REST para Extraccion de Datos
- [ ] Sistema expone API REST documentada para extraccion de datos
- [ ] La API incluye endpoints para todas las entidades principales:
  - Proyectos y metadata
  - Presupuestos y costos
  - Avances de obra
  - Compras e inventarios
  - Recursos humanos y asistencias
  - Estimaciones y facturacion
- [ ] Cada endpoint soporta:
  - Filtros por fecha, proyecto, estado
  - Paginacion (limit/offset)
  - Ordenamiento
  - Seleccion de campos (sparse fieldsets)
  - Formato JSON

### 2. Conector ODBC/JDBC
- [ ] Sistema proporciona driver ODBC para Windows
- [ ] Sistema proporciona driver JDBC para herramientas Java
- [ ] Los drivers permiten:
  - Conexion segura con credenciales
  - Queries SQL directas sobre vistas
  - Acceso a datos en tiempo real
  - Soporte para todas las tablas principales
- [ ] Documentacion de instalacion y configuracion

### 3. Vistas SQL Optimizadas para BI
- [ ] Base de datos incluye vistas SQL predefinidas para BI:
  - `vw_bi_projects_summary` - Resumen de proyectos
  - `vw_bi_budget_vs_actual` - Presupuesto vs real
  - `vw_bi_cost_breakdown` - Desglose de costos
  - `vw_bi_progress_timeline` - Avances en el tiempo
  - `vw_bi_purchase_analysis` - Analisis de compras
  - `vw_bi_labor_productivity` - Productividad de MO
  - `vw_bi_cashflow_projection` - Proyeccion de flujo
  - `vw_bi_kpis_consolidated` - KPIs consolidados
- [ ] Las vistas estan optimizadas (indices, materializadas si aplica)
- [ ] Cada vista incluye documentacion de campos

### 4. Sincronizacion Incremental
- [ ] Sistema soporta sincronizacion incremental de datos:
  - Solo extrae registros nuevos o modificados
  - Usa campo `updated_at` para detectar cambios
  - Reduce tiempo de sincronizacion en 90%
- [ ] API incluye endpoints para sync incremental:
  - `GET /api/bi/sync/projects?since=2025-11-01`
  - `GET /api/bi/sync/costs?since=2025-11-01`
- [ ] Soporte para cambios eliminados (soft deletes)

### 5. Refresh Automatico Programado
- [ ] Puedo configurar refresh automatico de datos en Power BI/Tableau
- [ ] Sistema soporta webhooks para notificar cambios:
  - Webhook cuando hay nuevos avances
  - Webhook cuando se actualizan costos
  - Webhook cuando se crea nueva estimacion
- [ ] Las herramientas BI pueden suscribirse a webhooks
- [ ] Documentacion de configuracion de refresh

### 6. Data Lake / Data Warehouse (Opcional)
- [ ] Sistema puede exportar datos a Data Lake:
  - Soporte para AWS S3
  - Soporte para Azure Blob Storage
  - Soporte para Google Cloud Storage
- [ ] Exportacion en formatos:
  - Parquet (columnar, optimizado)
  - CSV (compatible)
  - JSON (flexible)
- [ ] Exportacion puede ser:
  - Full snapshot (todo)
  - Incremental (solo cambios)
  - Programada (diaria, semanal)

### 7. Autenticacion y Seguridad
- [ ] Conexiones BI usan autenticacion segura:
  - API Keys con permisos especificos
  - OAuth 2.0 para Power BI/Tableau
  - Tokens JWT con expiracion
- [ ] Los usuarios BI solo ven datos que tienen permiso de ver
- [ ] Se aplican Row-Level Security (RLS) segun usuario
- [ ] Todas las conexiones son HTTPS/TLS
- [ ] Se registran auditorias de acceso a datos

### 8. Templates Pre-Configurados
- [ ] Sistema incluye templates listos para usar:
  - **Power BI:** Dashboard Ejecutivo (.pbix)
  - **Power BI:** Analisis Financiero (.pbix)
  - **Tableau:** Project Portfolio (.twb)
  - **Tableau:** Cost Analysis (.twb)
- [ ] Los templates incluyen:
  - Conexion pre-configurada (solo cambiar credenciales)
  - Visualizaciones predefinidas
  - Calculos DAX/LOD ya creados
  - Filtros y slicers configurados
- [ ] Templates son descargables desde el sistema

### 9. Documentacion y Modelo de Datos
- [ ] Sistema proporciona documentacion completa:
  - Diccionario de datos (todas las tablas y campos)
  - Diagrama ER (Entity-Relationship)
  - Modelo dimensional (Star Schema si aplica)
  - Ejemplos de queries SQL comunes
  - Guias de conexion paso a paso
- [ ] Documentacion accesible online
- [ ] Incluye casos de uso y mejores practicas

### 10. Monitoreo de Integraciones
- [ ] Puedo ver dashboard de integraciones BI activas:
  - Cuantas conexiones activas hay
  - Ultimo acceso de cada conexion
  - Volumenes de datos extraidos
  - Errores de conexion recientes
  - Usuarios que usan integracion
- [ ] Recibo alertas si:
  - Una integracion falla repetidamente
  - Uso de datos excede limites
  - Credenciales estan por expirar
- [ ] Puedo revocar credenciales de BI en cualquier momento

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔌 Integraciones con Power BI y Tableau                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ Metodos de Conexion ────────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ Seleccione el metodo de integracion que desea configurar:                ││
│ │                                                                           ││
│ │ ┌────────────────┐  ┌────────────────┐  ┌────────────────┐              ││
│ │ │ 🔗 API REST    │  │ 🗄️ ODBC/JDBC   │  │ 📦 Data Export │              ││
│ │ │                │  │                │  │                │              ││
│ │ │ Extraccion via │  │ Conexion       │  │ Exportacion a  │              ││
│ │ │ endpoints HTTP │  │ directa SQL    │  │ Cloud Storage  │              ││
│ │ │                │  │                │  │                │              ││
│ │ │ [Configurar →] │  │ [Configurar →] │  │ [Configurar →] │              ││
│ │ └────────────────┘  └────────────────┘  └────────────────┘              ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Configuracion API REST ──────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ 1️⃣ Generar Credenciales                                                  ││
│ │                                                                           ││
│ │ Nombre de la conexion: [Power BI - Dashboard Ejecutivo_____________]     ││
│ │                                                                           ││
│ │ Permisos:  [✓] Proyectos  [✓] Presupuestos  [✓] Avances                 ││
│ │            [✓] Costos     [ ] Compras        [ ] RRHH                    ││
│ │                                                                           ││
│ │ Expiracion: (●) 1 año  ( ) 6 meses  ( ) 3 meses  ( ) Sin expiracion     ││
│ │                                                                           ││
│ │ [🔑 Generar API Key]                                                      ││
│ │                                                                           ││
│ │ ✅ API Key generada exitosamente:                                        ││
│ │                                                                           ││
│ │ ┌──────────────────────────────────────────────────────────────────┐     ││
│ │ │ API_KEY: sk_live_abc123def456ghi789jkl012mno345pqr678            │     ││
│ │ │                                                           [📋 Copy]│     ││
│ │ └──────────────────────────────────────────────────────────────────┘     ││
│ │                                                                           ││
│ │ ⚠️ Guarde esta clave en lugar seguro. No se volvera a mostrar.          ││
│ │                                                                           ││
│ │ 2️⃣ Endpoints Disponibles                                                 ││
│ │                                                                           ││
│ │ Base URL: https://api.empresa.com/v1                                     ││
│ │                                                                           ││
│ │ ┌──────────────────────────────────────────────────────────────────┐     ││
│ │ │ Proyectos:                                                       │     ││
│ │ │ GET /api/bi/projects                   Lista todos los proyectos │     ││
│ │ │ GET /api/bi/projects/{id}              Detalle de proyecto       │     ││
│ │ │ GET /api/bi/projects/summary           Resumen consolidado       │     ││
│ │ │                                                                  │     ││
│ │ │ Presupuestos:                                                    │     ││
│ │ │ GET /api/bi/budgets                    Lista presupuestos        │     ││
│ │ │ GET /api/bi/budgets/vs-actual          Presupuesto vs Real       │     ││
│ │ │ GET /api/bi/cost-breakdown             Desglose de costos        │     ││
│ │ │                                                                  │     ││
│ │ │ Avances:                                                         │     ││
│ │ │ GET /api/bi/progress                   Avances de obra           │     ││
│ │ │ GET /api/bi/progress/timeline          Linea de tiempo          │     ││
│ │ │                                                                  │     ││
│ │ │ [📚 Ver Documentacion Completa →]                                │     ││
│ │ └──────────────────────────────────────────────────────────────────┘     ││
│ │                                                                           ││
│ │ 3️⃣ Ejemplo de Uso en Power BI                                            ││
│ │                                                                           ││
│ │ ┌──────────────────────────────────────────────────────────────────┐     ││
│ │ │ 1. Abrir Power BI Desktop                                        │     ││
│ │ │ 2. Obtener Datos → Web                                           │     ││
│ │ │ 3. URL: https://api.empresa.com/v1/api/bi/projects               │     ││
│ │ │ 4. Avanzado → Agregar header:                                    │     ││
│ │ │    Authorization: Bearer sk_live_abc123...                       │     ││
│ │ │ 5. Conectar → Transformar datos                                  │     ││
│ │ │                                                                  │     ││
│ │ │ [📥 Descargar Template Power BI]                                 │     ││
│ │ └──────────────────────────────────────────────────────────────────┘     ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Templates Pre-Configurados ──────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ Descargue templates listos para usar:                                    ││
│ │                                                                           ││
│ │ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐          ││
│ │ │ 📊 Power BI      │ │ 📊 Power BI      │ │ 📈 Tableau       │          ││
│ │ │ Dashboard        │ │ Analisis         │ │ Project          │          ││
│ │ │ Ejecutivo        │ │ Financiero       │ │ Portfolio        │          ││
│ │ │                  │ │                  │ │                  │          ││
│ │ │ Incluye:         │ │ Incluye:         │ │ Incluye:         │          ││
│ │ │ • 12 Visuals     │ │ • 8 Visuals      │ │ • 10 Sheets      │          ││
│ │ │ • KPIs Corp.     │ │ • P&L Analysis   │ │ • Gantt View     │          ││
│ │ │ • Mapas          │ │ • Margins        │ │ • Cost Trend     │          ││
│ │ │                  │ │ • ROI            │ │ • Resource       │          ││
│ │ │                  │ │                  │ │                  │          ││
│ │ │ [📥 Download]    │ │ [📥 Download]    │ │ [📥 Download]    │          ││
│ │ │ .pbix (5.2 MB)   │ │ .pbix (3.8 MB)   │ │ .twb (2.1 MB)    │          ││
│ │ └──────────────────┘ └──────────────────┘ └──────────────────┘          ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Conexiones Activas ──────────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ ┌─────────────────────────────────────────────────────────────────────┐  ││
│ │ │Nombre                │Tipo    │Usuario │Ultimo Acceso │Estado│Accion│  ││
│ │ ├─────────────────────────────────────────────────────────────────────┤  ││
│ │ │Power BI - Dashboard  │API REST│jperez  │Hace 5 min    │🟢 OK │[🗑️] │  ││
│ │ │Tableau - Finanzas    │ODBC    │mgarcia │Hace 2 horas  │🟢 OK │[🗑️] │  ││
│ │ │Data Export - S3      │Export  │sistema │Diario 06:00  │🟢 OK │[⚙️] │  ││
│ │ └─────────────────────────────────────────────────────────────────────┘  ││
│ │                                                                           ││
│ │ Conexiones activas: 3  |  Datos extraidos hoy: 245 MB                    ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Documentacion y Recursos ────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ 📖 [Documentacion API REST]      Referencia completa de endpoints        ││
│ │ 📊 [Diccionario de Datos]        Descripcion de todas las tablas         ││
│ │ 🗺️ [Diagrama ER]                  Modelo de datos visual                 ││
│ │ 💡 [Guia Power BI]                Paso a paso para conexion              ││
│ │ 📈 [Guia Tableau]                 Paso a paso para conexion              ││
│ │ 🔐 [Seguridad y Permisos]         Mejores practicas                      ││
│ │ ❓ [FAQ]                          Preguntas frecuentes                   ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. CONFIGURAR INTEGRACION POWER BI
   ↓
   Usuario (Data Analyst) → Integraciones BI
   ↓
   Selecciona "API REST"
   ↓
   Completa formulario:
   - Nombre: "Power BI - Dashboard Ejecutivo"
   - Permisos: Proyectos, Presupuestos, Avances, Costos
   - Expiracion: 1 año
   ↓
   Hace clic en [Generar API Key]
   ↓
   Sistema:
   - Genera API Key segura
   - Almacena hash en BD
   - Registra permisos
   - Muestra clave (solo una vez)
   ↓
   Usuario copia API Key

2. CONECTAR POWER BI
   ↓
   Usuario abre Power BI Desktop
   ↓
   Obtener Datos → Web
   ↓
   URL: https://api.empresa.com/v1/api/bi/projects
   ↓
   Avanzado → Agregar header HTTP:
   - Nombre: Authorization
   - Valor: Bearer sk_live_abc123...
   ↓
   Conectar
   ↓
   Power BI hace request:
   GET /api/bi/projects
   Headers: { Authorization: "Bearer sk_live_abc..." }
   ↓
   Sistema valida:
   - API Key es valida
   - No esta expirada
   - Tiene permisos para "proyectos"
   ↓
   Sistema responde con JSON:
   {
     "data": [
       { "id": 1, "name": "Los Pinos", "budget": 45200000, ... },
       { "id": 2, "name": "Vertical Reforma", "budget": 38500000, ... }
     ],
     "pagination": { "total": 18, "page": 1, "limit": 100 }
   }
   ↓
   Power BI parsea JSON y crea tabla
   ↓
   Usuario transforma datos en Power Query
   ↓
   Crea visualizaciones

3. DESCARGAR Y USAR TEMPLATE
   ↓
   Usuario hace clic en [Descargar Template Power BI]
   ↓
   Sistema genera archivo .pbix con:
   - Conexion pre-configurada (sin API Key)
   - 12 visualizaciones listas
   - Medidas DAX calculadas
   - Relaciones entre tablas
   ↓
   Usuario descarga archivo
   ↓
   Abre en Power BI Desktop
   ↓
   Sistema pide credenciales (API Key)
   ↓
   Usuario ingresa su API Key
   ↓
   Template se conecta y carga datos
   ↓
   Dashboard listo para usar

4. CONFIGURAR REFRESH AUTOMATICO
   ↓
   Usuario publica dashboard a Power BI Service
   ↓
   En Power BI Service → Dataset → Settings
   ↓
   Configura Scheduled Refresh:
   - Frecuencia: Diaria
   - Hora: 06:00 AM
   ↓
   Power BI Service ejecuta refresh:
   - Hace requests a API con API Key
   - Descarga datos actualizados
   - Actualiza dataset
   - Actualiza dashboards
   ↓
   Usuarios ven datos frescos cada mañana

5. USAR CONECTOR ODBC (TABLEAU)
   ↓
   Usuario descarga driver ODBC del sistema
   ↓
   Instala driver en Windows
   ↓
   Configura DSN (Data Source Name):
   - Server: db.empresa.com
   - Port: 5432
   - Database: erp_production
   - Username: bi_user
   - Password: [generada por sistema]
   ↓
   Abre Tableau Desktop
   ↓
   Connect → Other Databases (ODBC)
   ↓
   Selecciona DSN configurado
   ↓
   Tableau se conecta via ODBC
   ↓
   Usuario ve lista de vistas disponibles:
   - vw_bi_projects_summary
   - vw_bi_budget_vs_actual
   - vw_bi_cost_breakdown
   ↓
   Arrastra vistas a canvas
   ↓
   Crea visualizaciones

6. MONITOREAR INTEGRACIONES
   ↓
   Admin → Integraciones BI → Conexiones Activas
   ↓
   Ve tabla con 3 conexiones activas
   ↓
   Identifica conexion "Power BI - Dashboard"
   - Ultimo acceso: Hace 5 min
   - Estado: OK
   - Datos extraidos hoy: 125 MB
   ↓
   Sistema registra cada request:
   - Timestamp
   - Endpoint accedido
   - Usuario/API Key
   - Volumenes de datos
   ↓
   Admin puede revocar API Key si es necesario
```

---

## Notas Tecnicas

### API REST para BI

```typescript
// Middleware de autenticacion para BI
async function authenticateBIRequest(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing API Key' });
  }

  const apiKey = authHeader.substring(7); // Remover "Bearer "

  // Validar API Key
  const hashedKey = hashApiKey(apiKey);
  const credential = await db.biCredentials.findOne({
    where: { apiKeyHash: hashedKey, isActive: true }
  });

  if (!credential) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }

  // Verificar expiracion
  if (credential.expiresAt && new Date() > credential.expiresAt) {
    return res.status(401).json({ error: 'API Key expired' });
  }

  // Registrar acceso
  await db.biAccessLog.create({
    credentialId: credential.id,
    endpoint: req.path,
    method: req.method,
    ipAddress: req.ip,
    timestamp: new Date()
  });

  // Agregar permisos al request
  req.biPermissions = credential.permissions;
  req.userId = credential.userId;

  next();
}

// Middleware de permisos
function requireBIPermission(resource: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.biPermissions.includes(resource)) {
      return res.status(403).json({
        error: `Permission denied for resource: ${resource}`
      });
    }
    next();
  };
}

// Endpoints BI
const router = express.Router();

// Proyectos
router.get('/api/bi/projects',
  authenticateBIRequest,
  requireBIPermission('projects'),
  async (req, res) => {
    const { page = 1, limit = 100, since } = req.query;

    let query = db.projects.findAll({
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['updatedAt', 'DESC']]
    });

    // Sync incremental
    if (since) {
      query = query.where('updatedAt', '>=', new Date(since));
    }

    const projects = await query;
    const total = await db.projects.count();

    res.json({
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  }
);

// Presupuesto vs Real
router.get('/api/bi/budgets/vs-actual',
  authenticateBIRequest,
  requireBIPermission('budgets'),
  async (req, res) => {
    const data = await db.query(`
      SELECT
        p.id,
        p.name,
        p.budget_total,
        SUM(c.amount) as actual_cost,
        (SUM(c.amount) - p.budget_total) as variance,
        ((SUM(c.amount) - p.budget_total) / p.budget_total * 100) as variance_pct
      FROM projects p
      LEFT JOIN costs c ON c.project_id = p.id
      GROUP BY p.id, p.name, p.budget_total
    `);

    res.json({ data });
  }
);

// Muchos mas endpoints...
```

### Vistas SQL para BI

```sql
-- Vista: Resumen de Proyectos
CREATE OR REPLACE VIEW vw_bi_projects_summary AS
SELECT
  p.id,
  p.code,
  p.name,
  p.type,
  p.region,
  p.status,
  p.start_date,
  p.end_date,
  p.budget_total,
  p.contract_amount,
  COALESCE(c.total_cost, 0) as actual_cost,
  COALESCE(a.progress_percentage, 0) as progress,
  COALESCE(c.total_cost - p.budget_total, 0) as cost_variance,
  COALESCE((c.total_cost - p.budget_total) / p.budget_total * 100, 0) as cost_variance_pct,
  COALESCE((p.contract_amount - c.total_cost) / p.contract_amount * 100, 0) as margin_pct,
  CASE
    WHEN c.total_cost > p.budget_total * 1.10 THEN 'HIGH'
    WHEN c.total_cost > p.budget_total * 1.05 THEN 'MEDIUM'
    ELSE 'LOW'
  END as risk_level,
  p.created_at,
  p.updated_at
FROM projects p
LEFT JOIN (
  SELECT
    project_id,
    SUM(amount) as total_cost
  FROM costs
  GROUP BY project_id
) c ON c.project_id = p.id
LEFT JOIN (
  SELECT
    project_id,
    MAX(progress_percentage) as progress_percentage
  FROM progress_reports
  GROUP BY project_id
) a ON a.project_id = p.id;

-- Vista: Presupuesto vs Real (Desglosado)
CREATE OR REPLACE VIEW vw_bi_budget_vs_actual AS
SELECT
  bi.id,
  bi.project_id,
  p.name as project_name,
  bi.item_code,
  bi.item_name,
  bi.category,
  bi.budgeted_quantity,
  bi.budgeted_unit_price,
  bi.budgeted_amount,
  COALESCE(actual.quantity, 0) as actual_quantity,
  COALESCE(actual.amount, 0) as actual_amount,
  COALESCE(actual.amount - bi.budgeted_amount, 0) as variance,
  COALESCE((actual.amount - bi.budgeted_amount) / bi.budgeted_amount * 100, 0) as variance_pct
FROM budget_items bi
JOIN projects p ON p.id = bi.project_id
LEFT JOIN (
  SELECT
    budget_item_id,
    SUM(quantity) as quantity,
    SUM(amount) as amount
  FROM cost_transactions
  GROUP BY budget_item_id
) actual ON actual.budget_item_id = bi.id;

-- Vista: Timeline de Avances
CREATE OR REPLACE VIEW vw_bi_progress_timeline AS
SELECT
  pr.id,
  pr.project_id,
  p.name as project_name,
  pr.report_date,
  pr.progress_percentage,
  pr.progress_amount,
  pr.status,
  LAG(pr.progress_percentage) OVER (
    PARTITION BY pr.project_id
    ORDER BY pr.report_date
  ) as previous_progress,
  pr.progress_percentage - LAG(pr.progress_percentage) OVER (
    PARTITION BY pr.project_id
    ORDER BY pr.report_date
  ) as progress_increment
FROM progress_reports pr
JOIN projects p ON p.id = pr.project_id
ORDER BY pr.project_id, pr.report_date;

-- Indices para optimizar vistas
CREATE INDEX idx_costs_project_id ON costs(project_id);
CREATE INDEX idx_progress_reports_project_id ON progress_reports(project_id);
CREATE INDEX idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX idx_projects_updated_at ON projects(updated_at);
```

### Conector ODBC

```ini
; Archivo de configuracion ODBC (odbc.ini)
[ERP_BI_Connection]
Description=ERP System BI Connection
Driver=PostgreSQL Unicode
Server=db.empresa.com
Port=5432
Database=erp_production
Username=bi_user
Password=********
ReadOnly=Yes
Protocol=7.4
FetchBufferSize=100

; Configuracion de seguridad
SSLMode=require
UseServerSidePrepare=1
```

### Endpoints Necesarios

```typescript
// Credenciales BI
POST   /api/bi-credentials                      // Generar API Key
GET    /api/bi-credentials                      // Listar mis credenciales
DELETE /api/bi-credentials/:id                  // Revocar API Key

// Extraccion de datos
GET    /api/bi/projects                         // Proyectos
GET    /api/bi/projects/:id                     // Proyecto especifico
GET    /api/bi/projects/summary                 // Resumen
GET    /api/bi/budgets                          // Presupuestos
GET    /api/bi/budgets/vs-actual                // Presup vs Real
GET    /api/bi/costs                            // Costos
GET    /api/bi/cost-breakdown                   // Desglose costos
GET    /api/bi/progress                         // Avances
GET    /api/bi/progress/timeline                // Timeline avances
GET    /api/bi/kpis                             // KPIs consolidados

// Sync incremental
GET    /api/bi/sync/projects?since=date         // Proyectos modificados
GET    /api/bi/sync/costs?since=date            // Costos modificados

// Webhooks
POST   /api/bi/webhooks                         // Registrar webhook
DELETE /api/bi/webhooks/:id                     // Eliminar webhook

// Templates
GET    /api/bi/templates                        // Listar templates
GET    /api/bi/templates/:id/download           // Descargar template

// Monitoreo
GET    /api/bi/connections                      // Conexiones activas
GET    /api/bi/access-log                       // Log de accesos
GET    /api/bi/usage-stats                      // Estadisticas de uso

// Documentacion
GET    /api/bi/docs                             // Documentacion API
GET    /api/bi/schema                           // Modelo de datos
```

---

## Definicion de "Done"

- [ ] API REST completa con 20+ endpoints para BI
- [ ] Documentacion de API con Swagger/OpenAPI
- [ ] Driver ODBC para Windows instalable
- [ ] Driver JDBC para herramientas Java
- [ ] 8 vistas SQL optimizadas para BI
- [ ] Soporte para sincronizacion incremental
- [ ] Sistema de API Keys con permisos granulares
- [ ] Autenticacion OAuth 2.0 implementada
- [ ] Row-Level Security aplicada
- [ ] 4 templates pre-configurados (2 Power BI, 2 Tableau)
- [ ] Webhooks para notificaciones de cambios
- [ ] Exportacion a S3/Azure/GCS funcional
- [ ] Dashboard de monitoreo de integraciones
- [ ] Diccionario de datos completo
- [ ] Diagrama ER documentado
- [ ] Guias de conexion para Power BI y Tableau
- [ ] Tests de endpoints de BI
- [ ] Performance: endpoints responden en <1s
- [ ] Validado con Data Analysts

---

**Estimacion:** 8 Story Points
**Dependencias:** Requiere todos los modulos del sistema
**Fecha:** 2025-11-18
