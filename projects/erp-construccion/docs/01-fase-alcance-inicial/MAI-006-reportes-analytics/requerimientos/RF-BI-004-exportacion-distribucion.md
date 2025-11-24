# RF-BI-004: Exportacion y Distribucion Automatizada

**Epica:** MAI-006 - Reportes y Business Intelligence
**Modulo:** Exportacion y Distribucion
**Responsable:** Product Owner
**Fecha:** 2025-11-17
**Version:** 1.0

---

## 1. Objetivo

Proporcionar un sistema robusto de exportacion y distribucion automatizada de reportes que permita programar entregas recurrentes, gestionar suscripciones de usuarios, exportar datos masivamente y integrarse con herramientas externas de Business Intelligence como Power BI, Tableau y Google Data Studio.

---

## 2. Casos de Uso

### CU-BI-015: Programacion de Reportes Recurrentes

**Actor:** Director General, CFO, Gerente de Proyecto
**Precondiciones:**
- Usuario con permisos de configuracion de reportes
- Reporte o dashboard configurado

**Flujo Principal:**

1. Usuario accede a modulo de programacion de reportes
2. Usuario selecciona reporte "Dashboard Ejecutivo Semanal"
3. Usuario hace clic en "Programar Entrega Automatica"
4. Sistema muestra formulario de configuracion:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Programar Reporte Automatico                         │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Reporte: [Dashboard Ejecutivo Semanal            ▼]  │
   │                                                       │
   │ ┌─ Frecuencia ────────────────────────────────────┐  │
   │ │                                                  │  │
   │ │ ○ Diaria                                         │  │
   │ │ ● Semanal                                        │  │
   │ │   Dia: [▼ Lunes        ]                         │  │
   │ │ ○ Quincenal                                      │  │
   │ │   Dias: [ ] 1  [ ] 15  del mes                   │  │
   │ │ ○ Mensual                                        │  │
   │ │   Dia: [▼ Primer dia del mes]                    │  │
   │ │ ○ Trimestral                                     │  │
   │ │ ○ Personalizada                                  │  │
   │ │   Expresion cron: [________________]             │  │
   │ └──────────────────────────────────────────────────┘  │
   │                                                       │
   │ Hora de Generacion: [08:00] AM                        │
   │ Zona Horaria: [America/Mexico_City            ▼]     │
   │                                                       │
   │ ┌─ Formato de Exportacion ────────────────────────┐  │
   │ │                                                  │  │
   │ │ Formato Principal: [▼ PDF                    ]   │  │
   │ │                                                  │  │
   │ │ ☑ Incluir tambien en Excel (.xlsx)              │  │
   │ │ ☐ Incluir tambien en PowerPoint (.pptx)         │  │
   │ │ ☐ Incluir tambien en CSV (datos raw)            │  │
   │ └──────────────────────────────────────────────────┘  │
   │                                                       │
   │ ┌─ Destinatarios ──────────────────────────────────┐  │
   │ │                                                  │  │
   │ │ Para: [director@constructora.com             ]   │  │
   │ │       [+ Agregar]                                │  │
   │ │                                                  │  │
   │ │ CC:   [cfo@constructora.com                  ]   │  │
   │ │       [gerencia@constructora.com             ]   │  │
   │ │       [+ Agregar]                                │  │
   │ │                                                  │  │
   │ │ ☑ Solo enviar si hay cambios significativos     │  │
   │ │   (variacion > 5% en metricas principales)       │  │
   │ └──────────────────────────────────────────────────┘  │
   │                                                       │
   │ ┌─ Contenido del Email ────────────────────────────┐  │
   │ │                                                  │  │
   │ │ Asunto:                                          │  │
   │ │ [Dashboard Ejecutivo - Semana {week_number}  ]   │  │
   │ │                                                  │  │
   │ │ Mensaje:                                         │  │
   │ │ ┌──────────────────────────────────────────────┐ │  │
   │ │ │Estimados colegas,                            │ │  │
   │ │ │                                              │ │  │
   │ │ │Adjunto encuentran el Dashboard Ejecutivo    │ │  │
   │ │ │correspondiente a la semana {week_number}.    │ │  │
   │ │ │                                              │ │  │
   │ │ │Metricas destacadas:                          │ │  │
   │ │ │- Proyectos Activos: {project_count}         │ │  │
   │ │ │- Avance Promedio: {avg_progress}%           │ │  │
   │ │ │- SPI Consolidado: {consolidated_spi}        │ │  │
   │ │ │                                              │ │  │
   │ │ │Saludos,                                      │ │  │
   │ │ │Sistema de Reportes                           │ │  │
   │ │ └──────────────────────────────────────────────┘ │  │
   │ │                                                  │  │
   │ │ Variables disponibles: {date}, {week_number},    │  │
   │ │ {project_count}, {avg_progress}, ...             │  │
   │ └──────────────────────────────────────────────────┘  │
   │                                                       │
   │ ┌─ Opciones Avanzadas ─────────────────────────────┐  │
   │ │                                                  │  │
   │ │ ☑ Aplicar filtros guardados: [Proyectos Activos] │  │
   │ │ ☑ Incluir comparativo vs periodo anterior        │  │
   │ │ ☐ Incluir tendencia (ultimos 6 periodos)         │  │
   │ │ ☑ Generar solo si todos los datos estan actuales│  │
   │ │ ☐ Comprimir archivos grandes (>10MB) en ZIP     │  │
   │ │                                                  │  │
   │ │ Fecha de inicio: [24/11/2025]                    │  │
   │ │ Fecha de fin: ○ Sin fin  ● Hasta [31/12/2026]   │  │
   │ └──────────────────────────────────────────────────┘  │
   │                                                       │
   │ ☑ Notificarme si falla la generacion del reporte    │  │
   │                                                       │
   │         [Cancelar]  [Probar Ahora]  [Programar]      │
   └──────────────────────────────────────────────────────┘
   ```
5. Usuario configura todos los parametros
6. Usuario hace clic en "Probar Ahora" para validar configuracion
7. Sistema genera reporte de prueba y lo envia al usuario
8. Usuario verifica reporte recibido
9. Usuario hace clic en "Programar"
10. Sistema crea job recurrente en scheduler
11. Sistema muestra confirmacion con proxima ejecucion:
    ```
    ✓ Reporte programado exitosamente

    Proxima ejecucion: Lunes 24/11/2025 08:00 AM
    Destinatarios: 3 personas
    Formato: PDF + Excel

    [Ver Calendario de Entregas] [Editar] [Desactivar]
    ```

**Flujo Alternativo - Modificar Programacion:**

1. Usuario accede a lista de reportes programados
2. Usuario ve tabla con programaciones activas:
   ```
   ┌────────────────────────────────────────────────────────────────┐
   │ Reportes Programados                          [+ Nuevo Reporte]│
   ├────────────────────────────────────────────────────────────────┤
   │                                                                 │
   │ Nombre                 │Frecuencia│Destinos│Estado │Acciones   │
   │────────────────────────┼──────────┼────────┼───────┼──────────│
   │ Dashboard Ejecutivo    │Semanal   │  3     │🟢 Activo│[Editar]│
   │ Semanal                │(Lunes)   │        │       │[Pausar] │
   │                        │          │        │       │[Eliminar]│
   │ Ultima ejecucion: 17/11/2025 08:00 - ✓ Exitoso              │
   │ Proxima ejecucion: 24/11/2025 08:00                           │
   │────────────────────────┼──────────┼────────┼───────┼──────────│
   │ Reporte de Costos      │Mensual   │  5     │🟢 Activo│[Editar]│
   │ Consolidado            │(Dia 1)   │        │       │[Pausar] │
   │                        │          │        │       │[Eliminar]│
   │ Ultima ejecucion: 01/11/2025 09:00 - ✓ Exitoso              │
   │ Proxima ejecucion: 01/12/2025 09:00                           │
   │────────────────────────┼──────────┼────────┼───────┼──────────│
   │ Flujo de Efectivo      │Quincenal │  2     │🟡 Pausado│[Editar]│
   │ Proyectado             │(1 y 15)  │        │       │[Activar]│
   │                        │          │        │       │[Eliminar]│
   │ Ultima ejecucion: 15/10/2025 10:00 - ✓ Exitoso              │
   │────────────────────────┼──────────┼────────┼───────┼──────────│
   │ Analisis de Riesgos IA │Semanal   │  4     │🔴 Error│[Editar]│
   │                        │(Viernes) │        │       │[Reintentar]│
   │                        │          │        │       │[Eliminar]│
   │ Ultima ejecucion: 15/11/2025 14:00 - ✗ Fallo               │
   │ Error: Timeout al generar predicciones                        │
   └────────────────────────────────────────────────────────────────┘
   ```
3. Usuario puede editar, pausar o eliminar programaciones

**Postcondiciones:**
- Job programado creado en sistema de scheduler
- Proximas ejecuciones calculadas correctamente
- Usuario recibe reportes en horarios configurados

---

### CU-BI-016: Suscripciones a Reportes

**Actor:** Gerente de Proyecto, Analista, Stakeholder
**Precondiciones:**
- Reportes disponibles para suscripcion
- Usuario autenticado

**Flujo Principal:**

1. Usuario accede a catalogo de reportes disponibles
2. Sistema muestra galeria de reportes con opcion de suscripcion:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Catalogo de Reportes                  [Mis Suscripciones]│
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Filtar por: [▼ Todos] [▼ Categoria] [🔍 Buscar...]  │
   │                                                       │
   │ ┌─────────────────────┐ ┌─────────────────────┐     │
   │ │ 📊 Dashboard        │ │ 💰 Reporte de       │     │
   │ │    Ejecutivo        │ │    Costos           │     │
   │ │                     │ │                     │     │
   │ │ Vista consolidada   │ │ Analisis detallado  │     │
   │ │ de todos los        │ │ de costos por       │     │
   │ │ proyectos           │ │ proyecto y partida  │     │
   │ │                     │ │                     │     │
   │ │ 🔔 152 suscriptores │ │ 🔔 98 suscriptores  │     │
   │ │                     │ │                     │     │
   │ │ [Suscribirse]       │ │ ✓ Suscrito          │     │
   │ │ [Vista Previa]      │ │ [Configurar]        │     │
   │ └─────────────────────┘ └─────────────────────┘     │
   │                                                       │
   │ ┌─────────────────────┐ ┌─────────────────────┐     │
   │ │ 📈 Analisis de      │ │ ⏱ Avance de         │     │
   │ │    Tendencias       │ │   Obra              │     │
   │ │                     │ │                     │     │
   │ │ Tendencias          │ │ Seguimiento de      │     │
   │ │ historicas y        │ │ avance fisico y     │     │
   │ │ proyecciones        │ │ financiero          │     │
   │ │                     │ │                     │     │
   │ │ 🔔 67 suscriptores  │ │ 🔔 203 suscriptores │     │
   │ │                     │ │                     │     │
   │ │ [Suscribirse]       │ │ [Suscribirse]       │     │
   │ │ [Vista Previa]      │ │ [Vista Previa]      │     │
   │ └─────────────────────┘ └─────────────────────┘     │
   └──────────────────────────────────────────────────────┘
   ```
