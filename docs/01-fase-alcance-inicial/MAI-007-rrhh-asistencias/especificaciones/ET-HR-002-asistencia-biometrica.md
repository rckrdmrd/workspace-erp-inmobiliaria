# ET-HR-002: Asistencia Biométrica y App Móvil

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-002
**Tipo:** Especificación Técnica
**Prioridad:** Crítica
**Estado:** 🚧 En Implementación
**Última actualización:** 2025-11-17

---

## 📱 Arquitectura de App Móvil

```
┌──────────────────────────────────────────────────┐
│         App Móvil (React Native + Expo)          │
│                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ QR Scanner │  │ Biometric  │  │ GPS Check  │ │
│  └────────────┘  └────────────┘  └────────────┘ │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │      Local Database (SQLite + Expo)       │  │
│  │  - Offline queue                          │  │
│  │  - Employee cache                         │  │
│  │  - Attendance records                     │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────┘
                       │ REST API (online)
                       │ Sync service (background)
┌──────────────────────▼───────────────────────────┐
│              Backend (NestJS)                     │
│  ┌────────────────────────────────────────────┐  │
│  │     Attendance Module                      │  │
│  │  - POST /attendance/check-in               │  │
│  │  - POST /attendance/check-out              │  │
│  │  - GET  /attendance/employees/:workId      │  │
│  │  - POST /attendance/sync-offline           │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────┐
│             PostgreSQL Database                   │
│  attendance.attendance_records                    │
│  attendance.attendance_validations                │
└───────────────────────────────────────────────────┘
```

---

## 📁 Estructura de App Móvil

```
apps/mobile/
├── src/
│   ├── features/
│   │   └── attendance/
│   │       ├── screens/
│   │       │   ├── LoginScreen.tsx
│   │       │   ├── WorkSelectorScreen.tsx
│   │       │   ├── AttendanceDashboardScreen.tsx
│   │       │   ├── QRScannerScreen.tsx
│   │       │   ├── BiometricCaptureScreen.tsx
│   │       │   ├── EmployeeListScreen.tsx
│   │       │   └── HistoryScreen.tsx
│   │       ├── components/
│   │       │   ├── AttendanceCard.tsx
│   │       │   ├── EmployeeCard.tsx
│   │       │   └── SyncStatus.tsx
│   │       ├── services/
│   │       │   ├── attendance.service.ts
│   │       │   ├── biometric.service.ts
│   │       │   ├── gps.service.ts
│   │       │   └── sync.service.ts
│   │       └── db/
│   │           ├── schema.ts
│   │           └── operations.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── api/
│   │   └── client.ts
│   └── utils/
│       ├── validators.ts
│       └── permissions.ts
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🔧 Implementación Backend - Attendance Module

### 1. AttendanceRecord Entity

**Archivo:** `apps/backend/src/modules/attendance/entities/attendance-record.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Employee } from '../../hr/employees/entities/employee.entity';
import { Project } from '../../projects/entities/project.entity';

export enum AttendanceType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
}

export enum CaptureMethod {
  QR = 'qr',
  BIOMETRIC = 'biometric',
  MANUAL = 'manual',
  GPS = 'gps',
}

@Entity('attendance_records', { schema: 'attendance' })
@Index(['employeeId', 'workDate'])
@Index(['workId', 'workDate'])
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'uuid' })
  workId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'workId' })
  work: Project;

  @Column({ type: 'date' })
  workDate: Date;

  @Column({
    type: 'enum',
    enum: AttendanceType,
  })
  type: AttendanceType;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  // Método de captura
  @Column({
    type: 'enum',
    enum: CaptureMethod,
  })
  captureMethod: CaptureMethod;

  // Datos biométricos
  @Column({ type: 'jsonb', nullable: true })
  biometricData: {
    confidence: number; // 0-100
    template: string; // Hash del template biométrico
  };

  // Datos de ubicación (GPS)
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  distanceFromWork: number; // Metros

  // Foto del empleado (selfie)
  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  // QR code escaneado
  @Column({ type: 'text', nullable: true })
  qrCodeScanned: string;

  // Notas opcionales
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Validaciones
  @Column({ type: 'boolean', default: false })
  isValidated: boolean;

  @Column({ type: 'boolean', default: false })
  hasWarnings: boolean;

  @Column({ type: 'jsonb', default: [] })
  warnings: string[];

  // Dispositivo que registró
  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  deviceModel: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  appVersion: string;

  // Usuario que registró (residente)
  @Column({ type: 'uuid' })
  registeredBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

