# US-HR-002: App Móvil de Asistencia con Biométrico

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-002
**ET:** ET-HR-002
**Tipo:** Historia de Usuario
**Prioridad:** Crítica ⭐
**Story Points:** 15
**Sprint:** 9-10 (2 sprints)
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📖 Historia de Usuario

**Como** Residente de Obra o Supervisor de Cuadrilla
**Quiero** una aplicación móvil para registrar asistencia de empleados usando biométrico, QR y GPS
**Para** automatizar el control de asistencia, eliminar fraudes (buddy punching) y tener datos precisos para nómina y costeo

---

## 🎯 Criterios de Aceptación

### CA-1: Instalación y Login en App Móvil 📱

**Dado que** soy un Residente o Supervisor con dispositivo Android/iOS
**Cuando** descargo e instalo la app "Constructora Asistencias"
**Entonces** debo poder:

- Abrir la app y ver pantalla de login
- Ingresar mi email y contraseña (mismas del sistema web)
- Hacer clic en "Iniciar Sesión"
- Ver mensaje de carga mientras se autentica
- Si credenciales correctas: ver pantalla principal con opciones
- Si credenciales incorrectas: ver error "Usuario o contraseña incorrectos"
- Ver opción "¿Olvidaste tu contraseña?" que redirige a recuperación

**Y** después del primer login, las credenciales deben recordarse (biometric unlock opcional)

**Pantalla principal debe mostrar:**
- Nombre del usuario logueado
- Constructora actual
- Botón principal: "Registrar Asistencia"
- Botón secundario: "Ver Historial"
- Badge con asistencias pendientes de sincronizar (si hay)

### CA-2: Flujo de Registro de Asistencia - Escaneo QR ✅

**Dado que** estoy logueado en la app móvil
**Cuando** hago clic en "Registrar Asistencia"
**Entonces** debo:

1. **Seleccionar Obra:**
   - Ver lista de obras activas de mi constructora
   - Poder buscar por nombre de obra
   - Seleccionar una obra
   - Ver confirmación: "Obra: Casa Modelo Residencial Norte"

2. **Escanear QR del Empleado:**
   - Ver pantalla de cámara con marco de QR
   - Instrucción: "Escanea el código QR del empleado"
   - Poder activar flash si está oscuro
   - Al detectar QR válido: vibración + sonido de confirmación
   - Mostrar datos del empleado:
     - Foto del empleado
     - Código: `EMP-00123`
     - Nombre completo: `Juan Pérez García`
     - Cuadrilla: `Cuadrilla de Albañilería A`

3. **Validar Formato QR:**
   - QR debe tener formato: `employee:{uuid}`
   - Ejemplo: `employee:550e8400-e29b-41d4-a716-446655440000`
   - Si QR inválido: error "Código QR no válido"
   - Si empleado no existe: error "Empleado no encontrado"
   - Si empleado suspendido: error "Empleado suspendido, no puede registrar asistencia"

### CA-3: Captura Biométrica 👆

**Dado que** he escaneado el QR del empleado correctamente
**Cuando** procedo a la captura biométrica
**Entonces** debo:

1. **Ver Pantalla de Biométrico:**
   - Instrucción: "Solicita al empleado colocar su huella digital"
   - Ícono de huella parpadeando
   - Botón: "Capturar Huella"

2. **Iniciar Captura:**
   - Al hacer clic, se activa el sensor biométrico del dispositivo
   - Prompt del sistema: "Coloca tu huella para confirmar asistencia"
   - Empleado coloca su dedo en el sensor

3. **Validar Biométrico:**
   - Si captura exitosa (confidence ≥ 70%):
     - Checkmark verde ✓
     - Mensaje: "Huella verificada correctamente"
     - Vibración de confirmación
   - Si falla captura:
     - X roja ✗
     - Mensaje: "No se pudo verificar la huella, intenta nuevamente"
     - Permitir hasta 3 intentos
   - Si 3 intentos fallidos:
     - Opción de "Capturar Foto como Respaldo"
     - Notificación a RRHH de registro manual requerido

4. **Fallback - Reconocimiento Facial (Opcional):**
   - Si dispositivo no tiene sensor de huella
   - Activar cámara frontal
   - Instrucción: "Mira a la cámara"
   - Usar react-native-biometrics con FaceID/Face Unlock
   - Validar confidence ≥ 70%

### CA-4: Validación GPS 📍

**Dado que** la captura biométrica fue exitosa
**Cuando** el sistema valida la ubicación
**Entonces** debe:

1. **Obtener Coordenadas GPS:**
   - Solicitar permiso de ubicación (si no se ha otorgado)
   - Obtener latitud y longitud actual del dispositivo
   - Mostrar spinner: "Verificando ubicación..."