3. Usuario hace clic en "Suscribirse" en "Analisis de Tendencias"
4. Sistema muestra opciones de suscripcion:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Suscripcion: Analisis de Tendencias                  │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ ┌─ Frecuencia de Entrega ──────────────────────────┐ │
   │ │                                                   │ │
   │ │ ○ Diaria (cada manana a las 7:00 AM)             │ │
   │ │ ● Semanal (Lunes a las 8:00 AM)                  │ │
   │ │ ○ Mensual (Primer dia del mes a las 9:00 AM)     │ │
   │ │ ○ Cuando haya cambios significativos             │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Formato Preferido ──────────────────────────────┐ │
   │ │                                                   │ │
   │ │ ● PDF (documento)                                │ │
   │ │ ○ Excel (datos y graficas)                       │ │
   │ │ ○ Email HTML (sin adjuntos)                      │ │
   │ │ ○ Link para visualizar online                    │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Filtros Personalizados ─────────────────────────┐ │
   │ │                                                   │ │
   │ │ Proyectos:                                        │ │
   │ │ ☑ Todos mis proyectos (8)                        │ │
   │ │ ☐ Solo proyectos que administro (3)              │ │
   │ │ ☐ Proyectos especificos: [▼ Seleccionar...]      │ │
   │ │                                                   │ │
   │ │ Periodo de analisis:                              │ │
   │ │ [▼ Ultimos 6 meses]                               │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Metodo de Entrega ──────────────────────────────┐ │
   │ │                                                   │ │
   │ │ ● Email: juan.perez@constructora.com             │ │
   │ │ ☐ Tambien notificar por:                         │ │
   │ │   ☐ Slack (#reportes-semanales)                  │ │
   │ │   ☐ Microsoft Teams (Canal Reportes)             │ │
   │ │   ☐ SMS (solo alertas criticas)                  │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ Proxima entrega: Lunes 24/11/2025 08:00 AM           │
   │                                                       │
   │ ☑ Notificarme si hay alertas criticas en el reporte │
   │                                                       │
   │            [Cancelar]  [Suscribirse]                 │
   └──────────────────────────────────────────────────────┘
   ```
5. Usuario configura preferencias de suscripcion
6. Usuario hace clic en "Suscribirse"
7. Sistema confirma suscripcion y muestra en "Mis Suscripciones"
8. Usuario recibe primer reporte en proxima entrega programada

**Flujo Alternativo - Gestionar Suscripciones:**

1. Usuario accede a "Mis Suscripciones"
2. Sistema muestra lista de suscripciones activas:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Mis Suscripciones                                     │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ ┌─ Dashboard Ejecutivo ────────────────────────────┐ │
   │ │ Frecuencia: Semanal (Lunes 8:00 AM)              │ │
   │ │ Formato: PDF                                      │ │
   │ │ Ultimo recibido: 17/11/2025 ✓                    │ │
   │ │ Proximo: 24/11/2025                               │ │
   │ │                                                   │ │
   │ │ [Modificar] [Pausar] [Cancelar Suscripcion]      │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Reporte de Costos ──────────────────────────────┐ │
   │ │ Frecuencia: Mensual (Dia 1, 9:00 AM)             │ │
   │ │ Formato: Excel                                    │ │
   │ │ Ultimo recibido: 01/11/2025 ✓                    │ │
   │ │ Proximo: 01/12/2025                               │ │
   │ │ Filtros: Solo Proyecto "Fracc. Del Valle"        │ │
   │ │                                                   │ │
   │ │ [Modificar] [Pausar] [Cancelar Suscripcion]      │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Analisis de Tendencias ─────────────────────────┐ │
   │ │ Frecuencia: Semanal (Lunes 8:00 AM)              │ │
   │ │ Formato: PDF                                      │ │
   │ │ Estado: 🟡 PAUSADO                                │ │
   │ │ Ultimo recibido: 03/11/2025 ✓                    │ │
   │ │                                                   │ │
   │ │ [Modificar] [Reactivar] [Cancelar Suscripcion]   │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │         [Explorar Mas Reportes]                      │
   └──────────────────────────────────────────────────────┘
   ```
3. Usuario puede modificar, pausar o cancelar suscripciones

**Postcondiciones:**
- Suscripcion registrada en sistema
- Usuario recibe reportes segun configuracion
- Historial de entregas registrado

---

### CU-BI-017: Exportacion Masiva de Datos

**Actor:** Analista de Datos, Director de TI, Auditor
**Precondiciones:**
- Usuario con permisos de exportacion masiva
- Datos disponibles en sistema

**Flujo Principal:**

1. Usuario accede a modulo de exportacion masiva
2. Sistema muestra wizard de exportacion:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Exportacion Masiva de Datos                   [1/4]  │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Paso 1: Seleccionar Datos                            │
   │                                                       │
   │ ┌─ Entidades a Exportar ───────────────────────────┐ │
   │ │                                                   │ │
   │ │ ☑ Proyectos                         (12 registros)│ │
   │ │ ☑ Presupuestos                     (348 partidas) │ │
   │ │ ☑ Estimaciones                      (96 estimaciones)│ │
   │ │ ☑ Ordenes de Compra                (1,245 OCs)    │ │
   │ │ ☑ Contratos                         (67 contratos)│ │
   │ │ ☐ Nomina                           (2,340 registros)│ │
   │ │ ☐ Asistencias                     (18,920 registros)│ │
   │ │ ☐ Inventario                        (456 items)   │ │
   │ │ ☑ Avances de Obra                  (1,024 mediciones)│ │
   │ │ ☐ Documentos (metadata only)       (3,567 docs)   │ │
   │ │                                                   │ │
   │ │ [Seleccionar Todos] [Deseleccionar Todos]         │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ Total estimado: ~8.5 MB de datos                     │
   │                                                       │
   │                      [Cancelar]  [Siguiente →]       │
   └──────────────────────────────────────────────────────┘
   ```
3. Usuario selecciona entidades a exportar
4. Usuario hace clic en "Siguiente"
5. Sistema muestra paso 2 - Filtros:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Exportacion Masiva de Datos                   [2/4]  │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Paso 2: Aplicar Filtros                              │
   │                                                       │
   │ ┌─ Rango de Fechas ────────────────────────────────┐ │
   │ │                                                   │ │
   │ │ Desde: [01/01/2025]  Hasta: [17/11/2025]         │ │
   │ │                                                   │ │
   │ │ ○ Todo el historico                               │ │
   │ │ ● Rango personalizado                             │ │
   │ │ ○ Ultimo ano                                      │ │
   │ │ ○ Ultimos 6 meses                                 │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Filtros por Proyecto ───────────────────────────┐ │
   │ │                                                   │ │
   │ │ ● Todos los proyectos (12)                       │ │
   │ │ ○ Proyectos seleccionados:                        │ │
   │ │   [▼ Seleccionar proyectos...]                    │ │
   │ │ ○ Proyectos por criterio:                         │ │
   │ │   Estado: [▼ Todos]                               │ │
   │ │   Tipo: [▼ Todos]                                 │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Opciones Avanzadas ─────────────────────────────┐ │
   │ │                                                   │ │
   │ │ ☑ Incluir registros eliminados (soft-deleted)    │ │
   │ │ ☑ Incluir datos de auditoria (quien/cuando)      │ │
   │ │ ☐ Solo registros modificados en rango de fechas  │ │
   │ │ ☑ Incluir relaciones (foreign keys)              │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ Registros filtrados: ~7,245                          │
   │                                                       │
   │                [← Anterior]  [Siguiente →]           │
   └──────────────────────────────────────────────────────┘
   ```
6. Usuario configura filtros
7. Usuario hace clic en "Siguiente"
8. Sistema muestra paso 3 - Formato:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Exportacion Masiva de Datos                   [3/4]  │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Paso 3: Configurar Formato                           │
   │                                                       │
   │ ┌─ Formato de Archivo ─────────────────────────────┐ │
   │ │                                                   │ │
   │ │ ● Excel (.xlsx)                                  │ │
   │ │   ☑ Hoja separada por entidad                    │ │
   │ │   ☑ Incluir formato (colores, bordes)            │ │
   │ │   ☐ Proteger con contrasena: [__________]        │ │
   │ │                                                   │ │
   │ │ ○ CSV (valores separados por coma)               │ │
   │ │   Separador: [▼ Coma (,)]                         │ │
   │ │   Encoding: [▼ UTF-8]                             │ │
   │ │   ☐ ZIP multiple files                            │ │
   │ │                                                   │ │
   │ │ ○ JSON (formato estructurado)                     │ │
   │ │   ☐ Pretty print (indentado)                      │ │
   │ │   ☑ Incluir metadata                              │ │
   │ │                                                   │ │
   │ │ ○ SQL (script de INSERT)                          │ │
   │ │   Database: [▼ PostgreSQL]                        │ │
   │ │   ☑ Incluir CREATE TABLE                          │ │
   │ │                                                   │ │
   │ │ ○ Parquet (columnar, para Big Data)              │ │
   │ │   Compresion: [▼ Snappy]                          │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Opciones de Exportacion ────────────────────────┐ │
   │ │                                                   │ │
   │ │ ☑ Incluir cabeceras de columna                   │ │
   │ │ ☑ Usar nombres descriptivos (vs IDs tecnicos)    │ │
   │ │ ☐ Anonimizar datos personales (GDPR)             │ │
   │ │ ☑ Comprimir archivo final (.zip)                 │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ Tamano estimado: ~6.2 MB comprimido                  │
   │                                                       │
   │                [← Anterior]  [Siguiente →]           │
   └──────────────────────────────────────────────────────┘
   ```
9. Usuario selecciona formato Excel
10. Usuario hace clic en "Siguiente"
11. Sistema muestra paso 4 - Confirmacion:
    ```
    ┌──────────────────────────────────────────────────────┐
    │ Exportacion Masiva de Datos                   [4/4]  │
    ├──────────────────────────────────────────────────────┤
    │                                                       │
    │ Paso 4: Confirmar y Exportar                         │
    │                                                       │
    │ ┌─ Resumen ────────────────────────────────────────┐ │
    │ │                                                   │ │
    │ │ Entidades: 6 seleccionadas                        │ │
    │ │ • Proyectos (12)                                  │ │
    │ │ • Presupuestos (348)                              │ │
    │ │ • Estimaciones (96)                               │ │
    │ │ • Ordenes de Compra (1,245)                       │ │
    │ │ • Contratos (67)                                  │ │
    │ │ • Avances de Obra (1,024)                         │ │
    │ │                                                   │ │
    │ │ Periodo: 01/01/2025 - 17/11/2025                  │ │
    │ │ Formato: Excel (.xlsx) comprimido                 │ │
    │ │ Tamano estimado: ~6.2 MB                          │ │
    │ │ Tiempo estimado: 45-60 segundos                   │ │
    │ └───────────────────────────────────────────────────┘ │
    │                                                       │
    │ ┌─ Metodo de Entrega ──────────────────────────────┐ │
    │ │                                                   │ │
    │ │ ● Descarga directa                                │ │
    │ │   (archivo estara listo en 1 minuto)              │ │
    │ │                                                   │ │
    │ │ ○ Enviar por email                                │ │
    │ │   Email: [analista@constructora.com]             │ │
    │ │                                                   │ │
    │ │ ○ Guardar en servidor                             │ │
    │ │   Ruta: [/exports/data_export_{date}.xlsx]        │ │
    │ └───────────────────────────────────────────────────┘ │
    │                                                       │
    │ Nombre de archivo:                                   │
    │ [exportacion_masiva_2025-11-17.xlsx            ]     │
    │                                                       │
    │ ☑ Registrar en log de auditoria                     │
    │ ☑ Notificarme cuando la exportacion este lista      │
    │                                                       │
    │            [← Anterior]  [Iniciar Exportacion]       │
    └──────────────────────────────────────────────────────┘
    ```
12. Usuario hace clic en "Iniciar Exportacion"
13. Sistema muestra progreso:
    ```
    ┌──────────────────────────────────────────────────────┐
    │ Exportando Datos...                                   │
    ├──────────────────────────────────────────────────────┤
    │                                                       │
    │ ████████████████░░░░░░░░░░░░░░░░░░  65%              │
    │                                                       │
    │ Procesando: Ordenes de Compra (850/1245)             │
    │                                                       │
    │ Tiempo transcurrido: 38s                             │
    │ Tiempo restante: ~22s                                │
    │                                                       │
    │              [Cancelar Exportacion]                  │
    └──────────────────────────────────────────────────────┘
    ```
14. Sistema completa exportacion y muestra descarga:
    ```
    ┌──────────────────────────────────────────────────────┐
    │ ✓ Exportacion Completada                             │
    ├──────────────────────────────────────────────────────┤
    │                                                       │
    │ Archivo: exportacion_masiva_2025-11-17.xlsx.zip      │
    │ Tamano: 5.8 MB                                        │
    │ Registros exportados: 2,792                          │
    │ Tiempo total: 58 segundos                            │
    │                                                       │
    │         [📥 Descargar Archivo]                        │
    │                                                       │
    │ El archivo estara disponible para descarga           │
    │ durante las proximas 24 horas.                        │
    │                                                       │
    │ Contenido del archivo:                                │
    │ • Hoja "Proyectos" - 12 registros                    │
    │ • Hoja "Presupuestos" - 348 registros                │
    │ • Hoja "Estimaciones" - 96 registros                 │
    │ • Hoja "Ordenes_Compra" - 1,245 registros            │
    │ • Hoja "Contratos" - 67 registros                    │
    │ • Hoja "Avances_Obra" - 1,024 registros              │
    │ • Hoja "Metadata" - informacion de exportacion        │
    │                                                       │
    │          [Descargar]  [Nueva Exportacion]            │
    └──────────────────────────────────────────────────────┘
    ```

**Postcondiciones:**
- Datos exportados en formato solicitado
- Archivo disponible para descarga
- Registro en log de auditoria

---

### CU-BI-018: Integracion con BI Externo (Power BI, Tableau)

**Actor:** Analista de BI, Director de TI
**Precondiciones:**
- Usuario con permisos de configuracion de integraciones
- Credenciales de herramienta externa

**Flujo Principal:**

1. Usuario accede a modulo de integraciones
2. Sistema muestra conectores disponibles:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Integraciones con BI Externo                          │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Conectores Disponibles:                              │
   │                                                       │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
   │ │              │ │              │ │              │  │
   │ │  Power BI    │ │   Tableau    │ │ Google Data  │  │
   │ │              │ │              │ │   Studio     │  │
   │ │              │ │              │ │              │  │
   │ │ [Configurar] │ │ [Configurar] │ │ [Configurar] │  │
   │ └──────────────┘ └──────────────┘ └──────────────┘  │
   │                                                       │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
   │ │              │ │              │ │              │  │
   │ │   Looker     │ │   Qlik       │ │   Metabase   │  │
   │ │              │ │              │ │              │  │
   │ │              │ │              │ │              │  │
   │ │ [Configurar] │ │ [Configurar] │ │ [Configurar] │  │
   │ └──────────────┘ └──────────────┘ └──────────────┘  │
   │                                                       │
   │ ┌─ Integraciones Activas ──────────────────────────┐ │
   │ │                                                   │ │
   │ │ Power BI - Workspace "Construccion"              │ │
   │ │ Estado: 🟢 Conectado                              │ │
   │ │ Ultima sincronizacion: 17/11/2025 14:30          │ │
   │ │ Datasets: 3                                       │ │
   │ │ [Ver Detalles] [Sincronizar Ahora] [Editar]      │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │                   [+ Nueva Integracion]              │
   └──────────────────────────────────────────────────────┘
   ```
3. Usuario hace clic en "Configurar" en Tableau
4. Sistema muestra wizard de configuracion:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Configurar Integracion: Tableau                       │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ ┌─ Metodo de Conexion ─────────────────────────────┐ │
   │ │                                                   │ │
   │ │ ● API REST de Tableau Server                     │ │
   │ │ ○ Tableau Cloud (Online)                          │ │
   │ │ ○ Archivo Hyper (actualizacion manual)           │ │
   │ │ ○ Base de datos directa (Live Connection)        │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Credenciales de Tableau Server ─────────────────┐ │
   │ │                                                   │ │
   │ │ Server URL:                                       │ │
   │ │ [https://tableau.constructora.com             ]   │ │
   │ │                                                   │ │
   │ │ Autenticacion:                                    │ │
   │ │ ● Token de Acceso Personal (PAT)                 │ │
   │ │ ○ Usuario/Contrasena                              │ │
   │ │                                                   │ │
   │ │ Token Name: [____________________________]        │ │
   │ │ Token Secret: [____________________________]      │ │
   │ │                                                   │ │
   │ │ Site: [Default]                                   │ │
   │ │                                                   │ │
   │ │            [Probar Conexion]                      │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Seleccionar Datasets ───────────────────────────┐ │
   │ │                                                   │ │
   │ │ ☑ Proyectos y KPIs                                │ │
   │ │   Tablas: projects, kpis, milestones              │ │
   │ │   Frecuencia: Cada 15 minutos                     │ │
   │ │                                                   │ │
   │ │ ☑ Costos y Presupuestos                           │ │
   │ │   Tablas: budgets, costs, estimates               │ │
   │ │   Frecuencia: Cada hora                           │ │
   │ │                                                   │ │
   │ │ ☐ Nomina y Recursos Humanos                       │ │
   │ │   Tablas: payroll, attendance, employees          │ │
   │ │   Frecuencia: Diaria                              │ │
   │ │                                                   │ │
   │ │ ☑ Avances de Obra                                 │ │
   │ │   Tablas: progress, work_breakdown                │ │
   │ │   Frecuencia: Cada 30 minutos                     │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Opciones de Sincronizacion ─────────────────────┐ │
   │ │                                                   │ │
   │ │ ● Incremental (solo cambios)                     │ │
   │ │ ○ Full Refresh (todo el dataset)                  │ │
   │ │                                                   │ │
   │ │ ☑ Habilitar sincronizacion automatica            │ │
   │ │ ☑ Notificar si sincronizacion falla              │ │
   │ │ ☐ Sincronizar solo en horario laboral            │ │
   │ │   (8:00 AM - 6:00 PM)                             │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │              [Cancelar]  [Guardar y Conectar]        │
   └──────────────────────────────────────────────────────┘
   ```
5. Usuario ingresa credenciales de Tableau
6. Usuario hace clic en "Probar Conexion"
7. Sistema valida credenciales exitosamente
8. Usuario selecciona datasets a sincronizar
9. Usuario hace clic en "Guardar y Conectar"
10. Sistema realiza sincronizacion inicial:
    ```
    ┌──────────────────────────────────────────────────────┐
    │ Sincronizacion Inicial con Tableau                   │
    ├──────────────────────────────────────────────────────┤
    │                                                       │
    │ ████████████████████████████░░░░  87%                │
    │                                                       │
    │ Sincronizando: Avances de Obra (890/1024 registros)  │
    │                                                       │
    │ Completado:                                          │
    │ ✓ Proyectos y KPIs (12 registros)                   │
    │ ✓ Costos y Presupuestos (1,593 registros)           │
    │ ⏳ Avances de Obra (en progreso...)                  │
    │                                                       │
    │ Tiempo transcurrido: 2m 15s                          │
    │                                                       │
    │              [Cancelar Sincronizacion]               │
    └──────────────────────────────────────────────────────┘
    ```
11. Sistema completa sincronizacion:
    ```
    ┌──────────────────────────────────────────────────────┐
    │ ✓ Integracion Configurada Exitosamente               │
    ├──────────────────────────────────────────────────────┤
    │                                                       │
    │ Tableau Server conectado correctamente               │
    │                                                       │
    │ Datasets sincronizados: 3                            │
    │ Registros totales: 2,629                             │
    │ Tiempo de sincronizacion: 2m 48s                     │
    │                                                       │
    │ Proxima sincronizacion:                              │
    │ • Proyectos y KPIs: 17/11/2025 14:45 (15 min)       │
    │ • Costos y Presupuestos: 17/11/2025 15:30 (1 hora)  │
    │ • Avances de Obra: 17/11/2025 15:00 (30 min)        │
    │                                                       │
    │ Enlaces utiles:                                      │
    │ • [Abrir Tableau Server]                             │
    │ • [Ver Documentacion de API]                         │
    │ • [Configurar Dashboards en Tableau]                 │
    │                                                       │
    │              [Cerrar]  [Ir a Integraciones]          │
    └──────────────────────────────────────────────────────┘
    ```

**Flujo Alternativo - Monitoreo de Sincronizacion:**

1. Usuario accede a detalles de integracion con Power BI
2. Sistema muestra dashboard de monitoreo:
   ```
   ┌──────────────────────────────────────────────────────┐
   │ Integracion: Power BI - Workspace "Construccion"      │
   ├──────────────────────────────────────────────────────┤
   │                                                       │
   │ Estado: 🟢 Activo                                     │
   │ Ultima sincronizacion: 17/11/2025 14:30 ✓            │
   │                                                       │
   │ ┌─ Datasets Sincronizados ─────────────────────────┐ │
   │ │                                                   │ │
   │ │ Dataset              │Registros│Frecuencia│Estado │ │
   │ │──────────────────────┼─────────┼──────────┼───────│ │
   │ │ Proyectos y KPIs     │   12    │ 15 min   │ ✓     │ │
   │ │ Costos Presupuestos  │ 1,593   │ 1 hora   │ ✓     │ │
   │ │ Avances de Obra      │ 1,024   │ 30 min   │ ✓     │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Historial de Sincronizaciones (ultimas 24h) ───┐ │
   │ │                                                   │ │
   │ │ Fecha/Hora       │Dataset          │Resultado     │ │
   │ │──────────────────┼─────────────────┼──────────────│ │
   │ │ 17/11 14:30      │Proyectos y KPIs │✓ Exitoso (8s)│ │
   │ │ 17/11 14:15      │Proyectos y KPIs │✓ Exitoso (7s)│ │
   │ │ 17/11 14:00      │Avances de Obra  │✓ Exitoso (32s)│ │
   │ │ 17/11 13:45      │Proyectos y KPIs │✓ Exitoso (9s)│ │
   │ │ 17/11 13:30      │Costos Presup.   │✓ Exitoso (45s)│ │
   │ │ 17/11 13:30      │Avances de Obra  │✗ Fallo       │ │
   │ │                  │                 │  (Timeout)   │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ ┌─ Estadisticas ───────────────────────────────────┐ │
   │ │                                                   │ │
   │ │ Sincronizaciones (24h):      96                   │ │
   │ │ Exitosas:                    94 (97.9%)          │ │
   │ │ Fallidas:                    2 (2.1%)            │ │
   │ │ Tiempo promedio:             18 segundos          │ │
   │ │ Datos transferidos (24h):    127 MB              │ │
   │ └───────────────────────────────────────────────────┘ │
   │                                                       │
   │ [Sincronizar Ahora] [Editar Config] [Desconectar]    │
   └──────────────────────────────────────────────────────┘
   ```

**Postcondiciones:**
- Integracion configurada y activa
- Datos sincronizandose automaticamente
- Dashboards de Tableau/Power BI alimentados con datos actualizados

---

## 3. Requerimientos Funcionales

### RF-BI-004.1: Programacion de Reportes Recurrentes
- El sistema DEBE permitir programar reportes con frecuencia: diaria, semanal, quincenal, mensual, trimestral, personalizada (cron)
- El sistema DEBE soportar multiples formatos simultaneos (PDF + Excel + CSV)
- El sistema DEBE permitir configurar destinatarios (To, CC, BCC)
- El sistema DEBE soportar plantillas de email con variables dinamicas
- El sistema DEBE permitir aplicar filtros guardados a reportes programados
- El sistema DEBE permitir definir condiciones de envio (ej: solo si hay cambios >5%)
- El sistema DEBE permitir configurar fecha de inicio y fin de programacion
- El sistema DEBE notificar si falla la generacion de reporte
- El sistema DEBE registrar historial de entregas (fecha, destinatarios, resultado)

### RF-BI-004.2: Gestion de Programaciones
- El sistema DEBE mostrar lista de reportes programados con estado
- El sistema DEBE permitir pausar/reactivar programaciones
- El sistema DEBE permitir editar configuracion de reportes activos
- El sistema DEBE permitir ejecutar reporte programado bajo demanda
- El sistema DEBE mostrar proxima fecha de ejecucion
- El sistema DEBE permitir duplicar programaciones existentes
- El sistema DEBE permitir eliminar programaciones con confirmacion

### RF-BI-004.3: Suscripciones de Usuarios
- El sistema DEBE proveer catalogo de reportes disponibles para suscripcion
- El sistema DEBE permitir a usuarios suscribirse a reportes
- El sistema DEBE permitir configurar frecuencia personalizada por suscripcion
- El sistema DEBE permitir configurar filtros personalizados por usuario
- El sistema DEBE permitir seleccionar formato preferido (PDF, Excel, HTML, link)
- El sistema DEBE permitir configurar metodo de entrega (email, Slack, Teams, SMS)
- El sistema DEBE permitir pausar temporalmente suscripciones
- El sistema DEBE permitir cancelar suscripciones en cualquier momento
- El sistema DEBE mostrar numero de suscriptores por reporte

### RF-BI-004.4: Exportacion Masiva de Datos
- El sistema DEBE ofrecer wizard paso a paso para exportacion masiva
- El sistema DEBE permitir seleccionar multiples entidades simultaneamente
- El sistema DEBE permitir aplicar filtros de fecha, proyecto, estado
- El sistema DEBE soportar formatos: Excel, CSV, JSON, SQL, Parquet
- El sistema DEBE estimar tamano de archivo antes de exportar
- El sistema DEBE mostrar progreso en tiempo real durante exportacion
- El sistema DEBE permitir comprimir archivos grandes (>10MB) automaticamente
- El sistema DEBE mantener archivos exportados disponibles 24-72 horas
- El sistema DEBE registrar exportaciones masivas en log de auditoria
- El sistema DEBE limitar tamano maximo de exportacion (ej: 100MB o 100K registros)

### RF-BI-004.5: Opciones de Formato de Exportacion
- El sistema DEBE generar Excel con hojas separadas por entidad
- El sistema DEBE incluir metadata en exportaciones (fecha, usuario, filtros)
- El sistema DEBE permitir proteger archivos Excel con contrasena
- El sistema DEBE permitir anonimizar datos personales (cumplimiento GDPR)
- El sistema DEBE usar nombres descriptivos de columnas (no solo IDs tecnicos)
- El sistema DEBE incluir cabeceras en CSV/Excel
- El sistema DEBE permitir configurar encoding (UTF-8, Latin1, etc.)
- El sistema DEBE generar SQL compatible con motor especificado (PostgreSQL, MySQL, etc.)

### RF-BI-004.6: Integracion con BI Externo
- El sistema DEBE proveer conectores para: Power BI, Tableau, Google Data Studio, Looker, Qlik, Metabase
- El sistema DEBE soportar autenticacion via API tokens, OAuth2, usuario/contrasena
- El sistema DEBE permitir configurar datasets a sincronizar
- El sistema DEBE permitir configurar frecuencia de sincronizacion por dataset
- El sistema DEBE soportar sincronizacion incremental (solo cambios)
- El sistema DEBE soportar sincronizacion completa (full refresh)
- El sistema DEBE validar credenciales antes de guardar configuracion
- El sistema DEBE realizar sincronizacion inicial al configurar integracion

### RF-BI-004.7: Monitoreo de Integraciones
- El sistema DEBE mostrar estado de integraciones (activo, error, pausado)
- El sistema DEBE mostrar ultima fecha de sincronizacion
- El sistema DEBE mostrar historial de sincronizaciones (ultimas 24-72h)
- El sistema DEBE calcular estadisticas: tasa de exito, tiempo promedio, datos transferidos
- El sistema DEBE notificar si sincronizacion falla
- El sistema DEBE reintentar automaticamente sincronizaciones fallidas (max 3 intentos)
- El sistema DEBE permitir sincronizacion manual bajo demanda
- El sistema DEBE permitir pausar/desconectar integraciones

### RF-BI-004.8: API REST para Datos
- El sistema DEBE exponer API REST para consulta de datos
- El sistema DEBE soportar autenticacion via API key o JWT
- El sistema DEBE implementar rate limiting (ej: 1000 req/hora)
- El sistema DEBE soportar paginacion en respuestas grandes
- El sistema DEBE soportar filtrado, ordenamiento y proyeccion de campos
- El sistema DEBE retornar datos en formato JSON por defecto
- El sistema DEBE proveer documentacion OpenAPI/Swagger

---

## 4. Modelo de Datos

```typescript
// Scheduled Report Job
interface ScheduledReport {
  id: string;
  reportId: string; // Dashboard or Report template
  name: string;
  description: string;

  schedule: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';
    dayOfWeek?: number; // 0-6 for weekly
    daysOfMonth?: number[]; // [1, 15] for biweekly
    time: string; // "HH:mm"
    timezone: string; // "America/Mexico_City"
    cronExpression?: string; // for custom
  };

  validity: {
    startDate: Date;
    endDate?: Date; // null = indefinite
  };

  formats: {
    primary: 'pdf' | 'xlsx' | 'pptx' | 'csv';
    additional: ('pdf' | 'xlsx' | 'pptx' | 'csv')[];
  };

  recipients: {
    to: string[]; // email addresses
    cc?: string[];
    bcc?: string[];
  };

  emailTemplate: {
    subject: string; // supports variables like {date}, {week_number}
    body: string;
    variables: Record<string, string>; // available variables
  };

  conditions: {
    onlyIfChanges?: boolean;
    changeThreshold?: number; // percentage
    onlyIfComplete?: boolean; // all data is up-to-date
  };

  filters?: Record<string, any>; // saved filter configuration

  options: {
    includeComparison?: boolean; // vs previous period
    includeTrend?: boolean; // last 6 periods
    compressIfLarge?: boolean; // ZIP if >10MB
  };

  status: 'active' | 'paused' | 'ended';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  // Execution tracking
  nextExecutionDate: Date;
  lastExecutionDate?: Date;
  lastExecutionStatus?: 'success' | 'failed';
  lastExecutionError?: string;
}

// Execution History
interface ReportExecution {
  id: string;
  scheduledReportId: string;
  executionDate: Date;
  status: 'pending' | 'processing' | 'success' | 'failed';

  generatedFiles: {
    format: string;
    filePath: string;
    fileSize: number;
  }[];

  recipients: string[];
  emailSent: boolean;
  emailSentAt?: Date;

  error?: string;
  processingTime: number; // milliseconds

  metadata: {
    recordCount: number;
    dataAsOf: Date; // latest data timestamp
    filtersApplied: Record<string, any>;
  };

  createdAt: Date;
}

// User Subscription
interface ReportSubscription {
  id: string;
  userId: string;
  reportId: string; // Dashboard or Report template

  frequency: 'daily' | 'weekly' | 'monthly' | 'on_change';
  deliveryTime?: string; // "HH:mm"
  dayOfWeek?: number;
  dayOfMonth?: number;

  format: 'pdf' | 'xlsx' | 'html' | 'link';

  deliveryMethod: {
    email: boolean;
    slack?: {
      enabled: boolean;
      channel: string;
    };
    teams?: {
      enabled: boolean;
      channel: string;
    };
    sms?: {
      enabled: boolean;
      phoneNumber: string;
      onlyCriticalAlerts: boolean;
    };
  };

  filters: Record<string, any>; // personalized filters

  options: {
    onlyIfChanges?: boolean;
    notifyOnCriticalAlerts?: boolean;
  };

  status: 'active' | 'paused';
  createdAt: Date;
  updatedAt: Date;

  lastDeliveryDate?: Date;
  deliveryCount: number;
}

// Bulk Export Job
interface BulkExportJob {
  id: string;
  name: string;
  description?: string;

  entities: {
    name: string; // 'projects', 'budgets', etc.
    tableName: string;
    recordCount: number;
  }[];

  filters: {
    dateRange?: { from: Date; to: Date };
    projectIds?: string[];
    includeDeleted?: boolean;
    includeAudit?: boolean;
    onlyModifiedInRange?: boolean;
  };

  format: 'xlsx' | 'csv' | 'json' | 'sql' | 'parquet';

  formatOptions: {
    // Excel options
    separateSheets?: boolean;
    includeFormatting?: boolean;
    password?: string;

    // CSV options
    delimiter?: ',' | ';' | '\t' | '|';
    encoding?: 'utf-8' | 'latin1' | 'utf-16';
    zipMultipleFiles?: boolean;

    // JSON options
    prettyPrint?: boolean;
    includeMetadata?: boolean;

    // SQL options
    targetDatabase?: 'postgresql' | 'mysql' | 'mssql';
    includeCreateTable?: boolean;

    // Parquet options
    compression?: 'snappy' | 'gzip' | 'lzo';
  };

  exportOptions: {
    includeHeaders?: boolean;
    useDescriptiveNames?: boolean;
    anonymizePersonalData?: boolean;
    compressFile?: boolean;
  };

  deliveryMethod: 'download' | 'email' | 'server';
  deliveryPath?: string;
  deliveryEmail?: string;

  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100

  result?: {
    filePath: string;
    fileSize: number;
    recordCount: number;
    processingTime: number; // milliseconds
    expiresAt: Date; // download availability
  };

  error?: string;

  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

// External BI Integration
interface BIIntegration {
  id: string;
  name: string;
  provider: 'powerbi' | 'tableau' | 'google_data_studio' | 'looker' | 'qlik' | 'metabase';

  connectionType: 'api' | 'database' | 'file';

  credentials: {
    // API connection
    serverUrl?: string;
    apiToken?: string;
    apiSecret?: string;
    oauth2?: {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
    };

    // Database connection
    connectionString?: string;

    // File-based
    filePath?: string;
  };

  datasets: {
    id: string;
    name: string;
    description: string;
    tables: string[]; // source tables
    syncFrequency: number; // minutes
    syncType: 'incremental' | 'full';
    lastSyncDate?: Date;
    lastSyncStatus?: 'success' | 'failed';
    recordCount?: number;
  }[];

  syncOptions: {
    autoSync: boolean;
    syncOnlyBusinessHours?: boolean;
    businessHours?: { start: string; end: string }; // "08:00", "18:00"
    notifyOnFailure: boolean;
    maxRetries: number;
  };

  status: 'active' | 'paused' | 'error';
  lastSyncDate?: Date;

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sync History
interface SyncHistory {
  id: string;
  integrationId: string;
  datasetId: string;

  syncDate: Date;
  status: 'success' | 'failed';

  recordsAdded: number;
  recordsUpdated: number;
  recordsDeleted: number;
  totalRecords: number;

  dataTransferred: number; // bytes
  processingTime: number; // milliseconds

  error?: string;

  createdAt: Date;
}

// API Access Token
interface APIToken {
  id: string;
  name: string;
  description?: string;

  token: string; // hashed
  userId: string;

  permissions: {
    resources: string[]; // ['projects', 'budgets', etc.]
    actions: ('read' | 'write' | 'delete')[];
  };

  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
  };

  usage: {
    lastUsedDate?: Date;
    totalRequests: number;
    requestsToday: number;
  };

  status: 'active' | 'revoked';

  expiresAt?: Date;
  createdAt: Date;
  revokedAt?: Date;
}
```

### SQL Schema

```sql
-- Scheduled Reports
CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES dashboards(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  schedule JSONB NOT NULL,
  validity JSONB NOT NULL,
  formats JSONB NOT NULL,
  recipients JSONB NOT NULL,
  email_template JSONB NOT NULL,
  conditions JSONB,
  filters JSONB,
  options JSONB,

  status VARCHAR(20) DEFAULT 'active',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  next_execution_date TIMESTAMP,
  last_execution_date TIMESTAMP,
  last_execution_status VARCHAR(20),
  last_execution_error TEXT,

  INDEX idx_scheduled_report_status (status),
  INDEX idx_scheduled_report_next_exec (next_execution_date)
);

-- Report Executions
CREATE TABLE report_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_report_id UUID NOT NULL REFERENCES scheduled_reports(id) ON DELETE CASCADE,
  execution_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',

  generated_files JSONB,
  recipients JSONB,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP,

  error TEXT,
  processing_time INTEGER, -- milliseconds
  metadata JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_report_exec_scheduled (scheduled_report_id),
  INDEX idx_report_exec_date (execution_date),
  INDEX idx_report_exec_status (status)
);

-- Report Subscriptions
CREATE TABLE report_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  report_id UUID NOT NULL REFERENCES dashboards(id),

  frequency VARCHAR(20) NOT NULL,
  delivery_time VARCHAR(5),
  day_of_week INTEGER,
  day_of_month INTEGER,

  format VARCHAR(10) NOT NULL,
  delivery_method JSONB NOT NULL,
  filters JSONB,
  options JSONB,

  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  last_delivery_date TIMESTAMP,
  delivery_count INTEGER DEFAULT 0,

  UNIQUE(user_id, report_id),
  INDEX idx_subscription_user (user_id),
  INDEX idx_subscription_report (report_id),
  INDEX idx_subscription_status (status)
);

