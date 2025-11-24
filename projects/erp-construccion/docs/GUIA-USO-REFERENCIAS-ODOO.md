# 📖 GUÍA DE USO DE REFERENCIAS DE ODOO

**Proyecto:** Sistema de Administración de Obra e INFONAVIT
**Versión:** 1.0.0
**Fecha:** 2025-11-23

---

## 🎯 OBJETIVO

Esta guía explica cómo utilizar el código de referencia de Odoo Community Edition clonado en `reference/odoo/` para mejorar el desarrollo del Sistema de Administración de Obra e INFONAVIT.

---

## 📂 UBICACIÓN DE REFERENCIAS

```
workspace-inmobiliaria/
├── reference/                                  # Código de referencia (NO versionado en git)
│   ├── README.md                               # Instrucciones generales
│   ├── ODOO-MODULES-ANALYSIS.md                # 📊 Análisis detallado de módulos
│   └── odoo/                                   # Odoo Community Edition v18.0
│       ├── odoo/                               # Core del framework
│       │   ├── api.py                          # Sistema de decoradores
│       │   ├── fields.py                       # Tipos de campos ORM
│       │   ├── models.py                       # Sistema ORM
│       │   └── ...
│       └── addons/                             # 609 módulos
│           ├── project/                        # ⭐ Gestión de proyectos
│           ├── sale/                           # ⭐ Ventas
│           ├── purchase/                       # ⭐ Compras
│           ├── stock/                          # ⭐ Inventario
│           └── ...
└── docs/
    └── GUIA-USO-REFERENCIAS-ODOO.md            # 📖 Este documento
```

---

## 🚀 INICIO RÁPIDO

### 1. Verificar que Odoo está clonado

```bash
cd /home/isem/workspace/worskpace-inmobiliaria
ls -la reference/odoo/

# Debe mostrar:
# - odoo/      (core del framework)
# - addons/    (609 módulos)
# - doc/       (documentación)
```

### 2. Consultar análisis de módulos

Lee primero el análisis completo:
```bash
cat reference/ODOO-MODULES-ANALYSIS.md
```

Este documento contiene:
- ✅ Lista de módulos más relevantes para el proyecto
- ✅ Estructura de cada módulo
- ✅ Patrones arquitectónicos identificados
- ✅ Mejores prácticas observadas
- ✅ Guía de qué adoptar, adaptar o evitar

---

## 📋 CASOS DE USO COMUNES

### Caso 1: Implementar Gestión de Proyectos de Obra

**Pregunta:** ¿Cómo implementar gestión de proyectos de construcción?

**Pasos:**

1. **Consultar módulo de referencia:**
   ```bash
   cd reference/odoo/addons/project/
   ```

2. **Leer manifest para entender dependencias:**
   ```bash
   cat __manifest__.py
   ```

3. **Revisar modelos principales:**
   ```bash
   cat models/project_project.py     # Modelo de proyecto
   cat models/project_task.py         # Modelo de tareas
   cat models/project_milestone.py    # Hitos del proyecto
   ```

4. **Identificar patrones arquitectónicos:**
   - Sistema de estados (draft → in_progress → done)
   - Integración con contabilidad analítica
   - Uso de `mail.thread` para tracking
   - Kanban boards con stages personalizables

5. **Adaptar al proyecto:**
   - Traducir lógica Python a TypeScript/JavaScript
   - Adaptar modelos ORM de Odoo a TypeORM/Prisma
   - Implementar vistas similares en React/Vue
   - Mantener los mismos estados y flujos

---

### Caso 2: Implementar Sistema de Compras

**Pregunta:** ¿Cómo gestionar órdenes de compra de materiales?

**Pasos:**

1. **Consultar módulos relacionados:**
   ```bash
   cd reference/odoo/addons/
   ls -d purchase*
   # purchase/
   # purchase_stock/        # Integración con inventario
   # purchase_requisition/  # Requisiciones
   ```

2. **Revisar modelo principal:**
   ```bash
   cat purchase/models/purchase_order.py
   ```

