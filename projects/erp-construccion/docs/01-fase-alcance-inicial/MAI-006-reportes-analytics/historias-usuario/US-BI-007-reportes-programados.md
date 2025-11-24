# US-BI-007: Reportes Programados y Suscripciones

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 22
**Story Points:** 5
**Prioridad:** Media
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Ejecutivo
**Quiero** recibir reportes automaticos por email en intervalos programados
**Para** tener informacion actualizada sin necesidad de buscarla manualmente en el sistema

---

## Criterios de Aceptacion

### 1. Catalogo de Reportes Disponibles
- [ ] Veo un catalogo de reportes predefinidos que puedo programar:
  - **Dashboard Ejecutivo Semanal:** Resumen de KPIs corporativos
  - **Reporte de Avances:** Progreso de todos los proyectos
  - **Analisis Financiero Mensual:** Costos, margenes y rentabilidad
  - **Estado de Compras:** Ordenes pendientes y entregas
  - **Reporte de Asistencias:** Resumen de RH semanal
  - **Alertas Criticas:** Proyectos en riesgo
  - **Proyeccion de Flujo:** Forecast financiero mensual
  - **Cumplimiento de Calidad:** Checklist y no conformidades
- [ ] Cada reporte muestra:
  - Nombre y descripcion
  - Preview del contenido
  - Frecuencias recomendadas
  - Formatos disponibles (PDF, Excel, Email HTML)

### 2. Programar Reporte Automatico
- [ ] Puedo crear una suscripcion a cualquier reporte con:
  - **Nombre de la suscripcion:** Descriptivo
  - **Reporte:** Seleccion del catalogo
  - **Frecuencia:** Diaria, Semanal, Quincenal, Mensual, Trimestral, Custom
  - **Dia de envio:** Lunes, Martes, etc. o dia del mes (1-31)
  - **Hora de envio:** HH:MM (zona horaria configurada)
  - **Formato:** PDF, Excel, Email HTML, o Multiple
  - **Estado:** Activo / Pausado
- [ ] Puedo configurar parametros especificos del reporte:
  - Proyectos a incluir
  - Periodo de datos (ultima semana, mes, trimestre)
  - Filtros adicionales

### 3. Destinatarios y Distribucion
- [ ] Puedo definir destinatarios del reporte:
  - Seleccionar usuarios del sistema
  - Agregar emails externos
  - Usar grupos predefinidos (Direccion, Gerentes, Equipo Financiero)
  - Agregar CCs y BCCs
- [ ] Puedo configurar distribucion diferenciada:
  - Destinatarios principales (TO)
  - Copia (CC)
  - Copia oculta (BCC)
- [ ] Cada destinatario puede cancelar su suscripcion individualmente

### 4. Templates de Email Personalizables
- [ ] Puedo personalizar el email que acompana al reporte:
  - **Asunto:** Con variables dinamicas (proyecto, fecha, etc.)
  - **Cuerpo:** Editor HTML con variables
  - **Logo:** Subir logo corporativo
  - **Firma:** Personalizada
  - **Disclaimer:** Texto legal o confidencialidad
- [ ] Variables disponibles:
  - `{{fecha}}` - Fecha del reporte
  - `{{proyecto}}` - Nombre del proyecto
  - `{{periodo}}` - Periodo reportado
  - `{{destinatario}}` - Nombre del destinatario
  - `{{kpi_principal}}` - KPI destacado del reporte

### 5. Preview y Envio de Prueba
- [ ] Puedo generar un preview del reporte antes de programarlo
- [ ] Puedo enviar un email de prueba a mi correo
- [ ] El preview muestra:
  - Como se vera el email
  - Como se vera el archivo adjunto (PDF/Excel)
  - Tamano del archivo adjunto
- [ ] Puedo editar y volver a probar antes de activar

### 6. Historial de Envios
- [ ] Veo un historial completo de envios realizados:
  - Fecha y hora de envio
  - Reporte enviado
  - Destinatarios
  - Estado: Enviado, Fallo, Pendiente
  - Tamano del archivo
  - Errores si los hubo
- [ ] Puedo filtrar historial por:
  - Rango de fechas
  - Reporte
  - Estado
  - Destinatario
- [ ] Puedo reenviar un reporte del historial

### 7. Gestion de Suscripciones
- [ ] Veo una lista de todas mis suscripciones activas
- [ ] Para cada suscripcion puedo:
  - Pausar temporalmente
  - Reactivar
  - Editar configuracion
  - Eliminar
  - Ver proximo envio programado
  - Ver ultimo envio realizado