-- Bulk Export Jobs
CREATE TABLE bulk_export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  entities JSONB NOT NULL,
  filters JSONB,
  format VARCHAR(10) NOT NULL,
  format_options JSONB,
  export_options JSONB,

  delivery_method VARCHAR(20) NOT NULL,
  delivery_path VARCHAR(500),
  delivery_email VARCHAR(255),

  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,

  result JSONB,
  error TEXT,

  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  INDEX idx_bulk_export_status (status),
  INDEX idx_bulk_export_creator (created_by),
  INDEX idx_bulk_export_created (created_at)
);

-- BI Integrations
CREATE TABLE bi_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,

  connection_type VARCHAR(20) NOT NULL,
  credentials JSONB NOT NULL,
  datasets JSONB NOT NULL,
  sync_options JSONB NOT NULL,

  status VARCHAR(20) DEFAULT 'active',
  last_sync_date TIMESTAMP,

  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_bi_integration_provider (provider),
  INDEX idx_bi_integration_status (status)
);

-- Sync History
CREATE TABLE sync_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES bi_integrations(id) ON DELETE CASCADE,
  dataset_id VARCHAR(255) NOT NULL,

  sync_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL,

  records_added INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_deleted INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,

  data_transferred BIGINT, -- bytes
  processing_time INTEGER, -- milliseconds

  error TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_sync_history_integration (integration_id),
  INDEX idx_sync_history_date (sync_date),
  INDEX idx_sync_history_status (status)
);

