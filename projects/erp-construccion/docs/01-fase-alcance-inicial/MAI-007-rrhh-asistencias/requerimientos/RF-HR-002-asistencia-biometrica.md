# RF-HR-002: Sistema de Asistencia con Biométrico

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RF-HR-002 |
| **Módulo** | RRHH y Asistencias |
| **Prioridad** | P0 - Crítica |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |

## 🔗 Referencias

### Especificación Técnica
📐 [ET-HR-002: Asistencia Biométrica Implementation](../especificaciones/ET-HR-002-asistencia-biometrica.md)

### Implementación
🗄️ **Database:**
- **Ubicación:** `apps/database/ddl/schemas/hr/tables/02-attendance_records.sql`
- **Tabla:** `hr.attendance_records`
- **ENUM:** `attendance_method` (biometric_fingerprint, biometric_facial, qr_code, manual, gps)

💻 **Backend:**
- **Módulo:** `apps/backend/src/modules/hr/attendance/`
- **Service:** `AttendanceService`, `BiometricService`
- **API:** `/api/hr/attendance`

📱 **App Móvil:**
- **Módulo:** `apps/mobile/src/features/attendance/`
- **Componentes:** Biometric scanner, QR scanner, GPS validator

### Reusado de GAMILIT
♻️ **Concepto similar:** Tracking de progreso de estudiantes
**Adaptación:** Alta - Funcionalidad completamente nueva con biométrico

---

## 📝 Descripción del Requerimiento

### Contexto

En proyectos de construcción, el control de asistencia del personal es **crítico** para:
- **Costeo real de mano de obra:** Saber exactamente qué días trabajó cada empleado
- **Cumplimiento legal:** IMSS requiere evidencia de días trabajados
- **Prevención de fraude:** Evitar "aviadores" (trabajadores que cobran sin trabajar)
- **Seguridad:** Saber quién está presente en obra (en caso de accidentes)
- **Productividad:** Relacionar avances con horas-hombre trabajadas

**Problemática actual (manual):**
- Listas en papel propensas a error y manipulación
- Imposible verificar ubicación del empleado
- Difícil auditar registros
- Tiempo perdido pasando lista cada mañana
- Riesgo de firmas falsas o doble registro

**Solución:**
Sistema de asistencia digital con **validación biométrica** (huella dactilar o facial) desde app móvil, con validaciones automáticas de GPS y horario.

---

## 🎯 Requerimientos Funcionales

### RF-HR-002.1: Métodos de Registro de Asistencia

El sistema **DEBE** soportar múltiples métodos de registro con la siguiente prioridad:

#### 1. Biométrico - Huella Dactilar (Método Preferido)
**Tecnología:** `react-native-biometrics`

**Proceso:**
1. Empleado coloca dedo en sensor del dispositivo móvil
2. App captura template biométrico
3. Compara con template almacenado en servidor (encriptado)
4. Si match >= 70%: Registro exitoso
5. Si match < 70%: Solicitar re-intento (max 3 intentos)

**Ventajas:**
- ✅ Rapidez: <3 segundos por registro
- ✅ Alta precisión (>99%)
- ✅ No requiere contacto adicional (device ya tiene sensor)
- ✅ Funciona offline (template en caché local)

**Desventajas:**
- ⚠️ No todos los dispositivos tienen sensor de huella
- ⚠️ Requiere enrollment previo (1ra vez)

---

#### 2. Biométrico - Reconocimiento Facial (Alternativa)
**Tecnología:** `expo-camera` + ML Kit / Vision API

**Proceso:**
1. Empleado mira a cámara frontal del dispositivo
2. App captura foto y extrae características faciales
3. Compara con foto almacenada en servidor
4. Si match >= 80%: Registro exitoso
5. Si match < 80%: Fallback a QR o manual

**Ventajas:**
- ✅ No requiere contacto físico
- ✅ Funciona en cualquier dispositivo con cámara frontal
- ✅ Buena precisión con buena iluminación

**Desventajas:**
- ⚠️ Requiere buena iluminación
- ⚠️ Puede fallar con cascos/lentes/cubrebocas
- ⚠️ Más lento que huella (~5-7 segundos)

---

#### 3. QR Code (Fallback Principal)
**Tecnología:** `react-native-qrcode-scanner`

**Proceso:**
1. Empleado muestra código QR personal (credencial o app propia)
2. Residente escanea con app
3. Sistema valida QR contra base de datos
4. Registro exitoso con foto opcional

