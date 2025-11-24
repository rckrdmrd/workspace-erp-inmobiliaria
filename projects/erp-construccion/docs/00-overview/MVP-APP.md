# MVP Sistema de Administración de Obra e INFONAVIT — Definición de Módulos, Planes y Arquitectura (Backend: Node.js + Express, Frontend: React + Vite Web + React Native App)

> Versión: 2.0 SaaS Multi-tenant · Fecha: 2025-11-17 · Autor: Adrián / Strategos AI
> Stack: Node.js + Express + TypeScript · React + Vite · PostgreSQL
> Modelo: SaaS Multi-tenant B2B · Compatible con ecosistema GAMILIT

## 0) Resumen ejecutivo

**Plataforma SaaS ERP de construcción enterprise-ready** para constructoras de vivienda en serie que desarrollan conjuntos habitacionales (fraccionamientos, privadas, edificios) y participan en licitaciones y programas con INFONAVIT.

### Modelo de Negocio: SaaS Multi-tenant B2B

El sistema opera como **plataforma SaaS** donde:

✅ **Múltiples empresas constructoras** comparten la misma infraestructura (multi-tenant)
✅ **Módulos activables** según plan de suscripción (Básico/Profesional/Enterprise)
✅ **Portal de administración** para gestionar configuraciones, usuarios y módulos
✅ **Onboarding automatizado** en 5 minutos vs semanas de implementación tradicional
✅ **Marketplace de extensiones** para customizaciones sin modificar el core
✅ **Pricing por uso** con facturación automática mensual/anual

**Diferenciador clave:** Similar a SAP Cloud o Salesforce, pero especializado en construcción.

El sistema integra **18 módulos funcionales** activables por cliente, que cubren el ciclo completo desde preconstrucción hasta postventa, con capacidades comparables a ERPs líderes (SAP S/4HANA Construction, Procore, Autodesk Construction Cloud) pero con arquitectura moderna SaaS, onboarding rápido y menor TCO.

### Alcance funcional

**Módulos core (MVP Fase 1 - 6 semanas):**
* Preconstrucción y licitaciones (pipeline de oportunidades).
* Proyectos, obras y estructura de fraccionamientos.
* Presupuestos, costos y control de desviaciones.
* Compras, inventarios y almacenes de obra.
* Contratos, subcontratos y estimaciones.
* Control de avances con evidencia fotográfica y curva S.
* CRM de derechohabientes e INFONAVIT básico.
* Reportes ejecutivos y BI.

**Módulos enterprise (Fases 2-3 - 12 semanas adicionales):**
* **Finanzas y Controlling**: Libro mayor, cuentas por pagar/cobrar, flujo de efectivo, integración contable.
* **Activos y Maquinaria**: Gestión de maquinaria pesada, mantenimiento preventivo/correctivo, costeo TCO.
* **Gestión Documental (DMS)**: Repositorio centralizado, versionado de planos, flujos de aprobación.
* **RRHH Avanzado**: Time & Attendance con GPS + biométrico, control anti-fraude, multi-sitio.
* **Seguridad y HSE**: Matriz de riesgos, incidentes, cumplimiento normativo, **IA predictiva de riesgos**.
* **Postventa y garantías**: Gestión completa de post-entrega.

### Stack tecnológico (compatible con ecosistema GAMILIT)

* **Backend**: Node.js 20+ + Express + TypeScript.
* **Frontend oficina**: React 18 + Vite + TypeScript.
* **Frontend campo**: App móvil/tablet (React Native + TypeScript) para supervisores y residentes de obra.
* **Base de datos**: PostgreSQL 15+ con schemas modulares (arquitectura inspirada en GAMILIT).
* **IA y automatización**:
  * Alertas de desviaciones costo/tiempo.
  * Modelos predictivos de riesgo de retraso/sobrecosto.
  * **IA para detección de patrones de riesgo de seguridad** (diferenciador clave).
  * WhatsApp Business + agente IA (MCP) para captura de avances, incidencias y consultas.

### Ventajas competitivas

1. **Reutilización de ecosistema GAMILIT**: Reducción ~40% en tiempo de desarrollo, código probado en producción.
2. **Arquitectura moderna**: Node.js + React vs. tecnologías legacy de ERPs tradicionales.
3. **IA nativa**: No es add-on, está integrada en el core (HSE predictivo, alertas inteligentes).
4. **Time & Attendance de clase mundial**: GPS + biométrico integrado nativamente (competidores cobran esto separado).
5. **Mobile-first para campo**: App React Native completa, no solo "vista móvil" del web.
6. **TCO menor**: Stack open-source, sin licencias per-seat costosas, deployment flexible (cloud/on-prem).

### Comparación con ERPs de mercado

| Característica | MVP-APP | SAP S/4HANA | Procore | Autodesk |
|----------------|---------|-------------|---------|----------|
| **Modelo** | **SaaS Multi-tenant** | On-Premise / Cloud | SaaS | SaaS |
| **Onboarding** | **5 minutos** | 6-12 meses | 2-4 semanas | 2-4 semanas |
| **Módulos activables** | ✅ **Dinámico** | ❌ Todo o nada | ⚠️ Limitado | ⚠️ Limitado |
| **Marketplace** | ✅ **Sí** | ⚠️ Limitado | ❌ No | ⚠️ Limitado |
| **Pricing** | **$399-$1,499/mes** | $50K-$200K inicial + $5K/mes | $500-$2K/mes | $600-$1.5K/mes |
| **Personalización** | ✅ Extensiones SDK | ⚠️ Consultores | ❌ Limitado | ❌ Limitado |
| Finanzas integradas | ✅ Fase 2 | ✅ Core | ❌ Limitado | ❌ No |
| Gestión de activos | ✅ Fase 2 | ✅ Core | ⚠️ Básico | ⚠️ Básico |
| DMS con versionado | ✅ Fase 2 | ✅ Core | ✅ Core | ✅ Core |
| HSE + IA predictiva | ✅ **Diferenciador** | ❌ No IA | ⚠️ Sin IA | ❌ No |
| Time & Attendance GPS+Bio | ✅ Integrado | ⚠️ Módulo aparte | ⚠️ Integración 3rd | ❌ No |
| WhatsApp + IA agent | ✅ **Único** | ❌ No | ❌ No | ❌ No |
| Stack tecnológico | Moderno (Node+React) | Legacy | Mixto | Mixto |

### Roadmap y tiempos

**Fase 1: MVP SaaS (Semanas 1-8)**
- Arquitectura multi-tenant implementada
- Portal de administración básico
- Onboarding automatizado
- 6 módulos core activables
- Pricing y billing automatizado
- **Entregable**: Primeros 10 clientes piloto

**Fase 2: Enterprise Features (Semanas 9-16)**
- 12 módulos adicionales (total 18)
- Módulos activables dinámicamente
- Marketplace MVP (5 extensiones)
- SDK para extensiones
- Custom domains
- **Entregable**: 50 clientes activos, $40K MRR

**Fase 3: Scale & Growth (Semanas 17-24)**
- IA predictiva (HSE)
- Analytics avanzado por tenant
- Integraciones nativas (SAP, WhatsApp, CONTPAQi)
- Mobile app completa (React Native)
- API pública para partners
- **Entregable**: 200 clientes, $150K MRR

**Fase 4: Expansión (Semanas 25-36)**
- Marketplace público (50+ extensiones)
- White-label para partners
- Internacionalización (US, Colombia, Chile)
- Cumplimiento (SOC2, ISO 27001)
- Capacidades multi-region
- **Entregable**: 500 clientes, $400K MRR

**vs. Desarrollo desde cero**: 30-35 semanas (ahorro ~40% gracias a reutilización GAMILIT).
**vs. Desarrollo a medida tradicional**: Imposible escalar, cada cliente requiere deployment separado.

### Ventajas competitivas del modelo SaaS

1. **Time-to-value**: Cliente productivo en 5 minutos vs semanas de implementación.
2. **Pricing flexible**: Paga solo por lo que usa, puede upgradear/downgrear mensualmente.
3. **Actualizaciones automáticas**: Nuevas features sin costo adicional ni downtime.
4. **Escalabilidad instantánea**: Agregar usuarios/módulos en segundos.
5. **TCO menor**: No hay costos de infraestructura, mantenimiento, actualizaciones.
6. **Innovación continua**: Releases semanales con nuevas features y mejoras.
7. **Ecosystem**: Marketplace con extensiones de partners y comunidad.
8. **Multi-device**: Acceso desde web, móvil, tablet sin instalaciones.
9. **Seguridad enterprise**: Backups automáticos, disaster recovery, uptime 99.9%.
10. **Soporte incluido**: Según plan, desde email 48h hasta dedicado 1h.

