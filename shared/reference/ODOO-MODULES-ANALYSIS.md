# 📊 ANÁLISIS DE MÓDULOS ODOO - REFERENCIA PARA PROYECTO INMOBILIARIA

**Proyecto:** Sistema de Administración de Obra e INFONAVIT
**Repositorio Odoo:** Community Edition v18.0
**Última actualización:** 2025-11-22
**Commit:** 1e3e1e13d3e161f8896c37c606b0472a49a19965
**Tamaño:** 1.2 GB
**Total de módulos:** 609
**Licencia:** LGPL v3

---

## 🎯 OBJETIVO

Documentar los módulos más relevantes de Odoo Community Edition que pueden servir como referencia para el desarrollo del Sistema de Administración de Obra e INFONAVIT.

---

## 📁 ESTRUCTURA GENERAL DE ODOO

```
odoo/
├── odoo/                      # Core del framework
│   ├── api.py                 # Decoradores y sistema de API
│   ├── fields.py              # Tipos de campos del ORM (236 KB)
│   ├── models.py              # Sistema ORM de Odoo (341 KB)
│   ├── http.py                # Controllers y rutas HTTP
│   ├── sql_db.py              # Capa de base de datos
│   ├── tools/                 # Herramientas y utilidades
│   ├── tests/                 # Sistema de testing
│   └── modules/               # Gestión de módulos
│
├── addons/                    # 609 módulos oficiales
│   ├── project/               # ⭐ Gestión de proyectos
│   ├── sale/                  # ⭐ Ventas
│   ├── purchase/              # ⭐ Compras
│   ├── stock/                 # ⭐ Inventario
│   ├── account/               # ⭐ Contabilidad
│   ├── hr/                    # ⭐ Recursos Humanos
│   ├── crm/                   # ⭐ CRM
│   └── ...                    # 602 módulos más
│
└── doc/                       # Documentación oficial
```

---

## ⭐ MÓDULOS CLAVE PARA REFERENCIA

### 1. **PROJECT** - Gestión de Proyectos

**Ubicación:** `reference/odoo/addons/project/`

**Descripción:**
Módulo principal para organizar y planificar proyectos de construcción.

**Características relevantes:**
- ✅ Gestión de tareas y subtareas
- ✅ Etapas personalizables (stages)
- ✅ Milestones (hitos)
- ✅ Integración con analytic accounts
- ✅ Portal de clientes
- ✅ Sistema de calificaciones (ratings)
- ✅ Actualizaciones de proyecto
- ✅ Burndown charts

**Estructura de archivos clave:**
```
project/
├── models/
│   ├── project_project.py        # Modelo principal de proyecto
│   ├── project_task.py            # Modelo de tareas
│   ├── project_milestone.py       # Hitos del proyecto
│   ├── project_update.py          # Actualizaciones de proyecto
│   └── project_task_type.py       # Tipos/etapas de tareas
├── views/
│   ├── project_project_views.xml  # Vistas de proyectos
│   └── project_task_views.xml     # Vistas de tareas
└── security/
    └── project_security.xml       # Reglas de seguridad
```

**Patrones arquitectónicos observados:**
- Uso extensivo de `@api.depends` para campos computados
- Integración con `mail.thread` para tracking de cambios
- Portal views para acceso externo
- Sistema de stages con drag & drop en kanban
- Uso de `analytic.account` para costos

**Aplicabilidad al proyecto:** 🟢 ALTA
Ideal para gestionar proyectos de construcción, tareas de obra, y milestones de avance.

---

### 2. **PROJECT_PURCHASE** - Compras en Proyectos

**Ubicación:** `reference/odoo/addons/project_purchase/`

**Descripción:**
Integración entre proyectos y compras para monitorear gastos.

**Características relevantes:**
- ✅ Vincular órdenes de compra a proyectos
- ✅ Tracking de costos por proyecto
- ✅ Integración con contabilidad analítica

**Estructura:**
```
project_purchase/
├── views/
│   ├── project_project.xml       # Vista extendida de proyecto
│   └── purchase_order.xml         # Vista extendida de compra
└── data/
    └── project_purchase_demo.xml  # Datos de demostración
```

**Aplicabilidad al proyecto:** 🟢 ALTA
Esencial para vincular compras de materiales a proyectos de obra.

---

### 3. **SALE** - Gestión de Ventas

**Ubicación:** `reference/odoo/addons/sale/`