2. **Validar Distancia:**
   - Comparar con coordenadas registradas de la obra
   - Calcular distancia usando fórmula de Haversine
   - Obra: `lat: 19.4326, lng: -99.1332`
   - Dispositivo: `lat: 19.4330, lng: -99.1340`
   - Distancia calculada: 92 metros

3. **Resultados de Validación:**
   - **Distancia ≤ 100m:** ✅ Validación exitosa
     - Badge verde: "Ubicación verificada"
   - **Distancia 100m - 500m:** ⚠️ Advertencia
     - Badge amarillo: "Ubicación con advertencia (320m de la obra)"
     - Solicitar comentario obligatorio
     - Marcar registro con flag `locationWarning: true`
   - **Distancia > 500m:** ❌ Rechazado
     - Badge rojo: "Fuera de ubicación permitida (1.2 km)"
     - No permitir continuar
     - Opción: "Contactar soporte"

4. **Manejo de GPS Desactivado:**
   - Si GPS apagado: solicitar activación
   - Si no se puede obtener ubicación: permitir registro con warning manual

### CA-5: Foto de Respaldo 📷

**Dado que** he validado biométrico y GPS
**Cuando** procedo a tomar foto de respaldo
**Entonces** debo:

1. **Activar Cámara:**
   - Abrir cámara trasera del dispositivo
   - Mostrar marco facial de guía
   - Instrucción: "Toma una foto del empleado"

2. **Capturar Foto:**
   - Botón de captura visible
   - Preview de la foto tomada
   - Opciones: "Usar esta foto" o "Tomar otra"

3. **Procesar Foto:**
   - Comprimir a máximo 500 KB
   - Formato: JPEG con calidad 80%
   - Dimensiones: max 800x800 px
   - Convertir a Base64 para almacenamiento

### CA-6: Registro de Check-In ✅

**Dado que** todas las validaciones fueron exitosas
**Cuando** confirmo el registro de asistencia
**Entonces** el sistema debe:

1. **Crear Registro en BD Local (SQLite):**
```json
{
  "id": "uuid-local",
  "employeeId": "550e8400-e29b-41d4-a716-446655440000",
  "workId": "obra-uuid",
  "type": "check_in",
  "workDate": "2025-11-17",
  "timestamp": "2025-11-17T07:15:32Z",
  "biometricData": "base64-signature",
  "biometricType": "fingerprint",
  "biometricConfidence": 0.87,
  "gpsLatitude": 19.4330,
  "gpsLongitude": -99.1340,
  "gpsAccuracy": 15.5,
  "photoBackup": "base64-image-data",
  "locationWarning": false,
  "registeredBy": "user-uuid-residente",
  "deviceInfo": "Samsung Galaxy A52 - Android 13",
  "syncStatus": "pending",
  "synced": false
}
```

2. **Mostrar Confirmación:**
   - Checkmark animado grande ✓
   - Mensaje: "Asistencia registrada"
   - Detalles:
     - Empleado: Juan Pérez García
     - Hora de entrada: 07:15 AM
     - Obra: Casa Modelo Residencial Norte
   - Sonido de éxito
   - Vibración de confirmación

3. **Agregar a Cola de Sincronización:**
   - Insertar en tabla `sync_queue` con prioridad 1
   - Si hay conexión a internet: intentar sync inmediata
   - Si no hay conexión: mostrar badge "Pendiente de sincronizar (1)"

4. **Retornar a Pantalla Principal:**
   - Después de 3 segundos automáticamente
   - O al hacer clic en "Registrar otra asistencia"

### CA-7: Registro de Check-Out 🚪

**Dado que** un empleado ya hizo check-in ese día
**Cuando** escaneo su QR para check-out
**Entonces** el sistema debe:

1. **Detectar Check-In Previo:**
   - Buscar check-in del mismo empleado en la misma obra y fecha
   - Si existe: mostrar mensaje "Check-in encontrado: 07:15 AM"
   - Si no existe: error "No hay check-in registrado hoy para este empleado"

2. **Solicitar Biométrico para Check-Out:**
   - Repetir proceso de captura biométrica
   - Validar que confidence ≥ 70%

3. **Validar Horas Trabajadas:**
   - Check-in: 07:15 AM
   - Check-out: 05:30 PM
   - Horas trabajadas: 10h 15min
   - Mostrar advertencia si < 4 horas: "¿Seguro que deseas registrar salida tan temprano?"
   - Mostrar advertencia si > 12 horas: "Horas extras detectadas: 2h 15min"

4. **Crear Registro de Check-Out:**
   - Mismo proceso que check-in pero con `type: "check_out"`
   - Agregar a cola de sincronización

