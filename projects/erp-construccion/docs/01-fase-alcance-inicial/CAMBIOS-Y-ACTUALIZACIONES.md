# Cambios y Actualizaciones - Fase 1 Ajustada

**Fecha:** 2025-11-17
**Versión:** 2.0.0
**Estado:** ✅ Completo - Listo para revisión

---

## 📢 Resumen de Cambios

Basado en el feedback del usuario sobre la importancia de **RRHH y asistencias** para obra, se realizaron los siguientes ajustes al roadmap inicial:

### Cambio Principal: RRHH Movido a Fase 1

**Antes:**
- Fase 1: 6 épicas | 14 semanas | $150,000 MXN | 280 SP
- RRHH estaba en Fase 2

**Después:**
- Fase 1: **7 épicas** | **16 semanas** | **$175,000 MXN** | **330 SP**
- RRHH incluido en Fase 1 como **épica MAI-006** (Prioridad P0)

---

## 🎯 Justificación del Cambio

### Por qué RRHH debe estar en Fase 1:

1. **Costeo de Mano de Obra es Crítico**
   - Necesario para calcular costos reales vs presupuesto
   - Sin RRHH, los reportes de costos están incompletos

2. **Cumplimiento Legal desde Día 1**
   - IMSS: Afiliación obligatoria desde el primer día de trabajo
   - INFONAVIT: Aportaciones patronales del 5% mensuales
   - Sanciones por incumplimiento son severas

3. **Control de Personal en Obra**
   - Asistencia biométrica evita "aviadores" (trabajadores fantasma)
   - GPS valida que el personal esté realmente en obra
   - Fundamental para productividad y seguridad

4. **Sinergia con App Móvil**
   - La app ya se usa para captura de avances (MAI-005)
   - Agregar asistencia biométrica aprovecha el mismo dispositivo
   - Residentes de obra usan 1 sola app para todo

---

## 📁 Documentación Generada (Nueva y Actualizada)

### Documentos Nuevos ⭐

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| **[ROADMAP-DETALLADO.md](./ROADMAP-DETALLADO.md)** | Roadmap completo con 11 sprints detallados | ~30 KB |
| **[MAI-007-rrhh-asistencias/_MAP.md](./MAI-007-rrhh-asistencias/_MAP.md)** | Épica completa de RRHH | ~15 KB |
| **[CAMBIOS-Y-ACTUALIZACIONES.md](./CAMBIOS-Y-ACTUALIZACIONES.md)** | Este documento | ~8 KB |

### Documentos Actualizados 🔄

| Archivo | Cambios |
|---------|---------|
| **[README.md](./README.md)** | Actualizado a 7 épicas, presupuesto $175K, 16 semanas |
| **[_MAP.md](./_MAP.md)** | Tabla de épicas actualizada, nuevo total de SP |
| **[RESUMEN-EJECUTIVO.md](./RESUMEN-EJECUTIVO.md)** | Pendiente de actualización |

---

## 🗓️ Roadmap Ajustado - Fase 1

### Sprints Overview

| Sprint | Semanas | Épica | Entregable Principal |
|--------|---------|-------|----------------------|
| **Sprint 0** | 1 | Migración | Infraestructura base desde GAMILIT |
| **Sprint 1** | 2-3 | MAI-001 | Autenticación + Multi-tenancy |
| **Sprint 2** | 4-5 | MAI-002 | Gestión de proyectos |
| **Sprint 3-4** | 6-8 | MAI-003 | Presupuestos y costos |
| **Sprint 5-6** | 9-10.5 | MAI-004 | Compras e inventarios |
| **Sprint 7-8** | 11-13 | MAI-005 | Control de obra + App móvil v1 |
| **Sprint 9-10** | 13.5-16 | **MAI-006 ⭐** | **RRHH + Asistencia biométrica + IMSS/INFONAVIT** |
| **Sprint 11** | 16-17 | MAI-007 | Reportes y analytics |

**Total:** 16 semanas | 11 sprints | $175,000 MXN

---

## 📱 Especificaciones de App Móvil (MAI-006)

### Funcionalidades Principales

#### 1. Asistencia con Biométrico ⭐⭐
**Métodos de registro:**
- **Huella dactilar** (react-native-biometrics)
- **Reconocimiento facial** (react-native-camera)
- **QR Code** (react-native-qrcode-scanner)
- **Lista manual** (fallback)