### Comparación: SaaS vs On-Premise vs Desarrollo a Medida

| Aspecto | SaaS (Este Sistema) | On-Premise | Desarrollo a Medida |
|---------|---------------------|------------|---------------------|
| **Time-to-market** | 5 minutos | 3-6 meses | 12-18 meses |
| **Costo inicial** | $0 (solo suscripción) | $50K-$200K | $200K-$500K |
| **Costo mensual** | $399-$1,499/mes | $5K-$10K/mes (infra + soporte) | $10K-$20K/mes |
| **Actualizaciones** | Automáticas, gratis | Manual, costosas | Manual, muy costosas |
| **Escalabilidad** | Instantánea | Limitada (hardware) | Muy limitada |
| **Personalización** | Extensiones + config | Modificar core | Total |
| **Mantenimiento** | Incluido | Cliente responsable | Cliente responsable |
| **Uptime** | 99.9% (SLA) | Variable | Variable |
| **Soporte** | Incluido 24/7 | No incluido | No incluido |
| **ROI** | 3-6 meses | 18-24 meses | 24-36 meses |

---

## 0.1) Arquitectura SaaS Multi-tenant

> Ver documentación completa en [ARQUITECTURA-SAAS.md](./ARQUITECTURA-SAAS.md)

### Modelo Multi-tenant

**Un solo código base, múltiples clientes aislados:**

```
PostgreSQL Database
├── tenant_constructora_abc (Schema)
│   ├── projects
│   ├── budgets
│   ├── purchases
│   └── ...
├── tenant_viviendas_xyz (Schema)
│   ├── projects
│   ├── budgets
│   └── ...
└── tenant_obras_norte (Schema)
    └── ...
```

**Beneficios:**
- **Aislamiento fuerte**: Datos físicamente separados por schema
- **Escalabilidad**: De 10 a 10,000 tenants sin cambios arquitectónicos
- **Seguridad**: Imposible acceso cross-tenant
- **Performance**: No hay degradación con más tenants

### Portal de Administración SaaS

Dashboard central para gestionar:
- **Tenants**: Alta, configuración, suspensión, cancelación
- **Módulos**: Activación/desactivación dinámica por tenant
- **Usuarios**: Gestión de usuarios y roles por empresa
- **Facturación**: Generación automática de facturas, seguimiento de pagos
- **Métricas**: MRR, churn, activación, uso por módulo

### Onboarding Automatizado (5 minutos)

1. **Registro** (2 min): Datos de empresa, admin, subdominio
2. **Selección de plan** (1 min): Básico / Profesional / Enterprise
3. **Configuración de módulos** (1 min): Activar módulos deseados
4. **Provisioning automático** (<1 min): Schema creado, migraciones ejecutadas
5. **Primer login** (Inmediato): Sistema listo para usar

### Planes y Pricing

| Plan | Precio/mes | Usuarios | Módulos | Soporte |
|------|------------|----------|---------|---------|
| **Básico** | $399 USD | 10 | 6 core | Email 48h |
| **Profesional** | $799 USD | 25 | 12 módulos | Chat 24h |
| **Enterprise** | $1,499 USD | 100 | Todos (18) | Dedicado 4h |

**Add-ons disponibles:**
- Módulos adicionales: $50-$300/mes según complejidad
- Usuarios extra: $10-$20/usuario/mes según plan
- Almacenamiento: $2/GB/mes adicional

**Costo de Contratación Inicial (One-Time):**

Además de la suscripción mensual, existe un costo único de implementación que cubre migración de datos, capacitación, adaptación al negocio e implementaciones de configuración:

| Paquete | Precio | Usuarios | Registros | Ideal para |
|---------|--------|----------|-----------|------------|
| **Starter** | $2,500 USD | <10 | <5,000 | Empresas pequeñas |
| **Profesional** | $7,500 USD | 10-50 | <50,000 | Empresas medianas |
| **Enterprise** | $15,000 USD | 50-100 | <200,000 | Constructoras grandes |
| **Enterprise Plus** | Custom | 100+ | Ilimitado | Corporativos |

