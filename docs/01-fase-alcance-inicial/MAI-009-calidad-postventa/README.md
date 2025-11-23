# MAI-009: Calidad, Postventa y Garantías

**ID:** MAI-009  
**Fase:** 1 - Alcance Inicial  
**Presupuesto:** $25,000 MXN  
**Story Points:** 40 SP  
**Prioridad:** P2  
**Estado:** 📝 En documentación

---

## 📋 Resumen Ejecutivo

Módulo integral para control de calidad durante construcción y atención postventa, incluyendo checklists dinámicos, no conformidades, tickets de garantía, SLA y trazabilidad completa por vivienda.

### Problema que Resuelve

Las constructoras enfrentan:
- **Durante construcción:** Falta de control de calidad sistemático, viviendas entregadas con defectos
- **Postventa:** Tickets de garantía en Excel/WhatsApp, sin seguimiento, incumplimiento de SLA
- **Auditorías INFONAVIT:** Rechazos por falta de evidencias de calidad
- **Reclamaciones:** Sin historial documentado, pérdida de garantías

**Con este módulo:** Control preventivo de calidad, tickets centralizados, cumplimiento de SLA, trazabilidad completa para auditorías.

---

## 🎯 Alcance Funcional

### Control de Calidad en Construcción

- **Checklists dinámicos** por etapa (cimentación, estructura, acabados, etc.)
- Inspecciones con evidencias fotográficas georreferenciadas
- Aprobación de etapas antes de continuar
- Reportes de calidad por proyecto/vivienda

### No Conformidades (NC)

- Registro de defectos detectados en inspecciones
- Clasificación: Menor, Mayor, Crítica
- Acciones correctivas (CAPA - Corrective and Preventive Actions)
- Verificación de cierre
- Estadísticas de NC por proyecto/contratista

### Sistema de Tickets Postventa

- Creación desde app móvil por derechohabientes
- Categorías: Plomería, Electricidad, Acabados, Estructural, etc.
- Prioridad automática según tipo
- Asignación a técnicos disponibles
- Seguimiento en tiempo real

### Garantías y SLA

- **SLA por tipo de ticket:**
  - Urgente (fuga, eléctrico): 24h
  - Alta: 48h
  - Media: 7 días
  - Baja: 15 días
- Alertas automáticas por incumplimiento
- Dashboard de cumplimiento de SLA
- Reportes para INFONAVIT

### Historial de Vivienda

- Timeline completa desde construcción hasta postventa
- Inspecciones de calidad realizadas
- No conformidades detectadas y cerradas
- Tickets de garantía atendidos
- Exportable para auditorías

---

## 🏗️ Arquitectura

### Schema: `quality`

**Tablas principales:**
- `checklists` - Templates de inspección
- `checklist_items` - Items de cada checklist
- `inspections` - Inspecciones realizadas
- `inspection_results` - Resultados por item
- `non_conformities` - No conformidades detectadas
- `corrective_actions` - Acciones correctivas
- `post_sale_tickets` - Tickets de garantía
- `ticket_assignments` - Asignaciones a técnicos
- `housing_history` - Historial integrado

**ENUMs:**
- `inspection_status`: pending, in_progress, completed, approved, rejected
- `nc_severity`: minor, major, critical
- `nc_status`: open, in_progress, closed, verified
- `ticket_status`: created, assigned, in_progress, resolved, closed
- `ticket_priority`: urgent, high, medium, low

---

## 🔄 Flujos de Trabajo

### Flujo: Inspección de Calidad

```
1. Residente selecciona vivienda y checklist (ej: "Acabados")
2. Sistema carga items del checklist (50+ verificaciones)
3. Residente inspecciona cada item: ✓ OK / ✗ NC
4. Si NC: Toma foto, describe defecto, clasifica severidad
5. Sistema genera no conformidad automáticamente
6. Al completar checklist: Sistema determina si aprueba etapa
7. Si hay NC críticas: Bloquea continuación hasta corregir
8. Genera reporte PDF con evidencias
```

### Flujo: Ticket de Postventa

```
1. Derechohabiente detecta problema en su vivienda
2. Abre app, selecciona su vivienda
3. Elige categoría (ej: "Fuga en baño")
4. Toma fotos, describe problema
5. Sistema crea ticket con prioridad "Urgente" (SLA 24h)
6. Sistema asigna automáticamente a técnico disponible
7. Técnico recibe notificación, agenda visita
8. Atiende problema, toma fotos de solución
9. Derechohabiente confirma satisfacción
10. Sistema cierra ticket, actualiza historial vivienda
```