**Validaciones automáticas:**
- ✅ GPS: Empleado dentro del radio de la obra (100m)
- ✅ Horario: Dentro de jornada laboral (6am-8pm)
- ✅ Estado: Empleado activo y asignado a la obra
- ✅ Duplicados: No permitir doble check-in

#### 2. Modo Offline
- Base de datos local (expo-sqlite)
- Cola de hasta 500 registros
- Sincronización automática al reconectar
- Cache de empleados y templates biométricos

#### 3. Flujo de Usuario
```
1. Residente abre app
2. Selecciona obra activa
3. Modo "Check-in" o "Check-out"
4. Opciones:
   a) Escanear QR del empleado
   b) Buscar en lista
   c) Captura biométrica
5. Sistema valida (GPS, horario, estado)
6. Captura foto opcional
7. Registra asistencia (online o cola)
8. Confirmación con vibración/sonido
```

---

## 🔌 Integraciones Externas

### 1. IMSS (Instituto Mexicano del Seguro Social)

**API:** SOAP/REST
**Autenticación:** Certificado digital (.cer + .key)

**Funcionalidades:**
- Alta/baja/modificación de trabajadores
- Generación de archivos SUA (Sistema Único de Autodeterminación)
- Consulta de vigencia de derechos
- Cálculo de cuotas obrero-patronales

**Endpoints implementados:**
```
POST /api/imss/afiliacion/alta
POST /api/imss/afiliacion/baja
POST /api/imss/afiliacion/modificacion
POST /api/imss/sua/generar
GET  /api/imss/vigencia/:nss
```

---

### 2. INFONAVIT

**API:** REST
**Autenticación:** OAuth 2.0 + API Key

**Funcionalidades:**
- Registro patronal
- Cálculo de aportaciones (5% del salario base)
- Generación de archivo de pago
- Consulta de trabajadores acreditados (con crédito INFONAVIT)
- Descuentos de crédito

**Endpoints implementados:**
```
POST /api/infonavit/patron/registro
POST /api/infonavit/aportaciones/calcular
POST /api/infonavit/aportaciones/generar-archivo
GET  /api/infonavit/trabajadores/acreditados/:rfc
POST /api/infonavit/descuentos/aplicar
```

**Cálculo de aportación:**
```javascript
const aportacionMensual = salarioBaseCotizacion * diasTrabajados * 0.05;
```

---

## 📊 Comparación Antes vs Después

| Métrica | Versión 1.0 (Antes) | Versión 2.0 (Después) | Diferencia |
|---------|---------------------|----------------------|------------|
| **Épicas** | 6 | 7 | +1 (RRHH) |
| **Presupuesto** | $150,000 | $175,000 | +$25,000 |
| **Story Points** | 280 SP | 330 SP | +50 SP |
| **Duración** | 14 semanas | 16 semanas | +2 semanas |
| **Integraciones** | 0 | 2 (IMSS, INFONAVIT) | +2 |
| **App móvil features** | Avances + Incidencias | + Asistencia biométrica | +1 módulo |

---

## 🎯 Épicas de Fase 1 (Final)

| # | Épica | Nombre | SP | Presupuesto | Prioridad |
|---|-------|--------|----|-----------:|-----------|
| 1 | MAI-001 | Fundamentos | 50 | $25,000 | P0 - Crítico |
| 2 | MAI-002 | Proyectos y Estructura | 45 | $25,000 | P0 - Crítico |
| 3 | MAI-003 | Presupuestos y Costos | 50 | $25,000 | P1 - Alto |
| 4 | MAI-004 | Compras e Inventarios | 50 | $25,000 | P1 - Alto |
| 5 | MAI-005 | Control de Obra y Avances | 45 | $25,000 | P0 - Crítico |
| 6 | **MAI-006 ⭐** | **RRHH, Asistencias y Nómina** | **50** | **$25,000** | **P0 - Crítico** |
| 7 | MAI-007 | Reportes y Analytics | 40 | $25,000 | P1 - Alto |

**Total:** 330 SP | $175,000 MXN | 16 semanas

---

## 🚀 Hitos Críticos (Actualizados)