3. **Identificar funcionalidades:**
   - Estados: draft → sent → purchase → done
   - Líneas de compra con productos y cantidades
   - Vinculación con proyectos (via `project_purchase`)
   - Generación de facturas desde órdenes

4. **Ver integración con inventario:**
   ```bash
   cat purchase_stock/models/purchase_order.py
   ```
   - Cómo se crean movimientos de inventario
   - Recepción de materiales
   - Confirmación de cantidades

---

### Caso 3: Implementar Control de Inventario

**Pregunta:** ¿Cómo gestionar inventario de materiales en almacenes?

**Pasos:**

1. **Consultar módulo stock:**
   ```bash
   cd reference/odoo/addons/stock/
   ls models/
   ```

2. **Revisar conceptos clave:**
   - `stock_warehouse.py` - Almacenes
   - `stock_location.py` - Ubicaciones jerárquicas
   - `stock_move.py` - Movimientos de inventario
   - `stock_quant.py` - Cantidades actuales
   - `stock_picking.py` - Albaranes/guías

3. **Entender arquitectura:**
   - Estructura jerárquica de ubicaciones
   - Cada movimiento crea registro de trazabilidad
   - Cantidades se calculan de movimientos
   - Soporte para lotes y números de serie

---

### Caso 4: Implementar Subcontratación

**Pregunta:** ¿Cómo gestionar subcontratistas de obra?

**Pasos:**

1. **Consultar módulo de subcontratación:**
   ```bash
   cd reference/odoo/addons/mrp_subcontracting/
   ```

2. **Revisar funcionalidades:**
   ```bash
   cat models/res_partner.py          # Marca partners como subcontratistas
   cat models/stock_picking.py        # Envíos a subcontratistas
   cat views/subcontracting_portal_views.xml  # Portal para subcontratistas
   ```

3. **Identificar flujo:**
   - Marcar proveedor como subcontratista
   - Crear orden de subcontratación
   - Enviar componentes/materiales
   - Recibir trabajo terminado
   - Portal para que subcontratista vea órdenes

---

### Caso 5: Implementar Contabilidad Analítica

**Pregunta:** ¿Cómo llevar control de costos por proyecto?

**Pasos:**

1. **Consultar módulo analytic:**
   ```bash
   cd reference/odoo/addons/analytic/
   cat models/account_analytic_account.py
   ```

2. **Consultar integración con proyectos:**
   ```bash
   cd reference/odoo/addons/project_account/
   cat models/project_project.py
   ```

3. **Entender patrón:**
   - Cada proyecto tiene una cuenta analítica
   - Todas las transacciones (compras, nómina, gastos) se registran
   - Se pueden generar reportes de costos por proyecto
   - Balance de presupuesto vs real

---

## 🔍 CÓMO BUSCAR IMPLEMENTACIONES

### Buscar por funcionalidad

**Ejemplo:** Quiero ver cómo Odoo implementa aprobaciones de órdenes.

```bash
cd reference/odoo/addons/purchase/
grep -r "approve" --include="*.py" | head -20
```

### Buscar por campo específico

**Ejemplo:** Quiero ver cómo se usan campos `state`.

```bash
cd reference/odoo/addons/sale/
grep -r "state = fields.Selection" --include="*.py"
```

### Buscar validaciones

**Ejemplo:** Quiero ver cómo se implementan constraints.

```bash
cd reference/odoo/addons/account/
grep -r "@api.constrains" --include="*.py" | head -10
```

### Buscar campos computados

**Ejemplo:** Quiero ver cómo se calculan totales.

```bash
cd reference/odoo/addons/sale/
grep -r "@api.depends.*total" --include="*.py" | head -10
```

---

## 🎨 PATRONES A ADOPTAR

### 1. **Sistema de Estados (State Machine)**

**Referencia:** `reference/odoo/addons/sale/models/sale_order.py`

**Patrón Odoo:**
```python
state = fields.Selection([
    ('draft', 'Quotation'),
    ('sent', 'Quotation Sent'),
    ('sale', 'Sales Order'),
    ('done', 'Locked'),
    ('cancel', 'Cancelled'),
], string='Status', readonly=True, default='draft')

def action_confirm(self):
    self.state = 'sale'
    # ... lógica adicional

def action_cancel(self):
    self.state = 'cancel'
```