-- API Tokens
CREATE TABLE api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  token_hash VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id),

  permissions JSONB NOT NULL,
  rate_limit JSONB NOT NULL,
  usage JSONB DEFAULT '{"totalRequests": 0, "requestsToday": 0}',

  status VARCHAR(20) DEFAULT 'active',

  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP,

  INDEX idx_api_token_hash (token_hash),
  INDEX idx_api_token_user (user_id),
  INDEX idx_api_token_status (status)
);

-- API Request Log (para rate limiting y analytics)
CREATE TABLE api_request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES api_tokens(id),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,

  response_status INTEGER,
  response_time INTEGER, -- milliseconds

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_api_log_token (token_id),
  INDEX idx_api_log_created (created_at)
);

-- Particion por fecha para performance
CREATE TABLE api_request_log_y2025m11 PARTITION OF api_request_log
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

---

## 5. Criterios de Aceptacion

### Programacion de Reportes
- [ ] Reportes se generan y envian en horario configurado (±2 min)
- [ ] Expresiones cron personalizadas funcionan correctamente
- [ ] Variables en template de email se reemplazan correctamente
- [ ] Condiciones de envio (solo si cambios >5%) se evaluan correctamente
- [ ] Multiples formatos se generan y adjuntan en mismo email
- [ ] Notificaciones de falla se envian al creador del reporte
- [ ] Reportes con fecha de fin se desactivan automaticamente
- [ ] Job programado se puede ejecutar manualmente bajo demanda