- [ ] Veo indicadores de estado:
  - Activa (proximo envio: fecha)
  - Pausada
  - Error (ultimo fallo: razon)

### 8. Notificaciones de Ejecucion
- [ ] Recibo notificacion cuando:
  - Un reporte es enviado exitosamente
  - Un envio falla con razon del error
  - Una suscripcion llega a su fecha de expiracion
- [ ] Las notificaciones se pueden configurar:
  - Solo errores
  - Todos los envios
  - Ninguna
- [ ] Puedo configurar notificaciones por:
  - Email
  - Dashboard del sistema
  - Ambos

### 9. Estadisticas de Suscripciones
- [ ] Veo estadisticas de mis suscripciones:
  - Total de suscripciones activas
  - Reportes enviados este mes
  - Tasa de exito de envios
  - Promedio de destinatarios
  - Tamano total de archivos enviados
- [ ] Veo graficas de:
  - Envios por semana/mes
  - Reportes mas solicitados
  - Horarios de envio mas comunes

### 10. Expiracion y Limites
- [ ] Puedo configurar fecha de expiracion para suscripciones temporales
- [ ] El sistema tiene limites configurables:
  - Maximo 10 suscripciones activas por usuario
  - Maximo 50 destinatarios por reporte
  - Tamano maximo de archivo: 25 MB
  - No mas de 100 envios por dia (para evitar spam)
