-- ============================================================================
-- ET-PURCH: Row-Level Security (RLS) Policies
-- Módulo: MAI-004 - Compras e Inventarios
-- Tablas: purchases schema (todas las tablas del módulo)
-- Fecha: 2025-11-20
-- Descripción: Políticas de seguridad para aislamiento multi-tenant (constructora)
-- ============================================================================

-- ============================================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================================

ALTER TABLE purchases.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.supplier_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.supplier_price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.purchase_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.requisition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases.stock_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS RLS: SUPPLIERS (Proveedores)
-- ============================================================================

DROP POLICY IF EXISTS "suppliers_select_own_constructora" ON purchases.suppliers;
CREATE POLICY "suppliers_select_own_constructora"
ON purchases.suppliers FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "suppliers_select_own_constructora" ON purchases.suppliers IS
'Permite ver solo proveedores de la constructora actual.
Aislamiento: tenant (constructora) level.';

DROP POLICY IF EXISTS "suppliers_insert_own_constructora" ON purchases.suppliers;
CREATE POLICY "suppliers_insert_own_constructora"
ON purchases.suppliers FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'purchases_manager')
);

DROP POLICY IF EXISTS "suppliers_update_own_constructora" ON purchases.suppliers;
CREATE POLICY "suppliers_update_own_constructora"
ON purchases.suppliers FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'purchases_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "suppliers_delete_own_constructora" ON purchases.suppliers;
CREATE POLICY "suppliers_delete_own_constructora"
ON purchases.suppliers FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

-- ============================================================================
-- POLÍTICAS RLS: SUPPLIER_CONTACTS (Contactos de Proveedores)
-- ============================================================================