### CA-8: Modo Offline 📵

**Dado que** estoy en una obra sin conexión a internet
**Cuando** registro asistencias
**Entonces** la app debe:

1. **Funcionar Completamente Offline:**
   - Todas las validaciones funcionan (QR, biométrico, GPS, foto)
   - Registros se guardan en SQLite local
   - Badge muestra: "Modo offline - 5 asistencias pendientes"
   - No mostrar errores de conexión

2. **Almacenamiento Local:**
   - Base de datos SQLite con schema completo
   - Tabla `attendance_records`
   - Tabla `sync_queue`
   - Tabla `cached_works` (obras precargadas)
   - Tabla `cached_employees` (empleados precargados)

3. **Precarga de Datos:**
   - Al hacer login con internet, descargar:
     - Obras activas de la constructora
     - Lista de empleados activos
     - Última actualización: timestamp
   - Datos válidos por 7 días

4. **Indicadores Visuales:**
   - Ícono de wifi tachado en header
   - Banner amarillo: "Sin conexión - Los registros se sincronizarán automáticamente"
   - Contador de registros pendientes

### CA-9: Sincronización Automática ⚡

**Dado que** tengo asistencias pendientes de sincronizar
**Cuando** el dispositivo detecta conexión a internet
**Entonces** debe:

1. **Detectar Conexión:**
   - Listener de NetInfo activado
   - Al detectar conexión: mostrar toast "Conexión restablecida"

2. **Iniciar Sync Automático:**
   - Mostrar progress bar: "Sincronizando asistencias (2/5)"
   - Procesar cola en orden FIFO (First In, First Out)
   - Enviar registros al backend uno por uno

3. **Manejo de Respuestas:**
   - **Si 200 OK:**
     - Marcar registro como `synced: true`
     - Eliminar de `sync_queue`
     - Mostrar: "✓ Sincronizado (2/5)"
   - **Si 409 Conflict (duplicado):**
     - Marcar como synced (ya existe en servidor)
     - Eliminar de cola
   - **Si 400/500 Error:**
     - Reintentar hasta 3 veces con delay exponencial (1s, 2s, 4s)
     - Si falla 3 veces: marcar como `syncStatus: 'failed'`
     - Notificar al usuario: "Error al sincronizar 1 registro"

4. **Confirmación Final:**
   - Al completar: "✓ Todas las asistencias sincronizadas"
   - Ocultar badge de pendientes
   - Vibración de confirmación

### CA-10: Historial de Asistencias 📋

**Dado que** estoy logueado en la app
**Cuando** hago clic en "Ver Historial"
**Entonces** puedo:

1. **Ver Lista de Registros:**
   - Ordenados por fecha descendente (más reciente primero)
   - Por cada registro mostrar:
     - Foto del empleado (thumbnail 50x50)
     - Nombre: Juan Pérez García
     - Código: EMP-00123
     - Obra: Casa Modelo Norte
     - Check-in: 07:15 AM ✅
     - Check-out: 05:30 PM ✅
     - Estado de sync:
       - ✓ Sincronizado (verde)
       - ⏳ Pendiente (amarillo)
       - ✗ Error (rojo)

2. **Filtros:**
   - Por fecha (hoy, últimos 7 días, últimos 30 días)
   - Por obra
   - Por estado de sync

3. **Ver Detalle:**
   - Al hacer clic en un registro, ver modal con:
     - Todos los datos del registro
     - Mapa con ubicación GPS (si hay conexión)
     - Foto de respaldo (expandible)
     - Información del dispositivo
     - Timestamp exacto

4. **Reintentar Sync Manual:**
   - Si registro tiene error de sync
   - Botón: "Reintentar sincronización"
   - Mostrar spinner mientras procesa

### CA-11: Notificaciones y Alertas 🔔

**La app debe enviar notificaciones para:**

1. **Recordatorio de Check-Out:**
   - Si empleado tiene check-in pero no check-out después de 10 horas
   - Notificación: "Juan Pérez no ha registrado salida (10h 30min trabajadas)"

2. **Sync Completado:**
   - Cuando se completa sync en background
   - "✓ 5 asistencias sincronizadas correctamente"

3. **Error de Sync:**
   - Si falla sincronización después de 3 reintentos
   - "Error al sincronizar asistencia de Juan Pérez - Toca para ver detalles"

4. **Empleado Suspendido:**
   - Si se intenta registrar empleado suspendido
   - "Juan Pérez está suspendido y no puede registrar asistencia"

### CA-12: Permisos de Dispositivo 🔐

**La app debe solicitar permisos para:**