### 2. AttendanceService

**Archivo:** `apps/backend/src/modules/attendance/attendance.service.ts`

```typescript
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord, AttendanceType, CaptureMethod } from './entities/attendance-record.entity';
import { Employee } from '../hr/employees/entities/employee.entity';
import { Project } from '../projects/entities/project.entity';

interface CheckInDto {
  employeeId: string;
  workId: string;
  captureMethod: CaptureMethod;
  latitude?: number;
  longitude?: number;
  biometricData?: { confidence: number; template: string };
  photoUrl?: string;
  qrCodeScanned?: string;
  notes?: string;
  deviceId?: string;
  deviceModel?: string;
  appVersion?: string;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  /**
   * Registrar check-in
   */
  async checkIn(dto: CheckInDto, registeredBy: string): Promise<AttendanceRecord> {
    // Validar empleado existe y está activo
    const employee = await this.employeeRepo.findOne({
      where: { id: dto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    if (employee.status !== 'active') {
      throw new BadRequestException(
        `Empleado está ${employee.status}. No puede registrar asistencia.`,
      );
    }

    // Validar obra existe y está activa
    const work = await this.projectRepo.findOne({
      where: { id: dto.workId },
    });

    if (!work) {
      throw new NotFoundException('Obra no encontrada');
    }

    // Validar que no haya check-in duplicado hoy
    const today = new Date().toISOString().split('T')[0];
    const existingCheckIn = await this.attendanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        workDate: new Date(today),
        type: AttendanceType.CHECK_IN,
      },
    });

    if (existingCheckIn) {
      throw new BadRequestException(
        'Ya existe un check-in para este empleado el día de hoy',
      );
    }

    // Validaciones GPS
    const warnings: string[] = [];
    let distanceFromWork: number | null = null;

    if (dto.latitude && dto.longitude && work.latitude && work.longitude) {
      distanceFromWork = this.calculateDistance(
        dto.latitude,
        dto.longitude,
        work.latitude,
        work.longitude,
      );

      // Advertencia si está fuera del radio (100m)
      if (distanceFromWork > 100) {
        warnings.push(
          `Empleado registró a ${distanceFromWork.toFixed(0)}m de la obra (límite: 100m)`,
        );
      }
    }

    // Validación biométrica
    if (dto.biometricData && dto.biometricData.confidence < 70) {
      warnings.push(
        `Confianza biométrica baja: ${dto.biometricData.confidence}% (mínimo: 70%)`,
      );
    }

    // Crear registro
    const record = this.attendanceRepo.create({
      ...dto,
      workDate: new Date(today),
      type: AttendanceType.CHECK_IN,
      timestamp: new Date(),
      distanceFromWork,
      warnings,
      hasWarnings: warnings.length > 0,
      isValidated: warnings.length === 0, // Auto-aprobar si no hay warnings
      registeredBy,
    });

    return await this.attendanceRepo.save(record);
  }

  /**
   * Registrar check-out
   */
  async checkOut(dto: CheckInDto, registeredBy: string): Promise<AttendanceRecord> {
    // Validar que exista check-in previo
    const today = new Date().toISOString().split('T')[0];
    const checkIn = await this.attendanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        workDate: new Date(today),
        type: AttendanceType.CHECK_IN,
      },
    });

    if (!checkIn) {
      throw new BadRequestException(
        'No existe un check-in previo para este empleado el día de hoy',
      );
    }

    // Validar que no haya check-out duplicado
    const existingCheckOut = await this.attendanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        workDate: new Date(today),
        type: AttendanceType.CHECK_OUT,
      },
    });

    if (existingCheckOut) {
      throw new BadRequestException('Ya existe un check-out para este empleado el día de hoy');
    }

    // Calcular horas trabajadas
    const hoursWorked = this.calculateHours(checkIn.timestamp, new Date());
    const warnings: string[] = [];

    if (hoursWorked < 4) {
      warnings.push(`Horas trabajadas < 4 (${hoursWorked.toFixed(1)}h)`);
    }

    // Crear check-out
    const record = this.attendanceRepo.create({
      ...dto,
      workDate: new Date(today),
      type: AttendanceType.CHECK_OUT,
      timestamp: new Date(),
      warnings,
      hasWarnings: warnings.length > 0,
      registeredBy,
    });

    return await this.attendanceRepo.save(record);
  }

  /**
   * Obtener empleados de una obra para lista
   */
  async getWorkEmployees(workId: string): Promise<Employee[]> {
    // Obtener empleados asignados a la obra que están activos
    const employees = await this.employeeRepo
      .createQueryBuilder('employee')
      .innerJoin('hr.employee_work_assignments', 'assignment', 'assignment.employee_id = employee.id')
      .where('assignment.work_id = :workId', { workId })
      .andWhere('assignment.end_date IS NULL')
      .andWhere('employee.status = :status', { status: 'active' })
      .orderBy('employee.last_name', 'ASC')
      .getMany();

    return employees;
  }

  /**
   * Sincronizar registros offline
   */
  async syncOfflineRecords(
    records: CheckInDto[],
    registeredBy: string,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const record of records) {
      try {
        if (record.type === AttendanceType.CHECK_IN) {
          await this.checkIn(record, registeredBy);
        } else {
          await this.checkOut(record, registeredBy);
        }
        success++;
      } catch (error) {
        failed++;
        errors.push(`${record.employeeId}: ${error.message}`);
      }
    }

    return { success, failed, errors };
  }

  /**
   * Calcular distancia entre dos puntos GPS (fórmula de Haversine)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
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
   * Calcular horas trabajadas
   */
  private calculateHours(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return diff / (1000 * 60 * 60); // Convertir a horas
  }
}
```

