# US-EST-005: Generar Reporte PDF

**ID:** US-EST-005  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Ingeniero  
**Quiero** generar PDF oficial de la estimación  
**Para** enviar al cliente con formato profesional

---

## Criterios de Aceptación

1. Seleccionar template según cliente (INFONAVIT, Gobierno, Privado)
2. PDF incluye: resumen, detalle items, amortizaciones, retenciones, firmas
3. Genera en <5 segundos para estimación con 100 partidas
4. Preview antes de descargar
5. PDF con marca de agua si no está autorizada
6. Almacena versión firmada digitalmente

---

## Mockup

```
┌────────────────────────────────────────┐
│ EST-PRJ001-CLI-2025-001             [X]│
├────────────────────────────────────────┤
│ [Preview PDF]                          │
│ ┌──────────────────────────────────┐   │
│ │ 📄 ESTIMACIÓN DE OBRA            │   │
│ │    No. EST-PRJ001-001            │   │
│ │                                  │   │
│ │ Proyecto: Desarrollo XYZ         │   │
│ │ Monto Neto: $9,500,000          │   │
│ │ ...                              │   │
│ └──────────────────────────────────┘   │
│                                        │
│ Template: [v] INFONAVIT Oficial       │
│ Incluir: ☑️ Números generadores       │
│          ☑️ Anexos fotográficos       │
│                                        │
│ [Descargar PDF] [Enviar por Email]    │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Genera PDF con logo y formato INFONAVIT ✅  
**CP-002:** 100 partidas → PDF en 3 segundos ✅  
**CP-003:** Borrador → Marca de agua "BORRADOR" ✅

---

**Generado:** 2025-11-20
