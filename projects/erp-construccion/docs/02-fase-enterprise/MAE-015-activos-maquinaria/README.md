# MAE-015: Activos y Maquinaria

**Módulo:** Gestión de Activos Fijos y Maquinaria de Construcción  
**Story Points:** 40 | **Prioridad:** Media | **Fase:** 2 (Enterprise)

## Descripción General

Sistema para gestión y control de activos fijos, maquinaria, vehículos y herramientas utilizados en proyectos de construcción. Incluye inventario, mantenimiento, depreciación, y asignación a proyectos.

## Alcance Funcional

### 1. Catálogo de Activos
- Registro de maquinaria y equipo
- Características técnicas
- Documentos (factura, póliza, manuales)
- Valor de adquisición y depreciación
- Ubicación actual

### 2. Asignación a Proyectos
- Transfer de activos entre proyectos
- Tracking de ubicación
- Costeo por uso (horas/días)
- Historial de asignaciones

### 3. Mantenimiento Preventivo
- Calendario de mantenimientos
- Checklist por tipo de activo
- Registro de mantenimientos realizados
- Alertas de próximos mantenimientos
- Bitácora de fallas

### 4. Control de Herramientas
- Vale de salida/entrada
- Responsable por herramienta
- Inventario en resguardo
- Reportes de pérdidas/robos

### 5. Depreciación Contable
- Cálculo automático (línea recta, acelerada)
- Depreciación mensual
- Valor en libros
- Reportes para contabilidad

## Componentes Técnicos

### Backend (NestJS + TypeORM)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    Asset, AssetAssignment, MaintenanceSchedule,
    MaintenanceRecord, ToolCheckout, Depreciation
  ])],
  providers: [
    AssetService, MaintenanceService,
    ToolService, DepreciationService
  ],
  controllers: [AssetController, MaintenanceController]
})
export class AssetModule {}
```

### Base de Datos (PostgreSQL)
```sql
CREATE SCHEMA assets;

CREATE TYPE assets.asset_type AS ENUM ('machinery', 'vehicle', 'tool', 'equipment');
CREATE TYPE assets.asset_status AS ENUM ('available', 'in_use', 'maintenance', 'retired');
CREATE TYPE assets.maintenance_type AS ENUM ('preventive', 'corrective', 'inspection');
```

## Integraciones

- **MAI-002 (Proyectos):** Asignación de activos a proyectos
- **MAI-003 (Presupuestos):** Costeo de uso de maquinaria
- **MAE-014 (Finanzas):** Depreciación para contabilidad

## Métricas Clave

- **Utilización:** % de tiempo en uso vs disponible
- **Costo por hora:** Depreciación + mantenimiento / horas uso
- **Tiempo fuera de servicio:** Días en mantenimiento
- **ROI:** Retorno sobre inversión por activo

---
**Generado:** 2025-11-21