1. **Cámara:** Para escanear QR y tomar fotos
2. **Ubicación:** Para validar GPS de la obra
3. **Biométrico:** Para captura de huella/facial
4. **Almacenamiento:** Para guardar fotos temporalmente
5. **Notificaciones:** Para alertas de sync

**Manejo de permisos:**
- Solicitar en el momento que se necesitan (no al inicio)
- Explicar por qué se necesita cada permiso
- Si se deniega: mostrar mensaje explicativo y opción de ir a configuración
- Si se deniega permanentemente: mostrar pantalla de ayuda

---

## 🔧 Detalles Técnicos

### Stack Tecnológico Móvil

```json
{
  "framework": "React Native 0.73",
  "platform": "Expo SDK ~50.0.0",
  "language": "TypeScript 5.3",
  "state": "Zustand 4.4",
  "navigation": "React Navigation 6.x",
  "database": "expo-sqlite 13.x",
  "camera": "expo-camera 14.x",
  "barcode": "expo-barcode-scanner 12.x",
  "location": "expo-location 16.x",
  "biometrics": "react-native-biometrics 3.x",
  "networking": "@react-native-community/netinfo 11.x",
  "http": "axios 1.6"
}
```

### Arquitectura de la App

```
apps/mobile-attendance/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── WorkSelectionScreen.tsx
│   │   ├── QRScannerScreen.tsx
│   │   ├── BiometricCaptureScreen.tsx
│   │   ├── PhotoCaptureScreen.tsx
│   │   ├── ConfirmationScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── attendance.service.ts
│   │   ├── sync.service.ts
│   │   ├── gps.service.ts
│   │   └── biometric.service.ts
│   ├── database/
│   │   ├── schema.ts
│   │   ├── migrations.ts
│   │   └── queries.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── attendanceStore.ts
│   │   └── syncStore.ts
│   ├── components/
│   │   ├── EmployeeCard.tsx
│   │   ├── SyncBadge.tsx
│   │   ├── GPSIndicator.tsx
│   │   └── BiometricPrompt.tsx
│   └── utils/
│       ├── haversine.ts
│       ├── validation.ts
│       └── encryption.ts
└── app.json
```

### Base de Datos SQLite

```sql
-- Schema de SQLite local
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  workId TEXT NOT NULL,
  type TEXT CHECK(type IN ('check_in', 'check_out')) NOT NULL,
  workDate TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  biometricData TEXT,
  biometricType TEXT,
  biometricConfidence REAL,
  gpsLatitude REAL,
  gpsLongitude REAL,
  gpsAccuracy REAL,
  photoBackup TEXT,
  locationWarning INTEGER DEFAULT 0,
  registeredBy TEXT,
  deviceInfo TEXT,
  syncStatus TEXT DEFAULT 'pending',
  synced INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attendanceId TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  retryCount INTEGER DEFAULT 0,
  lastError TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attendanceId) REFERENCES attendance_records(id)
);

CREATE TABLE IF NOT EXISTS cached_works (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  latitude REAL,
  longitude REAL,
  isActive INTEGER DEFAULT 1,
  lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cached_employees (
  id TEXT PRIMARY KEY,
  employeeCode TEXT,
  curp TEXT,
  fullName TEXT,
  photoUrl TEXT,
  status TEXT,
  lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_employee ON attendance_records(employeeId);
CREATE INDEX idx_attendance_work ON attendance_records(workId);
CREATE INDEX idx_attendance_date ON attendance_records(workDate);
CREATE INDEX idx_sync_queue_priority ON sync_queue(priority DESC);
```

### Servicio de Sincronización

```typescript
// sync.service.ts
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { database } from '../database';

class SyncService {
  private syncInProgress = false;

  constructor() {
    // Listener de conexión
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.syncInProgress) {
        this.syncPendingRecords();
      }
    });
  }

  async syncPendingRecords() {
    this.syncInProgress = true;

    try {
      const pendingRecords = await database.getPendingRecords();

      for (const record of pendingRecords) {
        try {
          await this.syncRecord(record);
          await database.markAsSynced(record.id);
          await database.removeFromSyncQueue(record.id);
        } catch (error) {
          await this.handleSyncError(record, error);
        }
      }

      console.log(`✓ Sincronizados ${pendingRecords.length} registros`);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncRecord(record: AttendanceRecord) {
    const token = await SecureStore.getItemAsync('accessToken');

    const response = await axios.post(
      `${API_URL}/api/hr/attendance`,
      {
        employeeId: record.employeeId,
        workId: record.workId,
        type: record.type,
        workDate: record.workDate,
        timestamp: record.timestamp,
        biometricData: record.biometricData,
        biometricType: record.biometricType,
        biometricConfidence: record.biometricConfidence,
        gpsLatitude: record.gpsLatitude,
        gpsLongitude: record.gpsLongitude,
        gpsAccuracy: record.gpsAccuracy,
        photoBackup: record.photoBackup,
        locationWarning: record.locationWarning,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos
      }
    );

    return response.data;
  }

  private async handleSyncError(record: AttendanceRecord, error: any) {
    const retryCount = await database.getRetryCount(record.id);

    if (retryCount < 3) {
      // Incrementar retry count
      await database.incrementRetryCount(record.id);

      // Delay exponencial: 1s, 2s, 4s
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Reintentar
      await this.syncRecord(record);
    } else {
      // Marcar como error después de 3 intentos
      await database.markSyncFailed(record.id, error.message);

      // Notificar al usuario
      await this.sendNotification(
        'Error de sincronización',
        `No se pudo sincronizar la asistencia de ${record.employeeName}`
      );
    }
  }
}

export const syncService = new SyncService();
```