**Ventajas:**
- ✅ Funciona en cualquier dispositivo con cámara
- ✅ Rápido (~2 segundos)
- ✅ No requiere enrollment previo

**Desventajas:**
- ⚠️ Requiere que empleado porte credencial
- ⚠️ QR puede ser falsificado (mitigado con foto adicional)

**Generación de QR:**
```
QR Content: {employeeId}|{constructoraId}|{hash}
Hash: HMAC-SHA256(employeeId + constructoraId + SECRET_KEY)
```

---

#### 4. Lista Manual (Fallback Secundario)
**Proceso:**
1. Residente busca empleado en lista
2. Selecciona nombre
3. Toma foto obligatoria del empleado
4. Confirma registro

**Ventajas:**
- ✅ Siempre funciona
- ✅ Útil para visitantes o personal temporal

**Desventajas:**
- ⚠️ Más lento (~10-15 segundos por persona)
- ⚠️ Requiere foto para validación

---

### RF-HR-002.2: Validaciones Automáticas

El sistema **DEBE** aplicar las siguientes validaciones en **tiempo real**:

#### 1. Validación de GPS (Geolocalización)
**Objetivo:** Verificar que el empleado esté físicamente en la obra

**Regla:**
```
IF distancia(ubicación_empleado, ubicación_obra) <= 100 metros
THEN validación_gps = PASS
ELSE validación_gps = WARNING (permitir override manual)
```

**Configuración:**
- Radio por defecto: 100 metros
- Radio configurable por obra (50m - 500m)
- Precisión mínima requerida del GPS: 20 metros

**Casos especiales:**
- **GPS desactivado:** Advertencia + Permitir registro con nota
- **GPS impreciso:** Advertencia + Permitir registro
- **Fuera de radio:** Advertencia + Requiere justificación del residente

**Implementación:**
```typescript
// Haversine formula para calcular distancia
function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distancia en metros
}
```

---

#### 2. Validación de Horario (Jornada Laboral)
**Objetivo:** Detectar registros fuera de horario normal

**Reglas:**
```
Horario normal: 6:00 AM - 8:00 PM (configurable)

IF hora_registro BETWEEN 6:00 AND 8:00
THEN validación_horario = PASS
ELSE validación_horario = WARNING (permitir registro con nota)
```

**Configuración por obra:**
- Horario de entrada permitido: 5:00 AM - 9:00 AM
- Horario de salida permitido: 3:00 PM - 9:00 PM
- Tolerancia de retraso: 15 minutos (sin penalización)

**Casos especiales:**
- **Hora extra:** Registro fuera de horario requiere autorización previa
- **Turno nocturno:** Validar contra horario de turno específico
- **Domingo/Festivo:** Advertencia + Confirmar con residente

---

#### 3. Validación de Estado del Empleado
**Objetivo:** Solo permitir registro de empleados activos y asignados

**Reglas:**
```sql
WHERE employee.status = 'active'
  AND employee.id IN (
    SELECT employee_id
    FROM project_employee_assignments
    WHERE project_id = {current_project_id}
      AND active = true
  )
```

**Estados de empleado:**
- `active`: Puede registrar asistencia
- `suspended`: No puede registrar (mensaje: "Empleado suspendido, contactar RRHH")
- `terminated`: No puede registrar (mensaje: "Empleado dado de baja")
- `inactive`: No puede registrar (mensaje: "Empleado inactivo")

---

#### 4. Validación de Duplicados
**Objetivo:** Prevenir doble check-in sin check-out previo

**Reglas:**
```
IF existe registro check-in del día SIN check-out
THEN bloquear nuevo check-in (mensaje: "Ya tienes un registro activo. Debes hacer check-out primero")
```

**Lógica:**
```sql
SELECT COUNT(*) FROM hr.attendance_records
WHERE employee_id = {employee_id}
  AND project_id = {project_id}
  AND date = CURRENT_DATE
  AND check_out_time IS NULL
  AND status = 'active'
```

---

### RF-HR-002.3: Tipos de Registro

#### 1. Check-in (Entrada)
**Cuándo:** Al iniciar jornada laboral

**Datos capturados:**
- Timestamp (fecha + hora)
- Método de registro (biometric_fingerprint, biometric_facial, qr_code, manual)
- GPS (latitud, longitud, precisión)
- Foto (opcional, obligatoria si es manual)
- Dispositivo usado (device_id)
- Residente que registró (user_id)

