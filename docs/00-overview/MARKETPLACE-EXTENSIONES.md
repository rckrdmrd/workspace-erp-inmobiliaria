# Marketplace de Extensiones - Guía de Desarrollo

**Versión:** 1.0
**Fecha:** 2025-11-17
**SDK Version:** 1.0.0
**Modelo:** SaaS Multi-tenant B2B

---

## 📋 Resumen Ejecutivo

El Marketplace de Extensiones permite a constructoras (tenants), partners y desarrolladores externos crear funcionalidad custom sin modificar el core del sistema. Las extensiones se desarrollan usando el SDK oficial y se distribuyen a través del marketplace centralizado.

**Tipos de desarrolladores:**
- **Equipo interno**: Extensiones oficiales (integraciones, reportes)
- **Partners certificados**: Módulos verticales especializados
- **Clientes enterprise**: Extensiones privadas para uso interno
- **Comunidad**: Extensiones públicas open-source

---

## 🎯 Tipos de Extensiones

### 1. Integraciones (Connectors)

Conectores a sistemas externos:

**Ejemplos:**
- SAP S/4HANA Connector
- CONTPAQi Connector
- WhatsApp Business API
- QuickBooks Online
- Slack Notifications
- Microsoft Teams
- Google Workspace
- Zoom Meetings

**Características:**
- Autenticación OAuth 2.0
- Webhooks bidireccionales
- Retry logic y error handling
- Rate limiting inteligente
- Logs de sincronización

**Pricing típico:** $0-$199/mes

---

### 2. Reportes Custom

Plantillas de reportes especializados:

**Ejemplos:**
- Reporte INFONAVIT EVC (formato oficial 2025)
- Reporte para licitaciones CFE
- Reporte de cumplimiento NOM-031-STPS
- Dashboard ejecutivo C-level
- Reporte de rentabilidad por proyecto
- Análisis de variaciones de presupuesto

**Características:**
- Exportación a PDF, Excel, CSV
- Scheduling automático (diario, semanal, mensual)
- Email delivery
- Plantillas con branding de la constructora
- Cálculos complejos pre-configurados

**Pricing típico:** $29-$99 (one-time) o $10-$50/mes

---

### 3. Módulos Verticales

Funcionalidad específica por tipo de constructora:

**Ejemplos:**
- Módulo de Obra Civil Pesada (puentes, carreteras)
- Módulo de Edificación Alta (rascacielos, oficinas)
- Módulo de Obra Industrial (plantas, fábricas)
- Módulo de Infraestructura (aeropuertos, estaciones)
- Módulo de Restauración (edificios históricos)

**Características:**
- Catálogos especializados (actividades, riesgos, EPP)
- Workflows específicos
- Reportes regulatorios verticales
- Integraciones con herramientas especializadas

**Pricing típico:** $199-$599/mes

---

### 4. Workflows Custom

Flujos de aprobación personalizados:

**Ejemplos:**
- Workflow de estimaciones 5 niveles (Resident → Super → Director → Finance → Cliente)
- Workflow de compras con 3 cotizaciones obligatorias
- Workflow de cambios de alcance con firma digital
- Workflow de liberación de pagos a subcontratistas

**Características:**
- Aprobaciones paralelas o secuenciales
- Escalamiento automático por tiempo
- Notificaciones por múltiples canales
- Firma digital integrada
- Audit trail completo

**Pricing típico:** $49-$199/mes

---

### 5. Dashboards Temáticos

Dashboards especializados:

**Ejemplos:**
- Dashboard Financiero (CFO)
- Dashboard de Producción (Gerente de Obra)
- Dashboard de Calidad (QA Manager)
- Dashboard de HSE (Safety Manager)
- Dashboard de Compras (Procurement)

**Características:**
- Widgets personalizables
- Drill-down interactivo
- Alertas en tiempo real
- Exportación programada
- Mobile responsive

**Pricing típico:** $29-$99/mes

---

### 6. Templates

Plantillas de documentos y procesos:

**Ejemplos:**
- Contratos tipo (obra, subcontrato, arrendamiento)
- Formatos oficiales (permisos, licencias)
- Checklists de calidad por actividad
- Procedimientos de seguridad
- Minutas de junta