---

## 📐 Checklists de Calidad

### Checklist: Acabados Finales

```typescript
const checklistAcabados = {
  nombre: "Inspección de Acabados Finales",
  etapa: "entrega",
  categorias: [
    {
      nombre: "Pisos y Muros",
      items: [
        "Piso cerámico sin fisuras o despostilladuras",
        "Nivel de piso uniforme",
        "Zoclos bien instalados y sellados",
        "Muros sin grietas mayores a 1mm",
        "Pintura uniforme, sin escurrimientos"
      ]
    },
    {
      nombre: "Instalaciones",
      items: [
        "Llaves y válvulas funcionan correctamente",
        "Sin fugas en tuberías visibles",
        "Contactos e interruptores operativos",
        "Iluminación completa funcional"
      ]
    },
    {
      nombre: "Carpintería",
      items: [
        "Puertas abren y cierran sin trabarse",
        "Ventanas herméticas",
        "Cerraduras funcionan correctamente"
      ]
    }
  ]
};
```

---

## 🎫 Tipos de Tickets Postventa

| Categoría | Ejemplos | SLA | Prioridad |
|-----------|----------|-----|-----------|
| **Urgente** | Fuga de agua, corto circuito, puerta no cierra | 24h | Urgente |
| **Plomería** | Goteo, presión baja, drenaje lento | 48h | Alta |
| **Eléctrico** | Contacto no funciona, foco fundido | 48h | Alta |
| **Acabados** | Pintura descarapelada, zoclo despegado | 7 días | Media |
| **Carpintería** | Puerta desnivelada, ventana ruidosa | 7 días | Media |
| **Varios** | Consultas, solicitudes información | 15 días | Baja |

---

## 📊 Indicadores Clave (KPIs)

### Calidad en Construcción
- **Tasa de aprobación primera inspección:** >90%
- **Tiempo promedio cierre NC:** <7 días
- **NC por vivienda:** <5 (meta)
- **NC críticas:** 0 al momento de entrega

### Postventa
- **Cumplimiento de SLA:** >95%
- **Tiempo promedio resolución:** <48h
- **Satisfacción cliente:** >4.5/5
- **Tickets recurrentes:** <10% (indica calidad construcción)
- **Tickets abiertos:** <20 simultáneos

---

## 🔗 Integraciones

| Módulo | Relación | Datos Compartidos |
|--------|----------|-------------------|
| **MAI-005** Control de Obra | ➡️ Vincula inspecciones a avances | Viviendas, etapas de construcción |
| **MAI-010** CRM | ↔️ Tickets de derechohabientes | Contacto, vivienda asignada |
| **MAI-011** INFONAVIT | ⬅️ Provee evidencias de calidad | Reportes, fotos, certificaciones |
| **MAI-007** RRHH | ➡️ Asigna técnicos | Disponibilidad, especialidad |

---

## 📝 Documentos Relacionados

### Requerimientos Funcionales
- [RF-QUA-001: Control de calidad en construcción](./requerimientos/RF-QUA-001-control-calidad.md)
- [RF-QUA-002: No conformidades y CAPA](./requerimientos/RF-QUA-002-no-conformidades.md)
- [RF-QUA-003: Sistema de tickets postventa](./requerimientos/RF-QUA-003-tickets-postventa.md)
- [RF-QUA-004: Garantías y SLA](./requerimientos/RF-QUA-004-garantias-sla.md)
- [RF-QUA-005: Historial de vivienda](./requerimientos/RF-QUA-005-historial-vivienda.md)

### Especificaciones Técnicas
- [ET-QUA-001: Checklists dinámicos](./especificaciones/ET-QUA-001-checklists-dinamicos.md)
- [ET-QUA-002: Sistema de no conformidades](./especificaciones/ET-QUA-002-no-conformidades.md)
- [ET-QUA-003: Motor de tickets](./especificaciones/ET-QUA-003-motor-tickets.md)
- [ET-QUA-004: SLA y alertas](./especificaciones/ET-QUA-004-sla-alertas.md)
- [ET-QUA-005: Historial integrado](./especificaciones/ET-QUA-005-historial-vivienda.md)

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