**Descripción:**
Módulo completo para gestión de cotizaciones, órdenes de venta y contratos.

**Características relevantes:**
- ✅ Cotizaciones y órdenes de venta
- ✅ Líneas de productos/servicios
- ✅ Términos y condiciones
- ✅ Portal de clientes para aprobar cotizaciones
- ✅ Facturación desde ventas
- ✅ Teams de ventas

**Estructura de archivos clave:**
```
sale/
├── models/
│   ├── sale_order.py              # Órdenes de venta
│   ├── sale_order_line.py         # Líneas de orden
│   └── res_partner.py             # Extensión de partner
├── views/
│   └── sale_order_views.xml       # Vistas de ventas
└── report/
    └── sale_report.py             # Reportes de ventas
```

**Patrones destacables:**
- Estado de orden con flujo bien definido (draft → sent → sale → done)
- Uso de `product.template` y `product.product`
- Integración con `account.move` para facturación
- Portal views con firma electrónica

**Aplicabilidad al proyecto:** 🟢 ALTA
Para contratos de venta de vivienda, cotizaciones de proyectos.

---

### 4. **PURCHASE** - Gestión de Compras

**Ubicación:** `reference/odoo/addons/purchase/`

**Descripción:**
Sistema completo de gestión de compras, proveedores y requisiciones.

**Características relevantes:**
- ✅ Órdenes de compra
- ✅ Solicitudes de cotización (RFQ)
- ✅ Gestión de proveedores
- ✅ Confirmación de recepción
- ✅ Control de facturas de proveedor

**Estructura clave:**
```
purchase/
├── models/
│   ├── purchase_order.py          # Órdenes de compra
│   ├── purchase_order_line.py     # Líneas de compra
│   └── res_partner.py             # Proveedores
├── views/
│   └── purchase_order_views.xml   # Vistas de compras
└── wizard/
    └── purchase_make_invoice.py   # Asistente para facturas
```

**Aplicabilidad al proyecto:** 🟢 ALTA
Para compras de materiales, contratación de subcontratistas.

---

### 5. **STOCK** - Gestión de Inventario

**Ubicación:** `reference/odoo/addons/stock/`

**Descripción:**
Sistema completo de gestión de almacenes, inventario y logística.

**Características relevantes:**
- ✅ Gestión de almacenes (warehouses)
- ✅ Ubicaciones de almacenamiento
- ✅ Movimientos de inventario (stock moves)
- ✅ Pickings (albaranes/guías)
- ✅ Trazabilidad de productos (lotes y series)
- ✅ Estrategias de reabastecimiento
- ✅ Inventario en tiempo real

**Estructura:**
```
stock/
├── models/
│   ├── stock_warehouse.py         # Almacenes
│   ├── stock_location.py          # Ubicaciones
│   ├── stock_move.py              # Movimientos de stock
│   ├── stock_picking.py           # Albaranes/guías
│   ├── stock_quant.py             # Cantidades en stock
│   └── stock_lot.py               # Lotes y series
├── views/
│   └── stock_views.xml            # Vistas de inventario
└── report/
    └── stock_report.py            # Reportes de inventario
```

**Patrones arquitectónicos:**
- Uso de `stock.location` para estructura jerárquica de almacenes
- `stock.move` como registro de todos los movimientos
- `stock.quant` para cantidades reales en ubicaciones
- Estrategias FIFO/LIFO implementadas

**Aplicabilidad al proyecto:** 🟢 ALTA
Para inventario de materiales, control de almacenes en obra.

---

### 6. **ACCOUNT** - Contabilidad

**Ubicación:** `reference/odoo/addons/account/`

**Descripción:**
Sistema contable completo con plan de cuentas, facturas, pagos y reportes financieros.

**Características relevantes:**
- ✅ Plan de cuentas (chart of accounts)
- ✅ Asientos contables (journal entries)
- ✅ Facturas de cliente y proveedor
- ✅ Pagos y conciliación bancaria
- ✅ Reportes financieros (balance, P&L)
- ✅ Multi-moneda
- ✅ Cuentas analíticas

**Estructura:**
```
account/
├── models/
│   ├── account_move.py            # Asientos contables
│   ├── account_move_line.py       # Líneas de asientos
│   ├── account_account.py         # Plan de cuentas
│   ├── account_payment.py         # Pagos
│   └── account_journal.py         # Diarios contables
├── views/
│   └── account_views.xml          # Vistas contables
└── report/
    └── account_financial_report.py # Reportes financieros
```