**Características:**
- Merge de datos del sistema
- Variables dinámicas
- Versionado de templates
- Firma digital
- Multi-idioma

**Pricing típico:** $9-$49 (one-time)

---

## 🛠️ SDK de Desarrollo

### Instalación

```bash
npm install @erp-construccion/extension-sdk
```

### Estructura de una Extensión

```typescript
// mi-extension/
// ├── package.json
// ├── extension.config.ts
// ├── src/
// │   ├── index.ts          // Entry point
// │   ├── hooks/            // Event hooks
// │   ├── components/       // UI components (React)
// │   ├── services/         // Business logic
// │   └── utils/            // Utilities
// └── tests/

// package.json
{
  "name": "@mi-empresa/extension-whatsapp",
  "version": "1.0.0",
  "description": "Notificaciones por WhatsApp",
  "main": "dist/index.js",
  "dependencies": {
    "@erp-construccion/extension-sdk": "^1.0.0"
  },
  "extensionMetadata": {
    "displayName": "WhatsApp Notifier",
    "category": "integrations",
    "pricing": {
      "type": "free"
    },
    "permissions": [
      "notifications.send",
      "users.read"
    ]
  }
}
```

### Configuración de Extensión

```typescript
// extension.config.ts
import { ExtensionConfig } from '@erp-construccion/extension-sdk';

export default {
  id: 'whatsapp-notifier',
  name: 'WhatsApp Notifier',
  version: '1.0.0',
  author: {
    name: 'Mi Empresa',
    email: 'soporte@mi-empresa.com',
    website: 'https://mi-empresa.com'
  },
  description: 'Envía notificaciones automáticas por WhatsApp',
  icon: 'https://cdn.mi-empresa.com/whatsapp-icon.png',

  // Compatibilidad
  minPlatformVersion: '2.0.0',
  maxPlatformVersion: '3.0.0',

  // Pricing
  pricing: {
    type: 'free', // 'free' | 'one_time' | 'subscription'
    amount: 0,
    currency: 'USD',
    trial: false
  },

  // Permisos requeridos
  permissions: [
    'notifications.send',
    'users.read',
    'projects.read'
  ],

  // Configuración
  settings: [
    {
      key: 'whatsapp_api_key',
      type: 'string',
      required: true,
      secure: true,
      label: 'WhatsApp API Key',
      description: 'API key de WhatsApp Business'
    },
    {
      key: 'default_template',
      type: 'select',
      options: ['template1', 'template2'],
      default: 'template1',
      label: 'Plantilla por defecto'
    }
  ]
} as ExtensionConfig;
```

---

## 📚 API del SDK

### 1. Hooks (Eventos)

```typescript
import { Extension, Hook } from '@erp-construccion/extension-sdk';

@Extension({
  id: 'whatsapp-notifier',
  name: 'WhatsApp Notifier'
})
export class WhatsAppNotifierExtension {

  // Hook: Cuando se crea una estimación
  @Hook('estimations.created')
  async onEstimationCreated(estimation: Estimation) {
    const constructora = this.context.constructora;
    const users = await this.api.users.findByRole('finance');

    for (const user of users) {
      if (user.phone && user.notificationsEnabled) {
        await this.sendWhatsApp(user.phone, {
          template: 'estimation_created',
          params: {
            estimationNumber: estimation.number,
            amount: estimation.amount,
            project: estimation.project.name
          }
        });
      }
    }
  }

  // Hook: Cuando se aprueba un presupuesto
  @Hook('budgets.approved')
  async onBudgetApproved(budget: Budget) {
    // Lógica custom
  }

  // Hook: Cuando un proyecto excede presupuesto
  @Hook('projects.budget_exceeded')
  async onBudgetExceeded(project: Project, overrun: number) {
    // Alertar al director de proyecto
    const director = await this.api.users.findById(project.directorId);

    await this.sendWhatsApp(director.phone, {
      template: 'budget_alert',
      params: {
        projectName: project.name,
        overrunPercentage: (overrun * 100).toFixed(2)
      }
    });
  }
}
```

**Hooks disponibles:**