**Adaptación a nuestro proyecto (TypeScript/TypeORM):**
```typescript
enum OrderState {
  DRAFT = 'draft',
  SENT = 'sent',
  SALE = 'sale',
  DONE = 'done',
  CANCEL = 'cancel',
}

@Entity()
class SaleOrder {
  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.DRAFT,
  })
  state: OrderState;

  async confirm() {
    this.state = OrderState.SALE;
    await this.save();
    // ... lógica adicional
  }

  async cancel() {
    this.state = OrderState.CANCEL;
    await this.save();
  }
}
```

---

### 2. **Campos Computados con Dependencias**

**Referencia:** `reference/odoo/addons/sale/models/sale_order.py`

**Patrón Odoo:**
```python
@api.depends('order_line.price_total')
def _compute_amount_total(self):
    for order in self:
        order.amount_total = sum(order.order_line.mapped('price_total'))

amount_total = fields.Monetary(compute='_compute_amount_total', store=True)
```

**Adaptación a nuestro proyecto:**
```typescript
@Entity()
class SaleOrder {
  @OneToMany(() => SaleOrderLine, line => line.order)
  orderLines: SaleOrderLine[];

  // Getter que calcula el total
  get amountTotal(): number {
    return this.orderLines.reduce((sum, line) => sum + line.priceTotal, 0);
  }

  // O usar un subscriber/hook para calcular y guardar
  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  calculateTotal() {
    this.amountTotal = this.orderLines.reduce(
      (sum, line) => sum + line.priceTotal,
      0
    );
  }
}
```

---

### 3. **Tracking de Cambios (Audit Trail)**

**Referencia:** Casi todos los módulos usan `mail.thread`

**Patrón Odoo:**
```python
class SaleOrder(models.Model):
    _name = 'sale.order'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(tracking=True)      # Cambios registrados
    state = fields.Selection(tracking=True)
    partner_id = fields.Many2one(tracking=True)
```

**Adaptación a nuestro proyecto:**
Usar biblioteca de audit trail o implementar:
```typescript
@Entity()
class SaleOrder {
  @Column()
  @ChangeTracking()  // Custom decorator
  name: string;

  @Column()
  @ChangeTracking()
  state: OrderState;

  @OneToMany(() => AuditLog, log => log.entity)
  auditLogs: AuditLog[];
}

// Subscriber que registra cambios
@EventSubscriber()
class AuditSubscriber {
  afterUpdate(event: UpdateEvent<any>) {
    // Comparar valores anteriores con nuevos
    // Crear registro en AuditLog
  }
}
```

---

### 4. **Contabilidad Analítica por Proyecto**

**Referencia:** `reference/odoo/addons/analytic/`, `project_account/`

**Patrón Odoo:**
```python
class Project(models.Model):
    _name = 'project.project'

    analytic_account_id = fields.Many2one('account.analytic.account')

class PurchaseOrderLine(models.Model):
    _name = 'purchase.order.line'

    # Al crear línea de compra vinculada a proyecto:
    analytic_distribution = fields.Json()  # Distribución por proyecto

# Al crear movimiento contable:
class AccountMoveLine(models.Model):
    analytic_distribution = fields.Json()  # Se copia del PO
```

**Adaptación a nuestro proyecto:**
```typescript
@Entity()
class Project {
  @Column()
  analyticAccountId: string;

  @OneToMany(() => CostLine, line => line.project)
  costs: CostLine[];
}

@Entity()
class PurchaseOrderLine {
  @ManyToOne(() => Project)
  project: Project;

  @Column('decimal')
  amount: number;

  @AfterInsert()
  async createCostLine() {
    // Crear registro de costo asociado al proyecto
    await CostLine.create({
      project: this.project,
      amount: this.amount,
      description: 'Purchase: ' + this.product.name,
      date: new Date(),
    });
  }
}

@Entity()
class CostLine {
  @ManyToOne(() => Project)
  project: Project;

  @Column('decimal')
  amount: number;

  @Column()
  description: string;

  @Column()
  date: Date;
}
```