**Aplicabilidad al proyecto:** 🟢 ALTA
Para contabilidad del proyecto, facturas, control financiero.

---

### 7. **HR** - Recursos Humanos

**Ubicación:** `reference/odoo/addons/hr/`

**Descripción:**
Gestión de empleados, departamentos, contratos y nómina.

**Características relevantes:**
- ✅ Gestión de empleados
- ✅ Departamentos y puestos
- ✅ Contratos laborales
- ✅ Asistencia y permisos
- ✅ Organigrama
- ✅ Habilidades y competencias

**Módulos relacionados relevantes:**
- `hr_attendance` - Control de asistencia
- `hr_contract` - Contratos laborales
- `hr_timesheet` - Control de horas trabajadas
- `hr_expense` - Gastos de empleados

**Aplicabilidad al proyecto:** 🟡 MEDIA
Para gestión de personal de obra, asistencias, nómina.

---

### 8. **HR_CONTRACT** - Contratos Laborales

**Ubicación:** `reference/odoo/addons/hr_contract/`

**Descripción:**
Gestión de contratos de trabajo, salarios y renovaciones.

**Características relevantes:**
- ✅ Definición de contratos
- ✅ Tipos de contrato
- ✅ Salarios y beneficios
- ✅ Fechas de inicio/fin
- ✅ Renovaciones automáticas

**Aplicabilidad al proyecto:** 🟡 MEDIA
Para contratos de empleados y subcontratistas.

---

### 9. **CRM** - Customer Relationship Management

**Ubicación:** `reference/odoo/addons/crm/`

**Descripción:**
Gestión de oportunidades de venta, pipeline y leads.

**Características relevantes:**
- ✅ Gestión de leads/oportunidades
- ✅ Pipeline de ventas
- ✅ Actividades y seguimiento
- ✅ Conversión a cotización
- ✅ Reportes de rendimiento

**Aplicabilidad al proyecto:** 🟡 MEDIA
Para seguimiento de prospectos de venta de viviendas.

---

### 10. **MRP_SUBCONTRACTING** - Subcontratación

**Ubicación:** `reference/odoo/addons/mrp_subcontracting/`

**Descripción:**
Gestión de subcontratación de producción/manufactura.

**Características relevantes:**
- ✅ Gestión de subcontratistas
- ✅ Órdenes a subcontratistas
- ✅ Control de componentes enviados
- ✅ Recepción de productos terminados
- ✅ Portal para subcontratistas

**Estructura:**
```
mrp_subcontracting/
├── models/
│   ├── mrp_bom.py                 # Bill of Materials
│   ├── res_partner.py             # Subcontratistas
│   └── stock_picking.py           # Envíos a subcontratistas
├── views/
│   └── subcontracting_portal_views.xml # Portal
└── security/
    └── mrp_subcontracting_security.xml # Seguridad
```

**Aplicabilidad al proyecto:** 🟢 ALTA
Para gestión de subcontratistas en obra (electricistas, plomeros, etc.)

---

## 🏗️ MÓDULOS ADICIONALES RELEVANTES

### Por Categoría

#### **Gestión de Proyectos y Obra**
- `project_stock` - Integración proyecto-inventario
- `project_account` - Integración proyecto-contabilidad
- `project_timesheet_holidays` - Integración con vacaciones
- `project_milestone` - Hitos de proyecto

#### **Compras e Inventario**
- `purchase_stock` - Integración compra-inventario
- `purchase_requisition` - Requisiciones de compra
- `stock_landed_costs` - Costos de importación
- `stock_picking_batch` - Procesamiento por lotes

#### **Contabilidad y Finanzas**
- `account_payment` - Gestión de pagos
- `analytic` - Contabilidad analítica (ESENCIAL para costos por proyecto)
- `account_tax_python` - Impuestos con Python
- `account_edi` - Facturación electrónica

#### **Recursos Humanos**
- `hr_attendance` - Control de asistencia
- `hr_timesheet` - Control de horas
- `hr_expense` - Gastos de empleados
- `hr_maintenance` - Mantenimiento de equipos

#### **Ventas y CRM**
- `sale_project` - Integración venta-proyecto
- `sale_crm` - Integración venta-CRM
- `sale_stock` - Integración venta-inventario

---

## 🔧 CORE DE ODOO - Archivos Clave