```typescript
// Proyectos
'projects.created'
'projects.updated'
'projects.deleted'
'projects.budget_exceeded'
'projects.milestone_reached'

// Presupuestos
'budgets.created'
'budgets.approved'
'budgets.rejected'

// Compras
'purchases.order_created'
'purchases.order_approved'
'purchases.goods_received'

// Estimaciones
'estimations.created'
'estimations.approved'
'estimations.paid'

// Control de Obra
'progress.updated'
'progress.milestone_completed'

// RRHH
'employees.hired'
'employees.terminated'
'attendance.checked_in'
'attendance.anomaly_detected'

// HSE
'incidents.registered'
'incidents.investigated'
'risks.predicted'  // IA
'patterns.detected'  // IA

// Calidad
'defects.reported'
'defects.resolved'

// Finanzas
'accounting.entry_created'
'payments.made'
'invoices.received'

// General
'notifications.sent'
'reports.generated'
```

---

### 2. API de Datos

```typescript
// Acceso a datos de la constructora
import { API } from '@erp-construccion/extension-sdk';

export class MiExtension {

  async getMiData() {
    const api = this.context.api;

    // Proyectos
    const projects = await api.projects.findAll({
      status: 'active',
      limit: 10
    });

    // Presupuestos
    const budget = await api.budgets.findById('budget-123');

    // Usuarios
    const users = await api.users.findByRole('engineer');

    // Custom queries
    const result = await api.query(`
      SELECT p.name, SUM(b.amount) as total
      FROM projects p
      JOIN budgets b ON b.project_id = p.id
      WHERE p.status = 'active'
      GROUP BY p.id
    `);

    return result;
  }

  // Crear datos
  async createProject() {
    const project = await this.context.api.projects.create({
      name: 'Nuevo Proyecto',
      code: 'PRJ-2025-001',
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    return project;
  }

  // Actualizar datos
  async updateProject(id: string) {
    const project = await this.context.api.projects.update(id, {
      status: 'completed'
    });

    return project;
  }
}
```

---

### 3. UI Components (React)

```typescript
import { Component, MenuItem } from '@erp-construccion/extension-sdk';
import { useState } from 'react';

// Agregar ítem al menú lateral
@MenuItem({
  section: 'settings',
  label: 'Configurar WhatsApp',
  icon: 'whatsapp',
  route: '/settings/whatsapp'
})
export function WhatsAppSettingsPage() {
  const [apiKey, setApiKey] = useState('');

  const handleSave = async () => {
    await context.settings.save({ whatsapp_api_key: apiKey });
  };

  return (
    <div>
      <h1>Configuración de WhatsApp</h1>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key"
      />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}

// Agregar widget al dashboard
@Component({
  type: 'dashboard-widget',
  title: 'Notificaciones WhatsApp Enviadas',
  defaultSize: { w: 2, h: 1 }
})
export function WhatsAppStatsWidget() {
  const [stats, setStats] = useState({ sent: 0, delivered: 0, failed: 0 });

  useEffect(() => {
    // Cargar estadísticas
    const loadStats = async () => {
      const data = await context.api.custom('/whatsapp/stats');
      setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="widget">
      <h3>WhatsApp Stats (Últimos 7 días)</h3>
      <div>Enviados: {stats.sent}</div>
      <div>Entregados: {stats.delivered}</div>
      <div>Fallidos: {stats.failed}</div>
    </div>
  );
}

// Agregar botón en página de estimaciones
@Component({
  type: 'action-button',
  page: 'estimations.detail',
  label: 'Enviar por WhatsApp',
  icon: 'send'
})
export function SendEstimationButton({ estimation }: { estimation: Estimation }) {
  const handleSend = async () => {
    // Enviar estimación por WhatsApp
    await sendEstimationViaWhatsApp(estimation);
  };

  return <button onClick={handleSend}>Enviar por WhatsApp</button>;
}
```

---

### 4. Servicios y Utilidades

```typescript
import { Service, injectable } from '@erp-construccion/extension-sdk';

@Service()
export class WhatsAppService {

  async sendMessage(phone: string, message: string) {
    const apiKey = await this.context.settings.get('whatsapp_api_key');

    const response = await fetch('https://api.whatsapp.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phone,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    // Registrar en audit log
    await this.context.audit.log({
      action: 'whatsapp.message_sent',
      details: { phone, message }
    });

    return response.json();
  }

  async sendTemplate(phone: string, templateId: string, params: any) {
    // Implementación de template
  }
}
```