---

## 📊 TABLA DE MAPEO: ODOO → NUESTRO PROYECTO

| **Concepto Odoo** | **Equivalente en Nuestro Proyecto** |
|-------------------|-------------------------------------|
| `project.project` | `Project` entity |
| `project.task` | `Task` entity |
| `sale.order` | `SaleOrder` o `Contract` |
| `purchase.order` | `PurchaseOrder` |
| `stock.warehouse` | `Warehouse` |
| `stock.location` | `Location` |
| `stock.move` | `InventoryMovement` |
| `stock.quant` | `StockQuantity` |
| `account.analytic.account` | `ProjectCostAccount` o `AnalyticAccount` |
| `res.partner` | `Partner` o `Customer/Supplier` |
| `hr.employee` | `Employee` |
| `hr.contract` | `EmployeeContract` |

---

## ✅ CHECKLIST AL CONSULTAR REFERENCIAS

Cuando implementes una nueva funcionalidad:

- [ ] Identificar módulo(s) relevante(s) en Odoo
- [ ] Leer `__manifest__.py` para entender dependencias
- [ ] Revisar modelos en `models/` para entender lógica de negocio
- [ ] Revisar vistas en `views/` para entender UI/UX esperada
- [ ] Identificar patrones arquitectónicos (estados, workflows, etc.)
- [ ] Identificar mejores prácticas (validaciones, constraints, etc.)
- [ ] Documentar hallazgos en ADR si es decisión arquitectónica importante
- [ ] Adaptar patrón a nuestro stack tecnológico
- [ ] No copiar código directamente - entender y adaptar

---

## 🚫 QUÉ EVITAR

### ❌ No Copiar Código Directamente

**MAL:**
```python
# Copiar código Python de Odoo sin adaptar
def _compute_amount_total(self):
    for order in self:
        order.amount_total = sum(order.order_line.mapped('price_total'))
```

**BIEN:**
```typescript
// Adaptar concepto a nuestro stack
get amountTotal(): number {
  return this.orderLines.reduce((sum, line) => sum + line.priceTotal, 0);
}
```

### ❌ No Implementar Todo el Módulo

Odoo tiene funcionalidades extensas. Implementa solo lo que necesitas.

**MAL:**
- Copiar todo el módulo `project` con sus 50+ campos

**BIEN:**
- Implementar solo: nombre, descripción, fecha inicio/fin, estado, presupuesto

### ❌ No Ignorar Diferencias de Stack

Odoo usa Python + PostgreSQL + XML views.
Nuestro proyecto usa TypeScript + PostgreSQL + React.

**MAL:**
- Intentar usar XML para vistas

**BIEN:**
- Entender concepto de vista form/tree/kanban
- Implementar equivalente en React components

---

## 📚 RECURSOS ADICIONALES