### **`odoo/api.py`** (63 KB)
Decoradores y sistema de API:
- `@api.model` - Método de clase
- `@api.depends(...)` - Campos computados con dependencias
- `@api.onchange(...)` - Eventos onChange en UI
- `@api.constrains(...)` - Validaciones

**Ejemplo de uso:**
```python
@api.depends('order_line.price_total')
def _compute_amount(self):
    for order in self:
        order.amount_total = sum(order.order_line.mapped('price_total'))
```

### **`odoo/fields.py`** (236 KB)
Tipos de campos del ORM:
- `Char`, `Text`, `Integer`, `Float`, `Boolean`
- `Date`, `Datetime`
- `Many2one`, `One2many`, `Many2many`
- `Selection`, `Binary`, `Html`
- `Monetary` (para monedas)

**Ejemplo de uso:**
```python
name = fields.Char(string='Name', required=True)
amount = fields.Monetary(string='Amount', currency_field='currency_id')
partner_id = fields.Many2one('res.partner', string='Partner')
```

### **`odoo/models.py`** (341 KB)
Sistema ORM de Odoo:
- `Model` - Clase base para modelos persistentes
- `TransientModel` - Modelos temporales (wizards)
- `AbstractModel` - Modelos abstractos (herencia)
- CRUD operations: `create()`, `write()`, `unlink()`
- Búsquedas: `search()`, `search_count()`, `browse()`

**Patrones observados:**
- Herencia múltiple con `_inherit`
- Delegación con `_inherits`
- Computed fields con `@api.depends`
- Constraints con `@api.constrains`

### **`odoo/http.py`** (101 KB)
Controllers y rutas HTTP:
- Decorador `@http.route()`
- Tipos de autenticación: `public`, `user`
- Request/Response handling
- JSON-RPC support

**Ejemplo:**
```python
from odoo import http

class MyController(http.Controller):
    @http.route('/my/route', type='http', auth='user')
    def my_handler(self):
        return "Hello World"
```

---

## 📚 MEJORES PRÁCTICAS IDENTIFICADAS

### 1. **Estructura de Módulos**
Todos los módulos siguen la estructura:
```
module_name/
├── __init__.py
├── __manifest__.py          # Metadatos del módulo
├── models/
│   ├── __init__.py
│   └── model_name.py
├── views/
│   └── views.xml
├── security/
│   ├── ir.model.access.csv  # Permisos de modelo
│   └── security.xml          # Reglas de seguridad
├── data/
│   └── data.xml             # Datos iniciales
├── demo/
│   └── demo.xml             # Datos de demostración
└── static/
    └── src/                 # Assets JS/CSS
```

### 2. **Naming Conventions**
- Modelos: `module.model_name` (ej: `project.task`)
- Campos Many2one: `partner_id`, `project_id`
- Campos One2many: `line_ids`, `task_ids`
- Campos compute: `_compute_<field_name>`
- Views: `view_<model>_<type>` (ej: `view_project_task_form`)

### 3. **Security**
- Siempre definir `ir.model.access.csv` con permisos CRUD
- Usar record rules para filtrado por usuario/empresa
- Grupos de seguridad bien definidos

### 4. **Vistas**
- Vista form para edición individual
- Vista tree/list para listados
- Vista kanban para tableros
- Vista calendar para eventos
- Vista pivot/graph para análisis

### 5. **Integración con mail.thread**
Casi todos los modelos importantes heredan de `mail.thread` para:
- Tracking de cambios
- Mensajes y notificaciones
- Actividades programadas
- Followers

**Ejemplo:**
```python
class ProjectTask(models.Model):
    _name = 'project.task'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(tracking=True)  # Cambios registrados
    state = fields.Selection(tracking=True)
```

---

## 🎨 PATRONES ARQUITECTÓNICOS DESTACABLES

### 1. **Estado con Workflow**
Uso de `Selection` fields con estados bien definidos:
```python
state = fields.Selection([
    ('draft', 'Draft'),
    ('confirmed', 'Confirmed'),
    ('done', 'Done'),
    ('cancel', 'Cancelled')
], default='draft', tracking=True)
```

### 2. **Contabilidad Analítica**
Integración con `account.analytic.account` para tracking de costos:
- Cada proyecto tiene una cuenta analítica
- Todas las transacciones se registran ahí
- Permite reportes de costos por proyecto