---

### 5. Storage (Persistencia)

```typescript
// Cada extensión tiene su propio almacenamiento aislado por constructora
import { Storage } from '@erp-construccion/extension-sdk';

export class MiExtension {

  async guardarConfig() {
    // Guardar en storage de la extensión
    await this.context.storage.set('mi_config', {
      apiKey: 'xxx',
      enabled: true,
      lastSync: new Date()
    });
  }

  async cargarConfig() {
    const config = await this.context.storage.get('mi_config');
    return config;
  }

  async eliminarConfig() {
    await this.context.storage.delete('mi_config');
  }

  // Storage de archivos
  async subirArchivo(file: File) {
    const url = await this.context.storage.uploadFile(file, {
      folder: 'whatsapp-attachments',
      maxSize: 10 * 1024 * 1024, // 10 MB
      allowedTypes: ['image/png', 'image/jpeg', 'application/pdf']
    });

    return url;
  }
}
```

---

### 6. Notificaciones

```typescript
import { Notifications } from '@erp-construccion/extension-sdk';

export class MiExtension {

  async enviarNotificacion() {
    // Notificación in-app
    await this.context.notifications.send({
      userId: 'user-123',
      title: 'Estimación Aprobada',
      message: 'La estimación #EST-2025-001 ha sido aprobada',
      type: 'success',
      link: '/estimations/EST-2025-001'
    });

    // Email
    await this.context.notifications.sendEmail({
      to: 'user@example.com',
      subject: 'Estimación Aprobada',
      template: 'estimation_approved',
      data: {
        estimationNumber: 'EST-2025-001',
        amount: '$250,000 USD'
      }
    });

    // SMS
    await this.context.notifications.sendSMS({
      phone: '+52 442 123 4567',
      message: 'Estimación EST-2025-001 aprobada por $250,000 USD'
    });
  }
}
```

---

### 7. Scheduled Jobs (Tareas Programadas)

```typescript
import { Job, Schedule } from '@erp-construccion/extension-sdk';

@Job()
export class SyncJob {

  // Ejecutar cada hora
  @Schedule('0 * * * *')
  async syncData() {
    console.log('Sincronizando datos con sistema externo...');

    // Obtener datos pendientes
    const pending = await this.context.storage.get('pending_sync');

    // Sincronizar
    for (const item of pending) {
      await this.syncItem(item);
    }

    // Limpiar
    await this.context.storage.delete('pending_sync');
  }

  // Ejecutar diariamente a las 2 AM
  @Schedule('0 2 * * *')
  async dailyReport() {
    // Generar reporte diario
    const report = await this.generateReport();

    // Enviar por email
    await this.context.notifications.sendEmail({
      to: 'admin@company.com',
      subject: 'Reporte Diario WhatsApp',
      body: report
    });
  }

  private async syncItem(item: any) {
    // Implementación
  }

  private async generateReport() {
    // Implementación
    return 'Reporte...';
  }
}
```

---

## 📦 Publicación en el Marketplace

### 1. Desarrollo Local

```bash
# Clonar template
git clone https://github.com/erp-construccion/extension-template
cd extension-template

# Instalar dependencias
npm install

# Desarrollo en modo watch
npm run dev

# Testing
npm test

# Build para producción
npm run build
```

### 2. Testing en Constructora de Prueba

```bash
# Subir extensión a constructora de prueba
npm run deploy --constructora=my-test-constructora

# Ver logs en tiempo real
npm run logs --constructora=my-test-constructora
```

### 3. Validación y Certificación

**Checklist de validación:**

- [ ] ✅ Todos los tests pasan (coverage ≥80%)
- [ ] ✅ Sin vulnerabilidades de seguridad (npm audit)
- [ ] ✅ Documentación completa (README.md)
- [ ] ✅ Screenshots/demo video
- [ ] ✅ Pricing definido
- [ ] ✅ Soporte definido (email, docs, SLA)
- [ ] ✅ Compatible con versiones de plataforma
- [ ] ✅ No usa APIs privadas/no documentadas
- [ ] ✅ Maneja errores gracefully
- [ ] ✅ Logs apropiados (no spam)
- [ ] ✅ Performance aceptable (no bloquea UI)