**Validaciones aplicadas:**
- ✅ GPS dentro de radio
- ✅ Horario de entrada permitido
- ✅ Empleado activo y asignado
- ✅ Sin check-in previo activo

---

#### 2. Check-out (Salida)
**Cuándo:** Al terminar jornada laboral

**Datos capturados:**
- Timestamp de salida
- GPS de salida
- Horas trabajadas (calculadas automáticamente)

**Validaciones aplicadas:**
- ✅ Existe check-in previo del día
- ✅ Tiempo mínimo trabajado: 1 hora (evitar registros erróneos)
- ✅ Horario de salida permitido

**Cálculo de horas trabajadas:**
```typescript
const horasTrabajadas = (checkOutTime - checkInTime) / (1000 * 60 * 60); // En horas
const horasRedondeadas = Math.round(horasTrabajadas * 4) / 4; // Redondear a cuartos de hora
```

---

### RF-HR-002.4: Modo Offline

**Requisito:** La app **DEBE** funcionar sin conexión a internet

**Capacidades offline:**
- ✅ Registrar hasta 500 asistencias en cola local
- ✅ Cache de lista de empleados de la obra (actualizado diariamente)
- ✅ Cache de templates biométricos (encriptados)
- ✅ Validaciones GPS y horario (usando hora local del dispositivo)
- ✅ Indicador visual de registros pendientes de sincronización

**Sincronización:**
```typescript
// Automática al detectar conexión
window.addEventListener('online', () => {
  syncPendingAttendances();
});

// Manual por botón
function syncNow() {
  if (navigator.onLine) {
    syncPendingAttendances();
  } else {
    showToast('Sin conexión. Sincronizará automáticamente al reconectar.');
  }
}
```

**Resolución de conflictos:**
- Si existe registro duplicado en servidor: Usar el de menor timestamp
- Si empleado fue dado de baja: Rechazar registro offline
- Log de conflictos para auditoría

---

### RF-HR-002.5: Seguridad y Privacidad

#### 1. Almacenamiento de Datos Biométricos
**Reglas:**
- ❌ **NUNCA** almacenar imagen de huella dactilar completa
- ✅ Almacenar solo template hash (irreversible)
- ✅ Templates encriptados en tránsito (HTTPS)
- ✅ Templates encriptados en reposo (AES-256)

**Formato de template:**
```typescript
interface BiometricTemplate {
  employeeId: string;
  templateHash: string; // SHA-256(template_raw)
  algorithm: 'FingerprintJS' | 'FaceNet';
  createdAt: Date;
  lastUsed: Date;
  encrypted: boolean;
}
```

---

#### 2. Consentimiento del Empleado
**Requisito:** Obtener consentimiento explícito antes de capturar biométricos

**Proceso:**
1. Al dar de alta empleado, mostrar aviso de privacidad
2. Empleado firma consentimiento digital
3. Consentimiento se almacena con timestamp y firma digital
4. Sin consentimiento: Solo métodos no biométricos (QR, manual)

**Texto de consentimiento (ejemplo):**
```
"Autorizo a [Constructora] a capturar y almacenar mis datos biométricos
(huella dactilar y/o reconocimiento facial) con el único propósito de
registrar mi asistencia laboral. Entiendo que estos datos están protegidos
conforme a la Ley Federal de Protección de Datos Personales en Posesión
de los Particulares."
```

---

#### 3. Retención de Datos
**Política:**
- Registros de asistencia: Retener 5 años (requerimiento fiscal)
- Templates biométricos: Eliminar a los 30 días de baja del empleado
- Fotos: Retener 1 año, luego eliminar automáticamente

---

### RF-HR-002.6: Reportes y Auditoría

#### 1. Reporte de Asistencias Diarias
**Contenido:**
- Lista de empleados con check-in/check-out del día
- Horas trabajadas
- Empleados faltantes (esperados pero sin registro)
- Anomalías (GPS fuera de radio, horario inusual)

**Formato:** PDF, Excel

---

#### 2. Reporte Mensual para Nómina
**Contenido:**
- Días trabajados por empleado
- Total de horas trabajadas
- Horas extra (fuera de horario normal)
- Faltas injustificadas

**Exportación:** Excel compatible con sistemas de nómina

---

#### 3. Log de Auditoría
**Registrar:**
- Todos los registros de asistencia
- Intentos fallidos de biométrico
- Overrides manuales de validaciones
- Cambios en configuración (radio GPS, horarios)
- Acceso a datos de asistencia

