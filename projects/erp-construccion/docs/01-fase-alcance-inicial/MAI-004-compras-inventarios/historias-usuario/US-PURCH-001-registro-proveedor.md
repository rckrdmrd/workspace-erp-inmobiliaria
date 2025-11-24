# US-PURCH-001: Registro de Proveedor

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 11
**Story Points:** 5
**Prioridad:** Alta

---

## Historia de Usuario

**Como** Gerente de Compras
**Quiero** registrar y mantener actualizada la información de proveedores
**Para** tener un catálogo confiable para solicitar cotizaciones y generar órdenes de compra

---

## Criterios de Aceptación

### AC1: Registro de Proveedor Nuevo
```
Formulario incluye:
  Información Fiscal:
    RFC: [CEM850101ABC]
    Razón Social: [Cemex México S.A. de C.V.]
    Nombre Comercial: [Cemex] (opcional)
    Tipo de empresa: [S.A. de C.V. ▼]

  Categorías de Producto:
    ☑ Cemento y cementantes
    ☑ Agregados (arena, grava)
    ☐ Acero y varilla
    [+ Agregar categoría personalizada]

  Contacto:
    Nombre: [Juan Pérez]
    Puesto: [Gerente de Ventas]
    Email: [juan.perez@cemex.com] *
    Teléfono: [81-8888-1234]

  Condiciones Comerciales:
    Plazo de pago: [30] días
    Descuento pronto pago: [2]%
    ☑ Requiere anticipo
    Anticipo: [30]%

  Información Bancaria:
    Banco: [BBVA México ▼]
    Cuenta: [0123456789]
    CLABE: [012180001234567890]

Validaciones:
- RFC único en el sistema
- Email válido y obligatorio
- Al menos 1 categoría seleccionada
- CLABE 18 dígitos si se proporciona

[Guardar]  [Cancelar]
```

### AC2: Búsqueda y Filtrado
```
Barra de búsqueda:
  [🔍 Buscar proveedor...                    ]
  Filtros: [Todas las categorías ▼] [Todos los status ▼]

Resultados:
┌────────────────────────────────────────────────────────┐
│ RFC          │ Nombre Comercial  │ Categorías  │ Calif││
├──────────────┼──────────────────┼─────────────┼───────┤│
│ CEM850101ABC │ Cemex            │ Cemento (2) │ A-87  ││
│ AMA901010XXX │ Materiales SA    │ Agregados   │ B-72  ││
│ BLO850515YYY │ Bloques del Nte  │ Block       │ A-85  ││
└──────────────┴──────────────────┴─────────────┴───────┘

Acciones por proveedor:
  [👁 Ver]  [✏️ Editar]  [📊 Evaluación]  [❌ Desactivar]
```

### AC3: Vista Detallada de Proveedor
```
╔══════════════════════════════════════════════════════╗
║ Cemex México S.A. de C.V.                            ║
║ RFC: CEM850101ABC | Status: Activo                   ║
╠══════════════════════════════════════════════════════╣
║ Calificación General: A-87 🟢                        ║
║                                                      ║
║ ■ Información de Contacto                           ║
║   Juan Pérez - Gerente de Ventas                    ║
║   📧 juan.perez@cemex.com                            ║
║   📞 81-8888-1234                                    ║
║                                                      ║
║ ■ Condiciones Comerciales                           ║
║   Plazo de pago: 30 días                            ║
║   Descuento pronto pago: 2% a 10 días               ║
║   Anticipo: 30%                                     ║
║                                                      ║
║ ■ Historial (últimos 12 meses)                      ║
║   Órdenes: 28                                       ║
║   Monto total: $2,450,000                           ║
║   Entregas a tiempo: 26/28 (92.9%)                  ║
║   Devoluciones: 1 (3.6%)                            ║
║                                                      ║
║ [Solicitar Cotización]  [Nueva OC]  [Editar]        ║
╚══════════════════════════════════════════════════════╝
```

---

## Notas Técnicas

### Backend
- Validación de RFC con algoritmo de dígito verificador
- Index de búsqueda full-text en nombre/razón social
- Soft delete para mantener historial

### Frontend
- Autocompletado de RFC desde API del SAT
- Sugerencias de bancos mexicanos
- Validación en tiempo real de CLABE

---

## Definición de Hecho (DoD)

- [ ] CRUD completo de proveedores
- [ ] Búsqueda y filtros funcionando
- [ ] Validaciones de RFC y CLABE
- [ ] Vista detallada con historial
- [ ] Tests unitarios >80%
- [ ] Documentación API

---

**Referencias:** RF-PURCH-001, ET-PURCH-001