**Revisión del equipo:**
- Seguridad: Audit de código (SAST/DAST)
- Compliance: Verificación de licencias
- UX: Revisión de interfaz
- Performance: Load testing

### 4. Publicar al Marketplace

```bash
# Login con credenciales de desarrollador
npm run marketplace:login

# Publicar (primera vez)
npm run marketplace:publish

# Actualizar versión existente
npm run marketplace:publish --version=1.1.0 --changelog="Bug fixes"
```

**Formulario de publicación:**
```yaml
name: "WhatsApp Notifier"
description: "Envía notificaciones automáticas por WhatsApp Business API"
category: "integrations"
version: "1.0.0"
author: "Mi Empresa"
support_email: "soporte@mi-empresa.com"
support_url: "https://docs.mi-empresa.com/whatsapp"
documentation_url: "https://docs.mi-empresa.com/whatsapp"
privacy_policy_url: "https://mi-empresa.com/privacy"
terms_url: "https://mi-empresa.com/terms"

pricing:
  type: "free"

screenshots:
  - url: "https://cdn.mi-empresa.com/screenshot1.png"
    caption: "Dashboard principal"
  - url: "https://cdn.mi-empresa.com/screenshot2.png"
    caption: "Configuración"

demo_video: "https://youtube.com/watch?v=xxx"

keywords:
  - whatsapp
  - notifications
  - messaging

compatible_plans:
  - professional
  - enterprise

permissions:
  - notifications.send
  - users.read

changelog: |
  ## v1.0.0 (2025-11-17)
  - Initial release
  - WhatsApp Business API integration
  - Templates for estimations and budgets
```

---

## 💰 Modelos de Monetización

### 1. Gratis

```typescript
pricing: {
  type: 'free'
}
```

**Casos de uso:**
- Extensiones open-source
- Marketing (lead generation)
- Complemento de servicio principal

---

### 2. Pago Único

```typescript
pricing: {
  type: 'one_time',
  amount: 49,
  currency: 'USD'
}
```

**Casos de uso:**
- Templates
- Reportes estáticos
- Herramientas simples

---

### 3. Suscripción Mensual

```typescript
pricing: {
  type: 'subscription',
  amount: 99,
  currency: 'USD',
  interval: 'month',
  trial: {
    enabled: true,
    days: 14
  }
}
```

**Casos de uso:**
- Integraciones
- Módulos con mantenimiento
- Servicios externos (APIs)

---

### 4. Basado en Uso

```typescript
pricing: {
  type: 'usage_based',
  base: 29,  // Base mensual
  tiers: [
    { upTo: 1000, pricePerUnit: 0.05 },  // $0.05 por notificación
    { upTo: 10000, pricePerUnit: 0.03 },
    { upTo: null, pricePerUnit: 0.01 }   // Ilimitado a $0.01
  ],
  unit: 'notification'
}
```

**Casos de uso:**
- SMS/WhatsApp
- APIs externas con costo
- Servicios de IA/ML

---

### 5. Freemium

```typescript
pricing: {
  type: 'freemium',
  free: {
    limits: {
      notifications: 100,  // 100 notificaciones/mes gratis
      users: 5
    }
  },
  pro: {
    amount: 49,
    currency: 'USD',
    interval: 'month',
    limits: {
      notifications: 10000,
      users: null  // Ilimitado
    }
  }
}
```

---

## 🔒 Seguridad de Extensiones

### Sandboxing

Las extensiones corren en un entorno aislado:

```typescript
// Restricciones automáticas:
- No pueden acceder directamente a la base de datos
- Solo pueden usar APIs expuestas por el SDK
- No pueden ejecutar código nativo
- Timeouts automáticos (30s por request)
- Rate limiting por constructora
- Memory limits (512 MB por extensión)
```

### Permisos Granulares

```typescript
permissions: [
  'projects.read',       // Leer proyectos
  'projects.write',      // Crear/editar proyectos
  'budgets.read',
  'users.read',
  'notifications.send',
  'files.upload',
  'webhooks.create'
]
```

**La constructora debe aprobar los permisos al instalar la extensión.**