---

## ✅ Criterios de Aceptación

### AC-001: Métodos de Registro Funcionando
- [ ] Biométrico (huella) funciona en dispositivos compatibles
- [ ] Biométrico (facial) funciona como alternativa
- [ ] QR Code scanner funciona correctamente
- [ ] Registro manual con foto obligatoria funciona

### AC-002: Validaciones Automáticas Activas
- [ ] Validación GPS detecta empleado fuera de radio
- [ ] Validación de horario detecta registros fuera de jornada
- [ ] Validación de estado bloquea empleados inactivos
- [ ] Validación de duplicados previene doble check-in

### AC-003: Modo Offline Funcional
- [ ] App registra asistencias sin conexión
- [ ] Cola local almacena hasta 500 registros
- [ ] Sincronización automática al reconectar
- [ ] Indicador visual de registros pendientes

### AC-004: Seguridad y Privacidad
- [ ] Templates biométricos están encriptados
- [ ] Consentimiento de empleado se obtiene antes de enrollment
- [ ] Datos se eliminan según política de retención
- [ ] Auditoría completa de accesos

### AC-005: Reportes Disponibles
- [ ] Reporte diario de asistencias
- [ ] Reporte mensual para nómina
- [ ] Exportación Excel funcional
- [ ] Log de auditoría completo

---

## 🧪 Testing

### Test Case 1: Registro con huella dactilar exitoso
```typescript
test('Should register attendance with fingerprint', async () => {
  const employee = await createEmployee();
  await enrollFingerprint(employee.id);

  const attendance = await registerAttendance({
    employeeId: employee.id,
    projectId: 'project-123',
    method: 'biometric_fingerprint',
    gps: { lat: 19.4326, lon: -99.1332 },
    fingerprintTemplate: 'encrypted_template_hash'
  });

  expect(attendance.status).toBe('success');
  expect(attendance.method).toBe('biometric_fingerprint');
  expect(attendance.validations.gps).toBe('PASS');
});
```

### Test Case 2: Validación GPS falla (fuera de radio)
```typescript
test('Should warn when GPS is outside radius', async () => {
  const employee = await createEmployee();
  const project = await createProject({ gps: { lat: 19.4326, lon: -99.1332 }, radius: 100 });

  const result = await registerAttendance({
    employeeId: employee.id,
    projectId: project.id,
    gps: { lat: 19.5000, lon: -99.2000 } // ~10km away
  });

  expect(result.validations.gps).toBe('WARNING');
  expect(result.warnings).toContain('GPS outside work radius');
});
```

### Test Case 3: Modo offline sincroniza correctamente
```typescript
test('Should sync offline records when back online', async () => {
  await goOffline();

  const attendance1 = await registerAttendanceOffline({ employeeId: 'emp-1' });
  const attendance2 = await registerAttendanceOffline({ employeeId: 'emp-2' });

  expect(await getPendingSyncCount()).toBe(2);

  await goOnline();
  await syncPendingAttendances();

  expect(await getPendingSyncCount()).toBe(0);
  expect(await getServerAttendanceCount()).toBe(2);
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-HR-001: Empleados y Cuadrillas](./RF-HR-001-empleados-cuadrillas.md)
- 📄 [RF-HR-003: Costeo de Mano de Obra](./RF-HR-003-costeo-mano-obra.md)
- 📐 [ET-HR-002: Implementación Biométrica](../especificaciones/ET-HR-002-asistencia-biometrica.md)
- 📱 [US-HR-002: App Móvil de Asistencia](../historias-usuario/US-HR-002-asistencia-biometrica-app.md)

### Estándares y Regulaciones
- [LFPDPPP: Ley Federal de Protección de Datos Personales](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf)
- [ISO/IEC 24745: Biometric Information Protection](https://www.iso.org/standard/52946.html)
- [NIST: Biometric Standards](https://www.nist.gov/programs-projects/biometric-standards)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Lead | Creación inicial - Nueva funcionalidad |

---

**Documento:** `docs/01-fase-alcance-inicial/MAI-007-rrhh-asistencias/requerimientos/RF-HR-002-asistencia-biometrica.md`
**Ruta relativa:** `MAI-007-rrhh-asistencias/requerimientos/RF-HR-002-asistencia-biometrica.md`
**Épica:** MAI-006 (RRHH, Asistencias y Nómina)
**Sprint:** Sprint 9-10 (Semanas 13.5-16)
**Prioridad:** P0 - Crítica
