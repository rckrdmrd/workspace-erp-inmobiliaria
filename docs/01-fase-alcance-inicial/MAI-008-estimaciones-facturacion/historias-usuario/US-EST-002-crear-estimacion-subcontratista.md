# US-EST-002: Crear Estimación a Subcontratista

**ID:** US-EST-002  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Residente de Obra  
**Quiero** crear una estimación de pago a subcontratista basada en su avance  
**Para** autorizar pagos por trabajo ejecutado y verificado

---

## Criterios de Aceptación

1. Seleccionar subcontrato activo → Muestra datos y avance acumulado
2. Ingresar % de avance actual o seleccionar partidas terminadas
3. Sistema verifica avance físico (fotos, reportes)
4. Calcula: monto × avance - amortización - retención 10%
5. Programa fecha de pago según términos del subcontrato
6. Residente autoriza avance → Envía a finanzas para pago

---

## Mockup

```
┌────────────────────────────────────────┐
│ Estimación a Subcontratista         [X]│
├────────────────────────────────────────┤
│ Subcontrato: Instalaciones Eléctricas │
│ Monto total: $3,000,000               │
│ Avance anterior: 0%                    │
│                                        │
│ Avance Actual: [25] %                 │
│                                        │
│ Evidencias (obligatorio):              │
│ 📷 [Subir fotos] [3 archivos]         │
│ 📄 [Subir reportes]                    │
│                                        │
│ CÁLCULO:                               │
│ Monto bruto:       $750,000.00        │
│ Amortización:     -$112,500.00        │
│ Retención 10%:    -$ 63,750.00        │
│ ─────────────────────────────────────  │
│ MONTO NETO:        $573,750.00        │
│ Pago programado: 30 días              │
│                                        │
│   [Cancelar] [Guardar] [Autorizar]    │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Avance 25% → Calcula $573,750 neto → Autoriza ✅  
**CP-002:** Sin evidencias → Bloquea autorización ❌  
**CP-003:** Avance > 100% acumulado → Error ❌

---

**Generado:** 2025-11-20