### Suscripciones
- [ ] Catalogo muestra todos los reportes disponibles
- [ ] Suscripcion se crea correctamente con preferencias de usuario
- [ ] Filtros personalizados se aplican solo a ese usuario
- [ ] Integracion con Slack/Teams envia notificaciones correctamente
- [ ] Opcion "solo si hay cambios" evita envios innecesarios
- [ ] Pausar suscripcion detiene entregas temporalmente
- [ ] Cancelar suscripcion elimina configuracion y detiene entregas
- [ ] Numero de suscriptores se actualiza en tiempo real

### Exportacion Masiva
- [ ] Wizard de 4 pasos funciona sin errores
- [ ] Estimacion de tamano es precisa (±15%)
- [ ] Barra de progreso refleja avance real
- [ ] Exportacion se completa en <5 minutos para dataset tipico (50K registros)
- [ ] Archivos Excel tienen hojas separadas por entidad
- [ ] Metadata incluye fecha, usuario, filtros aplicados
- [ ] Compresion ZIP reduce tamano >50% en archivos grandes
- [ ] Archivos exportados se eliminan automaticamente despues de 24h
- [ ] Log de auditoria registra exportaciones masivas

### Integracion BI Externo
- [ ] Conectores para Power BI, Tableau, Google Data Studio funcionan
- [ ] Validacion de credenciales detecta errores antes de guardar
- [ ] Sincronizacion incremental solo transfiere cambios
- [ ] Sincronizacion se ejecuta segun frecuencia configurada (±2 min)
- [ ] Historial muestra ultimas 48h de sincronizaciones
- [ ] Estadisticas calculan tasa de exito, tiempo promedio correctamente
- [ ] Notificaciones se envian si sincronizacion falla
- [ ] Reintento automatico funciona (max 3 intentos con exponential backoff)
- [ ] Sincronizacion manual bajo demanda funciona inmediatamente