---

## 📱 Implementación App Móvil

### 1. Dependencias (package.json)

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-camera": "~14.0.0",
    "expo-location": "~16.0.0",
    "expo-sqlite": "~13.0.0",
    "react-native-biometrics": "^3.0.1",
    "react-native-qrcode-scanner": "^1.5.5",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "axios": "^1.6.2",
    "zustand": "^4.4.7"
  }
}
```

---

### 2. QR Scanner Screen

**Archivo:** `apps/mobile/src/features/attendance/screens/QRScannerScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useAttendanceService } from '../services/attendance.service';

export function QRScannerScreen({ navigation, route }) {
  const { workId } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const attendanceService = useAttendanceService();

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    try {
      // Decodificar QR (contiene employee ID)
      const employeeId = decodeQRCode(data);

      // Obtener ubicación actual
      const location = await getLocation();

      // Registrar check-in
      await attendanceService.checkIn({
        employeeId,
        workId,
        captureMethod: 'qr',
        qrCodeScanned: data,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      Alert.alert(
        'Check-in Exitoso',
        'Asistencia registrada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', error.message);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No hay acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.frame} />
        <Text style={styles.instruction}>
          Escanea el QR del empleado
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  instruction: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

### 3. Biometric Capture Screen

**Archivo:** `apps/mobile/src/features/attendance/screens/BiometricCaptureScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useAttendanceService } from '../services/attendance.service';

const rnBiometrics = new ReactNativeBiometrics();

export function BiometricCaptureScreen({ navigation, route }) {
  const { employee, workId } = route.params;
  const [isScanning, setIsScanning] = useState(false);
  const attendanceService = useAttendanceService();

  const handleBiometricScan = async () => {
    setIsScanning(true);

    try {
      // Verificar si el dispositivo soporta biométrico
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        throw new Error('Dispositivo no soporta biométrico');
      }

      // Solicitar biométrico
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Coloca tu huella para confirmar asistencia',
        payload: employee.id,
      });

      if (!success) {
        throw new Error('Biométrico no reconocido');
      }

      // Verificar contra template almacenado (simulado)
      const confidence = await verifyBiometric(signature, employee.biometricTemplate);

      // Obtener ubicación
      const location = await getLocation();

      // Registrar check-in
      await attendanceService.checkIn({
        employeeId: employee.id,
        workId,
        captureMethod: 'biometric',
        biometricData: {
          confidence,
          template: signature,
        },
        latitude: location.latitude,
        longitude: location.longitude,
      });

      Alert.alert(
        'Check-in Exitoso',
        `Asistencia registrada. Confianza: ${confidence}%`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        {employee.fullName}
      </Text>
      <Text style={{ marginBottom: 40 }}>
        {employee.primaryTrade}
      </Text>

      <Button
        title={isScanning ? 'Escaneando...' : 'Capturar Huella'}
        onPress={handleBiometricScan}
        disabled={isScanning}
      />
    </View>
  );
}

// Función simulada de verificación biométrica
async function verifyBiometric(signature: string, template: string): Promise<number> {
  // En producción, esto llamaría a un servicio de matching biométrico
  // Por ahora, retornamos un valor simulado
  return Math.floor(Math.random() * 30) + 70; // 70-100%
}
```

---

### 4. Offline Database (SQLite)

**Archivo:** `apps/mobile/src/features/attendance/db/schema.ts`

```typescript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('attendance.db');

export const initDatabase = () => {
  db.transaction((tx) => {
    // Tabla de cola de sincronización
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL,
        work_id TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        capture_method TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        biometric_data TEXT,
        photo_url TEXT,
        qr_code_scanned TEXT,
        notes TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
    );

    // Cache de empleados
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS employees_cache (
        id TEXT PRIMARY KEY,
        employee_code TEXT,
        full_name TEXT,
        primary_trade TEXT,
        photo_url TEXT,
        qr_code TEXT,
        biometric_template TEXT,
        work_id TEXT,
        updated_at TEXT
      )`,
    );
  });
};