| Semana | Hito | Entregable |
|--------|------|------------|
| **Semana 1** | Sprint 0 completado | Infraestructura base migrada |
| **Semana 3** | MAI-001 completado | Auth + Multi-tenancy |
| **Semana 5** | MAI-002 completado | Gestión de proyectos |
| **Semana 8** | MAI-003 completado | Presupuestos y costos |
| **Semana 10.5** | MAI-004 completado | Compras e inventarios |
| **Semana 13** | MAI-005 completado | Control de obra + App móvil v1 |
| **Semana 16** | **MAI-006 completado ⭐** | **RRHH + Asistencia biométrica + IMSS/INFONAVIT** |
| **Semana 17** | MAI-007 completado | Reportes y analytics |
| **Semana 17** | **🎉 Fase 1 completa** | **Deploy a staging** |

---

## 📋 Stack Tecnológico de App Móvil

### Dependencias Principales

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "~50.0.0",
    "expo-sqlite": "~13.0.0",
    "expo-camera": "~14.0.0",
    "@react-native-community/geolocation": "^3.1.0",
    "react-native-biometrics": "^3.0.0",
    "react-native-qrcode-scanner": "^1.5.5",
    "react-native-maps": "^1.10.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

### Features de la App

| Feature | Biblioteca | Propósito |
|---------|-----------|-----------|
| **Biométrico (huella)** | react-native-biometrics | Autenticación y asistencia |
| **Biométrico (facial)** | expo-camera + ML | Reconocimiento facial |
| **QR Scanner** | react-native-qrcode-scanner | Escanear QR de empleados |
| **GPS** | @react-native-community/geolocation | Validar ubicación en obra |
| **Maps** | react-native-maps | Visualizar radio de obra |
| **Database Local** | expo-sqlite | Modo offline |
| **State Management** | Zustand | Estado global |
| **API Calls** | axios + react-query | Comunicación con backend |

---

## 🎓 Capacitación Adicional Requerida

### Para Equipo de Desarrollo

| Tema | Duración | Cuándo | Quién |
|------|----------|--------|-------|
| **React Native Fundamentals** | 8 horas | Sprint 7 | Mobile developer |
| **Biometrics en React Native** | 4 horas | Sprint 9 | Mobile developer |
| **Integración IMSS/INFONAVIT** | 4 horas | Sprint 9 | Backend lead |
| **Generación de archivos SUA** | 2 horas | Sprint 9 | Backend team |
| **Testing de app móvil** | 4 horas | Sprint 9 | QA engineer |

---

## 🚨 Riesgos Específicos de MAI-006

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Integración IMSS/INFONAVIT compleja** | Alta | Alto | Iniciar pruebas con sandbox desde Sprint 5 |
| **Certificados IMSS difíciles de obtener** | Media | Alto | Solicitar certificados al inicio del proyecto |
| **APIs gubernamentales inestables** | Media | Medio | Implementar retry logic y fallbacks |
| **Biométrico no funciona en todos devices** | Media | Medio | Fallback a QR + foto |
| **GPS impreciso en algunas obras** | Alta | Bajo | Radio amplio (100m), permitir override |
| **Sincronización offline falla** | Media | Alto | Cola persistente con retry automático |

---

## ✅ Checklist de Implementación MAI-006

### Backend
- [ ] CRUD de empleados, cuadrillas, oficios
- [ ] API de registro de asistencia
- [ ] Validaciones (GPS, horario, estado)
- [ ] Servicio de cálculo de costeo de mano de obra
- [ ] Integración IMSS (sandbox → producción)
- [ ] Integración INFONAVIT (sandbox → producción)
- [ ] Generación de archivos SUA
- [ ] Exportación de reportes

### App Móvil
- [ ] Login y autenticación
- [ ] Selector de obra
- [ ] Scanner QR
- [ ] Captura biométrica (huella)
- [ ] Captura biométrica (facial) - opcional
- [ ] GPS validation
- [ ] Base de datos local (SQLite)
- [ ] Cola de sincronización offline
- [ ] UI/UX optimizada para campo

### Frontend Web
- [ ] Gestión de empleados
- [ ] Dashboard de asistencias
- [ ] Reportes de costeo
- [ ] Exportación IMSS/INFONAVIT
- [ ] Logs de sincronización

### Database
- [ ] Schemas: hr, attendance, payroll
- [ ] Tablas de empleados, asistencia, costeo
- [ ] Funciones de cálculo
- [ ] Triggers de validación
- [ ] Índices optimizados