### Validación GPS con Haversine

```typescript
// gps.service.ts
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export class GPSService {
  /**
   * Obtener ubicación actual del dispositivo
   */
  async getCurrentLocation(): Promise<Coordinates> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permiso de ubicación denegado');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      maximumAge: 10000, // Cache de 10 segundos
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }

  /**
   * Calcular distancia usando fórmula de Haversine
   * @returns distancia en metros
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  /**
   * Validar si ubicación está dentro del radio permitido
   */
  async validateWorkLocation(
    workLatitude: number,
    workLongitude: number
  ): Promise<{
    isValid: boolean;
    distance: number;
    warning: boolean;
  }> {
    const current = await this.getCurrentLocation();

    const distance = this.calculateDistance(
      current.latitude,
      current.longitude,
      workLatitude,
      workLongitude
    );

    return {
      isValid: distance <= 500, // Máximo 500m
      distance: Math.round(distance),
      warning: distance > 100 && distance <= 500,
    };
  }
}
```

---

## 🧪 Casos de Prueba

### TC-MBL-001: Login y Acceso a la App ✅

**Precondiciones:**
- App instalada en dispositivo Android/iOS
- Usuario registrado con rol Resident

**Pasos:**
1. Abrir app "Constructora Asistencias"
2. Ingresar email: `residente@constructora.com`
3. Ingresar password: `Password123!`
4. Hacer clic en "Iniciar Sesión"

**Resultado esperado:**
- Loading spinner visible durante 1-2 segundos
- Login exitoso
- Redirect a HomeScreen
- Header muestra: "Bienvenido, Juan Rodríguez"
- Constructora actual: "Constructora ABC"
- Botón "Registrar Asistencia" visible y habilitado

### TC-MBL-002: Escaneo de QR Válido ✅

**Precondiciones:**
- Usuario logueado
- Obra seleccionada: "Casa Modelo Norte"
- QR code impreso de empleado EMP-00123

**Pasos:**
1. Clic en "Registrar Asistencia"
2. Seleccionar obra "Casa Modelo Norte"
3. Permitir acceso a cámara (si se solicita)
4. Apuntar cámara al QR code del empleado
5. Esperar detección automática

**Resultado esperado:**
- QR detectado en < 2 segundos
- Vibración corta
- Sonido de confirmación
- Pantalla muestra:
  - Foto del empleado (cargada desde cache/servidor)
  - Código: EMP-00123
  - Nombre: Juan Pérez García
  - Cuadrilla: Albañilería A
- Botón "Continuar a Biométrico" habilitado

### TC-MBL-003: Captura Biométrica Exitosa 👆

**Precondiciones:**
- QR escaneado correctamente
- Dispositivo con sensor de huella (Touch ID/Fingerprint)

**Pasos:**
1. Hacer clic en "Capturar Huella"
2. Seguir instrucción del sistema: "Coloca tu huella"
3. Empleado coloca dedo en sensor
4. Esperar validación

**Resultado esperado:**
- Prompt biométrico del sistema aparece
- Captura exitosa (confidence: 0.87)
- Checkmark verde ✓ animado
- Mensaje: "Huella verificada correctamente"
- Auto-avance a validación GPS después de 1 segundo

### TC-MBL-004: Validación GPS Dentro de Rango ✅

**Precondiciones:**
- Biométrico capturado exitosamente
- GPS del dispositivo activado
- Ubicación actual: 50 metros de la obra

**Pasos:**
1. Sistema obtiene ubicación automáticamente
2. Calcula distancia a la obra

**Resultado esperado:**
- Spinner "Verificando ubicación..." visible por 1-2 segundos
- Cálculo de distancia:
  - Obra: `19.4326, -99.1332`
  - Dispositivo: `19.4330, -99.1335`
  - Distancia: 50m