export const addToSyncQueue = (record) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO sync_queue (
          employee_id, work_id, type, timestamp, capture_method,
          latitude, longitude, biometric_data, photo_url,
          qr_code_scanned, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.employeeId,
          record.workId,
          record.type,
          record.timestamp,
          record.captureMethod,
          record.latitude,
          record.longitude,
          JSON.stringify(record.biometricData),
          record.photoUrl,
          record.qrCodeScanned,
          record.notes,
        ],
        (_, result) => resolve(result),
        (_, error) => reject(error),
      );
    });
  });
};

export const getPendingSyncRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM sync_queue WHERE synced = 0 ORDER BY created_at ASC',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error),
      );
    });
  });
};

export const markRecordAsSynced = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE sync_queue SET synced = 1 WHERE id = ?',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error),
      );
    });
  });
};
```

---

### 5. Sync Service

**Archivo:** `apps/mobile/src/features/attendance/services/sync.service.ts`

```typescript
import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { apiClient } from '@/api/client';
import {
  getPendingSyncRecords,
  markRecordAsSynced,
} from '../db/schema';

export function useSyncService() {
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listener de cambio de conectividad
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncPendingRecords();
      }
    });

    // Sync cada 5 minutos
    syncIntervalRef.current = setInterval(() => {
      syncPendingRecords();
    }, 5 * 60 * 1000);

    return () => {
      unsubscribe();
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  const syncPendingRecords = async () => {
    try {
      const records = await getPendingSyncRecords();

      if (records.length === 0) {
        return;
      }

      console.log(`Sincronizando ${records.length} registros...`);

      const response = await apiClient.post('/attendance/sync-offline', {
        records: records.map((r) => ({
          employeeId: r.employee_id,
          workId: r.work_id,
          type: r.type,
          timestamp: r.timestamp,
          captureMethod: r.capture_method,
          latitude: r.latitude,
          longitude: r.longitude,
          biometricData: r.biometric_data ? JSON.parse(r.biometric_data) : null,
          photoUrl: r.photo_url,
          qrCodeScanned: r.qr_code_scanned,
          notes: r.notes,
        })),
      });

      // Marcar como sincronizados
      for (const record of records) {
        await markRecordAsSynced(record.id);
      }

      console.log(`✅ Sincronizados ${response.data.success} registros`);
    } catch (error) {
      console.error('Error sincronizando:', error);
    }
  };

  return {
    syncNow: syncPendingRecords,
  };
}
```

---

## 🧪 Tests

```typescript
describe('AttendanceService', () => {
  it('should register check-in with QR', async () => {
    const dto = {
      employeeId: 'employee-id',
      workId: 'work-id',
      captureMethod: CaptureMethod.QR,
      qrCodeScanned: 'QR-DATA-123',
      latitude: 19.4326,
      longitude: -99.1332,
    };

    const record = await service.checkIn(dto, 'user-id');

    expect(record.type).toBe(AttendanceType.CHECK_IN);
    expect(record.captureMethod).toBe(CaptureMethod.QR);
    expect(record.distanceFromWork).toBeLessThan(100);
  });

  it('should reject duplicate check-in', async () => {
    // ... registrar check-in
    await expect(service.checkIn(dto, 'user-id')).rejects.toThrow(
      'Ya existe un check-in',
    );
  });

  it('should calculate GPS distance correctly', () => {
    const distance = service['calculateDistance'](
      19.4326, -99.1332, // CDMX
      19.4340, -99.1350, // ~170m de distancia
    );
    expect(distance).toBeGreaterThan(150);
    expect(distance).toBeLessThan(200);
  });
});
```

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