- [ ] Recibo alerta al acercarme a los limites

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📧 Reportes Programados y Suscripciones                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ Mis Suscripciones ───────────────────────────────┬─ Estadisticas ───┐   │
│ │                                                    │                  │   │
│ │ [+ Nueva Suscripcion] [📚 Catalogo] [📊 Stats]    │ Activas:    7    │   │
│ │                                                    │ Enviados:  142   │   │
│ │ ┌──────────────────────────────────────────────┐  │ Exito:    98.5%  │   │
│ │ │🟢 Dashboard Ejecutivo Semanal                │  │                  │   │
│ │ │   Frecuencia: Lunes 08:00                    │  └──────────────────┘   │
│ │ │   Formato: PDF + Email HTML                  │                         │
│ │ │   Destinatarios: 8 (Direccion General)       │                         │
│ │ │   Proximo envio: 20/11/2025 08:00            │                         │
│ │ │   Ultimo envio: 13/11/2025 ✅                │                         │
│ │ │   [⏸️ Pausar] [✏️ Editar] [📧 Prueba] [🗑️]    │                         │
│ │ └──────────────────────────────────────────────┘                         │
│ │                                                                           │
│ │ ┌──────────────────────────────────────────────┐                         │
│ │ │🟢 Analisis Financiero Mensual                │                         │
│ │ │   Frecuencia: Primer dia del mes, 06:00      │                         │
│ │ │   Formato: Excel                             │                         │
│ │ │   Destinatarios: 5 (Equipo Financiero)       │                         │
│ │ │   Proximo envio: 01/12/2025 06:00            │                         │
│ │ │   Ultimo envio: 01/11/2025 ✅                │                         │
│ │ │   [⏸️ Pausar] [✏️ Editar] [📧 Prueba] [🗑️]    │                         │
│ │ └──────────────────────────────────────────────┘                         │
│ │                                                                           │
│ │ ┌──────────────────────────────────────────────┐                         │
│ │ │⏸️ Reporte de Avances Quincenal               │                         │
│ │ │   Frecuencia: Dias 1 y 15, 18:00             │                         │
│ │ │   Formato: PDF                               │                         │
│ │ │   Destinatarios: 12 (Clientes externos)      │                         │
│ │ │   Estado: PAUSADA                            │                         │
│ │ │   Ultimo envio: 01/11/2025 ✅                │                         │
│ │ │   [▶️ Reactivar] [✏️ Editar] [📧 Prueba] [🗑️] │                         │
│ │ └──────────────────────────────────────────────┘                         │
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Nueva Suscripcion ───────────────────────────────────────────────────┐   │
│ │                                                                        │   │
│ │ 1️⃣ Seleccionar Reporte                                                │   │
│ │                                                                        │   │
│ │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │   │
│ │ │ 📊 Dashb.  │ │ 📈 Avances │ │ 💰 Financ. │ │ 🚨 Alertas │          │   │
│ │ │ Ejecutivo  │ │ Semanal    │ │ Mensual    │ │ Criticas   │          │   │
│ │ │            │ │            │ │            │ │            │          │   │
│ │ │ [Selec. ●] │ │ [Selec. ○] │ │ [Selec. ○] │ │ [Selec. ○] │          │   │
│ │ └────────────┘ └────────────┘ └────────────┘ └────────────┘          │   │
│ │                                                                        │   │
│ │ 2️⃣ Configurar Frecuencia                                              │   │
│ │                                                                        │   │
│ │ Nombre: [Dashboard Ejecutivo - Direccion______________]               │   │
│ │                                                                        │   │
│ │ Frecuencia: (●) Semanal  ( ) Mensual  ( ) Diaria  ( ) Custom         │   │
│ │                                                                        │   │
│ │ Dia de envio: [Lunes ▼]          Hora: [08:00 ▼]                     │   │
│ │                                                                        │   │
│ │ Formato: [✓] PDF  [✓] Email HTML  [ ] Excel                          │   │
│ │                                                                        │   │
│ │ 3️⃣ Configurar Destinatarios                                           │   │
│ │                                                                        │   │
│ │ ┌──────────────────────────────────────────────────────────────────┐  │   │
│ │ │ Destinatarios (TO):                                              │  │   │
│ │ │                                                                  │  │   │
│ │ │ 👤 Juan Perez (Director General)         [jperez@empresa.com]   │  │   │
│ │ │ 👤 Maria Garcia (CFO)                     [mgarcia@empresa.com]  │  │   │
│ │ │ 👥 [+ Agregar Grupo: Direccion General ▼]                        │  │   │
│ │ │ ✉️  [+ Agregar Email Externo]                                    │  │   │
│ │ │                                                                  │  │   │
│ │ │ CC: [ ] Gerentes de Proyecto                                     │  │   │
│ │ └──────────────────────────────────────────────────────────────────┘  │   │
│ │                                                                        │   │
│ │ 4️⃣ Personalizar Email (Opcional)                                     │   │
│ │                                                                        │   │
│ │ Asunto: [Dashboard Ejecutivo - Semana del {{fecha}}________________]  │   │
│ │                                                                        │   │
│ │ Cuerpo:                                                               │   │
│ │ ┌──────────────────────────────────────────────────────────────────┐  │   │
│ │ │ Estimado {{destinatario}},                                       │  │   │
│ │ │                                                                  │  │   │
│ │ │ Adjunto encontrara el Dashboard Ejecutivo correspondiente       │  │   │
│ │ │ a la semana del {{fecha}}.                                       │  │   │
│ │ │                                                                  │  │   │
│ │ │ Destacados:                                                      │  │   │
│ │ │ - KPI Principal: {{kpi_principal}}                               │  │   │
│ │ │ - Proyectos Activos: {{proyectos_activos}}                       │  │   │
│ │ │                                                                  │  │   │
│ │ │ Saludos,                                                         │  │   │
│ │ │ Sistema de Gestion de Proyectos                                  │  │   │
│ │ └──────────────────────────────────────────────────────────────────┘  │   │
│ │                                                                        │   │
│ │ [📧 Enviar Prueba] [👁️ Preview] [💾 Guardar] [❌ Cancelar]            │   │
│ └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│ ┌─ Historial de Envios (Ultimos 30 dias) ──────────────────────────────────┐│
│ │                                                                           ││
│ │ Filtros: [Todos los reportes ▼] [Estado: Todos ▼] [Buscar...]           ││
│ │                                                                           ││
│ │ ┌─────────────────────────────────────────────────────────────────────┐  ││
│ │ │Fecha       │Hora │Reporte           │Destinos│Estado │Tamaño│Accion│  ││
│ │ ├─────────────────────────────────────────────────────────────────────┤  ││
│ │ │18/11/2025  │08:00│Dashboard Ejecutivo│   8    │✅ OK  │2.3MB │[📧]  │  ││
│ │ │13/11/2025  │08:00│Dashboard Ejecutivo│   8    │✅ OK  │2.1MB │[📧]  │  ││
│ │ │06/11/2025  │08:00│Dashboard Ejecutivo│   8    │✅ OK  │2.0MB │[📧]  │  ││
│ │ │01/11/2025  │06:00│Analisis Financiero│   5    │✅ OK  │8.5MB │[📧]  │  ││
│ │ │28/10/2025  │18:00│Reporte de Avances │   12   │❌ Fail│  -   │[🔄]  │  ││
│ │ │            │     │Error: SMTP timeout│        │       │      │      │  ││
│ │ └─────────────────────────────────────────────────────────────────────┘  ││
│ │                                                                           ││
│ │ Mostrando 5 de 142 envios                                    [Ver mas →] ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. CREAR NUEVA SUSCRIPCION
   ↓
   Usuario → Reportes Programados → [+ Nueva Suscripcion]
   ↓
   Paso 1: Seleccionar reporte del catalogo
   - Usuario elige "Dashboard Ejecutivo"
   ↓
   Paso 2: Configurar frecuencia
   - Frecuencia: Semanal
   - Dia: Lunes
   - Hora: 08:00
   - Formato: PDF + Email HTML
   ↓
   Paso 3: Configurar destinatarios
   - TO: Grupo "Direccion General" (8 personas)
   - CC: (ninguno)
   ↓
   Paso 4: Personalizar email
   - Asunto: "Dashboard Ejecutivo - Semana del {{fecha}}"
   - Cuerpo: Mensaje personalizado con variables
   ↓
   Usuario hace clic en [Enviar Prueba]
   ↓
   Sistema genera reporte y envia a email del usuario
   ↓
   Usuario revisa email de prueba
   ↓
   Usuario hace clic en [💾 Guardar]
   ↓
   Suscripcion creada y activada
   ↓
   Sistema programa job para proximo lunes 08:00

