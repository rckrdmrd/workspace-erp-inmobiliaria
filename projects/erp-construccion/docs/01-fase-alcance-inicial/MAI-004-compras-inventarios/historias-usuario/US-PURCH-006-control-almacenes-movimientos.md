# US-PURCH-006: Control de Almacenes y Movimientos

**Épica:** MAI-004 - Compras e Inventarios
**Sprint:** 13
**Story Points:** 7
**Prioridad:** Alta

---

## Historia de Usuario

**Como** Almacenista/Residente
**Quiero** registrar salidas de material y traspasos entre almacenes
**Para** mantener el inventario actualizado y tener trazabilidad de los consumos

---

## Criterios de Aceptación

### AC1: Salida de Material para Obra
```
┌──────────────────────────────────────────────────────┐
│ SALIDA DE MATERIAL                                   │
├──────────────────────────────────────────────────────┤
│ Almacén origen: Fracc. Los Pinos                    │
│ Fecha: 10/Dic/2025                                  │
│ Tipo: (●) Consumo en obra  ( ) Devolución          │
│                                                      │
│ Proyecto: Fracc. Los Pinos                          │
│ Destino: Cimentación Etapa 2                        │
│ Vale #: [VALE-2025-789]                             │
│                                                      │
│ Materiales:                    [+ Agregar material] │
│ ┌────────────┬────────┬──────┬─────────┬──────────┐ │
│ │ Material   │ Disp.  │Cant. │ Partida │ Costo    │ │
│ ├────────────┼────────┼──────┼─────────┼──────────┤ │
│ │Cemento CPC │120 ton │[15]t │02-Ciment│ $64,005  │ │
│ │            │→105 ton│      │         │          │ │
│ │            │                                     │ │
│ │Grava 3/4"  │105 m³  │[20]m³│02-Ciment│ $7,680   │ │
│ │            │→ 85 m³ │      │         │          │ │
│ │            │                                     │ │
│ │Arena       │112 m³  │[25]m³│02-Ciment│ $7,325   │ │
│ │            │→ 87 m³ │      │         │          │ │
│ └────────────┴────────┴──────┴─────────┴──────────┘ │
│                                                      │
│ Total salida: $79,010                               │
│ Costo calculado por PEPS automáticamente            │
│                                                      │
│ Autorizado por: [Ing. Pedro Ramírez ▼] (Residente) │
│                                                      │
│ Notas:                                               │
│ [Cimentación viviendas 15-20 según programa        ]│
│                                                      │
│           [Generar Vale]  [Registrar Salida]        │
└──────────────────────────────────────────────────────┘

Al registrar:
1. Se crea SAL-2025-00456
2. Stock se reduce automáticamente
3. Costo se afecta al presupuesto partida 02-Cimentación
4. Se consumen lotes PEPS (primeros en entrar)
5. Se genera vale imprimible
```

### AC2: Vale de Salida Imprimible
```
╔══════════════════════════════════════════════════════╗
║              VALE DE SALIDA DE MATERIAL              ║
║              SAL-2025-00456                          ║
╠══════════════════════════════════════════════════════╣
║ Almacén: Fracc. Los Pinos                            ║
║ Fecha: 10 de Diciembre de 2025                       ║
║ Hora: 14:30                                          ║
║                                                      ║
║ DESTINO:                                             ║
║ Proyecto: Fraccionamiento Los Pinos                  ║
║ Partida: 02-Cimentación                              ║
║ Detalle: Cimentación viviendas 15-20                 ║
╠══════════════════════════════════════════════════════╣
║ Material           │ Cantidad │ Unidad │ Costo Unit.║
╠════════════════════╪══════════╪════════╪════════════╣
║ Cemento CPC 30R    │   15     │  ton   │  $4,267    ║
║ Grava 3/4"         │   20     │  m³    │  $384      ║
║ Arena              │   25     │  m³    │  $293      ║
╠════════════════════╧══════════╧════════╧════════════╣
║ TOTAL:                                    $79,010    ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║ Autorizó:                  Recibió:                 ║
║ _____________________      _____________________    ║
║ Ing. Pedro Ramírez         Maestro de Obra          ║
║ Residente                                            ║
╚══════════════════════════════════════════════════════╝
```