### API REST
- [ ] Autenticacion via API key funciona correctamente
- [ ] Rate limiting bloquea requests sobre limite (ej: 1000/hora)
- [ ] Paginacion funciona correctamente (parametros page, limit)
- [ ] Filtrado, ordenamiento, proyeccion de campos funcionan
- [ ] Respuestas JSON tienen formato consistente
- [ ] Documentacion Swagger esta actualizada y funcional
- [ ] Errores retornan codigos HTTP apropiados (400, 401, 403, 404, 429, 500)

---

## 6. Notas Tecnicas

### Implementacion de Scheduler para Reportes

```typescript
import cron from 'node-cron';
import { Queue, Worker } from 'bullmq';

class ReportScheduler {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('scheduled-reports', {
      connection: { host: 'redis', port: 6379 }
    });

    this.initializeScheduler();
    this.initializeWorker();
  }

  private async initializeScheduler() {
    // Run every minute to check for due reports
    cron.schedule('* * * * *', async () => {
      await this.checkDueReports();
    });
  }

  private async checkDueReports() {
    const now = new Date();

    const dueReports = await db.scheduledReports.findMany({
      where: {
        status: 'active',
        next_execution_date: {
          lte: now
        }
      }
    });

    for (const report of dueReports) {
      // Add to job queue
      await this.queue.add('generate-report', {
        scheduledReportId: report.id,
        reportId: report.report_id,
        formats: report.formats,
        recipients: report.recipients,
        filters: report.filters
      });

      // Calculate next execution
      const nextExecution = this.calculateNextExecution(report.schedule);
      await db.scheduledReports.update({
        where: { id: report.id },
        data: { next_execution_date: nextExecution }
      });
    }
  }

  private calculateNextExecution(schedule: any): Date {
    const now = new Date();

    switch (schedule.frequency) {
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(parseInt(schedule.time.split(':')[0]));
        tomorrow.setMinutes(parseInt(schedule.time.split(':')[1]));
        return tomorrow;

      case 'weekly':
        const nextWeek = new Date(now);
        const daysUntilNext = (schedule.dayOfWeek - now.getDay() + 7) % 7 || 7;
        nextWeek.setDate(nextWeek.getDate() + daysUntilNext);
        nextWeek.setHours(parseInt(schedule.time.split(':')[0]));
        nextWeek.setMinutes(parseInt(schedule.time.split(':')[1]));
        return nextWeek;

      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(schedule.dayOfMonth);
        nextMonth.setHours(parseInt(schedule.time.split(':')[0]));
        nextMonth.setMinutes(parseInt(schedule.time.split(':')[1]));
        return nextMonth;

      case 'custom':
        // Parse cron expression
        const cronParser = require('cron-parser');
        const interval = cronParser.parseExpression(schedule.cronExpression);
        return interval.next().toDate();

      default:
        throw new Error(`Unknown frequency: ${schedule.frequency}`);
    }
  }

  private initializeWorker() {
    const worker = new Worker('scheduled-reports', async (job) => {
      const { scheduledReportId, reportId, formats, recipients, filters } = job.data;

      try {
        // Create execution record
        const execution = await db.reportExecutions.create({
          data: {
            scheduled_report_id: scheduledReportId,
            execution_date: new Date(),
            status: 'processing',
            recipients
          }
        });

        // Generate report
        const startTime = Date.now();
        const files = await this.generateReportFiles(reportId, formats, filters);
        const processingTime = Date.now() - startTime;

        // Send email
        await this.sendReportEmail(recipients, files);

        // Update execution record
        await db.reportExecutions.update({
          where: { id: execution.id },
          data: {
            status: 'success',
            generated_files: files,
            email_sent: true,
            email_sent_at: new Date(),
            processing_time: processingTime
          }
        });

        // Update scheduled report
        await db.scheduledReports.update({
          where: { id: scheduledReportId },
          data: {
            last_execution_date: new Date(),
            last_execution_status: 'success'
          }
        });

      } catch (error) {
        // Update execution record with error
        await db.reportExecutions.update({
          where: { id: execution.id },
          data: {
            status: 'failed',
            error: error.message
          }
        });

        // Update scheduled report
        await db.scheduledReports.update({
          where: { id: scheduledReportId },
          data: {
            last_execution_date: new Date(),
            last_execution_status: 'failed',
            last_execution_error: error.message
          }
        });

        // Send failure notification
        const report = await db.scheduledReports.findUnique({
          where: { id: scheduledReportId }
        });
        await this.sendFailureNotification(report.created_by, error);
      }
    }, {
      connection: { host: 'redis', port: 6379 },
      concurrency: 5
    });
  }

  private async generateReportFiles(reportId: string, formats: any, filters: any) {
    const files = [];

    for (const format of [formats.primary, ...formats.additional]) {
      const exporter = this.getExporter(format);
      const filePath = await exporter.export(reportId, filters);

      files.push({
        format,
        filePath,
        fileSize: await this.getFileSize(filePath)
      });
    }

    return files;
  }

  private async sendReportEmail(recipients: any, files: any[]) {
    const attachments = files.map(f => ({
      filename: path.basename(f.filePath),
      path: f.filePath
    }));

    await emailService.send({
      to: recipients.to,
      cc: recipients.cc,
      bcc: recipients.bcc,
      subject: 'Dashboard Ejecutivo Semanal',
      html: '<p>Adjunto encuentra el reporte solicitado.</p>',
      attachments
    });
  }
}
```