2. EJECUCION AUTOMATICA DEL REPORTE
   ↓
   Scheduler: Lunes 08:00 AM
   ↓
   Sistema identifica suscripciones programadas para esta hora
   ↓
   Para cada suscripcion:
   - Extrae parametros (proyectos, periodo, etc.)
   - Genera reporte en formatos solicitados (PDF, HTML)
   - Prepara email con template personalizado
   - Reemplaza variables dinamicas
   - Adjunta archivos generados
   ↓
   Sistema envia emails a destinatarios
   ↓
   Registra resultado en historial:
   - Timestamp
   - Destinatarios
   - Estado (exito/fallo)
   - Tamano de archivo
   ↓
   Si hay fallo:
   - Registra error
   - Notifica al creador de la suscripcion
   - Reintenta 3 veces (con backoff exponencial)
   ↓
   Si exito:
   - Marca como enviado
   - Programa proximo envio

3. PAUSAR SUSCRIPCION TEMPORALMENTE
   ↓
   Usuario accede a "Mis Suscripciones"
   ↓
   Identifica "Reporte de Avances Quincenal"
   ↓
   Hace clic en [⏸️ Pausar]
   ↓
   Modal de confirmacion: "¿Por cuanto tiempo?"
   - ( ) Hasta que la reactive manualmente
   - (●) Hasta fecha especifica: [30/11/2025]
   ↓
   Usuario confirma
   ↓
   Sistema:
   - Cambia estado a "Pausada"
   - Cancela jobs programados
   - Registra fecha de reactivacion (si aplica)
   ↓
   El 30/11/2025 sistema reactiva automaticamente

4. REVISAR HISTORIAL DE ENVIOS
   ↓
   Usuario → Reportes Programados → Tab "Historial"
   ↓
   Ve tabla con todos los envios del mes
   ↓
   Filtra por "Dashboard Ejecutivo"
   ↓
   Ve 4 envios exitosos
   ↓
   Identifica un envio fallido (28/10/2025)
   ↓
   Hace clic en fila para ver detalles
   ↓
   Sistema muestra:
   - Error: "SMTP timeout - servidor de email no responde"
   - Intentos de reenvio: 3/3 (todos fallaron)
   - Timestamp de cada intento
   ↓
   Usuario hace clic en [🔄 Reenviar]
   ↓
   Sistema reintenta envio
   ↓
   Exito: Email enviado correctamente
   ↓
   Historial se actualiza

5. DESTINATARIO CANCELA SUSCRIPCION
   ↓
   Destinatario recibe email programado
   ↓
   Al final del email hay link: "Cancelar suscripcion"
   ↓
   Destinatario hace clic
   ↓
   Sistema abre pagina web:
   "¿Desea dejar de recibir 'Dashboard Ejecutivo Semanal'?"
   ↓
   Destinatario confirma
   ↓
   Sistema:
   - Remueve email de lista de destinatarios
   - Notifica al creador de la suscripcion
   - Registra cancelacion en log
   ↓
   Proximos envios ya no incluyen a ese destinatario