### Documentación Odoo
- [Developer Documentation](https://www.odoo.com/documentation/master/developer.html)
- [ORM Guide](https://www.odoo.com/documentation/master/developer/reference/backend/orm.html)
- [View Reference](https://www.odoo.com/documentation/master/developer/reference/user_interface/view_records.html)

### Repositorios Útiles
- [Odoo GitHub](https://github.com/odoo/odoo)
- [OCA GitHub](https://github.com/OCA)
- [OCA Server Tools](https://github.com/OCA/server-tools)
- [OCA Account Financial Tools](https://github.com/OCA/account-financial-tools)

### Documentos Relacionados
- `reference/README.md` - Instrucciones generales de carpeta reference
- `reference/ODOO-MODULES-ANALYSIS.md` - Análisis detallado de módulos
- `orchestration/prompts/PROMPT-ARCHITECTURE-ANALYST.md` - Prompt del agente Architecture-Analyst

---

## 🔄 ACTUALIZACIÓN DE ODOO

Para mantener la referencia actualizada:

```bash
cd reference/odoo
git pull origin 18.0
```

**Frecuencia recomendada:** Mensual o cuando se necesite consultar última versión.

---

## 💡 EJEMPLOS PRÁCTICOS

### Ejemplo 1: Implementar Estados de Orden de Compra

**Consulta:**
```bash
cd reference/odoo/addons/purchase/
cat models/purchase_order.py | grep -A 10 "state = fields.Selection"
```

**Resultado:**
```python
state = fields.Selection([
    ('draft', 'RFQ'),
    ('sent', 'RFQ Sent'),
    ('to approve', 'To Approve'),
    ('purchase', 'Purchase Order'),
    ('done', 'Locked'),
    ('cancel', 'Cancelled')
], string='Status', readonly=True, copy=False, default='draft')
```

**Implementación en nuestro proyecto:**
```typescript
enum PurchaseOrderState {
  DRAFT = 'draft',
  SENT = 'sent',
  TO_APPROVE = 'to_approve',
  PURCHASE = 'purchase',
  DONE = 'done',
  CANCEL = 'cancel',
}

@Entity()
class PurchaseOrder {
  @Column({
    type: 'enum',
    enum: PurchaseOrderState,
    default: PurchaseOrderState.DRAFT,
  })
  state: PurchaseOrderState;

  async send() {
    if (this.state !== PurchaseOrderState.DRAFT) {
      throw new Error('Only draft orders can be sent');
    }
    this.state = PurchaseOrderState.SENT;
    await this.save();
    // Enviar email a proveedor
  }

  async approve() {
    if (this.state !== PurchaseOrderState.TO_APPROVE) {
      throw new Error('Order must be in "to approve" state');
    }
    this.state = PurchaseOrderState.PURCHASE;
    await this.save();
    // Crear movimientos de inventario
  }
}
```

---

### Ejemplo 2: Implementar Portal de Cliente

**Consulta:**
```bash
cd reference/odoo/addons/project/
cat views/project_portal_project_task_templates.xml | head -50
```

**Observaciones:**
- Portal muestra tareas filtradas por cliente
- Permite comentarios
- Muestra archivos adjuntos
- Tiene permisos limitados (solo lectura de sus datos)

**Implementación en nuestro proyecto:**
- Crear ruta `/portal/projects` con autenticación
- Filtrar proyectos por cliente logueado
- Mostrar solo campos permitidos (ocultar costos internos)
- Permitir comentarios en tareas
- Permitir subir archivos

---

## ⚙️ INTEGRACIÓN CON AGENTES

### Architecture-Analyst

El agente Architecture-Analyst usa estas referencias para:
- Analizar implementaciones de referencia
- Comparar patrones con documentación actual
- Proponer mejoras arquitectónicas
- Generar ADRs basados en patrones observados

**Ver:** `orchestration/prompts/PROMPT-ARCHITECTURE-ANALYST.md`

### Backend-Agent

Al implementar funcionalidades, Backend-Agent consulta:
- Modelos de Odoo para estructura de datos
- Lógica de negocio en métodos de clase
- Validaciones y constraints
- Integración entre módulos

### Frontend-Agent

Consulta:
- Vistas XML para entender UI/UX esperada
- Flujos de usuario en portal views
- Componentes JS en `static/src/`

---

## 📝 CONTRIBUIR MEJORAS

Si encuentras patrones útiles en Odoo que no están documentados:

1. Analizar el patrón en profundidad
2. Documentar hallazgo en `reference/ODOO-MODULES-ANALYSIS.md`
3. Si es decisión arquitectónica importante, crear ADR en `docs/adr/`
4. Actualizar esta guía si aplica

---

## ✅ CONCLUSIÓN

Las referencias de Odoo son una herramienta valiosa para:
- ✅ Evitar errores de novato
- ✅ Aprender patrones probados en producción
- ✅ Acelerar desarrollo con ejemplos reales
- ✅ Mejorar arquitectura del proyecto

**Recuerda:** Odoo es una referencia, no un template para copiar. Entiende los conceptos y adapta a nuestro stack tecnológico.

---

**Versión:** 1.0.0
**Fecha:** 2025-11-23
**Autor:** Architecture-Analyst
**Próxima revisión:** Mensual