> Ver detalles completos en [ARQUITECTURA-SAAS.md - Costos de Contratación Inicial](./ARQUITECTURA-SAAS.md#costos-de-contratación-inicial-one-time)

### Marketplace de Extensiones

Ecosistema de extensiones desarrolladas por:
- **Equipo interno**: Integraciones oficiales (SAP, WhatsApp, etc.)
- **Partners certificados**: Módulos verticales especializados
- **Clientes**: Custom workflows y reportes propios

**Tipos de extensiones:**
- Integraciones (APIs externas)
- Reportes custom
- Módulos verticales (ej: Obra Civil Pesada)
- Workflows personalizados
- Dashboards temáticos

### Personalización sin Modificar Core

**Configuración (90% de casos):**
- Catálogos personalizados
- Workflows de aprobación
- Plantillas de documentos
- Campos custom (metadata JSON)
- Reglas de negocio (rule engine)

**Extensiones (10% de casos):**
- SDK de desarrollo disponible
- Hooks en puntos clave del sistema
- API completa para integraciones
- Deploy aislado por tenant

---

## 1) Alcance del MVP

**Objetivo:**
Tener control trazable y en tiempo casi real de:

* Obras y etapas.
* Presupuestos y costos.
* Compras, almacenes e inventarios de obra.
* Contratos/subcontratos y estimaciones.
* Avances físicos (con evidencia).
* RRHH de obra (asistencias, cuadrillas, nómina).
* Postventa y garantías.
* Cumplimiento básico con INFONAVIT (evidencias, checklists, avances).

**Plataformas:**

* Web para administración/finanzas/ingeniería.
* App móvil/tablet para residentes de obra, supervisores y cuadrillas.

**IA (fase inicial):**

* Alertas de desviaciones costo/tiempo.
* Recordatorios de hitos (estimaciones, visitas, licencias por vencer).
* Búsqueda inteligente de documentos y planos.

**WhatsApp Business:**

* Canal para que residentes y supervisores puedan reportar avances, incidencias y fotos.
* Consultas rápidas: "estatus lote 23", "avance etapa 1", "qué falta para estimación 3", etc.

---

## 1A) Catálogo de módulos y funciones (versión ejecutiva)

> Esta sección define **qué debe existir**. Servirá para detallar especificaciones, APIs y datos en documentos posteriores.

### Módulo 1 — **Proyectos, Obras y Viviendas**

Funciones clave:

* Catálogo de proyectos (fraccionamientos, conjuntos).
* Definición de etapas, manzanas, lotes, viviendas/prototipos.
* Asignación de responsables (director de obra, residente, supervisor).
* Calendario general de obra (hitos clave).

### Módulo 2 — **Presupuestos y Costos de Obra**

Funciones clave:

* Presupuesto maestro por obra y por prototipo de vivienda.
* Catálogo de conceptos de obra y precios unitarios.
* Matriz de insumos (material, mano de obra, herramienta, maquinaria).
* Presupuesto vs costo real (desviaciones por partida, frente, vivienda).

### Módulo 3 — **Compras y Abastecimiento**

Funciones clave:

* Requisiciones desde obra (material, herramienta, servicios).
* Órdenes de compra ligadas a conceptos/presupuesto.
* Comparativo de cotizaciones de proveedores.
* Seguimiento de entregas (parcial/completa) y condiciones de pago.

### Módulo 4 — **Inventarios y Almacenes de Obra**

Funciones clave:

* Almacén general + almacenes por obra.
* Entradas/salidas/traspasos entre obras.
* Kárdex por material, obra y frente.
* Alertas de mínimos y sobreconsumo vs presupuesto.

### Módulo 5 — **Contratos y Subcontratos**

Funciones clave:

* Registro de contratos de obra (proveedores, subcontratistas, servicios).
* Control de volúmenes contratados, precios y alcances.
* Órdenes de cambio (obra adicional/modificada).
* Retenciones, garantías, penalizaciones.

### Módulo 6 — **Control de Obra y Avances**

Funciones clave:

* Captura de avance físico por concepto, frente y/o vivienda.
* Curva S (programado vs ejecutado).
* Evidencias fotográficas y geolocalizadas.
* Checklists de actividades por etapa (cimentación, estructura, instalaciones, acabados).

### Módulo 7 — **Estimaciones y Facturación**

Funciones clave:

* Estimaciones hacia el cliente (INFONAVIT/fideicomiso/ente financiero).
* Estimaciones hacia subcontratistas y proveedores.
* Anticipos, amortizaciones, retenciones y garantías.
* Generación de reportes y exportables para revisión y firma.

### Módulo 8 — **Recursos Humanos, Asistencias y Nómina de Obra**

Funciones clave:

* **Catálogo de personal**:
  * Empleados directos y cuadrillas subcontratadas.
  * Clasificación por oficio (albañil, fierrero, plomero, electricista, etc.).
  * Datos personales, contacto, IMSS, INFONAVIT.
  * Certificaciones y capacitaciones.
  * Historial laboral en la empresa.
* **Time & Attendance con GPS + Biométrico** (submódulo reforzado):
  * **Reloj checador móvil**:
    * Check-in/Check-out desde app móvil con validación GPS.
    * Geofencing: alertas si empleado no está en radio de obra.
    * Validación biométrica en dispositivo (huella digital, reconocimiento facial).
    * Soporte para check-in offline con sincronización posterior.
  * **Control multi-sitio**:
    * Asistencia simultánea en varias obras.
    * Transferencia de personal entre frentes/obras en mismo día.
    * Dashboard de ubicación en tiempo real de cuadrillas.
  * **Validaciones anti-fraude**:
    * Detección de check-in duplicado o fuera de horario.
    * Verificación de identidad con biometría (evita "checadas por otro").
    * Alertas de patrones anómalos (ausencias recurrentes, retardos).
  * **Jornada y tiempo extra**:
    * Cálculo automático de horas trabajadas vs horario base.
    * Detección de tiempo extra, jornadas nocturnas, dominicales.
    * Reglas configurables por obra, puesto, sindicato.
    * Aprobación de tiempo extra por supervisor.
  * **Integración con costos**:
    * Imputación de horas-hombre a partidas/frentes de obra.
    * Cálculo de costo de mano de obra real vs presupuestado.
    * Análisis de productividad (avance vs horas invertidas).
* **Nómina de obra**:
  * Costeo de mano de obra por obra/partida.
  * Exportación de datos hacia sistema de nómina/IMSS/INFONAVIT (como patrón).
  * Reporte de incidencias (faltas, retardos, permisos, incapacidades).
  * Cálculo de destajo y bonos por productividad (opcional).

**Beneficio diferenciador**: Control robusto de asistencias con GPS + biometría similar a soluciones especializadas (Jibble, Infobric), integrado nativamente con costos de obra y productividad.

### Módulo 9 — **Calidad, Postventa y Garantías**

Funciones clave:

* Control de no conformidades durante la obra (checklists de calidad).
* Registro de incidencias postventa por vivienda/lote.
* Seguimiento de garantías (tiempos de respuesta, estatus).
* Historial por vivienda para auditorías y reclamaciones.

### Módulo 10 — **CRM de Derechohabientes y Comercialización**

Funciones clave:

* Registro de derechohabientes/prospectos.
* Estatus de cada vivienda: disponible, apartada, vendida, escriturada, entregada.
* Seguimiento de expediente del crédito (documentos, avances, citas).
* Comunicación por WhatsApp/email con compradores.

### Módulo 11 — **INFONAVIT & Cumplimiento**

Funciones clave:

* Registro del proyecto bajo programa específico de INFONAVIT.
* Checklists de requisitos técnicos, urbanos y de servicios.
* Evidencias (documentos, fotos, actas, visitas).
* Reportes para verificadores/auditores.

### Módulo 12 — **Reportes & BI**

Funciones clave:

* Estado de obra por avance físico/financiero.
* Desviaciones costo/tiempo por obra y por etapa.
* Margen por proyecto.
* Reportes de estimaciones, pagos, cartera y flujo de efectivo de obra.

### Módulo 13 — **Administración & Seguridad**

Funciones clave:

* Usuarios/roles/permisos (dirección, ingeniería, residente, compras, financiero).
* Centros de costo por obra.
* Bitácora de actividades y logs de cambios.
* Backups y restauración.

### Módulo 14 — **Finanzas y Controlling de Obra** (Fase 2/3)

> Módulo enterprise para competir con ERPs tipo SAP. Permite gestión financiera integrada a nivel proyecto.

Funciones clave:

* **Libro mayor y centros de costo**:
  * Imputación por proyecto, obra, etapa y centro de costo.
  * Catálogo de cuentas contables ligado a conceptos de obra.
  * Conciliación bancaria por proyecto.
* **Cuentas por pagar/cobrar**:
  * AP (Accounts Payable) ligadas a órdenes de compra y contratos.
  * AR (Accounts Receivable) ligadas a estimaciones y facturación.
  * Aging de cuentas por cobrar/pagar.
  * Anticipos y amortizaciones.
* **Flujo de efectivo**:
  * Cash flow proyectado vs real por obra.
  * Análisis de liquidez por periodo.
  * Proyección de necesidades de financiamiento.
* **Integración contable**:
  * Exportación a sistemas contables externos (SAP, CONTPAQi, etc.).
  * Pólizas contables automáticas desde transacciones de obra.
  * Modo "contabilidad ligera" standalone o integración vía API.

**Beneficio**: Visibilidad financiera completa integrada con operación de obra, similar a módulo financiero de SAP S/4HANA para construcción.

### Módulo 15 — **Activos, Maquinaria y Mantenimiento** (Fase 2/3)

> Gestión de activos fijos, maquinaria pesada, equipo y vehículos de obra con control de mantenimiento.

Funciones clave:

* **Catálogo de activos**:
  * Maquinaria pesada (excavadoras, grúas, revolvedoras, compactadoras).
  * Equipo ligero (andamios, vibradores, herramienta especializada).
  * Vehículos de obra (camiones, camionetas, pick-ups).
  * Clasificación por tipo, marca, modelo, año.
  * Datos de adquisición, depreciación y valor en libros.
* **Control de ubicación y asignación**:
  * Asignación de activo a obra/frente específico.
  * Transferencias entre obras.
  * Localización GPS en tiempo real (opcional con IoT).
  * Disponibilidad por periodo (calendario de uso).
* **Mantenimiento preventivo y correctivo**:
  * Programación de mantenimiento por horas de uso, km o fechas.
  * Órdenes de trabajo de mantenimiento.
  * Checklist de revisión por tipo de activo.
  * Historial completo de mantenimientos.
  * Alertas automáticas de mantenimientos vencidos.
* **Costeo**:
  * Costo por hora/día de uso del activo.
  * Imputación a proyectos y partidas.
  * Costos de mantenimiento (refacciones + mano de obra).
  * Análisis de costo total de propiedad (TCO).
* **Integración**:
  * Almacén (refacciones y consumibles).
  * Compras (órdenes de servicio).
  * Presupuestos (costos de maquinaria).

**Beneficio**: Control total de activos costosos, optimización de uso, reducción de tiempos muertos, similar a Asset Management en ERPs de construcción modernos.

### Módulo 16 — **Gestión Documental y Planos (DMS)** (Fase 2/3)

> Sistema de gestión documental con versionado, control de acceso y flujos de aprobación.

Funciones clave:

* **Repositorio centralizado**:
  * Planos arquitectónicos, estructurales, instalaciones.
  * Contratos y convenios modificatorios.
  * RFIs (Request for Information).
  * Submittals (entregas técnicas).
  * Minutas de reunión y actas.
  * Manuales de operación y mantenimiento.
  * Certificados, permisos y licencias.
* **Versionado y control de cambios**:
  * Control de versiones de planos (rev. A, B, C).
  * Comparación visual entre versiones.
  * Trazabilidad de cambios (quién, cuándo, por qué).
  * Planos vigentes vs obsoletos.
* **Organización y clasificación**:
  * Taxonomía por proyecto/etapa/disciplina.
  * Metadata y tags personalizables.
  * Búsqueda avanzada (texto completo, OCR).
  * Carpetas virtuales por rol.
* **Control de acceso y permisos**:
  * Permisos por documento, carpeta o proyecto.
  * Roles: solo lectura, comentarios, aprobación, edición.
  * Watermarks y restricciones de descarga.
* **Flujos de aprobación**:
  * Workflow de revisión y aprobación de planos.
  * Ciclo de vida de documentos: borrador → revisión → aprobado → vigente.
  * Notificaciones automáticas a responsables.
* **Integración con campo**:
  * Acceso desde app móvil (offline/online).
  * Anotaciones y marcas sobre planos en sitio.
  * Vinculación de evidencias fotográficas a planos.

**Beneficio**: Elimina caos documental, asegura uso de versiones correctas, cumple auditorías y certificaciones, como DMS de Procore o Autodesk Docs.

### Módulo 17 — **Seguridad, Riesgos y HSE** (Fase 3)

> Health, Safety & Environment. Gestión de seguridad en obra, prevención de riesgos y cumplimiento normativo.

Funciones clave:

* **Registro de incidentes y accidentes**:
  * Reporte de incidentes in-situ desde app móvil.
  * Clasificación por severidad (leve, grave, fatal).
  * Investigación de causas raíz.
  * Acciones correctivas y preventivas (CAPA).
  * Integración con RRHH (empleados involucrados).
* **Matriz de riesgos**:
  * Identificación de peligros por actividad/frente.
  * Evaluación de probabilidad e impacto.
  * Matriz de riesgos (bajo, medio, alto, crítico).
  * Plan de mitigación por riesgo.
  * Re-evaluación periódica.
* **Checklists de seguridad**:
  * Inspecciones de seguridad por área/actividad.
  * Verificación de EPP (Equipo de Protección Personal).
  * Permisos de trabajo en altura, espacios confinados, etc.
  * Checklists de maquinaria y equipo.
  * Charlas de seguridad (toolbox talks).
* **Cumplimiento normativo**:
  * Normativas NOM-031-STPS (México), OSHA (EUA).
  * Auditorías de seguridad programadas.
  * Certificaciones y capacitaciones obligatorias.
  * Registro de simulacros.
* **Analytics e IA**:
  * **Detección de patrones de riesgo** con IA:
    * Por horarios (fatiga, turnos nocturnos).
    * Por cuadrillas (historial de incidentes).
    * Por frentes de obra (actividades de alto riesgo).
    * Por condiciones climáticas.
  * Predicción de probabilidad de incidentes.
  * Recomendaciones proactivas de reforzamiento.
  * Dashboard de KPIs: frecuencia, severidad, días sin accidentes.

**Beneficio**: Reducción de accidentes, cumplimiento legal, cultura de seguridad, diferenciador competitivo con IA predictiva.

### Módulo 18 — **Preconstrucción y Licitaciones** (Fase 1/2)

> Elevado desde sección 1C. Gestión del ciclo completo de oportunidades, licitaciones y conversión a proyectos adjudicados.

Funciones clave:

* **Pipeline de oportunidades**:
  * Registro de licitaciones públicas y privadas.
  * Fuentes: portales gubernamentales, clientes directos.
  * Clasificación por tipo, monto, región.
  * Calendario de fechas clave (visita a sitio, junta de aclaraciones, entrega).
  * Estatus: en evaluación, go/no-go, en preparación, entregada, adjudicada, perdida.
* **Gestión de propuesta**:
  * Carga de bases de licitación y anexos técnicos.
  * Catálogo de información base: terreno, número de viviendas, prototipos, alcances.
  * Presupuesto base para ofertar (versión "ofertado").
  * Colaboración en equipo para armado de propuesta.
  * Generación de documentos licitatorios.
* **Conversión a proyecto**:
  * Una vez adjudicado: convertir propuesta → proyecto contratado.
  * Ajustes entre presupuesto ofertado y contratado.
  * Creación automática de estructura de proyecto (etapas, manzanas, lotes).
  * Transferencia de información técnica a módulos operativos.
* **Análisis de licitaciones**:
  * Tasa de éxito (ganadas/perdidas).
  * Análisis de márgenes ofertados vs reales.
  * Competidores recurrentes y estrategias.
  * Dashboard de pipeline (valor potencial, probabilidad ponderada).

**Beneficio**: Visibilidad de cartera de oportunidades, mejora en tasa de ganado, transición suave de preventa a ejecución, propio de ERPs de construcción enterprise.

---

## 1B) Agente de Obra y Oficina (MCP de alcance total)

> El agente debe **poder ejecutar las acciones críticas** de consulta y captura para minimizar fricción, especialmente desde campo.

Capacidades mínimas:

* **Entrada de texto, voz (audios) e imagen (fotos)**:

  * Transcripción de audios para interpretar instrucciones de residentes/supervisores.
  * Lectura de fotos (planos, avances, incidencias) y vínculo a obra/etapa/lote.
* **Gestión por chat para usuarios internos**:

  * Registrar avances ("avance de loza en lote 23 al 80%").
  * Reportar incidencias ("filtración en baño recámara principal lote 12").
  * Consultar estatus ("¿qué falta para cerrar estimación 4 de obra A?").
  * Crear tareas o checklists ("revisión instalaciones hidrosanitarias etapa 2").
* **Atención a derechohabientes (opcional)**:

  * Responder dudas básicas de estatus de vivienda, citas, documentación faltante.
* **Confirmaciones inteligentes**:

  * Antes de aprobar estimaciones, cerrar etapas o liberar pagos.
* **Seguridad y trazabilidad**:

  * Teléfonos autorizados, roles, bitácora de acciones, límites de uso.

---

## 1C) Operativa típica en construcción de vivienda (licitación, obra, INFONAVIT)

> Esta subsección traduce los **procesos típicos de una constructora de vivienda** a requerimientos funcionales.

### A. Desde licitación hasta contrato

* Registro de oportunidades de licitación y proyectos.
* Carga de información base (terreno, número de viviendas, prototipos, alcances).
* Presupuesto base para ofertar.
* Una vez adjudicado: convertir propuesta a proyecto contratado con ajustes.

**Requerimientos del sistema**

* Catálogo de proyectos en etapas (propuesta, en licitación, adjudicado, en ejecución, cerrado).
* Versionado de presupuestos (ofertado vs contratado).
* Documentos clave vinculados (bases de licitación, actas, contratos).

### B. Arranque de obra y planeación

* Definición de calendario y curva S.
* Carga de contrato de obra, subcontratos y proveedores clave.
* Planeación de suministros críticos (cemento, acero, prefabricados).

**Requerimientos**

* Módulo de planeación con hitos y duraciones.
* Ligado a compras y almacén para prever necesidades.

### C. Ejecución y control de avances

* Registro periódico (diario/semanal) de avances físicos por concepto.
* Evidencias fotográficas y checklists de calidad.
* Seguimiento de incidencias y correcciones.

**Requerimientos**

* App de campo para captura de avances y fotos.
* Consola de control de obra en oficina (dashboard por obra/etapa).

### D. Estimaciones y pagos

* Preparación de estimaciones hacia el cliente (INFONAVIT/fideicomiso).
* Estimaciones hacia subcontratistas y proveedores de servicios.
* Aplicación de retenciones, amortización de anticipos y fondos de garantía.

**Requerimientos**

* Flujo de trabajo (workflow) de estimaciones con estatus: borrador → revisada → autorizada → pagada.
* Reportes de estimaciones por obra y proveedor.

### E. Entrega de viviendas y postventa

* Programación de entregas por lote/vivienda.
* Actas de entrega con checklists.
* Registro y atención de quejas/incidencias postventa.

**Requerimientos**

* Ficha de cada vivienda con historial completo (obra + postventa).
* Módulo de tickets de postventa y seguimiento.

---

## 2) Módulos y funciones (detalle inicial)

### Activación de Módulos por Plan

Los módulos se activan/desactivan dinámicamente según el plan de suscripción del cliente:

**Plan Básico (6 módulos core):**
- MAI-001 Fundamentos ✅
- MAI-002 Proyectos ✅
- MAI-003 Presupuestos ✅
- MAI-004 Compras ✅
- MAI-005 Control de Obra ✅
- MAI-006 Reportes ✅

**Plan Profesional (12 módulos):**
- Incluye los 6 del plan Básico
- + MAI-007 RRHH (add-on $100/mes)
- + MAI-008 Estimaciones ✅
- + MAI-009 Calidad (add-on $50/mes)
- + MAI-010 CRM ✅
- + MAI-011 INFONAVIT (add-on $75/mes)
- + MAI-012 Contratos (add-on $75/mes)

**Plan Enterprise (18 módulos):**
- Incluye los 12 del plan Profesional
- + MAI-013 Administración ✅
- + MAI-018 Preconstrucción ✅
- + MAE-014 Finanzas (add-on $200/mes)
- + MAE-015 Activos (add-on $150/mes)
- + MAE-016 DMS (add-on $100/mes)
- + MAA-017 HSE + IA (add-on $300/mes)

**Cambio de plan:** El cliente puede upgradearse en cualquier momento desde su portal. Los módulos se activan instantáneamente.

> Aquí se baja a un nivel más operativo lo definido en 1A.

### 2.1 Proyectos, Obras y Viviendas — Núcleo

* Alta/edición de proyectos.
* Estructura: etapas → manzanas → lotes/viviendas.
* Prototipos de vivienda (tipos A/B/C, departamentos, etc.).
* Asignación de responsables y equipo.

### 2.2 Presupuestos y Costos

* Catálogo de conceptos (obra civil, instalaciones, urbanización, etc.).
* Precios unitarios (insumos, rendimientos, indirectos).
* Presupuesto por obra, por etapa y por prototipo.
* Comparación presupuesto vs costo real por partida.

### 2.3 Compras y Proveedores

* Solicitudes de compra desde obra.
* Órdenes de compra centralizadas por obra/proyecto.
* Recepción parcial/completa de materiales.
* Catálogo de proveedores (materiales, servicios, arrendamientos).

### 2.4 Inventarios y Almacenes

* Almacenes por obra.
* Movimientos: entradas, salidas, traspasos, devoluciones.
* Kárdex y hojas de consumo por concepto.
* Alertas de stock crítico y sobreconsumo.

### 2.5 Contratos y Subcontratos

* Contratos principales con montos y alcances.
* Subcontratos por partida/rubro (albañilería, herrería, instalaciones, etc.).
* Órdenes de cambio/volúmenes adicionales.
* Control de fianzas, pólizas y vigencias.

### 2.6 Control de Obra y Avances

* Captura de avances por concepto (porcentaje, cantidades).
* Plan vs real por semana.
* Curva S por obra.
* Evidencias (fotos, notas, checklists).

### 2.7 Estimaciones y Facturación

* Estimaciones de obra ejecutada (volúmenes, importes).
* Estimaciones a subcontratistas vinculadas a avances.
* Exportaciones PDF/Excel para revisión/firma.
* Registro de pagos y estatus.

### 2.8 RRHH, Asistencias y Mano de Obra

* Lista de empleados y cuadrillas.
* Registro de asistencia (web/app).
* Costeo de mano de obra por obra/partida.
* Exportación hacia nómina externa.

### 2.9 Calidad, Postventa y Garantías

* Listas de verificación por etapa constructiva.
* No conformidades en obra (qué, dónde, quién).
* Tickets de postventa por vivienda.
* Status: recibido, en revisión, en reparación, cerrado.

### 2.10 CRM de Derechohabientes

* Datos del comprador/derechohabiente.
* Estatus del expediente (documentos faltantes).
* Historial de contacto y citas.
* Relación vivienda–cliente–crédito.

### 2.11 INFONAVIT & Cumplimiento

* Registro del proyecto en programa INFONAVIT aplicable.
* Checklists de requisitos urbanísticos, de servicios, sustentabilidad, etc.
* Carga de documentos obligatorios.
* Registro de visitas de verificación y hallazgos.

### 2.12 Reportes y Dashboard

* KPIs por obra: avance físico %, avance financiero %, margen, desviaciones.
* Estimaciones vs pagos.
* Costos por m²/vivienda.
* Reportes exportables (PDF/Excel).

### 2.13 Administración

* Usuarios, roles y permisos.
* Bitácora de acciones críticas.
* Configuración de obras, centros de costo, plantillas de reportes.
* Gestión de backups.

---

## 3) Perfiles de usuario y límites (borrador)

> Esta sección sustituye al modelo de planes POS. Aquí se plantea una posible segmentación de licencias para eventual modelo SaaS multi-cliente.

| Perfil                   | Función principal                                | Ejemplos                                     |
| ------------------------ | ------------------------------------------------ | -------------------------------------------- |
| Dirección                | Visión global de proyectos, márgenes, riesgos    | Director general, director de proyectos      |
| Administración/Finanzas  | Presupuestos, compras, pagos, flujo de efectivo  | Gerente admvo, contabilidad                  |
| Ingeniería/Planeación    | Presupuestos, programación, control de obra      | Ing. residente, planeador, control de obra   |
| Compras/Almacén          | Órdenes de compra, inventarios, recepción        | Encargado de compras, almacenista            |
| RRHH/Nómina              | Asistencias, costeo de mano de obra              | Departamento de RH                           |
| Postventa                | Incidencias, garantías, seguimiento a clientes   | Coordinador de postventa                     |
| Residente/Supervisor     | Avances de obra, incidencias, checklists desde app | Residente, supervisores de frente          |

> (Los límites de usuarios/obras se definirán comercialmente según el modelo que se acuerde con el cliente.)

---

## 4) Arquitectura Técnica SaaS

> **Nota de compatibilidad**: Este stack tecnológico está alineado con el proyecto GAMILIT existente, permitiendo reutilizar componentes, utilidades y patrones arquitectónicos ya desarrollados.
>
> **Arquitectura SaaS Multi-tenant**: Ver documentación completa en [ARQUITECTURA-SAAS.md](./ARQUITECTURA-SAAS.md)

### 4.1 Stack Tecnológico

**Backend:**
* Node.js 20+ + Express + TypeScript
* **Multi-tenant architecture** (schema-level isolation)
* Feature flags para rollout gradual
* Background jobs con Bull/BullMQ

**Frontend:**
* React 18 + Vite + TypeScript
* Tenant-aware routing
* Dynamic module loading (lazy loading por módulo)
* Branding personalizable por tenant

**Base de Datos:**
* PostgreSQL 15+ con schemas por tenant
* Connection pooling optimizado
* Automated migrations per tenant
* Point-in-time recovery per schema

**Infraestructura:**
* AWS/Azure/GCP (agnóstico)
* Kubernetes para orchestration
* Redis para caching y sessions
* S3/Blob Storage para archivos
* CloudFront/CDN para assets estáticos

### 4.2 Backend — Node.js 20+ · Express + TypeScript (Multi-tenant)

* **Framework**: Express.js con TypeScript para type safety.
* **Arquitectura Multi-tenant**:
  * Tenant Resolver Middleware (identifica tenant por subdomain o header)
  * Schema-level isolation (tenant_xxx schemas)
  * Tenant-aware database connections
  * Feature flags por tenant
* **Estructura modular**: Organización por dominios/módulos (similar a GAMILIT):
  * `/src/modules/projects`
  * `/src/modules/budgets`
  * `/src/modules/purchases`
  * `/src/modules/progress`
  * `/src/modules/hr`
  * `/src/modules/infonavit`
  * `/src/shared` (utilidades compartidas)
  * `/src/config` (configuración centralizada)
* **Autenticación**: JWT con refresh tokens; roles y permisos por módulo.
* **Persistencia**: PostgreSQL con modelos normalizados:

  * `projects`, `stages`, `blocks`, `lots`, `units`
  * `budgets`, `budget_items`, `boq_items` (catálogo de conceptos)
  * `suppliers`, `contracts`, `subcontracts`
  * `purchase_orders`, `po_items`, `goods_receipts`
  * `warehouses`, `stock_items`, `stock_movements`
  * `estimations`, `estimation_items`, `payments`
  * `employees`, `attendances`, `labor_costs`
  * `issues`, `checklists`, `post_sales_tickets`
  * `beneficiaries`, `financing_files` (INFONAVIT)
* **ORM/Query Builder**: Prisma o Sequelize para gestión de modelos y migraciones.
* **Servicios de dominio**:

  * Control de obra, presupuestos, compras, estimaciones, RRHH.
  * Arquitectura modular con routers y controllers por módulo.
* **Integraciones iniciales**:

  * WhatsApp Business (webhook + API).
  * SMTP/email para notificaciones (Nodemailer).
* **API REST**: versionada `/api/v1` con Express Router.
* **MCP**: capa de acciones atómicas para el agente IA (consultas y operaciones controladas).
* **Seguridad**:
  * CORS con configuración restrictiva.
  * Helmet para headers de seguridad.
  * Rate limiting (express-rate-limit).
  * Validación de entrada con express-validator o Joi.
  * Logs de auditoría con Winston o Pino.

### 4.2 Frontend — React Web + React Native (App Obra)

**Web (React + Vite + TypeScript):**

* **Build Tool**: Vite para desarrollo rápido y builds optimizados.
* **State Management**: Zustand o Redux Toolkit para gestión de estado global.
* **UI Framework**: Componentes reutilizables con TailwindCSS o Material-UI.
* **Routing**: React Router v6.
* **Funcionalidades**:
  * Panel administrativo y operativo (proyectos, presupuestos, compras, estimaciones, reportes).
  * Dashboards por obra y globales con gráficos (Chart.js o Recharts).
  * Formularios con validación (React Hook Form + Zod).

**App móvil/tablet (React Native + TypeScript):**

* **Framework**: React Native con Expo (recomendado) o CLI nativo.
* **Navegación**: React Navigation.
* **State Management**: Zustand (compartido con web).
* **Funcionalidades**:
  * Captura de avances (porcentaje, fotos, notas).
  * Registro de incidencias/defectos con geolocalización (react-native-maps).
  * Checklists de calidad por etapa.
  * Consulta rápida de estatus de lote/vivienda.
  * Cámara para evidencias fotográficas (Expo Camera).

**Modo offline (mínimo para app):**

* **Storage local**: AsyncStorage o SQLite (expo-sqlite).
* Cola local de registros (avances, incidencias) → sincronización al reconectar.
* Detección automática de conectividad (NetInfo).

### 4.3 WhatsApp + Agente IA

* Webhook para mensajes entrantes.
* Integración con MCP para:

  * Avances rápidos ("avance cimentación etapa 2 30%").
  * Consultas ("estatus estimación 3 obra X").
  * Registro de incidencias con foto.
* Control de teléfonos autorizados y roles.

### 4.4 Despliegue y operación

* **Contenedores Docker**:
  * `api` (Node.js + Express)
  * `db` (PostgreSQL 15+)
  * `worker` (procesamiento asíncrono con Bull/BullMQ)
  * `whatsapp-gateway` (servicio de integración WA)
  * `redis` (caché y colas)
* **Process Manager**: PM2 para gestión de procesos Node.js.
* **Observabilidad**:
  * Logs estructurados con Winston/Pino → agregación en ELK/Loki.
  * Métricas con Prometheus + Grafana.
  * APM con New Relic o Datadog (opcional).
* **Backups**:
  * Base de datos: dumps automáticos diarios con retención según acuerdo.
  * Almacenamiento en S3 o compatible.
* **CI/CD**: GitHub Actions o GitLab CI con tests automatizados pre-deploy.

### 4.5 Escalabilidad

**Horizontal Scaling:**
* API servers: Stateless, escalan horizontalmente
* Database: Read replicas, sharding por tenant (futuro)
* Cache: Redis cluster
* Storage: Object storage escalable

**Vertical Scaling:**
* Database: Upgrade de instancia según carga
* Tenants grandes: Schema dedicado en instancia separada (opcional)

**Performance Targets:**
* API response time: p95 <200ms
* Page load time: <2s
* Database query time: p95 <100ms
* Uptime: 99.9% (8.76 horas downtime/año)

### 4.6 Seguridad Multi-tenant

**Aislamiento de Datos:**
1. Schema-level isolation (primera capa)
2. Row-level security (segunda capa)
3. API-level validation (tercera capa)
4. Audit logging de accesos

**Prevención de Leaks:**
* Tenant resolver middleware obligatorio
* Guards en todos los endpoints
* Validación de tenant_id en queries
* Monitoreo de accesos anómalos

**Cumplimiento:**
* GDPR (Europa)
* LFPDPPP (México)
* SOC 2 Type II (roadmap)
* ISO 27001 (roadmap)

### 4.7 Despliegue y CI/CD

**Environments:**
* Development (local)
* Staging (pre-producción)
* Production (multi-region)

**Pipeline:**
```
Git Push → GitHub Actions
  ↓
Unit Tests → Integration Tests → E2E Tests
  ↓
Build Docker Images
  ↓
Deploy to Staging → Smoke Tests
  ↓
Manual Approval (para Production)
  ↓
Blue-Green Deployment → Health Checks
  ↓
Production Live
```

**Migrations:**
* Ejecutadas automáticamente en cada tenant
* Rollback automático si falla
* Dry-run en staging primero
* Notification a tenants afectados

### 4.8 Monitoreo y Observabilidad

**Métricas:**
* Application metrics (DataDog/New Relic)
* Business metrics (MRR, churn, activación)
* Infrastructure metrics (CPU, RAM, disk)
* Custom metrics por módulo

**Logs:**
* Centralized logging (ELK/Splunk)
* Structured logs (JSON)
* Log levels por environment
* Retention: 90 días production, 30 días staging

**Alerting:**
* PagerDuty para incidents críticos
* Slack para warnings
* Email para info
* Escalation policies definidas

**Dashboards:**
* StatusPage.io público (uptime)
* Grafana interno (métricas técnicas)
* Admin portal (métricas de negocio)

### 4.9 Componentes reutilizables del ecosistema GAMILIT

El proyecto GAMILIT ya cuenta con componentes y patrones que pueden adaptarse:

**Backend (reutilizables):**
* Sistema de autenticación JWT con roles y permisos.
* Middleware de validación y manejo de errores.
* Sistema de logging estructurado.
* Patrones de repository/service para acceso a datos.
* Sistema de notificaciones multi-canal.
* Gestión de archivos y uploads.
* Sistema de auditoría (audit logging).

**Frontend Web (reutilizables):**
* Componentes UI base (botones, inputs, modales, tablas).
* Sistema de formularios con validación.
* Componentes de dashboards y gráficos.
* Manejo de autenticación y rutas protegidas.
* Hooks personalizados para API calls.
* Sistema de notificaciones/toasts.
* Layouts responsivos.

**Base de Datos (patrones):**
* Schemas modulares por dominio.
* Políticas RLS (Row Level Security) para PostgreSQL.
* Triggers y funciones comunes.
* Sistema de migraciones con control de versiones.

**Beneficios de reutilización:**
* Reducción de tiempo de desarrollo: ~30-40%
* Código probado en producción (GAMILIT).
* Patrones arquitectónicos consistentes.
* Facilita mantenimiento futuro del ecosistema.

---

## 5) API REST mínima (borrador)

Ejemplos de endpoints:

* **Auth**: `POST /auth/login`, `POST /auth/refresh`
* **Proyectos**: `GET/POST /projects`, `GET /projects/:id`
* **Estructura de obra**: `POST /projects/:id/structure` (etapas/manzanas/lotes)
* **Presupuestos**: `GET/POST /budgets`, `GET /budgets/:id`
* **Compras**: `POST /purchase-orders`, `POST /purchase-orders/:id/receive`
* **Almacén**: `POST /stock-movements`, `GET /stock/:warehouseId`
* **Avances**: `POST /progress`, `GET /projects/:id/progress`
* **Estimaciones**: `POST /estimations`, `GET /estimations/:id`
* **RRHH**: `POST /attendances`, `GET /attendances?project_id=...`
* **Postventa**: `POST /post-sales`, `GET /post-sales/:id`
* **INFONAVIT**: `GET/POST /infonavit/projects/:id/checklists`
* **WhatsApp**: `POST /webhooks/whatsapp`

---

## 6) MCP — Acciones (borrador)

Ejemplos de acciones para el agente IA:

* `mcp.project.status {project_id}`
* `mcp.progress.register {project_id, stage_id, concept_id, qty|percent, notes}`
* `mcp.progress.get {project_id, stage_id}`
* `mcp.issue.create {project_id, location, description, photo_ref}`
* `mcp.estimation.status {project_id, estimation_no}`
* `mcp.post_sale.create {unit_id, description, channel}`
* `mcp.infonavit.checklist.get {project_id}`
* `mcp.infonavit.checklist.update {project_id, item_id, status}`

Con validación de roles, scopes y confirmaciones para acciones sensibles.

---

## 7) No funcionales

* **Disponibilidad**: meta 99.0% (on-prem o nube según se acuerde).
* **Rendimiento**: operaciones clave (<500 ms en consultas para dashboards principales).
* **Seguridad**:

  * TLS en tránsito.
  * Hash de contraseñas con Argon2/bcrypt.
  * Roles y permisos granulares.
* **Privacidad**:

  * Control de acceso a archivos sensibles (contratos, datos personales).
  * Logs auditables por usuario y fecha.

---

## 8) Roadmap

> **Aceleración por reutilización**: Los tiempos estimados consideran la reutilización de componentes del ecosistema GAMILIT, reduciendo el desarrollo aproximadamente 30-40% vs. desarrollo desde cero.

### Sprint 0 — Setup y migración de base (1 semana)

* Configuración de repositorio y estructura modular.
* Migración de componentes base de GAMILIT:
  * Sistema de autenticación y autorización.
  * Middleware común y manejo de errores.
  * Componentes UI base y layouts.
  * Sistema de logging y auditoría.
* Setup de base de datos con schemas modulares.
* Configuración de CI/CD básico.

### MVP — Fase 1 (Semanas 1–6)

**Core del sistema (Módulos 1-7, 10-13, 18):**
* **Módulo 18**: Preconstrucción y licitaciones (pipeline de oportunidades, conversión a proyectos).
* **Módulo 1**: Proyectos/obras, estructura de fraccionamiento.
* **Módulo 2**: Presupuesto básico y catálogo de conceptos.
* **Módulo 3**: Compras e inventarios de obra.
* **Módulo 4**: Inventarios y almacenes.
* **Módulo 5**: Contratos y subcontratos básicos.
* **Módulo 6**: Control de avances simple (porcentaje + fotos).
* **Módulo 7**: Estimaciones básicas (hacia cliente y subcontratos).
* **Módulo 10**: CRM básico de derechohabientes.
* **Módulo 11**: INFONAVIT checklists básico.
* **Módulo 12**: Reportes esenciales de avance físico y financiero.
* **Módulo 13**: Administración y seguridad.

**Componentes adaptados de GAMILIT:**
* Dashboard base y navegación.
* Sistema de formularios con validación.
* Tablas y paginación.
* Sistema de notificaciones.

### Fase 2 — Gestión de Personal, Calidad y Módulos Enterprise (Semanas 7–12)

**Módulos operativos (8, 9):**
* **Módulo 8**: RRHH y asistencias completo con **Time & Attendance GPS + Biométrico**.
  * Reloj checador móvil con geofencing.
  * Validación biométrica (huella/rostro).
  * Control anti-fraude y multi-sitio.
  * Integración con costeo de mano de obra.
* **Módulo 9**: Postventa y garantías completo.

**Módulos enterprise iniciales (14, 15, 16):**
* **Módulo 14**: Finanzas y Controlling de Obra (versión inicial):
  * Cuentas por pagar/cobrar ligadas a compras y estimaciones.
  * Flujo de efectivo proyectado vs real.
  * Integración básica con sistemas contables externos.
* **Módulo 15**: Activos, Maquinaria y Mantenimiento (versión inicial):
  * Catálogo de activos y maquinaria pesada.
  * Asignación a obras y control de ubicación.
  * Mantenimiento preventivo básico.
* **Módulo 16**: Gestión Documental y Planos (versión inicial):
  * Repositorio centralizado de documentos.
  * Versionado de planos.
  * Control de acceso básico.

**Dashboards y analytics:**
* Dashboards ejecutivos con gráficos avanzados.
* Analytics de productividad y costos.

### Fase 3 — IA, HSE y Extensiones Enterprise (Semanas 13–18)

**IA y automatización:**
* IA (alertas de desviaciones costo/tiempo y recordatorios inteligentes).
* Modelos predictivos de riesgo de retraso/costo.
* WhatsApp Business + Agente IA (MCP) con capacidades completas.

**Módulo 17 — Seguridad, Riesgos y HSE:**
* Registro de incidentes y accidentes desde app móvil.
* Matriz de riesgos y checklists de seguridad.
* Cumplimiento normativo (NOM-031-STPS, OSHA).
* **IA para detección de patrones de riesgo** (diferenciador competitivo).

**App móvil completa:**
* React Native para campo con todas las funcionalidades.
* Modo offline robusto.
* Sincronización optimizada.

**Extensiones de módulos enterprise:**
* **Módulo 14** (extendido): Libro mayor, controlling completo, conciliación bancaria.
* **Módulo 15** (extendido): Mantenimiento correctivo, IoT para localización GPS de activos.
* **Módulo 16** (extendido): Flujos de aprobación complejos, OCR, comparación visual de planos.

**Integraciones adicionales:**
* Contabilidad (SAP, CONTPAQi, etc.).
* Nómina externa.
* Portales gubernamentales de licitaciones.

### Fase 4 (Opcional) — Optimización y Features Avanzadas (Semanas 19–22)

* Performance optimization y escalamiento.
* Features avanzadas de IA predictiva.
* Integraciones con IoT (sensores, drones).
* Mobile app features avanzadas (AR para visualización de planos en sitio).
* Business Intelligence avanzado con ML.

**Tiempo total estimado**:
* **MVP Core (Fase 1)**: 6 semanas
* **MVP + Enterprise Básico (Fases 1-2)**: 12 semanas
* **Sistema Completo (Fases 1-3)**: 18 semanas
* **Sistema Optimizado (Fases 1-4)**: 22 semanas

> **vs. Desarrollo desde cero**: 30-35 semanas para alcance equivalente (ahorro ~40%)

---

## 9) Términos comerciales (borrador)

> (A ajustar con números concretos cuando definas tu estrategia de precio para este cliente.)

**Modalidad sugerida**: licencia por proyecto + mantenimiento anual / SaaS mensual.

**Incluye:**

* Implementación del MVP.
* Capacitación inicial a usuarios clave.
* Soporte correctivo en horario laboral.

**Exclusiones:**

* Adecuaciones contables específicas del despacho del cliente.
* Integraciones especiales no descritas (ERP contable, nómina propia, etc.).

---

## 10) Criterios de aceptación (MVP)

1. Registrar al menos 1 proyecto completo con etapas, manzanas, lotes y prototipos.
2. Cargar un presupuesto maestro y visualizar comparación presupuesto vs costo real por partida.
3. Generar y recibir al menos 3 órdenes de compra y reflejar el movimiento en inventarios.
4. Registrar avances físicos por concepto y visualizar la curva S programado vs real.
5. Elaborar al menos 1 estimación hacia el cliente y 1 a un subcontratista, con exportación PDF/Excel.
6. Registrar asistencias de cuadrillas por obra y obtener un reporte de costo de mano de obra.
7. Crear mínimo 5 tickets de postventa y cerrar al menos 2, con evidencia.
8. Subir evidencias y checklists para al menos 1 checklist INFONAVIT.
9. Consultar vía WhatsApp el avance de una obra y registrar al menos 1 incidencia usando el agente.

---

## 11) Estrategia de migración y adaptación de componentes GAMILIT

Esta sección detalla cómo aprovechar el código existente del proyecto GAMILIT para acelerar el desarrollo.

### 11.1 Componentes de infraestructura (Alta prioridad)

**Autenticación y autorización:**
* Migrar sistema JWT de GAMILIT.
* Adaptar middleware de autenticación.
* Reutilizar sistema de roles y permisos (ajustar roles específicos de construcción).

**Middleware y utilidades:**
* Error handlers y validadores.
* Logging estructurado (Winston/Pino).
* Rate limiting y CORS.
* Helpers de respuesta HTTP estandarizados.

**Base de datos:**
* Estructura de schemas modulares de GAMILIT como referencia.
* Reutilizar políticas RLS como template.
* Adaptar sistema de migraciones.
* Sistema de seeds para datos de prueba.

### 11.2 Componentes de frontend (Media prioridad)

**UI Base:**
* Botones, inputs, selects con variantes.
* Modales y diálogos.
* Sistema de notificaciones/toasts.
* Loaders y skeletons.

**Layouts:**
* Sidebar y navbar.
* Estructura de páginas admin.
* Grids y containers responsivos.

**Formularios:**
* Componentes de formulario con validación.
* Hooks personalizados (useForm, useApi).
* Manejo de estados de carga/error.

**Dashboards:**
* Componentes de gráficos (Recharts).
* Cards de métricas.
* Tablas con paginación, filtros y ordenamiento.

### 11.3 Patrones y arquitectura (Baja prioridad - guías)

**Backend:**
* Patrón Repository/Service.
* Estructura de routers y controllers.
* Organización de módulos.
* Manejo de transacciones.

**Frontend:**
* Arquitectura de state management.
* Estructura de carpetas.
* Patrones de composición de componentes.
* Testing patterns.

### 11.4 Plan de migración por sprint

**Sprint 0:**
1. Crear repositorio con estructura base de GAMILIT.
2. Migrar sistema de autenticación completo.
3. Setup de base de datos con schemas modulares.
4. Migrar componentes UI base (botones, inputs, modales).
5. Configurar sistema de logging y error handling.

**Sprint 1:**
6. Adaptar layout principal y navegación.
7. Migrar sistema de formularios.
8. Implementar tablas reutilizables.
9. Setup de sistema de notificaciones.

**Sprint 2+:**
10. Migrar componentes específicos según necesidad.
11. Adaptar hooks y utilidades.
12. Ajustar componentes de dashboards.

### 11.5 Consideraciones de adaptación

**Diferencias de dominio:**
* GAMILIT: Plataforma educativa (estudiantes, cursos, actividades).
* MVP-APP: Construcción (proyectos, obras, presupuestos).
* **Acción**: Renombrar entidades pero mantener estructura de relaciones.

**Términos a adaptar:**

| GAMILIT | MVP-APP |
|---------|---------|
| `students` | `employees` / `beneficiaries` |
| `courses` | `projects` |
| `activities` | `tasks` / `checklists` |
| `progress` | `progress` (compatible) |
| `achievements` | `milestones` |

**Mantenimiento del código compartido:**
* Documentar componentes reutilizados con referencia a GAMILIT.
* Considerar extraer a librería compartida en futuro.
* Sincronizar mejoras críticas entre proyectos.

### 11.6 Estimación de ahorro

| Componente | Desarrollo desde cero | Con reutilización | Ahorro |
|------------|----------------------|-------------------|---------|
| Autenticación | 2 semanas | 3 días | 65% |
| UI Base | 3 semanas | 1 semana | 67% |
| Dashboards | 2 semanas | 1 semana | 50% |
| Formularios | 1.5 semanas | 3 días | 60% |
| BD Setup | 1 semana | 3 días | 60% |
| **TOTAL** | **9.5 semanas** | **3.4 semanas** | **~64%** |

**Beneficio adicional**: Código ya probado en producción reduce bugs y tiempo de QA.

---

## 8) Casos de Uso SaaS

### Caso 1: Constructora Mediana (25 empleados)

**Perfil:**
- 3 proyectos simultáneos (150 viviendas/año)
- Facturación: $80M MXN/año
- Personal: 25 oficina + 150 campo

**Plan:** Profesional ($799/mes)
- 25 usuarios incluidos
- 12 módulos activados
- Add-ons: RRHH ($100/mes), INFONAVIT ($75/mes)
- **Total: $974/mes ($11,688/año)**

**ROI:**
- Antes (Excel + WhatsApp): Pérdida 5% por descontrol = $4M/año
- Después (ERP): Pérdida reducida a 1% = $800K/año
- **Ahorro: $3.2M/año**
- **ROI: 27,000% (recuperación en 1.3 meses)**

---

### Caso 2: Constructora Grande (100 empleados)

**Perfil:**
- 10 proyectos simultáneos (500 viviendas/año)
- Facturación: $300M MXN/año
- Personal: 100 oficina + 800 campo

**Plan:** Enterprise ($1,499/mes)
- 100 usuarios incluidos
- 18 módulos (todos)
- Add-ons: HSE IA ($300/mes), Finanzas ($200/mes)
- **Total: $1,999/mes ($23,988/año)**

**ROI:**
- Antes (ERP legacy costoso): $150K/año licencias + $50K/año mantenimiento = $200K/año
- Después (Este SaaS): $24K/año
- **Ahorro: $176K/año**
- **Además**: Mayor productividad, menos errores, decisiones data-driven

---

### Caso 3: Startup Constructora (5 empleados)

**Perfil:**
- 1 proyecto piloto (30 viviendas)
- Facturación: $15M MXN/año
- Personal: 5 oficina + 30 campo

**Plan:** Básico ($399/mes) + Trial 14 días gratis
- 10 usuarios incluidos
- 6 módulos core
- Sin add-ons inicialmente
- **Total: $399/mes ($4,788/año)**

**Ventaja:**
- Herramientas enterprise desde día 1
- Puede crecer agregando módulos
- Sin inversión inicial en tecnología
- Competir con constructoras grandes

---

### Caso 4: Extensión para Obra Civil Pesada

**Perfil:**
- Constructora especializada en puentes y carreteras
- Requiere funcionalidad específica no incluida en core

**Solución:** Extensión del Marketplace
- Plan Enterprise ($1,499/mes)
- + Extensión "Obra Civil Pesada" ($299/mes)
- **Total: $1,798/mes**

**Funcionalidad de extensión:**
- Gestión de tramos de carretera
- Control de acarreos y volúmenes
- Reportes para SCT
- Integración con laboratorio

**Desarrollo:** Partner certificado lo desarrolló usando el SDK, no modificó el core.

---

## 9) Migración de Clientes Existentes

### Si ya tienen un sistema legacy

**Proceso de migración:**

1. **Análisis de datos** (1 semana)
   - Auditoría de datos actuales
   - Identificación de datos críticos
   - Mapeo de campos
   - Limpieza de datos

2. **Setup de tenant** (1 día)
   - Onboarding estándar
   - Configuración inicial
   - Usuarios y permisos

3. **Migración de datos** (1-2 semanas)
   - Import de proyectos históricos
   - Import de catálogos
   - Import de transacciones
   - Validación de integridad

4. **Capacitación** (1 semana)
   - Training del equipo administrativo
   - Training del equipo de campo
   - Documentación personalizada
   - Soporte 1-1

5. **Go-live** (1 día)
   - Cutover del sistema legacy
   - Monitoreo intensivo
   - Soporte en sitio (opcional)

6. **Estabilización** (2 semanas)
   - Soporte prioritario
   - Ajustes de configuración
   - Resolución de incidencias

**Total tiempo de migración: 4-6 semanas**

**Costo de migración:**
- Paquete Starter: $2,500 USD (datos <5K registros)
- Paquete Profesional: $7,500 USD (datos <50K registros)
- Paquete Enterprise: $15,000 USD (datos <200K registros)
- Servicios adicionales: Ver [ARQUITECTURA-SAAS.md](./ARQUITECTURA-SAAS.md#servicios-adicionales-opcionales)

### Si no tienen sistema

**Inicio desde cero:**
- Onboarding: 5 minutos
- Configuración inicial: 2 horas (catálogos, usuarios)
- Primer proyecto: 1 día
- **Productivos: < 1 semana**

---

## Documentación Relacionada

- **[ARQUITECTURA-SAAS.md](./ARQUITECTURA-SAAS.md)**: Arquitectura multi-tenant detallada
- **[CAMBIOS-SAAS-MVP.md](./CAMBIOS-SAAS-MVP.md)**: Guía de transformación a modelo SaaS
- **[01-fase-alcance-inicial/](../01-fase-alcance-inicial/)**: Documentación Fase 1 (Módulos MAI-001 a MAI-013 + MAI-018)
- **[02-fase-enterprise/](../02-fase-enterprise/)**: Documentación Fase 2 (Módulos MAE-014 a MAE-016)
- **[03-fase-avanzada/](../03-fase-avanzada/)**: Documentación Fase 3 (Módulo MAA-017)
- **[ESTRUCTURA-COMPLETA.md](../ESTRUCTURA-COMPLETA.md)**: Mapa completo del sistema

---

**Versión:** 2.0 SaaS Multi-tenant
**Última actualización:** 2025-11-17
**Modelo de negocio:** B2B SaaS, Subscription-based
**Stack:** Node.js + Express + TypeScript · React + Vite · PostgreSQL Multi-tenant

---