```

---

## Notas Tecnicas

### Modelo de Datos

```typescript
// Suscripcion a reporte
interface ReportSubscription {
  id: string;
  userId: string;               // Creador
  name: string;
  reportType: ReportType;
  frequency: Frequency;
  schedule: Schedule;
  formats: ReportFormat[];
  recipients: Recipients;
  emailTemplate: EmailTemplate;
  status: 'active' | 'paused' | 'expired';
  expirationDate?: Date;
  lastSent?: Date;
  nextSent?: Date;
  createdAt: Date;
  updatedAt: Date;
}

enum ReportType {
  EXECUTIVE_DASHBOARD = 'executive-dashboard',
  PROGRESS_REPORT = 'progress-report',
  FINANCIAL_ANALYSIS = 'financial-analysis',
  PURCHASE_STATUS = 'purchase-status',
  ATTENDANCE_SUMMARY = 'attendance-summary',
  CRITICAL_ALERTS = 'critical-alerts',
  CASHFLOW_PROJECTION = 'cashflow-projection',
  QUALITY_COMPLIANCE = 'quality-compliance'
}

interface Frequency {
  type: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';
  dayOfWeek?: number;        // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;       // 1-31
  customCron?: string;       // Expresion cron para custom
}

interface Schedule {
  hour: number;              // 0-23
  minute: number;            // 0-59
  timezone: string;          // 'America/Mexico_City'
}

enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  HTML_EMAIL = 'html-email'
}

interface Recipients {
  to: string[];              // Array de emails
  cc: string[];
  bcc: string[];
  groups: string[];          // IDs de grupos predefinidos
}

interface EmailTemplate {
  subject: string;           // Con variables: {{fecha}}
  body: string;              // HTML con variables
  logo?: string;             // URL o base64
  signature?: string;
  disclaimer?: string;
}

// Historial de envios
interface ReportDelivery {
  id: string;
  subscriptionId: string;
  reportType: ReportType;
  sentAt: Date;
  recipients: string[];
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  retryCount: number;
  fileSize: number;          // bytes
  formats: ReportFormat[];
}
```

### Sistema de Jobs Programados

```typescript
import cron from 'node-cron';
import { Queue, Worker } from 'bullmq';

// Cola de reportes
const reportQueue = new Queue('report-generation', {
  connection: redisConnection
});

// Worker para generar y enviar reportes
const reportWorker = new Worker('report-generation', async (job) => {
  const { subscriptionId, reportType, recipients, formats } = job.data;

  try {
    // 1. Generar reporte
    const reportData = await generateReport(reportType, job.data.params);

    // 2. Generar archivos en formatos solicitados
    const files = await Promise.all(
      formats.map(format => generateReportFile(reportData, format))
    );

    // 3. Preparar email
    const emailTemplate = await getEmailTemplate(subscriptionId);
    const emailContent = renderEmailTemplate(emailTemplate, reportData);

    // 4. Enviar emails
    await sendEmails(recipients, emailContent, files);

    // 5. Registrar exito
    await saveDeliveryRecord({
      subscriptionId,
      reportType,
      sentAt: new Date(),
      recipients,
      status: 'sent',
      fileSize: files.reduce((sum, f) => sum + f.size, 0),
      formats
    });

    // 6. Programar proximo envio
    await scheduleNextDelivery(subscriptionId);

    return { success: true };

  } catch (error) {
    // Registrar fallo
    await saveDeliveryRecord({
      subscriptionId,
      reportType,
      sentAt: new Date(),
      recipients,
      status: 'failed',
      error: error.message,
      retryCount: job.attemptsMade
    });

    // Reintentara automaticamente (BullMQ)
    throw error;
  }
}, {
  connection: redisConnection,
  concurrency: 5,
  limiter: {
    max: 100,              // Max 100 jobs
    duration: 3600000      // Por hora (evitar spam)
  }
});

// Scheduler principal (revisa cada minuto)
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const subscriptions = await getSubscriptionsDueNow(now);

  for (const sub of subscriptions) {
    // Agregar a cola
    await reportQueue.add('generate-report', {
      subscriptionId: sub.id,
      reportType: sub.reportType,
      recipients: sub.recipients,
      formats: sub.formats,
      params: sub.reportParams
    }, {
      attempts: 3,           // Reintentar 3 veces
      backoff: {
        type: 'exponential',
        delay: 60000         // 1 min, 2 min, 4 min
      },
      removeOnComplete: true,
      removeOnFail: false    // Mantener jobs fallidos para analisis
    });
  }
});