### Implementacion de Sincronizacion con BI Externo

```typescript
import axios from 'axios';

class TableauSyncService {
  private baseUrl: string;
  private token: string;

  constructor(integration: BIIntegration) {
    this.baseUrl = integration.credentials.serverUrl;
    this.token = integration.credentials.apiToken;
  }

  async authenticate() {
    const response = await axios.post(`${this.baseUrl}/api/3.0/auth/signin`, {
      credentials: {
        personalAccessTokenName: this.token,
        personalAccessTokenSecret: this.tokenSecret,
        site: { contentUrl: this.site }
      }
    });

    this.authToken = response.data.credentials.token;
  }

  async syncDataset(dataset: any) {
    const syncStart = Date.now();

    try {
      // Extract data from source
      const data = await this.extractData(dataset.tables);

      // Transform to Tableau format
      const hyperFile = await this.createHyperFile(data);

      // Upload to Tableau Server
      await this.uploadHyperFile(dataset.id, hyperFile);

      // Refresh extract
      await this.refreshExtract(dataset.id);

      const syncTime = Date.now() - syncStart;

      // Record sync history
      await db.syncHistory.create({
        data: {
          integration_id: this.integrationId,
          dataset_id: dataset.id,
          sync_date: new Date(),
          status: 'success',
          total_records: data.length,
          processing_time: syncTime
        }
      });

      return { success: true, recordCount: data.length };

    } catch (error) {
      // Record failure
      await db.syncHistory.create({
        data: {
          integration_id: this.integrationId,
          dataset_id: dataset.id,
          sync_date: new Date(),
          status: 'failed',
          error: error.message
        }
      });

      throw error;
    }
  }

  private async extractData(tables: string[]) {
    const data = {};

    for (const table of tables) {
      data[table] = await db[table].findMany();
    }

    return data;
  }

  private async createHyperFile(data: any) {
    const { TableauHyperApi } = require('tableau-hyper-api');
    const hyperFile = '/tmp/data.hyper';

    // Create Hyper file and insert data
    // ... (implementation details)

    return hyperFile;
  }

  private async uploadHyperFile(datasetId: string, filePath: string) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    await axios.post(
      `${this.baseUrl}/api/3.0/sites/${this.siteId}/datasources/${datasetId}/data`,
      formData,
      {
        headers: {
          'X-Tableau-Auth': this.authToken,
          ...formData.getHeaders()
        }
      }
    );
  }

  private async refreshExtract(datasetId: string) {
    await axios.post(
      `${this.baseUrl}/api/3.0/sites/${this.siteId}/datasources/${datasetId}/refresh`,
      {},
      {
        headers: { 'X-Tableau-Auth': this.authToken }
      }
    );
  }
}
```

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo de Producto
**Version:** 1.0
**Estado:** Listo para Revision