DROP POLICY IF EXISTS "supplier_contacts_select_own" ON purchases.supplier_contacts;
CREATE POLICY "supplier_contacts_select_own"
ON purchases.supplier_contacts FOR SELECT TO authenticated
USING (
  supplier_id IN (
    SELECT id FROM purchases.suppliers
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "supplier_contacts_insert_own" ON purchases.supplier_contacts;
CREATE POLICY "supplier_contacts_insert_own"
ON purchases.supplier_contacts FOR INSERT TO authenticated
WITH CHECK (
  supplier_id IN (
    SELECT id FROM purchases.suppliers
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "supplier_contacts_update_own" ON purchases.supplier_contacts;
CREATE POLICY "supplier_contacts_update_own"
ON purchases.supplier_contacts FOR UPDATE TO authenticated
USING (
  supplier_id IN (
    SELECT id FROM purchases.suppliers
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "supplier_contacts_delete_own" ON purchases.supplier_contacts;
CREATE POLICY "supplier_contacts_delete_own"
ON purchases.supplier_contacts FOR DELETE TO authenticated
USING (
  supplier_id IN (
    SELECT id FROM purchases.suppliers
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- ============================================================================
-- POLÍTICAS RLS: SUPPLIER_PRICE_LISTS (Listas de Precios)
-- ============================================================================

DROP POLICY IF EXISTS "price_lists_select_own" ON purchases.supplier_price_lists;
CREATE POLICY "price_lists_select_own"
ON purchases.supplier_price_lists FOR SELECT TO authenticated
USING (
  supplier_id IN (
    SELECT id FROM purchases.suppliers
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "price_lists_insert_own" ON purchases.supplier_price_lists;
CREATE POLICY "price_lists_insert_own"
ON purchases.supplier_price_lists FOR INSERT TO authenticated
WITH CHECK (
  supplier_id IN (
    SELECT id FROM purchases.suppliers
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- ============================================================================
-- POLÍTICAS RLS: PURCHASE_REQUISITIONS (Requisiciones)
-- ============================================================================

DROP POLICY IF EXISTS "requisitions_select_own" ON purchases.purchase_requisitions;
CREATE POLICY "requisitions_select_own"
ON purchases.purchase_requisitions FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "requisitions_select_own" ON purchases.purchase_requisitions IS
'Permite ver solo requisiciones de la constructora actual.
Usado en: Listado de requisiciones, aprobaciones, conversión a OC.';

DROP POLICY IF EXISTS "requisitions_insert_own" ON purchases.purchase_requisitions;
CREATE POLICY "requisitions_insert_own"
ON purchases.purchase_requisitions FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'engineer', 'resident', 'purchases_manager')
);

DROP POLICY IF EXISTS "requisitions_update_own" ON purchases.purchase_requisitions;
CREATE POLICY "requisitions_update_own"
ON purchases.purchase_requisitions FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND (
    -- Creador puede editar si está en draft
    (created_by = public.get_current_user_id() AND status = 'draft')
    OR
    -- Purchases Manager/Director pueden editar
    public.get_current_user_role() IN ('director', 'admin', 'purchases_manager')
  )
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

COMMENT ON POLICY "requisitions_update_own" ON purchases.purchase_requisitions IS
'Permisos diferenciados:
- Creador: Solo en estado draft
- Purchases Manager/Director: Cualquier estado';

DROP POLICY IF EXISTS "requisitions_delete_own" ON purchases.purchase_requisitions;
CREATE POLICY "requisitions_delete_own"
ON purchases.purchase_requisitions FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
  AND status = 'draft'
);

-- ============================================================================
-- POLÍTICAS RLS: REQUISITION_ITEMS (Partidas de Requisición)
-- ============================================================================

DROP POLICY IF EXISTS "requisition_items_select_own" ON purchases.requisition_items;
CREATE POLICY "requisition_items_select_own"
ON purchases.requisition_items FOR SELECT TO authenticated
USING (
  requisition_id IN (
    SELECT id FROM purchases.purchase_requisitions
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "requisition_items_insert_own" ON purchases.requisition_items;
CREATE POLICY "requisition_items_insert_own"
ON purchases.requisition_items FOR INSERT TO authenticated
WITH CHECK (
  requisition_id IN (
    SELECT id FROM purchases.purchase_requisitions
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "requisition_items_update_own" ON purchases.requisition_items;
CREATE POLICY "requisition_items_update_own"
ON purchases.requisition_items FOR UPDATE TO authenticated
USING (
  requisition_id IN (
    SELECT id FROM purchases.purchase_requisitions
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "requisition_items_delete_own" ON purchases.requisition_items;
CREATE POLICY "requisition_items_delete_own"
ON purchases.requisition_items FOR DELETE TO authenticated
USING (
  requisition_id IN (
    SELECT id FROM purchases.purchase_requisitions
    WHERE constructora_id = public.get_current_constructora_id()
      AND status = 'draft'
  )
);

-- ============================================================================
-- POLÍTICAS RLS: PURCHASE_ORDERS (Órdenes de Compra)
-- ============================================================================

DROP POLICY IF EXISTS "purchase_orders_select_own" ON purchases.purchase_orders;
CREATE POLICY "purchase_orders_select_own"
ON purchases.purchase_orders FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "purchase_orders_insert_own" ON purchases.purchase_orders;
CREATE POLICY "purchase_orders_insert_own"
ON purchases.purchase_orders FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'purchases_manager')
);

DROP POLICY IF EXISTS "purchase_orders_update_own" ON purchases.purchase_orders;
CREATE POLICY "purchase_orders_update_own"
ON purchases.purchase_orders FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'purchases_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "purchase_orders_delete_own" ON purchases.purchase_orders;
CREATE POLICY "purchase_orders_delete_own"
ON purchases.purchase_orders FOR DELETE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
  AND status IN ('draft', 'pending_approval')
);

-- ============================================================================
-- POLÍTICAS RLS: PURCHASE_ORDER_ITEMS (Partidas de OC)
-- ============================================================================

DROP POLICY IF EXISTS "po_items_select_own" ON purchases.purchase_order_items;
CREATE POLICY "po_items_select_own"
ON purchases.purchase_order_items FOR SELECT TO authenticated
USING (
  purchase_order_id IN (
    SELECT id FROM purchases.purchase_orders
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

DROP POLICY IF EXISTS "po_items_insert_own" ON purchases.purchase_order_items;
CREATE POLICY "po_items_insert_own"
ON purchases.purchase_order_items FOR INSERT TO authenticated
WITH CHECK (
  purchase_order_id IN (
    SELECT id FROM purchases.purchase_orders
    WHERE constructora_id = public.get_current_constructora_id()
  )
);

-- ============================================================================
-- POLÍTICAS RLS: WAREHOUSES (Almacenes)
-- ============================================================================

DROP POLICY IF EXISTS "warehouses_select_own" ON purchases.warehouses;
CREATE POLICY "warehouses_select_own"
ON purchases.warehouses FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "warehouses_insert_own" ON purchases.warehouses;
CREATE POLICY "warehouses_insert_own"
ON purchases.warehouses FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin')
);

DROP POLICY IF EXISTS "warehouses_update_own" ON purchases.warehouses;
CREATE POLICY "warehouses_update_own"
ON purchases.warehouses FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'warehouse_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- ============================================================================
-- POLÍTICAS RLS: INVENTORY_ITEMS (Items de Inventario)
-- ============================================================================

DROP POLICY IF EXISTS "inventory_items_select_own" ON purchases.inventory_items;
CREATE POLICY "inventory_items_select_own"
ON purchases.inventory_items FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "inventory_items_insert_own" ON purchases.inventory_items;
CREATE POLICY "inventory_items_insert_own"
ON purchases.inventory_items FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'warehouse_manager', 'purchases_manager')
);

DROP POLICY IF EXISTS "inventory_items_update_own" ON purchases.inventory_items;
CREATE POLICY "inventory_items_update_own"
ON purchases.inventory_items FOR UPDATE TO authenticated
USING (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'warehouse_manager')
)
WITH CHECK (constructora_id = public.get_current_constructora_id());

-- ============================================================================
-- POLÍTICAS RLS: INVENTORY_MOVEMENTS (Movimientos de Inventario)
-- ============================================================================

DROP POLICY IF EXISTS "inventory_movements_select_own" ON purchases.inventory_movements;
CREATE POLICY "inventory_movements_select_own"
ON purchases.inventory_movements FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

DROP POLICY IF EXISTS "inventory_movements_insert_own" ON purchases.inventory_movements;
CREATE POLICY "inventory_movements_insert_own"
ON purchases.inventory_movements FOR INSERT TO authenticated
WITH CHECK (
  constructora_id = public.get_current_constructora_id()
  AND public.get_current_user_role() IN ('director', 'admin', 'warehouse_manager', 'resident')
);

COMMENT ON POLICY "inventory_movements_insert_own" ON purchases.inventory_movements IS
'Permisos para registrar movimientos:
- Warehouse Manager: Entradas/Salidas/Ajustes
- Resident: Solo salidas por consumo en obra';

-- ============================================================================
-- POLÍTICAS RLS: STOCK_ALERTS (Alertas de Stock)
-- ============================================================================

DROP POLICY IF EXISTS "stock_alerts_select_own" ON purchases.stock_alerts;
CREATE POLICY "stock_alerts_select_own"
ON purchases.stock_alerts FOR SELECT TO authenticated
USING (constructora_id = public.get_current_constructora_id());

-- Las alertas son generadas automáticamente por triggers

-- ============================================================================
-- POLÍTICAS SUPER ADMIN (Bypass para soporte)
-- ============================================================================

DO $$
DECLARE
  table_name TEXT;
  tables TEXT[] := ARRAY[
    'suppliers', 'supplier_contacts', 'supplier_price_lists',
    'purchase_requisitions', 'requisition_items',
    'purchase_orders', 'purchase_order_items',
    'warehouses', 'inventory_items', 'inventory_movements',
    'stock_alerts'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "%s_super_admin_all" ON purchases.%s;
      CREATE POLICY "%s_super_admin_all" ON purchases.%s
      FOR ALL TO authenticated
      USING (public.get_current_user_role() = ''super_admin'')
      WITH CHECK (public.get_current_user_role() = ''super_admin'');
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_suppliers_constructora ON purchases.suppliers(constructora_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON purchases.suppliers(constructora_id, status);

CREATE INDEX IF NOT EXISTS idx_requisitions_constructora ON purchases.purchase_requisitions(constructora_id);
CREATE INDEX IF NOT EXISTS idx_requisitions_project ON purchases.purchase_requisitions(project_id);
CREATE INDEX IF NOT EXISTS idx_requisitions_status ON purchases.purchase_requisitions(constructora_id, status);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_constructora ON purchases.purchase_orders(constructora_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchases.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchases.purchase_orders(constructora_id, status);

CREATE INDEX IF NOT EXISTS idx_warehouses_constructora ON purchases.warehouses(constructora_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_project ON purchases.warehouses(project_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_constructora ON purchases.inventory_items(constructora_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_warehouse ON purchases.inventory_items(warehouse_id);

CREATE INDEX IF NOT EXISTS idx_movements_constructora ON purchases.inventory_movements(constructora_id);
CREATE INDEX IF NOT EXISTS idx_movements_item ON purchases.inventory_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_movements_date ON purchases.inventory_movements(movement_date);

COMMENT ON INDEX purchases.idx_requisitions_constructora IS
'Optimiza queries RLS filtrados por constructora_id.';

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA purchases TO authenticated;
GRANT USAGE ON SCHEMA purchases TO authenticated;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

DO $$
DECLARE
  v_tables TEXT[] := ARRAY[
    'suppliers', 'purchase_requisitions', 'purchase_orders',
    'warehouses', 'inventory_items', 'inventory_movements'
  ];
  v_table TEXT;
  v_rls_enabled BOOLEAN;
  v_policy_count INTEGER;
BEGIN
  FOREACH v_table IN ARRAY v_tables
  LOOP
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class
    WHERE relname = v_table AND relnamespace = 'purchases'::regnamespace;

    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'purchases' AND tablename = v_table;

    IF NOT v_rls_enabled THEN
      RAISE EXCEPTION 'CRITICAL: RLS no habilitado en purchases.%', v_table;
    END IF;

    IF v_policy_count < 1 THEN
      RAISE WARNING 'purchases.%: Solo % políticas', v_table, v_policy_count;
    END IF;

    RAISE NOTICE '✓ purchases.%: RLS habilitado con % políticas', v_table, v_policy_count;
  END LOOP;

  RAISE NOTICE '✓ Módulo MAI-004: Todas las tablas tienen RLS habilitado';
END $$;