### Testing
- [ ] Unit tests >80% coverage
- [ ] E2E tests de flujo completo
- [ ] Integration tests con IMSS/INFONAVIT (sandbox)
- [ ] Tests de app móvil (offline, GPS, biométrico)

### Deployment
- [ ] Variables de entorno (API keys, certificados)
- [ ] Secrets management (certificados IMSS encrypted)
- [ ] Deploy de app a TestFlight (iOS)
- [ ] Deploy de app a Google Play (Android)
- [ ] Configuración de monitoreo
- [ ] Documentación de integración

---

## 📞 Próximos Pasos Inmediatos

### Esta Semana
- [ ] **Aprobar roadmap ajustado** (7 épicas, 16 semanas, $175K)
- [ ] Confirmar que RRHH en Fase 1 es correcto
- [ ] Validar presupuesto adicional de $25,000 MXN
- [ ] Revisar especificaciones de app móvil

### Próxima Semana
- [ ] Completar documentos RF, ET, US de MAI-006
- [ ] Iniciar gestión de certificados IMSS
- [ ] Solicitar acceso a APIs sandbox de IMSS/INFONAVIT
- [ ] Asignar mobile developer al equipo

### Sprint 0 (Semana 1)
- [ ] Setup de repositorio
- [ ] Migración de componentes GAMILIT
- [ ] Configurar proyecto de app móvil (React Native + Expo)

---

## 💡 Recomendaciones Finales

### Priorizar Integraciones IMSS/INFONAVIT
- **Iniciar gestión de certificados desde Sprint 1**
- Proceso puede tomar 2-4 semanas
- Solicitar acceso a sandboxes inmediatamente

### App Móvil Simplificada al Inicio
- **Sprint 7-8:** App con avances + incidencias (básico)
- **Sprint 9-10:** Agregar asistencia biométrica
- No intentar todo en un solo sprint

### Testing Exhaustivo de Modo Offline
- **Crítico:** La obra no siempre tiene buena conexión
- Probar escenarios:
  - 100+ registros en cola
  - Conflictos de sincronización
  - Batería baja del dispositivo

### UX Simple para Residentes
- **Target:** Residentes no son técnicos
- UI debe ser intuitiva, con iconos grandes
- Flujo de 3-4 taps máximo para registrar asistencia
- Confirmaciones visuales y hápticas

---

## 📊 Métricas de Éxito (Actualizadas)

| KPI | Target | Medición |
|-----|--------|----------|
| **Tiempo de desarrollo Fase 1** | ≤ 16 semanas | Tracking semanal |
| **Presupuesto Fase 1** | $175,000 ±5% | Tracking financiero |
| **Reducción vs desde cero** | ≥ 25% | Comparación post-mortem |
| **Código reutilizado de GAMILIT** | ≥ 50% | Análisis de código |
| **Coverage de tests** | ≥ 80% | CI/CD reports |
| **Bugs críticos en staging** | 0 | Issue tracker |
| **Integración IMSS funcionando** | ✅ | Tests de integración |
| **Integración INFONAVIT funcionando** | ✅ | Tests de integración |
| **App móvil en stores** | ✅ | TestFlight + Play Store |

---

## 📚 Documentos de Referencia

### Generados en esta sesión:
1. [ROADMAP-DETALLADO.md](./ROADMAP-DETALLADO.md) - Roadmap completo con 11 sprints
2. [MAI-007-rrhh-asistencias/_MAP.md](./MAI-007-rrhh-asistencias/_MAP.md) - Épica RRHH completa
3. [CAMBIOS-Y-ACTUALIZACIONES.md](./CAMBIOS-Y-ACTUALIZACIONES.md) - Este documento

### Actualizados:
1. [README.md](./README.md) - 7 épicas, $175K
2. [_MAP.md](./_MAP.md) - Tabla de épicas actualizada

### Pendientes de actualizar:
1. [RESUMEN-EJECUTIVO.md](./RESUMEN-EJECUTIVO.md) - Reflejar 7 épicas
2. [ANALISIS-REUTILIZACION-GAMILIT.md](./ANALISIS-REUTILIZACION-GAMILIT.md) - Agregar MAI-006

---

**Generado:** 2025-11-17
**Versión:** 2.0.0
**Autor:** Análisis Técnico
**Estado:** ✅ Completo - Listo para aprobación
**Próxima acción:** Aprobar roadmap y presupuesto ajustado