### AC3: Traspaso entre Almacenes
```
┌──────────────────────────────────────────────────────┐
│ TRASPASO DE MATERIAL                                 │
├──────────────────────────────────────────────────────┤
│ Almacén origen: [Almacén General ▼]                 │
│ Almacén destino: [Fracc. Los Pinos ▼]               │
│ Fecha: 12/Dic/2025                                  │
│                                                      │
│ Motivo del traspaso: *                               │
│ (●) Faltante en obra                                │
│ ( ) Redistribución de stock                         │
│ ( ) Cierre de almacén temporal                      │
│                                                      │
│ Materiales a traspasar:        [+ Agregar material] │
│ ┌────────────────┬──────────┬────────┬────────────┐ │
│ │ Material       │ Disp.Org │ Cant.  │ Costo      │ │
│ ├────────────────┼──────────┼────────┼────────────┤ │
│ │ Varilla 3/8"   │ 2,500 kg │[500]kg │ $10,250    │ │
│ │   fy=4200      │→2,000 kg │        │            │ │
│ └────────────────┴──────────┴────────┴────────────┘ │
│                                                      │
│ Responsable envío: José García (Alm. General)       │
│ Responsable recibo: María López (Alm. Obra)         │
│                                                      │
│ Transporte:                                          │
│ Compañía: [Transportes ABC]                         │
│ Chofer: [Juan Hernández]                            │
│ Placas: [ABC-123-XX]                                │
│                                                      │
│             [Generar Traspaso]                       │
└──────────────────────────────────────────────────────┘

Flujo del traspaso:
1. Se crea TRA-2025-00078
2. Sale de Almacén General (stock -500kg)
3. Status: "En tránsito"
4. Notificación a almacenista destino
5. Almacenista destino confirma recepción
6. Entra a Fracc. Los Pinos (stock +500kg)
7. Status: "Completado"
```

### AC4: Confirmar Recepción de Traspaso
```
Notificación para María López (Alm. Fracc. Los Pinos):

🔔 Traspaso en tránsito
   TRA-2025-00078 desde Almacén General
   Material: Varilla 3/8" fy=4200 (500 kg)
   [Confirmar Recepción]

Al hacer clic:
┌──────────────────────────────────────────────────────┐
│ CONFIRMAR RECEPCIÓN DE TRASPASO                      │
│ TRA-2025-00078                                       │
├──────────────────────────────────────────────────────┤
│ Origen: Almacén General                              │
│ Enviado: 12/Dic/2025 10:00                          │
│ Responsable envío: José García                      │
│                                                      │
│ Material enviado:                                    │
│ ┌────────────────┬──────────┬──────────┬──────────┐ │
│ │ Material       │ Enviado  │ Recibido │ Diferenc.│ │
│ ├────────────────┼──────────┼──────────┼──────────┤ │
│ │ Varilla 3/8"   │ 500 kg   │ [500] kg │ 0 kg ✓  │ │
│ └────────────────┴──────────┴──────────┴──────────┘ │
│                                                      │
│ Observaciones:                                       │
│ [Material recibido en buenas condiciones           ]│
│                                                      │
│ Recibí conforme                                      │
│                 [Confirmar Recepción]                │
└──────────────────────────────────────────────────────┘

Si hay diferencias:
- Marcar cantidad real recibida
- Motivo de diferencia obligatorio
- Se genera alerta para investigación
```

### AC5: Historial de Movimientos por Almacén
```
ALMACÉN: Fracc. Los Pinos
Período: Diciembre 2025

Filtros: [Todos los tipos ▼] [📅 01-31/Dic]

┌──────────────────────────────────────────────────────┐
│ Fecha │ Código     │ Tipo      │ Detalle      │Valor ││
├───────┼────────────┼───────────┼──────────────┼──────┤│
│12/Dic │TRA-078(IN) │Traspaso   │Alm.General   │$10.2K││
│       │            │Entrada    │Varilla 3/8"  │      ││
│       │                                               │
│10/Dic │SAL-456     │Salida     │02-Cimentación│$79.0K││
│       │            │Consumo    │3 materiales  │      ││
│       │                                               │
│07/Dic │ENT-234     │Entrada    │OC-2025-00145 │$583K ││
│       │            │Compra     │Cemento,Grava │      ││
│       │                                               │
│05/Dic │SAL-450     │Salida     │03-Estructura │$45.5K││
│       │            │Consumo    │Acero fy=4200 │      ││
└──────────────────────────────────────────────────────┘

Resumen del período:
  Entradas:  $593,200
  Salidas:   $124,500
  Saldo:     +$468,700

[Exportar a Excel]  [Generar Reporte]
```

---

## Notas Técnicas

### Backend
- Validar stock disponible antes de salida
- PEPS automático en salidas (trigger SQL)
- Traspasos con estados (pending/in_transit/received)
- Afectación a presupuesto en tiempo real
- Event: `inventory.material_consumed`

### Frontend
- Autocompletado de materiales disponibles
- Cálculo en tiempo real de stock resultante
- Firma digital en vales (canvas)
- Escaneo de códigos QR para traspasos

---

## Definición de Hecho (DoD)

- [ ] Registro de salidas con vales
- [ ] Salidas vinculadas a partidas presupuestales
- [ ] Traspasos entre almacenes con confirmación
- [ ] Cálculo automático PEPS
- [ ] Historial de movimientos con filtros
- [ ] Vales imprimibles
- [ ] Alertas por diferencias en traspasos
- [ ] Tests de PEPS y actualización de stock

---

**Referencias:** RF-PURCH-003, ET-PURCH-003