// Generar reporte segun tipo
async function generateReport(type: ReportType, params: any) {
  switch (type) {
    case ReportType.EXECUTIVE_DASHBOARD:
      return await generateExecutiveDashboard(params);

    case ReportType.FINANCIAL_ANALYSIS:
      return await generateFinancialAnalysis(params);

    case ReportType.PROGRESS_REPORT:
      return await generateProgressReport(params);

    // ... otros tipos
  }
}

// Generar archivo PDF
async function generatePDF(reportData: any): Promise<Buffer> {
  const puppeteer = require('puppeteer');

  const html = renderReportHTML(reportData);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm'
    }
  });

  await browser.close();

  return pdf;
}

// Generar archivo Excel
async function generateExcel(reportData: any): Promise<Buffer> {
  const ExcelJS = require('exceljs');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  // Agregar datos al worksheet
  worksheet.addRow(['Proyecto', 'Presupuesto', 'Avance', 'Margen']);
  reportData.projects.forEach(p => {
    worksheet.addRow([p.name, p.budget, p.progress, p.margin]);
  });

  // Aplicar estilos
  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

// Renderizar template de email
function renderEmailTemplate(template: EmailTemplate, data: any): string {
  let content = template.body;

  // Reemplazar variables
  content = content.replace(/{{fecha}}/g, formatDate(new Date()));
  content = content.replace(/{{destinatario}}/g, data.recipientName || 'Usuario');
  content = content.replace(/{{kpi_principal}}/g, data.mainKPI || 'N/A');
  // ... otras variables

  // Agregar logo, firma, disclaimer
  if (template.logo) {
    content = `<img src="${template.logo}" style="max-width: 200px;">` + content;
  }

  if (template.signature) {
    content += `<br><br>${template.signature}`;
  }

  if (template.disclaimer) {
    content += `<br><br><small style="color: #666;">${template.disclaimer}</small>`;
  }

  return content;
}
```

### Endpoints Necesarios

```typescript
// Suscripciones
POST   /api/report-subscriptions                   // Crear suscripcion
GET    /api/report-subscriptions                   // Listar mis suscripciones
GET    /api/report-subscriptions/:id               // Obtener suscripcion
PUT    /api/report-subscriptions/:id               // Actualizar
DELETE /api/report-subscriptions/:id               // Eliminar
POST   /api/report-subscriptions/:id/pause         // Pausar
POST   /api/report-subscriptions/:id/resume        // Reactivar
POST   /api/report-subscriptions/:id/test          // Enviar prueba

// Catalogo
GET    /api/report-templates                       // Listar reportes disponibles
GET    /api/report-templates/:type                 // Detalle de reporte

// Historial
GET    /api/report-deliveries                      // Historial de envios
GET    /api/report-deliveries/:id                  // Detalle de envio
POST   /api/report-deliveries/:id/resend           // Reenviar

// Cancelacion (publica, sin autenticacion)
POST   /api/report-subscriptions/unsubscribe       // Cancelar suscripcion
```

---

## Definicion de "Done"

- [ ] Catalogo de 8 reportes predefinidos disponibles
- [ ] CRUD completo de suscripciones
- [ ] Configuracion de frecuencia (diaria, semanal, mensual, custom)
- [ ] Gestion de destinatarios (usuarios, grupos, emails externos)
- [ ] Templates de email personalizables con variables
- [ ] Generacion de reportes en PDF y Excel
- [ ] Preview de reportes antes de programar
- [ ] Envio de prueba funcional
- [ ] Sistema de jobs con cron + BullMQ
- [ ] Historial de envios con filtros
- [ ] Capacidad de pausar/reactivar suscripciones
- [ ] Manejo de errores y reintentos (3 intentos)
- [ ] Notificaciones de exito/fallo
- [ ] Link de cancelacion en emails
- [ ] Limites configurables (10 suscripciones, 50 destinatarios)
- [ ] Estadisticas de suscripciones
- [ ] Tests de generacion de reportes
- [ ] Tests de envio de emails
- [ ] Documentacion de templates de email
- [ ] Validado con Ejecutivos

---

**Estimacion:** 5 Story Points
**Dependencias:** Requiere todos los modulos para datos de reportes
**Fecha:** 2025-11-18