- Badge verde: "✓ Ubicación verificada"
- No se solicita comentario
- Auto-avance a captura de foto

### TC-MBL-005: Validación GPS con Advertencia ⚠️

**Precondiciones:**
- Ubicación actual: 250 metros de la obra

**Pasos:**
1. Sistema valida ubicación
2. Detecta distancia > 100m pero < 500m

**Resultado esperado:**
- Badge amarillo: "⚠️ Ubicación con advertencia (250m)"
- Modal aparece: "Estás a 250 metros de la obra. ¿Deseas continuar?"
- Campo de texto: "Comentario obligatorio"
- Ejemplo de placeholder: "Empleado trabajando en zona externa del terreno"
- No se puede continuar sin ingresar comentario (min 10 caracteres)

### TC-MBL-006: Validación GPS Rechazada ❌

**Precondiciones:**
- Ubicación actual: 1.5 km de la obra

**Pasos:**
1. Sistema valida ubicación
2. Detecta distancia > 500m

**Resultado esperado:**
- Badge rojo: "❌ Fuera de ubicación (1.5 km)"
- Mensaje: "No puedes registrar asistencia fuera del área de la obra"
- Botón "Continuar" deshabilitado
- Opciones disponibles:
  - "Contactar Soporte"
  - "Cancelar Registro"
- No se permite avanzar

### TC-MBL-007: Registro Completo de Check-In ✅

**Precondiciones:**
- Todas las validaciones pasadas (QR, biométrico, GPS)

**Pasos:**
1. Tomar foto del empleado
2. Confirmar foto
3. Hacer clic en "Registrar Asistencia"

**Resultado esperado:**
- Spinner "Guardando..." por 1 segundo
- Registro guardado en SQLite:
```json
{
  "type": "check_in",
  "workDate": "2025-11-17",
  "timestamp": "2025-11-17T07:15:32Z",
  "biometricConfidence": 0.87,
  "gpsLatitude": 19.4330,
  "gpsLongitude": -99.1335,
  "syncStatus": "pending",
  "synced": false
}
```
- Pantalla de confirmación animada:
  - Checkmark gigante verde ✓
  - Confetti animado
  - Mensaje: "✓ Asistencia Registrada"
  - Empleado: Juan Pérez García
  - Hora: 07:15 AM
  - Obra: Casa Modelo Norte
- Badge en HomeScreen: "1 pendiente de sincronizar"
- Auto-redirect a HomeScreen después de 3 segundos

### TC-MBL-008: Check-Out del Mismo Día ✅

**Precondiciones:**
- Check-in registrado a las 07:15 AM
- Hora actual: 05:30 PM

**Pasos:**
1. Escanear QR del mismo empleado
2. Completar biométrico

**Resultado esperado:**
- Sistema detecta check-in previo
- Mensaje: "Check-in registrado hoy a las 07:15 AM"
- Pregunta: "¿Registrar salida?"
- Al confirmar: crear registro con `type: "check_out"`
- Cálculo de horas: 10h 15min
- Mensaje en confirmación: "Día completado: 10h 15min trabajadas"

### TC-MBL-009: Modo Offline - Registro sin Internet 📵

**Precondiciones:**
- Dispositivo en modo avión (sin internet)
- Obras y empleados pre-cargados en cache

**Pasos:**
1. Abrir app (ya logueado previamente)
2. Registrar asistencia completa

**Resultado esperado:**
- Banner amarillo en top: "Sin conexión - Los registros se sincronizarán automáticamente"
- Ícono de WiFi tachado en header
- Registro se guarda en SQLite normalmente
- Confirmación muestra: "Asistencia registrada (offline)"
- Badge actualizado: "1 pendiente de sincronizar"
- Sin errores de conexión mostrados

### TC-MBL-010: Sincronización Automática al Reconectar ⚡

**Precondiciones:**
- 5 registros pendientes de sincronizar en SQLite
- Dispositivo sin conexión

**Pasos:**
1. Activar WiFi o datos móviles
2. App detecta conexión automáticamente

**Resultado esperado:**
- Toast: "Conexión restablecida"
- Progress bar aparece: "Sincronizando asistencias (1/5)"
- Backend responde 200 OK para cada registro
- Registros marcados como `synced: true` uno por uno
- Progress bar actualiza: (2/5), (3/5), etc.
- Al completar: Toast "✓ Todas las asistencias sincronizadas (5)"
- Badge de pendientes desaparece
- Vibración de confirmación

### TC-MBL-011: Manejo de Error de Sincronización ❌

**Precondiciones:**
- 1 registro pendiente
- Backend arroja error 500

**Pasos:**
1. Intentar sincronizar
2. Backend responde con error