### Audit Logging

Todas las acciones de extensiones se registran:

```typescript
await this.context.audit.log({
  action: 'extension.data_accessed',
  extension: 'whatsapp-notifier',
  resource: 'projects',
  resourceId: 'proj-123',
  details: { action: 'read' }
});
```

---

## 📊 Analytics para Desarrolladores

Dashboard de métricas de tu extensión:

```
┌─────────────────────────────────────────────────┐
│  WhatsApp Notifier - Analytics                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Instalaciones                              │
│  Total: 234 tenants                             │
│  Activos: 198 (84.6%)                          │
│  Trial: 28 (12%)                                │
│  Cancelados: 8 (3.4%)                          │
│                                                 │
│  💰 Revenue (MRR)                              │
│  $0 (extensión gratuita)                        │
│                                                 │
│  ⭐ Ratings                                     │
│  Promedio: 4.7/5.0 (89 reviews)                │
│                                                 │
│  📈 Uso                                         │
│  Notificaciones enviadas (30 días): 45,678     │
│  Promedio por tenant: 230/mes                   │
│                                                 │
│  🐛 Errores (últimos 7 días)                   │
│  Total: 12 (0.026% error rate)                 │
│  Por tipo:                                      │
│    - API timeout: 8                             │
│    - Invalid phone: 3                           │
│    - Rate limit: 1                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Casos de Éxito

### Ejemplo 1: SAP Connector (Partner Oficial)

**Desarrollador:** SAP Integration Partners
**Tipo:** Integración
**Pricing:** $99/mes
**Instalaciones:** 45 tenants enterprise
**MRR:** $4,455

**Descripción:**
Conecta el ERP de construcción con SAP S/4HANA para sincronizar pólizas contables, cuentas por pagar/cobrar y datos maestros.

**Features:**
- Sincronización bidireccional automática
- Mapping personalizable de cuentas
- Logs de sincronización
- Soporte 24/7

---

### Ejemplo 2: Reporte INFONAVIT (Comunidad)

**Desarrollador:** Juan Pérez (independiente)
**Tipo:** Reporte custom
**Pricing:** $49 (one-time)
**Ventas:** 127 instalaciones
**Revenue total:** $6,223

**Descripción:**
Genera el reporte oficial de INFONAVIT en formato EVC actualizado 2025, con todos los campos requeridos pre-llenados desde los datos del sistema.

---

### Ejemplo 3: Módulo Obra Civil (Partner Certificado)

**Desarrollador:** CivilTech Solutions
**Tipo:** Módulo vertical
**Pricing:** $299/mes
**Instalaciones:** 12 tenants
**MRR:** $3,588

**Descripción:**
Módulo especializado para constructoras de obra civil pesada (puentes, carreteras, presas) con funcionalidad específica de control de acarreos, laboratorio de suelos, y reportes para SCT.

---

## 🚀 Roadmap del SDK

**Q1 2026:**
- ✅ SDK v2.0 con TypeScript full support
- ✅ Webhooks mejorados (retry exponential backoff)
- ✅ GraphQL API (además de REST)

**Q2 2026:**
- 📋 Mobile SDK (React Native components)
- 📋 Extension templates (quickstart)
- 📋 CLI tool mejorado

**Q3 2026:**
- 📋 Serverless functions (AWS Lambda integration)
- 📋 Real-time data subscriptions (WebSockets)
- 📋 AI/ML integration (TensorFlow.js)

---

## 📚 Recursos

**Documentación:**
- [SDK Reference](https://docs.erp-construccion.com/sdk)
- [API Reference](https://docs.erp-construccion.com/api)
- [Extension Examples](https://github.com/erp-construccion/extension-examples)
- [Best Practices](https://docs.erp-construccion.com/best-practices)

**Comunidad:**
- [Discord](https://discord.gg/erp-construccion)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/erp-construccion)
- [GitHub Discussions](https://github.com/erp-construccion/sdk/discussions)

**Soporte:**
- Email: developers@erp-construccion.com
- Office Hours: Viernes 10am-12pm PST (Zoom)

---

**Generado:** 2025-11-17
**SDK Versión:** 1.0.0
**Modelo:** SaaS Multi-tenant Marketplace