### 3. **Portal Views**
Sistema de portal para clientes externos:
- Vista limitada de sus proyectos/órdenes
- Acciones permitidas (aprobar, comentar)
- Seguridad con record rules

### 4. **Multi-Company**
Soporte nativo para múltiples empresas:
- Campo `company_id` en modelos relevantes
- Record rules filtran por empresa
- Usuarios pueden cambiar de empresa

### 5. **Wizard Pattern**
Uso de `TransientModel` para wizards/asistentes:
```python
class ProjectShareWizard(models.TransientModel):
    _name = 'project.share.wizard'
    _description = 'Share Project Wizard'
```

---

## 📖 GUÍA DE USO PARA DESARROLLO

### Cuando implementar funcionalidad X, consultar:

| **Funcionalidad** | **Módulo de Referencia** | **Archivos Clave** |
|-------------------|--------------------------|-------------------|
| Gestión de proyectos | `project` | `models/project_project.py`, `models/project_task.py` |
| Órdenes de compra | `purchase` | `models/purchase_order.py` |
| Inventario de materiales | `stock` | `models/stock_quant.py`, `models/stock_move.py` |
| Facturación | `account` | `models/account_move.py` |
| Contratos | `hr_contract`, `sale` | `models/hr_contract.py`, `models/sale_order.py` |
| Subcontratistas | `mrp_subcontracting` | `models/res_partner.py`, `views/subcontracting_portal_views.xml` |
| Reportes de costos | `analytic`, `project_account` | `models/account_analytic_account.py` |
| Portal de clientes | `project` (portal) | `views/project_portal_templates.xml` |
| Asistencia de empleados | `hr_attendance` | `models/hr_attendance.py` |
| Control de horas | `hr_timesheet` | `models/account_analytic_line.py` |

### Flujo de consulta recomendado:

1. **Identificar funcionalidad** a implementar
2. **Localizar módulo** relevante en `reference/odoo/addons/`
3. **Leer `__manifest__.py`** para entender dependencias
4. **Revisar `models/`** para entender lógica de negocio
5. **Revisar `views/`** para entender UI/UX
6. **Revisar `security/`** para entender permisos
7. **Adaptar patrón** al proyecto actual

---

## 🚀 PRÓXIMOS PASOS

### Análisis Profundo Pendiente

- [ ] Analizar módulo `analytic` para contabilidad analítica
- [ ] Estudiar integración `sale_project` para ventas vinculadas a proyectos
- [ ] Revisar sistema de permisos en módulos grandes
- [ ] Analizar reportes financieros en `account`
- [ ] Estudiar portal views para implementar portal de clientes INFONAVIT
- [ ] Revisar sistema de workflows y estados
- [ ] Analizar patrón de wizards para asistentes

### Documentación Específica a Crear

- [ ] ADR sobre adopción de patrón de estados de Odoo
- [ ] Guía de contabilidad analítica basada en Odoo
- [ ] Estándares de nomenclatura alineados con Odoo
- [ ] Estructura de módulos basada en Odoo

---

## ⚠️ CONSIDERACIONES

### Diferencias con nuestro stack
- **Odoo usa Python + PostgreSQL** vs nuestro stack (definir)
- **Odoo usa ORM propio** vs ORM que usemos (TypeORM, Prisma, etc.)
- **Odoo usa XML para vistas** vs nuestro frontend (React, Vue, etc.)

### Qué adoptar
✅ Patrones de arquitectura (estados, workflows)
✅ Estructura de módulos
✅ Naming conventions
✅ Sistema de permisos por rol
✅ Integración de contabilidad analítica

### Qué adaptar
🔄 ORM patterns (traducir a nuestro ORM)
🔄 View patterns (traducir a React/Vue components)
🔄 API patterns (traducir a REST/GraphQL)

### Qué evitar
❌ No copiar código directamente
❌ No adoptar XML para vistas si usamos frontend moderno
❌ No implementar funcionalidades innecesarias

---

**Fecha de análisis:** 2025-11-23
**Analizado por:** Architecture-Analyst
**Versión:** 1.0.0
**Estado:** ✅ Análisis inicial completado

---

## 📋 REFERENCIAS

- Repositorio oficial: https://github.com/odoo/odoo
- Documentación: https://www.odoo.com/documentation/master/developer.html
- ORM Guide: https://www.odoo.com/documentation/master/developer/reference/backend/orm.html
- Community Association: https://github.com/OCA