**Resultado esperado:**
- Primer intento falla
- Espera 1 segundo
- Segundo intento automático
- Espera 2 segundos
- Tercer intento automático
- Espera 4 segundos
- Después de 3 intentos:
  - Registro marcado como `syncStatus: 'failed'`
  - `lastError: 'Internal Server Error'` guardado
  - Notificación: "Error al sincronizar asistencia de Juan Pérez"
  - Badge rojo en HomeScreen: "1 error de sincronización"

### TC-MBL-012: Historial de Asistencias 📋

**Precondiciones:**
- 10 asistencias registradas (7 sincronizadas, 2 pendientes, 1 error)

**Pasos:**
1. Hacer clic en "Ver Historial"
2. Revisar lista

**Resultado esperado:**
- Lista ordenada por fecha descendente (más reciente primero)
- Por cada registro:
  - Foto thumbnail 50x50 del empleado
  - Nombre completo
  - Código de empleado
  - Obra
  - Check-in/out con hora
  - Badge de estado:
    - ✓ Sincronizado (verde) - 7 registros
    - ⏳ Pendiente (amarillo) - 2 registros
    - ✗ Error (rojo) - 1 registro
- Filtro por fecha funcional
- Al hacer clic en registro: modal con detalle completo

### TC-MBL-013: Reintentar Sincronización Manual ✅

**Precondiciones:**
- 1 registro con `syncStatus: 'failed'`

**Pasos:**
1. Ir a Historial
2. Hacer clic en registro con error
3. Ver detalle en modal
4. Hacer clic en "Reintentar Sincronización"

**Resultado esperado:**
- Spinner visible en modal
- Intento de sync al backend
- Si exitoso:
  - Estado cambia a "Sincronizado"
  - Toast: "✓ Asistencia sincronizada correctamente"
  - Badge de error desaparece
- Si falla nuevamente:
  - Mensaje de error específico
  - Opción de "Contactar Soporte"

---

## 📦 Dependencias

### Dependencias de Otros US

- ✅ **US-FUND-001:** Sistema de autenticación (JWT, refresh token)
- ✅ **US-FUND-002:** Multi-tenancy (constructoraId)
- ✅ **US-HR-001:** Empleados con QR codes generados
- ⏳ **Backend API:** Endpoints de asistencia deben existir

### Librerías Móviles

```json
{
  "dependencies": {
    "react-native": "0.73.2",
    "expo": "~50.0.0",
    "expo-camera": "~14.0.0",
    "expo-barcode-scanner": "~12.8.0",
    "expo-location": "~16.5.0",
    "expo-sqlite": "~13.0.0",
    "react-native-biometrics": "^3.0.1",
    "@react-native-community/netinfo": "^11.2.0",
    "react-navigation": "^6.1.9",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "expo-secure-store": "~12.8.0",
    "react-native-image-picker": "^7.1.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.1"
  }
}
```

---

## ⚠️ Riesgos

### R-1: Variabilidad de Sensores Biométricos

**Descripción:** Dispositivos Android tienen sensores de huella muy variables en calidad
**Impacto:** Alto
**Probabilidad:** Alta
**Mitigación:**
- Threshold de confidence configurable (default 70%, ajustable a 60%)
- Fallback a foto facial si biométrico falla 3 veces
- Opción de "Registro Manual" en caso extremo (notifica a RRHH)

### R-2: GPS Impreciso en Zonas Urbanas

**Descripción:** GPS puede tener error de 10-50m en zonas con edificios altos
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- Radio de validación: 100m (no 10m)
- Advertencia en 100-500m (permite con comentario)
- Usar campo `gpsAccuracy` para análisis posterior
- Opción de override manual para Directores

### R-3: Almacenamiento SQLite Lleno

**Descripción:** Dispositivos con poco espacio pueden llenarse con fotos
**Impacto:** Medio
**Probabilidad:** Baja
**Mitigación:**
- Compresión de fotos a máx 500 KB
- Eliminar registros sincronizados > 30 días
- Alerta si espacio < 100 MB
- Opción de "Sincronizar y limpiar"

### R-4: Compatibilidad con Dispositivos Antiguos

**Descripción:** Dispositivos Android < 8.0 pueden no soportar biométrico
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- Detección de capacidades al inicio
- Fallback a PIN de 4 dígitos + foto
- Requerimientos mínimos documentados:
  - Android 8.0+ (API 26)
  - iOS 13.0+
  - 2 GB RAM mínimo

### R-5: Batería Consumida por GPS/Cámara

**Descripción:** Uso intensivo de GPS y cámara consume batería rápidamente
**Impacto:** Bajo
**Probabilidad:** Alta
**Mitigación:**
- GPS solo al momento de validar (no en background)
- Cámara se apaga automáticamente después de 30 segundos de inactividad
- Modo "Ahorro de Batería" que reduce calidad de foto
- Alerta si batería < 15%

---

## 📊 Métricas de Éxito

**Métricas de Producto:**
- ✅ 95% de registros exitosos en primer intento
- ✅ < 5% de registros con locationWarning
- ✅ 99% de sincronización exitosa en < 60 segundos
- ✅ Tiempo promedio de registro completo: < 45 segundos

**Métricas de UX:**
- ✅ NPS (Net Promoter Score) > 70
- ✅ 0 quejas de dificultad de uso en primer mes
- ✅ 90% de supervisores usan la app diariamente

**Métricas Técnicas:**
- ✅ Crash rate < 1%
- ✅ Startup time < 3 segundos
- ✅ Sincronización consume < 50 MB de datos móviles/día
- ✅ Tamaño de app < 50 MB

---

## 📱 Capturas de Pantalla (Wireframes)

### Pantalla de Login
```
┌─────────────────────────┐
│                         │
│   [LOGO CONSTRUCTORA]   │
│                         │
│   ┌─────────────────┐   │
│   │ Email           │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │ Password        │   │
│   └─────────────────┘   │
│                         │
│   [  Iniciar Sesión  ]  │
│                         │
│   ¿Olvidaste tu         │
│   contraseña?           │
│                         │
└─────────────────────────┘
```

### Pantalla Principal
```
┌─────────────────────────┐
│ Bienvenido, Juan        │
│ Constructora ABC        │
│                    [≡]  │
├─────────────────────────┤
│                         │
│   ┌─────────────────┐   │
│   │  📋 Registrar   │   │
│   │   Asistencia    │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │  📊 Ver         │   │
│   │   Historial     │   │
│   └─────────────────┘   │
│                         │
│  ⏳ 3 pendientes de     │
│     sincronizar         │
│                         │
└─────────────────────────┘
```

### Escáner QR
```
┌─────────────────────────┐
│  [<] Escanear QR        │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │                     │ │
│ │   ┌───────────┐     │ │
│ │   │  [  QR  ] │     │ │
│ │   │  Scanner  │     │ │
│ │   └───────────┘     │ │
│ │                     │ │
│ │  Apunta la cámara   │ │
│ │  al código QR       │ │
│ └─────────────────────┘ │
│                         │
│        [💡 Flash]       │
└─────────────────────────┘
```

---

## 📋 Checklist de Implementación

### Configuración Inicial
- [ ] Crear proyecto Expo: `npx create-expo-app mobile-attendance`
- [ ] Configurar TypeScript
- [ ] Instalar dependencias móviles
- [ ] Configurar app.json con permisos
- [ ] Configurar React Navigation
- [ ] Configurar Zustand stores

### Pantallas
- [ ] LoginScreen con autenticación JWT
- [ ] HomeScreen con opciones principales
- [ ] WorkSelectionScreen con lista de obras
- [ ] QRScannerScreen con expo-barcode-scanner
- [ ] BiometricCaptureScreen con react-native-biometrics
- [ ] PhotoCaptureScreen con expo-camera
- [ ] ConfirmationScreen animada
- [ ] HistoryScreen con filtros

### Base de Datos SQLite
- [ ] Crear schema completo
- [ ] Implementar migrations
- [ ] Crear queries helper functions
- [ ] Implementar CRUD de attendance_records
- [ ] Implementar sync_queue management
- [ ] Implementar cache de obras y empleados

### Servicios
- [ ] AuthService (login, logout, token refresh)
- [ ] AttendanceService (create check-in/out, validate)
- [ ] SyncService (auto-sync, manual retry)
- [ ] GPSService (Haversine, validación)
- [ ] BiometricService (fingerprint, face recognition)

### Sincronización
- [ ] Implementar NetInfo listener
- [ ] Implementar cola FIFO de sync
- [ ] Implementar retry con exponential backoff
- [ ] Implementar manejo de errores
- [ ] Implementar notificaciones de sync

### Testing
- [ ] Tests unitarios de servicios
- [ ] Tests de validación GPS
- [ ] Tests de cálculo Haversine
- [ ] Tests de SQLite queries
- [ ] Tests de sincronización
- [ ] Tests E2E con Detox
- [ ] Tests de permisos de dispositivo

### Build y Distribución
- [ ] Configurar EAS Build
- [ ] Generar APK para Android
- [ ] Generar IPA para iOS (TestFlight)
- [ ] Documentar proceso de instalación
- [ ] Crear manual de usuario con capturas

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
**Autor:** Equipo de Desarrollo
**Revisado por:** Product Owner, CTO
